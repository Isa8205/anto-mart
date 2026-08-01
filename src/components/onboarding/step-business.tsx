import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BusinessInfoRequest } from '@/bindings/BusinessInfoRequest'

interface StepBusinessProps {
  onNext: (businessInfo: BusinessInfoRequest) => void
  onBack: () => void
}

export default function StepBusiness({ onNext, onBack }: StepBusinessProps) {
  const [formData, setFormData] = useState<BusinessInfoRequest>({
    name: '',
    email: '',
    phone: '',
    county: '',
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

    if (!formData.name.trim()) {
      newErrors.name = 'Store name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.county.trim()) {
      newErrors.county = 'County is required'
    }

    console.log(newErrors);
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
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Store Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., My Retail Store"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
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
                placeholder="business@gmail.com"
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
                type='number'
                value={formData.phone}
                onChange={handleChange}
                placeholder="0712345678"
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
            </div>



            {/* Country */}
            <div>
              <Label htmlFor="county" className="text-sm font-medium text-foreground">
                County
              </Label>
              <Select value={formData.county} onValueChange={(value) => handleSelectChange('county', value)}>
                <SelectTrigger className='w-full max-w-48'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nairobi">Nairobi</SelectItem>
                  <SelectItem value="Nyeri">Nyeri</SelectItem>
                  <SelectItem value="Kericho">Kericho</SelectItem>
                  <SelectItem value="Kisumu">Kisumu</SelectItem>
                  <SelectItem value="Nakuru">Nakuru</SelectItem>
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
