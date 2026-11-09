"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import {
  STRUCTURE_CONTEXT,
  STRUCTURE_JOBS,
  STRUCTURE_POOLS,
} from "@/lib/trading"
import { useLogTrade } from "./form-context"
import type { FormState } from "./types"

const FIELDS: Record<
  "LTP" | "ITP" | "STP",
  {
    pool: keyof FormState
    job: keyof FormState
    context: keyof FormState
  }
> = {
  LTP: {
    pool: "structurePool",
    job: "structureJob",
    context: "structureContext",
  },
  ITP: {
    pool: "structurePoolItp",
    job: "structureJobItp",
    context: "structureContextItp",
  },
  STP: {
    pool: "structurePoolStp",
    job: "structureJobStp",
    context: "structureContextStp",
  },
}

export function StructurePoolsPanel({
  perspective,
}: {
  perspective: "LTP" | "ITP" | "STP"
}) {
  const { formData, handleChange, setFormData, showWhy } = useLogTrade()
  const [open, setOpen] = React.useState(false)
  const fields = FIELDS[perspective]
  const pool = formData[fields.pool] as string
  const job = formData[fields.job] as string
  const context = formData[fields.context] as string[]
  const summary = STRUCTURE_POOLS.find((item) => item.id === pool)?.short
  const bias =
    perspective === "ITP"
      ? formData.mtfBias !== "NONE"
        ? formData.mtfBias
        : formData.htfBias
      : perspective === "STP"
        ? formData.ltfBias !== "NONE"
          ? formData.ltfBias
          : formData.htfBias
        : formData.htfBias

  const toggleContext = (id: string) => {
    setFormData((prev) => {
      const list = prev[fields.context] as string[]
      return {
        ...prev,
        [fields.context]: list.includes(id)
          ? list.filter((item) => item !== id)
          : [...list, id],
      }
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-transparent p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 text-left"
      >
        <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
          {perspective} highs / lows that broke
        </span>
        {summary ? (
          <span className="rounded-md bg-[#2563EB] px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {summary}
          </span>
        ) : (
          <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-secondary-foreground">
            Optional
          </span>
        )}
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open ? (
        <>
          <p
            className={cn(
              "text-xs leading-relaxed text-muted-foreground",
              !showWhy && "hidden"
            )}
          >
            Optional on this perspective. Liquidity lives at these pools because
            that is where retail parks the market-structure-shift stop. Every
            pool has two jobs: a draw on liquidity, and turtle soup.
          </p>
          <div className="flex flex-wrap gap-2">
            {STRUCTURE_POOLS.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.description}
                onClick={() =>
                  handleChange(fields.pool, pool === item.id ? "" : item.id)
                }
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                  pool === item.id
                    ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {STRUCTURE_JOBS.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.description}
                onClick={() =>
                  handleChange(fields.job, job === item.id ? "" : item.id)
                }
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                  job === item.id
                    ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {STRUCTURE_CONTEXT.map((item) => {
              const active = context.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  title={item.description}
                  onClick={() => toggleContext(item.id)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                    active
                      ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                      : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
          <p
            className={cn(
              "text-xs leading-relaxed text-muted-foreground",
              !showWhy && "hidden"
            )}
          >
            {bias === "BEARISH"
              ? "Bearish: a break puts your eye on the high that broke the low. Expect a key level above it and turtle soup / a double purge if that is the reversal."
              : "Bullish: once price hits the HTF key level, look for a low that broke a high and treat it as the draw. Retail thinks that low is the shift."}
          </p>
        </>
      ) : null}
    </div>
  )
}
