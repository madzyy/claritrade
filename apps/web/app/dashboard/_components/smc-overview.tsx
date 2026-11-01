import { BIAS_OPTIONS, KILLZONES, MARKET_PROFILES, formatSessionWindow } from "@/lib/trading"
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
  byBias: Record<string, Bucket>
  byProfile: Record<string, Bucket>
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

const COLS = ["Trades", "Net Profit / Loss", "Profit Factor", "Win Rate"] as const

export function SmcOverview({
  byKillzone,
  byBias,
  byProfile,
  hasTrades,
}: SmcOverviewProps) {
  return (
    <div className="flex flex-col gap-8">
      <TableSection title="Sessions">
        <TableHeader columns={[...COLS]} />
        {KILLZONES.map((kz) => {
          const bucket = byKillzone[kz.id]
          const wr = rate(bucket)
          const pf = profitFactor(bucket)
          const has = Boolean(bucket?.total)
          return (
            <TableRow key={kz.id}>
              <TableLabel title={kz.label} subtitle={formatSessionWindow(kz)} />
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

      <TableSection title="Market profile">
        <TableHeader columns={[...COLS]} />
        {MARKET_PROFILES.map((profile) => {
          const bucket = byProfile[profile.id]
          const wr = rate(bucket)
          const pf = profitFactor(bucket)
          const has = Boolean(bucket?.total)
          return (
            <TableRow key={profile.id}>
              <TableLabel title={profile.label} subtitle="IPDA" />
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

      <TableSection title="Next HTF candle">
        <TableHeader columns={[...COLS]} />
        {BIAS_OPTIONS.map((bias) => {
          const bucket = byBias[bias.id]
          const wr = rate(bucket)
          const pf = profitFactor(bucket)
          const has = Boolean(bucket?.total)
          return (
            <TableRow key={bias.id}>
              <TableLabel title={bias.label} subtitle="LTP" />
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
