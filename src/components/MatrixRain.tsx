"use client";

import React, { useEffect, useRef } from "react";

interface MatrixProps {
    isVisible?: boolean;
    isIntense?: boolean;
}

const MatrixRain: React.FC<MatrixProps> = ({ isVisible, isIntense }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!isVisible) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$@#%&*()_+-=[]{}|;:,.<>?";
        const fontSize = 16;
        const columns = Math.floor(canvas.width / fontSize);
        const drops: number[] = new Array(columns).fill(0);

        let animationFrameId: number;
        let lastTime = 0;
        const fps = isIntense ? 50 : 30;
        const interval = 1000 / fps;

        const animate = (time: number) => {
            const deltaTime = time - lastTime;

            if (deltaTime > interval) {
                lastTime = time - (deltaTime % interval);

                ctx.fillStyle = isIntense ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.05)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = "#10b981";
                ctx.font = `${fontSize}px monospace`;

                for (let i = 0; i < drops.length; i++) {
                    const text = characters.charAt(Math.floor(Math.random() * characters.length));
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                    if (drops[i] * fontSize > canvas.height && Math.random() > (isIntense ? 0.95 : 0.975)) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Recalculate drops on resize to avoid layout issues
            const newColumns = Math.floor(canvas.width / fontSize);
            if (newColumns > drops.length) {
                const additionalDrops = new Array(newColumns - drops.length).fill(0);
                drops.push(...additionalDrops);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, [isVisible, isIntense]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${isVisible ? (isIntense ? "opacity-60" : "opacity-30") : "opacity-0"}`}
        />



    );
};

export default MatrixRain;
