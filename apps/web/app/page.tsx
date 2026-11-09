"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  Check,
  Compass,
  Brain,
  Clock,
  ChevronDown,
  HelpCircle,
  Zap,
  Play,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { DashboardMockup } from "@/components/dashboard-mockup"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@workspace/ui/lib/utils"

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}


function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <title>X</title>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

const faqs = [
  {
    question: "What is ClariTrade and how does it help traders?",
    answer: "ClariTrade is an advanced trading journal and analytics dashboard. Unlike static spreadsheets, it automatically syncs with macroeconomic news events and tracks your emotional state (psychology tags) to pinpoint exactly where you lose money, helping you build discipline and improve your win rate."
  },
  {
    question: "How does the economic news sync feature work?",
    answer: "Whenever you log a trade, ClariTrade looks up the economic calendar for that day. It highlights any medium or high-impact news events (like CPI, NFP, or FOMC) that occurred around your trade execution. You can view charts showing your performance during news releases versus quiet market conditions."
  },
  {
    question: "Is my trading data secure and confidential?",
    answer: "Absolutely yes. We understand that your trading history is your proprietary edge. All journal entries and metrics are encrypted end-to-end. We do not sell or share your trading data with third parties, brokerages, or prop firms."
  },
  {
    question: "Can I use ClariTrade for crypto, forex, and stocks?",
    answer: "Yes! ClariTrade is fully asset-agnostic. You can log forex pairs (EURUSD, GBPJPY), indices (US30, NAS100), commodities (Gold, Oil), crypto assets (BTC, ETH), and single equities."
  },
  {
    question: "What features are included in the Free vs Pro plans?",
    answer: "The Free plan includes manual trade journaling, basic analytics (win rate, total trades), and 30 trade logs per month. The Pro plan ($19/mo) unlocks unlimited trade logs, automatic economic news correlation, advanced equity curves, AI psychology insights, and custom tag creation."
  }
]

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#preview", label: "Demo" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faqs", label: "FAQs" },
]

