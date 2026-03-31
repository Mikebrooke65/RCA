import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { validateRiverheadAddress } from '@/lib/address';
import { createCheckoutSession } from '@/lib/stripe';
import { z } from 'zod';

const applicationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  membershipType: z.enum(['full_member', 'friend']),
  address: z.string().optional(),
  consentGiven: z.boolean().refine(val => val === true),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = applicationSchema.parse(body);

    // Check for existing email
    const { data: existing } = await supabaseAdmin
      .from('members')
      .select('id')
      .eq('email', data.email)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    let householdId = null;
    let isPrimary = false;

    // Validate address for Full Members
    if (data.membershipType === 'full_member') {
      if (!data.address) {
        return NextResponse.json({ error: 'Address required for Full Members' }, { status: 400 });
      }

      const addressValidation = await validateRiverheadAddress(data.address);
      
      if (!addressValidation.valid) {
        return NextResponse.json({ error: 'Address must be in Riverhead' }, { status: 400 });
      }

      // Check for existing household
      const { data: existingHousehold } = await supabaseAdmin
        .from('households')
        .select('id')
        .eq('normalized_address', addressValidation.normalized)
        .single();

      if (existingHousehold) {
        householdId = existingHousehold.id;
        const { data: existingMembers } = await supabaseAdmin
          .from('members')
          .select('id')
          .eq('household_id', existingHousehold.id)
          .neq('membership_status', 'removed');
        isPrimary = !existingMembers || existingMembers.length === 0;
      } else {
        const { data: newHousehold } = await supabaseAdmin
          .from('households')
          .insert({
            raw_address: data.address,
            normalized_address: addressValidation.normalized,
            suburb: addressValidation.suburb,
            city: addressValidation.city,
            postcode: addressValidation.postcode,
            latitude: addressValidation.latitude,
            longitude: addressValidation.longitude,
            is_validated: true,
            validation_date: new Date().toISOString(),
          })
          .select()
          .single();
        householdId = newHousehold?.id;
        isPrimary = true;
      }
    }

    // -------------------------------------------------------
    // FULL MEMBER - Auto-approve flow
    // -------------------------------------------------------
    if (data.membershipType === 'full_member') {
      const now = new Date().toISOString();

      // Create member as active immediately
      const { data: member, error } = await supabaseAdmin
        .from('members')
        .insert({
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          membership_type: 'full_member',
          membership_status: 'active',
          email_verified: true,
          email_verified_at: now,
          household_id: householdId,
          is_primary_household_member: isPrimary,
          consent_given: data.consentGiven,
          consent_timestamp: now,
          date_approved: now,
          date_joined: now,
        })
        .select()
        .single();

      if (error) throw error;

      // Create Supabase Auth account and send invite
      const { data: authUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        data.email,
        {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/member`,
          data: { member_id: member.id }
        }
      );

      if (!inviteError && authUser?.user) {
        await supabaseAdmin
          .from('members')
          .update({ auth_user_id: authUser.user.id })
          .eq('id', member.id);
      }

      // Create payment record
      let paymentLink = null;

      if (isPrimary) {
        // Primary household member pays $10
        const { data: payment } = await supabaseAdmin
          .from('payments')
          .insert({
            member_id: member.id,
            amount: 10.00,
            payment_method: 'stripe',
            payment_status: 'unpaid',
          })
          .select()
          .single();

        const session = await createCheckoutSession(member.id, 10);
        await supabaseAdmin
          .from('payments')
          .update({ stripe_checkout_session_id: session.id })
          .eq('id', payment.id);

        paymentLink = session.url;
      } else {
        // Additional household member - exempt
        await supabaseAdmin
          .from('payments')
          .insert({
            member_id: member.id,
            amount: 0,
            payment_method: 'other',
            payment_status: 'exempt',
          });
      }

      return NextResponse.json({
        success: true,
        autoApproved: true,
        requiresPayment: isPrimary,
        paymentLink: paymentLink,
        message: isPrimary
          ? 'Application approved! Check your email to set up your account, then complete your payment.'
          : 'Application approved! Check your email to set up your account.',
      });
    }

    // -------------------------------------------------------
    // FRIEND - Pending approval flow (admin reviews)
    // -------------------------------------------------------
    const { data: member, error } = await supabaseAdmin
      .from('members')
      .insert({
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        membership_type: 'friend',
        membership_status: 'pending',
        email_verified: true, // Skip email verification for simplicity
        email_verified_at: new Date().toISOString(),
        consent_given: data.consentGiven,
        consent_timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      autoApproved: false,
      message: 'Application submitted! We\'ll review it and be in touch soon.',
    });

  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 });
  }
}
