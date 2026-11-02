import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { verifyAdminToken } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  if (!verifyAdminToken(auth.replace(/^Bearer\s+/i, ""))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const resourceType = body.resourceType === "video" ? "video" : body.resourceType === "image" ? "image" : null;
  if (!resourceType) {
    return NextResponse.json({ error: "Unsupported upload type." }, { status: 400 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary uploads are not configured." }, { status: 503 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "portfolio";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature, resourceType });
}
