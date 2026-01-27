"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Wifi } from "lucide-react";
import { useAudio } from "./AudioProvider";

const SystemStatus = () => {
    const [uptime, setUptime] = useState(0);
    const [time, setTime] = useState("");
    const [mounted, setMounted] = useState(false);
    const { playHover } = useAudio();

    useEffect(() => {
        setMounted(true);
        const start = Date.now();
        const timer = setInterval(() => {
            setUptime(Math.floor((Date.now() - start) / 1000));
            setTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted) return null;


    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed bottom-4 left-4 z-[10000] hidden lg:block font-mono"
            onMouseEnter={() => playHover()}
        >
            <div className="bg-[#0a0a0a]/90 border border-[#10b98144] p-4 text-[10px] space-y-2 hacker-border">
                <div className="flex items-center justify-between gap-8 border-b border-[#10b98122] pb-1">
                    <span className="text-[#10b98188]">IDENT::THARA</span>
                    <span className="text-[#10b981]">V4.0.1</span>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span className="text-[#10b98166]">UPTIME:</span>
                        <span className="text-[#10b981]">{uptime}s</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#10b98166]">LOCAL_TIME:</span>
                        <span className="text-[#10b981]">{time}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#10b98166]">LOCATION:</span>
                        <span className="text-[#10b981]">LOCALHOST</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#10b98166]">STATUS:</span>
                        <span className="text-[#10b981] animate-pulse">COFFEE_POWERED</span>
                    </div>
                </div>

                <div className="flex gap-3 pt-2 text-[#10b98188]">
                    <Activity size={12} />
                    <ShieldCheck size={12} />
                    <Wifi size={12} />
                </div>
            </div>
        </motion.div>
    );
};

export default SystemStatus;
