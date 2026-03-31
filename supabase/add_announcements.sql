-- Announcements table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT, -- optional image for the announcement
  is_public BOOLEAN DEFAULT TRUE, -- true = visible on landing page, false = members only
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert a sample announcement
INSERT INTO announcements (title, content, is_public, is_published)
VALUES (
  'Welcome to the RCA Membership Portal',
  'Welcome to the new Riverhead Community Association membership portal. You can apply for membership, manage your details, and stay up to date with community news here.',
  true,
  true
);
