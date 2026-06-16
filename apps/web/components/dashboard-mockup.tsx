"use client"

import * as React from "react"
import { useState } from "react"
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts"
import { 
  TrendingUp, 
  Percent, 
  Target, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Brain, 
  Clock, 
  AlertTriangle,
  Award,
  Sparkles,
  Settings,
  Search,
  Activity,
  Users
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Logo } from "@/components/logo"

const mockChartData = [
  { day: "MON", value: 10000 },
  { day: "TUE", value: 10450 },
  { day: "WED", value: 10250 },
  { day: "THU", value: 11100 },
  { day: "FRI", value: 10900 },
  { day: "MON", value: 11800 },
  { day: "TUE", value: 12450 },
  { day: "WED", value: 12100 },
  { day: "THU", value: 13250 },
  { day: "FRI", value: 14250 },
]

const mockTrades = [
  { id: "1", pair: "EURUSD", direction: "BUY", entry: 1.0854, exit: 1.0920, lotSize: 1.5, result: 990.00, outcome: "WIN", session: "NY", tag: "A+ Setup" },
  { id: "2", pair: "GBPJPY", direction: "SELL", entry: 191.20, exit: 190.50, lotSize: 2.0, result: 1400.00, outcome: "WIN", session: "London", tag: "News Trade" },
  { id: "3", pair: "XAUUSD", direction: "BUY", entry: 2330.50, exit: 2315.00, lotSize: 1.0, result: -1550.00, outcome: "LOSS", session: "NY", tag: "FOMO Entry" },
  { id: "4", pair: "USDJPY", direction: "BUY", entry: 155.40, exit: 156.20, lotSize: 1.0, result: 800.00, outcome: "WIN", session: "Tokyo", tag: "Trend Follow" },
  { id: "5", pair: "AUDUSD", direction: "SELL", entry: 0.6620, exit: 0.6640, lotSize: 1.5, result: -300.00, outcome: "LOSS", session: "London", tag: "Late Entry" },
]

const mockNewsEvents = [
  { id: "n1", title: "US CPI Release", currency: "USD", impact: "HIGH", result: 1200.00, note: "CPI came lower than expected; EURUSD surged rapidly." },
  { id: "n2", title: "UK Unemployment Rate", currency: "GBP", impact: "MEDIUM", result: 450.00, note: "Entered post-reaction scalp on GBPJPY." },
  { id: "n3", title: "US NFP Payrolls", currency: "USD", impact: "HIGH", result: -300.00, note: "Spread widened on release, triggering early stop out." },
  { id: "n4", title: "FOMC Press Conference", currency: "USD", impact: "HIGH", result: 1800.00, note: "Fed dovish tone fueled massive gold breakout." },
]

