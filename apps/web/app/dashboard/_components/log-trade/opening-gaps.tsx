"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"
import { GAP_FRAMEWORK, GAP_JOBS, OPENING_GAPS } from "@/lib/trading"
import { useLogTrade } from "./form-context"
import type { FormState } from "./types"

const FIELDS: Record<
  "LTP" | "ITP" | "STP",
  {
    gap: keyof FormState
    close: keyof FormState
    open: keyof FormState
    job: keyof FormState
    framework: keyof FormState
    imbalance: keyof FormState
  }
> = {
  LTP: {
    gap: "openingGap",
    close: "gapClose",
    open: "gapOpen",
    job: "gapJob",
    framework: "gapFramework",
    imbalance: "imbalanceType",
  },
  ITP: {
    gap: "openingGapItp",
    close: "gapCloseItp",
    open: "gapOpenItp",
    job: "gapJobItp",
    framework: "gapFrameworkItp",
    imbalance: "imbalanceTypeItp",
  },
  STP: {
    gap: "openingGapStp",
    close: "gapCloseStp",
    open: "gapOpenStp",
    job: "gapJobStp",
    framework: "gapFrameworkStp",
    imbalance: "imbalanceTypeStp",
  },
}

export function OpeningGapsPanel({
  perspective,
}: {
  perspective: "LTP" | "ITP" | "STP"
}) {
  const { formData, handleChange, setFormData, showWhy } = useLogTrade()
  const [open, setOpen] = React.useState(false)
  const fields = FIELDS[perspective]
  const gap = formData[fields.gap] as string
  const gapClose = formData[fields.close] as string
  const gapOpen = formData[fields.open] as string
  const job = formData[fields.job] as string
  const framework = formData[fields.framework] as string[]
  const selected = OPENING_GAPS.find((item) => item.id === gap)

  const toggleFramework = (id: string) => {
    setFormData((prev) => {
      const list = prev[fields.framework] as string[]
      return {
        ...prev,
        [fields.framework]: list.includes(id)
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
          {perspective} opening gaps
        </span>
        {selected ? (
          <span className="rounded-md bg-[#2563EB] px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {selected.short}
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
            Optional on this perspective. NWOG is Friday close to Sunday open.
            NDOG is previous close to the new day&apos;s open. Each gap is a
            draw or a key level.
          </p>
          <div className="flex flex-wrap gap-2">
            {OPENING_GAPS.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.description}
                onClick={() => {
                  const next = gap === item.id ? "" : item.id
                  setFormData((prev) => ({
                    ...prev,
                    [fields.gap]: next,
                    ...(next ? { [fields.imbalance]: next } : {}),
                  }))
                }}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                  gap === item.id
                    ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {item.short}
                <div className="text-[9px] font-semibold text-inherit opacity-70">
                  {item.label}
                </div>
              </button>
            ))}
          </div>
          {selected ? (
            <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
              <div className="grid gap-1">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                  {selected.closeLabel}
                </Label>
                <Input
                  value={gapClose}
                  onChange={(e) => handleChange(fields.close, e.target.value)}
                  className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                  {selected.openLabel}
                </Label>
                <Input
                  value={gapOpen}
                  onChange={(e) => handleChange(fields.open, e.target.value)}
                  className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
                />
              </div>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {GAP_JOBS.map((item) => (
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
            {GAP_FRAMEWORK.map((item) => {
              const active = framework.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  title={item.description}
                  onClick={() => toggleFramework(item.id)}
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
        </>
      ) : null}
    </div>
  )
}
