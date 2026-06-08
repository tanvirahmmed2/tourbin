import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query("SELECT * FROM ts_tenants ORDER BY created_at DESC");
    return NextResponse.json({ success: true, data: { tenants: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { name, slug, status } = await request.json();
    if (!name || !slug) return NextResponse.json({ success: false, message: 'Name and slug required' }, { status: 400 });
    
    await query("INSERT INTO ts_tenants (name, slug, status) VALUES ($1, $2, $3)", [name, slug, status || 'active']);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
