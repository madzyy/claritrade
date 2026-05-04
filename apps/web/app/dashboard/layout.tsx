import { Sidebar } from "./_components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-[#F7F9FB]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
