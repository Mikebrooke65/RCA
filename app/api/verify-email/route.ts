import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/?error=invalid_token', request.url));
  }

  // Find member by token
  const { data: member, error: findError } = await supabaseAdmin
    .from('members')
    .select('id, email_verification_token_expires, email_verified')
    .eq('email_verification_token', token)
    .single();

  if (findError || !member) {
    return NextResponse.redirect(new URL('/?error=invalid_token', request.url));
  }

  // Check if already verified
  if (member.email_verified) {
    return NextResponse.redirect(new URL('/?message=already_verified', request.url));
  }

  // Check if token expired
  if (new Date(member.email_verification_token_expires) < new Date()) {
    return NextResponse.redirect(new URL('/?error=token_expired', request.url));
  }

  // Verify email
  const { error } = await supabaseAdmin
    .from('members')
    .update({
      email_verified: true,
      email_verified_at: new Date().toISOString(),
      email_verification_token: null,
      email_verification_token_expires: null,
    })
    .eq('id', member.id);

  if (error) {
    return NextResponse.redirect(new URL('/?error=verification_failed', request.url));
  }

  // Redirect to success page
  return NextResponse.redirect(new URL('/?message=email_verified', request.url));
}
