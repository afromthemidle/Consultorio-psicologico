import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set. Please configure it in your environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export interface AnalysisResult {
  summary: string;
  keyThemes: string[];
  riskFactors: string[];
  suggestedQuestions: string[];
}

export const analyzeSessionNotes = async (notes: string, language: 'en' | 'es'): Promise<AnalysisResult> => {
  const prompt = `
    You are an expert clinical psychologist assistant. Analyze the following session notes and provide a structured analysis.
    The output MUST be in ${language === 'es' ? 'Spanish' : 'English'}.
    
    Session Notes:
    """
    ${notes}
    """
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A concise, professional summary of the session.",
            },
            keyThemes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 key themes or topics discussed during the session.",
            },
            riskFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Any potential risk factors, red flags, or areas of concern (e.g., self-harm, severe anxiety). If none, provide an empty array or state 'None identified'.",
            },
            suggestedQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-4 suggested questions or topics to explore in the next session.",
            },
          },
          required: ["summary", "keyThemes", "riskFactors", "suggestedQuestions"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing notes:", error);
    throw error;
  }
};
