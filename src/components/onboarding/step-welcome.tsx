import { Button } from '@/components/ui/button'
import { ShoppingCart, Package, DollarSign, Users } from 'lucide-react'

interface StepWelcomeProps {
  onNext: () => void
}

export default function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Progress Indicator - Desktop Style */}
        <div className="mb-12">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-primary rounded-full"></div>
            <div className="flex-1 h-1 bg-muted rounded-full"></div>
            <div className="flex-1 h-1 bg-muted rounded-full"></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">Step 1 of 3</p>
        </div>

        {/* Content - Clean Desktop Feel */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-3">Welcome</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Set up AntoMart to manage your retail business. Track sales, inventory, and financials all in one place.
          </p>
        </div>

        {/* Features List - Compact Desktop Style */}
        <div className="space-y-3 mb-12">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-foreground">Process sales and manage transactions</p>
          </div>
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-foreground">Track inventory and suppliers</p>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-foreground">Monitor expenses and financial records</p>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-foreground">Manage staff and permissions</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button onClick={onNext} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
