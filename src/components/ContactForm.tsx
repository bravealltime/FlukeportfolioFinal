"use client";

import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";
import { motion } from "framer-motion";
import { Send, Check, AlertTriangle } from "lucide-react";

const ContactForm = () => {
    const { isHuman } = useSettings();
    const { playHover, playKeyPress } = useAudio();
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
                    if (form.current) form.current.reset();
                    setTimeout(() => setStatus("idle"), 3000);
                }, (error) => {
                    console.log(error.text);
                    setStatus("error");
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
                        : "bg-black/40 border border-[#00ff41] shadow-[0_0_30px_#00ff4122]"
                        }`}
                >
                    <h2 className={`text-2xl font-bold mb-6 text-center uppercase tracking-wider ${isHuman ? "text-slate-800" : "text-[#00ff41]"
                        }`}>
                        {isHuman ? "Send me a message" : "[ ESTABLISH_UPLINK ]"}
                    </h2>

                    <form ref={form} onSubmit={sendEmail} className="space-y-4">
                        <div>
                            <label className={`block text-xs font-bold mb-1 uppercase ${isHuman ? "text-slate-500" : "text-[#00ff41aa]"
                                }`}>
                                Name / Identity
                            </label>
                            <input
                                type="text"
                                name="user_name"
                                required
                                className={`w-full p-3 rounded-lg outline-none transition-all ${isHuman
                                    ? "bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800"
                                    : "bg-black border border-[#00ff4144] focus:border-[#00ff41] text-[#00ff41] placeholder-[#00ff4144]"
                                    }`}
                                placeholder={isHuman ? "John Doe" : "Enter Codex Name..."}
                            />
                        </div>

                        <div>
                            <label className={`block text-xs font-bold mb-1 uppercase ${isHuman ? "text-slate-500" : "text-[#00ff41aa]"
                                }`}>
                                Email / Frequency
                            </label>
                            <input
                                type="email"
                                name="user_email"
                                required
                                className={`w-full p-3 rounded-lg outline-none transition-all ${isHuman
                                    ? "bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800"
                                    : "bg-black border border-[#00ff4144] focus:border-[#00ff41] text-[#00ff41] placeholder-[#00ff4144]"
                                    }`}
                                placeholder={isHuman ? "john@example.com" : "encrypted@mesh.net"}
                            />
                        </div>

                        <div>
                            <label className={`block text-xs font-bold mb-1 uppercase ${isHuman ? "text-slate-500" : "text-[#00ff41aa]"
                                }`}>
                                Message / Payload
                            </label>
                            <textarea
                                name="message"
                                required
                                rows={4}
                                className={`w-full p-3 rounded-lg outline-none transition-all ${isHuman
                                    ? "bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800"
                                    : "bg-black border border-[#00ff4144] focus:border-[#00ff41] text-[#00ff41] placeholder-[#00ff4144]"
                                    }`}
                                placeholder={isHuman ? "Hello there..." : "Injecting payload..."}
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
                                    : "bg-[#00ff4122] text-[#00ff41] border border-[#00ff41] hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_20px_#00ff41]"
                                }`}
                        >
                            {status === "idle" && (
                                <>
                                    {isHuman ? "Send Message" : "TRANSMIT_DATA"} <Send size={18} />
                                </>
                            )}
                            {status === "sending" && "TRANSMITTING..."}
                            {status === "success" && (
                                <>
                                    SENT <Check size={18} />
                                </>
                            )}
                            {status === "error" && (
                                <>
                                    FAILED <AlertTriangle size={18} />
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
