import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fgppwdgqpzwrkmahfzql.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZncHB3ZGdxcHp3cmttYWhmenFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNDcxNDQsImV4cCI6MjA3MjgyMzE0NH0.tplnI2VAVFARyEBKjPWr3BUm2obnuq1JsRQKh_V8-hw";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
