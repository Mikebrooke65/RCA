import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ documents: data || [] });
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
  return NextResponse.json({ document: data });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, title, description, category } = body;

  const { error } = await supabaseAdmin
    .from('documents')
    .update({ title, description, category, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { id, file_path } = await request.json();

  // Delete from storage
  await supabaseAdmin.storage.from('documents').remove([file_path]);

  // Delete from database
  const { error } = await supabaseAdmin.from('documents').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}