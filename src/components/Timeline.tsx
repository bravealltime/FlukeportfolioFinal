"use client";

import React from "react";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";
import { motion } from "framer-motion";

const timelineData = [
    {
        year: "2021",
        title: "BorntoDev",
        company: "Certification",
        desc: "สำเร็จหลักสูตร UX/UI Design ยกระดับทักษะการออกแบบหน้าเว็บและประสบการณ์ผู้ใช้ให้ดียิ่งขึ้น",
    },
    {
        year: "2016-2021",
        title: "Thai-Nichi Institute of Technology",
        company: "Bachelor's Degree",
        desc: "เทคโนโลยีสารสนเทศ (IT) เน้นการพัฒนาซอฟต์แวร์และเรียนรู้วัฒนธรรมการทำงานแบบญี่ปุ่น",
    },
    {
        year: "2009-2016",
        title: "Saint Dominic School",
        company: "High School",
        desc: "สายวิทย์-คณิต พื้นฐานแน่นทั้งด้านตรรกะและการคำนวณ",
    },
];

const Timeline = () => {
    const { isHuman } = useSettings();
    const { playHover } = useAudio();

    return (
        <section className={`py-20 px-4 relative z-10 ${isHuman ? "bg-slate-50" : "bg-transparent"}`}>
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className={`text-3xl md:text-5xl font-bold mb-4 uppercase tracking-tighter ${isHuman ? "text-slate-900" : "text-[#10b981]"
                        }`}>
                        {isHuman ? "Education History" : "[ EDUCATION_LOG ]"}
                    </h2>
                </motion.div>

                <div className="relative border-l-2 border-opacity-50 border-gray-300 dark:border-gray-700 ml-3 md:ml-0">
                    <div className={`absolute top-0 bottom-0 left-[15px] md:left-1/2 w-0.5 ${isHuman ? "bg-blue-200" : "bg-[#10b98144]"
                        } -translate-x-1/2`} />

                    {timelineData.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className={`mb-8 flex justify-between items-center w-full ${index % 2 === 0 ? "flex-row-reverse" : ""
                                }`}
                        >
                            <div className="order-1 w-5/12 hidden md:block" />

                            <div className={`z-20 flex items-center order-1 w-8 h-8 rounded-full ring-4 ${isHuman
                                ? "bg-blue-500 ring-blue-200"
                                : "bg-[#0a0a0a] ring-[#10b981] shadow-[0_0_10px_#10b981]"
                                } shadow-xl`}>
                                <h1 className="mx-auto font-semibold text-lg text-white">
                                    {isHuman ? "" : ""}
                                </h1>
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                onMouseEnter={() => playHover()}
                                className={`order-1 w-full md:w-5/12 ml-8 md:ml-0 px-6 py-4 rounded-lg shadow-xl ${isHuman
                                    ? "bg-white text-slate-700"
                                    : "bg-[#0a0a0a]/80 border border-[#10b98188] text-[#10b981]"
                                    }`}
                            >
                                <span className={`font-bold text-sm ${isHuman ? "text-blue-500" : "text-[#10b981aa]"}`}>
                                    {item.year}
                                </span>
                                <h3 className="font-bold text-xl mb-1">{item.title}</h3>
                                <h4 className={`mb-2 font-semibold text-sm ${isHuman ? "text-slate-500" : "text-[#10b98166]"}`}>
                                    {item.company}
                                </h4>
                                <p className="text-sm leading-snug text-opacity-80">
                                    {item.desc}
                                </p>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Timeline;
