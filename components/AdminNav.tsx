'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '🏠' },
  { href: '/admin/applications', label: 'Applications', icon: '📋' },
  { href: '/admin/members', label: 'Members', icon: '👥' },
  { href: '/admin/payments', label: 'Payments', icon: '💳' },
  { href: '/admin/renewals', label: 'Renewals', icon: '🔄' },
  { href: '/admin/audit', label: 'Audit', icon: '📝' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-rca-black text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition ${
                  isActive
                    ? 'border-rca-green text-rca-green'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-500'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
