from pathlib import Path

root = Path(__file__).resolve().parents[1]
src = (root / "app/dashboard/_components/log-trade-modal.tsx").read_text(
    encoding="utf-8"
)
lines = src.splitlines(keepends=True)
# 1-indexed inclusive slices
chunks = {
    "types_body": (180, 429),
    "journal_inst": (170, 179),
    "execute": (1145, 1380),
    "execute_tail": (4723, 4820),
    "ltp_inst": (1441, 1565),
    "ltp_body": (1567, 2689),
    "ltp_rest": (3775, 4720),
    "itp": (2691, 3222),
    "stp": (3223, 3773),
}


def slice_(a, b):
    return "".join(lines[a - 1 : b])


def strip_tab(block: str) -> str:
    text = block.strip("\n")
    for key in ('{logTab === "LTP" && (', '{logTab === "ITP" && (', '{logTab === "STP" && ('):
        if key in text[:80] or text.lstrip().startswith(key):
            idx = text.find(key)
            text = text[:idx] + text[idx + len(key) :]
            break
    text = text.strip()
    if text.endswith(")}"):
        text = text[:-2].rstrip()
    if text.endswith("</>"):
        # keep fragment inner
        if text.startswith("<>"):
            text = text[2:].strip()
            if text.endswith("</>"):
                text = text[:-3].rstrip()
    elif text.startswith("<>"):
        text = text[2:].rstrip()
        if text.endswith("</>"):
            text = text[:-3].rstrip()
    return text


HOOK = """  const {
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
    weekDayId,
    weekStat,
    lotManual,
    setLotManual,
    journalName,
    balanceLoading,
    screenshots,
    setScreenshots,
  } = useLogTrade()
"""

IMPORTS_UI = '''"use client"

import * as React from "react"
import { Camera, Info, X } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"
import { useLogTrade } from "./form-context"
'''

TRADING = "".join(lines[28:169])  # from { BIAS through } from "@/lib/trading"

out = root / "app/dashboard/_components/log-trade"
out.mkdir(exist_ok=True)

# types.ts
types = (
    'import { INSTRUMENT_OPTIONS, type TradeDirection } from "@/lib/trading"\n\n'
    + slice_(*chunks["journal_inst"])
    + "\n"
    + slice_(*chunks["types_body"])
)
# the types_body starts with `type FormState` — prefix export
types = types.replace("\ntype FormState", "\nexport type FormState", 1)
types = types.replace("\nconst initialForm", "\nexport const initialForm", 1)
types = types.replace("\nconst JOURNAL_INSTRUMENTS", "\nexport const JOURNAL_INSTRUMENTS", 1)
types = types.replace("\nfunction toLocalInputValue", "\nexport function toLocalInputValue", 1)
(out / "types.ts").write_text(types, encoding="utf-8")

ltp = (
    IMPORTS_UI
    + TRADING
    + "\nexport function LtpModel() {\n"
    + HOOK
    + "  return (\n    <div className=\"flex flex-col gap-3\">\n"
    + strip_tab(slice_(*chunks["ltp_inst"]))
    + "\n"
    + strip_tab(slice_(*chunks["ltp_body"]))
    + "\n"
    + strip_tab(slice_(*chunks["ltp_rest"]))
    + "\n    </div>\n  )\n}\n"
)
(out / "ltp-model.tsx").write_text(ltp, encoding="utf-8")

itp = (
    IMPORTS_UI
    + TRADING
    + "\nexport function ItpModel() {\n"
    + HOOK
    + "  return (\n"
    + strip_tab(slice_(*chunks["itp"]))
    + "\n  )\n}\n"
)
(out / "itp-model.tsx").write_text(itp, encoding="utf-8")

stp = (
    IMPORTS_UI
    + TRADING
    + "\nexport function StpModel() {\n"
    + HOOK
    + "  return (\n"
    + strip_tab(slice_(*chunks["stp"]))
    + "\n  )\n}\n"
)
(out / "stp-model.tsx").write_text(stp, encoding="utf-8")

exe = (
    IMPORTS_UI
    + TRADING
    + "import { JOURNAL_INSTRUMENTS } from \"./types\"\n"
    + "import { KILLZONES } from \"@/lib/trading\"\n"
    + "\nexport function ExecuteFields() {\n"
    + HOOK
    + "  return (\n    <>\n"
    + slice_(*chunks["execute"])
    + "\n"
    + slice_(*chunks["execute_tail"])
    + "\n    </>\n  )\n}\n"
)
(out / "execute-fields.tsx").write_text(exe, encoding="utf-8")
print("wrote models", len(ltp), len(itp), len(stp), len(exe))
