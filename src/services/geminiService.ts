import { GoogleGenAI, Type } from "@google/genai";
import { Question, Difficulty, GrammarCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const questionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      text: { type: Type.STRING, description: "The sentence with '______' for the blank." },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Four options for the blank."
      },
      correctAnswer: { type: Type.STRING },
      explanation: {
        type: Type.OBJECT,
        properties: {
          rule: { type: Type.STRING },
          example: { type: Type.STRING },
          commonMistake: { type: Type.STRING }
        },
        required: ["rule", "example", "commonMistake"]
      },
      difficulty: { 
        type: Type.STRING, 
        enum: ["初级", "中级", "高级"] 
      },
      category: { 
        type: Type.STRING,
        enum: ["非谓语动词", "定语从句", "状语从句", "连词辨析", "名词性从句"]
      }
    },
    required: ["id", "text", "options", "correctAnswer", "explanation", "difficulty", "category"]
  }
};

export async function generateGrammarQuestions(): Promise<Question[]> {
  const prompt = `Generate 20 high-quality English grammar multiple-choice questions for grade 8 students (初二). 
  The questions should be challenging and cover diverse topics like non-finite verbs, relative clauses, adverbial clauses, and noun clauses.
  Each question must have exactly 4 options and one correct answer.
  Provide detailed explanations in Chinese including the rule, an example sentence, and common mistakes.
  Ensure the output is a valid JSON array matching the requested schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
      },
    });

    const questions = JSON.parse(response.text);
    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}
