-- Add auth_user_id to link Supabase Auth users to members
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

-- Add auth_user_id to admins table
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_members_auth_user_id ON members(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);

-- Add unique constraint to ensure one member per auth user
ALTER TABLE members 
ADD CONSTRAINT unique_auth_user_id UNIQUE (auth_user_id);
