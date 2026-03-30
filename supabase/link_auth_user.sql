-- Link auth user to member record
UPDATE members 
SET auth_user_id = 'd3289938-b738-46f6-8fc9-83c5f6e07f11'
WHERE email = 'riverheadcommunityassociation@gmail.com';

-- Create admin record
INSERT INTO admins (user_id, email, role)
VALUES ('d3289938-b738-46f6-8fc9-83c5f6e07f11', 'riverheadcommunityassociation@gmail.com', 'super_admin');

-- Verify the link
SELECT 
  m.id,
  m.email,
  m.first_name,
  m.last_name,
  m.auth_user_id,
  m.membership_status
FROM members m
WHERE m.email = 'riverheadcommunityassociation@gmail.com';

-- Verify admin record
SELECT 
  a.id,
  a.email,
  a.role,
  a.user_id
FROM admins a
WHERE a.email = 'riverheadcommunityassociation@gmail.com';
