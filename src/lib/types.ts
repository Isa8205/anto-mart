export interface ProductCategory {
  id: string
  name: string
  image?: string
}

export interface Product {
  id: string
  name: string
  description?: string
  cost_price: number
  selling_price: number
  quantity: number
  category_id: string
  sku: string
  category: string
  price: number
  cost: number
  stock: number
  reorderLevel: number
  supplier: string
  lastRestocked: string
}

export interface SaleItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  subtotal: number
}

export interface Sale {
  id: string
  date: string
  customerId?: string
  customerName?: string
  items: SaleItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: 'cash' | 'card' | 'cheque'
  notes?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  totalSpent: number
  lastPurchase: string
  registeredDate: string
}

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  paymentTerms: string
  lastOrderDate: string
  totalOrders: number
}

export interface Expense {
  id: string
  date: string
  category: string
  description: string
  amount: number
  paymentMethod: string
  reference?: string
}

export interface LedgerEntry {
  id: string
  date: string
  type: 'sale' | 'expense' | 'payment' | 'adjustment'
  description: string
  debit: number
  credit: number
  balance: number
  reference?: string
}

export interface StoreSettings {
  storeName: string
  address: string
  city: string
  phone: string
  email: string
  taxRate: number
  currency: string
  printerType: string
}

export interface BusinessInfo {
  storeName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  currency: string
}

export interface OnboardingState {
  isOnboarded: boolean
  businessInfo?: BusinessInfo
  adminCreated?: boolean
}
