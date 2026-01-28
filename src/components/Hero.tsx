"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

import { useAudio } from "./AudioProvider";
import DecryptText from "./DecryptText";
import { useSettings } from "./SettingsProvider";
import { ArrowRight, Mail } from "lucide-react";

/**
 * Component: Hero
 * หน้าจอแนะนำตัวส่วนแรกของเว็บไซต์ (First Impression)
 * มี 2 โหมด: Human (คลีน) และ Hacker (ดิบ)
 */
const Hero = () => {
    const { playPing, playKeyPress, playHover } = useAudio();
    const { isHuman } = useSettings();
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    // กำหนด Animation Variants สำหรับ Container หลัก
    // visible: แสดงผลแบบไล่ลำดับ (Stagger) ทีละ 0.1 วินาที
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05, // Faster stagger for better TBT
            },
        },
    };

    // กำหนด Animation Variants สำหรับ items ภายใน
    // ปรับการเคลื่อนไหวตามโหมด (Human: ขึ้นจากล่าง, Hacker: มาจากซ้าย)
    const itemVariants: Variants = {
        hidden: { x: isHuman ? 0 : -20, y: isHuman ? 20 : 0, opacity: 0 },
        visible: {
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    // ตรวจสอบว่าเป็นโหมด Human (คนปกติ) หรือไม่
    // ถ้าใช่ จะแสดงผลหน้าเว็บแบบ Modern Minimalist (สีขาว คลีน)
    if (isHuman) {
        return (
            <section id="hero" className="min-h-screen flex flex-col items-center justify-center pt-24 px-6 md:px-24 relative overflow-hidden font-sans text-center">
                <motion.div
                    variants={containerVariants}
                    initial="visible" // Force visible immediately to prevent blank screen
                    animate="visible"
                    className="max-w-3xl relative z-10" // เพิ่ม z-10 เพื่อให้เนื้อหาลอยเหนือพื้นหลัง
                >
                    {/* Profile Image - Human Mode */}
                    <motion.div
                        variants={itemVariants}
                        className="mb-8 relative"
                    >
                        <div className="w-32 h-32 md:w-44 md:h-44 mx-auto relative cursor-pointer group">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500" />
                            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl transition-transform duration-500 group-hover:scale-105">
                                <img
                                    src="/profile.jpg"
                                    alt="Tharanas Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* ปรับข้อความให้น่าสนใจ เป็นกันเอง */}
                    <motion.div variants={itemVariants} className="mb-6 inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                        คนรักคอมพิวเตอร์และเทคโนโลยี 💻
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                        Tharanas <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Hiransrettawat</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        ยินดีที่ได้รู้จักครับ! ผมเป็นคนที่คลั่งไคล้ในเทคโนโลยีมากครับ
                        โดยเฉพาะการประกอบคอมพิวเตอร์และเจาะลึกเรื่องฮาร์ดแวร์ ผมชอบอัปเดตความรู้ใหม่ๆ อยู่เสมอ
                        เพื่อให้ทันโลกไอทีที่หมุนไวแบบทุกวันนี้ครับ
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#projects"
                            onMouseEnter={() => playHover()}
                            onClick={playKeyPress}
                            className="px-8 py-4 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 cursor-pointer"
                            aria-label="ดูผลงานของฉัน"
                        >
                            ดูผลงาน <ArrowRight size={18} />
                        </a>
                        <a
                            href="/resume-thara-official.txt"
                            target="_blank"
                            onMouseEnter={() => playHover()}
                            onClick={playKeyPress}
                            className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            aria-label="ดาวน์โหลด CV"
                        >
                            ดาวน์โหลด CV <Mail size={18} />
                        </a>
                    </motion.div>
                </motion.div>
            </section>
        )
    }

    // ถ้าไม่ใช่โหมด Human จะแสดงผลแบบ Hacker (Terminal Style)
    return (
        <section
            id="hero"
            className="min-h-screen flex flex-col items-start justify-center pt-24 px-6 md:px-24 relative overflow-hidden font-mono"
        >
            {/* Decorative background circle - วงกลมตกแต่งสำหรับโหมด Hacker */}
            {isMounted && !isHuman && (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -right-20 md:right-10 top-20 md:top-40 w-64 md:w-96 h-64 md:h-96 border border-[#10b98111] rounded-full pointer-events-none hidden sm:block"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#10b98108] rounded-full" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#10b98108] rounded-full" />
                </motion.div>
            )}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-6xl relative z-10 flex flex-col md:flex-row items-center gap-12"
            >
                {/* Profile Image - Hacker Mode */}
                <motion.div
                    variants={itemVariants}
                    className="relative group shrink-0"
                >
                    <div className="w-48 h-48 md:w-64 md:h-64 relative hacker-border overflow-hidden bg-black">
                        {/* Scanline Effect Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10" />

                        <img
                            src="/profile.jpg"
                            alt="Tharanas Profile"
                            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-110 group-hover:scale-100"
                        />

                        {/* Glitch Overlay Elements */}
                        <div className="absolute inset-0 bg-[#10b98122] opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none mix-blend-overlay" />
                    </div>
                    {/* Decorative Corner Brackets */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#10b981]" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#10b981]" />
                </motion.div>

                <div className="flex-1">
                    <motion.p
                        variants={itemVariants}
                        className="text-[#10b981] mb-2 text-xs md:text-base opacity-70 flex items-center gap-2"
                    >
                        <span className="w-8 h-[1px] bg-[#10b98144]" />
                        <DecryptText text="กำลังเริ่มระบบ... เรียบร้อย" />
                    </motion.p>

                    <motion.h1
                        variants={itemVariants}
                        className="text-3xl sm:text-4xl md:text-7xl font-bold mb-6 tracking-tighter text-[#10b981] leading-[1.1]"
                    >
                        &lt;<DecryptText text="เข้าสู่ระบบ_สำเร็จ" /> /&gt; <br />
                        <span className="text-white bg-[#10b981] px-2 inline-block mt-2">
                            ผู้ใช้::<DecryptText text="ธรณัส_ฮ" delay={500} />
                        </span>
                    </motion.h1>

                    <motion.div
                        variants={itemVariants}
                        className="bg-[#0a0a0a]/40 border border-[#10b981] p-4 md:p-6 mb-10 h-36 md:h-40 overflow-hidden relative backdrop-blur-md hacker-border"
                    >
                        <motion.p
                            animate={{ opacity: [1, 0.8, 1] }}
                            transition={{ repeat: Infinity, duration: 0.1 }}
                            className="text-[#10b981] text-[10px] md:text-sm leading-relaxed"
                        >
                            กระบวนการ_ตรวจสอบ: เริ่มต้น PORTFOLIO_V4.2 <br />
                            เป้าหมาย: ธรณัส หิรัญเศรษฐวัฒน์ <br />
                            ความสนใจ: [ประกอบคอมฯ, ฮาร์ดแวร์, ข่าวไอที, แกดเจ็ตล่าสุด] <br />
                            ภารกิจ: &quot;<DecryptText text="ตามติดเทรนด์โลกไอที และมีความสุขกับการประกอบคอม" delay={800} />&quot; <br />
                            สถานะ: <span className="text-[#10b981] font-bold animate-pulse">ออนไลน์_กำลังอัปเดต...</span>
                        </motion.p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                            onMouseEnter={playPing}
                            onClick={playKeyPress}
                            whileHover={{ scale: 1.02, backgroundColor: "#10b981", color: "#000" }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-3 bg-[#10b98111] border border-[#10b981] text-[#10b981] font-bold text-xs md:text-sm uppercase transition-all flex items-center justify-center gap-2"
                            aria-label="เรียกใช้::ดูผลงาน"
                        >
                            [ สั่งรัน::ดูผลงาน ]
                        </motion.button>
                        <motion.button
                            onMouseEnter={playPing}
                            onClick={() => window.open('/resume-thara-hacker.txt', '_blank')}
                            whileHover={{ scale: 1.02, backgroundColor: "#10b98133" }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-3 border border-[#10b98155] text-[#10b981bb] font-bold text-xs md:text-sm uppercase transition-all flex items-center justify-center gap-2"
                            aria-label="ดาวน์โหลดข้อมูลส่วนตัว"
                        >
                            [ ดาวน์โหลด::ประวัติส่วนตัว ]
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
