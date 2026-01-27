"use client";

import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";

const GravityFall = () => {
    const { isHuman } = useSettings();
    const { playPing } = useAudio();
    const [isActive, setIsActive] = useState(false);
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const renderRef = useRef<Matter.Render | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);

    // Toggle Physics
    const toggleGravity = () => {
        if (isActive) {
            // Reset page (reload) to restore layout
            window.location.reload();
        } else {
            setIsActive(true);
            playPing();
        }
    };

    useEffect(() => {
        if (!isActive || !sceneRef.current) return;

        // capture all text/images on screen
        const elements = Array.from(document.querySelectorAll<HTMLElement>("h1, h2, h3, p, img, button, div.card, span.badge"));

        // Setup Matter JS
        const Engine = Matter.Engine,
            Render = Matter.Render,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Runner = Matter.Runner,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        const engine = Engine.create();
        const world = engine.world;
        engineRef.current = engine;

        // Create Renderer (Transparent full screen overlay)
        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: "transparent"
            }
        });
        renderRef.current = render;

        // Ground and Walls
        const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, { isStatic: true, render: { visible: false } });
        const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true, render: { visible: false } });
        const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true, render: { visible: false } });

        World.add(world, [ground, leftWall, rightWall]);

        // Convert DOM elements to Physics Bodies
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Ignore if off screen or too huge (like body/main container)
            if (rect.width > window.innerWidth * 0.9 || rect.height > window.innerHeight * 0.9) return;
            if (rect.top < 0 || rect.top > window.innerHeight) return;

            // Hide original element
            el.style.visibility = "hidden";

            // Create Body
            const body = Bodies.rectangle(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                rect.width,
                rect.height,
                {
                    restitution: 0.8,
                    render: {
                        // For simplicity in this version, we aren't cloning the visuals into canvas texture perfectly yet
                        // We will just show colored blocks for now, or users can implement html2canvas later for texture.
                        // To keep it "Performant", we use simple colored placeholders matching theme
                        fillStyle: isHuman ? "#3b82f6" : "#10b981",
                        strokeStyle: isHuman ? "#1e293b" : "#000000",
                        lineWidth: 1
                    }
                }
            );

            // Optional: Clone text content (Complex to render text in canvas without texture, skipping for stability)
            World.add(world, body);
        });

        // Mouse Control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });
        World.add(world, mouseConstraint);

        // Run
        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);
        runnerRef.current = runner;

        return () => {
            Render.stop(render);
            Runner.stop(runner);
        };

    }, [isActive, isHuman]);


    return (
        <>
            {/* The Trigger Button */}
            <button
                onClick={toggleGravity}
                className={`fixed top-28 left-4 z-[9999] px-4 py-2 rounded-full font-bold text-xs shadow-xl transition-all hover:scale-105 active:scale-95 ${isActive
                    ? "bg-red-500 text-white"
                    : isHuman ? "bg-white text-slate-800 border border-slate-200" : "bg-black text-[#10b981] border border-[#10b981]"
                    }`}
            >
                {isActive ? "RESET UNIVERSE" : "⚠ DO NOT PRESS"}
            </button>

            {/* Physics Overlay Canvas */}
            {isActive && (
                <div
                    ref={sceneRef}
                    className="fixed inset-0 z-[9998] pointer-events-auto cursor-grab active:cursor-grabbing"
                    style={{ background: isHuman ? "#f8fafc" : "#000" }}
                />
            )}
        </>
    );
};

export default GravityFall;
