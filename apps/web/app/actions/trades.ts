"use server"

import { getOrCreatePrismaUser } from "@/lib/auth"
import { getActiveJournal, syncJournalBalance } from "@/lib/journals"
import {
  calculateOteZone,
  calculateTradeMetrics,
  killzoneToSession,
  normalizePair,
  resolveRiskDollars,
  type KillzoneId,
  type TradeDirection,
} from "@/lib/trading"
import { prisma } from "@workspace/db"
import { revalidatePath } from "next/cache"

export type LogTradeInput = {
  pair: string
  direction: string
  entry: string | number
  exit?: string | number | null
  stopLoss: string | number
  takeProfit?: string | number | null
  lotSize: string | number
  accountBalance?: string | number | null
  risk?: string | number | null
  riskType?: "percent" | "amount"
  psychologyNote?: string | null
  tags?: string[]
  screenshotUrls?: string[]
  setupType?: string | null
  poiHigh?: string | number | null
  poiLow?: string | number | null
  swingHigh?: string | number | null
  swingLow?: string | number | null
  liquiditySide?: string | null
  liquidityTaken?: boolean
  mssConfirmed?: boolean
  htfTimeframe?: string | null
  htfBias?: string | null
  htfNarrative?: string | null
  mtfTimeframe?: string | null
  mtfNarrative?: string | null
  ltfTimeframe?: string | null
  entryModel?: string | null
  dateOpened?: string | null
  killzone?: string | null
  session?: string | null
}

function num(v: string | number | null | undefined): number | null {
  if (v === "" || v == null) return null
  const n = typeof v === "number" ? v : parseFloat(v)
  return Number.isFinite(n) ? n : null
}

export async function logTrade(formData: LogTradeInput) {
  try {
    const user = await getOrCreatePrismaUser()

    if (!user) {
      return { success: false, error: "You must be signed in to log a trade." }
    }

    const journal = await getActiveJournal(user)

    const entry = num(formData.entry)
    const stopLoss = num(formData.stopLoss)
    const takeProfit = num(formData.takeProfit)
    const exit = num(formData.exit)
    const lotSize = num(formData.lotSize)
    const directionRaw = (formData.direction || "buy").toLowerCase()
    const direction: TradeDirection =
      directionRaw === "sell" || directionRaw === "short" ? "sell" : "buy"
    const pair = normalizePair(formData.pair)

    if (entry == null || stopLoss == null || lotSize == null || !pair) {
      return {
        success: false,
        error: "Pair, entry, stop loss, and lot size are required.",
      }
    }

    if (entry === stopLoss) {
      return { success: false, error: "Stop loss cannot equal entry." }
    }

    const metrics = calculateTradeMetrics({
      pair,
      direction,
      entry,
      stopLoss,
      takeProfit,
      exit,
      lotSize,
    })

    const dateOpened = formData.dateOpened
      ? new Date(formData.dateOpened)
      : new Date()

    if (!formData.killzone) {
      return {
        success: false,
        error:
          "Select the ICT killzone you traded (manual — not inferred from journal time).",
      }
    }
    const killzone = formData.killzone as KillzoneId
    const session =
      formData.session ||
      killzoneToSession(killzone === "OUTSIDE" ? "NY_AM" : killzone)

    const swingHigh = num(formData.swingHigh)
    const swingLow = num(formData.swingLow)
    let oteHigh = null as number | null
    let oteLow = null as number | null

    if (swingHigh != null && swingLow != null) {
      const ote = calculateOteZone(direction, swingHigh, swingLow)
      if (ote) {
        oteHigh = ote.oteHigh
        oteLow = ote.oteLow
      }
    }

    const balance = journal.currentBalance
    const riskVal = num(formData.risk)
    let riskAmount = metrics.riskAmount
    let riskPercent: number | null = null

    if (riskVal != null && formData.riskType) {
      riskAmount = resolveRiskDollars({
        balance,
        riskValue: riskVal,
        riskType: formData.riskType,
      })
      riskPercent =
        formData.riskType === "percent"
          ? riskVal
          : balance > 0
            ? (riskAmount / balance) * 100
            : null
    } else if (balance > 0) {
      riskPercent = (riskAmount / balance) * 100
    }

    const trade = await prisma.trade.create({
      data: {
        userId: user.id,
        journalId: journal.id,
        pair,
        direction: direction.toUpperCase(),
        entry,
        exit,
        stopLoss,
        takeProfit,
        lotSize,
        rr: metrics.plannedRr,
        rMultiple: metrics.rMultiple,
        result: metrics.result,
        outcome: metrics.outcome,
        session,
        killzone,
        tags: formData.tags || [],
        psychologyNote: formData.psychologyNote || null,
        screenshotUrls: formData.screenshotUrls || [],
        accountBalance: balance,
        riskAmount,
        riskPercent,
        setupType: formData.setupType || null,
        poiHigh: num(formData.poiHigh),
        poiLow: num(formData.poiLow),
        swingHigh,
        swingLow,
        oteHigh,
        oteLow,
        liquiditySide: formData.liquiditySide || null,
        liquidityTaken: Boolean(formData.liquidityTaken),
        mssConfirmed: Boolean(formData.mssConfirmed),
        htfTimeframe: formData.htfTimeframe || null,
        htfBias: formData.htfBias || null,
        htfNarrative: formData.htfNarrative || null,
        mtfTimeframe: formData.mtfTimeframe || null,
        mtfNarrative: formData.mtfNarrative || null,
        ltfTimeframe: formData.ltfTimeframe || null,
        entryModel: formData.entryModel || null,
        dateOpened,
        dateClosed: exit != null ? dateOpened : null,
      },
    })

    // Keep journal equity in sync after closed trades
    await syncJournalBalance(journal.id)

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/trades")
    revalidatePath("/dashboard/settings")
    return { success: true, trade }
  } catch (error) {
    console.error("Failed to log trade:", error)
    return { success: false, error: "Failed to log trade" }
  }
}

export async function getUserTrades() {
  const user = await getOrCreatePrismaUser()
  if (!user) return []

  const journal = await getActiveJournal(user)

  return prisma.trade.findMany({
    where: { userId: user.id, journalId: journal.id },
    orderBy: { dateOpened: "desc" },
  })
}
