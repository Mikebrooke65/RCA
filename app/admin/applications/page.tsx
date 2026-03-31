'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { supabaseBrowser } from '@/lib/supabase/browser';

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  membership_type: string;
  created_at: string;
  household_id?: string;
  is_primary_household_member: boolean;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      if (!session) { router.push('/login'); return; }
      fetchApplications();
    }
    init();
  }, [router]);

  async function fetchApplications() {
    const response = await fetch('/api/admin/applications', { cache: 'no-store' });
    const data = await response.json();
    setApplications(data.applications || []);
    setLoading(false);
  }

  async function handleApprove(id: string) {
    setProcessing(id);
    await fetch('/api/admin/applications/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId: id }),
    });
    setProcessing(null);
    fetchApplications();
  }

  async function handleDecline() {
    if (!declineId) return;
    setProcessing(declineId);
    await fetch('/api/admin/applications/decline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId: declineId, reason: declineReason }),
    });
    setProcessing(null);
    setDeclineId(null);
    setDeclineReason('');
    fetchApplications();
  }

  if (loading) return (
    <Layout title="Pending Applications">
      <div className="text-center py-12 text-gray-500">Loading...</div>
    </Layout>
  );

  return (
    <Layout title="Pending Applications">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">{applications.length} application{applications.length !== 1 ? 's' : ''} pending</p>
          <a href="/admin" className="text-sm text-rca-green hover:underline">← Back to Dashboard</a>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white p-12 rounded-lg border text-center text-gray-500">
            No pending applications
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-lg border">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-rca-black">
                      {app.first_name} {app.last_name}
                    </h3>
                    <p className="text-gray-600 text-sm">{app.email}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        app.membership_type === 'full_member' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {app.membership_type === 'full_member' ? 'Full Member' : 'Friend'}
                      </span>
                      {app.is_primary_household_member && (
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
                          $10 fee required
                        </span>
                      )}
                      {app.household_id && !app.is_primary_household_member && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                          Additional household member
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Applied {new Date(app.created_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(app.id)}
                      disabled={processing === app.id}
                      className="px-4 py-2 bg-rca-green text-white rounded-lg hover:bg-rca-green-dark transition disabled:opacity-50 text-sm font-medium"
                    >
                      {processing === app.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => setDeclineId(app.id)}
                      disabled={processing === app.id}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50 text-sm font-medium"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Decline Modal */}
        {declineId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Decline Application</h3>
              <p className="text-sm text-gray-600 mb-4">
                Optionally provide a reason (this will be sent to the applicant):
              </p>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full border rounded-lg p-3 text-sm mb-4 focus:ring-2 focus:ring-rca-green focus:border-transparent"
                rows={3}
                placeholder="Reason for declining (optional)"
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setDeclineId(null); setDeclineReason(''); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDecline}
                  disabled={!!processing}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  {processing ? 'Declining...' : 'Confirm Decline'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
