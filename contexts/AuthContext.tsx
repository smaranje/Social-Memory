'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
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
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')) {
      console.error('Supabase configuration missing or using placeholder values.')
      console.error('Please update your .env.local file with actual Supabase credentials.')
      console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set')
      setLoading(false)
      return
    }

    console.log('Supabase Auth Context: Initializing...')
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set')

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        setUser(session?.user ?? null)
        
                 if (session?.user) {
           try {
             // Load user profile
             const profile = await database.getProfile(session.user.id)
             console.log('User profile loaded:', profile)
             setProfile(profile)
           } catch (error) {
             console.error('Error loading profile:', error)
             setProfile(null)
           }
         } else {
           setProfile(null)
         }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    // Check configuration before attempting to sign in
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')) {
      throw new Error('Supabase is not configured. Please set up your environment variables in .env.local file.')
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Supabase signIn error:', error)
        throw new Error(error.message || 'Failed to sign in')
      }
      
      console.log('Sign in successful:', data)
    } catch (error: any) {
      console.error('SignIn error:', error)
      if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        throw new Error('Unable to connect to authentication service. Please check your Supabase configuration and internet connection.')
      }
      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Check configuration before attempting to sign up
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')) {
      throw new Error('Supabase is not configured. Please set up your environment variables in .env.local file.')
    }

    try {
      const { data, error } = await supabase.auth.signUp({
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
      
      console.log('Sign up successful:', data)
    } catch (error: unknown) {
      console.error('SignUp error:', error)
      
      // Handle different types of errors
      if (error instanceof Error) {
        if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
          throw new Error('Unable to connect to authentication service. Please check your Supabase configuration and internet connection.')
        }
        throw error
      }
      
      // Handle AuthError specifically
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const authError = error as AuthError
        throw new Error(authError.message || 'Failed to create account')
      }
      
      throw new Error('An unexpected error occurred during sign up')
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