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

import Image from "next/image"

export function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-3 border-b bg-white sticky top-0 z-30">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Dashboard</h1>
          <Badge className="bg-[#2563EB]/5 text-[#2563EB] border-none px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider">
            Phase 1
          </Badge>
        </div>
        
        <div className="h-4 w-[1px] bg-slate-200" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 px-4 text-sm font-medium text-[#64748B] hover:bg-slate-50 border-none bg-transparent gap-2 transition-all rounded-lg outline-none ring-0">
              Date Range
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 p-1 rounded-xl shadow-lg border-slate-100 bg-white">
            <DropdownMenuItem className="rounded-lg cursor-pointer text-[#64748B] focus:bg-slate-50 focus:text-[#0F172A]">Last 7 Days</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer text-[#64748B] focus:bg-slate-50 focus:text-[#0F172A]">Last 30 Days</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer text-[#64748B] focus:bg-slate-50 focus:text-[#0F172A]">This Month</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg border-t mt-1 cursor-pointer text-[#64748B] focus:bg-slate-50 focus:text-[#0F172A]">Custom Range</DropdownMenuItem>
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
