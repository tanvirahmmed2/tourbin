import { BASE_DOMAIN } from '@/lib/secret';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { CheckoutForm } from './CheckoutForm';
import Link from 'next/link';

async function getPackage(slug) {
  try {
    const res = await query(
      `SELECT * FROM ts_packages WHERE slug = $1 AND is_active = TRUE`,
      [slug]
    );
    return res.rows[0] || null;
  } catch (e) {
    return null;
  }
}

export default async function CheckoutPage({ params }) {
  const { packageSlug } = await params;
  const pkg = await getPackage(packageSlug);

  if (!pkg) return notFound();

  return (
    <div className="min-h-screen bg-bg-2 pt-32 pb-24 px-4">
      <div className="container max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-extrabold text-text mb-2">Complete your purchase</h1>
          <p className="text-text-2 mb-8">Set up your workspace and start managing tours today.</p>
          <CheckoutForm pkg={pkg} baseDomain={BASE_DOMAIN} />
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white border border-border rounded-3xl p-8 sticky top-24 shadow-sm">
            <h3 className="font-bold text-slate-500 uppercase tracking-wider text-xs mb-6">Order Summary</h3>
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold text-lg text-text">{pkg.name} Plan</div>
              <div className="font-black text-xl text-primary-light">${Number(pkg.monthly_price).toFixed(2)}<span className="text-sm text-text-3 font-normal">/mo</span></div>
            </div>
            <div className="text-sm text-text-2 mb-6 pb-6 border-b border-border">
              {pkg.description}
            </div>
            <ul className="text-sm text-text-2 flex flex-col gap-3 mb-6">
              <li className="flex items-center gap-2">✅ Full Tour Management</li>
              <li className="flex items-center gap-2">✅ Booking Engine</li>
              <li className="flex items-center gap-2">✅ Custom Domain</li>
              <li className="flex items-center gap-2">✅ 24/7 Support</li>
            </ul>
            <div className="flex justify-between items-center text-lg font-bold text-text pt-6 border-t border-border">
              <div>Total Due Today</div>
              <div>${Number(pkg.monthly_price).toFixed(2)}</div>
            </div>
            <p className="text-xs text-text-3 mt-4 text-center">
              Safe & secure 256-bit SSL encrypted payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
