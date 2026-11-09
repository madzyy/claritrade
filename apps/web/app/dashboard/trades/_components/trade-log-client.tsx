"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, PencilLine, RefreshCw } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"
import { dashTableWrap, dashTd, dashTh } from "@/lib/dashboard-theme"
import { pnlClass } from "../../_components/data-table"

export type SerializedTrade = {
  id: string
  pair: string
  direction: string
  lotSize: number
  stopLoss: number
  takeProfit: number | null
  entryModel: string | null
  tags: string[]
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
  dateClosed?: string | null
  accountBalance?: number | null
}

type Row = {
  id: string
  pair: string
  side: string
  size: string
  trade: string
  stopLoss: string
  fees: string
  takeProfit: string
  entryDate: string
  exitDate: string
  returnUsd: number | null
  returnPct: number | null
  returnR: number | null
  entryPrice: string
  grossPnl: number | null
  exitPrice: string
}

const PAGE_SIZE = 12

const COLUMNS = [
  "Symbol",
  "Side",
  "Size",
  "Entry",
  "Stop loss",
  "Take profit",
  "Fees",
  "Entry date",
  "Exit date",
  "Return ($)",
  "Return (%)",
  "Return (R)",
  "Gross PnL",
  "Exit price",
] as const

function formatNum(n: number | null | undefined, digits = 2) {
  if (n == null || Number.isNaN(n)) return "—"
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  })
}

function formatDate(date: string | null | undefined) {
  if (!date) return "—"
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatSigned(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—"
  const abs = Math.abs(n).toFixed(2)
  if (n > 0) return `+${abs}`
  if (n < 0) return `-${abs}`
  return abs
}

function toRow(trade: SerializedTrade): Row {
  const returnUsd = trade.result ?? null
  const returnPct =
    returnUsd != null && trade.accountBalance && trade.accountBalance > 0
      ? (returnUsd / trade.accountBalance) * 100
      : null
  const dir = trade.direction.toUpperCase()
  const side = dir === "BUY" || dir === "LONG" ? "Long" : "Short"

  return {
    id: trade.id,
    pair: trade.pair,
    side,
    size: formatNum(trade.lotSize, 2),
    trade: formatNum(trade.entry, 5),
    stopLoss: formatNum(trade.stopLoss, 5),
    fees: "—",
    takeProfit: formatNum(trade.takeProfit, 5),
    entryDate: formatDate(trade.dateOpened),
    exitDate: formatDate(trade.dateClosed ?? null),
    returnUsd,
    returnPct,
    returnR: trade.rMultiple ?? null,
    entryPrice: formatNum(trade.entry, 5),
    grossPnl: returnUsd,
    exitPrice: formatNum(trade.exit, 5),
  }
}

export function TradeLogClient({
  trades,
  accountName,
}: {
  trades: SerializedTrade[]
  accountName: string
}) {
  const [page, setPage] = React.useState(1)
  const [account, setAccount] = React.useState(accountName)
  const [filterMode, setFilterMode] = React.useState<"basic" | "tags">("basic")

  const rows = React.useMemo(() => trades.map(toRow), [trades])
  const filtered = React.useMemo(() => {
    if (account !== accountName) return []
    if (filterMode === "basic") return rows
    return rows.filter((r) => r.returnR != null && r.returnR > 0)
  }, [rows, account, accountName, filterMode])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  React.useEffect(() => {
    setPage(1)
  }, [account, filterMode])

  return (
    <div className="relative flex min-h-full flex-col gap-4 py-4 lg:py-6">
      <div className="mx-4 flex flex-wrap items-center gap-2 lg:mx-8">
        <Select value={account} onValueChange={setAccount}>
          <SelectTrigger className="h-8 w-[180px] rounded-md border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] dark:border-white/10 dark:bg-neutral-900 dark:text-slate-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={accountName}>{accountName}</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:hover:bg-white/5 dark:hover:text-slate-100"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:hover:bg-white/5 dark:hover:text-slate-100"
          >
            <PencilLine className="h-3.5 w-3.5" />
          </button>
          <span className="mx-1 h-4 w-px bg-[#E2E8F0] dark:bg-white/10" />
          <span className="text-[12px] text-[#64748B]">Filter</span>
          <button
            type="button"
            onClick={() => setFilterMode("basic")}
            className={cn(
              "rounded-md px-2 py-1 text-[12px] font-medium",
              filterMode === "basic"
                ? "bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-500/15 dark:text-blue-400"
                : "text-[#64748B] hover:text-[#0F172A] dark:hover:text-slate-100"
            )}
          >
            Basic
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("tags")}
            className={cn(
              "rounded-md px-2 py-1 text-[12px] font-medium",
              filterMode === "tags"
                ? "bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-500/15 dark:text-blue-400"
                : "text-[#64748B] hover:text-[#0F172A] dark:hover:text-slate-100"
            )}
          >
            Tags
          </button>
        </div>
      </div>

      <section className="mx-4 lg:mx-8">
        <div className={dashTableWrap}>
          <table className="min-w-[1400px] w-full border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] dark:border-white/10 dark:bg-white/[0.03]">
                {COLUMNS.map((h) => (
                  <th key={h} className={dashTh}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-16 text-center text-[13px] text-[#64748B]"
                  >
                    No trades match these filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] dark:border-white/10 dark:hover:bg-white/[0.03]"
                  >
                    <td className={cn(dashTd, "font-medium")}>{row.pair}</td>
                    <td className={dashTd}>{row.side}</td>
                    <td className={dashTd}>{row.size}</td>
                    <td className={dashTd}>{row.trade}</td>
                    <td className={dashTd}>{row.stopLoss}</td>
                    <td className={dashTd}>{row.takeProfit}</td>
                    <td className={cn(dashTd, "text-[#64748B]")}>{row.fees}</td>
                    <td className={cn(dashTd, "text-[#475569] dark:text-slate-400")}>
                      {row.entryDate}
                    </td>
                    <td className={cn(dashTd, "text-[#475569] dark:text-slate-400")}>
                      {row.exitDate}
                    </td>
                    <td className={cn(dashTd, pnlClass(row.returnUsd))}>
                      {formatSigned(row.returnUsd)}
                    </td>
                    <td className={dashTd}>
                      {row.returnPct == null ? "—" : `${row.returnPct.toFixed(2)}%`}
                    </td>
                    <td className={dashTd}>
                      {row.returnR == null ? "—" : row.returnR.toFixed(2)}
                    </td>
                    <td className={cn(dashTd, pnlClass(row.grossPnl))}>
                      {formatSigned(row.grossPnl)}
                    </td>
                    <td className={dashTd}>{row.exitPrice}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mx-4 flex items-center justify-between lg:mx-8">
        <div className="text-[12px] text-[#64748B]">
          Showing{" "}
          <span className="font-medium text-[#0F172A] dark:text-slate-100">
            {pageRows.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-[#0F172A] dark:text-slate-100">
            {filtered.length}
          </span>{" "}
          trades
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md text-[#64748B]"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2 text-[12px] font-medium text-[#475569]">
            {safePage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md text-[#64748B]"
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
