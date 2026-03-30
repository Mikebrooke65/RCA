/* RCA Membership Database Schema
   Incorporated Societies Act 2022 Compliant */

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Membership Types
CREATE TYPE membership_type AS ENUM ('full_member', 'friend');
CREATE TYPE membership_status AS ENUM ('pending', 'active', 'lapsed', 'resigned', 'removed');
CREATE TYPE payment_status AS ENUM ('paid', 'unpaid', 'pending', 'failed', 'exempt');
CREATE TYPE payment_method AS ENUM ('stripe', 'bank_transfer', 'cash', 'other');
CREATE TYPE admin_role AS ENUM ('super_admin', 'membership_admin', 'communications_admin');

-- Households (normalized addresses)
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  raw_address TEXT NOT NULL,
  normalized_address TEXT NOT NULL,
  suburb TEXT,
  city TEXT,
  postcode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_validated BOOLEAN DEFAULT FALSE,
  validation_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Members (legal register)
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) UNIQUE,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMPTZ,
  email_verification_token TEXT,
  email_verification_token_expires TIMESTAMPTZ,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  membership_type membership_type NOT NULL,
  membership_status membership_status DEFAULT 'pending',
  household_id UUID REFERENCES households(id),
  is_primary_household_member BOOLEAN DEFAULT FALSE,
  date_joined TIMESTAMPTZ,
  date_approved TIMESTAMPTZ,
  date_resigned TIMESTAMPTZ,
  date_removed TIMESTAMPTZ,
  consent_given BOOLEAN DEFAULT FALSE,
  consent_timestamp TIMESTAMPTZ,
  facebook_user_id TEXT,
  facebook_invite_sent BOOLEAN DEFAULT FALSE,
  facebook_joined BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Membership Years & Renewals
CREATE TABLE membership_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year_start DATE NOT NULL, -- April 1
  year_end DATE NOT NULL,   -- March 31
  renewal_fee DECIMAL(10, 2) DEFAULT 10.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE renewals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  membership_year_id UUID REFERENCES membership_years(id),
  renewal_status membership_status DEFAULT 'pending',
  amount_due DECIMAL(10, 2),
  payment_status payment_status DEFAULT 'unpaid',
  reminder_sent_count INT DEFAULT 0,
  last_reminder_sent TIMESTAMPTZ,
  renewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, membership_year_id)
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id),
  renewal_id UUID REFERENCES renewals(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  asb_transaction_id TEXT,
  bank_reference TEXT,
  payment_date TIMESTAMPTZ,
  reconciled_at TIMESTAMPTZ,
  reconciled_by UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role admin_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  admin_id UUID REFERENCES admins(id),
  before_value JSONB,
  after_value JSONB,
  reason TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Templates
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_name TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communication Log
CREATE TABLE communication_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id),
  template_id UUID REFERENCES email_templates(id),
  sent_to TEXT NOT NULL,
  subject TEXT,
  status TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donations (future module)
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id),
  amount DECIMAL(10, 2) NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  stripe_payment_intent_id TEXT,
  donation_date TIMESTAMPTZ DEFAULT NOW(),
  receipt_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_household ON members(household_id);
CREATE INDEX idx_members_status ON members(membership_status);
CREATE INDEX idx_renewals_member ON renewals(member_id);
CREATE INDEX idx_payments_member ON payments(member_id);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);

-- Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewals ENABLE ROW LEVEL SECURITY;

-- Policies (basic - expand as needed)
CREATE POLICY "Members can view own data" ON members
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all" ON members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );
