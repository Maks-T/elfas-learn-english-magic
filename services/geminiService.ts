
import { GoogleGenAI, Type } from "@google/genai";
import { Correction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMessage = async (text: string): Promise<Correction | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this English sentence from a student: "${text}". 
      If there are mistakes, provide corrections. If it's correct but could be more natural, suggest a native-like version.
      Respond ONLY in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            corrected: { type: Type.STRING },
            explanation: { type: Type.STRING, description: "Short explanation in Russian" },
            nativeAlternative: { type: Type.STRING, description: "How a native speaker would say it more naturally" }
          },
          required: ["original", "corrected", "explanation", "nativeAlternative"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as Correction;
  } catch (error) {
    console.error("Error analyzing message:", error);
    return null;
  }
};

export const suggestVocabulary = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Identify 3-5 interesting English words or phrases from this context: "${text}". 
      Provide their Russian translation and an example sentence. Return as JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              translation: { type: Type.STRING },
              example: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [];
  }
};
