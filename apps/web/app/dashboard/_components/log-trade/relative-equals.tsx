"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { RELATIVE_LEVELS, RELATIVE_SEQUENCE } from "@/lib/trading"
import { useLogTrade } from "./form-context"
import type { FormState } from "./types"

const FIELDS: Record<
  "LTP" | "ITP" | "STP",
  { levels: keyof FormState; sequence: keyof FormState }
> = {
  LTP: { levels: "relativeLevels", sequence: "relativeSequence" },
  ITP: { levels: "relativeLevelsItp", sequence: "relativeSequenceItp" },
  STP: { levels: "relativeLevelsStp", sequence: "relativeSequenceStp" },
}

export function RelativeEqualsPanel({
  perspective,
}: {
  perspective: "LTP" | "ITP" | "STP"
}) {
  const { formData, setFormData, showWhy } = useLogTrade()
  const [open, setOpen] = React.useState(false)
  const fields = FIELDS[perspective]
  const levels = formData[fields.levels] as string[]
  const sequence = formData[fields.sequence] as string[]
  const summary = RELATIVE_LEVELS.filter((item) => levels.includes(item.id))
    .map((item) => item.short)
    .join(" · ")
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
          {perspective} relative equals
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
            Optional on this perspective. Index futures engineer these every day
            and attack them every day. An A+ is not A+ without relative equal
            highs or lows as the target.
          </p>
          <div className="flex flex-wrap gap-2">
            {RELATIVE_LEVELS.map((item) => {
              const active = levels.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  title={item.description}
                  onClick={() => toggle(fields.levels, item.id)}
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
          <div className="flex flex-wrap gap-2">
            {RELATIVE_SEQUENCE.map((item) => {
              const active = sequence.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  title={item.description}
                  onClick={() => toggle(fields.sequence, item.id)}
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
              ? "Bearish: wait for relative equal highs to get taken, then engage the key level / turtle soup. After the key level, attack relative equal lows."
              : "Bullish: wait for relative equal lows to get taken, then engage the key level / turtle soup. After the key level, attack relative equal highs."}
          </p>
        </>
      ) : null}
    </div>
  )
}
