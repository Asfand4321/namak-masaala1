import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://vineyqzdyiivsxjljcey.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpbmV5cXpkeWlpdnN4amxqY2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NzQ4NjgsImV4cCI6MjA4MzU1MDg2OH0.DPFRvWZjfFGCyprXU8_HruTqL_QwaY3PT5rkvc5CImI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
