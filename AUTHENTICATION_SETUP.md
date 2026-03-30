# Authentication Setup Guide

## Step 1: Run Database Migration

Run this SQL in Supabase SQL Editor:
```sql
-- From: supabase/add_auth_columns.sql
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_members_auth_user_id ON members(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);

ALTER TABLE members 
ADD CONSTRAINT unique_auth_user_id UNIQUE (auth_user_id);
```

## Step 2: Create Auth User for Existing Member

Since you already have a member (riverheadcommunityassociation@gmail.com), we need to:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter:
   - Email: riverheadcommunityassociation@gmail.com
   - Password: (choose a password)
   - Auto Confirm User: YES (check this box)
4. Click "Create user"
5. Copy the user ID that was created

## Step 3: Link Auth User to Member Record

Run this SQL (replace USER_ID with the ID from step 2):

```sql
UPDATE members 
SET auth_user_id = 'USER_ID_HERE'
WHERE email = 'riverheadcommunityassociation@gmail.com';
```

## Step 4: (Optional) Create Admin User

If you want admin access:

```sql
INSERT INTO admins (user_id, email, role)
VALUES ('USER_ID_HERE', 'riverheadcommunityassociation@gmail.com', 'super_admin');
```

## Step 5: Test Login

1. Go to http://localhost:3000
2. Click "Member Login"
3. Enter your email and password
4. You should be redirected to either:
   - /member (if regular member)
   - /admin (if admin)

## Future Member Onboarding Flow

When new members apply and get approved:
1. Admin approves application
2. System creates Supabase Auth user automatically
3. System sends email with temporary password or magic link
4. Member logs in and can access portal

This automation will be implemented next!
