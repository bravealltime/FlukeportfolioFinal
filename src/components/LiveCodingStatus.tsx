"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Terminal } from "lucide-react";
import { useSettings } from "./SettingsProvider";

const LiveCodingStatus = () => {
    const { isHuman } = useSettings();
    const [isLive, setIsLive] = useState(false);
    const [currentFile, setCurrentFile] = useState("page.tsx");

    // Simulate Live Status (Randomly active)
    useEffect(() => {
        // Mock status check
        const checkStatus = () => {
            // Assume I'm coding 50% of the time directly for demo
            const coding = Math.random() > 0.3;
            setIsLive(coding);

            const files = ["page.tsx", "Navbar.tsx", "GravityFall.tsx", "Chatbot.tsx", "style.css"];
            setCurrentFile(files[Math.floor(Math.random() * files.length)]);
        };

        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {isLive && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`fixed top-24 right-6 z-40 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-md cursor-help ${isHuman
                            ? "bg-white/80 text-red-500 border border-red-100"
                            : "bg-black/80 text-[#ef4444] border border-[#ef4444]/50"
                        }`}
                    title="Thara is currently coding!"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <div className="flex flex-col leading-none">
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                            {isHuman ? "Live Coding" : "VSC_CONNECTION::ACTIVE"}
                        </span>
                        <span className="text-[8px] opacity-70 truncate max-w-[80px]">
                            {isHuman ? `Editing ${currentFile}` : `MOD::${currentFile}`}
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LiveCodingStatus;
