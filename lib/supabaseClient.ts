import { createClient } from '@supabase/supabase-js';

// Configuração do cliente Supabase com as credenciais do projeto.
const supabaseUrl = 'https://vtnykubyupjahoalarba.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bnlrdWJ5dXBqYWhvYWxhcmJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MDI4MDgsImV4cCI6MjA3NzA3ODgwOH0.EfrjayHECpiWIJ1jSsY37qPcMzqd7Pal0OsgwWN5uzs';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("ERRO: As credenciais do Supabase estão ausentes em lib/supabaseClient.ts.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
