const FEATURES = [
  { icon: '🗺️', title: 'Tour Management', desc: 'Create, publish and manage tours with rich itineraries, images, pricing tiers and availability windows.' },
  { icon: '📋', title: 'Booking System', desc: 'Accept bookings online with real-time seat availability, automatic confirmations and cancellation handling.' },
  { icon: '👥', title: 'Customer CRM', desc: 'Track customers, their booking history, lifetime value and preferences in one place.' },
  { icon: '💳', title: 'Online Payments', desc: 'Accept Stripe, bKash, Nagad and SSLCommerz. Full payment lifecycle from invoice to receipt.' },
  { icon: '📊', title: 'Analytics', desc: 'Revenue charts, booking trends, top tours, customer sources — everything you need to make better decisions.' },
  { icon: '🌐', title: 'Custom Domains', desc: 'Give each tour company their own branded website at their own domain with zero extra config.' },
];

export default function FeaturesSection() {
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