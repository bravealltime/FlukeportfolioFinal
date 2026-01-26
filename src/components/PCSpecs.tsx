"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAudio } from "./AudioProvider";
import { useSettings } from "./SettingsProvider";
import { Cpu, HardDrive, Monitor, Zap, Disc, Speaker } from "lucide-react";
import DecryptText from "./DecryptText";

const specs = [
    { icon: Cpu, label: "CPU", value: "Intel Core i9-14900K", desc: "24 Cores / 32 Threads @ 6.0 GHz" },
    { icon: Zap, label: "GPU", value: "NVIDIA RTX 4090", desc: "24GB GDDR6X" },
    { icon: HardDrive, label: "RAM", value: "64GB DDR5", desc: "Corsair Dominator Platinum 6000MHz" },
    { icon: Disc, label: "Storage", value: "2TB NVMe Gen5", desc: "Samsung 990 Pro x2" },
    { icon: Monitor, label: "Monitor", value: "OLED 4K 240Hz", desc: "Samsung Odyssey G9" },
    { icon: Speaker, label: "Audio", value: "DAC/Amp Stack", desc: "Sennheiser HD 800S" },
];

const PCSpecs = () => {
    const { isHuman } = useSettings();
    const { playHover, playKeyPress } = useAudio();

    return (
        <section className={`py-20 px-4 relative z-10 ${isHuman ? "bg-slate-50" : "bg-transparent"}`}>
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className={`text-3xl md:text-5xl font-bold mb-4 uppercase tracking-tighter ${isHuman ? "text-slate-900" : "text-[#00ff41]"}`}>
                        {isHuman ? "My Setup" : "[ SYSTEM_HARDWARE_DIAGNOSTICS ]"}
                    </h2>
                    {isHuman && <div className="h-1 w-24 bg-blue-600 rounded-full mx-auto" />}
                    {!isHuman && <div className="h-[1px] w-full max-w-md mx-auto bg-[#00ff4144]" />}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {specs.map((spec, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={!isHuman ? { scale: 1.05, borderColor: "#00ff41", boxShadow: "0 0 15px #00ff4144" } : { y: -5 }}
                            onMouseEnter={() => playHover()}
                            className={`p-6 rounded-xl transition-all ${isHuman
                                ? "bg-white shadow-lg border border-slate-100 hover:shadow-xl group"
                                : "bg-black/40 border border-[#00ff4122] backdrop-blur-sm group relative overflow-hidden"
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${isHuman ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors" : "bg-[#00ff4111] text-[#00ff41]"}`}>
                                    <spec.icon size={24} />
                                </div>
                                <div>
                                    <h3 className={`text-sm font-bold uppercase mb-1 ${isHuman ? "text-slate-500" : "text-[#00ff4188]"}`}>
                                        {spec.label}
                                    </h3>
                                    <p className={`font-bold text-lg mb-1 ${isHuman ? "text-slate-800" : "text-[#00ff41]"}`}>
                                        {isHuman ? spec.value : <DecryptText text={spec.value} />}
                                    </p>
                                    <p className={`text-xs ${isHuman ? "text-slate-500" : "text-[#00ff4166]"}`}>
                                        {spec.desc}
                                    </p>
                                </div>
                            </div>

                            {!isHuman && (
                                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <div className="w-2 h-2 bg-[#00ff41] animate-pulse rounded-full" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PCSpecs;
