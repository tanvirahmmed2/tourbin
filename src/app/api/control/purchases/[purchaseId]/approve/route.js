import { NextResponse } from 'next/server';
import { query, withTransaction } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function POST(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });

    const { purchaseId } = params;

    const res = await query("SELECT * FROM ts_purchases WHERE purchase_id = $1", [purchaseId]);
    if (res.rows.length === 0) return NextResponse.json({ success: false, message: 'Purchase not found' }, { status: 404 });
    const purchase = res.rows[0];

    if (purchase.status === 'paid') return NextResponse.json({ success: false, message: 'Already approved' }, { status: 400 });

    const meta = purchase.metadata || {};
    
    await withTransaction(async (client) => {
      // 1. Mark purchase as paid
      await client.query("UPDATE ts_purchases SET status = 'paid' WHERE purchase_id = $1", [purchaseId]);

      // 2. Create Tenant
      const tenantRes = await client.query(
        "INSERT INTO ts_tenants (name, slug, status) VALUES ($1, $2, 'active') RETURNING *",
        [meta.companyName || 'New Tenant', meta.subdomain]
      );
      const newTenant = tenantRes.rows[0];

      // 3. Create Subscription
      const subRes = await client.query(
        "INSERT INTO ts_subscriptions (tenant_id, package_id, status, start_date) VALUES ($1, $2, 'active', NOW()) RETURNING *",
        [newTenant.tenant_id, purchase.package_id]
      );
      
      // 4. Create Initial Subscription Payment Record
      await client.query(
        "INSERT INTO ts_subscription_payments (subscription_id, amount, provider, status, paid_at) VALUES ($1, $2, 'manual', 'success', NOW())",
        [subRes.rows[0].subscription_id, purchase.amount]
      );
    });

    return NextResponse.json({ success: true, message: 'Approved successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
