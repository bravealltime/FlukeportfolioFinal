"use client";

import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });
const LiveCursors = dynamic(() => import("@/components/LiveCursors"), { ssr: false });
const IncognitoDetector = dynamic(() => import("@/components/IncognitoDetector"), { ssr: false });
const KonamiCode = dynamic(() => import("@/components/KonamiCode"), { ssr: false });

export default function ClientSideComponents() {
    return (
        <>
            <LiveCursors />
            <IncognitoDetector />
            <KonamiCode />
            <Chatbot />
        </>
    );
}
