import { getInstrumentSpec, getPointValue } from "./instruments"

export type TradeDirection = "buy" | "sell"

export interface TradeCalcInput {
  pair: string
  direction: TradeDirection
  entry: number
  stopLoss: number
  takeProfit?: number | null
  exit?: number | null
  lotSize: number
}

export interface TradeCalcResult {
  plannedRr: number | null
  rMultiple: number | null
  result: number | null
  outcome: "WIN" | "LOSS" | "BREAKEVEN" | "PENDING"
  riskDistance: number
  signedPriceMove: number | null
  riskAmount: number
  pips: number | null
}

function signedDistance(
  direction: TradeDirection,
  from: number,
  to: number
): number {
  return direction === "buy" ? to - from : from - to
}

/** Planned reward:risk using directional distances (invalid TP → null). */
export function calculatePlannedRr(
  direction: TradeDirection,
  entry: number,
  stopLoss: number,
  takeProfit: number | null | undefined
): number | null {
  if (takeProfit == null || Number.isNaN(takeProfit)) return null

  const risk = Math.abs(entry - stopLoss)
  if (risk <= 0) return null

  const reward = signedDistance(direction, entry, takeProfit)
  if (reward <= 0) return null

  return reward / risk
}

/** Realized R-multiple vs stop distance (direction-aware). */
export function calculateRMultiple(
  direction: TradeDirection,
  entry: number,
  stopLoss: number,
  exit: number | null | undefined
): number | null {
  if (exit == null || Number.isNaN(exit)) return null

  const risk = Math.abs(entry - stopLoss)
  if (risk <= 0) return null

  return signedDistance(direction, entry, exit) / risk
}

/** USD P&L for standard-lot sizing. */
export function calculatePnL(
  pair: string,
  direction: TradeDirection,
  entry: number,
  exit: number,
  lotSize: number
): number {
  const move = signedDistance(direction, entry, exit)
  return move * lotSize * getPointValue(pair)
}

export function calculateRiskAmount(
  pair: string,
  entry: number,
  stopLoss: number,
  lotSize: number
): number {
  const distance = Math.abs(entry - stopLoss)
  return distance * lotSize * getPointValue(pair)
}

export function calculateLotSize(params: {
  pair: string
  entry: number
  stopLoss: number
  riskAmount: number
}): number | null {
  const { pair, entry, stopLoss, riskAmount } = params
  const distance = Math.abs(entry - stopLoss)
  const pv = getPointValue(pair)
  if (distance <= 0 || pv <= 0 || riskAmount <= 0) return null
  return riskAmount / (distance * pv)
}

export function calculateOutcome(
  rMultiple: number | null
): "WIN" | "LOSS" | "BREAKEVEN" | "PENDING" {
  if (rMultiple == null) return "PENDING"
  if (Math.abs(rMultiple) < 0.05) return "BREAKEVEN"
  if (rMultiple > 0) return "WIN"
  return "LOSS"
}

export function calculateTradeMetrics(input: TradeCalcInput): TradeCalcResult {
  const direction = input.direction
  const riskDistance = Math.abs(input.entry - input.stopLoss)
  const plannedRr = calculatePlannedRr(
    direction,
    input.entry,
    input.stopLoss,
    input.takeProfit
  )
  const rMultiple = calculateRMultiple(
    direction,
    input.entry,
    input.stopLoss,
    input.exit
  )

  let result: number | null = null
  let signedPriceMove: number | null = null
  let pips: number | null = null

  if (input.exit != null && !Number.isNaN(input.exit)) {
    signedPriceMove = signedDistance(direction, input.entry, input.exit)
    result = calculatePnL(
      input.pair,
      direction,
      input.entry,
      input.exit,
      input.lotSize
    )
    const { pipSize } = getInstrumentSpec(input.pair)
    pips = signedPriceMove / pipSize
  }

  const riskAmount = calculateRiskAmount(
    input.pair,
    input.entry,
    input.stopLoss,
    input.lotSize
  )

  return {
    plannedRr,
    rMultiple,
    result,
    outcome: calculateOutcome(rMultiple),
    riskDistance,
    signedPriceMove,
    riskAmount,
    pips,
  }
}

/** ICT Optimal Trade Entry zone (0.62–0.79 Fibonacci of dealing range). */
export function calculateOteZone(
  direction: TradeDirection,
  swingHigh: number,
  swingLow: number
): { oteHigh: number; oteLow: number; equilibrium: number } | null {
  if (swingHigh <= swingLow) return null
  const range = swingHigh - swingLow

  if (direction === "buy") {
    // Discount: retrace from swing high toward swing low
    const oteHigh = swingHigh - range * 0.62
    const oteLow = swingHigh - range * 0.79
    return {
      oteHigh,
      oteLow,
      equilibrium: swingHigh - range * 0.5,
    }
  }

  // Premium: retrace from swing low toward swing high
  const oteLow = swingLow + range * 0.62
  const oteHigh = swingLow + range * 0.79
  return {
    oteHigh,
    oteLow,
    equilibrium: swingLow + range * 0.5,
  }
}

export function isPriceInOte(
  price: number,
  oteHigh: number,
  oteLow: number
): boolean {
  const hi = Math.max(oteHigh, oteLow)
  const lo = Math.min(oteHigh, oteLow)
  return price >= lo && price <= hi
}

export function resolveRiskDollars(params: {
  balance: number
  riskValue: number
  riskType: "percent" | "amount"
}): number {
  if (params.riskType === "percent") {
    return (params.balance * params.riskValue) / 100
  }
  return params.riskValue
}
