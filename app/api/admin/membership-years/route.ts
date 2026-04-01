import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { logAudit } from '@/lib/audit';

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

  await logAudit({
    actionType: 'membership_year_created',
    entityType: 'membership_year',
    entityId: data.id,
    afterValue: { year_start, year_end, renewal_fee },
  });

  return NextResponse.json({ year: data });
}

export async function PATCH(request: NextRequest) {
  const { id, renewal_fee } = await request.json();

  // Get before value
  const { data: before } = await supabaseAdmin
    .from('membership_years')
    .select('renewal_fee, year_start, year_end')
    .eq('id', id)
    .single();

  const { data, error } = await supabaseAdmin
    .from('membership_years')
    .update({ renewal_fee })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actionType: 'membership_fee_updated',
    entityType: 'membership_year',
    entityId: id,
    beforeValue: { renewal_fee: before?.renewal_fee },
    afterValue: { renewal_fee, year: `${before?.year_start} - ${before?.year_end}` },
  });

  return NextResponse.json({ year: data });
}
