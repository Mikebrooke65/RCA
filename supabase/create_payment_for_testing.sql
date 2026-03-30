-- Delete the exempt payment record
DELETE FROM payments 
WHERE member_id = (
  SELECT id FROM members WHERE email = 'riverheadcommunityassociation@gmail.com'
);

-- Create a new unpaid payment record for testing
INSERT INTO payments (
  member_id,
  amount,
  payment_method,
  payment_status
)
SELECT 
  id,
  10.00,
  'stripe',
  'unpaid'
FROM members 
WHERE email = 'riverheadcommunityassociation@gmail.com';

-- Verify
SELECT 
  p.id,
  p.amount,
  p.payment_status,
  m.first_name,
  m.last_name
FROM payments p
JOIN members m ON p.member_id = m.id
WHERE m.email = 'riverheadcommunityassociation@gmail.com';
