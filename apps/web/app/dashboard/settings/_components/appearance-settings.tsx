"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

const options = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
] as const

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900">
      <div className="grid grid-cols-3 gap-1 p-2">
        {options.map((opt) => {
          const selected = mounted && theme === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl px-3 py-4 text-sm font-medium transition-colors",
                selected
                  ? "bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-500/15 dark:text-blue-400"
                  : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5"
              )}
            >
              <opt.icon className="h-5 w-5" />
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
