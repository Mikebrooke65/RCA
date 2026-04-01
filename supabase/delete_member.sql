-- Delete a member completely (run in Supabase SQL Editor)
-- Replace 'EMAIL_HERE' with the actual email address

DO $$
DECLARE
  member_email TEXT := 'mikerbrooke@outlook.com';  -- CHANGE THIS
  member_uuid UUID;
  household_uuid UUID;
  auth_uuid UUID;
BEGIN
  -- Get member details
  SELECT id, household_id, auth_user_id INTO member_uuid, household_uuid, auth_uuid
  FROM members WHERE email = member_email;

  IF member_uuid IS NULL THEN
    RAISE NOTICE 'Member not found: %', member_email;
    RETURN;
  END IF;

  -- Delete related records
  DELETE FROM payments WHERE member_id = member_uuid;
  DELETE FROM renewals WHERE member_id = member_uuid;
  DELETE FROM admins WHERE user_id = auth_uuid;
  DELETE FROM members WHERE id = member_uuid;
  
  -- Delete household if no other members use it
  IF household_uuid IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM members WHERE household_id = household_uuid) THEN
      DELETE FROM households WHERE id = household_uuid;
    END IF;
  END IF;

  -- Delete auth user (this may fail - delete manually in dashboard if so)
  IF auth_uuid IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = auth_uuid;
  END IF;

  RAISE NOTICE 'Deleted member: %', member_email;
END $$;
