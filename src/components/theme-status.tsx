import { useTheme } from "@/components/theme-provider"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Monitor } from "lucide-react"

export function ThemeStatus() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [resolvedTheme, setResolvedTheme] = useState("light")

  useEffect(() => {
    setMounted(true)
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setResolvedTheme(systemTheme)
    } else {
      setResolvedTheme(theme)
    }
  }, [theme])

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