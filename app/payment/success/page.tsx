'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your membership is now active.
        </p>
        
        {sessionId && (
          <p className="text-xs text-gray-400 mb-6">
            Session ID: {sessionId}
          </p>
        )}
        
        <div className="space-y-3">
          <a
            href="/member"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Go to Member Portal
          </a>
          <a
            href="/"
            className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
