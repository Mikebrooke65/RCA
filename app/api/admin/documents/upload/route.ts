import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const buffer = await file.arrayBuffer();

    const { error } = await supabaseAdmin.storage
      .from('documents')
      .upload(filePath, buffer, { contentType: file.type });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
