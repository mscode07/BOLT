import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabasePublic = createClient(
  supabaseUrl || "",
  supabaseAnonKey || ""
);

export const supabaseAdmin = createClient(
  supabaseUrl || "",
  supabaseServiceKey || ""
);
