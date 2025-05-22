import { GoogleGenerativeAI } from "@google/generative-ai";
import { Article } from "./types";

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Summarizes an article and translates it to Bengali
 */
export async function summarizeAndTranslate(article: Article): Promise<{summary: string, bengaliSummary: string}> {
  try {
    // Extract article content
    const content = article.content || article.description || article.title;

    // Create prompt for Gemini API
    const prompt = `
      I need two tasks performed on this science news article:
      
      ARTICLE:
      Title: ${article.title}
      Content: ${content}
      
      TASKS:
      1. Write a concise summary of this article in English (3-4 sentences maximum)
      2. Translate this summary to simple Bengali that would be understandable to middle school students
      
      FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
      ENGLISH SUMMARY:
      [Your summary here]
      
      BENGALI SUMMARY:
      [Your Bengali translation here]
    `;

    // Generate response from Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract English and Bengali summaries
    const englishSummaryMatch = text.match(/ENGLISH SUMMARY:\s*([\s\S]*?)\s*(?=BENGALI SUMMARY:|$)/);
    const bengaliSummaryMatch = text.match(/BENGALI SUMMARY:\s*([\s\S]*?)$/);

    const englishSummary = englishSummaryMatch ? englishSummaryMatch[1].trim() : "Summary unavailable";
    const bengaliSummary = bengaliSummaryMatch ? bengaliSummaryMatch[1].trim() : "বাংলা সারাংশ উপলব্ধ নয়";

    return {
      summary: englishSummary,
      bengaliSummary: bengaliSummary
    };
  } catch (error) {
    console.error("Error summarizing article:", error);
    return {
      summary: "Failed to generate summary.",
      bengaliSummary: "সারাংশ তৈরি করতে ব্যর্থ হয়েছে।"
    };
  }
}