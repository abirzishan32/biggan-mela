import { NextResponse } from 'next/server'
import axios from 'axios'
import FormData from 'form-data'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Get API key from environment variable
const apiKey = process.env.GOOGLE_AI_API_KEY

if (!apiKey) {
  console.error('Google AI API key is not configured. Please add GOOGLE_AI_API_KEY to your .env.local file')
}

// Function to get the week number of the year
function getWeekNumber(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

// Bird impact analysis function using Google AI
async function analyzeBirdImpact(species, scientific_name, confidence) {
  try {
    // Check if API key is configured
    if (!apiKey) {
      throw new Error('Google AI API key is not configured')
    }

    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `Analyze the ecological and conservation importance of the bird species ${species} (${scientific_name}) in Bangladesh. 
    Consider the following aspects:
    1. Conservation status (Endangered, Vulnerable, Near Threatened, or Least Concern)
    2. Ecological importance and role in the ecosystem
    3. Population trend (Increasing, Stable, or Decreasing)
    4. Habitat type and requirements
    5. Specific conservation recommendations
    6. Whether this species requires special monitoring

    Format the response as a JSON object with the following structure:
    {
      "isEndangered": boolean,
      "conservationStatus": string,
      "isEcologicallyImportant": boolean,
      "populationTrend": string,
      "habitatType": string,
      "ecologicalRole": string,
      "conservationRecommendations": string,
      "shouldMonitor": boolean,
      "explanation": string
    }

    Base your analysis on scientific data and conservation status in Bangladesh.`

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
        species,
        scientific_name,
        confidence,
        analysis
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      console.error('Raw response:', text)
      throw new Error(`Failed to parse AI response: ${parseError.message}`)
    }
  } catch (error) {
    console.error('Error analyzing bird impact:', error)
    
    // Handle specific error cases
    if (error.message?.includes('API key')) {
      throw new Error('Invalid API key configuration')
    }

    if (error.message?.includes('parse')) {
      throw new Error('Failed to parse AI response. Please try again.')
    }

    throw new Error(`Failed to analyze bird impact: ${error.message}`)
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const audio = formData.get('audio')
    const latitude = formData.get('latitude')
    const longitude = formData.get('longitude')

    if (!audio) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Create form data for the Python backend
    const backendFormData = new FormData()
    
    // Convert the audio file to a Buffer
    const arrayBuffer = await audio.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Append the buffer as a file
    backendFormData.append('audio', buffer, {
      filename: audio.name,
      contentType: audio.type
    })

    // Add location data if available
    if (latitude && longitude) {
      backendFormData.append('latitude', latitude)
      backendFormData.append('longitude', longitude)
    }

    // Make request to Python backend
    const response = await axios({
      method: 'post',
      url: 'http://localhost:5000/api/analyze-bird',
      data: backendFormData,
      headers: {
        ...backendFormData.getHeaders(),
        'Accept': 'application/json'
      },
      maxContentLength: 52428800, // 50MB max size
      maxBodyLength: 52428800,
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Bird analysis error:', error)
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return NextResponse.json(
            { error: 'Invalid request data' },
            { status: 400 }
          )
        case 413:
          return NextResponse.json(
            { error: 'Audio file too large (max 50MB)' },
            { status: 413 }
          )
        case 415:
          return NextResponse.json(
            { error: 'Unsupported file type. Please use WAV or MP3' },
            { status: 415 }
          )
        default:
          return NextResponse.json(
            { error: error.response.data?.error || 'Bird analysis failed' },
            { status: error.response.status }
          )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


// Bird impact analysis endpoint
export async function PUT(request) {
  try {
    const data = await request.json()
    const { species, scientific_name, confidence } = data

    // if (!species || !scientific_name) {
    //   return NextResponse.json(
    //     { error: 'Missing required bird information' },
    //     { status: 400 }
    //   )
    // }

    // Analyze bird impact using Google AI
    const analysis = await analyzeBirdImpact(species, scientific_name, confidence)
    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Bird impact analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze bird impact' },
      { status: 500 }
    )
  }
} 