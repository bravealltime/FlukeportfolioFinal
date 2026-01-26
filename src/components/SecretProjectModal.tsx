"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Rocket } from "lucide-react";
import { useSettings } from "./SettingsProvider";

interface SecretProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SecretProjectModal: React.FC<SecretProjectModalProps> = ({ isOpen, onClose }) => {
    const { isHuman } = useSettings();

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                className={`relative w-full max-w-2xl p-8 rounded-3xl overflow-hidden ${isHuman
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl"
                        : "bg-black border-2 border-[#10b981] text-[#10b981] shadow-[0_0_100px_#10b98144]"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Content */}
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 p-4 rounded-full bg-white/20 backdrop-blur-sm animate-bounce">
                        <Rocket size={48} />
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
                        Project X
                    </h2>

                    <p className={`text-lg mb-8 max-w-md ${isHuman ? "text-white/80" : "text-[#10b98188]"}`}>
                        Confidential Blueprint: Next-Generation AI Agent Interface.
                        Status: In Development.
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                        <div className="p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
                            <h3 className="text-2xl font-bold">95%</h3>
                            <p className="text-xs uppercase opacity-70">Core Engine</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
                            <h3 className="text-2xl font-bold">12ms</h3>
                            <p className="text-xs uppercase opacity-70">Latency</p>
                        </div>
                    </div>

                    <button
                        className={`mt-8 px-8 py-3 rounded-full font-bold uppercase tracking-widest transition-all ${isHuman
                                ? "bg-white text-purple-600 hover:bg-indigo-50"
                                : "bg-[#10b981] text-black hover:bg-[#059669] shadow-[0_0_20px_#10b981]"
                            }`}
                    >
                        View Prototype
                    </button>
                </div>

                {/* Background Decor */}
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
        </motion.div>
    );
};

export default SecretProjectModal;
