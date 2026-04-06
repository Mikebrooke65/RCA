'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import AdminNav from '@/components/AdminNav';

type RecipientGroup = 'all' | 'members' | 'friends';

export default function AdminEmailsPage() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipients, setRecipients] = useState<RecipientGroup>('all');
  const [imageUrl, setImageUrl] = useState('');
  const [includeLogo, setIncludeLogo] = useState(true);
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState(false);
  const [recipientCount, setRecipientCount] = useState({ all: 0, members: 0, friends: 0 });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchRecipientCounts();
  }, []);

  async function fetchRecipientCounts() {
    try {
      const res = await fetch('/api/admin/emails/recipients');
      if (res.ok) {
        const data = await res.json();
        setRecipientCount(data);
      }
    } catch (error) {
      console.error('Failed to fetch recipient counts:', error);
    }
  }

  async function handleSend() {
    if (!subject.trim() || !body.trim()) {
      setMessage({ type: 'error', text: 'Please enter a subject and message' });
      return;
    }

    const count = recipientCount[recipients];
    if (!confirm(`Send this email to ${count} ${recipients === 'all' ? 'people' : recipients}?`)) {
      return;
    }

    setSending(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          body,
          recipients,
          imageUrl: imageUrl.trim() || null,
          includeLogo,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: `Email sent to ${data.sent} recipients` });
        setSubject('');
        setBody('');
        setImageUrl('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send emails' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send emails' });
    } finally {
      setSending(false);
    }
  }

  return (
    <Layout>
      <AdminNav />
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Send Email</h1>

        {message && (
          <div className={`p-4 rounded mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="recipients"
                  value="all"
                  checked={recipients === 'all'}
                  onChange={() => setRecipients('all')}
                  className="text-rca-green"
                />
                <span>All ({recipientCount.all})</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="recipients"
                  value="members"
                  checked={recipients === 'members'}
                  onChange={() => setRecipients('members')}
                  className="text-rca-green"
                />
                <span>Members ({recipientCount.members})</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="recipients"
                  value="friends"
                  checked={recipients === 'friends'}
                  onChange={() => setRecipients('friends')}
                  className="text-rca-green"
                />
                <span>Friends ({recipientCount.friends})</span>
              </label>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
              placeholder="Email subject..."
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
              placeholder="Write your message here..."
            />
            <p className="text-sm text-gray-500 mt-1">Use blank lines to create paragraphs</p>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">Add an image to your email (paste a URL)</p>
          </div>

          {/* Include Logo */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeLogo}
                onChange={(e) => setIncludeLogo(e.target.checked)}
                className="rounded text-rca-green"
              />
              <span className="text-sm text-gray-700">Include RCA logo in header</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={() => setPreview(!preview)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {preview ? 'Hide Preview' : 'Preview'}
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !subject.trim() || !body.trim()}
              className="px-6 py-2 bg-rca-green text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {sending ? 'Sending...' : `Send to ${recipientCount[recipients]} ${recipients === 'all' ? 'people' : recipients}`}
            </button>
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Email Preview</h2>
            <div className="border rounded-lg p-6 bg-gray-50">
              {includeLogo && (
                <div className="text-center mb-6">
                  <div className="inline-block bg-rca-green text-white px-6 py-3 rounded-lg font-bold text-xl">
                    RCA
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Riverhead Community Association</p>
                </div>
              )}
              {imageUrl && (
                <div className="mb-6 text-center">
                  <img src={imageUrl} alt="Email image" className="max-w-full h-auto rounded-lg mx-auto" style={{ maxHeight: '300px' }} />
                </div>
              )}
              <div className="mb-4">
                <span className="text-sm text-gray-500">Subject:</span>
                <p className="font-semibold">{subject || '(No subject)'}</p>
              </div>
              <div className="whitespace-pre-wrap">{body || '(No message)'}</div>
              <div className="mt-6 pt-4 border-t text-center text-sm text-gray-500">
                Riverhead Community Association<br />
                <a href="https://rca.org.nz" className="text-rca-green">rca.org.nz</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
