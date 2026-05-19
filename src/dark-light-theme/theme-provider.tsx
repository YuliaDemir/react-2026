import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./theme-context";
import { useLocalStorage } from "@/utils/hooks/use-local-storage-hook";
import { LOCAL_STORAGE_THEME_KEY } from "@/constants";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [themeLS, setThemeLS] = useLocalStorage(LOCAL_STORAGE_THEME_KEY);
    const [theme, setTheme] = useState<Theme>(themeLS);

    const toggle = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        setThemeLS(theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    )
}