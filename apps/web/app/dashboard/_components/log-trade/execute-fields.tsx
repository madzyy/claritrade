"use client"

import * as React from "react"
import { Camera, Link2, X } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
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
import { useLogTrade } from "./form-context"
import { OptionalStack } from "./optional-stack"
import {
  BIAS_OPTIONS,
  BEARISH_CLOSURES,
  BULLISH_CLOSURES,
  CANDLE_ENDS,
  CANDLE_ENTRIES,
  CANDLE_FORMATIONS,
  CANDLE_PATHS,
  CLOSURE_CONTEXT,
  // CONFLUENCE_TAGS, // parked with checklist UI
  EXTERNAL_POOLS,
  HTF_TIMEFRAMES,
  IMBALANCES,
  INSTRUMENT_OPTIONS,
  ITP_FLOW,
  ITP_HORIZONS,
  ITP_SCENARIOS,
  ITP_TOC,
  STP_KL_NOTES,
  STP_KL_PAIRS,
  STP_WINDOWS,
  AM_PLANS,
  EQUITY_OPEN_ROLES,
  MIDNIGHT_RUNS,
  NEWS_EVENTS,
  NEWS_ROLES,
  NEWS_TELLS,
  EQ_DIST_Q,
  EQ_DIST_SCENES,
  EQ_MANIP_Q,
  EQ_MANIP_SCENES,
  EQ_OPEN_930,
  PREV_SESSIONS,
  KILLZONES,
  LTF_TIMEFRAMES,
  LTP_IOF_CONFIRM,
  LTP_IOF_SIDES,
  DEALING_DELIVERY,
  DEALING_FORMATIONS,
  DEALING_JOBS,
  DEFERRED_STEPS,
  DEFER_CANDLES,
  FIFTY_ROLES,
  GAP_FRAMEWORK,
  GAP_JOBS,
  HTF_KL_CONTEXT,
  HTF_KL_JOBS,
  HTF_KL_PATHS,
  HTF_KL_TYPES,
  KL_RANGE_PAIRS,
  QUARTER_DRAWS,
  SEASONAL_MONTHS,
  SMT_PAIRS,
  SMT_READS,
  WEEK_COLORS,
  WEEK_DAYS,
  WEEK_EXTREMES,
  WEEK_NOTES,
  WEEK_PROFILE_STEPS,
  WEEK_RANGE_RUNS,
  CONSOL_PATHS,
  RANGE_BUILDS,
  RANGE_TF_TOOLS,
  INSTITUTIONAL_CHECKS,
  IOF_ALIGNMENTS,
  IOF_SIDES,
  MMXM_SEQUENCE,
  MMXM_TYPES,
  OPENING_GAPS,
  MARKET_PROFILES,
  MTF_TIMEFRAMES,
  OPPOSING_STOPS,
  RANGE_CONFIRMS,
  RANGE_LIQUIDITY,
  RANGE_RESOLUTIONS,
  RANGE_SEQUENCE,
  RANGE_TYPES,
  RELATIVE_LEVELS,
  RELATIVE_SEQUENCE,
  STP_FLOW,
  STRUCTURE_CONTEXT,
  STRUCTURE_JOBS,
  STRUCTURE_POOLS,
  amPlanFromSessions,
  biasLabel,
  candleTagsFor,
  closureBias,
  closureTagsFor,
  dealingTagsFor,
  deferredDefaults,
  formationBias,
  deferredTagsFor,
  calculateLotSize,
  calculateRangeMid,
  calculateTradeMetrics,
  premiumDiscount,
  purgeTagsFor,
  detectKillzone,
  formatSessionWindow,
  getInstrumentSpec,
  getNyParts,
  htfKlTagsFor,
  klRangeTagsFor,
  pairForItpKl,
  pairForKlTf,
  purgeStackForPair,
  PURGE_QUALIFIERS,
  PURGE_SIDES,
  PURGE_STACKS,
  quarterForMonth,
  seasonalForMonth,
  seasonalTagsFor,
  stpKlTagsFor,
  eqOpenTagsFor,
  newsDayNote,
  newsTagsFor,
  stpOpenTagsFor,
  vsOpeningPrices,
  weekDayFromDate,
  weekDayStat,
  weekProfileTagsFor,
  institutionalTagsFor,
  itpChartTagsFor,
  killzoneLabel,
  liquidityTagsFor,
  ltpIofSignatures,
  ltpIofTagsFor,
  mmxmTagsFor,
  openingGapTagsFor,
  perspectiveAlignment,
  perspectiveTagsFor,
  profileShort,
  rangeLiquidityShort,
  rangeTagsFor,
  relativeTagsFor,
  resolveRiskDollars,
  structureTagsFor,
  stripLiquidityTags,
  type KillzoneId,
  type TradeDirection,
} from "@/lib/trading"
import { JOURNAL_INSTRUMENTS } from "./types"

