'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.push('/');
  }

  if (!isLoggedIn) {
    return (
      <a href="/login" className="text-sm bg-rca-green text-white px-4 py-2 rounded-lg hover:bg-rca-green-dark transition">
        Login
      </a>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
    >
      Logout
    </button>
  );
}
