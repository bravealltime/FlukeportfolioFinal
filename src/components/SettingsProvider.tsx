"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ViewMode = "hacker" | "human";

interface SettingsContextType {
    viewMode: ViewMode;
    toggleViewMode: () => void;
    isHuman: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useSettings must be used within SettingsProvider");
    return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Default to human, but will be overwritten by effect
    const [viewMode, setViewMode] = useState<ViewMode>("human");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load preference
        const savedMode = localStorage.getItem("viewMode") as ViewMode;
        if (savedMode) {
            setViewMode(savedMode);
        }
    }, []);

    const toggleViewMode = () => {
        const newMode = viewMode === "hacker" ? "human" : "hacker";
        setViewMode(newMode);
        localStorage.setItem("viewMode", newMode);
    };

    const isHuman = viewMode === "human";

    if (!mounted) return <div className="bg-white" />; // Prevent hydration mismatch flash

    return (
        <SettingsContext.Provider value={{ viewMode, toggleViewMode, isHuman }}>
            <div className={isHuman ? "human-mode font-sans text-white transition-all duration-500" : "hacker-mode font-mono text-[#10b981] transition-all duration-500"}>
                {children}
            </div>
        </SettingsContext.Provider>
    );
};
