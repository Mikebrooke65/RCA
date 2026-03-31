import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

// Public endpoint - returns public announcements for landing page
// Pass ?members=true with auth token for member-only announcements
export async function GET(request: NextRequest) {
  const membersOnly = request.nextUrl.searchParams.get('members') === 'true';
  
  let query = supabaseAdmin
    .from('announcements')
    .select('id, title, content, image_url, is_public, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (!membersOnly) {
    query = query.eq('is_public', true);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ announcements: data || [] });
}
