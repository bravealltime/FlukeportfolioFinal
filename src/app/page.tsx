"use client";

import Navbar from "@/components/Navbar";

import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import MatrixRain from "@/components/MatrixRain";
import CodeShowcase from "@/components/CodeShowcase";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import SystemStatus from "@/components/SystemStatus";
import { useSettings } from "@/components/SettingsProvider";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";


export default function Home() {
  const [matrixFullscreen, setMatrixFullscreen] = useState(false);

  const { isHuman } = useSettings();


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Simple hidden command listener
      if (e.key === "m") {
        // Checking for "matrix" could be more complex, but this is a start
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    // Main Container: กำหนดพื้นหลังตามโหมด (Human: ขาว, Hacker: ดำ)
    <main className={`min-h-screen ${isHuman ? "bg-white selection:bg-slate-200 selection:text-black" : "bg-black selection:bg-[#00ff41] selection:text-black"} relative overflow-x-hidden font-mono transition-colors duration-500`}>
      {!isHuman && <MatrixRain isVisible={matrixFullscreen} isIntense={matrixFullscreen} />}

      {/* Background Overlay: ใช้เฉพาะโหมด Hacker เพื่อให้ออ่านง่ายขึ้น */}
      {!isHuman && (
        <div className="fixed inset-0 bg-black/60 pointer-events-none z-[1] transition-colors duration-500" />
      )}

      {/* Vignette Effect - ปิดในโหมด Human (Disable in Human Mode) */}
      {!isHuman && <div className="fixed inset-0 hacker-vignette z-[5] pointer-events-none" />}

      {/* Global Scanline Overlay - ปิดในโหมด Human */}
      {!isHuman && <div className="fixed inset-0 pointer-events-none z-[10000] opacity-[0.08] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,255,65,0.05),rgba(0,255,65,0.02),rgba(0,255,65,0.05))] bg-[length:100%_4px,4px_100%]" />}

      {/* Animated Scanner Line - เส้นสแกนวิ่งลง (เฉพาะ Hacker) */}
      {!isHuman && <motion.div
        animate={{ y: ["0%", "100%", "0%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="fixed inset-x-0 h-[2px] bg-[#00ff4111] z-[10001] pointer-events-none shadow-[0_0_15px_#00ff41]"
      />}


      <div className="relative z-10">
        <Navbar />
        <Hero />

        {/* Hacker Only Components - ส่วนประกอบสำหรับโหมด Hacker เท่านั้น */}
        {!isHuman && (
          <>
            <InteractiveTerminal onCommand={(cmd) => {
              if (cmd === "matrix") {
                setMatrixFullscreen(prev => !prev);
              }
            }} />
            <CodeShowcase />
            <SystemStatus />
          </>
        )}

        <Projects />
        <Skills />
        <Contact />
      </div>
    </main>
  );
}

