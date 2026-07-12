import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import DataTable from '@/components/shared/data-table'
import { mockCustomers } from '@/lib/mockData'
import type { Customer } from '@/lib/types'

export default function Customers() {
  const [customers] = useState<Customer[]>(mockCustomers)

  const columns = [
    {
      key: 'name',
      label: 'Name',
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
      key: 'city',
      label: 'City',
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: 'lastPurchase',
      label: 'Last Purchase',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Customers</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">{customers.length}</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">
            ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
          </h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Avg. Customer Value</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">
            ${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toFixed(2)}
          </h3>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Customers</h3>
        <DataTable columns={columns} data={customers} keyField="id" />
      </Card>
    </div>
  )
}
