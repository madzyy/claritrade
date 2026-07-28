"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { TrendingUp } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@workspace/ui/lib/utils"
import { BRAND, dashCard, dashLabel, dashTitle } from "@/lib/dashboard-theme"

interface PerformanceChartProps {
  data: {
    day: string
    value: number
  }[]
  hasTrades?: boolean
  startingBalance?: number
}

export function PerformanceChart({
  data,
  hasTrades = false,
  startingBalance = 10_000,
}: PerformanceChartProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"
  const latest = data[data.length - 1]?.value ?? startingBalance
  const delta = latest - startingBalance
  const deltaPct =
    startingBalance > 0 ? (delta / startingBalance) * 100 : 0

  // Light: soft slate. Dark: very faint white so dotted rules don’t dominate.
  const gridStroke = isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0"
  const tickFill = isDark ? "#94A3B8" : "#94A3B8"
  const cursorStroke = isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0"

  return (
    <div className={cn(dashCard, "mx-4 lg:mx-8 overflow-hidden p-4 lg:p-6")}>
      <div className="mb-4 flex items-start justify-between gap-4 lg:mb-5">
        <div>
          <h3 className={cn(dashTitle, "text-base")}>Equity curve</h3>
          <p className={cn(dashLabel, "mt-0.5")}>Daily net cumulative P&L</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold tabular-nums text-[#0F172A] dark:text-slate-100">
            $
            {latest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p
            className={cn(
              "text-[11px] font-medium tabular-nums",
              !hasTrades
                ? "text-[#94A3B8] dark:text-slate-500"
                : delta >= 0
                  ? "text-[#2563EB] dark:text-blue-400"
                  : "text-[#DC2626] dark:text-red-400"
            )}
          >
            {hasTrades
              ? `${delta >= 0 ? "+" : "-"}$${Math.abs(delta).toFixed(0)} (${deltaPct >= 0 ? "+" : ""}${deltaPct.toFixed(1)}%)`
              : "Starting balance"}
          </p>
        </div>
      </div>

      <div className="relative h-[220px] w-full lg:h-[260px]">
        {!hasTrades && (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 dark:bg-neutral-900/90">
            <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB]/10 dark:bg-blue-500/15">
              <TrendingUp className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
            </div>
            <p className="text-sm font-semibold text-[#0F172A] dark:text-slate-100">
              No equity history yet
            </p>
            <p className="mt-1 text-[11px] text-[#94A3B8] dark:text-slate-500">
              Closed trades will appear here
            </p>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={
              hasTrades
                ? data
                : [
                    { day: "A", value: startingBalance },
                    { day: "B", value: startingBalance },
                    { day: "C", value: startingBalance },
                    { day: "D", value: startingBalance },
                    { day: "E", value: startingBalance },
                  ]
            }
            margin={{ top: 8, right: 4, left: -8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={BRAND}
                  stopOpacity={hasTrades ? (isDark ? 0.22 : 0.16) : 0.04}
                />
                <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke={gridStroke}
              strokeDasharray="3 6"
              strokeOpacity={1}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickFill, fontSize: 11 }}
              dy={8}
              hide={!hasTrades}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickFill, fontSize: 11 }}
              tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
              width={56}
              domain={["auto", "auto"]}
            />
            {hasTrades && (
              <Tooltip
                cursor={{ stroke: cursorStroke, strokeWidth: 1 }}
                contentStyle={{
                  borderRadius: "10px",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid #E2E8F0",
                  boxShadow: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: isDark ? "#F1F5F9" : "#0F172A",
                  background: isDark ? "#171717" : "#fff",
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="value"
              stroke={BRAND}
              strokeWidth={2}
              strokeOpacity={hasTrades ? 1 : 0.2}
              fill="url(#equityFill)"
              fillOpacity={1}
              dot={false}
              activeDot={
                hasTrades
                  ? {
                      r: 4,
                      fill: BRAND,
                      stroke: isDark ? "#171717" : "#fff",
                      strokeWidth: 2,
                    }
                  : false
              }
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
