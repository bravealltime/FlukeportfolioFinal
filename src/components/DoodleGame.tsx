"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, Trophy, Eraser, BrainCircuit, Loader2 } from "lucide-react";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";
import { guessDoodle } from "@/app/actions";

interface DoodleGameProps {
    isOpen: boolean;
    onClose: () => void;
}

const DoodleGame: React.FC<DoodleGameProps> = ({ isOpen, onClose }) => {
    const { isHuman } = useSettings();
    const { playPing, playSuccess, playError } = useAudio();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [prediction, setPrediction] = useState<string>("");
    const [isDrawing, setIsDrawing] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Used for Gemini Loading

    // Setup canvas on open
    useEffect(() => {
        if (!isOpen) return;
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
        setPrediction("");
    }, [isOpen]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
        // Reset prediction when starting to draw new things ?? Maybe keep it.
        // setPrediction(""); 
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx?.beginPath(); // Reset path
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Get coordinates
        let clientX, clientY;
        if ('touches' in e) {
            const touch = e.touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineWidth = isHuman ? 5 : 3;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                setPrediction("");
            }
        }
        playPing();
    };

    const handleGuess = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setIsLoading(true);
        setPrediction(""); // Clear previous prediction
        playPing();

        try {
            const base64Image = canvas.toDataURL("image/png");
            const result = await guessDoodle(base64Image);

            if (result) {
                setPrediction(result);
                playSuccess();
            } else {
                setPrediction("ไม่แน่ใจครับ...");
                playError();
            }
        } catch (error) {
            console.error("Error guessing doodle:", error);
            setPrediction("เกิดข้อผิดพลาดในการทาย");
            playError();
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isHuman ? "bg-white" : "bg-black border border-[#10b981]"
                }`}>

                {/* Header */}
                <div className={`p-4 flex justify-between items-center ${isHuman ? "bg-slate-100" : "bg-[#10b98111] border-b border-[#10b98144]"
                    }`}>
                    <h2 className={`font-bold flex items-center gap-2 ${isHuman ? "text-slate-800" : "text-[#10b981]"
                        }`}>
                        <BrainCircuit size={20} /> AI ทายภาพ (Powered by Gemini)
                    </h2>
                    <button onClick={onClose} className="hover:opacity-70">
                        <X size={24} className={isHuman ? "text-slate-500" : "text-[#10b981]"} />
                    </button>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 bg-gray-50 p-4 flex flex-col items-center justify-center relative min-h-[350px]">
                    <canvas
                        ref={canvasRef}
                        width={300}
                        height={300}
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseOut={stopDrawing}
                        onMouseMove={draw}
                        onTouchStart={startDrawing}
                        onTouchEnd={stopDrawing}
                        onTouchMove={draw}
                        className={`bg-white shadow-lg border-2 ${isHuman ? "border-dashed border-gray-300" : "border-[#10b981]"} rounded-lg cursor-crosshair touch-none`}
                    />

                    <p className="mt-2 text-xs text-gray-400">วาดอะไรก็ได้ที่อยากให้ AI ทาย...</p>
                </div>

                {/* Controls & Result */}
                <div className={`p-4 flex flex-col gap-4 ${isHuman ? "bg-slate-50" : "bg-[#050505] border-t border-[#10b98144]"
                    }`}>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            {isLoading ? (
                                <div className="flex items-center gap-2 text-sm text-slate-500 animate-pulse">
                                    <Loader2 size={16} className="animate-spin" />
                                    กำลังวิเคราะห์...
                                </div>
                            ) : prediction ? (
                                <div>
                                    <p className={`text-xs opacity-70 ${isHuman ? "text-slate-500" : "text-[#10b981aa]"}`}>ผมคิดว่าคือ...</p>
                                    <h3 className={`text-xl font-bold ${isHuman ? "text-slate-800" : "text-[#10b981]"}`}>{prediction}</h3>
                                </div>
                            ) : (
                                <p className={`text-sm opacity-50 italic ${isHuman ? "text-slate-400" : "text-[#10b98144]"}`}>
                                    วาดเสร็จแล้วกดปุ่ม "ทายซิ"
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={clearCanvas}
                                className={`p-3 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 ${isHuman ? "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50" : "bg-black text-[#10b981] border border-[#10b981] hover:bg-[#10b98111]"
                                    }`}
                                title="ลบกระดาน"
                            >
                                <Eraser size={20} />
                            </button>

                            <button
                                onClick={handleGuess}
                                disabled={isLoading}
                                className={`px-6 py-2 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${isHuman
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200"
                                    : "bg-[#10b981] text-black hover:bg-[#34d399] hover:shadow-[0_0_15px_#10b981]"
                                    } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <BrainCircuit size={20} />}
                                ทายซิ!
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DoodleGame;
