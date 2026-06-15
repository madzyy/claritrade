import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { TrendingUp, Percent, Target, BarChart3 } from "lucide-react"

interface StatCardsProps {
  stats: {
    label: string
    value: string
    change: string | null
    icon: any
  }[]
}

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 px-4 lg:px-8 py-4 lg:py-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="group border-[#F1F5F9] bg-white shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] rounded-xl transition-all duration-300 hover:shadow-[0_8px_30_rgba(0,0,0,0.08)] hover:-translate-y-1 overflow-hidden relative">
          <CardContent className="p-5 lg:p-6">
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <div className="flex items-center gap-2">
                <span className="text-[10px] lg:text-[11px] font-bold tracking-[0.1em] text-[#64748B] uppercase whitespace-nowrap">
                  {stat.label}
                </span>
                {stat.change && (
                  <Badge className="bg-[#2563EB]/5 text-[#2563EB] border-none px-1.5 py-0 text-[9px] font-bold rounded-md">
                    {stat.change}
                  </Badge>
                )}
              </div>
              <div className="h-8 w-8 bg-[#F8FAFC] group-hover:bg-[#2563EB]/5 rounded-lg flex items-center justify-center transition-colors shrink-0">
                <stat.icon className="h-4 w-4 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
              </div>
            </div>
            <div className="flex flex-col min-h-[50px] lg:min-h-[60px] justify-end">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl lg:text-3xl font-bold text-[#1E293B] tracking-tight">
                  {stat.value}
                </span>
              </div>
              {stat.label === "NET P&L" ? (
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-500 mt-1">
                  <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Performance Insight
                </div>
              ) : (
                <div className="h-4" />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
