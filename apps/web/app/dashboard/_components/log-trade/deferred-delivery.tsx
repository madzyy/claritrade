"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import {
  DEFERRED_STEPS,
  DEFER_CANDLES,
  OPPOSING_STOPS,
  deferredDefaults,
} from "@/lib/trading"
import { useLogTrade } from "./form-context"
import type { FormState } from "./types"

const FIELDS: Record<
  "LTP" | "ITP" | "STP",
  {
    on: keyof FormState
    steps: keyof FormState
    candle: keyof FormState
    stops: keyof FormState
  }
> = {
  LTP: {
    on: "deferredDelivery",
    steps: "deferredSteps",
    candle: "deferCandle",
    stops: "opposingStops",
  },
  ITP: {
    on: "deferredDeliveryItp",
    steps: "deferredStepsItp",
    candle: "deferCandleItp",
    stops: "opposingStopsItp",
  },
  STP: {
    on: "deferredDeliveryStp",
    steps: "deferredStepsStp",
    candle: "deferCandleStp",
    stops: "opposingStopsStp",
  },
}

export function DeferredDeliveryPanel({
  perspective,
}: {
  perspective: "LTP" | "ITP" | "STP"
}) {
  const { formData, handleChange, setFormData, showWhy } = useLogTrade()
  const [open, setOpen] = React.useState(false)
  const fields = FIELDS[perspective]
  const on = formData[fields.on] as boolean
  const steps = formData[fields.steps] as string[]
  const candle = formData[fields.candle] as string
  const stops = formData[fields.stops] as string
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

  const toggleStep = (id: string) => {
    setFormData((prev) => {
      const list = prev[fields.steps] as string[]
      return {
        ...prev,
        [fields.steps]: list.includes(id)
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
          {perspective} deferred delivery
        </span>
        {on ? (
          <span className="rounded-md bg-[#2563EB] px-1.5 py-0.5 text-[10px] font-semibold text-white">
            This trade
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
            Optional on this perspective. Price leaves the draw, runs opposing
            stops at high resistance liquidity, then continues to the draw.
          </p>
          <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-transparent px-3">
            <input
              type="checkbox"
              checked={on}
              onChange={(e) => {
                const next = e.target.checked
                const defaults = deferredDefaults(bias)
                setFormData((prev) => ({
                  ...prev,
                  [fields.on]: next,
                  ...(next
                    ? {
                        [fields.candle]: defaults.deferCandle,
                        [fields.stops]: defaults.opposingStops,
                      }
                    : { [fields.candle]: "", [fields.stops]: "" }),
                }))
              }}
              className="rounded border-slate-300"
            />
            <span className="text-xs font-bold text-foreground">This trade</span>
          </label>
          {on ? (
            <>
              <div className="flex flex-wrap gap-2">
                {DEFERRED_STEPS.map((step) => {
                  const active = steps.includes(step.id)
                  return (
                    <button
                      key={step.id}
                      type="button"
                      title={step.description}
                      onClick={() => toggleStep(step.id)}
                      className={cn(
                        "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                        active
                          ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                          : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      )}
                    >
                      {step.label}
                    </button>
                  )
                })}
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  Defer candle
                </span>
                <div className="flex flex-wrap gap-2">
                  {DEFER_CANDLES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      title={item.description}
                      onClick={() =>
                        handleChange(
                          fields.candle,
                          candle === item.id ? "" : item.id
                        )
                      }
                      className={cn(
                        "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                        candle === item.id
                          ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                          : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  Opposing liquidity run
                </span>
                <div className="flex flex-wrap gap-2">
                  {OPPOSING_STOPS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      title={item.description}
                      onClick={() =>
                        handleChange(
                          fields.stops,
                          stops === item.id ? "" : item.id
                        )
                      }
                      className={cn(
                        "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                        stops === item.id
                          ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                          : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <p
                className={cn(
                  "text-xs leading-relaxed text-muted-foreground",
                  !showWhy && "hidden"
                )}
              >
                {bias === "BEARISH"
                  ? "Bearish: the lowest down-close at high resistance liquidity defers delivery up into buy stops. Wait for that run, then continue to the draw."
                  : "Bullish: the highest up-close at high resistance liquidity defers delivery down into sell stops. Wait for that run, then continue to the draw."}
              </p>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
