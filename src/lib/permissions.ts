import type { UserRole } from './auth-types'

export const PAGES = {
  DASHBOARD: 'dashboard',
  SALES: 'sales',
  INVENTORY: 'inventory',
  SUPPLIERS: 'suppliers',
  EXPENSES: 'expenses',
  LEDGER: 'ledger',
  REPORTS: 'reports',
  SETTINGS: 'settings',
  ADMIN: 'admin',
} as const

export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  MANAGE_USERS: 'manage_users',
} as const

// Permission matrix: which roles can access which pages
const pagePermissions: Record<UserRole, Set<string>> = {
  cashier: new Set([PAGES.DASHBOARD, PAGES.SALES, PAGES.INVENTORY]),
  admin: new Set([
    PAGES.DASHBOARD,
    PAGES.SALES,
    PAGES.INVENTORY,
    PAGES.SUPPLIERS,
    PAGES.EXPENSES,
    PAGES.LEDGER,
    PAGES.REPORTS,
    PAGES.SETTINGS,
    PAGES.ADMIN,
  ]),
}

// Action permissions: what actions each role can perform on each page
const actionPermissions: Record<UserRole, Record<string, Set<string>>> = {
  cashier: {
    [PAGES.DASHBOARD]: new Set([ACTIONS.VIEW]),
    [PAGES.SALES]: new Set([ACTIONS.VIEW, ACTIONS.CREATE]),
    [PAGES.INVENTORY]: new Set([ACTIONS.VIEW]),
  },
  admin: {
    [PAGES.DASHBOARD]: new Set([ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE]),
    [PAGES.SALES]: new Set([ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE]),
    [PAGES.INVENTORY]: new Set([ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE]),
    [PAGES.SUPPLIERS]: new Set([ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE]),
    [PAGES.EXPENSES]: new Set([ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE]),
    [PAGES.LEDGER]: new Set([ACTIONS.VIEW]),
    [PAGES.REPORTS]: new Set([ACTIONS.VIEW]),
    [PAGES.SETTINGS]: new Set([ACTIONS.VIEW, ACTIONS.EDIT]),
    [PAGES.ADMIN]: new Set([
      ACTIONS.VIEW,
      ACTIONS.CREATE,
      ACTIONS.EDIT,
      ACTIONS.DELETE,
      ACTIONS.MANAGE_USERS,
    ]),
  },
}

export function canAccessPage(role: UserRole, page: string): boolean {
  return pagePermissions[role]?.has(page) ?? false
}

export function canPerformAction(role: UserRole, page: string, action: string): boolean {
  return actionPermissions[role]?.[page]?.has(action) ?? false
}

export function getAccessiblePages(role: UserRole): string[] {
  return Array.from(pagePermissions[role] ?? new Set())
}
