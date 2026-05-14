import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getTotalGoalsInsight(
  homeTeam: string,
  awayTeam: string,
  probOver25: number,
  expectedTotal: number
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional Virtual Football betting analyst. 
      Match: ${homeTeam} vs ${awayTeam}
      Calculated Probability of Over 2.5 goals: ${(probOver25 * 100).toFixed(1)}%
      Expected total goals (Poisson): ${expectedTotal.toFixed(2)}
      
      Based on this data, provide a very concise (max 2 sentences) expert insight in French about why the 'Total de Buts' prediction should be followed. Use technical terms like 'RNG', 'Poisson', or 'Volatilité'.`,
    });
    return response.text || "Analyse indisponible pour le moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erreur lors de la génération de l'analyse avec l'intelligence artificielle.";
  }
}
