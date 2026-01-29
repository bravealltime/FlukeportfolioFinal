"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Trophy, TrendingUp, Users } from "lucide-react";
import { useSettings } from "./SettingsProvider";

interface Project {
    title: string;
    description: string;
    tech: string[];
    link: string;
    github: string;
    caseStudy?: {
        challenge: string;
        solution: {
            architecture: string;
            ux: string;
        };
        metrics: {
            perf: string;
            error: string;
        };
        testimonial: string;
    };
}

interface ProjectCaseStudyProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project | null;
}

const ProjectCaseStudy: React.FC<ProjectCaseStudyProps> = ({ isOpen, onClose, project }) => {
    const { isHuman } = useSettings();

    if (!isOpen || !project) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl relative ${isHuman
                    ? "bg-white text-slate-900 border border-slate-200 shadow-2xl"
                    : "bg-[#0a0a0a] text-[#10b981] border border-[#10b981] shadow-[0_0_50px_#10b98122]"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`sticky top-0 z-10 p-6 flex justify-between items-center border-b ${isHuman ? "bg-white/90 backdrop-blur border-slate-100" : "bg-[#0a0a0a]/90 backdrop-blur border-[#10b98144]"
                    }`}>
                    <h2 className="text-2xl md:text-3xl font-bold uppercase">{project.title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-10 space-y-12">
                    {/* Overview */}
                    <section>
                        <h3 className="text-xl font-bold mb-4 opacity-70 uppercase tracking-widest">01 // โจทย์และความท้าทาย</h3>
                        <p className="text-lg leading-relaxed opacity-90">
                            {project.caseStudy?.challenge || project.description}
                        </p>
                    </section>

                    {/* Solution Grid */}
                    <section className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4 opacity-70 uppercase tracking-widest">02 // สิ่งที่เราทำ</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className={`mt-1 p-1 rounded ${isHuman ? "bg-blue-100 text-blue-600" : "bg-[#10b98122]"}`}>
                                        <TrendingUp size={16} />
                                    </div>
                                    <div>
                                        <strong className="block text-sm uppercase opacity-70">Architecture (โครงสร้างระบบ)</strong>
                                        {project.caseStudy?.solution.architecture || "Optimized system architecture for scale."}
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className={`mt-1 p-1 rounded ${isHuman ? "bg-blue-100 text-blue-600" : "bg-[#10b98122]"}`}>
                                        <Users size={16} />
                                    </div>
                                    <div>
                                        <strong className="block text-sm uppercase opacity-70">UX / UI (ประสบการณ์ผู้ใช้)</strong>
                                        {project.caseStudy?.solution.ux || "Improved user experience design."}
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className={`p-6 rounded-xl border ${isHuman ? "bg-slate-50 border-slate-100" : "bg-[#10b98111] border-[#10b98144]"}`}>
                            <h4 className="font-bold mb-4 uppercase">ผลลัพธ์ที่ได้ (Key Metrics)</h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Performance / Result</span>
                                        <span>{project.caseStudy?.metrics.perf || "100%"}</span>
                                    </div>
                                    <div className="h-2 bg-black/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-3/4" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Value / Impact</span>
                                        <span>{project.caseStudy?.metrics.error || "High"}</span>
                                    </div>
                                    <div className="h-2 bg-black/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Conclusion */}
                    <section className="text-center pt-8 border-t border-dashed border-gray-700/30">
                        <div className="inline-block p-4 rounded-full bg-yellow-400/20 text-yellow-600 mb-4">
                            < Trophy size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">บทสรุปความสำเร็จ</h3>
                        <p className="opacity-70 max-w-xl mx-auto italic">
                            &quot;{project.caseStudy?.testimonial || "Project completed successfully."}&quot;
                        </p>
                    </section>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ProjectCaseStudy;
