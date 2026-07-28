"use client"

import { CloudUpload, ArrowRight, Info, Bot, Search, Check, ChevronDown } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

const mappings = [
  { fileColumn: "Instrument", claritradeField: "Pair", sampleValue: "EURUSD", status: "mapped" },
  { fileColumn: "Lots", claritradeField: "Lot Size", sampleValue: "0.50", status: "mapped" },
  { fileColumn: "Open Price", claritradeField: "Entry Price", sampleValue: "1.0842", status: "mapped" },
  { fileColumn: "Profit/Loss", claritradeField: "Select matching field...", sampleValue: "$142.50", status: "unmapped" },
]

export default function ImportPage() {
  return (
    <div className="flex flex-col gap-8 p-12 max-w-5xl mx-auto min-h-full">
      {/* Title Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold text-[#1E293B] tracking-tight">Import Trading History</h2>
          <Badge className="bg-[#2563EB]/10 text-[#2563EB] border-none px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider">
            Phase 1
          </Badge>
        </div>
        <p className="text-[#475569] text-lg">
          Sync your external trading accounts or upload export files to analyze your performance.
        </p>
      </div>

      {/* Dropzone Card */}
      <Card className="border-2 border-dashed border-slate-200 bg-white rounded-xl overflow-hidden shadow-none hover:border-[#2563EB]/30 transition-colors cursor-pointer group">
        <CardContent className="flex flex-col items-center justify-center py-16 px-10 gap-6">
          <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <CloudUpload className="h-8 w-8 text-[#2563EB]" />
          </div>
          
          <div className="flex flex-col items-center gap-2 text-center">
            <h3 className="text-xl font-bold text-[#334155]">Drop your CSV or Excel file here or click to browse</h3>
            <p className="text-[#475569] max-w-md">
              Claritrade supports direct exports from <span className="text-[#1E293B] font-bold">MT4, MT5, MyFXBook, Interactive Brokers,</span> and <span className="text-[#1E293B] font-bold">TradingView.</span>
            </p>
          </div>

          <Button className="bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-xl px-8 h-12 font-bold gap-2 shadow-lg transition-all active:scale-95">
            <Search className="h-4 w-4" />
            Select File
          </Button>
        </CardContent>
      </Card>

      {/* Column Mapping */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[15px] font-semibold text-[#111827] tracking-tight">
              Column mapping
            </h3>
            <p className="text-[12px] text-[#6B7280] mt-0.5">
              Ensure your file data matches the correct journal fields.
            </p>
          </div>
          <Badge className="bg-[#2563EB]/10 text-[#2563EB] border-none gap-1.5 px-3 py-1 rounded-full font-semibold text-[11px]">
            <div className="h-1.5 w-1.5 bg-[#2563EB] rounded-full" />
            Auto-mapped 4/7 fields
          </Badge>
        </div>

        <div className="hidden lg:flex items-center gap-4 px-1 mb-2">
          <div className="flex-1 min-w-0 text-[12px] font-medium text-[#6B7280]">
            Your file columns
          </div>
          <div className="w-[220px] shrink-0 text-[12px] font-medium text-[#6B7280]">
            Claritrade fields
          </div>
          <div className="w-[110px] shrink-0 text-right text-[12px] font-medium text-[#6B7280]">
            Sample value
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-none overflow-hidden">
          {mappings.map((mapping) => (
            <div
              key={mapping.fileColumn}
              className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 px-5 lg:px-6 py-4 border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors"
            >
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full shrink-0",
                    mapping.status === "mapped" ? "bg-[#2563EB]" : "bg-[#D1D5DB]"
                  )}
                />
                <span className="text-[14px] text-[#374151]">
                  {mapping.fileColumn}
                </span>
                <ArrowRight className="h-4 w-4 text-[#D1D5DB] hidden lg:block ml-auto" />
              </div>

              <div className="lg:w-[220px] shrink-0">
                <Select
                  defaultValue={
                    mapping.status === "mapped"
                      ? mapping.claritradeField.toLowerCase().replace(" ", "-")
                      : undefined
                  }
                >
                  <SelectTrigger className="w-full h-10 rounded-lg border-[#E2E8F0] bg-white font-medium text-[#4B5563] shadow-none">
                    <SelectValue placeholder={mapping.claritradeField} />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-[#E2E8F0]">
                    <SelectItem value="pair">Pair</SelectItem>
                    <SelectItem value="lot-size">Lot Size</SelectItem>
                    <SelectItem value="entry-price">Entry Price</SelectItem>
                    <SelectItem value="exit-price">Exit Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:w-[110px] shrink-0 flex justify-between lg:justify-end">
                <span className="lg:hidden text-[12px] text-[#6B7280]">
                  Sample
                </span>
                <span className="text-[14px] font-semibold text-[#111827] tabular-nums">
                  {mapping.sampleValue}
                </span>
              </div>
            </div>
          ))}

          <div className="px-5 lg:px-6 py-4 border-t border-[#F3F4F6] flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#F9FAFB]">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="skip-header"
                  className="rounded-md border-[#E2E8F0] data-[state=checked]:bg-[#2563EB] data-[state=checked]:border-[#2563EB]"
                />
                <label
                  htmlFor="skip-header"
                  className="text-sm font-medium text-[#4B5563] cursor-pointer"
                >
                  Skip first row (header)
                </label>
              </div>
              <div className="flex items-center gap-2 text-[#2563EB] bg-[#2563EB]/5 px-3 py-1.5 rounded-lg">
                <Info className="h-4 w-4" />
                <span className="text-[12px] font-semibold">
                  Importing 254 trades
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="font-semibold text-[#6B7280] h-10 px-5 rounded-lg"
              >
                Cancel
              </Button>
              <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold h-10 px-6 rounded-lg shadow-none">
                Confirm Import
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tip Banner */}
      <div className="bg-[#2563EB]/5 border border-[#2563EB]/10 rounded-2xl p-4 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="h-8 w-8 bg-[#2563EB]/10 rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4 text-[#2563EB]" />
        </div>
        <p className="text-[13px] font-bold text-[#2563EB]">
          AI Tip: Standardizing your timestamps to UTC will ensure 100% accuracy in performance charts.
        </p>
      </div>
    </div>
  )
}
