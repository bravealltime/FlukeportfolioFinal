"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useAudio } from "./AudioProvider";
import dynamic from "next/dynamic";

const PasswordVault = dynamic(() => import("./PasswordVault"), { ssr: false });
const SecretProjectModal = dynamic(() => import("./SecretProjectModal"), { ssr: false });
const ProjectCaseStudy = dynamic(() => import("./ProjectCaseStudy"), { ssr: false });
const DoodleGame = dynamic(() => import("./DoodleGame"), { ssr: false });

import { Lock, BookOpen } from "lucide-react";

interface Project {
    title: string;
    description: string;
    tech: string[];
    link: string;
    github: string;
    image?: string;
}

const projects = [
    {
        title: "TeeRao - ระบบจัดการหอพัก",
        description: "เว็บแอปฯ จัดการหอพักครบวงจร คำนวณค่าน้ำ-ไฟอัตโนมัติ ออกบิล PDF และสร้าง QR PromptPay ได้ทันที ช่วยให้เจ้าของหอทำงานง่ายขึ้น 100%",
        tech: ["Next.js", "TypeScript", "Firebase", "Real-time DB"],
        link: "https://teerao.vercel.app/",
        github: "https://github.com/bravealltime/raoteebaan",
        image: "/projects/teerao.png",
    },
    {
        title: "Heartopia Piano Bot Pro",
        description: "บอทเล่นดนตรีในเกมอัตโนมัติ อ่านโน้ตจากไฟล์ MIDI แม่นยำทุกคีย์ พร้อมระบบปรับคีย์เพลง (Auto-Transpose) ให้เพราะที่สุดโดยไม่ต้องตั้งค่าเอง",
        tech: ["Python", "Mido", "Automation", "Algorithm"],
        link: "https://github.com/bravealltime/heartopia-piano",
        github: "https://github.com/bravealltime/heartopia-piano",
        image: "/projects/heartopia.png",
    },
    {
        title: "Rolldice - RedM Script",
        description: "ระบบทอยเต๋า 3D สำหรับเกม RedM (RDR2 Roleplay) มี UI สวยงาม ซิงค์ผลลัพธ์เรียลไทม์ เพิ่มความสนุกสมจริงให้กับการเล่นบทบาทสมมติ",
        tech: ["Lua", "HTML/CSS", "JavaScript", "RedM API"],
        link: "https://github.com/bravealltime/Rolldice",
        github: "https://github.com/bravealltime/Rolldice",
        image: "/projects/rolldice.jpg",
    },
    {
        title: "JokPed v3 (BTFT)",
        description: "บอทช่วยเหลือการเล่นเกม (FiveM/RedM) ที่มาพร้อมระบบ OCR ตรวจจับข้อความเรียลไทม์, ควบคุมผ่าน Discord และระบบ Live Stream ในตัว",
        tech: ["Python", "OpenCV", "Tesseract OCR", "Discord.py"],
        link: "https://github.com/bravealltime/BTFT-Bot",
        github: "https://github.com/bravealltime/BTFT-Bot",
        image: "/projects/jokped.png",
    },
];

import { useSettings } from "./SettingsProvider";

/**
 * Component: Projects
 * แสดงผลผลงานที่ผ่านมา (Featured Projects)
 * รองรับการแสดงผล 2 โหมด: Human (การ์ดขาว) และ Hacker (Terminal Style)
 */
import TypewriterText from "./TypewriterText";
import { Trophy } from "lucide-react";

