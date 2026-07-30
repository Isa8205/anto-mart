import React, { createContext, useState, useCallback, useEffect } from 'react'
import type { User, AuthContextType } from './auth-types'
import { canAccessPage, canPerformAction } from './permissions'
import { mockUsers } from './mockData'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [users, setUsers] = useState<User[]>(() => {
    // Check for users in localStorage first (from onboarding), fall back to mockUsers
    const storedUsers = localStorage.getItem('users')
    if (storedUsers) {
      try {
        return JSON.parse(storedUsers)
      } catch (error) {
        console.error('Failed to parse stored users:', error)
      }
    }
    return mockUsers
  })

  // Check if user was previously logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setCurrentUser(user)
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('currentUser')
      }
    }
  }, [])

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = users.find((u) => u.username === username && u.password === password && u.isActive)

    if (user) {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() }
      setCurrentUser(updatedUser)
      setIsAuthenticated(true)
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))

      // Update user in users list
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? updatedUser : u))
      )

      return true
    }

    return false
  }, [users])

  const logout = useCallback(() => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('currentUser')
  }, [])

  const hasPermission = useCallback(
    (action: string): boolean => {
      if (!currentUser) return false

      // For now, we'll use a simplified permission check
      // In a real app, this would be more granular
      return currentUser.role === 'admin' || action === 'view'
    },
    [currentUser]
  )

  const canAccessPageFn = useCallback(
    (page: string): boolean => {
      if (!currentUser) return false
      return canAccessPage(currentUser.role, page)
    },
    [currentUser]
  )

  const createCashier = useCallback(
    async (username: string, email: string, password: string): Promise<User> => {
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Only admins can create cashiers')
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        username,
        email,
        password,
        role: 'cashier',
        createdDate: new Date().toISOString(),
        isActive: true,
        lastLogin: null,
      }

      setUsers((prevUsers) => [...prevUsers, newUser])
      return newUser
    },
    [currentUser]
  )

  const deactivateCashier = useCallback(
    async (userId: string) => {
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Only admins can deactivate cashiers')
      }

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, isActive: false } : u))
      )
    },
    [currentUser]
  )

  const reactivateCashier = useCallback(
    async (userId: string) => {
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Only admins can reactivate cashiers')
      }

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, isActive: true } : u))
      )
    },
    [currentUser]
  )

  const getAllCashiers = useCallback((): User[] => {
    return users.filter((u) => u.role === 'cashier')
  }, [users])

  const value: AuthContextType = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    canAccessPage: canAccessPageFn,
    createCashier,
    deactivateCashier,
    reactivateCashier,
    getAllCashiers,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
