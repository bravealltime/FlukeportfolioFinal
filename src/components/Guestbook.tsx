"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";
import { Link, Hash, User, Clock, Trash2 } from "lucide-react";
import TypewriterText from "./TypewriterText";

import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    limit,
    where,
    getDocs,
    deleteDoc,
    doc,
    startAfter,
    getDoc
} from "firebase/firestore";

interface Block {
    id?: string;
    index: number;
    timestamp: any;
    sender: string;
    message: string;
    prevHash: string;
    hash: string;
    nonce: number;
    ip?: string;
    country?: string;
    city?: string;
    country_code?: string;
    imageUrl?: string;
}

const BATCH_SIZE = 6;

const Guestbook = () => {
    const { isHuman } = useSettings();
    const { playPing, playSuccess, playError } = useAudio();

    const [blocks, setBlocks] = useState<Block[]>([]);
    const [name, setName] = useState("");
    const [msg, setMsg] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isMining, setIsMining] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [hasSigned, setHasSigned] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [lastDoc, setLastDoc] = useState<any>(null);

    const [adminInput, setAdminInput] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const MASTER_KEY = "115322";

    // Helper to transform common media links to direct links
    const transformMediaUrl = (url: string) => {
        if (!url) return "";
        let transformed = url.trim();

        // Tenor View -> Direct GIF
        // https://tenor.com/view/xxx-gif-12345678
        const tenorMatch = transformed.match(/tenor\.com\/view\/.*-gif-(\d+)/);
        if (tenorMatch) {
            return `https://media.tenor.com/${tenorMatch[1]}/tenor.gif`;
        }

        // Giphy View -> Direct GIF
        // https://giphy.com/gifs/xxx-ID
        const giphyMatch = transformed.match(/giphy\.com\/gifs\/.*-([a-zA-Z0-9]+)$/) || transformed.match(/giphy\.com\/gifs\/([a-zA-Z0-9]+)$/);
        if (giphyMatch) {
            return `https://media.giphy.com/media/${giphyMatch[1]}/giphy.gif`;
        }

        return transformed;
    };

    const previewUrl = transformMediaUrl(imageUrl);

    // Fetch initial blocks from Firestore
    useEffect(() => {
        const q = query(collection(db, "guestbook"), orderBy("index", "desc"), limit(BATCH_SIZE));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedBlocks = snapshot.docs.map(snap => ({
                id: snap.id,
                ...snap.data()
            } as Block));

            if (fetchedBlocks.length === 0) {
                setBlocks([{
                    index: 0,
                    timestamp: new Date().toISOString(),
                    sender: "Genesis",
                    message: "Welcome to the TharaChain Ledger.",
                    prevHash: "00000000000000000000000000000000",
                    hash: "0000a1b2c3d4e5f678901234567890abcdef",
                    nonce: 0
                }]);
                setHasMore(false);
            } else {
                setBlocks(fetchedBlocks);
                setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
                if (snapshot.docs.length < BATCH_SIZE) {
                    setHasMore(false);
                }
            }
            setIsInitialLoad(false);
        });

        // Check if current user (IP) has already signed
        const checkIP = async () => {
            try {
                const locRes = await fetch("https://ipapi.co/json/");
                const locData = await locRes.json();
                const userIP = locData.ip;

                if (userIP) {
                    const qCheck = query(collection(db, "guestbook"), where("ip", "==", userIP));
                    const snapshotCheck = await getDocs(qCheck);
                    if (!snapshotCheck.empty) {
                        setHasSigned(true);
                    }
                }
            } catch (err) {
                console.warn("IP check failed:", err);
            }
        };
        checkIP();

        return () => unsubscribe();
    }, []);

    const fetchMore = async () => {
        if (!lastDoc || isFetchingMore) return;
        setIsFetchingMore(true);
        playPing();

        try {
            const nextQuery = query(
                collection(db, "guestbook"),
                orderBy("index", "desc"),
                startAfter(lastDoc),
                limit(BATCH_SIZE)
            );

            const snapshot = await getDocs(nextQuery);
            if (snapshot.empty) {
                setHasMore(false);
            } else {
                const moreBlocks = snapshot.docs.map(snap => ({
                    id: snap.id,
                    ...snap.data()
                } as Block));

                setBlocks(prev => {
                    // Filter out any duplicates that might have been added in real-time
                    const existingIds = new Set(prev.map(b => b.id));
                    const uniqueMore = moreBlocks.filter(b => !existingIds.has(b.id));
                    return [...prev, ...uniqueMore];
                });

                setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
                if (snapshot.docs.length < BATCH_SIZE) {
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.error("Fetch more failed:", err);
        } finally {
            setIsFetchingMore(false);
        }
    };

    useEffect(() => {
        if (adminInput === MASTER_KEY) {
            setIsAdmin(true);
            playSuccess();
        }
    }, [adminInput]);

    const deleteBlock = async (id: string) => {
        if (!isAdmin) return;
        try {
            await deleteDoc(doc(db, "guestbook", id));
            playSuccess();
        } catch (err) {
            console.error("Delete failed:", err);
            playError();
        }
    };

    // Simple Hash Function Simulation
    const calculateHash = async (index: number, prevHash: string, timestamp: string, data: string, nonce: number) => {
        const text = index + prevHash + timestamp + data + nonce;
        const msgBuffer = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    const handleSign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !msg.trim() || hasSigned) return;

        setIsMining(true);
        playPing();

        const finalImageUrl = transformMediaUrl(imageUrl);
        const prevBlock = blocks[0]; // blocks is sorted desc by index
        const index = (prevBlock?.index ?? -1) + 1;
        const timestamp = new Date().toISOString();
        const data = name + msg + finalImageUrl;
        let nonce = 0;
        let hash = "";

        // Fetch IP and Country before saving
        let ipInfo = { ip: "unknown", country: "unknown", city: "unknown", country_code: "" };
        try {
            const locRes = await fetch("https://ipapi.co/json/");
            const locData = await locRes.json();
            ipInfo = {
                ip: locData.ip || "unknown",
                country: locData.country_name || "unknown",
                city: locData.city || "unknown",
                country_code: locData.country_code || ""
            };

            // Re-verify IP limit right before signing
            if (ipInfo.ip !== "unknown") {
                const qCheck = query(collection(db, "guestbook"), where("ip", "==", ipInfo.ip));
                const snapshotCheck = await getDocs(qCheck);
                if (!snapshotCheck.empty) {
                    setHasSigned(true);
                    setIsMining(false);
                    playError();
                    return;
                }
            }
        } catch (err) {
            console.warn("Metadata fetch failed during sign:", err);
        }

        // Simulate Mining (Proof of Work) - Delay
        setTimeout(async () => {
            try {
                // Find a hash (simplified, just calculate once for demo)
                hash = await calculateHash(index, prevBlock?.hash || "0000", timestamp, data, nonce);

                const newBlock = {
                    index,
                    timestamp,
                    sender: name,
                    message: msg,
                    imageUrl: finalImageUrl.trim() || null,
                    prevHash: prevBlock?.hash || "0000",
                    hash,
                    nonce,
                    ...ipInfo,
                    createdAt: serverTimestamp()
                };

                // Add to Firestore
                await addDoc(collection(db, "guestbook"), newBlock);

                setIsMining(false);
                setHasSigned(true);
                setName("");
                setMsg("");
                setImageUrl("");
                playSuccess();
            } catch (error) {
                console.error("Error adding to guestbook:", error);
                setIsMining(false);
                playError();
            }
        }, 1500);
    };

    return (
        <section className={`py-24 px-4 relative z-10 ${isHuman ? "bg-slate-50" : "bg-transparent font-mono"}`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center md:text-left">
                    <TypewriterText
                        as="h2"
                        text={isHuman ? "Visitor Guestbook" : "[ BLOCKCHAIN_LEDGER ]"}
                        className={`text-3xl md:text-5xl font-bold mb-2 uppercase tracking-tighter ${isHuman ? "text-slate-900" : "text-[#10b981]"}`}
                    />
                    <p className={`text-sm ${isHuman ? "text-slate-500" : "text-[#10b98188]"}`}>
                        {isHuman
                            ? "Leave a permanent mark on my digital journey."
                            : "IMMUTABLE DATA STORAGE. TRANSACTIONS ARE PERMANENT."}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Form */}
                    <div className={`w-full md:w-1/3 p-6 rounded-2xl h-fit sticky top-24 ${isHuman
                        ? "bg-white shadow-xl border border-slate-100"
                        : "bg-[#0a0a0a] border border-[#10b981] shadow-[0_0_20px_#10b98122]"
                        }`}>
                        <h3 className={`font-bold mb-4 flex items-center gap-2 ${isHuman ? "text-slate-800" : "text-[#10b981]"}`}>
                            {isHuman ? "Sign the Guestbook" : "INITIATE_TX"}
                        </h3>
                        <form onSubmit={handleSign} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold opacity-70 block mb-1">
                                    {isHuman ? "Name" : "SENDER_ID"}
                                </label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    maxLength={20}
                                    className={`w-full p-2 rounded border focus:outline-none ${isHuman
                                        ? "bg-slate-50 border-slate-200 focus:border-blue-500"
                                        : "bg-black border-[#10b98144] focus:border-[#10b981] text-[#10b981]"
                                        }`}
                                    placeholder={isHuman ? "John Doe" : "ANONYMOUS"}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold opacity-70 block mb-1">
                                    {isHuman ? "Message" : "DATA_PAYLOAD"}
                                </label>
                                <textarea
                                    value={msg}
                                    onChange={e => setMsg(e.target.value)}
                                    maxLength={140}
                                    rows={3}
                                    className={`w-full p-2 rounded border focus:outline-none ${isHuman
                                        ? "bg-slate-50 border-slate-200 focus:border-blue-500"
                                        : "bg-black border-[#10b98144] focus:border-[#10b981] text-[#10b981]"
                                        }`}
                                    placeholder={isHuman ? "Nice portfolio!" : "HELLO_WORLD"}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold opacity-70 block mb-1">
                                    {isHuman ? "Image URL (Optional)" : "ATTACH_MEDIA_URI"}
                                </label>
                                <input
                                    value={imageUrl}
                                    onChange={e => setImageUrl(e.target.value)}
                                    className={`w-full p-2 rounded border focus:outline-none ${isHuman
                                        ? "bg-slate-50 border-slate-200 focus:border-blue-500 text-xs"
                                        : "bg-black border-[#10b98144] focus:border-[#10b981] text-[#10b981] text-[10px]"
                                        }`}
                                    placeholder={isHuman ? "https://example.com/image.gif" : "HTTPS://MEDIA_SOURCE"}
                                />
                                {previewUrl && (
                                    <div className={`mt-2 rounded-lg overflow-hidden border p-1 ${isHuman ? "bg-white border-slate-100" : "bg-black border-[#10b98133]"}`}>
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-w-full max-h-32 object-contain mx-auto"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                        <p className="text-[8px] text-center mt-1 opacity-50 font-mono">
                                            {isHuman ? "Media Preview" : "PREVIEW_READY"}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <button
                                disabled={isMining || !name || !msg || hasSigned}
                                className={`w-full py-3 rounded-lg font-bold transition-all disabled:opacity-50 ${isHuman
                                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                                    : "bg-[#10b981] text-black hover:bg-[#34d399] shadow-[0_0_10px_#10b981]"
                                    }`}
                            >
                                {isMining
                                    ? (isHuman ? "Mining Block..." : "MINING_HASH...")
                                    : hasSigned
                                        ? (isHuman ? "Already Signed" : "ACCESS_DENIED: ALREADY_SIGNED")
                                        : (isHuman ? "Sign Guestbook" : "BROADCAST_TX")
                                }
                            </button>
                        </form>
                        {hasSigned && (
                            <p className={`mt-4 text-[10px] text-center ${isHuman ? "text-slate-400" : "text-[#10b98166]"}`}>
                                {isHuman ? "Only one entry allowed per IP." : "PROTOCOL_ERR: UNIQUE_IP_RESTRICTION_ACTIVE."}
                            </p>
                        )}

                        {/* Admin Entry - Subtle */}
                        <div className="mt-8 pt-4 border-t border-dashed border-slate-200 opacity-20 hover:opacity-100 transition-opacity">
                            {!isAdmin ? (
                                <input
                                    type="password"
                                    value={adminInput}
                                    onChange={e => setAdminInput(e.target.value)}
                                    placeholder="MOD_CODE"
                                    className={`w-full bg-transparent text-[10px] focus:outline-none ${isHuman ? "text-slate-400" : "text-[#10b981]"}`}
                                />
                            ) : (
                                <div className={`text-[10px] font-bold ${isHuman ? "text-blue-500" : "text-[#10b981]"}`}>
                                    ADMIN_MODE_ACTIVE
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chain */}
                    <div className="w-full md:w-2/3 space-y-4">
                        {isInitialLoad ? (
                            <div className="flex flex-col items-center justify-center p-12 space-y-4 opacity-50">
                                <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${isHuman ? "border-blue-600" : "border-[#10b981]"}`} />
                                <span className="text-xs font-mono uppercase tracking-widest">
                                    {isHuman ? "Loading Ledger..." : "READING_BLOCKCHAIN..."}
                                </span>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {blocks.map((block) => (
                                    <motion.div
                                        key={block.hash}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className={`p-4 rounded-xl border relative overflow-hidden group ${isHuman
                                            ? "bg-white border-slate-200 shadow-sm hover:shadow-md"
                                            : "bg-[#0a0a0a]/50 border-[#10b98133] hover:border-[#10b981]"
                                            }`}
                                    >
                                        {/* Link Line */}
                                        <div className={`absolute top-0 bottom-0 left-0 w-1 ${isHuman ? "bg-blue-500" : "bg-[#10b981]"
                                            }`} />

                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded ${isHuman ? "bg-blue-100 text-blue-600" : "bg-[#10b98122] text-[#10b981]"}`}>
                                                    <Hash size={14} />
                                                </div>
                                                <span className={`text-xs font-mono opacity-50`}>
                                                    BLOCK #{block.index}
                                                </span>
                                                {block.country_code && (
                                                    <span className="text-[10px] opacity-40 font-mono flex items-center gap-1 ml-2">
                                                        [ {block.country_code} ]
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] opacity-40 font-mono">
                                                    {new Date(block.timestamp).toLocaleTimeString()}
                                                </span>
                                                {isAdmin && block.id && (
                                                    <button
                                                        onClick={() => deleteBlock(block.id!)}
                                                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                                        title="Delete Block"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pl-8">
                                            <div className="flex items-center gap-2 mb-1">
                                                <User size={14} className="opacity-50" />
                                                <span className={`font-bold ${isHuman ? "text-slate-900" : "text-[#10b981]"}`}>
                                                    {block.sender}
                                                </span>
                                                {block.country && (
                                                    <span className={`text-[9px] px-1 rounded ${isHuman ? "bg-slate-100 text-slate-500" : "bg-[#10b98111] text-[#10b98166] border border-[#10b98122]"}`}>
                                                        {block.country}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-sm mb-3 ${isHuman ? "text-slate-600" : "text-[#10b981cc]"}`}>
                                                "{block.message}"
                                            </p>

                                            {block.imageUrl && (
                                                <div className={`mb-3 rounded-lg overflow-hidden border ${isHuman ? "border-slate-100 shadow-sm" : "border-[#10b98133]"}`}>
                                                    <img
                                                        src={block.imageUrl}
                                                        alt="Guest attachment"
                                                        className="max-w-full max-h-64 object-contain mx-auto"
                                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                                    />
                                                </div>
                                            )}

                                            <div className={`text-[10px] font-mono p-2 rounded break-all ${isHuman ? "bg-slate-100 text-slate-500" : "bg-[#10b98111] text-[#10b98166]"
                                                }`}>
                                                HASH: {block.hash}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}

                        {hasMore && !isInitialLoad && (
                            <div className="flex justify-center pt-8">
                                <button
                                    onClick={fetchMore}
                                    disabled={isFetchingMore}
                                    className={`px-8 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-3 ${isHuman
                                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-sm"
                                        : "bg-[#10b98111] text-[#10b981] border border-[#10b98133] hover:border-[#10b981] hover:bg-[#10b98122]"
                                        } disabled:opacity-50`}
                                >
                                    {isFetchingMore ? (
                                        <>
                                            <div className={`w-3 h-3 border-2 border-t-transparent rounded-full animate-spin ${isHuman ? "border-slate-400" : "border-[#10b981]"}`} />
                                            {isHuman ? "Loading Entries..." : "SYNCING_BLOCKS..."}
                                        </>
                                    ) : (
                                        <>
                                            {isHuman ? "Load More" : "FETCH_OLDER_TRANSACTIONS"}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Guestbook;
