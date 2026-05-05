"use client"

import { Bell, HelpCircle, ChevronDown, Plus } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

import { usePathname } from "next/navigation"
import Image from "next/image"

export function Header() {
  const pathname = usePathname()
  const isTradeLog = pathname === "/dashboard/trades"
  const isImport = pathname === "/dashboard/import"
  
  const title = isTradeLog ? "Trade Log" : isImport ? "Import Journal" : "Dashboard"

  return (
    <header className="flex items-center justify-between px-8 py-3 border-b bg-white sticky top-0 z-30">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[#1E293B] tracking-tight">{title}</h1>
          <Badge className="bg-[#2563EB]/5 text-[#2563EB] border-none px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider">
            Phase 1
          </Badge>
          {isTradeLog && (
            <Badge className="bg-slate-100 text-slate-400 border-none px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider">
              History
            </Badge>
          )}
        </div>
        
        <div className="h-4 w-[1px] bg-slate-200" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 px-4 text-sm font-medium text-[#64748B] hover:bg-slate-50 border-none bg-transparent gap-2 transition-all rounded-lg outline-none ring-0">
              <span className="flex items-center gap-2 border px-3 py-1.5 rounded-lg bg-white shadow-sm">
                <span className="w-4 h-4 rounded-sm border border-slate-200 flex items-center justify-center">
                  <div className="w-2 h-2 bg-slate-200 rounded-sm" />
                </span>
                Date Range
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 p-1 rounded-xl shadow-lg border-slate-100 bg-white">
            <DropdownMenuItem className="rounded-lg cursor-pointer text-[#475569] focus:bg-slate-50 focus:text-[#1E293B]">Last 7 Days</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer text-[#475569] focus:bg-slate-50 focus:text-[#1E293B]">Last 30 Days</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer text-[#475569] focus:bg-slate-50 focus:text-[#1E293B]">This Month</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg border-t mt-1 cursor-pointer text-[#475569] focus:bg-slate-50 focus:text-[#1E293B]">Custom Range</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-[#64748B] hover:text-[#2563EB] hover:bg-[#2563EB]/5 rounded-full transition-all relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#2563EB] border-2 border-white rounded-full" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-[#64748B] hover:text-[#2563EB] hover:bg-[#2563EB]/5 rounded-full transition-all">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
        
        <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md gap-2 px-5 h-10 rounded-xl font-bold transition-all active:scale-95">
          <Plus className="h-4 w-4 stroke-[3px]" />
          Log Trade
        </Button>
      </div>
    </header>
  )
}
