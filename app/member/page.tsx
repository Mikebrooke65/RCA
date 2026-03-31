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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const [profileRes, announcementsRes] = await Promise.all([
        fetch('/api/member/profile', { headers: { Authorization: `Bearer ${session.access_token}` } }),
        fetch('/api/announcements?members=true'),
      ]);

      if (profileRes.status === 401) { router.push('/login'); return; }

      const profileData = await profileRes.json();
      const announcementsData = await announcementsRes.json();

      setMember(profileData.member);
      setAnnouncements(announcementsData.announcements || []);
      setLoading(false);
    }
    loadProfile();
  }, [router]);

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

        {/* Portal Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PortalLink href="/member/household" icon="🏠" title="Household Members" desc="View others at your address" />
          <PortalLink href="/member/payments" icon="💳" title="Payment History" desc="View your payments and receipts" />
          <PortalLink href="/member/documents" icon="📄" title="Documents" desc="Minutes, constitution and more" />
          <PortalLink href="/member/update" icon="✏️" title="Update Details" desc="Update your contact information" />
        </div>
      </div>
    </Layout>
  );
}

function PortalLink({ href, icon, title, desc }: { href: string; icon: string; title: string; desc: string }) {
  return (
    <a href={href} className="block p-5 bg-white rounded-lg border hover:border-rca-green hover:shadow-md transition group">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="font-semibold text-rca-black group-hover:text-rca-green transition">{title}</p>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
      </div>
    </a>
  );
}
