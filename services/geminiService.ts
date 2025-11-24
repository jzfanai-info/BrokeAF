import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFinancialInsights = async (transactions: Transaction[]): Promise<string> => {
  // Prepare data for the model
  const transactionSummary = transactions.slice(0, 50).map(t => 
    `${t.date}: ${t.type.toUpperCase()} - ₹${t.amount} (${t.category}) - ${t.notes || ''}`
  ).join('\n');

  const prompt = `
    Analyze the following recent financial transactions for a personal finance app user in India (Currency: INR ₹).
    Provide a concise, friendly, and actionable summary (max 300 words).
    
    Structure your response with:
    1. **Spending Patterns**: Highlight main expense categories or unusual spikes.
    2. **Savings Potential**: Identify areas where they could cut back.
    3. **Positive Feedback**: Acknowledge good habits (e.g., saving, regular income).
    
    Transaction Log:
    ${transactionSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert personal financial advisor. Your tone is encouraging, professional, and data-driven.",
        temperature: 0.7,
      }
    });

    return response.text || "Could not generate insights at this time.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Error connecting to AI service. Please try again later.";
  }
};