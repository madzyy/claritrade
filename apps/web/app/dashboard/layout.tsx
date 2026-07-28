import { Sidebar } from "./_components/sidebar"
import { Header } from "./_components/header"
import { BottomNav } from "./_components/bottom-nav"
import { getOrCreatePrismaUser } from "@/lib/auth"
import { getActiveJournal, listJournalsForUser } from "@/lib/journals"
import { dashCanvas } from "@/lib/dashboard-theme"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getOrCreatePrismaUser()

  const journals = user ? await listJournalsForUser(user.id) : []
  const active = user ? await getActiveJournal(user) : null

  return (
    <div className={`flex h-screen ${dashCanvas}`}>
      <Sidebar userEmail={user?.email} userName={user?.name} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          journals={journals.map((j) => ({
            id: j.id,
            name: j.name,
            isDefault: j.isDefault,
            tradeCount: j.tradeCount,
          }))}
          activeJournalId={active?.id ?? null}
        />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</main>
        <BottomNav userEmail={user?.email} userName={user?.name} />
      </div>
    </div>
  )
}
