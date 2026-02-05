import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

/**
 * Creates a Supabase client for server-side use (API routes, Server Components)
 * Uses Clerk token for authentication with RLS policies
 */
export async function createSupabaseServerClient() {
  const { getToken } = auth();
  const supabaseAccessToken = await getToken({ template: 'supabase' });

  if (!supabaseAccessToken) {
    throw new Error('No Supabase token available. User must be authenticated.');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    }
  );
}

/**
 * Creates a Supabase admin client with service role key
 * WARNING: Only use in secure server-side contexts (API routes, webhooks)
 * This bypasses RLS policies - use with caution!
 */
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
