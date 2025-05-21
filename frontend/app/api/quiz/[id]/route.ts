import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = params.id
    
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    })
    
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(quiz)
  } catch (error: any) {
    console.error("Error fetching quiz:", error)
    return NextResponse.json(
      { error: `Error: ${error.message || "Unknown error occurred"}` },
      { status: 500 }
    )
  }
}