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
    // กำหนดค่าเริ่มต้นเป็นโหมด "human" เพื่อให้เป็นหน้าหลัก
    const [viewMode, setViewMode] = useState<ViewMode>("human");

    const toggleViewMode = () => {
        setViewMode((prev) => (prev === "hacker" ? "human" : "hacker"));
    };

    const isHuman = viewMode === "human";

    return (
        <SettingsContext.Provider value={{ viewMode, toggleViewMode, isHuman }}>
            <div className={isHuman ? "human-mode font-sans text-white transition-all duration-500" : "hacker-mode font-mono text-[#00ff41] transition-all duration-500"}>
                {children}
            </div>
        </SettingsContext.Provider>
    );
};
