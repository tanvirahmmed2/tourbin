'use client';

import { usePathname } from 'next/navigation';

export default function Navbar({ title = "Dashboard" }) {
  const pathname = usePathname();
  
  const pathParts = pathname.split('/').filter(Boolean);
  const formattedTitle = pathParts.length > 0 
    ? pathParts.map(part => part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' ')).join(' / ')
    : title;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-8 shrink-0 relative z-10">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-text-3 uppercase tracking-wider">{formattedTitle}</span>
      </div>
    </header>
  );
}
