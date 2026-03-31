import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fpvmvmxiqitnatxgisuq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdm12bXhpcWl0bmF0eGdpc3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTE2NTEsImV4cCI6MjA5MDM4NzY1MX0.AeJv8tIFo3Uxg0dYxDCGcV8X_G15a_Q0AZRSQDqKXA8';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdm12bXhpcWl0bmF0eGdpc3VxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxMTY1MSwiZXhwIjoyMDkwMzg3NjUxfQ.fjnmT_8P6ZteaOU5SxOJH6iLHb5a3XRvODr9E5xfxCc';

// Client-side Supabase client (browser - uses anon key)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Server-side admin client (bypasses RLS - service role key)
export const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
