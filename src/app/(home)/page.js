import { BASE_DOMAIN } from '@/lib/secret';
import Link from 'next/link';
import { TrustStats } from '@/components/marketing/TrustStats';
import { PricingCards } from '@/components/marketing/PricingCards';
import { TestimonialCards } from '@/components/marketing/TestimonialCards';
import { ContactForm } from '@/components/marketing/ContactForm';

export const metadata = {
  title: 'Tourbin — Tour Management Software for Modern Travel Agencies',
  description: 'Manage Tours, Bookings, Customers and Payments from one dashboard. Built for tour operators who want to grow faster.',
};

/* ── Section: Testimonials ──────────────────────────────────────────────── */
function TestimonialsSection() {
  return (
    <section className="py-24 bg-bg-2" id="testimonials">
      <div className="container">
        <div className="text-center flex flex-col items-center gap-4 mb-16">
          <div className="badge badge-primary">Customer stories</div>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] max-w-[700px] text-text">
            Travelers <span className="gradient-text">love our tours</span>
          </h2>
        </div>
        <TestimonialCards />
      </div>
    </section>
  );
}

/* ── Section: Hero ──────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative pt-[160px] pb-[120px] overflow-hidden min-h-[100vh] flex items-center md:pt-[180px] md:pb-[100px]">
      {/* Dynamic Animated Background Orbs */}
      <div className="absolute top-[5%] left-[20%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.12)_0%,transparent_70%)] pointer-events-none animate-blob" />
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none animate-blob" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[10%] left-[30%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.1)_0%,transparent_70%)] pointer-events-none animate-blob" style={{ animationDelay: '4s' }} />
      
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center max-w-[840px] mx-auto mb-24">
          <div className="badge badge-primary mb-8 animate-fade-up">
            ✦ Trusted by 100+ Tour Companies
          </div>
          <h1 className="text-[clamp(2.75rem,6.5vw,5rem)] font-black leading-[1.05] tracking-tight mb-8 text-text animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Tour Management Software<br />
            for <span className="gradient-text">Modern Travel Agencies</span>
          </h1>
          <p className="text-lg md:text-xl text-text-2 leading-relaxed mb-12 max-w-[620px] animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Manage Tours, Bookings, Customers, and Payments from one powerful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/pricing" className="btn-custom-primary !px-8 !py-4 text-base">
              View Packages
              <span className="absolute inset-0 bg-white/20 w-full h-full -skew-x-12 -translate-x-full group-hover:animate-shimmer transition-all" />
            </Link>
            <Link href="/features" className="btn-custom-secondary !px-8 !py-4 text-base">
              See all Features →
            </Link>
          </div>
          <p className="text-xs text-text-3 font-semibold tracking-wide animate-fade-up uppercase" style={{ animationDelay: '0.4s' }}>
            No credit card required · Cancel anytime · Setup in 2 minutes
          </p>
        </div>

        {/* Dashboard preview */}
        <div className="relative z-10 rounded-2xl border border-white/40 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-[1024px] mx-auto card-glass hidden sm:block animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-2 p-3 px-4 bg-white/40 backdrop-blur-md border-b border-white/40">
            <span className="w-3 h-3 rounded-full shrink-0 shadow-inner" style={{ background: '#ff5f57' }} />
            <span className="w-3 h-3 rounded-full shrink-0 shadow-inner" style={{ background: '#febc2e' }} />
            <span className="w-3 h-3 rounded-full shrink-0 shadow-inner" style={{ background: '#28c840' }} />
            <span className="text-[11px] font-bold text-slate-500 ml-3 tracking-wide bg-white/60 px-2 py-0.5 rounded text-center min-w-[200px] mx-auto border border-white/50 shadow-sm">{BASE_DOMAIN}/dashboard</span>
          </div>
          <div className="p-8 flex flex-col gap-8 bg-slate-50/50">
            {/* Stat cards row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Bookings Today', value: '24', trend: '+12%', color: '#4F46E5' },
                { label: 'Revenue Today', value: '$4,820', trend: '+8%', color: '#0EA5E9' },
                { label: 'Active Tours', value: '18', trend: '+3', color: '#10B981' },
                { label: 'Customers', value: '1,240', trend: '+45', color: '#F59E0B' },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-3">{s.label}</div>
                  <div className="text-3xl font-black tracking-tight mb-2" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs font-bold text-emerald-500 flex items-center gap-1 bg-emerald-50 w-fit px-2 py-1 rounded-md">↑ {s.trend}</div>
                </div>
              ))}
            </div>
            {/* Chart preview */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="text-sm text-slate-700 font-bold mb-6">Monthly Revenue</div>
              <div className="flex items-end gap-3 h-32">
                {[45, 62, 55, 78, 90, 72, 88, 95, 80, 105, 92, 110].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm bg-gradient-primary opacity-90 hover:opacity-100 transition-opacity cursor-pointer group relative" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">${h}k</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                  <span key={m} className="flex-1 text-[11px] font-semibold text-slate-400 text-center">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Section: Trust Stats ───────────────────────────────────────────────── */
function TrustSection() {
  return (
    <section className="border-y border-slate-200/80 bg-bg-2 py-16">
      <div className="container">
        <TrustStats />
      </div>
    </section>
  );
}

/* ── Section: Features ──────────────────────────────────────────────────── */
const FEATURES = [
  { icon: '🗺️', title: 'Tour Management', desc: 'Create, publish and manage tours with rich itineraries, images, pricing tiers and availability windows.' },
  { icon: '📋', title: 'Booking System', desc: 'Accept bookings online with real-time seat availability, automatic confirmations and cancellation handling.' },
  { icon: '👥', title: 'Customer CRM', desc: 'Track customers, their booking history, lifetime value and preferences in one place.' },
  { icon: '💳', title: 'Online Payments', desc: 'Accept Stripe, bKash, Nagad and SSLCommerz. Full payment lifecycle from invoice to receipt.' },
  { icon: '📊', title: 'Analytics', desc: 'Revenue charts, booking trends, top tours, customer sources — everything you need to make better decisions.' },
  { icon: '🌐', title: 'Custom Domains', desc: 'Give each tour company their own branded website at their own domain with zero extra config.' },
];

function FeaturesSection() {
  return (
    <section className="py-24" id="features">
      <div className="container">
        <div className="text-center flex flex-col items-center gap-4 mb-16">
          <div className="badge badge-primary">Everything you need</div>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] max-w-[700px] text-text">
            All the tools your tour company needs, <span className="gradient-text">in one place</span>
          </h2>
          <p className="text-base text-text-2 max-w-[560px] leading-relaxed mt-2">
            Stop juggling spreadsheets, WhatsApp groups and cash ledgers. Tourbin replaces them all.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {FEATURES.map((f, index) => (
            <div key={f.title} className="group relative border border-slate-200/60 rounded-[2rem] p-8 flex flex-col gap-4 bg-white shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-4xl filter drop-shadow-[0_4px_8px_rgba(99,102,241,0.1)]">{f.icon}</div>
              <h3 className="text-xl font-bold text-text tracking-tight mt-2">{f.title}</h3>
              <p className="text-sm text-text-2 leading-[1.7]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section: How it Works ──────────────────────────────────────────────── */
const STEPS = [
  { num: '01', title: 'Create Account', desc: 'Sign up in 2 minutes. No credit card needed to start your 14-day free trial.' },
  { num: '02', title: 'Set Up Your Company', desc: 'Add your company name, logo, colors and connect your domain to get your branded website.' },
  { num: '03', title: 'Publish Your Tours', desc: 'Create tour listings with photos, itineraries, pricing and schedules. Go live instantly.' },
  { num: '04', title: 'Receive Bookings', desc: 'Customers book and pay directly. You get notified and can manage everything from your dashboard.' },
];

function HowItWorksSection() {
  return (
    <section className="py-24 bg-bg-2" id="how-it-works">
      <div className="container">
        <div className="text-center flex flex-col items-center gap-4 mb-20">
          <div className="badge badge-primary">Simple setup</div>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] max-w-[700px] text-text">
            Get started in <span className="gradient-text">under 10 minutes</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 max-w-6xl mx-auto relative">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex flex-col items-center text-center relative px-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center text-base font-extrabold text-white mb-6 shrink-0 shadow-[0_4px_12px_rgba(99,102,241,0.3)] relative z-10">
                {step.num}
              </div>
              {i < STEPS.length - 1 && (
                <div className="absolute top-[28px] left-[calc(50%+28px)] right-[calc(-50%+28px)] h-[2px] bg-[linear-gradient(90deg,rgba(99,102,241,0.25),rgba(99,102,241,0.02))] hidden lg:block" />
              )}
              <div>
                <h3 className="text-base font-bold mb-2 text-text tracking-tight">{step.title}</h3>
                <p className="text-sm text-text-2 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section: Benefits ──────────────────────────────────────────────────── */
const BENEFITS = [
  { icon: '⏱️', title: 'Save 10+ hours/week', desc: 'Automate booking confirmations, reminders, and payment receipts. No more manual follow-ups.' },
  { icon: '📈', title: 'Increase Revenue', desc: 'Online bookings convert 3× better than phone/email. Accept payments 24/7, even while you sleep.' },
  { icon: '🔒', title: 'Reduce Errors', desc: 'No more double bookings, lost deposits or missed payments. Everything is tracked automatically.' },
  { icon: '🎯', title: 'Centralized Control', desc: 'One dashboard for all your tours, staff, customers, and finances. The complete picture, always.' },
];

function BenefitsSection() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
          <div>
            <div className="badge badge-primary mb-4">Why Tourbin</div>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] text-left text-text">
              Built for tour operators who want to <span className="gradient-text">grow faster</span>
            </h2>
            <p className="text-base text-text-2 leading-relaxed text-left mt-4 mb-8">
              Every feature exists because real tour companies asked for it. No bloat, no fluff.
            </p>
            <Link href="/pricing" className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all duration-300 hover:shadow-[0_4px_15px_rgba(79,70,229,0.25)] active:scale-[0.98] inline-block">
              View Packages →
            </Link>
          </div>
          <div className="flex flex-col gap-6 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm shadow-slate-100/50">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-4 items-start">
                <div className="text-2xl w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0">{b.icon}</div>
                <div>
                  <h4 className="text-base font-bold text-text mb-1 tracking-tight">{b.title}</h4>
                  <p className="text-sm text-text-2 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Section: Pricing Preview ───────────────────────────────────────────── */
function PricingSection() {
  return (
    <section className="py-24" id="pricing">
      <div className="container">
        <div className="text-center flex flex-col items-center gap-4 mb-16">
          <div className="badge badge-primary">Simple pricing</div>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] max-w-[700px] text-text">
            Plans that grow <span className="gradient-text">with your business</span>
          </h2>
          <p className="text-base text-text-2 max-w-[560px] leading-relaxed">Choose a package that fits your needs.</p>
        </div>
        <PricingCards />
        <p className="text-center text-text-3 text-sm mt-8">
          <Link href="/pricing" className="text-primary hover:text-primary-dark transition-colors font-semibold">Compare full features →</Link>
        </p>
      </div>
    </section>
  );
}

const FAQS = [
  { q: 'Can I use my own domain?', a: 'Yes. Every plan lets you connect your own domain (e.g. tours.yourcompany.com). We handle SSL and DNS automatically.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. No long-term contracts. You can cancel your subscription at any time from your account settings.' },
  { q: 'Do you support online payments?', a: 'Yes. We integrate with Stripe, bKash, Nagad and SSLCommerz so your customers can pay however they prefer.' },
  { q: 'How many staff can I add?', a: 'Depends on your plan — Starter supports 3, Growth supports 10, Business supports 25 staff members with role-based access.' },
  { q: 'Is my data secure?', a: 'All data is encrypted in transit and at rest. Each tour company\'s data is fully isolated from other tenants.' },
];

function FAQSection() {
  return (
    <section className="py-24 bg-bg-2" id="faq">
      <div className="container">
        <div className="text-center flex flex-col items-center gap-4 mb-16">
          <div className="badge badge-primary">Got questions?</div>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] max-w-[700px] text-text">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {FAQS.map((faq) => (
            <div key={faq.q} className="bg-white border border-slate-200/80 rounded-3xl p-7 transition-all duration-300 hover:border-slate-300 shadow-sm shadow-slate-100/50">
              <h4 className="text-base font-bold text-text mb-3 tracking-tight">{faq.q}</h4>
              <p className="text-sm text-text-2 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section: Final CTA ─────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden border-t border-slate-200/80">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="container relative z-10">
        <div className="text-center flex flex-col items-center gap-6 max-w-2xl mx-auto">
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight leading-[1.1] text-text rounded-3xl p-4">
            Ready to grow your<br /><span className="gradient-text">tour business?</span>
          </h2>
          <p className="text-base text-text-2 leading-relaxed max-w-[500px] mt-2">
            Join 100+ tour companies already using Tourbin to manage bookings, staff, and customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <Link href="/pricing" className="btn-custom-primary !px-8 !py-4 text-base">
              View Packages
            </Link>
            <Link href="/contact" className="btn-custom-secondary !px-8 !py-4 text-base">
              Talk to Sales
            </Link>
          </div>
          <p className="text-text-3 text-xs mt-4">
            No credit card · No setup fees · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Section: Contact ─────────────────────────────────────────────────────── */
function ContactSection() {
  return (
    <section className="py-24" id="contact">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
          <div>
            <div className="badge badge-primary mb-4">Get in touch</div>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] text-left text-text">
              Have questions? <br/><span className="gradient-text">We'd love to help.</span>
            </h2>
            <p className="text-base text-text-2 leading-relaxed text-left mt-4 mb-8">
              Whether you need a custom enterprise plan, have technical questions, or just want to say hi, our team is ready to assist you.
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl">📧</div>
                <div>
                  <div className="font-bold text-text">Email us</div>
                  <div className="text-text-2 text-sm">{`support@${BASE_DOMAIN.split(':')[0]}`}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl">💬</div>
                <div>
                  <div className="font-bold text-text">Live Chat</div>
                  <div className="text-text-2 text-sm">Available 24/7 inside the dashboard</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Main Page Export ───────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <CTASection />
    </>
  );
}
