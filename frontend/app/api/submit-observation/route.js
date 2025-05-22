import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma"

export async function POST(request) {
  try {
    const data = await request.json()
    
    // Create observation in database
    const observation = await prisma.observation.create({
      data: {
        category: data.category,
        name: data.name,
        description: data.description,
        importance: data.importance
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Observation stored successfully',
      data: observation
    })

  } catch (error) {
    console.error('Error submitting observation:', error)
    return NextResponse.json(
      { error: `Failed to submit observation: ${error.message}` },
      { status: 500 }
    )
  }
} 