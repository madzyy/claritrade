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
  Sparkles,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Logo } from "@/components/logo"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Trade Log", href: "/dashboard/trades", icon: NotebookText },
  { name: "Import", href: "/dashboard/import", icon: Upload },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <aside
      className={cn(
        "relative hidden lg:flex h-full flex-col border-r border-[#E5E7EB] bg-white p-4 font-sans transition-all duration-500 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#64748B] shadow-sm hover:text-[#2563EB] transition-colors"
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
          <Logo theme="light" width={160} height={48} href={undefined} />
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
                  ? "bg-[#EFF6FF] text-[#2563EB]"
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]"
              )}
            >
              {isActive && !isCollapsed && (
                <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r bg-[#2563EB]" />
              )}
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  !isCollapsed && "mr-3",
                  isActive ? "text-[#2563EB]" : "text-[#94A3B8]"
                )}
              />
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap transition-all duration-300",
                  isCollapsed
                    ? "w-0 opacity-0"
                    : "w-auto opacity-100",
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

        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "gap-3 px-1"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white">
            <User className="h-4 w-4" />
          </div>
          <div
            className={cn(
              "min-w-0 overflow-hidden transition-all duration-300",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            <p className="truncate text-[13px] font-semibold leading-tight text-[#1E293B]">
              Alex Rivers
            </p>
            <p className="mt-0.5 truncate text-[11px] font-medium text-[#94A3B8]">
              Pro Member
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
