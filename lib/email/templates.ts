import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'riverheadcommunityassociation@gmail.com';

export interface EmailTemplate {
  subject: string;
  body: string;
}

export const templates = {
  applicationReceived: (firstName: string): EmailTemplate => ({
    subject: 'RCA Application Received',
    body: `Hi ${firstName},\n\nThank you for applying to join the Riverhead Community Association.\n\nWe've received your application and will review it shortly. You'll hear from us within 2-3 business days.\n\nKind regards,\nRCA Membership Team`,
  }),

  emailVerification: (firstName: string, verificationLink: string): EmailTemplate => ({
    subject: 'Verify Your Email - RCA',
    body: `Hi ${firstName},\n\nPlease verify your email address by clicking the link below:\n\n${verificationLink}\n\nThis link will expire in 24 hours.\n\nKind regards,\nRCA Membership Team`,
  }),

  applicationApproved: (firstName: string, paymentLink?: string): EmailTemplate => ({
    subject: 'Welcome to RCA!',
    body: `Hi ${firstName},\n\nGreat news! Your RCA membership application has been approved.\n\n${paymentLink ? `Please complete your payment here: ${paymentLink}\n\n` : ''}You can now access your member portal and join our Facebook community group.\n\nWelcome to the Riverhead Community!\n\nKind regards,\nRCA Membership Team`,
  }),

  applicationDeclined: (firstName: string, reason?: string): EmailTemplate => ({
    subject: 'RCA Application Update',
    body: `Hi ${firstName},\n\nThank you for your interest in joining the Riverhead Community Association.\n\nUnfortunately, we're unable to approve your application at this time.${reason ? `\n\nReason: ${reason}` : ''}\n\nIf you have questions, please contact us.\n\nKind regards,\nRCA Membership Team`,
  }),

  renewalReminder: (firstName: string, renewalLink: string, dueDate: string): EmailTemplate => ({
    subject: 'RCA Membership Renewal',
    body: `Hi ${firstName},\n\nIt's time to renew your RCA membership for the new year.\n\nPlease renew by ${dueDate}: ${renewalLink}\n\nYour continued support helps keep our community strong.\n\nKind regards,\nRCA Membership Team`,
  }),

  paymentReceived: (firstName: string, amount: number, receiptUrl: string): EmailTemplate => ({
    subject: 'Payment Received - RCA',
    body: `Hi ${firstName},\n\nThank you! We've received your payment of $${amount.toFixed(2)}.\n\nDownload your receipt: ${receiptUrl}\n\nKind regards,\nRCA Membership Team`,
  }),

  donationReceived: (name: string, amount: number, receiptNumber: string, date: string): EmailTemplate => ({
    subject: 'Thank You for Your Donation - RCA',
    body: `Hi ${name},\n\nThank you for your generous donation to the Riverhead Community Association!\n\nDonation Details:\n- Amount: $${amount.toFixed(2)} NZD\n- Date: ${date}\n- Receipt Number: ${receiptNumber}\n\nYour support helps us continue building a stronger community in Riverhead.\n\nKind regards,\nRCA Membership Team`,
  }),
};


export async function sendEmail(to: string, template: EmailTemplate, memberId?: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: template.subject,
      html: template.body.replace(/\n/g, '<br>'),
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    // Log to communication_log
    if (memberId) {
      const { supabaseAdmin } = await import('@/lib/supabase/client');
      await supabaseAdmin.from('communication_log').insert({
        member_id: memberId,
        sent_to: to,
        subject: template.subject,
        status: 'sent',
      });
    }

    return data;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}
