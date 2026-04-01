'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import AdminNav from '@/components/AdminNav';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  membership_type: string;
  membership_status: string;
  date_joined: string;
  is_primary_household_member: boolean;
  facebook_joined: boolean;
  households?: { normalized_address: string };
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showLapsedReport, setShowLapsedReport] = useState(false);

  useEffect(() => { fetchMembers(); }, [filter]);

  async function fetchMembers() {
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('status', filter);
    const response = await fetch(`/api/admin/members?${params}`);
    const data = await response.json();
    setMembers(data.members || []);
  }

  async function toggleFacebookStatus(memberId: string, currentStatus: boolean) {
    await fetch('/api/admin/members/facebook', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, facebookJoined: !currentStatus }),
    });
    fetchMembers();
  }

  const filteredMembers = members.filter(m =>
    `${m.first_name} ${m.last_name} ${m.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const lapsedWithFacebook = members.filter(m => 
    m.membership_status === 'lapsed' && m.facebook_joined
  );

  return (
    <Layout title="Member Management">
      <AdminNav />
      <div className="mt-6 space-y-4">
        {/* Lapsed Members Report */}
        <div className="bg-white rounded-lg p-4 border">
          <button 
            onClick={() => setShowLapsedReport(!showLapsedReport)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">📘</span>
              <span className="font-medium">Facebook Cleanup Report</span>
              {lapsedWithFacebook.length > 0 && (
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                  {lapsedWithFacebook.length} to remove
                </span>
              )}
            </div>
            <span>{showLapsedReport ? '▼' : '▶'}</span>
          </button>
          
          {showLapsedReport && (
            <div className="mt-4 border-t pt-4">
              {lapsedWithFacebook.length === 0 ? (
                <p className="text-sm text-gray-500">No lapsed members currently in Facebook group.</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-3">
                    These lapsed members should be removed from the Facebook group:
                  </p>
                  {lapsedWithFacebook.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="text-sm">{m.first_name} {m.last_name} ({m.email})</span>
                      <button
                        onClick={() => toggleFacebookStatus(m.id, true)}
                        className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                      >
                        Mark Removed
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded-lg">
              <option value="all">All Members</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="lapsed">Lapsed</option>
              <option value="resigned">Resigned</option>
            </select>
          </div>
          <p className="text-sm text-gray-500 mb-3">{filteredMembers.length} members</p>
          <div className="space-y-2">
            {filteredMembers.map((member) => (
              <div key={member.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{member.first_name} {member.last_name}</h3>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    {member.households && (
                      <p className="text-xs text-gray-500 mt-1">
                        {member.households.normalized_address}
                        {member.is_primary_household_member && ' (Primary)'}
                      </p>
                    )}
                  </div>
                  <div className="text-right space-y-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      member.membership_type === 'full_member' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {member.membership_type === 'full_member' ? 'Full Member' : 'Friend'}
                    </span>
                    <p className="text-xs text-gray-500 capitalize">{member.membership_status}</p>
                    <button
                      onClick={() => toggleFacebookStatus(member.id, member.facebook_joined)}
                      className={`text-xs px-2 py-1 rounded ${
                        member.facebook_joined 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {member.facebook_joined ? '📘 In FB Group' : '📘 Not in FB'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
