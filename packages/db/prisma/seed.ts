import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString =
  process.env.DATABASE_URL || process.env.DIRECT_URL

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL is required to seed")
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

type SeedTrade = {
  pair: string
  direction: "BUY" | "SELL"
  entry: number
  exit: number | null
  stopLoss: number
  takeProfit: number
  lotSize: number
  killzone: string
  session: string
  setupType: string
  liquiditySide: string
  liquidityTaken: boolean
  mssConfirmed: boolean
  htfTimeframe: string
  htfBias: string
  htfNarrative: string
  mtfTimeframe: string
  mtfNarrative: string
  ltfTimeframe: string
  entryModel: string
  tags: string[]
  psychologyNote: string
  daysAgo: number
  hourNy: number
}

function pointValue(pair: string): number {
  if (pair.includes("XAU")) return 100
  if (pair.includes("XAG")) return 5000
  if (pair.includes("OIL")) return 10
  if (pair.includes("JPY")) return 1000
  if (
    pair.includes("NAS") ||
    pair.includes("US30") ||
    pair.includes("GER") ||
    pair.includes("BTC") ||
    pair.includes("ETH")
  ) {
    return 1
  }
  return 100_000
}

function metrics(t: SeedTrade & { exit: number }) {
  const dir = t.direction === "BUY" ? 1 : -1
  const move = (t.exit - t.entry) * dir
  const risk = Math.abs(t.entry - t.stopLoss)
  const reward = Math.abs(t.takeProfit - t.entry)
  const result = move * t.lotSize * pointValue(t.pair)
  const rMultiple = risk > 0 ? move / risk : 0
  const rr = risk > 0 ? reward / risk : null
  let outcome = "BREAKEVEN"
  if (Math.abs(rMultiple) >= 0.05) {
    outcome = rMultiple > 0 ? "WIN" : "LOSS"
  }
  return { result, rMultiple, rr, outcome, riskAmount: risk * t.lotSize * pointValue(t.pair) }
}

function openedAt(daysAgo: number, hourNy: number): Date {
  // Approximate NY local as UTC-4 (EDT) for seed timestamps
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - daysAgo)
  d.setUTCHours(hourNy + 4, 15 + (daysAgo % 3) * 7, 0, 0)
  return d
}

