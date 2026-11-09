"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { MARKET_PROFILES, RANGE_RESOLUTIONS } from "@/lib/trading"
import { useLogTrade } from "./form-context"
import type { FormState } from "./types"

const FIELDS: Record<
  "LTP" | "ITP" | "STP",
  { profile: keyof FormState; path: keyof FormState }
> = {
  LTP: { profile: "setupType", path: "liquiditySide" },
  ITP: { profile: "setupTypeItp", path: "liquiditySideItp" },
  STP: { profile: "setupTypeStp", path: "liquiditySideStp" },
}

export function IpdaProfilePanel({
  perspective,
}: {
  perspective: "LTP" | "ITP" | "STP"
}) {
  const { formData, handleChange, showWhy } = useLogTrade()
  const [open, setOpen] = React.useState(false)
  const fields = FIELDS[perspective]
  const profile = formData[fields.profile] as string
  const path = formData[fields.path] as string
  const summary = MARKET_PROFILES.find((item) => item.id === profile)?.short

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-transparent p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 text-left"
      >
        <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
          {perspective} IPDA profile
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
            Optional on this perspective. Index futures consolidate about 52% of
            the time and expand about 48%. From consolidation only two things
            happen: breakout, retest, continuation — or AMD.
          </p>
          <div className="flex flex-wrap gap-2">
            {MARKET_PROFILES.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.description}
                onClick={() =>
                  handleChange(
                    fields.profile,
                    profile === item.id ? "" : item.id
                  )
                }
                className={cn(
                  "rounded-lg border px-3 py-2 text-left transition-all",
                  profile === item.id
                    ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <div className="text-[11px] font-bold">{item.short}</div>
                <div
                  className={cn(
                    "text-[9px]",
                    profile === item.id
                      ? "text-blue-100"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </div>
              </button>
            ))}
          </div>
          <p
            className={cn(
              "text-xs leading-relaxed text-muted-foreground",
              !showWhy && "hidden"
            )}
          >
            {profile === "CONSOLIDATION"
              ? "Stay out. Consolidation only leads to expansion, and that is the move you trade."
              : profile === "EXPANSION"
                ? "This is when you are in the market. Trade the expansion."
                : profile === "REVERSAL" || profile === "RETRACEMENT"
                  ? "This follows an expansion. It does not come straight out of consolidation."
                  : "Consolidation always leads to expansion. It never leads to a reversal or a retracement."}
          </p>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
              Out of consolidation
            </span>
            <div className="flex flex-wrap gap-2">
              {RANGE_RESOLUTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  title={item.description}
                  onClick={() =>
                    handleChange(fields.path, path === item.id ? "" : item.id)
                  }
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                    path === item.id
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
              From consolidation only two things: breakout, retest, continuation
              — or AMD. Never consolidation to consolidation.
            </p>
          </div>
        </>
      ) : null}
    </div>
  )
}
