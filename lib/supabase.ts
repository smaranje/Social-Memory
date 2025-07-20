import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables (but allow build to proceed with fallbacks)
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    // Client-side: Show error to user
    console.error('Missing Supabase environment variables. Please check your .env.local file.')
  }
  // Use fallbacks for build time
}

if (supabaseUrl?.includes('placeholder') || supabaseAnonKey?.includes('placeholder')) {
  if (typeof window !== 'undefined') {
    // Client-side: Show error to user
    console.error('Supabase environment variables contain placeholder values. Please update your .env.local file with actual credentials.')
  }
}

// Use fallback values for build, but ensure they're obviously not production values
const finalUrl = supabaseUrl || 'https://placeholder.supabase.co'
const finalKey = supabaseAnonKey || 'placeholder-key'

export const supabase = createClient(finalUrl, finalKey)

// Runtime validation function
export const validateSupabaseConfig = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
  }
  
  if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
    throw new Error('Supabase environment variables contain placeholder values. Please update your .env.local file with actual credentials.')
  }
  
  return true
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          relationship: string
          how_we_met: string
          where_we_met: string
          company: string | null
          first_met_date: string
          last_contact_date: string
          tags: string[]
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id: string
          name: string
          relationship: string
          how_we_met: string
          where_we_met: string
          company?: string | null
          first_met_date: string
          last_contact_date: string
          tags: string[]
          notes: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          relationship?: string
          how_we_met?: string
          where_we_met?: string
          company?: string | null
          first_met_date?: string
          last_contact_date?: string
          tags?: string[]
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          contact_id: string
          user_id: string
          date: string
          summary: string
          topics: string[]
          promises: string[]
          mood: string
          next_steps: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          contact_id: string
          user_id: string
          date: string
          summary: string
          topics: string[]
          promises: string[]
          mood: string
          next_steps?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contact_id?: string
          user_id?: string
          date?: string
          summary?: string
          topics?: string[]
          promises?: string[]
          mood?: string
          next_steps?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          contact_id: string
          user_id: string
          date: string
          title: string
          description: string
          type: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          contact_id: string
          user_id: string
          date: string
          title: string
          description: string
          type: string
          completed: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contact_id?: string
          user_id?: string
          date?: string
          title?: string
          description?: string
          type?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      personal_details: {
        Row: {
          id: string
          contact_id: string
          user_id: string
          category: string
          detail: string
          importance: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          contact_id: string
          user_id: string
          category: string
          detail: string
          importance: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contact_id?: string
          user_id?: string
          category?: string
          detail?: string
          importance?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}