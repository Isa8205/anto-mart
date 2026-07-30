import { useState, useRef, useEffect } from 'react'
import { Plus, X, Edit2, Trash2, Lock, Search, ChevronUp, ChevronDown } from 'lucide-react'
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
import StatusBadge from '@/components/shared/status-badge'
import { useAuth } from '@/lib/auth-context'
import { canPerformAction, PAGES, ACTIONS } from '@/lib/permissions'
import { mockProducts, mockCategories, mockSuppliers } from '@/lib/mockData'
import { toast } from 'sonner'
import type { Product, ProductCategory } from '@/lib/types'

type Tab = 'products' | 'categories'
type SortField = 'name' | 'selling_price' | 'quantity' | null
type SortOrder = 'asc' | 'desc'

export default function Inventory() {
  const { currentUser } = useAuth()
  const canEdit = currentUser && canPerformAction(currentUser.role, PAGES.INVENTORY, ACTIONS.EDIT)
  const canCreate = currentUser && canPerformAction(currentUser.role, PAGES.INVENTORY, ACTIONS.CREATE)
  const isAdmin = currentUser?.role === 'admin'

  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>('products')

  // Products state
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [categories, setCategories] = useState<ProductCategory[]>(mockCategories)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    cost_price: 0,
    selling_price: 0,
    quantity: 0,
    category_id: '',
  })

  // Categories state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null)
  const [categoryFormData, setCategoryFormData] = useState({ name: '', image: '' })

  const productModalRef = useRef<HTMLDivElement>(null)
  const categoryModalRef = useRef<HTMLDivElement>(null)

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productModalRef.current && event.target === productModalRef.current) {
        setIsProductModalOpen(false)
      }
      if (categoryModalRef.current && event.target === categoryModalRef.current) {
        setIsCategoryModalOpen(false)
      }
    }

    if (isProductModalOpen || isCategoryModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProductModalOpen, isCategoryModalOpen])

  // Product handlers
  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setProductFormData({
        name: product.name,
        description: product.description || '',
        cost_price: product.cost,
        selling_price: product.price,
        quantity: product.stock,
        category_id: product.category || '',
      })
    } else {
      setEditingProduct(null)
      setProductFormData({
        name: '',
        description: '',
        cost_price: 0,
        selling_price: 0,
        quantity: 0,
        category_id: '',
      })
    }
    setIsProductModalOpen(true)
  }

  const handleSaveProduct = () => {
    if (!productFormData.name.trim() || productFormData.selling_price <= 0 || productFormData.cost_price <= 0) {
      toast.error('Please fill in all required fields with valid values')
      return
    }

    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: productFormData.name,
                description: productFormData.description,
                price: productFormData.selling_price,
                cost: productFormData.cost_price,
                stock: productFormData.quantity,
                category: productFormData.category_id,
              }
            : p
        )
      )
      toast.success('Product updated successfully!')
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: productFormData.name,
        description: productFormData.description,
        sku: `SKU-${Date.now()}`,
        category: productFormData.category_id,
        price: productFormData.selling_price,
        cost: productFormData.cost_price,
        stock: productFormData.quantity,
        reorderLevel: 5,
        supplier: '',
        lastRestocked: new Date().toISOString().split('T')[0],
        cost_price: productFormData.cost_price,
        selling_price: productFormData.selling_price,
        quantity: productFormData.quantity,
        category_id: productFormData.category_id,
      }
      setProducts([...products, newProduct])
      toast.success('Product created successfully!')
    }

    setIsProductModalOpen(false)
    setProductFormData({
      name: '',
      description: '',
      cost_price: 0,
      selling_price: 0,
      quantity: 0,
      category_id: '',
    })
    setEditingProduct(null)
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
    toast.success('Product deleted successfully!')
  }

  // Category handlers
  const handleOpenCategoryModal = (category?: ProductCategory) => {
    if (category) {
      setEditingCategory(category)
      setCategoryFormData({ name: category.name, image: category.image || '' })
    } else {
      setEditingCategory(null)
      setCategoryFormData({ name: '', image: '' })
    }
    setIsCategoryModalOpen(true)
  }

  const handleSaveCategory = () => {
    if (!categoryFormData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? { ...editingCategory, name: categoryFormData.name, image: categoryFormData.image || undefined }
            : c
        )
      )
      toast.success('Category updated successfully!')
    } else {
      const newCategory: ProductCategory = {
        id: `cat-${Date.now()}`,
        name: categoryFormData.name,
        image: categoryFormData.image || undefined,
      }
      setCategories([...categories, newCategory])
      toast.success('Category created successfully!')
    }

    setIsCategoryModalOpen(false)
    setCategoryFormData({ name: '', image: '' })
    setEditingCategory(null)
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id))
    toast.success('Category deleted successfully!')
  }

  // Product filtering and sorting
  let filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearchTerm.toLowerCase())
  )

  if (sortField) {
    filteredProducts.sort((a, b) => {
      let aVal: any = a[sortField as keyof Product]
      let bVal: any = b[sortField as keyof Product]

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    )
  }

  const productColumns = [
    {
      key: 'name',
      label: (
        <button
          onClick={() => handleSort('name')}
          className="flex items-center hover:text-primary transition-colors"
        >
          Product Name
          {getSortIcon('name')}
        </button>
      ),
      render: (value: string) => value,
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: string) => value || '-',
    },
    {
      key: 'cost',
      label: 'Cost Price',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: 'price',
      label: (
        <button
          onClick={() => handleSort('selling_price')}
          className="flex items-center hover:text-primary transition-colors"
        >
          Selling Price
          {getSortIcon('selling_price')}
        </button>
      ),
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: 'stock',
      label: (
        <button
          onClick={() => handleSort('quantity')}
          className="flex items-center hover:text-primary transition-colors"
        >
          Quantity
          {getSortIcon('quantity')}
        </button>
      ),
      render: (value: number) => value,
    },
    {
      key: 'category',
      label: 'Category',
      render: (value: string) => value || '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Product) =>
        canEdit ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOpenProductModal(row)}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDeleteProduct(row.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Lock className="w-4 h-4" />
            Read-only
          </span>
        ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
          {!canCreate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Lock className="w-4 h-4" />
              <span>Read-only access (cashiers cannot modify inventory)</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex gap-4">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'products'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Products
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'categories'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Categories
          </button>
        )}
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Products List</h2>
            {canCreate && (
              <Button onClick={() => handleOpenProductModal()} className="bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by product name..."
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Products Table */}
          {filteredProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                {productSearchTerm ? 'No products found matching your search.' : 'No products found. Create one to get started!'}
              </p>
            </Card>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    {productColumns.map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-3 text-left text-sm font-medium text-foreground text-balance"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                      {productColumns.map((col) => (
                        <td key={`${product.id}-${col.key}`} className="px-4 py-3 text-sm text-foreground">
                          {col.render((product as any)[col.key], product)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Categories Tab (Admin Only) */}
      {activeTab === 'categories' && isAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Product Categories</h2>
            {canCreate && (
              <Button onClick={() => handleOpenCategoryModal()} className="bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            )}
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.length === 0 ? (
              <Card className="col-span-full p-8 text-center">
                <p className="text-muted-foreground">No categories found. Create one to get started!</p>
              </Card>
            ) : (
              categories.map((category) => (
                <Card key={category.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {category.image && (
                    <div className="h-40 bg-muted overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-3">{category.name}</h3>
                    <div className="flex gap-2">
                      {canEdit && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenCategoryModal(category)}
                            className="flex-1"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="flex-1 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div
          ref={productModalRef}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => e.target === productModalRef.current && setIsProductModalOpen(false)}
        >
          <Card className="w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Product Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Wireless Mouse"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description
                </Label>
                <textarea
                  id="description"
                  placeholder="Optional product description"
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cost_price" className="text-sm font-medium text-foreground">
                    Cost Price *
                  </Label>
                  <Input
                    id="cost_price"
                    type="number"
                    placeholder="0.00"
                    value={productFormData.cost_price}
                    onChange={(e) => setProductFormData({ ...productFormData, cost_price: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="selling_price" className="text-sm font-medium text-foreground">
                    Selling Price *
                  </Label>
                  <Input
                    id="selling_price"
                    type="number"
                    placeholder="0.00"
                    value={productFormData.selling_price}
                    onChange={(e) => setProductFormData({ ...productFormData, selling_price: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity" className="text-sm font-medium text-foreground">
                    Quantity *
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    value={productFormData.quantity}
                    onChange={(e) => setProductFormData({ ...productFormData, quantity: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <Label htmlFor="category_id" className="text-sm font-medium text-foreground">
                    Category *
                  </Label>
                  <Select
                    value={productFormData.category_id}
                    onValueChange={(value) => setProductFormData({ ...productFormData, category_id: value })}
                  >
                    <SelectTrigger id="category_id" className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveProduct} className="flex-1">
                  {editingProduct ? 'Update' : 'Create'} Product
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && isAdmin && (
        <div
          ref={categoryModalRef}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => e.target === categoryModalRef.current && setIsCategoryModalOpen(false)}
        >
          <Card className="w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="category_name" className="text-sm font-medium text-foreground">
                  Category Name *
                </Label>
                <Input
                  id="category_name"
                  placeholder="e.g., Electronics"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category_image" className="text-sm font-medium text-foreground">
                  Category Image (Optional)
                </Label>
                <Input
                  id="category_image"
                  type="text"
                  placeholder="Image URL or path"
                  value={categoryFormData.image}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, image: e.target.value })}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter an image URL or path for the category
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveCategory} className="flex-1">
                  {editingCategory ? 'Update' : 'Create'} Category
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
