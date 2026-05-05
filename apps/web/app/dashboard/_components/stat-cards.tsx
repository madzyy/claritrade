import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { TrendingUp, Percent, Target, BarChart3 } from "lucide-react"

const stats = [
  { label: "NET P&L", value: "+$342.00", change: "+12%", icon: TrendingUp },
  { label: "WIN RATE", value: "64%", change: null, icon: Percent },
  { label: "AVG RR", value: "1.8", change: null, icon: Target },
  { label: "TOTAL TRADES", value: "14", change: null, icon: BarChart3 },
]

export function StatCards() {
  return (
    <div className="grid grid-cols-4 gap-6 px-8 py-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="group border-[#F1F5F9] bg-white shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] rounded-xl transition-all duration-300 hover:shadow-[0_8px_30_rgba(0,0,0,0.08)] hover:-translate-y-1 overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-bold tracking-[0.1em] text-[#64748B] uppercase">
                {stat.label}
              </span>
              <div className="h-8 w-8 bg-[#F8FAFC] group-hover:bg-[#2563EB]/5 rounded-lg flex items-center justify-center transition-colors">
                <stat.icon className="h-4 w-4 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-2xl font-bold text-[#1E293B] tracking-tight">
                  {stat.value}
                </span>
                {stat.change && (
                  <Badge className="bg-[#2563EB]/5 text-[#2563EB] border-none px-2 py-0.5 text-[10px] font-bold rounded-md mb-1.5">
                    {stat.change}
                  </Badge>
                )}
              </div>
              {stat.label === "NET P&L" && (
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-500">
                  <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Performance Insight
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
