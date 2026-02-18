import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT 
        p.id,
        p.property_id AS "propertyId",
        p.amount,
        p.payment_date AS "paymentDate",
        p.month_covered AS "monthCovered",
        p.method,
        p.notes,
        p.created_at AS "createdAt",
        pr.tenant_name AS "tenantName",
        pr.moughataa
      FROM payments p
      LEFT JOIN properties pr ON p.property_id = pr.id
      ORDER BY p.created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error("GET /api/payments error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    const body = await request.json();
    const { id, propertyId, amount, paymentDate, monthCovered, method, notes } = body;

    await sql`
      INSERT INTO payments (id, property_id, amount, payment_date, month_covered, method, notes)
      VALUES (${id}, ${propertyId}, ${amount}, ${paymentDate}, ${monthCovered}, ${method || "cash"}, ${notes || ""})
    `;

    // Log activity
    await sql`
      INSERT INTO activity_log (id, property_id, action_type, description)
      VALUES (${crypto.randomUUID()}, ${propertyId}, 'payment', ${"تم تسجيل دفعة بمبلغ " + amount + " أوقية"})
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/payments error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
