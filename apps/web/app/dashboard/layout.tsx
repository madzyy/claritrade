import { Sidebar } from "./_components/sidebar"
import { Header } from "./_components/header"
import { BottomNav } from "./_components/bottom-nav"
import { getSessionUser } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()

  return (
    <div className="flex h-screen bg-[#F7F9FB]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userEmail={user?.email} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
