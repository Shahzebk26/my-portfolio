import { NextResponse } from "next/server";
import { databaseEnabled, dbQuery } from "../../../lib/database";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!databaseEnabled) {
    return NextResponse.json({ ok: false, database: "not_configured" }, { status: 503 });
  }

  try {
    await dbQuery("SELECT 1");
    return NextResponse.json({ ok: true, database: "connected" });
  } catch (error) {
    // Keep connection details and credentials out of the public response.
    console.error("Database health check failed.", error);
    return NextResponse.json({ ok: false, database: "unavailable" }, { status: 503 });
  }
}
