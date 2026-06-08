import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const [tenants] = await Promise.all([
      query("SELECT COUNT(*) FROM ts_tenants")
    ]);
    return NextResponse.json({ 
      success: true, 
      data: { 
        tenants: tenants.rows[0].count,
        bookings: 15000,
        countries: 12
      } 
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
