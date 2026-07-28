/** Smart Money Concepts / ICT journal domain constants */

export const SETUP_TYPES = [
  {
    id: "ORDER_BLOCK",
    label: "Order Block",
    short: "OB",
    description: "Last opposing candle before impulsive displacement",
  },
  {
    id: "OTE",
    label: "Optimal Trade Entry",
    short: "OTE",
    description: "62–79% Fibonacci retracement of dealing range",
  },
  {
    id: "MITIGATION_BLOCK",
    label: "Mitigation Block",
    short: "MB",
    description: "Failed OB that returns for mitigation before continuation",
  },
  {
    id: "BREAKER_BLOCK",
    label: "Breaker Block",
    short: "BB",
    description: "Failed order block that flips and acts as breaker",
  },
  {
    id: "LIQUIDITY_SWEEP",
    label: "Liquidity Sweep",
    short: "Liq",
    description: "Buy-side or sell-side liquidity taken before reversal",
  },
  {
    id: "FVG",
    label: "Fair Value Gap",
    short: "FVG",
    description: "Imbalance / inefficiency left by displacement",
  },
  {
    id: "BOS",
    label: "Break of Structure",
    short: "BOS",
    description: "Continuation structure break with HTF alignment",
  },
  {
    id: "CHOCH",
    label: "Change of Character",
    short: "CHoCH",
    description: "First opposing structure break signaling shift",
  },
] as const

export type SetupTypeId = (typeof SETUP_TYPES)[number]["id"]

export const LIQUIDITY_SIDES = [
  { id: "BUY_SIDE", label: "Buy-Side Liquidity (BSL)" },
  { id: "SELL_SIDE", label: "Sell-Side Liquidity (SSL)" },
  { id: "BOTH", label: "Both Sides Swept" },
  { id: "NONE", label: "No Sweep" },
] as const

export type LiquiditySideId = (typeof LIQUIDITY_SIDES)[number]["id"]

export const HTF_TIMEFRAMES = ["MN", "W1", "D1", "H4"] as const
export const MTF_TIMEFRAMES = ["H4", "H1", "M15"] as const
export const LTF_TIMEFRAMES = ["M15", "M5", "M3", "M1"] as const

export const BIAS_OPTIONS = [
  { id: "BULLISH", label: "Bullish" },
  { id: "BEARISH", label: "Bearish" },
  { id: "RANGE", label: "Range / Consolidation" },
] as const

export type BiasId = (typeof BIAS_OPTIONS)[number]["id"]

export const CONFLUENCE_TAGS = [
  "Displacement",
  "MSS",
  "FVG Fill",
  "OB Tap",
  "OTE Hit",
  "Breaker Flip",
  "Mitigation",
  "Liquidity Taken",
  "Premium",
  "Discount",
  "Equilibrium",
  "CISD",
  "SMT Divergence",
  "Judas Swing",
] as const

export function setupTypeLabel(id: string | null | undefined): string {
  if (!id) return "—"
  return SETUP_TYPES.find((s) => s.id === id)?.label ?? id
}

export function setupTypeShort(id: string | null | undefined): string {
  if (!id) return "—"
  return SETUP_TYPES.find((s) => s.id === id)?.short ?? id
}
