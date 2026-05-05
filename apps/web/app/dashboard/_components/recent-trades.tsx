"use client"

import * as React from "react"
import { Card } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

const trades = [
  { pair: "XAUUSD", direction: "BUY", entry: "2318.40", exit: "2334.10", rr: "2.1", result: "+$84.00", outcome: "WIN" },
  { pair: "EURUSD", direction: "BUY", entry: "1.0842", exit: "1.0821", rr: "1.5", result: "+$63.00", outcome: "WIN" },
  { pair: "GBPUSD", direction: "SELL", entry: "1.2710", exit: "1.2695", rr: "0.8", result: "-$40.00", outcome: "LOSS" },
]

export function RecentTrades() {
  return (
    <Card className="mx-8 p-8 border-[#F1F5F9] bg-white shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-[#1E293B]">Recent Trades</h3>
        <div className="flex bg-[#F8FAFC] p-1 rounded-lg border border-[#F1F5F9]">
          <button className="px-4 py-1.5 text-[11px] font-bold bg-white text-[#2563EB] rounded-md shadow-sm">All</button>
          <button className="px-4 py-1.5 text-[11px] font-bold text-[#94A3B8] hover:text-[#64748B]">Wins</button>
          <button className="px-4 py-1.5 text-[11px] font-bold text-[#94A3B8] hover:text-[#64748B]">Losses</button>
        </div>
      </div>

      <div className="w-full">
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
            <div key={idx} className="grid grid-cols-7 py-5 border-b border-slate-50 last:border-0 hover:bg-[#F8FAFC]/50 transition-colors group">
              <span className="text-sm font-bold text-[#1E293B]">{trade.pair}</span>
              <div className="flex items-center">
                <Badge className={cn(
                  "border-none px-2 py-0.5 text-[9px] font-black rounded-sm",
                  trade.direction === "BUY" ? "bg-blue-50 text-blue-500" : "bg-slate-100 text-slate-500"
                )}>
                  {trade.direction}
                </Badge>
              </div>
              <span className="text-sm font-medium text-[#64748B]">{trade.entry}</span>
              <span className="text-sm font-medium text-[#64748B]">{trade.exit}</span>
              <span className="text-sm font-bold text-[#475569]">{trade.rr}</span>
              <span className={cn(
                "text-sm font-bold",
                trade.result.startsWith("+") ? "text-[#2563EB]" : "text-[#1E293B]"
              )}>
                {trade.result}
              </span>
              <div className="flex justify-end">
                <Badge className={cn(
                  "border-none px-3 py-1 text-[9px] font-black rounded-sm tracking-tighter",
                  trade.outcome === "WIN" ? "bg-[#2563EB] text-white" : "bg-[#1E293B] text-white"
                )}>
                  {trade.outcome}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
