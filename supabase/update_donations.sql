-- Update donations table for Stripe integration
-- Run this in Supabase SQL Editor

ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'stripe';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS receipt_number TEXT;
