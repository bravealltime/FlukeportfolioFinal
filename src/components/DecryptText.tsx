"use client";

import React, { useState, useEffect } from "react";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$@#%&*()_+-=[]{}|;:,.<>?";

interface DecryptTextProps {
    text: string;
    className?: string;
    delay?: number;
}

const DecryptText: React.FC<DecryptTextProps> = ({ text, className, delay = 0 }) => {
    const [displayText, setDisplayText] = useState("");
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => setIsStarted(true), delay);
        return () => clearTimeout(startTimeout);
    }, [delay]);

    useEffect(() => {
        if (!isStarted) return;

        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText((prev) =>
                text
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return characters[Math.floor(Math.random() * characters.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 30);

        return () => clearInterval(interval);
    }, [text, isStarted]);

    return <span className={className}>{displayText || (isStarted ? "" : "")}</span>;
};

export default DecryptText;
