'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import AdminNav from '@/components/AdminNav';

interface AuditEntry {
  id: string;
  action_type: string;
  entity_type: string;
  created_at: string;
  reason?: string;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchLogs(); }, [filter]);

  async function fetchLogs() {
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('entity_type', filter);
    const response = await fetch(`/api/admin/audit?${params}`);
    const data = await response.json();
    setLogs(data.logs || []);
  }

  return (
    <Layout title="Audit Log">
      <AdminNav />
      <div className="mt-6">
        <div className="mb-4">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded-lg">
            <option value="all">All Actions</option>
            <option value="member">Member Changes</option>
            <option value="payment">Payment Changes</option>
            <option value="renewal">Renewal Changes</option>
          </select>
        </div>
        {logs.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border text-center text-gray-500">No audit entries yet</div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="p-4 border-l-4 border-rca-green bg-white rounded-r-lg">
                <div className="flex justify-between">
                  <div>
                    <span className="font-semibold">{log.action_type}</span>
                    <span className="text-gray-500 text-sm ml-2">({log.entity_type})</span>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(log.created_at).toLocaleString('en-NZ')}</span>
                </div>
                {log.reason && <p className="text-sm text-gray-600 mt-1">Reason: {log.reason}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
