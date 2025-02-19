"use client"; // ✅ Ensure this runs only on the client

import React, { useState, useContext, useEffect, createContext } from "react";

export interface DarkModeContextType {
    isDarkMode: boolean;
    changeDarkMode(value: boolean): void;
}

const DarkModeContext = createContext<DarkModeContextType | null>(null);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setDarkMode] = useState<boolean>(true); // ✅ Default to dark mode

    useEffect(() => {
        // ✅ Only run on the client
        if (typeof window !== "undefined") {
            const storedDarkMode = localStorage.getItem("isDarkMode");
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            
            // ✅ If localStorage exists, use it; otherwise, use system preference
            const initialDarkMode = storedDarkMode !== null ? storedDarkMode === "true" : prefersDark;
            
            setDarkMode(initialDarkMode);
            document.body.classList.toggle("dark", initialDarkMode);
        }
    }, []);

    function changeDarkMode(value: boolean) {
        if (typeof window !== "undefined") {
            document.body.classList.toggle("dark", value);
            localStorage.setItem("isDarkMode", value.toString());
            setDarkMode(value);
        }
    }

    const contextValue: DarkModeContextType = {
        isDarkMode,
        changeDarkMode,
    };

    return (
        <DarkModeContext.Provider value={contextValue}>
            {children}
        </DarkModeContext.Provider>
    );
}

export const useDarkMode = (): DarkModeContextType => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error("useDarkMode must be used within a DarkModeProvider");
    }
    return context;
};
