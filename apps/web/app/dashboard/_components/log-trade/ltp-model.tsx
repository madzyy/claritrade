"use client"

import * as React from "react"
import { Camera, Info, X } from "lucide-react"
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
import {
  BIAS_OPTIONS,
  BEARISH_CLOSURES,
  BULLISH_CLOSURES,
  CANDLE_ENDS,
  CANDLE_ENTRIES,
  CANDLE_FORMATIONS,
  CANDLE_PATHS,
  CLOSURE_CONTEXT,
  CONFLUENCE_TAGS,
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

export function LtpModel() {
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
  const anatomyBias = formationBias(formData.candleFormation)
  const iofCore =
    ltpIofSignatures(formData.ltpIof).filter((check) =>
      formData.ltpIofChecks.includes(check.id)
    ).length >= 3
  const closeRead = closureBias(formData.closeSignatures)
  return (
    <div className="flex flex-col gap-3">
<div className="flex flex-col gap-2 rounded-xl border border-border bg-transparent p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[9px] font-black tracking-widest text-muted-foreground uppercase">
                      1 · LTP
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      MN · W1 · D1
                    </span>
                  </div>
                  <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                    Daily bias. Anatomy of the weekly and monthly candle first —
                    one candle is a multi-day bias. Then: what is the next daily
                    likely to do?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={formData.htfTimeframe}
                      onValueChange={(v) => {
                        const pair = pairForKlTf(v)
                        setFormData((prev) => ({
                          ...prev,
                          htfTimeframe: v,
                          klRangePair: pair || prev.klRangePair,
                          purgeStack:
                            purgeStackForPair(pair || prev.klRangePair) ||
                            prev.purgeStack,
                        }))
                      }}
                    >
                      <SelectTrigger className="h-9 border-border bg-transparent text-xs font-bold text-foreground">
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
                    <Select value={formData.htfBias} onValueChange={setBias}>
                      <SelectTrigger className="h-9 border-border bg-transparent text-xs font-bold text-foreground">
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
                  </div>
                  <div className="flex flex-col gap-2 border-t border-border pt-3">
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Candle anatomy · W1 / MN
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Read OHLC or OLHC. Classic bodies, one-sided reversal
                      wicks, or both-sided chop. Avoid consolidation. There is a
                      trade at the open, at mid expansion, or at the end once HC
                      or LC is in.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CANDLE_PATHS.map((path) => (
                        <button
                          key={path.id}
                          type="button"
                          title={path.description}
                          onClick={() =>
                            handleChange(
                              "candlePath",
                              formData.candlePath === path.id ? "" : path.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.candlePath === path.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {path.label}
                        </button>
                      ))}
                    </div>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      {formData.candlePath === "OHLC"
                        ? "High first, then low. Bearish path."
                        : formData.candlePath === "OLHC"
                          ? "Low first, then high. Bullish path."
                          : "OHLC seeks the high first. OLHC seeks the low first."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CANDLE_FORMATIONS.map((formation) => {
                        const active = formData.candleFormation === formation.id
                        return (
                          <button
                            key={formation.id}
                            type="button"
                            title={formation.description}
                            onClick={() => {
                              const next =
                                formData.candleFormation === formation.id
                                  ? ""
                                  : formation.id
                              handleChange("candleFormation", next)
                              const nextBias = next ? formationBias(next) : null
                              if (nextBias) setBias(nextBias)
                            }}
                            className={cn(
                              "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                              active
                                ? formation.id === "CONSOLIDATION"
                                  ? "border-[#DC2626] bg-[#DC2626] text-white"
                                  : "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                                : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}
                          >
                            {formation.label}
                          </button>
                        )
                      })}
                    </div>
                    {formData.candleFormation === "CONSOLIDATION" ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#DC2626]">
                        Both-sided wicks. Sideways. Do not take a bias from this
                        candle.
                      </p>
                    ) : formData.candleFormation === "BULLISH_REVERSAL" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Started heavily bearish, then reversed — usually after a
                        key level. Bottom wick.
                      </p>
                    ) : formData.candleFormation === "BEARISH_REVERSAL" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Started heavily bullish, then reversed later. Top wick.
                      </p>
                    ) : formData.candleFormation.startsWith("CLASSIC") ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Full body. Mostly body, little wick.
                      </p>
                    ) : null}
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Where in the candle
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {CANDLE_ENTRIES.map((entry) => (
                        <button
                          key={entry.id}
                          type="button"
                          title={entry.description}
                          onClick={() =>
                            handleChange(
                              "candleEntry",
                              formData.candleEntry === entry.id ? "" : entry.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.candleEntry === entry.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {entry.label}
                        </button>
                      ))}
                    </div>
                    {formData.candleEntry === "END" ? (
                      <div className="flex flex-wrap gap-2">
                        {CANDLE_ENDS.map((end) => (
                          <button
                            key={end.id}
                            type="button"
                            title={end.description}
                            onClick={() =>
                              handleChange(
                                "candleEnd",
                                formData.candleEnd === end.id ? "" : end.id
                              )
                            }
                            className={cn(
                              "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                              formData.candleEnd === end.id
                                ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                                : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}
                          >
                            {end.label}
                          </button>
                        ))}
                      </div>
                    ) : formData.candleEntry === "OPEN" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Buy below the open. Sell above it.
                      </p>
                    ) : formData.candleEntry === "MID_EXPANSION" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Middle of the range, while price is expanding — not
                        chopping.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2 border-t border-border pt-3">
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      HTF IOF
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Trend is your friend until proven otherwise. Probe IOF,
                      then blend it with candle anatomy, the HTF key level, and
                      premium / discount.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {LTP_IOF_SIDES.map((side) => (
                        <button
                          key={side.id}
                          type="button"
                          title={side.description}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              ltpIof: prev.ltpIof === side.id ? "" : side.id,
                              ltpIofChecks: [],
                            }))
                          }}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.ltpIof === side.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {side.label}
                        </button>
                      ))}
                    </div>
                    {formData.ltpIof
                      ? ltpIofSignatures(formData.ltpIof).map((check) => {
                          const active = formData.ltpIofChecks.includes(
                            check.id
                          )
                          return (
                            <button
                              key={check.id}
                              type="button"
                              title={check.description}
                              onClick={() =>
                                toggleList("ltpIofChecks", check.id)
                              }
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
                                    active
                                      ? "text-blue-100"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {check.description}
                                </span>
                              </span>
                            </button>
                          )
                        })
                      : null}
                    {formData.ltpIof
                      ? LTP_IOF_CONFIRM.map((check) => {
                          const active = formData.ltpIofChecks.includes(
                            check.id
                          )
                          return (
                            <button
                              key={check.id}
                              type="button"
                              title={check.description}
                              onClick={() =>
                                toggleList("ltpIofChecks", check.id)
                              }
                              className={cn(
                                "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                                active
                                  ? check.id === "INTO_OPPOSING_KL"
                                    ? "border-[#DC2626] bg-[#DC2626] text-white"
                                    : "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                                  : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                              )}
                            >
                              {check.label}
                            </button>
                          )
                        })
                      : null}
                    {formData.ltpIof ? (
                      <p
                        className={cn(
                          "text-[10px] leading-relaxed font-semibold",
                          formData.ltpIofChecks.includes("INTO_OPPOSING_KL")
                            ? "text-[#DC2626]"
                            : iofCore
                              ? "text-[#2563EB]"
                              : "text-muted-foreground"
                        )}
                      >
                        {formData.ltpIofChecks.includes("INTO_OPPOSING_KL")
                          ? "Opposing key level. IOF is proven otherwise only here."
                          : iofCore
                            ? formData.ltpIof === "BEARISH"
                              ? "All three. Bearish until price trades into an opposing key level."
                              : "All three. Bullish until price trades into an opposing key level."
                            : "Need all three signatures before you call HTF IOF."}
                      </p>
                    ) : null}
                    {formData.ltpIof &&
                    anatomyBias &&
                    anatomyBias !== "RANGE" ? (
                      <p
                        className={cn(
                          "text-[10px] leading-relaxed",
                          (formData.ltpIof === "BEARISH" &&
                            anatomyBias === "BEARISH") ||
                            (formData.ltpIof === "BULLISH" &&
                              anatomyBias === "BULLISH")
                            ? "font-semibold text-muted-foreground"
                            : "font-semibold text-[#DC2626]"
                        )}
                      >
                        {(formData.ltpIof === "BEARISH" &&
                          anatomyBias === "BEARISH") ||
                        (formData.ltpIof === "BULLISH" &&
                          anatomyBias === "BULLISH")
                          ? "IOF matches the candle. Blend with the HTF key level and premium / discount."
                          : "IOF does not match candle anatomy. Do not force a bias."}
                      </p>
                    ) : null}
                    {klPd && formData.ltpIof ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        {formData.ltpIof === "BEARISH"
                          ? klPd === "PREMIUM"
                            ? "HTF KL in premium. That is where bearish IOF sells."
                            : "Bearish IOF still sells from premium, not from discount."
                          : klPd === "DISCOUNT"
                            ? "HTF KL in discount. That is where bullish IOF buys."
                            : "Bullish IOF still buys from discount, not from premium."}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2 border-t border-border pt-3">
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      HTF key level
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Foundation of price. Every trade is based on an HTF key
                      level — to it (the draw) or from it. Blend with premium /
                      discount. Keep the weekly and monthly up: a daily break of
                      structure is often just a retracement into a weekly FVG.
                      These arrays get supercharged on ITP.
                    </p>
                    <div className="grid gap-1">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Level
                      </Label>
                      <Input
                        value={formData.poiHigh}
                        onChange={(e) =>
                          handleChange("poiHigh", e.target.value)
                        }
                        placeholder="Price of the HTF KL"
                        className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {HTF_KL_TYPES.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          title={type.description}
                          onClick={() =>
                            handleChange(
                              "htfKlType",
                              formData.htfKlType === type.id ? "" : type.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.htfKlType === type.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {type.n}. {type.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {HTF_KL_JOBS.map((job) => (
                        <button
                          key={job.id}
                          type="button"
                          title={job.description}
                          onClick={() =>
                            handleChange(
                              "htfKlJob",
                              formData.htfKlJob === job.id ? "" : job.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.htfKlJob === job.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {job.label}
                        </button>
                      ))}
                      {HTF_KL_PATHS.map((path) => (
                        <button
                          key={path.id}
                          type="button"
                          title={path.description}
                          onClick={() =>
                            handleChange(
                              "htfKlPath",
                              formData.htfKlPath === path.id ? "" : path.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.htfKlPath === path.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {path.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {HTF_KL_CONTEXT.map((ctx) => (
                        <button
                          key={ctx.id}
                          type="button"
                          title={ctx.description}
                          onClick={() => toggleList("htfKlContext", ctx.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.htfKlContext.includes(ctx.id)
                              ? ctx.id === "DAILY_RETRACE"
                                ? "border-[#DC2626] bg-[#DC2626] text-white"
                                : "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {ctx.label}
                        </button>
                      ))}
                    </div>
                    {formData.htfKlJob === "TO" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Price is the draw into this key level.
                      </p>
                    ) : formData.htfKlJob === "FROM" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Engaging from the key level. Can target lower-timeframe
                        liquidity from here.
                      </p>
                    ) : null}
                    {formData.htfKlContext.includes("PD_STACK") ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        PD array on an HTF PD array. Higher probability.
                      </p>
                    ) : null}
                    {formData.htfKlContext.includes("DAILY_RETRACE") ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#DC2626]">
                        Daily BOS is weekly FVG. Stay with the HTF narrative and
                        IOF.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2 border-t border-border pt-3">
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Timeframe-aligned range
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Always trading a range on every timeframe. Blend the LTP
                      key level with a lower-TF range. That pairing supercharges
                      the KL. Monthly needs a daily range. Weekly needs H4.
                      Daily needs H1.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {KL_RANGE_PAIRS.map((pair) => (
                        <button
                          key={pair.id}
                          type="button"
                          title={pair.description}
                          onClick={() => {
                            const next =
                              formData.klRangePair === pair.id ? "" : pair.id
                            setFormData((prev) => ({
                              ...prev,
                              klRangePair: next,
                              purgeStack: next
                                ? purgeStackForPair(next)
                                : prev.purgeStack,
                            }))
                          }}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.klRangePair === pair.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {pair.label}
                        </button>
                      ))}
                    </div>
                    {formData.klRangePair === "MN_D1" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        You need a daily range to trade a monthly key level.
                      </p>
                    ) : formData.klRangePair === "W1_H4" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        On H4, as price approaches the weekly KL: is there
                        already a range? If yes, mark high and low, wait for the
                        break above into the KL, then attack the range low. If
                        not, wait for a false high before the KL (inducement).
                      </p>
                    ) : formData.klRangePair === "D1_H1" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Daily key level, H1 range. Same process: existing range
                        or inducement first.
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      {RANGE_BUILDS.map((build) => (
                        <button
                          key={build.id}
                          type="button"
                          title={build.description}
                          onClick={() =>
                            handleChange(
                              "rangeBuild",
                              formData.rangeBuild === build.id ? "" : build.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.rangeBuild === build.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {build.label}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-3">
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Range high
                        </Label>
                        <Input
                          value={formData.swingHigh}
                          onChange={(e) =>
                            handleChange("swingHigh", e.target.value)
                          }
                          className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                          50%
                        </Label>
                        <div className="flex h-9 items-center rounded-lg border border-border bg-transparent px-2 text-xs font-bold text-[#2563EB] tabular-nums">
                          {rangeMid != null
                            ? rangeMid.toFixed(priceDecimals)
                            : "—"}
                        </div>
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Range low
                        </Label>
                        <Input
                          value={formData.swingLow}
                          onChange={(e) =>
                            handleChange("swingLow", e.target.value)
                          }
                          className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {RANGE_TF_TOOLS.map((tool) => (
                        <button
                          key={tool.id}
                          type="button"
                          title={tool.description}
                          onClick={() => toggleList("rangeTfTools", tool.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.rangeTfTools.includes(tool.id)
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {tool.label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleChange(
                          "oneCandleConsol",
                          !formData.oneCandleConsol
                        )
                      }
                      className={cn(
                        "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                        formData.oneCandleConsol
                          ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                          : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      )}
                    >
                      Next candle closed inside (1-candle consolidation)
                    </button>
                    {formData.oneCandleConsol ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-muted-foreground">
                        That candle is now consolidation. Only two outcomes:
                        breakout, retest, continuation — or AMD. Never
                        consolidation to consolidation.
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      {CONSOL_PATHS.map((path) => (
                        <button
                          key={path.id}
                          type="button"
                          title={path.description}
                          onClick={() =>
                            handleChange(
                              "consolPath",
                              formData.consolPath === path.id ? "" : path.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.consolPath === path.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {path.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 border-t border-border pt-3">
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Candle closures
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Easiest daily bias. The next candle follows the closure
                      until the draw. Blend with premium / discount and the HTF
                      key level — that is high probability. Wick one side, not
                      both.
                    </p>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Bullish
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {BULLISH_CLOSURES.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          onClick={() => toggleList("closeSignatures", item.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.closeSignatures.includes(item.id)
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Bearish
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {BEARISH_CLOSURES.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          onClick={() => toggleList("closeSignatures", item.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.closeSignatures.includes(item.id)
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {CLOSURE_CONTEXT.map((ctx) => (
                        <button
                          key={ctx.id}
                          type="button"
                          title={ctx.description}
                          onClick={() => toggleList("closeContext", ctx.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.closeContext.includes(ctx.id)
                              ? ctx.id === "USE_CONSOL"
                                ? "border-[#475569] bg-[#334155] text-white dark:border-slate-400 dark:bg-slate-600"
                                : "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {ctx.label}
                        </button>
                      ))}
                    </div>
                    {closeRead === "BULLISH" ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        Bullish closures. Higher prices until a high is taken —
                        usually the end of the candle. At a KL, wick below the
                        previous candle and close above, then expect highs.
                      </p>
                    ) : closeRead === "BEARISH" ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        Bearish closures. Lower prices until a low is taken. At
                        a KL, wick above and close below, then expect lows.
                      </p>
                    ) : closeRead === "MIXED" ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#DC2626]">
                        Mixed closures. One side only. Both sides is
                        consolidation — use the range.
                      </p>
                    ) : null}
                    {formData.candleFormation === "CONSOLIDATION" ||
                    formData.closeContext.includes("USE_CONSOL") ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-muted-foreground">
                        In consolidation, use the consolidation. Everything else
                        is just consolidation.
                      </p>
                    ) : null}
                    {closeRead &&
                    closeRead !== "MIXED" &&
                    (formData.htfKlType || formData.poiHigh) &&
                    ((closeRead === "BULLISH" &&
                      (pd === "DISCOUNT" || klPd === "DISCOUNT")) ||
                      (closeRead === "BEARISH" &&
                        (pd === "PREMIUM" || klPd === "PREMIUM"))) ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        Closures + HTF KL + the right half of the range. High
                        probability.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2 border-t border-border pt-3">
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Quarterly shift · season
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Last LTP lesson. Use it with anatomy, IOF, P/D, HTF KLs,
                      the aligned range, and closures. Index futures is a
                      permabull on the HTF — that is why this is last, not
                      first. Do not fade the monthly blindly.
                    </p>
                    <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                      {
                        quarterForMonth(
                          typeof formData.seasonalMonth === "number"
                            ? formData.seasonalMonth
                            : nyMonth
                        ).label
                      }
                      {" · "}
                      {
                        seasonalForMonth(
                          typeof formData.seasonalMonth === "number"
                            ? formData.seasonalMonth
                            : nyMonth
                        )?.course
                      }
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {SEASONAL_MONTHS.map((item) => {
                        const active =
                          (typeof formData.seasonalMonth === "number"
                            ? formData.seasonalMonth
                            : nyMonth) === item.month
                        return (
                          <button
                            key={item.id}
                            type="button"
                            title={item.course}
                            onClick={() =>
                              handleChange("seasonalMonth", item.month)
                            }
                            className={cn(
                              "rounded-md border px-2 py-1 text-[10px] font-bold transition-all",
                              active
                                ? item.tone === "BEAR"
                                  ? "border-[#DC2626] bg-[#DC2626] text-white"
                                  : item.tone === "EXTREME_BULL"
                                    ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                                    : "border-[#2563EB] bg-[#2563EB]/80 text-white"
                                : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}
                          >
                            {item.short}
                          </button>
                        )
                      })}
                    </div>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Course map: Feb / Sep bearish. Jan / Mar semi bullish. Apr
                      small bull. May–Jul and Nov extreme bull. Aug / Oct / Dec
                      slightly bullish. Long-sample NQ still has Sep as the
                      weakest month and May / Jul / Nov as the strongest. Oct
                      has strengthened vs “slightly.” Feb is only mildly
                      negative.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUARTER_DRAWS.map((draw) => (
                        <button
                          key={draw.id}
                          type="button"
                          title={draw.description}
                          onClick={() => handleChange("quarterDraw", draw.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.quarterDraw === draw.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {draw.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      SMT
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {SMT_PAIRS.map((pair) => (
                        <button
                          key={pair.id}
                          type="button"
                          title={pair.description}
                          onClick={() =>
                            handleChange(
                              "smtPair",
                              formData.smtPair === pair.id ? "" : pair.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.smtPair === pair.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {pair.label}
                        </button>
                      ))}
                      {SMT_READS.map((read) => (
                        <button
                          key={read.id}
                          type="button"
                          title={read.description}
                          onClick={() =>
                            handleChange(
                              "smtRead",
                              formData.smtRead === read.id ? "" : read.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.smtRead === read.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {read.label}
                        </button>
                      ))}
                    </div>
                    {formData.smtPair === "NVDA" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        NVDA takes a previous high, NQ fails to. That is SMT on
                        a top Nasdaq weight. Primary SMT is still YM / NQ.
                      </p>
                    ) : (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Primary SMT is YM versus NQ.
                      </p>
                    )}
                  </div>
                  <Textarea
                    value={formData.htfNarrative}
                    onChange={(e) =>
                      handleChange("htfNarrative", e.target.value)
                    }
                    placeholder="Weekly/monthly anatomy, then the next daily."
                    className="min-h-[64px] resize-none border-border bg-transparent text-xs text-foreground"
                  />
                </div>
    </div>
  )
}
