-- Get verification link for testing
SELECT 
  email,
  first_name,
  CONCAT('http://localhost:3000/api/verify-email?token=', email_verification_token) as verification_link,
  email_verification_token_expires
FROM members 
WHERE email_verified = false 
  AND email_verification_token IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;
