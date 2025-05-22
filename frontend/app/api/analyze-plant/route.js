import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { z } from "zod"

// Get API key from environment variable
const apiKey = process.env.GOOGLE_AI_API_KEY

if (!apiKey) {
  console.error('Google AI API key is not configured. Please add GOOGLE_AI_API_KEY to your .env.local file')
}

// Define the output schema
const plantAnalysisSchema = z.object({
  isRare: z.boolean().describe("Whether the plant is rare in Bangladesh"),
  isScientificallyImportant: z.boolean().describe("Whether the plant is scientifically important for research"),
  hasMedicinalValue: z.boolean().describe("Whether the plant has medicinal value"),
  explanation: z.string().describe("Brief explanation of the plant's importance"),
  conservationStatus: z.string().describe("Conservation status of the plant"),
  shouldStore: z.boolean().describe("Whether the plant should be stored in the database")
})

export async function POST(request) {
  try {
    // Check if API key is configured
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google AI API key is not configured' },
        { status: 500 }
      )
    }

    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Get plant data from request
    const plantData = await request.json()

    // Validate plant data
    if (!plantData || !plantData.scientificName) {
      return NextResponse.json(
        { error: 'Invalid plant data provided' },
        { status: 400 }
      )
    }

    // Create the prompt
    const prompt = `
      Analyze the following plant information and determine its importance in Bangladesh:
      
      Scientific Name: ${plantData.scientificName}
      Common Names: ${plantData.commonNames?.join(', ') || 'Unknown'}
      Family: ${plantData.family?.scientificName || 'Unknown'}
      Genus: ${plantData.genus?.scientificName || 'Unknown'}
      
      Please analyze if this plant is:
      1. Rare in Bangladesh
      2. Scientifically important for research
      3. Valuable for medicinal purposes
      4. In need of conservation
      
      Provide a detailed analysis focusing on:
      - Rarity in Bangladesh
      - Scientific importance
      - Medicinal value
      - Conservation status
      - Whether it should be stored in a database for future research
      
      IMPORTANT: Your response MUST be a valid JSON object with the following structure:
      {
        "isRare": true/false,
        "isScientificallyImportant": true/false,
        "hasMedicinalValue": true/false,
        "explanation": "your explanation here",
        "conservationStatus": "status here",
        "shouldStore": true/false
      }
      
      Do not include any additional text or explanation outside of the JSON object.
    `

    // Generate content using Google AI
    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysisText = response.text()

    // Try to parse the response as JSON
    let analysis
    try {
      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON object found in response')
      }

      const jsonStr = jsonMatch[0]
      const parsedJson = JSON.parse(jsonStr)
      
      // Validate the parsed JSON against our schema
      analysis = plantAnalysisSchema.parse(parsedJson)
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      console.error('Raw response:', analysisText)
      throw new Error(`Failed to parse AI response: ${parseError.message}`)
    }

    return NextResponse.json({
      analysis,
      isImportant: analysis.shouldStore
    })
  } catch (error) {
    console.error('Error analyzing plant:', error)
    
    // Handle specific error cases
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key configuration' },
        { status: 401 }
      )
    }

    if (error.message?.includes('parse')) {
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: `Unable to analyze plant importance: ${error.message}` },
      { status: 500 }
    )
  }
}
