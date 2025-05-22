import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

// Get API key from environment variable
const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
  console.error('Google AI API key is not configured. Please add GOOGLE_AI_API_KEY to your .env.local file');
}

// Initialize Wikipedia tool
const wikipedia = new WikipediaQueryRun({
  topKResults: 3,
  maxDocContentLength: 4000,
});

// Initialize Google AI
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Simple in-memory conversation history
let conversationHistory = [];

async function generateStudyPartnerResponse(extractedText, userQuestion, wikipediaInfo) {
  try {
    // Add the current interaction to conversation history
    conversationHistory.push({
      role: 'user',
      content: userQuestion
    });

    // Create the prompt with conversation history
    const conversationContext = conversationHistory
      .slice(-5) // Keep last 5 interactions for context
      .map(msg => `${msg.role === 'user' ? 'Student' : 'AI'}: ${msg.content}`)
      .join('\n');

    const prompt = `You are a helpful study partner who explains concepts in Bengali. Your goal is to make complex topics easy to understand for new learners.

Previous conversation context:
${conversationContext}

Current context from the image: ${extractedText}

Additional information from Wikipedia: ${wikipediaInfo || 'No additional information found'}

Current question: ${userQuestion}

If the content contains any mathematical problems or equations:
1. Identify and solve the mathematical problems step by step
2. Show all calculations and working
3. Provide the final answer
4. Explain the solution process in Bengali
5. AFTER THAT GIVE FULL SOLUTION OF THE PROBLEM
6. Solve the problem completely with all necessary steps and explanations

Please provide a clear and simple explanation in Bengali. Use examples and analogies where appropriate.
Make sure your response is:
1. Easy to understand
2. Well-structured
3. In Bengali language
4. Helpful for a new learner
5. Takes into account the conversation history
6. Includes mathematical solutions if present

YOUR RESPONSE MUST BE IN BENGALI

Format your response as a JSON object with the following structure:
{
  "explanation": "Your detailed explanation in Bengali",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "examples": ["Example 1", "Example 2"],
  "difficultyLevel": "Beginner/Intermediate/Advanced",
  "mathematicalSolution": {
    "problem": "The identified mathematical problem",
    "steps": ["Step 1", "Step 2", "Step 3"],
    "answer": "The final answer",
    "explanation": "Explanation of the solution in Bengali",
    "fullSolution": "Complete solution with all steps and detailed explanations"
  }
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the response as JSON
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON object found in response');
      }

      const jsonStr = jsonMatch[0];
      const parsedResponse = JSON.parse(jsonStr);

      // Add AI response to conversation history
      conversationHistory.push({
        role: 'assistant',
        content: parsedResponse.explanation
      });

      // Keep conversation history manageable
      if (conversationHistory.length > 10) {
        conversationHistory = conversationHistory.slice(-10);
      }

      return parsedResponse;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw response:', text);
      // Return a fallback response if JSON parsing fails
      return {
        explanation: text,
        keyPoints: [],
        examples: [],
        difficultyLevel: "Unknown"
      };
    }
  } catch (error) {
    console.error('Error generating study partner response:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');
    const userQuestion = formData.get('question');

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Create a new FormData for the Python backend
    const pythonFormData = new FormData();
    pythonFormData.append('image', imageFile);

    // Send to Python backend for OCR
    const response = await fetch('http://localhost:5000/api/ocr', {
      method: 'POST',
      body: pythonFormData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to process image');
    }

    let wikiResults = '';
    try {
      // Get additional information from Wikipedia
      wikiResults = await wikipedia.invoke(data.text);
    } catch (wikiError) {
      console.error('Wikipedia search error:', wikiError);
      // Continue without Wikipedia results if there's an error
    }

    // Generate study partner response
    const studyPartnerResponse = await generateStudyPartnerResponse(
      data.text,
      userQuestion || "Please explain this content in simple terms",
      wikiResults
    );

    // Return both the OCR result and the study partner's response
    return NextResponse.json({
      text: data.text,
      explanation: studyPartnerResponse.explanation,
      keyPoints: studyPartnerResponse.keyPoints,
      examples: studyPartnerResponse.examples,
      difficultyLevel: studyPartnerResponse.difficultyLevel,
      mathematicalSolution: studyPartnerResponse.mathematicalSolution
    });

  } catch (error) {
    console.error('Error:', error);
    
    // Handle specific error cases
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
