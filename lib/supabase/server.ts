import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';

// DNS Accelerator: Bypass ISP UDP DNS packet drops on Supabase host in Node.js
if (typeof window === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dns = require('dns');
    const origLookup = dns.lookup;
    const targetUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (targetUrl) {
      const targetHost = new URL(targetUrl).hostname;
      const FAST_IP = '104.18.38.10';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dns.lookup = function (hostname: string, options: any, callback: any) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        if (hostname === targetHost) {
          if (options && options.all) {
            return callback(null, [{ address: FAST_IP, family: 4 }]);
          }
          return callback(null, FAST_IP, 4);
        }
        return origLookup(hostname, options, callback);
      };
    }
  } catch {
    // Ignore in non-node environments
  }
}

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

/**
 * Server client dengan Service Role Key untuk operasi admin tingkat sistem (bypass RLS jika diperlukan)
 */
export function createAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

  return createServerClient<Database>(supabaseUrl, serviceKey, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  });
}
