
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fwfnxyhrivpmgabvfqpf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3Zm54eWhyaXZwbWdhYnZmcXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NDAyNTYsImV4cCI6MjA2MDQxNjI1Nn0.DbvBx6Wv1e-aQ2kOyAL-QlU9QLOc_ijSLdpmSZeylKw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
