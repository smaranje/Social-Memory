'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Edit, Save, X, LogOut } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface UserProfileProps {
  onClose: () => void
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { user, profile, updateProfile, signOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile({ full_name: fullName })
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign out')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Profile</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                value={user?.email || ''}
                disabled
                className="bg-gray-50 text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-white border shadow-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false)
                        setFullName(profile?.full_name || '')
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    value={profile?.full_name || 'No name set'}
                    disabled
                    className="bg-gray-50 text-gray-600 flex-1"
                  />
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500 mb-4">
              <p><strong>Member since:</strong> {new Date(profile?.created_at || '').toLocaleDateString()}</p>
              <p><strong>Last updated:</strong> {new Date(profile?.updated_at || '').toLocaleDateString()}</p>
            </div>
            
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}