export default function Page() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileMenuOpen])

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 bg-white/75 backdrop-blur-xl backdrop-saturate-150 transition-[border-color,background-color] duration-300 dark:bg-neutral-950/75",
          scrolled
            ? "border-b border-neutral-900/[0.06] dark:border-white/[0.06]"
            : "border-b border-transparent"
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:gap-4 sm:px-6 lg:px-8">
          <span className="sm:hidden">
            <Logo width={120} height={34} priority />
          </span>
          <span className="hidden sm:block">
            <Logo width={140} height={40} priority />
          </span>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle variant="marketing" className="hidden sm:inline-flex" />
            <Link
              href="/login"
              className="hidden text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 sm:inline dark:text-neutral-400 dark:hover:text-white"
            >
              Sign in
            </Link>
            <Button
              asChild
              className="hidden rounded-full bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:inline-flex p-[21px]"
            >
              <Link href="/signup">Get started today</Link>
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-100 md:hidden dark:text-neutral-400 dark:hover:bg-neutral-800"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-neutral-900/[0.06] bg-white/95 px-4 py-4 backdrop-blur-xl md:hidden dark:border-white/[0.06] dark:bg-neutral-950/95">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-neutral-900/[0.06] pt-3 dark:border-white/[0.06]">
                <div className="flex items-center justify-between px-3 py-1">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Theme
                  </span>
                  <ThemeToggle variant="marketing" />
                </div>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  Sign in
                </Link>
                <Button
                  asChild
                  className="w-full rounded-full bg-blue-600 font-semibold text-white hover:bg-blue-500"
                >
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    Get started today
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center px-4 py-10 sm:min-h-[calc(100dvh-4rem)] sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto w-full max-w-4xl text-center">
          <h1 className="text-[2rem] font-medium leading-[1.15] tracking-tight text-neutral-900 sm:text-5xl sm:leading-[1.1] md:text-6xl dark:text-white">
            Trading journals{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                made simple
              </span>
              <span
                aria-hidden="true"
                className="absolute -inset-x-1 bottom-1 -z-0 h-[0.45em] rounded-full bg-blue-100/90 dark:bg-blue-500/15"
              />
            </span>{" "}
            for serious traders.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-neutral-600 sm:mt-6 sm:text-lg sm:leading-8 dark:text-neutral-400">
            Most trading journals are powerful, but painful to use. ClariTrade
            syncs your trades with economic news, tracks psychology tags, and
            surfaces the patterns that actually move your P&amp;L.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white hover:bg-neutral-800 sm:w-auto dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
            >
              <Link href="/signup">Start journaling free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 w-full rounded-full border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 sm:w-auto dark:border-neutral-800 dark:bg-transparent dark:text-neutral-300 dark:hover:bg-neutral-900"
            >
              <a href="#preview" className="inline-flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Play className="h-3.5 w-3.5 fill-current" />
                </span>
                Watch demo
              </a>
            </Button>
          </div>

          <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-500">
            No credit card required
          </p>
        </div>
      </section>

      {/* Stats Proof Row */}
      <section className="border-y border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/10 py-12 px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            { label: "Trades Journaled", value: "1.4M+" },
            { label: "Win Rate Improvement", value: "+14.2%" },
            { label: "Active Traders Joined", value: "12,000+" },
            { label: "Data Uptime", value: "99.99%" }
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-2xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">{stat.value}</p>
              <p className="text-[10px] sm:text-sm font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide sm:tracking-widest leading-snug px-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Built for Serious Traders</h2>
            <h3 className="text-2xl font-medium tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl dark:text-white px-1">
              Eliminate guesswork. Keep trade execution flawless.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Compass,
                title: "Precision Journal Logs",
                description: "Record your entries, exits, risk-to-reward metrics, currency pairs, direction, and leverage in seconds. Keep a complete log of your trading journey.",
                color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
              },
              {
                icon: Clock,
                title: "Economic Calendar Sync",
                description: "Correlate your trade outcomes with high-impact macroeconomic events like NFP, CPI inflation figures, and FOMC speeches automatically.",
                color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
              },
              {
                icon: Brain,
                title: "Psychological Analytics",
                description: "Tag emotional states like FOMO, Revenge, or Patience. Our system aggregates your behavioral performance to isolate psychological leakage.",
                color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              }
            ].map((feat, i) => {
              const Icon = feat.icon
              return (
                <div 
                  key={i} 
                  className="p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 rounded-2xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all sm:hover:-translate-y-1 duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${feat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white">{feat.title}</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                      {feat.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interactive Sandbox / Mockup Section */}
      <section id="preview" className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50/50 dark:bg-neutral-900/10 z-10 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="outline" className="text-blue-600 dark:text-blue-400 bg-blue-500/5 border-blue-500/20 px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
              Interactive Preview
            </Badge>
            <h2 className="text-2xl font-medium tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl dark:text-white">
              Explore ClariTrade Sandbox
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
              Click through the tabs below to experience our journal, calendar syncs, and psychological breakdown engines. This is exactly how the app functions.
            </p>
          </div>

          {/* Interactive Mockup Container */}
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/5 to-emerald-500/5 blur-3xl opacity-60 pointer-events-none" />
            <div className="relative z-10">
              <DashboardMockup />
            </div>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="max-w-5xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Simple Transparent Pricing</h2>
            <h3 className="text-2xl font-medium tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl dark:text-white px-1">
              An investment that pays for itself in one disciplined trade.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 flex flex-col justify-between space-y-8 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-neutral-500 uppercase tracking-wider">Free Starter</h4>
                  <p className="text-neutral-400 text-xs font-medium mt-1">Perfect to build the habit of journaling</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-neutral-900 dark:text-white">$0</span>
                  <span className="text-neutral-400 text-sm font-semibold">/ month</span>
                </div>
                
                <hr className="border-neutral-100 dark:border-neutral-800" />
                
                <ul className="space-y-3.5 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    30 trade logs per month
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Basic journaling (entry, exit, size)
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Core Win Rate & P&L stats
                  </li>
                  <li className="flex items-center gap-3 text-neutral-300 dark:text-neutral-700 line-through">
                    Macroeconomic news calendar sync
                  </li>
                  <li className="flex items-center gap-3 text-neutral-300 dark:text-neutral-700 line-through">
                    Psychology tag analysis
                  </li>
                </ul>
              </div>

              <Button asChild variant="outline" className="w-full py-6 font-bold rounded-xl border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>

            {/* Pro Tier */}
            <div className="p-6 sm:p-8 rounded-2xl border-2 border-blue-600 dark:border-blue-500 bg-blue-500/[0.02] dark:bg-blue-500/[0.04] flex flex-col justify-between space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white font-extrabold text-[9px] uppercase px-4 py-1 rounded-bl-xl tracking-wider">
                Recommended
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Pro Trader</h4>
                  <p className="text-neutral-400 text-xs font-medium mt-1">For serious traders refining their edge</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-neutral-900 dark:text-white">$19</span>
                  <span className="text-neutral-400 text-sm font-semibold">/ month</span>
                </div>

                <hr className="border-blue-500/10" />

                <ul className="space-y-3.5 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  <li className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-blue-500 shrink-0 animate-pulse" />
                    <strong>Unlimited</strong> trade logs
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Macroeconomic news calendar sync
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Psychology tag analysis
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Full equity curves & drawdowns
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    AI Insights & monthly evaluations
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Priority CSV data exports
                  </li>
                </ul>
              </div>

              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all">
                <Link href="/signup">Sign Up Now</Link>
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faqs" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-neutral-50/50 dark:bg-neutral-900/10 z-10 relative">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-medium tracking-tight text-neutral-900 sm:text-3xl dark:text-white">Frequently Asked Questions</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Have questions? We have answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index
              return (
                <div 
                  key={index} 
                  className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full py-4 px-4 sm:py-5 sm:px-6 flex justify-between items-start gap-3 text-left font-bold text-sm sm:text-base text-neutral-900 dark:text-white"
                  >
                    <span className="flex items-start gap-2.5 min-w-0">
                      <HelpCircle className="mt-0.5 h-4 w-4 text-blue-500 shrink-0" />
                      <span className="text-pretty">{faq.question}</span>
                    </span>
                    <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? "transform rotate-180" : ""
                    }`} />
                  </button>

                  <div className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[min(24rem,70dvh)] overflow-y-auto border-t border-neutral-100 dark:border-neutral-800/80" : "max-h-0 overflow-hidden"
                  }`}>
                    <p className="p-4 sm:p-6 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 z-10 relative text-center">
        <div className="max-w-4xl mx-auto p-6 sm:p-12 lg:p-16 rounded-2xl sm:rounded-3xl bg-neutral-900 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent_40%)]" />
          
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl lg:text-4xl">
              Ready to claim your edge?
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-medium">
              Join thousands of traders worldwide who use ClariTrade to manage capital, catalog statistics, and enforce trading discipline.
            </p>
            <div className="pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-6 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all">
                <Link href="/signup">Get Started For Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 text-center text-xs font-semibold text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <Logo variant="icon" width={28} height={28} href={undefined} />
            <span>© {new Date().getFullYear()} ClariTrade Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Risk Disclaimer</a>
          </div>

          <div className="flex gap-4">
            <a href="#" className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" aria-label="Twitter">
              <TwitterIcon className="h-4 w-4" />
            </a>
            <a href="#" className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" aria-label="GitHub">
              <GithubIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
