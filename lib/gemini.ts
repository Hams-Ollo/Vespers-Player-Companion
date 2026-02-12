
import { GoogleGenAI } from "@google/genai";
import { compressPortrait } from "../utils";

/** Primary text model — change here to update everywhere that uses this module. */
export const TEXT_MODEL = 'gemini-2.5-flash';

/** Image generation model — change here to update everywhere. */
export const IMAGE_MODEL = 'gemini-2.5-flash-image';

/** Force the SDK to use the correct API endpoint in every environment. */
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com';

const getAI = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  console.log('[Gemini] API key present:', !!apiKey, 'length:', apiKey?.length);
  if (!apiKey || apiKey === 'undefined') {
    throw new Error("Gemini API Key is missing. Ensure GEMINI_API_KEY is set in your .env file.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: { baseUrl: GEMINI_BASE_URL },
  });
};

/**
 * Creates a chat session with a specific system instruction.
 */
export const createChatWithContext = async (history: any[], systemInstruction: string) => {
  const ai = getAI();
  return ai.chats.create({
    model: TEXT_MODEL,
    history: history,
    config: {
      systemInstruction,
    }
  });
};

/**
 * Simple text generation with optional JSON response schema.
 */
export const generateWithContext = async (prompt: string, config: any = {}) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      systemInstruction: "You are a specialized D&D 5e assistant. Provide accurate rules, engaging flavor text, and well-structured responses.",
      ...config,
    },
  });
  return response.text;
};

/**
 * Generate a portrait image using the image model.
 * Returns a base64 data URI on success, or null if no image was produced.
 */
export const generatePortrait = async (prompt: string, parts?: any[]): Promise<string | null> => {
  const ai = getAI();
  const contentParts = parts || [{ text: prompt }];
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: { parts: contentParts },
    config: {
      responseModalities: ['Text', 'Image'],
    },
  });

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const raw = `data:image/png;base64,${part.inlineData.data}`;
        return compressPortrait(raw);
      }
    }
  }
  return null;
};
