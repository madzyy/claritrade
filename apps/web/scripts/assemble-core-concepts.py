from pathlib import Path

root = Path(__file__).resolve().parents[1] / "app/dashboard/_components/log-trade"
body = (root / "_core-body.tsx").read_text(encoding="utf-8")
header = r'''"use client"

import * as React from "react"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"
import {
  BEARISH_CLOSURES,
  BULLISH_CLOSURES,
  CANDLE_ENDS,
  CANDLE_ENTRIES,
  CANDLE_FORMATIONS,
  CANDLE_PATHS,
  CLOSURE_CONTEXT,
  CONSOL_PATHS,
  DEALING_FORMATIONS,
  DEALING_JOBS,
  HTF_KL_CONTEXT,
  HTF_KL_JOBS,
  HTF_KL_PATHS,
  HTF_KL_TYPES,
  KL_RANGE_PAIRS,
  LTP_IOF_CONFIRM,
  LTP_IOF_SIDES,
  RANGE_BUILDS,
  RANGE_TF_TOOLS,
  calculateRangeMid,
  closureBias,
  formationBias,
  ltpIofSignatures,
  premiumDiscount,
} from "@/lib/trading"
import { useLogTrade } from "./form-context"
import {
  CORE_CONCEPTS,
  type FormState,
  type PerspectiveCore,
} from "./types"

const LTP_MIRROR: Partial<Record<keyof PerspectiveCore, keyof FormState>> = {
  candlePath: "candlePath",
  candleFormation: "candleFormation",
  candleEntry: "candleEntry",
  candleEnd: "candleEnd",
  iof: "ltpIof",
  iofChecks: "ltpIofChecks",
  dealingHigh: "dealingHigh",
  dealingLow: "dealingLow",
  dealingFormation: "dealingFormation",
  dealingJobs: "dealingJobs",
  dealingDelivery: "dealingDelivery",
  ltfIntoKl: "ltfIntoKl",
  klPrice: "poiHigh",
  klLow: "poiLow",
  klType: "htfKlType",
  klJob: "htfKlJob",
  klPath: "htfKlPath",
  klContext: "htfKlContext",
  klClose: "htfKlClose",
  klRangePair: "klRangePair",
  swingHigh: "swingHigh",
  swingLow: "swingLow",
  rangeBuild: "rangeBuild",
  rangeTfTools: "rangeTfTools",
  consolPath: "consolPath",
  oneCandleConsol: "oneCandleConsol",
  closeSignatures: "closeSignatures",
  closeContext: "closeContext",
}

const SET_MAP: Record<string, keyof PerspectiveCore> = {
  candlePath: "candlePath",
  candleFormation: "candleFormation",
  candleEntry: "candleEntry",
  candleEnd: "candleEnd",
  dealingHigh: "dealingHigh",
  dealingLow: "dealingLow",
  dealingDelivery: "dealingDelivery",
  dealingJobs: "dealingJobs",
  ltfIntoKl: "ltfIntoKl",
  poiHigh: "klPrice",
  poiLow: "klLow",
  htfKlType: "klType",
  htfKlJob: "klJob",
  htfKlPath: "klPath",
  htfKlClose: "klClose",
  htfKlContext: "klContext",
  klRangePair: "klRangePair",
  rangeBuild: "rangeBuild",
  rangeTfTools: "rangeTfTools",
  consolPath: "consolPath",
  oneCandleConsol: "oneCandleConsol",
  swingHigh: "swingHigh",
  swingLow: "swingLow",
  closeSignatures: "closeSignatures",
  closeContext: "closeContext",
  ltpIofChecks: "iofChecks",
  ltpIof: "iof",
}

function coreFromLtp(form: FormState): PerspectiveCore {
  return {
    candlePath: form.candlePath,
    candleFormation: form.candleFormation,
    candleEntry: form.candleEntry,
    candleEnd: form.candleEnd,
    iof: form.ltpIof,
    iofChecks: form.ltpIofChecks,
    dealingHigh: form.dealingHigh,
    dealingLow: form.dealingLow,
    dealingFormation: form.dealingFormation,
    dealingJobs: form.dealingJobs,
    dealingDelivery: form.dealingDelivery,
    ltfIntoKl: form.ltfIntoKl,
    klPrice: form.poiHigh,
    klLow: form.poiLow,
    klType: form.htfKlType,
    klJob: form.htfKlJob,
    klPath: form.htfKlPath,
    klContext: form.htfKlContext,
    klClose: form.htfKlClose,
    klRangePair: form.klRangePair,
    swingHigh: form.swingHigh,
    swingLow: form.swingLow,
    rangeBuild: form.rangeBuild,
    rangeTfTools: form.rangeTfTools,
    consolPath: form.consolPath,
    oneCandleConsol: form.oneCandleConsol,
    closeSignatures: form.closeSignatures,
    closeContext: form.closeContext,
  }
}

export function CoreConcepts({
  perspective,
}: {
  perspective: "LTP" | "ITP" | "STP"
}) {
  const { formData, setFormData, toggleList, setBias, showWhy, priceDecimals } =
    useLogTrade()
  const activeKey =
    perspective === "LTP"
      ? "coreActiveLtp"
      : perspective === "ITP"
        ? "coreActiveItp"
        : "coreActiveStp"
  const active = formData[activeKey]
  const core: PerspectiveCore =
    perspective === "LTP"
      ? coreFromLtp(formData)
      : perspective === "ITP"
        ? formData.coreItp
        : formData.coreStp

  const patch = (next: Partial<PerspectiveCore>) => {
    setFormData((prev) => {
      if (perspective === "LTP") {
        const mirrored: Partial<FormState> = {}
        for (const [ck, fv] of Object.entries(next)) {
          const mk = LTP_MIRROR[ck as keyof PerspectiveCore]
          if (mk) (mirrored as Record<string, unknown>)[mk] = fv
        }
        return { ...prev, ...mirrored }
      }
      const key = perspective === "ITP" ? "coreItp" : "coreStp"
      return { ...prev, [key]: { ...prev[key], ...next } }
    })
  }

  const setField = (key: string, value: unknown) => {
    const mapped = SET_MAP[key]
    if (mapped) patch({ [mapped]: value } as Partial<PerspectiveCore>)
  }

  const toggleField = (key: string, id: string) => {
    const mapped = SET_MAP[key]
    if (!mapped) return
    const cur = core[mapped]
    if (!Array.isArray(cur)) return
    patch({
      [mapped]: cur.includes(id) ? cur.filter((item) => item !== id) : [...cur, id],
    } as Partial<PerspectiveCore>)
  }

  const anatomyBias = formationBias(core.candleFormation)
  const iofCore =
    ltpIofSignatures(core.iof).filter((check) =>
      core.iofChecks.includes(check.id)
    ).length >= 3
  const closeRead = closureBias(core.closeSignatures)
  const dealingMid = (() => {
    const high = parseFloat(core.dealingHigh)
    const low = parseFloat(core.dealingLow)
    if (Number.isNaN(high) || Number.isNaN(low)) return null
    return calculateRangeMid(high, low)
  })()
  const rangeMid = (() => {
    const high = parseFloat(core.swingHigh)
    const low = parseFloat(core.swingLow)
    if (Number.isNaN(high) || Number.isNaN(low)) return null
    return calculateRangeMid(high, low)
  })()
  const pd = (() => {
    const entry = parseFloat(formData.entry)
    if (Number.isNaN(entry)) return null
    const dHigh = parseFloat(core.dealingHigh)
    const dLow = parseFloat(core.dealingLow)
    if (!Number.isNaN(dHigh) && !Number.isNaN(dLow)) {
      return premiumDiscount(entry, dHigh, dLow)
    }
    const rHigh = parseFloat(core.swingHigh)
    const rLow = parseFloat(core.swingLow)
    if (!Number.isNaN(rHigh) && !Number.isNaN(rLow)) {
      return premiumDiscount(entry, rHigh, rLow)
    }
    return null
  })()
  const klPd = (() => {
    const kl = parseFloat(core.klPrice)
    if (Number.isNaN(kl)) return null
    const dHigh = parseFloat(core.dealingHigh)
    const dLow = parseFloat(core.dealingLow)
    if (!Number.isNaN(dHigh) && !Number.isNaN(dLow)) {
      return premiumDiscount(kl, dHigh, dLow)
    }
    const rHigh = parseFloat(core.swingHigh)
    const rLow = parseFloat(core.swingLow)
    if (!Number.isNaN(rHigh) && !Number.isNaN(rLow)) {
      return premiumDiscount(kl, rHigh, rLow)
    }
    return null
  })()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {CORE_CONCEPTS.map((item) => {
          const on = active.includes(item.id)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleList(activeKey, item.id)}
              className={cn(
                "h-8 rounded-md px-2.5 text-[11px] font-semibold transition-colors",
                on
                  ? "bg-[#2563EB] text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>
'''
footer = r'''
    </div>
  )
}
'''
# setBias only on LTP
body = body.replace(
    "if (nextBias) setBias(nextBias)",
    "if (nextBias && perspective === \"LTP\") setBias(nextBias)",
)
(root / "core-concepts.tsx").write_text(header + body + footer, encoding="utf-8")
print("assembled core-concepts", (root / "core-concepts.tsx").stat().st_size)
