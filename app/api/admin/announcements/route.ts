import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { logAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ announcements: data || [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, content, image_url, is_public, is_published } = body;

  const { data, error } = await supabaseAdmin
    .from('announcements')
    .insert({ title, content, image_url, is_public, is_published, published_at: new Date().toISOString() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actionType: 'announcement_created',
    entityType: 'announcement',
    entityId: data.id,
    afterValue: { title, is_public, is_published },
  });

  return NextResponse.json({ announcement: data });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  // Get before value
  const { data: before } = await supabaseAdmin
    .from('announcements')
    .select('title, is_public, is_published')
    .eq('id', id)
    .single();

  const { data, error } = await supabaseAdmin
    .from('announcements')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actionType: 'announcement_updated',
    entityType: 'announcement',
    entityId: id,
    beforeValue: before,
    afterValue: { title: data.title, is_public: data.is_public, is_published: data.is_published },
  });

  return NextResponse.json({ announcement: data });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  // Get before value
  const { data: before } = await supabaseAdmin
    .from('announcements')
    .select('title')
    .eq('id', id)
    .single();

  const { error } = await supabaseAdmin
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actionType: 'announcement_deleted',
    entityType: 'announcement',
    entityId: id,
    beforeValue: before,
  });

  return NextResponse.json({ success: true });
}
