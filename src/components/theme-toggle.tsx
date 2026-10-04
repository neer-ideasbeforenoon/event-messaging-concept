"use client"

import { Moon, Sun } from "lucide-react"
import { useLayoutEffect } from "react"
import { Button } from "@/components/ui/button"

const KEY = "theme"

function chosenTheme() {
  const stored = localStorage.getItem(KEY)
  if (stored === "light" || stored === "dark") return stored
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark")
}

export function ThemeToggle() {
  useLayoutEffect(() => {
    applyTheme(chosenTheme())
  }, [])

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle color theme"
      onClick={() => {
        const next = document.documentElement.classList.contains("dark")
          ? "light"
          : "dark"
        localStorage.setItem(KEY, next)
        // The whole screen crossfades into the new theme (the root rule in
        // globals.css). Without the API, or with reduced motion, it switches.
        if (
          !document.startViewTransition ||
          matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          applyTheme(next)
          return
        }
        document.startViewTransition(() => applyTheme(next))
      }}
    >
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
    </Button>
  )
}
