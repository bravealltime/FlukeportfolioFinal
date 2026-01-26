"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useAudio } from "./AudioProvider";

const projects = [
    {
        title: "TeeRao - ระบบจัดการหอพัก",
        description: "เว็บแอปฯ จัดการหอพักครบวงจร คำนวณค่าน้ำ-ไฟอัตโนมัติ ออกบิล PDF และสร้าง QR PromptPay ได้ทันที ช่วยให้เจ้าของหอทำงานง่ายขึ้น 100%",
        tech: ["Next.js", "TypeScript", "Firebase", "Real-time DB"],
        link: "https://github.com/thara/raoteebaan",
        github: "https://github.com/thara/raoteebaan",
    },
    {
        title: "Heartopia Piano Bot Pro",
        description: "บอทเล่นดนตรีในเกมอัตโนมัติ อ่านโน้ตจากไฟล์ MIDI แม่นยำทุกคีย์ พร้อมระบบปรับคีย์เพลง (Auto-Transpose) ให้เพราะที่สุดโดยไม่ต้องตั้งค่าเอง",
        tech: ["Python", "Mido", "Automation", "Algorithm"],
        link: "https://github.com/thara/heartopia-piano",
        github: "https://github.com/thara/heartopia-piano",
    },
    {
        title: "Rolldice - RedM Script",
        description: "ระบบทอยเต๋า 3D สำหรับเกม RedM (RDR2 Roleplay) มี UI สวยงาม ซิงค์ผลลัพธ์เรียลไทม์ เพิ่มความสนุกสมจริงให้กับการเล่นบทบาทสมมติ",
        tech: ["Lua", "HTML/CSS", "JavaScript", "RedM API"],
        link: "https://github.com/thara/Rolldice",
        github: "https://github.com/thara/Rolldice",
    },
];

import { useSettings } from "./SettingsProvider";

/**
 * Component: Projects
 * แสดงผลผลงานที่ผ่านมา (Featured Projects)
 * รองรับการแสดงผล 2 โหมด: Human (การ์ดขาว) และ Hacker (Terminal Style)
 */
const Projects = () => {
    const { playPing } = useAudio();
    const { isHuman } = useSettings();

    return (
        <section id="projects" className="py-24 px-4 bg-transparent font-mono relative z-10">

            <div className="max-w-6xl mx-auto">
                <motion.div
                    // Animation: เลื่อนเข้ามาจากซ้ายเมื่อ Scroll ถึง
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center md:text-left"
                >
                    <h2 className={`text-3xl md:text-5xl font-bold mb-2 uppercase tracking-tighter ${isHuman ? "text-slate-900" : "text-[#00ff41]"}`}>
                        {isHuman ? "Featured Projects" : "[ // DATABASE_PROJECTS ]"}
                    </h2>
                    {!isHuman && <div className="h-1 w-32 bg-[#00ff41] border shadow-[0_0_10px_#00ff41]" />}
                    {isHuman && <div className="h-1 w-24 bg-blue-600 rounded-full mx-auto md:mx-0" />}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            onMouseEnter={() => !isHuman && playPing()}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`${isHuman
                                ? "bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-2xl p-6 transition-all"
                                : "bg-black border border-[#00ff4144] p-6 group relative overflow-hidden transition-all hover:border-[#00ff41] hover:shadow-[0_0_20px_#00ff4122]"
                                }`}
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`${isHuman ? "text-slate-400 font-sans font-bold text-sm" : "text-[#00ff41] opacity-50 text-xs"}`}>
                                        {isHuman ? `0${index + 1}` : `0${index + 1} // FILE.SYS`}
                                    </div>
                                    <div className="flex gap-4">
                                        <a href={project.github} className={`${isHuman ? "text-slate-400 hover:text-slate-900" : "text-[#00ff41] hover:glow-sm"} transition-all`}>
                                            <Github size={isHuman ? 20 : 18} />
                                        </a>
                                    </div>
                                </div>

                                <h3 className={`text-xl font-bold mb-4 uppercase ${isHuman ? "text-slate-800" : "text-[#00ff41]"}`}>
                                    {project.title}
                                </h3>
                                <p className={`text-xs mb-8 leading-relaxed h-16 overflow-hidden ${isHuman ? "text-slate-600 font-sans text-sm" : "text-[#00ff41bb]"}`}>
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {project.tech.map((t) => (
                                        <span
                                            key={t}
                                            className={`text-[10px] px-2 py-0.5 uppercase ${isHuman
                                                ? "bg-slate-100 text-slate-600 rounded-full font-sans font-semibold border-none"
                                                : "border border-[#00ff4133] text-[#00ff41cc]"
                                                }`}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <motion.a
                                    href={project.link}
                                    className={`inline-flex items-center gap-2 text-xs font-bold hover:underline ${isHuman ? "text-blue-600 font-sans text-sm" : "text-[#00ff41]"}`}
                                >
                                    {isHuman ? "View Project" : "[ ACCESS_RESOURCES ]"}
                                    <ExternalLink size={12} />
                                </motion.a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};


export default Projects;
