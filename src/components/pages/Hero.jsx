import Link from 'next/link';
import { BASE_URL } from '@/lib/secret';

export default function Hero() {
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
            <span className="text-[11px] font-bold text-slate-500 ml-3 tracking-wide bg-white/60 px-2 py-0.5 rounded text-center min-w-[200px] mx-auto border border-white/50 shadow-sm">{BASE_URL}/dashboard</span>
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