"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Volume2, VolumeX, Eye, Terminal } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAudio } from "./AudioProvider";
import { useSettings } from "./SettingsProvider";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


/**
 * Component: Navbar
 * แถบเมนูด้านบน (Navigation Bar)
 * มีระบบ Sticky (ซ่อน/แสดง เมื่อ Scroll)
 * รองรับ Mobile Menu และปุ่มสลับโหมด
 */
const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const { isEnabled, toggleAudio, playPing } = useAudio();
  const { viewMode, toggleViewMode, isHuman } = useSettings();


  // Hook: ตรวจสอบการ Scroll เพื่อซ่อน/แสดง Navbar
  // ถ้Scroll ลง -> ซ่อน, Scroll ขึ้น -> แสดง
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // รายการเมนูนำทาง
  const navItems = [
    { name: "[ หน้าแรก ]", href: "#hero" },
    { name: "[ ผลงาน ]", href: "#projects" },
    { name: "[ คุยกับบอท ]", href: "#terminal" },
    { name: "[ ทักษะ ]", href: "#skills" },
    { name: "[ ติดต่อ ]", href: "#contact" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            isHuman
              ? "fixed top-0 inset-x-0 z-[5000] px-4 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm font-sans"
              : "fixed top-4 inset-x-4 md:inset-x-0 mx-auto z-[5000] px-4 py-2 hacker-border bg-black/90 max-w-fit md:min-w-[650px] font-mono"
          )}
        >
          <div className={isHuman ? "max-w-6xl mx-auto flex items-center justify-between" : "flex items-center justify-between gap-4 md:gap-8 px-2 md:px-4"}>
            <div className={cn("font-bold tracking-tighter truncate max-w-[120px] md:max-w-none", isHuman ? "text-slate-900 text-xl" : "text-sm md:text-lg text-[#00ff41]")}>
              {isHuman ? "Thara." : "ROOT@THARA:~#"}
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onMouseEnter={() => !isHuman && playPing()}
                  className={cn(
                    "font-bold transition-all py-1",
                    isHuman
                      ? "text-slate-600 hover:text-slate-900 text-sm"
                      : "text-[10px] lg:text-xs text-[#008f11] hover:text-[#00ff41] hover:glow-sm"
                  )}
                >
                  {isHuman ? item.name.replace(/\[ | \]/g, "") : item.name}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => {
                  toggleViewMode();
                  if (!isHuman) playPing();
                }}
                onMouseEnter={() => !isHuman && playPing()}
                className={cn("transition-colors p-2 rounded-full", isHuman ? "text-slate-500 hover:bg-slate-100 text-slate-900" : "text-[#00ff4188] hover:text-[#00ff41]")}
                title={isHuman ? "Switch to Hacker Mode" : "Switch to Readability Mode"}
              >
                {isHuman ? <Terminal size={20} /> : <Eye size={16} />}
              </button>

              <button
                onClick={() => {
                  toggleAudio();
                  if (!isHuman) playPing();
                }}
                onMouseEnter={() => !isHuman && playPing()}
                className={cn("transition-colors p-2 rounded-full", isHuman ? "text-slate-500 hover:bg-slate-100 text-slate-900" : "text-[#00ff4188] hover:text-[#00ff41]")}
              >
                {isEnabled ? <Volume2 size={isHuman ? 20 : 16} /> : <VolumeX size={isHuman ? 20 : 16} />}
              </button>

              <button
                className="md:hidden p-2"
                onClick={() => {
                  setIsOpen(!isOpen);
                  if (!isHuman) playPing();
                }}
              >
                {isOpen
                  ? <X size={20} className={isHuman ? "text-slate-900" : "text-[#00ff41]"} />
                  : <Menu size={20} className={isHuman ? "text-slate-900" : "text-[#00ff41]"} />
                }
              </button>

              {/* Blink Cursor - Only in Hacker Mode */}
              {!isHuman && (
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-2 h-4 bg-[#00ff41] hidden md:block"
                />
              )}
            </div>
          </div>
        </motion.nav>
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className={cn(
              "fixed inset-0 z-[4999] flex flex-col items-center justify-center p-8 md:hidden",
              isHuman ? "bg-white font-sans text-slate-900" : "bg-black/95 font-mono text-[#00ff41]"
            )}
          >
            <div className="flex flex-col gap-8 text-center">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-2xl font-bold transition-all",
                    isHuman ? "hover:text-amber-600" : "hover:glow-sm"
                  )}
                >
                  {isHuman ? item.name.replace(/\[ | \]/g, "") : `> ${item.name}`}
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={cn("mt-20 text-[10px] uppercase", isHuman ? "text-slate-400" : "text-[#00ff4144]")}
            >
              {isHuman ? "© 2024 Thara Portfolio" : "Connection: Secure | User: Guest"}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};




export default Navbar;
