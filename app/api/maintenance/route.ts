import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT 
        m.id,
        m.property_id AS "propertyId",
        m.title,
        m.description,
        m.priority,
        m.status,
        m.estimated_cost AS "estimatedCost",
        m.actual_cost AS "actualCost",
        m.created_at AS "createdAt",
        m.resolved_at AS "resolvedAt",
        pr.tenant_name AS "tenantName",
        pr.moughataa
      FROM maintenance_requests m
      LEFT JOIN properties pr ON m.property_id = pr.id
      ORDER BY m.created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error("GET /api/maintenance error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    const body = await request.json();
    const { id, propertyId, title, description, priority, estimatedCost } = body;

    await sql`
      INSERT INTO maintenance_requests (id, property_id, title, description, priority, estimated_cost)
      VALUES (${id}, ${propertyId}, ${title}, ${description || ""}, ${priority || "medium"}, ${estimatedCost || 0})
    `;

    await sql`
      INSERT INTO activity_log (id, property_id, action_type, description)
      VALUES (${crypto.randomUUID()}, ${propertyId}, 'maintenance', ${"طلب صيانة جديد: " + title})
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/maintenance error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
