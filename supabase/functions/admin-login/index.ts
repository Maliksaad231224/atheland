import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password } = await req.json();
    const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD');

    console.log('Login attempt received');
    console.log('Password received length:', password?.length);
    console.log('ADMIN_PASSWORD configured:', !!ADMIN_PASSWORD);
    console.log('ADMIN_PASSWORD length:', ADMIN_PASSWORD?.length);

    if (!ADMIN_PASSWORD) {
      console.error('ADMIN_PASSWORD not configured');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify password - trim whitespace to avoid issues
    const trimmedPassword = password?.trim();
    const trimmedAdminPassword = ADMIN_PASSWORD.trim();
    
    console.log('Password match result:', trimmedPassword === trimmedAdminPassword);
    
    if (trimmedPassword !== trimmedAdminPassword) {
      console.log('Password mismatch - login denied');
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Password verified successfully');

    // Password is correct - generate a secure session token
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    return new Response(
      JSON.stringify({ 
        success: true, 
        sessionToken,
        expiresAt: expiresAt.toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in admin-login:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred during login' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
