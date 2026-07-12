import { useState, useRef, useEffect } from 'react'
import { BarChart3, ShoppingCart, Package, TrendingUp, Plus, X } from 'lucide-react'
import StatCard from '@/components/shared/stat-card'
import { Card } from '@/components/ui/card'
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
import { mockSales, mockProducts } from '@/lib/mockData'
import { toast } from 'sonner'

export default function Dashboard() {
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false)
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    items: [{ productId: '', quantity: 1, price: 0 }],
  })
  const floatingMenuRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const totalRevenue = mockSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalTransactions = mockSales.length
  const lowStockItems = mockProducts.filter((p) => p.stock <= p.reorderLevel).length
  const totalProducts = mockProducts.length

  // Handle outside click for floating menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (floatingMenuRef.current && !floatingMenuRef.current.contains(event.target as Node)) {
        setIsFloatingMenuOpen(false)
      }
    }

    if (isFloatingMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isFloatingMenuOpen])

  // Handle outside click for modal
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

  const handleNewSaleClick = () => {
    setIsNewSaleModalOpen(true)
    setIsFloatingMenuOpen(false)
  }

  const handleSubmitSale = () => {
    if (!formData.customerName.trim()) {
      toast.error('Please enter customer name')
      return
    }
    toast.success('Sale created successfully!')
    setIsNewSaleModalOpen(false)
    setFormData({ customerName: '', items: [{ productId: '', quantity: 1, price: 0 }] })
  }

  return (
    <div className="space-y-6">
      {/* Floating Action Button */}
      <div ref={floatingMenuRef} className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
          className="w-14 h-14 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full flex items-center justify-center shadow-lg transition-all"
        >
          {isFloatingMenuOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>

        {isFloatingMenuOpen && (
          <div className="absolute bottom-20 right-0 bg-card border border-border rounded-lg shadow-lg p-2 w-48">
            <button
              onClick={handleNewSaleClick}
              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted rounded flex items-center gap-2 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              New Sale
            </button>
          </div>
        )}
      </div>

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
                <Button
                  variant="outline"
                  onClick={() => setIsNewSaleModalOpen(false)}
                >
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          label="Transactions"
          value={totalTransactions}
          icon={ShoppingCart}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          label="Total Products"
          value={totalProducts}
          icon={Package}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          label="Low Stock Items"
          value={lowStockItems}
          icon={BarChart3}
          trend={{ value: 8, isPositive: false }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Sales</h3>
          <div className="space-y-4">
            {mockSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-muted rounded">
                <div>
                  <p className="text-sm font-medium text-foreground">{sale.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(sale.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground">${sale.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Stock Alerts</h3>
          <div className="space-y-4">
            {mockProducts
              .filter((p) => p.stock <= p.reorderLevel)
              .map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <div>
                    <p className="text-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                  </div>
                  <button className="text-xs px-3 py-1 bg-yellow-200 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100 rounded hover:bg-yellow-300 dark:hover:bg-yellow-600 transition">
                    Reorder
                  </button>
                </div>
              ))}
            {mockProducts.filter((p) => p.stock <= p.reorderLevel).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No low stock items</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