const mockPsychTags = [
  { id: "p1", tag: "Followed Plan", count: 32, winRate: 78, profit: 5800.00, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  { id: "p2", tag: "FOMO Entry", count: 7, winRate: 28, profit: -1200.00, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { id: "p3", tag: "Revenge Trade", count: 3, winRate: 0, profit: -1600.00, color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  { id: "p4", tag: "Moved Stop Loss", count: 2, winRate: 50, profit: -750.00, color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
]

export function DashboardMockup() {
  const [activeTab, setActiveTab] = useState<"overview" | "journal" | "news" | "psychology">("overview")

  return (
    <div className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-2xl overflow-hidden flex flex-col lg:flex-row h-[680px]">
      
      {/* Mock Sidebar */}
      <div className="hidden lg:flex w-64 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex-col p-6 shrink-0 justify-between">
        <div className="space-y-6">
          {/* Logo */}
          <Logo theme="light" width={140} height={42} href={undefined} className="px-2" />

          {/* Navigation Links */}
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Activity className="h-4 w-4" />
              Overview
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <Calendar className="h-4 w-4" />
              Journal Logs
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <BarChart3 className="h-4 w-4" />
              Performance
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <Brain className="h-4 w-4" />
              Psychology
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 p-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
          <div className="relative h-9 w-9 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-sm font-bold text-neutral-700 dark:text-neutral-300">
            TR
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-950" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">Tapiwa R.</p>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">tapiwa@claritrade.io</p>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white dark:bg-neutral-950">
        
        {/* Header */}
        <div className="h-16 border-b border-neutral-200 dark:border-neutral-800 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400">Sandbox Dashboard</span>
            <span className="text-xs text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Demo Mode Active
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/10 px-6 py-3 shrink-0">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "journal", label: "Journal Logs", icon: Calendar },
              { id: "news", label: "News Impact Sync", icon: Clock },
              { id: "psychology", label: "Psychology Insights", icon: Brain }
            ].map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive 
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-md"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 p-6 overflow-y-auto min-h-0 bg-neutral-50/30 dark:bg-neutral-950/20">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Net P&L", value: "+$4,250.00", icon: TrendingUp, color: "text-emerald-500", trend: "+14.2% this week" },
                  { label: "Win Rate", value: "68.2%", icon: Percent, color: "text-blue-500", trend: "Target: > 60%" },
                  { label: "Avg R:R Ratio", value: "1:2.4", icon: Target, color: "text-violet-500", trend: "Optimal: 1:2" },
                  { label: "Total Trades", value: "44", icon: BarChart3, color: "text-amber-500", trend: "32 Wins | 12 Losses" }
                ].map((stat, i) => {
                  const Icon = stat.icon
                  return (
                    <Card key={i} className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-sm">
                      <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</span>
                          <Icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{stat.value}</p>
                          <p className="text-[10px] font-medium text-neutral-400 mt-0.5">{stat.trend}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Chart */}
              <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-sm p-5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Equity Curve (USD)</h4>
                    <p className="text-[10px] text-neutral-400 font-medium">Visualizing growth from $10,000 baseline balance</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold text-emerald-500 bg-emerald-500/5 border-emerald-500/20">
                    +$4,250 Net Profit
                  </Badge>
                </div>
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="landingChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94A3B8', fontSize: 9, fontWeight: 700 }}
                        dy={8}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94A3B8', fontSize: 9, fontWeight: 700 }}
                        tickFormatter={(v) => `$${v}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: '1px solid rgba(148, 163, 184, 0.1)', 
                          backgroundColor: 'rgba(0,0,0,0.85)',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}
                        formatter={(val) => [`$${val}`, "Account Equity"]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#2563EB" 
                        strokeWidth={2.5} 
                        fillOpacity={1} 
                        fill="url(#landingChartGrad)" 
                        dot={{ r: 3.5, fill: '#2563EB', strokeWidth: 1.5, stroke: '#fff' }}
                        activeDot={{ r: 5, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: JOURNAL LOGS */}
          {activeTab === "journal" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Recent Trade Logs</h4>
                  <p className="text-[10px] text-neutral-400 font-medium">Double-click any entry to view full screenshots & notes</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-neutral-400" />
                    <input 
                      type="text" 
                      placeholder="Filter by pair, session..." 
                      className="pl-8 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-44" 
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900/30">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        <th className="py-3 px-4">Asset</th>
                        <th className="py-3 px-4">Dir</th>
                        <th className="py-3 px-4">Size</th>
                        <th className="py-3 px-4">Entry / Exit</th>
                        <th className="py-3 px-4">Outcome</th>
                        <th className="py-3 px-4">Net P&L</th>
                        <th className="py-3 px-4">Tags</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                      {mockTrades.map(trade => (
                        <tr key={trade.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">{trade.pair}</td>
                          <td className="py-3 px-4">
                            <span className={`font-extrabold text-[10px] px-1.5 py-0.5 rounded ${
                              trade.direction === "BUY" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            }`}>
                              {trade.direction}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-neutral-500 dark:text-neutral-400">{trade.lotSize} Lots</td>
                          <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-300">
                            {trade.entry.toFixed(4)} → {trade.exit ? trade.exit.toFixed(4) : "—"}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              trade.outcome === "WIN" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                            }`}>
                              {trade.outcome === "WIN" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                              {trade.outcome}
                            </span>
                          </td>
                          <td className={`py-3 px-4 font-mono font-bold ${
                            trade.result >= 0 ? "text-emerald-500" : "text-rose-500"
                          }`}>
                            {trade.result >= 0 ? `+$${trade.result.toFixed(2)}` : `-$${Math.abs(trade.result).toFixed(2)}`}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700">
                              {trade.tag}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NEWS IMPACT SYNC */}
          {activeTab === "news" && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Economic News Correlation</h4>
                <p className="text-[10px] text-neutral-400 font-medium">Syncing trading results with high-impact economic calendar events</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* News feed list */}
                <div className="lg:col-span-2 space-y-3">
                  {mockNewsEvents.map(event => (
                    <div 
                      key={event.id}
                      className="p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 rounded-xl flex justify-between items-start gap-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm"
                    >
                      <div className="flex gap-3 items-start">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          event.impact === "HIGH" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}>
                          {event.currency}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-neutral-900 dark:text-white">{event.title}</h5>
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                              event.impact === "HIGH" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                            }`}>
                              {event.impact} IMPACT
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium mt-1">{event.note}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[9px] font-bold text-neutral-400 block uppercase">Trade Net</span>
                        <span className={`font-mono text-xs font-extrabold ${event.result >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                          {event.result >= 0 ? `+$${event.result.toFixed(2)}` : `-$${Math.abs(event.result).toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Analytical Card */}
                <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-sm p-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex gap-2 items-center">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">News Sentiment Analytics</h4>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-neutral-600 dark:text-neutral-300">High Impact Win Rate</span>
                          <span className="text-emerald-500">71.4%</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '71.4%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-neutral-600 dark:text-neutral-300">CPI Outing Profit</span>
                          <span className="text-blue-500">+$3,000</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/20 rounded-lg text-[10px] text-blue-600 dark:text-blue-400 leading-normal">
                    <strong>Correlation Insight:</strong> Your execution is highly profitable (+25%) during trending CPI occurrences, but shows losses when scaling FOMC announcement days due to early entries.
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 4: PSYCHOLOGY */}
          {activeTab === "psychology" && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Mental & Discipline Analysis</h4>
                <p className="text-[10px] text-neutral-400 font-medium">Correlating psychological triggers with execution outcomes</p>
              </div>

              {/* Psychology grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Behavioral tags */}
                <div className="space-y-3">
                  {mockPsychTags.map(tag => (
                    <div 
                      key={tag.id}
                      className="p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 rounded-xl flex justify-between items-center shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${tag.color}`}>
                          {tag.tag}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase">{tag.count} Trades</span>
                      </div>

                      <div className="flex gap-6 text-right">
                        <div>
                          <span className="text-[9px] font-bold text-neutral-400 block uppercase">Win Rate</span>
                          <span className="text-xs font-extrabold text-neutral-800 dark:text-white">{tag.winRate}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-neutral-400 block uppercase">Net Return</span>
                          <span className={`font-mono text-xs font-extrabold ${tag.profit >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                            {tag.profit >= 0 ? `+$${tag.profit.toFixed(0)}` : `-$${Math.abs(tag.profit).toFixed(0)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Psychology Feedback */}
                <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-sm p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-blue-500 flex items-center justify-center">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">Psychology Dashboard Insights</h4>
                        <h3 className="text-xs font-bold text-neutral-800 dark:text-white">Systematic Rule Enforcement</h3>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      <p>
                        📈 <strong>Discipline Multiplier:</strong> Trading strictly based on your plan results in a <strong>78% Win Rate</strong> and average trade size of <strong>+$181.25</strong>.
                      </p>
                      <p>
                        ⚠️ <strong>FOMO Penalty:</strong> Emotional entries represent 16% of total volume, but account for <strong>75% of your losses</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 rounded-xl flex gap-3 items-start">
                    <Award className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Action Plan Suggestion</h5>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 leading-normal">
                        Your performance shows that removing emotional "FOMO" and "Revenge" trades would increase your monthly return by <strong>$2,800.00</strong>. Set up a pre-trade checklist in ClariTrade to lock execution.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
