import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get member ID from auth user
    const { data: member } = await supabaseAdmin
      .from('members')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!member) return NextResponse.json({ payments: [] });

    const { data: payments, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('member_id', member.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ payments: payments || [] });
  } catch (error) {
    console.error('Payments fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
