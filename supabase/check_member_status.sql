-- Check if email was verified and approved
SELECT 
  email,
  first_name,
  last_name,
  membership_type,
  membership_status,
  email_verified,
  email_verified_at,
  date_approved,
  date_joined,
  created_at
FROM members 
WHERE email = 'riverheadcommunityassociation@gmail.com'
ORDER BY created_at DESC
LIMIT 1;
