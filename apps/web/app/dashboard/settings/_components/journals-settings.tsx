"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Pencil, Star, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  createJournalAction,
  deleteJournalAction,
  renameJournalAction,
  setActiveJournalAction,
  setDefaultJournalAction,
} from "@/app/actions/journals"
import { toast } from "sonner"
import { cn } from "@workspace/ui/lib/utils"

type JournalRow = {
  id: string
  name: string
  description: string | null
  isDefault: boolean
  tradeCount: number
  startingBalance: number
  currentBalance: number
}

type Props = {
  journals: JournalRow[]
  activeJournalId: string
}

export function JournalsSettings({ journals, activeJournalId }: Props) {
  const router = useRouter()
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<JournalRow | null>(null)
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [startingBalance, setStartingBalance] = React.useState("10000")
  const [busy, setBusy] = React.useState(false)

  const refresh = () => router.refresh()

  const openCreate = () => {
    setName("")
    setDescription("")
    setStartingBalance("10000")
    setCreateOpen(true)
  }

  const openEdit = (j: JournalRow) => {
    setSelected(j)
    setName(j.name)
    setDescription(j.description ?? "")
    setEditOpen(true)
  }

  const openDelete = (j: JournalRow) => {
    setSelected(j)
    setDeleteOpen(true)
  }

  const onCreate = async () => {
    setBusy(true)
    const res = await createJournalAction({
      name,
      description,
      startingBalance: parseFloat(startingBalance),
      switchTo: true,
    })
    setBusy(false)
    if (res.success) {
      toast.success(`Created ${res.journal.name}`)
      setCreateOpen(false)
      refresh()
    } else toast.error(res.error)
  }

  const onRename = async () => {
    if (!selected) return
    setBusy(true)
    const res = await renameJournalAction({
      journalId: selected.id,
      name,
      description,
    })
    setBusy(false)
    if (res.success) {
      toast.success("Journal updated")
      setEditOpen(false)
      refresh()
    } else toast.error(res.error)
  }

  const onDelete = async () => {
    if (!selected) return
    setBusy(true)
    const res = await deleteJournalAction(selected.id)
    setBusy(false)
    if (res.success) {
      toast.success(`Deleted ${selected.name}`)
      setDeleteOpen(false)
      refresh()
    } else toast.error(res.error)
  }

  const onSwitch = async (id: string) => {
    if (id === activeJournalId) return
    const res = await setActiveJournalAction(id)
    if (res.success) {
      toast.success(`Switched to ${res.journal.name}`)
      refresh()
    } else toast.error(res.error)
  }

  const onDefault = async (id: string) => {
    const res = await setDefaultJournalAction(id)
    if (res.success) {
      toast.success("Default journal updated")
      refresh()
    } else toast.error(res.error)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={openCreate}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
        >
          New journal
        </Button>
      </div>

      <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:divide-white/5 dark:border-white/10 dark:bg-neutral-900">
        {journals.map((j) => {
          const isActive = j.id === activeJournalId
          return (
            <li
              key={j.id}
              className={cn(
                "flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between",
                isActive && "bg-[#EFF6FF]/40 dark:bg-blue-500/10"
              )}
            >
              <div className="min-w-0 flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-500/15 dark:text-blue-400">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold text-[#1E293B] dark:text-slate-100">
                      {j.name}
                    </p>
                    {isActive && (
                      <span className="rounded-md bg-[#2563EB] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                        Active
                      </span>
                    )}
                    {j.isDefault && (
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {j.tradeCount} trade{j.tradeCount === 1 ? "" : "s"}
                    {" · "}
                    Balance $
                    {j.currentBalance.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                    {j.description ? ` · ${j.description}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                {!isActive && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg text-xs"
                    onClick={() => void onSwitch(j.id)}
                  >
                    Switch to
                  </Button>
                )}
                {!j.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-lg text-xs text-slate-500"
                    onClick={() => void onDefault(j.id)}
                  >
                    <Star className="mr-1 h-3.5 w-3.5" />
                    Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500"
                  onClick={() => openEdit(j)}
                  aria-label="Rename"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => openDelete(j)}
                  aria-label="Delete"
                  disabled={journals.length <= 1}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          )
        })}
      </ul>

      {/* Create */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Create journal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. FTMO Challenge"
                className="h-11 rounded-lg"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Starting account balance ($)
              </Label>
              <Input
                type="number"
                min="1"
                step="100"
                value={startingBalance}
                onChange={(e) => setStartingBalance(e.target.value)}
                placeholder="10000"
                className="h-11 rounded-lg"
              />
              <p className="text-xs text-slate-500">
                Used for risk sizing and equity. Updates as you close trades.
              </p>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Description (optional)
              </Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short note"
                className="h-11 rounded-lg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void onCreate()}
              disabled={
                busy || !name.trim() || !(parseFloat(startingBalance) > 0)
              }
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
            >
              Create & switch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit journal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-lg"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Description
              </Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-11 rounded-lg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void onRename()}
              disabled={busy || !name.trim()}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete journal?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            This permanently deletes{" "}
            <span className="font-semibold text-[#1E293B]">
              {selected?.name}
            </span>{" "}
            and all{" "}
            <span className="font-semibold">{selected?.tradeCount ?? 0}</span>{" "}
            trades in it. This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void onDelete()}
              disabled={busy}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete forever
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
