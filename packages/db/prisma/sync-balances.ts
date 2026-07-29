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
  const journals = await prisma.journal.findMany()
  for (const j of journals) {
    const agg = await prisma.trade.aggregate({
      where: {
        journalId: j.id,
        result: { not: null },
        outcome: { not: "PENDING" },
      },
      _sum: { result: true },
    })
    const currentBalance = j.startingBalance + (agg._sum.result ?? 0)
    await prisma.journal.update({
      where: { id: j.id },
      data: { currentBalance },
    })
    console.log(`${j.name}: start ${j.startingBalance} → current ${currentBalance}`)
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
