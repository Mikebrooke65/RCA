'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import MemberNav from '@/components/MemberNav';
import { supabaseBrowser } from '@/lib/supabase/browser';

interface Document {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  category: string;
  created_at: string;
}

const CATEGORIES = ['minutes', 'accounts', 'constitution', 'planning', 'general'];

const CATEGORY_LABELS: Record<string, string> = {
  minutes: '📋 Meeting Minutes',
  accounts: '💰 Financial Accounts',
  constitution: '📜 Constitution & Rules',
  planning: '🗺️ Planning Documents',
  general: '📁 General',
};

export default function MemberDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setToken(session.access_token);

      const res = await fetch('/api/member/documents', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      setDocuments(data.documents || []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleDownload(doc: Document) {
    setDownloading(doc.id);
    const res = await fetch('/api/member/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ document_id: doc.id }),
    });
    const data = await res.json();
    if (data.url) {
      const a = document.createElement('a');
      a.href = data.url;
      a.download = data.file_name;
      a.click();
    }
    setDownloading(null);
  }

  function formatSize(bytes?: number) {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  if (loading) return (
    <Layout title="Documents">
      <MemberNav />
      <div className="text-center py-12 text-gray-500">Loading...</div>
    </Layout>
  );

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = documents.filter(d => d.category === cat);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <Layout title="Document Repository">
      <MemberNav />
      <div className="max-w-3xl mx-auto mt-6 space-y-6">
        {documents.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
            No documents available yet.
          </div>
        ) : (
          CATEGORIES.map(cat => {
            const docs = grouped[cat];
            if (docs.length === 0) return null;
            return (
              <div key={cat} className="bg-white rounded-lg border p-6">
                <h2 className="font-semibold text-rca-black mb-4">{CATEGORY_LABELS[cat]}</h2>
                <div className="space-y-2">
                  {docs.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-sm">{doc.title}</p>
                        {doc.description && <p className="text-xs text-gray-500">{doc.description}</p>}
                        <p className="text-xs text-gray-400 mt-1">
                          {doc.file_name}{doc.file_size ? ` · ${formatSize(doc.file_size)}` : ''} · {new Date(doc.created_at).toLocaleDateString('en-NZ')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownload(doc)}
                        disabled={downloading === doc.id}
                        className="ml-4 shrink-0 px-3 py-1.5 bg-rca-green text-white text-xs rounded-lg hover:bg-rca-green-dark disabled:bg-gray-400 transition"
                      >
                        {downloading === doc.id ? 'Preparing...' : '⬇ Download'}
                      </button>
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
