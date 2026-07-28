import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

/**
 * TradeZella-style metrics table.
 * One CSS grid for header + rows so columns always align.
 */
export const METRICS_GRID =
  "grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_72px_132px_100px_92px] lg:gap-x-6"

export function TableSection({
  title,
  action,
  children,
  className,
}: {
  title: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("mx-4 lg:mx-8", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[15px] font-semibold tracking-tight text-[#1E293B] dark:text-slate-100">
          {title}
        </h3>
        {action}
      </div>
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white dark:border-white/10 dark:bg-neutral-900">
        {children}
      </div>
    </section>
  )
}

export function TableHeader({
  columns,
}: {
  columns: [string, string, string, string]
}) {
  return (
    <div
      className={cn(
        METRICS_GRID,
        "hidden border-b border-[#F1F5F9] px-5 py-3 lg:grid lg:px-6 dark:border-white/5"
      )}
    >
      <div />
      {columns.map((col) => (
        <div
          key={col}
          className="text-right text-[12px] font-medium text-[#94A3B8] dark:text-slate-500"
        >
          {col}
        </div>
      ))}
    </div>
  )
}

export function TableRow({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        METRICS_GRID,
        "items-center border-b border-[#F1F5F9] px-5 py-[18px] last:border-b-0 lg:px-6 dark:border-white/5",
        "hover:bg-[#F8FAFC]/80 transition-colors dark:hover:bg-white/[0.03]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  )
}

export function TableLabel({
  title,
  subtitle,
}: {
  title: ReactNode
  subtitle?: ReactNode
}) {
  return (
    <div className="min-w-0 pr-2 mb-3 lg:mb-0">
      <div className="truncate text-[14px] font-semibold text-[#1E293B] leading-5 dark:text-slate-100">
        {title}
      </div>
      {subtitle ? (
        <div className="mt-0.5 truncate text-[12px] font-normal text-[#94A3B8] leading-4 dark:text-slate-500">
          {subtitle}
        </div>
      ) : null}
    </div>
  )
}

export function TableCell({
  children,
  className,
  label,
}: {
  children: ReactNode
  className?: string
  label?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 lg:block lg:text-right">
      {label ? (
        <span className="text-[12px] font-medium text-[#94A3B8] lg:hidden dark:text-slate-500">
          {label}
        </span>
      ) : null}
      <div
        className={cn(
          "text-[14px] font-semibold tabular-nums leading-5 text-[#1E293B] dark:text-slate-100",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function formatUsd(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—"
  const abs = Math.abs(n)
  const formatted = abs.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  if (n > 0) return `$${formatted}`
  if (n < 0) return `-$${formatted}`
  return `$${formatted}`
}

export function formatPct(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—"
  return `${n.toFixed(2)} %`
}

export function formatPf(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—"
  if (!Number.isFinite(n)) return "∞"
  return n.toFixed(2)
}

export function pnlClass(n: number | null | undefined) {
  if (n == null || n === 0) {
    return "text-[#1E293B] dark:text-slate-100"
  }
  if (n > 0) return "text-[#3B82F6] dark:text-blue-400"
  return "text-[#EF4444] dark:text-red-400"
}
