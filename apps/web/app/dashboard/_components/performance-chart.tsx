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
  const latest = data[data.length - 1]?.value ?? startingBalance
  const delta = latest - startingBalance
  const deltaPct =
    startingBalance > 0 ? (delta / startingBalance) * 100 : 0

  return (
    <div className={cn(dashCard, "mx-4 lg:mx-8 p-4 lg:p-6 overflow-hidden")}>
      <div className="flex items-start justify-between mb-4 lg:mb-5 gap-4">
        <div>
          <h3 className={cn(dashTitle, "text-base")}>
            Equity curve
          </h3>
          <p className={cn(dashLabel, "mt-0.5")}>
            Daily net cumulative P&L
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-semibold text-[#0F172A] tabular-nums">
            ${latest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p
            className={cn(
              "text-[11px] font-medium tabular-nums",
              !hasTrades
                ? "text-[#94A3B8]"
                : delta >= 0
                  ? "text-[#2563EB]"
                  : "text-[#DC2626]"
            )}
          >
            {hasTrades
              ? `${delta >= 0 ? "+" : "-"}$${Math.abs(delta).toFixed(0)} (${deltaPct >= 0 ? "+" : ""}${deltaPct.toFixed(1)}%)`
              : "Starting balance"}
          </p>
        </div>
      </div>

      <div className="relative h-[220px] lg:h-[260px] w-full">
        {!hasTrades && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 pointer-events-none">
            <div className="h-9 w-9 rounded-full bg-[#2563EB]/10 flex items-center justify-center mb-2.5">
              <TrendingUp className="h-4 w-4 text-[#2563EB]" />
            </div>
            <p className="text-sm font-semibold text-[#0F172A]">
              No equity history yet
            </p>
            <p className="text-[11px] text-[#94A3B8] mt-1">
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
              {/* Same blue as stroke — never a second accent color */}
              <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BRAND} stopOpacity={hasTrades ? 0.16 : 0.04} />
                <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#E2E8F0"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              dy={8}
              hide={!hasTrades}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
              width={56}
              domain={["auto", "auto"]}
            />
            {hasTrades && (
              <Tooltip
                cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#0F172A",
                  background: "#fff",
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
                  ? { r: 4, fill: BRAND, stroke: "#fff", strokeWidth: 2 }
                  : false
              }
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
