-- Documents table for file repository
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL, -- path in Supabase storage bucket
  file_name TEXT NOT NULL, -- original filename
  file_size INTEGER,
  file_type TEXT, -- mime type
  category TEXT DEFAULT 'general', -- minutes, accounts, constitution, planning, general
  uploaded_by UUID REFERENCES admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category filtering
CREATE INDEX idx_documents_category ON documents(category);
