'use client';

import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';

/**
 * Hook to create a Supabase client for client-side use (React components)
 * Automatically includes Clerk authentication token in requests
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const supabase = useSupabaseClient();
 *   
 *   const fetchData = async () => {
 *     const { data, error } = await supabase
 *       .from('users')
 *       .select('*')
 *       .single();
 *   };
 * }
 * ```
 */
export function useSupabaseClient() {
  const { getToken } = useAuth();

  return useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url, options = {}) => {
            const clerkToken = await getToken({ template: 'supabase' });

            const headers = new Headers(options?.headers);
            headers.set('Authorization', `Bearer ${clerkToken}`);

            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      }
    );
  }, [getToken]);
}
