import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const [tenants, tours, users] = await Promise.all([
      query("SELECT COUNT(*) FROM ts_tenants"),
      query("SELECT COUNT(*) FROM tour_tours"),
      query("SELECT COUNT(*) FROM tour_users")
    ]);
    return NextResponse.json({ 
      success: true, 
      data: { 
        businesses: tenants.rows[0].count,
        tours: tours.rows[0].count,
        users: users.rows[0].count
      } 
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
