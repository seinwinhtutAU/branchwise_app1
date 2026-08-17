import { createClient } from "@supabase/supabase-js";

import { config, isSupabaseConfigured } from "@/constants/config";

// createClient throws synchronously if either argument is empty, which would
// otherwise crash the whole app at import time (blank screen, no error UI)
// whenever SUPABASE_URL/SUPABASE_ANON_KEY aren't set yet. Fall back to a
// harmless placeholder so the app can render its own "not configured" screen
// instead — see ConfigurationError.
export const supabase = createClient(
  isSupabaseConfigured ? config.supabaseUrl : "https://placeholder.supabase.co",
  isSupabaseConfigured ? config.supabaseAnonKey : "placeholder-anon-key",
);
