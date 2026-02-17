import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = getDb();
    await sql`DELETE FROM properties WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("DELETE /api/properties/[id] error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
