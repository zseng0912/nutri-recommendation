import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hmwhpebjcdymbwzxpavb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtd2hwZWJqY2R5bWJ3enhwYXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMzU2MzUsImV4cCI6MjA2MTYxMTYzNX0.JLeJHpfNyJaXUvZV3-G4GSo4YyYYZz0X7Jy2Mjkx60Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 