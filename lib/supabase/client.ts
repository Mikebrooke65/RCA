import { createClient } from '@supabase/supabase-js';

// Temporary hardcoded values for testing
// TODO: Fix environment variable loading
const SUPABASE_URL = 'https://fpvmvmxiqitnatxgisuq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdm12bXhpcWl0bmF0eGdpc3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTE2NTEsImV4cCI6MjA5MDM4NzY1MX0.AeJv8tIFo3Uxg0dYxDCGcV8X_G15a_Q0AZRSQDqKXA8';

// Client-side Supabase client (for auth and client operations)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Server-side admin client (for privileged operations)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { autoRefreshToken: false, persistSession: false } }
);
