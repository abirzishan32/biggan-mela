import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch quizzes from database with count of questions
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        subject: true,
        topic: true,
        difficulty: true,
        durationMinutes: true,
        language: true,
        createdAt: true,
        questions: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Most recent first
      },
      take: 20 // Limit to 20 most recent quizzes
    });
    
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}