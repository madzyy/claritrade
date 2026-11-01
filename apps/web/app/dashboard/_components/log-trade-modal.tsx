"use client"

import * as React from "react"
import {
  Plus,
  X,
  Info,
  Camera,
  Loader2,
  Layers,
  Clock,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"
import { logTrade } from "../../actions/trades"
import { getActiveJournalBalanceAction } from "@/app/actions/journals"
import { toast } from "sonner"
import {
  BIAS_OPTIONS,
  CONFLUENCE_TAGS,
  EXTERNAL_POOLS,
  HTF_TIMEFRAMES,
  IMBALANCES,
  INSTRUMENT_OPTIONS,
  KILLZONES,
  LTF_TIMEFRAMES,
  DEALING_FORMATIONS,
  DEFERRED_STEPS,
  DEFER_CANDLES,
  FIFTY_ROLES,
  MARKET_PROFILES,
  MTF_TIMEFRAMES,
  OPPOSING_STOPS,
  RANGE_CONFIRMS,
  RANGE_LIQUIDITY,
  RANGE_RESOLUTIONS,
  RANGE_SEQUENCE,
  RANGE_TYPES,
  biasLabel,
  deferredDefaults,
  deferredTagsFor,
  calculateLotSize,
  calculateRangeMid,
  calculateTradeMetrics,
  premiumDiscount,
  detectKillzone,
  formatSessionWindow,
  getInstrumentSpec,
  getNyParts,
  killzoneLabel,
  liquidityTagsFor,
  profileShort,
  rangeLiquidityShort,
  rangeTagsFor,
  resolveRiskDollars,
  stripLiquidityTags,
  type KillzoneId,
  type TradeDirection,
} from "@/lib/trading"

const JOURNAL_INSTRUMENTS = [
  ...INSTRUMENT_OPTIONS.filter(
    (inst) =>
      inst.symbol === "NQ" || inst.symbol === "MNQ" || inst.symbol === "NAS100"
  ),
  ...INSTRUMENT_OPTIONS.filter(
    (inst) =>
      inst.symbol !== "NQ" && inst.symbol !== "MNQ" && inst.symbol !== "NAS100"
  ),
]

type FormState = {
  pair: string
  direction: TradeDirection
  entry: string
  exit: string
  stopLoss: string
  takeProfit: string
  lotSize: string
  risk: string
  riskType: "percent" | "amount"
  accountBalance: string
  psychologyNote: string
  tags: string[]
  setupType: string
  poiHigh: string
  poiLow: string
  swingHigh: string
  swingLow: string
  liquiditySide: string
  liquidityTaken: boolean
  mssConfirmed: boolean
  htfTimeframe: string
  htfBias: string
  htfNarrative: string
  mtfTimeframe: string
  mtfNarrative: string
  ltfTimeframe: string
  entryModel: string
  dateOpenedLocal: string
  killzone: string
  rangeLiquidity: string
  imbalanceType: string
  externalPool: string
  rangeType: string
  rangeSequence: string[]
  fiftyRole: string
  dealingHigh: string
  dealingLow: string
  dealingFormation: string
  rangeConfirms: string[]
  deferredDelivery: boolean
  deferredSteps: string[]
  deferCandle: string
  opposingStops: string
}

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const initialForm = (): FormState => {
  const now = new Date()
  return {
    pair: "NQ",
    direction: "buy",
    entry: "",
    exit: "",
    stopLoss: "",
    takeProfit: "",
    lotSize: "",
    risk: "1",
    riskType: "percent",
    accountBalance: "",
    psychologyNote: "",
    tags: [],
    setupType: "",
    poiHigh: "",
    poiLow: "",
    swingHigh: "",
    swingLow: "",
    liquiditySide: "",
    liquidityTaken: false,
    mssConfirmed: false,
    htfTimeframe: "H4",
    htfBias: "BULLISH",
    htfNarrative: "",
    mtfTimeframe: "M15",
    mtfNarrative: "",
    ltfTimeframe: "M1",
    entryModel: "",
    dateOpenedLocal: toLocalInputValue(now),
    // Manual — journaling often happens after the session
    killzone: "",
    rangeLiquidity: "",
    imbalanceType: "",
    externalPool: "",
    rangeType: "",
    rangeSequence: [],
    fiftyRole: "FIRST_TARGET",
    dealingHigh: "",
    dealingLow: "",
    dealingFormation: "",
    rangeConfirms: [],
    deferredDelivery: false,
    deferredSteps: [],
    deferCandle: "",
    opposingStops: "",
  }
}

export function LogTradeModal() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState<FormState>(initialForm)
  const [screenshots, setScreenshots] = React.useState<File[]>([])
  const [lotManual, setLotManual] = React.useState(false)
  const [journalName, setJournalName] = React.useState<string | null>(null)
  const [balanceLoading, setBalanceLoading] = React.useState(false)

  const loadJournalBalance = React.useCallback(async () => {
    setBalanceLoading(true)
    const res = await getActiveJournalBalanceAction()
    setBalanceLoading(false)
    if (res.success && res.currentBalance != null) {
      setJournalName(res.journalName ?? null)
      setFormData((prev) => ({
        ...prev,
        accountBalance: String(
          Math.round(res.currentBalance! * 100) / 100
        ),
      }))
    } else {
      toast.error(res.error ?? "Could not load journal balance")
    }
  }, [])

  const openedAt = React.useMemo(() => {
    const d = new Date(formData.dateOpenedLocal)
    return Number.isNaN(d.getTime()) ? new Date() : d
  }, [formData.dateOpenedLocal])

  const ny = React.useMemo(() => getNyParts(openedAt), [openedAt])
  // Hint only — never overwrites the trader's killzone choice
  const suggestedKz = React.useMemo(() => detectKillzone(openedAt), [openedAt])
  const selectedKzLabel = formData.killzone
    ? killzoneLabel(formData.killzone)
    : null

  const rangeMid = React.useMemo(() => {
    const high = parseFloat(formData.swingHigh)
    const low = parseFloat(formData.swingLow)
    if (Number.isNaN(high) || Number.isNaN(low)) return null
    return calculateRangeMid(high, low)
  }, [formData.swingHigh, formData.swingLow])

  const dealingMid = React.useMemo(() => {
    const high = parseFloat(formData.dealingHigh)
    const low = parseFloat(formData.dealingLow)
    if (Number.isNaN(high) || Number.isNaN(low)) return null
    return calculateRangeMid(high, low)
  }, [formData.dealingHigh, formData.dealingLow])

  const pd = React.useMemo(() => {
    const entry = parseFloat(formData.entry)
    if (Number.isNaN(entry)) return null
    const dHigh = parseFloat(formData.dealingHigh)
    const dLow = parseFloat(formData.dealingLow)
    if (!Number.isNaN(dHigh) && !Number.isNaN(dLow)) {
      return premiumDiscount(entry, dHigh, dLow)
    }
    const rHigh = parseFloat(formData.swingHigh)
    const rLow = parseFloat(formData.swingLow)
    if (!Number.isNaN(rHigh) && !Number.isNaN(rLow)) {
      return premiumDiscount(entry, rHigh, rLow)
    }
    return null
  }, [
    formData.entry,
    formData.dealingHigh,
    formData.dealingLow,
    formData.swingHigh,
    formData.swingLow,
  ])

  const priceDecimals = getInstrumentSpec(formData.pair).decimals

  const preview = React.useMemo(() => {
    const entry = parseFloat(formData.entry)
    const stopLoss = parseFloat(formData.stopLoss)
    const takeProfit = formData.takeProfit ? parseFloat(formData.takeProfit) : null
    const exit = formData.exit ? parseFloat(formData.exit) : null
    const lotSize = parseFloat(formData.lotSize)
    if (
      Number.isNaN(entry) ||
      Number.isNaN(stopLoss) ||
      Number.isNaN(lotSize) ||
      !formData.pair
    ) {
      return null
    }
    return calculateTradeMetrics({
      pair: formData.pair,
      direction: formData.direction,
      entry,
      stopLoss,
      takeProfit,
      exit,
      lotSize,
    })
  }, [formData])

  // Auto lot size
  React.useEffect(() => {
    if (lotManual) return
    const entry = parseFloat(formData.entry)
    const sl = parseFloat(formData.stopLoss)
    const riskVal = parseFloat(formData.risk)
    const balance = parseFloat(formData.accountBalance)
    if (
      Number.isNaN(entry) ||
      Number.isNaN(sl) ||
      Number.isNaN(riskVal) ||
      Number.isNaN(balance) ||
      entry === sl ||
      !formData.pair
    ) {
      return
    }
    const riskAmount = resolveRiskDollars({
      balance,
      riskValue: riskVal,
      riskType: formData.riskType,
    })
    const lots = calculateLotSize({
      pair: formData.pair,
      entry,
      stopLoss: sl,
      riskAmount,
    })
    if (lots != null && lots > 0 && lots < 1000) {
      setFormData((prev) => ({ ...prev, lotSize: lots.toFixed(2) }))
    }
  }, [
    formData.entry,
    formData.stopLoss,
    formData.risk,
    formData.riskType,
    formData.accountBalance,
    formData.pair,
    lotManual,
  ])

  const uploadScreenshots = async () => {
    const supabase = createClient()
    const urls: string[] = []
    for (const file of screenshots) {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`
      const { data, error } = await supabase.storage
        .from("trade-screenshots")
        .upload(fileName, file)

      if (data) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("trade-screenshots").getPublicUrl(data.path)
        urls.push(publicUrl)
      } else {
        console.error("Upload error:", error)
      }
    }
    return urls
  }

  const handleSubmit = async () => {
    if (!formData.killzone) {
      toast.error("Select a session", {
        description: "Pick the session you traded.",
      })
      return
    }
    if (!formData.setupType) {
      toast.error("Profile the market", {
        description:
          "Choose consolidation, expansion, reversal, or retracement.",
      })
      return
    }
    if (!formData.rangeLiquidity) {
      toast.error("Name the range liquidity", {
        description:
          "Price is either in an imbalance or at an old high or low.",
      })
      return
    }
    if (formData.rangeLiquidity === "INTERNAL" && !formData.imbalanceType) {
      toast.error("Name the imbalance", {
        description:
          "FVG, volume imbalance, new week opening gap, or new day opening gap.",
      })
      return
    }
    if (!formData.externalPool) {
      toast.error(
        formData.rangeLiquidity === "INTERNAL"
          ? "Name the old high or low"
          : "Which high or low was run?",
        {
          description:
            formData.rangeLiquidity === "INTERNAL"
              ? "From an imbalance, the next candle seeks an old high or an old low."
              : "After an old high or low is run, the next candle seeks an FVG.",
        }
      )
      return
    }
    if (!formData.rangeType) {
      toast.error("Name the range", {
        description: "Structural range or 1 candle range.",
      })
      return
    }
    const rangeHigh = parseFloat(formData.swingHigh)
    const rangeLow = parseFloat(formData.swingLow)
    if (
      Number.isNaN(rangeHigh) ||
      Number.isNaN(rangeLow) ||
      rangeHigh <= rangeLow
    ) {
      toast.error("Mark the three levels", {
        description: "Range high has to sit above range low. 50% fills in.",
      })
      return
    }
    const {
      rangeLiquidity,
      imbalanceType,
      externalPool,
      rangeType,
      rangeSequence,
      fiftyRole,
      dealingHigh,
      dealingLow,
      dealingFormation,
      rangeConfirms,
      deferredDelivery,
      deferredSteps,
      deferCandle,
      opposingStops,
      tags,
      ...tradeFields
    } = formData
    const nextTags = [
      ...stripLiquidityTags(tags),
      ...liquidityTagsFor({ rangeLiquidity, imbalanceType, externalPool }),
      ...rangeTagsFor({
        rangeType,
        rangeSequence,
        fiftyRole,
        pairedWithHtfKl: formData.mssConfirmed,
        dealingFormation,
        rangeConfirms,
        premiumDiscount: pd,
        dealingHigh,
        dealingLow,
      }),
      ...deferredTagsFor({
        deferred: deferredDelivery,
        deferredSteps,
        deferCandle,
        opposingStops,
      }),
    ]
    setIsSubmitting(true)
    try {
      const screenshotUrls = await uploadScreenshots()
      const result = await logTrade({
        ...tradeFields,
        poiLow: formData.poiLow || dealingLow || null,
        tags: nextTags,
        screenshotUrls,
        dateOpened: openedAt.toISOString(),
        killzone: formData.killzone as KillzoneId,
      })
      setIsSubmitting(false)
      if (result.success) {
        setIsOpen(false)
        setScreenshots([])
        setLotManual(false)
        const preserved = {
          risk: formData.risk,
          riskType: formData.riskType,
          htfTimeframe: formData.htfTimeframe,
          mtfTimeframe: formData.mtfTimeframe,
          ltfTimeframe: formData.ltfTimeframe,
        }
        setFormData({ ...initialForm(), ...preserved })
        toast.success("Trade logged", {
          description: `${formData.pair} ${formData.direction.toUpperCase()} · ${biasLabel(formData.htfBias)} · ${rangeLiquidityShort(nextTags) || profileShort(formData.setupType)}`,
        })
      } else {
        toast.error("Failed to log trade", { description: result.error })
      }
    } catch (error) {
      console.error("Submit error:", error)
      setIsSubmitting(false)
      toast.error("An error occurred", {
        description: "Failed to log trade. Please try again.",
      })
    }
  }

  const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const toggleRangeStep = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      rangeSequence: prev.rangeSequence.includes(id)
        ? prev.rangeSequence.filter((step) => step !== id)
        : [...prev.rangeSequence, id],
    }))
  }

  const toggleRangeConfirm = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      rangeConfirms: prev.rangeConfirms.includes(id)
        ? prev.rangeConfirms.filter((step) => step !== id)
        : [...prev.rangeConfirms, id],
    }))
  }

  const toggleDeferredStep = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      deferredSteps: prev.deferredSteps.includes(id)
        ? prev.deferredSteps.filter((step) => step !== id)
        : [...prev.deferredSteps, id],
    }))
  }

  const setBias = (bias: string) => {
    setFormData((prev) => {
      if (!prev.deferredDelivery) {
        return { ...prev, htfBias: bias }
      }
      return { ...prev, htfBias: bias, ...deferredDefaults(bias) }
    })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (open) {
          const next = initialForm()
          setFormData((prev) => ({
            ...next,
            risk: prev.risk || next.risk,
            riskType: prev.riskType,
          }))
          setLotManual(false)
          void loadJournalBalance()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-none gap-2 px-5 h-10 rounded-xl font-bold transition-all active:scale-95">
          <Plus className="h-4 w-4 stroke-[3px]" />
          Log Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[760px] p-0 overflow-hidden border border-slate-200 rounded-[24px] shadow-none bg-white">
        <div className="flex flex-col h-full max-h-[90vh]">
          <div className="p-6 pb-0 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-[#1E293B]">Log trade</h2>
                <Badge className="bg-[#2563EB]/10 text-[#2563EB] border-none px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  LTP · ITP · STP
                </Badge>
              </div>
            </div>

            {/* NY clock + killzone context (suggestion only) */}
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <Clock className="h-4 w-4 text-[#2563EB]" />
              <div className="flex min-w-0 flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Entry in New York ({ny.offsetLabel})
                </span>
                <span className="text-sm font-bold text-[#1E293B]">
                  {ny.dateLabel} · {ny.timeLabel} NY
                </span>
              </div>
              <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                {selectedKzLabel ? (
                  <Badge className="border-none bg-[#2563EB] text-white text-[10px] font-bold">
                    {selectedKzLabel}
                  </Badge>
                ) : (
                  <Badge className="border-none bg-slate-200 text-slate-600 text-[10px] font-bold">
                    Select session
                  </Badge>
                )}
                {formData.killzone !== suggestedKz.id && (
                  <button
                    type="button"
                    onClick={() => handleChange("killzone", suggestedKz.id)}
                    className="text-[10px] font-semibold text-[#2563EB] underline-offset-2 hover:underline"
                  >
                    Use {suggestedKz.label} from entry time
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 pt-2 flex flex-col gap-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {/* Risk */}
            <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-100 grid grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                  Account Balance ($)
                </Label>
                <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 font-bold tabular-nums text-[#1E293B] dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
                  {balanceLoading
                    ? "Loading…"
                    : formData.accountBalance
                      ? `$${Number(formData.accountBalance).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : "—"}
                </div>
                <p className="text-[10px] text-slate-400">
                  From {journalName ?? "active journal"} · updates with closed
                  P&amp;L
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                    Risk
                  </Label>
                  <div className="flex bg-slate-200 p-0.5 rounded-md scale-90 origin-right">
                    <button
                      type="button"
                      onClick={() => handleChange("riskType", "percent")}
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-bold rounded-sm transition-all",
                        formData.riskType === "percent"
                          ? "bg-white text-[#2563EB]"
                          : "text-[#64748B]"
                      )}
                    >
                      %
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange("riskType", "amount")}
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-bold rounded-sm transition-all",
                        formData.riskType === "amount"
                          ? "bg-white text-[#2563EB]"
                          : "text-[#64748B]"
                      )}
                    >
                      $
                    </button>
                  </div>
                </div>
                <Input
                  value={formData.risk}
                  onChange={(e) => handleChange("risk", e.target.value)}
                  className="h-10 border-slate-200 bg-white rounded-lg font-bold text-[#1E293B] shadow-none"
                />
              </div>
            </div>

            {/* Core execution */}
            <section className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                  Instrument
                </Label>
                <Select
                  value={formData.pair}
                  onValueChange={(v) => handleChange("pair", v)}
                >
                  <SelectTrigger className="h-11 border-slate-200 bg-[#F8FAFC] rounded-lg font-bold text-[#1E293B]">
                    <SelectValue placeholder="Select Pair" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {JOURNAL_INSTRUMENTS.map((inst) => (
                      <SelectItem key={inst.symbol} value={inst.symbol}>
                        {inst.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                  Direction
                </Label>
                <Select
                  value={formData.direction}
                  onValueChange={(v) =>
                    handleChange("direction", v as TradeDirection)
                  }
                >
                  <SelectTrigger className="h-11 border-slate-200 bg-[#F8FAFC] rounded-lg font-semibold text-[#1E293B]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy (Long)</SelectItem>
                    <SelectItem value="sell">Sell (Short)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                  Entry (NY local)
                </Label>
                <Input
                  type="datetime-local"
                  value={formData.dateOpenedLocal}
                  onChange={(e) => handleChange("dateOpenedLocal", e.target.value)}
                  className="h-11 border-slate-200 bg-[#F8FAFC] rounded-lg font-semibold text-[#1E293B]"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                  Session <span className="text-[#2563EB]">*</span>
                </Label>
                <Select
                  value={formData.killzone || undefined}
                  onValueChange={(v) => handleChange("killzone", v)}
                >
                  <SelectTrigger className="h-11 border-slate-200 bg-[#F8FAFC] rounded-lg font-semibold text-[#1E293B]">
                    <SelectValue placeholder="Which session did you execute in?" />
                  </SelectTrigger>
                  <SelectContent>
                    {KILLZONES.map((kz) => (
                      <SelectItem key={kz.id} value={kz.id}>
                        {kz.label} ({formatSessionWindow(kz)})
                      </SelectItem>
                    ))}
                    <SelectItem value="OUTSIDE">Outside session</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                  Entry Price
                </Label>
                <Input
                  value={formData.entry}
                  onChange={(e) => handleChange("entry", e.target.value)}
                  className="h-11 border-slate-200 bg-[#F8FAFC] rounded-lg font-semibold"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                  Exit Price
                </Label>
                <Input
                  value={formData.exit}
                  onChange={(e) => handleChange("exit", e.target.value)}
                  className="h-11 border-slate-200 bg-[#F8FAFC] rounded-lg font-semibold"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                  Stop Loss
                </Label>
                <Input
                  value={formData.stopLoss}
                  onChange={(e) => handleChange("stopLoss", e.target.value)}
                  className="h-11 border-slate-200 bg-[#F8FAFC] rounded-lg font-semibold"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                  Take Profit
                </Label>
                <Input
                  value={formData.takeProfit}
                  onChange={(e) => handleChange("takeProfit", e.target.value)}
                  className="h-11 border-slate-200 bg-[#F8FAFC] rounded-lg font-semibold"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                    {getInstrumentSpec(formData.pair).category === "index"
                      ? "Contracts"
                      : "Lot Size"}
                  </Label>
                  {!lotManual && (
                    <Badge className="bg-[#2563EB]/10 text-[#2563EB] border-none text-[8px] px-1 py-0 font-black uppercase">
                      Auto
                    </Badge>
                  )}
                </div>
                <Input
                  value={formData.lotSize}
                  onChange={(e) => {
                    setLotManual(true)
                    handleChange("lotSize", e.target.value)
                  }}
                  className="h-11 border-slate-200 bg-[#F8FAFC] rounded-lg font-bold text-[#2563EB]"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                  Live Metrics
                </Label>
                <div className="h-11 flex items-center gap-3 rounded-lg border border-slate-100 bg-white px-3 text-xs font-bold text-slate-600">
                  <span>
                    RR{" "}
                    <span className="text-[#2563EB]">
                      {preview?.plannedRr?.toFixed(2) ?? "—"}
                    </span>
                  </span>
                  <span>
                    R{" "}
                    <span className="text-[#2563EB]">
                      {preview?.rMultiple != null
                        ? `${preview.rMultiple >= 0 ? "+" : ""}${preview.rMultiple.toFixed(2)}`
                        : "—"}
                    </span>
                  </span>
                  <span>
                    P&L{" "}
                    <span
                      className={
                        (preview?.result ?? 0) >= 0
                          ? "text-[#2563EB]"
                          : "text-[#DC2626]"
                      }
                    >
                      {preview?.result != null
                        ? `${preview.result >= 0 ? "+" : "-"}$${Math.abs(preview.result).toFixed(2)}`
                        : "—"}
                    </span>
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#2563EB]" />
                  <span className="text-sm font-bold text-[#1E293B]">
                    LTP · ITP · STP
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-500">
                  Long term calls the next higher-timeframe candle from internal
                  and external range liquidity. Intermediate is the range you
                  trade: high, low, and 50%. Short term starts by profiling
                  into the 9:30 equity open.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    LTP
                  </span>
                  <Select
                    value={formData.htfTimeframe}
                    onValueChange={(v) => handleChange("htfTimeframe", v)}
                  >
                    <SelectTrigger className="h-9 bg-white border-slate-200 text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HTF_TIMEFRAMES.map((tf) => (
                        <SelectItem key={tf} value={tf}>
                          {tf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.htfBias}
                    onValueChange={setBias}
                  >
                    <SelectTrigger className="h-9 bg-white border-slate-200 text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BIAS_OPTIONS.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    value={formData.htfNarrative}
                    onChange={(e) => handleChange("htfNarrative", e.target.value)}
                    placeholder="The next candle points at an old high or low, or back at an FVG."
                    className="min-h-[72px] text-xs bg-white border-slate-200 resize-none"
                  />
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    ITP
                  </span>
                  <Select
                    value={formData.mtfTimeframe}
                    onValueChange={(v) => handleChange("mtfTimeframe", v)}
                  >
                    <SelectTrigger className="h-9 bg-white border-slate-200 text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MTF_TIMEFRAMES.map((tf) => (
                        <SelectItem key={tf} value={tf}>
                          {tf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    value={formData.mtfNarrative}
                    onChange={(e) => handleChange("mtfNarrative", e.target.value)}
                    placeholder="Path to the draw. Note if delivery deferred into opposing stops first."
                    className="min-h-[108px] text-xs bg-white border-slate-200 resize-none"
                  />
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    STP
                  </span>
                  <Select
                    value={formData.ltfTimeframe}
                    onValueChange={(v) => handleChange("ltfTimeframe", v)}
                  >
                    <SelectTrigger className="h-9 bg-white border-slate-200 text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LTF_TIMEFRAMES.map((tf) => (
                        <SelectItem key={tf} value={tf}>
                          {tf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    value={formData.entryModel}
                    onChange={(e) => handleChange("entryModel", e.target.value)}
                    placeholder="Signature, confirmation, deferred delivery if it ran opposing stops first."
                    className="min-h-[108px] text-xs bg-white border-slate-200 resize-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#94A3B8]">
                    Dealing range
                  </span>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Pair the inner range with a dealing range. It forms when
                    price breaks a high then immediately breaks a low and
                    expands, or the other way. Draw premium / discount on it:
                    sell only in premium, buy only in discount. If an FVG or
                    other key level sits inside it, mark it and run the same
                    inducement sequence.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {DEALING_FORMATIONS.map((formation) => (
                    <button
                      key={formation.id}
                      type="button"
                      title={formation.description}
                      onClick={() =>
                        handleChange(
                          "dealingFormation",
                          formData.dealingFormation === formation.id
                            ? ""
                            : formation.id
                        )
                      }
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition-all",
                        formData.dealingFormation === formation.id
                          ? "border-[#2563EB] bg-[#2563EB] text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {formation.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-1">
                    <Label className="text-[10px] font-bold uppercase text-[#94A3B8]">
                      Dealing high
                    </Label>
                    <Input
                      value={formData.dealingHigh}
                      onChange={(e) =>
                        handleChange("dealingHigh", e.target.value)
                      }
                      className="h-9 bg-white border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-[10px] font-bold uppercase text-[#94A3B8]">
                      EQ / 50%
                    </Label>
                    <div className="h-9 flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold tabular-nums text-[#2563EB]">
                      {dealingMid != null
                        ? dealingMid.toFixed(priceDecimals)
                        : "—"}
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-[10px] font-bold uppercase text-[#94A3B8]">
                      Dealing low
                    </Label>
                    <Input
                      value={formData.dealingLow}
                      onChange={(e) =>
                        handleChange("dealingLow", e.target.value)
                      }
                      className="h-9 bg-white border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>
                {pd ? (
                  <p
                    className={cn(
                      "text-xs font-semibold leading-relaxed",
                      (formData.direction === "buy" && pd === "PREMIUM") ||
                        (formData.direction === "sell" && pd === "DISCOUNT")
                        ? "text-[#DC2626]"
                        : "text-slate-600"
                    )}
                  >
                    {pd === "EQ"
                      ? "Entry is at equilibrium of the dealing range."
                      : formData.direction === "buy"
                        ? pd === "DISCOUNT"
                          ? "Buying in discount."
                          : "Buying in premium. The rule is buy only in discount."
                        : pd === "PREMIUM"
                          ? "Selling in premium."
                          : "Selling in discount. The rule is sell only in premium."}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#94A3B8]">
                    The range
                  </span>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Always trade a range. Three levels: high, 50%, low. When
                    bullish, sell stops to buy stops. When bearish, sell the
                    range high — do not buy it. 50% is the first target, and
                    50% is continuation if price breaks through. The other side
                    of the range is then the draw on liquidity.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {RANGE_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      title={type.description}
                      onClick={() => handleChange("rangeType", type.id)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition-all",
                        formData.rangeType === type.id
                          ? "border-[#2563EB] bg-[#2563EB] text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-1">
                    <Label className="text-[10px] font-bold uppercase text-[#94A3B8]">
                      Range high
                    </Label>
                    <Input
                      value={formData.swingHigh}
                      onChange={(e) =>
                        handleChange("swingHigh", e.target.value)
                      }
                      className="h-9 bg-white border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-[10px] font-bold uppercase text-[#94A3B8]">
                      50%
                    </Label>
                    <div className="h-9 flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold tabular-nums text-[#2563EB]">
                      {rangeMid != null ? rangeMid.toFixed(priceDecimals) : "—"}
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-[10px] font-bold uppercase text-[#94A3B8]">
                      Range low
                    </Label>
                    <Input
                      value={formData.swingLow}
                      onChange={(e) => handleChange("swingLow", e.target.value)}
                      className="h-9 bg-white border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1">
                    <Label className="text-[10px] font-bold uppercase text-[#94A3B8]">
                      HTF key level
                    </Label>
                    <Input
                      value={formData.poiHigh}
                      onChange={(e) => handleChange("poiHigh", e.target.value)}
                      placeholder="Pair the range with this KL"
                      className="h-9 bg-white border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <label className="flex items-center gap-2 h-9 mt-5 px-3 rounded-lg border border-slate-200 bg-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.mssConfirmed}
                      onChange={(e) =>
                        handleChange("mssConfirmed", e.target.checked)
                      }
                      className="rounded border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700">
                      Paired with HTF KL
                    </span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {RANGE_SEQUENCE.map((step) => {
                    const active = formData.rangeSequence.includes(step.id)
                    return (
                      <button
                        key={step.id}
                        type="button"
                        title={step.description}
                        onClick={() => toggleRangeStep(step.id)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition-all",
                          active
                            ? "border-[#2563EB] bg-[#2563EB] text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        {step.label}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs leading-relaxed text-slate-500">
                  {formData.rangeType === "ONE_CANDLE"
                    ? "Candle closes near the key level: that high and low are the range. The next candle tags the KL and closes back inside (turtle soup). The other side of the range is the draw on liquidity."
                    : "Leg almost at the key level, then a retrace: mark high and low. That retrace was inducement. Wait for the break of the range into the key level, then the break back into the range. Enter there. 50% and the other side of the range are the draw."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {RANGE_CONFIRMS.map((confirm) => {
                    const active = formData.rangeConfirms.includes(confirm.id)
                    return (
                      <button
                        key={confirm.id}
                        type="button"
                        title={confirm.description}
                        onClick={() => toggleRangeConfirm(confirm.id)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition-all",
                          active
                            ? "border-[#2563EB] bg-[#2563EB] text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        {confirm.label}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs leading-relaxed text-slate-500">
                  A close back inside the range means the other side gets
                  sought. Displacement through 50% says the same. Chop at 50%
                  is accumulation: when it continues, it often hits the other
                  side with more volatility. Drop a timeframe and look for
                  CISD.
                </p>
                <div className="flex flex-wrap gap-2">
                  {FIFTY_ROLES.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      title={role.description}
                      onClick={() => handleChange("fiftyRole", role.id)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition-all",
                        formData.fiftyRole === role.id
                          ? "border-[#2563EB] bg-[#2563EB] text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  {formData.htfBias === "BEARISH"
                    ? "Bearish: sell the range high. Do not buy it. 50% first, then the range low if 50% gives way."
                    : "Bullish: sell stops to buy stops. 50% first, then the range high if 50% gives way."}
                </p>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#94A3B8]">
                      Deferred delivery
                    </span>
                    <p className="text-xs leading-relaxed text-slate-500">
                      Price leaves the draw on liquidity, runs opposing stops
                      at high resistance liquidity, then continues to the
                      draw. Anticipate it at high resistance liquidity.
                    </p>
                  </div>
                  <label className="flex items-center gap-2 shrink-0 h-9 px-3 rounded-lg border border-slate-200 bg-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.deferredDelivery}
                      onChange={(e) => {
                        const on = e.target.checked
                        setFormData((prev) => ({
                          ...prev,
                          deferredDelivery: on,
                          ...(on
                            ? deferredDefaults(prev.htfBias)
                            : { deferCandle: "", opposingStops: "" }),
                        }))
                      }}
                      className="rounded border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700">
                      This trade
                    </span>
                  </label>
                </div>
                {formData.deferredDelivery ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {DEFERRED_STEPS.map((step) => {
                        const active = formData.deferredSteps.includes(step.id)
                        return (
                          <button
                            key={step.id}
                            type="button"
                            title={step.description}
                            onClick={() => toggleDeferredStep(step.id)}
                            className={cn(
                              "rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition-all",
                              active
                                ? "border-[#2563EB] bg-[#2563EB] text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            )}
                          >
                            {step.label}
                          </button>
                        )
                      })}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#94A3B8]">
                        Defer candle
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {DEFER_CANDLES.map((candle) => (
                          <button
                            key={candle.id}
                            type="button"
                            title={candle.description}
                            onClick={() =>
                              handleChange("deferCandle", candle.id)
                            }
                            className={cn(
                              "rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition-all",
                              formData.deferCandle === candle.id
                                ? "border-[#2563EB] bg-[#2563EB] text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            )}
                          >
                            {candle.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#94A3B8]">
                        Opposing liquidity run
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {OPPOSING_STOPS.map((pool) => (
                          <button
                            key={pool.id}
                            type="button"
                            title={pool.description}
                            onClick={() =>
                              handleChange("opposingStops", pool.id)
                            }
                            className={cn(
                              "rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition-all",
                              formData.opposingStops === pool.id
                                ? "border-[#2563EB] bg-[#2563EB] text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            )}
                          >
                            {pool.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">
                      {formData.htfBias === "BEARISH"
                        ? "Bearish: the lowest down-close at high resistance liquidity defers delivery up into buy stops. Wait for that run, then continue to the draw."
                        : "Bullish: the highest up-close at high resistance liquidity defers delivery down into sell stops. Wait for that run, then continue higher to the draw."}
                    </p>
                  </>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#94A3B8]">
                    Range liquidity
                  </span>
                  <p className="text-xs leading-relaxed text-slate-500">
                    The market rebalances an imbalance, or it runs an old high
                    or low. It rotates from internal range liquidity to
                    external, and back. That rotation is the next HTF candle.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {RANGE_LIQUIDITY.map((location) => (
                    <button
                      key={location.id}
                      type="button"
                      title={location.description}
                      onClick={() => {
                        handleChange("rangeLiquidity", location.id)
                        if (location.id === "EXTERNAL") {
                          handleChange("imbalanceType", "")
                        }
                        if (
                          location.id === "INTERNAL" &&
                          formData.externalPool === "OLD_HIGH"
                        ) {
                          handleChange("htfBias", "BULLISH")
                        }
                        if (
                          location.id === "INTERNAL" &&
                          formData.externalPool === "OLD_LOW"
                        ) {
                          handleChange("htfBias", "BEARISH")
                        }
                      }}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition-all",
                        formData.rangeLiquidity === location.id
                          ? "border-[#2563EB] bg-[#2563EB] text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {location.label}
                    </button>
                  ))}
                </div>
                {formData.rangeLiquidity === "INTERNAL" ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#94A3B8]">
                      Imbalance
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {IMBALANCES.map((imbalance) => (
                        <button
                          key={imbalance.id}
                          type="button"
                          title={imbalance.description}
                          onClick={() =>
                            handleChange("imbalanceType", imbalance.id)
                          }
                          className={cn(
                            "rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition-all",
                            formData.imbalanceType === imbalance.id
                              ? "border-[#2563EB] bg-[#2563EB] text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {imbalance.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-500">
                      Trading into this imbalance, the next candle seeks an old
                      high or an old low.
                    </p>
                  </div>
                ) : null}
                {formData.rangeLiquidity ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#94A3B8]">
                      {formData.rangeLiquidity === "INTERNAL"
                        ? "Draw is an old high or low"
                        : "Old high or low that was run"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {EXTERNAL_POOLS.map((pool) => (
                        <button
                          key={pool.id}
                          type="button"
                          title={pool.description}
                          onClick={() => {
                            handleChange("externalPool", pool.id)
                            if (formData.rangeLiquidity === "INTERNAL") {
                              handleChange(
                                "htfBias",
                                pool.id === "OLD_HIGH" ? "BULLISH" : "BEARISH"
                              )
                            }
                          }}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition-all",
                            formData.externalPool === pool.id
                              ? "border-[#2563EB] bg-[#2563EB] text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {pool.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-500">
                      {formData.rangeLiquidity === "INTERNAL"
                        ? "An old high sets the next candle up. An old low sets it down."
                        : "That high or low is done. The next candle seeks an FVG."}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#94A3B8]">
                    IPDA profile
                  </span>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Index futures consolidate about 52% of the time and expand
                    about 48%. Into the 9:30 equity open, profile first, then
                    only get in on the expansion.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {MARKET_PROFILES.map((profile) => (
                    <button
                      key={profile.id}
                      type="button"
                      title={profile.description}
                      onClick={() => handleChange("setupType", profile.id)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left transition-all",
                        formData.setupType === profile.id
                          ? "border-[#2563EB] bg-[#2563EB] text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <div className="text-[11px] font-bold">{profile.short}</div>
                      <div
                        className={cn(
                          "text-[9px]",
                          formData.setupType === profile.id
                            ? "text-blue-100"
                            : "text-slate-400"
                        )}
                      >
                        {profile.label}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  {formData.setupType === "CONSOLIDATION"
                    ? "Stay out. Consolidation only leads to expansion, and that is the move you trade. The range tells you a trend is close."
                    : formData.setupType === "EXPANSION"
                      ? "This is when you are in the market. Trade the expansion."
                      : formData.setupType === "REVERSAL" ||
                          formData.setupType === "RETRACEMENT"
                        ? "This follows an expansion. It does not come straight out of consolidation."
                        : "Consolidation always leads to expansion. It never leads to a reversal or a retracement."}
                </p>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#94A3B8]">
                    Out of consolidation
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {RANGE_RESOLUTIONS.map((path) => {
                      const active = formData.liquiditySide === path.id
                      return (
                        <button
                          key={path.id}
                          type="button"
                          title={path.description}
                          onClick={() =>
                            handleChange("liquiditySide", active ? "" : path.id)
                          }
                          className={cn(
                            "rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition-all",
                            active
                              ? "border-[#2563EB] bg-[#2563EB] text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {path.label}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Either a breakout with the bias, then a retracement long or
                    short, or a stop run against the bias (AMD) before the
                    expansion.
                  </p>
                </div>
              </div>
            </section>

            {/* Confluence tags */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                  Checklist
                </Label>
                <Info className="h-3 w-3 text-[#94A3B8]" />
              </div>
              <div className="flex flex-wrap gap-2">
                {CONFLUENCE_TAGS.map((tag) => {
                  const active = formData.tags.includes(tag)
                  return (
                    <Badge
                      key={tag}
                      className={cn(
                        "cursor-pointer border-none px-3 py-1.5 rounded-md text-[11px] font-bold",
                        active
                          ? "bg-[#2563EB] text-white"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      )}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  )
                })}
              </div>
            </section>

            {/* Screenshots */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                  Charts (LTP / ITP / STP)
                </Label>
                <span className="text-[10px] font-medium text-[#94A3B8]">
                  {screenshots.length} files
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {screenshots.map((file, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setScreenshots((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="aspect-video rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 cursor-pointer group">
                  <Camera className="h-5 w-5 text-[#94A3B8] group-hover:text-[#2563EB]" />
                  <span className="text-[10px] font-bold text-[#94A3B8] group-hover:text-[#2563EB]">
                    Add Image
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        setScreenshots((prev) => [
                          ...prev,
                          ...Array.from(e.target.files!),
                        ])
                      }
                    }}
                  />
                </label>
              </div>
            </section>

            {/* Psychology */}
            <div className="bg-[#F8FAFC] border-l-4 border-[#2563EB] rounded-lg p-5 flex flex-col gap-3">
              <span className="font-bold text-[#2563EB] text-sm">
                Psychology
              </span>
              <Textarea
                value={formData.psychologyNote}
                onChange={(e) => handleChange("psychologyNote", e.target.value)}
                placeholder="Did the next candle point from an imbalance to an old high or low, or back to an FVG after a high or low was run?"
                className="bg-white border-slate-200 min-h-[100px] rounded-lg text-sm resize-none"
              />
            </div>
          </div>

          <DialogFooter className="p-6 pt-4 flex items-center justify-end gap-4 bg-white border-t border-slate-50 shrink-0 sm:justify-end">
            <Button
              variant="ghost"
              className="font-bold text-[#64748B] h-12 px-6 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-12 px-10 rounded-lg shadow-none disabled:opacity-50 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Trade"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
