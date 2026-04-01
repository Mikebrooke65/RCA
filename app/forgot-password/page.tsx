'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabaseBrowser.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <Layout title="Check Your Email" showNav={false}>
        <div className="max-w-md mx-auto text-center py-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-rca-black mb-3">Email Sent!</h2>
          <p className="text-gray-600 mb-4">
            If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please allow a few minutes for the email to arrive. Check your spam or junk folder if you don't see it in your inbox.
          </p>
          <Link href="/login" className="text-rca-green hover:underline text-sm">
            Back to Login
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Reset Password" showNav={false}>
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-rca-black mb-2">Forgot your password?</h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email" required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-rca-green text-white py-3 rounded-lg font-medium hover:bg-rca-green-dark transition disabled:bg-gray-400"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-rca-green hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
