import Link from 'next/link';
import { BASE_URL } from '@/lib/secret';

export default function Hero() {
  return (
    <section className="relative pt-10 pb-[120px] overflow-hidden min-h-[100vh] flex items-center  md:pb-[100px]">
      {/* Dynamic Animated Background Orbs */}
      <div className="absolute top-[5%] left-[20%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.12)_0%,transparent_70%)] pointer-events-none animate-blob" />
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,transparent_70%)] pointer-events-none animate-blob" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[10%] left-[30%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(2,132,199,0.08)_0%,transparent_70%)] pointer-events-none animate-blob" style={{ animationDelay: '4s' }} />
      
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center max-w-[840px] mx-auto mb-24">
          <div className="badge badge-primary mb-8 animate-fade-up">
            ✦ Trusted by 100+ Tour Companies
          </div>
          <h1 className="text-[clamp(2.75rem,6.5vw,5rem)] font-extrabold leading-[1.05] tracking-tight mb-8 text-slate-900 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Tour Management Software<br />
            for <span className="gradient-text">Modern Travel Agencies</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-12 max-w-[620px] animate-fade-up" style={{ animationDelay: '0.2s' }}>
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
        </div>

       
      </div>
    </section>
  );
}