import { supabaseBrowser } from '@/lib/supabase/browser';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabaseBrowser.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabaseBrowser.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabaseBrowser.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabaseBrowser.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}
