import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Vite inlines env vars at build time, so a deploy missing them produces a
 * bundle that can never work until it is rebuilt. Surfacing that as a flag
 * (rather than throwing on import) lets the app render an explanation
 * instead of a blank page.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

/**
 * This key is public by design — it ships in the browser bundle. Security
 * comes from Postgres Row-Level Security, not from hiding this value.
 * The service_role key must never appear in client code.
 */
export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '', {
  auth: {
    // Keeps the user signed in across visits, so returning users land
    // straight on the directory instead of the sign-in screen.
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
