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

export function ItpModel() {
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
    <div className="flex flex-col gap-3">
<div
                  className={cn(
                    "flex flex-col gap-2 rounded-xl border border-border bg-transparent p-3",
                    !itpUnlocked && "opacity-50"
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[9px] font-black tracking-widest text-muted-foreground uppercase">
                      2 · ITP
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      H4 · H1 · M30
                    </span>
                  </div>
                  <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                    Weekly profile first. Build the narrative with market
                    structure, then use ranges and PD arrays to trade the HTF
                    key level. Data-driven days mean nothing until you blend
                    them with the rest of the analysis.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={formData.mtfTimeframe}
                      onValueChange={(v) => {
                        const pair = pairForItpKl(v)
                        setFormData((prev) => ({
                          ...prev,
                          mtfTimeframe: v,
                          stpKlPair: pair || prev.stpKlPair,
                        }))
                      }}
                      disabled={!itpUnlocked}
                    >
                      <SelectTrigger className="h-9 border-border bg-transparent text-xs font-bold text-foreground">
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
                    <Select
                      value={formData.mtfBias}
                      onValueChange={(v) => {
                        setFormData((prev) => ({
                          ...prev,
                          mtfBias: v,
                          ltfBias: v !== prev.htfBias ? "NONE" : prev.ltfBias,
                        }))
                      }}
                      disabled={!itpUnlocked}
                    >
                      <SelectTrigger className="h-9 border-border bg-transparent text-xs font-bold text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ITP_FLOW.map((flow) => (
                          <SelectItem key={flow.id} value={flow.id}>
                            {flow.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 border-t border-border pt-3">
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Weekly profile
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {WEEK_PROFILE_STEPS.map((step) => (
                        <button
                          key={step.id}
                          type="button"
                          title={step.description}
                          disabled={!itpUnlocked}
                          onClick={() =>
                            toggleList("weekProfileSteps", step.id)
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.weekProfileSteps.includes(step.id)
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {step.n}. {step.label}
                        </button>
                      ))}
                    </div>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      80% of the week's high or low forms at a weekly or daily
                      KL while running its range. Weekly low: run the H4 range
                      low. Daily low: run the H1 range low. A daily 1-candle
                      range takes CISD from H1.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {WEEK_RANGE_RUNS.map((run) => (
                        <button
                          key={run.id}
                          type="button"
                          title={run.description}
                          disabled={!itpUnlocked}
                          onClick={() =>
                            handleChange(
                              "weekRangeRun",
                              formData.weekRangeRun === run.id ? "" : run.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.weekRangeRun === run.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {run.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {WEEK_COLORS.map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          title={color.description}
                          disabled={!itpUnlocked}
                          onClick={() =>
                            handleChange(
                              "weekColor",
                              formData.weekColor === color.id ? "" : color.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.weekColor === color.id
                              ? color.id === "RED"
                                ? "border-[#DC2626] bg-[#DC2626] text-white"
                                : "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {color.label}
                        </button>
                      ))}
                      {WEEK_EXTREMES.map((ext) => (
                        <button
                          key={ext.id}
                          type="button"
                          disabled={!itpUnlocked}
                          onClick={() =>
                            handleChange(
                              "weekExtreme",
                              formData.weekExtreme === ext.id ? "" : ext.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.weekExtreme === ext.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {ext.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {WEEK_DAYS.map((day) => (
                        <button
                          key={day.id}
                          type="button"
                          disabled={!itpUnlocked}
                          onClick={() =>
                            handleChange(
                              "weekDay",
                              formData.weekDay === day.id ? "" : day.id
                            )
                          }
                          className={cn(
                            "rounded-md border px-2 py-1 text-[10px] font-bold transition-all disabled:opacity-50",
                            weekDayId === day.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {day.label.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                    {weekStat != null ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        {formData.weekColor === "GREEN" ? "Green" : "Red"} week
                        · {WEEK_DAYS.find((d) => d.id === weekDayId)?.label}{" "}
                        prints this{" "}
                        {formData.weekExtreme === "HIGH" ? "high" : "low"}{" "}
                        {weekStat}% of the time on NQ. Blend it — do not trade
                        the percentage.
                      </p>
                    ) : (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Green week: Monday is the low 50% of the time; Friday is
                        the high 56%. Red week: Monday is often the high (47%);
                        Friday is often the low (53%).
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {WEEK_NOTES.map((note) => (
                        <button
                          key={note.id}
                          type="button"
                          title={note.description}
                          disabled={!itpUnlocked}
                          onClick={() => toggleList("weekNotes", note.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.weekNotes.includes(note.id)
                              ? note.id === "MON_LOW_NO_KL"
                                ? "border-[#DC2626] bg-[#DC2626] text-white"
                                : "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {note.label}
                        </button>
                      ))}
                    </div>
                    {formData.weekNotes.includes("MON_LOW_NO_KL") ||
                    (weekDayId === "MON" &&
                      formData.weekExtreme === "LOW" &&
                      !formData.htfKlType &&
                      !formData.poiHigh) ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#DC2626]">
                        Monday low that did not trade into the HTF key level is
                        inducement, not the week's low.
                      </p>
                    ) : null}
                    {formData.rangeType === "ONE_CANDLE" &&
                    (formData.klRangePair === "D1_H1" ||
                      formData.htfTimeframe === "D1") ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Daily 1-candle range. CISD to confirm the KL is on H1.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2 border-t border-border pt-3">
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      H4 / H1
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Trade only in the direction of LTP. H4 and H1 build the
                      next daily or weekly candle: market structure, premium /
                      discount, then the range. Ideally you are always in a
                      range.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ITP_HORIZONS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          disabled={!itpUnlocked}
                          onClick={() => handleChange("itpHorizon", item.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.itpHorizon === item.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ITP_TOC.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          disabled={!itpUnlocked}
                          onClick={() => toggleList("itpToc", item.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.itpToc.includes(item.id)
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Only two ITP scenarios toward the LTP draw.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ITP_SCENARIOS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          disabled={!itpUnlocked}
                          onClick={() =>
                            handleChange(
                              "itpScenario",
                              formData.itpScenario === item.id ? "" : item.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.itpScenario === item.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={!itpUnlocked}
                        onClick={() =>
                          handleChange(
                            "itpTradingRange",
                            !formData.itpTradingRange
                          )
                        }
                        className={cn(
                          "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                          formData.itpTradingRange
                            ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                            : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        Trading a range
                      </button>
                    </div>
                    {formData.itpScenario === "REBALANCE" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Rebalancing an imbalance on the way to the LTP draw.
                      </p>
                    ) : formData.itpScenario === "RUN_STOPS" ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        {formData.htfBias === "BEARISH"
                          ? "Bearish LTP. Run buy stops, then deliver to the LTP draw."
                          : formData.htfBias === "BULLISH"
                            ? "Bullish LTP. Run sell stops, then deliver to the LTP draw."
                            : "Call the LTP candle first. Bearish runs buy stops. Bullish runs sell stops."}
                      </p>
                    ) : null}
                    {!formData.itpTradingRange ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#DC2626]">
                        Ideally you are always trading a range on H4 / H1.
                      </p>
                    ) : null}
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      ITP KL · STP range
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Same range logic as LTP, but an ITP key level is not
                      paired with another ITP range. H4 KL → M15. H1 KL → M5.
                      Daily candle (LTP) → H4 KL (rebalance or run stops with
                      that candle) → M15 range to trade the H4 KL. Daily
                      closures. Wait for the range to be taken at a key time —
                      continuation purge.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {STP_KL_PAIRS.map((pair) => (
                        <button
                          key={pair.id}
                          type="button"
                          title={pair.description}
                          disabled={!itpUnlocked}
                          onClick={() => handleChange("stpKlPair", pair.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.stpKlPair === pair.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {pair.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {STP_KL_NOTES.map((note) => (
                        <button
                          key={note.id}
                          type="button"
                          title={note.description}
                          disabled={!itpUnlocked}
                          onClick={() => toggleList("stpKlNotes", note.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.stpKlNotes.includes(note.id)
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {note.label}
                        </button>
                      ))}
                    </div>
                    {formData.stpKlPair === "H4_M15" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Daily direction → H4 KL → M15 range. That is how you
                        trade the H4 key level.
                      </p>
                    ) : formData.stpKlPair === "H1_M5" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        H1 key level, M5 range. Same inducement: existing range
                        or false high, then the purge at a key time.
                      </p>
                    ) : null}
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Continuation purge
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Universal model. Easiest trade. High probability on every
                      timeframe. ITP only rebalances an imbalance or runs stops
                      toward the LTP draw — this is the stop-run, in alignment
                      with LTP and the ITP range. A continuation purge is a run
                      of a swing on a lower TF than the range, not the previous
                      candle's high.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PURGE_STACKS.map((stack) => (
                        <button
                          key={stack.id}
                          type="button"
                          title={stack.description}
                          disabled={!itpUnlocked}
                          onClick={() =>
                            handleChange(
                              "purgeStack",
                              formData.purgeStack === stack.id ? "" : stack.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.purgeStack === stack.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {stack.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {PURGE_SIDES.map((side) => (
                        <button
                          key={side.id}
                          type="button"
                          title={side.description}
                          disabled={!itpUnlocked}
                          onClick={() =>
                            handleChange(
                              "purgeSide",
                              formData.purgeSide === side.id ? "" : side.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.purgeSide === side.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {side.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {PURGE_QUALIFIERS.map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          title={q.description}
                          disabled={!itpUnlocked}
                          onClick={() => toggleList("purgeQuals", q.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.purgeQuals.includes(q.id)
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                    {formData.purgeSide === "BULLISH" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Low to high. Bullish continuation purges on the way to
                        the range high.
                      </p>
                    ) : formData.purgeSide === "BEARISH" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        High to low. Bearish continuation purges on the way to
                        the range low.
                      </p>
                    ) : null}
                    {formData.purgeStack === "MN_D1_H4" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        H4 purge of a swing relative to short-term premium /
                        discount — not a run of the previous daily candle high.
                      </p>
                    ) : null}
                    {formData.purgeQuals.includes("FAST_AFTER") ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        After the swing is taken, the move is fast and
                        aggressive. It rarely fails.
                      </p>
                    ) : null}
                  </div>
                  <Textarea
                    value={formData.mtfNarrative}
                    onChange={(e) =>
                      handleChange("mtfNarrative", e.target.value)
                    }
                    disabled={!itpUnlocked}
                    placeholder="H4/H1 structure, P/D, range — next candle in LTP direction."
                    className="min-h-[64px] resize-none border-border bg-transparent text-xs text-foreground"
                  />
                </div>
    </div>
  )
}
