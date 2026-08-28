import { NextResponse } from "next/server";
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

  await fs.mkdir(uploadDirectory, { recursive: true });

  const originalName = file.name || "upload.jpg";
  const safeName = sanitizeFilename(originalName);
  const uniqueName = `${Date.now()}-${safeName}`;
  const filePath = path.join(uploadDirectory, uniqueName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(filePath, buffer);

  return NextResponse.json({ path: `/uploads/${uniqueName}` });
}
