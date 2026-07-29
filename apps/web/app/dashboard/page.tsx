import { prisma } from "@workspace/db"
import { getOrCreatePrismaUser } from "@/lib/auth"
import { getActiveJournal } from "@/lib/journals"
import { StatCards } from "./_components/stat-cards"
import { PerformanceChart } from "./_components/performance-chart"
import { RecentTrades } from "./_components/recent-trades"
import { EmptyState } from "./_components/empty-state"
import { SessionStrip } from "./_components/session-strip"
import { SmcOverview } from "./_components/smc-overview"
import { TrendingUp, Percent, Target, BarChart3 } from "lucide-react"
import { buildEquityCurve, computeJournalStats } from "@/lib/trading"

export const dynamic = "force-dynamic"

type Bucket = {
  wins: number
  total: number
  pnl: number
  grossWin: number
  grossLoss: number
}

function emptyBucket(): Bucket {
  return { wins: 0, total: 0, pnl: 0, grossWin: 0, grossLoss: 0 }
}

export default async function DashboardPage() {
  const user = await getOrCreatePrismaUser()
  const journal = user ? await getActiveJournal(user) : null

  const allTrades =
    user && journal
      ? await prisma.trade.findMany({
          where: { userId: user.id, journalId: journal.id },
          orderBy: { dateOpened: "asc" },
        })
      : []

  const statsCalc = computeJournalStats(allTrades)
  const startBal = journal?.startingBalance ?? 10_000
  const chartData = buildEquityCurve(allTrades, startBal)
  const hasTrades = allTrades.length > 0
  const closed = allTrades.filter((t) => t.outcome && t.outcome !== "PENDING")

  const byKillzone: Record<string, Bucket> = {}
  const bySetup: Record<string, Bucket> = {}

  for (const t of closed) {
    const result = t.result ?? 0
    const kz = t.killzone || "OUTSIDE"
    byKillzone[kz] ??= emptyBucket()
    byKillzone[kz]!.total += 1
    byKillzone[kz]!.pnl += result
    if (result > 0) byKillzone[kz]!.grossWin += result
    if (result < 0) byKillzone[kz]!.grossLoss += Math.abs(result)
    if (t.outcome === "WIN") byKillzone[kz]!.wins += 1

    const setup = t.setupType || "OTHER"
    bySetup[setup] ??= emptyBucket()
    bySetup[setup]!.total += 1
    bySetup[setup]!.pnl += result
    if (result > 0) bySetup[setup]!.grossWin += result
    if (result < 0) bySetup[setup]!.grossLoss += Math.abs(result)
    if (t.outcome === "WIN") bySetup[setup]!.wins += 1
  }

  const pnlTone =
    statsCalc.netPnL > 0
      ? "positive"
      : statsCalc.netPnL < 0
        ? "negative"
        : "neutral"

  const stats = [
    {
      label: "NET P&L",
      value: `${statsCalc.netPnL >= 0 ? "+" : "-"}$${Math.abs(statsCalc.netPnL).toFixed(2)}`,
      hint: hasTrades ? "Closed trade profit & loss" : "Waiting for first close",
      tone: pnlTone as "positive" | "negative" | "neutral",
      icon: TrendingUp,
    },
    {
      label: "WIN RATE",
      value: hasTrades ? `${statsCalc.winRate.toFixed(1)}%` : "—",
      hint:
        statsCalc.closedTrades > 0
          ? `${statsCalc.closedTrades} closed trades`
          : "Closed trades only",
      tone: "neutral" as const,
      icon: Percent,
    },
    {
      label: "AVG R",
      value:
        statsCalc.avgRMultiple !== 0
          ? `${statsCalc.avgRMultiple >= 0 ? "+" : ""}${statsCalc.avgRMultiple.toFixed(2)}R`
          : hasTrades && statsCalc.avgPlannedRr > 0
            ? `${statsCalc.avgPlannedRr.toFixed(1)} RR`
            : "—",
      hint: "Realized R vs stop distance",
      tone: "neutral" as const,
      icon: Target,
    },
    {
      label: "TRADES",
      value: `${statsCalc.closedTrades}`,
      hint:
        statsCalc.totalTrades > statsCalc.closedTrades
          ? `${statsCalc.totalTrades - statsCalc.closedTrades} still open`
          : hasTrades
            ? "All closed"
            : "Log an SMC setup to begin",
      tone: "neutral" as const,
      icon: BarChart3,
    },
  ]

  const recent = [...allTrades].reverse().slice(0, 8)

  return (
    <div className="flex flex-col gap-4 lg:gap-5 pb-10">
      <SessionStrip />
      <StatCards stats={stats} />
      <PerformanceChart
        data={chartData}
        hasTrades={closed.length > 0}
        startingBalance={startBal}
      />
      <SmcOverview
        byKillzone={byKillzone}
        bySetup={bySetup}
        hasTrades={hasTrades}
      />
      {recent.length > 0 ? <RecentTrades trades={recent} /> : <EmptyState />}
    </div>
  )
}
