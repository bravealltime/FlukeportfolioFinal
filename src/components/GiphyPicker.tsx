"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";

const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY || "cw777777777777777777777777777777";

interface GiphyPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

const GiphyPicker: React.FC<GiphyPickerProps> = ({ isOpen, onClose, onSelect }) => {
    const { isHuman } = useSettings();
    const { playHover, playKeyPress, playPing, playSuccess } = useAudio();
    const [query, setQuery] = useState("");
    const [gifs, setGifs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchGifs = useCallback(async (searchQuery: string) => {
        setIsLoading(true);
        setError("");
        try {
            const endpoint = searchQuery
                ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=20&rating=g`
                : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20&rating=g`;

            const res = await fetch(endpoint);
            const data = await res.json();

            if (data.meta.status === 401) {
                throw new Error("API Key ไม่ถูกต้อง (Unauthorized)");
            }
            if (data.meta.status !== 200) {
                throw new Error(data.meta.msg || "Failed to fetch GIFs");
            }

            setGifs(data.data);
        } catch (err: any) {
            console.error("Giphy fetch error:", err);
            setError("ไม่สามารถโหลด GIF ได้ในขณะนี้");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchGifs("");
        }
    }, [isOpen, fetchGifs]);

    // Debounced search
    useEffect(() => {
        if (!isOpen) return;
        const timer = setTimeout(() => {
            if (query.length >= 2) {
                fetchGifs(query);
            } else if (query.length === 0) {
                fetchGifs("");
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [query, isOpen, fetchGifs]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className={`relative w-full max-w-2xl max-h-[80vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl ${isHuman ? "bg-white" : "bg-black border border-[#10b981] text-[#10b981]"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={`p-6 border-b flex items-center justify-between ${isHuman ? "bg-slate-50 border-slate-200" : "bg-[#10b98111] border-[#10b98144]"
                        }`}>
                        <div className="flex items-center gap-3">
                            <Sparkles size={20} className={isHuman ? "text-blue-600" : "text-[#10b981]"} />
                            <h2 className="font-bold text-lg uppercase tracking-wider">
                                {isHuman ? "ค้นหา GIF" : "ค้นหา_มีเดีย_GIPHY"}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            onMouseEnter={() => playHover()}
                            className={`p-2 rounded-full transition-colors ${isHuman ? "hover:bg-slate-200 text-slate-500" : "hover:bg-[#10b98122] text-[#10b981]"
                                }`}
                            aria-label={isHuman ? "ปิดค้นหา GIF" : "สิ้นสุด_การค้นหา_มีเดีย"}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="p-4">
                        <div className="relative">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isHuman ? "text-slate-400" : "text-[#10b98188]"
                                }`} size={18} />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    playKeyPress();
                                }}
                                placeholder={isHuman ? "ค้นหา GIF..." : "ป้อน_คำ_ค้นหา..."}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none transition-all ${isHuman
                                    ? "bg-slate-50 border-slate-200 focus:border-blue-500"
                                    : "bg-black border-[#10b98144] focus:border-[#10b981] text-[#10b981]"
                                    } font-mono`}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-[300px]">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center p-12 space-y-4 opacity-50 h-full">
                                <Loader2 className={`w-8 h-8 animate-spin ${isHuman ? "text-blue-600" : "text-[#10b981]"}`} />
                                <span className="text-xs uppercase tracking-widest font-mono">
                                    {isHuman ? "กำลังโหลด..." : "กำลัง_ดึง_ข้อมูล..."}
                                </span>
                            </div>
                        )}

                        {error && (
                            <div className="flex flex-col items-center justify-center p-12 text-center text-red-500 h-full">
                                <p className="font-bold mb-2">Error</p>
                                <p className="text-sm opacity-70">{error}</p>
                            </div>
                        )}

                        {!isLoading && !error && gifs.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-12 text-center opacity-40 h-full">
                                <ImageIcon size={48} className="mb-4" />
                                <p className="text-sm">{isHuman ? "ไม่พบผลลัพธ์" : "ไม่_พบ_เซกเตอร์_ข้อมูล"}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {gifs.map((gif) => (
                                <motion.div
                                    key={gif.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        onSelect(gif.images.fixed_height.url);
                                        playSuccess();
                                        onClose();
                                    }}
                                    className={`relative aspect-video cursor-pointer rounded-lg overflow-hidden border ${isHuman ? "border-slate-100" : "border-[#10b98122] hover:border-[#10b981]"
                                        }`}
                                >
                                    <img
                                        src={gif.images.fixed_height_small.url}
                                        alt={gif.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`p-3 text-[10px] text-center opacity-40 border-t ${isHuman ? "bg-slate-50 border-slate-200" : "bg-black border-[#10b98144]"
                        }`}>
                        POWERED BY GIPHY
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GiphyPicker;
