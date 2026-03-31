'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import AnnouncementCard from '@/components/AnnouncementCard';
import Link from 'next/link';

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
  const message = searchParams.get('message');
  const error = searchParams.get('error');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data.announcements || []));
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-rca-black mb-4">Welcome to Riverhead</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join our vibrant community and connect with your neighbours
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
        <Link href="/apply" className="group">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-rca-green">
            <div className="text-rca-green text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-rca-black mb-2 group-hover:text-rca-green transition">Apply for Membership</h3>
            <p className="text-gray-600">Join the Riverhead Community Association and become part of our community</p>
          </div>
        </Link>
        <Link href="/login" className="group">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-rca-green">
            <div className="text-rca-green text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-rca-black mb-2 group-hover:text-rca-green transition">Member Login</h3>
            <p className="text-gray-600">Access your member portal, view payments, and manage your profile</p>
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
