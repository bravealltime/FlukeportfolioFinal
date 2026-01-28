"use client";

import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";
import { useToast } from "./ToastProvider";
import { motion } from "framer-motion";
import { Send, Check, AlertTriangle } from "lucide-react";

const ContactForm = () => {
    const { isHuman } = useSettings();
    const { playHover, playKeyPress, playSuccess, playError } = useAudio();
    const { addToast } = useToast();
    const form = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();

        // --- IMPORTANT: User needs to update these with their own keys ---
        // Service ID, Template ID, Public Key
        // For now, we simulate success if keys are missing or invalid in demo mode
        const SERVICE_ID = "YOUR_SERVICE_ID";
        const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
        const PUBLIC_KEY = "YOUR_PUBLIC_KEY";

        setStatus("sending");

        if (SERVICE_ID === "YOUR_SERVICE_ID") {
            // Simulation Mode
            setTimeout(() => {
                setStatus("success");
                addToast(isHuman ? "ส่งข้อความสำเร็จแล้วครับ!" : "การ_ส่ง_ข้อมูล::เสร็จสิ้น", "success");
                playSuccess();
                if (form.current) form.current.reset();
                setTimeout(() => setStatus("idle"), 3000);
            }, 1500);
            return;
        }

        if (form.current) {
            emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
                .then((result) => {
                    console.log(result.text);
                    setStatus("success");
                    addToast(isHuman ? "ส่งข้อความสำเร็จแล้วครับ!" : "การ_ส่ง_ข้อมูล::เสร็จสิ้น", "success");
                    playSuccess();
                    if (form.current) form.current.reset();
                    setTimeout(() => setStatus("idle"), 3000);
                }, (error) => {
                    console.log(error.text);
                    setStatus("error");
                    addToast(isHuman ? "ส่งข้อความไม่สำเร็จ กรุณาลองใหม่ครับ" : "ข้อผิดพลาด_การส่ง::ลองใหม่", "error");
                    playError();
                    setTimeout(() => setStatus("idle"), 3000);
                });
        }
    };

    return (
        <section className={`py-12 md:py-20 px-4 relative z-10 ${isHuman ? "bg-slate-50" : "bg-black/20"}`}>
            <div className="max-w-xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className={`p-8 rounded-2xl ${isHuman
                        ? "bg-white shadow-xl border border-slate-100"
                        : "bg-[#0a0a0a]/40 border border-[#10b981] shadow-[0_0_30px_#10b98122]"
                        }`}
                >
                    <h2 className={`text-2xl font-bold mb-6 text-center uppercase tracking-wider ${isHuman ? "text-slate-800" : "text-[#10b981]"
                        }`}>
                        {isHuman ? "ส่งข้อความหาผม" : "[ สร้าง_การเชื่อมต่อ_ข้อมูล ]"}
                    </h2>

                    <form ref={form} onSubmit={sendEmail} className="space-y-4">
                        <div>
                            <label htmlFor="user_name" className={`block text-xs font-bold mb-1 uppercase ${isHuman ? "text-slate-500" : "text-[#10b981aa]"
                                }`}>
                                ชื่อของคุณ / ตัวตน
                            </label>
                            <input
                                id="user_name"
                                type="text"
                                name="user_name"
                                required
                                className={`w-full p-3 rounded-lg outline-none transition-all ${isHuman
                                    ? "bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800"
                                    : "bg-black border border-[#10b98144] focus:border-[#10b981] text-[#10b981] placeholder-[#10b98144]"
                                    }`}
                                placeholder={isHuman ? "กรอกชื่อของคุณ" : "ระบุ_รหัส_ตัวตน..."}
                            />
                        </div>

                        <div>
                            <label htmlFor="user_email" className={`block text-xs font-bold mb-1 uppercase ${isHuman ? "text-slate-500" : "text-[#10b981aa]"
                                }`}>
                                อีเมล / ช่องทางติดต่อ
                            </label>
                            <input
                                id="user_email"
                                type="email"
                                name="user_email"
                                required
                                className={`w-full p-3 rounded-lg outline-none transition-all ${isHuman
                                    ? "bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800"
                                    : "bg-black border border-[#10b98144] focus:border-[#10b981] text-[#10b981] placeholder-[#10b98144]"
                                    }`}
                                placeholder={isHuman ? "email@example.com" : "encrypted@mesh.net"}
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className={`block text-xs font-bold mb-1 uppercase ${isHuman ? "text-slate-500" : "text-[#10b981aa]"
                                }`}>
                                ข้อความ / ข้อมูล
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={4}
                                className={`w-full p-3 rounded-lg outline-none transition-all ${isHuman
                                    ? "bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800"
                                    : "bg-black border border-[#10b98144] focus:border-[#10b981] text-[#10b981] placeholder-[#10b98144]"
                                    }`}
                                placeholder={isHuman ? "พิมพ์ข้อความที่นี่..." : "กำลัง_เขียน_ชุดข้อมูล..."}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === "sending"}
                            onMouseEnter={() => playHover()}
                            onClick={playKeyPress}
                            className={`w-full py-4 rounded-lg font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${status === "sending" ? "opacity-50 cursor-not-allowed" : ""
                                } ${isHuman
                                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-200"
                                    : "bg-[#10b98122] text-[#10b981] border border-[#10b981] hover:bg-[#10b981] hover:text-black hover:shadow-[0_0_20px_#10b981]"
                                }`}
                        >
                            {status === "idle" && (
                                <>
                                    {isHuman ? "ส่งข้อความ" : "เริ่ม_ส่ง_ข้อมูล"} <Send size={18} />
                                </>
                            )}
                            {status === "sending" && (isHuman ? "กำลังส่ง..." : "กำลัง_ดำเนินการ...")}
                            {status === "success" && (
                                <>
                                    {isHuman ? "ส่งสำเร็จแล้ว" : "สำเร็จ"} <Check size={18} />
                                </>
                            )}
                            {status === "error" && (
                                <>
                                    {isHuman ? "เกิดข้อผิดพลาด" : "ผิดพลาด"} <AlertTriangle size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactForm;
