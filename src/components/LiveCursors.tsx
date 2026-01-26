"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MousePointer2 } from "lucide-react";
import { useSettings } from "./SettingsProvider";

// Simulated user data
const BOTS = [
    { id: 1, name: "Visitor_USA", color: "#FF5733" },
    { id: 2, name: "Recruiter_Google", color: "#33FF57" },
    { id: 3, name: "Dev_Tokyo", color: "#3357FF" },
];

const LiveCursors = () => {
    const { isHuman } = useSettings();
    const [cursors, setCursors] = useState<{ id: number, x: number, y: number }[]>(
        BOTS.map(b => ({ id: b.id, x: Math.random() * 1000, y: Math.random() * 1000 }))
    );
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const interval = setInterval(() => {
            setCursors(prev => prev.map(c => ({
                id: c.id,
                x: c.x + (Math.random() - 0.5) * 200, // Move randomly
                y: c.y + (Math.random() - 0.5) * 200,
            })));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    if (!isClient) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[50] overflow-visible">
            {cursors.map((cursor, index) => (
                <motion.div
                    key={cursor.id}
                    animate={{ x: cursor.x, y: cursor.y }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute top-0 left-0 flex flex-col items-start"
                >
                    <MousePointer2
                        size={isHuman ? 16 : 14}
                        className={`transform -rotate-12 ${isHuman ? "text-black drop-shadow-md" : "text-[#10b981]"}`}
                        fill={isHuman ? BOTS[index].color : "#10b981"}
                    />
                    <div className={`text-[10px] px-1 rounded ml-4 -mt-2 whitespace-nowrap ${isHuman
                            ? "bg-black/80 text-white font-sans"
                            : "bg-[#10b981] text-black font-mono border border-[#10b981]"
                        }`}>
                        {BOTS[index].name}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default LiveCursors;
