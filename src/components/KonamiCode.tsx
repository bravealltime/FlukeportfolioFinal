"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "./ToastProvider";
import { useAudio } from "./AudioProvider";
import { useSettings } from "./SettingsProvider";

const KONAMI_CODE = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "b", "a"
];

const KonamiCode = () => {
    const [input, setInput] = useState<string[]>([]);
    const [godMode, setGodMode] = useState(false);
    const { addToast } = useToast();
    const { playSuccess, playKeyPress } = useAudio();
    const { isHuman } = useSettings();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            playKeyPress();

            setInput((prev) => {
                const newInput = [...prev, e.key];
                // Keep only the last N keys
                if (newInput.length > KONAMI_CODE.length) {
                    newInput.shift();
                }
                return newInput;
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [playKeyPress]);

    useEffect(() => {
        if (input.join("") === KONAMI_CODE.join("")) {
            if (!godMode) {
                activateGodMode();
            }
            setInput([]); // Reset
        }
    }, [input, godMode]);

    const activateGodMode = () => {
        setGodMode(true);
        playSuccess();
        addToast("GOD MODE ACTIVATED: UNLIMITED POWER!", "success");

        // Apply Rainbow Effect to Body
        document.body.style.filter = "hue-rotate(0deg)";
        document.body.style.animation = "rainbow 2s linear infinite";

        // Inject animation style if not present
        if (!document.getElementById("god-mode-style")) {
            const style = document.createElement("style");
            style.id = "god-mode-style";
            style.innerHTML = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    };

    return null;
};

export default KonamiCode;
