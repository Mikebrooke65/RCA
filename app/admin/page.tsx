'use client';

import { useEffect, useState } from 'react';

interface DashboardStats {
  totalMembers: number;
  pendingApplications: number;
  activeFriends: number;
  unpaidRenewals: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(setStats);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold">RCA Admin Dashboard</h1>
      </nav>

      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Members" value={stats?.totalMembers || 0} />
          <StatCard title="Pending Applications" value={stats?.pendingApplications || 0} color="yellow" />
          <StatCard title="Active Friends" value={stats?.activeFriends || 0} color="green" />
          <StatCard title="Unpaid Renewals" value={stats?.unpaidRenewals || 0} color="red" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickLink href="/admin/applications" title="Review Applications" />
          <QuickLink href="/admin/members" title="Manage Members" />
          <QuickLink href="/admin/payments" title="Payment Reconciliation" />
          <QuickLink href="/admin/renewals" title="Renewal Management" />
          <QuickLink href="/admin/households" title="Household Management" />
          <QuickLink href="/admin/facebook" title="Facebook Group Sync" />
          <QuickLink href="/admin/communications" title="Send Communications" />
          <QuickLink href="/admin/audit" title="Audit Log" />
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, color = 'blue' }: { title: string; value: number; color?: string }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
  };

  return (
    <div className={`p-6 rounded-lg ${colors[color as keyof typeof colors]}`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm mt-1">{title}</div>
    </div>
  );
}

function QuickLink({ href, title }: { href: string; title: string }) {
  return (
    <a 
      href={href}
      className="block p-6 bg-white rounded-lg border hover:border-blue-500 hover:shadow-md transition"
    >
      <h3 className="font-semibold">{title}</h3>
    </a>
  );
}
