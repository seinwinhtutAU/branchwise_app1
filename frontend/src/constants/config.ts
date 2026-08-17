export const config = {
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  apiBaseUrl: process.env.API_BASE_URL ?? "http://localhost:8000/api/v1",
} as const;

export const isSupabaseConfigured = Boolean(config.supabaseUrl && config.supabaseAnonKey);
