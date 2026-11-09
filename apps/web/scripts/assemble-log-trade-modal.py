from pathlib import Path

p = Path(__file__).resolve().parents[1] / "app/dashboard/_components/log-trade-modal.tsx"
lines = p.read_text(encoding="utf-8").splitlines(keepends=True)

extra = """import { FormState, initialForm } from "./log-trade/types"
import { LogTradeProvider } from "./log-trade/form-context"
import { ExecuteFields } from "./log-trade/execute-fields"
import { LtpModel } from "./log-trade/ltp-model"
import { ItpModel } from "./log-trade/itp-model"
import { StpModel } from "./log-trade/stp-model"

"""

fn = "".join(lines[429:1072])
fn = fn.replace(
    '  const [logTab, setLogTab] = React.useState<"LTP" | "ITP" | "STP">("LTP")\n',
    '  const [attached, setAttached] = React.useState({\n    LTP: true,\n    ITP: false,\n    STP: false,\n  })\n',
)

ctx = """  const ctx = {
    formData,
    setFormData,
    handleChange,
    toggleList,
    toggleTag,
    toggleRangeStep,
    toggleRangeConfirm,
    toggleDeferredStep,
    toggleStructureContext,
    setBias,
    showWhy,
    setShowWhy,
    itpUnlocked,
    stpUnlocked,
    pd,
    klPd,
    vsOpen,
    vsOpens,
    alignment,
    sponsored,
    dealingMid,
    rangeMid,
    priceDecimals,
    preview,
    nyMonth,
    nyWeekDay,
    weekDayId,
    weekStat,
    lotManual,
    setLotManual,
    journalName,
    balanceLoading,
    screenshots,
    setScreenshots,
  }

"""

header = "".join(lines[1071:1144])
footer = "".join(lines[4821:])

body = r'''          <LogTradeProvider value={ctx}>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] dark:[&::-webkit-scrollbar-thumb]:bg-white/20">
            <ExecuteFields />
            <section className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#2563EB]" />
                  <span className="text-sm font-bold text-foreground">
                    Models
                  </span>
                </div>
                <p className={cn("text-xs leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                  Execute first. Attach LTP, then ITP, then STP. Same orderflow
                  on all three is the only time you execute. If you can come to
                  an LTP but not an ITP, you do not move to STP. There is no
                  trade.
                </p>
              </div>
              <p
                className={cn(
                  "rounded-xl border px-3 py-2 text-xs leading-relaxed font-semibold",
                  alignment.aligned
                    ? "border-[#2563EB] bg-[#2563EB]/5 text-[#2563EB]"
                    : "border-border bg-transparent text-muted-foreground"
                )}
              >
                {alignment.message}
              </p>
              <div className="flex items-center gap-1">
                {(["LTP", "ITP", "STP"] as const).map((model) => {
                  const locked =
                    (model === "ITP" && !itpUnlocked) ||
                    (model === "STP" && !stpUnlocked)
                  const on = attached[model]
                  return (
                    <button
                      key={model}
                      type="button"
                      onClick={() => {
                        if (locked && !on) return
                        setAttached((prev) => ({ ...prev, [model]: !prev[model] }))
                      }}
                      className={cn(
                        "h-8 flex-1 rounded-md text-[12px] font-semibold transition-colors",
                        on
                          ? "bg-[#2563EB] text-white"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                        locked && !on && "opacity-50"
                      )}
                    >
                      {on ? model : `+ ${model}`}
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setShowWhy((v) => !v)}
                  className={cn(
                    "ml-1 h-8 shrink-0 rounded-md px-2.5 text-[11px] font-semibold",
                    showWhy
                      ? "bg-[#2563EB]/10 text-[#2563EB]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Why
                </button>
              </div>
              {attached.LTP ? <LtpModel /> : null}
              {attached.ITP ? <ItpModel /> : null}
              {attached.STP ? <StpModel /> : null}
            </section>
          </div>
          </LogTradeProvider>
'''

out = "".join(lines[:169]) + extra + fn + ctx + header + body + footer
p.write_text(out, encoding="utf-8")
print("modal lines", out.count("\n"))
