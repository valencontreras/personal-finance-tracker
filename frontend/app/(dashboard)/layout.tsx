import { AppSidebar } from '@/components/app-sidebar'
import { ThemeToggle } from '@/components/theme-toggle'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="lg:pl-64 transition-all duration-300">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
          <ThemeToggle />
        </header>
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
