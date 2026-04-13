'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { MembershipType } from '@/types';

export default function ApplyPage() {
  const [membershipType, setMembershipType] = useState<MembershipType | null>(null);
  const [submitted, setSubmitted] = useState<{ autoApproved: boolean; requiresPayment?: boolean; paymentLink?: string } | null>(null);

  if (submitted) {
    return (
      <Layout title="Application Submitted" showNav={false}>
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {submitted.autoApproved ? (
            <>
              <h2 className="text-2xl font-bold text-rca-black mb-3">Welcome to RCA!</h2>
              <p className="text-gray-600 mb-4">
                Your application has been approved.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-medium text-blue-800 mb-2">📧 Check Your Email</p>
                <p className="text-sm text-blue-700">
                  We&apos;ve sent you an email to set up your password. Check your inbox (and junk folder) then click the link to complete your account setup.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-medium text-amber-800 mb-2">💝 Want to Support RCA?</p>
                <p className="text-sm text-amber-700">
                  You can make donations anytime from your Member Portal.
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-rca-black mb-3">Application Received!</h2>
              <p className="text-gray-600 mb-4">
                Thank you for applying to join the Riverhead Community Association.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-medium text-blue-800 mb-2">📧 What happens next?</p>
                <p className="text-sm text-blue-700">
                  We&apos;ll review your application and send you an email within a few days. Keep an eye on your inbox (and junk folder).
                </p>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-medium text-amber-800 mb-2">💝 Want to Support RCA?</p>
                <p className="text-sm text-amber-700 mb-3">
                  While Friend membership is free, you can make a donation to support the Riverhead community.
                </p>
                <a
                  href="/donate"
                  className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition text-sm font-medium"
                >
                  Make a Donation →
                </a>
              </div>
            </>
          )}

          <a href="/" className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition">
            Back to Home
          </a>
        </div>
      </Layout>
    );
  }

  if (!membershipType) {
    return (
      <Layout title="Join Riverhead Community Association" showNav={false}>
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-gray-600 mb-6">Choose the membership type that applies to you:</p>

          <div
            onClick={() => setMembershipType('full_member')}
            className="p-6 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-rca-green hover:bg-green-50 transition group bg-white shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold group-hover:text-rca-green">Full Member</h2>
              <span className="text-rca-green text-2xl">→</span>
            </div>
            <p className="text-gray-600 mb-3">For Riverhead residents and ratepayers</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Voting rights at AGM</li>
              <li>✓ Access to members-only area</li>
              <li>✓ Facebook group access</li>
              <li>✓ $10 per household per year (paid on signup)</li>
            </ul>
          </div>

          <div
            onClick={() => setMembershipType('friend')}
            className="p-6 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-rca-green hover:bg-green-50 transition group bg-white shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold group-hover:text-rca-green">Friend of Riverhead</h2>
              <span className="text-rca-green text-2xl">→</span>
            </div>
            <p className="text-gray-600 mb-3">For supporters outside Riverhead</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Facebook group access</li>
              <li>✓ Support the community</li>
              <li>✓ Free</li>
            </ul>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={membershipType === 'full_member' ? 'Full Member Application' : 'Friend of Riverhead Application'} showNav={false}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setMembershipType(null)}
          className="mb-6 text-rca-green hover:underline text-sm"
        >
          ← Change membership type
        </button>

        {membershipType === 'full_member' ? (
          <MemberForm membershipType="full_member" onSubmitted={setSubmitted} />
        ) : (
          <MemberForm membershipType="friend" onSubmitted={setSubmitted} />
        )}
      </div>
    </Layout>
  );
}

function MemberForm({ membershipType, onSubmitted }: { 
  membershipType: MembershipType; 
  onSubmitted: (data: { autoApproved: boolean; requiresPayment?: boolean; paymentLink?: string }) => void 
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    consentGiven: false,
    parentalConsent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function update(field: string, value: string | boolean) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Prevent double submission
    if (submitting) return;
    
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, membershipType }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Application failed. Please try again.');
        setSubmitting(false);
        return;
      }

      // Success - show success screen or redirect to payment
      if (data.autoApproved && data.paymentLink) {
        // Redirect straight to Stripe checkout - payment is required
        window.location.href = data.paymentLink;
        return;
      }

      onSubmitted({
        autoApproved: data.autoApproved,
        requiresPayment: data.requiresPayment,
        paymentLink: data.paymentLink,
      });
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg border">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input
            type="text" required
            value={formData.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input
            type="text" required
            value={formData.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
        <input
          type="email" required
          value={formData.email}
          onChange={(e) => update('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => update('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
        />
      </div>

      {membershipType === 'full_member' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Riverhead Address *</label>
          <input
            type="text" required
            value={formData.address}
            onChange={(e) => update('address', e.target.value)}
            placeholder="Start typing your address..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Must be a Riverhead address.</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox" required
            checked={formData.consentGiven}
            onChange={(e) => update('consentGiven', e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-gray-700">
            {membershipType === 'full_member'
              ? 'I consent to my details being included in the RCA membership register as required by the Incorporated Societies Act 2022.'
              : 'I consent to receiving communications from the Riverhead Community Association.'
            } *
          </span>
        </label>

        {membershipType === 'full_member' && (
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.parentalConsent}
              onChange={(e) => update('parentalConsent', e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              If under 18 years, I have parent/guardian permission to join
            </span>
          </label>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-rca-green text-white py-3 rounded-lg font-medium hover:bg-rca-green-dark transition disabled:bg-gray-400"
      >
        {submitting ? 'Submitting...' : membershipType === 'full_member' ? 'Submit & Pay $10' : 'Submit Application'}
      </button>
    </form>
  );
}
