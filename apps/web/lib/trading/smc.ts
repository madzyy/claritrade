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

/** LTP: monthly, weekly, daily — daily bias lives here. */
export const HTF_TIMEFRAMES = ["MN", "W1", "D1"] as const
/** ITP: H4, H1, sometimes M30 — this is how you walk to the LTP draw. */
export const MTF_TIMEFRAMES = ["H4", "H1", "M30"] as const
/** STP: M15 and lower. Entry only after LTP and ITP are aligned. */
export const LTF_TIMEFRAMES = ["M15", "M5", "M1"] as const

export const BIAS_OPTIONS = [
  { id: "BULLISH", label: "Next daily candle up", short: "Up" },
  { id: "BEARISH", label: "Next daily candle down", short: "Down" },
  { id: "RANGE", label: "Can't call the next daily", short: "Unclear" },
] as const

export type BiasId = (typeof BIAS_OPTIONS)[number]["id"]

export const ITP_FLOW = [
  {
    id: "BULLISH",
    label: "ITP orderflow up",
    short: "Up",
    description:
      "Structure, ranges, and PD arrays on H4/H1/M30 walk to the LTP draw.",
  },
  {
    id: "BEARISH",
    label: "ITP orderflow down",
    short: "Down",
    description:
      "Structure, ranges, and PD arrays on H4/H1/M30 walk to the LTP draw.",
  },
  {
    id: "NONE",
    label: "No ITP",
    short: "None",
    description:
      "You have an LTP but cannot come to an ITP. Do not move to STP. No trade.",
  },
] as const

export type ItpFlowId = (typeof ITP_FLOW)[number]["id"]

export const STP_FLOW = [
  {
    id: "BULLISH",
    label: "STP signatures up",
    short: "Up",
    description: "M15 and lower. Time plus specific signatures of price.",
  },
  {
    id: "BEARISH",
    label: "STP signatures down",
    short: "Down",
    description: "M15 and lower. Time plus specific signatures of price.",
  },
  {
    id: "NONE",
    label: "No STP entry",
    short: "None",
    description: "LTP and ITP are not both aligned yet, or no signature printed.",
  },
] as const

export type StpFlowId = (typeof STP_FLOW)[number]["id"]

export type PerspectiveStage = "LTP" | "ITP" | "STP" | "ALIGNED"

export function perspectiveAlignment(input: {
  ltpBias: string
  itpFlow: string
  stpFlow: string
}): { stage: PerspectiveStage; aligned: boolean; message: string } {
  const ltpCalled = input.ltpBias === "BULLISH" || input.ltpBias === "BEARISH"
  if (!ltpCalled) {
    return {
      stage: "LTP",
      aligned: false,
      message:
        "LTP first. Answer one question: what is the next daily candle likely to do? HTBL/LTBH and IRL/ERL help you call it.",
    }
  }
  if (input.itpFlow !== input.ltpBias) {
    return {
      stage: "ITP",
      aligned: false,
      message:
        "No ITP in the same orderflow. Do not move to STP. There is no trade until ITP walks to the LTP draw.",
    }
  }
  if (input.stpFlow !== input.ltpBias) {
    return {
      stage: "STP",
      aligned: false,
      message:
        "LTP and ITP are aligned. Wait for STP on M15 or lower: time plus a specific signature of price.",
    }
  }
  return {
    stage: "ALIGNED",
    aligned: true,
    message:
      "Perspective aligned. Same orderflow on LTP, ITP, and STP. That is the only time you execute.",
  }
}

export function perspectiveTagsFor(input: {
  itpFlow: string
  stpFlow: string
  aligned: boolean
  stage: PerspectiveStage
}): string[] {
  const tags: string[] = []
  const itp = ITP_FLOW.find((item) => item.id === input.itpFlow)
  if (itp) tags.push(`ITP ${itp.short}`)
  const stp = STP_FLOW.find((item) => item.id === input.stpFlow)
  if (stp) tags.push(`STP ${stp.short}`)
  if (input.aligned) tags.push("Perspective aligned")
  else tags.push(`Perspective ${input.stage}`)
  return tags
}

/**
 * LTP candle anatomy. Weekly and monthly first: one candle is a
 * multi-day bias. Read OHLC / OLHC to call the next daily.
 */
export const CANDLE_PATHS = [
  {
    id: "OHLC",
    label: "OHLC",
    short: "OHLC",
    description:
      "Open, high, low, close. Price seeks the high first, then the low. Bearish delivery path.",
  },
  {
    id: "OLHC",
    label: "OLHC",
    short: "OLHC",
    description:
      "Open, low, high, close. Price seeks the low first, then the high. Bullish delivery path.",
  },
] as const

export type CandlePathId = (typeof CANDLE_PATHS)[number]["id"]

export const CANDLE_FORMATIONS = [
  {
    id: "CLASSIC_BUY",
    label: "Classic buy",
    short: "Buy body",
    description: "Full bullish candle. Mostly body, little wick.",
    bias: "BULLISH",
  },
  {
    id: "CLASSIC_SELL",
    label: "Classic sell",
    short: "Sell body",
    description: "Full bearish candle. Mostly body, little wick.",
    bias: "BEARISH",
  },
  {
    id: "BULLISH_REVERSAL",
    label: "Bullish reversal",
    short: "Bull rev",
    description:
      "Bottom wick. Starts the day heavily bearish, then reverses — usually after trading into a key level.",
    bias: "BULLISH",
  },
  {
    id: "BEARISH_REVERSAL",
    label: "Bearish reversal",
    short: "Bear rev",
    description:
      "Top wick. Starts the day heavily bullish, then reverses later.",
    bias: "BEARISH",
  },
  {
    id: "CONSOLIDATION",
    label: "Consolidation",
    short: "Chop",
    description:
      "Big wicks on both sides. Sideways. Avoid. No daily bias from this candle.",
    bias: "RANGE",
  },
] as const

export type CandleFormationId = (typeof CANDLE_FORMATIONS)[number]["id"]

export const CANDLE_ENTRIES = [
  {
    id: "OPEN",
    label: "Open",
    short: "Open",
    description: "Above or below the open of the candle.",
  },
  {
    id: "MID_EXPANSION",
    label: "Middle expansion",
    short: "Mid",
    description: "Middle of the candle, during an expansion.",
  },
  {
    id: "END",
    label: "End of candle",
    short: "End",
    description:
      "High or low is established. Buy-side or sell-side liquidity taken. HC or LC.",
  },
] as const

export type CandleEntryId = (typeof CANDLE_ENTRIES)[number]["id"]

export const CANDLE_ENDS = [
  {
    id: "HC",
    label: "HC · high established",
    short: "HC",
    description: "High of the candle is in. Buy-side liquidity taken.",
  },
  {
    id: "LC",
    label: "LC · low established",
    short: "LC",
    description: "Low of the candle is in. Sell-side liquidity taken.",
  },
] as const

export type CandleEndId = (typeof CANDLE_ENDS)[number]["id"]

export function candleTagsFor(input: {
  candlePath: string
  candleFormation: string
  candleEntry: string
  candleEnd: string
}): string[] {
  const tags: string[] = []
  const path = CANDLE_PATHS.find((item) => item.id === input.candlePath)
  if (path) tags.push(`Candle ${path.label}`)
  const formation = CANDLE_FORMATIONS.find(
    (item) => item.id === input.candleFormation
  )
  if (formation) tags.push(`Candle ${formation.label}`)
  const entry = CANDLE_ENTRIES.find((item) => item.id === input.candleEntry)
  if (entry) tags.push(`Candle entry ${entry.short}`)
  if (input.candleEntry === "END") {
    const end = CANDLE_ENDS.find((item) => item.id === input.candleEnd)
    if (end) tags.push(`Candle ${end.short}`)
  }
  return tags
}

export function formationBias(id: string): "BULLISH" | "BEARISH" | "RANGE" | null {
  return CANDLE_FORMATIONS.find((item) => item.id === id)?.bias ?? null
}

/**
 * HTF institutional order flow on LTP. Trend is your friend until
 * price trades into an opposing key level. Blend these signatures with
 * candle anatomy, the HTF KL, and premium / discount.
 */
export const LTP_IOF_SIDES = [
  {
    id: "BEARISH",
    label: "Bearish IOF",
    short: "Bearish",
    description:
      "Lows broken, highs rejected. Stay short until an opposing key level.",
  },
  {
    id: "BULLISH",
    label: "Bullish IOF",
    short: "Bullish",
    description:
      "Highs broken, lows rejected. Stay long until an opposing key level.",
  },
] as const

export type LtpIofSideId = (typeof LTP_IOF_SIDES)[number]["id"]

export const LTP_IOF_BEARISH = [
  {
    id: "LOWS_BROKEN",
    n: 1,
    label: "Lows broken, highs rejected",
    description:
      "Price is punching through lows and rejecting highs.",
  },
  {
    id: "UPCLOSE_SUPPORT",
    n: 2,
    label: "Upcloses / OBs supporting lower",
    description:
      "Up-closed candles or order blocks used to continue delivery lower — same signature, not two reads.",
  },
  {
    id: "BEAR_FVG_HOLD",
    n: 3,
    label: "Bearish FVGs hold, bullish FVGs fail",
    description:
      "Bearish imbalances hold as resistance. Bullish imbalances are not respected.",
  },
] as const

export const LTP_IOF_BULLISH = [
  {
    id: "HIGHS_BROKEN",
    n: 1,
    label: "Highs broken, lows rejected",
    description:
      "Price is punching through highs and rejecting lows.",
  },
  {
    id: "DOWNCLOSE_SUPPORT",
    n: 2,
    label: "Downcloses / OBs supporting higher",
    description:
      "Down-closed candles or order blocks used to continue delivery higher — same signature, not two reads.",
  },
  {
    id: "BULL_FVG_HOLD",
    n: 3,
    label: "Bullish FVGs hold, bearish FVGs fail",
    description:
      "Bullish imbalances hold as support. Bearish imbalances are not respected.",
  },
] as const

export const LTP_IOF_CONFIRM = [
  {
    id: "INTO_OPPOSING_KL",
    label: "Into opposing KL",
    description:
      "Price traded into the opposing key level. IOF is proven otherwise only here.",
  },
] as const

export function ltpIofSignatures(side: string) {
  if (side === "BEARISH") return LTP_IOF_BEARISH
  if (side === "BULLISH") return LTP_IOF_BULLISH
  return []
}

