import { useState } from 'react'
import { Save, Bell, Lock, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mockStoreSettings } from '@/lib/mockData'
import { toast } from 'sonner'

export default function Settings() {
  const [settings, setSettings] = useState(mockStoreSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [toggles, setToggles] = useState({
    enableNotifications: true,
    lowStockAlerts: true,
    autoBackup: false,
    debugMode: false,
  })

  const handleChange = (field: string, value: string | number) => {
    setSettings({
      ...settings,
      [field]: value,
    })
  }

  const handleToggle = (field: string) => {
    setToggles({
      ...toggles,
      [field]: !toggles[field],
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate saving to backend
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast.success('Settings saved successfully!')
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <div className={`grid gap-6 flex-1 overflow-y-auto pr-4 ${isLoggedIn ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Left: User Profile - Only show if logged in */}
        {isLoggedIn && (
          <Card className="p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold text-foreground mb-4">User Profile</h3>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">
                JD
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">John Doe</p>
                <p className="text-sm text-primary font-medium">Admin</p>
                <p className="text-xs text-muted-foreground mt-2">john.doe@antomart.com</p>
              </div>
              <div className="w-full pt-4 border-t border-border">
                <Button variant="outline" className="w-full text-sm">
                  Edit Profile
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Right: All Settings */}
        <div className={isLoggedIn ? 'lg:col-span-2 space-y-6' : 'space-y-6'}>
          {/* Store Information */}
          <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Store Information</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-foreground">Store Name</Label>
            <Input
              type="text"
              value={settings.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Email</Label>
            <Input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Phone</Label>
            <Input
              type="tel"
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Address</Label>
            <Input
              type="text"
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">City</Label>
            <Input
              type="text"
              value={settings.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Business Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Business Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-foreground">Tax Rate (%)</Label>
              <Input
                type="number"
                value={settings.taxRate}
                onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Currency</Label>
              <Input
                type="text"
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Printer Type</Label>
            <Input
              type="text"
              value={settings.printerType}
              onChange={(e) => handleChange('printerType', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

          {/* Application Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Application Settings</h3>
            <div className="space-y-4">
              {/* Toggle: Notifications */}
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Enable Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive system notifications</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('enableNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    toggles.enableNotifications ? 'bg-primary' : 'bg-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      toggles.enableNotifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle: Low Stock Alerts */}
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Low Stock Alerts</p>
                    <p className="text-xs text-muted-foreground">Alert when stock is low</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('lowStockAlerts')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    toggles.lowStockAlerts ? 'bg-primary' : 'bg-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      toggles.lowStockAlerts ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle: Auto Backup */}
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Auto Backup</p>
                    <p className="text-xs text-muted-foreground">Automatically backup data</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('autoBackup')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    toggles.autoBackup ? 'bg-primary' : 'bg-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      toggles.autoBackup ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle: Debug Mode */}
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Debug Mode</p>
                    <p className="text-xs text-muted-foreground">Show debug information</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('debugMode')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    toggles.debugMode ? 'bg-primary' : 'bg-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      toggles.debugMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Save Button - Fixed at bottom */}
      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <Button variant="outline">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
