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
  Target,
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
  HTF_TIMEFRAMES,
  INSTRUMENT_OPTIONS,
  KILLZONES,
  LIQUIDITY_SIDES,
  LTF_TIMEFRAMES,
  MTF_TIMEFRAMES,
  SETUP_TYPES,
  calculateLotSize,
  calculateOteZone,
  calculateTradeMetrics,
  detectKillzone,
  getNyParts,
  resolveRiskDollars,
  type KillzoneId,
  type TradeDirection,
} from "@/lib/trading"

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
}

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const initialForm = (): FormState => {
  const now = new Date()
  return {
    pair: "EURUSD",
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
    tags: ["Liquidity Taken", "Displacement"],
    setupType: "ORDER_BLOCK",
    poiHigh: "",
    poiLow: "",
    swingHigh: "",
    swingLow: "",
    liquiditySide: "SELL_SIDE",
    liquidityTaken: true,
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
  const selectedKzLabel =
    formData.killzone === "OUTSIDE"
      ? "Outside Killzones"
      : KILLZONES.find((k) => k.id === formData.killzone)?.label ?? null

  const ote = React.useMemo(() => {
    const sh = parseFloat(formData.swingHigh)
    const sl = parseFloat(formData.swingLow)
    if (Number.isNaN(sh) || Number.isNaN(sl)) return null
    return calculateOteZone(formData.direction, sh, sl)
  }, [formData.swingHigh, formData.swingLow, formData.direction])

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
      toast.error("Select a killzone", {
        description:
          "Pick the ICT session you traded — don’t rely on when you’re journaling.",
      })
      return
    }
    setIsSubmitting(true)
    try {
      const screenshotUrls = await uploadScreenshots()
      const result = await logTrade({
        ...formData,
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
        toast.success("SMC trade logged", {
          description: `${formData.pair} ${formData.direction.toUpperCase()} · ${formData.setupType.replace(/_/g, " ")}`,
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
                <h2 className="text-2xl font-bold text-[#1E293B]">Log SMC / ICT Trade</h2>
                <Badge className="bg-[#2563EB]/10 text-[#2563EB] border-none px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  Multi-TF
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
                    Select killzone
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
                  Pair / Instrument
                </Label>
                <Select
                  value={formData.pair}
                  onValueChange={(v) => handleChange("pair", v)}
                >
                  <SelectTrigger className="h-11 border-slate-200 bg-[#F8FAFC] rounded-lg font-bold text-[#1E293B]">
                    <SelectValue placeholder="Select Pair" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {INSTRUMENT_OPTIONS.map((inst) => (
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
                  ICT Killzone <span className="text-[#2563EB]">*</span>
                </Label>
                <Select
                  value={formData.killzone || undefined}
                  onValueChange={(v) => handleChange("killzone", v)}
                >
                  <SelectTrigger className="h-11 border-slate-200 bg-[#F8FAFC] rounded-lg font-semibold text-[#1E293B]">
                    <SelectValue placeholder="Which session did you trade?" />
                  </SelectTrigger>
                  <SelectContent>
                    {KILLZONES.map((kz) => (
                      <SelectItem key={kz.id} value={kz.id}>
                        {kz.label} ({String(kz.startHour).padStart(2, "0")}:00–
                        {String(kz.endHour).padStart(2, "0")}:00 NY)
                      </SelectItem>
                    ))}
                    <SelectItem value="OUTSIDE">Outside Killzones</SelectItem>
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
                    Lot Size
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

            {/* Setup type */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-[#2563EB]" />
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                  SMC / ICT Setup
                </Label>
              </div>
              <div className="flex flex-wrap gap-2">
                {SETUP_TYPES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleChange("setupType", s.id)}
                    title={s.description}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left transition-all",
                      formData.setupType === s.id
                        ? "border-[#2563EB] bg-[#2563EB] text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <div className="text-[11px] font-bold">{s.short}</div>
                    <div
                      className={cn(
                        "text-[9px]",
                        formData.setupType === s.id
                          ? "text-blue-100"
                          : "text-slate-400"
                      )}
                    >
                      {s.label}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* POI / OTE / Liquidity */}
            <section className="rounded-2xl border border-slate-100 bg-[#F8FAFC] p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#2563EB]" />
                <span className="text-sm font-bold text-[#1E293B]">
                  Point of Interest & OTE
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-bold text-[#94A3B8] uppercase">
                    POI / OB High
                  </Label>
                  <Input
                    value={formData.poiHigh}
                    onChange={(e) => handleChange("poiHigh", e.target.value)}
                    className="h-10 bg-white border-slate-200 rounded-lg font-semibold"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-bold text-[#94A3B8] uppercase">
                    POI / OB Low
                  </Label>
                  <Input
                    value={formData.poiLow}
                    onChange={(e) => handleChange("poiLow", e.target.value)}
                    className="h-10 bg-white border-slate-200 rounded-lg font-semibold"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-bold text-[#94A3B8] uppercase">
                    Dealing Range High
                  </Label>
                  <Input
                    value={formData.swingHigh}
                    onChange={(e) => handleChange("swingHigh", e.target.value)}
                    className="h-10 bg-white border-slate-200 rounded-lg font-semibold"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-bold text-[#94A3B8] uppercase">
                    Dealing Range Low
                  </Label>
                  <Input
                    value={formData.swingLow}
                    onChange={(e) => handleChange("swingLow", e.target.value)}
                    className="h-10 bg-white border-slate-200 rounded-lg font-semibold"
                  />
                </div>
              </div>

              {ote && (
                <div className="rounded-lg border border-[#2563EB]/20 bg-white px-4 py-3 text-xs font-medium text-slate-600">
                  <span className="font-bold text-[#2563EB]">OTE Zone (0.62–0.79): </span>
                  {ote.oteLow.toFixed(5)} — {ote.oteHigh.toFixed(5)}
                  <span className="text-slate-400"> · EQ {ote.equilibrium.toFixed(5)}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-bold text-[#94A3B8] uppercase">
                    Liquidity Taken
                  </Label>
                  <Select
                    value={formData.liquiditySide}
                    onValueChange={(v) => {
                      handleChange("liquiditySide", v)
                      handleChange("liquidityTaken", v !== "NONE")
                    }}
                  >
                    <SelectTrigger className="h-10 bg-white border-slate-200 rounded-lg font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LIQUIDITY_SIDES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white cursor-pointer w-full">
                    <input
                      type="checkbox"
                      checked={formData.mssConfirmed}
                      onChange={(e) =>
                        handleChange("mssConfirmed", e.target.checked)
                      }
                      className="rounded border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700">
                      MSS / CHoCH confirmed
                    </span>
                  </label>
                </div>
              </div>
            </section>

            {/* Multi-timeframe */}
            <section className="rounded-2xl border border-slate-100 p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#2563EB]" />
                <span className="text-sm font-bold text-[#1E293B]">
                  Multi-Timeframe Analysis
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    HTF Bias
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
                    onValueChange={(v) => handleChange("htfBias", v)}
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
                    placeholder="Daily/H4 draw on liquidity, premium/discount..."
                    className="min-h-[72px] text-xs bg-white border-slate-200 resize-none"
                  />
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    MTF Structure
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
                    placeholder="BOS/CHoCH, FVG, OB array, inducement..."
                    className="min-h-[108px] text-xs bg-white border-slate-200 resize-none"
                  />
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    LTF Entry
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
                    placeholder="Entry model: OB tap + MSS + OTE confirmation..."
                    className="min-h-[108px] text-xs bg-white border-slate-200 resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Confluence tags */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                  Confluence Checklist
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
                  Chart Screenshots (HTF / MTF / LTF)
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
                Psychology Note — Be Honest
              </span>
              <Textarea
                value={formData.psychologyNote}
                onChange={(e) => handleChange("psychologyNote", e.target.value)}
                placeholder="Did you wait for HTF alignment + killzone + OTE, or did you force the entry?"
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
