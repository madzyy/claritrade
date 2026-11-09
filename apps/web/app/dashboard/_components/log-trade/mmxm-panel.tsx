"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import {
  IOF_ALIGNMENTS,
  IOF_SIDES,
  MMXM_SEQUENCE,
  MMXM_TYPES,
} from "@/lib/trading"
import { useLogTrade } from "./form-context"
import type { FormState } from "./types"

const FIELDS: Record<
  "LTP" | "ITP" | "STP",
  {
    type: keyof FormState
    side: keyof FormState
    align: keyof FormState
    sequence: keyof FormState
  }
> = {
  LTP: {
    type: "mmxmType",
    side: "iofSide",
    align: "iofAlignment",
    sequence: "mmxmSequence",
  },
  ITP: {
    type: "mmxmTypeItp",
    side: "iofSideItp",
    align: "iofAlignmentItp",
    sequence: "mmxmSequenceItp",
  },
  STP: {
    type: "mmxmTypeStp",
    side: "iofSideStp",
    align: "iofAlignmentStp",
    sequence: "mmxmSequenceStp",
  },
}

export function MmxmPanel({
  perspective,
}: {
  perspective: "LTP" | "ITP" | "STP"
}) {
  const { formData, handleChange, setFormData, showWhy } = useLogTrade()
  const [open, setOpen] = React.useState(false)
  const fields = FIELDS[perspective]
  const type = formData[fields.type] as string
  const side = formData[fields.side] as string
  const align = formData[fields.align] as string
  const sequence = formData[fields.sequence] as string[]
  const summary = MMXM_TYPES.find((item) => item.id === type)?.short

  const toggleStep = (id: string) => {
    setFormData((prev) => {
      const list = prev[fields.sequence] as string[]
      return {
        ...prev,
        [fields.sequence]: list.includes(id)
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
          {perspective} MMXM
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
            Optional on this perspective. Three market-maker models: range high
            to low, ERL to IRL, and LTBH / HTBL. Counter-IOF is advanced.
          </p>
          <div className="flex flex-wrap gap-2">
            {MMXM_TYPES.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.description}
                onClick={() =>
                  handleChange(fields.type, type === item.id ? "" : item.id)
                }
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                  type === item.id
                    ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {IOF_SIDES.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.description}
                onClick={() =>
                  handleChange(fields.side, side === item.id ? "" : item.id)
                }
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                  side === item.id
                    ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {item.label}
              </button>
            ))}
            {IOF_ALIGNMENTS.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.description}
                onClick={() =>
                  handleChange(fields.align, align === item.id ? "" : item.id)
                }
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                  align === item.id
                    ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          {type === "LTBH_HTBL" ? (
            <div className="flex flex-wrap gap-2">
              {MMXM_SEQUENCE.map((item) => {
                const active = sequence.includes(item.id)
                return (
                  <button
                    key={item.id}
                    type="button"
                    title={item.description}
                    onClick={() => toggleStep(item.id)}
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
          ) : null}
          <p
            className={cn(
              "text-xs leading-relaxed",
              align === "COUNTER"
                ? "font-semibold text-[#DC2626]"
                : "text-muted-foreground",
              !showWhy && align !== "COUNTER" && "hidden"
            )}
          >
            {align === "COUNTER"
              ? "Counter IOF. Advanced only. Do not skip the with-flow LTBH/HTBL model to jump here."
              : side === "DOWN"
                ? "IOF down. First rally is the counter-trend leg. High that broke a low, turtle soup, then sell with order flow."
                : "IOF up. First drop is the counter-trend leg — short-term high broken, low that broke a high, turtle soup. Then buy with order flow into the premium key level."}
          </p>
        </>
      ) : null}
    </div>
  )
}
