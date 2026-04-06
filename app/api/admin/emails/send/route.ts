import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'riverheadcommunityassociation@gmail.com';

type RecipientGroup = 'all' | 'members' | 'friends';

function buildEmailHtml(subject: string, body: string, imageUrl: string | null, includeLogo: boolean): string {
  const logoHtml = includeLogo ? `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #2E7D32; color: white; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 24px;">
        RCA
      </div>
      <p style="color: #666; font-size: 14px; margin-top: 8px;">Riverhead Community Association</p>
    </div>
  ` : '';

  const imageHtml = imageUrl ? `
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="${imageUrl}" alt="Email image" style="max-width: 100%; height: auto; border-radius: 8px; max-height: 300px;" />
    </div>
  ` : '';

  const bodyHtml = body.split('\n\n').map(p => `<p style="margin: 0 0 16px 0;">${p.replace(/\n/g, '<br>')}</p>`).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      ${logoHtml}
      ${imageHtml}
      ${bodyHtml}
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; text-align: center; font-size: 14px; color: #666;">
        <p style="margin: 0;">Riverhead Community Association</p>
        <p style="margin: 4px 0;"><a href="https://riverheadcommunity.org.nz" style="color: #2E7D32;">riverheadcommunity.org.nz</a></p>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { subject, body, recipients, imageUrl, includeLogo } = await request.json();

    if (!subject || !body) {
      return NextResponse.json({ error: 'Subject and body required' }, { status: 400 });
    }

    // Build query based on recipient group
    let query = supabaseAdmin
      .from('members')
      .select('id, email, first_name')
      .eq('membership_status', 'active');

    if (recipients === 'members') {
      query = query.eq('membership_type', 'full_member');
    } else if (recipients === 'friends') {
      query = query.eq('membership_type', 'friend');
    }

    const { data: recipientList, error } = await query;

    if (error) {
      console.error('Failed to fetch recipients:', error);
      return NextResponse.json({ error: 'Failed to fetch recipients' }, { status: 500 });
    }

    if (!recipientList || recipientList.length === 0) {
      return NextResponse.json({ error: 'No recipients found' }, { status: 400 });
    }

    const html = buildEmailHtml(subject, body, imageUrl, includeLogo);
    let sent = 0;
    const errors: string[] = [];

    // Send emails (Resend supports batch, but we'll do individual for logging)
    for (const recipient of recipientList) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: [recipient.email],
          subject: subject,
          html: html,
        });

        // Log to communication_log
        await supabaseAdmin.from('communication_log').insert({
          member_id: recipient.id,
          sent_to: recipient.email,
          subject: subject,
          status: 'sent',
        });

        sent++;
      } catch (err) {
        console.error(`Failed to send to ${recipient.email}:`, err);
        errors.push(recipient.email);
      }
    }

    return NextResponse.json({ 
      sent, 
      total: recipientList.length,
      errors: errors.length > 0 ? errors : undefined 
    });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
