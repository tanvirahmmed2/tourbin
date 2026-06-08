const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, 'src/app/api');

// Utility to create files safely
function writeRoute(routePath, content) {
    const fullPath = path.join(API_DIR, routePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
    console.log(`Created: src/app/api/${routePath}`);
}

// Ensure api directory exists
if (!fs.existsSync(API_DIR)) {
    fs.mkdirSync(API_DIR, { recursive: true });
}

// ============================================================================
// AUTH ROUTES
// ============================================================================

writeRoute('auth/login/route.js', `
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
`);

writeRoute('auth/register/route.js', `
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
`);

writeRoute('auth/logout/route.js', `
import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/middleware';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.headers.set('Set-Cookie', clearSessionCookie());
  return response;
}
`);


// ============================================================================
// PUBLIC ROUTES
// ============================================================================

writeRoute('public/packages/route.js', `
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
`);

writeRoute('public/testimonials/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query(\`
      SELECT r.rating, r.comment, u.name 
      FROM ts_reviews r
      JOIN ts_users u ON u.user_id = r.user_id
      WHERE r.is_approved = true
      ORDER BY r.created_at DESC LIMIT 10
    \`);
    return NextResponse.json({ success: true, data: { testimonials: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('public/stats/route.js', `
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
`);

writeRoute('public/purchase/route.js', `
import { NextResponse } from 'next/server';
import { query, withTransaction } from '@/lib/db';
import { hashPassword, signToken, buildSessionCookie, getAuthenticatedContext } from '@/lib/middleware';

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 50);
}

