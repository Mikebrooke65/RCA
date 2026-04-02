'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

const navItems = [
  { href: '/member', label: 'Dashboard' },
  { href: '/member/household', label: 'Household' },
  { href: '/member/payments', label: 'Payments' },
  { href: '/member/documents', label: 'Documents' },
  { href: '/member/update', label: 'My Details' },
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
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium rounded transition min-w-[100px] text-center ${
                isActive
                  ? 'bg-white text-emerald-800'
                  : 'bg-emerald-700 text-white hover:bg-emerald-600'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className="px-4 py-2 text-sm font-medium rounded bg-slate-600 text-white hover:bg-slate-500 transition min-w-[100px] text-center"
          >
            Admin →
          </Link>
        )}
      </div>
    </nav>
  );
}
