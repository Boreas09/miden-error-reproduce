import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme()

  const toggle = () => {
    // Only toggle between light and dark; keep explicit (not system)
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const isDark = false

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground capitalize">
        {resolvedTheme}
      </span>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        title={`Theme: ${theme}`}
        onClick={toggle}
        disabled
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}

export default ThemeToggle
