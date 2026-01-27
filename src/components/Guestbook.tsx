"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";
import { Link, Hash, User, Clock } from "lucide-react";
import TypewriterText from "./TypewriterText";

interface Block {
    index: number;
    timestamp: string;
    sender: string;
    message: string;
    prevHash: string;
    hash: string;
    nonce: number;
}

const Guestbook = () => {
    const { isHuman } = useSettings();
    const { playPing, playSuccess, playError } = useAudio();

    const [blocks, setBlocks] = useState<Block[]>([
        {
            index: 0,
            timestamp: new Date().toISOString(),
            sender: "Genesis",
            message: "Welcome to the TharaChain Ledger.",
            prevHash: "00000000000000000000000000000000",
            hash: "0000a1b2c3d4e5f678901234567890abcdef",
            nonce: 0
        }
    ]);

    const [name, setName] = useState("");
    const [msg, setMsg] = useState("");
    const [isMining, setIsMining] = useState(false);

    // Simple Hash Function Simulation
    const calculateHash = async (index: number, prevHash: string, timestamp: string, data: string, nonce: number) => {
        const text = index + prevHash + timestamp + data + nonce;
        const msgBuffer = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    const handleSign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !msg.trim()) return;

        setIsMining(true);
        playPing();

        const prevBlock = blocks[blocks.length - 1];
        const index = prevBlock.index + 1;
        const timestamp = new Date().toISOString();
        const data = name + msg;
        let nonce = 0;
        let hash = "";

        // Simulate Mining (Proof of Work) - Delay
        setTimeout(async () => {
            // Find a hash (simplified, just calculate once for demo)
            hash = await calculateHash(index, prevBlock.hash, timestamp, data, nonce);

            const newBlock: Block = {
                index,
                timestamp,
                sender: name,
                message: msg,
                prevHash: prevBlock.hash,
                hash,
                nonce
            };

            setBlocks(prev => [newBlock, ...prev]);
            setIsMining(false);
            setName("");
            setMsg("");
            playSuccess();
        }, 1500);
    };

    return (
        <section className={`py-24 px-4 relative z-10 ${isHuman ? "bg-slate-50" : "bg-transparent font-mono"}`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center md:text-left">
                    <TypewriterText
                        as="h2"
                        text={isHuman ? "Visitor Guestbook" : "[ BLOCKCHAIN_LEDGER ]"}
                        className={`text-3xl md:text-5xl font-bold mb-2 uppercase tracking-tighter ${isHuman ? "text-slate-900" : "text-[#10b981]"}`}
                    />
                    <p className={`text-sm ${isHuman ? "text-slate-500" : "text-[#10b98188]"}`}>
                        {isHuman
                            ? "Leave a permanent mark on my digital journey."
                            : "IMMUTABLE DATA STORAGE. TRANSACTIONS ARE PERMANENT."}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Form */}
                    <div className={`w-full md:w-1/3 p-6 rounded-2xl h-fit sticky top-24 ${isHuman
                            ? "bg-white shadow-xl border border-slate-100"
                            : "bg-[#0a0a0a] border border-[#10b981] shadow-[0_0_20px_#10b98122]"
                        }`}>
                        <h3 className={`font-bold mb-4 flex items-center gap-2 ${isHuman ? "text-slate-800" : "text-[#10b981]"}`}>
                            {isHuman ? "Sign the Guestbook" : "INITIATE_TX"}
                        </h3>
                        <form onSubmit={handleSign} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold opacity-70 block mb-1">
                                    {isHuman ? "Name" : "SENDER_ID"}
                                </label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    maxLength={20}
                                    className={`w-full p-2 rounded border focus:outline-none ${isHuman
                                            ? "bg-slate-50 border-slate-200 focus:border-blue-500"
                                            : "bg-black border-[#10b98144] focus:border-[#10b981] text-[#10b981]"
                                        }`}
                                    placeholder={isHuman ? "John Doe" : "ANONYMOUS"}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold opacity-70 block mb-1">
                                    {isHuman ? "Message" : "DATA_PAYLOAD"}
                                </label>
                                <textarea
                                    value={msg}
                                    onChange={e => setMsg(e.target.value)}
                                    maxLength={140}
                                    rows={3}
                                    className={`w-full p-2 rounded border focus:outline-none ${isHuman
                                            ? "bg-slate-50 border-slate-200 focus:border-blue-500"
                                            : "bg-black border-[#10b98144] focus:border-[#10b981] text-[#10b981]"
                                        }`}
                                    placeholder={isHuman ? "Nice portfolio!" : "HELLO_WORLD"}
                                />
                            </div>
                            <button
                                disabled={isMining || !name || !msg}
                                className={`w-full py-3 rounded-lg font-bold transition-all disabled:opacity-50 ${isHuman
                                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                                        : "bg-[#10b981] text-black hover:bg-[#34d399] shadow-[0_0_10px_#10b981]"
                                    }`}
                            >
                                {isMining
                                    ? (isHuman ? "Mining Block..." : "MINING_HASH...")
                                    : (isHuman ? "Sign Guestbook" : "BROADCAST_TX")
                                }
                            </button>
                        </form>
                    </div>

                    {/* Chain */}
                    <div className="w-full md:w-2/3 space-y-4">
                        <AnimatePresence>
                            {blocks.map((block) => (
                                <motion.div
                                    key={block.hash}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`p-4 rounded-xl border relative overflow-hidden group ${isHuman
                                            ? "bg-white border-slate-200 shadow-sm hover:shadow-md"
                                            : "bg-[#0a0a0a]/50 border-[#10b98133] hover:border-[#10b981]"
                                        }`}
                                >
                                    {/* Link Line */}
                                    <div className={`absolute top-0 bottom-0 left-0 w-1 ${isHuman ? "bg-blue-500" : "bg-[#10b981]"
                                        }`} />

                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded ${isHuman ? "bg-blue-100 text-blue-600" : "bg-[#10b98122] text-[#10b981]"}`}>
                                                <Hash size={14} />
                                            </div>
                                            <span className={`text-xs font-mono opacity-50`}>
                                                BLOCK #{block.index}
                                            </span>
                                        </div>
                                        <span className="text-[10px] opacity-40 font-mono">
                                            {new Date(block.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>

                                    <div className="pl-8">
                                        <div className="flex items-center gap-2 mb-1">
                                            <User size={14} className="opacity-50" />
                                            <span className={`font-bold ${isHuman ? "text-slate-900" : "text-[#10b981]"}`}>
                                                {block.sender}
                                            </span>
                                        </div>
                                        <p className={`text-sm mb-3 ${isHuman ? "text-slate-600" : "text-[#10b981cc]"}`}>
                                            "{block.message}"
                                        </p>

                                        <div className={`text-[10px] font-mono p-2 rounded break-all ${isHuman ? "bg-slate-100 text-slate-500" : "bg-[#10b98111] text-[#10b98166]"
                                            }`}>
                                            HASH: {block.hash}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Guestbook;
