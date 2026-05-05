"use client"

import { Search, SlidersHorizontal, ChevronRight, ChevronLeft, Sparkles, Filter } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

const trades = [
  { pair: "BTCUSDT", date: "Oct 24, 2023", time: "14:20", direction: "LONG", entry: "29,450.00", exit: "30,120.50", rr: "2.4x", result: "+$420.50", outcome: "Win" },
  { pair: "ETHUSDT", date: "Oct 24, 2023", time: "09:15", direction: "SHORT", entry: "1,820.40", exit: "1,835.10", rr: "1.0x", result: "-$150.00", outcome: "Loss" },
  { pair: "SOLUSDT", date: "Oct 23, 2023", time: "21:05", direction: "LONG", entry: "32.45", exit: "34.90", rr: "3.2x", result: "+$88.20", outcome: "Win" },
  { pair: "XRPUSDT", date: "Oct 23, 2023", time: "16:45", direction: "SHORT", entry: "0.5234", exit: "0.5110", rr: "1.8x", result: "+$55.40", outcome: "Win" },
  { pair: "ADAUSDT", date: "Oct 23, 2023", time: "11:30", direction: "LONG", entry: "0.2845", exit: "0.2810", rr: "0.5x", result: "-$24.30", outcome: "Loss" },
  { pair: "MATICUSDT", date: "Oct 22, 2023", time: "20:00", direction: "SHORT", entry: "0.6210", exit: "0.6215", rr: "0.0x", result: "$0.00", outcome: "B.E." },
  { pair: "DOTUSDT", date: "Oct 22, 2023", time: "15:20", direction: "LONG", entry: "4.120", exit: "4.350", rr: "2.1x", result: "+$112.00", outcome: "Win" },
  { pair: "LINKUSDT", date: "Oct 22, 2023", time: "10:45", direction: "LONG", entry: "10.450", exit: "10.820", rr: "1.4x", result: "+$92.15", outcome: "Win" },
  { pair: "AVAXUSDT", date: "Oct 21, 2023", time: "18:30", direction: "SHORT", entry: "12.35", exit: "12.95", rr: "1.0x", result: "-$62.00", outcome: "Loss" },
  { pair: "UNIUSDT", date: "Oct 21, 2023", time: "14:10", direction: "LONG", entry: "4.020", exit: "4.150", rr: "1.2x", result: "+$44.50", outcome: "Win" },
]

export default function TradeLogPage() {
  return (
    <div className="flex flex-col gap-6 p-8 relative min-h-full">
      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#2563EB] transition-colors" />
          <Input 
            placeholder="Search by pair (e.g. BTCUSDT)..." 
            className="pl-10 h-10 border-slate-100 bg-slate-50/50 focus:bg-white transition-all rounded-xl"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Direction</span>
          <Select defaultValue="all">
            <SelectTrigger className="w-[100px] h-10 border-slate-100 rounded-xl font-medium text-slate-600 focus:ring-[#2563EB]/10">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="long">Long</SelectItem>
              <SelectItem value="short">Short</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outcome</span>
          <Select defaultValue="all">
            <SelectTrigger className="w-[100px] h-10 border-slate-100 rounded-xl font-medium text-slate-600 focus:ring-[#2563EB]/10">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="win">Win</SelectItem>
              <SelectItem value="loss">Loss</SelectItem>
              <SelectItem value="be">B.E.</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" className="gap-2 text-slate-600 font-bold text-sm hover:bg-slate-50 rounded-xl px-4 h-10">
          <SlidersHorizontal className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Trade Log Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="grid grid-cols-8 px-6 py-4 border-b border-slate-50 bg-slate-50/30">
          <div className="col-span-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date & Pair</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Direction</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Entry</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exit</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RR</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right pr-4">Result</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outcome</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {trades.map((trade, i) => (
            <div 
              key={i} 
              className="grid grid-cols-8 px-6 py-4 items-center border-b border-slate-50 hover:bg-[#F8FAFC] transition-all cursor-pointer group relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2563EB] scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />
              
              <div className="col-span-2 flex flex-col">
                <span className="font-bold text-[#1E293B] text-[15px] group-hover:text-[#2563EB] transition-colors">{trade.pair}</span>
                <span className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider">{trade.date} · {trade.time}</span>
              </div>
              
              <div>
                <Badge className={cn(
                  "px-2 py-0.5 text-[10px] font-bold rounded-md border-none",
                  trade.direction === "LONG" ? "bg-[#2563EB]/5 text-[#2563EB]" : "bg-slate-100 text-slate-600"
                )}>
                  {trade.direction}
                </Badge>
              </div>
              
              <div className="text-sm font-semibold text-[#475569]">{trade.entry}</div>
              <div className="text-sm font-semibold text-[#475569]">{trade.exit}</div>
              <div className="text-sm font-bold text-[#334155]">{trade.rr}</div>
              
              <div className={cn(
                "text-sm font-bold text-right pr-4",
                trade.result.startsWith("+") ? "text-[#2563EB]" : trade.result.startsWith("-") ? "text-[#1E293B]" : "text-[#64748B]"
              )}>
                {trade.result}
              </div>
              
              <div className="flex items-center justify-between">
                <Badge className={cn(
                  "px-2 py-0.5 text-[10px] font-bold rounded-md border-none w-12 justify-center",
                  trade.outcome === "Win" ? "bg-[#2563EB] text-white shadow-sm" : 
                  trade.outcome === "Loss" ? "bg-slate-100 text-slate-400" : 
                  "bg-slate-50 text-slate-300"
                )}>
                  {trade.outcome}
                </Badge>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50/30 flex items-center justify-between border-t border-slate-50">
          <div className="text-[11px] text-slate-400 font-medium">
            Showing <span className="text-slate-900 font-bold">10</span> of <span className="text-slate-900 font-bold">1,248</span> trades
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg bg-[#2563EB] text-white hover:bg-[#2563EB]/90 hover:text-white">1</Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-slate-600 hover:bg-slate-100">2</Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-slate-600 hover:bg-slate-100">3</Button>
            <span className="text-slate-300 mx-1">...</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-slate-600 hover:bg-slate-100">42</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 h-14 w-14 bg-[#7C3AED] text-white rounded-full shadow-[0_8px_30px_rgb(124,58,237,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-50 group">
        <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  )
}
