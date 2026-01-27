"use client";

import React, { useState, useEffect } from "react";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";

interface TypewriterTextProps {
    text: string;
    className?: string;
    as?: React.ElementType;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, className, as: Component = "h2" }) => {
    const [displayText, setDisplayText] = useState(text);
    const { isHuman } = useSettings();
    const { playHover } = useAudio();
    const [isAnimating, setIsAnimating] = useState(false);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

    const handleHover = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        playHover();

        let iterations = 0;
        const maxIterations = 10; // How many scrambles before settling

        const interval = setInterval(() => {
            setDisplayText(prev =>
                text.split("").map((char, index) => {
                    if (index < iterations) {
                        return text[index];
                    }
                    if (isHuman) {
                        // Human Mode: Just simple retyping/blink
                        return Math.random() > 0.5 ? char : "_";
                    }
                    // Hacker Mode: Matrix scramble
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );

            if (iterations >= text.length) {
                clearInterval(interval);
                setIsAnimating(false);
                setDisplayText(text);
            }

            iterations += 1 / 2;
        }, 30);
    };

    return (
        <Component
            className={`${className} cursor-default transition-colors duration-300 hover:text-[#10b981]`}
            onMouseEnter={handleHover}
        >
            {displayText}
        </Component>
    );
};

export default TypewriterText;
