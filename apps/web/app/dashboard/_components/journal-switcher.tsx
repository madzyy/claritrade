"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Check, ChevronDown, Plus, Settings2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  createJournalAction,
  setActiveJournalAction,
} from "@/app/actions/journals"
import { toast } from "sonner"
import { cn } from "@workspace/ui/lib/utils"

export type JournalSwitcherItem = {
  id: string
  name: string
  isDefault: boolean
  tradeCount: number
}

type Props = {
  journals: JournalSwitcherItem[]
  activeJournalId: string
}

export function JournalSwitcher({ journals, activeJournalId }: Props) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const [createOpen, setCreateOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [creating, setCreating] = React.useState(false)

  const active = journals.find((j) => j.id === activeJournalId) ?? journals[0]

  const switchTo = (id: string) => {
    if (id === activeJournalId) return
    startTransition(async () => {
      const res = await setActiveJournalAction(id)
      if (res.success) {
        toast.success(`Switched to ${res.journal.name}`)
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  const create = async () => {
    setCreating(true)
    const res = await createJournalAction({ name, switchTo: true })
    setCreating(false)
    if (res.success) {
      toast.success(`Created ${res.journal.name}`)
      setCreateOpen(false)
      setName("")
      router.refresh()
    } else {
      toast.error(res.error)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            disabled={pending}
            className="h-9 px-0 text-sm font-medium text-[#64748B] hover:bg-transparent border-none bg-transparent gap-2 transition-all rounded-lg outline-none ring-0"
          >
            <span className="flex items-center gap-2 border px-3 py-1.5 rounded-lg bg-white shadow-none max-w-[220px]">
              <BookOpen className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
              <span className="truncate font-semibold text-[#1E293B]">
                {active?.name ?? "Journal"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-64 p-1 rounded-xl shadow-lg border-slate-100 bg-white"
        >
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-2">
            Your journals
          </DropdownMenuLabel>
          {journals.map((j) => (
            <DropdownMenuItem
              key={j.id}
              className="rounded-lg cursor-pointer text-[#475569] focus:bg-slate-50 focus:text-[#1E293B] flex items-center gap-2"
              onClick={() => switchTo(j.id)}
            >
              <Check
                className={cn(
                  "h-3.5 w-3.5 shrink-0",
                  j.id === activeJournalId ? "opacity-100 text-[#2563EB]" : "opacity-0"
                )}
              />
              <span className="flex-1 min-w-0 truncate font-medium">{j.name}</span>
              <span className="text-[10px] text-slate-400 tabular-nums">
                {j.tradeCount}
              </span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="rounded-lg cursor-pointer text-[#2563EB] focus:bg-blue-50 focus:text-[#2563EB]"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-3.5 w-3.5 mr-2" />
            New journal
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
            <Link href="/dashboard/settings">
              <Settings2 className="h-3.5 w-3.5 mr-2" />
              Manage journals
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1E293B]">Create journal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Prop Firm Challenge"
              className="h-11 rounded-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter") void create()
              }}
              autoFocus
            />
            <p className="text-xs text-slate-500">
              Each journal has its own trades, stats, and trade log.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setCreateOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={() => void create()}
              disabled={creating || !name.trim()}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
            >
              {creating ? "Creating…" : "Create & switch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
