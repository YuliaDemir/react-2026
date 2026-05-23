import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./theme-context";
import { useLocalStorage } from "@/utils/hooks/use-local-storage-hook";
import { LOCAL_STORAGE_THEME_KEY } from "@/constants";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [themeLS, setThemeLS] = useLocalStorage(LOCAL_STORAGE_THEME_KEY);
    const [theme, setTheme] = useState<Theme>(themeLS);

    const toggle = useCallback(() => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        setThemeLS(theme);
    }, [theme, setThemeLS]);

    const value = useMemo<{ theme: Theme; toggle: () => void }>(() => ({ theme, toggle }), [theme, toggle]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}