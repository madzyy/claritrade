import { getOrCreatePrismaUser } from "@/lib/auth"
import { getActiveJournal, listJournalsForUser } from "@/lib/journals"
import { JournalsSettings } from "./_components/journals-settings"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const user = await getOrCreatePrismaUser()
  if (!user) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Sign in to manage journals.
      </div>
    )
  }

  const [journals, active] = await Promise.all([
    listJournalsForUser(user.id),
    getActiveJournal(user),
  ])

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#1E293B] tracking-tight">
          Journals
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Separate prop accounts, strategies, or practice logs. Deleting a journal
          permanently removes its trades.
        </p>
      </div>
      <JournalsSettings
        journals={journals.map((j) => ({
          id: j.id,
          name: j.name,
          description: j.description,
          isDefault: j.isDefault,
          tradeCount: j.tradeCount,
        }))}
        activeJournalId={active.id}
      />
    </div>
  )
}
