import { useState, useRef, useEffect } from 'react'
import { Plus, X, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import DataTable from '@/components/shared/data-table'
import { mockSuppliers } from '@/lib/mockData'
import { toast } from 'sonner'
import type { Supplier } from '@/lib/types'

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [isNewSupplierModalOpen, setIsNewSupplierModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentTerms: '',
    totalOrders: 0,
    lastOrderDate: new Date().toISOString().split('T')[0],
  })
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && event.target === modalRef.current) {
        setIsNewSupplierModalOpen(false)
        setIsEditModalOpen(false)
      }
    }

    if (isNewSupplierModalOpen || isEditModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isNewSupplierModalOpen, isEditModalOpen])

  const handleAddSupplier = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    toast.success('Supplier added successfully!')
    setIsNewSupplierModalOpen(false)
    setFormData({ name: '', email: '', phone: '', paymentTerms: '', totalOrders: 0, lastOrderDate: new Date().toISOString().split('T')[0] })
  }

  const handleEditSupplier = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? { ...editingSupplier, ...formData } : s))
    }
    toast.success('Supplier updated successfully!')
    setIsEditModalOpen(false)
    setEditingSupplier(null)
    setFormData({ name: '', email: '', phone: '', paymentTerms: '', totalOrders: 0, lastOrderDate: new Date().toISOString().split('T')[0] })
  }

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      paymentTerms: supplier.paymentTerms,
      totalOrders: supplier.totalOrders,
      lastOrderDate: new Date(supplier.lastOrderDate).toISOString().split('T')[0],
    })
    setIsEditModalOpen(true)
  }

  const columns = [
    {
      key: 'name',
      label: 'Supplier Name',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'phone',
      label: 'Phone',
    },
    {
      key: 'paymentTerms',
      label: 'Payment Terms',
    },
    {
      key: 'totalOrders',
      label: 'Total Orders',
    },
    {
      key: 'lastOrderDate',
      label: 'Last Order',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Supplier) => (
        <button
          onClick={() => openEditModal(row)}
          className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Suppliers</h1>
        <Button onClick={() => setIsNewSupplierModalOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Suppliers</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">{suppliers.length}</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">
            {suppliers.reduce((sum, s) => sum + s.totalOrders, 0)}
          </h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Avg Orders/Supplier</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">
            {(suppliers.reduce((sum, s) => sum + s.totalOrders, 0) / suppliers.length).toFixed(1)}
          </h3>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Suppliers</h3>
        <DataTable columns={columns} data={suppliers} keyField="id" />
      </Card>

      {/* New Supplier Modal */}
      {isNewSupplierModalOpen && (
        <div ref={modalRef} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Add Supplier</h2>
              <button onClick={() => setIsNewSupplierModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground">Supplier Name *</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter supplier name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Phone *</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Payment Terms</Label>
                <Input
                  type="text"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  placeholder="e.g., Net 30"
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsNewSupplierModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSupplier} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Add Supplier
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {isEditModalOpen && (
        <div ref={modalRef} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Edit Supplier</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground">Supplier Name *</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter supplier name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Phone *</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Payment Terms</Label>
                <Input
                  type="text"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  placeholder="e.g., Net 30"
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditSupplier} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
