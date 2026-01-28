"use client";

import React, { useState } from "react";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, AlertCircle } from "lucide-react";

const posts = [
    {
        id: 1,
        title: "ทำไมผมถึงเปลี่ยนมาใช้ Next.js 14",
        excerpt: "Server Actions และ App Router เปลี่ยนทุกอย่างไปเลย...",
        content: "Next.js 14 มาพร้อมกับ Server Actions ที่ช่วยให้คุณรันโค้ดแบบ asynchronous บนเซิร์ฟเวอร์ได้โดยตรง ช่วยลดปริมาณ JavaScript ฝั่งไคลเอนต์และเพิ่มประสิทธิภาพได้อย่างมหาศาล ส่วน App Router ก็ช่วยให้การจัดการ Routing ง่ายขึ้นและทำ Layout ได้มีประสิทธิภาพกว่าเดิมครับ",
        date: "2024-01-15",
        tag: "เทคโนโลยี"
    },
    {
        id: 2,
        title: "จัดโต๊ะคอมฉบับ Developer",
        excerpt: "ตั้งแต่ VS Code extensions ไปจนถึงคีย์บอร์ด Marchanical...",
        content: "การจัดมุมทำงานที่ดีเป็นเรื่องสำคัญมากครับ ปัจจุบันผมใช้คีย์บอร์ดแบบ Split Mechanical เพื่อสุขภาพมือ เมาส์แนวตั้ง และจอ 4K OLED เพื่อให้ภาพคมชัดที่สุด ส่วนซอฟต์แวร์ผมใช้ VS Code เป็นหลักคู่กับธีม SynthWave '84 ครับ",
        date: "2023-12-10",
        tag: "ไลฟ์สไตล์"
    },
    {
        id: 3,
        title: "เจาะลึก React Server Components",
        excerpt: "อนาคตของการ Render ใน React ที่ควรรู้...",
        content: "RSC ช่วยให้คอมโพเนนต์ถูกเรนเดอร์บนเซิร์ฟเวอร์อย่างเดียว ซึ่งหมายความว่าเราไม่ต้องโหลด JavaScript สำหรับคอมโพเนนต์เหล่านั้นเลยครับ! เป็นการเปลี่ยนผ่านที่สำคัญจากโมเดลการดึงข้อมูลฝั่งไคลเอนต์แบบเดิมๆ",
        date: "2023-11-05",
        tag: "การเขียนโค้ด"
    }
];

const BlogSection = () => {
    const { isHuman } = useSettings();
    const { playHover, playKeyPress } = useAudio();
    const [selectedPost, setSelectedPost] = useState<typeof posts[0] | null>(null);

    return (
        <section className={`py-20 px-4 relative z-10 ${isHuman ? "bg-white" : "bg-transparent"}`}>
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className={`text-3xl md:text-5xl font-bold mb-4 uppercase tracking-tighter ${isHuman ? "text-slate-900" : "text-[#10b981]"
                        }`}>
                        {isHuman ? "บทความล่าสุด" : "[ คลัง_ความรู้ ]"}
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            role="button"
                            aria-label={`อ่านบทความ: ${post.title}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            onMouseEnter={() => playHover()}
                            onClick={() => {
                                playKeyPress();
                                setSelectedPost(post);
                            }}
                            className={`cursor-pointer p-6 rounded-xl border transition-all h-full flex flex-col ${isHuman
                                ? "bg-slate-50 border-slate-200 hover:shadow-lg"
                                : "bg-[#0a0a0a]/40 border-[#10b98144] hover:border-[#10b981] hover:shadow-[0_0_15px_#10b98122]"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${isHuman ? "bg-blue-100 text-blue-600" : "bg-[#10b98122] text-[#10b981]"
                                    }`}>
                                    {post.tag}
                                </span>
                                <span className={`text-xs ${isHuman ? "text-slate-400" : "text-[#10b98166]"}`}>
                                    {post.date}
                                </span>
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${isHuman ? "text-slate-800" : "text-[#10b981]"}`}>
                                {post.title}
                            </h3>
                            <p className={`text-sm flex-grow ${isHuman ? "text-slate-600" : "text-[#10b981aa]"}`}>
                                {post.excerpt}
                            </p>
                            <div className={`mt-4 pt-4 border-t text-sm font-bold flex items-center gap-2 ${isHuman ? "border-slate-200 text-blue-600" : "border-[#10b98122] text-[#10b981]"
                                }`}>
                                อ่านเพิ่มเติม <BookOpen size={16} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0a0a0a]/80 backdrop-blur-sm"
                        onClick={() => setSelectedPost(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`relative w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 rounded-2xl shadow-2xl ${isHuman
                                ? "bg-white text-slate-800"
                                : "bg-black border border-[#10b981] text-[#10b981] shadow-[0_0_30px_#10b98144]"
                                }`}
                        >
                            <button
                                onClick={() => {
                                    playKeyPress();
                                    setSelectedPost(null)
                                }}
                                onMouseEnter={() => playHover()}
                                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isHuman ? "hover:bg-slate-100" : "hover:bg-[#10b98122]"
                                    }`}
                                aria-label="ปิดบทความ"
                            >
                                <X size={24} />
                            </button>

                            <span className={`text-xs font-bold uppercase tracking-widest ${isHuman ? "text-blue-500" : "text-[#10b98166]"
                                }`}>
                                {selectedPost.tag} {" // "} {selectedPost.date}
                            </span>

                            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                                {selectedPost.title}
                            </h2>

                            <div className={`prose max-w-none ${isHuman ? "prose-slate" : "prose-invert"}`}>
                                <p className="leading-relaxed text-lg">
                                    {selectedPost.content}
                                </p>
                                <p className="mt-4">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>

                            {!isHuman && (
                                <div className="mt-8 pt-4 border-t border-[#10b98144] text-xs font-mono text-[#10b98166] flex items-center gap-2">
                                    <AlertCircle size={12} /> สิ้นสุด_กระบวนการ
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default BlogSection;
