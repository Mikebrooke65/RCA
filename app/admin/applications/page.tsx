'use client';

import { useEffect, useState } from 'react';

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
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    const response = await fetch('/api/admin/applications');
    const data = await response.json();
    setApplications(data.applications || []);
    setLoading(false);
  }

  async function handleApprove(id: string) {
    if (!confirm('Approve this application?')) return;
    
    await fetch('/api/admin/applications/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId: id }),
    });
    
    fetchApplications();
  }

  async function handleDecline(id: string) {
    const reason = prompt('Reason for declining (optional):');
    
    await fetch('/api/admin/applications/decline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId: id, reason }),
    });
    
    fetchApplications();
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Pending Applications</h1>

      {applications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg text-center text-gray-500">
          No pending applications
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">
                    {app.first_name} {app.last_name}
                  </h3>
                  <p className="text-gray-600">{app.email}</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Type:</span>{' '}
                      <span className={app.membership_type === 'full_member' ? 'text-blue-600' : 'text-green-600'}>
                        {app.membership_type === 'full_member' ? 'Full Member' : 'Friend'}
                      </span>
                    </p>
                    {app.is_primary_household_member && (
                      <p className="text-orange-600">Primary Household Member ($10 fee)</p>
                    )}
                    {app.household_id && !app.is_primary_household_member && (
                      <p className="text-gray-600">Additional household member (no fee)</p>
                    )}
                    <p className="text-gray-500">Applied: {new Date(app.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(app.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecline(app.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
