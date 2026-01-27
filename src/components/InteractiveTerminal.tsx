"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAudio } from "./AudioProvider";

interface TerminalLine {
    type: "input" | "output" | "error";
    content: string;
}

interface TerminalProps {
    onCommand?: (cmd: string) => void;
}

const InteractiveTerminal: React.FC<TerminalProps> = ({ onCommand }) => {
    const { playKeyPress } = useAudio();



    const [history, setHistory] = useState<TerminalLine[]>([
        { type: "output", content: "WELCOME TO THARA_OS v4.0.1 (AUTHORIZED ACCESS ONLY)" },
        { type: "output", content: "TYPE 'help' TO VIEW AVAILABLE COMMANDS" },
    ]);
    const [input, setInput] = useState("");
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyPointer, setHistoryPointer] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const availableCommands = ["help", "whoami", "projects", "ls", "clear", "date", "game", "sudo", "matrix", "rolldice", "msg"];

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (commandHistory.length === 0) return;
            const newPointer = historyPointer === null ? commandHistory.length - 1 : Math.max(0, historyPointer - 1);
            setHistoryPointer(newPointer);
            setInput(commandHistory[newPointer]);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyPointer === null) return;
            const newPointer = Math.min(commandHistory.length - 1, historyPointer + 1);
            if (historyPointer === commandHistory.length - 1) {
                setHistoryPointer(null);
                setInput("");
            } else {
                setHistoryPointer(newPointer);
                setInput(commandHistory[newPointer]);
            }
        } else if (e.key === "Tab") {
            e.preventDefault();
            const match = availableCommands.find(cmd => cmd.startsWith(input.toLowerCase()));
            if (match) {
                setInput(match);
            }
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const cmd = input.toLowerCase().trim();
        const newHistory: TerminalLine[] = [...history, { type: "input", content: cmd }];

        // Add to history if not empty and distinct from last
        if (cmd && commandHistory[commandHistory.length - 1] !== cmd) {
            setCommandHistory(prev => [...prev, cmd]);
        }
        setHistoryPointer(null);

        switch (cmd) {
            case "help":
                newHistory.push({ type: "output", content: "AVAILABLE COMMANDS: whoami, projects, ls, rolldice, game, clear, date, sudo, msg [text]" });
                break;
            case "hello":
            case "hi":
            case "sawasdee":
            case "สวัสดี":
            case "ทักทาย":
                newHistory.push({ type: "output", content: "AI_RESPONSE: This is a Terminal. Please use the Chatbot (Bottom Right) to talk to me!" });
                break;
            case "whoami":
                newHistory.push({ type: "output", content: "USER: THARA | ROLE: SENIOR_DEV | STATUS: HACKING_THE_PLANET" });
                break;
            case "projects":
            case "ls":
                newHistory.push({ type: "output", content: "FILE_SYSTEM: [TeeRao, Heartopia-Piano, Rolldice, Personal-Portfolio]" });
                break;
            case "clear":
                setHistory([{ type: "output", content: "TERMINAL_RESET: SUCCESSFUL" }]);
                setInput("");
                return;
            case "date":
                newHistory.push({ type: "output", content: new Date().toString() });
                break;
            case "game":
                newHistory.push({ type: "output", content: "LAUNCHING SNAKE_GAME_V1.0..." });
                onCommand?.("game");
                break;
            case "sudo":
                newHistory.push({ type: "error", content: "PERMISSION_DENIED: USER IS NOT IN THE SUDOERS FILE. THIS INCIDENT WILL BE REPORTED." });
                break;
            case "matrix":
                newHistory.push({ type: "output", content: "RE-INITIALIZING MATRIX_RAIN... [CHECK BACKGROUND]" });
                onCommand?.("matrix");
                break;
            case "rolldice":
                newHistory.push(
                    { type: "output", content: "PROJECT: Rolldice (RedM Script)" },
                    { type: "output", content: "USAGE: Type /rollss in-game to open menu. Use ARROW_UP to change dice count." },
                    { type: "output", content: "SOURCE_CODE: [HTML Structure]" },
                    { type: "output", content: "------------------------------------------------" },
                    { type: "output", content: '<div class="dice-hud" id="diceHud">' },
                    { type: "output", content: '  <div class="dice-icon">🎲</div>' },
                    { type: "output", content: '  <div class="dice-count">' },
                    { type: "output", content: '    <span id="countValue">1</span>' },
                    { type: "output", content: '    <span class="label">DICE</span>' },
                    { type: "output", content: '  </div>' },
                    { type: "output", content: '</div>' },
                    { type: "output", content: '<div class="result-box hidden" id="resultBox">' },
                    { type: "output", content: '  <div class="result-header">DICE ROLLED</div>' },
                    { type: "output", content: '  <div class="dice-visuals" id="diceVisuals"></div>' },
                    { type: "output", content: '  <div class="result-total">TOTAL: <span id="totalValue">0</span></div>' },
                    { type: "output", content: '</div>' },
                    { type: "output", content: "------------------------------------------------" },
                    { type: "output", content: "STATUS: LOADED" }

                );
                onCommand?.("rolldice");
                break;

            default:
                if (cmd.startsWith("msg ")) {
                    const msg = input.substring(4);
                    newHistory.push({ type: "output", content: `MESSAGE_LOGGED: "${msg}"` });
                } else {
                    newHistory.push({ type: "error", content: `COMMAND_NOT_FOUND: ${cmd}` });
                }
        }

        setHistory(newHistory);
        setInput("");
    };

    return (
        <section id="terminal" className="py-24 px-4 bg-transparent font-mono relative z-10">
            <div className="max-w-4xl mx-auto">
                <div className="bg-[#0a0a0a]/40 border border-[#10b981] shadow-[0_0_20px_#10b98111] overflow-hidden backdrop-blur-md relative">
                    {/* Scanline overlay for terminal */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(16,185,129,0.1),rgba(16,185,129,0.02),rgba(16,185,129,0.1))] bg-[length:100%_2px,3px_100%] z-20" />

                    <div className="bg-[#10b981] text-black px-4 py-1 text-[10px] md:text-xs font-bold flex justify-between items-center relative z-30">
                        <span className="truncate">TERMINAL::GUESTBOOK_v4.2</span>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-black/30" />
                            <div className="w-2 h-2 rounded-full bg-black/30" />
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="h-[300px] md:h-[450px] overflow-y-auto p-4 text-[10px] md:text-sm space-y-1 custom-scrollbar relative z-10"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {history.map((line, i) => (
                            <div key={i} className={
                                line.type === "input" ? "text-white" :
                                    line.type === "error" ? "text-red-500" : "text-[#10b981]"
                            }>
                                {line.type === "input" && <span className="mr-2 text-[#10b98188] select-none">$</span>}
                                <span className="break-all">{line.content}</span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleCommand} className="border-t border-[#10b98122] p-4 flex gap-2 relative z-30 bg-[#0a0a0a]/20">
                        <span className="text-[#10b98188] select-none">$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                playKeyPress();
                            }}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent border-none outline-none flex-1 text-[#10b981] lowercase placeholder:text-[#10b98122]"
                            placeholder="type 'help'..."
                            autoFocus
                            autoComplete="off"
                        />
                    </form>
                </div>

            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #10b98133;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #10b981;
        }
      `}</style>
        </section>
    );
};

export default InteractiveTerminal;
