/** NQ Mastery journal: long-term, intermediate, and short-term perspectives. */

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
  { id: "BULLISH", label: "Next candle up", short: "Up" },
  { id: "BEARISH", label: "Next candle down", short: "Down" },
  { id: "RANGE", label: "No clear next candle", short: "Unclear" },
] as const

export type BiasId = (typeof BIAS_OPTIONS)[number]["id"]

/** Internal range liquidity is an imbalance. External range liquidity is an old high or low. */
export const RANGE_LIQUIDITY = [
  {
    id: "INTERNAL",
    label: "Internal range",
    short: "Internal",
    description:
      "Imbalances: FVG, volume imbalance, new week opening gap, new day opening gap.",
  },
  {
    id: "EXTERNAL",
    label: "External range",
    short: "External",
    description: "Old highs and old lows.",
  },
] as const

export type RangeLiquidityId = (typeof RANGE_LIQUIDITY)[number]["id"]

export const IMBALANCES = [
  { id: "FVG", label: "FVG", short: "FVG", description: "Fair value gap." },
  {
    id: "VOLUME_IMBALANCE",
    label: "Volume imbalance",
    short: "VI",
    description: "Volume imbalance.",
  },
  {
    id: "NWOG",
    label: "New week opening gap",
    short: "NWOG",
    description: "New week opening gap.",
  },
  {
    id: "NDOG",
    label: "New day opening gap",
    short: "NDOG",
    description: "New day opening gap.",
  },
] as const

export type ImbalanceId = (typeof IMBALANCES)[number]["id"]

export const EXTERNAL_POOLS = [
  { id: "OLD_HIGH", label: "Old high", short: "High", description: "Prior high." },
  { id: "OLD_LOW", label: "Old low", short: "Low", description: "Prior low." },
] as const

export type ExternalPoolId = (typeof EXTERNAL_POOLS)[number]["id"]

const LIQUIDITY_TAG_LABELS = new Set<string>([
  ...RANGE_LIQUIDITY.map((item) => item.label),
  ...IMBALANCES.map((item) => item.label),
  ...EXTERNAL_POOLS.map((item) => item.label),
])

export function liquidityTagsFor(input: {
  rangeLiquidity: string
  imbalanceType: string
  externalPool: string
}): string[] {
  const tags: string[] = []
  const location = RANGE_LIQUIDITY.find((item) => item.id === input.rangeLiquidity)
  if (location) tags.push(location.label)
  if (input.rangeLiquidity === "INTERNAL") {
    const imbalance = IMBALANCES.find((item) => item.id === input.imbalanceType)
    if (imbalance) tags.push(imbalance.label)
  }
  const pool = EXTERNAL_POOLS.find((item) => item.id === input.externalPool)
  if (pool) tags.push(pool.label)
  return tags
}

export function stripLiquidityTags(tags: string[]): string[] {
  return tags.filter(
    (tag) =>
      !LIQUIDITY_TAG_LABELS.has(tag) &&
      !RANGE_TAG_LABELS.has(tag) &&
      !tag.startsWith("Dealing range ")
  )
}

export function rangeTagsFor(input: {
  rangeType: string
  rangeSequence: string[]
  fiftyRole: string
  pairedWithHtfKl: boolean
  dealingFormation: string
  rangeConfirms: string[]
  premiumDiscount: "PREMIUM" | "DISCOUNT" | "EQ" | null
  dealingHigh?: string
  dealingLow?: string
}): string[] {
  const tags: string[] = []
  const type = RANGE_TYPES.find((item) => item.id === input.rangeType)
  if (type) tags.push(type.label)
  for (const id of input.rangeSequence) {
    const step = RANGE_SEQUENCE.find((item) => item.id === id)
    if (step) tags.push(step.label)
  }
  const fifty = FIFTY_ROLES.find((item) => item.id === input.fiftyRole)
  if (fifty) tags.push(fifty.label)
  if (input.pairedWithHtfKl) tags.push("Paired with HTF KL")
  const formation = DEALING_FORMATIONS.find(
    (item) => item.id === input.dealingFormation
  )
  if (formation) {
    tags.push("Dealing range")
    tags.push(formation.label)
  }
  if (input.dealingHigh && input.dealingLow) {
    tags.push(`Dealing range ${input.dealingHigh}–${input.dealingLow}`)
  }
  for (const id of input.rangeConfirms) {
    const confirm = RANGE_CONFIRMS.find((item) => item.id === id)
    if (confirm) tags.push(confirm.label)
  }
  if (input.premiumDiscount === "PREMIUM") tags.push("Premium")
  if (input.premiumDiscount === "DISCOUNT") tags.push("Discount")
  return tags
}

export function rangeTypeShort(tags: string[] | null | undefined): string {
  if (!tags?.length) return ""
  return RANGE_TYPES.find((item) => tags.includes(item.label))?.short ?? ""
}

