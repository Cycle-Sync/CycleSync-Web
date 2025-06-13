"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useThemeWithStorage() {
  const { theme, setTheme, resolvedTheme, themes } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [themeChanged, setThemeChanged] = useState(false)
  const [previousTheme, setPreviousTheme] = useState<string | null>(null)

  // Make sure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Track theme changes
  useEffect(() => {
    if (mounted && theme !== previousTheme && previousTheme !== null) {
      setThemeChanged(true)
      const timer = setTimeout(() => setThemeChanged(false), 1000)
      return () => clearTimeout(timer)
    }
    setPreviousTheme(theme || null)
  }, [theme, mounted, previousTheme])

  // Function to toggle between light and dark
  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return {
    theme,
    setTheme,
    resolvedTheme,
    mounted,
    themeChanged,
    toggleTheme,
    availableThemes: themes,
  }
}