"use client"

import * as React from "react"
import { Plus, Loader2, Layers, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { cn } from "@workspace/ui/lib/utils"
import { logTrade } from "../../actions/trades"
import { getActiveJournalBalanceAction } from "@/app/actions/journals"
import { toast } from "sonner"
import {
  INSTITUTIONAL_CHECKS,
  biasLabel,
  candleTagsFor,
  closureTagsFor,
  dealingTagsFor,
  deferredDefaults,
  deferredTagsFor,
  calculateLotSize,
  calculateRangeMid,
  calculateTradeMetrics,
  premiumDiscount,
  purgeTagsFor,
  detectKillzone,
  getInstrumentSpec,
  getNyParts,
  htfKlTagsFor,
  klRangeTagsFor,
  seasonalTagsFor,
  stpKlTagsFor,
  eqOpenTagsFor,
  newsTagsFor,
  stpOpenTagsFor,
  vsOpeningPrices,
  weekDayFromDate,
  weekDayStat,
  weekProfileTagsFor,
  ipdaTagsFor,
  institutionalTagsFor,
  itpChartTagsFor,
  killzoneLabel,
  liquidityTagsFor,
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
} from "@/lib/trading"
import { FormState, initialForm } from "./log-trade/types"
import { LogTradeProvider } from "./log-trade/form-context"
import { ExecuteFields, ExecuteNotes } from "./log-trade/execute-fields"
import { LtpModel } from "./log-trade/ltp-model"
import { ItpModel } from "./log-trade/itp-model"
import { StpModel } from "./log-trade/stp-model"

export function LogTradeModal() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [logTab, setLogTab] = React.useState<"LTP" | "ITP" | "STP">("LTP")
  const [showWhy, setShowWhy] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState<FormState>(initialForm)
  const [screenshots, setScreenshots] = React.useState<File[]>([])
  const [chartLinks, setChartLinks] = React.useState<string[]>([])
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
        accountBalance: String(Math.round(res.currentBalance! * 100) / 100),
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
  const nyMonth = React.useMemo(() => {
    const value = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      month: "numeric",
    }).format(openedAt)
    return parseInt(value, 10)
  }, [openedAt])
  const nyWeekDay = React.useMemo(
    () => weekDayFromDate(openedAt)?.id ?? "",
    [openedAt]
  )
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
  const klPd = React.useMemo(() => {
    const kl = parseFloat(formData.poiHigh)
    if (Number.isNaN(kl)) return null
    const dHigh = parseFloat(formData.dealingHigh)
    const dLow = parseFloat(formData.dealingLow)
    if (!Number.isNaN(dHigh) && !Number.isNaN(dLow)) {
      return premiumDiscount(kl, dHigh, dLow)
    }
    const rHigh = parseFloat(formData.swingHigh)
    const rLow = parseFloat(formData.swingLow)
    if (!Number.isNaN(rHigh) && !Number.isNaN(rLow)) {
      return premiumDiscount(kl, rHigh, rLow)
    }
    return null
  }, [
    formData.poiHigh,
    formData.dealingHigh,
    formData.dealingLow,
    formData.swingHigh,
    formData.swingLow,
  ])
  const vsOpen = React.useMemo(() => {
    const entry = parseFloat(formData.entry)
    const open = parseFloat(formData.openingPrice)
    if (Number.isNaN(entry) || Number.isNaN(open) || entry === open) return null
    return entry > open ? "above" : "below"
  }, [formData.entry, formData.openingPrice])
  const vsOpens = React.useMemo(() => {
    return vsOpeningPrices(
      parseFloat(formData.entry),
      parseFloat(formData.midnightOpen),
      parseFloat(formData.open0830)
    )
  }, [formData.entry, formData.midnightOpen, formData.open0830])
  const sponsored =
    formData.institutionalChecks.length >= INSTITUTIONAL_CHECKS.length
  const alignment = React.useMemo(
    () =>
      perspectiveAlignment({
        ltpBias: formData.htfBias,
        itpFlow: formData.mtfBias,
        stpFlow: formData.ltfBias,
      }),
    [formData.htfBias, formData.mtfBias, formData.ltfBias]
  )
  const itpUnlocked = alignment.stage !== "LTP"
  const stpUnlocked = alignment.stage === "STP" || alignment.aligned
  const weekDayId = formData.weekDay || nyWeekDay
  const weekStat = weekDayStat(
    formData.weekColor,
    formData.weekExtreme,
    weekDayId
  )
  const priceDecimals = getInstrumentSpec(formData.pair).decimals
  const preview = React.useMemo(() => {
    const entry = parseFloat(formData.entry)
    const stopLoss = parseFloat(formData.stopLoss)
    const takeProfit = formData.takeProfit
      ? parseFloat(formData.takeProfit)
      : null
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
    const {
      setupTypeItp,
      setupTypeStp,
      liquiditySideItp,
      liquiditySideStp,
      rangeLiquidity,
      imbalanceType,
      externalPool,
      rangeLiquidityItp,
      imbalanceTypeItp,
      externalPoolItp,
      rangeLiquidityStp,
      imbalanceTypeStp,
      externalPoolStp,
      rangeType,
      rangeSequence,
      fiftyRole,
      rangeTypeItp,
      rangeSequenceItp,
      fiftyRoleItp,
      rangeConfirmsItp,
      mssConfirmedItp,
      swingHighItp,
      swingLowItp,
      rangeTypeStp,
      rangeSequenceStp,
      fiftyRoleStp,
      rangeConfirmsStp,
      mssConfirmedStp,
      swingHighStp,
      swingLowStp,
      dealingHigh,
      dealingLow,
      dealingFormation,
      dealingJobs,
      dealingDelivery,
      ltfIntoKl,
      dealingHighItp,
      dealingLowItp,
      dealingFormationItp,
      dealingJobsItp,
      dealingDeliveryItp,
      ltfIntoKlItp,
      dealingHighStp,
      dealingLowStp,
      dealingFormationStp,
      dealingJobsStp,
      dealingDeliveryStp,
      ltfIntoKlStp,
      htfKlType,
      htfKlJob,
      htfKlPath,
      htfKlContext,
      htfKlClose,
      klRangePair,
      rangeBuild,
      rangeTfTools,
      consolPath,
      oneCandleConsol,
      closeSignatures,
      closeContext,
      seasonalMonth,
      quarterDraw,
      smtPair,
      smtRead,
      weekColor,
      weekDay,
      weekExtreme,
      weekProfileSteps,
      weekRangeRun,
      weekNotes,
      itpHorizon,
      itpToc,
      itpScenario,
      itpTradingRange,
      stpKlPair,
      stpKlNotes,
      purgeStack,
      purgeSide,
      purgeQuals,
      stpWindow,
      equityOpenRole,
      prevSessions,
      amPlan,
      waitEql,
      midnightOpen,
      open0830,
      midnightRun,
      newsEvent,
      news0830,
      news0930,
      news10,
      newsTells,
      eqo930,
      eqoManipScene,
      eqoDistScene,
      eqoManipQ,
      eqoDistQ,
      rangeConfirms,
      deferredDelivery,
      deferredSteps,
      deferCandle,
      opposingStops,
      deferredDeliveryItp,
      deferredStepsItp,
      deferCandleItp,
      opposingStopsItp,
      deferredDeliveryStp,
      deferredStepsStp,
      deferCandleStp,
      opposingStopsStp,
      structurePool,
      structureJob,
      structureContext,
      structurePoolItp,
      structureJobItp,
      structureContextItp,
      structurePoolStp,
      structureJobStp,
      structureContextStp,
      relativeLevels,
      relativeSequence,
      relativeLevelsItp,
      relativeSequenceItp,
      relativeLevelsStp,
      relativeSequenceStp,
      openingGap,
      gapClose,
      gapOpen,
      gapJob,
      gapFramework,
      openingGapItp,
      gapCloseItp,
      gapOpenItp,
      gapJobItp,
      gapFrameworkItp,
      openingGapStp,
      gapCloseStp,
      gapOpenStp,
      gapJobStp,
      gapFrameworkStp,
      openingPrice,
      institutionalChecks,
      institutionalChecksItp,
      institutionalChecksStp,
      mmxmType,
      iofSide,
      iofAlignment,
      mmxmSequence,
      mmxmTypeItp,
      iofSideItp,
      iofAlignmentItp,
      mmxmSequenceItp,
      mmxmTypeStp,
      iofSideStp,
      iofAlignmentStp,
      mmxmSequenceStp,
      mtfBias,
      ltfBias,
      candlePath,
      candleFormation,
      candleEntry,
      candleEnd,
      ltpIof,
      ltpIofChecks,
      tags,
      ...tradeFields
    } = formData
    const nextTags = [
      ...stripLiquidityTags(tags),
      ...liquidityTagsFor(
        { rangeLiquidity, imbalanceType, externalPool },
        "LTP"
      ),
      ...liquidityTagsFor(
        {
          rangeLiquidity: rangeLiquidityItp,
          imbalanceType: imbalanceTypeItp,
          externalPool: externalPoolItp,
        },
        "ITP"
      ),
      ...liquidityTagsFor(
        {
          rangeLiquidity: rangeLiquidityStp,
          imbalanceType: imbalanceTypeStp,
          externalPool: externalPoolStp,
        },
        "STP"
      ),
      ...rangeTagsFor(
        {
          rangeType,
          rangeSequence,
          fiftyRole,
          pairedWithHtfKl: formData.mssConfirmed,
          dealingFormation,
          rangeConfirms,
          premiumDiscount: pd,
          dealingHigh,
          dealingLow,
        },
        "LTP"
      ),
      ...rangeTagsFor(
        {
          rangeType: rangeTypeItp,
          rangeSequence: rangeSequenceItp,
          fiftyRole: fiftyRoleItp,
          pairedWithHtfKl: mssConfirmedItp,
          dealingFormation: "",
          rangeConfirms: rangeConfirmsItp,
          premiumDiscount: null,
        },
        "ITP"
      ),
      ...rangeTagsFor(
        {
          rangeType: rangeTypeStp,
          rangeSequence: rangeSequenceStp,
          fiftyRole: fiftyRoleStp,
          pairedWithHtfKl: mssConfirmedStp,
          dealingFormation: "",
          rangeConfirms: rangeConfirmsStp,
          premiumDiscount: null,
        },
        "STP"
      ),
      ...deferredTagsFor(
        {
          deferred: deferredDelivery,
          deferredSteps,
          deferCandle,
          opposingStops,
        },
        "LTP"
      ),
      ...deferredTagsFor(
        {
          deferred: deferredDeliveryItp,
          deferredSteps: deferredStepsItp,
          deferCandle: deferCandleItp,
          opposingStops: opposingStopsItp,
        },
        "ITP"
      ),
      ...deferredTagsFor(
        {
          deferred: deferredDeliveryStp,
          deferredSteps: deferredStepsStp,
          deferCandle: deferCandleStp,
          opposingStops: opposingStopsStp,
        },
        "STP"
      ),
      ...structureTagsFor(
        { structurePool, structureJob, structureContext },
        "LTP"
      ),
      ...structureTagsFor(
        {
          structurePool: structurePoolItp,
          structureJob: structureJobItp,
          structureContext: structureContextItp,
        },
        "ITP"
      ),
      ...structureTagsFor(
        {
          structurePool: structurePoolStp,
          structureJob: structureJobStp,
          structureContext: structureContextStp,
        },
        "STP"
      ),
      ...relativeTagsFor({ relativeLevels, relativeSequence }, "LTP"),
      ...relativeTagsFor(
        {
          relativeLevels: relativeLevelsItp,
          relativeSequence: relativeSequenceItp,
        },
        "ITP"
      ),
      ...relativeTagsFor(
        {
          relativeLevels: relativeLevelsStp,
          relativeSequence: relativeSequenceStp,
        },
        "STP"
      ),
      ...openingGapTagsFor(
        { openingGap, gapJob, gapFramework, gapClose, gapOpen },
        "LTP"
      ),
      ...openingGapTagsFor(
        {
          openingGap: openingGapItp,
          gapJob: gapJobItp,
          gapFramework: gapFrameworkItp,
          gapClose: gapCloseItp,
          gapOpen: gapOpenItp,
        },
        "ITP"
      ),
      ...openingGapTagsFor(
        {
          openingGap: openingGapStp,
          gapJob: gapJobStp,
          gapFramework: gapFrameworkStp,
          gapClose: gapCloseStp,
          gapOpen: gapOpenStp,
        },
        "STP"
      ),
      ...ipdaTagsFor(formData.setupType, formData.liquiditySide, "LTP"),
      ...ipdaTagsFor(setupTypeItp, liquiditySideItp, "ITP"),
      ...ipdaTagsFor(setupTypeStp, liquiditySideStp, "STP"),
      ...institutionalTagsFor(institutionalChecks, "LTP"),
      ...institutionalTagsFor(institutionalChecksItp, "ITP"),
      ...institutionalTagsFor(institutionalChecksStp, "STP"),
      ...mmxmTagsFor(
        { mmxmType, iofSide, iofAlignment, mmxmSequence },
        "LTP"
      ),
      ...mmxmTagsFor(
        {
          mmxmType: mmxmTypeItp,
          iofSide: iofSideItp,
          iofAlignment: iofAlignmentItp,
          mmxmSequence: mmxmSequenceItp,
        },
        "ITP"
      ),
      ...mmxmTagsFor(
        {
          mmxmType: mmxmTypeStp,
          iofSide: iofSideStp,
          iofAlignment: iofAlignmentStp,
          mmxmSequence: mmxmSequenceStp,
        },
        "STP"
      ),
      ...perspectiveTagsFor({
        itpFlow: mtfBias,
        stpFlow: ltfBias,
        aligned: alignment.aligned,
        stage: alignment.stage,
      }),
      ...candleTagsFor({
        candlePath,
        candleFormation,
        candleEntry,
        candleEnd,
      }),
      ...ltpIofTagsFor({
        side: ltpIof,
        checks: ltpIofChecks,
      }),
      ...dealingTagsFor(
        {
          formation: dealingFormation,
          high: dealingHigh,
          low: dealingLow,
          jobs: dealingJobs,
          delivery: dealingDelivery,
          ltfIntoKl,
          premiumDiscount: pd,
        },
        "LTP"
      ),
      ...dealingTagsFor(
        {
          formation: dealingFormationItp,
          high: dealingHighItp,
          low: dealingLowItp,
          jobs: dealingJobsItp,
          delivery: dealingDeliveryItp,
          ltfIntoKl: ltfIntoKlItp,
        },
        "ITP"
      ),
      ...dealingTagsFor(
        {
          formation: dealingFormationStp,
          high: dealingHighStp,
          low: dealingLowStp,
          jobs: dealingJobsStp,
          delivery: dealingDeliveryStp,
          ltfIntoKl: ltfIntoKlStp,
        },
        "STP"
      ),
      ...htfKlTagsFor({
        type: htfKlType,
        job: htfKlJob,
        path: htfKlPath,
        context: htfKlContext,
        closure: htfKlClose,
      }),
      ...klRangeTagsFor({
        pair: klRangePair,
        build: rangeBuild,
        tools: rangeTfTools,
        consolPath,
        oneCandleConsol,
      }),
      ...closureTagsFor({
        signatures: closeSignatures,
        context: closeContext,
      }),
      ...seasonalTagsFor({
        month: typeof seasonalMonth === "number" ? seasonalMonth : nyMonth,
        quarterDraw,
        smtPair,
        smtRead,
        permabull: true,
      }),
      ...weekProfileTagsFor({
        color: weekColor,
        day: weekDay,
        extreme: weekExtreme,
        steps: weekProfileSteps,
        rangeRun: weekRangeRun,
        notes: weekNotes,
      }),
      ...itpChartTagsFor({
        horizon: itpHorizon,
        toc: itpToc,
        scenario: itpScenario,
        tradingRange: itpTradingRange,
        ltpBias: formData.htfBias,
      }),
      ...stpKlTagsFor({
        pair: stpKlPair,
        notes: stpKlNotes,
      }),
      ...purgeTagsFor({
        stack: purgeStack,
        side: purgeSide,
        quals: purgeQuals,
      }),
      ...stpOpenTagsFor({
        window: stpWindow,
        openRole: equityOpenRole,
        sessions: prevSessions,
        amPlan,
        waitEql,
        midnightOpen,
        open0830,
        midnightRun,
        vsBoth: vsOpens?.both ?? null,
      }),
      ...newsTagsFor({
        event: newsEvent,
        role0830: news0830,
        role0930: news0930,
        role10: news10,
        tells: newsTells,
      }),
      ...eqOpenTagsFor({
        read0930: eqo930,
        manipScene: eqoManipScene,
        distScene: eqoDistScene,
        manipQ: eqoManipQ,
        distQ: eqoDistQ,
      }),
      ...(openingPrice ? [`Open ${openingPrice}`] : []),
    ]
    setIsSubmitting(true)
    try {
      const screenshotUrls = [
        ...chartLinks,
        ...(await uploadScreenshots()),
      ]
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
        setChartLinks([])
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
  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
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
  const toggleStructureContext = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      structureContext: prev.structureContext.includes(id)
        ? prev.structureContext.filter((step) => step !== id)
        : [...prev.structureContext, id],
    }))
  }
  const toggleList = (
    field:
      | "relativeLevels"
      | "relativeSequence"
      | "gapFramework"
      | "institutionalChecks"
      | "institutionalChecksItp"
      | "institutionalChecksStp"
      | "mmxmSequence"
      | "ltpIofChecks"
      | "dealingJobs"
      | "htfKlContext"
      | "rangeTfTools"
      | "closeSignatures"
      | "closeContext"
      | "weekProfileSteps"
      | "weekNotes"
      | "itpToc"
      | "stpKlNotes"
      | "purgeQuals"
      | "prevSessions"
      | "newsTells"
      | "eqoManipQ"
      | "eqoDistQ",
    id: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter((item) => item !== id)
        : [...prev[field], id],
    }))
  }
  const setBias = (bias: string) => {
    setFormData((prev) => {
      const resetFlow =
        bias !== prev.htfBias ? { mtfBias: "NONE", ltfBias: "NONE" } : {}
      const patch: Partial<FormState> = { htfBias: bias, ...resetFlow }
      if (prev.deferredDelivery) {
        Object.assign(patch, deferredDefaults(bias))
      }
      if (prev.deferredDeliveryItp) {
        const d = deferredDefaults(
          prev.mtfBias !== "NONE" ? prev.mtfBias : bias
        )
        patch.deferCandleItp = d.deferCandle
        patch.opposingStopsItp = d.opposingStops
      }
      if (prev.deferredDeliveryStp) {
        const d = deferredDefaults(
          prev.ltfBias !== "NONE" ? prev.ltfBias : bias
        )
        patch.deferCandleStp = d.deferCandle
        patch.opposingStopsStp = d.opposingStops
      }
      return { ...prev, ...patch }
    })
  }
  const ctx = {
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
    setShowWhy,
    logTab,
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
    nyWeekDay,
    weekDayId,
    weekStat,
    lotManual,
    setLotManual,
    journalName,
    balanceLoading,
    screenshots,
    setScreenshots,
    chartLinks,
    setChartLinks,
  }

  return (
    <Sheet
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
          setLogTab("LTP")
          setScreenshots([])
          setChartLinks([])
          void loadJournalBalance()
        }
      }}
    >
      <SheetTrigger asChild>
        <Button className="h-10 gap-2 rounded-xl bg-[#2563EB] px-3 font-bold text-white shadow-none transition-all hover:bg-[#1D4ED8] active:scale-95 sm:px-5">
          <Plus className="h-4 w-4 stroke-[3px]" />
          <span className="hidden sm:inline">Log Trade</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="h-dvh max-h-dvh w-full overflow-hidden border-border bg-background p-0 sm:max-w-[520px] lg:max-w-[560px]"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="shrink-0 p-3 pr-12 pb-0 sm:p-4 sm:pr-12 sm:pb-0">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-lg font-semibold text-foreground">
                  Log trade
                </SheetTitle>
                <Badge variant="soft" className="text-[10px] font-semibold tracking-wider uppercase">
                  LTP · ITP · STP
                </Badge>
              </div>
            </div>
            {/* NY clock + killzone context (suggestion only) */}
            <div className="mb-3 flex flex-wrap items-start gap-2 rounded-lg border border-border px-3 py-2 sm:items-center sm:gap-3">
              <Clock className="h-4 w-4 text-[#2563EB]" />
              <div className="flex min-w-0 flex-col">
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Entry in New York ({ny.offsetLabel})
                </span>
                <span className="text-sm font-bold text-foreground">
                  {ny.dateLabel} · {ny.timeLabel} NY
                </span>
              </div>
              <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto sm:justify-end">
                {selectedKzLabel ? (
                  <Badge className="border-none bg-[#2563EB] text-[10px] font-bold text-white">
                    {selectedKzLabel}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] font-semibold">
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
          <LogTradeProvider value={ctx}>
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-3 pt-2 sm:p-4 sm:pt-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] dark:[&::-webkit-scrollbar-thumb]:bg-white/20">
            <ExecuteFields />
            <section className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#2563EB]" />
                  <span className="text-sm font-bold text-foreground">
                    Models
                  </span>
                </div>
                <p className={cn("text-xs leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                  One perspective at a time. Same orderflow on LTP, ITP, and
                  STP is the only time you execute. If you can come to an LTP
                  but not an ITP, you do not move to STP. There is no trade.
                </p>
              </div>
              <p
                className={cn(
                  "rounded-xl border px-3 py-2 text-xs leading-relaxed font-semibold",
                  alignment.aligned
                    ? "border-[#2563EB] bg-[#2563EB]/5 text-[#2563EB]"
                    : "border-border bg-transparent text-muted-foreground"
                )}
              >
                {alignment.message}
              </p>
              <div className="flex items-center gap-1">
                {(["LTP", "ITP", "STP"] as const).map((tab) => {
                  const locked =
                    (tab === "ITP" && !itpUnlocked) ||
                    (tab === "STP" && !stpUnlocked)
                  const on = logTab === tab
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setLogTab(tab)}
                      className={cn(
                        "h-8 flex-1 rounded-md text-[12px] font-semibold transition-colors",
                        on
                          ? "bg-[#2563EB] text-white"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                        locked && !on && "opacity-50"
                      )}
                    >
                      {tab}
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setShowWhy((v) => !v)}
                  className={cn(
                    "ml-1 h-8 shrink-0 rounded-md px-2.5 text-[11px] font-semibold",
                    showWhy
                      ? "bg-[#2563EB]/10 text-[#2563EB]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Why
                </button>
              </div>
              {logTab === "LTP" ? <LtpModel /> : null}
              {logTab === "ITP" ? <ItpModel /> : null}
              {logTab === "STP" ? <StpModel /> : null}
            </section>
            <ExecuteNotes />
          </div>
          </LogTradeProvider>
          <SheetFooter className="flex shrink-0 flex-row items-center justify-stretch gap-3 border-t border-border bg-background p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:justify-end sm:p-4">
            <Button
              variant="ghost"
              className="h-10 flex-1 rounded-lg px-4 font-semibold text-muted-foreground hover:text-foreground sm:h-9 sm:flex-none"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="h-10 min-w-0 flex-1 rounded-lg bg-[#2563EB] px-6 font-semibold text-white shadow-none hover:bg-[#1D4ED8] disabled:opacity-50 sm:h-9 sm:min-w-[120px] sm:flex-none"
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
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
