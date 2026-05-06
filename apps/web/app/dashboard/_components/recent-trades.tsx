import { Card } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import { Image as ImageIcon } from "lucide-react"

interface RecentTradesProps {
  trades: any[]
}

export function RecentTrades({ trades }: RecentTradesProps) {
  return (
    <Card className="mx-4 lg:mx-8 p-4 lg:p-8 border-[#F1F5F9] bg-white shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <h3 className="text-lg lg:text-xl font-bold text-[#1E293B]">Recent Trades</h3>
        <div className="hidden lg:flex bg-[#F8FAFC] p-1 rounded-lg border border-[#F1F5F9]">
          <button className="px-4 py-1.5 text-[11px] font-bold bg-white text-[#2563EB] rounded-md shadow-sm">All</button>
          <button className="px-4 py-1.5 text-[11px] font-bold text-[#94A3B8] hover:text-[#64748B]">Wins</button>
          <button className="px-4 py-1.5 text-[11px] font-bold text-[#94A3B8] hover:text-[#64748B]">Losses</button>
        </div>
        <button className="lg:hidden text-xs font-bold text-[#2563EB]">View All</button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block w-full">
        <div className="grid grid-cols-7 pb-4 border-b border-slate-50">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Pair</span>
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Direction</span>
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Entry</span>
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Exit</span>
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">RR</span>
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Result</span>
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider text-right">Outcome</span>
        </div>
        
        <div className="flex flex-col">
          {trades.map((trade, idx) => (
            <div key={trade.id || idx} className="grid grid-cols-7 py-5 border-b border-slate-50 last:border-0 hover:bg-[#F8FAFC]/50 transition-colors group">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1E293B]">{trade.pair}</span>
                {trade.screenshotUrls && trade.screenshotUrls.length > 0 && (
                  <span title={`${trade.screenshotUrls.length} screenshots`}>
                    <ImageIcon className="h-3 w-3 text-[#2563EB]/50" />
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <Badge className={cn(
                   "border-none px-2 py-0.5 text-[9px] font-black rounded-sm",
                   trade.direction.toUpperCase() === "BUY" ? "bg-blue-50 text-blue-500" : "bg-slate-100 text-slate-500"
                )}>
                  {trade.direction.toUpperCase()}
                </Badge>
              </div>
              <span className="text-sm font-medium text-[#64748B]">{trade.entry.toFixed(2)}</span>
              <span className="text-sm font-medium text-[#64748B]">{trade.exit?.toFixed(2) || "-"}</span>
              <span className="text-sm font-bold text-[#475569]">{trade.rr?.toFixed(1) || "-"}</span>
              <span className={cn(
                "text-sm font-bold",
                (trade.result || 0) >= 0 ? "text-[#2563EB]" : "text-red-500"
              )}>
                {trade.result != null ? `${trade.result >= 0 ? "+" : ""}$${trade.result.toFixed(2)}` : "-"}
              </span>
              <div className="flex justify-end">
                <Badge className={cn(
                   "border-none px-3 py-1 text-[9px] font-black rounded-sm tracking-tighter",
                   trade.outcome?.toUpperCase() === "WIN" ? "bg-[#2563EB] text-white" : trade.outcome ? "bg-[#1E293B] text-white" : "bg-slate-200 text-slate-500"
                )}>
                  {trade.outcome?.toUpperCase() || "PENDING"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile List View */}
      <div className="lg:hidden flex flex-col gap-4">
        {trades.map((trade, idx) => (
          <div key={trade.id || idx} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1E293B]">{trade.pair}</span>
                <Badge className={cn(
                   "border-none px-1.5 py-0 text-[8px] font-black rounded-sm",
                   trade.direction.toUpperCase() === "BUY" ? "bg-blue-50 text-blue-500" : "bg-slate-100 text-slate-500"
                )}>
                  {trade.direction.toUpperCase()}
                </Badge>
              </div>
              <span className="text-[10px] text-[#94A3B8] font-medium">
                {trade.dateOpened ? new Date(trade.dateOpened).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Aug 24"} • {trade.dateOpened ? new Date(trade.dateOpened).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : "14:20"}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={cn(
                "text-sm font-bold",
                (trade.result || 0) >= 0 ? "text-[#2563EB]" : "text-red-500"
              )}>
                {trade.result != null ? `${trade.result >= 0 ? "+" : ""}$${trade.result.toFixed(2)}` : "-"}
              </span>
              <Badge className={cn(
                  "border-none px-2 py-0.5 text-[8px] font-black rounded-sm tracking-tighter",
                  trade.outcome?.toUpperCase() === "WIN" ? "bg-[#2563EB] text-white" : trade.outcome ? "bg-[#1E293B] text-white" : "bg-slate-200 text-slate-500"
              )}>
                {trade.outcome?.toUpperCase() || "PENDING"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
