import { Sidebar } from "./_components/sidebar"
import { Header } from "./_components/header"
import { BottomNav } from "./_components/bottom-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-[#F7F9FB]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
