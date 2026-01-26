"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useSettings } from "./SettingsProvider";

const ScrollProgress = () => {
    const { isHuman } = useSettings();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [percent, setPercent] = useState(0);

    useEffect(() => {
        return scrollYProgress.on("change", (latest) => {
            setPercent(Math.round(latest * 100));
        });
    }, [scrollYProgress]);

    return (
        <>
            {/* Human Mode: Simple Top Bar */}
            {isHuman && (
                <motion.div
                    className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[9999]"
                    style={{ scaleX }}
                />
            )}

            {/* Hacker Mode: Vertical Binary Bar */}
            {!isHuman && (
                <div className="fixed right-0 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-1 z-[9999] bg-[#0a0a0a]/50 p-1 border-l border-[#10b981]">
                    <div className="text-[#10b981] text-[10px] font-mono mb-2 text-center">
                        SCRL<br />{percent}%
                    </div>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-1 h-1 transition-colors ${percent >= (i / 20) * 100 ? "bg-[#10b981]" : "bg-[#064e3b]"
                                }`}
                        />
                    ))}
                    <div className="text-[8px] text-[#10b981] font-mono mt-2 opacity-50 text-center">
                        0x{percent.toString(16).toUpperCase()}
                    </div>
                </div>
            )}
        </>
    );
};

export default ScrollProgress;
