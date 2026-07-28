import { createClient } from "@/lib/supabase/server"
import { prisma } from "@workspace/db"
import type { User } from "@workspace/db"
import { ensureDefaultJournal } from "@/lib/journals"

export async function getSessionUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user?.email) {
    return null
  }

  return user
}

export async function getOrCreatePrismaUser(): Promise<User | null> {
  const authUser = await getSessionUser()
  if (!authUser?.email) return null

  const name =
    (authUser.user_metadata?.name as string | undefined) ??
    authUser.email.split("@")[0]

  const user = await prisma.user.upsert({
    where: { email: authUser.email },
    update: { name },
    create: {
      email: authUser.email,
      name,
    },
  })

  await ensureDefaultJournal(user.id)
  return user
}
