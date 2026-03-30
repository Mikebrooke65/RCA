-- Check current status
SELECT 
  email,
  household_id,
  is_primary_household_member
FROM members 
WHERE email = 'riverheadcommunityassociation@gmail.com';

-- Fix: Set as primary household member since you're the only one
UPDATE members 
SET is_primary_household_member = true
WHERE email = 'riverheadcommunityassociation@gmail.com';

-- Verify the fix
SELECT 
  email,
  household_id,
  is_primary_household_member
FROM members 
WHERE email = 'riverheadcommunityassociation@gmail.com';
