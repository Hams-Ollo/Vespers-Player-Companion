
import { GoogleGenAI } from "@google/genai";

/**
 * Initializes the Gemini AI client using the environment's API key.
 */
const getAI = () => {
  // Always use process.env.API_KEY directly in the constructor as per guidelines
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Generates text content with optional configuration (like JSON schemas).
 */
export const generateWithContext = async (prompt: string, config: any = {}) => {
  const ai = getAI();
  try {
    // Using simple text input for contents and correctly accessing .text getter
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        ...config
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

/**
 * Creates a stateful chat session with system instructions.
 */
export const createChatWithContext = async (history: any[], systemInstruction: string) => {
  const ai = getAI();
  try {
    // Placing history as a top-level property in chats.create as per SDK standards
    return ai.chats.create({
      model: 'gemini-3-flash-preview',
      history,
      config: {
        systemInstruction,
      },
    });
  } catch (error) {
    console.error("Gemini Chat Initialization Error:", error);
    throw error;
  }
};
