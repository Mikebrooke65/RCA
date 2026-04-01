'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import AnnouncementCard from '@/components/AnnouncementCard';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase/browser';

interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  published_at: string;
  is_public: boolean;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get('message');
  const error = searchParams.get('error');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [membershipFee, setMembershipFee] = useState<number | null>(null);

  useEffect(() => {
    // Listen for auth events - redirect to reset password if recovery
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        router.push('/reset-password');
      }
    });

    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data.announcements || []));

    // Fetch current membership fee
    fetch('/api/admin/membership-years')
      .then(res => res.json())
      .then(data => {
        if (data.years && data.years.length > 0) {
          setMembershipFee(data.years[0].renewal_fee);
        }
      });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <Layout showNav={false}>
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-rca-black mb-4">Welcome to Riverhead</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join our Association! In accordance with the new Incorporated Societies Act we have implemented a little more process to ensuring we maintain an accurate list of members and this Portal manages that for us. Membership is only {membershipFee !== null ? `$${membershipFee}` : '...'} per year, per household (multiple people at that address can join). Access our Facebook site, the association&apos;s resources and any key announcements.
        </p>
      </div>

      {/* Messages */}
      {message === 'email_verified' && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          ✓ Email verified successfully! Your application is now pending admin approval.
        </div>
      )}
      {error === 'invalid_token' && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          Invalid or expired verification link.
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
        <Link href="/apply" className="group">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-2 border-gray-200 hover:border-rca-green h-full flex flex-col">
            <div className="text-rca-green text-3xl mb-3">📝</div>
            <h3 className="text-lg font-bold text-rca-black mb-2 group-hover:text-rca-green transition">Apply for Membership</h3>
            <p className="text-gray-600 text-sm flex-grow">Join the Riverhead Community Association and become part of our community. {membershipFee !== null ? `$${membershipFee}` : '...'} annual membership per household, no age requirement but under 18 years requires parent/guardian approval.</p>
            <div className="mt-3 text-rca-green font-medium text-sm">Apply now →</div>
          </div>
        </Link>
        <Link href="/login" className="group">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-2 border-gray-200 hover:border-rca-green h-full flex flex-col">
            <div className="text-rca-green text-3xl mb-3">🔐</div>
            <h3 className="text-lg font-bold text-rca-black mb-2 group-hover:text-rca-green transition">Member Login</h3>
            <p className="text-gray-600 text-sm flex-grow">Access your member portal, view payments, and manage your profile.</p>
            <div className="mt-3 text-rca-green font-medium text-sm">Sign in →</div>
          </div>
        </Link>
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-rca-black mb-6">Community News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
