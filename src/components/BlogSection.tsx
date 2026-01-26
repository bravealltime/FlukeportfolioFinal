"use client";

import React, { useState } from "react";
import { useSettings } from "./SettingsProvider";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, AlertCircle } from "lucide-react";

const posts = [
    {
        id: 1,
        title: "Why I switched to Next.js 14",
        excerpt: "Server Actions and the App Router changed everything...",
        content: "Next.js 14 introduces Server Actions, which allows you to run asynchronous code directly on the server. This reduces the amount of client-side JavaScript and improves performance significantly. The App Router also simplifies routing patterns, making layouts nested and efficient.",
        date: "2024-01-15",
        tag: "Tech"
    },
    {
        id: 2,
        title: "My Ultimate Developer Setup",
        excerpt: "From VS Code extensions to mechanical keyboards...",
        content: "A good developer setup is crucial for productivity. My current daily driver includes a split mechanical keyboard with tactile switches, a vertical mouse for ergonomics, and a 4K OLED monitor for crisp text rendering. Software-wise, I rely heavily on VS Code with the 'SynthWave '84' theme.",
        date: "2023-12-10",
        tag: "Lifestyle"
    },
    {
        id: 3,
        title: "Understanding React Server Components",
        excerpt: "A deep dive into the future of React rendering...",
        content: "RSC allows components to be rendered exclusively on the server. This means zero bundle size for those components! It's a paradigm shift from the traditional client-side fetching model.",
        date: "2023-11-05",
        tag: "Coding"
    }
];

const BlogSection = () => {
    const { isHuman } = useSettings();
    const [selectedPost, setSelectedPost] = useState<typeof posts[0] | null>(null);

    return (
        <section className={`py-20 px-4 relative z-10 ${isHuman ? "bg-white" : "bg-transparent"}`}>
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className={`text-3xl md:text-5xl font-bold mb-4 uppercase tracking-tighter ${isHuman ? "text-slate-900" : "text-[#00ff41]"
                        }`}>
                        {isHuman ? "Latest Articles" : "[ KNOWLEDGE_BASE ]"}
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedPost(post)}
                            className={`cursor-pointer p-6 rounded-xl border transition-all h-full flex flex-col ${isHuman
                                    ? "bg-slate-50 border-slate-200 hover:shadow-lg"
                                    : "bg-black/40 border-[#00ff4144] hover:border-[#00ff41] hover:shadow-[0_0_15px_#00ff4122]"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${isHuman ? "bg-blue-100 text-blue-600" : "bg-[#00ff4122] text-[#00ff41]"
                                    }`}>
                                    {post.tag}
                                </span>
                                <span className={`text-xs ${isHuman ? "text-slate-400" : "text-[#00ff4166]"}`}>
                                    {post.date}
                                </span>
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${isHuman ? "text-slate-800" : "text-[#00ff41]"}`}>
                                {post.title}
                            </h3>
                            <p className={`text-sm flex-grow ${isHuman ? "text-slate-600" : "text-[#00ff41aa]"}`}>
                                {post.excerpt}
                            </p>
                            <div className={`mt-4 pt-4 border-t text-sm font-bold flex items-center gap-2 ${isHuman ? "border-slate-200 text-blue-600" : "border-[#00ff4122] text-[#00ff41]"
                                }`}>
                                Read More <BookOpen size={16} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedPost(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`relative w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 rounded-2xl shadow-2xl ${isHuman
                                    ? "bg-white text-slate-800"
                                    : "bg-black border border-[#00ff41] text-[#00ff41] shadow-[0_0_30px_#00ff4144]"
                                }`}
                        >
                            <button
                                onClick={() => setSelectedPost(null)}
                                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isHuman ? "hover:bg-slate-100" : "hover:bg-[#00ff4122]"
                                    }`}
                            >
                                <X size={24} />
                            </button>

                            <span className={`text-xs font-bold uppercase tracking-widest ${isHuman ? "text-blue-500" : "text-[#00ff4166]"
                                }`}>
                                {selectedPost.tag} // {selectedPost.date}
                            </span>

                            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                                {selectedPost.title}
                            </h2>

                            <div className={`prose max-w-none ${isHuman ? "prose-slate" : "prose-invert"}`}>
                                <p className="leading-relaxed text-lg">
                                    {selectedPost.content}
                                </p>
                                <p className="mt-4">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>

                            {!isHuman && (
                                <div className="mt-8 pt-4 border-t border-[#00ff4144] text-xs font-mono text-[#00ff4166] flex items-center gap-2">
                                    <AlertCircle size={12} /> END_OF_FILE
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default BlogSection;
