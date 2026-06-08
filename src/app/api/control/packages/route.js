import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query("SELECT * FROM ts_packages ORDER BY monthly_price ASC");
    return NextResponse.json({ success: true, data: { packages: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { name, slug, description, monthly_price, yearly_price, max_tours, max_bookings_per_month, max_staff, custom_domain, analytics, is_active, image, image_id } = await request.json();
    if (!name || !slug) return NextResponse.json({ success: false, message: 'Name and slug required' }, { status: 400 });

    const res = await query(
      "INSERT INTO ts_packages (name, slug, description, monthly_price, yearly_price, max_tours, max_bookings_per_month, max_staff, custom_domain, analytics, is_active, image, image_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
      [name, slug, description, monthly_price, yearly_price, max_tours, max_bookings_per_month, max_staff, custom_domain, analytics, is_active !== false, image, image_id]
    );
    return NextResponse.json({ success: true, data: { package: res.rows[0] } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
