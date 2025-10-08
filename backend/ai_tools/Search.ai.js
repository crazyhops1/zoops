import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_KEY });

export const askSomthing = async (question) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ type: "text", text: question+''+'about in 50 word' }]
    });

    // Return generated text
    return response
  } catch (error) {
    console.error("Error in askSomthing:", error);
    return '';
  }
};

export const messageToenglish = async (question) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ type: "text", text: question+''+' translate to english only translate . not any exlplaination.' }]
    });

    // Return generated text
    return response
  } catch (error) {
    console.error("Error in askSomthing:", error);
    return '';
  }
};