import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

/**
 * Compact journal table — one CSS grid so header + rows stay aligned.
 */
export const METRICS_GRID =
  "grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_72px_132px_100px_92px] lg:gap-x-4"

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
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-[13px] font-semibold text-[#0F172A] dark:text-slate-100">
          {title}
        </h3>
        {action}
      </div>
      <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white dark:border-white/10 dark:bg-neutral-900">
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
        "hidden border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 lg:grid dark:border-white/10 dark:bg-white/[0.03]"
      )}
    >
      <div />
      {columns.map((col) => (
        <div
          key={col}
          className="text-right text-[11px] font-medium text-[#64748B] dark:text-slate-400"
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
        "items-center border-b border-[#E2E8F0] px-4 py-2.5 last:border-b-0 lg:px-4 dark:border-white/10",
        "hover:bg-[#F8FAFC] transition-colors dark:hover:bg-white/[0.03]",
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
    <div className="min-w-0 pr-2 mb-2 lg:mb-0">
      <div className="truncate text-[13px] font-medium text-[#0F172A] leading-5 dark:text-slate-100">
        {title}
      </div>
      {subtitle ? (
        <div className="mt-0.5 truncate text-[12px] font-normal text-[#64748B] leading-4 dark:text-slate-400">
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
        <span className="text-[12px] font-medium text-[#64748B] lg:hidden dark:text-slate-400">
          {label}
        </span>
      ) : null}
      <div
        className={cn(
          "text-[13px] font-medium tabular-nums leading-5 text-[#0F172A] dark:text-slate-100",
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
    return "text-[#0F172A] dark:text-slate-100"
  }
  if (n > 0) return "text-[#2563EB] dark:text-blue-400"
  return "text-[#DC2626] dark:text-red-400"
}
