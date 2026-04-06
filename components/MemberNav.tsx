'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

const navItems = [
  { href: '/member', label: 'Dashboard', icon: '🏠' },
  { href: '/member/household', label: 'Household', icon: '👨‍👩‍👧' },
  { href: '/member/payments', label: 'Payments', icon: '💳' },
  { href: '/member/documents', label: 'Documents', icon: '📄' },
  { href: '/member/update', label: 'My Details', icon: '✏️' },
  { href: '/member/donate', label: 'Donate', icon: '💝' },
  { href: 'https://www.facebook.com/share/g/17SFKoqsSj/', label: 'Facebook', icon: '📘', external: true },
];

export default function MemberNav() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      
      if (session?.access_token) {
        const res = await fetch('/api/auth/check-role', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const data = await res.json();
        setIsAdmin(data.isAdmin);
      }
    }
    checkAdmin();
  }, []);

  return (
    <nav className="mb-6">
      <div className="inline-flex items-center gap-1 py-2 px-2 bg-emerald-800 rounded-lg overflow-x-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isExternal = 'external' in item && item.external;
          
          if (isExternal) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 text-sm font-medium rounded transition min-w-[90px] text-center bg-emerald-700 text-white hover:bg-emerald-600 flex items-center justify-center gap-1"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            );
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 text-sm font-medium rounded transition min-w-[90px] text-center flex items-center justify-center gap-1 ${
                isActive
                  ? 'bg-white text-emerald-800'
                  : 'bg-emerald-700 text-white hover:bg-emerald-600'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className="px-3 py-2 text-sm font-medium rounded bg-slate-600 text-white hover:bg-slate-500 transition min-w-[90px] text-center flex items-center justify-center gap-1"
          >
            <span>⚙️</span>
            <span>Admin</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
