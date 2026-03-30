'use client';

import { useEffect, useState } from 'react';

interface FacebookHealth {
  membersInvited: number;
  membersJoined: number;
  membersLeft: number;
  friendsJoined: number;
  shouldBeRemoved: number;
}

export default function FacebookPage() {
  const [health, setHealth] = useState<FacebookHealth | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchHealth();
  }, []);

  async function fetchHealth() {
    const response = await fetch('/api/admin/facebook/health');
    const data = await response.json();
    setHealth(data);
  }

  async function handleSync() {
    setSyncing(true);
    try {
      await fetch('/api/admin/facebook/sync', { method: 'POST' });
      alert('Facebook group synced successfully');
      fetchHealth();
    } catch (error) {
      alert('Sync failed');
    } finally {
      setSyncing(false);
    }
  }

  async function handleSendInvites() {
    if (!confirm('Send Facebook invite links to all approved members who haven\'t been invited?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/facebook/invite', { method: 'POST' });
      const result = await response.json();
      alert(`Sent ${result.count} invite emails`);
    } catch (error) {
      alert('Failed to send invites');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Facebook Group Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Members Invited" value={health?.membersInvited || 0} />
        <StatCard title="Members Joined" value={health?.membersJoined || 0} color="green" />
        <StatCard title="Should Be Removed" value={health?.shouldBeRemoved || 0} color="red" />
      </div>

      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        
        <div className="space-y-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {syncing ? 'Syncing...' : 'Sync with Facebook Group'}
          </button>

          <button
            onClick={handleSendInvites}
            className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Send Invite Links
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Group Health Details</h2>
        {/* TODO: Detailed member list with Facebook status */}
        <p className="text-gray-500">Detailed member status will appear here</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, color = 'blue' }: { title: string; value: number; color?: string }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
  };

  return (
    <div className={`p-6 rounded-lg ${colors[color as keyof typeof colors]}`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm mt-1">{title}</div>
    </div>
  );
}
