import { useState } from 'react'
import { Card } from '@/components/ui/card'
import DataTable from '@/components/shared/data-table'
import StatusBadge from '@/components/shared/status-badge'
import { mockLedger } from '@/lib/mockData'
import type { LedgerEntry } from '@/lib/types'

export default function Ledger() {
  const [ledger] = useState<LedgerEntry[]>(mockLedger)

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <StatusBadge status={value === 'sale' ? 'completed' : value === 'expense' ? 'pending' : 'active'}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </StatusBadge>
      ),
    },
    {
      key: 'description',
      label: 'Description',
    },
    {
      key: 'debit',
      label: 'Debit',
      render: (value: number) => value > 0 ? `$${value.toFixed(2)}` : '-',
    },
    {
      key: 'credit',
      label: 'Credit',
      render: (value: number) => value > 0 ? `$${value.toFixed(2)}` : '-',
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
  ]

  const totalDebits = ledger.reduce((sum, e) => sum + e.debit, 0)
  const totalCredits = ledger.reduce((sum, e) => sum + e.credit, 0)
  const balance = totalDebits - totalCredits

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Ledger</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Debits</p>
          <h3 className="text-2xl font-bold text-green-600 mt-2">${totalDebits.toFixed(2)}</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Credits</p>
          <h3 className="text-2xl font-bold text-red-600 mt-2">${totalCredits.toFixed(2)}</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Balance</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">${balance.toFixed(2)}</h3>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Transaction History</h3>
        <DataTable columns={columns} data={ledger} keyField="id" />
      </Card>
    </div>
  )
}
