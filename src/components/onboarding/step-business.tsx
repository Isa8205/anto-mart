import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { BusinessInfo } from '@/lib/types'

interface StepBusinessProps {
  onNext: (businessInfo: BusinessInfo) => void
  onBack: () => void
}

export default function StepBusiness({ onNext, onBack }: StepBusinessProps) {
  const [formData, setFormData] = useState<BusinessInfo>({
    storeName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    currency: 'USD',
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData)
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
            <div className="flex-1 h-1 bg-muted rounded-full"></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">Step 2 of 3</p>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Store Details</h1>
          <p className="text-base text-muted-foreground">Tell us about your retail business</p>
        </div>

        {/* Form */}
        <div>
          <div className="space-y-6">
            {/* Store Name */}
            <div>
              <Label htmlFor="storeName" className="text-sm font-medium text-foreground">
                Store Name
              </Label>
              <Input
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="e.g., My Retail Store"
                className={errors.storeName ? 'border-destructive' : ''}
              />
              {errors.storeName && <p className="text-sm text-destructive mt-1">{errors.storeName}</p>}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Business Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="business@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address" className="text-sm font-medium text-foreground">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
            </div>

            {/* City, State, Zip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium text-foreground">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
              </div>

              <div>
                <Label htmlFor="state" className="text-sm font-medium text-foreground">
                  State
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="NY"
                  className={errors.state ? 'border-destructive' : ''}
                />
                {errors.state && <p className="text-sm text-destructive mt-1">{errors.state}</p>}
              </div>

              <div>
                <Label htmlFor="zipCode" className="text-sm font-medium text-foreground">
                  Zip Code
                </Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="10001"
                  className={errors.zipCode ? 'border-destructive' : ''}
                />
                {errors.zipCode && <p className="text-sm text-destructive mt-1">{errors.zipCode}</p>}
              </div>
            </div>

            {/* Country */}
            <div>
              <Label htmlFor="country" className="text-sm font-medium text-foreground">
                Country
              </Label>
              <Select value={formData.country} onValueChange={(value) => handleSelectChange('country', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div>
              <Label htmlFor="currency" className="text-sm font-medium text-foreground">
                Currency
              </Label>
              <Select value={formData.currency} onValueChange={(value) => handleSelectChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-4 mt-12">
          <Button onClick={onBack} variant="outline" className="px-8 py-2">
            Back
          </Button>
          <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
