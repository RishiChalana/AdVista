"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "advista-theme",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
        const storedTheme = localStorage.getItem(storageKey) as Theme;
        return storedTheme || defaultTheme;
    } catch (e) {
        return defaultTheme;
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");

  const applyTheme = useCallback((themeToApply: Theme) => {
    let newResolvedTheme: "dark" | "light";
    const root = window.document.documentElement;

    if (themeToApply === "system") {
      newResolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      newResolvedTheme = themeToApply;
    }
    
    root.classList.remove("light", "dark");
    root.classList.add(newResolvedTheme);
    setResolvedTheme(newResolvedTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyTheme]);
  
  const handleSetTheme = (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (e) {
        // storage is disabled
      }
      setTheme(newTheme);
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme: handleSetTheme, resolvedTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
