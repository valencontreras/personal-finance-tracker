'use client'

import { useState } from 'react'
import { Plus, Target, Calendar, TrendingUp } from 'lucide-react'
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
import { goals as initialGoals, formatCurrency, type Goal } from '@/lib/data'

const goalColors = [
  { name: 'Teal', class: 'bg-chart-1', hex: '#0D9488' },
  { name: 'Indigo', class: 'bg-chart-2', hex: '#6366F1' },
  { name: 'Orange', class: 'bg-chart-3', hex: '#F59E0B' },
  { name: 'Yellow', class: 'bg-chart-4', hex: '#EAB308' },
  { name: 'Pink', class: 'bg-chart-5', hex: '#EC4899' },
]

function getEstimatedCompletion(goal: Goal): string {
  const remaining = goal.targetAmount - goal.currentAmount
  if (remaining <= 0) return 'Completed!'
  
  // Estimate based on average monthly contribution (mock calculation)
  const monthlyRate = goal.currentAmount / 6 // Assume 6 months of saving
  if (monthlyRate === 0) return 'Start saving to see estimate'
  
  const monthsRemaining = Math.ceil(remaining / monthlyRate)
  const completionDate = new Date()
  completionDate.setMonth(completionDate.getMonth() + monthsRemaining)
  
  return completionDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function GoalCard({ 
  goal, 
  onAddFunds 
}: { 
  goal: Goal
  onAddFunds: (goalId: string, amount: number) => void 
}) {
  const [isAddingFunds, setIsAddingFunds] = useState(false)
  const [fundAmount, setFundAmount] = useState('')
  
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0)
  const isComplete = progress >= 100

  const handleAddFunds = () => {
    const amount = parseFloat(fundAmount)
    if (amount > 0) {
      onAddFunds(goal.id, amount)
      setFundAmount('')
      setIsAddingFunds(false)
    }
  }

  // Get the actual color value from the class
  const getColorFromClass = (colorClass: string) => {
    const colorMap: Record<string, string> = {
      'bg-chart-1': '#0D9488',
      'bg-chart-2': '#6366F1',
      'bg-chart-3': '#F59E0B',
      'bg-chart-4': '#EAB308',
      'bg-chart-5': '#EC4899',
    }
    return colorMap[colorClass] || '#0D9488'
  }

  const progressColor = getColorFromClass(goal.color)

  return (
    <Card className="border border-border bg-card overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${progressColor}20` }}
            >
              <Target className="h-5 w-5" style={{ color: progressColor }} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{goal.name}</h3>
              <p className="text-xs text-muted-foreground">
                Target: {formatCurrency(goal.targetAmount)}
              </p>
            </div>
          </div>
          {isComplete && (
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Complete
            </span>
          )}
        </div>

        {/* Progress Section */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              {formatCurrency(goal.currentAmount)}
            </span>
            <span className="text-muted-foreground">
              {progress.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${progress}%`,
                backgroundColor: progressColor
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(remaining)} remaining</span>
            <span>of {formatCurrency(goal.targetAmount)}</span>
          </div>
        </div>

        {/* Info Row */}
        <div className="flex items-center gap-4 mb-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Deadline: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Est. completion: {getEstimatedCompletion(goal)}</span>
        </div>

        {/* Add Funds */}
        {!isComplete && (
          <>
            {isAddingFunds ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="h-9"
                  autoFocus
                />
                <Button size="sm" onClick={handleAddFunds} className="h-9">
                  Add
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => {
                    setIsAddingFunds(false)
                    setFundAmount('')
                  }}
                  className="h-9"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingFunds(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Funds
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function GoalsPage() {
  const [goals, setGoals] = useState(initialGoals)
  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    color: 'bg-chart-1',
  })

  const handleAddFunds = (goalId: string, amount: number) => {
    setGoals(goals.map(g => 
      g.id === goalId 
        ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) }
        : g
    ))
  }

  const handleCreateGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) return

    const goal: Goal = {
      id: String(Date.now()),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      deadline: newGoal.deadline,
      color: newGoal.color,
    }

    setGoals([...goals, goal])
    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      color: 'bg-chart-1',
    })
    setIsNewGoalOpen(false)
  }

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Savings Goals</h1>
          <p className="text-muted-foreground">Track your progress towards financial goals</p>
        </div>
        <Dialog open={isNewGoalOpen} onOpenChange={setIsNewGoalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1.5" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground">Goal Name</label>
                <Input
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g., Emergency Fund"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Target Amount</label>
                  <Input
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    placeholder="10000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Starting Amount</label>
                  <Input
                    type="number"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Target Date</label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Color</label>
                <div className="flex gap-2 mt-2">
                  {goalColors.map((color) => (
                    <button
                      key={color.class}
                      onClick={() => setNewGoal({ ...newGoal, color: color.class })}
                      className={`h-8 w-8 rounded-full transition-all ${
                        newGoal.color === color.class 
                          ? 'ring-2 ring-offset-2 ring-primary' 
                          : ''
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <Button onClick={handleCreateGoal} className="w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overall Progress Card */}
      <Card className="border border-border bg-card">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Progress</p>
              <p className="text-2xl font-semibold text-foreground">
                {formatCurrency(totalSaved)} <span className="text-base font-normal text-muted-foreground">of {formatCurrency(totalTarget)}</span>
              </p>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">{goals.length} goals</span>
                <span className="font-medium text-foreground">{overallProgress.toFixed(0)}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onAddFunds={handleAddFunds} />
        ))}
      </div>

      {goals.length === 0 && (
        <Card className="border border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No goals yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first savings goal to start tracking your progress
            </p>
            <Button onClick={() => setIsNewGoalOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" />
              Create Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
