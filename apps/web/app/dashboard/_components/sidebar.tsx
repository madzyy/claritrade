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
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid, exact: true },
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

function isActivePath(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Sidebar({ userEmail, userName }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [accountOpen, setAccountOpen] = React.useState(false)
  const name = displayName(userEmail, userName)

  return (
    <aside
      className={cn(
        "relative hidden h-full shrink-0 flex-col border-r border-[#E5E7EB] bg-white font-sans transition-[width] duration-200 ease-out lg:flex dark:border-white/10 dark:bg-neutral-900",
        isCollapsed ? "w-14" : "w-56"
      )}
    >
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-[58px] z-50 flex h-6 w-6 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#64748B] hover:text-[#2563EB] dark:border-white/10 dark:bg-neutral-900 dark:text-slate-400 dark:hover:text-blue-400"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div
        className={cn(
          "flex h-14 shrink-0 items-center",
          isCollapsed ? "justify-center px-0" : "px-4"
        )}
      >
        {isCollapsed ? (
          <Logo variant="icon" width={28} height={28} href={undefined} />
        ) : (
          <Logo theme="auto" width={132} height={32} href={undefined} />
        )}
      </div>

      <nav className="mt-3 flex flex-1 flex-col gap-0.5 px-2">
        {navItems.map((item) => {
          const isActive = isActivePath(pathname, item.href, item.exact)
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={cn(
                "flex h-9 items-center rounded-md text-[13px] transition-colors",
                isCollapsed ? "justify-center" : "gap-2.5 px-2.5",
                isActive
                  ? "bg-[#EFF6FF] font-semibold text-[#2563EB] dark:bg-blue-500/15 dark:text-blue-400"
                  : "font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-100"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive
                    ? "text-[#2563EB] dark:text-blue-400"
                    : "text-[#64748B] dark:text-slate-500"
                )}
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 px-2 pb-2 pt-3">
        {!isCollapsed ? (
          <div className="rounded-lg bg-[#2563EB] px-3 py-3 text-white">
            <p className="text-[13px] font-semibold leading-none">
              Upgrade to Pro
            </p>
            <p className="mt-1.5 text-[12px] leading-snug text-blue-100">
              Advanced analytics and unlimited logs.
            </p>
            <button
              type="button"
              className="mt-2.5 w-full rounded-md bg-white/15 py-1.5 text-[12px] font-semibold hover:bg-white/25"
            >
              Learn more
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-[#2563EB] text-white"
            aria-label="Upgrade to Pro"
          >
            <Sparkles size={14} />
          </button>
        )}

        <DropdownMenu open={accountOpen} onOpenChange={setAccountOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center rounded-md text-left outline-none transition-colors hover:bg-[#F8FAFC] dark:hover:bg-white/5",
                isCollapsed ? "h-9 justify-center" : "h-11 gap-2 px-1.5",
                accountOpen && "bg-[#F8FAFC] dark:bg-white/5"
              )}
              aria-label="Account menu"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white">
                <User className="h-3.5 w-3.5" />
              </div>
              {!isCollapsed && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium leading-tight text-[#0F172A] dark:text-slate-100">
                      {name}
                    </p>
                    <p className="truncate text-[11px] leading-tight text-[#64748B] dark:text-slate-400">
                      {userEmail ?? "Account"}
                    </p>
                  </div>
                  <ChevronUp
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 text-[#94A3B8] transition-transform",
                      !accountOpen && "rotate-180"
                    )}
                  />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align={isCollapsed ? "center" : "start"}
            sideOffset={8}
            className="w-56 rounded-lg border-[#E2E8F0] p-0 dark:border-white/10 dark:bg-neutral-900"
          >
            <div className="border-b border-[#E2E8F0] px-3 py-2.5 dark:border-white/10">
              <p className="text-[13px] font-medium text-[#0F172A] dark:text-slate-100">
                {name}
              </p>
              {userEmail ? (
                <p className="mt-1 flex items-start gap-1.5 text-[12px] text-[#64748B] dark:text-slate-400">
                  <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="break-all">{userEmail}</span>
                </p>
              ) : null}
            </div>
            <div className="p-1">
              <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer rounded-md text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-500/10 dark:focus:text-red-400"
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
