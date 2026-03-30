-- Get member ID for testing
SELECT 
  id as member_id,
  first_name,
  last_name,
  email
FROM members 
WHERE email = 'riverheadcommunityassociation@gmail.com';
