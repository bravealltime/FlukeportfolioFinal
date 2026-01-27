"use client";

import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { X, RefreshCw, Trophy, Eraser } from "lucide-react";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";

interface DoodleGameProps {
    isOpen: boolean;
    onClose: () => void;
}

const DoodleGame: React.FC<DoodleGameProps> = ({ isOpen, onClose }) => {
    const { isHuman } = useSettings();
    const { playPing, playSuccess, playError } = useAudio();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
    const [prediction, setPrediction] = useState<string>("");
    const [confidence, setConfidence] = useState<number>(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Initial load
    useEffect(() => {
        if (!isOpen) return;

        const loadModel = async () => {
            try {
                // Ensure backend is set (WebGL usually best)
                await tf.setBackend("webgl");
                const loadedModel = await mobilenet.load({
                    version: 2,
                    alpha: 1.0
                });
                setModel(loadedModel);
                setIsLoading(false);
            } catch (err) {
                console.error("Failed to load model:", err);
                setIsLoading(false);
            }
        };

        loadModel();

        // Setup canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

    }, [isOpen]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx?.beginPath(); // Reset path
            predict();
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

        ctx.lineWidth = 15;
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
                setConfidence(0);
            }
        }
    };

    const predict = async () => {
        if (!model || !canvasRef.current) return;

        // Ensure we are doing valid prediction
        const predictions = await model.classify(canvasRef.current);
        if (predictions && predictions.length > 0) {
            setPrediction(predictions[0].className);
            setConfidence(Math.round(predictions[0].probability * 100));
            playPing();

            if (predictions[0].probability > 0.6) {
                playSuccess();
            }
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
                        <Trophy size={20} /> AI Doodle Guesser
                    </h2>
                    <button onClick={onClose} className="hover:opacity-70">
                        <X size={24} className={isHuman ? "text-slate-500" : "text-[#10b981]"} />
                    </button>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 bg-gray-50 p-4 flex flex-col items-center justify-center relative">

                    {isLoading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80">
                            <div className="animate-spin text-4xl mb-2">⏳</div>
                            <p className="font-bold text-slate-500">Loading Brain...</p>
                        </div>
                    )}

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
                        className="bg-white shadow-lg border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair touch-none"
                    />

                    <p className="mt-2 text-xs text-gray-400">Draw something simple (e.g. Laptop, Cat, Mug)</p>
                </div>

                {/* Controls & Result */}
                <div className={`p-4 flex flex-col gap-4 ${isHuman ? "bg-slate-50" : "bg-black text-[#10b981]"
                    }`}>
                    <div className="flex justify-between items-center">
                        <div className="flex-1">
                            {prediction ? (
                                <div>
                                    <p className="text-xs opacity-70">I think it is...</p>
                                    <h3 className="text-2xl font-bold uppercase">{prediction}</h3>
                                    <div className="w-full bg-gray-200 h-2 rounded-full mt-1 overflow-hidden">
                                        <div
                                            className={`h-full ${confidence > 60 ? "bg-green-500" : "bg-yellow-500"}`}
                                            style={{ width: `${confidence}%` }}
                                        />
                                    </div>
                                    <p className="text-right text-xs mt-1">{confidence}% Confidence</p>
                                </div>
                            ) : (
                                <p className="opacity-50 italic">Draw something above...</p>
                            )}
                        </div>

                        <button
                            onClick={clearCanvas}
                            className={`p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 ${isHuman ? "bg-red-500 text-white" : "bg-[#10b981] text-black"
                                }`}
                        >
                            <Eraser size={24} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DoodleGame;
