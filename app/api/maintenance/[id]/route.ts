import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = getDb();
    const body = await request.json();
    const { status, actualCost } = body;

    if (status === "completed") {
      await sql`
        UPDATE maintenance_requests 
        SET status = ${status}, actual_cost = ${actualCost || 0}, resolved_at = NOW()
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE maintenance_requests SET status = ${status} WHERE id = ${id}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("PATCH /api/maintenance/[id] error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
