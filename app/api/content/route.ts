import { NextResponse } from "next/server";
import { readContent, updateContent } from "../../../lib/content-storage";
import { verifyAdminToken } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await readContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  if (!verifyAdminToken(auth.replace("Bearer ", ""))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const content = await updateContent(body);
  return NextResponse.json({ content });
}
