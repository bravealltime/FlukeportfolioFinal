"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Wifi } from "lucide-react";

const SystemStatus = () => {
    const [uptime, setUptime] = useState(0);
    const [time, setTime] = useState("");
    const [mounted, setMounted] = useState(false);

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
            className="fixed bottom-4 right-4 z-[10000] hidden lg:block font-mono"
        >
            <div className="bg-black/90 border border-[#00ff4144] p-4 text-[10px] space-y-2 hacker-border">
                <div className="flex items-center justify-between gap-8 border-b border-[#00ff4122] pb-1">
                    <span className="text-[#00ff4188]">IDENT::THARA</span>
                    <span className="text-[#00ff41]">V4.0.1</span>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span className="text-[#00ff4166]">UPTIME:</span>
                        <span className="text-[#00ff41]">{uptime}s</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#00ff4166]">LOCAL_TIME:</span>
                        <span className="text-[#00ff41]">{time}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#00ff4166]">LOCATION:</span>
                        <span className="text-[#00ff41]">LOCALHOST</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#00ff4166]">STATUS:</span>
                        <span className="text-[#00ff41] animate-pulse">COFFEE_POWERED</span>
                    </div>
                </div>

                <div className="flex gap-3 pt-2 text-[#00ff4188]">
                    <Activity size={12} />
                    <ShieldCheck size={12} />
                    <Wifi size={12} />
                </div>
            </div>
        </motion.div>
    );
};

export default SystemStatus;
