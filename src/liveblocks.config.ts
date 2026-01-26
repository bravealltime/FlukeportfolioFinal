import { createClient } from "@liveblocks/client";

// Define the Presence type
// This is the data that will be shared between users in real-time
export type Presence = {
    cursor: { x: number; y: number } | null;
    message?: string;
};

// Define the UserMeta type
// This is static data about the user (id, name, color)
export type UserMeta = {
    id: string;
    info: {
        name: string;
        color: string;
    };
};

// Create the client
export const client = createClient({
    publicApiKey: "pk_dev_qE8302_sE31201_demo_key_placeholder", // Will replace with user key or demo key
});
