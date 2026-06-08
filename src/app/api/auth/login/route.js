import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, signToken, buildSessionCookie } from '@/lib/middleware';
import { BASE_DOMAIN } from '@/lib/secret';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
    }

    const host = request.headers.get('host');
    const SAAS_DOMAIN = process.env.SAAS_DOMAIN || 'localhost:3000';
    const isSaas = host === SAAS_DOMAIN || host === BASE_DOMAIN.split(':')[0];

    let user = null;

    if (isSaas) {
      const saasResult = await query("SELECT * FROM ts_users WHERE email = $1 LIMIT 1", [email.toLowerCase().trim()]);
      if (saasResult.rows.length > 0) user = saasResult.rows[0];
    } else {
      let tenantSlug = host.split('.')[0];
      if (host.includes('localhost') && host.split('.').length === 1) {
         tenantSlug = null; 
      }
      
      if (tenantSlug) {
        const tenantRes = await query("SELECT tenant_id FROM ts_tenants WHERE slug = $1", [tenantSlug]);
        if (tenantRes.rows.length > 0) {
          const tenantId = tenantRes.rows[0].tenant_id;
          const tourRes = await query("SELECT * FROM tour_users WHERE email = $1 AND tenant_id = $2 LIMIT 1", [email.toLowerCase().trim(), tenantId]);
          if (tourRes.rows.length > 0) {
             user = tourRes.rows[0];
             user.tenant_id = tenantId;
             user.tenant_slug = tenantSlug;
          }
        }
      }
    }

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const tokenPayload = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    if (user.tenant_id) {
      tokenPayload.tenant_id = user.tenant_id;
      tokenPayload.tenant_slug = user.tenant_slug;
    }

    const token = signToken(tokenPayload);
    const cookie = buildSessionCookie(token);

    const response = NextResponse.json({
      success: true,
      data: tokenPayload
    }, { status: 200 });

    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
