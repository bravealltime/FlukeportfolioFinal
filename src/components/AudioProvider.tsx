"use client";

import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import { useSettings } from "./SettingsProvider";

interface AudioContextType {
    isEnabled: boolean;
    toggleAudio: () => void;
    playKeyPress: () => void;
    playPing: () => void;
    playHover: () => void;
    playSuccess: () => void;
    playError: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio must be used within AudioProvider");
    return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isEnabled, setIsEnabled] = useState(true); // Default to TRUE
    const { isHuman } = useSettings();
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Initialize Audio Context
    useEffect(() => {
        const initAudio = () => {
            if (!audioCtxRef.current) {
                const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
                audioCtxRef.current = new AudioContextClass();
            }
        };

        initAudio();

        // Resume listener
        const resumeAudio = () => {
            if (audioCtxRef.current?.state === "suspended") {
                audioCtxRef.current.resume().then(() => {
                    console.log("AudioContext resumed");
                }).catch(e => console.error(e));
            }
        };

        window.addEventListener('click', resumeAudio);
        window.addEventListener('keydown', resumeAudio);

        return () => {
            window.removeEventListener('click', resumeAudio);
            window.removeEventListener('keydown', resumeAudio);
        };
    }, []);

    const createBeep = (freq: number, duration: number, type: OscillatorType = "sine", vol: number = 0.1) => {
        if (!isEnabled || !audioCtxRef.current) return;

        const ctx = audioCtxRef.current;

        // Try to resume if somehow still suspended
        if (ctx.state === "suspended") {
            ctx.resume().catch(() => { });
        }

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            // Increased volume
            gain.gain.setValueAtTime(vol, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            console.error("Audio generation failed:", e);
        }
    };

    const playKeyPress = () => {
        if (isHuman) {
            // Human: Soft "Mechanical Click"
            createBeep(600 + Math.random() * 200, 0.05, "sine", 0.15);
        } else {
            // Hacker: Retro "Terminal Beep"
            createBeep(150 + Math.random() * 50, 0.05, "square", 0.1);
        }
    };

    const playPing = () => {
        if (isHuman) {
            createBeep(1000, 0.2, "sine", 0.2);
        } else {
            createBeep(880, 0.1, "square", 0.15);
        }
    };

    const playHover = () => {
        if (isHuman) {
            // Human: Very subtle high tick
            createBeep(800, 0.03, "sine", 0.05);
        } else {
            // Hacker: Quick low data blip
            createBeep(200, 0.03, "square", 0.05);
        }
    };

    const playSuccess = () => {
        if (isHuman) {
            createBeep(880, 0.1, "sine", 0.1);
            setTimeout(() => createBeep(1100, 0.2, "sine", 0.1), 100);
        } else {
            createBeep(440, 0.1, "square", 0.1);
            setTimeout(() => createBeep(880, 0.2, "square", 0.1), 80);
        }
    };

    const playError = () => {
        if (isHuman) {
            createBeep(300, 0.2, "triangle", 0.2);
        } else {
            createBeep(150, 0.15, "sawtooth", 0.2);
            setTimeout(() => createBeep(100, 0.3, "sawtooth", 0.2), 100);
        }
    };

    // Attach to window for legacy/external support
    useEffect(() => {
        (window as any).playKey = playKeyPress;
        (window as any).playPing = playPing;
        (window as any).playHover = playHover;
    }, [isHuman, isEnabled]);

    const toggleAudio = () => setIsEnabled(!isEnabled);

    return (
        <AudioContext.Provider value={{ isEnabled, toggleAudio, playKeyPress, playPing, playHover, playSuccess, playError }}>
            {children}
        </AudioContext.Provider>
    );
};
