'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import AdminNav from '@/components/AdminNav';
import Image from 'next/image';

interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  is_public: boolean;
  is_published: boolean;
  published_at: string;
}

const empty = { title: '', content: '', image_url: '', is_public: true, is_published: true };

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editing, setEditing] = useState<Partial<Announcement> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchAnnouncements(); }, []);

  async function fetchAnnouncements() {
    const res = await fetch('/api/admin/announcements');
    const data = await res.json();
    setAnnouncements(data.announcements || []);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/announcements/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.url) setEditing({ ...editing, image_url: data.url });
    setUploading(false);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    const method = editing.id ? 'PATCH' : 'POST';
    await fetch('/api/admin/announcements', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    setMessage('✓ Saved');
    setTimeout(() => setMessage(''), 3000);
    fetchAnnouncements();
  }

  async function handleDelete(id: string) {
    await fetch('/api/admin/announcements', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchAnnouncements();
  }

  return (
    <Layout title="Announcements">
      <AdminNav />
      <div className="mt-6 max-w-4xl">
        {message && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{message}</div>}

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">{announcements.length} announcement{announcements.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setEditing(empty)}
            className="px-4 py-2 bg-rca-green text-white rounded-lg text-sm hover:bg-rca-green-dark">
            + New Announcement
          </button>
        </div>

        {/* Editor */}
        {editing && (
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="font-semibold text-rca-black mb-4">{editing.id ? 'Edit' : 'New'} Announcement</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={editing.title || ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
                  placeholder="Announcement title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea value={editing.content || ''}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
                  placeholder="Announcement content..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
                {editing.image_url && (
                  <div className="mb-2 relative w-full h-40 rounded-lg overflow-hidden">
                    <Image src={editing.image_url} alt="Preview" fill className="object-cover" />
                    <button onClick={() => setEditing({ ...editing, image_url: '' })}
                      className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      Remove
                    </button>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-rca-green file:text-white" />
                {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={editing.is_public ?? true}
                    onChange={(e) => setEditing({ ...editing, is_public: e.target.checked })}
                    className="rounded" />
                  Show on public landing page
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={editing.is_published ?? true}
                    onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
                    className="rounded" />
                  Published
                </label>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} disabled={saving || !editing.title || !editing.content}
                  className="px-6 py-2 bg-rca-green text-white rounded-lg text-sm hover:bg-rca-green-dark disabled:bg-gray-400">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditing(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-lg border p-5">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-rca-black">{a.title}</h3>
                    {!a.is_published && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Draft</span>}
                    {a.is_public ? <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Public</span>
                      : <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Members only</span>}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{a.content}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(a.published_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                {a.image_url && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <Image src={a.image_url} alt={a.title} fill className="object-cover" />
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setEditing(a)}
                  className="text-sm text-rca-green hover:underline">Edit</button>
                <button onClick={() => handleDelete(a.id)}
                  className="text-sm text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
