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
  household?: { normalized_address: string };
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchMembers(); }, [filter]);

  async function fetchMembers() {
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('status', filter);
    const response = await fetch(`/api/admin/members?${params}`);
    const data = await response.json();
    setMembers(data.members || []);
  }

  const filteredMembers = members.filter(m =>
    `${m.first_name} ${m.last_name} ${m.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Member Management">
      <AdminNav />
      <div className="mt-6 bg-white rounded-lg p-6">
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
                  {member.household && (
                    <p className="text-xs text-gray-500 mt-1">
                      {member.household.normalized_address}
                      {member.is_primary_household_member && ' (Primary)'}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    member.membership_type === 'full_member' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {member.membership_type === 'full_member' ? 'Full Member' : 'Friend'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{member.membership_status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
