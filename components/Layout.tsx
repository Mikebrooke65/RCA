'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showNav?: boolean;
}

export default function Layout({ children, title, showNav = true }: LayoutProps) {
  const [stats, setStats] = useState<{ members: number; households: number } | null>(null);

  useEffect(() => {
    if (showNav) {
      fetch('/api/admin/stats')
        .then(res => res.json())
        .then(data => setStats({ members: data.totalMembers || 0, households: data.totalHouseholds || 0 }))
        .catch(() => {});
    }
  }, [showNav]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/logo.jpg"
                alt="Riverhead Community Association"
                width={60}
                height={60}
                className="rounded"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-rca-black">
                  Riverhead Community Association
                </h1>
                <p className="text-sm text-gray-600">Membership Portal</p>
              </div>
            </Link>

            {/* Stats Cards + Logout */}
            {showNav && (
              <div className="flex items-center space-x-4">
                {stats && (
                  <>
                    <div className="hidden sm:flex items-center space-x-3">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center">
                        <div className="text-lg font-bold text-emerald-700">{stats.members}</div>
                        <div className="text-xs text-emerald-600">Members</div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-center">
                        <div className="text-lg font-bold text-blue-700">{stats.households}</div>
                        <div className="text-xs text-blue-600">Households</div>
                      </div>
                    </div>
                  </>
                )}
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Page Title */}
      {title && (
        <div className="bg-rca-green text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-rca-black text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-3">About RCA</h3>
              <p className="text-gray-300 text-sm">
                The Riverhead Community Association is focused on the advancement and improvement of Riverhead and its environment. It has met and worked in Riverhead for many, many years and today continues to do as much as it can. It meets quarterly, with any sub-committees meeting as and when required – to make things happen!
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/apply" className="text-gray-300 hover:text-rca-green transition">
                    Apply for Membership
                  </Link>
                </li>
                <li>
                  <Link href="/member" className="text-gray-300 hover:text-rca-green transition">
                    Member Portal
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Contact</h3>
              <p className="text-gray-300 text-sm">
                Email: riverheadcommunityassociation@gmail.com
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Riverhead Resident and Ratepayers Association Incorporated. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
