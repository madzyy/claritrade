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

export function StpModel() {
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
                    !stpUnlocked && "opacity-50"
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[9px] font-black tracking-widest text-muted-foreground uppercase">
                      3 · STP
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      M15 · M5 · M1
                    </span>
                  </div>
                  <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                    Entry only after LTP and ITP agree. H4 KL is traded with an
                    M15 range; H1 KL with M5. Time is of the essence — wait for
                    that range to be taken at a key time.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={formData.ltfTimeframe}
                      onValueChange={(v) => handleChange("ltfTimeframe", v)}
                      disabled={!stpUnlocked}
                    >
                      <SelectTrigger className="h-9 border-border bg-transparent text-xs font-bold text-foreground">
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
                    <Select
                      value={formData.ltfBias}
                      onValueChange={(v) => handleChange("ltfBias", v)}
                      disabled={!stpUnlocked}
                    >
                      <SelectTrigger className="h-9 border-border bg-transparent text-xs font-bold text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STP_FLOW.map((flow) => (
                          <SelectItem key={flow.id} value={flow.id}>
                            {flow.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 border-t border-border pt-3">
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Equity open · previous sessions
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Master the open by profiling Asia and London first — at
                      08:30 NY, with your eyes, no pip math. That profile
                      decides if AM is even tradeable. Know whether 09:30 is
                      distribution or manipulation. London session model and
                      final-hour macro live here too.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {STP_WINDOWS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          disabled={!stpUnlocked}
                          onClick={() => handleChange("stpWindow", item.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.stpWindow === item.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {EQUITY_OPEN_ROLES.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          disabled={!stpUnlocked}
                          onClick={() =>
                            handleChange(
                              "equityOpenRole",
                              formData.equityOpenRole === item.id ? "" : item.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.equityOpenRole === item.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Map Asia and London. If London is huge, or Asia and London
                      both expanded with no retrace, sit AM and trade PM. If
                      Asia is overly extended, leave until 13:00. If neither is
                      extended, AM is on.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PREV_SESSIONS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          disabled={!stpUnlocked}
                          onClick={() => {
                            setFormData((prev) => {
                              const sessions = prev.prevSessions.includes(
                                item.id
                              )
                                ? prev.prevSessions.filter(
                                    (id) => id !== item.id
                                  )
                                : [...prev.prevSessions, item.id]
                              return {
                                ...prev,
                                prevSessions: sessions,
                                amPlan:
                                  amPlanFromSessions(sessions) || prev.amPlan,
                              }
                            })
                          }}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.prevSessions.includes(item.id)
                              ? item.am === "SIT_AM"
                                ? "border-[#DC2626] bg-[#DC2626] text-white"
                                : "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {AM_PLANS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          disabled={!stpUnlocked}
                          onClick={() => handleChange("amPlan", item.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.amPlan === item.id
                              ? item.id === "SIT_AM"
                                ? "border-[#DC2626] bg-[#DC2626] text-white"
                                : "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={!stpUnlocked}
                        onClick={() =>
                          handleChange("waitEql", !formData.waitEql)
                        }
                        className={cn(
                          "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                          formData.waitEql
                            ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                            : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        Wait for EQLs
                      </button>
                    </div>
                    {formData.amPlan === "SIT_AM" ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#DC2626]">
                        Sit the AM. PM is the expansion with the daily candle.
                        If Asia is the reason, come back at 13:00.
                      </p>
                    ) : formData.amPlan === "TRADE_AM" ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        Asia and London are not overly extended. Equity open is
                        tradeable.
                      </p>
                    ) : null}
                    {formData.waitEql &&
                    (formData.htfBias === "BULLISH" ||
                      formData.direction === "buy") ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Bullish. Relative equal lows first — wait for them to be
                        taken.
                      </p>
                    ) : null}
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      00:00 and 08:30 opens
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Two opening prices for the equity open: midnight and 08:30
                      NY. Bearish: highest-probability shorts are above both. If
                      London already ran above midnight into a KL, 08:30 is the
                      sell — above it or very close. Bullish is the inverse.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                          00:00 open
                        </Label>
                        <Input
                          value={formData.midnightOpen}
                          onChange={(e) =>
                            handleChange("midnightOpen", e.target.value)
                          }
                          disabled={!stpUnlocked}
                          className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                          08:30 open
                        </Label>
                        <Input
                          value={formData.open0830}
                          onChange={(e) => {
                            const value = e.target.value
                            setFormData((prev) => ({
                              ...prev,
                              open0830: value,
                              openingPrice: prev.openingPrice || value,
                            }))
                          }}
                          disabled={!stpUnlocked}
                          className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {MIDNIGHT_RUNS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          disabled={!stpUnlocked}
                          onClick={() =>
                            handleChange(
                              "midnightRun",
                              formData.midnightRun === item.id ? "" : item.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.midnightRun === item.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    {vsOpens?.both === "above" &&
                    (formData.htfBias === "BEARISH" ||
                      formData.direction === "sell") ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        Above both opens. High-probability short.
                      </p>
                    ) : vsOpens?.both === "below" &&
                      (formData.htfBias === "BULLISH" ||
                        formData.direction === "buy") ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        Below both opens. High-probability long.
                      </p>
                    ) : vsOpens?.both === "above" &&
                      formData.direction === "buy" ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#DC2626]">
                        Buying above both opens. Shorts belong here.
                      </p>
                    ) : vsOpens?.both === "below" &&
                      formData.direction === "sell" ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#DC2626]">
                        Selling below both opens. Longs belong here.
                      </p>
                    ) : null}
                    {formData.midnightRun === "ABOVE" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        London already ran above 00:00 into a KL. Sell above
                        08:30, or very close to it.
                      </p>
                    ) : formData.midnightRun === "BELOW" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        London already ran below 00:00 into a KL. Buy below
                        08:30, or very close to it.
                      </p>
                    ) : null}
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Index futures · news cheat sheet
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Foundation for manipulation vs distribution. Index futures
                      repeat the same prints most of the time — not 100%.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {NEWS_EVENTS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          disabled={!stpUnlocked}
                          onClick={() =>
                            handleChange(
                              "newsEvent",
                              formData.newsEvent === item.id ? "" : item.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.newsEvent === item.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    {formData.newsEvent ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        {newsDayNote({
                          event: formData.newsEvent,
                          role0830: formData.news0830,
                          role0930: formData.news0930,
                          role10: formData.news10,
                        })}
                      </p>
                    ) : null}
                    {(
                      [
                        ["news0830", "08:30"],
                        ["news0930", "09:30"],
                        ["news10", "10:00"],
                      ] as const
                    ).map(([field, label]) => (
                      <div key={field} className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                          {label}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {NEWS_ROLES.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              disabled={!stpUnlocked}
                              onClick={() =>
                                handleChange(
                                  field,
                                  formData[field] === item.id ? "" : item.id
                                )
                              }
                              className={cn(
                                "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                                formData[field] === item.id
                                  ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                                  : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                              )}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-wrap gap-2">
                      {NEWS_TELLS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          disabled={!stpUnlocked}
                          onClick={() => toggleList("newsTells", item.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.newsTells.includes(item.id)
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Equity open · 90min killzone
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      09:00–10:30 NY. His sample account was all 09:00–10:00.
                      LTP direction → ITP → STP. 09:30 is manipulation or
                      distribution — anticipate both. Chop is read from the
                      previous session. Questionnaire confirms STP.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {EQ_OPEN_930.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          disabled={!stpUnlocked}
                          onClick={() =>
                            handleChange(
                              "eqo930",
                              formData.eqo930 === item.id ? "" : item.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.eqo930 === item.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      HTF bias and LTP for the next daily candle decide 09:30.
                      If the market is accumulating, 09:30 is most likely
                      manipulation — you cannot reverse out of accumulation.
                    </p>
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Manipulation
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Reversal, or continuation purge (high probability when a
                      range sits inside a dealing range).
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {EQ_MANIP_SCENES.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          disabled={!stpUnlocked}
                          onClick={() =>
                            handleChange(
                              "eqoManipScene",
                              formData.eqoManipScene === item.id ? "" : item.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.eqoManipScene === item.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-col gap-1">
                      {EQ_MANIP_Q.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          disabled={!stpUnlocked}
                          onClick={() => toggleList("eqoManipQ", item.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.eqoManipQ.includes(item.id)
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Distribution
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Continuation after 08:30 manipulation, or after London
                      manipulation. Distribution if stops already ran before
                      09:30.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {EQ_DIST_SCENES.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          disabled={!stpUnlocked}
                          onClick={() =>
                            handleChange(
                              "eqoDistScene",
                              formData.eqoDistScene === item.id ? "" : item.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            formData.eqoDistScene === item.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-col gap-1">
                      {EQ_DIST_Q.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          disabled={!stpUnlocked}
                          onClick={() => toggleList("eqoDistQ", item.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all disabled:opacity-50",
                            formData.eqoDistQ.includes(item.id)
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    value={formData.entryModel}
                    onChange={(e) => handleChange("entryModel", e.target.value)}
                    disabled={!stpUnlocked}
                    placeholder="08:30 profile, then AM or PM. Time + signature."
                    className="min-h-[64px] resize-none border-border bg-transparent text-xs text-foreground"
                  />
                </div>
    </div>
  )
}
