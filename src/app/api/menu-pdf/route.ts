import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

/**
 * Proxy endpoint that serves PDFs stored on Cloudinary.
 * Cloudinary free accounts block direct PDF delivery, so we download
 * the file server-side via the generate_archive API (as a ZIP containing
 * the single PDF) then extract and stream it back to the browser.
 *
 * Usage: /api/menu-pdf?url=<cloudinary-pdf-url>
 *
 * For non-Cloudinary URLs the request is proxied directly.
 */
function resolvePdfUrl(pdfUrl: string, origin: string): string {
  if (pdfUrl.startsWith("/")) {
    return `${origin}${pdfUrl}`;
  }
  return pdfUrl;
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  const pdfUrl = resolvePdfUrl(rawUrl, req.nextUrl.origin);

  try {
    /* ---- Cloudinary path ---- */
    if (pdfUrl.includes("res.cloudinary.com")) {
      // Extract public_id from the Cloudinary URL
      // URL format: https://res.cloudinary.com/<cloud>/(image|raw)/upload/v<ver>/<public_id>.pdf
      const match = pdfUrl.match(
        /res\.cloudinary\.com\/[^/]+\/(?:image|raw)\/upload\/(?:v\d+\/)?(.+)\.pdf(?:\?.*)?$/i
      );

      if (!match) {
        return NextResponse.json(
          { error: "Could not parse Cloudinary URL" },
          { status: 400 }
        );
      }

      const publicId = decodeURIComponent(match[1]);

      // Use generate_archive (ZIP) to download – only method that bypasses
      // the "deny PDF delivery" ACL on free Cloudinary accounts.
      const archiveUrl = cloudinary.utils.download_zip_url({
        public_ids: [publicId],
        resource_type: "image",
        flatten_folders: true,
      });

      const archiveRes = await fetch(archiveUrl);
      if (!archiveRes.ok) {
        console.error("Cloudinary archive download failed:", archiveRes.status);
        return NextResponse.json(
          { error: "Failed to fetch PDF from storage" },
          { status: 502 }
        );
      }

      const zipBuffer = Buffer.from(await archiveRes.arrayBuffer());

      // A ZIP's local file entries follow a known binary layout.
      // We look for the embedded PDF by scanning for the %PDF- magic bytes.
      const pdfMagic = Buffer.from("%PDF-");
      const pdfStart = zipBuffer.indexOf(pdfMagic);
      if (pdfStart === -1) {
        return NextResponse.json(
          { error: "PDF not found inside archive" },
          { status: 502 }
        );
      }

      // The ZIP End-of-Central-Directory signature marks the end of actual file
      // data (approximately). We'll find the PDF's end by looking for the next
      // PK signature after our PDF data, or the EOCD record.
      // Simpler: find "%%EOF" which marks the end of a PDF.
      const pdfEofMarker = Buffer.from("%%EOF");
      let pdfEnd = zipBuffer.indexOf(pdfEofMarker, pdfStart);
      if (pdfEnd !== -1) {
        pdfEnd += pdfEofMarker.length;
        // There may be trailing whitespace/newline after %%EOF
        while (pdfEnd < zipBuffer.length && (zipBuffer[pdfEnd] === 0x0a || zipBuffer[pdfEnd] === 0x0d)) {
          pdfEnd++;
        }
      } else {
        // Fallback: look for PK signature (next zip entry) after pdfStart
        const pkSig = Buffer.from([0x50, 0x4b]);
        let searchPos = pdfStart + 5;
        pdfEnd = zipBuffer.length; // default to rest of buffer
        while (searchPos < zipBuffer.length - 1) {
          const idx = zipBuffer.indexOf(pkSig, searchPos);
          if (idx === -1) break;
          // Verify it's a PK entry (0x50 0x4b 0x01 0x02 or 0x50 0x4b 0x03 0x04)
          if (
            (zipBuffer[idx + 2] === 0x01 && zipBuffer[idx + 3] === 0x02) ||
            (zipBuffer[idx + 2] === 0x03 && zipBuffer[idx + 3] === 0x04)
          ) {
            pdfEnd = idx;
            break;
          }
          searchPos = idx + 1;
        }
      }

      const pdfBytes = zipBuffer.subarray(pdfStart, pdfEnd);

      return new NextResponse(pdfBytes, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Length": String(pdfBytes.length),
          "Content-Disposition": "inline",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    }

    /* ---- Non-Cloudinary: simple proxy ---- */
    const upstream = await fetch(pdfUrl);
    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Upstream fetch failed" },
        { status: upstream.status }
      );
    }

    const body = await upstream.arrayBuffer();
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(body.byteLength),
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err) {
    console.error("menu-pdf proxy error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
