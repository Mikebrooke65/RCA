'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import AdminNav from '@/components/AdminNav';

interface Document {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  file_type?: string;
  category: string;
  created_at: string;
}

const CATEGORIES = ['minutes', 'accounts', 'constitution', 'planning', 'general'];
const emptyForm = { title: '', description: '', category: 'general', file: null as File | null };

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', category: '' });
  const [message, setMessage] = useState('');

  useEffect(() => { fetchDocuments(); }, []);

  async function fetchDocuments() {
    const res = await fetch('/api/admin/documents');
    const data = await res.json();
    setDocuments(data.documents || []);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!form.file || !form.title) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', form.file);
    const uploadRes = await fetch('/api/admin/documents/upload', { method: 'POST', body: formData });
    const uploadData = await uploadRes.json();

    if (uploadData.error) {
      setMessage('Upload failed: ' + uploadData.error);
      setUploading(false);
      return;
    }

    await fetch('/api/admin/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title, description: form.description, category: form.category, ...uploadData }),
    });

    setForm(emptyForm);
    setShowUpload(false);
    setUploading(false);
    setMessage('✓ Document uploaded successfully');
    setTimeout(() => setMessage(''), 3000);
    fetchDocuments();
  }

  async function handleEdit(doc: Document) {
    setEditingId(doc.id);
    setEditForm({ title: doc.title, description: doc.description || '', category: doc.category });
  }

  async function handleSaveEdit(id: string) {
    await fetch('/api/admin/documents', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editForm }),
    });
    setEditingId(null);
    fetchDocuments();
  }

  async function handleDelete(id: string, file_path: string) {
    await fetch('/api/admin/documents', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, file_path }),
    });
    fetchDocuments();
  }

  function formatSize(bytes?: number) {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = documents.filter(d => d.category === cat);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <Layout title="Document Repository">
      <AdminNav />
      <div className="mt-6 max-w-4xl space-y-6">
        {message && <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{message}</div>}

        {/* Upload Toggle */}
        {!showUpload ? (
          <button onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-rca-green text-white rounded-lg text-sm hover:bg-rca-green-dark">
            + Upload Document
          </button>
        ) : (
          <div className="bg-white rounded-lg border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-rca-black">Upload Document</h2>
              <button onClick={() => { setShowUpload(false); setForm(emptyForm); }}
                className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input type="text" required value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
                    placeholder="e.g. AGM Minutes 2025" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rca-green">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <input type="text" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
                  placeholder="Brief description" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File *</label>
                <input type="file" required
                  onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-rca-green file:text-white" />
              </div>
              <button type="submit" disabled={uploading || !form.file || !form.title}
                className="px-6 py-2 bg-rca-green text-white rounded-lg hover:bg-rca-green-dark disabled:bg-gray-400 text-sm">
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>
        )}

        {/* Document List */}
        {documents.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center text-gray-500">No documents uploaded yet</div>
        ) : (
          CATEGORIES.map(cat => {
            const docs = grouped[cat];
            if (docs.length === 0) return null;
            return (
              <div key={cat} className="bg-white rounded-lg border p-6">
                <h2 className="font-semibold text-rca-black mb-4 capitalize">{cat}</h2>
                <div className="space-y-2">
                  {docs.map(doc => (
                    <div key={doc.id} className="border rounded-lg p-3">
                      {editingId === doc.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input type="text" value={editForm.title}
                              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                              className="px-3 py-1.5 border rounded text-sm focus:ring-2 focus:ring-rca-green focus:border-transparent" />
                            <select value={editForm.category}
                              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                              className="px-3 py-1.5 border rounded text-sm">
                              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                            </select>
                          </div>
                          <input type="text" value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            placeholder="Description"
                            className="w-full px-3 py-1.5 border rounded text-sm focus:ring-2 focus:ring-rca-green focus:border-transparent" />
                          <div className="flex gap-2">
                            <button onClick={() => handleSaveEdit(doc.id)}
                              className="px-3 py-1 bg-rca-green text-white rounded text-sm">Save</button>
                            <button onClick={() => setEditingId(null)}
                              className="px-3 py-1 border rounded text-sm">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{doc.title}</p>
                            {doc.description && <p className="text-xs text-gray-500">{doc.description}</p>}
                            <p className="text-xs text-gray-400 mt-1">
                              {doc.file_name}{doc.file_size ? ` · ${formatSize(doc.file_size)}` : ''} · {new Date(doc.created_at).toLocaleDateString('en-NZ')}
                            </p>
                          </div>
                          <div className="flex gap-3 ml-4 shrink-0">
                            <button onClick={() => handleEdit(doc)} className="text-sm text-rca-green hover:underline">Edit</button>
                            <button onClick={() => handleDelete(doc.id, doc.file_path)} className="text-sm text-red-600 hover:underline">Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
}
