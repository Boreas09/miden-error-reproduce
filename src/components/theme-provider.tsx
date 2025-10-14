import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type Theme = "light" | "dark" | "system"

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = "vite-ui-theme"

function applyDocumentClass(mode: "light" | "dark") {
  if (typeof document === "undefined") return
  const root = document.documentElement
  if (mode === "dark") root.classList.add("dark")
  else root.classList.remove("dark")
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Force light mode regardless of stored or requested theme
  const [theme, setThemeState] = useState<Theme>(() => "light")

  const resolvedTheme = useMemo(() => "light" as const, [])

  const setTheme = useCallback((_next: Theme) => {
    setThemeState("light")
    try {
      localStorage.setItem(STORAGE_KEY, "light")
    } catch {}
  }, [])

  useEffect(() => {
    applyDocumentClass("light")
  }, [])

  // No system listener because dark mode is disabled

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
