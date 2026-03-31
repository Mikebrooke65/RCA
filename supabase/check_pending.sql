-- Check all pending members
SELECT 
  id,
  first_name,
  last_name,
  email,
  membership_type,
  membership_status,
  email_verified,
  created_at
FROM members
WHERE membership_status = 'pending'
ORDER BY created_at DESC;
