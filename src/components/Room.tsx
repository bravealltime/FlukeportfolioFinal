"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@liveblocks/react";
import { client } from "@/liveblocks.config";

export function Room({ children }: { children: ReactNode }) {
    return (
        <RoomProvider id="portfolio-room" initialPresence={{ cursor: null }}>
            {children}
        </RoomProvider>
    );
}