const Projects = () => {
    const { playPing } = useAudio();
    const { isHuman } = useSettings();
    const [isVaultOpen, setIsVaultOpen] = React.useState(false);
    const [isProjectUnlocked, setIsProjectUnlocked] = React.useState(false);
    const [isDoodleOpen, setIsDoodleOpen] = React.useState(false);
    const [selectedStudy, setSelectedStudy] = React.useState<Project | null>(null);

    const handleSecretClick = () => {
        setIsVaultOpen(true);
        playPing();
    };

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
                    <TypewriterText
                        as="h2"
                        text={isHuman ? "ผลงานที่โดดเด่น" : "[ // ฐานข้อมูล_โปรเจกต์ ]"}
                        className={`text-3xl md:text-5xl font-bold mb-2 uppercase tracking-tighter ${isHuman ? "text-slate-900" : "text-[#10b981]"}`}
                    />
                    {!isHuman && <div className="h-1 w-32 bg-[#10b981] border shadow-[0_0_10px_#10b981]" />}
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
                                ? "bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-2xl overflow-hidden transition-all"
                                : "bg-[#0a0a0a] border border-[#10b98144] group relative overflow-hidden transition-all hover:border-[#10b981] hover:shadow-[0_0_20px_#10b98122]"
                                } flex flex-col`}
                        >
                            {/* Project Preview Image */}
                            <div className="relative aspect-video overflow-hidden border-b border-inherit">
                                {project.image ? (
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        loading="lazy"
                                        className={`w-full h-full object-cover transition-all duration-500 ${isHuman
                                            ? "group-hover:scale-110"
                                            : "grayscale group-hover:grayscale-0 group-hover:scale-105 opacity-60 group-hover:opacity-100"
                                            }`}
                                        onError={(e) => {
                                            // Fallback for missing images
                                            e.currentTarget.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop";
                                        }}
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center ${isHuman ? "bg-slate-100" : "bg-[#10b98105]"}`}>
                                        <Trophy size={40} className={isHuman ? "text-slate-200" : "text-[#10b98122]"} />
                                    </div>
                                )}

                                {/* Hacker Overlay */}
                                {!isHuman && (
                                    <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px]" />
                                )}
                            </div>

                            <div className="p-5 flex flex-col flex-1 h-full relative z-10">
                                <div className="flex justify-between items-center mb-3">
                                    <div className={`${isHuman ? "text-slate-500 font-sans font-bold text-xs" : "text-[#10b981] opacity-70 text-[10px]"}`}>
                                        {isHuman ? `PROJECT 0${index + 1}` : `0${index + 1} // SYS.LOG`}
                                    </div>
                                    <div className="flex gap-3">
                                        <a
                                            href={project.github}
                                            className={`${isHuman ? "text-slate-400 hover:text-slate-900" : "text-[#10b981] hover:text-white hover:glow-sm"} transition-all`}
                                            aria-label={`GitHub: ${project.title}`}
                                        >
                                            <Github size={isHuman ? 18 : 16} />
                                        </a>
                                    </div>
                                </div>

                                <h3 className={`text-lg md:text-xl font-bold mb-2 uppercase tracking-tight ${isHuman ? "text-slate-800" : "text-[#10b981]"}`}>
                                    {project.title}
                                </h3>

                                <p className={`text-xs mb-4 leading-relaxed line-clamp-3 ${isHuman ? "text-slate-600 font-sans" : "text-[#10b981bb]"}`}>
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tech.map((t) => (
                                        <span
                                            key={t}
                                            className={`text-[10px] px-2 py-1 uppercase tracking-wide ${isHuman
                                                ? "bg-slate-100 text-slate-600 rounded-md font-sans font-bold mix-blend-multiply"
                                                : "border border-[#10b98133] text-[#10b981cc] bg-[#10b98105]"
                                                }`}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* Footer Actions - Pushed to bottom */}
                                <div className="mt-auto flex items-center gap-4 pt-4 border-t border-inherit border-opacity-10">
                                    <motion.a
                                        href={project.link}
                                        whileHover={{ x: 2 }}
                                        className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${isHuman ? "text-blue-600 hover:text-blue-700 font-sans" : "text-[#10b981] hover:text-white"}`}
                                    >
                                        {isHuman ? "เข้าชมเว็บ" : "[ RUN ]"}
                                        <ExternalLink size={11} />
                                    </motion.a>

                                    <button
                                        onClick={() => setSelectedStudy(project)}
                                        className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${isHuman ? "text-slate-500 hover:text-slate-900" : "text-[#10b981aa] hover:text-[#10b981]"}`}
                                    >
                                        <BookOpen size={11} />
                                        {isHuman ? "อ่านเพิ่มเติม" : "INFO"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* AI Doodle Game Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setIsDoodleOpen(true)}
                        className={`cursor-pointer border p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all min-h-[300px] ${isHuman
                            ? "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 hover:shadow-indigo-100/50 hover:shadow-xl"
                            : "bg-black border border-[#10b981] shadow-[0_0_15px_#10b98122] hover:shadow-[0_0_30px_#10b98144]"
                            }`}
                    >
                        <Trophy size={48} className={`mb-4 ${isHuman ? "text-indigo-500" : "text-[#10b981]"}`} />
                        <h3 className={`text-xl font-bold mb-2 uppercase ${isHuman ? "text-indigo-900" : "text-[#10b981]"}`}>
                            {isHuman ? "ความท้าทาย AI Doodle" : "ฝึกฝน_โครงข่าย_ประสาท"}
                        </h3>
                        <p className={`text-xs ${isHuman ? "text-indigo-600" : "text-[#10b981bb]"}`}>
                            {isHuman ? "วาดรูปแล้วให้ AI ทายว่าคุณวาดอะไร!" : "ทดสอบ_อัลกอริทึม_การจดจำ_V2.0"}
                        </p>
                        <div className={`mt-4 px-4 py-2 rounded-full text-xs font-bold ${isHuman ? "bg-indigo-600 text-white" : "bg-[#10b981] text-black"
                            }`}>
                            เล่นเลย
                        </div>
                    </motion.div>

                    {/* Secret Project Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                        onClick={handleSecretClick}
                        className={`cursor-pointer border p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all min-h-[300px] ${isHuman
                            ? "bg-slate-100 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-200"
                            : "bg-black border-dashed border-[#10b98144] hover:border-[#10b981] hover:bg-[#10b98111]"
                            }`}
                    >
                        <Lock size={48} className={`mb-4 ${isHuman ? "text-slate-400" : "text-[#10b981]"}`} />
                        <h3 className={`text-xl font-bold mb-2 uppercase ${isHuman ? "text-slate-500" : "text-[#10b981]"}`}>
                            {isHuman ? "โปรเจกต์ลับ" : "ไฟล์_รอ_การถอดรหัส"}
                        </h3>
                        <p className={`text-xs ${isHuman ? "text-slate-400" : "text-[#10b98166]"}`}>
                            {isHuman ? "จำกัดการเข้าถึง เฉพาะผู้ที่ได้รับอนุญาตเท่านั้น" : "ต้องการการอนุมัติความปลอดภัยระดับ 5"}
                        </p>
                    </motion.div>
                </div>
            </div>

            <PasswordVault
                isOpen={isVaultOpen}
                onClose={() => setIsVaultOpen(false)}
                onUnlock={() => setIsProjectUnlocked(true)}
            />

            <SecretProjectModal
                isOpen={isProjectUnlocked}
                onClose={() => setIsProjectUnlocked(false)}
            />

            <ProjectCaseStudy
                isOpen={!!selectedStudy}
                onClose={() => setSelectedStudy(null)}
                project={selectedStudy}
            />

            <DoodleGame
                isOpen={isDoodleOpen}
                onClose={() => setIsDoodleOpen(false)}
            />
        </section>
    );
};


export default Projects;
