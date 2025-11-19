import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Theme } from "./themeDefinition";
import { ThemeContext } from "./themeDefinition";




const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
        // Check if the theme is already set on the document (from index.html script)
        const currentTheme = document.documentElement.getAttribute('data-theme') as Theme;
        if (currentTheme === 'light' || currentTheme === 'dark') {
            return currentTheme;
        }

        try {
            const storedPrefs = localStorage.getItem('theme')
            if (storedPrefs === 'light' || storedPrefs === 'dark') {
                return storedPrefs
            }
        } catch (e) {
            console.error('Could not access localStorage to get theme', e);
        }

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            return 'dark'
        }
    }
    return 'dark' // Default to dark
};

interface IThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: IThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)

        try {
            localStorage.setItem('theme', theme)
        } catch (e) {
            console.error('Could not save theme to localStorage', e);
        }
    }, [theme])

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
    }

    const value = useMemo(
        () => ({
            theme,
            toggleTheme,
        }),
        [theme]
    );
    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};