"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "./SettingsProvider";
import { useAudio } from "./AudioProvider";
import { Link, Hash, User, Clock, Trash2, Search, Heart } from "lucide-react";
import TypewriterText from "./TypewriterText";
import GiphyPicker from "./GiphyPicker";

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
    getDoc,
    updateDoc,
    increment
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
    likes?: number;
}

const BATCH_SIZE = 9;

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
    const [isLocalhost, setIsLocalhost] = useState(false);
    const [isLocalPath, setIsLocalPath] = useState(false);
    const [isGiphyOpen, setIsGiphyOpen] = useState(false);
    const [likedIds, setLikedIds] = useState<string[]>([]);

    const MASTER_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || "115322";

    // Helper to transform common media links to direct links
    const transformMediaUrl = (url: string) => {
        if (!url) return "";
        let transformed = url.trim();

        // If it's already a direct Tenor/Giphy media link, return as is
        if (transformed.includes("media.tenor.com") || transformed.includes("media1.tenor.com") || transformed.includes("media.giphy.com")) {
            return transformed;
        }

        // Remove query parameters for matching
        const cleanUrl = transformed.split('?')[0];

        // Tenor View -> Direct GIF
        // Note: Modern Tenor (v2) uses hashed IDs (e.g., pww...) for media, 
        // while the URL contains a numeric ID. Numeric IDs don't always work for direct links.
        const tenorMatch = cleanUrl.match(/tenor\.com\/view\/.*-gif-(\d+)/) || cleanUrl.match(/tenor\.com\/.*-(\d+)$/);
        if (tenorMatch) {
            const id = tenorMatch[1];
            // Only use numeric ID if it's short (likely old Tenor v1)
            if (id.length <= 12) {
                return `https://media.tenor.com/${id}/tenor.gif`;
            }
            // For longer v2 IDs, we return as is and recommend using direct link instead
            return transformed;
        }

        // Giphy View -> Direct GIF
        const giphyMatch = cleanUrl.match(/giphy\.com\/gifs\/.*-([a-zA-Z0-9]+)$/) || cleanUrl.match(/giphy\.com\/gifs\/([a-zA-Z0-9]+)$/);
        if (giphyMatch) {
            return `https://media.giphy.com/media/${giphyMatch[1]}/giphy.gif`;
        }

        return transformed;
    };

    useEffect(() => {
        // Detect local file paths (C:\, \, file://)
        if (imageUrl.match(/^[a-zA-Z]:\\/) || imageUrl.startsWith('/') || imageUrl.startsWith('file://')) {
            setIsLocalPath(true);
        } else {
            setIsLocalPath(false);
        }
    }, [imageUrl]);

    const previewUrl = transformMediaUrl(imageUrl);

    // Initial Load - Liked IDs
    useEffect(() => {
        const stored = localStorage.getItem("thara_liked_blocks");
        if (stored) {
            try {
                setLikedIds(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse liked IDs");
            }
        }
    }, []);

    // Fetch initial blocks from Firestore
    useEffect(() => {
        // Check if we are on localhost
        if (typeof window !== "undefined") {
            const hostname = window.location.hostname;
            if (hostname === "localhost" || hostname === "127.0.0.1") {
                setIsLocalhost(true);
            }
        }

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
                    sender: "ธรณัส (ระบบ)",
                    message: "ยินดีต้อนรับสู่ TharaChain Ledger ครับ!",
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
            // Skip check if on localhost
            const hostname = typeof window !== "undefined" ? window.location.hostname : "";
            if (hostname === "localhost" || hostname === "127.0.0.1") return;

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

    const toggleLike = async (id: string) => {
        if (likedIds.includes(id)) return;

        try {
            const blockRef = doc(db, "guestbook", id);
            await updateDoc(blockRef, {
                likes: increment(1)
            });

            const newLiked = [...likedIds, id];
            setLikedIds(newLiked);
            localStorage.setItem("thara_liked_blocks", JSON.stringify(newLiked));
            playPing();
        } catch (err) {
            console.error("Like failed:", err);
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
        // Skip hasSigned check if localhost
        if (!name.trim() || !msg.trim() || (hasSigned && !isLocalhost)) return;

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
        let ipInfo = { ip: "unknown", country: "unknown", city: "unknown", country_code: "LOC" };

        const hostname = typeof window !== "undefined" ? window.location.hostname : "";
        const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

        if (isLocal) {
            ipInfo = { ip: "localhost", country: "Local Development", city: "Home", country_code: "DEV" };
        } else {
            try {
                const locRes = await fetch("https://ipapi.co/json/");
                const locData = await locRes.json();
                ipInfo = {
                    ip: locData.ip || "unknown",
                    country: locData.country_name || "unknown",
                    city: locData.city || "unknown",
                    country_code: locData.country_code || ""
                };

                // Re-verify IP limit right before signing (skip if local)
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
                    likes: 0,
                    ...ipInfo,
                    createdAt: serverTimestamp()
                };

                // Add to Firestore
                await addDoc(collection(db, "guestbook"), newBlock);

                setIsMining(false);
                if (!isLocal) setHasSigned(true);
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
            <div className="max-w-[95%] mx-auto">
                {/* Header */}
                <div className="mb-12 text-center md:text-left">
                    <TypewriterText
                        as="h2"
                        text={isHuman ? "สมุดเยี่ยมชม" : "[ บันทึก_ธุรกรรม_บล็อกเชน ]"}
                        className={`text-3xl md:text-5xl font-bold mb-2 uppercase tracking-tighter ${isHuman ? "text-slate-900" : "text-[#10b981]"}`}
                    />
                    <p className={`text-sm ${isHuman ? "text-slate-500" : "text-[#10b98188]"}`}>
                        {isHuman
                            ? "ฝากข้อความไว้เป็นที่ระลึกในการเดินทางดิจิทัลของผมครับ"
                            : "ที่เก็บข้อมูลที่ไม่สามารถแก้ไขได้. ทุกธุรกรรมจะถูกบันทึกไว้อย่างถาวร."}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Form */}
                    <div className={`w-full lg:w-80 p-6 rounded-2xl h-fit sticky top-24 z-[20] ${isHuman
                        ? "bg-white shadow-xl border border-slate-100"
                        : "bg-[#0a0a0a] border border-[#10b981] shadow-[0_0_20px_#10b98122]"
                        }`}>
                        <h3 className={`font-bold mb-4 flex items-center gap-2 ${isHuman ? "text-slate-800" : "text-[#10b981]"}`}>
                            {isHuman ? "เซ็นสมุดเยี่ยมชม" : "เริ่ม_ธุรกรรม_TX"}
                        </h3>
                        <form onSubmit={handleSign} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold opacity-70 block mb-1">
                                    {isHuman ? "ชื่อของคุณ" : "ไอดี_ผู้ส่ง"}
                                </label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    maxLength={20}
                                    className={`w-full p-2 rounded border focus:outline-none ${isHuman
                                        ? "bg-slate-50 border-slate-200 focus:border-blue-500"
                                        : "bg-black border-[#10b98144] focus:border-[#10b981] text-[#10b981]"
                                        }`}
                                    placeholder={isHuman ? "ระบุชื่อของคุณ" : "นิรนาม"}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold opacity-70 block mb-1">
                                    {isHuman ? "ข้อความ" : "ข้อมูล_นำส่ง"}
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
                                    placeholder={isHuman ? "เว็บสวยมากครับ!" : "สวัสดี_ชาวโลก"}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold opacity-70 block mb-1">
                                    {isHuman ? "ลิงก์รูปภาพ (ไม่บังคับ)" : "แนบ_สื่อ_URI"}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        value={imageUrl}
                                        onChange={e => setImageUrl(e.target.value)}
                                        className={`flex-1 p-2 rounded border focus:outline-none ${isHuman
                                            ? "bg-slate-50 border-slate-200 focus:border-blue-500 text-xs"
                                            : "bg-black border-[#10b98144] focus:border-[#10b981] text-[#10b981] text-[10px]"
                                            }`}
                                        placeholder={isHuman ? "https://example.com/image.gif" : "HTTPS://แหล่งข้อมูล_สื่อ"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsGiphyOpen(true);
                                            playPing();
                                        }}
                                        className={`p-2 rounded border transition-all ${isHuman
                                            ? "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600"
                                            : "bg-black border-[#10b98144] hover:bg-[#10b98111] text-[#10b981]"
                                            }`}
                                        title={isHuman ? "ค้นหา GIF" : "ค้นหา_มีเดีย"}
                                    >
                                        <Search size={18} />
                                    </button>
                                </div>
                                {isLocalPath && (
                                    <p className="text-[9px] text-red-500 mt-1 font-bold animate-pulse">
                                        {isHuman
                                            ? "⚠️ นี่คือที่อยู่ไฟล์ในเครื่องครับ กรุณาใช้ลิงก์จากเว็บแทน"
                                            : "ข้อผิดพลาด: ตรวจพบที่อยู่ไฟล์ในเครื่อง. โปรดใช้_URI_ระยะไกล."}
                                    </p>
                                )}
                                <p className={`text-[9px] mt-1 opacity-50 ${isHuman ? "text-slate-500" : "text-[#10b981]"}`}>
                                    {isHuman
                                        ? "คำแนะนำ: หากรูปไม่ขึ้น ให้คลิกขวาที่รูป GIF (จากเว็บ Tenor/Giphy) แล้วเลือก 'คัดลอกที่อยู่รูปภาพ'"
                                        : "คำแนะนำ_ระบบ: หากภาพ_404 ให้ใช้_ลิงก์_ตรง_จาก_เมนู_คัดลอก_ที่อยู่_รูปภาพ."}
                                </p>
                                {previewUrl && !isLocalPath && (
                                    <div className={`mt-2 rounded-lg overflow-hidden border p-1 ${isHuman ? "bg-white border-slate-100" : "bg-black border-[#10b98133]"}`}>
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-w-full max-h-32 object-contain mx-auto"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                        <p className="text-[8px] text-center mt-1 opacity-50 font-mono">
                                            {isHuman ? "ตัวอย่างรูปภาพ" : "พรีวิว_พร้อม"}
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
                                    ? (isHuman ? "กำลังบันทึกข้อมูล..." : "กำลัง_ขุด_แฮช...")
                                    : hasSigned
                                        ? (isHuman ? "เซ็นไปแล้วครับ" : "ปฏิเสธการเข้าถึง: เซ็นไปแล้ว")
                                        : (isHuman ? "เซ็นสมุดเยี่ยมชม" : "ประกาศ_TX")
                                }
                            </button>
                        </form>
                        {hasSigned && (
                            <p className={`mt-4 text-[10px] text-center ${isHuman ? "text-slate-400" : "text-[#10b98166]"}`}>
                                {isHuman ? "อนุญาตให้เซ็นได้หนึ่งครั้งต่อหนึ่ง IP เท่านั้นครับ" : "ข้อผิดพลาด_โปรโตคอล: จำกัด_หนึ่ง_IP_เท่านั้น."}
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
                                    โหมดผู้ดูแล_เปิดใช้งาน
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chain */}
                    <div className="flex-1">
                        {isInitialLoad ? (
                            <div className="flex flex-col items-center justify-center p-12 space-y-4 opacity-50 h-[400px]">
                                <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${isHuman ? "border-blue-600" : "border-[#10b981]"}`} />
                                <span className="text-xs font-mono uppercase tracking-widest">
                                    {isHuman ? "กำลังโหลดข้อมูล..." : "กำลัง_อ่าน_บล็อกเชน..."}
                                </span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-min">
                                <AnimatePresence mode="popLayout">
                                    {blocks.map((block) => (
                                        <motion.div
                                            key={block.hash}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            layout
                                            className={`p-4 rounded-2xl border relative overflow-hidden transition-all h-fit group ${isHuman
                                                ? "bg-white/80 backdrop-blur-md border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1"
                                                : "bg-[#0a0a0a]/60 backdrop-blur-xl border-[#10b98133] hover:border-[#10b981] hover:shadow-[0_0_20px_#10b98111]"
                                                }`}
                                        >
                                            {/* Block Header Overlay */}
                                            <div className={`absolute top-0 right-0 px-2 py-1 text-[8px] font-mono opacity-30 ${isHuman ? "bg-slate-100" : "bg-[#10b98122]"}`}>
                                                NONCE_{block.nonce}
                                            </div>

                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`p-1 rounded ${isHuman ? "bg-blue-50 text-blue-600" : "bg-[#10b98111] text-[#10b981]"}`}>
                                                        <Hash size={12} />
                                                    </div>
                                                    <span className={`text-[10px] font-bold font-mono opacity-80`}>
                                                        #{block.index}
                                                    </span>
                                                    {block.country_code && (
                                                        <span className={`text-[9px] px-1 rounded font-mono ${isHuman ? "bg-slate-100 text-slate-500" : "bg-black text-[#10b98144] border border-[#10b98111]"}`}>
                                                            {block.country_code}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[9px] opacity-40 font-mono">
                                                    {new Date(block.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isHuman ? "bg-blue-600 text-white" : "bg-[#10b981] text-black"}`}>
                                                        {block.sender[0]?.toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-xs font-bold leading-none ${isHuman ? "text-slate-900" : "text-[#10b981]"}`}>
                                                            {block.sender}
                                                        </span>
                                                        <span className="text-[8px] opacity-40 uppercase tracking-tighter">
                                                            {block.country || "Earth"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className={`text-xs leading-relaxed italic ${isHuman ? "text-slate-600" : "text-[#10b981cc]"}`}>
                                                    "{block.message}"
                                                </p>

                                                {block.imageUrl && (
                                                    <div className={`rounded-xl overflow-hidden border relative aspect-video transition-all duration-500 ${isHuman ? "border-slate-100 bg-slate-50" : "border-[#10b98122] bg-[#10b98105]"}`}>
                                                        <img
                                                            src={block.imageUrl}
                                                            alt="Guest attachment"
                                                            className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                                            loading="lazy"
                                                            onError={(e) => (e.currentTarget.parentElement!.style.display = 'none')}
                                                        />
                                                    </div>
                                                )}

                                                <div className="pt-2 flex flex-col gap-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex flex-col gap-1 flex-1">
                                                            <div className="flex items-center justify-between text-[8px] opacity-30 font-mono">
                                                                <span>PREV_HASH</span>
                                                                <span className="truncate ml-4">{block.prevHash.substring(0, 16)}...</span>
                                                            </div>
                                                            <div className={`p-1.5 rounded text-[8px] font-mono break-all ${isHuman ? "bg-slate-50 text-slate-400" : "bg-black/50 text-[#10b98144]"}`}>
                                                                HASH: {block.hash}
                                                            </div>
                                                        </div>

                                                        {block.id && (
                                                            <motion.button
                                                                whileTap={!likedIds.includes(block.id) ? { scale: 0.8 } : {}}
                                                                onClick={() => toggleLike(block.id!)}
                                                                disabled={likedIds.includes(block.id)}
                                                                className={`ml-3 flex flex-col items-center gap-0.5 transition-colors ${likedIds.includes(block.id) || (block.likes || 0) > 0
                                                                    ? "text-red-500"
                                                                    : isHuman ? "text-slate-300 hover:text-red-400" : "text-[#10b98122] hover:text-red-500"
                                                                    } ${likedIds.includes(block.id) ? "cursor-default" : "cursor-pointer"}`}
                                                            >
                                                                <Heart size={16} fill={likedIds.includes(block.id) || (block.likes || 0) > 0 ? "currentColor" : "none"} />
                                                                <span className="text-[10px] font-bold font-mono">{(block.likes || 0)}</span>
                                                            </motion.button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {isAdmin && block.id && (
                                                <button
                                                    onClick={() => deleteBlock(block.id!)}
                                                    className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 transition-all"
                                                    title="ลบบล็อก"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
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
                                            {isHuman ? "กำลังโหลดข้อมูล..." : "กำลัง_ซิงค์_บล็อก..."}
                                        </>
                                    ) : (
                                        <>
                                            {isHuman ? "โหลดเพิ่มเติม" : "ดึง_ธุรกรรม_ย้อนหลัง"}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <GiphyPicker
                isOpen={isGiphyOpen}
                onClose={() => setIsGiphyOpen(false)}
                onSelect={(url) => setImageUrl(url)}
            />
        </section>
    );
};

export default Guestbook;
