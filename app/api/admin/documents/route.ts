import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { logAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ documents: data || [] }, {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, file_path, file_name, file_size, file_type, category } = body;

  const { data, error } = await supabaseAdmin
    .from('documents')
    .insert({ title, description, file_path, file_name, file_size, file_type, category })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actionType: 'document_uploaded',
    entityType: 'document',
    entityId: data.id,
    afterValue: { title, category, file_name },
  });

  return NextResponse.json({ document: data });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, title, description, category } = body;

  // Get before value
  const { data: before } = await supabaseAdmin
    .from('documents')
    .select('title, category')
    .eq('id', id)
    .single();

  const { error } = await supabaseAdmin
    .from('documents')
    .update({ title, description, category, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actionType: 'document_updated',
    entityType: 'document',
    entityId: id,
    beforeValue: before,
    afterValue: { title, category },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { id, file_path } = await request.json();

  // Get before value
  const { data: before } = await supabaseAdmin
    .from('documents')
    .select('title, file_name')
    .eq('id', id)
    .single();

  // Delete from storage
  await supabaseAdmin.storage.from('documents').remove([file_path]);

  // Delete from database
  const { error } = await supabaseAdmin.from('documents').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actionType: 'document_deleted',
    entityType: 'document',
    entityId: id,
    beforeValue: before,
  });

  return NextResponse.json({ success: true });
}