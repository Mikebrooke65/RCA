import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    // Get the auth token from the request header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ isAdmin: false, isAuthenticated: false });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token server-side
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return NextResponse.json({ isAdmin: false, isAuthenticated: false });
    }

    // Check if admin
    const { data: adminData } = await supabaseAdmin
      .from('admins')
      .select('id, role')
      .eq('user_id', user.id)
      .single();
    
    return NextResponse.json({ 
      isAdmin: !!adminData,
      isAuthenticated: true,
      userId: user.id,
      role: adminData?.role || null,
    });
  } catch (error) {
    console.error('Check role error:', error);
    return NextResponse.json({ isAdmin: false, isAuthenticated: false });
  }
}
