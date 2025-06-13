"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useThemeEffect() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [themeChanged, setThemeChanged] = useState(false)

  // Make sure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Track theme changes
  useEffect(() => {
    if (mounted) {
      setThemeChanged(true)
      const timer = setTimeout(() => setThemeChanged(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [theme, mounted])

  return { themeChanged, mounted, theme }
}