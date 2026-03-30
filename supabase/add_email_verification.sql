-- Add email verification token columns to members table
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS email_verification_token TEXT,
ADD COLUMN IF NOT EXISTS email_verification_token_expires TIMESTAMPTZ;

-- Add index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_members_verification_token 
ON members(email_verification_token) 
WHERE email_verification_token IS NOT NULL;
