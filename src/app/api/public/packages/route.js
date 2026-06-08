import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query("SELECT * FROM ts_packages WHERE is_active = true ORDER BY monthly_price ASC");
    // Get features for packages
    const featuresRes = await query("SELECT * FROM ts_package_features");
    
    const packages = res.rows.map(pkg => {
        return {
            ...pkg,
            features: featuresRes.rows.filter(f => f.package_id === pkg.package_id)
        };
    });

    return NextResponse.json({ success: true, data: { packages } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
