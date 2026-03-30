import { createClient } from '@supabase/supabase-js';

// Browser-only Supabase client - only uses public keys
const supabaseUrl = 'https://fpvmvmxiqitnatxgisuq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdm12bXhpcWl0bmF0eGdpc3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTE2NTEsImV4cCI6MjA5MDM4NzY1MX0.AeJv8tIFo3Uxg0dYxDCGcV8X_G15a_Q0AZRSQDqKXA8';

export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);
