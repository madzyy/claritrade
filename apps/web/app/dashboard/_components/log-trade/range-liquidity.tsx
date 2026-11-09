"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import {
  EXTERNAL_POOLS,
  IMBALANCES,
  RANGE_LIQUIDITY,
} from "@/lib/trading"
import { useLogTrade } from "./form-context"
import type { FormState } from "./types"

const FIELDS: Record<
  "LTP" | "ITP" | "STP",
  {
    location: keyof FormState
    imbalance: keyof FormState
    pool: keyof FormState
  }
> = {
  LTP: {
    location: "rangeLiquidity",
    imbalance: "imbalanceType",
    pool: "externalPool",
  },
  ITP: {
    location: "rangeLiquidityItp",
    imbalance: "imbalanceTypeItp",
    pool: "externalPoolItp",
  },
  STP: {
    location: "rangeLiquidityStp",
    imbalance: "imbalanceTypeStp",
    pool: "externalPoolStp",
  },
}

export function RangeLiquidityPanel({
  perspective,
}: {
  perspective: "LTP" | "ITP" | "STP"
}) {
  const { formData, handleChange, setBias, showWhy } = useLogTrade()
  const [open, setOpen] = React.useState(false)
  const fields = FIELDS[perspective]
  const location = formData[fields.location] as string
  const imbalance = formData[fields.imbalance] as string
  const pool = formData[fields.pool] as string
  const summary = location
    ? RANGE_LIQUIDITY.find((item) => item.id === location)?.short
    : null

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-transparent p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 text-left"
      >
        <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
          {perspective} range liquidity
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
            Optional on this perspective. Rebalance an imbalance, or run an old
            high or low. Internal rotates to external, and back.
          </p>
          <div className="flex flex-wrap gap-2">
            {RANGE_LIQUIDITY.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.description}
                onClick={() => {
                  const next = location === item.id ? "" : item.id
                  handleChange(fields.location, next)
                  if (next !== "INTERNAL") {
                    handleChange(fields.imbalance, "")
                  }
                  if (
                    perspective === "LTP" &&
                    next === "INTERNAL" &&
                    pool === "OLD_HIGH"
                  ) {
                    setBias("BULLISH")
                  }
                  if (
                    perspective === "LTP" &&
                    next === "INTERNAL" &&
                    pool === "OLD_LOW"
                  ) {
                    setBias("BEARISH")
                  }
                }}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                  location === item.id
                    ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          {location === "INTERNAL" ? (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                Imbalance
              </span>
              <div className="flex flex-wrap gap-2">
                {IMBALANCES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    title={item.description}
                    onClick={() =>
                      handleChange(
                        fields.imbalance,
                        imbalance === item.id ? "" : item.id
                      )
                    }
                    className={cn(
                      "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                      imbalance === item.id
                        ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                        : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p
                className={cn(
                  "text-xs leading-relaxed text-muted-foreground",
                  !showWhy && "hidden"
                )}
              >
                Trading into this imbalance, the next candle seeks an old high
                or an old low.
              </p>
            </div>
          ) : null}
          {location ? (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                {location === "INTERNAL"
                  ? "Draw is an old high or low"
                  : "Old high or low that was run"}
              </span>
              <div className="flex flex-wrap gap-2">
                {EXTERNAL_POOLS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    title={item.description}
                    onClick={() => {
                      const next = pool === item.id ? "" : item.id
                      handleChange(fields.pool, next)
                      if (perspective === "LTP" && location === "INTERNAL" && next) {
                        setBias(next === "OLD_HIGH" ? "BULLISH" : "BEARISH")
                      }
                    }}
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
              <p
                className={cn(
                  "text-xs leading-relaxed text-muted-foreground",
                  !showWhy && "hidden"
                )}
              >
                {location === "INTERNAL"
                  ? "An old high sets the next candle up. An old low sets it down."
                  : "That high or low is done. The next candle seeks an FVG."}
              </p>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
