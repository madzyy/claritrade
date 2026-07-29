import { cookies } from "next/headers"
import { prisma, type Journal, type User } from "@workspace/db"

export const ACTIVE_JOURNAL_COOKIE = "claritrade_active_journal"
export const DEFAULT_STARTING_BALANCE = 10_000

export type JournalSummary = Pick<
  Journal,
  | "id"
  | "name"
  | "description"
  | "isDefault"
  | "startingBalance"
  | "currentBalance"
  | "createdAt"
  | "updatedAt"
> & { tradeCount: number }

/** Recompute currentBalance from startingBalance + closed trade P&L. */
export async function syncJournalBalance(journalId: string): Promise<Journal> {
  const journal = await prisma.journal.findUniqueOrThrow({
    where: { id: journalId },
  })

  const agg = await prisma.trade.aggregate({
    where: {
      journalId,
      result: { not: null },
      outcome: { not: "PENDING" },
    },
    _sum: { result: true },
  })

  const currentBalance =
    Math.round((journal.startingBalance + (agg._sum.result ?? 0)) * 100) / 100

  return prisma.journal.update({
    where: { id: journalId },
    data: { currentBalance },
  })
}

/** Ensure the user has at least one journal (Main). */
export async function ensureDefaultJournal(userId: string): Promise<Journal> {
  const existing = await prisma.journal.findFirst({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  })
  if (existing) {
    if (!existing.isDefault) {
      const anyDefault = await prisma.journal.findFirst({
        where: { userId, isDefault: true },
      })
      if (!anyDefault) {
        return prisma.journal.update({
          where: { id: existing.id },
          data: { isDefault: true },
        })
      }
    }
    return existing
  }

  return prisma.journal.create({
    data: {
      userId,
      name: "Main Journal",
      description: "Default trading journal",
      isDefault: true,
      startingBalance: DEFAULT_STARTING_BALANCE,
      currentBalance: DEFAULT_STARTING_BALANCE,
    },
  })
}

export async function listJournalsForUser(
  userId: string
): Promise<JournalSummary[]> {
  await ensureDefaultJournal(userId)

  const journals = await prisma.journal.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    include: { _count: { select: { trades: true } } },
  })

  return journals.map((j) => ({
    id: j.id,
    name: j.name,
    description: j.description,
    isDefault: j.isDefault,
    startingBalance: j.startingBalance,
    currentBalance: j.currentBalance,
    createdAt: j.createdAt,
    updatedAt: j.updatedAt,
    tradeCount: j._count.trades,
  }))
}

export async function getJournalOwnedByUser(
  userId: string,
  journalId: string
): Promise<Journal | null> {
  return prisma.journal.findFirst({
    where: { id: journalId, userId },
  })
}

/**
 * Resolve the active journal from cookie, falling back to default.
 */
export async function getActiveJournal(user: User): Promise<Journal> {
  const fallback = await ensureDefaultJournal(user.id)

  const jar = await cookies()
  const cookieId = jar.get(ACTIVE_JOURNAL_COOKIE)?.value
  if (cookieId) {
    const owned = await getJournalOwnedByUser(user.id, cookieId)
    if (owned) return owned
  }

  return fallback
}

export async function setActiveJournalCookie(journalId: string) {
  const jar = await cookies()
  jar.set(ACTIVE_JOURNAL_COOKIE, journalId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  })
}
