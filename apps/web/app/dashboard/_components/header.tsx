"use client"

import { Bell, HelpCircle, Plus, Menu, User, LogOut } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import { LogTradeModal } from "./log-trade-modal"
import { signOut } from "@/app/actions/auth"

type HeaderProps = {
  userEmail?: string | null
}

export function Header({ userEmail }: HeaderProps) {
  const pathname = usePathname()
  const isTradeLog = pathname === "/dashboard/trades"
  const isImport = pathname === "/dashboard/import"
  
  const title = isTradeLog ? "Trade Log" : isImport ? "Import Journal" : "Dashboard"

  return (
    <header className="flex items-center justify-between px-4 lg:px-8 py-3 border-b bg-white sticky top-0 z-30 h-16 lg:h-auto">
      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <Button variant="ghost" size="icon" className="h-10 w-10 text-[#64748B]">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Title / Logo Section */}
      <div className="flex items-center gap-5">
        <div className="hidden lg:flex items-center gap-3">
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

        {/* Center Logo on Mobile */}
        <div className="lg:hidden flex items-center justify-center">
          <Logo theme="light" width={140} height={42} href={undefined} />
        </div>
        
        <div className="hidden lg:block h-4 w-[1px] bg-slate-200" />
        
        <div className="hidden lg:block">
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
      </div>

      <div className="flex items-center gap-1 lg:gap-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-[#64748B] hover:text-[#2563EB] hover:bg-[#2563EB]/5 rounded-full transition-all relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#2563EB] border-2 border-white rounded-full" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-[#64748B] hover:text-[#2563EB] hover:bg-[#2563EB]/5 rounded-full transition-all hidden lg:flex">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="lg:hidden h-9 w-9 rounded-full bg-[#2563EB] flex items-center justify-center text-white ml-1 shadow-md border border-white/20"
                aria-label="Account menu"
              >
                <User className="h-6 w-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {userEmail && (
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  {userEmail}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="hidden lg:flex items-center gap-3">
          {userEmail && (
            <span className="text-xs font-medium text-[#64748B] max-w-[180px] truncate">
              {userEmail}
            </span>
          )}
          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-[#64748B] hover:text-red-600"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Sign out
            </Button>
          </form>
          <LogTradeModal />
        </div>
      </div>
    </header>
  )
}
