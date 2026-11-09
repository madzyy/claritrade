import {
  biasShort,
  getNyParts,
  killzoneLabel,
  profileShort,
  rangeLiquidityShort,
  rangeTypeShort,
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
    tags: string[]
    htfTimeframe: string | null
    ltfTimeframe: string | null
    liquidityTaken: boolean
    screenshotUrls: string[]
    dateOpened: Date
  }>
}

const COLS = ["LTP", "R Multiple", "Net Profit / Loss", "Outcome"] as const

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
        const profile = profileShort(trade.setupType)
        const range = rangeTypeShort(trade.tags)
        const draw = rangeLiquidityShort(trade.tags)
        const ltp = draw
          ? `${biasShort(trade.htfBias)} · ${draw}`
          : biasShort(trade.htfBias)
        const bits = [range, profile === "—" ? "" : profile].filter(Boolean)
        return (
          <TableRow key={trade.id}>
            <TableLabel
              title={`${trade.pair} · ${side}`}
              subtitle={`${bits.length ? `${bits.join(" · ")} · ` : ""}${killzoneLabel(trade.killzone)} · ${ny.dateLabel} ${ny.timeLabel} NY`}
            />
            <TableCell label="LTP">{ltp}</TableCell>
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
