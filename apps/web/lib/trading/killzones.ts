/**
 * ICT Killzones in New York local time.
 * America/New_York is EDT (UTC-4) in summer and EST (UTC-5) in winter.
 */

export const NY_TIMEZONE = "America/New_York"

export type KillzoneId =
  | "ASIAN"
  | "LONDON_OPEN"
  | "NY_AM"
  | "NY_LUNCH"
  | "NY_PM"
  | "LONDON_CLOSE"
  | "OUTSIDE"

export interface KillzoneDef {
  id: KillzoneId
  label: string
  /** Start hour inclusive (NY local, 0–23) */
  startHour: number
  /** End hour exclusive (NY local, 0–23). May wrap past midnight. */
  endHour: number
  description: string
}

/**
 * Canonical ICT session windows (NY local clock).
 * Overlaps are resolved by priority: NY AM > London Close > NY Lunch > London Open > Asian > NY PM.
 */
export const KILLZONES: KillzoneDef[] = [
  {
    id: "ASIAN",
    label: "Asian Range",
    startHour: 20,
    endHour: 0,
    description: "20:00–00:00 NY — Asia range / liquidity build",
  },
  {
    id: "LONDON_OPEN",
    label: "London Open KZ",
    startHour: 2,
    endHour: 5,
    description: "02:00–05:00 NY — London open killzone",
  },
  {
    id: "NY_AM",
    label: "NY AM Killzone",
    startHour: 7,
    endHour: 10,
    description: "07:00–10:00 NY — New York AM killzone",
  },
  {
    id: "LONDON_CLOSE",
    label: "London Close",
    startHour: 10,
    endHour: 12,
    description: "10:00–12:00 NY — London close / NY midday",
  },
  {
    id: "NY_LUNCH",
    label: "NY Lunch",
    startHour: 12,
    endHour: 13,
    description: "12:00–13:00 NY — lunch consolidation",
  },
  {
    id: "NY_PM",
    label: "NY PM Killzone",
    startHour: 13,
    endHour: 16,
    description: "13:00–16:00 NY — afternoon continuation / reversals",
  },
]

const PRIORITY: KillzoneId[] = [
  "NY_AM",
  "LONDON_CLOSE",
  "NY_LUNCH",
  "LONDON_OPEN",
  "ASIAN",
  "NY_PM",
]

function hourInWindow(hour: number, start: number, end: number): boolean {
  if (start === end) return true
  if (start < end) return hour >= start && hour < end
  // Wraps midnight (e.g. 20 → 0)
  return hour >= start || hour < end
}

export function getNyParts(date: Date): {
  hour: number
  minute: number
  offsetLabel: string
  timeLabel: string
  dateLabel: string
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: NY_TIMEZONE,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZoneName: "shortOffset",
  }).formatToParts(date)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ""

  let hour = parseInt(get("hour"), 10)
  if (hour === 24) hour = 0
  const minute = parseInt(get("minute"), 10)
  const offsetLabel = get("timeZoneName") || "GMT-4"
  const timeLabel = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
  const dateLabel = `${get("month")} ${get("day")}, ${get("year")}`

  return { hour, minute, offsetLabel, timeLabel, dateLabel }
}

/** Detect active ICT killzone for a timestamp (uses NY local hour). */
export function detectKillzone(date: Date = new Date()): {
  id: KillzoneId
  label: string
  description: string
  nyHour: number
  nyTime: string
  nyOffset: string
  isDst: boolean
} {
  const { hour, offsetLabel, timeLabel } = getNyParts(date)
  const matches = KILLZONES.filter((kz) =>
    hourInWindow(hour, kz.startHour, kz.endHour)
  )

  matches.sort(
    (a, b) => PRIORITY.indexOf(a.id) - PRIORITY.indexOf(b.id)
  )

  const active = matches[0]
  const isDst = /GMT-4|UTC-4|EDT/i.test(offsetLabel)

  if (!active) {
    return {
      id: "OUTSIDE",
      label: "Outside Killzones",
      description: "No primary ICT killzone active",
      nyHour: hour,
      nyTime: timeLabel,
      nyOffset: offsetLabel,
      isDst,
    }
  }

  return {
    id: active.id,
    label: active.label,
    description: active.description,
    nyHour: hour,
    nyTime: timeLabel,
    nyOffset: offsetLabel,
    isDst,
  }
}

export function killzoneLabel(id: string | null | undefined): string {
  if (!id) return "—"
  if (id === "OUTSIDE") return "Outside KZ"
  const found = KILLZONES.find((k) => k.id === id)
  return found?.label ?? id
}

/** Map killzone → coarse session for legacy `session` field. */
export function killzoneToSession(
  killzone: KillzoneId
): "asian" | "london" | "new-york" | "overlap" {
  switch (killzone) {
    case "ASIAN":
      return "asian"
    case "LONDON_OPEN":
      return "london"
    case "NY_AM":
    case "NY_LUNCH":
    case "NY_PM":
      return "new-york"
    case "LONDON_CLOSE":
      return "overlap"
    default:
      return "new-york"
  }
}
