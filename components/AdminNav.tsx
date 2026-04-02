'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/applications', label: 'Applications' },
  { href: '/admin/members', label: 'Members' },
  { href: '/admin/payments', label: 'Payments' },
  { href: '/admin/renewals', label: 'Renewals' },
  { href: '/admin/announcements', label: 'Announcements' },
  { href: '/admin/documents', label: 'Documents' },
  { href: '/admin/audit', label: 'Audit' },
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
              className={`px-4 py-2 text-sm font-medium rounded transition min-w-[100px] text-center ${
                isActive
                  ? 'bg-rca-green text-white'
                  : 'bg-slate-600 text-gray-200 hover:bg-slate-500'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/member"
          className="px-4 py-2 text-sm font-medium rounded bg-emerald-700 text-white hover:bg-emerald-600 transition min-w-[100px] text-center"
        >
          Portal →
        </Link>
      </div>
    </nav>
  );
}
