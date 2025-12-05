import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

// Initialize the client
// Using process.env.API_KEY as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// We keep a reference to the chat session
let chatSession: Chat | null = null;

export const startChatSession = () => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, // Balance between creativity and factual accuracy
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    startChatSession();
  }
  
  try {
    const result: GenerateContentResponse = await chatSession!.sendMessage({
      message: message,
    });
    return result.text || "I'm having trouble visualizing that right now. Please try again.";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

export const generateEcoImage = async (prompt: string): Promise<string | null> => {
  try {
    // Using gemini-2.5-flash-image as the generation model per instructions.
    // The prompt says "Generate images using gemini-2.5-flash-image by default".
    // We pass the prompt as text content.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        // We do not set responseMimeType for image generation
      }
    });

    // We iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          // Construct the data URL
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    // Fallback logic check: Sometimes the model might refuse or return text if it can't generate.
    console.warn("No image data found in response parts", parts);
    return null;

  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
