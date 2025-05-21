import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Interface for the quiz generation parameters
export interface QuizGenerationParams {
  subject: string;         // physics, chemistry, biology
  topic: string;           // specific topic within the subject
  difficulty: string;      // easy, medium, hard
  language: string;        // english or bengali
  numberOfQuestions: number;
}

// Interface for the generated quiz response
export interface GeneratedQuiz {
  title: string;
  subject: string;
  topic: string;
  difficulty: string;
  language: string;
  durationMinutes: number;
  questions: {
    questionText: string;
    options: { optionText: string; isCorrect: boolean }[];
    explanation?: string;
  }[];
}

// System prompt for quiz generation
const systemPrompt = `
You are an expert educational quiz generator specialized in science subjects. Your task is to create high-quality multiple-choice questions (MCQs) based on the parameters provided.

RESPONSE GUIDELINES:
1. Generate scientifically accurate questions and answers
2. Ensure all options are plausible but only one is correct
3. Tailor questions to the specified difficulty level:
   - Easy: Basic concepts, definitions, simple applications
   - Medium: Applied knowledge, connections between concepts
   - Hard: Complex problems, analysis, evaluation of scientific principles
4. Provide clear explanations for the correct answers
5. Create questions that test conceptual understanding, not just memorization
6. Ensure language is appropriate for the target age group and difficulty
7. Include relevant diagrams or formulas when necessary (described in text form)
8. When language is Bengali, provide both Bengali and English versions for each question and option

RESPONSE FORMAT:
Your response must be valid JSON with the following structure:
{
  "title": "Quiz title related to the topic",
  "subject": "The subject (physics, chemistry, biology)",
  "topic": "The specific topic within the subject",
  "difficulty": "easy|medium|hard",
  "language": "english|bengali",
  "durationMinutes": recommended quiz duration in minutes,
  "questions": [
    {
      "questionText": "The question text",
      "options": [
        {"optionText": "Option 1", "isCorrect": false},
        {"optionText": "Option 2", "isCorrect": true},
        {"optionText": "Option 3", "isCorrect": false},
        {"optionText": "Option 4", "isCorrect": false}
      ],
      "explanation": "Explanation of why the correct answer is right"
    }
  ]
}
`;

export async function generateQuiz(params: QuizGenerationParams): Promise<GeneratedQuiz> {
  const startTime = Date.now();
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192
      }
    });
    
    console.log(`Generating ${params.numberOfQuestions} ${params.difficulty} questions about ${params.topic} in ${params.subject} (${params.language})`);
    
    // Prepare the prompt with the specific requirements
    const userPrompt = `
Please generate a science quiz with the following parameters:

Subject: ${params.subject}
Topic: ${params.topic}
Difficulty: ${params.difficulty}
Language: ${params.language}
Number of Questions: ${params.numberOfQuestions}

Each question should have 4 options with exactly one correct answer. Please provide an explanation for each correct answer.
`;

    const response = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "I'll generate a quiz based on your requirements. Please provide the details." }] },
        { role: "user", parts: [{ text: userPrompt }] }
      ]
    });
    
    const responseText = response.response.text();
    
    try {
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      
      const parsedResponse = JSON.parse(jsonString) as GeneratedQuiz;
      
      console.log(`Generated quiz: ${parsedResponse.title} with ${parsedResponse.questions.length} questions`);
      
      return parsedResponse;
    } catch (parseError) {
      console.error("Error parsing quiz generation response:", parseError);
      throw new Error("Failed to parse the generated quiz. Please try again.");
    }
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    throw new Error(`Quiz generation failed: ${error.message}`);
  }
}