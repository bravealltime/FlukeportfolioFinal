"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import GlitchOverlay from "@/components/GlitchOverlay";
import WeatherWidget from "@/components/WeatherWidget";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor from "@/components/CustomCursor";
import { useSettings } from "@/components/SettingsProvider";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import QuickNav from "@/components/QuickNav";
// Dynamic Imports for Sections & Components
const Projects = dynamic(() => import("@/components/Projects"), { ssr: false });
const Skills = dynamic(() => import("@/components/Skills"), { ssr: false });
const PCSpecs = dynamic(() => import("@/components/PCSpecs"), { ssr: false });
const Timeline = dynamic(() => import("@/components/Timeline"), { ssr: false });
const BlogSection = dynamic(() => import("@/components/BlogSection"), { ssr: false });
const GitHubActivity = dynamic(() => import("@/components/GitHubActivity"), { ssr: false });
const Guestbook = dynamic(() => import("@/components/Guestbook"), { ssr: false });
const ContactForm = dynamic(() => import("@/components/ContactForm"), { ssr: false });
const MatrixRain = dynamic(() => import("@/components/MatrixRain"), { ssr: false });
const CodeShowcase = dynamic(() => import("@/components/CodeShowcase"), { ssr: false });
const InteractiveTerminal = dynamic(() => import("@/components/InteractiveTerminal"), { ssr: false });
const SystemStatus = dynamic(() => import("@/components/SystemStatus"), { ssr: false });
const RolldiceDemo = dynamic(() => import("@/components/RolldiceDemo"), { ssr: false });
const SnakeGame = dynamic(() => import("@/components/SnakeGame"), { ssr: false });
const GravityFall = dynamic(() => import("@/components/GravityFall"), { ssr: false });
const GenerativeArt = dynamic(() => import("@/components/GenerativeArt"), { ssr: false });

export default function Home() {
  const [matrixFullscreen, setMatrixFullscreen] = useState(false);
  const [showRolldice, setShowRolldice] = useState(false);
  const [showSnake, setShowSnake] = useState(false);

  const { isHuman } = useSettings();
  const [shouldShowEffects, setShouldShowEffects] = useState(false);


  useEffect(() => {
    // Delay heavy background effects
    const timer = setTimeout(() => {
      setShouldShowEffects(true);
    }, 1500);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Simple hidden command listener
      if (e.key === "m") {
        // Checking for "matrix" could be more complex, but this is a start
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, []);

  return (
    // Main Container: กำหนดพื้นหลังตามโหมด (Human: ขาว, Hacker: ดำ)
    <main className={`min-h-screen ${isHuman ? "bg-white selection:bg-slate-200 selection:text-black" : "bg-[#0a0a0a] selection:bg-[#10b981] selection:text-black"} relative overflow-x-hidden font-mono transition-colors duration-500`}>
      <CustomCursor />
      <GlitchOverlay />
      <WeatherWidget />
      <ScrollProgress />
      <QuickNav />
      {shouldShowEffects && (
        <>
          <GravityFall />
          <GenerativeArt />
          {!isHuman && <MatrixRain isVisible={matrixFullscreen} isIntense={matrixFullscreen} />}
        </>
      )}

      {/* Rolldice Demo Modal */}
      {showRolldice && <RolldiceDemo onClose={() => setShowRolldice(false)} />}

      {/* Snake Game Modal */}
      {showSnake && <SnakeGame onClose={() => setShowSnake(false)} />}

      {/* Background Overlay: ใช้เฉพาะโหมด Hacker เพื่อให้ออ่านง่ายขึ้น */}
      {!isHuman && (
        <div className="fixed inset-0 bg-[#0a0a0a]/60 pointer-events-none z-[1] transition-colors duration-500" />
      )}

      {/* Vignette Effect - ปิดในโหมด Human (Disable in Human Mode) */}
      {!isHuman && <div className="fixed inset-0 hacker-vignette z-[5] pointer-events-none opacity-80" />}

      {/* Global Scanline Overlay - ปิดในโหมด Human */}
      {!isHuman && <div className="fixed inset-0 pointer-events-none z-[10000] opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(16,185,129,0.05),rgba(16,185,129,0.02),rgba(16,185,129,0.05))] bg-[length:100%_4px,4px_100%]" />}

      {/* Animated Scanner Line - เส้นสแกนวิ่งลง (เฉพาะ Hacker) */}
      {!isHuman && <motion.div
        animate={{ y: ["0%", "100%", "0%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="fixed inset-x-0 h-[2px] bg-[#10b98111] z-[10001] pointer-events-none shadow-[0_0_15px_#10b981]"
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
              if (cmd === "rolldice") {
                setShowRolldice(true);
              }
              if (cmd === "game") {
                setShowSnake(true);
              }
            }} />
            <CodeShowcase />
            <SystemStatus />
          </>
        )}

        <Projects />
        <Skills />
        <PCSpecs />
        <Timeline />
        <BlogSection />
        <GitHubActivity />
        <Guestbook />
        <ContactForm />
      </div>
    </main>
  );
}

