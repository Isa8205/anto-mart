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
import { mockSales, mockProducts } from '@/lib/mockData'
import { toast } from 'sonner'
import type { Sale } from '@/lib/types'

export default function Sales() {
  const [sales] = useState<Sale[]>(mockSales)
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    items: [{ productId: '', quantity: 1, price: 0 }],
  })
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && event.target === modalRef.current) {
        setIsNewSaleModalOpen(false)
      }
    }

    if (isNewSaleModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isNewSaleModalOpen])

  const handleSubmitSale = () => {
    if (!formData.customerName.trim()) {
      toast.error('Please enter customer name')
      return
    }
    toast.success('Sale created successfully!')
    setIsNewSaleModalOpen(false)
    setFormData({ customerName: '', items: [{ productId: '', quantity: 1, price: 0 }] })
  }

  const columns = [
    {
      key: 'id',
      label: 'Sale ID',
    },
    {
      key: 'date',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'customerName',
      label: 'Customer',
    },
    {
      key: 'total',
      label: 'Amount',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      render: (value: string) => value.charAt(0).toUpperCase() + value.slice(1),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Sales</h1>
        <Button onClick={() => setIsNewSaleModalOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="w-4 h-4 mr-2" />
          New Sale
        </Button>
      </div>

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Sales</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">
            ${mockSales.reduce((sum, s) => sum + s.total, 0).toFixed(2)}
          </h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">{mockSales.length}</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Average Sale</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">
            ${(mockSales.reduce((sum, s) => sum + s.total, 0) / mockSales.length).toFixed(2)}
          </h3>
        </Card>
      </div>

      {/* Recent Sales Table */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Sales</h3>
        </div>
        <DataTable columns={columns} data={sales} keyField="id" />
      </Card>

      {/* New Sale Modal */}
      {isNewSaleModalOpen && (
        <div ref={modalRef} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">New Sale</h2>
              <button
                onClick={() => setIsNewSaleModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground">Customer Name</Label>
                <Input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Enter customer name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Select Product</Label>
                <Select
                  value={formData.items[0].productId}
                  onValueChange={(value) => {
                    const product = mockProducts.find(p => p.id === value)
                    setFormData({
                      ...formData,
                      items: [{ productId: value, quantity: 1, price: product?.price || 0 }],
                    })
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} - ${p.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Quantity</Label>
                <Input
                  type="number"
                  value={formData.items[0].quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      items: [{ ...formData.items[0], quantity: parseInt(e.target.value) || 1 }],
                    })
                  }
                  min="1"
                  className="mt-1"
                />
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Total: ${(formData.items[0].price * formData.items[0].quantity).toFixed(2)}
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsNewSaleModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitSale}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Create Sale
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
