import { useState, useRef, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
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
import DataTable from '@/components/shared/data-table'
import { mockExpenses } from '@/lib/mockData'
import { toast } from 'sonner'
import type { Expense } from '@/lib/types'

export default function Expenses() {
  const [expenses] = useState<Expense[]>(mockExpenses)
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: 0,
    paymentMethod: 'cash',
    date: new Date().toISOString().split('T')[0],
  })
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && event.target === modalRef.current) {
        setIsNewExpenseModalOpen(false)
      }
    }

    if (isNewExpenseModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isNewExpenseModalOpen])

  const handleAddExpense = () => {
    if (!formData.category.trim() || !formData.description.trim() || formData.amount <= 0) {
      toast.error('Please fill in all required fields')
      return
    }
    toast.success('Expense added successfully!')
    setIsNewExpenseModalOpen(false)
    setFormData({ category: '', description: '', amount: 0, paymentMethod: 'cash', date: new Date().toISOString().split('T')[0] })
  }

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'description',
      label: 'Description',
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      render: (value: string) => value.charAt(0).toUpperCase() + value.slice(1),
    },
  ]

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const categories = [...new Set(expenses.map((e) => e.category))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Expenses</h1>
        <Button onClick={() => setIsNewExpenseModalOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">${totalExpenses.toFixed(2)}</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">{expenses.length}</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Categories</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">{categories.length}</h3>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Expenses</h3>
        <DataTable columns={columns} data={expenses} keyField="id" />
      </Card>

      {/* New Expense Modal */}
      {isNewExpenseModalOpen && (
        <div ref={modalRef} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Add Expense</h2>
              <button onClick={() => setIsNewExpenseModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground">Category *</Label>
                <Input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Utilities, Supplies"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Description *</Label>
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter expense description"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Amount *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsNewExpenseModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExpense} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Add Expense
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
