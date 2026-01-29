"use client";

import React from "react";

import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });
const IncognitoDetector = dynamic(() => import("@/components/IncognitoDetector"), { ssr: false });
const KonamiCode = dynamic(() => import("@/components/KonamiCode"), { ssr: false });

export default function ClientSideComponents() {
    const [shouldRender, setShouldRender] = React.useState(false);

    React.useEffect(() => {
        // Delay non-critical components to improve TBT during initial load
        const timer = setTimeout(() => {
            setShouldRender(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    if (!shouldRender) return null;

    return (
        <>
            <IncognitoDetector />
            <KonamiCode />
            <Chatbot />
        </>
    );
}
