"use client"

import * as React from "react"
import { Plus, X, Search, Calendar, Info } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

export function LogTradeModal() {
  const [direction, setDirection] = React.useState<"LONG" | "SHORT">("LONG")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md gap-2 px-5 h-10 rounded-xl font-bold transition-all active:scale-95">
          <Plus className="h-4 w-4 stroke-[3px]" />
          Log Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none rounded-[24px] shadow-2xl bg-white">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-[#1E293B]">Log a Trade</h2>
                <Badge className="bg-[#2563EB]/10 text-[#2563EB] border-none px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  Phase 1
                </Badge>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-100">
              <button className="pb-3 text-sm font-bold text-[#2563EB] border-b-2 border-[#2563EB] transition-all">
                Manual Entry
              </button>
              <button className="pb-3 text-sm font-bold text-[#94A3B8] hover:text-[#64748B] transition-all">
                Chart Replay
              </button>
            </div>
          </div>
          
          {/* Form Content */}
          <div className="p-8 pr-4 flex flex-col gap-6 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-slate-300 transition-all [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 pr-4">
              {/* Row 1 */}
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">Pair</Label>
                <div className="relative group">
                  <Input placeholder="XAUUSD" className="h-11 border-slate-200 bg-[#F8FAFC] focus:bg-white rounded-lg transition-all font-semibold text-[#1E293B] pr-10 shadow-sm" />
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#CBD5E1]" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">Direction</Label>
                <Select defaultValue="buy">
                  <SelectTrigger className="h-11 border-slate-200 bg-[#F8FAFC] focus:bg-white rounded-lg font-semibold text-[#1E293B] shadow-sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Row 2 */}
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">Entry Price</Label>
                <Input placeholder="2318.40" className="h-11 border-slate-200 bg-[#F8FAFC] focus:bg-white rounded-lg transition-all font-semibold text-[#1E293B] shadow-sm" />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">Exit Price</Label>
                <Input placeholder="2334.10" className="h-11 border-slate-200 bg-[#F8FAFC] focus:bg-white rounded-lg transition-all font-semibold text-[#1E293B] shadow-sm" />
              </div>

              {/* Row 3 */}
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">Stop Loss</Label>
                <Input placeholder="2310.00" className="h-11 border-slate-200 bg-[#F8FAFC] focus:bg-white rounded-lg transition-all font-semibold text-[#1E293B] shadow-sm" />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">Lot Size</Label>
                <Input placeholder="0.10" className="h-11 border-slate-200 bg-[#F8FAFC] focus:bg-white rounded-lg transition-all font-semibold text-[#1E293B] shadow-sm" />
              </div>
            </div>

            {/* Session */}
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">Session</Label>
              <Select defaultValue="new-york">
                <SelectTrigger className="h-11 border-slate-200 bg-[#F8FAFC] focus:bg-white rounded-lg font-semibold text-[#1E293B] shadow-sm">
                  <SelectValue placeholder="Select Session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="london">London</SelectItem>
                  <SelectItem value="new-york">New York</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Setup Tags */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">Setup Tags</Label>
                <Info className="h-3 w-3 text-[#94A3B8]" />
              </div>
              <div className="flex flex-wrap gap-2">
                {["BOS", "FVG"].map((tag) => (
                  <Badge key={tag} className="bg-[#2563EB] text-white border-none px-3 py-1.5 rounded-md text-[11px] font-bold">
                    {tag}
                  </Badge>
                ))}
                {["OB", "CHoCH", "Liquidity Sweep"].map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[#64748B] border-slate-200 px-3 py-1.5 rounded-md text-[11px] font-bold hover:bg-slate-50">
                    {tag}
                  </Badge>
                ))}
                <button className="px-3 py-1.5 rounded-md border border-dashed border-[#CBD5E1] text-[#94A3B8] text-[11px] font-bold hover:bg-slate-50 transition-colors">
                  + Add Tag
                </button>
              </div>
            </div>

            {/* Psychology Note */}
            <div className="bg-[#F8FAFC] border-l-4 border-[#2563EB] rounded-lg p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-[#2563EB] rounded-full flex items-center justify-center">
                    <Info className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-bold text-[#2563EB] text-sm">Psychology Note — Be Honest</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={cn("h-1.5 w-1.5 rounded-full", i === 1 ? "bg-[#2563EB]" : "bg-[#CBD5E1]")} />
                  ))}
                </div>
              </div>
              <Textarea 
                placeholder="How were you feeling during the entry? Were you chasing or did you wait for the setup? Reflect on your emotional state..." 
                className="bg-white border-slate-200 min-h-[120px] rounded-lg p-4 text-[#64748B] text-sm leading-relaxed resize-none focus:ring-1 focus:ring-[#2563EB]/20 transition-all shadow-sm"
              />
              <p className="text-[10px] text-[#2563EB] italic font-medium">
                Note: Emotional journaling is proven to improve trading consistency by 40%.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 pt-4 flex items-center justify-end gap-4 bg-white border-t border-slate-50">
            <Button variant="ghost" className="font-bold text-[#64748B] hover:text-[#1E293B] h-12 px-6 rounded-lg">
              Cancel
            </Button>
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-12 px-10 rounded-lg shadow-lg shadow-[#2563EB]/20 transition-all active:scale-95">
              Save Trade
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
