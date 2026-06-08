'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar({ session }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-navbar py-3 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)]' : 'bg-transparent py-6'} px-4`}>
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline group">
          <span className="font-extrabold text-xl tracking-tight text-text">Tourbin</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={`group relative text-sm font-bold transition-colors duration-300 py-1 ${isActive ? 'text-text' : 'text-text-2 hover:text-text'}`}>
                {link.label}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 rounded-full ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <Link href={session.tenant_id ? '/' : (session.role === 'owner' ? '/control/owner' : session.role === 'manager' ? '/control/manager' : session.role === 'support' ? '/control/support' : '/dashboard')} className="btn-custom-primary">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-text-2 hover:text-text transition-colors duration-300 py-2 px-3">
                Sign In
              </Link>
              <Link href="/register" className="btn-custom-primary">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[6px] w-8 h-8 bg-transparent border-none cursor-pointer z-50 relative"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-[2px] bg-text transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
          <span className={`w-6 h-[2px] bg-text transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-[2px] bg-text transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 py-6 shadow-xl flex flex-col md:hidden">
          <div className="container flex flex-col gap-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2 text-base font-semibold border-b border-slate-200/40 ${isActive ? 'text-primary' : 'text-text-2 hover:text-text'}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex flex-col gap-3 pt-4">
              {session ? (
                <Link href={session.tenant_id ? '/' : (session.role === 'owner' ? '/control/owner' : session.role === 'manager' ? '/control/manager' : session.role === 'support' ? '/control/support' : '/dashboard')} className="btn-custom-primary text-center w-full" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-custom-secondary text-center w-full" onClick={() => setMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-custom-primary text-center w-full" onClick={() => setMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
