"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, NotebookText, Upload, Settings, User, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import Image from "next/image"

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
    <div 
      className={cn(
        "relative flex h-full flex-col border-r bg-white p-4 transition-all duration-500 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-[#64748B] shadow-md hover:text-[#2563EB] hover:scale-110 active:scale-95 transition-all duration-300 z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Section - Smooth Crossfade */}
      <div className={cn(
        "relative h-12 mb-10 flex items-center overflow-hidden transition-all duration-500",
        isCollapsed ? "justify-center px-0" : "justify-start px-0"
      )}>
        <div className={cn(
          "absolute transition-all duration-500 ease-in-out transform",
          isCollapsed ? "opacity-0 scale-50 -translate-x-10" : "opacity-100 scale-100 translate-x-0"
        )}>
          <Image src="/logo-light.png" alt="Logo" width={160} height={48} className="object-contain" />
        </div>
        <div className={cn(
          "absolute transition-all duration-500 ease-in-out transform",
          isCollapsed ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-50 translate-x-10"
        )}>
          <Image src="/logo-collapse.png" alt="Logo Icon" width={40} height={40} className="object-contain" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : ""}
              className={cn(
                "group relative flex items-center h-12 w-full rounded-md transition-all duration-500 ease-in-out",
                isCollapsed ? "px-0 justify-center" : "px-4",
                isActive
                  ? "bg-[#2563EB]/5 text-[#2563EB] shadow-sm"
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              )}
            >
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2563EB] transition-all duration-500" />
              )}
              <item.icon className={cn(
                "h-5 w-5 transition-all duration-500 shrink-0", 
                isCollapsed ? "" : "mr-3",
                isActive ? "text-[#2563EB]" : "text-[#64748B]",
                "group-hover:scale-110"
              )} />
              <div className={cn(
                "transition-all duration-500 ease-in-out overflow-hidden flex items-center",
                isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"
              )}>
                <span className={cn(
                  "whitespace-nowrap",
                  isActive ? "font-bold tracking-tight" : "font-medium"
                )}>
                  {item.name}
                </span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer Section */}
      <div className="mt-auto pt-4 space-y-4">
        <Button 
          className={cn(
            "w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all duration-500",
            isCollapsed ? "h-12 w-12 p-0 mx-auto rounded-full" : "h-12 py-6"
          )}
        >
          {isCollapsed ? <Sparkles size={20} className="shrink-0" /> : <span className="transition-opacity duration-300 whitespace-nowrap">Upgrade to Pro</span>}
        </Button>
        
        <div className={cn(
          "flex items-center border-t pt-4 transition-all duration-500",
          isCollapsed ? "justify-center" : "px-2 pb-2"
        )}>
          <Avatar className="h-10 w-10 border-2 border-[#E2E8F0] shrink-0 transition-transform duration-300 hover:scale-105">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-[#F1F5F9] text-[#2563EB]">JD</AvatarFallback>
          </Avatar>
          <div className={cn(
            "flex flex-col ml-3 transition-all duration-500 overflow-hidden",
            isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"
          )}>
            <span className="text-sm font-semibold text-[#0F172A] whitespace-nowrap">John Doe</span>
            <span className="text-xs text-[#64748B] whitespace-nowrap">Trader Account</span>
          </div>
        </div>
      </div>
    </div>
  )
}
