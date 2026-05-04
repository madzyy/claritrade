import { Plus, Upload, Sparkles, BarChart2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"

export function EmptyState() {
  return (
    <div className="px-8 pb-8">
      <Card className="border-[#E2E8F0] shadow-none rounded-2xl flex flex-col items-center justify-center py-20 bg-white">
        <CardContent className="flex flex-col items-center text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-64 h-40 bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1] flex items-center justify-center overflow-hidden">
               {/* Simplified Illustration */}
               <div className="w-full h-full opacity-10 flex flex-col justify-end p-4 gap-2">
                  <div className="h-1 bg-[#2563EB] w-[80%] rounded-full" />
                  <div className="h-1 bg-[#2563EB] w-[60%] rounded-full" />
                  <div className="h-1 bg-[#2563EB] w-[90%] rounded-full" />
               </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-xl border border-[#E2E8F0]">
              <BarChart2 className="h-10 w-10 text-[#CBD5E1]" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#0F172A] mb-3">No trades yet</h2>
          <p className="text-[#64748B] text-sm mb-10 leading-relaxed px-4">
            Log your first trade or import existing data to see your performance analytics and trading insights.
          </p>

          <div className="flex gap-4 mb-8">
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white gap-2 px-8 py-6 rounded-xl font-semibold">
              <Plus className="h-5 w-5" />
              Log Trade
            </Button>
            <Button variant="outline" className="border-[#E2E8F0] text-[#0F172A] gap-2 px-8 py-6 rounded-xl font-semibold hover:bg-[#F8FAFC]">
              <Upload className="h-5 w-5" />
              Import Data
            </Button>
          </div>

          <div className="bg-[#F5F3FF] text-[#7C3AED] px-6 py-3 rounded-full flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI Insights will appear here once data is available
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-8 mt-12">
        <FeatureItem 
          icon={<BarChart2 className="h-5 w-5 text-[#2563EB]" />}
          title="Equity Tracking"
          description="Visualize your growth with precision-grade equity curves and drawdown analysis."
        />
        <FeatureItem 
          icon={<div className="h-5 w-5 border-2 border-[#7C3AED] rounded-full flex items-center justify-center text-[10px] text-[#7C3AED] font-bold">P</div>}
          title="Psychology Tags"
          description="Master your mindset by tagging trades with emotional states and execution quality."
        />
        <FeatureItem 
          icon={<div className="h-5 w-5 border-2 border-[#0F172A] rounded flex items-center justify-center text-[10px] text-[#0F172A] font-bold">M</div>}
          title="Advanced Metrics"
          description="Calculate Sharpe ratio, Profit factor, and Expectancy automatically for every session."
        />
      </div>
    </div>
  )
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-10 w-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-[#0F172A]">{title}</h3>
        <p className="text-xs text-[#64748B] leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
