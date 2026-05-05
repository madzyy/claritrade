import { Card, CardContent } from "@workspace/ui/components/card"

const stats = [
  { label: "NET P&L", value: "$0.00", subtext: "--" },
  { label: "WIN RATE", value: "0%", subtext: "0 trades" },
  { label: "AVG RR", value: "0.0", subtext: "--" },
  { label: "TOTAL TRADES", value: "0", subtext: "No data" },
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
              <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-2 py-1 rounded-lg border border-[#F1F5F9] transition-colors group-hover:bg-[#2563EB]/5 group-hover:border-[#2563EB]/10">
                <span className="text-[10px] font-bold text-[#94A3B8] group-hover:text-[#2563EB]">
                  {stat.subtext}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#1E293B] tracking-tight mb-1">
                {stat.value}
              </span>
              {stat.label === "NET P&L" && (
                <span className="text-[12px] font-bold text-[#22C55E] ml-1">
                  +0.0%
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
