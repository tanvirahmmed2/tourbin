import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });

    const [revenueRes, tenantRes] = await Promise.all([
        query("SELECT DATE(created_at) as date, SUM(amount) as revenue FROM ts_subscription_payments WHERE status = 'success' GROUP BY DATE(created_at) ORDER BY date ASC LIMIT 30"),
        query("SELECT DATE(created_at) as date, COUNT(*) as new_tenants FROM ts_tenants GROUP BY DATE(created_at) ORDER BY date ASC LIMIT 30")
    ]);

    return NextResponse.json({ success: true, data: { 
        revenueChart: revenueRes.rows,
        tenantChart: tenantRes.rows
    }});
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
