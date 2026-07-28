"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  NotebookText,
  Upload,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Sparkles,
  LogOut,
  Mail,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Logo } from "@/components/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { signOut } from "@/app/actions/auth"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Trade Log", href: "/dashboard/trades", icon: NotebookText },
  { name: "Import", href: "/dashboard/import", icon: Upload },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

type SidebarProps = {
  userEmail?: string | null
  userName?: string | null
}

function displayName(email?: string | null, name?: string | null) {
  if (name?.trim()) return name.trim()
  if (!email) return "Trader"
  const local = email.split("@")[0] ?? "Trader"
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function Sidebar({ userEmail, userName }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [accountOpen, setAccountOpen] = React.useState(false)
  const name = displayName(userEmail, userName)

  return (
    <aside
      className={cn(
        "relative hidden h-full flex-col border-r border-[#E5E7EB] bg-white p-4 font-sans transition-all duration-500 ease-in-out lg:flex dark:border-white/10 dark:bg-neutral-900",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#64748B] shadow-sm transition-colors hover:text-[#2563EB] dark:border-white/10 dark:bg-neutral-900 dark:text-slate-400 dark:hover:text-blue-400"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div
        className={cn(
          "relative mb-8 flex h-12 items-center overflow-hidden transition-all duration-500",
          isCollapsed ? "justify-center" : "justify-start"
        )}
      >
        <div
          className={cn(
            "absolute transition-all duration-500 ease-in-out",
            isCollapsed
              ? "pointer-events-none -translate-x-6 scale-90 opacity-0"
              : "translate-x-0 scale-100 opacity-100"
          )}
        >
          <Logo theme="auto" width={160} height={48} href={undefined} />
        </div>
        <div
          className={cn(
            "absolute transition-all duration-500 ease-in-out",
            isCollapsed
              ? "translate-x-0 scale-100 opacity-100"
              : "pointer-events-none translate-x-6 scale-90 opacity-0"
          )}
        >
          <Logo variant="icon" width={40} height={40} href={undefined} />
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={cn(
                "group relative flex h-11 w-full items-center rounded-lg text-[14px] transition-colors",
                isCollapsed ? "justify-center px-0" : "px-3",
                isActive
                  ? "bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-500/15 dark:text-blue-400"
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B] dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-100"
              )}
            >
              {isActive && !isCollapsed && (
                <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r bg-[#2563EB] dark:bg-blue-400" />
              )}
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  !isCollapsed && "mr-3",
                  isActive
                    ? "text-[#2563EB] dark:text-blue-400"
                    : "text-[#94A3B8] dark:text-slate-500"
                )}
              />
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap transition-all duration-300",
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                  isActive ? "font-semibold" : "font-medium"
                )}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-4 pt-6">
        {!isCollapsed ? (
          <div className="relative overflow-hidden rounded-xl bg-[#2563EB] p-4 text-white">
            <div className="relative z-10">
              <p className="mb-1 text-[13px] font-semibold">Upgrade to Pro</p>
              <p className="mb-3 text-[11px] font-normal leading-relaxed text-blue-100/90">
                Advanced analytics and unlimited logs.
              </p>
              <button
                type="button"
                className="w-full rounded-lg bg-white/15 py-2 text-[12px] font-semibold transition-colors hover:bg-white/25"
              >
                Learn more
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-white"
            aria-label="Upgrade to Pro"
          >
            <Sparkles size={18} />
          </button>
        )}

        <DropdownMenu open={accountOpen} onOpenChange={setAccountOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center rounded-xl p-1.5 text-left transition-colors hover:bg-[#F8FAFC] outline-none dark:hover:bg-white/5",
                isCollapsed ? "justify-center" : "gap-3",
                accountOpen && "bg-[#F8FAFC] dark:bg-white/5"
              )}
              aria-label="Account menu"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white">
                <User className="h-4 w-4" />
              </div>
              <div
                className={cn(
                  "min-w-0 flex-1 overflow-hidden transition-all duration-300",
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}
              >
                <p className="truncate text-[13px] font-semibold leading-tight text-[#1E293B] dark:text-slate-100">
                  {name}
                </p>
                <p className="mt-0.5 truncate text-[11px] font-medium text-[#94A3B8] dark:text-slate-500">
                  {userEmail ?? "Account"}
                </p>
              </div>
              {!isCollapsed && (
                <ChevronUp
                  className={cn(
                    "mr-1 h-4 w-4 shrink-0 text-slate-400 transition-transform",
                    !accountOpen && "rotate-180"
                  )}
                />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align={isCollapsed ? "center" : "start"}
            sideOffset={8}
            className="w-64 rounded-xl border-slate-200 p-0 dark:border-white/10 dark:bg-neutral-900"
          >
            <div className="border-b border-slate-100 px-3.5 py-3 dark:border-white/10">
              <p className="text-[13px] font-semibold text-[#1E293B] dark:text-slate-100">
                {name}
              </p>
              {userEmail ? (
                <p className="mt-1 flex items-start gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
                  <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="break-all">{userEmail}</span>
                </p>
              ) : null}
            </div>
            <div className="p-1.5">
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer rounded-lg text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-500/10 dark:focus:text-red-400"
                onClick={() => void signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
