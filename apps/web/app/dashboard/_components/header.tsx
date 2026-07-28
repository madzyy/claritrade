"use client"

import { Bell, HelpCircle, Menu } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"

import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogTradeModal } from "./log-trade-modal"
import {
  JournalSwitcher,
  type JournalSwitcherItem,
} from "./journal-switcher"

type HeaderProps = {
  journals?: JournalSwitcherItem[]
  activeJournalId?: string | null
}

export function Header({ journals = [], activeJournalId }: HeaderProps) {
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-white px-4 py-3 lg:h-auto lg:px-8 dark:border-white/10 dark:bg-neutral-900">
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-[#64748B] dark:text-slate-400"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex min-w-0 items-center gap-5">
        <div className="hidden items-center gap-3 lg:flex">
          <h1 className="text-xl font-semibold tracking-tight text-[#1E293B] dark:text-slate-100">
            {title}
          </h1>
          <Badge className="rounded-md border-none bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-white/10 dark:text-slate-400">
            SMC / ICT
          </Badge>
          {isTradeLog && (
            <Badge className="rounded-md border-none bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:bg-white/10 dark:text-slate-500">
              History
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-center lg:hidden">
          <Logo theme="auto" width={140} height={42} href={undefined} />
        </div>

        <div className="hidden h-4 w-px bg-slate-200 lg:block dark:bg-white/10" />

        {journals.length > 0 && activeJournalId ? (
          <JournalSwitcher
            journals={journals}
            activeJournalId={activeJournalId}
          />
        ) : null}
      </div>

      <div className="flex items-center gap-1 lg:gap-3">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full text-[#64748B] transition-all hover:bg-[#2563EB]/5 hover:text-[#2563EB] dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border-2 border-white bg-[#2563EB] dark:border-neutral-900" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden h-10 w-10 rounded-full text-[#64748B] transition-all hover:bg-[#2563EB]/5 hover:text-[#2563EB] lg:flex dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        <div className="hidden lg:block">
          <LogTradeModal />
        </div>
      </div>
    </header>
  )
}
