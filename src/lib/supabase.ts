import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase config. Copy .env.example to .env.local and fill in ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
  );
}

/**
 * This key is public by design — it ships in the browser bundle. Security
 * comes from Postgres Row-Level Security, not from hiding this value.
 * The service_role key must never appear in client code.
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Keeps the user signed in across visits, so returning users land
    // straight on the directory instead of the sign-in screen.
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
