"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

type ThemeToggleProps = {
  className?: string
  /** Match marketing site (ghost circle) vs dashboard header */
  variant?: "marketing" | "dashboard"
}

export function ThemeToggle({
  className,
  variant = "dashboard",
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  const toggle = () => {
    setTheme(isDark ? "light" : "dark")
  }

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          variant === "marketing"
            ? "h-8 w-8 rounded-full"
            : "h-10 w-10 rounded-full",
          className
        )}
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-4 w-4 opacity-0" />
      </Button>
    )
  }

  if (variant === "marketing") {
    return (
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "inline-flex rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white",
          className
        )}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      className={cn(
        "h-10 w-10 rounded-full text-[#64748B] transition-all hover:bg-[#2563EB]/5 hover:text-[#2563EB] dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
