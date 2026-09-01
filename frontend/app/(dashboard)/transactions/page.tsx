'use client'

import { useState, useMemo } from 'react'
import { 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  X,
  CalendarIcon
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  transactions as allTransactions, 
  categories,
  accounts,
  formatCurrency,
  formatDate,
  getCategoryColor,
  type Transaction
} from '@/lib/data'

const ITEMS_PER_PAGE = 8

type FilterType = 'all' | 'income' | 'expense'

export default function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)

  // Form state for new transaction
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    account: '',
    date: new Date().toISOString().split('T')[0],
  })

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((t) => {
      // Type filter
      if (filterType !== 'all' && t.type !== filterType) return false

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(t.category)) return false

      // Search filter
      if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false

      // Date range filter
      if (dateRange.start && new Date(t.date) < new Date(dateRange.start)) return false
      if (dateRange.end && new Date(t.date) > new Date(dateRange.end)) return false

      return true
    })
  }, [filterType, selectedCategories, searchQuery, dateRange])

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilterType('all')
    setSelectedCategories([])
    setSearchQuery('')
    setDateRange({ start: '', end: '' })
    setCurrentPage(1)
  }

  const handleAddTransaction = () => {
    // In a real app, this would save to a database
    console.log('Adding transaction:', newTransaction)
    setIsAddDialogOpen(false)
    setNewTransaction({
      description: '',
      amount: '',
      type: 'expense',
      category: '',
      account: '',
      date: new Date().toISOString().split('T')[0],
    })
  }

  const hasActiveFilters = filterType !== 'all' || selectedCategories.length > 0 || searchQuery || dateRange.start || dateRange.end

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">Manage and track all your transactions</p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Search and Date Range */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => {
                      setDateRange({ ...dateRange, start: e.target.value })
                      setCurrentPage(1)
                    }}
                    className="pl-9 w-[140px]"
                  />
                </div>
                <span className="flex items-center text-muted-foreground">to</span>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => {
                    setDateRange({ ...dateRange, end: e.target.value })
                    setCurrentPage(1)
                  }}
                  className="w-[140px]"
                />
              </div>
            </div>

            {/* Type Toggle and Category Multi-select */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Type Toggle */}
              <div className="flex rounded-lg border border-border p-1 bg-muted/50">
                {(['all', 'income', 'expense'] as FilterType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type)
                      setCurrentPage(1)
                    }}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      filterType === type
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Category Multi-select */}
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="justify-between min-w-[180px]"
                >
                  <span className="truncate">
                    {selectedCategories.length === 0
                      ? 'All Categories'
                      : `${selectedCategories.length} selected`}
                  </span>
                </Button>
                {categoryDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setCategoryDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-1 z-20 w-64 bg-popover border border-border rounded-lg shadow-lg max-h-64 overflow-auto">
                      <div className="p-2">
                        {categories.map((category) => (
                          <label
                            key={category}
                            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category)}
                              onChange={() => toggleCategory(category)}
                              className="rounded border-border"
                            />
                            <span className="text-sm text-foreground">{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Account
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-foreground">
                    {transaction.description}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {transaction.account}
                  </td>
                  <td className={`px-4 py-4 text-sm font-semibold text-right whitespace-nowrap ${
                    transaction.type === 'income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* FAB - Add Transaction */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg p-0"
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add transaction</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {/* Type Selection */}
            <div className="flex rounded-lg border border-border p-1 bg-muted/50">
              {(['expense', 'income'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setNewTransaction({ ...newTransaction, type })}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    newTransaction.type === type
                      ? type === 'expense'
                        ? 'bg-red-500 text-white'
                        : 'bg-emerald-500 text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <Input
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                placeholder="Enter description"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Amount</label>
              <Input
                type="number"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                placeholder="0.00"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Account</label>
                <select
                  value={newTransaction.account}
                  onChange={(e) => setNewTransaction({ ...newTransaction, account: e.target.value })}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="">Select account</option>
                  {accounts.map((acc) => (
                    <option key={acc} value={acc}>{acc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Date</label>
              <Input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                className="mt-1"
              />
            </div>

            <Button onClick={handleAddTransaction} className="w-full">
              Add Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
