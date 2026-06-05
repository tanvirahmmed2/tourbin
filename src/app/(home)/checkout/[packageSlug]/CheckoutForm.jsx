'use client';
import { useState } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '@/components/dashboard/ui';

export function CheckoutForm({ pkg, baseDomain }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '', subdomain: '',
    name: '', email: '', password: '',
    cardName: '', cardNumber: '', expiry: '', cvc: ''
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [successUrl, setSuccessUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await axios.post('/api/public/purchase', {
        packageId: pkg.package_id,
        ...formData
      });
      setSuccessUrl(res.data.tenantUrl);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.error || 'Failed to complete purchase.');
    }
  };

  const nextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  if (status === 'success') {
    return (
      <div className="bg-white border border-emerald-200 rounded-3xl p-12 text-center shadow-sm">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto text-emerald-600">🎉</div>
        <h2 className="text-3xl font-extrabold text-emerald-900 mb-4">Welcome to Tourbin!</h2>
        <p className="text-emerald-700 mb-8 max-w-md mx-auto text-lg">
          Your payment was successful and your workspace is ready. You can now log in to your tenant dashboard.
        </p>
        <a href={successUrl} className="btn-custom-primary !px-8 !py-4 text-lg inline-block">Go to Dashboard →</a>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
      {status === 'error' && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 mb-6">
          {errorMsg}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={nextStep} className="flex flex-col gap-6">
          <h3 className="text-xl font-bold text-text mb-2">1. Workspace Setup</h3>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Name</label>
            <input required type="text" value={formData.companyName} onChange={e => {
              const val = e.target.value;
              const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '');
              setFormData({ ...formData, companyName: val, subdomain: slug });
            }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Ocean Tours" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tenant URL</label>
            <div className="flex items-center">
              <input required type="text" value={formData.subdomain} onChange={e => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })} className="w-full bg-slate-50 border border-slate-200 border-r-0 rounded-l-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="oceantours" />
              <div className="bg-slate-100 border border-slate-200 border-l-0 rounded-r-xl px-4 py-3 text-sm text-text-3 font-semibold select-none">.{baseDomain}</div>
            </div>
            <p className="text-xs text-text-3 mt-2">You can add a custom domain (like www.oceantours.com) later.</p>
          </div>

          <h3 className="text-xl font-bold text-text mb-2 mt-4">2. Admin Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admin Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="jane@oceantours.com" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <input required type="password" minLength={8} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" className="btn-custom-primary w-full h-14 mt-4 text-lg">Continue to Payment →</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-text">3. Payment Details</h3>
            <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-primary hover:underline">Edit details</button>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name on Card</label>
            <input required type="text" value={formData.cardName} onChange={e => setFormData({ ...formData, cardName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Jane Doe" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Card Number (Mock)</label>
            <input required type="text" value={formData.cardNumber} onChange={e => setFormData({ ...formData, cardNumber: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="4242 4242 4242 4242" />
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expiry Date</label>
              <input required type="text" value={formData.expiry} onChange={e => setFormData({ ...formData, expiry: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="MM/YY" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CVC</label>
              <input required type="text" value={formData.cvc} onChange={e => setFormData({ ...formData, cvc: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="123" />
            </div>
          </div>
          
          <button disabled={status === 'loading'} type="submit" className="btn-custom-primary w-full h-14 mt-4 text-lg flex items-center justify-center gap-2">
            {status === 'loading' ? <LoadingSpinner /> : 'Pay & Setup Workspace 🚀'}
          </button>
        </form>
      )}
    </div>
  );
}
