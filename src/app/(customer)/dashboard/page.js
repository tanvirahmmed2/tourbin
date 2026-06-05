import { BASE_DOMAIN, BASE_URL } from '@/lib/secret';
import { isCustomer } from '@/lib/middleware';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import Link from 'next/link';

export default async function CustomerDashboardPage() {
  const auth = await isCustomer();
  if (!auth.success) redirect('/login');
  const session = auth.data;
  
  // We link the ts_users (SaaS customer) to their ts_tenants via their email address.
  // When a package is purchased, a tour_users admin record is created with the same email.
  const workspacesRes = await query(`
    SELECT t.tenant_id, t.name AS tenant_name, t.slug, t.status, t.created_at,
           p.name AS plan_name, p.max_tours, p.max_bookings_per_month,
           s.status AS subscription_status
    FROM ts_tenants t
    JOIN tour_users tu ON tu.tenant_id = t.tenant_id
    LEFT JOIN ts_subscriptions s ON s.tenant_id = t.tenant_id AND s.status = 'active'
    LEFT JOIN ts_packages p ON p.package_id = s.package_id
    WHERE tu.email = $1 AND tu.role = 'owner'
    ORDER BY t.created_at DESC
  `, [session.email]);

  const workspaces = workspacesRes.rows;

  const pendingPurchasesRes = await query(`
    SELECT p.purchase_id, p.status, p.created_at, p.amount,
           pk.name as plan_name,
           p.metadata->>'companyName' as requested_name,
           p.metadata->>'subdomain' as requested_slug
    FROM ts_purchases p
    JOIN ts_packages pk ON pk.package_id = p.package_id
    WHERE p.user_id = $1 AND p.status = 'pending'
    ORDER BY p.created_at DESC
  `, [session.user_id]);

  const pendingPurchases = pendingPurchasesRes.rows;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-text">My Workspaces</h1>
        <p className="text-text-3 text-sm mt-1">Manage your active tour businesses</p>
      </div>

      {workspaces.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            🏢
          </div>
          <h2 className="text-lg font-bold text-text mb-2">No Workspaces Found</h2>
          <p className="text-text-2 mb-6 max-w-md mx-auto">
            You haven't created any workspaces yet. Purchase a subscription plan to get started.
          </p>
          <Link href="/pricing" className="btn-custom-primary inline-flex items-center gap-2">
            View Pricing Plans
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workspaces.map(workspace => (
            <div key={workspace.tenant_id} className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-text">{workspace.tenant_name}</h3>
                  <p className="text-text-3 text-sm mt-0.5">{workspace.slug}.{BASE_DOMAIN}</p>
                </div>
                <div className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                  {workspace.status}
                </div>
              </div>
              
              <div className="space-y-3 mb-6 bg-slate-50 rounded-xl p-4 border border-slate-100 flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-text-2 font-medium">Plan</span>
                  <span className="text-text font-bold">{workspace.plan_name || 'No Active Plan'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-2 font-medium">Subscription</span>
                  <span className="text-text font-bold capitalize">{workspace.subscription_status || 'Inactive'}</span>
                </div>
                {workspace.max_tours && (
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                    <span className="text-text-2 font-medium">Max Tours</span>
                    <span className="text-text font-bold">{workspace.max_tours}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mt-auto">
                <a 
                  href={`http://${workspace.slug}.${BASE_DOMAIN}/dashboard`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 btn-custom-primary text-center justify-center"
                >
                  Login to Workspace
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingPurchases.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-extrabold text-text mb-4">Pending Workspaces</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Workspace Info</th>
                  <th className="px-6 py-4 font-semibold">Package</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingPurchases.map(p => (
                  <tr key={p.purchase_id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{p.requested_name}</div>
                      <div className="text-slate-500 text-xs">{p.requested_slug}.{BASE_DOMAIN}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{p.plan_name}</div>
                      <div className="text-slate-500 text-xs">${p.amount}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                        {p.status} (Waiting for Approval)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
