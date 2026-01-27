"use server";

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = (process.env.GEMINI_API_KEY || "").trim();
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_INSTRUCTION = `
    You are 'Tharabot', an AI assistant for Tharanut's Portfolio Website.
    
    Identity:
    - You are helpful, clever, and slightly witty.
    - If the user talks in Thai, reply in Thai. If English, reply in English.
    - You know that Tharanut is a "Creative Coder" / "Fullstack Developer".
    - You know his stack: Next.js, React, TypeScript, Python, Node.js.
    - You know he loves: Cyberpunk, Sci-Fi, and Interactive Design.
    
    Style:
    - Keep answers concise (max 2-3 sentences).
    - If the user asks for a joke, tell a tech-related joke.
    - Be friendly and engaging.
    
    Constraint:
    - Primarily answer about Tharanut, but you can chat about general topics if asked.
`;

export async function askGemini(prompt: string) {
    if (!apiKey) {
        return "Error: API Key is missing. Please check .env.local and restart server.";
    }

    // Models confirmed available: prefer 2.5 flash (working) over 2.0 (quota limit)
    const modelsToTry = ["gemini-2.5-flash", "gemini-flash-latest"];

    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: `
    You are 'Tharabot', an AI assistant for Tharanut's Portfolio.
    
    CRITICAL RULES:
    1. BE DIRECT: If asked for code, hex colors, or data, GIVE IT IMMEDIATELY. No "Sure!", "Here is...", or filler.
    2. IDENTITY: You are a helpful, witty AI. You know Tharanut (Fullstack/Creative Coder).
    3. LANGUAGE: Match the user's language (Thai/English).
    
    Examples:
    - User: "ขอโค้ดสีแดงเลือดหมู" -> Answer: "#8D021F"
    - User: "Skills?" -> Answer: "Next.js, React, TypeScript, Python, Node.js."
    - User: "เล่าเรื่องตลก" -> Answer: [Tells a tech joke]
    `,
                // Adjust safety settings to be less restrictive for a portfolio bot
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                ]
            });

            const chatSession = model.startChat({
                generationConfig: {
                    temperature: 0.9, // Slightly lower for more deterministic answers
                    topP: 0.95,
                    topK: 64,
                    maxOutputTokens: 200,
                },
            });

            const result = await chatSession.sendMessage(prompt);
            const text = result.response.text();

            console.log(`Model ${modelName} responded. Length: ${text.length}`);

            // If empty, it might be a safety block that didn't throw an error but returned empty candidate
            if (!text && result.response.promptFeedback) {
                console.log(`Safety Block: ${JSON.stringify(result.response.promptFeedback)}`);
            }

            return text;

        } catch (error: any) {
            console.warn(`Model ${modelName} failed:`, error.message);
            // If this was the last model...
            if (modelName === modelsToTry[modelsToTry.length - 1]) {
                return `System Error: AI Models unreachable (${error.message}).`;
            }
            continue;
        }
    }

    return "Error: Unknown system failure.";
}
