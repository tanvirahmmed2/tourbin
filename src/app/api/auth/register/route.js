import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, signToken, buildSessionCookie } from '@/lib/middleware';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
       return NextResponse.json({ success: false, message: 'All fields required' }, { status: 400 });
    }

    if (password.length < 8) {
       return NextResponse.json({ success: false, message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const check = await query("SELECT user_id FROM ts_users WHERE email = $1", [email.toLowerCase().trim()]);
    if (check.rows.length > 0) {
       return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    const res = await query(
      "INSERT INTO ts_users (name, email, password, role) VALUES ($1, $2, $3, 'customer') RETURNING *",
      [name, email.toLowerCase().trim(), hashed]
    );

    const user = res.rows[0];
    const tokenPayload = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = signToken(tokenPayload);
    const cookie = buildSessionCookie(token);

    const response = NextResponse.json({ success: true, data: tokenPayload }, { status: 201 });
    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
