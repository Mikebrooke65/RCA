'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import MemberNav from '@/components/MemberNav';
import AnnouncementCard from '@/components/AnnouncementCard';
import { supabaseBrowser } from '@/lib/supabase/browser';

interface MemberData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  membership_type: string;
  membership_status: string;
  date_joined: string;
  households?: { normalized_address: string };
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  published_at: string;
  is_public: boolean;
}

export default function MemberPortal() {
  const router = useRouter();
  const [member, setMember] = useState<MemberData | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [unpaidAmount, setUnpaidAmount] = useState<number | null>(null);
  const [payingNow, setPayingNow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const [profileRes, announcementsRes, paymentsRes] = await Promise.all([
        fetch('/api/member/profile', { headers: { Authorization: `Bearer ${session.access_token}` } }),
        fetch('/api/announcements?members=true'),
        fetch('/api/member/payments', { headers: { Authorization: `Bearer ${session.access_token}` } }),
      ]);

      if (profileRes.status === 401) { router.push('/login'); return; }

      const profileData = await profileRes.json();
      const announcementsData = await announcementsRes.json();
      const paymentsData = await paymentsRes.json();

      setMember(profileData.member);
      setAnnouncements(announcementsData.announcements || []);
      
      // Check for unpaid payments
      const unpaid = (paymentsData.payments || []).find((p: any) => p.payment_status === 'unpaid');
      if (unpaid) setUnpaidAmount(unpaid.amount);
      
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  async function handlePayNow() {
    if (!member) return;
    setPayingNow(true);
    try {
      const res = await fetch('/api/member/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: member.id }),
      });
      const data = await res.json();
      if (data.paymentLink) {
        window.location.href = data.paymentLink;
      }
    } catch {
      setPayingNow(false);
    }
  }

  if (loading) return (
    <Layout title="Member Portal">
      <MemberNav />
      <div className="text-center py-12 text-gray-500">Loading...</div>
    </Layout>
  );

  if (!member) return null;

  return (
    <Layout title={`Welcome, ${member.first_name}!`}>
      <MemberNav />
      <div className="max-w-4xl mx-auto space-y-6 mt-6">
        {/* Unpaid Payment Banner */}
        {unpaidAmount && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-lg font-bold text-red-800">⚠️ Membership Fee Outstanding</p>
                <p className="text-red-700">Your ${unpaidAmount.toFixed(2)} annual membership fee has not been paid.</p>
              </div>
              <button
                onClick={handlePayNow}
                disabled={payingNow}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 whitespace-nowrap"
              >
                {payingNow ? 'Redirecting...' : `Pay $${unpaidAmount.toFixed(2)} Now`}
              </button>
            </div>
          </div>
        )}
        {/* Profile Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-rca-black mb-4">Your Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Email:</span><span className="ml-2 font-medium">{member.email}</span></div>
            <div><span className="text-gray-500">Phone:</span><span className="ml-2 font-medium">{member.phone || 'Not provided'}</span></div>
            <div><span className="text-gray-500">Membership:</span><span className="ml-2 font-medium capitalize">{member.membership_type.replace('_', ' ')}</span></div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span className={`ml-2 font-medium capitalize ${member.membership_status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                {member.membership_status}
              </span>
            </div>
            <div><span className="text-gray-500">Member Since:</span><span className="ml-2 font-medium">{new Date(member.date_joined).toLocaleDateString('en-NZ')}</span></div>
            {member.households && (
              <div><span className="text-gray-500">Address:</span><span className="ml-2 font-medium">{member.households.normalized_address}</span></div>
            )}
          </div>
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-rca-black mb-4">Community News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {announcements.map((a) => (
                <AnnouncementCard key={a.id} announcement={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
