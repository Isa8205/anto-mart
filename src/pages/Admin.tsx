import { useState } from 'react'
import { Plus, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import DataTable from '@/components/shared/data-table'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import type { User } from '@/lib/auth-types'

export default function Admin() {
  const { createCashier, deactivateCashier, reactivateCashier, getAllCashiers } = useAuth()
  const [cashiers, setCashiers] = useState<User[]>(getAllCashiers())
  const [isNewCashierModalOpen, setIsNewCashierModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [modalRef, setModalRef] = useState<HTMLDivElement | null>(null)

  const handleAddCashier = async () => {
    // Validation
    if (!formData.username.trim()) {
      toast.error('Username is required')
      return
    }
    if (!formData.email.trim()) {
      toast.error('Email is required')
      return
    }
    if (!formData.password.trim()) {
      toast.error('Password is required')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      const newCashier = await createCashier(formData.username, formData.email, formData.password)
      setCashiers([...cashiers, newCashier])
      setFormData({ username: '', email: '', password: '', confirmPassword: '' })
      setIsNewCashierModalOpen(false)
      toast.success(`Cashier "${formData.username}" created successfully!`)
    } catch (error) {
      toast.error('Failed to create cashier')
    }
  }

  const handleDeactivate = async (userId: string, username: string) => {
    try {
      await deactivateCashier(userId)
      setCashiers(
        cashiers.map((c) => (c.id === userId ? { ...c, isActive: false } : c))
      )
      toast.success(`Cashier "${username}" has been deactivated`)
    } catch (error) {
      toast.error('Failed to deactivate cashier')
    }
  }

  const handleReactivate = async (userId: string, username: string) => {
    try {
      await reactivateCashier(userId)
      setCashiers(
        cashiers.map((c) => (c.id === userId ? { ...c, isActive: true } : c))
      )
      toast.success(`Cashier "${username}" has been reactivated`)
    } catch (error) {
      toast.error('Failed to reactivate cashier')
    }
  }

  const columns = [
    {
      header: 'Username',
      key: 'username',
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      header: 'Email',
      key: 'email',
      render: (value: string) => <span className="text-sm">{value}</span>,
    },
    {
      header: 'Status',
      key: 'isActive',
      render: (value: boolean) => (
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            value
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Last Login',
      key: 'lastLogin',
      render: (value: string | null) => {
        if (!value) return <span className="text-muted-foreground">Never</span>
        const date = new Date(value)
        return <span className="text-sm">{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>
      },
    },
    {
      header: 'Actions',
      key: 'id',
      render: (userId: string, row: User) => (
        <div className="flex gap-2">
          {row.isActive ? (
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => handleDeactivate(userId, row.username)}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => handleReactivate(userId, row.username)}
            >
              Reactivate
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage cashiers and system settings</p>
        </div>
        <Button
          onClick={() => setIsNewCashierModalOpen(true)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Cashier
        </Button>
      </div>

      {/* Cashiers List */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Manage Cashiers</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Total Cashiers: {cashiers.length} | Active: {cashiers.filter((c) => c.isActive).length}
        </p>
        <DataTable columns={columns} data={cashiers} keyField="id" />
      </Card>

      {/* Add Cashier Modal */}
      {isNewCashierModalOpen && (
        <div
          ref={setModalRef}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === modalRef) {
              setIsNewCashierModalOpen(false)
            }
          }}
        >
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Add New Cashier</h3>
              <button
                onClick={() => setIsNewCashierModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground">Username</Label>
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Email</Label>
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Password</Label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsNewCashierModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCashier}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Create Cashier
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
