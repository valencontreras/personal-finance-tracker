'use client'

import { useState } from 'react'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  monthlyData, 
  categoryBreakdown, 
  transactions,
  formatCurrency 
} from '@/lib/data'

// Extended monthly data for reports
const extendedMonthlyData = [
  { month: 'Feb', income: 5800, expenses: 3600 },
  { month: 'Mar', income: 6100, expenses: 4200 },
  { month: 'Apr', income: 5900, expenses: 3800 },
  { month: 'May', income: 6300, expenses: 4100 },
  { month: 'Jun', income: 6000, expenses: 3900 },
  { month: 'Jul', income: 6400, expenses: 4300 },
  ...monthlyData,
]

// Calculate totals for breakdown table
const totalExpenses = categoryBreakdown.reduce((sum, cat) => sum + cat.value, 0)

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'6m' | '12m'>('6m')

  const displayData = selectedPeriod === '6m' 
    ? extendedMonthlyData.slice(-6) 
    : extendedMonthlyData

  const totalIncome = displayData.reduce((sum, d) => sum + d.income, 0)
  const totalExpense = displayData.reduce((sum, d) => sum + d.expenses, 0)
  const netSavings = totalIncome - totalExpense

  const exportToCSV = () => {
    // Prepare transaction data
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Account']
    const rows = transactions.map(t => [
      t.date,
      t.description,
      t.category,
      t.type,
      t.amount.toString(),
      t.account
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `fintrack-transactions-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const exportToPDF = () => {
    // In a real app, you'd use a library like jsPDF or html2pdf
    // For demo, we'll show an alert
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Analyze your financial trends and patterns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            <FileText className="h-4 w-4 mr-1.5" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-border bg-card">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalIncome)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Last {selectedPeriod === '6m' ? '6' : '12'} months
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
              {formatCurrency(totalExpense)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Last {selectedPeriod === '6m' ? '6' : '12'} months
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Net Savings</p>
            <p className={`text-2xl font-semibold ${
              netSavings >= 0 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(netSavings)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {((netSavings / totalIncome) * 100).toFixed(1)}% savings rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base font-medium">Monthly Overview</CardTitle>
              <p className="text-sm text-muted-foreground">Income vs Expenses comparison</p>
            </div>
            <div className="flex rounded-lg border border-border p-1 bg-muted/50">
              {(['6m', '12m'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    selectedPeriod === period
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {period === '6m' ? '6 Months' : '12 Months'}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    boxShadow: 'none'
                  }}
                  formatter={(value: number) => [formatCurrency(value), '']}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => (
                    <span className="text-sm text-muted-foreground">{value}</span>
                  )}
                />
                <Bar 
                  dataKey="income" 
                  name="Income" 
                  fill="#0D9488" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar 
                  dataKey="expenses" 
                  name="Expenses" 
                  fill="#6366F1" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown Table */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Category Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">Expenses by category this month</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    % of Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-48">
                    Distribution
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categoryBreakdown.sort((a, b) => b.value - a.value).map((category) => {
                  const percentage = (category.value / totalExpenses) * 100
                  return (
                    <tr key={category.name} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm font-medium text-foreground">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground text-right">
                        {formatCurrency(category.value)}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground text-right">
                        {percentage.toFixed(1)}%
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: category.color 
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border">
                  <td className="px-4 py-4 text-sm font-semibold text-foreground">
                    Total
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-foreground text-right">
                    {formatCurrency(totalExpenses)}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-foreground text-right">
                    100%
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
