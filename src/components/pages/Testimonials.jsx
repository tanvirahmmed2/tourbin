import { TestimonialCards } from '@/components/card/TestimonialCards';

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-bg-2" id="testimonials">
      <div className="container">
        <div className="text-center flex flex-col items-center gap-4 mb-16">
          <div className="badge badge-primary">Customer stories</div>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] max-w-[700px] text-slate-900">
            Travelers <span className="gradient-text">love our tours</span>
          </h2>
        </div>
        <TestimonialCards />
      </div>
    </section>
  );
}