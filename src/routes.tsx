
import { RootRoute, Route } from '@tanstack/react-router'
import App from './App'
import Dashboard from './pages/Dashboard'
import Sales from './pages/Sales'
import Inventory from './pages/Inventory'
import Suppliers from './pages/Suppliers'
import Expenses from './pages/Expenses'
import Ledger from './pages/Ledger'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

const rootRoute = new RootRoute({
  component: App,
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
})

const salesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/sales',
  component: Sales,
})

const inventoryRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/inventory',
  component: Inventory,
})

const suppliersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/suppliers',
  component: Suppliers,
})

const expensesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/expenses',
  component: Expenses,
})

const ledgerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/ledger',
  component: Ledger,
})

const reportsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: Reports,
})

const settingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  salesRoute,
  inventoryRoute,
  suppliersRoute,
  expensesRoute,
  ledgerRoute,
  reportsRoute,
  settingsRoute,
])
