'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import MemberNav from '@/components/MemberNav';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function DonatePage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    
    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount < 1) {
      setError('Please enter a valid amount (minimum $1)');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      const res = await fetch('/api/member/donate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ amount: donationAmount }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to process donation');
        setSubmitting(false);
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = data.checkoutUrl;
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  if (loading) return (
    <Layout title="Make a Donation">
      <MemberNav />
      <div className="text-center py-12 text-gray-500">Loading...</div>
    </Layout>
  );

  return (
    <Layout title="Make a Donation">
      <MemberNav />
      <div className="max-w-md mx-auto mt-6">
        <div className="bg-white rounded-lg border p-6">
          <p className="text-gray-600 mb-6">
            Your donation helps support the Riverhead community. You&apos;ll receive a receipt by email.
          </p>

          <form onSubmit={handleDonate} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Donation Amount (NZD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {[10, 20, 50, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset.toString())}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                    amount === preset.toString()
                      ? 'bg-rca-green text-white border-rca-green'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-rca-green'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting || !amount}
              className="w-full bg-rca-green text-white py-3 rounded-lg font-medium hover:bg-rca-green-dark transition disabled:bg-gray-400"
            >
              {submitting ? 'Processing...' : `Donate $${amount || '0'}`}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Payments processed securely by Stripe
          </p>
        </div>

        <a href="/member" className="block text-center mt-4 text-sm text-gray-600 hover:text-rca-green">
          ← Back to Portal
        </a>
      </div>
    </Layout>
  );
}
