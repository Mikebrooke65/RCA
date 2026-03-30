'use client';

import { useEffect, useState } from 'react';

interface HouseholdMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_primary_household_member: boolean;
  membership_status: string;
}

export default function HouseholdPage() {
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [address, setAddress] = useState('');

  useEffect(() => {
    fetch('/api/member/household')
      .then(res => res.json())
      .then(data => {
        setMembers(data.members || []);
        setAddress(data.address || '');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Household Members</h1>

      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Address</h2>
        <p className="text-gray-700">{address}</p>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Members at this Address</h2>
        
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="p-4 border rounded">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">
                    {member.first_name} {member.last_name}
                    {member.is_primary_household_member && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{member.email}</p>
                  <p className="text-xs text-gray-500 capitalize mt-1">{member.membership_status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Add Household Member</h2>
        <p className="text-sm text-gray-600 mb-4">
          Additional household members at your address can join for free.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Request to Add Member
        </button>
      </div>
    </div>
  );
}
