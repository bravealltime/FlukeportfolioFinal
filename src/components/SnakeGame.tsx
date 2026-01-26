"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SnakeGameProps {
    onClose: () => void;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20; // px
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

const SnakeGame: React.FC<SnakeGameProps> = ({ onClose }) => {
    const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Point>({ x: 15, y: 15 });
    const [direction, setDirection] = useState<Point>({ x: 1, y: 0 }); // Moving Right
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize/Reset Game
    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setDirection({ x: 1, y: 0 });
        setScore(0);
        setGameOver(false);
        setIsPaused(false);
        spawnFood();
    };

    const spawnFood = () => {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);
        setFood({ x, y });
    };

    // Keyboard Controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowUp":
                    if (direction.y === 0) setDirection({ x: 0, y: -1 });
                    break;
                case "ArrowDown":
                    if (direction.y === 0) setDirection({ x: 0, y: 1 });
                    break;
                case "ArrowLeft":
                    if (direction.x === 0) setDirection({ x: -1, y: 0 });
                    break;
                case "ArrowRight":
                    if (direction.x === 0) setDirection({ x: 1, y: 0 });
                    break;
                case "Escape":
                    onClose();
                    break;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [direction, onClose]);

    // Game Loop
    useEffect(() => {
        if (gameOver || isPaused) return;

        gameLoopRef.current = setInterval(() => {
            setSnake((prevSnake) => {
                const head = prevSnake[0];
                const newHead = { x: head.x + direction.x, y: head.y + direction.y };

                // Check Wall Collision
                if (
                    newHead.x < 0 ||
                    newHead.x >= GRID_SIZE ||
                    newHead.y < 0 ||
                    newHead.y >= GRID_SIZE
                ) {
                    setGameOver(true);
                    return prevSnake;
                }

                // Check Self Collision
                if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
                    setGameOver(true);
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                // Check Food Collision
                if (newHead.x === food.x && newHead.y === food.y) {
                    setScore((prev) => prev + 1);
                    spawnFood();
                    // Don't pop tail (grow)
                } else {
                    newSnake.pop(); // Remove tail
                }

                return newSnake;
            });
        }, INITIAL_SPEED);

        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [direction, food, gameOver, isPaused]);

    // High Score Sync
    useEffect(() => {
        const saved = localStorage.getItem("snake_highscore");
        if (saved) setHighScore(parseInt(saved));
    }, []);

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("snake_highscore", score.toString());
        }
    }, [score, highScore]);


    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-sm font-mono"
            >
                <div className="relative border-2 border-[#10b981] p-2 rounded-lg shadow-[0_0_30px_#10b98133]">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-2 text-[#10b981] text-xs uppercase tracking-widest">
                        <span>SNAKE_V1.0.EXE</span>
                        <div className="flex gap-4">
                            <span>Score: {score}</span>
                            <span>HI: {highScore}</span>
                        </div>
                        <button onClick={onClose} className="hover:text-white"><X size={16} /></button>
                    </div>

                    {/* Game Board */}
                    <div
                        className="bg-[#0a0a0a] relative grid"
                        style={{
                            width: GRID_SIZE * CELL_SIZE,
                            height: GRID_SIZE * CELL_SIZE,
                            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                            border: "1px solid #10b98144"
                        }}
                    >
                        {/* Snake */}
                        {snake.map((segment, i) => (
                            <div
                                key={`${segment.x}-${segment.y}-${i}`}
                                style={{
                                    gridColumnStart: segment.x + 1,
                                    gridRowStart: segment.y + 1,
                                    backgroundColor: i === 0 ? "#10b981" : "#10b981aa"
                                }}
                                className="w-full h-full border border-black"
                            />
                        ))}

                        {/* Food */}
                        <div
                            style={{
                                gridColumnStart: food.x + 1,
                                gridRowStart: food.y + 1,
                            }}
                            className="w-full h-full bg-red-500 animate-pulse rounded-full"
                        />

                        {/* Grid Overlay (Scanlines) */}
                        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(16,185,129,0.06),rgba(16,185,129,0.02),rgba(16,185,129,0.06))] bg-[length:100%_4px,4px_100%]" />
                    </div>

                    {/* Game Over Overlay */}
                    {gameOver && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-[#10b981]">
                            <h2 className="text-3xl font-bold mb-4 animate-pulse">GAME OVER</h2>
                            <p className="mb-6">FINAL SCORE: {score}</p>
                            <button
                                onClick={resetGame}
                                className="px-6 py-2 border border-[#10b981] hover:bg-[#10b981] hover:text-black transition-all text-sm font-bold uppercase"
                            >
                                TRY AGAIN
                            </button>
                        </div>
                    )}

                    {/* Controls Hint */}
                    <div className="mt-2 text-[#10b98166] text-[10px] text-center">
                        USE ARROW KEYS TO MOVE | ESC TO CLOSE
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SnakeGame;