const SEED_TRADES: SeedTrade[] = [
  {
    pair: "EURUSD",
    direction: "BUY",
    entry: 1.0842,
    exit: 1.0918,
    stopLoss: 1.081,
    takeProfit: 1.0945,
    lotSize: 0.5,
    killzone: "NY_AM",
    session: "new-york",
    setupType: "ORDER_BLOCK",
    liquiditySide: "SELL_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "H4",
    htfBias: "BULLISH",
    htfNarrative: "Daily discount array; draw on buy-side above EQ.",
    mtfTimeframe: "M15",
    mtfNarrative: "Bullish BOS after SSL sweep into H4 OB.",
    ltfTimeframe: "M1",
    entryModel: "M1 MSS + OB tap confirmation.",
    tags: ["Liquidity Taken", "OB Tap", "MSS", "Discount"],
    psychologyNote: "Waited for NY open displacement — clean execution.",
    daysAgo: 28,
    hourNy: 8,
  },
  {
    pair: "GBPUSD",
    direction: "SELL",
    entry: 1.2685,
    exit: 1.2612,
    stopLoss: 1.272,
    takeProfit: 1.258,
    lotSize: 0.4,
    killzone: "LONDON_OPEN",
    session: "london",
    setupType: "OTE",
    liquiditySide: "BUY_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "D1",
    htfBias: "BEARISH",
    htfNarrative: "Premium delivery into weekly OB; seeking SSL.",
    mtfTimeframe: "H1",
    mtfNarrative: "Judas swing into OTE after London open.",
    ltfTimeframe: "M5",
    entryModel: "OTE 0.705 + CISD short.",
    tags: ["OTE Hit", "Judas Swing", "Premium", "Displacement"],
    psychologyNote: "Trusted the Judas — no FOMO chase.",
    daysAgo: 26,
    hourNy: 3,
  },
  {
    pair: "XAUUSD",
    direction: "BUY",
    entry: 2342.5,
    exit: 2328.0,
    stopLoss: 2335.0,
    takeProfit: 2368.0,
    lotSize: 0.3,
    killzone: "NY_AM",
    session: "new-york",
    setupType: "BREAKER_BLOCK",
    liquiditySide: "SELL_SIDE",
    liquidityTaken: true,
    mssConfirmed: false,
    htfTimeframe: "H4",
    htfBias: "BULLISH",
    htfNarrative: "Bullish structure; breaker after failed sell-side OB.",
    mtfTimeframe: "M15",
    mtfNarrative: "Entered breaker early before MSS.",
    ltfTimeframe: "M1",
    entryModel: "Premature breaker tap — no LTF confirmation.",
    tags: ["Breaker Flip", "Liquidity Taken"],
    psychologyNote: "Rushed entry before confirmation. Lesson logged.",
    daysAgo: 24,
    hourNy: 9,
  },
  {
    pair: "NAS100",
    direction: "BUY",
    entry: 18240,
    exit: 18395,
    stopLoss: 18180,
    takeProfit: 18480,
    lotSize: 1.0,
    killzone: "NY_AM",
    session: "new-york",
    setupType: "FVG",
    liquiditySide: "SELL_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "H4",
    htfBias: "BULLISH",
    htfNarrative: "Continuation from discount FVG after NFP quiet.",
    mtfTimeframe: "M15",
    mtfNarrative: "FVG fill + displacement higher.",
    ltfTimeframe: "M3",
    entryModel: "M3 FVG entry with stop below sweep.",
    tags: ["FVG Fill", "Displacement", "Discount"],
    psychologyNote: "Patient. Let FVG get tapped.",
    daysAgo: 22,
    hourNy: 9,
  },
  {
    pair: "USDJPY",
    direction: "SELL",
    entry: 151.85,
    exit: 151.12,
    stopLoss: 152.2,
    takeProfit: 150.6,
    lotSize: 0.6,
    killzone: "LONDON_CLOSE",
    session: "overlap",
    setupType: "MITIGATION_BLOCK",
    liquiditySide: "BUY_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "H4",
    htfBias: "BEARISH",
    htfNarrative: "Mitigation of failed bullish OB in premium.",
    mtfTimeframe: "H1",
    mtfNarrative: "Price returned to mitigate then reversed.",
    ltfTimeframe: "M5",
    entryModel: "Mitigation block short + MSS.",
    tags: ["Mitigation", "Premium", "MSS"],
    psychologyNote: "Textbook mitigation — held to TP1 area.",
    daysAgo: 20,
    hourNy: 10,
  },
  {
    pair: "EURUSD",
    direction: "SELL",
    entry: 1.089,
    exit: 1.0925,
    stopLoss: 1.0865,
    takeProfit: 1.08,
    lotSize: 0.5,
    killzone: "NY_LUNCH",
    session: "new-york",
    setupType: "LIQUIDITY_SWEEP",
    liquiditySide: "BUY_SIDE",
    liquidityTaken: true,
    mssConfirmed: false,
    htfTimeframe: "H4",
    htfBias: "RANGE",
    htfNarrative: "Ranging HTF — low conviction short.",
    mtfTimeframe: "M15",
    mtfNarrative: "Swept highs but no real displacement.",
    ltfTimeframe: "M1",
    entryModel: "Faded lunch sweep without confluence.",
    tags: ["Liquidity Taken"],
    psychologyNote: "Traded lunch boredom. Avoid.",
    daysAgo: 18,
    hourNy: 12,
  },
  {
    pair: "XAUUSD",
    direction: "SELL",
    entry: 2358.2,
    exit: 2341.5,
    stopLoss: 2366.0,
    takeProfit: 2325.0,
    lotSize: 0.25,
    killzone: "NY_PM",
    session: "new-york",
    setupType: "ORDER_BLOCK",
    liquiditySide: "BUY_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "H4",
    htfBias: "BEARISH",
    htfNarrative: "Rejection from premium H4 OB.",
    mtfTimeframe: "M15",
    mtfNarrative: "CHoCH down after BSL sweep.",
    ltfTimeframe: "M1",
    entryModel: "OB short after CHoCH.",
    tags: ["OB Tap", "Liquidity Taken", "Premium"],
    psychologyNote: "Strong afternoon model.",
    daysAgo: 16,
    hourNy: 14,
  },
  {
    pair: "GBPJPY",
    direction: "BUY",
    entry: 192.45,
    exit: 193.2,
    stopLoss: 192.05,
    takeProfit: 193.8,
    lotSize: 0.2,
    killzone: "ASIAN",
    session: "asian",
    setupType: "OTE",
    liquiditySide: "SELL_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "H4",
    htfBias: "BULLISH",
    htfNarrative: "Asian range low sweep into OTE long.",
    mtfTimeframe: "M15",
    mtfNarrative: "OTE entry with FVG confluence.",
    ltfTimeframe: "M5",
    entryModel: "OTE + FVG long.",
    tags: ["OTE Hit", "FVG Fill", "Liquidity Taken"],
    psychologyNote: "Quiet Asian session — good R.",
    daysAgo: 14,
    hourNy: 21,
  },
  {
    pair: "US30",
    direction: "BUY",
    entry: 39120,
    exit: 39380,
    stopLoss: 39010,
    takeProfit: 39550,
    lotSize: 1.0,
    killzone: "NY_AM",
    session: "new-york",
    setupType: "BOS",
    liquiditySide: "SELL_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "H1",
    htfBias: "BULLISH",
    htfNarrative: "Continuation BOS after Asia low sweep.",
    mtfTimeframe: "M15",
    mtfNarrative: "Clear BOS and retest.",
    ltfTimeframe: "M5",
    entryModel: "BOS retest long.",
    tags: ["Displacement", "MSS", "Discount"],
    psychologyNote: "Followed plan.",
    daysAgo: 12,
    hourNy: 8,
  },
  {
    pair: "EURUSD",
    direction: "BUY",
    entry: 1.0788,
    exit: 1.0835,
    stopLoss: 1.076,
    takeProfit: 1.086,
    lotSize: 0.7,
    killzone: "LONDON_OPEN",
    session: "london",
    setupType: "ORDER_BLOCK",
    liquiditySide: "SELL_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "H4",
    htfBias: "BULLISH",
    htfNarrative: "London open raid into discount OB.",
    mtfTimeframe: "M15",
    mtfNarrative: "OB + FVG stack.",
    ltfTimeframe: "M1",
    entryModel: "OB entry after MSS.",
    tags: ["OB Tap", "FVG Fill", "Liquidity Taken", "Discount"],
    psychologyNote: "A+ London setup.",
    daysAgo: 10,
    hourNy: 3,
  },
  {
    pair: "AUDUSD",
    direction: "SELL",
    entry: 0.6624,
    exit: 0.6598,
    stopLoss: 0.664,
    takeProfit: 0.6575,
    lotSize: 0.8,
    killzone: "NY_AM",
    session: "new-york",
    setupType: "BREAKER_BLOCK",
    liquiditySide: "BUY_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "H4",
    htfBias: "BEARISH",
    htfNarrative: "Breaker after failed bullish OB.",
    mtfTimeframe: "M15",
    mtfNarrative: "Breaker held as resistance.",
    ltfTimeframe: "M5",
    entryModel: "Breaker short confirmation.",
    tags: ["Breaker Flip", "Liquidity Taken", "Premium"],
    psychologyNote: "Clean breaker trade.",
    daysAgo: 9,
    hourNy: 8,
  },
  {
    pair: "XAUUSD",
    direction: "BUY",
    entry: 2315.4,
    exit: 2310.2,
    stopLoss: 2308.0,
    takeProfit: 2340.0,
    lotSize: 0.4,
    killzone: "LONDON_OPEN",
    session: "london",
    setupType: "OTE",
    liquiditySide: "SELL_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "H4",
    htfBias: "BULLISH",
    htfNarrative: "OTE long into bullish FVG.",
    mtfTimeframe: "M15",
    mtfNarrative: "Stopped by wick beyond OTE low.",
    ltfTimeframe: "M1",
    entryModel: "Tight stop under OTE — hunted.",
    tags: ["OTE Hit", "Liquidity Taken"],
    psychologyNote: "Stop too tight under obvious liquidity.",
    daysAgo: 8,
    hourNy: 4,
  },
  {
    pair: "GBPUSD",
    direction: "BUY",
    entry: 1.254,
    exit: 1.2598,
    stopLoss: 1.251,
    takeProfit: 1.263,
    lotSize: 0.45,
    killzone: "NY_AM",
    session: "new-york",
    setupType: "FVG",
    liquiditySide: "SELL_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "D1",
    htfBias: "BULLISH",
    htfNarrative: "Daily FVG support holding.",
    mtfTimeframe: "H1",
    mtfNarrative: "Displacement through EQ.",
    ltfTimeframe: "M5",
    entryModel: "FVG long after SSL.",
    tags: ["FVG Fill", "Displacement", "Discount"],
    psychologyNote: "Good confluence day.",
    daysAgo: 7,
    hourNy: 9,
  },
  {
    pair: "NAS100",
    direction: "SELL",
    entry: 18510,
    exit: 18420,
    stopLoss: 18570,
    takeProfit: 18340,
    lotSize: 0.8,
    killzone: "NY_PM",
    session: "new-york",
    setupType: "CHOCH",
    liquiditySide: "BUY_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "H1",
    htfBias: "BEARISH",
    htfNarrative: "CHoCH after AM highs swept.",
    mtfTimeframe: "M15",
    mtfNarrative: "Distribution into close.",
    ltfTimeframe: "M5",
    entryModel: "CHoCH short on retest.",
    tags: ["MSS", "Liquidity Taken", "Premium"],
    psychologyNote: "PM model working.",
    daysAgo: 5,
    hourNy: 14,
  },
  {
    pair: "EURUSD",
    direction: "BUY",
    entry: 1.0812,
    exit: 1.0812,
    stopLoss: 1.0785,
    takeProfit: 1.087,
    lotSize: 0.5,
    killzone: "LONDON_CLOSE",
    session: "overlap",
    setupType: "MITIGATION_BLOCK",
    liquiditySide: "NONE",
    liquidityTaken: false,
    mssConfirmed: true,
    htfTimeframe: "H4",
    htfBias: "BULLISH",
    htfNarrative: "Mitigation long; closed scratch into news.",
    mtfTimeframe: "M15",
    mtfNarrative: "Scratched before high-impact release.",
    ltfTimeframe: "M1",
    entryModel: "Mitigation entry — managed to BE.",
    tags: ["Mitigation", "MSS"],
    psychologyNote: "Correct to scratch into news.",
    daysAgo: 4,
    hourNy: 11,
  },
  {
    pair: "XAGUSD",
    direction: "BUY",
    entry: 28.45,
    exit: 29.1,
    stopLoss: 28.1,
    takeProfit: 29.4,
    lotSize: 0.5,
    killzone: "NY_AM",
    session: "new-york",
    setupType: "ORDER_BLOCK",
    liquiditySide: "SELL_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "H4",
    htfBias: "BULLISH",
    htfNarrative: "Silver following gold bullish narrative.",
    mtfTimeframe: "M15",
    mtfNarrative: "OB tap after SSL.",
    ltfTimeframe: "M5",
    entryModel: "OB long.",
    tags: ["OB Tap", "Liquidity Taken", "SMT Divergence"],
    psychologyNote: "SMT with gold confirmed.",
    daysAgo: 3,
    hourNy: 8,
  },
  {
    pair: "USDCHF",
    direction: "SELL",
    entry: 0.8915,
    exit: 0.8882,
    stopLoss: 0.8938,
    takeProfit: 0.885,
    lotSize: 0.6,
    killzone: "LONDON_OPEN",
    session: "london",
    setupType: "OTE",
    liquiditySide: "BUY_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "H4",
    htfBias: "BEARISH",
    htfNarrative: "Premium OTE short aligned with USD weakness.",
    mtfTimeframe: "M15",
    mtfNarrative: "OTE + breaker confluence.",
    ltfTimeframe: "M1",
    entryModel: "OTE short.",
    tags: ["OTE Hit", "Breaker Flip", "Premium"],
    psychologyNote: "High confluence.",
    daysAgo: 2,
    hourNy: 3,
  },
  {
    pair: "GER40",
    direction: "BUY",
    entry: 18250,
    exit: 18190,
    stopLoss: 18180,
    takeProfit: 18420,
    lotSize: 1.0,
    killzone: "LONDON_OPEN",
    session: "london",
    setupType: "LIQUIDITY_SWEEP",
    liquiditySide: "SELL_SIDE",
    liquidityTaken: true,
    mssConfirmed: false,
    htfTimeframe: "H1",
    htfBias: "BULLISH",
    htfNarrative: "Swept Asia low — entered too early.",
    mtfTimeframe: "M15",
    mtfNarrative: "No MSS yet; stopped out.",
    ltfTimeframe: "M5",
    entryModel: "Sweep fade without confirmation.",
    tags: ["Liquidity Taken"],
    psychologyNote: "Need MSS after sweep. Fixed rule.",
    daysAgo: 1,
    hourNy: 3,
  },
  {
    pair: "XAUUSD",
    direction: "BUY",
    entry: 2368.8,
    exit: 2385.5,
    stopLoss: 2360.0,
    takeProfit: 2398.0,
    lotSize: 0.35,
    killzone: "NY_AM",
    session: "new-york",
    setupType: "ORDER_BLOCK",
    liquiditySide: "SELL_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "H4",
    htfBias: "BULLISH",
    htfNarrative: "Fresh H4 OB in discount after expansion.",
    mtfTimeframe: "M15",
    mtfNarrative: "Perfect OB + OTE overlap.",
    ltfTimeframe: "M1",
    entryModel: "OB/OTE long with MSS.",
    tags: ["OB Tap", "OTE Hit", "Liquidity Taken", "MSS", "Discount"],
    psychologyNote: "Best trade of the week — full model.",
    daysAgo: 0,
    hourNy: 8,
  },
  {
    pair: "EURUSD",
    direction: "SELL",
    entry: 1.0865,
    exit: null,
    stopLoss: 1.0895,
    takeProfit: 1.078,
    lotSize: 0.4,
    killzone: "NY_AM",
    session: "new-york",
    setupType: "BREAKER_BLOCK",
    liquiditySide: "BUY_SIDE",
    liquidityTaken: true,
    mssConfirmed: true,
    htfTimeframe: "H4",
    htfBias: "BEARISH",
    htfNarrative: "Open breaker short — still running.",
    mtfTimeframe: "M15",
    mtfNarrative: "Breaker holding.",
    ltfTimeframe: "M5",
    entryModel: "Live breaker short.",
    tags: ["Breaker Flip", "Liquidity Taken"],
    psychologyNote: "Managing open risk.",
    daysAgo: 0,
    hourNy: 9,
  },
]

