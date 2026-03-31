'use client';

import Layout from '@/components/Layout';
import AdminNav from '@/components/AdminNav';

export default function FacebookPage() {
  return (
    <Layout title="Facebook Group Management">
      <AdminNav />
      <div className="mt-6 max-w-2xl">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="font-semibold text-yellow-800 mb-2">Facebook Integration Not Configured</h2>
          <p className="text-sm text-yellow-700">
            To enable Facebook group management, you need to set up a Facebook App and configure the following environment variables:
          </p>
          <ul className="mt-3 text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li>FACEBOOK_APP_ID</li>
            <li>FACEBOOK_APP_SECRET</li>
            <li>FACEBOOK_GROUP_ID</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
