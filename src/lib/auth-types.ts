export type UserRole = 'cashier' | 'admin'

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  password: string
  createdDate: string
  isActive: boolean
  lastLogin: string | null
}

export interface AuthContextType {
  currentUser: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (action: string) => boolean
  canAccessPage: (page: string) => boolean
  createCashier: (username: string, email: string, password: string) => Promise<User>
  deactivateCashier: (userId: string) => Promise<void>
  reactivateCashier: (userId: string) => Promise<void>
  getAllCashiers: () => User[]
}
