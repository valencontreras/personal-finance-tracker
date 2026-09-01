'use client'

import { 
  Area, 
  AreaChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  transactions, 
  monthlyData, 
  categoryBreakdown,
  formatCurrency,
  formatDate,
  getCategoryColor
} from '@/lib/data'

const summaryCards = [
  {
    title: 'Total Balance',
    value: 24680.50,
    change: '+2.5%',
    trend: 'up',
    icon: Wallet,
  },
  {
    title: 'Income This Month',
    value: 7175.50,
    change: '+12.3%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    title: 'Expenses This Month',
    value: 2832.27,
    change: '-8.2%',
    trend: 'down',
    icon: TrendingDown,
  },
  {
    title: 'Savings Goal',
    value: 58,
    isPercentage: true,
    subtitle: '$8,750 of $15,000',
    icon: Target,
  },
]

const COLORS = ['#0D9488', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#10B981', '#F97316']

export default function DashboardPage() {
  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your financial status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="border border-border bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                {card.change && (
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${
                    card.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {card.trend === 'up' ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {card.change}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-semibold text-foreground">
                  {card.isPercentage ? `${card.value}%` : formatCurrency(card.value)}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Area Chart - Income vs Expenses */}
        <Card className="lg:col-span-2 border border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Income vs Expenses</CardTitle>
            <p className="text-sm text-muted-foreground">Last 6 months comparison</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#0D9488"
                    strokeWidth={2}
                    fill="url(#incomeGradient)"
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fill="url(#expenseGradient)"
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#0D9488]" />
                <span className="text-sm text-muted-foreground">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#6366F1]" />
                <span className="text-sm text-muted-foreground">Expenses</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart - Top Spending Categories */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Top Spending Categories</CardTitle>
            <p className="text-sm text-muted-foreground">This month breakdown</p>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      boxShadow: 'none'
                    }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryBreakdown.slice(0, 4).map((category, index) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div 
                    className="h-2.5 w-2.5 rounded-full shrink-0" 
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-xs text-muted-foreground truncate">{category.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium">Recent Transactions</CardTitle>
              <p className="text-sm text-muted-foreground">Your latest financial activity</p>
            </div>
            <a 
              href="/transactions" 
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {recentTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    transaction.type === 'income' 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(transaction.date)}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`text-sm font-semibold shrink-0 ml-3 ${
                  transaction.type === 'income' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
