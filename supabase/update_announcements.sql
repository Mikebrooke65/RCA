-- Update announcements table to have separate public/members flags
-- Run this in Supabase SQL Editor

-- Add new column for members visibility
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS show_members BOOLEAN DEFAULT true;

-- Rename is_public to show_public for clarity
ALTER TABLE announcements RENAME COLUMN is_public TO show_public;

-- Update existing data: if was members-only (is_public=false), set show_members=true, show_public=false
-- If was public (is_public=true), set both to true
UPDATE announcements SET show_members = true WHERE show_public = false;
UPDATE announcements SET show_members = true WHERE show_public = true;
