-- Manually mark payment as paid (simulating webhook)
UPDATE payments
SET 
  payment_status = 'paid',
  payment_date = NOW()
WHERE member_id = (
  SELECT id FROM members WHERE email = 'riverheadcommunityassociation@gmail.com'
)
AND payment_status = 'unpaid';

-- Verify
SELECT 
  p.id,
  p.amount,
  p.payment_status,
  p.payment_date,
  m.first_name,
  m.last_name
FROM payments p
JOIN members m ON p.member_id = m.id
WHERE m.email = 'riverheadcommunityassociation@gmail.com'
ORDER BY p.created_at DESC
LIMIT 1;
