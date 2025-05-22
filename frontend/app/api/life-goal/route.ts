import { NextResponse } from 'next/server';
import { generateRoadmap } from './agent';

export async function POST(req: Request) {
  try {
    const { lifeGoal, studentInfo } = await req.json();
    
    if (!lifeGoal) {
      return NextResponse.json({ error: "Life goal is required" }, { status: 400 });
    }
    
    const result = await generateRoadmap(lifeGoal, studentInfo);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}