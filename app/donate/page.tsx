'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

export default function PublicDonatePage() {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    
    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount < 1) {
      setError('Please enter a valid amount (minimum $1)');
      return;
    }

    if (!email) {
      setError('Please enter your email for the receipt');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: donationAmount, email, name }),
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

  return (
    <Layout title="Make a Donation" showNav={false}>
      <div className="max-w-md mx-auto">
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
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Optional - for receipt"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="For your donation receipt"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Donation Amount (NZD) *
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
              disabled={submitting || !amount || !email}
              className="w-full bg-rca-green text-white py-3 rounded-lg font-medium hover:bg-rca-green-dark transition disabled:bg-gray-400"
            >
              {submitting ? 'Processing...' : `Donate $${amount || '0'}`}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Payments processed securely by Stripe
          </p>
        </div>

        <a href="/" className="block text-center mt-4 text-sm text-gray-600 hover:text-rca-green">
          ← Back to Home
        </a>
      </div>
    </Layout>
  );
}
