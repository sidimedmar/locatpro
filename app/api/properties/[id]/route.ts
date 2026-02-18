import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = getDb();

    await sql`
      INSERT INTO activity_log (id, property_id, action_type, description)
      VALUES (${crypto.randomUUID()}, ${id}, 'delete', ${"تم حذف عقار"})
    `;

    await sql`DELETE FROM payments WHERE property_id = ${id}`;
    await sql`DELETE FROM maintenance_requests WHERE property_id = ${id}`;
    await sql`DELETE FROM properties WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("DELETE /api/properties/[id] error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = getDb();
    const body = await request.json();

    const {
      wilaya, moughataa, neighborhood, houseNumber,
      roomsCount, type, accessories, ownerName, ownerPhone, ownerId,
      tenantName, tenantPhone, tenantId, contractDate, contractType,
      monthlyRent, paymentSystem, arrears, sndeStatus, somelecStatus, notes, status,
    } = body;

    await sql`
      UPDATE properties SET
        wilaya = ${wilaya}, moughataa = ${moughataa}, neighborhood = ${neighborhood},
        house_number = ${houseNumber}, rooms_count = ${roomsCount}, type = ${type},
        accessories = ${accessories || ""}, owner_name = ${ownerName}, owner_phone = ${ownerPhone},
        owner_id = ${ownerId}, tenant_name = ${tenantName}, tenant_phone = ${tenantPhone},
        tenant_id = ${tenantId}, contract_date = ${contractDate}, contract_type = ${contractType},
        monthly_rent = ${monthlyRent}, payment_system = ${paymentSystem},
        arrears = ${arrears || 0}, snde_status = ${sndeStatus ?? true},
        somelec_status = ${somelecStatus ?? true}, notes = ${notes || ""}, status = ${status || "active"}
      WHERE id = ${id}
    `;

    await sql`
      INSERT INTO activity_log (id, property_id, action_type, description)
      VALUES (${crypto.randomUUID()}, ${id}, 'update', ${"تم تحديث بيانات العقار"})
    `;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("PUT /api/properties/[id] error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
