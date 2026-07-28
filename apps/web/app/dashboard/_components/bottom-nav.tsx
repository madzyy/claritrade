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
  LogOut,
  Mail,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
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

type BottomNavProps = {
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

export function BottomNav({ userEmail, userName }: BottomNavProps) {
  const pathname = usePathname()
  const name = displayName(userEmail, userName)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[#E5E7EB] bg-white px-1 lg:hidden dark:border-white/10 dark:bg-neutral-900">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "relative flex h-full w-full flex-col items-center justify-center gap-1 transition-all duration-300",
              isActive
                ? "text-[#2563EB] dark:text-blue-400"
                : "text-[#94A3B8] hover:text-[#64748B] dark:text-slate-500 dark:hover:text-slate-300"
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                isActive && "scale-110"
              )}
            />
            <span
              className={cn(
                "text-[10px] font-medium tracking-tight",
                isActive
                  ? "font-semibold text-[#2563EB] dark:text-blue-400"
                  : "text-[#94A3B8] dark:text-slate-500"
              )}
            >
              {item.name}
            </span>
            {isActive && (
              <div className="absolute top-0 h-0.5 w-12 rounded-full bg-[#2563EB] transition-all duration-500 dark:bg-blue-400" />
            )}
          </Link>
        )
      })}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="relative flex h-full w-full flex-col items-center justify-center gap-1 text-[#94A3B8] transition-all duration-300 hover:text-[#64748B] dark:text-slate-500 dark:hover:text-slate-300"
            aria-label="Account menu"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB] text-white">
              <User className="h-3 w-3" />
            </span>
            <span className="text-[10px] font-medium tracking-tight">Account</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="end"
          sideOffset={12}
          className="mb-1 w-64 rounded-xl border-slate-200 p-0 dark:border-white/10 dark:bg-neutral-900"
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
    </nav>
  )
}