/** Internal imbalance draws to an old high or low. A run on that high or low draws back to an FVG. */
export function rangeLiquidityShort(tags: string[] | null | undefined): string {
  if (!tags?.length) return ""
  const pool = EXTERNAL_POOLS.find((item) => tags.includes(item.label))?.short
  if (tags.includes("Internal range") && pool) {
    const imbalance =
      IMBALANCES.find((item) => tags.includes(item.label))?.short ?? "Internal"
    return `${imbalance}→${pool}`
  }
  if (tags.includes("External range") && pool) return `${pool}→FVG`
  return ""
}

/** IPDA profiles. Consolidation only leads to expansion. */
export const MARKET_PROFILES = [
  {
    id: "CONSOLIDATION",
    label: "Consolidation",
    short: "Range",
    description:
      "Accumulation. The market is ranging. Stay out and let it tell you an expansion is next.",
  },
  {
    id: "EXPANSION",
    label: "Expansion",
    short: "Expand",
    description:
      "The move you trade. Index futures spend about 48% of the time here.",
  },
  {
    id: "REVERSAL",
    label: "Reversal",
    short: "Reverse",
    description:
      "Follows an expansion. It does not come straight out of consolidation.",
  },
  {
    id: "RETRACEMENT",
    label: "Retracement",
    short: "Retrace",
    description:
      "Pullback after the breakout. It follows expansion, never consolidation.",
  },
] as const

export type MarketProfileId = (typeof MARKET_PROFILES)[number]["id"]

/** The only two ways a consolidation resolves. */
export const RANGE_RESOLUTIONS = [
  {
    id: "BIAS_BREAKOUT",
    label: "Breakout with bias",
    short: "Breakout",
    description:
      "Breaks in the direction of the next HTF candle, then a retracement long or short.",
  },
  {
    id: "STOP_RUN",
    label: "Stop run against bias",
    short: "AMD",
    description:
      "Runs the other way first, the manipulation, then expands with the bias. AMD.",
  },
] as const

export type RangeResolutionId = (typeof RANGE_RESOLUTIONS)[number]["id"]

export const RANGE_TYPES = [
  {
    id: "STRUCTURAL",
    label: "Structural range",
    short: "Structural",
    description:
      "A low clearly connected to a high: the expansion leg. Probability rises when it sits on an HTF key level.",
  },
  {
    id: "ONE_CANDLE",
    label: "1 candle range",
    short: "1 candle",
    description:
      "A candle that closes near the key level. Its high and low are the range. The next candle touching the KL and closing inside is turtle soup: the other side is the draw.",
  },
] as const

export type RangeTypeId = (typeof RANGE_TYPES)[number]["id"]

export const RANGE_SEQUENCE = [
  {
    id: "INDUCEMENT",
    label: "Inducement retrace",
    description:
      "A leg almost at the HTF key level retraced. That pullback marked the range. It was inducement.",
  },
  {
    id: "BREAK_INTO_KL",
    label: "Broke range into KL",
    description:
      "Price broke the range and entered the HTF key level.",
  },
  {
    id: "BREAK_BACK",
    label: "Broke back into range",
    description:
      "Price left the key level and broke back into the range. That is the entry.",
  },
] as const

export type RangeSequenceId = (typeof RANGE_SEQUENCE)[number]["id"]

export const FIFTY_ROLES = [
  {
    id: "FIRST_TARGET",
    label: "50% first target",
    description: "Take the first scale at the midpoint of the range.",
  },
  {
    id: "CONTINUATION",
    label: "50% continuation",
    description:
      "Price broke through 50%. The other side of the range is the draw on liquidity.",
  },
] as const

export type FiftyRoleId = (typeof FIFTY_ROLES)[number]["id"]

/** Break a high then a low, or a low then a high, and expand. Pair this with the inner range. */
export const DEALING_FORMATIONS = [
  {
    id: "HIGH_THEN_LOW",
    label: "Broke high, then low",
    short: "H→L",
    description:
      "Price broke a high, then immediately broke a low, and expanded.",
  },
  {
    id: "LOW_THEN_HIGH",
    label: "Broke low, then high",
    short: "L→H",
    description:
      "Price broke a low, then immediately broke a high, and expanded.",
  },
] as const

export type DealingFormationId = (typeof DEALING_FORMATIONS)[number]["id"]

export const RANGE_CONFIRMS = [
  {
    id: "TURTLE_SOUP",
    label: "Turtle soup",
    description:
      "Next candle tagged the key level and closed back inside the range. The other side of the range is the draw.",
  },
  {
    id: "DISPLACE_50",
    label: "Displacement through 50%",
    description:
      "Displacement through 50% of the range. Price is likely to hit the other side.",
  },
  {
    id: "CHOP_50",
    label: "50% accumulation",
    description:
      "Price chopped at 50%. Continuation from here often hits the other side with more volatility.",
  },
  {
    id: "CISD",
    label: "CISD on LTF",
    description:
      "Dropped a timeframe and took a change in state of delivery.",
  },
] as const

export type RangeConfirmId = (typeof RANGE_CONFIRMS)[number]["id"]

/**
 * Deferred delivery: price leaves the DOL to run opposing stops at high
 * resistance liquidity, then continues to the draw.
 */
