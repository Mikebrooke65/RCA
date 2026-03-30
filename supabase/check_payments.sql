-- Check payments for the test member
SELECT 
  p.id,
  p.member_id,
  p.amount,
  p.payment_method,
  p.payment_status,
  p.stripe_checkout_session_id,
  p.stripe_payment_intent_id,
  p.payment_date,
  p.created_at,
  m.first_name,
  m.last_name,
  m.email
FROM payments p
JOIN members m ON p.member_id = m.id
WHERE m.email = 'riverheadcommunityassociation@gmail.com'
ORDER BY p.created_at DESC;
