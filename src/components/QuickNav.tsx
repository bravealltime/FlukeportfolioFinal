"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, FolderOpen, Terminal, Cpu, Mail, Menu, X, Music } from "lucide-react";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";

const QuickNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isHuman } = useSettings();
    const { playPing, toggleMusic, isMusicEnabled } = useAudio();

    const items = [
        { icon: Home, label: "Home", href: "#hero" },
        { icon: FolderOpen, label: "Projects", href: "#projects" },
        { icon: Terminal, label: "Terminal", href: "#terminal" },
        { icon: Cpu, label: "Skills", href: "#skills" },
        { icon: Mail, label: "Contact", href: "#contact" },
    ];

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        playPing();
    };

    return (
        <div className="fixed bottom-8 right-8 z-[5000] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <div className="mb-4 flex flex-col items-end space-y-3">
                        {/* Music Toggle Specific for QuickNav */}
                        <motion.button
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ delay: 0.05 }}
                            onClick={() => {
                                toggleMusic();
                                playPing();
                            }}
                            className={`p-3 rounded-full shadow-lg backdrop-blur-md flex items-center gap-3 group ${isHuman
                                    ? "bg-white text-slate-700 hover:bg-slate-100"
                                    : "bg-black/90 text-[#10b981] border border-[#10b981]"
                                }`}
                        >
                            <span className={`text-xs font-bold ${isHuman ? "text-slate-500" : "text-[#10b981]"}`}>
                                {isMusicEnabled ? "MUTE BGM" : "PLAY BGM"}
                            </span>
                            <Music size={20} className={isMusicEnabled ? "animate-pulse" : "opacity-50"} />
                        </motion.button>

                        {items.map((item, index) => (
                            <motion.a
                                key={index}
                                href={item.href}
                                onClick={() => {
                                    setIsOpen(false);
                                    playPing();
                                }}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                transition={{ delay: index * 0.05 + 0.1 }}
                                className={`p-3 rounded-full shadow-lg backdrop-blur-md flex items-center gap-3 group ${isHuman
                                        ? "bg-white text-slate-700 hover:bg-slate-100"
                                        : "bg-black/90 text-[#10b981] border border-[#10b981] hover:shadow-[0_0_15px_#10b981]"
                                    }`}
                                whileHover={{ scale: 1.05 }}
                            >
                                <span className={`text-xs font-bold transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"} ${isHuman ? "text-slate-500" : "text-[#10b981]"
                                    }`}>
                                    {item.label}
                                </span>
                                <item.icon size={20} />
                            </motion.a>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={toggleOpen}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className={`p-4 rounded-full shadow-2xl transition-all ${isHuman
                        ? "bg-slate-900 text-white hover:bg-black"
                        : "bg-[#10b981] text-black shadow-[0_0_20px_#10b981]"
                    }`}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
        </div>
    );
};

export default QuickNav;