export function ExecuteFields() {
  const {
    formData,
    setFormData,
    handleChange,
    toggleList,
    toggleTag,
    toggleRangeStep,
    toggleRangeConfirm,
    toggleDeferredStep,
    toggleStructureContext,
    setBias,
    showWhy,
    itpUnlocked,
    stpUnlocked,
    pd,
    klPd,
    vsOpen,
    vsOpens,
    alignment,
    sponsored,
    dealingMid,
    rangeMid,
    priceDecimals,
    preview,
    nyMonth,
    weekDayId,
    weekStat,
    lotManual,
    setLotManual,
    journalName,
    balanceLoading,
    screenshots,
    setScreenshots,
  } = useLogTrade()
  return (
    <>
            {/* Risk */}
            <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  Account Balance ($)
                </Label>
                <div className="flex h-10 items-center rounded-lg border border-border bg-transparent px-3 font-bold text-foreground tabular-nums">
                  {balanceLoading
                    ? "Loading…"
                    : formData.accountBalance
                      ? `$${Number(formData.accountBalance).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      : "—"}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  From {journalName ?? "active journal"} · updates with closed
                  P&amp;L
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                    Risk
                  </Label>
                  <div className="flex origin-right scale-90 rounded-md bg-transparent p-0.5">
                    <button
                      type="button"
                      onClick={() => handleChange("riskType", "percent")}
                      className={cn(
                        "rounded-sm px-2 py-0.5 text-[10px] font-bold transition-all",
                        formData.riskType === "percent"
                          ? "font-bold text-[#2563EB]"
                          : "text-muted-foreground"
                      )}
                    >
                      %
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange("riskType", "amount")}
                      className={cn(
                        "rounded-sm px-2 py-0.5 text-[10px] font-bold transition-all",
                        formData.riskType === "amount"
                          ? "font-bold text-[#2563EB]"
                          : "text-muted-foreground"
                      )}
                    >
                      $
                    </button>
                  </div>
                </div>
                <Input
                  value={formData.risk}
                  onChange={(e) => handleChange("risk", e.target.value)}
                  className="h-10 rounded-lg border border-border bg-transparent font-bold text-foreground shadow-none"
                />
              </div>
            </div>
            {/* Core execution */}
            <section className="grid grid-cols-1 gap-x-4 gap-y-3 min-[400px]:grid-cols-2">
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  Instrument
                </Label>
                <Select
                  value={formData.pair}
                  onValueChange={(v) => handleChange("pair", v)}
                >
                  <SelectTrigger className="h-9 rounded-lg border-border bg-transparent font-bold text-foreground">
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
                <Label className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  Direction
                </Label>
                <Select
                  value={formData.direction}
                  onValueChange={(v) =>
                    handleChange("direction", v as TradeDirection)
                  }
                >
                  <SelectTrigger className="h-9 rounded-lg border-border bg-transparent font-semibold text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy (Long)</SelectItem>
                    <SelectItem value="sell">Sell (Short)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  Entry (NY local)
                </Label>
                <Input
                  type="datetime-local"
                  value={formData.dateOpenedLocal}
                  onChange={(e) =>
                    handleChange("dateOpenedLocal", e.target.value)
                  }
                  className="h-9 w-full min-w-0 rounded-lg border-border bg-transparent font-semibold text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  Session <span className="text-[#2563EB]">*</span>
                </Label>
                <Select
                  value={formData.killzone || undefined}
                  onValueChange={(v) => handleChange("killzone", v)}
                >
                  <SelectTrigger className="h-9 rounded-lg border-border bg-transparent font-semibold text-foreground">
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
                <Label className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  Entry Price
                </Label>
                <Input
                  value={formData.entry}
                  onChange={(e) => handleChange("entry", e.target.value)}
                  className="h-9 rounded-lg border-border bg-transparent font-semibold text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  Exit Price
                </Label>
                <Input
                  value={formData.exit}
                  onChange={(e) => handleChange("exit", e.target.value)}
                  className="h-9 rounded-lg border-border bg-transparent font-semibold text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  Stop Loss
                </Label>
                <Input
                  value={formData.stopLoss}
                  onChange={(e) => handleChange("stopLoss", e.target.value)}
                  className="h-9 rounded-lg border-border bg-transparent font-semibold text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  Take Profit
                </Label>
                <Input
                  value={formData.takeProfit}
                  onChange={(e) => handleChange("takeProfit", e.target.value)}
                  className="h-9 rounded-lg border-border bg-transparent font-semibold text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Label className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                    {getInstrumentSpec(formData.pair).category === "index"
                      ? "Contracts"
                      : "Lot Size"}
                  </Label>
                  {!lotManual && (
                    <Badge variant="soft" className="px-1.5 py-0 text-[8px] font-semibold uppercase">
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
                  className="h-9 rounded-lg border-border bg-transparent font-bold text-[#2563EB]"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  Live Metrics
                </Label>
                <div className="flex h-auto min-h-9 flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-transparent px-3 py-2 text-xs font-bold text-foreground">
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
    </>
  )
}

function normalizeChartUrl(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`
  let parsed: URL
  try {
    parsed = new URL(withProtocol)
  } catch {
    return null
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null
  const snap = parsed.href.match(/tradingview\.com\/x\/([A-Za-z0-9]+)/i)
  if (snap?.[1]) {
    const id = snap[1]
    return `https://s3.tradingview.com/snapshots/${id[0]!.toLowerCase()}/${id}.png`
  }
  return parsed.href
}

export function ExecuteNotes() {
  const {
    formData,
    handleChange,
    showWhy,
    screenshots,
    setScreenshots,
    chartLinks,
    setChartLinks,
  } = useLogTrade()
  const [linkDraft, setLinkDraft] = React.useState("")
  const addChartLinks = () => {
    const next = linkDraft
      .split(/[\s,]+/)
      .map(normalizeChartUrl)
      .filter((url): url is string => Boolean(url))
    if (next.length === 0) return
    setChartLinks((prev) => [...prev, ...next.filter((url) => !prev.includes(url))])
    setLinkDraft("")
  }
  return (
    <>
            {/* Checklist — parked. Auto-tags from LTP/ITP/STP still save.
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5">
                <Label className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  Checklist
                </Label>
                <Info className="h-3 w-3 text-muted-foreground" />
              </div>
              <p className={cn("text-xs leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                Liquidity sits at lows that broke highs and highs that broke
                lows. Each of those is either the draw, or turtle soup. After an
                HTF key level, target the opposing one. If you just broke a
                level, look at the high that broke the low (or the reverse) and
                expect a key level and a purge if it is against the next candle.
              </p>
              <div className="flex flex-wrap gap-2">
                {CONFLUENCE_TAGS.map((tag) => {
                  const active = formData.tags.includes(tag)
                  return (
                    <Badge
                      key={tag}
                      variant={active ? "default" : "secondary"}
                      className="cursor-pointer px-3 py-1.5 text-[11px] font-medium"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  )
                })}
              </div>
            </section>
            */}
            {/* Screenshots */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  Charts (LTP / ITP / STP)
                </Label>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {chartLinks.length + screenshots.length} charts
                </span>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Input
                  value={linkDraft}
                  onChange={(e) => setLinkDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addChartLinks()
                    }
                  }}
                  placeholder="Paste TradingView or chart image URL"
                  className="h-9 rounded-lg border-border bg-transparent text-sm text-foreground"
                />
                <button
                  type="button"
                  onClick={addChartLinks}
                  className="h-9 shrink-0 rounded-lg bg-secondary px-3 text-[11px] font-semibold text-secondary-foreground hover:bg-secondary/80"
                >
                  Add link
                </button>
              </div>
              <p className={cn("text-xs leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                Snapshot or image URLs skip the upload. TradingView share links
                like tradingview.com/x/… are stored as the snapshot image.
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
                {chartLinks.map((url, index) => (
                  <div
                    key={`link-${url}-${index}`}
                    className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-secondary/40"
                  >
                    <img
                      src={url}
                      alt="chart link"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-[#2563EB]">
                      <Link2 className="h-3 w-3" />
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setChartLinks((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {screenshots.map((file, index) => (
                  <div
                    key={`file-${index}`}
                    className="group relative aspect-video overflow-hidden rounded-lg border border-border"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setScreenshots((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="group flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border hover:bg-accent">
                  <Camera className="h-5 w-5 text-muted-foreground group-hover:text-[#2563EB]" />
                  <span className="text-[10px] font-bold text-muted-foreground group-hover:text-[#2563EB]">
                    Upload
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
            <OptionalStack />
            {/* Psychology */}
            <div className="flex flex-col gap-3 rounded-lg border-l-4 border-[#2563EB] bg-transparent p-5">
              <span className="text-sm font-bold text-[#2563EB]">
                Psychology
              </span>
              <Textarea
                value={formData.psychologyNote}
                onChange={(e) => handleChange("psychologyNote", e.target.value)}
                placeholder="Did the next candle point from an imbalance to an old high or low, or back to an FVG after a high or low was run?"
                className="min-h-[100px] resize-none rounded-lg border-border bg-transparent text-sm text-foreground"
              />
            </div>

    </>
  )
}
