'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import AdminNav from '@/components/AdminNav';

interface MembershipYear {
  id: string;
  year_start: string;
  year_end: string;
  renewal_fee: number;
}

export default function RenewalsPage() {
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [years, setYears] = useState<MembershipYear[]>([]);
  const [editingFee, setEditingFee] = useState<{ id: string; fee: string } | null>(null);
  const [showNewYear, setShowNewYear] = useState(false);
  const [newYear, setNewYear] = useState({ year_start: '', year_end: '', renewal_fee: '10' });

  useEffect(() => { fetchYears(); }, []);

  async function fetchYears() {
    const res = await fetch('/api/admin/membership-years');
    const data = await res.json();
    setYears(data.years || []);
  }

  async function handleUpdateFee(id: string) {
    if (!editingFee) return;
    await fetch('/api/admin/membership-years', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, renewal_fee: parseFloat(editingFee.fee) }),
    });
    setEditingFee(null);
    fetchYears();
  }

  async function handleAddYear() {
    await fetch('/api/admin/membership-years', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newYear),
    });
    setShowNewYear(false);
    fetchYears();
  }

  async function handleGenerateRenewals() {
    setGenerating(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/renewals/generate', { method: 'POST' });
      const result = await response.json();
      setMessage(`✓ Generated ${result.count} renewal records`);
    } catch {
      setMessage('Failed to generate renewals');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Layout title="Renewal Management">
      <AdminNav />
      <div className="mt-6 space-y-6 max-w-3xl">
        {message && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">{message}</div>
        )}

        {/* Membership Years & Fees */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-rca-black">Membership Years & Fees</h2>
            <button onClick={() => setShowNewYear(!showNewYear)}
              className="text-sm px-3 py-1 border border-rca-green text-rca-green rounded-lg hover:bg-green-50">
              + New Year
            </button>
          </div>

          {showNewYear && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-600">Year Start (April 1)</label>
                  <input type="date" value={newYear.year_start}
                    onChange={(e) => setNewYear({ ...newYear, year_start: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Year End (March 31)</label>
                  <input type="date" value={newYear.year_end}
                    onChange={(e) => setNewYear({ ...newYear, year_end: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Fee (NZD)</label>
                  <input type="number" value={newYear.renewal_fee}
                    onChange={(e) => setNewYear({ ...newYear, renewal_fee: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-sm" />
                </div>
              </div>
              <button onClick={handleAddYear}
                className="px-4 py-2 bg-rca-green text-white rounded-lg text-sm hover:bg-rca-green-dark">
                Save Year
              </button>
            </div>
          )}

          <div className="space-y-2">
            {years.map((year) => (
              <div key={year.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="font-medium text-sm">
                    {new Date(year.year_start).getFullYear()} – {new Date(year.year_end).getFullYear()}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({new Date(year.year_start).toLocaleDateString('en-NZ')} to {new Date(year.year_end).toLocaleDateString('en-NZ')})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {editingFee?.id === year.id ? (
                    <>
                      <span className="text-sm">$</span>
                      <input type="number" value={editingFee.fee}
                        onChange={(e) => setEditingFee({ id: year.id, fee: e.target.value })}
                        className="w-20 p-1 border rounded text-sm" />
                      <button onClick={() => handleUpdateFee(year.id)}
                        className="px-3 py-1 bg-rca-green text-white rounded text-sm">Save</button>
                      <button onClick={() => setEditingFee(null)}
                        className="px-3 py-1 border rounded text-sm">Cancel</button>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-rca-green">${year.renewal_fee.toFixed(2)}</span>
                      <button onClick={() => setEditingFee({ id: year.id, fee: year.renewal_fee.toString() })}
                        className="text-xs text-gray-500 hover:text-rca-green underline">Edit fee</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Renewal Actions */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="font-semibold text-rca-black mb-4">Renewal Cycle Actions</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Generate Renewals</p>
                <p className="text-xs text-gray-500">Creates renewal records for all active members</p>
              </div>
              <button onClick={handleGenerateRenewals} disabled={generating}
                className="px-4 py-2 bg-rca-green text-white rounded-lg text-sm hover:bg-rca-green-dark disabled:bg-gray-400">
                {generating ? 'Generating...' : 'Run'}
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Send Renewal Reminders</p>
                <p className="text-xs text-gray-500">Emails members with unpaid renewals</p>
              </div>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700">Run</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Process Lapsed Members</p>
                <p className="text-xs text-gray-500">Marks unpaid members as lapsed after May 31</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Run</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
