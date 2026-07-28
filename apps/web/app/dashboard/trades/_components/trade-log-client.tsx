"use client"

import * as React from "react"
import { Search, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  getNyParts,
  killzoneLabel,
  setupTypeShort,
  SETUP_TYPES,
  KILLZONES,
} from "@/lib/trading"
import {
  TableSection,
  TableHeader,
  TableRow,
  TableLabel,
  TableCell,
  formatUsd,
  pnlClass,
} from "../../_components/data-table"

export type SerializedTrade = {
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
  mtfTimeframe: string | null
  ltfTimeframe: string | null
  liquidityTaken: boolean
  liquiditySide: string | null
  dateOpened: string
}

const PAGE_SIZE = 12
const COLS = ["Setup", "R Multiple", "Net Profit / Loss", "Outcome"] as const

function outcomeLabel(outcome: string | null) {
  if (outcome === "WIN") return "Win"
  if (outcome === "LOSS") return "Loss"
  if (outcome === "BREAKEVEN") return "B.E."
  return "Open"
}

export function TradeLogClient({ trades }: { trades: SerializedTrade[] }) {
  const [query, setQuery] = React.useState("")
  const [direction, setDirection] = React.useState("all")
  const [outcome, setOutcome] = React.useState("all")
  const [setup, setSetup] = React.useState("all")
  const [killzone, setKillzone] = React.useState("all")
  const [page, setPage] = React.useState(1)

  const filtered = React.useMemo(() => {
    return trades.filter((t) => {
      if (query && !t.pair.toLowerCase().includes(query.toLowerCase())) {
        return false
      }
      if (direction !== "all") {
        const d = t.direction.toLowerCase()
        if (direction === "long" && !(d === "buy" || d === "long")) return false
        if (direction === "short" && !(d === "sell" || d === "short"))
          return false
      }
      if (outcome !== "all") {
        const o = (t.outcome || "PENDING").toUpperCase()
        if (outcome === "win" && o !== "WIN") return false
        if (outcome === "loss" && o !== "LOSS") return false
        if (outcome === "be" && o !== "BREAKEVEN") return false
        if (outcome === "pending" && o !== "PENDING") return false
      }
      if (setup !== "all" && t.setupType !== setup) return false
      if (killzone !== "all" && t.killzone !== killzone) return false
      return true
    })
  }, [trades, query, direction, outcome, setup, killzone])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  React.useEffect(() => {
    setPage(1)
  }, [query, direction, outcome, setup, killzone])

  return (
    <div className="flex flex-col gap-6 py-4 lg:py-6 relative min-h-full">
      <div className="mx-4 lg:mx-8 rounded-xl border border-[#E5E7EB] bg-white p-4 flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pair (e.g. EURUSD, XAUUSD)..."
            className="pl-10 h-10 border-[#E5E7EB] bg-white rounded-lg shadow-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              [direction, setDirection, "all", [["all", "All sides"], ["long", "Long"], ["short", "Short"]], 110],
              [outcome, setOutcome, "all", [["all", "All"], ["win", "Win"], ["loss", "Loss"], ["be", "B.E."], ["pending", "Pending"]], 110],
            ] as const
          ).map(([value, setter, , items, width], i) => (
            <Select key={i} value={value} onValueChange={setter}>
              <SelectTrigger
                className="h-10 border-[#E5E7EB] rounded-lg font-medium text-[#64748B] shadow-none"
                style={{ width }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {items.map(([v, label]) => (
                  <SelectItem key={v} value={v}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          <Select value={setup} onValueChange={setSetup}>
            <SelectTrigger className="w-[130px] h-10 border-[#E5E7EB] rounded-lg font-medium text-[#64748B] shadow-none">
              <SelectValue placeholder="Setup" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all">All setups</SelectItem>
              {SETUP_TYPES.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.short}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={killzone} onValueChange={setKillzone}>
            <SelectTrigger className="w-[140px] h-10 border-[#E5E7EB] rounded-lg font-medium text-[#64748B] shadow-none">
              <SelectValue placeholder="Killzone" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all">All KZ</SelectItem>
              {KILLZONES.map((k) => (
                <SelectItem key={k.id} value={k.id}>
                  {k.label}
                </SelectItem>
              ))}
              <SelectItem value="OUTSIDE">Outside</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TableSection title="Trade log">
        <TableHeader columns={[...COLS]} />
        {pageRows.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[#94A3B8]">
            No trades match these filters.
          </div>
        ) : (
          pageRows.map((trade) => {
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
          })
        )}
      </TableSection>

      <div className="mx-4 lg:mx-8 flex items-center justify-between">
        <div className="text-[12px] text-[#64748B]">
          Showing{" "}
          <span className="font-semibold text-[#1E293B] dark:text-slate-100">
            {pageRows.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#1E293B] dark:text-slate-100">
            {filtered.length}
          </span>{" "}
          trades
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-[#94A3B8]"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-[12px] font-semibold text-[#64748B] px-2">
            {safePage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-[#94A3B8]"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
