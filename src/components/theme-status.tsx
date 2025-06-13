"use client"

import { useThemeWithStorage } from "@/hooks/use-theme-with-storage"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Monitor } from "lucide-react"

export function ThemeStatus() {
  const { mounted, resolvedTheme, theme } = useThemeWithStorage()

  if (!mounted) return null

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="flex items-center gap-1.5">
        {theme === "system" ? (
          <>
            <Monitor className="h-3.5 w-3.5" />
            <span>System</span>
            <span className="text-muted-foreground">({resolvedTheme})</span>
          </>
        ) : resolvedTheme === "dark" ? (
          <>
            <Moon className="h-3.5 w-3.5" />
            <span>Dark</span>
          </>
        ) : (
          <>
            <Sun className="h-3.5 w-3.5" />
            <span>Light</span>
          </>
        )}
      </Badge>
    </div>
  )
}