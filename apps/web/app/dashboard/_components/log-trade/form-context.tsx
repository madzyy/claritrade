"use client"

import * as React from "react"
import type { FormState } from "./types"

export type ToggleListField =
  | "relativeLevels"
  | "relativeSequence"
  | "gapFramework"
  | "institutionalChecks"
  | "institutionalChecksItp"
  | "institutionalChecksStp"
  | "mmxmSequence"
  | "mmxmSequenceItp"
  | "mmxmSequenceStp"
  | "ltpIofChecks"
  | "dealingJobs"
  | "dealingJobsItp"
  | "dealingJobsStp"
  | "htfKlContext"
  | "rangeTfTools"
  | "closeSignatures"
  | "closeContext"
  | "weekProfileSteps"
  | "weekNotes"
  | "itpToc"
  | "stpKlNotes"
  | "purgeQuals"
  | "prevSessions"
  | "newsTells"
  | "eqoManipQ"
  | "eqoDistQ"

export type LogTradeCtx = {
  formData: FormState
  setFormData: React.Dispatch<React.SetStateAction<FormState>>
  handleChange: <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => void
  toggleList: (field: ToggleListField, id: string) => void
  toggleTag: (tag: string) => void
  toggleRangeStep: (id: string) => void
  toggleRangeConfirm: (id: string) => void
  toggleDeferredStep: (id: string) => void
  toggleStructureContext: (id: string) => void
  setBias: (bias: string) => void
  showWhy: boolean
  setShowWhy: React.Dispatch<React.SetStateAction<boolean>>
  logTab: "LTP" | "ITP" | "STP"
  itpUnlocked: boolean
  stpUnlocked: boolean
  pd: string | null
  klPd: string | null
  vsOpen: "above" | "below" | null
  vsOpens: {
    midnight: "above" | "below" | "at"
    eightThirty: "above" | "below" | "at"
    both: "above" | "below" | "split" | null
  } | null
  alignment: { aligned: boolean; stage: string; message: string }
  sponsored: boolean
  dealingMid: number | null
  rangeMid: number | null
  priceDecimals: number
  preview: {
    plannedRr?: number | null
    rMultiple: number | null
    result: number | null
  } | null
  nyMonth: number
  nyWeekDay: string
  weekDayId: string
  weekStat: number | null
  lotManual: boolean
  setLotManual: React.Dispatch<React.SetStateAction<boolean>>
  journalName: string | null
  balanceLoading: boolean
  screenshots: File[]
  setScreenshots: React.Dispatch<React.SetStateAction<File[]>>
  chartLinks: string[]
  setChartLinks: React.Dispatch<React.SetStateAction<string[]>>
}

const LogTradeContext = React.createContext<LogTradeCtx | null>(null)

export function LogTradeProvider({
  value,
  children,
}: {
  value: LogTradeCtx
  children: React.ReactNode
}) {
  return (
    <LogTradeContext.Provider value={value}>{children}</LogTradeContext.Provider>
  )
}

export function useLogTrade() {
  const ctx = React.useContext(LogTradeContext)
  if (!ctx) throw new Error("useLogTrade must be used inside LogTradeProvider")
  return ctx
}
