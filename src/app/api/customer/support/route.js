import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isCustomer } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isCustomer();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query("SELECT * FROM ts_support_tickets WHERE user_id = $1 ORDER BY created_at DESC", [auth.data.user_id]);
    return NextResponse.json({ success: true, data: { tickets: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await isCustomer();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    
    const { subject, message, priority } = await request.json();
    if (!subject || !message) return NextResponse.json({ success: false, message: 'Subject and message required' }, { status: 400 });

    await query(
      "INSERT INTO ts_support_tickets (user_id, subject, message, priority) VALUES ($1, $2, $3, $4)",
      [auth.data.user_id, subject, message, priority || 'normal']
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
