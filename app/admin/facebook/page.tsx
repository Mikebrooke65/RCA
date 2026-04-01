'use client';

import Layout from '@/components/Layout';
import AdminNav from '@/components/AdminNav';

export default function FacebookPage() {
  const facebookGroupUrl = 'https://www.facebook.com/share/g/17SFKoqsSj/';

  return (
    <Layout title="Facebook Group Management">
      <AdminNav />
      <div className="mt-6 max-w-2xl space-y-6">
        {/* Group Link */}
        <div className="bg-white rounded-lg p-6 border">
          <h2 className="font-semibold text-rca-black mb-3">Facebook Group</h2>
          <p className="text-sm text-gray-600 mb-4">
            The RCA Facebook group is managed manually. Members can request to join via the link below.
          </p>
          <a 
            href={facebookGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <span>📘</span>
            <span>Open Facebook Group</span>
          </a>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h2 className="font-semibold text-rca-black mb-3">Managing Facebook Members</h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p><strong>Adding members:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>When a new member joins, they&apos;ll see a link to request Facebook group access</li>
              <li>Approve their request in Facebook</li>
              <li>Mark them as &quot;In FB Group&quot; on the Members page</li>
            </ol>
            
            <p className="mt-4"><strong>Removing lapsed members:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Go to the Members page and expand the &quot;Facebook Cleanup Report&quot;</li>
              <li>Remove listed members from the Facebook group</li>
              <li>Click &quot;Mark Removed&quot; to update their status</li>
            </ol>
          </div>
        </div>

        {/* Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Facebook&apos;s API doesn&apos;t allow automatic member management for groups. 
            All additions and removals must be done manually through Facebook.
          </p>
        </div>
      </div>
    </Layout>
  );
}
