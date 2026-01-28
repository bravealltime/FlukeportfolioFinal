"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, AlertCircle } from "lucide-react";
import { useSettings } from "./SettingsProvider";
import { useToast } from "./ToastProvider";
import { useAudio } from "./AudioProvider";

const PASSCODE = "2077"; // Cyberpunk reference

interface PasswordVaultProps {
    onUnlock: () => void;
    isOpen: boolean;
    onClose: () => void;
}

const PasswordVault: React.FC<PasswordVaultProps> = ({ onUnlock, isOpen, onClose }) => {
    const [input, setInput] = useState("");
    const { isHuman } = useSettings();
    const { addToast } = useToast();
    const { playKeyPress, playSuccess, playError } = useAudio();

    const handleInput = (num: string) => {
        if (input.length < 4) {
            playKeyPress();
            setInput((prev) => prev + num);
        }
    };

    const handleClear = () => {
        playKeyPress();
        setInput("");
    };

    const handleSubmit = () => {
        if (input === PASSCODE) {
            playSuccess();
            addToast("เข้าถึงสำเร็จ: ปลดล็อกโปรเจกต์ลับแล้ว", "success");
            onUnlock();
            setInput("");
            onClose();
        } else {
            playError();
            addToast("การเข้าถึงถูกปฏิเสธ: รหัสผ่านไม่ถูกต้อง", "error");
            setInput("");
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                className={`p-8 rounded-2xl w-full max-w-sm flex flex-col items-center ${isHuman
                    ? "bg-white text-slate-900 border border-slate-200 shadow-2xl"
                    : "bg-[#0a0a0a] text-[#10b981] border border-[#10b981] shadow-[0_0_50px_#10b98144]"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6">
                    <Lock size={48} className={isHuman ? "text-slate-400" : "text-[#10b981]"} />
                </div>

                <h2 className="text-xl font-bold mb-4 tracking-widest uppercase">
                    {isHuman ? "กรอกรหัสผ่าน" : "ตรวจสอบ_ความปลอดภัย"}
                </h2>

                <div className={`w-full h-12 mb-6 rounded text-center text-3xl font-mono tracking-[1em] flex items-center justify-center ${isHuman ? "bg-slate-100" : "bg-black border border-[#10b98144]"
                    }`}>
                    {"*".repeat(input.length)} {input.length < 4 && <span className="animate-pulse">_</span>}
                </div>

                <div className="grid grid-cols-3 gap-4 w-full mb-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleInput(num.toString())}
                            className={`h-16 rounded-xl text-xl font-bold transition-all ${isHuman
                                ? "bg-slate-50 hover:bg-slate-200 active:scale-95 text-slate-700"
                                : "bg-black border border-[#10b98144] hover:bg-[#10b98122] active:scale-95 text-[#10b981]"
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={handleClear}
                        className={`h-16 rounded-xl text-sm font-bold transition-all flex items-center justify-center ${isHuman
                            ? "bg-red-50 hover:bg-red-100 text-red-500"
                            : "bg-black border border-red-500/50 hover:bg-red-500/20 text-red-500"
                            }`}
                    >
                        ล้าง
                    </button>
                    <button
                        onClick={() => handleInput("0")}
                        className={`h-16 rounded-xl text-xl font-bold transition-all ${isHuman
                            ? "bg-slate-50 hover:bg-slate-200 active:scale-95 text-slate-700"
                            : "bg-black border border-[#10b98144] hover:bg-[#10b98122] active:scale-95 text-[#10b981]"
                            }`}
                    >
                        0
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`h-16 rounded-xl text-sm font-bold transition-all flex items-center justify-center ${isHuman
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-[#10b981] hover:bg-[#059669] text-black"
                            }`}
                    >
                        ตกลง
                    </button>
                </div>

                <div className={`text-[10px] uppercase tracking-widest ${isHuman ? "text-slate-400" : "text-[#10b98144]"}`}>
                    คำใบ้: ปีแห่งอนาคต (Cyberpunk)
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PasswordVault;
