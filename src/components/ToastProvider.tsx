"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, Info, Terminal } from "lucide-react";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const { isHuman } = useSettings();
    const { playPing } = useAudio(); // We'll add playSuccess/Error later

    const addToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const getIcon = (type: ToastType) => {
        switch (type) {
            case "success": return <CheckCircle size={18} />;
            case "error": return <AlertTriangle size={18} />;
            case "warning": return <AlertTriangle size={18} />;
            default: return <Info size={18} />;
        }
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 p-4 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            layout
                            className={`pointer-events-auto min-w-[300px] max-w-sm p-4 rounded-lg shadow-lg backdrop-blur-md flex items-start gap-3 border ${isHuman
                                    ? "bg-white/90 border-slate-200 text-slate-800"
                                    : "bg-[#0a0a0a]/90 border-[#10b981] text-[#10b981] shadow-[0_0_15px_#10b98133]"
                                }`}
                        >
                            <div className={`mt-1 ${isHuman
                                ? toast.type === "success" ? "text-green-500" : toast.type === "error" ? "text-red-500" : "text-blue-500"
                                : "text-[#10b981]"
                                }`}>
                                {isHuman ? getIcon(toast.type) : <Terminal size={16} />}
                            </div>

                            <div className="flex-1">
                                {!isHuman && (
                                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
                                        [{toast.type.toUpperCase()}]
                                    </div>
                                )}
                                <p className={`text-sm ${isHuman ? "font-sans font-medium" : "font-mono"}`}>
                                    {toast.message}
                                </p>
                            </div>

                            <button
                                onClick={() => removeToast(toast.id)}
                                className={`hover:opacity-70 transition-opacity ${isHuman ? "text-slate-400" : "text-[#10b981]"}`}
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
