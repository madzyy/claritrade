import { prisma } from "@workspace/db"
import { getOrCreatePrismaUser } from "@/lib/auth"
import { getActiveJournal } from "@/lib/journals"
import { TradeLogClient } from "./_components/trade-log-client"

export const dynamic = "force-dynamic"

export default async function TradeLogPage() {
  const user = await getOrCreatePrismaUser()
  const journal = user ? await getActiveJournal(user) : null

  const trades =
    user && journal
      ? await prisma.trade.findMany({
          where: { userId: user.id, journalId: journal.id },
          orderBy: { dateOpened: "desc" },
        })
      : []

  const serialized = trades.map((t) => ({
    ...t,
    dateOpened: t.dateOpened.toISOString(),
    dateClosed: t.dateClosed?.toISOString() ?? null,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }))

  return <TradeLogClient trades={serialized} />
}
