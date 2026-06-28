import { createClient } from '@supabase/supabase-js'

// The Supabase URL and publishable (anon) key are safe to expose in the
// frontend — all data access is guarded by row-level security policies.
// Values come from Vite env vars when provided, with the project defaults
// as a fallback so the production build works out of the box.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://enocqhnbzxhcbolexjmx.supabase.co'
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_3RdxNtQtssk7QwiaWAOB-Q_Xl99gtvx'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
