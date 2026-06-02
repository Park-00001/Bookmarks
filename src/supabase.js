import { createClient } from '@supabase/supabase-js'

// .env 파일이나 Netlify 환경변수에서 가져옴
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
