import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import type { BusinessInfo } from '@/lib/types'

interface StepAdminProps {
  businessInfo: BusinessInfo
  onComplete: (username: string, email: string, password: string) => Promise<void>
  onBack: () => void
}

export default function StepAdmin({ businessInfo, onComplete, onBack }: StepAdminProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleComplete = async () => {
    if (validateForm()) {
      setIsLoading(true)
      try {
        await onComplete(formData.username, formData.email, formData.password)
      } catch (error) {
        console.error('Error completing onboarding:', error)
        setErrors({ submit: 'Failed to complete setup. Please try again.' })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Progress Indicator - Desktop Style */}
        <div className="mb-12">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-primary rounded-full"></div>
            <div className="flex-1 h-1 bg-primary rounded-full"></div>
            <div className="flex-1 h-1 bg-primary rounded-full"></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">Step 3 of 3</p>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Create Admin Account</h1>
          <p className="text-base text-muted-foreground">Set up your administrator credentials</p>
        </div>

        {/* Summary */}
        <div className="bg-muted/50 rounded-lg p-4 mb-8">
          <p className="text-sm text-foreground">
            <span className="text-muted-foreground">Store:</span> {businessInfo.storeName}
          </p>
          <p className="text-sm text-foreground">
            <span className="text-muted-foreground">Location:</span> {businessInfo.city}, {businessInfo.state}
          </p>
        </div>

        {/* Form */}
        <div>

          {errors.submit && (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-6">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Username */}
            <div>
              <Label htmlFor="username" className="text-sm font-medium text-foreground">
                Administrator Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="admin"
                className={errors.username ? 'border-destructive' : ''}
              />
              {errors.username && <p className="text-sm text-destructive mt-1">{errors.username}</p>}
              <p className="text-xs text-muted-foreground mt-1">Used to log in to the system</p>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Administrator Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
              <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-4 mt-12">
          <Button onClick={onBack} variant="outline" className="px-8 py-2" disabled={isLoading}>
            Back
          </Button>
          <Button
            onClick={handleComplete}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 inline-flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Complete Setup
          </Button>
        </div>
      </div>
    </div>
  )
}
