'use client';
import { BASE_DOMAIN } from '@/lib/secret';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '@/components/dashboard/ui';

export default function ManagerPurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get('/api/control/purchases');
      setPurchases(res.data.data.purchases);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Are you sure you want to approve this purchase and create the workspace?')) return;
    setActionLoading(id);
    try {
      await axios.post(`/api/control/purchases/${id}/approve`);
      fetchPurchases();
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject this purchase?')) return;
    setActionLoading(id);
    try {
      await axios.patch(`/api/control/purchases/${id}`, { status: 'cancelled' });
      fetchPurchases();
    } catch (err) {
      alert('Rejection failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="p-8"><LoadingSpinner /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pending Purchases</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Workspace Info</th>
              <th className="px-6 py-4 font-semibold">Package</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {purchases.map(p => (
              <tr key={p.purchase_id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{p.customer_name}</div>
                  <div className="text-slate-500 text-xs">{p.customer_email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{p.metadata?.companyName || 'Unknown'}</div>
                  <div className="text-slate-500 text-xs">{p.metadata?.subdomain || p.tenant_slug}.{BASE_DOMAIN}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-700">{p.package_name}</div>
                  <div className="text-slate-500 text-xs">${p.amount}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    p.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {p.status === 'pending' && (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleReject(p.purchase_id)}
                        disabled={actionLoading === p.purchase_id}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-semibold disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleApprove(p.purchase_id)}
                        disabled={actionLoading === p.purchase_id}
                        className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-xs font-semibold disabled:opacity-50"
                      >
                        {actionLoading === p.purchase_id ? 'Approving...' : 'Approve'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {purchases.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No purchases found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
