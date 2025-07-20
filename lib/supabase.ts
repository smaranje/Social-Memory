import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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