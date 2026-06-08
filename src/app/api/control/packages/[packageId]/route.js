import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function PATCH(request, { params }) {
  try {
    const { packageId } = await params;
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const body = await request.json();
    
    let queryStr = "UPDATE ts_packages SET ";
    const values = [];
    let count = 1;
    
    const allowedFields = ['name', 'slug', 'description', 'monthly_price', 'yearly_price', 'max_tours', 'max_bookings_per_month', 'max_staff', 'custom_domain', 'analytics', 'is_active', 'image', 'image_id', 'features'];
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        queryStr += `${key} = $${count}, `;
        values.push(body[key]);
        count++;
      }
    }
    
    if (values.length === 0) return NextResponse.json({ success: false, message: 'No updates provided' }, { status: 400 });
    
    queryStr = queryStr.slice(0, -2) + ` WHERE package_id = $${count}`;
    values.push(packageId);

    await query(queryStr, values);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { packageId } = await params;
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    await query("DELETE FROM ts_packages WHERE package_id = $1", [packageId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
