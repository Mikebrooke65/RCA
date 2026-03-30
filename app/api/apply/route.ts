import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { validateRiverheadAddress } from '@/lib/address';
import { sendEmail, templates } from '@/lib/email/templates';
import { z } from 'zod';
import crypto from 'crypto';

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
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    let householdId = null;
    let isPrimary = false;

    // Validate address for Full Members
    if (data.membershipType === 'full_member') {
      if (!data.address) {
        return NextResponse.json(
          { error: 'Address required for Full Members' },
          { status: 400 }
        );
      }

      const addressValidation = await validateRiverheadAddress(data.address);
      
      if (!addressValidation.valid) {
        return NextResponse.json(
          { error: 'Address must be in Riverhead' },
          { status: 400 }
        );
      }

      // Check for existing household
      const { data: existingHousehold } = await supabaseAdmin
        .from('households')
        .select('id')
        .eq('normalized_address', addressValidation.normalized)
        .single();

      if (existingHousehold) {
        householdId = existingHousehold.id;
        
        // Check if there are any existing active members at this household
        const { data: existingMembers } = await supabaseAdmin
          .from('members')
          .select('id')
          .eq('household_id', existingHousehold.id)
          .neq('membership_status', 'removed');
        
        // If no active members, this person becomes primary
        isPrimary = !existingMembers || existingMembers.length === 0;
      } else {
        // Create new household
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

    // Create member
    const { data: member, error } = await supabaseAdmin
      .from('members')
      .insert({
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        membership_type: data.membershipType,
        membership_status: 'pending',
        household_id: householdId,
        is_primary_household_member: isPrimary,
        consent_given: data.consentGiven,
        consent_timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24 hour expiry

    // Store verification token
    await supabaseAdmin
      .from('members')
      .update({
        email_verification_token: verificationToken,
        email_verification_token_expires: tokenExpiry.toISOString(),
      })
      .eq('id', member.id);

    // Send verification email
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${verificationToken}`;
    
    try {
      await sendEmail(
        data.email,
        templates.emailVerification(data.firstName, verificationLink),
        member.id
      );
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue anyway - in development, email might fail
      // In production, you'd want to handle this differently
    }

    return NextResponse.json({ 
      success: true, 
      memberId: member.id,
      verificationLink: process.env.NODE_ENV === 'development' ? verificationLink : undefined,
      message: 'Application submitted. Please check your email to verify.'
    });

  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}
