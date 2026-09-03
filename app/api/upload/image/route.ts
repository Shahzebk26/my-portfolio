import { NextResponse } from "next/server";
import { createHash } from "crypto";
import fs from "fs/promises";
import path from "path";

const uploadDirectory = path.join(process.cwd(), "public", "uploads");

function sanitizeFilename(filename: string) {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image") as File | null;

  if (!file || typeof file.arrayBuffer !== "function") {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are allowed." }, { status: 400 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "portfolio";
    const signature = createHash("sha1")
      .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");
    const cloudForm = new FormData();
    cloudForm.append("file", file);
    cloudForm.append("api_key", apiKey);
    cloudForm.append("timestamp", String(timestamp));
    cloudForm.append("folder", folder);
    cloudForm.append("signature", signature);

    const cloudResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: cloudForm,
    });
    const cloudData = await cloudResponse.json();
    if (!cloudResponse.ok || !cloudData.secure_url) {
      return NextResponse.json({ error: "Cloudinary image upload failed." }, { status: 502 });
    }

    return NextResponse.json({ path: cloudData.secure_url });
  }

  await fs.mkdir(uploadDirectory, { recursive: true });

  const originalName = file.name || "upload.jpg";
  const safeName = sanitizeFilename(originalName);
  const uniqueName = `${Date.now()}-${safeName}`;
  const filePath = path.join(uploadDirectory, uniqueName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(filePath, buffer);

  // Runtime-written files are not guaranteed to be available as static
  // assets on a deployed/serverless host. Keep a portable copy in the value
  // saved with the project as well as the local development file.
  const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

  return NextResponse.json({ path: `/uploads/${uniqueName}`, dataUrl });
}
