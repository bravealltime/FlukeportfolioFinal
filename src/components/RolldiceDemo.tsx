"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Dices } from "lucide-react";

interface RolldiceDemoProps {
    onClose: () => void;
}

const RolldiceDemo: React.FC<RolldiceDemoProps> = ({ onClose }) => {
    const [count, setCount] = useState(1);
    const [results, setResults] = useState<number[]>([]);
    const [isRolling, setIsRolling] = useState(false);
    const [showResult, setShowResult] = useState(false);

    // Game Config
    const MAX_DICE = 10;
    const THRESHOLD = 4; // Success threshold (standard RedM mechanics)

    const handleRoll = () => {
        if (isRolling) return;
        setIsRolling(true);
        setShowResult(false);

        // Simulate rolling delay
        setTimeout(() => {
            const newResults: number[] = [];
            for (let i = 0; i < count; i++) {
                newResults.push(Math.floor(Math.random() * 6) + 1);
            }
            setResults(newResults);
            setIsRolling(false);
            setShowResult(true);
        }, 800);
    };

    const increaseDice = () => {
        setCount(prev => (prev >= MAX_DICE ? 1 : prev + 1));
    };

    // Calculate details
    const successCount = results.filter(r => r >= THRESHOLD).length;
    const isSuccess = successCount > results.length / 2;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
                {/* Close Button (Top Right of Screen) */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors z-50 p-2"
                >
                    <X size={32} />
                </button>

                {/* Main Container - Parchment Texture Style */}
                <div className="relative w-full h-full flex items-center justify-center pointer-events-none">

                    {/* HUD - Bottom Right (Clickable) */}
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="fixed bottom-10 right-10 pointer-events-auto cursor-pointer group"
                        onClick={handleRoll}
                    >
                        <div className="bg-gradient-to-br from-[#2b1d12] to-[#1a100a] border-2 border-[#cda434] rounded-xl p-6 shadow-2xl flex flex-col items-center gap-2 transform transition-transform group-hover:scale-105 group-active:scale-95">
                            <Dices className="text-[#f0e6d2] w-8 h-8 mb-1" />
                            <div className="text-[#cda434] text-4xl font-black font-serif leading-none">
                                {count}
                            </div>
                            <span className="text-[#a89f91] text-xs font-serif tracking-widest">DICE</span>

                            {/* Controls Hint */}
                            <div className="mt-2 pt-2 border-t border-[#444] w-full text-center">
                                <span className="text-[10px] text-[#888] block">CLICK TO ROLL</span>
                                <div
                                    className="mt-1 px-2 py-1 bg-[#ffffff11] rounded text-[10px] text-[#aaa] hover:bg-[#ffffff33] transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        increaseDice();
                                    }}
                                >
                                    + ADD DICE
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Result Popup - Center */}
                    {showResult && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="pointer-events-auto bg-[#1e1e1e] p-1 rounded-xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] border-4 border-double border-[#cda434] max-w-md w-full mx-4"
                            style={{
                                backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png'), linear-gradient(to bottom, #2b1d12, #1a100a)",
                                backgroundBlendMode: "overlay"
                            }}
                        >
                            <div className="border border-dashed border-[#555] p-8 rounded-lg flex flex-col items-center">
                                <h2 className="text-[#8f1e1e] text-3xl font-serif font-bold mb-6 tracking-widest shadow-red-900 drop-shadow-md">
                                    DICE ROLLED
                                </h2>

                                <div className="flex flex-wrap justify-center gap-3 mb-8">
                                    {results.map((res, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ y: -20, rotate: 180, opacity: 0 }}
                                            animate={{ y: 0, rotate: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.1, type: "spring" }}
                                            className={`
                                                w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold shadow-lg border-2
                                                ${res >= THRESHOLD
                                                    ? "bg-[#4caf50] text-white border-[#388e3c]" // Success
                                                    : "bg-[#f44336] text-white border-[#d32f2f]" // Fail
                                                }
                                            `}
                                        >
                                            {res >= THRESHOLD ? "✓" : "✗"}
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="w-full border-t-2 border-[#8f1e1e] pt-4 text-center">
                                    <div className={`text-2xl font-bold font-serif ${isSuccess ? "text-[#4caf50]" : "text-[#f44336]"}`}>
                                        {isSuccess
                                            ? `SUCCESS (${successCount}/${results.length})`
                                            : `FAILURE (${successCount}/${results.length})`
                                        }
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Instructions Overlay */}
                    <div className="fixed top-10 left-10 text-white/50 text-xs font-mono">
                        <p>REDM SCRIPT SIMULATION</p>
                        <p>MODE: YES/NO (Threshold: {THRESHOLD})</p>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RolldiceDemo;
