-- Clean up test data (use with caution!)
-- Replace 'your-email@example.com' with the email you want to remove

DELETE FROM payments WHERE member_id IN (
  SELECT id FROM members WHERE email = 'your-email@example.com'
);

DELETE FROM renewals WHERE member_id IN (
  SELECT id FROM members WHERE email = 'your-email@example.com'
);

DELETE FROM members WHERE email = 'your-email@example.com';

-- Or to delete ALL test members (if you want a fresh start):
-- TRUNCATE TABLE payments CASCADE;
-- TRUNCATE TABLE renewals CASCADE;
-- TRUNCATE TABLE members CASCADE;
-- TRUNCATE TABLE households CASCADE;
