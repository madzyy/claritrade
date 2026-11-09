"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"
import {
  FIFTY_ROLES,
  RANGE_CONFIRMS,
  RANGE_SEQUENCE,
  RANGE_TYPES,
  calculateRangeMid,
} from "@/lib/trading"
import { useLogTrade } from "./form-context"
import type { FormState } from "./types"

const FIELDS: Record<
  "LTP" | "ITP" | "STP",
  {
    type: keyof FormState
    high: keyof FormState
    low: keyof FormState
    sequence: keyof FormState
    confirms: keyof FormState
    fifty: keyof FormState
    paired: keyof FormState
  }
> = {
  LTP: {
    type: "rangeType",
    high: "swingHigh",
    low: "swingLow",
    sequence: "rangeSequence",
    confirms: "rangeConfirms",
    fifty: "fiftyRole",
    paired: "mssConfirmed",
  },
  ITP: {
    type: "rangeTypeItp",
    high: "swingHighItp",
    low: "swingLowItp",
    sequence: "rangeSequenceItp",
    confirms: "rangeConfirmsItp",
    fifty: "fiftyRoleItp",
    paired: "mssConfirmedItp",
  },
  STP: {
    type: "rangeTypeStp",
    high: "swingHighStp",
    low: "swingLowStp",
    sequence: "rangeSequenceStp",
    confirms: "rangeConfirmsStp",
    fifty: "fiftyRoleStp",
    paired: "mssConfirmedStp",
  },
}

export function RangePanel({
  perspective,
}: {
  perspective: "LTP" | "ITP" | "STP"
}) {
  const { formData, handleChange, setFormData, showWhy, priceDecimals } =
    useLogTrade()
  const [open, setOpen] = React.useState(false)
  const fields = FIELDS[perspective]
  const rangeType = formData[fields.type] as string
  const high = formData[fields.high] as string
  const low = formData[fields.low] as string
  const sequence = formData[fields.sequence] as string[]
  const confirms = formData[fields.confirms] as string[]
  const fifty = formData[fields.fifty] as string
  const paired = formData[fields.paired] as boolean
  const highN = parseFloat(high)
  const lowN = parseFloat(low)
  const mid =
    Number.isNaN(highN) || Number.isNaN(lowN)
      ? null
      : calculateRangeMid(highN, lowN)
  const summary = RANGE_TYPES.find((item) => item.id === rangeType)?.short
  const toggle = (key: keyof FormState, id: string) => {
    setFormData((prev) => {
      const list = prev[key] as string[]
      return {
        ...prev,
        [key]: list.includes(id)
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
          {perspective} range
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
            Optional on this perspective. Structural range or 1 candle. Pair it
            with the key level. Existing range: break into the KL, then attack
            the other side. No range: wait for inducement.
          </p>
          <div className="flex flex-wrap gap-2">
            {RANGE_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                title={type.description}
                onClick={() =>
                  handleChange(fields.type, rangeType === type.id ? "" : type.id)
                }
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                  rangeType === type.id
                    ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-3 sm:gap-3">
            <div className="grid gap-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                Range high
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
              <div className="flex h-9 items-center rounded-lg border border-border bg-transparent px-3 text-xs font-bold text-[#2563EB] tabular-nums">
                {mid != null ? mid.toFixed(priceDecimals) : "—"}
              </div>
            </div>
            <div className="grid gap-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                Range low
              </Label>
              <Input
                value={low}
                onChange={(e) => handleChange(fields.low, e.target.value)}
                className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
              />
            </div>
          </div>
          <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-transparent px-3">
            <input
              type="checkbox"
              checked={paired}
              onChange={(e) => handleChange(fields.paired, e.target.checked)}
              className="rounded border-slate-300"
            />
            <span className="text-xs font-bold text-foreground">
              Paired with HTF KL
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {RANGE_SEQUENCE.map((step) => {
              const active = sequence.includes(step.id)
              return (
                <button
                  key={step.id}
                  type="button"
                  title={step.description}
                  onClick={() => toggle(fields.sequence, step.id)}
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
          <p
            className={cn(
              "text-xs leading-relaxed text-muted-foreground",
              !showWhy && "hidden"
            )}
          >
            {rangeType === "ONE_CANDLE"
              ? "If the next candle closes inside this one, it is a consolidation candle. Then only two outcomes: breakout, retest, continuation — or AMD."
              : "Existing range: break into the KL, then attack the other side. No range: wait for a false high (inducement), mark high and low, then the same attack."}
          </p>
          <div className="flex flex-wrap gap-2">
            {RANGE_CONFIRMS.map((confirm) => {
              const active = confirms.includes(confirm.id)
              return (
                <button
                  key={confirm.id}
                  type="button"
                  title={confirm.description}
                  onClick={() => toggle(fields.confirms, confirm.id)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                    active
                      ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                      : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {confirm.label}
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
            A close back inside the range means the other side gets sought.
            Displacement through 50% says the same. Chop at 50% is accumulation.
          </p>
          <div className="flex flex-wrap gap-2">
            {FIFTY_ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                title={role.description}
                onClick={() =>
                  handleChange(fields.fifty, fifty === role.id ? "" : role.id)
                }
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                  fifty === role.id
                    ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {role.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
