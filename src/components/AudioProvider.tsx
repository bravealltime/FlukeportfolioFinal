"use client";

import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import { useSettings } from "./SettingsProvider";

interface AudioContextType {
    isEnabled: boolean;
    isMusicEnabled: boolean;
    toggleAudio: () => void;
    toggleMusic: () => void;
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
    const [isEnabled, setIsEnabled] = useState(true); // Master Audio
    const [isMusicEnabled, setIsMusicEnabled] = useState(false); // BGM specific
    const { isHuman } = useSettings();
    const audioCtxRef = useRef<AudioContext | null>(null);
    const musicNodesRef = useRef<any[]>([]); // Keep track of oscillators/gains to stop them

    // Initialize Audio Context
    useEffect(() => {
        const initAudio = () => {
            if (!audioCtxRef.current) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // Stop all running music nodes
    const stopMusic = () => {
        musicNodesRef.current.forEach(node => {
            try {
                if (node.stop) node.stop();
                if (node.disconnect) node.disconnect();
            } catch (e) {
                // Ignore errors if already stopped
            }
        });
        musicNodesRef.current = [];
    };

    // Start Procedural BGM
    const startMusic = () => {
        if (!isEnabled || !isMusicEnabled || !audioCtxRef.current) return;
        stopMusic(); // Clear previous

        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(0.05, now + 2); // Soft fade in
        masterGain.connect(ctx.destination);
        musicNodesRef.current.push(masterGain);

        if (isHuman) {
            // HUMAN MODE: Lo-fi Calm (Sine Waves + Pink Noise feeling)
            const osc1 = ctx.createOscillator();
            osc1.type = "sine";
            osc1.frequency.setValueAtTime(220, now); // A3
            osc1.connect(masterGain);
            osc1.start();

            const osc2 = ctx.createOscillator();
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(329.63, now); // E4
            osc2.connect(masterGain);
            osc2.start();

            // Add subtle LFO for movement
            const lfo = ctx.createOscillator();
            lfo.type = "sine";
            lfo.frequency.value = 0.5; // Slow breath
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 0.02;
            lfo.connect(lfoGain);
            lfoGain.connect(masterGain.gain);
            lfo.start();

            musicNodesRef.current.push(osc1, osc2, lfo, lfoGain);
        } else {
            // HACKER MODE: Dark Drone (Sawtooth + Low Bass)
            const osc1 = ctx.createOscillator();
            osc1.type = "sawtooth";
            osc1.frequency.setValueAtTime(55, now); // Deep Bass

            const lowPass = ctx.createBiquadFilter();
            lowPass.type = "lowpass";
            lowPass.frequency.value = 200;

            osc1.connect(lowPass);
            lowPass.connect(masterGain);
            osc1.start();

            const osc2 = ctx.createOscillator();
            osc2.type = "square";
            osc2.frequency.setValueAtTime(110, now);
            const osc2Gain = ctx.createGain();
            osc2Gain.gain.value = 0.3;
            osc2.connect(osc2Gain);
            osc2Gain.connect(masterGain);
            osc2.start();

            musicNodesRef.current.push(osc1, osc2, lowPass, osc2Gain);
        }
    };

    // Handle Music State Changes
    useEffect(() => {
        if (isEnabled && isMusicEnabled) {
            startMusic();
        } else {
            stopMusic();
        }
        return () => stopMusic();
    }, [isEnabled, isMusicEnabled, isHuman]); // Restart when mode changes

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).playKey = playKeyPress;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).playPing = playPing;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).playHover = playHover;
    }, [isHuman, isEnabled]);

    const toggleAudio = () => setIsEnabled(!isEnabled);
    const toggleMusic = () => setIsMusicEnabled(!isMusicEnabled);

    return (
        <AudioContext.Provider value={{ isEnabled, isMusicEnabled, toggleAudio, toggleMusic, playKeyPress, playPing, playHover, playSuccess, playError }}>
            {children}
        </AudioContext.Provider>
    );
};
