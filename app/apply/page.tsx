'use client';

import { useState } from 'react';
import { MembershipType } from '@/types';

export default function ApplyPage() {
  const [membershipType, setMembershipType] = useState<MembershipType | null>(null);

  if (!membershipType) {
    return (
      <main className="min-h-screen p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Join Riverhead Community Association</h1>
        
        <div className="space-y-4">
          <div 
            onClick={() => setMembershipType('full_member')}
            className="p-6 border-2 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Full Member</h2>
            <p className="text-gray-600 mb-2">For Riverhead residents and ratepayers</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Voting rights</li>
              <li>✓ Access to members-only area</li>
              <li>✓ Facebook group access</li>
              <li>✓ $10 per household per year</li>
            </ul>
          </div>

          <div 
            onClick={() => setMembershipType('friend')}
            className="p-6 border-2 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Friend of Riverhead</h2>
            <p className="text-gray-600 mb-2">For supporters outside Riverhead</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Facebook group access</li>
              <li>✓ Newsletter updates</li>
              <li>✓ Support the community</li>
              <li>✓ Free</li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <button 
        onClick={() => setMembershipType(null)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>
      
      {membershipType === 'full_member' ? (
        <FullMemberForm />
      ) : (
        <FriendForm />
      )}
    </main>
  );
}

function FullMemberForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    consentGiven: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          membershipType: 'full_member',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Application failed');
        return;
      }

      alert('Application submitted! Please check your email to verify.');
      window.location.href = '/';
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-3xl font-bold">Full Member Application</h1>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">First Name *</label>
        <input 
          type="text" 
          required 
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          className="w-full p-2 border rounded" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Last Name *</label>
        <input 
          type="text" 
          required 
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          className="w-full p-2 border rounded" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email *</label>
        <input 
          type="email" 
          required 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full p-2 border rounded" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Phone</label>
        <input 
          type="tel" 
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full p-2 border rounded" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Riverhead Address *</label>
        <input 
          type="text" 
          required 
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          placeholder="Start typing your address..."
          className="w-full p-2 border rounded" 
        />
        <p className="text-xs text-gray-500 mt-1">
          Must be a Riverhead address. We'll validate this.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <label className="flex items-start space-x-2">
          <input 
            type="checkbox" 
            required 
            checked={formData.consentGiven}
            onChange={(e) => setFormData({...formData, consentGiven: e.target.checked})}
            className="mt-1" 
          />
          <span className="text-sm">
            I consent to my details being included in the RCA membership register as required by the Incorporated Societies Act 2022. *
          </span>
        </label>
      </div>

      <button 
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {submitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}

function FriendForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    consentGiven: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          membershipType: 'friend',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Application failed');
        return;
      }

      alert('Application submitted! Please check your email to verify.');
      window.location.href = '/';
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-3xl font-bold">Friend of Riverhead Application</h1>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">First Name *</label>
        <input 
          type="text" 
          required 
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          className="w-full p-2 border rounded" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Last Name *</label>
        <input 
          type="text" 
          required 
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          className="w-full p-2 border rounded" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email *</label>
        <input 
          type="email" 
          required 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full p-2 border rounded" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Phone</label>
        <input 
          type="tel" 
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full p-2 border rounded" 
        />
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <label className="flex items-start space-x-2">
          <input 
            type="checkbox" 
            required 
            checked={formData.consentGiven}
            onChange={(e) => setFormData({...formData, consentGiven: e.target.checked})}
            className="mt-1" 
          />
          <span className="text-sm">
            I consent to receiving communications from RCA. *
          </span>
        </label>
      </div>

      <button 
        type="submit"
        disabled={submitting}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
      >
        {submitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
