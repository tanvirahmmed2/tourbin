import { isCustomer } from '@/lib/middleware';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';

export default async function CustomerBillingPage() {
  const auth = await isCustomer();
  if (!auth.success) redirect('/login');
  const session = auth.data;

  const billingRes = await query(`
    SELECT p.payment_id, p.amount, p.status, p.created_at, p.provider,
           t.name AS tenant_name,
           pkg.name AS package_name
    FROM ts_subscription_payments p
    JOIN ts_subscriptions s ON s.subscription_id = p.subscription_id
    JOIN ts_tenants t ON t.tenant_id = s.tenant_id
    JOIN ts_purchases pur ON pur.tenant_id = t.tenant_id
    JOIN ts_packages pkg ON pkg.package_id = s.package_id
    WHERE pur.user_id = $1
    ORDER BY p.created_at DESC
  `, [session.user_id]);

  const payments = billingRes.rows;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-text">Billing & Subscriptions</h1>
        <p className="text-text-3 text-sm mt-1">View your payment history and active plans</p>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-text">Payment History</h2>
        </div>
        
        {payments.length === 0 ? (
          <div className="p-12 text-center text-text-3 font-medium">
            No payment history found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase tracking-wider text-text-3 font-bold">
                  <th className="p-4 border-b border-slate-100">Date</th>
                  <th className="p-4 border-b border-slate-100">Workspace</th>
                  <th className="p-4 border-b border-slate-100">Plan</th>
                  <th className="p-4 border-b border-slate-100">Amount</th>
                  <th className="p-4 border-b border-slate-100">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-text-2">
                {payments.map(payment => (
                  <tr key={payment.payment_id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 border-b border-slate-50">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 border-b border-slate-50 text-text font-bold">
                      {payment.tenant_name}
                    </td>
                    <td className="p-4 border-b border-slate-50">
                      {payment.package_name}
                    </td>
                    <td className="p-4 border-b border-slate-50 font-bold">
                      ${parseFloat(payment.amount).toFixed(2)}
                    </td>
                    <td className="p-4 border-b border-slate-50">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider
                        ${payment.status === 'paid' || payment.status === 'success' ? 'bg-green-100 text-green-700' : 
                          payment.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
