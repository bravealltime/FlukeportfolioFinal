"use client";

import React, { useState, useEffect, createContext, useContext } from "react";

interface AudioContextType {
    isEnabled: boolean;
    toggleAudio: () => void;
    playKeyPress: () => void;
    playPing: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio must be used within AudioProvider");
    return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [keyAudio, setKeyAudio] = useState<HTMLAudioElement | null>(null);
    const [pingAudio, setPingAudio] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        // We'll use high-frequency synth-like beeps instead of external files for simplicity and reliability
        const createBeep = async (freq: number, duration: number, type: OscillatorType = "square") => {
            if (!isEnabled) return;
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            const ctx = new AudioContextClass();

            if (ctx.state === "suspended") {
                await ctx.resume();
            }

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        };

        (window as any).playKey = () => createBeep(150 + Math.random() * 50, 0.05, "sine");
        (window as any).playPing = () => createBeep(880, 0.1, "sine");


    }, [isEnabled]);

    const toggleAudio = () => setIsEnabled(!isEnabled);
    const playKeyPress = () => (window as any).playKey?.();
    const playPing = () => (window as any).playPing?.();

    return (
        <AudioContext.Provider value={{ isEnabled, toggleAudio, playKeyPress, playPing }}>
            {children}
        </AudioContext.Provider>
    );
};
