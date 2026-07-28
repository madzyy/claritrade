import { KILLZONES, SETUP_TYPES } from "@/lib/trading"
import {
  TableSection,
  TableHeader,
  TableRow,
  TableLabel,
  TableCell,
  formatPct,
  formatPf,
  formatUsd,
  pnlClass,
} from "./data-table"

type Bucket = {
  wins: number
  total: number
  pnl: number
  grossWin: number
  grossLoss: number
}

interface SmcOverviewProps {
  byKillzone: Record<string, Bucket>
  bySetup: Record<string, Bucket>
  hasTrades: boolean
}

function rate(bucket?: Bucket) {
  if (!bucket || bucket.total === 0) return null
  return (bucket.wins / bucket.total) * 100
}

function profitFactor(bucket?: Bucket) {
  if (!bucket || bucket.total === 0) return null
  if (bucket.grossLoss <= 0) {
    return bucket.grossWin > 0 ? Infinity : null
  }
  return bucket.grossWin / bucket.grossLoss
}

function endLabel(endHour: number) {
  return `${String(endHour).padStart(2, "0")}:00`
}

const COLS = ["Trades", "Net Profit / Loss", "Profit Factor", "Win Rate"] as const

export function SmcOverview({
  byKillzone,
  bySetup,
  hasTrades,
}: SmcOverviewProps) {
  return (
    <div className="flex flex-col gap-8">
      <TableSection title="Killzone edge">
        <TableHeader columns={[...COLS]} />
        {KILLZONES.map((kz) => {
          const bucket = byKillzone[kz.id]
          const wr = rate(bucket)
          const pf = profitFactor(bucket)
          const has = Boolean(bucket?.total)
          return (
            <TableRow key={kz.id}>
              <TableLabel
                title={kz.label}
                subtitle={`${String(kz.startHour).padStart(2, "0")}:00–${endLabel(kz.endHour)} NY`}
              />
              <TableCell label="Trades">
                {has ? bucket!.total : hasTrades ? "0" : "—"}
              </TableCell>
              <TableCell
                label="Net P/L"
                className={has ? pnlClass(bucket!.pnl) : undefined}
              >
                {has ? formatUsd(bucket!.pnl) : "—"}
              </TableCell>
              <TableCell label="Profit Factor">
                {has ? formatPf(pf) : "—"}
              </TableCell>
              <TableCell label="Win Rate">
                {wr != null ? formatPct(wr) : "—"}
              </TableCell>
            </TableRow>
          )
        })}
      </TableSection>

      <TableSection title="Setup performance">
        <TableHeader columns={[...COLS]} />
        {SETUP_TYPES.map((setup) => {
          const bucket = bySetup[setup.id]
          const wr = rate(bucket)
          const pf = profitFactor(bucket)
          const has = Boolean(bucket?.total)
          return (
            <TableRow key={setup.id}>
              <TableLabel title={setup.label} subtitle={setup.short} />
              <TableCell label="Trades">
                {has ? bucket!.total : hasTrades ? "0" : "—"}
              </TableCell>
              <TableCell
                label="Net P/L"
                className={has ? pnlClass(bucket!.pnl) : undefined}
              >
                {has ? formatUsd(bucket!.pnl) : "—"}
              </TableCell>
              <TableCell label="Profit Factor">
                {has ? formatPf(pf) : "—"}
              </TableCell>
              <TableCell label="Win Rate">
                {wr != null ? formatPct(wr) : "—"}
              </TableCell>
            </TableRow>
          )
        })}
      </TableSection>
    </div>
  )
}
