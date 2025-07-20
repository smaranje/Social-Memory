'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const code = searchParams.get('code')
        
        if (code) {
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Auth callback error:', error)
            router.push('/auth?error=callback_error')
            return
          }

          if (data.session) {
            // Successfully authenticated - redirect to main app
            console.log('Authentication successful, redirecting to main app')
            // Add a small delay to ensure session is fully established
            setTimeout(() => {
              router.push('/')
            }, 500)
            return
          }
        }
        
        // No code parameter or no session, check current session
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/auth?error=callback_error')
          return
        }

        if (data.session) {
          // User is authenticated, go to main app
          console.log('Session exists, redirecting to main app')
          setTimeout(() => {
            router.push('/')
          }, 500)
        } else {
          // No session, go back to auth
          console.log('No session found, redirecting to auth')
          router.push('/auth')
        }
      } catch (error) {
        console.error('Unexpected auth callback error:', error)
        router.push('/auth?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}