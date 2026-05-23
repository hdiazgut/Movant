import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://belryptouhblzdnndasp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlbHJ5cHRvdWhibHpkbm5kYXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNTcxODIsImV4cCI6MjA5NDYzMzE4Mn0.PkeFGd8ce3s3abK24ok_9L-IWOjC8AGujpDMusgX7Kw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);