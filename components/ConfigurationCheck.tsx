'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react'

interface ConfigStatus {
  hasUrl: boolean
  hasKey: boolean
  isConfigured: boolean
  urlValid: boolean
  keyValid: boolean
}

export function ConfigurationCheck() {
  const [config, setConfig] = useState<ConfigStatus>({
    hasUrl: false,
    hasKey: false,
    isConfigured: false,
    urlValid: false,
    keyValid: false
  })

  const checkConfiguration = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const hasUrl = !!url
    const hasKey = !!key
    const urlValid = hasUrl && !url.includes('placeholder') && url.includes('supabase.co')
    const keyValid = hasKey && !key.includes('placeholder') && key.startsWith('eyJ')
    const isConfigured = urlValid && keyValid

    setConfig({
      hasUrl,
      hasKey,
      isConfigured,
      urlValid,
      keyValid
    })
  }

  useEffect(() => {
    checkConfiguration()
  }, [])

  if (config.isConfigured) {
    return null // Don't show if properly configured
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-xl border border-red-200">
        <CardHeader className="text-center pb-4">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Configuration Required</CardTitle>
          <CardDescription className="text-gray-600">
            Supabase configuration is missing or incomplete
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration Status */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Configuration Status</h3>
            
            <div className="flex items-center space-x-3">
              {config.urlValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-sm ${config.urlValid ? 'text-green-700' : 'text-red-700'}`}>
                Supabase URL: {config.urlValid ? 'Configured' : config.hasUrl ? 'Invalid/Placeholder' : 'Missing'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              {config.keyValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-sm ${config.keyValid ? 'text-green-700' : 'text-red-700'}`}>
                Supabase Anon Key: {config.keyValid ? 'Configured' : config.hasKey ? 'Invalid/Placeholder' : 'Missing'}
              </span>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Setup</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>
                Go to{' '}
                <a 
                  href="https://supabase.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  supabase.com <ExternalLink className="h-3 w-3 ml-1" />
                </a>{' '}
                and create a new project
              </li>
              <li>Go to Settings → API in your Supabase dashboard</li>
              <li>Copy your Project URL and anon public key</li>
              <li>Update the values in your <code className="bg-gray-200 px-1 rounded">.env.local</code> file</li>
              <li>Restart the development server</li>
            </ol>
          </div>

          {/* Environment File Example */}
          <div className="bg-gray-900 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Your .env.local file should look like:</h3>
            <pre className="text-xs text-gray-300 overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={checkConfiguration}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Again
            </Button>
            <Button 
              onClick={() => window.open('https://supabase.com', '_blank')}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Supabase
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Need help? Check the{' '}
              <code className="bg-gray-200 px-1 rounded">SUPABASE_SETUP.md</code>{' '}
              file in your project root
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}