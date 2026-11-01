import Link from "next/link"
import { Layers, Clock, GitBranch, ArrowRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { dashCard, dashLabel, dashTitle } from "@/lib/dashboard-theme"

export function EmptyState() {
  return (
    <div className="mx-4 lg:mx-8">
      <div className={cn(dashCard, "p-5 lg:p-6")}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2563EB]">
              Get started
            </p>
            <h2 className={cn(dashTitle, "text-lg lg:text-xl")}>
              Journal the next HTF candle
            </h2>
            <p className={cn(dashLabel, "text-sm max-w-xl leading-relaxed")}>
              Call the next higher-timeframe candle, name the draw on liquidity,
              then log the lower-timeframe confirmation and the session.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <span className="inline-flex items-center justify-center rounded-xl bg-[#2563EB] text-white text-sm font-semibold h-11 px-5">
              Use + Log Trade above
            </span>
            <Link
              href="/dashboard/import"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm font-semibold h-11 px-5 hover:bg-[#F8FAFC] transition-colors"
            >
              Import history
              <ArrowRight className="h-4 w-4 text-[#2563EB]" />
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Tip
            icon={<Clock className="h-4 w-4 text-[#2563EB]" />}
            title="Call one candle"
            body="An imbalance draws the next HTF candle to an old high or low. A run on a high or low draws it back to an FVG."
          />
          <Tip
            icon={<Layers className="h-4 w-4 text-[#2563EB]" />}
            title="Trade the range"
            body="Pair it with a dealing range. At high resistance liquidity, delivery can defer into opposing stops before the draw."
          />
          <Tip
            icon={<GitBranch className="h-4 w-4 text-[#2563EB]" />}
            title="Profile the open"
            body="STP starts at 9:30 NY. Consolidation leads to expansion. Trade the expansion."
          />
        </div>
      </div>
    </div>
  )
}

function Tip({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode
  title: string
  body: string
}) {
  return (
    <div className="flex gap-3">
      <div className="h-9 w-9 rounded-lg bg-[#2563EB]/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-[#0F172A]">{title}</p>
        <p className={cn(dashLabel, "mt-0.5 leading-relaxed")}>{body}</p>
      </div>
    </div>
  )
}
