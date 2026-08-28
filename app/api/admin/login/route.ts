import { NextResponse } from "next/server";
import { createAdminToken, validateAdminPassword } from "../../../../lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  if (!validateAdminPassword(String(body.password))) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  return NextResponse.json({ token: createAdminToken() });
}
