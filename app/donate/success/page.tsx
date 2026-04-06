'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-white rounded-lg border p-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-rca-black mb-3">Thank You!</h2>
        <p className="text-gray-600 mb-6">
          Your donation has been received. We really appreciate your support for the Riverhead community.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-medium text-blue-800 mb-2">📧 Receipt Coming</p>
          <p className="text-sm text-blue-700">
            You&apos;ll receive a donation receipt by email shortly.
          </p>
        </div>

        {sessionId && (
          <p className="text-xs text-gray-400 mb-4">
            Reference: {sessionId.slice(-8)}
          </p>
        )}

        <a
          href="/"
          className="inline-block bg-rca-green text-white px-6 py-3 rounded-lg font-medium hover:bg-rca-green-dark transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Layout title="Donation Successful" showNav={false}>
      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </Layout>
  );
}
