'use client';

import { useEffect, useState } from 'react';

interface MemberData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  membership_type: string;
  membership_status: string;
  date_joined: string;
  household?: {
    normalized_address: string;
  };
  household_members?: Array<{
    first_name: string;
    last_name: string;
  }>;
}

export default function MemberPortal() {
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/member/profile')
      .then(res => res.json())
      .then(data => {
        setMember(data.member);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!member) return <div className="p-8">Please log in</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold">Member Portal</h1>
      </nav>

      <main className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome, {member.first_name}!
          </h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Email:</span> {member.email}
            </div>
            <div>
              <span className="text-gray-600">Phone:</span> {member.phone || 'Not provided'}
            </div>
            <div>
              <span className="text-gray-600">Status:</span>{' '}
              <span className="capitalize">{member.membership_status}</span>
            </div>
            <div>
              <span className="text-gray-600">Member Since:</span>{' '}
              {new Date(member.date_joined).toLocaleDateString()}
            </div>
          </div>

          {member.household && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">Address:</p>
              <p className="font-medium">{member.household.normalized_address}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PortalLink href="/member/household" title="Household Members" />
          <PortalLink href="/member/payments" title="Payment History" />
          <PortalLink href="/member/renewals" title="Renewal History" />
          <PortalLink href="/member/documents" title="Members-Only Documents" />
          <PortalLink href="/member/update" title="Update Contact Details" />
          <PortalLink href="/member/resign" title="Resign Membership" />
        </div>
      </main>
    </div>
  );
}

function PortalLink({ href, title }: { href: string; title: string }) {
  return (
    <a 
      href={href}
      className="block p-4 bg-white rounded-lg border hover:border-blue-500 hover:shadow-md transition"
    >
      {title}
    </a>
  );
}
