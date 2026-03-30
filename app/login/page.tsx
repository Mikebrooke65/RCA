'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { signIn } from '@/lib/auth';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Get session token and check role server-side
      const session = await supabaseBrowser.auth.getSession();
      const token = session.data.session?.access_token;
      
      const response = await fetch('/api/auth/check-role', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { isAdmin } = await response.json();
      
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/member');
      }
    }
  }

  return (
    <Layout title="Member Login" showNav={false}>
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-rca-black mb-6 text-center">
            Welcome Back
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rca-green focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rca-green text-white py-3 rounded-lg font-medium hover:bg-rca-green-dark transition disabled:bg-gray-400"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link href="/forgot-password" className="text-rca-green hover:underline">
              Forgot your password?
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Not a member yet?
            </p>
            <Link
              href="/apply"
              className="inline-block px-6 py-2 border-2 border-rca-green text-rca-green rounded-lg font-medium hover:bg-rca-green hover:text-white transition"
            >
              Apply for Membership
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Need help?{' '}
            <a href="mailto:riverheadcommunityassociation@gmail.com" className="text-rca-green hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
