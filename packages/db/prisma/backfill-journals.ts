/**
 * One-time backfill: create a default journal per user and attach existing trades.
 * Run after Journal table exists and before journalId is NOT NULL (or with nullable column).
 *
 *   pnpm --filter @workspace/db exec tsx prisma/backfill-journals.ts
 */
import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString =
  process.env.DATABASE_URL || process.env.DIRECT_URL

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL is required")
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

async function main() {
  const users = await prisma.user.findMany({ include: { journals: true } })

  for (const user of users) {
    let journal = user.journals.find((j) => j.isDefault) ?? user.journals[0]

    if (!journal) {
      journal = await prisma.journal.create({
        data: {
          userId: user.id,
          name: "Main Journal",
          description: "Default trading journal",
          isDefault: true,
        },
      })
      console.log(`Created Main Journal for ${user.email}`)
    }

    const result = await prisma.trade.updateMany({
      where: { userId: user.id, journalId: null as unknown as string },
      data: { journalId: journal.id },
    })

    // Also attach any trades missing journal via raw SQL if column was nullable
    await prisma.$executeRawUnsafe(
      `UPDATE "Trade" SET "journalId" = $1 WHERE "userId" = $2 AND ("journalId" IS NULL OR "journalId" = '')`,
      journal.id,
      user.id
    )

    console.log(
      `Attached trades for ${user.email} → ${journal.name} (prisma updateMany: ${result.count})`
    )
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
