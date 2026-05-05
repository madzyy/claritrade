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

      {/* Column Mapping Card */}
      <Card className="border border-slate-100 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-bold text-[#1E293B]">Column Mapping</h3>
            <p className="text-[12px] text-[#64748B] font-medium">Ensure your file data matches the correct journal fields.</p>
          </div>
          <Badge className="bg-[#2563EB]/5 text-[#2563EB] border border-[#2563EB]/10 gap-1.5 px-3 py-1.5 rounded-full font-bold text-[11px]">
            <div className="h-1.5 w-1.5 bg-[#2563EB] rounded-full animate-pulse" />
            Auto-mapped 4/7 fields
          </Badge>
        </div>
        
        <CardContent className="p-0">
          <div className="grid grid-cols-12 px-8 py-4 bg-slate-50/50">
            <div className="col-span-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your File Columns</div>
            <div className="col-span-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Claritrade Fields</div>
            <div className="col-span-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Sample Value</div>
          </div>

          <div className="flex flex-col">
            {mappings.map((mapping, i) => (
              <div key={i} className="grid grid-cols-12 px-8 py-5 items-center border-b border-slate-50 last:border-none group hover:bg-slate-50/30 transition-colors">
                <div className="col-span-5 flex items-center gap-4">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    mapping.status === "mapped" ? "bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)]" : "bg-slate-200"
                  )} />
                  <span className="font-bold text-[#334155] text-[15px]">{mapping.fileColumn}</span>
                  <ArrowRight className="h-4 w-4 text-[#94A3B8] ml-auto mr-8 group-hover:text-[#2563EB] transition-colors" />
                </div>
                
                <div className="col-span-4">
                  <Select defaultValue={mapping.status === "mapped" ? mapping.claritradeField.toLowerCase().replace(" ", "-") : undefined}>
                    <SelectTrigger className="w-full h-11 rounded-xl border-slate-100 bg-white font-medium text-slate-600 focus:ring-[#2563EB]/10 focus:border-[#2563EB]/30 transition-all">
                      <SelectValue placeholder={mapping.claritradeField} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                      <SelectItem value="pair">Pair</SelectItem>
                      <SelectItem value="lot-size">Lot Size</SelectItem>
                      <SelectItem value="entry-price">Entry Price</SelectItem>
                      <SelectItem value="exit-price">Exit Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-3 text-right">
                  <span className="text-sm font-semibold text-slate-400 tabular-nums">{mapping.sampleValue}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mapping Footer */}
          <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-3">
                <Checkbox id="skip-header" className="rounded-md border-slate-200 data-[state=checked]:bg-[#2563EB] data-[state=checked]:border-[#2563EB]" />
                <label htmlFor="skip-header" className="text-sm font-bold text-slate-600 cursor-pointer">Skip first row (header)</label>
              </div>
              <div className="flex items-center gap-2 text-[#2563EB] bg-[#2563EB]/5 px-3 py-1.5 rounded-lg border border-[#2563EB]/10">
                <Info className="h-4 w-4" />
                <span className="text-[12px] font-bold">Importing 254 trades</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="font-bold text-slate-500 hover:text-slate-700 h-11 px-6 rounded-xl">
                Cancel
              </Button>
              <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-[#2563EB]/20 transition-all active:scale-95">
                Confirm Import
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Tip Banner */}
      <div className="bg-[#7C3AED]/5 border border-[#7C3AED]/10 rounded-2xl p-4 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="h-8 w-8 bg-[#7C3AED]/10 rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4 text-[#7C3AED]" />
        </div>
        <p className="text-[13px] font-bold text-[#7C3AED]">
          AI Tip: Standardizing your timestamps to UTC will ensure 100% accuracy in performance charts.
        </p>
      </div>
    </div>
  )
}
