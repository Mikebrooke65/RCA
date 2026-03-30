'use client';

import { useState } from 'react';

export default function RenewalsPage() {
  const [generating, setGenerating] = useState(false);

  async function handleGenerateRenewals() {
    if (!confirm('Generate renewals for all active members? This will create renewal records and prepare emails.')) {
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/admin/renewals/generate', {
        method: 'POST',
      });
      const result = await response.json();
      alert(`Generated ${result.count} renewal records`);
    } catch (error) {
      alert('Failed to generate renewals');
    } finally {
      setGenerating(false);
    }
  }

  async function handleSendReminders() {
    if (!confirm('Send renewal reminders to all members with unpaid renewals?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/renewals/remind', {
        method: 'POST',
      });
      const result = await response.json();
      alert(`Sent ${result.count} reminder emails`);
    } catch (error) {
      alert('Failed to send reminders');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Renewal Management</h1>

      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Renewal Cycle Controls</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">Generate Renewals (April 1)</h3>
            <p className="text-sm text-gray-700 mb-3">
              Creates renewal records for all active members for the new membership year.
            </p>
            <button
              onClick={handleGenerateRenewals}
              disabled={generating}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {generating ? 'Generating...' : 'Generate Renewals'}
            </button>
          </div>

          <div className="p-4 bg-yellow-50 rounded">
            <h3 className="font-semibold mb-2">Send Renewal Reminders</h3>
            <p className="text-sm text-gray-700 mb-3">
              Sends reminder emails to members with unpaid renewals.
            </p>
            <button
              onClick={handleSendReminders}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Send Reminders
            </button>
          </div>

          <div className="p-4 bg-red-50 rounded">
            <h3 className="font-semibold mb-2">Mark Lapsed (May 31)</h3>
            <p className="text-sm text-gray-700 mb-3">
              Marks members as lapsed if renewal not paid by May 31.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Process Lapsed Members
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Current Year Renewals</h2>
        {/* TODO: Renewal list component */}
        <p className="text-gray-500">Renewal status will appear here</p>
      </div>
    </div>
  );
}
