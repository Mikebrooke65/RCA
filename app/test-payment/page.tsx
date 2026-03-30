'use client';

import { useState } from 'react';

export default function TestPaymentPage() {
  const [memberId, setMemberId] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generatePaymentLink() {
    setLoading(true);
    setError('');
    setPaymentLink('');
    
    try {
      const response = await fetch('/api/member/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPaymentLink(data.paymentLink);
      } else {
        setError(data.error || 'Failed to generate payment link');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Test Payment Link Generator</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Member ID
            </label>
            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter member UUID"
            />
          </div>
          
          <button
            onClick={generatePaymentLink}
            disabled={!memberId || loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Generating...' : 'Generate Payment Link'}
          </button>
          
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {paymentLink && (
            <div className="p-4 bg-green-100 border border-green-400 rounded">
              <p className="font-medium mb-2">Payment Link Generated!</p>
              <a 
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {paymentLink}
              </a>
            </div>
          )}
        </div>
        
        <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
          <p className="font-medium mb-2">How to test:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Run the SQL: supabase/create_payment_for_testing.sql</li>
            <li>Get your member ID from the database</li>
            <li>Paste it above and click Generate</li>
            <li>Click the payment link to test Stripe checkout</li>
            <li>Use test card: 4242 4242 4242 4242</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
