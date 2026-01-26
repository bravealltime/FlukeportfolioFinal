"use client";

import React, { useEffect, useState } from "react";
import { useSettings } from "./SettingsProvider";
import { motion, AnimatePresence } from "framer-motion";

const GlitchOverlay = () => {
    const { isHuman } = useSettings();
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Trigger animation immediately when isHuman changes
        const trigger = setTimeout(() => setIsActive(true), 0);
        // Reset after animation duration
        const timer = setTimeout(() => setIsActive(false), 2000);
        return () => {
            clearTimeout(trigger);
            clearTimeout(timer);
        };
    }, [isHuman]);

    return (
        <AnimatePresence>
            {isActive && (
                <div key={isHuman ? "human" : "hacker"} className="fixed inset-0 z-[999999] pointer-events-none flex flex-col">
                    {/* Top Shutter */}
                    <motion.div
                        initial={{ height: "50vh" }}
                        animate={{ height: 0 }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.85, 0, 0.15, 1] }} // EaseInOutExpo-ish
                        className="w-full bg-black relative z-50"
                    >
                        {/* Optional Scanline at bottom of shutter */}
                        <div className={`absolute bottom-0 w-full h-[1px] ${isHuman ? "bg-blue-500" : "bg-[#10b981]"} shadow-[0_0_20px_rgba(16,185,129,0.5)]`} />
                    </motion.div>

                    {/* Center Line (The Beam) */}
                    <motion.div
                        initial={{ scaleX: 0, opacity: 1 }}
                        animate={{ scaleX: 1, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", opacity: { delay: 0.4, duration: 0.1 } }}
                        className={`absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 z-[60] ${isHuman ? "bg-white box-shadow-[0_0_30px_white]" : "bg-[#10b981] shadow-[0_0_30px_#10b981]"
                            }`}
                    />

                    {/* Bottom Shutter */}
                    <motion.div
                        initial={{ height: "50vh" }}
                        animate={{ height: 0 }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.85, 0, 0.15, 1] }}
                        className="w-full bg-black mt-auto relative z-50"
                    >
                        {/* Optional Scanline at top of shutter */}
                        <div className={`absolute top-0 w-full h-[1px] ${isHuman ? "bg-blue-500" : "bg-[#10b981]"} shadow-[0_0_20px_rgba(16,185,129,0.5)]`} />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default GlitchOverlay;
