"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Send } from "lucide-react";
import { useAudio } from "./AudioProvider";

import { useSettings } from "./SettingsProvider";

/**
 * Component: Contact
 * ส่วนช่องทางการติดต่อ (Footer Section)
 * แสดงปุ่ม Email และ Social Links
 * ปรับสไตล์ตามโหมด Human/Hacker อัตโนมัติ
 */
const Contact = () => {
    const { playPing, playKeyPress } = useAudio();
    const { isHuman } = useSettings();

    return (
        <section id="contact" className="py-24 px-4 bg-transparent font-mono relative overflow-hidden z-10">
            <div className={`max-w-4xl mx-auto text-center border relative ${isHuman ? "border-slate-200 bg-white/50 backdrop-blur-xl shadow-xl rounded-2xl p-12" : "border-[#00ff4144] p-8 md:p-16 bg-black/40 hacker-border backdrop-blur-md"}`}>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative z-10"
                >
                    {!isHuman && <div className="text-[#00ff41] text-xs mb-4 animate-pulse">
                        [ ENCRYPTED_CHANNEL_OPEN ]
                    </div>}

                    <h2 className={`text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tighter ${isHuman ? "text-slate-900 normal-case" : "text-[#00ff41]"}`}>
                        {isHuman ? "Get in Touch" : "&gt; ESTABLISH_CONTACT_"}
                    </h2>

                    <p className={`text-sm mb-10 max-w-xl mx-auto ${isHuman ? "text-slate-600 font-sans text-lg normal-case" : "text-[#00ff4188]"}`}>
                        {isHuman
                            ? "I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions."
                            : "พร้อมที่จะสร้างความเปลี่ยนแปลงในระบบดิจิทัลแล้วหรือยัง? ส่งโปรโตคอลการสื่อสารมาหาเรา เพื่อเริ่มดำเนินการทันที"}
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <motion.a
                            href="mailto:example@email.com"
                            onMouseEnter={() => !isHuman && playPing()}
                            onClick={() => !isHuman && playKeyPress()}
                            whileHover={isHuman ? { scale: 1.02 } : { scale: 1.05, backgroundColor: "#00ff41", color: "#000" }}
                            whileTap={isHuman ? { scale: 0.98 } : { scale: 0.95 }}
                            className={`flex items-center gap-2 px-8 py-4 border font-bold text-xs uppercase ${isHuman
                                ? "bg-slate-900 text-white border-transparent rounded-lg font-sans shadow-lg hover:bg-slate-800"
                                : "border-[#00ff41] text-[#00ff41]"}`}
                        >
                            <Mail size={isHuman ? 20 : 16} />
                            {isHuman ? "Send Email" : "SEND_PACKET::EMAIL"}
                        </motion.a>

                        <div className="flex gap-4">
                            <motion.button
                                onMouseEnter={() => !isHuman && playPing()}
                                onClick={() => !isHuman && playKeyPress()}
                                whileHover={isHuman ? { scale: 1.05 } : { scale: 1.1, backgroundColor: "#00ff4133" }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-4 border transition-all ${isHuman
                                    ? "bg-white text-slate-700 border-slate-200 rounded-lg shadow-sm hover:border-slate-300 hover:text-blue-600"
                                    : "border-[#00ff4144] text-[#00ff41] hover:border-[#00ff41]"}`}
                            >
                                <MessageCircle size={isHuman ? 20 : 18} />
                            </motion.button>
                            <motion.button
                                onMouseEnter={() => !isHuman && playPing()}
                                onClick={() => !isHuman && playKeyPress()}
                                whileHover={isHuman ? { scale: 1.05 } : { scale: 1.1, backgroundColor: "#00ff4133" }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-4 border transition-all ${isHuman
                                    ? "bg-white text-slate-700 border-slate-200 rounded-lg shadow-sm hover:border-slate-300 hover:text-blue-600"
                                    : "border-[#00ff4144] text-[#00ff41] hover:border-[#00ff41]"}`}
                            >
                                <Send size={isHuman ? 20 : 18} />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className={`mt-24 text-[10px] text-center uppercase tracking-[0.3em] ${isHuman ? "text-slate-400 font-sans tracking-normal normal-case" : "text-[#00ff4144]"}`}>
                {isHuman ? "© 2024 Thara Portfolio. All rights reserved." : "System Version: 4.0.1 // Security Status: Verified"}
            </div>
        </section>
    );
};



export default Contact;
