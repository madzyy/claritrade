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

function formatNum(n: number | null | undefined, digits = 2) {
  if (n == null || Number.isNaN(n)) return "-"
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  })
}

function formatDate(date: string | null | undefined) {
  if (!date) return "-"
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatSigned(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "-"
  return `${n >= 0 ? "+" : "-"}${Math.abs(n).toFixed(2)}`
}

function pnlPill(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "bg-white/5 text-slate-400"
  return n >= 0
    ? "bg-emerald-500/20 text-emerald-300"
    : "bg-rose-500/20 text-rose-300"
}

function toRow(trade: SerializedTrade): Row {
  const returnUsd = trade.result ?? null
  const returnPct =
    returnUsd != null && trade.accountBalance && trade.accountBalance > 0
      ? (returnUsd / trade.accountBalance) * 100
      : null

  return {
    id: trade.id,
    size: formatNum(trade.lotSize, 2),
    trade: formatNum(trade.entry, 5),
    stopLoss: formatNum(trade.stopLoss, 5),
    fees: "-",
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
    <div className="relative min-h-full flex flex-col gap-6 py-4 lg:py-6">
      <div className="mx-4 lg:mx-8 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0b0f17] px-3 py-2">
        <Select value={account} onValueChange={setAccount}>
          <SelectTrigger className="h-8 w-[180px] rounded-md border-white/15 bg-[#111827] text-xs text-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={accountName}>{accountName}</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-slate-400 hover:text-slate-200"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-slate-400 hover:text-slate-200"
          >
            <PencilLine className="h-3.5 w-3.5" />
          </button>
          <span className="mx-1 h-5 w-px bg-white/10" />
          <span className="text-xs text-slate-400">Filter by</span>
          <button
            type="button"
            onClick={() => setFilterMode("basic")}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs",
              filterMode === "basic"
                ? "border-white/25 bg-white/10 text-slate-100"
                : "border-white/15 text-slate-400"
            )}
          >
            Basic
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("tags")}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs",
              filterMode === "tags"
                ? "border-white/25 bg-white/10 text-slate-100"
                : "border-white/15 text-slate-400"
            )}
          >
            Tags
          </button>
        </div>
      </div>

      <section className="mx-4 lg:mx-8">
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0b0f17]">
          <table className="min-w-[1650px] w-full">
            <thead>
              <tr className="border-b border-white/10">
                {[
                  "Size",
                  "Trade",
                  "Stop loss",
                  "Fees",
                  "Take profit",
                  "Entry date",
                  "Exit date",
                  "Return ($)",
                  "Return (%)",
                  "Return (R)",
                  "Entry price",
                  "Gross PnL",
                  "Exit price",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-3 text-left text-[12px] font-medium text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-6 py-16 text-center text-sm text-slate-400">
                    No trades match these filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/[0.03] last:border-0"
                  >
                    <td className="px-3 py-3 text-[13px] tabular-nums text-slate-100">{row.size}</td>
                    <td className="px-3 py-3 text-[13px] tabular-nums text-slate-300">{row.trade}</td>
                    <td className="px-3 py-3 text-[13px] tabular-nums text-slate-300">{row.stopLoss}</td>
                    <td className="px-3 py-3 text-[13px] tabular-nums text-slate-500">{row.fees}</td>
                    <td className="px-3 py-3 text-[13px] tabular-nums text-slate-300">{row.takeProfit}</td>
                    <td className="px-3 py-3 text-[13px] text-slate-400">{row.entryDate}</td>
                    <td className="px-3 py-3 text-[13px] text-slate-400">{row.exitDate}</td>
                    <td className="px-3 py-3">
                      <span className={cn("rounded-md px-2 py-1 text-[11px] font-semibold", pnlPill(row.returnUsd))}>
                        {formatSigned(row.returnUsd)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[13px] tabular-nums text-slate-300">
                      {row.returnPct == null ? "0%" : `${row.returnPct.toFixed(2)}%`}
                    </td>
                    <td className="px-3 py-3 text-[13px] tabular-nums text-slate-300">
                      {row.returnR == null ? "N/A" : row.returnR.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-[13px] tabular-nums text-slate-300">{row.entryPrice}</td>
                    <td className="px-3 py-3">
                      <span className={cn("rounded-md px-2 py-1 text-[11px] font-semibold", pnlPill(row.grossPnl))}>
                        {formatSigned(row.grossPnl)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[13px] tabular-nums text-slate-300">{row.exitPrice}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mx-4 lg:mx-8 flex items-center justify-between">
        <div className="text-[12px] text-slate-400">
          Showing <span className="font-semibold text-slate-100">{pageRows.length}</span> of{" "}
          <span className="font-semibold text-slate-100">{filtered.length}</span> trades
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
          <span className="px-2 text-[12px] font-semibold text-[#64748B]">
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
