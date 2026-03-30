'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

function HomeContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const error = searchParams.get('error');

  return (
    <Layout>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-rca-black mb-4">
          Welcome to Riverhead
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join our vibrant community and connect with your neighbors
        </p>
      </div>
      
      {/* Messages */}
      {message === 'email_verified' && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          ✓ Email verified successfully! Your application is now pending admin approval.
        </div>
      )}
      
      {message === 'already_verified' && (
        <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
          Your email is already verified.
        </div>
      )}
      
      {error === 'invalid_token' && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          Invalid or expired verification link.
        </div>
      )}
      
      {error === 'token_expired' && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          Verification link has expired. Please apply again.
        </div>
      )}
      
      {error === 'verification_failed' && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          Verification failed. Please try again or contact support.
        </div>
      )}
      
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link href="/apply" className="group">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-rca-green">
            <div className="text-rca-green text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-rca-black mb-2 group-hover:text-rca-green transition">
              Apply for Membership
            </h3>
            <p className="text-gray-600">
              Join the Riverhead Community Association and become part of our community
            </p>
          </div>
        </Link>
        
        <Link href="/login" className="group">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-rca-green">
            <div className="text-rca-green text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-rca-black mb-2 group-hover:text-rca-green transition">
              Member Login
            </h3>
            <p className="text-gray-600">
              Access your member portal, view payments, and manage your profile
            </p>
          </div>
        </Link>
      </div>
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
