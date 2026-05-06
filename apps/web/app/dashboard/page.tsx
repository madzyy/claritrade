import { prisma } from "@workspace/db"
import { StatCards } from "./_components/stat-cards"
import { PerformanceChart } from "./_components/performance-chart"
import { RecentTrades } from "./_components/recent-trades"
import { EmptyState } from "./_components/empty-state"
import { Sparkles, Lightbulb } from "lucide-react"
export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const trades = await prisma.trade.findMany({
    orderBy: { dateOpened: "desc" },
    take: 5,
  })

  return (
    <div className="flex flex-col gap-4 lg:gap-8 pb-12">
      <StatCards />
      
      <PerformanceChart />
      
      {trades.length > 0 ? (
        <RecentTrades trades={trades} />
      ) : (
        <EmptyState />
      )}

      {/* AI Insights Footer */}
      <div className="flex flex-col lg:flex-row flex-wrap gap-3 lg:gap-4 px-4 lg:px-8 mt-2 lg:mt-4">
        <div className="flex items-center gap-3 bg-[#2563EB]/5 border border-[#2563EB]/10 px-4 lg:px-5 py-2.5 lg:py-3 rounded-full group hover:bg-[#2563EB]/10 transition-all cursor-default">
          <div className="h-5 lg:h-6 w-5 lg:w-6 bg-[#2563EB] rounded-full flex items-center justify-center shadow-lg shadow-[#2563EB]/20 shrink-0">
            <Sparkles className="h-2.5 lg:h-3 w-2.5 lg:w-3 text-white" />
          </div>
          <span className="text-[10px] lg:text-xs font-bold text-[#2563EB]">
            AI Insight: Trading performance is 15% higher during NY session.
          </span>
        </div>
        
        <div className="flex items-center gap-3 bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 px-4 lg:px-5 py-2.5 lg:py-3 rounded-full group hover:bg-[#8B5CF6]/10 transition-all cursor-default">
          <div className="h-5 lg:h-6 w-5 lg:w-6 bg-[#8B5CF6] rounded-full flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20 shrink-0">
            <Lightbulb className="h-2.5 lg:h-3 w-2.5 lg:w-3 text-white" />
          </div>
          <span className="text-[10px] lg:text-xs font-bold text-[#8B5CF6]">
            Tip: GBPUSD sell trades are showing a lower win rate this month.
          </span>
        </div>
      </div>
    </div>
  )
}
