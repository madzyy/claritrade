"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, NotebookText, Upload, Settings } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Trade Log", href: "/dashboard/trades", icon: NotebookText },
  { name: "Import", href: "/dashboard/import", icon: Upload },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around px-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300",
              isActive ? "text-[#2563EB]" : "text-[#94A3B8] hover:text-[#64748B]"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-transform duration-300",
              isActive && "scale-110"
            )} />
            <span className={cn(
              "text-[10px] font-bold tracking-tight",
              isActive ? "text-[#2563EB]" : "text-[#94A3B8]"
            )}>
              {item.name}
            </span>
            {isActive && (
              <div className="absolute top-0 w-12 h-[2px] bg-[#2563EB] rounded-full transition-all duration-500" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
