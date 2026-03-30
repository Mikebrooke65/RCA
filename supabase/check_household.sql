-- Check household and members
SELECT 
  m.id,
  m.first_name,
  m.last_name,
  m.email,
  m.household_id,
  m.is_primary_household_member,
  h.normalized_address,
  h.raw_address
FROM members m
LEFT JOIN households h ON m.household_id = h.id
WHERE m.email = 'riverheadcommunityassociation@gmail.com';

-- Count members per household
SELECT 
  h.id as household_id,
  h.normalized_address,
  COUNT(m.id) as member_count,
  STRING_AGG(m.first_name || ' ' || m.last_name, ', ') as members
FROM households h
LEFT JOIN members m ON m.household_id = h.id
GROUP BY h.id, h.normalized_address;
