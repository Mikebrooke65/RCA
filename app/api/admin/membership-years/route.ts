import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('membership_years')
    .select('*')
    .order('year_start', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ years: data });
}

export async function POST(request: NextRequest) {
  const { year_start, year_end, renewal_fee } = await request.json();

  const { data, error } = await supabaseAdmin
    .from('membership_years')
    .insert({ year_start, year_end, renewal_fee })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ year: data });
}

export async function PATCH(request: NextRequest) {
  const { id, renewal_fee } = await request.json();

  const { data, error } = await supabaseAdmin
    .from('membership_years')
    .update({ renewal_fee })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ year: data });
}
