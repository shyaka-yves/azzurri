const COOKIE_NAME = "lc_admin";

function getSecret() {
  return process.env.ADMIN_SECRET ?? "dev-secret-change-me";
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}

async function hmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomHex(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signAdminToken(payload: string): Promise<string> {
  const secret = getSecret();
  const signature = await hmacSha256(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifyAdminToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const secret = getSecret();
  const expected = await hmacSha256(payload, secret);

  if (sig.length !== expected.length) return false;

  let match = 0;
  for (let i = 0; i < sig.length; i++) {
    match |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return match === 0;
}

export async function issueAdminToken(): Promise<string> {
  const payload = JSON.stringify({
    v: 1,
    t: Date.now(),
    n: randomHex(16),
  });
  return signAdminToken(payload);
}

