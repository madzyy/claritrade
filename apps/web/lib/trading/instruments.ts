/**
 * Instrument contract specs for standard-lot P&L / position sizing.
 * Values assume USD-account CFDs / FX with common retail contract sizes.
 */

export type InstrumentCategory =
  | "forex"
  | "metal"
  | "energy"
  | "index"
  | "crypto"

export interface InstrumentSpec {
  symbol: string
  label: string
  category: InstrumentCategory
  /** USD P&L per 1.0 price move per 1.0 standard lot (approximate). */
  pointValue: number
  /** Pip/point size used for display (price distance of 1 pip). */
  pipSize: number
  decimals: number
}

const INSTRUMENTS: Record<string, InstrumentSpec> = {
  EURUSD: {
    symbol: "EURUSD",
    label: "EUR/USD",
    category: "forex",
    pointValue: 100_000,
    pipSize: 0.0001,
    decimals: 5,
  },
  GBPUSD: {
    symbol: "GBPUSD",
    label: "GBP/USD",
    category: "forex",
    pointValue: 100_000,
    pipSize: 0.0001,
    decimals: 5,
  },
  AUDUSD: {
    symbol: "AUDUSD",
    label: "AUD/USD",
    category: "forex",
    pointValue: 100_000,
    pipSize: 0.0001,
    decimals: 5,
  },
  NZDUSD: {
    symbol: "NZDUSD",
    label: "NZD/USD",
    category: "forex",
    pointValue: 100_000,
    pipSize: 0.0001,
    decimals: 5,
  },
  USDCHF: {
    symbol: "USDCHF",
    label: "USD/CHF",
    category: "forex",
    // Approx USD P&L per 1.0 move; quote≠USD so treat as USD-quoted CFD approx
    pointValue: 100_000,
    pipSize: 0.0001,
    decimals: 5,
  },
  USDJPY: {
    symbol: "USDJPY",
    label: "USD/JPY",
    category: "forex",
    // (price move) * 1000 ≈ USD per lot near 150 JPY (100000/100)
    pointValue: 1000,
    pipSize: 0.01,
    decimals: 3,
  },
  EURJPY: {
    symbol: "EURJPY",
    label: "EUR/JPY",
    category: "forex",
    pointValue: 1000,
    pipSize: 0.01,
    decimals: 3,
  },
  GBPJPY: {
    symbol: "GBPJPY",
    label: "GBP/JPY",
    category: "forex",
    pointValue: 1000,
    pipSize: 0.01,
    decimals: 3,
  },
  XAUUSD: {
    symbol: "XAUUSD",
    label: "XAUUSD (Gold)",
    category: "metal",
    pointValue: 100,
    pipSize: 0.1,
    decimals: 2,
  },
  XAGUSD: {
    symbol: "XAGUSD",
    label: "XAGUSD (Silver)",
    category: "metal",
    // 5000 oz contract: $1 move = $5000 / lot
    pointValue: 5000,
    pipSize: 0.01,
    decimals: 3,
  },
  USOIL: {
    symbol: "USOIL",
    label: "WTI Oil",
    category: "energy",
    // Common CFD: $10 per $1 move per lot
    pointValue: 10,
    pipSize: 0.01,
    decimals: 2,
  },
  NQ: {
    symbol: "NQ",
    label: "NQ (E-mini Nasdaq)",
    category: "index",
    /** $20 per index point per contract. */
    pointValue: 20,
    pipSize: 0.25,
    decimals: 2,
  },
  MNQ: {
    symbol: "MNQ",
    label: "MNQ (Micro Nasdaq)",
    category: "index",
    /** $2 per index point per contract. */
    pointValue: 2,
    pipSize: 0.25,
    decimals: 2,
  },
  NAS100: {
    symbol: "NAS100",
    label: "NAS100 (Nasdaq)",
    category: "index",
    pointValue: 1,
    pipSize: 1,
    decimals: 1,
  },
  US30: {
    symbol: "US30",
    label: "US30 (Dow)",
    category: "index",
    pointValue: 1,
    pipSize: 1,
    decimals: 1,
  },
  GER40: {
    symbol: "GER40",
    label: "GER40 (DAX)",
    category: "index",
    pointValue: 1,
    pipSize: 1,
    decimals: 1,
  },
  SPX500: {
    symbol: "SPX500",
    label: "SPX500",
    category: "index",
    pointValue: 1,
    pipSize: 1,
    decimals: 1,
  },
  BTCUSD: {
    symbol: "BTCUSD",
    label: "BTCUSD",
    category: "crypto",
    pointValue: 1,
    pipSize: 1,
    decimals: 2,
  },
  ETHUSD: {
    symbol: "ETHUSD",
    label: "ETHUSD",
    category: "crypto",
    pointValue: 1,
    pipSize: 1,
    decimals: 2,
  },
}

export const INSTRUMENT_OPTIONS = Object.values(INSTRUMENTS)

export function normalizePair(pair: string): string {
  return pair.toUpperCase().replace(/[^A-Z0-9]/g, "")
}

export function getInstrumentSpec(pair: string): InstrumentSpec {
  const key = normalizePair(pair)
  if (INSTRUMENTS[key]) return INSTRUMENTS[key]!

  // Heuristic fallbacks for unlisted symbols
  if (key.includes("XAU") || key.includes("GOLD")) {
    return { ...INSTRUMENTS.XAUUSD!, symbol: key, label: key }
  }
  if (key.includes("XAG") || key.includes("SILVER")) {
    return { ...INSTRUMENTS.XAGUSD!, symbol: key, label: key }
  }
  if (key.includes("OIL") || key.includes("WTI") || key.includes("BRENT")) {
    return { ...INSTRUMENTS.USOIL!, symbol: key, label: key }
  }
  if (key.includes("JPY")) {
    return {
      symbol: key,
      label: key,
      category: "forex",
      pointValue: 1000,
      pipSize: 0.01,
      decimals: 3,
    }
  }
  if (
    key.includes("NAS") ||
    key.includes("US30") ||
    key.includes("SPX") ||
    key.includes("GER") ||
    key.includes("DAX")
  ) {
    return {
      symbol: key,
      label: key,
      category: "index",
      pointValue: 1,
      pipSize: 1,
      decimals: 1,
    }
  }
  if (key.includes("BTC") || key.includes("ETH")) {
    return {
      symbol: key,
      label: key,
      category: "crypto",
      pointValue: 1,
      pipSize: 1,
      decimals: 2,
    }
  }

  // Standard FX majors / crosses quoted like EURUSD
  return {
    symbol: key,
    label: key,
    category: "forex",
    pointValue: 100_000,
    pipSize: 0.0001,
    decimals: 5,
  }
}

export function getPointValue(pair: string): number {
  return getInstrumentSpec(pair).pointValue
}
