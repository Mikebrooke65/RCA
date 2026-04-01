-- Delete member and all related data by email
-- Usage: Replace 'email@example.com' with the actual email

DO $$
DECLARE
    v_email TEXT := 'mikerbrooke@outlook.com';  -- CHANGE THIS EMAIL
    v_member_id UUID;
    v_household_id UUID;
    v_auth_user_id UUID;
BEGIN
    -- Get member details
    SELECT id, household_id, auth_user_id 
    INTO v_member_id, v_household_id, v_auth_user_id
    FROM members WHERE email = v_email;
    
    IF v_member_id IS NULL THEN
        RAISE NOTICE 'No member found with email: %', v_email;
        RETURN;
    END IF;
    
    RAISE NOTICE 'Deleting member: % (ID: %)', v_email, v_member_id;
    
    -- Delete payments
    DELETE FROM payments WHERE member_id = v_member_id;
    RAISE NOTICE 'Deleted payments';
    
    -- Delete from admins if exists
    DELETE FROM admins WHERE user_id = v_auth_user_id;
    RAISE NOTICE 'Deleted admin record (if any)';
    
    -- Delete member
    DELETE FROM members WHERE id = v_member_id;
    RAISE NOTICE 'Deleted member';
    
    -- Delete household if no other members
    IF v_household_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM members WHERE household_id = v_household_id) THEN
            DELETE FROM households WHERE id = v_household_id;
            RAISE NOTICE 'Deleted household (no other members)';
        ELSE
            RAISE NOTICE 'Household kept (other members exist)';
        END IF;
    END IF;
    
    RAISE NOTICE 'Done! Now delete auth user manually from Authentication > Users';
    RAISE NOTICE 'Auth user ID: %', v_auth_user_id;
END $$;
