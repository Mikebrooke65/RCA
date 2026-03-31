'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import AdminNav from '@/components/AdminNav';

export default function PaymentReconciliation() {
  const [file, setFile] = useState<File | null>(null);
  const [reconciling, setReconciling] = useState(false);
  const [result, setResult] = useState<{ matched: number; unmatched: number } | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setReconciling(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/admin/reconcile', { method: 'POST', body: formData });
      const data = await response.json();
      setResult(data);
    } catch {
      alert('Reconciliation failed');
    } finally {
      setReconciling(false);
    }
  }

  return (
    <Layout title="Payment Reconciliation">
      <AdminNav />
      <div className="mt-6 max-w-2xl">
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">ASB Bank Transfer Reconciliation</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload ASB CSV Export</label>
              <input
                type="file" accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-rca-green file:text-white hover:file:bg-rca-green-dark"
              />
            </div>
            <button
              type="submit" disabled={!file || reconciling}
              className="px-6 py-2 bg-rca-green text-white rounded-lg hover:bg-rca-green-dark disabled:bg-gray-400"
            >
              {reconciling ? 'Reconciling...' : 'Reconcile Payments'}
            </button>
          </form>
          {result && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">✓ Matched: {result.matched} payments</p>
              {result.unmatched > 0 && <p className="text-yellow-700">⚠ Unmatched: {result.unmatched} transactions</p>}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
