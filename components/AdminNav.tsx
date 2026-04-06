'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '🏠' },
  { href: '/admin/applications', label: 'Applications', icon: '📋' },
  { href: '/admin/members', label: 'Members', icon: '👥' },
  { href: '/admin/payments', label: 'Payments', icon: '💳' },
  { href: '/admin/renewals', label: 'Renewals', icon: '🔄' },
  { href: '/admin/announcements', label: 'Announcements', icon: '📢' },
  { href: '/admin/documents', label: 'Documents', icon: '📁' },
  { href: '/admin/audit', label: 'Audit', icon: '📝' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6">
      <div className="inline-flex items-center gap-1 py-2 px-2 bg-slate-700 rounded-lg overflow-x-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 text-sm font-medium rounded transition min-w-[90px] text-center flex items-center justify-center gap-1 ${
                isActive
                  ? 'bg-rca-green text-white'
                  : 'bg-slate-600 text-gray-200 hover:bg-slate-500'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
        <Link
          href="/member"
          className="px-3 py-2 text-sm font-medium rounded bg-emerald-700 text-white hover:bg-emerald-600 transition min-w-[90px] text-center flex items-center justify-center gap-1"
        >
          <span>👤</span>
          <span>Portal</span>
        </Link>
      </div>
    </nav>
  );
}
