'use client'

import { useEffect, useState } from 'react'
import { ConfigurationCheck } from './ConfigurationCheck'

interface ConfigStatus {
  isConfigured: boolean
  loading: boolean
}

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ConfigStatus>({
    isConfigured: false,
    loading: true
  })

  useEffect(() => {
    const checkConfiguration = () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      const urlValid = url && !url.includes('placeholder') && url.includes('supabase.co')
      const keyValid = key && !key.includes('placeholder') && key.startsWith('eyJ')
      const isConfigured = !!urlValid && !!keyValid

      setConfig({
        isConfigured,
        loading: false
      })
    }

    checkConfiguration()
  }, [])

  if (config.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking configuration...</p>
        </div>
      </div>
    )
  }

  if (!config.isConfigured) {
    return <ConfigurationCheck />
  }

  return <>{children}</>
}