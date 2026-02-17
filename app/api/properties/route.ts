import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT 
        id,
        wilaya,
        moughataa,
        neighborhood,
        house_number AS "houseNumber",
        rooms_count AS "roomsCount",
        type,
        accessories,
        owner_name AS "ownerName",
        owner_phone AS "ownerPhone",
        owner_id AS "ownerId",
        tenant_name AS "tenantName",
        tenant_phone AS "tenantPhone",
        tenant_id AS "tenantId",
        contract_date AS "contractDate",
        contract_type AS "contractType",
        monthly_rent AS "monthlyRent",
        payment_system AS "paymentSystem",
        arrears,
        snde_status AS "sndeStatus",
        somelec_status AS "somelecStatus"
      FROM properties
      ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error("GET /api/properties error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    const body = await request.json();

    const {
      id,
      wilaya,
      moughataa,
      neighborhood,
      houseNumber,
      roomsCount,
      type,
      accessories,
      ownerName,
      ownerPhone,
      ownerId,
      tenantName,
      tenantPhone,
      tenantId,
      contractDate,
      contractType,
      monthlyRent,
      paymentSystem,
      arrears,
      sndeStatus,
      somelecStatus,
    } = body;

    await sql`
      INSERT INTO properties (
        id, wilaya, moughataa, neighborhood, house_number,
        rooms_count, type, accessories, owner_name, owner_phone,
        owner_id, tenant_name, tenant_phone, tenant_id,
        contract_date, contract_type, monthly_rent, payment_system,
        arrears, snde_status, somelec_status
      ) VALUES (
        ${id}, ${wilaya}, ${moughataa}, ${neighborhood}, ${houseNumber},
        ${roomsCount}, ${type}, ${accessories || ""}, ${ownerName}, ${ownerPhone},
        ${ownerId}, ${tenantName}, ${tenantPhone}, ${tenantId},
        ${contractDate}, ${contractType}, ${monthlyRent}, ${paymentSystem},
        ${arrears || 0}, ${sndeStatus ?? true}, ${somelecStatus ?? true}
      )
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/properties error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
