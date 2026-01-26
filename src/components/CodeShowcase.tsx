"use client";

import React, { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Terminal, Code, Cpu, Globe } from "lucide-react";
import { useAudio } from "./AudioProvider";


const codeSnippets = [
    {
        id: "piano",
        title: "Heartopia Piano Logic",
        lang: "python",
        icon: <Cpu size={18} />,
        code: `def play_midi(midi_file):
    # Auto-Transpose Logic
    mid = mido.MidiFile(midi_file)
    for msg in mid.play():
        if msg.type == 'note_on':
            # Map MIDI note to Game Keyboard
            key = note_to_key(msg.note + transpose_offset)
            keyboard.press(key)
            time.sleep(msg.time)
            keyboard.release(key)`,
    },
    {
        id: "teerao",
        title: "Firebase Billing Hook",
        lang: "typescript",
        icon: <Globe size={18} />,
        code: `export const useInvoice = (roomId: string) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "invoices"),
      where("roomId", "==", roomId),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs[0]?.data();
      setInvoice(data ? (data as Invoice) : null);
    });
  }, [roomId]);

  return invoice;
};`,
    },
    {
        id: "portfolio",
        title: "Rainbow Dust Effect",
        lang: "javascript",
        icon: <Code size={18} />,
        code: `const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.life -= 0.01;
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
    ctx.fill();
  });
  requestAnimationFrame(animate);
};`,
    },
];

const CodeShowcase = () => {
    const { playPing } = useAudio();
    const [activeTab, setActiveTab] = useState(codeSnippets[0]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section id="code-showcase" className="py-24 px-4 bg-transparent font-mono relative z-10">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 flex flex-col items-center text-center"
                >
                    <div className="flex items-center gap-2 text-[#10b981] font-mono text-sm mb-4">
                        <Terminal size={16} />
                        <span>[ GET /api/v1/source-code ]</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-[#10b981] mb-4 uppercase tracking-tighter">เจาะลึกเบื้องหลังโค้ด</h2>
                    <p className="text-[#10b98188] max-w-2xl">
                        ตัวอย่าง Logic ที่น่าสนใจจากโปรเจกต์ต่างๆ ที่ผมได้พัฒนา
                        เน้นความคลีนและประสิทธิภาพในการทำงาน
                    </p>
                </motion.div>

                <div className="bg-[#0a0a0a]/40 border border-[#10b98144] overflow-hidden shadow-2xl hacker-border backdrop-blur-md">
                    {/* Terminal Header */}
                    <div className="bg-[#10b98111] px-6 py-4 border-b border-[#10b98144] flex items-center justify-between">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-950/50 border border-red-500/30" />
                            <div className="w-3 h-3 rounded-full bg-amber-950/50 border border-amber-500/30" />
                            <div className="w-3 h-3 rounded-full bg-emerald-950/50 border border-emerald-500/30" />
                        </div>
                        <div className="text-[#10b98166] font-mono text-xs hidden md:block">
                            ~/root/projects/{activeTab.id}/{activeTab.lang === "python" ? "main.py" : "index.ts"}
                        </div>
                        <div className="w-12" />
                    </div>

                    <div className="flex flex-col md:flex-row min-h-[400px]">
                        {/* Sidebar Tabs */}
                        <div className="w-full md:w-64 border-r border-[#10b98144] p-2 space-y-1">
                            {codeSnippets.map((snippet) => (
                                <button
                                    key={snippet.id}
                                    onMouseEnter={playPing}
                                    onClick={() => setActiveTab(snippet)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 border transition-all ${activeTab.id === snippet.id
                                        ? "bg-[#10b98122] text-[#10b981] border-[#10b98188]"
                                        : "text-[#10b98144] border-transparent hover:text-[#10b98188] hover:bg-[#10b98108]"
                                        }`}
                                >
                                    {snippet.icon}
                                    <span className="text-xs font-bold uppercase tracking-widest">{snippet.title}</span>
                                </button>
                            ))}
                        </div>

                        {/* Code Content */}
                        <div className="flex-1 p-4 md:p-6 bg-transparent relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="font-mono text-sm leading-relaxed"
                                >
                                    {mounted ? (
                                        <SyntaxHighlighter
                                            language={activeTab.lang}
                                            style={atomDark}
                                            customStyle={{
                                                background: "transparent",
                                                padding: 0,
                                                margin: 0,
                                            }}
                                        >
                                            {activeTab.code}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <div className="text-[#10b98144]">Loading code block...</div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default CodeShowcase;
