import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { logAudit } from '@/lib/audit';

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { first_name, last_name, phone } = await request.json();

    // Get current values for audit log
    const { data: before } = await supabaseAdmin
      .from('members')
      .select('id, first_name, last_name, phone')
      .eq('auth_user_id', user.id)
      .single();

    const { error } = await supabaseAdmin
      .from('members')
      .update({ first_name, last_name, phone, updated_at: new Date().toISOString() })
      .eq('auth_user_id', user.id);

    if (error) throw error;

    // Log the self-service update
    await logAudit({
      actionType: 'member_self_update',
      entityType: 'member',
      entityId: before?.id,
      beforeValue: { first_name: before?.first_name, last_name: before?.last_name, phone: before?.phone },
      afterValue: { first_name, last_name, phone },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update details' }, { status: 500 });
  }
}
