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

      {/* Footer Section - Premium Overhaul */}
      <div className="mt-auto pt-6 flex flex-col gap-6">
        {!isCollapsed ? (
          <div className="bg-[#2563EB] rounded-2xl p-5 mb-2 text-white relative overflow-hidden group shadow-lg shadow-[#2563EB]/20">
            <div className="relative z-10">
              <h4 className="font-bold text-sm mb-1">Upgrade to Pro</h4>
              <p className="text-[10px] text-blue-100/80 leading-relaxed mb-4">
                Access advanced analytics and unlimited logs.
              </p>
              <button className="w-full bg-white/10 hover:bg-white/20 transition-colors py-2 rounded-lg text-[10px] font-bold">
                Learn More
              </button>
            </div>
            {/* Decorative background shapes */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
            <div className="absolute -left-8 -top-8 w-20 h-20 bg-blue-400/20 rounded-full blur-xl group-hover:translate-x-4 transition-transform duration-500" />
          </div>
        ) : (
          <button className="h-12 w-12 mx-auto flex items-center justify-center bg-[#2563EB] text-white rounded-full shadow-lg shadow-[#2563EB]/20 hover:scale-105 transition-transform active:scale-95">
            <Sparkles size={20} />
          </button>
        )}
        
        <div className={cn(
          "flex items-center transition-all duration-500",
          isCollapsed ? "justify-center" : "px-2"
        )}>
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0 transition-transform duration-300 hover:scale-105">
            <div className="w-full h-full bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] font-bold text-xs">
              AR
            </div>
          </Avatar>
          <div className={cn(
            "flex flex-col ml-3 transition-all duration-500 overflow-hidden",
            isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"
          )}>
            <span className="text-sm font-bold text-[#1E293B] whitespace-nowrap leading-none mb-1">Alex Rivers</span>
            <span className="text-[10px] font-medium text-[#94A3B8] whitespace-nowrap">Pro Member</span>
          </div>
        </div>
      </div>
    </div>
  )
}
