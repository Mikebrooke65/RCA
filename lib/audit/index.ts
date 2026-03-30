import { supabaseAdmin } from '@/lib/supabase/client';

export async function logAudit({
  actionType,
  entityType,
  entityId,
  adminId,
  beforeValue,
  afterValue,
  reason,
  ipAddress,
}: {
  actionType: string;
  entityType: string;
  entityId?: string;
  adminId?: string;
  beforeValue?: any;
  afterValue?: any;
  reason?: string;
  ipAddress?: string;
}) {
  try {
    await supabaseAdmin.from('audit_log').insert({
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId,
      admin_id: adminId,
      before_value: beforeValue,
      after_value: afterValue,
      reason,
      ip_address: ipAddress,
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
}
