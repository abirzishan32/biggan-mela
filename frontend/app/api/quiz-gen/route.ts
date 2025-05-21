import { NextResponse } from "next/server";
import { generateQuiz, QuizGenerationParams } from "./agent";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, topic, difficulty, language, numberOfQuestions } = body as QuizGenerationParams;

    // Validate required fields
    if (!subject || !topic || !difficulty || !language || !numberOfQuestions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate the quiz using Gemini API
    const generatedQuiz = await generateQuiz({
      subject,
      topic,
      difficulty,
      language,
      numberOfQuestions: Number(numberOfQuestions)
    });

    console.log("Generated quiz:", generatedQuiz.title);
    
    // Debug Prisma client
    console.log("Prisma client available models:", Object.keys(prisma));
    
    if (!prisma.quiz) {
      console.error("Quiz model is not available in the Prisma client!");
      return NextResponse.json(
        { error: "Database schema error: Quiz model is not available" },
        { status: 500 }
      );
    }

    // Create a simpler quiz structure first to test database connectivity
    try {
      console.log("Testing database connection with a simple query...");
      // Try a simple operation first
      const count = await prisma.profile.count();
      console.log("Database connection successful. Profile count:", count);
    } catch (dbError) {
      console.error("Database connection test failed:", dbError);
      return NextResponse.json(
        { error: "Database connection error. Please check your database configuration." },
        { status: 500 }
      );
    }

    // Now try to create the quiz with proper error handling
    try {
      console.log("Attempting to create quiz in database...");
      
      // Store the quiz in the database using Prisma
      const quiz = await prisma.quiz.create({
        data: {
          title: generatedQuiz.title,
          subject: generatedQuiz.subject,
          topic: generatedQuiz.topic,
          difficulty: generatedQuiz.difficulty,
          language: generatedQuiz.language,
          durationMinutes: generatedQuiz.durationMinutes,
          questions: {
            create: generatedQuiz.questions.map(question => ({
              questionText: question.questionText,
              explanation: question.explanation,
              correctOption: question.options.findIndex(opt => opt.isCorrect).toString(),
              options: {
                create: question.options.map(option => ({
                  optionText: option.optionText,
                  isCorrect: option.isCorrect
                }))
              }
            }))
          }
        }
      });

      console.log("Quiz successfully created in database with ID:", quiz.id);
      
      return NextResponse.json({ 
        success: true,
        quizId: quiz.id
      });
    } catch (createError: any) {
      console.error("Failed to create quiz in database:", createError);
      
      // Return a more detailed error message
      return NextResponse.json(
        { 
          error: "Failed to create quiz in database", 
          details: createError.message,
          code: createError.code
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error processing quiz generation request:", error);
    return NextResponse.json(
      { error: `Error: ${error.message || "Unknown error occurred"}` },
      { status: 500 }
    );
  }
}