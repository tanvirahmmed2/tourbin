import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isOwner } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isOwner();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });

    const [statsRes, listRes] = await Promise.all([
      query("SELECT COALESCE(SUM(amount), 0) AS total_revenue FROM ts_subscription_payments WHERE status = 'success'"),
      query(`
        SELECT p.payment_id, p.amount, p.status, p.created_at, p.provider,
               t.name AS tenant_name, pkg.name AS package_name
        FROM ts_subscription_payments p
        JOIN ts_subscriptions s ON s.subscription_id = p.subscription_id
        JOIN ts_tenants t ON t.tenant_id = s.tenant_id
        JOIN ts_packages pkg ON pkg.package_id = s.package_id
        ORDER BY p.created_at DESC
      `)
    ]);

    return NextResponse.json({ success: true, data: {
      totalRevenue: parseFloat(statsRes.rows[0].total_revenue),
      payments: listRes.rows
    }});
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
