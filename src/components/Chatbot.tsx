"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";

interface Message {
    id: string;
    text: string;
    sender: "bot" | "user";
}

const FAQ = [
    {
        keywords: ["hello", "hi", "hey", "start"],
        answer: "Greetings! I'm the automated assistant for Tharanut's portfolio. How can I help you? (Try asking about 'skills', 'contact', or 'price')"
    },
    {
        keywords: ["skill", "stack", "technology", "language"],
        answer: "My creator is proficient in Next.js, React, TypeScript, Node.js, and Python. He enjoys building high-performance web applications and interactive experiences."
    },
    {
        keywords: ["price", "rate", "cost", "hiring", "freelance"],
        answer: "Rates depend on project complexity. Typical range: $30 - $50 / hour. For a fixed quote, please use the Contact form!"
    },
    {
        keywords: ["contact", "email", "reach"],
        answer: "You can send a message directly via the form below, or email at example@email.com."
    },
    {
        keywords: ["who", "author", "creator"],
        answer: "I am developed by Tharanut Hiransrettawat, a Senior Frontend Developer based in Thailand."
    }
];

const Chatbot = () => {
    const { isHuman } = useSettings();
    const { playPing, playKeyPress, playHover } = useAudio();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { id: "intro", text: "System Online. How may I assist you?", sender: "bot" }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!input.trim()) return;

        playKeyPress();
        const userMsg: Message = { id: Date.now().toString(), text: input, sender: "user" };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        // Simulate thinking
        setTimeout(() => {
            const lowerInput = userMsg.text.toLowerCase();
            const hit = FAQ.find(f => f.keywords.some(k => lowerInput.includes(k)));
            const responseText = hit ? hit.answer : "I didn't quite catch that. Try asking about 'skills' or 'contact'.";

            setMessages(prev => [...prev, { id: Date.now().toString() + "bot", text: responseText, sender: "bot" }]);
            playPing();
        }, 800);
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
                className={`fixed bottom-24 right-4 z-50 p-4 rounded-full shadow-xl transition-all ${isHuman
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
                        className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] w-80 md:w-96 rounded-2xl overflow-hidden shadow-2xl border flex flex-col ${isHuman
                            ? "bg-white border-slate-200 h-[500px]"
                            : "bg-[#0a0a0a] border-[#10b981] h-[500px]"
                            }`}
                    >
                        {/* Header */}
                        <div className={`p-4 flex justify-between items-center ${isHuman ? "bg-slate-50 border-b border-slate-100" : "bg-[#10b98111] border-b border-[#10b98144]"
                            }`}>
                            <div className="flex items-center gap-2">
                                <Bot size={20} className={isHuman ? "text-blue-600" : "text-[#10b981]"} />
                                <span className={`font-bold ${isHuman ? "text-slate-800" : "text-[#10b981]"}`}>
                                    {isHuman ? "Support Bot" : "AI_ASSISTANT v1.0"}
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
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === "user"
                                        ? isHuman ? "bg-blue-600 text-white rounded-br-none" : "bg-[#10b981] text-black rounded-br-none font-bold"
                                        : isHuman ? "bg-slate-100 text-slate-700 rounded-bl-none" : "bg-[#10b98122] text-[#10b981] border border-[#10b98144] rounded-bl-none"
                                        }`}>
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
