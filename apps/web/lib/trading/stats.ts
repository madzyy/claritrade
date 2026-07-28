export interface TradeLike {
  outcome: string | null
  result: number | null
  rr: number | null
  rMultiple?: number | null
  dateOpened: Date | string
}

export interface JournalStats {
  totalTrades: number
  closedTrades: number
  winRate: number
  netPnL: number
  avgPlannedRr: number
  avgRMultiple: number
  profitFactor: number
  expectancyR: number
}

export function computeJournalStats(trades: TradeLike[]): JournalStats {
  const closed = trades.filter(
    (t) => t.outcome && t.outcome !== "PENDING"
  )
  const wins = closed.filter((t) => t.outcome === "WIN")
  const losses = closed.filter((t) => t.outcome === "LOSS")

  const winRate =
    closed.length > 0 ? (wins.length / closed.length) * 100 : 0

  const netPnL = trades.reduce((acc, t) => acc + (t.result ?? 0), 0)

  const withRr = trades.filter((t) => t.rr != null && t.rr > 0)
  const avgPlannedRr =
    withRr.length > 0
      ? withRr.reduce((acc, t) => acc + (t.rr ?? 0), 0) / withRr.length
      : 0

  const withR = closed.filter(
    (t) => t.rMultiple != null && !Number.isNaN(t.rMultiple)
  )
  const avgRMultiple =
    withR.length > 0
      ? withR.reduce((acc, t) => acc + (t.rMultiple ?? 0), 0) / withR.length
      : 0

  const grossProfit = wins.reduce((acc, t) => acc + Math.max(t.result ?? 0, 0), 0)
  const grossLoss = Math.abs(
    losses.reduce((acc, t) => acc + Math.min(t.result ?? 0, 0), 0)
  )
  const profitFactor =
    grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0

  const expectancyR = avgRMultiple

  return {
    totalTrades: trades.length,
    closedTrades: closed.length,
    winRate,
    netPnL,
    avgPlannedRr,
    avgRMultiple,
    profitFactor: Number.isFinite(profitFactor) ? profitFactor : 0,
    expectancyR,
  }
}

export function buildEquityCurve(
  trades: TradeLike[],
  startingBalance = 10_000
): { day: string; value: number }[] {
  let balance = startingBalance
  const points = [
    {
      day: "START",
      value: startingBalance,
    },
  ]

  for (const t of trades) {
    balance += t.result ?? 0
    const d = new Date(t.dateOpened)
    points.push({
      day: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "America/New_York",
      }),
      value: balance,
    })
  }

  return points
}
