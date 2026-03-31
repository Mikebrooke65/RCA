'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { supabaseBrowser } from '@/lib/supabase/browser';

interface DashboardStats {
  totalMembers: number;
  pendingApplications: number;
  activeFriends: number;
  unpaidRenewals: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      if (!session) { router.push('/login'); return; }

      // Check admin role
      const roleRes = await fetch('/api/auth/check-role', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const { isAdmin } = await roleRes.json();
      if (!isAdmin) { router.push('/member'); return; }

      const statsRes = await fetch('/api/admin/stats');
      const data = await statsRes.json();
      setStats(data);
      setLoading(false);
    }
    init();
  }, [router]);

  if (loading) return (
    <Layout title="Admin Dashboard">
      <div className="text-center py-12 text-gray-500">Loading...</div>
    </Layout>
  );

  return (
    <Layout title="Admin Dashboard">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Members" value={stats?.totalMembers || 0} />
        <StatCard title="Pending Applications" value={stats?.pendingApplications || 0} color="yellow" />
        <StatCard title="Active Friends" value={stats?.activeFriends || 0} color="green" />
        <StatCard title="Unpaid Renewals" value={stats?.unpaidRenewals || 0} color="red" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickLink href="/admin/applications" icon="📋" title="Review Applications" />
        <QuickLink href="/admin/members" icon="👥" title="Manage Members" />
        <QuickLink href="/admin/payments" icon="💳" title="Payment Reconciliation" />
        <QuickLink href="/admin/renewals" icon="🔄" title="Renewal Management" />
        <QuickLink href="/admin/facebook" icon="📘" title="Facebook Group Sync" />
        <QuickLink href="/admin/audit" icon="📝" title="Audit Log" />
      </div>
    </Layout>
  );
}

function StatCard({ title, value, color = 'blue' }: { title: string; value: number; color?: string }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className={`p-6 rounded-lg border ${colors[color as keyof typeof colors]}`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm mt-1">{title}</div>
    </div>
  );
}

function QuickLink({ href, icon, title }: { href: string; icon: string; title: string }) {
  return (
    <a href={href} className="block p-5 bg-white rounded-lg border hover:border-rca-green hover:shadow-md transition group">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <span className="font-semibold text-rca-black group-hover:text-rca-green transition">{title}</span>
      </div>
    </a>
  );
}
