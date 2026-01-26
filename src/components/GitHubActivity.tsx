"use client";

import React from "react";
import { GitHubCalendar } from "react-github-calendar";
import { useSettings } from "./SettingsProvider";
import { motion } from "framer-motion";

const GitHubActivity = () => {
    const { isHuman } = useSettings();

    return (
        <section className={`py-20 px-4 relative z-10 ${isHuman ? "bg-white" : "bg-transparent"}`}>
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10 text-center"
                >
                    <h2 className={`text-3xl md:text-5xl font-bold mb-4 uppercase tracking-tighter ${isHuman ? "text-slate-900" : "text-[#00ff41]"}`}>
                        {isHuman ? "GitHub Activity" : "[ GIT_COMMIT_LOG ]"}
                    </h2>
                    {isHuman && <p className="text-slate-600">Coding consistency over the last year.</p>}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className={`p-6 rounded-xl ${isHuman ? "bg-white border border-slate-200 shadow-md" : "bg-black/40 border border-[#00ff4144]"}`}
                >
                    <GitHubCalendar
                        username="bravealltime"
                        colorScheme={isHuman ? "light" : "dark"}
                        fontSize={12}
                        blockSize={12}
                        blockMargin={4}
                        theme={isHuman ? undefined : {
                            dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
                        }}
                        style={{
                            color: isHuman ? "#1e293b" : "#00ff41",
                        }}
                    />
                </motion.div>

                {!isHuman && (
                    <div className="mt-4 text-[#00ff4166] text-xs font-mono">
                        // COMMIT_STREAK: ANALYZING...
                    </div>
                )}
            </div>
        </section>
    );
};

export default GitHubActivity;
