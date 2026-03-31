-- Check what the pending query actually returns
SELECT id, first_name, membership_status, email_verified
FROM members
WHERE membership_status = 'pending'
AND email_verified = true;
