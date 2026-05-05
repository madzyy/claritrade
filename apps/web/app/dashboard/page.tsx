import { StatCards } from "./_components/stat-cards"
import { EmptyState } from "./_components/empty-state"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-full">
      <StatCards />
      <EmptyState />
    </div>
  )
}
