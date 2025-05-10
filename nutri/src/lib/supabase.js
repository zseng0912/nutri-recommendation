// Import the Supabase client library
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Configuration
 * These are the connection details for the Supabase project
 * The URL and anon key are used to initialize the Supabase client
 */
const supabaseUrl = 'https://hmwhpebjcdymbwzxpavb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtd2hwZWJqY2R5bWJ3enhwYXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMzU2MzUsImV4cCI6MjA2MTYxMTYzNX0.JLeJHpfNyJaXUvZV3-G4GSo4YyYYZz0X7Jy2Mjkx60Y';

/**
 * Initialize Supabase Client
 * Creates a new Supabase client instance that will be used throughout the application
 * This client is exported and used in other files for database operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
