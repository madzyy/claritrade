"use client"

import { Bell, HelpCircle, Menu, User, LogOut } from "lucide-react"
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
import {
  JournalSwitcher,
  type JournalSwitcherItem,
} from "./journal-switcher"
import { signOut } from "@/app/actions/auth"

type HeaderProps = {
  userEmail?: string | null
  journals?: JournalSwitcherItem[]
  activeJournalId?: string | null
}

export function Header({
  userEmail,
  journals = [],
  activeJournalId,
}: HeaderProps) {
  const pathname = usePathname()
  const isTradeLog = pathname === "/dashboard/trades"
  const isImport = pathname === "/dashboard/import"
  const isSettings = pathname === "/dashboard/settings"

  const title = isTradeLog
    ? "Trade Log"
    : isImport
      ? "Import Journal"
      : isSettings
        ? "Settings"
        : "Dashboard"

  return (
    <header className="flex items-center justify-between px-4 lg:px-8 py-3 border-b bg-white sticky top-0 z-30 h-16 lg:h-auto">
      <div className="lg:hidden">
        <Button variant="ghost" size="icon" className="h-10 w-10 text-[#64748B]">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex items-center gap-5 min-w-0">
        <div className="hidden lg:flex items-center gap-3">
          <h1 className="text-xl font-semibold text-[#1E293B] tracking-tight">
            {title}
          </h1>
          <Badge className="bg-slate-100 text-slate-500 border-none px-2 py-0.5 text-[10px] font-semibold rounded-md uppercase tracking-wider">
            SMC / ICT
          </Badge>
          {isTradeLog && (
            <Badge className="bg-slate-100 text-slate-400 border-none px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider">
              History
            </Badge>
          )}
        </div>

        <div className="lg:hidden flex items-center justify-center">
          <Logo theme="light" width={140} height={42} href={undefined} />
        </div>

        <div className="hidden lg:block h-4 w-[1px] bg-slate-200" />

        {journals.length > 0 && activeJournalId ? (
          <JournalSwitcher
            journals={journals}
            activeJournalId={activeJournalId}
          />
        ) : null}
      </div>

      <div className="flex items-center gap-1 lg:gap-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-[#64748B] hover:text-[#2563EB] hover:bg-[#2563EB]/5 rounded-full transition-all relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#2563EB] border-2 border-white rounded-full" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-[#64748B] hover:text-[#2563EB] hover:bg-[#2563EB]/5 rounded-full transition-all hidden lg:flex"
          >
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
