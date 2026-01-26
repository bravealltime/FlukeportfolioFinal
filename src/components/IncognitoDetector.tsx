"use client";

import React, { useEffect, useState } from "react";
import { useSettings } from "./SettingsProvider";
import { useToast } from "./ToastProvider";
import { ShieldAlert, EyeOff } from "lucide-react";

/**
 * IncognitoDetector
 * Attempts to detect if the user is in Incognito/Private mode.
 * Note: This is a best-effort approach as browsers constantly update privacy protections.
 */
const IncognitoDetector = () => {
    const { isHuman } = useSettings();
    const { addToast } = useToast();
    const [isIncognito, setIsIncognito] = useState(false);

    useEffect(() => {
        const detectIncognito = async () => {
            try {
                if ('storage' in navigator && 'estimate' in navigator.storage) {
                    const { quota } = await navigator.storage.estimate();
                    // Chrome Incognito typically has a very low storage quota (e.g., < 120MB)
                    // Regular mode usually has gigabytes available.
                    if (quota && quota < 120000000) {
                        setIsIncognito(true);
                        triggerWelcome(true);
                        return;
                    }
                }

                // Safari Check (File System API)
                const isSafari = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
                if (isSafari) {
                    try {
                        (window as any).openDatabase(null, null, null, null);
                    } catch (e) {
                        setIsIncognito(true);
                        triggerWelcome(true);
                        return;
                    }
                }

            } catch (error) {
                console.log("Incognito detection check failed", error);
            }
        };

        const triggerWelcome = (detected: boolean) => {
            // Only show if detected
            if (detected) {
                // Determine message based on mode
                // We'll use a timeout to let the page load first
                setTimeout(() => {
                    addToast(
                        isHuman
                            ? "You've gone Incognito. Your secrets are safe here."
                            : "DETECTED: COVERT OPS_MODE // WELCOME, AGENT.",
                        "warning"
                    );
                }, 1500);
            }
        };

        detectIncognito();
    }, []);

    // No visual component rendered
    return null;
};

export default IncognitoDetector;
