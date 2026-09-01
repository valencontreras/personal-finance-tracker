// Mock data for the finance tracker

export type Transaction = {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: 'income' | 'expense'
  account: string
}

export type Goal = {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  color: string
}

export type CategoryData = {
  name: string
  value: number
  color: string
}

export const transactions: Transaction[] = [
  { id: '1', date: '2024-01-15', description: 'Salary Deposit', category: 'Salary', amount: 5200, type: 'income', account: 'Checking' },
  { id: '2', date: '2024-01-14', description: 'Grocery Store', category: 'Food & Dining', amount: 156.32, type: 'expense', account: 'Credit Card' },
  { id: '3', date: '2024-01-13', description: 'Electric Bill', category: 'Utilities', amount: 94.50, type: 'expense', account: 'Checking' },
  { id: '4', date: '2024-01-12', description: 'Freelance Payment', category: 'Freelance', amount: 850, type: 'income', account: 'Savings' },
  { id: '5', date: '2024-01-11', description: 'Netflix Subscription', category: 'Entertainment', amount: 15.99, type: 'expense', account: 'Credit Card' },
  { id: '6', date: '2024-01-10', description: 'Gas Station', category: 'Transportation', amount: 45.00, type: 'expense', account: 'Credit Card' },
  { id: '7', date: '2024-01-09', description: 'Restaurant Dinner', category: 'Food & Dining', amount: 78.50, type: 'expense', account: 'Credit Card' },
  { id: '8', date: '2024-01-08', description: 'Gym Membership', category: 'Health & Fitness', amount: 49.99, type: 'expense', account: 'Checking' },
  { id: '9', date: '2024-01-07', description: 'Amazon Purchase', category: 'Shopping', amount: 124.99, type: 'expense', account: 'Credit Card' },
  { id: '10', date: '2024-01-06', description: 'Dividend Income', category: 'Investments', amount: 125.50, type: 'income', account: 'Investment' },
  { id: '11', date: '2024-01-05', description: 'Coffee Shop', category: 'Food & Dining', amount: 12.50, type: 'expense', account: 'Credit Card' },
  { id: '12', date: '2024-01-04', description: 'Phone Bill', category: 'Utilities', amount: 85.00, type: 'expense', account: 'Checking' },
  { id: '13', date: '2024-01-03', description: 'Uber Ride', category: 'Transportation', amount: 24.50, type: 'expense', account: 'Credit Card' },
  { id: '14', date: '2024-01-02', description: 'Rent Payment', category: 'Housing', amount: 1800.00, type: 'expense', account: 'Checking' },
  { id: '15', date: '2024-01-01', description: 'New Year Bonus', category: 'Salary', amount: 1000, type: 'income', account: 'Checking' },
  { id: '16', date: '2023-12-30', description: 'Grocery Store', category: 'Food & Dining', amount: 89.45, type: 'expense', account: 'Credit Card' },
  { id: '17', date: '2023-12-28', description: 'Insurance Premium', category: 'Insurance', amount: 245.00, type: 'expense', account: 'Checking' },
  { id: '18', date: '2023-12-25', description: 'Holiday Gift', category: 'Shopping', amount: 150.00, type: 'expense', account: 'Credit Card' },
  { id: '19', date: '2023-12-22', description: 'Side Project Income', category: 'Freelance', amount: 450, type: 'income', account: 'Checking' },
  { id: '20', date: '2023-12-20', description: 'Spotify Subscription', category: 'Entertainment', amount: 9.99, type: 'expense', account: 'Credit Card' },
]

export const goals: Goal[] = [
  { id: '1', name: 'Emergency Fund', targetAmount: 15000, currentAmount: 8750, deadline: '2024-12-31', color: 'bg-chart-1' },
  { id: '2', name: 'Vacation Fund', targetAmount: 5000, currentAmount: 2300, deadline: '2024-06-30', color: 'bg-chart-2' },
  { id: '3', name: 'New Car', targetAmount: 25000, currentAmount: 12500, deadline: '2025-06-30', color: 'bg-chart-3' },
  { id: '4', name: 'Home Down Payment', targetAmount: 60000, currentAmount: 18000, deadline: '2026-12-31', color: 'bg-chart-4' },
  { id: '5', name: 'Education Fund', targetAmount: 10000, currentAmount: 6500, deadline: '2024-09-01', color: 'bg-chart-5' },
]

export const monthlyData = [
  { month: 'Aug', income: 6200, expenses: 4100 },
  { month: 'Sep', income: 5800, expenses: 3900 },
  { month: 'Oct', income: 6500, expenses: 4500 },
  { month: 'Nov', income: 6100, expenses: 4200 },
  { month: 'Dec', income: 7200, expenses: 5100 },
  { month: 'Jan', income: 7175, expenses: 2832 },
]

export const categoryBreakdown: CategoryData[] = [
  { name: 'Housing', value: 1800, color: '#0D9488' },
  { name: 'Food & Dining', value: 336.77, color: '#6366F1' },
  { name: 'Transportation', value: 69.50, color: '#F59E0B' },
  { name: 'Utilities', value: 179.50, color: '#EF4444' },
  { name: 'Entertainment', value: 25.98, color: '#8B5CF6' },
  { name: 'Shopping', value: 274.99, color: '#EC4899' },
  { name: 'Health & Fitness', value: 49.99, color: '#10B981' },
  { name: 'Insurance', value: 245.00, color: '#F97316' },
]

export const categories = [
  'Salary',
  'Freelance',
  'Investments',
  'Food & Dining',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Health & Fitness',
  'Housing',
  'Insurance',
]

export const accounts = ['Checking', 'Savings', 'Credit Card', 'Investment']

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Salary': 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    'Freelance': 'bg-teal-500/20 text-teal-600 dark:text-teal-400',
    'Investments': 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
    'Food & Dining': 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
    'Transportation': 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    'Utilities': 'bg-red-500/20 text-red-600 dark:text-red-400',
    'Entertainment': 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
    'Shopping': 'bg-pink-500/20 text-pink-600 dark:text-pink-400',
    'Health & Fitness': 'bg-green-500/20 text-green-600 dark:text-green-400',
    'Housing': 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
    'Insurance': 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
  }
  return colors[category] || 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
}
