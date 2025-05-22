import { NextResponse } from 'next/server'
import axios from 'axios'
import FormData from 'form-data'

const API_URL = 'https://my-api.plantnet.org/v2/identify/all'
const API_KEY = "2b10TWi8hOENuG0qScmnqw5GX"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const images = formData.getAll('images')
    const organs = formData.getAll('organs') || ['auto']
    
    // Get optional parameters
    const includeRelatedImages = formData.get('includeRelatedImages') === 'true'
    const noReject = formData.get('noReject') === 'true'
    const nbResults = parseInt(formData.get('nbResults')) || 10
    const lang = formData.get('lang') || 'en'
    const type = formData.get('type') || 'kt'

    // Validate input
    if (images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      )
    }

    if (images.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 images allowed' },
        { status: 400 }
      )
    }

    if (organs.length !== images.length) {
      return NextResponse.json(
        { error: 'Number of organs must match number of images' },
        { status: 400 }
      )
    }

    // Validate organs
    const validOrgans = ['leaf', 'flower', 'fruit', 'bark', 'auto', 'habit', 'other']
    const invalidOrgans = organs.filter(organ => !validOrgans.includes(organ))
    if (invalidOrgans.length > 0) {
      return NextResponse.json(
        { error: `Invalid organs: ${invalidOrgans.join(', ')}. Valid organs are: ${validOrgans.join(', ')}` },
        { status: 400 }
      )
    }

    // Create new FormData for PlantNet API
    const plantNetFormData = new FormData()
    
    // Convert each image to a Buffer and append to form data
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      const organ = organs[i]

      // Validate image type
      if (!image.type.match(/^image\/(jpeg|png)$/)) {
        return NextResponse.json(
          { error: 'Only JPEG and PNG images are supported' },
          { status: 415 }
        )
      }

      // Convert the image to an ArrayBuffer
      const arrayBuffer = await image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Append the buffer as a file with the original filename
      plantNetFormData.append('images', buffer, {
        filename: image.name,
        contentType: image.type
      })
      plantNetFormData.append('organs', organ)
    }

    // Construct query parameters
    const queryParams = new URLSearchParams({
      'api-key': API_KEY,
      'include-related-images': includeRelatedImages,
      'no-reject': noReject,
      'nb-results': nbResults,
      'lang': lang,
      'type': type
    })

    // Make request to PlantNet API
    const response = await axios.post(
      `${API_URL}?${queryParams.toString()}`,
      plantNetFormData,
      {
        headers: {
          ...plantNetFormData.getHeaders(),
        },
        maxContentLength: 52428800, // 50MB max size
        maxBodyLength: 52428800,
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Plant identification error:', error)
    
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return NextResponse.json(
            { error: 'Invalid API key' },
            { status: 401 }
          )
        case 413:
          return NextResponse.json(
            { error: 'Image file too large (max 50MB)' },
            { status: 413 }
          )
        case 415:
          return NextResponse.json(
            { error: 'Unsupported file type. Please use JPEG or PNG' },
            { status: 415 }
          )
        case 429:
          return NextResponse.json(
            { error: 'Too many requests. Please try again later' },
            { status: 429 }
          )
        default:
          return NextResponse.json(
            { error: error.response.data?.message || 'Plant identification failed' },
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