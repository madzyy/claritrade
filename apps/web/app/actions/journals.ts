"use server"

import { getOrCreatePrismaUser } from "@/lib/auth"
import {
  ensureDefaultJournal,
  getActiveJournal,
  getJournalOwnedByUser,
  listJournalsForUser,
  setActiveJournalCookie,
  type JournalSummary,
} from "@/lib/journals"
import { prisma } from "@workspace/db"
import { revalidatePath } from "next/cache"

function revalidateJournalPaths() {
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/trades")
  revalidatePath("/dashboard/settings")
  revalidatePath("/dashboard/import")
}

export async function getJournalsAction(): Promise<{
  journals: JournalSummary[]
  activeJournalId: string | null
}> {
  const user = await getOrCreatePrismaUser()
  if (!user) return { journals: [], activeJournalId: null }

  const [journals, active] = await Promise.all([
    listJournalsForUser(user.id),
    getActiveJournal(user),
  ])
  return { journals, activeJournalId: active.id }
}

export async function setActiveJournalAction(journalId: string) {
  const user = await getOrCreatePrismaUser()
  if (!user) return { success: false as const, error: "Not signed in" }

  const owned = await getJournalOwnedByUser(user.id, journalId)
  if (!owned) return { success: false as const, error: "Journal not found" }

  await setActiveJournalCookie(owned.id)
  revalidateJournalPaths()
  return { success: true as const, journal: owned }
}

export async function createJournalAction(input: {
  name: string
  description?: string
  switchTo?: boolean
}) {
  const user = await getOrCreatePrismaUser()
  if (!user) return { success: false as const, error: "Not signed in" }

  const name = input.name.trim()
  if (!name) return { success: false as const, error: "Name is required" }
  if (name.length > 60) {
    return { success: false as const, error: "Name must be 60 characters or less" }
  }

  await ensureDefaultJournal(user.id)

  try {
    const journal = await prisma.journal.create({
      data: {
        userId: user.id,
        name,
        description: input.description?.trim() || null,
        isDefault: false,
      },
    })

    if (input.switchTo !== false) {
      await setActiveJournalCookie(journal.id)
    }

    revalidateJournalPaths()
    return { success: true as const, journal }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ""
    if (msg.includes("Unique constraint") || msg.includes("journal_userId_name")) {
      return {
        success: false as const,
        error: "You already have a journal with that name",
      }
    }
    console.error("createJournal", e)
    return { success: false as const, error: "Failed to create journal" }
  }
}

export async function renameJournalAction(input: {
  journalId: string
  name: string
  description?: string | null
}) {
  const user = await getOrCreatePrismaUser()
  if (!user) return { success: false as const, error: "Not signed in" }

  const name = input.name.trim()
  if (!name) return { success: false as const, error: "Name is required" }

  const owned = await getJournalOwnedByUser(user.id, input.journalId)
  if (!owned) return { success: false as const, error: "Journal not found" }

  try {
    const journal = await prisma.journal.update({
      where: { id: owned.id },
      data: {
        name,
        description:
          input.description === undefined
            ? undefined
            : input.description?.trim() || null,
      },
    })
    revalidateJournalPaths()
    return { success: true as const, journal }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ""
    if (msg.includes("Unique constraint")) {
      return {
        success: false as const,
        error: "You already have a journal with that name",
      }
    }
    console.error("renameJournal", e)
    return { success: false as const, error: "Failed to rename journal" }
  }
}

export async function deleteJournalAction(journalId: string) {
  const user = await getOrCreatePrismaUser()
  if (!user) return { success: false as const, error: "Not signed in" }

  const journals = await prisma.journal.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  })

  if (journals.length <= 1) {
    return {
      success: false as const,
      error: "You need at least one journal. Create another before deleting this one.",
    }
  }

  const target = journals.find((j) => j.id === journalId)
  if (!target) return { success: false as const, error: "Journal not found" }

  const active = await getActiveJournal(user)
  const remaining = journals.filter((j) => j.id !== journalId)
  const next =
    remaining.find((j) => j.isDefault) ?? remaining[0]

  // Trades cascade-delete with the journal
  await prisma.journal.delete({ where: { id: target.id } })

  if (target.isDefault && next) {
    await prisma.journal.update({
      where: { id: next.id },
      data: { isDefault: true },
    })
  }

  if (active.id === target.id && next) {
    await setActiveJournalCookie(next.id)
  }

  revalidateJournalPaths()
  return {
    success: true as const,
    deletedId: target.id,
    switchedToId: active.id === target.id ? next?.id ?? null : active.id,
  }
}

export async function setDefaultJournalAction(journalId: string) {
  const user = await getOrCreatePrismaUser()
  if (!user) return { success: false as const, error: "Not signed in" }

  const owned = await getJournalOwnedByUser(user.id, journalId)
  if (!owned) return { success: false as const, error: "Journal not found" }

  await prisma.$transaction([
    prisma.journal.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    }),
    prisma.journal.update({
      where: { id: owned.id },
      data: { isDefault: true },
    }),
  ])

  revalidateJournalPaths()
  return { success: true as const }
}
