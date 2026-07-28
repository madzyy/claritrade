import {
  getNyParts,
  killzoneLabel,
  setupTypeShort,
} from "@/lib/trading"
import {
  TableSection,
  TableHeader,
  TableRow,
  TableLabel,
  TableCell,
  formatUsd,
  pnlClass,
} from "./data-table"

interface RecentTradesProps {
  trades: Array<{
    id: string
    pair: string
    direction: string
    entry: number
    exit: number | null
    rr: number | null
    rMultiple: number | null
    result: number | null
    outcome: string | null
    setupType: string | null
    killzone: string | null
    htfBias: string | null
    htfTimeframe: string | null
    ltfTimeframe: string | null
    liquidityTaken: boolean
    screenshotUrls: string[]
    dateOpened: Date
  }>
}

const COLS = ["Setup", "R Multiple", "Net Profit / Loss", "Outcome"] as const

function outcomeLabel(outcome: string | null) {
  if (outcome === "WIN") return "Win"
  if (outcome === "LOSS") return "Loss"
  if (outcome === "BREAKEVEN") return "B.E."
  return "Open"
}

export function RecentTrades({ trades }: RecentTradesProps) {
  return (
    <TableSection
      title="Recent trades"
      action={
        <a
          href="/dashboard/trades"
          className="text-[13px] font-medium text-[#3B82F6] hover:underline"
        >
          View all
        </a>
      }
    >
      <TableHeader columns={[...COLS]} />
      {trades.map((trade) => {
        const ny = getNyParts(new Date(trade.dateOpened))
        const dir = trade.direction.toUpperCase()
        const side = dir === "BUY" || dir === "LONG" ? "Long" : "Short"
        return (
          <TableRow key={trade.id}>
            <TableLabel
              title={`${trade.pair} · ${side}`}
              subtitle={`${killzoneLabel(trade.killzone)} · ${ny.dateLabel} ${ny.timeLabel} NY`}
            />
            <TableCell label="Setup">
              {setupTypeShort(trade.setupType)}
            </TableCell>
            <TableCell label="R">
              {trade.rMultiple != null
                ? `${trade.rMultiple >= 0 ? "+" : ""}${trade.rMultiple.toFixed(2)}R`
                : trade.rr != null
                  ? `${trade.rr.toFixed(1)} RR`
                  : "—"}
            </TableCell>
            <TableCell label="Net P/L" className={pnlClass(trade.result)}>
              {formatUsd(trade.result)}
            </TableCell>
            <TableCell label="Outcome">
              {outcomeLabel(trade.outcome)}
            </TableCell>
          </TableRow>
        )
      })}
    </TableSection>
  )
}
