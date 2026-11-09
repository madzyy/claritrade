"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"
import { INSTITUTIONAL_CHECKS } from "@/lib/trading"
import { useLogTrade, type ToggleListField } from "./form-context"

const FIELD: Record<"LTP" | "ITP" | "STP", ToggleListField> = {
  LTP: "institutionalChecks",
  ITP: "institutionalChecksItp",
  STP: "institutionalChecksStp",
}

export function InstitutionalSponsorship({
  perspective,
  defaultOpen = false,
}: {
  perspective: "LTP" | "ITP" | "STP"
  defaultOpen?: boolean
}) {
  const {
    formData,
    handleChange,
    toggleList,
    showWhy,
    vsOpen,
    klPd,
  } = useLogTrade()
  const [open, setOpen] = React.useState(defaultOpen)
  const field = FIELD[perspective]
  const checks = formData[field]
  const n = checks.length
  const total = INSTITUTIONAL_CHECKS.length
  const done = n >= total

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-transparent p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 text-left"
      >
        <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
          {perspective} sponsorship
        </span>
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
            done
              ? "bg-[#2563EB] text-white"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {n}/{total}
        </span>
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
            Optional on this perspective only. All seven here means {perspective}{" "}
            is sponsored — hold to opposing liquidity on this timeframe.
          </p>
          {perspective === "LTP" ? (
            <>
              <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
                <div className="grid gap-1">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Opening price
                  </Label>
                  <Input
                    value={formData.openingPrice}
                    onChange={(e) =>
                      handleChange("openingPrice", e.target.value)
                    }
                    placeholder="Sell above, buy below"
                    className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
                  />
                </div>
                <div className="flex items-end">
                  <p
                    className={cn(
                      "pb-2 text-xs leading-relaxed font-semibold",
                      vsOpen &&
                        ((formData.direction === "buy" && vsOpen === "above") ||
                          (formData.direction === "sell" &&
                            vsOpen === "below"))
                        ? "text-[#DC2626]"
                        : "text-muted-foreground"
                    )}
                  >
                    {vsOpen == null
                      ? "Sell above the open. Buy below it."
                      : formData.direction === "buy"
                        ? vsOpen === "below"
                          ? "Buying below the open."
                          : "Buying above the open. The rule is buy below."
                        : vsOpen === "above"
                          ? "Selling above the open."
                          : "Selling below the open. The rule is sell above."}
                  </p>
                </div>
              </div>
              {klPd ? (
                <p
                  className={cn(
                    "text-xs leading-relaxed font-semibold",
                    (formData.direction === "sell" && klPd !== "PREMIUM") ||
                      (formData.direction === "buy" && klPd !== "DISCOUNT")
                      ? "text-[#DC2626]"
                      : "text-muted-foreground"
                  )}
                >
                  {klPd === "EQ"
                    ? "HTF KL is at equilibrium."
                    : formData.direction === "sell"
                      ? klPd === "PREMIUM"
                        ? "HTF KL is in premium. That is where you sell."
                        : "HTF KL is in discount. Sell only from premium."
                      : klPd === "DISCOUNT"
                        ? "HTF KL is in discount. That is where you buy."
                        : "HTF KL is in premium. Buy only from discount."}
                </p>
              ) : null}
            </>
          ) : null}
          <div className="flex flex-col gap-2">
            {INSTITUTIONAL_CHECKS.map((check) => {
              const active = checks.includes(check.id)
              return (
                <button
                  key={check.id}
                  type="button"
                  title={check.description}
                  onClick={() => toggleList(field, check.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border px-3 py-2 text-left transition-all",
                    active
                      ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                      : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  <span className="text-[10px] font-black tabular-nums opacity-70">
                    {check.n}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[11px] font-bold">
                      {check.label}
                    </span>
                    <span
                      className={cn(
                        "block text-[10px] leading-relaxed",
                        active ? "text-blue-100" : "text-muted-foreground"
                      )}
                    >
                      {check.description}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
          <p
            className={cn(
              "text-xs leading-relaxed font-semibold",
              done ? "text-[#2563EB]" : "text-muted-foreground"
            )}
          >
            {done
              ? `${n}/${total} — ${perspective} sponsored. Hold to opposing liquidity.`
              : `${n}/${total} — ${perspective} not sponsored until every point is checked.`}
          </p>
        </>
      ) : null}
    </div>
  )
}
