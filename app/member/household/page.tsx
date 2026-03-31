'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import MemberNav from '@/components/MemberNav';
import { supabaseBrowser } from '@/lib/supabase/browser';

interface HouseholdMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_primary_household_member: boolean;
  membership_status: string;
}

export default function HouseholdPage() {
  const router = useRouter();
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const res = await fetch('/api/member/household', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      setMembers(data.members || []);
      setAddress(data.address || '');
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return (
    <Layout title="Household Members">
      <MemberNav />
      <div className="text-center py-12 text-gray-500">Loading...</div>
    </Layout>
  );

  return (
    <Layout title="Household Members">
      <MemberNav />
      <div className="max-w-3xl mx-auto mt-6 space-y-6">
        {address && (
          <div className="bg-white rounded-lg p-6 border">
            <p className="text-sm text-gray-500 mb-1">Address</p>
            <p className="font-medium">{address}</p>
          </div>
        )}

        <div className="bg-white rounded-lg p-6 border">
          <h2 className="font-semibold text-rca-black mb-4">Members at this Address</h2>
          {members.length === 0 ? (
            <p className="text-gray-500 text-sm">No household members found.</p>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      {member.first_name} {member.last_name}
                      {member.is_primary_household_member && (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Primary</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-xs text-gray-500 capitalize mt-1">{member.membership_status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-6 border">
          <h2 className="font-semibold text-rca-black mb-2">Add Household Member</h2>
          <p className="text-sm text-gray-600 mb-4">
            Additional household members at your address can join for free.
          </p>
          <a href="/apply" className="inline-block px-4 py-2 bg-rca-green text-white rounded-lg hover:bg-rca-green-dark transition text-sm">
            Apply for Additional Member
          </a>
        </div>
      </div>
    </Layout>
  );
}
