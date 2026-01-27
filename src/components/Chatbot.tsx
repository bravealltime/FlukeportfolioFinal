"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";
import { KNOWLEDGE_BASE } from "./ChatData";
import { askGemini } from "@/app/actions";

interface Message {
    id: string;
    text: string;
    sender: "bot" | "user";
}

const Chatbot = () => {
    const { isHuman } = useSettings();
    const { playPing, playKeyPress, playHover } = useAudio();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { id: "intro", text: isHuman ? "Hello! How can I help you today?" : "SYSTEM_ONLINE. AWAITING_INPUT.", sender: "bot" }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // Update intro message when mode changes
    useEffect(() => {
        setMessages(prev => {
            if (prev.length === 1 && prev[0].id === "intro") {
                return [{
                    id: "intro",
                    text: isHuman ? "Hello! How can I help you today?" : "SYSTEM_ONLINE. AWAITING_INPUT.",
                    sender: "bot"
                }];
            }
            return prev;
        });
    }, [isHuman]);

    const detectLanguage = (text: string): "th" | "en" => {
        // Simple Thai character detection
        const thaiPattern = /[\u0E00-\u0E7F]/;
        return thaiPattern.test(text) ? "th" : "en";
    };

    const findAnswer = (query: string, lang: "th" | "en", mode: "human" | "hacker") => {
        const lowerQuery = query.toLowerCase();

        // Find best match in knowledge base
        const match = KNOWLEDGE_BASE.find(item =>
            item.keywords.some(k => lowerQuery.includes(k.toLowerCase()))
        );

        if (match) {
            return match.answers[mode][lang];
        }

        return null; // No match found
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        playKeyPress();
        const userMsg: Message = { id: Date.now().toString(), text: input, sender: "user" };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        // Show Loading/Thinking
        const loadingId = Date.now().toString() + "_loading";
        setMessages(prev => [...prev, { id: loadingId, text: isHuman ? "Thinking..." : "PROCESSING...", sender: "bot" }]);

        const lang = detectLanguage(userMsg.text);
        const mode = isHuman ? "human" : "hacker";

        // 1. Try Local RAG First
        const localResponse = findAnswer(userMsg.text, lang, mode);

        let finalResponse = "";

        if (localResponse) {
            // Simulate delay for realism
            await new Promise(resolve => setTimeout(resolve, 600));
            finalResponse = localResponse;
        } else {
            // 2. Local Miss -> Ask Gemini AI
            try {
                // Determine context for system prompt (handled in server action mostly, but we pass query)
                const aiResponse = await askGemini(userMsg.text);

                if (!aiResponse || !aiResponse.trim()) {
                    finalResponse = isHuman
                        ? "I'm thinking... but I couldn't find the words."
                        : "SYSTEM_WARNING: EMPTY_RESPONSE_FROM_CORE. RETRY_INITIATED.";
                } else {
                    finalResponse = aiResponse;
                }

                // Note: Hacker styling is now handled in the visual component loop
            } catch (error) {
                finalResponse = isHuman
                    ? "Sorry, I can't connect to the AI right now."
                    : "ERROR: NEURAL_NET_UNREACHABLE. CHECK_CONNECTION.";
            }
        }

        // Remove loading and add response
        setMessages(prev => prev.filter(m => m.id !== loadingId));
        setMessages(prev => [...prev, { id: Date.now().toString() + "bot", text: finalResponse, sender: "bot" }]);
        playPing();
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-28 z-50 p-4 rounded-full shadow-xl transition-all ${isHuman
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-[#0a0a0a] border border-[#10b981] text-[#10b981] shadow-[0_0_20px_#10b98144]"
                    } ${isOpen ? "hidden" : "flex"}`}
            >
                <MessageSquare size={24} />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className={`fixed bottom-24 right-4 md:bottom-28 md:right-8 z-[100] w-[90vw] md:w-[450px] rounded-2xl overflow-hidden shadow-2xl border flex flex-col ${isHuman
                            ? "bg-white border-slate-200 h-[500px]"
                            : "bg-[#0a0a0a] border-[#10b981] h-[600px]"
                            }`}
                    >
                        {/* Header */}
                        <div className={`p-4 flex justify-between items-center ${isHuman ? "bg-slate-50 border-b border-slate-100" : "bg-[#10b98111] border-b border-[#10b98144]"
                            }`}>
                            <div className="flex items-center gap-2">
                                <Bot size={20} className={isHuman ? "text-blue-600" : "text-[#10b981]"} />
                                <span className={`font-bold ${isHuman ? "text-slate-800" : "text-[#10b981]"}`}>
                                    {isHuman ? "Support Bot" : "AI_ASSISTANT v2.0"}
                                </span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:opacity-70">
                                <X size={20} className={isHuman ? "text-slate-500" : "text-[#10b981]"} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === "user"
                                        ? isHuman ? "bg-blue-600 text-white rounded-br-none" : "bg-[#10b981] text-black rounded-br-none font-bold"
                                        : isHuman
                                            ? "bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-md"
                                            : "bg-[#0a0a0a] border border-[#10b981] text-[#10b981] rounded-bl-none shadow-[0_0_10px_#10b98122]"
                                        }`}>
                                        {/* AI Indicator Icon for Bot Messages */}
                                        {msg.sender === "bot" && !isHuman && (
                                            <div className="text-[9px] opacity-50 mb-1 font-mono tracking-wider border-b border-[#10b98144] pb-1">
                                                {msg.text.includes("ERROR") ? "SYSTEM_ALERT" : "AI_CORE_RESPONSE"}
                                            </div>
                                        )}
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className={`p-4 border-t ${isHuman ? "border-slate-100" : "border-[#10b98144]"}`}>
                            <div className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder={isHuman ? "Type a message..." : "Execute command..."}
                                    className={`flex-1 p-2 bg-transparent outline-none text-sm ${isHuman ? "text-slate-800 placeholder-slate-400" : "text-[#10b981] placeholder-[#10b98144]"
                                        }`}
                                />
                                <button
                                    onClick={handleSend}
                                    className={`p-2 rounded-lg transition-colors ${isHuman ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "bg-[#10b98122] text-[#10b981] hover:bg-[#10b98144]"
                                        }`}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
