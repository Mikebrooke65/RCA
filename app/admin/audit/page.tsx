'use client';

import { useEffect, useState } from 'react';

interface AuditEntry {
  id: string;
  action_type: string;
  entity_type: string;
  created_at: string;
  admin_id?: string;
  reason?: string;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  async function fetchLogs() {
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('entity_type', filter);
    
    const response = await fetch(`/api/admin/audit?${params}`);
    const data = await response.json();
    setLogs(data.logs || []);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Audit Log</h1>

      <div className="bg-white rounded-lg p-6">
        <div className="mb-4">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Actions</option>
            <option value="member">Member Changes</option>
            <option value="payment">Payment Changes</option>
            <option value="renewal">Renewal Changes</option>
            <option value="household">Household Changes</option>
          </select>
        </div>

        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="p-4 border-l-4 border-blue-500 bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <span className="font-semibold">{log.action_type}</span>
                  <span className="text-gray-600 text-sm ml-2">({log.entity_type})</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
              {log.reason && (
                <p className="text-sm text-gray-600 mt-1">Reason: {log.reason}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
