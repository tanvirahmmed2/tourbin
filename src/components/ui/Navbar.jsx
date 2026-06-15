'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';

const NAV_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: 'https://tourbin-demo.disibin.com/', label: 'Demo' },
];

export default function Navbar({ session }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);



  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      window.location.href = '/login';
    } catch (err) {
      window.location.href = '/login';
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all bg-white duration-300 h-16 px-4 flex items-center justify-center`}>
      <div className="container flex items-center justify-between ">
        <Link href="/" className="flex items-center gap-2.5 no-underline group">
          <span className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
            Tourbin
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={`group relative text-sm font-medium transition-colors duration-300 py-1 ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                {link.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 rounded-t-full ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-primary text-white font-medium text-sm cursor-pointer hover:shadow-md hover:shadow-primary/20 transition-all duration-300"
              >
                {session.name ? session.name.charAt(0).toUpperCase() : 'U'}
              </button>
              
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 flex flex-col z-50 overflow-hidden animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100 mb-1 bg-slate-50/50">
                    <p className="text-sm font-bold text-text truncate">{session.name || 'User'}</p>
                    <p className="text-xs font-semibold text-text-3 truncate mt-0.5">{session.email}</p>
                  </div>
                  
                  
                  <Link href="/dashboard/profile" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-sky-50 transition-colors flex items-center gap-2">
                    Profile
                  </Link>
                  
                  {['owner', 'manager', 'support'].includes(session.role) &&  (
                    <Link href={`/control/${session.role}`} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-sky-50 transition-colors flex items-center gap-2 border-t border-slate-100 mt-1 pt-2">
                      Control Panel
                    </Link>
                  )}
                  
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-300 py-2 px-3">
                Log In
              </Link>
              <Link href="/register" className="btn-custom-primary">
                Get Started
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
                <>
                  <Link href={session.tenant_id ? '/' : '/dashboard'} className="btn-custom-primary text-center w-full" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/dashboard/profile" className="btn-custom-secondary text-center w-full" onClick={() => setMenuOpen(false)}>
                    Profile Settings
                  </Link>
                  {['owner', 'manager', 'support'].includes(session.role) && !session.tenant_id && (
                    <Link href={`/control/${session.role}`} className="btn-custom-secondary text-center w-full" onClick={() => setMenuOpen(false)}>
                      Control Panel
                    </Link>
                  )}
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full py-2.5 rounded-xl bg-danger/5 border border-danger/15 text-danger font-bold text-sm hover:bg-danger/10 transition-all text-center">
                    Sign Out
                  </button>
                </>
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
