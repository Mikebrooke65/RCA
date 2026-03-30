import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET() {
  try {
    // TODO: Get authenticated user ID from session
    const userId = 'temp-user-id'; // Replace with actual auth

    const { data: member, error } = await supabaseAdmin
      .from('members')
      .select('*, households(normalized_address)')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return NextResponse.json({ member });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
