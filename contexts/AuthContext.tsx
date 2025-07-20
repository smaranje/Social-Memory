'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { database } from '@/lib/database'

interface AuthContextType {
  user: User | null
  profile: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase configuration missing. Please set up your environment variables.')
      console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing')
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      const profileData = await database.getProfile(userId)
      setProfile(profileData)
    } catch (error: any) {
      // If profile doesn't exist, create it
      if (error.code === 'PGRST116') {
        const user = await supabase.auth.getUser()
        if (user.data.user) {
          try {
            const newProfile = await database.createProfile({
              id: userId,
              email: user.data.user.email!,
              full_name: user.data.user.user_metadata?.full_name
            })
            setProfile(newProfile)
          } catch (createError) {
            console.error('Error creating profile:', createError)
          }
        }
      } else {
        console.error('Error loading profile:', error)
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        console.error('Supabase signIn error:', error)
        throw new Error(error.message || 'Failed to sign in')
      }
    } catch (error: any) {
      console.error('SignIn error:', error)
      if (error.message?.includes('fetch')) {
        throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.')
      }
      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      if (error) {
        console.error('Supabase signUp error:', error)
        throw new Error(error.message || 'Failed to create account')
      }
    } catch (error: any) {
      console.error('SignUp error:', error)
      if (error.message?.includes('fetch')) {
        throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.')
      }
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    if (!user) throw new Error('No user logged in')
    
    const updatedProfile = await database.updateProfile(user.id, updates)
    setProfile(updatedProfile)
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}