export function ltpIofTagsFor(input: {
  side: string
  checks: string[]
}): string[] {
  const tags: string[] = []
  const side = LTP_IOF_SIDES.find((item) => item.id === input.side)
  if (side) tags.push(`HTF IOF ${side.short}`)
  const signatures = ltpIofSignatures(input.side)
  for (const check of signatures) {
    if (input.checks.includes(check.id)) tags.push(`HTF IOF ${check.label}`)
  }
  for (const check of LTP_IOF_CONFIRM) {
    if (input.checks.includes(check.id)) tags.push(`HTF IOF ${check.label}`)
  }
  const coreIds = signatures.map((item) => item.id)
  const coreHit = coreIds.filter((id) => input.checks.includes(id)).length
  if (side && coreHit >= 3 && !input.checks.includes("INTO_OPPOSING_KL")) {
    tags.push("HTF IOF until opposing KL")
  }
  return tags
}

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
    description: "Friday close to Sunday open. Draw on liquidity, or a key level.",
  },
  {
    id: "NDOG",
    label: "New day opening gap",
    short: "NDOG",
    description:
      "Previous day's close to the new day's open. Draw on liquidity, or a key level.",
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

export function liquidityTagsFor(
  input: {
    rangeLiquidity: string
    imbalanceType: string
    externalPool: string
  },
  perspective: "LTP" | "ITP" | "STP" = "LTP"
): string[] {
  const tags: string[] = []
  const location = RANGE_LIQUIDITY.find((item) => item.id === input.rangeLiquidity)
  if (location) tags.push(`RL ${perspective} ${location.label}`)
  if (input.rangeLiquidity === "INTERNAL") {
    const imbalance = IMBALANCES.find((item) => item.id === input.imbalanceType)
    if (imbalance) tags.push(`RL ${perspective} ${imbalance.label}`)
  }
  const pool = EXTERNAL_POOLS.find((item) => item.id === input.externalPool)
  if (pool) tags.push(`RL ${perspective} ${pool.label}`)
  return tags
}

export function stripLiquidityTags(tags: string[]): string[] {
  return tags.filter(
    (tag) =>
      !LIQUIDITY_TAG_LABELS.has(tag) &&
      !RANGE_TAG_LABELS.has(tag) &&
      !tag.startsWith("Dealing range ") &&
      !tag.startsWith("NWOG ") &&
      !tag.startsWith("NDOG ") &&
      !tag.startsWith("Open ") &&
      !tag.startsWith("ITP ") &&
      !tag.startsWith("STP ") &&
      !tag.startsWith("Perspective ") &&
      !tag.startsWith("Candle ") &&
      !tag.startsWith("HTF IOF") &&
      !tag.startsWith("KL ") &&
      !tag.startsWith("Range pair ") &&
      !tag.startsWith("Range ") &&
      !tag.startsWith("Close ") &&
      !tag.startsWith("Season ") &&
      !tag.startsWith("Week ") &&
      !tag.startsWith("H4H1 ") &&
      !tag.startsWith("STPKL ") &&
      !tag.startsWith("Purge ") &&
      !tag.startsWith("News ") &&
      !tag.startsWith("EQO ") &&
      !tag.startsWith("Inst ") &&
      !tag.startsWith("RL ") &&
      !tag.startsWith("Defer ") &&
      !tag.startsWith("Pool ") &&
      !tag.startsWith("EQ ") &&
      !tag.startsWith("Gap ") &&
      !tag.startsWith("IPDA ") &&
      !tag.startsWith("MMXM ") &&
      !tag.startsWith("Dealing ")
  )
}

export function rangeTagsFor(
  input: {
    rangeType: string
    rangeSequence: string[]
    fiftyRole: string
    pairedWithHtfKl: boolean
    dealingFormation: string
    rangeConfirms: string[]
    premiumDiscount: "PREMIUM" | "DISCOUNT" | "EQ" | null
    dealingHigh?: string
    dealingLow?: string
  },
  perspective: "LTP" | "ITP" | "STP" = "LTP"
): string[] {
  const tags: string[] = []
  const p = `Range ${perspective} `
  const type = RANGE_TYPES.find((item) => item.id === input.rangeType)
  if (type) tags.push(`${p}${type.label}`)
  for (const id of input.rangeSequence) {
    const step = RANGE_SEQUENCE.find((item) => item.id === id)
    if (step) tags.push(`${p}${step.label}`)
  }
  const fifty = FIFTY_ROLES.find((item) => item.id === input.fiftyRole)
  if (fifty && input.rangeType) tags.push(`${p}${fifty.label}`)
  if (input.pairedWithHtfKl) tags.push(`${p}Paired with HTF KL`)
  for (const id of input.rangeConfirms) {
    const confirm = RANGE_CONFIRMS.find((item) => item.id === id)
    if (confirm) tags.push(`${p}${confirm.label}`)
  }
  return tags
}

export function rangeTypeShort(tags: string[] | null | undefined): string {
  if (!tags?.length) return ""
  return (
    RANGE_TYPES.find((item) =>
      tags.some((tag) => tag === item.label || tag.endsWith(` ${item.label}`))
    )?.short ?? ""
  )
}

/** Internal imbalance draws to an old high or low. A run on that high or low draws back to an FVG. */
export function rangeLiquidityShort(tags: string[] | null | undefined): string {
  if (!tags?.length) return ""
  const has = (label: string) =>
    tags.some((tag) => tag === label || tag.endsWith(` ${label}`))
  const pool = EXTERNAL_POOLS.find((item) => has(item.label))?.short
  if (has("Internal range") && pool) {
    const imbalance =
      IMBALANCES.find((item) => has(item.label))?.short ?? "Internal"
    return `${imbalance}→${pool}`
  }
  if (has("External range") && pool) return `${pool}→FVG`
  return ""
}

/** IPDA profiles. Consolidation only leads to expansion. */
export const MARKET_PROFILES = [
  {
    id: "CONSOLIDATION",
    label: "Consolidation",
    short: "Range",
    description:
      "Accumulation. Stay out. From here only two things happen: breakout-retest-continuation, or AMD. Never consolidation to consolidation.",
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
      "Breakout of consolidation, retest, continuation. One of only two ways a range resolves.",
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

export function ipdaTagsFor(
  setupType: string,
  liquiditySide: string,
  perspective: "LTP" | "ITP" | "STP" = "LTP"
): string[] {
  const tags: string[] = []
  const p = `IPDA ${perspective} `
  const profile = MARKET_PROFILES.find((item) => item.id === setupType)
  if (profile) tags.push(`${p}${profile.label}`)
  const path = RANGE_RESOLUTIONS.find((item) => item.id === liquiditySide)
  if (path) tags.push(`${p}${path.label}`)
  return tags
}

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
      "If the next candle closes inside this candle, it is a consolidation candle. From there only two things happen: breakout, retest, continuation — or AMD. Never consolidation to consolidation.",
  },
] as const

export type RangeTypeId = (typeof RANGE_TYPES)[number]["id"]

export const RANGE_SEQUENCE = [
  {
    id: "INDUCEMENT",
    label: "Inducement / false high",
    description:
      "No range yet. Wait for a false high before the KL. Mark high and low. When price attacks the range high into the KL, attack the range low.",
  },
  {
    id: "BREAK_INTO_KL",
    label: "Broke range into KL",
    description:
      "Range already there. Price broke the range high into the HTF key level.",
  },
  {
    id: "BREAK_BACK",
    label: "Attack the other side",
    description:
      "After the range high is taken into the KL, attack the range low (or the inverse).",
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

/** LTP dealing range: run one swing, expand through the other, split at 50%. */
export const DEALING_FORMATIONS = [
  {
    id: "HIGH_THEN_LOW",
    label: "Bearish dealing range",
    short: "Bear DR",
    description:
      "Swing high is run, then price breaks a swing low with an expansion leg. That leg is the range. Split it in half: sell premium, never sell discount.",
    delivery: "P_TO_D",
    bias: "BEARISH",
  },
  {
    id: "LOW_THEN_HIGH",
    label: "Bullish dealing range",
    short: "Bull DR",
    description:
      "Swing low is run, then price trades through a swing high with an expansion leg. That leg is the range. Split it in half: buy discount, never buy premium.",
    delivery: "D_TO_P",
    bias: "BULLISH",
  },
] as const

export type DealingFormationId = (typeof DEALING_FORMATIONS)[number]["id"]

export const DEALING_JOBS = [
  {
    id: "ENTRY",
    label: "Range as entry",
    description:
      "Dealing range is the parameter for the entry. Long from discount, short from premium.",
  },
  {
    id: "DOL",
    label: "Range as DOL",
    description:
      "The other side of the dealing range is the draw on liquidity.",
  },
] as const

export type DealingJobId = (typeof DEALING_JOBS)[number]["id"]

export const DEALING_DELIVERY = [
  {
    id: "P_TO_D",
    label: "Premium → discount",
    description: "Market is delivering from premium to discount.",
  },
  {
    id: "D_TO_P",
    label: "Discount → premium",
    description: "Market is delivering from discount to premium.",
  },
] as const

export type DealingDeliveryId = (typeof DEALING_DELIVERY)[number]["id"]

export function dealingTagsFor(
  input: {
    formation: string
    high: string
    low: string
    jobs: string[]
    delivery: string
    ltfIntoKl: boolean
    premiumDiscount?: "PREMIUM" | "DISCOUNT" | "EQ" | null
  },
  perspective: "LTP" | "ITP" | "STP" = "LTP"
): string[] {
  const tags: string[] = []
  const p = `Dealing ${perspective} `
  const formation = DEALING_FORMATIONS.find((item) => item.id === input.formation)
  if (formation) {
    tags.push(`${p}range`)
    tags.push(`${p}${formation.label}`)
  }
  if (input.high && input.low) {
    tags.push(`${p}${input.high}–${input.low}`)
  }
  for (const id of input.jobs) {
    const job = DEALING_JOBS.find((item) => item.id === id)
    if (job) tags.push(`${p}${job.label}`)
  }
  const delivery = DEALING_DELIVERY.find((item) => item.id === input.delivery)
  if (delivery) tags.push(`${p}${delivery.label}`)
  if (input.ltfIntoKl) tags.push(`${p}LTF into KL in P/D`)
  if (input.premiumDiscount === "PREMIUM") tags.push(`${p}Premium`)
  if (input.premiumDiscount === "DISCOUNT") tags.push(`${p}Discount`)
  return tags
}

/**
 * HTF key levels. Every trade is based on one. Trade price to it
 * (draw) or from it. Blend with premium / discount. Daily can be HTF.
 */
export const HTF_KL_TYPES = [
  {
    id: "OLD_HIGH_LOW",
    n: 1,
    label: "Old highs / lows",
    short: "OH/OL",
    description:
      "Old highs and old lows. Previous weekly high and low are HTF key levels.",
  },
  {
    id: "REJECTION_BLOCK",
    n: 2,
    label: "Rejection block",
    short: "RB",
    description: "A rejection block on the higher-timeframe chart.",
  },
  {
    id: "FVG",
    n: 3,
    label: "FVG",
    short: "FVG",
    description:
      "Fair value gap. A daily break of structure is often just a retracement into a weekly FVG.",
  },
  {
    id: "OPENING_GAP",
    n: 4,
    label: "NWOG / NDOG",
    short: "Gap",
    description: "New week or new day opening gap as a key level.",
  },
  {
    id: "ORDER_BLOCK",
    n: 5,
    label: "Order block",
    short: "OB",
    description: "Higher-timeframe order block.",
  },
] as const

export type HtfKlTypeId = (typeof HTF_KL_TYPES)[number]["id"]

export const HTF_KL_JOBS = [
  {
    id: "TO",
    label: "To the KL",
    short: "To",
    description: "Trade price into the key level. It is the draw on liquidity.",
  },
  {
    id: "FROM",
    label: "From the KL",
    short: "From",
    description: "Engage at the key level and trade away from it.",
  },
] as const

export type HtfKlJobId = (typeof HTF_KL_JOBS)[number]["id"]

export const HTF_KL_PATHS = [
  {
    id: "P_TO_D",
    label: "Premium KL → discount KL",
    description: "Trade a premium key level toward a discount key level.",
  },
  {
    id: "D_TO_P",
    label: "Discount KL → premium KL",
    description: "Trade a discount key level toward a premium key level.",
  },
] as const

export const HTF_KL_CONTEXT = [
  {
    id: "PREV_WEEK",
    label: "Previous weekly high/low",
    description: "Last week's high or low is the HTF key level.",
  },
  {
    id: "TO_LTF",
    label: "HTF KL → LTF liquidity",
    description: "From the higher-timeframe key level into lower-timeframe liquidity.",
  },
  {
    id: "PD_STACK",
    label: "PD array on HTF PD array",
    description: "A PD array sitting on a higher-timeframe PD array. Higher probability.",
  },
  {
    id: "DAILY_RETRACE",
    label: "Daily BOS is weekly FVG",
    description:
      "What looks like a daily break of structure is a retracement to a weekly FVG. Do not call daily the HTF.",
  },
] as const

export const HTF_KL_CLOSES = [
  {
    id: "BULLISH",
    label: "Bullish closure at KL",
    description:
      "At the key level: wick below and close above. Start expecting highs.",
  },
  {
    id: "BEARISH",
    label: "Bearish closure at KL",
    description:
      "At the key level: wick above and close below. Start expecting lows.",
  },
] as const

/**
 * Candle closures — easiest daily-bias read. Price follows closures
 * until the draw. Blend with premium / discount and the HTF KL.
 */
export const BULLISH_CLOSURES = [
  {
    id: "WICK_BELOW",
    label: "Wick below → higher",
    description: "Wick below. Expect higher prices. One side, not both.",
  },
  {
    id: "CLOSE_ABOVE",
    label: "Close above → higher",
    description: "Close above. Expect higher prices.",
  },
] as const

export const BEARISH_CLOSURES = [
  {
    id: "WICK_ABOVE",
    label: "Wick above → lower",
    description: "Wick above. Expect lower prices. One side, not both.",
  },
  {
    id: "CLOSE_BELOW",
    label: "Close below → lower",
    description: "Close below. Expect lower prices.",
  },
] as const

export const CLOSURE_CONTEXT = [
  {
    id: "ONE_SIDE",
    label: "Wick one side only",
    description:
      "Price wicks one side, not both. Both sides is consolidation — use the range.",
  },
  {
    id: "UNTIL_DRAW",
    label: "Follow closures to the draw",
    description:
      "Price moves according to closures until the draw. Bullish until the high is taken, usually the end of the candle.",
  },
  {
    id: "VS_PREV_AT_KL",
    label: "Wick below previous, close above",
    description:
      "At the key level: this candle wicked below the previous candle and closed above.",
  },
  {
    id: "USE_CONSOL",
    label: "Use the consolidation",
    description:
      "In consolidation, use the consolidation. Everything else is just consolidation.",
  },
] as const

export function closureBias(
  signatures: string[]
): "BULLISH" | "BEARISH" | "MIXED" | null {
  const bull = BULLISH_CLOSURES.some((item) => signatures.includes(item.id))
  const bear = BEARISH_CLOSURES.some((item) => signatures.includes(item.id))
  if (bull && bear) return "MIXED"
  if (bull) return "BULLISH"
  if (bear) return "BEARISH"
  return null
}

export function closureTagsFor(input: {
  signatures: string[]
  context: string[]
}): string[] {
  const tags: string[] = []
  for (const id of input.signatures) {
    const bull = BULLISH_CLOSURES.find((item) => item.id === id)
    const bear = BEARISH_CLOSURES.find((item) => item.id === id)
    if (bull) tags.push(`Close ${bull.label}`)
    if (bear) tags.push(`Close ${bear.label}`)
  }
  for (const id of input.context) {
    const ctx = CLOSURE_CONTEXT.find((item) => item.id === id)
    if (ctx) tags.push(`Close ${ctx.label}`)
  }
  return tags
}

/**
 * Last LTP lesson. Use with anatomy, IOF, P/D, HTF KLs, aligned
 * ranges, and closures. Index futures is a permabull on the HTF —
 * that is why this is last, not first.
 *
 * Course month map. 27-year NQ averages still have September as the
 * weakest month and May / July / November as the strongest. October
 * has strengthened vs "slightly bullish." February is only mildly
 * negative on the long sample.
 */
export const SEASONAL_MONTHS = [
  { month: 1, id: "JAN", label: "January", short: "Jan", tone: "SEMI_BULL", course: "Semi bullish" },
  { month: 2, id: "FEB", label: "February", short: "Feb", tone: "BEAR", course: "Bearish" },
  { month: 3, id: "MAR", label: "March", short: "Mar", tone: "SEMI_BULL", course: "Semi bullish" },
  { month: 4, id: "APR", label: "April", short: "Apr", tone: "SMALL_BULL", course: "Small bull" },
  { month: 5, id: "MAY", label: "May", short: "May", tone: "EXTREME_BULL", course: "Extreme bull" },
  { month: 6, id: "JUN", label: "June", short: "Jun", tone: "EXTREME_BULL", course: "Extreme bull" },
  { month: 7, id: "JUL", label: "July", short: "Jul", tone: "EXTREME_BULL", course: "Extreme bull" },
  { month: 8, id: "AUG", label: "August", short: "Aug", tone: "SLIGHT_BULL", course: "Slightly bullish" },
  { month: 9, id: "SEP", label: "September", short: "Sep", tone: "BEAR", course: "Bearish" },
  { month: 10, id: "OCT", label: "October", short: "Oct", tone: "SLIGHT_BULL", course: "Slightly bullish" },
  { month: 11, id: "NOV", label: "November", short: "Nov", tone: "EXTREME_BULL", course: "Extreme bull" },
  { month: 12, id: "DEC", label: "December", short: "Dec", tone: "SLIGHT_BULL", course: "Slightly bullish" },
] as const

export type SeasonalTone = (typeof SEASONAL_MONTHS)[number]["tone"]

export function seasonalForMonth(month: number) {
  return SEASONAL_MONTHS.find((item) => item.month === month) ?? null
}

export const QUARTERLY_SHIFTS = [
  {
    id: "Q1",
    month: 1,
    label: "Q1 · January",
    description: "January shift. Prior-quarter high is BSL, prior-quarter low is SSL.",
  },
  {
    id: "Q2",
    month: 4,
    label: "Q2 · April",
    description: "April shift. Will this quarter expand above the Q1 high or below the Q1 low?",
  },
  {
    id: "Q3",
    month: 7,
    label: "Q3 · July",
    description: "July shift. Prior-quarter high / low is the draw.",
  },
  {
    id: "Q4",
    month: 10,
    label: "Q4 · October",
    description: "October shift. Prior-quarter high / low is the draw.",
  },
] as const

export function quarterForMonth(month: number) {
  if (month <= 3) return QUARTERLY_SHIFTS[0]
  if (month <= 6) return QUARTERLY_SHIFTS[1]
  if (month <= 9) return QUARTERLY_SHIFTS[2]
  return QUARTERLY_SHIFTS[3]
}

export const QUARTER_DRAWS = [
  {
    id: "PRIOR_HIGH",
    label: "Prior quarter high",
    description:
      "Seeking BSL above last quarter's high. Default read in a permabull.",
  },
  {
    id: "PRIOR_LOW",
    label: "Prior quarter low",
    description: "Seeking SSL below last quarter's low.",
  },
] as const

export const SMT_PAIRS = [
  {
    id: "YM",
    label: "YM / NQ",
    description: "Primary SMT. Dow vs Nasdaq.",
  },
  {
    id: "NVDA",
    label: "NVDA / NQ",
    description:
      "NVIDIA is a top Nasdaq weight. NVDA takes a previous high while NQ fails — SMT.",
  },
] as const

export const SMT_READS = [
  {
    id: "LEAD_HIGH",
    label: "Leader took high, NQ failed",
    description: "Correlated leader made the high. NQ did not. Bearish SMT.",
  },
  {
    id: "LEAD_LOW",
    label: "Leader took low, NQ failed",
    description: "Correlated leader made the low. NQ did not. Bullish SMT.",
  },
  {
    id: "NONE",
    label: "No SMT",
    description: "Indexes are moving together.",
  },
] as const

export function seasonalTagsFor(input: {
  month: number
  quarterDraw: string
  smtPair: string
  smtRead: string
  permabull: boolean
}): string[] {
  const tags: string[] = []
  const season = seasonalForMonth(input.month)
  if (season) tags.push(`Season ${season.short} · ${season.course}`)
  const q = quarterForMonth(input.month)
  tags.push(`Season ${q.label}`)
  const draw = QUARTER_DRAWS.find((item) => item.id === input.quarterDraw)
  if (draw) tags.push(`Season ${draw.label}`)
  const pair = SMT_PAIRS.find((item) => item.id === input.smtPair)
  if (pair) tags.push(`Season SMT ${pair.label}`)
  const read = SMT_READS.find((item) => item.id === input.smtRead)
  if (read && read.id !== "NONE") tags.push(`Season ${read.label}`)
  if (input.permabull) tags.push("Season HTF permabull")
  return tags
}

/**
 * First ITP lesson. Weekly profile: narrative + structure + ranges +
 * PD arrays into the HTF key level. Data-driven days are meaningless
 * until blended with the rest of the analysis.
 */
export const WEEK_PROFILE_STEPS = [
  {
    id: "ANATOMY",
    n: 1,
    label: "Candle anatomy",
    description: "Read the weekly candle the same way as LTP: OHLC / OLHC, body vs wick.",
  },
  {
    id: "DATA_DAYS",
    n: 2,
    label: "Data-driven days",
    description: "Where the week's high and low usually print. Blend it — do not trade it alone.",
  },
  {
    id: "CALENDAR",
    n: 3,
    label: "Economic calendar",
    description: "Time and price should meet. If the KL is Tuesday, Tuesday is the time.",
  },
  {
    id: "KL_ITP",
    n: 4,
    label: "HTF KL + ITP structure",
    description: "Align the higher-timeframe key level with ITP market structure.",
  },
  {
    id: "CISD_ITP",
    n: 5,
    label: "CISD on ITP",
    description:
      "If the 1-candle range is on daily, CISD comes from H1 — the relative timeframe.",
  },
] as const

export const WEEK_COLORS = [
  {
    id: "GREEN",
    label: "Green week",
    description: "Bullish weekly candle.",
  },
  {
    id: "RED",
    label: "Red week",
    description: "Bearish weekly candle.",
  },
] as const

export const WEEK_DAYS = [
  { id: "MON", label: "Monday", weekday: 1 },
  { id: "TUE", label: "Tuesday", weekday: 2 },
  { id: "WED", label: "Wednesday", weekday: 3 },
  { id: "THU", label: "Thursday", weekday: 4 },
  { id: "FRI", label: "Friday", weekday: 5 },
] as const

/** NQ: % of weeks this day printed the week's high or low. Course data. */
export const WEEK_DAY_STATS: Record<
  "GREEN" | "RED",
  { HIGH: Record<string, number>; LOW: Record<string, number> }
> = {
  RED: {
    HIGH: { MON: 47, TUE: 37, WED: 5, THU: 11, FRI: 0 },
    LOW: { MON: 5, TUE: 11, WED: 21, THU: 11, FRI: 53 },
  },
  GREEN: {
    HIGH: { MON: 0, TUE: 6, WED: 3, THU: 35, FRI: 56 },
    LOW: { MON: 50, TUE: 24, WED: 15, THU: 9, FRI: 3 },
  },
}

export const WEEK_EXTREMES = [
  { id: "HIGH", label: "Week's high" },
  { id: "LOW", label: "Week's low" },
] as const

export const WEEK_RANGE_RUNS = [
  {
    id: "W1_H4",
    label: "Weekly KL · ran H4 range",
    description:
      "80% of the week's high or low forms at a weekly or daily KL while running its range. Weekly low: run the H4 range low.",
  },
  {
    id: "D1_H1",
    label: "Daily KL · ran H1 range",
    description:
      "Daily low is formed by running out the H1 range low. CISD to confirm that low is on H1.",
  },
] as const

export const WEEK_NOTES = [
  {
    id: "MON_LOW_NO_KL",
    label: "Monday low, no HTF KL",
    description:
      "Monday often forms the low, but if it did not trade into the HTF key level it is only inducement.",
  },
  {
    id: "TIME_PRICE",
    label: "Time and price met",
    description:
      "Calendar and the key level lined up. Example: Tuesday is the time, price has the KL.",
  },
] as const

export function weekDayFromDate(date: Date) {
  const short = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
  }).format(date)
  const map: Record<string, string> = {
    Mon: "MON",
    Tue: "TUE",
    Wed: "WED",
    Thu: "THU",
    Fri: "FRI",
  }
  const id = map[short]
  return WEEK_DAYS.find((day) => day.id === id) ?? null
}

export function weekDayStat(
  color: string,
  extreme: string,
  day: string
): number | null {
  if (color !== "GREEN" && color !== "RED") return null
  if (extreme !== "HIGH" && extreme !== "LOW") return null
  const value = WEEK_DAY_STATS[color][extreme][day]
  return typeof value === "number" ? value : null
}

export function weekProfileTagsFor(input: {
  color: string
  day: string
  extreme: string
  steps: string[]
  rangeRun: string
  notes: string[]
}): string[] {
  const tags: string[] = []
  const color = WEEK_COLORS.find((item) => item.id === input.color)
  if (color) tags.push(`Week ${color.label}`)
  const day = WEEK_DAYS.find((item) => item.id === input.day)
  if (day) tags.push(`Week ${day.label}`)
  const extreme = WEEK_EXTREMES.find((item) => item.id === input.extreme)
  if (extreme) tags.push(`Week ${extreme.label}`)
  for (const id of input.steps) {
    const step = WEEK_PROFILE_STEPS.find((item) => item.id === id)
    if (step) tags.push(`Week ${step.label}`)
  }
  const run = WEEK_RANGE_RUNS.find((item) => item.id === input.rangeRun)
  if (run) tags.push(`Week ${run.label}`)
  for (const id of input.notes) {
    const note = WEEK_NOTES.find((item) => item.id === id)
    if (note) tags.push(`Week ${note.label}`)
  }
  return tags
}

/**
 * H4 / H1 ITP. Trade only in the direction of LTP. Frame the next
 * daily or weekly candle. Two scenarios: rebalance an imbalance, or
 * run stops toward the LTP draw. Ideally always a range.
 */
export const ITP_HORIZONS = [
  {
    id: "NEXT_DAY",
    label: "Next daily candle",
    description: "H4 / H1 is building the direction of tomorrow's candle.",
  },
  {
    id: "NEXT_WEEK",
    label: "Next weekly candle",
    description: "H4 / H1 is building the direction of next week's candle.",
  },
] as const

export const ITP_TOC = [
  {
    id: "STRUCTURE",
    label: "Market structure",
    description: "H4 and H1 structure in the direction of LTP.",
  },
  {
    id: "PD",
    label: "Premium / discount",
    description: "Buy discount, sell premium on the ITP dealing range.",
  },
  {
    id: "RANGE",
    label: "Range",
    description: "Ideally always trading a range on H4 / H1.",
  },
] as const

export const ITP_SCENARIOS = [
  {
    id: "REBALANCE",
    label: "Rebalance an imbalance",
    description:
      "ITP is rebalancing an imbalance on the way to the LTP draw.",
  },
  {
    id: "RUN_STOPS",
    label: "Run stops to LTP DOL",
    description:
      "Bearish: run buy stops. Bullish: run sell stops. Then deliver to the LTP draw.",
  },
] as const

export function itpChartTagsFor(input: {
  horizon: string
  toc: string[]
  scenario: string
  tradingRange: boolean
  ltpBias: string
}): string[] {
  const tags: string[] = []
  const horizon = ITP_HORIZONS.find((item) => item.id === input.horizon)
  if (horizon) tags.push(`H4H1 ${horizon.label}`)
  for (const id of input.toc) {
    const item = ITP_TOC.find((entry) => entry.id === id)
    if (item) tags.push(`H4H1 ${item.label}`)
  }
  const scenario = ITP_SCENARIOS.find((item) => item.id === input.scenario)
  if (scenario) {
    if (scenario.id === "RUN_STOPS") {
      tags.push(
        input.ltpBias === "BEARISH"
          ? "H4H1 Run buy stops"
          : input.ltpBias === "BULLISH"
            ? "H4H1 Run sell stops"
            : "H4H1 Run stops to LTP DOL"
      )
    } else {
      tags.push(`H4H1 ${scenario.label}`)
    }
  }
  if (input.tradingRange) tags.push("H4H1 Trading a range")
  return tags
}

/**
 * ITP KL is not paired with another ITP range. The inducement range
 * for an ITP KL lives on STP: H4 KL → M15, H1 KL → M5.
 * Daily direction → H4 KL (rebalance or run stops) → M15 range.
 */
export const STP_KL_PAIRS = [
  {
    id: "H4_M15",
    kl: "H4",
    range: "M15",
    label: "H4 KL → M15 range",
    description:
      "Trade the H4 key level with an M15 range. Same inducement logic as LTP, on STP.",
  },
  {
    id: "H1_M5",
    kl: "H1",
    range: "M5",
    label: "H1 KL → M5 range",
    description: "Trade the H1 key level with an M5 range.",
  },
] as const

export function pairForItpKl(tf: string) {
  return STP_KL_PAIRS.find((item) => item.kl === tf)?.id ?? ""
}

export const STP_KL_NOTES = [
  {
    id: "CONTINUATION_PURGE",
    label: "Continuation purge",
    description:
      "Timeframe-aligned ranges are for high-probability continuation purges.",
  },
  {
    id: "RANGE_AT_TIME",
    label: "Range taken at a key time",
    description: "Wait for the range to be taken at a key time.",
  },
  {
    id: "DAILY_CLOSURES",
    label: "Daily closures",
    description: "Blend daily candle closures with the H4 KL and the M15 range.",
  },
] as const

export function stpKlTagsFor(input: {
  pair: string
  notes: string[]
}): string[] {
  const tags: string[] = []
  const pair = STP_KL_PAIRS.find((item) => item.id === input.pair)
  if (pair) tags.push(`STPKL ${pair.label}`)
  for (const id of input.notes) {
    const note = STP_KL_NOTES.find((item) => item.id === id)
    if (note) tags.push(`STPKL ${note.label}`)
  }
  return tags
}

/**
 * Continuation purge — universal model, all timeframes. Easiest
 * trade. ITP only does two things toward the LTP draw: rebalance an
 * imbalance, or run stops. This is the stop-run, aligned with LTP
 * and the ITP range.
 */
export const PURGE_STACKS = [
  {
    id: "MN_D1_H4",
    label: "Monthly KL → Daily range → H4 purge",
    klPair: "MN_D1",
    purgeTf: "H4",
    description:
      "Not a run of the previous daily candle high. Run a swing relative to short-term premium / discount.",
  },
  {
    id: "W1_H4_H1",
    label: "Weekly KL → H4 range → H1 purge",
    klPair: "W1_H4",
    purgeTf: "H1",
    description: "H1 continuation purge of a swing on the H4 range.",
  },
  {
    id: "D1_H1_M15",
    label: "Daily KL → H1 range → M15 purge",
    klPair: "D1_H1",
    purgeTf: "M15",
    description: "M15 continuation purge of a swing on the H1 range.",
  },
] as const

export function purgeStackForPair(klPair: string) {
  return PURGE_STACKS.find((item) => item.klPair === klPair)?.id ?? ""
}

export const PURGE_SIDES = [
  {
    id: "BULLISH",
    label: "Bullish · low → high",
    description:
      "Range low to high. Bullish continuation purges on the way to the range high.",
  },
  {
    id: "BEARISH",
    label: "Bearish · high → low",
    description:
      "Range high to low. Bearish continuation purges on the way to the range low.",
  },
] as const

export const PURGE_QUALIFIERS = [
  {
    id: "SWING_NOT_CANDLE",
    label: "Swing vs ST P/D, not prior candle",
    description:
      "The purge is a run of a swing high (or low) on a lower TF than the range — not the previous candle's high. Relative to short-term premium / discount.",
  },
  {
    id: "FAST_AFTER",
    label: "Fast, aggressive after",
    description:
      "The post-purge move is always fast and aggressive. It rarely fails once that swing is taken.",
  },
  {
    id: "WITH_LTP_ITP",
    label: "Aligned with LTP + ITP range",
    description: "Continuation purge only in alignment with LTP and the ITP range.",
  },
] as const

export function purgeTagsFor(input: {
  stack: string
  side: string
  quals: string[]
}): string[] {
  const tags: string[] = []
  const stack = PURGE_STACKS.find((item) => item.id === input.stack)
  if (stack) tags.push(`Purge ${stack.label}`)
  const side = PURGE_SIDES.find((item) => item.id === input.side)
  if (side) tags.push(`Purge ${side.label}`)
  for (const id of input.quals) {
    const q = PURGE_QUALIFIERS.find((item) => item.id === id)
    if (q) tags.push(`Purge ${q.label}`)
  }
  return tags
}

/**
 * STP — equity open. Profile Asia and London at 08:30 NY before you
 * care about 09:30. That profile decides AM vs PM. Eyes only, no pip
 * math. London session model and final-hour macro live here too.
 */
export const STP_WINDOWS = [
  {
    id: "EQUITY_OPEN",
    label: "Equity open",
    description: "09:30 NY. Only after Asia / London are profiled.",
  },
  {
    id: "LONDON_MODEL",
    label: "London session model",
    description: "London session model on STP.",
  },
  {
    id: "FINAL_HOUR",
    label: "Final hour macro",
    description: "Last-hour macro. Often the PM expansion.",
  },
] as const

export const EQUITY_OPEN_ROLES = [
  {
    id: "DISTRIBUTION",
    label: "Distribution",
    description: "Equity open is distributing — expansion with the daily.",
  },
  {
    id: "MANIPULATION",
    label: "Manipulation",
    description: "Equity open is manipulating first. Do not chase the fake.",
  },
] as const

export const PREV_SESSIONS = [
  {
    id: "LONDON_LARGE",
    label: "London extremely large",
    description:
      "Avoid the AM session. Focus on PM. Even if Asia consolidated, AM is likely chop and PM expands with the daily.",
    am: "SIT_AM" as const,
  },
  {
    id: "ASIA_EXTENDED",
    label: "Asia overly extended",
    description:
      "Leave the charts. Come back at 13:00 NY. Do not trade the AM.",
    am: "SIT_AM" as const,
  },
  {
    id: "BOTH_EXPAND",
    label: "Asia + London expand, no retrace",
    description:
      "Both sessions expanded heavily in one direction with no retracement. Avoid AM. Focus on PM.",
    am: "SIT_AM" as const,
  },
  {
    id: "NOT_EXTENDED",
    label: "Asia & London not extended",
    description: "AM session is tradeable.",
    am: "TRADE_AM" as const,
  },
] as const

export const AM_PLANS = [
  {
    id: "TRADE_AM",
    label: "Trade AM",
    description: "Asia and London are not overly extended. Equity open is on.",
  },
  {
    id: "SIT_AM",
    label: "Sit AM · trade PM",
    description: "Do not trade NY AM. Focus on the PM session.",
  },
] as const

export function amPlanFromSessions(sessionIds: string[]) {
  const sit = PREV_SESSIONS.some(
    (item) => item.am === "SIT_AM" && sessionIds.includes(item.id)
  )
  if (sit) return "SIT_AM"
  if (sessionIds.includes("NOT_EXTENDED")) return "TRADE_AM"
  return ""
}

export const MIDNIGHT_RUNS = [
  {
    id: "ABOVE",
    label: "London ran above 00:00 into KL",
    description:
      "London already went above the midnight open into a key level and ran stops. 08:30 is the sell reference.",
  },
  {
    id: "BELOW",
    label: "London ran below 00:00 into KL",
    description:
      "London already went below the midnight open into a key level and ran stops. 08:30 is the buy reference.",
  },
] as const

export function vsOpeningPrices(
  entry: number,
  midnight: number,
  eightThirty: number
): {
  midnight: "above" | "below" | "at"
  eightThirty: "above" | "below" | "at"
  both: "above" | "below" | "split" | null
} | null {
  if (Number.isNaN(entry)) return null
  const side = (open: number): "above" | "below" | "at" | null => {
    if (Number.isNaN(open)) return null
    if (entry === open) return "at"
    return entry > open ? "above" : "below"
  }
  const m = side(midnight)
  const e = side(eightThirty)
  if (m == null && e == null) return null
  const both =
    m && e && m !== "at" && e !== "at"
      ? m === e
        ? m
        : "split"
      : null
  return {
    midnight: m ?? "at",
    eightThirty: e ?? "at",
    both,
  }
}

export function stpOpenTagsFor(input: {
  window: string
  openRole: string
  sessions: string[]
  amPlan: string
  waitEql: boolean
  midnightOpen?: string
  open0830?: string
  midnightRun?: string
  vsBoth?: "above" | "below" | "split" | null
}): string[] {
  const tags: string[] = []
  const win = STP_WINDOWS.find((item) => item.id === input.window)
  if (win) tags.push(`STP ${win.label}`)
  const role = EQUITY_OPEN_ROLES.find((item) => item.id === input.openRole)
  if (role) tags.push(`STP ${role.label}`)
  for (const id of input.sessions) {
    const s = PREV_SESSIONS.find((item) => item.id === id)
    if (s) tags.push(`STP ${s.label}`)
  }
  const plan = AM_PLANS.find((item) => item.id === input.amPlan)
  if (plan) tags.push(`STP ${plan.label}`)
  if (input.waitEql) tags.push("STP Wait for EQLs")
  if (input.midnightOpen) tags.push(`Open 0000 ${input.midnightOpen}`)
  if (input.open0830) tags.push(`Open 0830 ${input.open0830}`)
  const run = MIDNIGHT_RUNS.find((item) => item.id === input.midnightRun)
  if (run) tags.push(`STP ${run.label}`)
  if (input.vsBoth === "above") tags.push("STP Above both opens")
  if (input.vsBoth === "below") tags.push("STP Below both opens")
  return tags
}

/**
 * Index futures news cheat sheet. Repeating characteristics — most of
 * the time, not always. This is how you know manipulation vs
 * distribution into the equity open and PM.
 */
export const NEWS_EVENTS = [
  {
    id: "NONE",
    label: "No high-impact news",
    description:
      "Focus on 09:30 as manipulation in the opposing direction of the DOL.",
  },
  {
    id: "NEWS_0830",
    label: "08:30 news",
    description:
      "Most common. Either 08:30 manipulates and 09:30 distributes, or 08:30 goes against the DOL without taking liquidity and 09:30 runs it and reverses into the DOL.",
  },
  {
    id: "DOUBLE_0830",
    label: "Two prints at 08:30",
    description: "Double manipulation before 09:30 is possible.",
  },
  {
    id: "NEWS_0830_0945",
    label: "08:30 + 09:45 (two-stage)",
    description:
      "Always wait for 10:00. Do not look until after 09:45. 08:30–10:00 is usually seek-and-destroy chop. 10:00 is a new H4 candle — then the real move to the DOL, no chop.",
  },
  {
    id: "NEWS_10",
    label: "10:00 news",
    description:
      "Always wait for 09:30 first. If 09:30 manipulated, expect 10:00 distribution. 10:00 is a new H4 candle.",
  },
  {
    id: "FOMC",
    label: "FOMC",
    description:
      "Wait for the last FOMC print. Engage after 14:45 NY. Both sides usually get run. The real move is often the 15:00 final-hour macro.",
  },
  {
    id: "NFP",
    label: "NFP",
    description:
      "Wait for 08:30. Only trade NFP when it manipulates against the HTF DOL. Distribution with the DOL = sit the day.",
  },
  {
    id: "YELLOW_PM_BOND",
    label: "Yellow folder / bond auction",
    description:
      "No high or medium impact: PM is usually clean. Even with high/medium news, a yellow-folder bond auction can still print a clean PM.",
  },
] as const

export const NEWS_ROLES = [
  { id: "MANIPULATION", label: "Manipulation" },
  { id: "DISTRIBUTION", label: "Distribution" },
] as const

export const NEWS_TELLS = [
  {
    id: "0830_NO_LIQ",
    label: "08:30 against DOL, liq not taken",
    description:
      "08:30 moved opposite the DOL and liquidity is still there. 09:30 runs it and reverses fast into the DOL.",
  },
  {
    id: "0830_TO_KL",
    label: "08:30 reversed to KL / stops",
    description: "08:30 reversed into a KL and took stops. Expect 09:30 to attack the DOL.",
  },
  {
    id: "H4_INSIDE",
    label: "H4 close inside previous",
    description:
      "10:00 is a new H4. Close back inside the previous H4 after 09:30 manipulation.",
  },
  {
    id: "H4_ABOVE",
    label: "H4 close above prior high",
    description: "Close above the previous H4 high at 10:00. Bullish.",
  },
  {
    id: "WIPE_ASIA_LONDON",
    label: "10:00 wipes Asia / London",
    description:
      "Asia and London trended one way. 09:30 manipulates; 10:00 distributes that liquidity against that trend.",
  },
  {
    id: "NFP_NO_LOWS",
    label: "NFP did not take lows",
    description: "No entry model. Stay out. It will chop.",
  },
  {
    id: "SIT_DAY",
    label: "Sit the day",
    description: "NFP distributed with the HTF DOL, or NFP ran with the DOL. Mess / chop.",
  },
] as const

export function newsPlaybook(id: string): string {
  return NEWS_EVENTS.find((item) => item.id === id)?.description ?? ""
}

export function newsDayNote(input: {
  event: string
  role0830: string
  role0930: string
  role10: string
}): string {
  const { event, role0830, role0930, role10 } = input
  if (event === "NFP" && role0830 === "DISTRIBUTION") {
    return "NFP distributed with the HTF DOL. Sit the day. 09:30 is usually a mess. If NFP ran with the DOL, it chops."
  }
  if (event === "NFP" && role0830 === "MANIPULATION") {
    return "NFP manipulated against the DOL. Wait for a model. 09:30 or 10:00 can scalp; 10:00 is usually cleaner."
  }
  if (event === "NEWS_10" && role0930 === "MANIPULATION") {
    return "09:30 was manipulation. Expect 10:00 distribution. Watch the H4 close inside the previous candle — 10:00 is a new H4."
  }
  if (event === "NEWS_10" && role10 === "MANIPULATION") {
    return "10:00 manipulation takes the high (or low) and reverses. Against Asia/London price action when they trended one way."
  }
  if (
    event === "NEWS_0830" &&
    role0830 === "MANIPULATION" &&
    role0930 === "DISTRIBUTION"
  ) {
    return "08:30 manipulated. 09:30 distributes."
  }
  if (event === "NEWS_0830" && role0830 === "MANIPULATION") {
    return "08:30 reversed. Expect 09:30 to attack the DOL."
  }
  if (event === "NEWS_0830_0945") {
    return "Seek and destroy from 08:30 until 10:00. Then the DOL, no chop. New H4 candle."
  }
  if (event === "FOMC") {
    return "Wait for the last FOMC print. After 14:45 NY both sides usually get run. Real move is often 15:00."
  }
  if (event === "YELLOW_PM_BOND") {
    return "Yellow folder / bond auction. PM is usually clean even if high/medium news printed earlier."
  }
  return newsPlaybook(event)
}

export function newsTagsFor(input: {
  event: string
  role0830: string
  role0930: string
  role10: string
  tells: string[]
}): string[] {
  const tags: string[] = []
  const event = NEWS_EVENTS.find((item) => item.id === input.event)
  if (event) tags.push(`News ${event.label}`)
  if (input.role0830) {
    const role = NEWS_ROLES.find((item) => item.id === input.role0830)
    if (role) tags.push(`News 08:30 ${role.label}`)
  }
  if (input.role0930) {
    const role = NEWS_ROLES.find((item) => item.id === input.role0930)
    if (role) tags.push(`News 09:30 ${role.label}`)
  }
  if (input.role10) {
    const role = NEWS_ROLES.find((item) => item.id === input.role10)
    if (role) tags.push(`News 10:00 ${role.label}`)
  }
  for (const id of input.tells) {
    const tell = NEWS_TELLS.find((item) => item.id === id)
    if (tell) tags.push(`News ${tell.label}`)
  }
  return tags
}

/**
 * Equity open (09:00–10:30 NY). 90-minute killzone. LTP → ITP → STP
 * for 3–6 months of testing. 09:30 is manipulation or distribution.
 * Anticipate both. Questionnaire confirms STP.
 */
export const EQ_OPEN_930 = [
  {
    id: "MANIPULATION",
    label: "09:30 manipulation",
    description:
      "Run on liquidity opposing the DOL. Most traders know this one.",
  },
  {
    id: "DISTRIBUTION",
    label: "09:30 distribution",
    description:
      "Harder read. Distribution if stops already ran before 09:30. Catch both and you have a plethora of trades in the window.",
  },
  {
    id: "CHOP",
    label: "09:30 chop",
    description: "Chop is understood from the previous session / news profile.",
  },
] as const

export const EQ_MANIP_SCENES = [
  {
    id: "REVERSAL",
    label: "Reversal",
    description: "Equity open reverses after the run opposing the DOL.",
  },
  {
    id: "CONT_PURGE",
    label: "Continuation purge",
    description:
      "High probability when a range sits inside a dealing range.",
  },
] as const

export const EQ_DIST_SCENES = [
  {
    id: "AFTER_0830",
    label: "After 08:30 manipulation",
    description: "Continuation distribution after 08:30 manipulated.",
  },
  {
    id: "AFTER_LONDON",
    label: "After London manipulation",
    description: "Continuation distribution after London manipulated.",
  },
] as const

export const EQ_MANIP_Q = [
  {
    id: "TRADE_AM",
    label: "Trade NY AM today?",
    description:
      "Profile Asia and London. If either is expanding, it must not be overly extended.",
  },
  {
    id: "0930_MANIP",
    label: "09:30 likely manipulation",
    description:
      "HTF bias + LTP for the next daily candle. Accumulating → most likely manipulation. You cannot reverse out of accumulation.",
  },
  {
    id: "OLD_HIGH",
    label: "M15 or HTF old high opposing DOL",
    description: "Liquidity to run against the draw on liquidity.",
  },
  {
    id: "PD",
    label: "Premium (shorts) / discount (longs)",
  },
  {
    id: "TARGET",
    label: "Obvious DOL (EQH / EQL)",
  },
  {
    id: "OPENS",
    label: "Above 00:00 and/or 08:30 open",
  },
  {
    id: "SMT",
    label: "SMT divergence",
  },
  {
    id: "MODEL",
    label: "Entry model (displacement, IFVG, FVG, CISD)",
  },
  {
    id: "EXECUTE",
    label: "Execute with no fear",
  },
] as const

export const EQ_DIST_Q = [
  {
    id: "TRADE_AM",
    label: "Trade NY AM today?",
    description: "Same Asia / London profile. Questionnaire confirms STP.",
  },
  {
    id: "0930_DIST",
    label: "09:30 likely distribution",
    description: "Distribution if we ran stops prior to 09:30.",
  },
  {
    id: "PROFILE",
    label: "Valid profile for distribution",
  },
  {
    id: "PD",
    label: "Premium (shorts) / discount (longs)",
  },
  {
    id: "STOPS_PRIOR",
    label: "Ran stops prior to 09:30",
  },
  {
    id: "TARGET",
    label: "Obvious liquidity target",
  },
  {
    id: "OPENS",
    label: "Above 00:00 and/or 08:30 open",
  },
  {
    id: "SMT",
    label: "SMT divergence",
  },
  {
    id: "MODEL",
    label: "Entry model",
  },
  {
    id: "EXECUTE",
    label: "Execute with 0 fear",
  },
] as const

export function eqOpenTagsFor(input: {
  read0930: string
  manipScene: string
  distScene: string
  manipQ: string[]
  distQ: string[]
}): string[] {
  const tags: string[] = []
  const read = EQ_OPEN_930.find((item) => item.id === input.read0930)
  if (read) tags.push(`EQO ${read.label}`)
  const manip = EQ_MANIP_SCENES.find((item) => item.id === input.manipScene)
  if (manip) tags.push(`EQO Manip ${manip.label}`)
  const dist = EQ_DIST_SCENES.find((item) => item.id === input.distScene)
  if (dist) tags.push(`EQO Dist ${dist.label}`)
  for (const id of input.manipQ) {
    const q = EQ_MANIP_Q.find((item) => item.id === id)
    if (q) tags.push(`EQO M · ${q.label}`)
  }
  for (const id of input.distQ) {
    const q = EQ_DIST_Q.find((item) => item.id === id)
    if (q) tags.push(`EQO D · ${q.label}`)
  }
  if (input.manipQ.includes("EXECUTE") || input.distQ.includes("EXECUTE")) {
    tags.push("EQO 90min window")
  }
  return tags
}

export function htfKlTagsFor(input: {
  type: string
  job: string
  path: string
  context: string[]
  closure: string
}): string[] {
  const tags: string[] = []
  const type = HTF_KL_TYPES.find((item) => item.id === input.type)
  if (type) tags.push(`KL ${type.label}`)
  const job = HTF_KL_JOBS.find((item) => item.id === input.job)
  if (job) tags.push(`KL ${job.short}`)
  const path = HTF_KL_PATHS.find((item) => item.id === input.path)
  if (path) tags.push(`KL ${path.label}`)
  for (const id of input.context) {
    const ctx = HTF_KL_CONTEXT.find((item) => item.id === id)
    if (ctx) tags.push(`KL ${ctx.label}`)
  }
  const closure = HTF_KL_CLOSES.find((item) => item.id === input.closure)
  if (closure) tags.push(`KL ${closure.label}`)
  return tags
}

/** Timeframe-aligned range for an LTP key level. This supercharges the KL. */
export const KL_RANGE_PAIRS = [
  {
    id: "MN_D1",
    kl: "MN",
    range: "D1",
    label: "Monthly KL → Daily range",
    description: "You need a daily range to trade a monthly key level.",
  },
  {
    id: "W1_H4",
    kl: "W1",
    range: "H4",
    label: "Weekly KL → H4 range",
    description:
      "As price approaches the weekly KL on H4: if a range exists, mark it. If not, wait for inducement.",
  },
  {
    id: "D1_H1",
    kl: "D1",
    range: "H1",
    label: "Daily KL → H1 range",
    description: "A daily key level is traded with an H1 range.",
  },
] as const

export type KlRangePairId = (typeof KL_RANGE_PAIRS)[number]["id"]

export function pairForKlTf(tf: string) {
  return KL_RANGE_PAIRS.find((item) => item.kl === tf)?.id ?? ""
}

export const RANGE_BUILDS = [
  {
    id: "EXISTING",
    label: "Range already there",
    description:
      "Mark high and low. Wait for the break of the range into the KL, then attack the other side.",
  },
  {
    id: "INDUCEMENT",
    label: "Inducement / false high",
    description:
      "No range yet. Wait for a false high before the KL. Mark high and low. When price attacks the range high into the KL, attack the range low.",
  },
] as const

export const RANGE_TF_TOOLS = [
  {
    id: "STOPS_ABOVE",
    label: "Stops above range high",
    description:
      "Stops are accumulating above the range high as price walks into the KL.",
  },
  {
    id: "MS_PD",
    label: "MS + PD arrays on range TF",
    description:
      "Frame the trade with market structure and PD arrays on the range timeframe.",
  },
  {
    id: "CISD",
    label: "CISD on range TF",
    description: "Wait for a change in state of delivery on the range timeframe.",
  },
] as const

export const CONSOL_PATHS = [
  {
    id: "BREAKOUT_RETEST",
    label: "Breakout, retest, continuation",
    description:
      "One of two ways a consolidation resolves. There is no consolidation to consolidation.",
  },
  {
    id: "AMD",
    label: "AMD",
    description:
      "Accumulation, manipulation, distribution. The other way a consolidation resolves.",
  },
] as const

export function klRangeTagsFor(input: {
  pair: string
  build: string
  tools: string[]
  consolPath: string
  oneCandleConsol: boolean
}): string[] {
  const tags: string[] = []
  const pair = KL_RANGE_PAIRS.find((item) => item.id === input.pair)
  if (pair) tags.push(`Range pair ${pair.label}`)
  const build = RANGE_BUILDS.find((item) => item.id === input.build)
  if (build) tags.push(`Range ${build.label}`)
  for (const id of input.tools) {
    const tool = RANGE_TF_TOOLS.find((item) => item.id === id)
    if (tool) tags.push(`Range ${tool.label}`)
  }
  const path = CONSOL_PATHS.find((item) => item.id === input.consolPath)
  if (path) tags.push(`Range ${path.label}`)
  if (input.oneCandleConsol) tags.push("Range 1-candle consolidation")
  return tags
}

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
    label: "CISD on range TF",
    description:
      "Wait for a change in state of delivery on the range timeframe.",
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

export function deferredTagsFor(
  input: {
    deferred: boolean
    deferredSteps: string[]
    deferCandle: string
    opposingStops: string
  },
  perspective: "LTP" | "ITP" | "STP" = "LTP"
): string[] {
  if (!input.deferred) return []
  const p = `Defer ${perspective} `
  const tags = [`${p}Deferred delivery`]
  for (const id of input.deferredSteps) {
    const step = DEFERRED_STEPS.find((item) => item.id === id)
    if (step) tags.push(`${p}${step.label}`)
  }
  const candle = DEFER_CANDLES.find((item) => item.id === input.deferCandle)
  if (candle) tags.push(`${p}${candle.label}`)
  const stops = OPPOSING_STOPS.find((item) => item.id === input.opposingStops)
  if (stops) tags.push(`${p}${stops.label}`)
  return tags
}

/** Liquidity at highs that broke lows / lows that broke highs. DOL or turtle soup. */
export const STRUCTURE_POOLS = [
  {
    id: "LTBH",
    label: "Low that broke high",
    short: "LTBH",
    description:
      "When bullish, retail parks stops here expecting a market structure shift. After an HTF key level, this is often the draw.",
  },
  {
    id: "HTBL",
    label: "High that broke low",
    short: "HTBL",
    description:
      "When a level breaks, look here next. If bearish, expect a key level above it and a turtle soup.",
  },
] as const

export type StructurePoolId = (typeof STRUCTURE_POOLS)[number]["id"]

export const STRUCTURE_JOBS = [
  {
    id: "DOL",
    label: "Draw on liquidity",
    short: "DOL",
    description: "This pool is the target. Seek it.",
  },
  {
    id: "TURTLE_SOUP",
    label: "Turtle soup / double purge",
    short: "Soup",
    description:
      "This pool is the reversal. Price needs liquidity to turn. Blend it with the HTF candle.",
  },
] as const

export type StructureJobId = (typeof STRUCTURE_JOBS)[number]["id"]

export const STRUCTURE_CONTEXT = [
  {
    id: "AFTER_HTF_KL",
    label: "After HTF KL",
    description:
      "Price already hit the higher-timeframe key level. Then look for the LTBH or HTBL.",
  },
  {
    id: "RETAIL_MSS",
    label: "Retail MSS stops",
    description:
      "Traders think a break of this low (or high) is the market structure shift. That is the engineered liquidity.",
  },
  {
    id: "KL_BEYOND",
    label: "KL beyond the pool",
    description:
      "Anticipate a key level above the high that broke the low, or below the low that broke the high.",
  },
] as const

export type StructureContextId = (typeof STRUCTURE_CONTEXT)[number]["id"]

export function structureTagsFor(
  input: {
    structurePool: string
    structureJob: string
    structureContext: string[]
  },
  perspective: "LTP" | "ITP" | "STP" = "LTP"
): string[] {
  const tags: string[] = []
  const p = `Pool ${perspective} `
  const pool = STRUCTURE_POOLS.find((item) => item.id === input.structurePool)
  if (pool) tags.push(`${p}${pool.label}`)
  const job = STRUCTURE_JOBS.find((item) => item.id === input.structureJob)
  if (job) tags.push(`${p}${job.label}`)
  for (const id of input.structureContext) {
    const ctx = STRUCTURE_CONTEXT.find((item) => item.id === id)
    if (ctx) tags.push(`${p}${ctx.label}`)
  }
  return tags
}

/** Index futures engineer these daily. They make the DOL obvious. */
export const RELATIVE_LEVELS = [
  {
    id: "EQH",
    label: "Relative equal highs",
    short: "EQH",
    description:
      "Engineered buy-side. If price has hit a key level, it often attacks these next.",
  },
  {
    id: "EQL",
    label: "Relative equal lows",
    short: "EQL",
    description:
      "Engineered sell-side. If bullish, wait for these to get taken, then engage.",
  },
] as const

export type RelativeLevelId = (typeof RELATIVE_LEVELS)[number]["id"]

export const RELATIVE_SEQUENCE = [
  {
    id: "EQL_TAKEN",
    label: "EQLs taken, then engage",
    description:
      "Bullish: wait for relative equal lows to be taken, then take the key level / turtle soup.",
  },
  {
    id: "EQH_TAKEN",
    label: "EQHs taken, then engage",
    description:
      "Bearish: wait for relative equal highs to be taken, then take the key level / turtle soup.",
  },
  {
    id: "ATTACK_EQH",
    label: "Attack EQHs",
    description:
      "After the key level, relative equal highs are the draw.",
  },
  {
    id: "ATTACK_EQL",
    label: "Attack EQLs",
    description:
      "After the key level, relative equal lows are the draw.",
  },
  {
    id: "A_PLUS",
    label: "A+ with EQH/EQL as DOL",
    description:
      "An A+ is not A+ without relative equal highs or lows as the target.",
  },
] as const

export type RelativeSequenceId = (typeof RELATIVE_SEQUENCE)[number]["id"]

export function relativeTagsFor(
  input: {
    relativeLevels: string[]
    relativeSequence: string[]
  },
  perspective: "LTP" | "ITP" | "STP" = "LTP"
): string[] {
  const tags: string[] = []
  const p = `EQ ${perspective} `
  for (const id of input.relativeLevels) {
    const level = RELATIVE_LEVELS.find((item) => item.id === id)
    if (level) tags.push(`${p}${level.label}`)
  }
  for (const id of input.relativeSequence) {
    const step = RELATIVE_SEQUENCE.find((item) => item.id === id)
    if (step) tags.push(`${p}${step.label}`)
  }
  return tags
}

export const OPENING_GAPS = [
  {
    id: "NWOG",
    label: "New week opening gap",
    short: "NWOG",
    closeLabel: "Friday close",
    openLabel: "Sunday open",
    description:
      "Closing price Friday to opening price Sunday. Two jobs: draw, or key level.",
  },
  {
    id: "NDOG",
    label: "New day opening gap",
    short: "NDOG",
    closeLabel: "Previous close",
    openLabel: "New day open",
    description:
      "Previous day's close to the new day's open. Two jobs: draw, or key level.",
  },
] as const

export type OpeningGapId = (typeof OPENING_GAPS)[number]["id"]

export const GAP_JOBS = [
  {
    id: "DOL",
    label: "Gap as DOL",
    description: "The opening gap is the draw on liquidity.",
  },
  {
    id: "KL",
    label: "Gap as key level",
    description: "The opening gap is a potential key level to engage from.",
  },
] as const

export type GapJobId = (typeof GAP_JOBS)[number]["id"]

export const GAP_FRAMEWORK = [
  {
    id: "WITH_CANDLE",
    label: "With the next HTF candle",
    description: "Only use the gap in the direction of the next candle.",
  },
  {
    id: "WITH_EQUALS",
    label: "With EQH / EQL",
    description: "The gap lines up with relative equal highs or lows.",
  },
  {
    id: "WITH_STRUCTURE",
    label: "With HTBL / LTBH",
    description: "The gap lines up with a high that broke a low, or a low that broke a high.",
  },
  {
    id: "IN_DEALING",
    label: "Inside dealing range",
    description: "The gap sits inside the dealing range.",
  },
  {
    id: "AFTER_KL",
    label: "After HTF KL",
    description: "Price already tagged a higher-timeframe key level, then the gap.",
  },
] as const

export type GapFrameworkId = (typeof GAP_FRAMEWORK)[number]["id"]

export function openingGapTagsFor(
  input: {
    openingGap: string
    gapJob: string
    gapFramework: string[]
    gapClose: string
    gapOpen: string
  },
  perspective: "LTP" | "ITP" | "STP" = "LTP"
): string[] {
  const tags: string[] = []
  const p = `Gap ${perspective} `
  const gap = OPENING_GAPS.find((item) => item.id === input.openingGap)
  if (gap) tags.push(`${p}${gap.label}`)
  const job = GAP_JOBS.find((item) => item.id === input.gapJob)
  if (job) tags.push(`${p}${job.label}`)
  for (const id of input.gapFramework) {
    const piece = GAP_FRAMEWORK.find((item) => item.id === id)
    if (piece) tags.push(`${p}${piece.label}`)
  }
  if (gap && input.gapClose && input.gapOpen) {
    tags.push(`${p}${gap.short} ${input.gapClose}–${input.gapOpen}`)
  }
  return tags
}

/** Fixed checklist. Foundation of every trade idea. Fractal on every timeframe. */
export const INSTITUTIONAL_CHECKS = [
  {
    id: "OPENING_PRICE",
    n: "1",
    label: "Opening price",
    description: "Sell above the opening price. Buy below it.",
  },
  {
    id: "HTF_KL",
    n: "2",
    label: "HTF KL as reference",
    description:
      "The higher-timeframe key level is the reference. Sell it only in premium. Buy it only in discount.",
  },
  {
    id: "INDUCEMENT",
    n: "3",
    label: "Inducement for every KL",
    description: "Every key level needs inducement before you engage it.",
  },
  {
    id: "SMT",
    n: "4",
    label: "SMT (YM / NQ)",
    description: "Primary SMT is YM / NQ. NVDA / NQ is a Nasdaq-weight tell.",
  },
  {
    id: "DISPLACEMENT",
    n: "5",
    label: "Displacement (FVG)",
    description:
      "Displacement away from the key level that leaves an FVG to retest.",
  },
  {
    id: "CISD",
    n: "6",
    label: "CISD",
    description: "Change in state of delivery.",
  },
  {
    id: "OB_IFVG",
    n: "7",
    label: "Order block or IFVG",
    description: "Order block or inversion FVG confirmation.",
  },
] as const

export type InstitutionalCheckId = (typeof INSTITUTIONAL_CHECKS)[number]["id"]

export function institutionalTagsFor(
  checks: string[],
  perspective: "LTP" | "ITP" | "STP" = "LTP"
): string[] {
  const tags: string[] = []
  for (const id of checks) {
    const item = INSTITUTIONAL_CHECKS.find((check) => check.id === id)
    if (item) tags.push(`Inst ${perspective} ${item.label}`)
  }
  if (checks.length >= INSTITUTIONAL_CHECKS.length) {
    tags.push(`Inst ${perspective} sponsored`)
    tags.push(`Inst ${perspective} hold to opposing`)
  }
  return tags
}

/** Advanced market maker models. This episode is LTBH / HTBL. */
export const MMXM_TYPES = [
  {
    id: "RANGE",
    label: "Range high ↔ low",
    short: "Range",
    description: "Range high to low, or range low to high.",
  },
  {
    id: "IRL_ERL",
    label: "ERL ↔ IRL",
    short: "ERL/IRL",
    description: "External range liquidity to internal, or internal to external.",
  },
  {
    id: "LTBH_HTBL",
    label: "LTBH / HTBL",
    short: "LTBH",
    description:
      "Lows that broke highs, or highs that broke lows. This episode's MMXM.",
  },
] as const

export type MmxmTypeId = (typeof MMXM_TYPES)[number]["id"]

export const IOF_SIDES = [
  {
    id: "UP",
    label: "IOF up",
    description: "Institutional order flow is higher.",
  },
  {
    id: "DOWN",
    label: "IOF down",
    description: "Institutional order flow is lower.",
  },
] as const

export type IofSideId = (typeof IOF_SIDES)[number]["id"]

export const IOF_ALIGNMENTS = [
  {
    id: "WITH",
    label: "With IOF",
    description:
      "Highest-probability fractal. Gold mine. Stay here until the with-flow model is automatic.",
  },
  {
    id: "COUNTER",
    label: "Counter IOF",
    description:
      "Against institutional order flow. Advanced only. Do not skip the with-flow model to get here.",
  },
] as const

export type IofAlignmentId = (typeof IOF_ALIGNMENTS)[number]["id"]

export const MMXM_SEQUENCE = [
  {
    id: "PREMIUM_KL_SMR",
    label: "Premium KL / SMR",
    description: "Smart money reversal at the premium key level.",
  },
  {
    id: "STH_BROKEN",
    label: "Short-term high broken",
    description: "A short-term high broke. That is the first counter-trend leg.",
  },
  {
    id: "LTBH",
    label: "Low that broke high",
    description: "The pool this MMXM is built on.",
  },
  {
    id: "HTBL",
    label: "High that broke low",
    description: "The pool this MMXM is built on when IOF is down.",
  },
  {
    id: "TURTLE_SOUP",
    label: "Turtle soup",
    description: "The entry after the purge of that pool.",
  },
  {
    id: "WITH_IOF_EXPANSION",
    label: "Expansion with IOF",
    description: "After the soup, delivery resumes with institutional order flow.",
  },
] as const

export type MmxmSequenceId = (typeof MMXM_SEQUENCE)[number]["id"]

export function mmxmTagsFor(
  input: {
    mmxmType: string
    iofSide: string
    iofAlignment: string
    mmxmSequence: string[]
  },
  perspective: "LTP" | "ITP" | "STP" = "LTP"
): string[] {
  const tags: string[] = []
  const p = `MMXM ${perspective} `
  const type = MMXM_TYPES.find((item) => item.id === input.mmxmType)
  if (type) tags.push(`${p}${type.short}`)
  const iof = IOF_SIDES.find((item) => item.id === input.iofSide)
  if (iof) tags.push(`${p}${iof.label}`)
  const align = IOF_ALIGNMENTS.find((item) => item.id === input.iofAlignment)
  if (align) tags.push(`${p}${align.label}`)
  for (const id of input.mmxmSequence) {
    const step = MMXM_SEQUENCE.find((item) => item.id === id)
    if (step) tags.push(`${p}${step.label}`)
  }
  return tags
}

const RANGE_TAG_LABELS = new Set<string>([
  ...RANGE_TYPES.map((item) => item.label),
  ...RANGE_SEQUENCE.map((item) => item.label),
  ...FIFTY_ROLES.map((item) => item.label),
  ...DEALING_FORMATIONS.map((item) => item.label),
  "Broke high, then low",
  "Broke low, then high",
  ...DEALING_JOBS.map((item) => item.label),
  ...DEALING_DELIVERY.map((item) => item.label),
  "LTF profiled into KL in P/D",
  ...RANGE_CONFIRMS.map((item) => item.label),
  "Paired with HTF KL",
  "Dealing range",
  "Premium",
  "Discount",
  ...(["LTP", "ITP", "STP"] as const).flatMap((p) => [
    `Dealing ${p} range`,
    ...DEALING_FORMATIONS.map((item) => `Dealing ${p} ${item.label}`),
    ...DEALING_JOBS.map((item) => `Dealing ${p} ${item.label}`),
    ...DEALING_DELIVERY.map((item) => `Dealing ${p} ${item.label}`),
    `Dealing ${p} LTF into KL in P/D`,
    `Dealing ${p} Premium`,
    `Dealing ${p} Discount`,
  ]),
  "Deferred delivery",
  ...DEFERRED_STEPS.map((item) => item.label),
  ...DEFER_CANDLES.map((item) => item.label),
  ...OPPOSING_STOPS.map((item) => item.label),
  ...STRUCTURE_POOLS.map((item) => item.label),
  ...STRUCTURE_JOBS.map((item) => item.label),
  ...STRUCTURE_CONTEXT.map((item) => item.label),
  ...RELATIVE_LEVELS.map((item) => item.label),
  ...RELATIVE_SEQUENCE.map((item) => item.label),
  ...OPENING_GAPS.map((item) => item.label),
  ...GAP_JOBS.map((item) => item.label),
  ...GAP_FRAMEWORK.map((item) => item.label),
  ...INSTITUTIONAL_CHECKS.map((item) => item.label),
  "Institutionally sponsored",
  "Hold to opposing liquidity",
  ...MMXM_TYPES.map((item) => `MMXM ${item.short}`),
  ...(["LTP", "ITP", "STP"] as const).flatMap((p) => [
    ...MMXM_TYPES.map((item) => `MMXM ${p} ${item.short}`),
    ...IOF_SIDES.map((item) => `MMXM ${p} ${item.label}`),
    ...IOF_ALIGNMENTS.map((item) => `MMXM ${p} ${item.label}`),
    ...MMXM_SEQUENCE.map((item) => `MMXM ${p} ${item.label}`),
  ]),
  ...IOF_SIDES.map((item) => item.label),
  ...IOF_ALIGNMENTS.map((item) => item.label),
  ...MMXM_SEQUENCE.map((item) => item.label),
  "Perspective aligned",
  "Perspective LTP",
  "Perspective ITP",
  "Perspective STP",
  ...CANDLE_PATHS.map((item) => `Candle ${item.label}`),
  ...CANDLE_FORMATIONS.map((item) => `Candle ${item.label}`),
  ...CANDLE_ENTRIES.map((item) => `Candle entry ${item.short}`),
  ...CANDLE_ENDS.map((item) => `Candle ${item.short}`),
  ...LTP_IOF_SIDES.map((item) => `HTF IOF ${item.short}`),
  ...LTP_IOF_BEARISH.map((item) => `HTF IOF ${item.label}`),
  ...LTP_IOF_BULLISH.map((item) => `HTF IOF ${item.label}`),
  ...LTP_IOF_CONFIRM.map((item) => `HTF IOF ${item.label}`),
  "HTF IOF until opposing KL",
  ...HTF_KL_TYPES.map((item) => `KL ${item.label}`),
  ...HTF_KL_JOBS.map((item) => `KL ${item.short}`),
  ...HTF_KL_PATHS.map((item) => `KL ${item.label}`),
  ...HTF_KL_CONTEXT.map((item) => `KL ${item.label}`),
  ...HTF_KL_CLOSES.map((item) => `KL ${item.label}`),
  ...KL_RANGE_PAIRS.map((item) => `Range pair ${item.label}`),
  ...RANGE_BUILDS.map((item) => `Range ${item.label}`),
  ...RANGE_TF_TOOLS.map((item) => `Range ${item.label}`),
  ...CONSOL_PATHS.map((item) => `Range ${item.label}`),
  "Range 1-candle consolidation",
  "Inducement retrace",
  "Broke back into range",
  "CISD on LTF",
  ...BULLISH_CLOSURES.map((item) => `Close ${item.label}`),
  ...BEARISH_CLOSURES.map((item) => `Close ${item.label}`),
  ...CLOSURE_CONTEXT.map((item) => `Close ${item.label}`),
  ...SEASONAL_MONTHS.map((item) => `Season ${item.short} · ${item.course}`),
  ...QUARTERLY_SHIFTS.map((item) => `Season ${item.label}`),
  ...QUARTER_DRAWS.map((item) => `Season ${item.label}`),
  ...SMT_PAIRS.map((item) => `Season SMT ${item.label}`),
  ...SMT_READS.map((item) => `Season ${item.label}`),
  "Season HTF permabull",
  ...WEEK_COLORS.map((item) => `Week ${item.label}`),
  ...WEEK_DAYS.map((item) => `Week ${item.label}`),
  ...WEEK_EXTREMES.map((item) => `Week ${item.label}`),
  ...WEEK_PROFILE_STEPS.map((item) => `Week ${item.label}`),
  ...WEEK_RANGE_RUNS.map((item) => `Week ${item.label}`),
  ...WEEK_NOTES.map((item) => `Week ${item.label}`),
  ...ITP_HORIZONS.map((item) => `H4H1 ${item.label}`),
  ...ITP_TOC.map((item) => `H4H1 ${item.label}`),
  `H4H1 ${ITP_SCENARIOS[0].label}`,
  "H4H1 Run buy stops",
  "H4H1 Run sell stops",
  "H4H1 Run stops to LTP DOL",
  "H4H1 Trading a range",
  ...STP_KL_PAIRS.map((item) => `STPKL ${item.label}`),
  ...STP_KL_NOTES.map((item) => `STPKL ${item.label}`),
  ...PURGE_STACKS.map((item) => `Purge ${item.label}`),
  ...PURGE_SIDES.map((item) => `Purge ${item.label}`),
  ...PURGE_QUALIFIERS.map((item) => `Purge ${item.label}`),
  ...STP_WINDOWS.map((item) => `STP ${item.label}`),
  ...EQUITY_OPEN_ROLES.map((item) => `STP ${item.label}`),
  ...PREV_SESSIONS.map((item) => `STP ${item.label}`),
  ...AM_PLANS.map((item) => `STP ${item.label}`),
  "STP Wait for EQLs",
  ...MIDNIGHT_RUNS.map((item) => `STP ${item.label}`),
  "STP Above both opens",
  "STP Below both opens",
  ...NEWS_EVENTS.map((item) => `News ${item.label}`),
  ...NEWS_ROLES.map((item) => `News 08:30 ${item.label}`),
  ...NEWS_ROLES.map((item) => `News 09:30 ${item.label}`),
  ...NEWS_ROLES.map((item) => `News 10:00 ${item.label}`),
  ...NEWS_TELLS.map((item) => `News ${item.label}`),
  ...EQ_OPEN_930.map((item) => `EQO ${item.label}`),
  ...EQ_MANIP_SCENES.map((item) => `EQO Manip ${item.label}`),
  ...EQ_DIST_SCENES.map((item) => `EQO Dist ${item.label}`),
  ...EQ_MANIP_Q.map((item) => `EQO M · ${item.label}`),
  ...EQ_DIST_Q.map((item) => `EQO D · ${item.label}`),
  "EQO 90min window",
])

/** Mechanical checklist from the course frame. */
export const CONFLUENCE_TAGS = [
  "Next HTF candle",
  "Low that broke high",
  "High that broke low",
  "Level as DOL",
  "Turtle soup / double purge",
  "Relative equal highs",
  "Relative equal lows",
  "A+ with EQH/EQL as DOL",
  "NWOG",
  "NDOG",
  "Gap as DOL",
  "Gap as key level",
  "SSL to BSL",
  "Sell premium / buy discount",
  "Deferred delivery",
  "Institutionally sponsored",
  "With IOF",
  "Counter IOF",
  "MMXM LTBH",
  "SMT (YM / NQ)",
  "Paired with HTF KL",
  "Profiled into 9:30",
  "Consolidation to expansion",
  "Traded the expansion",
  "Perspective aligned",
  "Same orderflow LTP ITP STP",
  "OHLC",
  "OLHC",
  "Classic buy/sell body",
  "Bullish reversal wick",
  "Bearish reversal wick",
  "Avoid consolidation candle",
  "Traded the open",
  "Traded mid expansion",
  "End of candle HC/LC",
  "HTF IOF",
  "Trend until opposing KL",
  "Lows broken / highs rejected",
  "Highs broken / lows rejected",
  "Buy discount / sell premium",
  "Dealing range as DOL",
  "IOF aligned with P/D",
  "Trade to HTF KL",
  "Trade from HTF KL",
  "PD array on HTF PD array",
  "Previous weekly high/low",
  "Monthly KL / Daily range",
  "Weekly KL / H4 range",
  "Daily KL / H1 range",
  "No consolidation to consolidation",
  "Wick below / close above",
  "Wick above / close below",
  "Closures until the draw",
  "HTF permabull",
  "Feb / Sep bearish",
  "May–Jul / Nov extreme bull",
  "SMT YM / NQ",
  "SMT NVDA / NQ",
  "Weekly profile",
  "Monday low 50%",
  "Friday high (green week)",
  "80% week extreme at HTF KL",
  "H4/H1 with LTP",
  "Rebalance imbalance",
  "Run stops to DOL",
  "H4 KL / M15 range",
  "H1 KL / M5 range",
  "Continuation purge at time",
  "Continuation purge",
  "Swing run not prior candle",
  "Profile Asia / London at 08:30",
  "Sit AM trade PM",
  "Wait for EQLs",
  "Above both opens",
  "Below both opens",
  "0830 open as reference",
  "No news · 09:30 manip",
  "08:30 news",
  "08:30 + 09:45 wait 10:00",
  "10:00 news after 09:30",
  "FOMC after 14:45",
  "NFP only if manipulation",
  "Yellow folder / bond auction PM",
  "90min 09:00–10:30",
  "09:30 manipulation",
  "09:30 distribution",
  "Continuation purge in dealing range",
  "Equity open questionnaire",
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