export async function POST(request) {
  try {
    const { packageId, companyName, subdomain, name, email, password } = await request.json();

    if (!packageId || !companyName || !subdomain || !name || !email || !password) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    let user_id = null;
    const session = await getAuthenticatedContext();
    
    if (session && session.user_id && !session.tenant_id) {
      user_id = session.user_id;
    } else {
      const existingUser = await query("SELECT user_id FROM ts_users WHERE email = $1 LIMIT 1", [emailLower]);
      if (existingUser.rows.length > 0) {
        user_id = existingUser.rows[0].user_id;
      }
    }

    const packageRes = await query("SELECT * FROM ts_packages WHERE package_id = $1", [packageId]);
    if (packageRes.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid package selected' }, { status: 400 });
    }
    const pkg = packageRes.rows[0];

    let slug = generateSlug(subdomain);
    const slugCheck = await query("SELECT tenant_id FROM ts_tenants WHERE slug = $1 LIMIT 1", [slug]);
    if (slugCheck.rows.length > 0) {
       return NextResponse.json({ success: false, message: 'This subdomain is already taken' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    
    const result = await withTransaction(async (client) => {
      let finalUserId = user_id;
      let newUser = null;

      if (!finalUserId) {
        const userResult = await client.query(
          "INSERT INTO ts_users (name, email, password, role) VALUES ($1, $2, $3, 'customer') RETURNING *",
          [name, emailLower, hashedPassword]
        );
        finalUserId = userResult.rows[0].user_id;
        newUser = userResult.rows[0];
      }

      const metadata = {
        companyName,
        subdomain: slug,
        tenantAdminName: name,
        tenantAdminEmail: emailLower,
        tenantAdminPasswordHashed: hashedPassword
      };

      const purchaseResult = await client.query(
        "INSERT INTO ts_purchases (user_id, package_id, amount, status, metadata) VALUES ($1, $2, $3, 'pending', $4) RETURNING *",
        [finalUserId, pkg.package_id, pkg.monthly_price, metadata]
      );

      return { purchase: purchaseResult.rows[0], newUser };
    });

    let cookie = null;
    if (result.newUser && (!session || session.tenant_id)) {
      const tokenPayload = {
        user_id: result.newUser.user_id,
        name: result.newUser.name,
        email: result.newUser.email,
        role: result.newUser.role,
      };
      const token = signToken(tokenPayload);
      cookie = buildSessionCookie(token);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Purchase submitted. Your workspace is pending manager approval.',
      tenantUrl: '/dashboard'
    }, { status: 201 });

    if (cookie) {
      response.headers.set('Set-Cookie', cookie);
    }
    return response;
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);


// ============================================================================
// CUSTOMER ROUTES
// ============================================================================

writeRoute('customer/profile/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isCustomer, hashPassword } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isCustomer();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query("SELECT user_id, name, email FROM ts_users WHERE user_id = $1", [auth.data.user_id]);
    return NextResponse.json({ success: true, data: { profile: res.rows[0] } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const auth = await isCustomer();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });

    const { name, email, password } = await request.json();
    let queryStr = "UPDATE ts_users SET ";
    const values = [];
    let count = 1;

    if (name) {
      queryStr += \`name = $\${count}, \`;
      values.push(name); count++;
    }
    if (email) {
      const check = await query("SELECT user_id FROM ts_users WHERE email = $1 AND user_id != $2", [email.toLowerCase().trim(), auth.data.user_id]);
      if (check.rows.length > 0) return NextResponse.json({ success: false, message: 'Email already taken' }, { status: 400 });
      queryStr += \`email = $\${count}, \`;
      values.push(email.toLowerCase().trim()); count++;
    }
    if (password) {
      if (password.length < 8) return NextResponse.json({ success: false, message: 'Password too short' }, { status: 400 });
      const hashed = await hashPassword(password);
      queryStr += \`password = $\${count}, \`;
      values.push(hashed); count++;
    }

    if (values.length === 0) return NextResponse.json({ success: false, message: 'No data provided' }, { status: 400 });

    queryStr = queryStr.slice(0, -2) + \` WHERE user_id = $\${count}\`;
    values.push(auth.data.user_id);

    await query(queryStr, values);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('customer/reviews/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isCustomer } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isCustomer();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query("SELECT * FROM ts_reviews WHERE user_id = $1 LIMIT 1", [auth.data.user_id]);
    return NextResponse.json({ success: true, data: { review: res.rows[0] || null } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await isCustomer();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    
    const { rating, comment } = await request.json();
    if (!rating || rating < 1 || rating > 5) return NextResponse.json({ success: false, message: 'Invalid rating' }, { status: 400 });

    const check = await query("SELECT review_id FROM ts_reviews WHERE user_id = $1", [auth.data.user_id]);
    if (check.rows.length > 0) {
        await query("UPDATE ts_reviews SET rating = $1, comment = $2, is_approved = false WHERE user_id = $3", [rating, comment, auth.data.user_id]);
    } else {
        await query("INSERT INTO ts_reviews (user_id, rating, comment) VALUES ($1, $2, $3)", [auth.data.user_id, rating, comment]);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('customer/support/route.js', `
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
`);


// ============================================================================
// CONTROL ROUTES (SaaS Dashboards)
// ============================================================================

writeRoute('control/overview/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });

    const [statsRes, recentTenantsRes, recentPaymentsRes] = await Promise.all([
      query(\`
        SELECT
          (SELECT COUNT(*) FROM ts_tenants)                                                   AS total_tenants,
          (SELECT COUNT(*) FROM ts_tenants WHERE status = 'active')                           AS active_tenants,
          (SELECT COUNT(*) FROM tour_users WHERE role != 'super_admin')                       AS total_users,
          (SELECT COUNT(*) FROM tour_bookings)                                                AS total_bookings,
          (SELECT COALESCE(SUM(amount), 0) FROM ts_subscription_payments
           WHERE status = 'success' AND created_at > NOW() - INTERVAL '30 days')              AS monthly_revenue
      \`),
      query(\`
        SELECT t.tenant_id, t.name, t.slug, t.status, t.created_at, p.name AS plan_name
        FROM ts_tenants t
        LEFT JOIN ts_subscriptions ss ON ss.tenant_id = t.tenant_id AND ss.status = 'active'
        LEFT JOIN ts_packages p       ON p.package_id = ss.package_id
        ORDER BY t.created_at DESC LIMIT 8
      \`),
      query(\`
        SELECT sp.payment_id, sp.amount, sp.status, sp.created_at, t.name AS tenant_name
        FROM ts_subscription_payments sp
        JOIN ts_subscriptions s ON s.subscription_id = sp.subscription_id
        JOIN ts_tenants t ON t.tenant_id = s.tenant_id
        ORDER BY sp.created_at DESC LIMIT 6
      \`),
    ]);

    const row = statsRes.rows[0] || {};
    return NextResponse.json({ success: true, data: {
      stats: {
        totalTenants:   parseInt(row.total_tenants || 0),
        activeTenants:  parseInt(row.active_tenants || 0),
        totalUsers:     parseInt(row.total_users || 0),
        totalBookings:  parseInt(row.total_bookings || 0),
        monthlyRevenue: parseFloat(row.monthly_revenue || 0),
      },
      recentTenants:  recentTenantsRes.rows,
      recentPayments: recentPaymentsRes.rows,
      user: { name: auth.data.name, role: auth.data.role }
    }});
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/analytics/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isOwner } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isOwner();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });

    const [revenueRes, tenantRes] = await Promise.all([
        query("SELECT DATE(created_at) as date, SUM(amount) as revenue FROM ts_subscription_payments WHERE status = 'success' GROUP BY DATE(created_at) ORDER BY date ASC LIMIT 30"),
        query("SELECT DATE(created_at) as date, COUNT(*) as new_tenants FROM ts_tenants GROUP BY DATE(created_at) ORDER BY date ASC LIMIT 30")
    ]);

    return NextResponse.json({ success: true, data: { 
        revenueChart: revenueRes.rows,
        tenantChart: tenantRes.rows
    }});
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/packages/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isOwner } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isOwner();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query("SELECT * FROM ts_packages ORDER BY monthly_price ASC");
    return NextResponse.json({ success: true, data: { packages: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await isOwner();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { name, slug, description, monthly_price, yearly_price, max_tours, max_bookings_per_month, max_staff, custom_domain, analytics, is_active } = await request.json();
    if (!name || !slug) return NextResponse.json({ success: false, message: 'Name and slug required' }, { status: 400 });

    const res = await query(
      "INSERT INTO ts_packages (name, slug, description, monthly_price, yearly_price, max_tours, max_bookings_per_month, max_staff, custom_domain, analytics, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [name, slug, description, monthly_price, yearly_price, max_tours, max_bookings_per_month, max_staff, custom_domain, analytics, is_active !== false]
    );
    return NextResponse.json({ success: true, data: { package: res.rows[0] } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/payments/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isOwner } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isOwner();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });

    const [statsRes, listRes] = await Promise.all([
      query("SELECT COALESCE(SUM(amount), 0) AS total_revenue FROM ts_subscription_payments WHERE status = 'success'"),
      query(\`
        SELECT p.payment_id, p.amount, p.status, p.created_at, p.provider,
               t.name AS tenant_name, pkg.name AS package_name
        FROM ts_subscription_payments p
        JOIN ts_subscriptions s ON s.subscription_id = p.subscription_id
        JOIN ts_tenants t ON t.tenant_id = s.tenant_id
        JOIN ts_packages pkg ON pkg.package_id = s.package_id
        ORDER BY p.created_at DESC
      \`)
    ]);

    return NextResponse.json({ success: true, data: {
      totalRevenue: parseFloat(statsRes.rows[0].total_revenue),
      payments: listRes.rows
    }});
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/subscriptions/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isOwner } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isOwner();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });

    const res = await query(\`
      SELECT s.*, t.name as tenant_name, t.slug as tenant_slug, p.name as package_name
      FROM ts_subscriptions s
      JOIN ts_tenants t ON t.tenant_id = s.tenant_id
      JOIN ts_packages p ON p.package_id = s.package_id
      ORDER BY s.created_at DESC
    \`);
    return NextResponse.json({ success: true, data: { subscriptions: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/purchases/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });

    const res = await query(\`
      SELECT p.*, u.name as user_name, u.email as user_email, pkg.name as package_name
      FROM ts_purchases p
      JOIN ts_users u ON u.user_id = p.user_id
      JOIN ts_packages pkg ON pkg.package_id = p.package_id
      ORDER BY p.created_at DESC
    \`);
    return NextResponse.json({ success: true, data: { purchases: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/purchases/[purchaseId]/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function PATCH(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { status } = await request.json();
    await query("UPDATE ts_purchases SET status = $1 WHERE purchase_id = $2", [status, params.purchaseId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/purchases/[purchaseId]/approve/route.js', `
import { NextResponse } from 'next/server';
import { query, withTransaction } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function POST(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });

    const { purchaseId } = params;

    const res = await query("SELECT * FROM ts_purchases WHERE purchase_id = $1", [purchaseId]);
    if (res.rows.length === 0) return NextResponse.json({ success: false, message: 'Purchase not found' }, { status: 404 });
    const purchase = res.rows[0];

    if (purchase.status === 'paid') return NextResponse.json({ success: false, message: 'Already approved' }, { status: 400 });

    const meta = purchase.metadata || {};
    
    await withTransaction(async (client) => {
      // 1. Mark purchase as paid
      await client.query("UPDATE ts_purchases SET status = 'paid' WHERE purchase_id = $1", [purchaseId]);

      // 2. Create Tenant
      const tenantRes = await client.query(
        "INSERT INTO ts_tenants (name, slug, status) VALUES ($1, $2, 'active') RETURNING *",
        [meta.companyName || 'New Tenant', meta.subdomain]
      );
      const newTenant = tenantRes.rows[0];

      // 3. Create Subscription
      const subRes = await client.query(
        "INSERT INTO ts_subscriptions (tenant_id, package_id, status, start_date) VALUES ($1, $2, 'active', NOW()) RETURNING *",
        [newTenant.tenant_id, purchase.package_id]
      );
      
      // 4. Create Initial Subscription Payment Record
      await client.query(
        "INSERT INTO ts_subscription_payments (subscription_id, amount, provider, status, paid_at) VALUES ($1, $2, 'manual', 'success', NOW())",
        [subRes.rows[0].subscription_id, purchase.amount]
      );

      // 5. Create Tenant Admin inside tour_users
      await client.query(
        "INSERT INTO tour_users (tenant_id, name, email, password, role) VALUES ($1, $2, $3, $4, 'owner')",
        [newTenant.tenant_id, meta.tenantAdminName, meta.tenantAdminEmail, meta.tenantAdminPasswordHashed]
      );
    });

    return NextResponse.json({ success: true, message: 'Approved successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/tenants/route.js', `
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
`);

writeRoute('control/tenants/[tenantId]/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query("SELECT * FROM ts_tenants WHERE tenant_id = $1", [params.tenantId]);
    if(res.rows.length === 0) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: { tenant: res.rows[0] } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { status, name } = await request.json();
    await query("UPDATE ts_tenants SET status = COALESCE($1, status), name = COALESCE($2, name) WHERE tenant_id = $3", [status, name, params.tenantId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);


writeRoute('control/users/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isOwner } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isOwner();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query("SELECT user_id, name, email, role, created_at FROM ts_users ORDER BY created_at DESC");
    return NextResponse.json({ success: true, data: { users: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/users/[userId]/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isOwner } from '@/lib/middleware';

export async function PATCH(request, { params }) {
  try {
    const auth = await isOwner();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { role } = await request.json();
    await query("UPDATE ts_users SET role = $1 WHERE user_id = $2", [role, params.userId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await isOwner();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    if (auth.data.user_id == params.userId) return NextResponse.json({ success: false, message: 'Cannot delete yourself' }, { status: 400 });
    await query("DELETE FROM ts_users WHERE user_id = $1", [params.userId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/reviews/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query(\`
      SELECT r.*, u.name as user_name, u.email as user_email 
      FROM ts_reviews r 
      JOIN ts_users u ON u.user_id = r.user_id 
      ORDER BY r.created_at DESC
    \`);
    return NextResponse.json({ success: true, data: { reviews: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/reviews/[reviewId]/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function PATCH(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { is_approved } = await request.json();
    await query("UPDATE ts_reviews SET is_approved = $1 WHERE review_id = $2", [is_approved, params.reviewId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    await query("DELETE FROM ts_reviews WHERE review_id = $1", [params.reviewId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/support/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET(request) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');

    if (ticketId) {
        const [ticketRes, repliesRes] = await Promise.all([
            query("SELECT * FROM ts_support_tickets WHERE ticket_id = $1", [ticketId]),
            query("SELECT * FROM ts_support_replies WHERE ticket_id = $1 ORDER BY created_at ASC", [ticketId])
        ]);
        if (ticketRes.rows.length === 0) return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: { ticket: ticketRes.rows[0], replies: repliesRes.rows } });
    }

    const res = await query(\`
      SELECT t.*, u.name as customer_name, u.email as customer_email 
      FROM ts_support_tickets t 
      LEFT JOIN ts_users u ON u.user_id = t.user_id 
      ORDER BY t.created_at DESC
    \`);
    return NextResponse.json({ success: true, data: { tickets: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { ticket_id, message } = await request.json();
    if (!ticket_id || !message) return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });

    await query(
      "INSERT INTO ts_support_replies (ticket_id, user_id, is_admin, message) VALUES ($1, $2, true, $3)",
      [ticket_id, auth.data.user_id, message]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { ticket_id, status } = await request.json();
    if (!ticket_id || !status) return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });

    await query("UPDATE ts_support_tickets SET status = $1, updated_at = NOW() WHERE ticket_id = $2", [status, ticket_id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

// ============================================================================
// NEW MISSING ROUTES
// ============================================================================

writeRoute('control/packages/[packageId]/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isOwner } from '@/lib/middleware';

export async function PATCH(request, { params }) {
  try {
    const auth = await isOwner();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const body = await request.json();
    
    let queryStr = "UPDATE ts_packages SET ";
    const values = [];
    let count = 1;
    
    const allowedFields = ['name', 'slug', 'description', 'monthly_price', 'yearly_price', 'max_tours', 'max_bookings_per_month', 'max_staff', 'custom_domain', 'analytics', 'is_active'];
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        queryStr += \`\${key} = $\${count}, \`;
        values.push(body[key]);
        count++;
      }
    }
    
    if (values.length === 0) return NextResponse.json({ success: false, message: 'No updates provided' }, { status: 400 });
    
    queryStr = queryStr.slice(0, -2) + \` WHERE package_id = $\${count}\`;
    values.push(params.packageId);

    await query(queryStr, values);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await isOwner();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    await query("DELETE FROM ts_packages WHERE package_id = $1", [params.packageId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/subscriptions/[subscriptionId]/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isOwner } from '@/lib/middleware';

export async function PATCH(request, { params }) {
  try {
    const auth = await isOwner();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { status, auto_renew } = await request.json();
    
    let queryStr = "UPDATE ts_subscriptions SET ";
    const values = [];
    let count = 1;
    
    if (status !== undefined) { queryStr += \`status = $\${count}, \`; values.push(status); count++; }
    if (auto_renew !== undefined) { queryStr += \`auto_renew = $\${count}, \`; values.push(auto_renew); count++; }
    
    if (values.length === 0) return NextResponse.json({ success: false, message: 'No updates provided' }, { status: 400 });
    
    queryStr = queryStr.slice(0, -2) + \` WHERE subscription_id = $\${count}\`;
    values.push(params.subscriptionId);

    await query(queryStr, values);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/invoices/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query(\`
      SELECT i.*, t.name as tenant_name 
      FROM ts_invoices i
      JOIN ts_tenants t ON t.tenant_id = i.tenant_id
      ORDER BY i.created_at DESC
    \`);
    return NextResponse.json({ success: true, data: { invoices: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { tenant_id, subscription_id, invoice_number, amount, status, due_date } = await request.json();
    if (!tenant_id || !invoice_number || amount === undefined) {
      return NextResponse.json({ success: false, message: 'tenant_id, invoice_number, and amount required' }, { status: 400 });
    }
    const res = await query(
      "INSERT INTO ts_invoices (tenant_id, subscription_id, invoice_number, amount, status, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [tenant_id, subscription_id || null, invoice_number, amount, status || 'unpaid', due_date || null]
    );
    return NextResponse.json({ success: true, data: { invoice: res.rows[0] } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/invoices/[invoiceId]/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function PATCH(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { status } = await request.json();
    if (!status) return NextResponse.json({ success: false, message: 'Status required' }, { status: 400 });
    
    await query("UPDATE ts_invoices SET status = $1 WHERE invoice_id = $2", [status, params.invoiceId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    await query("DELETE FROM ts_invoices WHERE invoice_id = $1", [params.invoiceId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/domains/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query(\`
      SELECT d.*, t.name as tenant_name 
      FROM ts_domains d
      JOIN ts_tenants t ON t.tenant_id = d.tenant_id
      ORDER BY d.created_at DESC
    \`);
    return NextResponse.json({ success: true, data: { domains: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/domains/[domainId]/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function PATCH(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { verified, is_primary } = await request.json();
    
    let queryStr = "UPDATE ts_domains SET ";
    const values = [];
    let count = 1;
    
    if (verified !== undefined) { queryStr += \`verified = $\${count}, \`; values.push(verified); count++; }
    if (is_primary !== undefined) { queryStr += \`is_primary = $\${count}, \`; values.push(is_primary); count++; }
    
    if (values.length === 0) return NextResponse.json({ success: false, message: 'No updates provided' }, { status: 400 });
    
    queryStr = queryStr.slice(0, -2) + \` WHERE domain_id = $\${count}\`;
    values.push(params.domainId);

    await query(queryStr, values);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    await query("DELETE FROM ts_domains WHERE domain_id = $1", [params.domainId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/websites/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query(\`
      SELECT w.*, t.name as tenant_name 
      FROM tour_websites w
      JOIN ts_tenants t ON t.tenant_id = w.tenant_id
      ORDER BY w.created_at DESC
    \`);
    return NextResponse.json({ success: true, data: { websites: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

writeRoute('control/websites/[websiteId]/route.js', `
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function PATCH(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const body = await request.json();
    
    let queryStr = "UPDATE tour_websites SET ";
    const values = [];
    let count = 1;
    
    const allowedFields = ['logo_url', 'theme_color', 'hero_title', 'hero_subtitle'];
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        queryStr += \`\${key} = $\${count}, \`;
        values.push(body[key]);
        count++;
      }
    }
    
    if (values.length === 0) return NextResponse.json({ success: false, message: 'No updates provided' }, { status: 400 });
    
    queryStr += \`updated_at = NOW() WHERE website_id = $\${count}\`;
    values.push(params.websiteId);

    await query(queryStr, values);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
`);

