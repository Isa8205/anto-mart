import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { mockSales, mockExpenses } from '@/lib/mockData'

export default function Reports() {
  const totalRevenue = mockSales.reduce((sum, s) => sum + s.total, 0)
  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0)
  const profit = totalRevenue - totalExpenses

  const monthlyRevenue = mockSales.reduce((sum, s) => sum + s.total, 0)
  const monthlyExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0)
  const monthlyProfit = monthlyRevenue - monthlyExpenses

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Date Range
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <h3 className="text-3xl font-bold text-green-600 mt-2">${totalRevenue.toFixed(2)}</h3>
          <p className="text-xs text-muted-foreground mt-2">{mockSales.length} transactions</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <h3 className="text-3xl font-bold text-red-600 mt-2">${totalExpenses.toFixed(2)}</h3>
          <p className="text-xs text-muted-foreground mt-2">{mockExpenses.length} transactions</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Net Profit</p>
          <h3 className={`text-3xl font-bold mt-2 ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${profit.toFixed(2)}
          </h3>
          <p className="text-xs text-muted-foreground mt-2">
            {((profit / totalRevenue) * 100).toFixed(1)}% margin
          </p>
        </Card>
      </div>

      {/* Monthly Report */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-muted rounded">
            <p className="text-sm text-muted-foreground">Monthly Revenue</p>
            <h4 className="text-2xl font-bold text-foreground mt-2">${monthlyRevenue.toFixed(2)}</h4>
          </div>
          <div className="p-4 bg-muted rounded">
            <p className="text-sm text-muted-foreground">Monthly Expenses</p>
            <h4 className="text-2xl font-bold text-foreground mt-2">${monthlyExpenses.toFixed(2)}</h4>
          </div>
          <div className="p-4 bg-muted rounded">
            <p className="text-sm text-muted-foreground">Monthly Profit</p>
            <h4 className={`text-2xl font-bold mt-2 ${monthlyProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${monthlyProfit.toFixed(2)}
            </h4>
          </div>
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Expense Categories</h3>
        <div className="space-y-3">
          {Array.from(new Set(mockExpenses.map((e) => e.category))).map((category) => {
            const amount = mockExpenses
              .filter((e) => e.category === category)
              .reduce((sum, e) => sum + e.amount, 0)
            const percentage = ((amount / totalExpenses) * 100).toFixed(1)
            return (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{category}</span>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-muted rounded h-2">
                    <div
                      className="bg-primary h-2 rounded"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-16 text-right">
                    ${amount.toFixed(2)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
