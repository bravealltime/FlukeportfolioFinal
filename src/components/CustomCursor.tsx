"use client";

import React, { useEffect, useState } from "react";
import { useSettings } from "./SettingsProvider";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
    const { isHuman } = useSettings();
    const [isVisible, setIsVisible] = useState(false);

    // Mouse Position State
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth Spring Animation for the trailing cursor
    const springConfig = { damping: 25, stiffness: 100 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Only enable custom cursor on desktop (non-touch) devices
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
            setIsVisible(false);
            return;
        }

        // Hide native cursor only when custom cursor is active
        document.documentElement.classList.add("custom-cursor-none");

        const moveMouse = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            setIsVisible(true);
        };

        const handleMouseDown = () => document.body.classList.add("cursor-clicking");
        const handleMouseUp = () => document.body.classList.remove("cursor-clicking");

        window.addEventListener("mousemove", moveMouse);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.documentElement.classList.remove("custom-cursor-none");
            window.removeEventListener("mousemove", moveMouse);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [mouseX, mouseY]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden">
            {/* Primary Cursor */}
            <motion.div
                className={`absolute top-0 left-0 flex items-center justify-center pointer-events-none ${isHuman
                    ? "w-4 h-4 bg-slate-800 rounded-full mix-blend-difference"
                    : "w-5 h-5 border border-[#10b981] bg-transparent"
                    }`}
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%"
                }}
            >
                {!isHuman && <div className="w-1 h-1 bg-[#10b981]" />}
            </motion.div>

            {/* Hacker Crosshair Lines */}
            {!isHuman && (
                <>
                    <motion.div
                        className="absolute top-0 w-[1px] h-screen bg-[#10b98144]"
                        style={{ x: mouseX }}
                    />
                    <motion.div
                        className="absolute left-0 w-screen h-[1px] bg-[#10b98144]"
                        style={{ y: mouseY }}
                    />

                    {/* Coordinates */}
                    <motion.div
                        className="absolute text-[#10b981] text-[10px] font-mono ml-4 mt-4"
                        style={{ x: mouseX, y: mouseY }}
                    >
                        TARGET_LOCKED
                    </motion.div>
                </>
            )}

            {/* Human mode trailing circle */}
            {isHuman && (
                <motion.div
                    className="absolute top-0 left-0 w-8 h-8 rounded-full border border-slate-400 opacity-50"
                    style={{
                        x: springX,
                        y: springY,
                        translateX: "-50%",
                        translateY: "-50%"
                    }}
                />
            )}
        </div>
    );
};

export default CustomCursor;
