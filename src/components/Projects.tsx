"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useAudio } from "./AudioProvider";
import PasswordVault from "./PasswordVault";
import SecretProjectModal from "./SecretProjectModal";
import ProjectCaseStudy from "./ProjectCaseStudy";
import { Lock, BookOpen } from "lucide-react";

interface Project {
    title: string;
    description: string;
    tech: string[];
    link: string;
    github: string;
}

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
import TypewriterText from "./TypewriterText";
import DoodleGame from "./DoodleGame";
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
                        text={isHuman ? "Featured Projects" : "[ // DATABASE_PROJECTS ]"}
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
                                ? "bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-2xl p-6 transition-all"
                                : "bg-[#0a0a0a] border border-[#10b98144] p-6 group relative overflow-hidden transition-all hover:border-[#10b981] hover:shadow-[0_0_20px_#10b98122]"
                                }`}
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`${isHuman ? "text-slate-400 font-sans font-bold text-sm" : "text-[#10b981] opacity-50 text-xs"}`}>
                                        {isHuman ? `0${index + 1}` : `0${index + 1} // FILE.SYS`}
                                    </div>
                                    <div className="flex gap-4">
                                        <a
                                            href={project.github}
                                            className={`${isHuman ? "text-slate-400 hover:text-slate-900" : "text-[#10b981] hover:glow-sm"} transition-all`}
                                            aria-label={`View ${project.title} on GitHub`}
                                        >
                                            <Github size={isHuman ? 20 : 18} />
                                        </a>
                                    </div>
                                </div>

                                <h3 className={`text-xl font-bold mb-4 uppercase ${isHuman ? "text-slate-800" : "text-[#10b981]"}`}>
                                    {project.title}
                                </h3>
                                <p className={`text-xs mb-8 leading-relaxed h-16 overflow-hidden ${isHuman ? "text-slate-600 font-sans text-sm" : "text-[#10b981bb]"}`}>
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {project.tech.map((t) => (
                                        <span
                                            key={t}
                                            className={`text-[10px] px-2 py-0.5 uppercase ${isHuman
                                                ? "bg-slate-100 text-slate-600 rounded-full font-sans font-semibold border-none"
                                                : "border border-[#10b98133] text-[#10b981cc]"
                                                }`}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <motion.a
                                    href={project.link}
                                    className={`inline-flex items-center gap-2 text-xs font-bold hover:underline ${isHuman ? "text-blue-600 font-sans text-sm" : "text-[#10b981]"}`}
                                >
                                    {isHuman ? "View Project" : "[ ACCESS_RESOURCES ]"}
                                    <ExternalLink size={12} />
                                </motion.a>

                                <button
                                    onClick={() => setSelectedStudy(project)}
                                    className={`ml-4 inline-flex items-center gap-2 text-xs font-bold hover:underline ${isHuman ? "text-slate-500" : "text-[#10b981aa]"}`}
                                >
                                    <BookOpen size={12} />
                                    {isHuman ? "Read Case Study" : "DECRYPT_LOGS"}
                                </button>
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
                            {isHuman ? "AI Doodle Challenge" : "NEURAL_NET_TRAINING"}
                        </h3>
                        <p className={`text-xs ${isHuman ? "text-indigo-600" : "text-[#10b981bb]"}`}>
                            {isHuman ? "Draw something and let AI guess what it is!" : "TESTING_RECOGNITION_ALGORITHM_V2.0"}
                        </p>
                        <div className={`mt-4 px-4 py-2 rounded-full text-xs font-bold ${isHuman ? "bg-indigo-600 text-white" : "bg-[#10b981] text-black"
                            }`}>
                            PLAY NOW
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
                            {isHuman ? "Confidential Project" : "ENCRYPTED_FILE"}
                        </h3>
                        <p className={`text-xs ${isHuman ? "text-slate-400" : "text-[#10b98166]"}`}>
                            {isHuman ? "Access Restricted. Authorized Personnel Only." : "LEVEL 5 SECURITY CLEARANCE REQUIRED"}
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
