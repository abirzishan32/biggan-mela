import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GOOGLE_AI_API_KEY

async function queryHuggingFace(imageData) {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/facebook/detr-resnet-50",
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: imageData }),
    }
  );
  const result = await response.json();
  console.log('Hugging Face Response:', JSON.stringify(result, null, 2));
  return result;
}

async function analyzePollutionImpact(detections) {
  try {
    // Check if API key is configured
    if (!apiKey) {
      throw new Error('Google AI API key is not configured')
    }

    // Format detections for analysis
    const formattedDetections = detections.map(detection => ({
      object: detection.label,
      confidence: Math.round(detection.score * 100),
      box: detection.box
    }));

    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `Analyze the following detected objects in an image and provide an environmental impact assessment focusing on pollution:
    ${JSON.stringify(formattedDetections, null, 2)}

    Format the response as a JSON object with the following structure:
    {
      "pollutionLevel": "Low/Medium/High",
      "detectedObjects": [list of detected objects with their confidence scores],
      "environmentalRisks": [list of specific risks],
      "recommendations": [list of recommendations],
      "wildlifeImpact": string,
      "ecosystemImpact": string,
      "immediateActions": [list of immediate actions],
      "longTermSolutions": [list of long-term solutions],
      "explanation": string
    }

    Base your analysis on scientific data and environmental impact assessment principles. Consider the confidence scores of the detections in your analysis.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Try to parse the response as JSON
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON object found in response')
      }

      const jsonStr = jsonMatch[0]
      const analysis = JSON.parse(jsonStr)

      return {
        detections: formattedDetections,
        analysis
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      console.error('Raw response:', text)
      throw new Error(`Failed to parse AI response: ${parseError.message}`)
    }
  } catch (error) {
    console.error('Error analyzing pollution impact:', error)
    
    // Handle specific error cases
    if (error.message?.includes('API key')) {
      throw new Error('Invalid API key configuration')
    }

    if (error.message?.includes('parse')) {
      throw new Error('Failed to parse AI response. Please try again.')
    }

    throw new Error(`Failed to analyze pollution impact: ${error.message}`)
  }
}

export async function POST(request) {
  try {
    const { image } = await request.json()

    // First, get object detection results from Hugging Face
    const detectionResults = await queryHuggingFace(image)

    // Then analyze the pollution impact using Google AI
    const analysis = await analyzePollutionImpact(detectionResults)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing pollution:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze pollution' },
      { status: 500 }
    )
  }
} 