import { useContext } from "react";
import { ThemeContext } from "./theme-context";

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw Error('useTheme must be used inside ThemeProvider');
    }

    return context;
}