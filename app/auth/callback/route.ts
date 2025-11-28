import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');

  console.log('Auth callback received:', { code: !!code, type });

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(new URL('/?error=auth_failed', requestUrl.origin));
      }

      // If it's a password recovery, redirect to reset password page
      if (type === 'recovery') {
        console.log('Redirecting to reset-password page');
        return NextResponse.redirect(new URL('/reset-password', requestUrl.origin));
      }

      // Otherwise redirect to home
      return NextResponse.redirect(new URL('/', requestUrl.origin));
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(new URL('/?error=auth_failed', requestUrl.origin));
    }
  }

  // No code provided, redirect to home
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
