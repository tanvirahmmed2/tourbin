import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isOwner } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isOwner();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });

    const res = await query(`
      SELECT s.*, t.name as tenant_name, t.slug as tenant_slug, p.name as package_name
      FROM ts_subscriptions s
      JOIN ts_tenants t ON t.tenant_id = s.tenant_id
      JOIN ts_packages p ON p.package_id = s.package_id
      ORDER BY s.created_at DESC
    `);
    return NextResponse.json({ success: true, data: { subscriptions: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
