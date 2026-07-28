"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { detectKillzone, getNyParts, KILLZONES } from "@/lib/trading"
import { cn } from "@workspace/ui/lib/utils"
import { dashCard, dashLabel, dashTitle } from "@/lib/dashboard-theme"

const SHORT: Record<string, string> = {
  ASIAN: "Asian",
  LONDON_OPEN: "LDN Open",
  NY_AM: "NY AM",
  LONDON_CLOSE: "LDN Close",
  NY_LUNCH: "Lunch",
  NY_PM: "NY PM",
}

export function SessionStrip() {
  const [now, setNow] = React.useState(() => new Date())

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const ny = getNyParts(now)
  const kz = detectKillzone(now)

  return (
    <div
      className={cn(
        dashCard,
        "mx-4 lg:mx-8 mt-4 lg:mt-6 px-4 lg:px-5 py-3.5 flex flex-col lg:flex-row lg:items-center gap-4"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-lg bg-[#2563EB]/10 flex items-center justify-center shrink-0 dark:bg-blue-500/15">
          <Clock className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
        </div>
        <div className="min-w-0">
          <p className={cn(dashLabel, "text-[10px] uppercase tracking-[0.12em] font-semibold")}>
            New York · {ny.offsetLabel}
          </p>
          <p className={cn(dashTitle, "text-sm truncate")}>
            {ny.dateLabel} · {ny.timeLabel}
          </p>
        </div>
        <Badge
          className={cn(
            "ml-auto lg:ml-2 shrink-0 border-none text-[10px] font-semibold",
            kz.id === "OUTSIDE"
              ? "bg-[#F8FAFC] text-[#64748B] dark:bg-white/5 dark:text-slate-400"
              : "bg-[#2563EB] text-white"
          )}
        >
          {kz.label}
        </Badge>
      </div>

      <div className="hidden lg:block h-8 w-px bg-[#E2E8F0] shrink-0 dark:bg-white/10" />

      <div className="flex-1 flex items-center gap-1.5 overflow-x-auto">
        {KILLZONES.map((zone) => {
          const active = zone.id === kz.id
          return (
            <div
              key={zone.id}
              title={zone.description}
              className={cn(
                "flex flex-col gap-1.5 min-w-[72px] rounded-lg px-2.5 py-2 border transition-colors",
                active
                  ? "border-[#2563EB]/30 bg-[#2563EB]/10 dark:border-blue-400/30 dark:bg-blue-500/15"
                  : "border-[#E2E8F0] bg-[#F8FAFC] dark:border-white/10 dark:bg-white/[0.03]"
              )}
            >
              <span
                className={cn(
                  "text-[9px] font-semibold uppercase tracking-wide truncate",
                  active
                    ? "text-[#2563EB] dark:text-blue-400"
                    : "text-[#94A3B8] dark:text-slate-500"
                )}
              >
                {SHORT[zone.id] ?? zone.label}
              </span>
              <div className="h-1 rounded-full bg-[#E2E8F0] overflow-hidden dark:bg-white/10">
                <div
                  className={cn(
                    "h-full rounded-full bg-[#2563EB] transition-all dark:bg-blue-400",
                    active ? "w-full" : "w-0"
                  )}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
