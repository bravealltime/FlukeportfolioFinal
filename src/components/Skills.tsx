"use client";

import React from "react";
import { motion } from "framer-motion";

const skills = [
    "React / Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Node.js",
    "Python",
    "Lua",
    "Firebase",
    "PostgreSQL",
    "UI/UX Design",
    "Git / GitHub",
];


import { useAudio } from "./AudioProvider";

import { useSettings } from "./SettingsProvider";

/**
 * Component: Skills
 * ส่วนแสดงผลทักษะทางเทคนิค (Tech Stack)
 * Human Mode: แสดงเป็น Badge สไตล์โมเดิร์น
 * Hacker Mode: แสดงเป็น Terminal List
 */
import TypewriterText from "./TypewriterText";

const Skills = () => {
    const { playPing } = useAudio();
    const { isHuman } = useSettings();

    return (
        <section id="skills" className="py-24 px-4 bg-transparent font-mono relative z-10">

            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    // Animation: เด้งขึ้นมาจากด้านล่าง
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <TypewriterText
                        as="h2"
                        text={isHuman ? "Technical Skills" : "[ // TECH_STACK ]"}
                        className={`text-3xl md:text-5xl font-bold mb-2 uppercase tracking-tighter ${isHuman ? "text-slate-900" : "text-[#10b981]"}`}
                    />
                    <p className={`text-xs uppercase tracking-widest ${isHuman ? "text-slate-500 font-sans mt-4 normal-case tracking-normal" : "text-[#10b98188]"}`}>
                        {isHuman ? "Technologies I work with" : "Scanning for available technologies..."}
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-3">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={skill}
                            onMouseEnter={() => !isHuman && playPing()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={isHuman ? { y: -2 } : { scale: 1.05, backgroundColor: "#10b981", color: "#000" }}
                            className={`
                                cursor-default transition-all
                                ${isHuman
                                    ? "px-6 py-3 bg-white border border-slate-200 text-slate-700 font-sans font-medium rounded-xl shadow-sm hover:shadow-md hover:border-slate-300"
                                    : "px-4 py-2 border border-[#10b98144] text-[#10b981cc] font-bold text-xs uppercase hover:border-[#10b981]"
                                }
                            `}
                        >
                            {isHuman ? skill : `> ${skill}`}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};



export default Skills;
