"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"
import {
  DEALING_DELIVERY,
  DEALING_FORMATIONS,
  DEALING_JOBS,
  calculateRangeMid,
  premiumDiscount,
} from "@/lib/trading"
import { useLogTrade } from "./form-context"
import type { FormState } from "./types"

const FIELDS: Record<
  "LTP" | "ITP" | "STP",
  {
    high: keyof FormState
    low: keyof FormState
    formation: keyof FormState
    jobs: keyof FormState
    delivery: keyof FormState
    ltfIntoKl: keyof FormState
  }
> = {
  LTP: {
    high: "dealingHigh",
    low: "dealingLow",
    formation: "dealingFormation",
    jobs: "dealingJobs",
    delivery: "dealingDelivery",
    ltfIntoKl: "ltfIntoKl",
  },
  ITP: {
    high: "dealingHighItp",
    low: "dealingLowItp",
    formation: "dealingFormationItp",
    jobs: "dealingJobsItp",
    delivery: "dealingDeliveryItp",
    ltfIntoKl: "ltfIntoKlItp",
  },
  STP: {
    high: "dealingHighStp",
    low: "dealingLowStp",
    formation: "dealingFormationStp",
    jobs: "dealingJobsStp",
    delivery: "dealingDeliveryStp",
    ltfIntoKl: "ltfIntoKlStp",
  },
}

export function DealingRangePanel({
  perspective,
}: {
  perspective: "LTP" | "ITP" | "STP"
}) {
  const { formData, handleChange, setFormData, showWhy, priceDecimals } =
    useLogTrade()
  const [open, setOpen] = React.useState(false)
  const fields = FIELDS[perspective]
  const high = formData[fields.high] as string
  const low = formData[fields.low] as string
  const formation = formData[fields.formation] as string
  const jobs = formData[fields.jobs] as string[]
  const delivery = formData[fields.delivery] as string
  const ltfIntoKl = formData[fields.ltfIntoKl] as boolean
  const summary = DEALING_FORMATIONS.find((item) => item.id === formation)?.short
  const highN = parseFloat(high)
  const lowN = parseFloat(low)
  const mid =
    Number.isNaN(highN) || Number.isNaN(lowN)
      ? null
      : calculateRangeMid(highN, lowN)
  const entry = parseFloat(formData.entry)
  const pd =
    Number.isNaN(entry) || Number.isNaN(highN) || Number.isNaN(lowN)
      ? null
      : premiumDiscount(entry, highN, lowN)
  const kl = parseFloat(formData.poiHigh)
  const klPd =
    perspective === "LTP" &&
    !Number.isNaN(kl) &&
    !Number.isNaN(highN) &&
    !Number.isNaN(lowN)
      ? premiumDiscount(kl, highN, lowN)
      : null

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-transparent p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 text-left"
      >
        <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
          {perspective} dealing range
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
            Optional on this perspective. Always buy discount, never buy
            premium. Always sell premium, never sell discount. Run one swing,
            expand through the other, split at 50%.
          </p>
          <div className="flex flex-wrap gap-2">
            {DEALING_FORMATIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.description}
                onClick={() => {
                  const next = formation === item.id ? "" : item.id
                  setFormData((prev) => ({
                    ...prev,
                    [fields.formation]: next,
                    [fields.delivery]: next ? item.delivery : "",
                  }))
                }}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                  formation === item.id
                    ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          {formation === "HIGH_THEN_LOW" ? (
            <p
              className={cn(
                "text-[10px] leading-relaxed text-muted-foreground",
                !showWhy && "hidden"
              )}
            >
              High run, then expansion through a swing low. That expansion leg
              is the bearish range. Split it at 50%.
            </p>
          ) : formation === "LOW_THEN_HIGH" ? (
            <p
              className={cn(
                "text-[10px] leading-relaxed text-muted-foreground",
                !showWhy && "hidden"
              )}
            >
              Low run, then expansion through a swing high. That expansion leg
              is the bullish range. Split it at 50%.
            </p>
          ) : null}
          <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-3">
            <div className="grid gap-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                High
              </Label>
              <Input
                value={high}
                onChange={(e) => handleChange(fields.high, e.target.value)}
                className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
              />
            </div>
            <div className="grid gap-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                50%
              </Label>
              <div className="flex h-9 items-center rounded-lg border border-border bg-transparent px-2 text-xs font-bold text-[#2563EB] tabular-nums">
                {mid != null ? mid.toFixed(priceDecimals) : "—"}
              </div>
            </div>
            <div className="grid gap-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                Low
              </Label>
              <Input
                value={low}
                onChange={(e) => handleChange(fields.low, e.target.value)}
                className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {DEALING_JOBS.map((job) => (
              <button
                key={job.id}
                type="button"
                title={job.description}
                onClick={() => {
                  setFormData((prev) => {
                    const list = prev[fields.jobs] as string[]
                    return {
                      ...prev,
                      [fields.jobs]: list.includes(job.id)
                        ? list.filter((item) => item !== job.id)
                        : [...list, job.id],
                    }
                  })
                }}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                  jobs.includes(job.id)
                    ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {job.label}
              </button>
            ))}
            {DEALING_DELIVERY.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.description}
                onClick={() =>
                  handleChange(
                    fields.delivery,
                    delivery === item.id ? "" : item.id
                  )
                }
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                  delivery === item.id
                    ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleChange(fields.ltfIntoKl, !ltfIntoKl)}
              className={cn(
                "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                ltfIntoKl
                  ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                  : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              LTF into KL in P/D
            </button>
          </div>
          {pd ? (
            <p
              className={cn(
                "text-[10px] leading-relaxed font-semibold",
                (formData.direction === "buy" && pd !== "DISCOUNT") ||
                  (formData.direction === "sell" && pd !== "PREMIUM")
                  ? "text-[#DC2626]"
                  : "text-[#2563EB]"
              )}
            >
              {pd === "EQ"
                ? "Entry is at 50% — equilibrium, not a side."
                : formData.direction === "buy"
                  ? pd === "DISCOUNT"
                    ? "Buying discount."
                    : "Buying premium. Never buy high."
                  : pd === "PREMIUM"
                    ? "Selling premium."
                    : "Selling discount. Never sell low."}
            </p>
          ) : null}
          {klPd ? (
            <p
              className={cn(
                "text-[10px] leading-relaxed text-muted-foreground",
                !showWhy && "hidden"
              )}
            >
              {klPd === "EQ"
                ? "HTF KL sits at 50% of the dealing range."
                : `HTF KL is in ${klPd === "PREMIUM" ? "premium" : "discount"}. Use that array.`}
            </p>
          ) : null}
          {perspective === "LTP" &&
          formData.ltpIof &&
          ((formData.ltpIof === "BEARISH" &&
            (pd === "PREMIUM" || klPd === "PREMIUM")) ||
            (formData.ltpIof === "BULLISH" &&
              (pd === "DISCOUNT" || klPd === "DISCOUNT"))) ? (
            <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
              IOF aligned with premium / discount. Higher probability.
            </p>
          ) : perspective === "LTP" && formData.ltpIof && pd ? (
            <p className="text-[10px] leading-relaxed font-semibold text-[#DC2626]">
              IOF is not aligned with this half of the range.
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
