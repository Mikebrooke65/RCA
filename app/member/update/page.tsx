'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import MemberNav from '@/components/MemberNav';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function UpdateDetailsPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '' });
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setToken(session.access_token);

      const res = await fetch('/api/member/profile', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      if (data.member) {
        setForm({
          first_name: data.member.first_name || '',
          last_name: data.member.last_name || '',
          phone: data.member.phone || '',
        });
        setEmail(data.member.email || '');
        setAddress(data.member.households?.normalized_address || '');
      }
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    const res = await fetch('/api/member/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage('✓ Details updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setError('Failed to update details. Please try again.');
    }
    setSaving(false);
  }

  if (loading) return (
    <Layout title="Update Details">
      <MemberNav />
      <div className="text-center py-12 text-gray-500">Loading...</div>
    </Layout>
  );

  return (
    <Layout title="Update My Details">
      <MemberNav />
      <div className="max-w-lg mx-auto mt-6">
        <div className="bg-white rounded-lg border p-6">
          {message && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{message}</div>}
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" required value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" required value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
                placeholder="e.g. 021 123 4567" />
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Contact Information (Read Only)</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Email Address</label>
                  <div className="px-3 py-2 bg-gray-50 border rounded-lg text-gray-600">{email}</div>
                </div>
                {address && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Address</label>
                    <div className="px-3 py-2 bg-gray-50 border rounded-lg text-gray-600">{address}</div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                To change your email or address, please contact us at{' '}
                <a href="mailto:membership@riverheadcommunity.org.nz" className="text-rca-green hover:underline">
                  membership@riverheadcommunity.org.nz
                </a>
              </p>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={saving}
                className="w-full bg-rca-green text-white py-3 rounded-lg font-medium hover:bg-rca-green-dark transition disabled:bg-gray-400">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