async function seedForUser(userId: string, email: string) {
  await prisma.trade.deleteMany({ where: { userId } })
  await prisma.journal.deleteMany({ where: { userId } })

  const journal = await prisma.journal.create({
    data: {
      userId,
      name: "Main Journal",
      description: "Default trading journal",
      isDefault: true,
    },
  })

  for (const t of SEED_TRADES) {
    const isOpen = t.exit == null || Number.isNaN(Number(t.exit))
    const exit = isOpen ? null : Number(t.exit)
    const m = isOpen
      ? {
          result: null,
          rMultiple: null,
          rr:
            Math.abs(t.entry - t.stopLoss) > 0
              ? Math.abs(t.takeProfit - t.entry) / Math.abs(t.entry - t.stopLoss)
              : null,
          outcome: "PENDING",
          riskAmount:
            Math.abs(t.entry - t.stopLoss) * t.lotSize * pointValue(t.pair),
        }
      : metrics({ ...t, exit: exit! })

    const dateOpened = openedAt(t.daysAgo, t.hourNy)
    const range = Math.abs(
      (t.pair.includes("XAU") ? 40 : t.pair.includes("NAS") || t.pair.includes("US30") || t.pair.includes("GER") ? 200 : 0.012)
    )
    const swingHigh = t.direction === "BUY" ? t.entry + range : t.entry + range * 0.3
    const swingLow = t.direction === "BUY" ? t.entry - range * 0.3 : t.entry - range
    const oteHigh =
      t.direction === "BUY"
        ? swingHigh - (swingHigh - swingLow) * 0.62
        : swingLow + (swingHigh - swingLow) * 0.79
    const oteLow =
      t.direction === "BUY"
        ? swingHigh - (swingHigh - swingLow) * 0.79
        : swingLow + (swingHigh - swingLow) * 0.62

    await prisma.trade.create({
      data: {
        userId,
        journalId: journal.id,
        pair: t.pair,
        direction: t.direction,
        entry: t.entry,
        exit,
        stopLoss: t.stopLoss,
        takeProfit: t.takeProfit,
        lotSize: t.lotSize,
        rr: m.rr,
        rMultiple: m.rMultiple,
        result: m.result,
        outcome: m.outcome,
        session: t.session,
        killzone: t.killzone,
        tags: t.tags,
        psychologyNote: t.psychologyNote,
        accountBalance: 10_000,
        riskAmount: m.riskAmount,
        riskPercent: 1,
        setupType: t.setupType,
        poiHigh: t.direction === "BUY" ? t.entry + range * 0.05 : t.entry + range * 0.15,
        poiLow: t.direction === "BUY" ? t.entry - range * 0.15 : t.entry - range * 0.05,
        swingHigh,
        swingLow,
        oteHigh,
        oteLow,
        liquiditySide: t.liquiditySide,
        liquidityTaken: t.liquidityTaken,
        mssConfirmed: t.mssConfirmed,
        htfTimeframe: t.htfTimeframe,
        htfBias: t.htfBias,
        htfNarrative: t.htfNarrative,
        mtfTimeframe: t.mtfTimeframe,
        mtfNarrative: t.mtfNarrative,
        ltfTimeframe: t.ltfTimeframe,
        entryModel: t.entryModel,
        dateOpened,
        dateClosed: exit != null ? new Date(dateOpened.getTime() + 2 * 60 * 60 * 1000) : null,
      },
    })
  }

  console.log(`Seeded ${SEED_TRADES.length} trades for ${email}`)
}

async function main() {
  const preferredEmail = process.env.SEED_EMAIL?.trim()

  let users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } })

  if (preferredEmail) {
    const user = await prisma.user.upsert({
      where: { email: preferredEmail },
      update: {},
      create: {
        email: preferredEmail,
        name: preferredEmail.split("@")[0] ?? "Trader",
      },
    })
    users = [user]
  } else if (users.length === 0) {
    const user = await prisma.user.create({
      data: {
        email: "demo@claritrade.local",
        name: "Demo Trader",
      },
    })
    users = [user]
    console.log(
      "No users found — created demo@claritrade.local. Sign up with that email or set SEED_EMAIL to your account."
    )
  }

  for (const user of users) {
    await seedForUser(user.id, user.email)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
