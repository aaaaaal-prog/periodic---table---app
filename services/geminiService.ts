
import { GoogleGenAI, Modality } from "@google/genai";
import { ElementData } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getFunFact = async (element: ElementData): Promise<string> => {
  if (!API_KEY) return "API Key not configured.";
  try {
    const prompt = `Tell me one surprising or fun fact about the element ${element.name} suitable for a science app for students. Keep it to one or two sentences.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching fun fact from Gemini:", error);
    return "Could not load fun fact at this time.";
  }
};

export const getElementImage = async (element: ElementData): Promise<string> => {
  if (!API_KEY) return "https://picsum.photos/512";
  try {
    const prompt = `A visually stunning, high-resolution, photorealistic image of the element ${element.name} in its natural or common state. For example, a glowing gas for Neon, a crystalline solid for Bismuth, or a silvery liquid for Mercury. Focus on scientific accuracy and aesthetic appeal.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:image/png;base64,${base64ImageBytes}`;
      }
    }
    return "https://picsum.photos/512/512?grayscale"; // Fallback if no image part
  } catch (error) {
    console.error("Error generating element image:", error);
    return "https://picsum.photos/512/512"; // Fallback on error
  }
};
