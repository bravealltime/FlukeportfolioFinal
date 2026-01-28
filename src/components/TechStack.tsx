"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";
import {
    Layers,
    Cpu,
    Box,
    Zap,
    Database,
    Flame,
    Sparkles,
    Code2,
    Monitor,
    ShieldCheck
} from "lucide-react";
import DecryptText from "./DecryptText";

const TechStack = () => {
    const { isHuman } = useSettings();
    const { playHover } = useAudio();

    const stats = [
        { label: isHuman ? "ภาษาหลัก" : "PRIMARY_LANG", value: "TypeScript", icon: Code2, color: "text-blue-500" },
        { label: isHuman ? "เฟรมเวิร์ค" : "FRAMEWORK", value: "Next.js 15", icon: Layers, color: "text-slate-900" },
        { label: isHuman ? "ไลบรารีทั้งหมด" : "TOTAL_LIBS", value: "10+", icon: Box, color: "text-purple-500" },
        { label: isHuman ? "คอมโพเนนต์" : "COMPONENTS", value: "40+", icon: Cpu, color: "text-orange-500" },
    ];

    const libraries = [
        { name: "React 19", desc: "Core UI Library", category: "Framework" },
        { name: "Tailwind CSS 4", desc: "Styling Engine", category: "Style" },
        { name: "Framer Motion", desc: "Animation System", category: "Animation" },
        { name: "Firebase", desc: "Database & Backend", category: "Infrastructure" },
        { name: "TensorFlow.js", desc: "Machine Learning (AI Doodle)", category: "AI" },
        { name: "Lucide React", desc: "Vector Icons", category: "UI" },
        { name: "Matter.js", desc: "Physics Engine (Gravity)", category: "Physics" },
        { name: "EmailJS", desc: "Mail Protocol", category: "Comm" },
    ];

    return (
        <section className={`py-24 px-4 relative z-10 ${isHuman ? "bg-white" : "bg-black/20 font-mono"}`}>
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className={`text-3xl md:text-5xl font-bold mb-4 uppercase tracking-tighter ${isHuman ? "text-slate-900" : "text-[#10b981]"}`}>
                        {isHuman ? "เทคโนโลยีที่ใช้สร้างเว็บบอร์ดนี้" : "[ // การวิเคราะห์_สถาปัตยกรรม_ระบบ ]"}
                    </h2>
                    <p className={`text-sm max-w-2xl mx-auto ${isHuman ? "text-slate-500" : "text-[#10b98188]"}`}>
                        {isHuman
                            ? "เบื้องหลังพอร์ตโฟลิโอนี้คือการผสมผสานเทคโนโลยีเว็บสมัยใหม่ เพื่อให้ได้ประสบการณ์ที่ลื่นไหลและโต้ตอบได้จริง"
                            : "กำลังตรวจสอบโมดูลระบบ... ความสมบูรณ์ของข้อมูล: 100% | ตรวจพบสแต็กเทคโนโลยีที่ทันสมัย."}
                    </p>
                    {isHuman && <div className="h-1 w-24 bg-blue-600 rounded-full mx-auto mt-4" />}
                </motion.div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-6 rounded-2xl border ${isHuman
                                ? "bg-slate-50 border-slate-100 shadow-sm"
                                : "bg-[#0a0a0a] border-[#10b98144] text-[#10b981]"
                                }`}
                        >
                            <stat.icon size={24} className={`mb-3 ${isHuman ? stat.color : "text-[#10b981]"}`} />
                            <div className={`text-xs uppercase font-bold opacity-60 mb-1`}>{stat.label}</div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Detailed Spec Area */}
                <div className={`rounded-3xl overflow-hidden border ${isHuman
                    ? "bg-white border-slate-200 shadow-2xl"
                    : "bg-[#0a0a0a]/80 border-[#10b981] shadow-[0_0_30px_#10b98122]"
                    }`}>
                    <div className={`p-6 border-b flex items-center justify-between ${isHuman ? "bg-slate-50 border-slate-200" : "bg-[#10b98111] border-[#10b98144]"}`}>
                        <div className="flex items-center gap-3">
                            <Box size={20} className={isHuman ? "text-blue-600" : "text-[#10b981]"} />
                            <span className="font-bold uppercase tracking-wider">
                                {isHuman ? "รายการคลังไลบรารี (Libraries)" : "บัญชี_รายการ_โมดูล_ภายนอก"}
                            </span>
                        </div>
                        <div className={`text-[10px] font-mono px-2 py-1 rounded border animate-pulse ${isHuman ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-[#10b98122] text-[#10b981] border-[#10b98144]"}`}>
                            SYSTEM_STABLE
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-collapse overflow-hidden">
                        {libraries.map((lib, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ backgroundColor: isHuman ? "rgba(241, 245, 249, 1)" : "rgba(16, 185, 129, 0.05)" }}
                                onMouseEnter={() => playHover()}
                                className={`p-6 transition-colors ${isHuman ? "border-slate-100" : "border-[#10b98122]"}`}
                            >
                                <div className={`text-[10px] font-bold mb-2 uppercase opacity-50`}>{lib.category}</div>
                                <h3 className={`font-bold mb-1 ${isHuman ? "text-slate-900" : "text-[#10b981]"}`}>
                                    {isHuman ? lib.name : <DecryptText text={lib.name} />}
                                </h3>
                                <p className={`text-xs ${isHuman ? "text-slate-500" : "text-[#10b98188]"}`}>{lib.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Architecture Diagram Placeholder / Extra Info */}
                    <div className={`p-8 border-t ${isHuman ? "bg-slate-50 border-slate-200" : "bg-[#0a0a0a] border-[#10b98144]"}`}>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <h4 className={`font-bold mb-2 flex items-center gap-2 ${isHuman ? "text-slate-800" : "text-[#10b981]"}`}>
                                    <ShieldCheck size={18} />
                                    {isHuman ? "สถาปัตยกรรมระดับสูง" : "การ_กำหนด_สถาปัตยกรรม_ขั้นสูง"}
                                </h4>
                                <ul className={`text-xs space-y-2 ${isHuman ? "text-slate-600" : "text-[#10b981aa]"}`}>
                                    <li className="flex items-center gap-2">
                                        <Zap size={12} className="text-orange-400" />
                                        {isHuman ? "ใช้ Next.js 15 App Router เพื่อประสิทธิการโหลดหน้าเว็บสูงสุด" : "เพิ่มประสิทธิภาพ_UPLINK: ใช้ NEXT.JS APP_ROUTER V15"}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Sparkles size={12} className="text-blue-400" />
                                        {isHuman ? "Interactive UI พัฒนาด้วย React Server Components และ Client Components" : "การ_โต้ตอบ: ผสมผสาน RSC & CLIENT_SIDE_RENDER"}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Flame size={12} className="text-red-400" />
                                        {isHuman ? "Data Persistence ผ่าน Google Firebase Real-time Database" : "การ_เก็บ_ข้อมูล: บูรณาการ FIREBASE_DATABASE"}
                                    </li>
                                </ul>
                            </div>
                            <div className={`hidden md:block w-[1px] h-32 ${isHuman ? "bg-slate-200" : "bg-[#10b98122]"}`} />
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-block p-4 rounded-xl border border-dashed border-slate-300 dark:border-[#10b98144] opacity-70">
                                    <Monitor size={32} className="mb-2 mx-auto md:mx-0 opacity-50" />
                                    <p className="text-[10px] font-mono whitespace-pre italic">
                                        {`// SYSTEMSUMMARY.CONFIG\nVERSION: 1.0.4\nRESPONSIVE: ENABLED\nSSR: ACTIVE\nEDGE_FUNCTIONS: 2`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechStack;
