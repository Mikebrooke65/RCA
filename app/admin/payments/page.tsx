'use client';

import { useState } from 'react';

export default function PaymentReconciliation() {
  const [file, setFile] = useState<File | null>(null);
  const [reconciling, setReconciling] = useState(false);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setReconciling(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/reconcile', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      alert(`Reconciled ${result.matched} payments. ${result.unmatched} unmatched.`);
    } catch (error) {
      alert('Reconciliation failed');
    } finally {
      setReconciling(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Payment Reconciliation</h1>

      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">ASB Bank Transfer Reconciliation</h2>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload ASB CSV Export
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={!file || reconciling}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {reconciling ? 'Reconciling...' : 'Reconcile Payments'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
        {/* TODO: Payment list component */}
        <p className="text-gray-500">Payment history will appear here</p>
      </div>
    </div>
  );
}
