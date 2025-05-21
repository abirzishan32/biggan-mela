import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = params.id
    const { answers, completedAt } = await request.json()
    
    // Get authenticated user using Supabase client
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Find user profile if authenticated
    let profileId: string | undefined = undefined
    
    if (user) {
      const profile = await prisma.profile.findUnique({
        where: { email: user.email! }
      })
      
      if (profile) {
        profileId = profile.id
      }
    }
    
    // Get the quiz with questions and correct answers
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
    
    // Calculate score
    let score = 0
    const answersData = []
    
    for (const question of quiz.questions) {
      const selectedOption = answers[question.id]
      const correctOption = question.options.find(opt => opt.isCorrect)
      const isCorrect = selectedOption && correctOption && selectedOption === correctOption.id
      
      if (isCorrect) {
        score++
      }
      
      answersData.push({
        questionId: question.id,
        selectedOption: selectedOption || "",
        isCorrect: !!isCorrect
      })
    }
    
    // Create quiz attempt record
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        quizId: quizId,
        profileId: profileId, // This can be null for anonymous users
        score: score,
        totalQuestions: quiz.questions.length,
        completedAt: completedAt ? new Date(completedAt) : new Date(),
        answers: {
          create: answersData
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      score,
      totalQuestions: quiz.questions.length,
      attemptId: quizAttempt.id,
      isAuthenticated: !!profileId
    })
  } catch (error: any) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json(
      { error: `Error: ${error.message || "Unknown error occurred"}` },
      { status: 500 }
    )
  }
}