import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mqobmafrnqrzgoxytmbr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xb2JtYWZybnFyemdveHl0bWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM5Njg4MjQsImV4cCI6MjAzOTU0NDgyNH0.o9Hfy6OSYoZ_DNvTh9sXUYZkZ7kj7jReRAaO0zPvzdE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