export const DEFERRED_STEPS = [
  {
    id: "HRL",
    label: "High resistance liquidity",
    description:
      "Anticipate the defer here. Price is at a high-resistance liquidity run level.",
  },
  {
    id: "INTO_OB",
    label: "Into OB at deferred liquidity",
    description:
      "Price traded into an order block at deferred liquidity. Expect a detour off the DOL.",
  },
  {
    id: "DEVIATED",
    label: "Deviated from DOL",
    description:
      "Price left the path to the draw on liquidity and went the other way to run stops.",
  },
  {
    id: "RAN_OPPOSING",
    label: "Ran opposing stops",
    description:
      "Opposing liquidity was taken. Then price continues to the DOL.",
  },
  {
    id: "CONTINUED_DOL",
    label: "Continued to DOL",
    description: "After the stop run, delivery resumed toward the draw.",
  },
] as const

export type DeferredStepId = (typeof DEFERRED_STEPS)[number]["id"]

export const DEFER_CANDLES = [
  {
    id: "HIGHEST_UPCLOSE",
    label: "Highest up-close",
    description:
      "Bullish: the highest up-close at high resistance liquidity defers delivery down into sell stops, then price continues higher.",
  },
  {
    id: "LOWEST_DOWNCLOSE",
    label: "Lowest down-close",
    description:
      "Bearish: the lowest down-close at high resistance liquidity defers delivery up into buy stops, then price continues lower.",
  },
] as const

export type DeferCandleId = (typeof DEFER_CANDLES)[number]["id"]

export const OPPOSING_STOPS = [
  {
    id: "SELL_STOPS",
    label: "Sell stops",
    description: "Bullish defer: run sell stops below, then continue higher.",
  },
  {
    id: "BUY_STOPS",
    label: "Buy stops",
    description: "Bearish defer: run buy stops above, then continue lower.",
  },
] as const

export type OpposingStopsId = (typeof OPPOSING_STOPS)[number]["id"]

export function deferredDefaults(bias: string): {
  deferCandle: string
  opposingStops: string
} {
  if (bias === "BEARISH") {
    return { deferCandle: "LOWEST_DOWNCLOSE", opposingStops: "BUY_STOPS" }
  }
  return { deferCandle: "HIGHEST_UPCLOSE", opposingStops: "SELL_STOPS" }
}

export function deferredTagsFor(input: {
  deferred: boolean
  deferredSteps: string[]
  deferCandle: string
  opposingStops: string
}): string[] {
  if (!input.deferred) return []
  const tags = ["Deferred delivery"]
  for (const id of input.deferredSteps) {
    const step = DEFERRED_STEPS.find((item) => item.id === id)
    if (step) tags.push(step.label)
  }
  const candle = DEFER_CANDLES.find((item) => item.id === input.deferCandle)
  if (candle) tags.push(candle.label)
  const stops = OPPOSING_STOPS.find((item) => item.id === input.opposingStops)
  if (stops) tags.push(stops.label)
  return tags
}

const RANGE_TAG_LABELS = new Set<string>([
  ...RANGE_TYPES.map((item) => item.label),
  ...RANGE_SEQUENCE.map((item) => item.label),
  ...FIFTY_ROLES.map((item) => item.label),
  ...DEALING_FORMATIONS.map((item) => item.label),
  ...RANGE_CONFIRMS.map((item) => item.label),
  "Paired with HTF KL",
  "Dealing range",
  "Premium",
  "Discount",
  "Deferred delivery",
  ...DEFERRED_STEPS.map((item) => item.label),
  ...DEFER_CANDLES.map((item) => item.label),
  ...OPPOSING_STOPS.map((item) => item.label),
])

/** Mechanical checklist from the course frame. */
export const CONFLUENCE_TAGS = [
  "Next HTF candle",
  "Into an old high or low",
  "Back to an FVG",
  "SSL to BSL",
  "Sell premium / buy discount",
  "Deferred delivery",
  "Paired with HTF KL",
  "Profiled into 9:30",
  "Consolidation to expansion",
  "Traded the expansion",
] as const

export function setupTypeLabel(id: string | null | undefined): string {
  if (!id) return "—"
  return SETUP_TYPES.find((s) => s.id === id)?.label ?? id
}

export function setupTypeShort(id: string | null | undefined): string {
  if (!id) return "—"
  return SETUP_TYPES.find((s) => s.id === id)?.short ?? id
}

export function biasLabel(id: string | null | undefined): string {
  if (!id) return "—"
  return BIAS_OPTIONS.find((b) => b.id === id)?.label ?? id
}

export function biasShort(id: string | null | undefined): string {
  if (!id) return "—"
  return BIAS_OPTIONS.find((b) => b.id === id)?.short ?? id
}

export function profileLabel(id: string | null | undefined): string {
  if (!id) return "—"
  return MARKET_PROFILES.find((p) => p.id === id)?.label ?? setupTypeLabel(id)
}

export function profileShort(id: string | null | undefined): string {
  if (!id) return "—"
  return MARKET_PROFILES.find((p) => p.id === id)?.short ?? "—"
}

export function rangeResolutionLabel(id: string | null | undefined): string {
  if (!id) return "—"
  return RANGE_RESOLUTIONS.find((p) => p.id === id)?.label ?? "—"
}
