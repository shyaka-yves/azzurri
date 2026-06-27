import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

function resolvePdfUrl(pdfUrl: string, origin: string): string {
  if (pdfUrl.startsWith("/")) {
    return `${origin}${pdfUrl}`;
  }
  return pdfUrl;
}

function parseCloudinaryPdfUrl(
  pdfUrl: string
): { publicId: string; resourceType: "image" | "raw" } | null {
  const match = pdfUrl.match(
    /res\.cloudinary\.com\/[^/]+\/(image|raw)\/upload\/(?:v\d+\/)?(.+)\.pdf(?:\?.*)?$/i
  );

  if (!match) return null;

  return {
    resourceType: match[1].toLowerCase() as "image" | "raw",
    publicId: decodeURIComponent(match[2]),
  };
}

function isPdfBuffer(buffer: Buffer): boolean {
  return buffer.length >= 5 && buffer.subarray(0, 5).equals(Buffer.from("%PDF-"));
}

async function downloadCloudinaryPdf(
  publicId: string,
  resourceType: "image" | "raw"
): Promise<Buffer | null> {
  const downloadUrl = cloudinary.utils.private_download_url(publicId, "pdf", {
    resource_type: resourceType,
    type: "upload",
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  });

  const res = await fetch(downloadUrl);
  if (!res.ok) {
    console.error(
      "Cloudinary private download failed:",
      res.status,
      publicId,
      resourceType
    );
    return null;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  return isPdfBuffer(buffer) ? buffer : null;
}

async function downloadCloudinaryPdfFromArchive(
  publicId: string,
  resourceType: "image" | "raw"
): Promise<Buffer | null> {
  const archiveUrl = cloudinary.utils.download_zip_url({
    public_ids: [publicId],
    resource_type: resourceType,
    flatten_folders: true,
  });

  const archiveRes = await fetch(archiveUrl);
  if (!archiveRes.ok) {
    console.error(
      "Cloudinary archive download failed:",
      archiveRes.status,
      publicId,
      resourceType
    );
    return null;
  }

  const zip = await JSZip.loadAsync(await archiveRes.arrayBuffer());
  const pdfEntry = Object.values(zip.files).find(
    (file) => !file.dir && file.name.toLowerCase().endsWith(".pdf")
  );

  if (!pdfEntry) {
    console.error("No PDF entry found in Cloudinary archive:", publicId);
    return null;
  }

  const buffer = Buffer.from(await pdfEntry.async("nodebuffer"));
  return isPdfBuffer(buffer) ? buffer : null;
}

async function fetchCloudinaryPdf(
  publicId: string,
  resourceType: "image" | "raw"
): Promise<Buffer | null> {
  const direct = await downloadCloudinaryPdf(publicId, resourceType);
  if (direct) return direct;

  return downloadCloudinaryPdfFromArchive(publicId, resourceType);
}

function pdfResponse(body: Buffer): NextResponse {
  return new NextResponse(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(body.length),
      "Content-Disposition": "inline",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  const pdfUrl = resolvePdfUrl(rawUrl, req.nextUrl.origin);

  try {
    if (pdfUrl.includes("res.cloudinary.com")) {
      const parsed = parseCloudinaryPdfUrl(pdfUrl);
      if (!parsed) {
        return NextResponse.json(
          { error: "Could not parse Cloudinary URL" },
          { status: 400 }
        );
      }

      let pdfBytes = await fetchCloudinaryPdf(
        parsed.publicId,
        parsed.resourceType
      );

      if (!pdfBytes && parsed.resourceType === "image") {
        pdfBytes = await fetchCloudinaryPdf(parsed.publicId, "raw");
      }

      if (!pdfBytes) {
        return NextResponse.json(
          { error: "Failed to fetch PDF from storage" },
          { status: 502 }
        );
      }

      return pdfResponse(pdfBytes);
    }

    const upstream = await fetch(pdfUrl);
    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Upstream fetch failed" },
        { status: upstream.status }
      );
    }

    const body = Buffer.from(await upstream.arrayBuffer());
    return pdfResponse(body);
  } catch (err) {
    console.error("menu-pdf proxy error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
