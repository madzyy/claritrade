import { cn } from "@workspace/ui/lib/utils"
import { dashCard, dashLabel } from "@/lib/dashboard-theme"
import type { LucideIcon } from "lucide-react"

interface StatCardsProps {
  stats: {
    label: string
    value: string
    hint: string
    tone?: "neutral" | "positive" | "negative"
    icon: LucideIcon
  }[]
}

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="px-4 lg:px-8">
      <div
        className={cn(
          dashCard,
          "grid grid-cols-2 lg:grid-cols-4 divide-x-0 lg:divide-x divide-y lg:divide-y-0 divide-[#E2E8F0]"
        )}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 lg:p-5 flex flex-col gap-2 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className={dashLabel}>{stat.label}</span>
              <stat.icon className="h-3.5 w-3.5 text-[#94A3B8] shrink-0" />
            </div>
            <span
              className={cn(
                "text-xl lg:text-2xl font-semibold tracking-tight tabular-nums truncate",
                stat.tone === "positive" && "text-[#2563EB]",
                stat.tone === "negative" && "text-[#DC2626]",
                (!stat.tone || stat.tone === "neutral") && "text-[#0F172A]"
              )}
            >
              {stat.value}
            </span>
            <p className="text-[11px] text-[#94A3B8] truncate">{stat.hint}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
