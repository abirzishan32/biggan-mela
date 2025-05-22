'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import useStore from '@/lib/store'
import { Camera, Mic, MapPin, Loader2, Search } from 'lucide-react'
import { identifyPlant } from '@/lib/plantnet'

const observationTypes = [
  { value: 'plant', label: 'Plant' },
  { value: 'bird', label: 'Bird'},
  { value: 'pollution', label: 'Pollution' },
  { value: 'noise' , label: 'Noise Pollution'},
]

export default function SubmitObservation() {
  const router = useRouter()
  const addObservation = useStore((state) => state.addObservation)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [location, setLocation] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [plantResults, setPlantResults] = useState(null)
  const [isIdentifying, setIsIdentifying] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState(null)
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [organs, setOrgans] = useState(['auto'])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [plantAnalysis, setPlantAnalysis] = useState(null)
  const [birdResults, setBirdResults] = useState(null)
  const [isAnalyzingBird, setIsAnalyzingBird] = useState(false)
  const [audioFile, setAudioFile] = useState(null)
  const [audioPreview, setAudioPreview] = useState(null)
  const [options, setOptions] = useState({
    includeRelatedImages: true,
    noReject: false,
    nbResults: 10,
    lang: 'en',
    type: 'kt'
  })
  const [birdAnalysis, setBirdAnalysis] = useState(null)
  const [pollutionResults, setPollutionResults] = useState(null)
  const [isAnalyzingPollution, setIsAnalyzingPollution] = useState(false)
  const [pollutionAnalysis, setPollutionAnalysis] = useState(null)
  const [isMeasuringNoise, setIsMeasuringNoise] = useState(false)
  const [noiseLevel, setNoiseLevel] = useState(null)
  const [audioStream, setAudioStream] = useState(null)
  const [audioContext, setAudioContext] = useState(null)
  const [analyserNode, setAnalyserNode] = useState(null)
  const [micSourceNode, setMicSourceNode] = useState(null)
  const [isSoundPollutionDetected, setIsSoundPollutionDetected] = useState(false)
  const intervalRef = useRef(null)

  // Define a threshold for sound pollution (this value may need calibration)
  const soundPollutionThreshold = 60; // Example relative threshold

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const selectedType = watch('type')

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setSelectedFile(file)
    setPlantResults(null) // Reset previous results
    
    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    // If bird type is selected, analyze the photo
    if (selectedType === 'bird') {
      handleAnalyzeBirdPhoto(file)
    }
    // If pollution type is selected, analyze the photo
    else if (selectedType === 'pollution') {
      handleAnalyzePollution(file)
    }
  }

  const handleAudioChange = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.match(/^audio\/(wav|mp3|mpeg)$/)) {
      setError('Please upload a WAV or MP3 file')
      return
    }

    setAudioFile(file)
    setBirdResults(null)
    
    // Create audio preview URL
    const url = URL.createObjectChange(file)
    setAudioPreview(url)
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      setError('Maximum 5 images allowed')
      return
    }
    setImages(files)
    setOrgans(files.map(() => 'auto'))
    setError(null)
  }

  const handleOrganChange = (index, value) => {
    const newOrgans = [...organs]
    newOrgans[index] = value
    setOrgans(newOrgans)
  }

  const handleAnalyzePlant = async () => {
    if (images.length === 0) {
      setError('Please select at least one image')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setResults(null)
    setPlantAnalysis(null)

    try {
      const results = await identifyPlant(images, {
        organs,
        ...options
      })
      setResults(results)

      // After successful plant identification, analyze its importance
      if (results.results && results.results.length > 0) {
        const firstResult = results.results[0].species
        const plantData = {
          scientificName: firstResult.scientificName,
          commonNames: firstResult.commonNames || [],
          family: firstResult.family,
          genus: firstResult.genus
        }

        const analysisResponse = await fetch('/api/analyze-plant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(plantData),
        })

        if (!analysisResponse.ok) {
          const errorData = await analysisResponse.json()
          throw new Error(errorData.error || 'Failed to analyze plant importance')
        }

        const analysisData = await analysisResponse.json()
        setPlantAnalysis(analysisData)

        // Show appropriate message based on database storage
        if (analysisData.isImportant) {
          if (analysisData.storedInDatabase) {
            setError(`Important plant detected and stored in database! ID: ${analysisData.observationId}`)
          } else {
            setError('Important plant detected but failed to store in database. Please try again.')
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAnalyzeBirdImpact = async (species, scientific_name, confidence) => {
    try {
      const response = await fetch('/api/analyze-bird', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          species,
          scientific_name,
          confidence
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze bird impact')
      }

      const data = await response.json()
      setBirdAnalysis(data)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }

  const handleAnalyzeBird = async () => {
    if (!audioFile) {
      setError('Please select an audio file')
      return
    }

    setIsAnalyzingBird(true)
    setError(null)
    setBirdResults(null)
    setBirdAnalysis(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioFile)
      
      // Add location if available
      if (location) {
        formData.append('latitude', location.lat)
        formData.append('longitude', location.lon)
      }

      const response = await fetch('http://localhost:5000/api/analyze-bird', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze bird audio')
      }

      const data = await response.json()
      setBirdResults(data)

      // Analyze impact for the first detection
      if (data && data.length > 0) {
        const firstDetection = data[0]
        await handleAnalyzeBirdImpact(
          firstDetection.species,
          firstDetection.scientific_name,
          firstDetection.confidence
        )
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setIsAnalyzingBird(false)
    }
  }

  const handleAnalyzeBirdPhoto = async (file) => {
    if (!file) {
      setError('Please select a photo')
      return
    }

    setIsAnalyzingBird(true)
    setError(null)
    setBirdResults(null)
    setBirdAnalysis(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('http://localhost:5000/api/analyze-bird-photo', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze bird photo')
      }

      const data = await response.json()
      setBirdResults(data)

      // Analyze impact for the first detection
      if (data && data.length > 0) {
        const firstDetection = data[0]
        await handleAnalyzeBirdImpact(
          firstDetection.species,
          firstDetection.scientific_name,
          firstDetection.confidence
        )
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setIsAnalyzingBird(false)
    }
  }

  const handleAnalyzePollution = async (file) => {
    if (!file) {
      setError('Please select a photo')
      return
    }

    setIsAnalyzingPollution(true)
    setError(null)
    setPollutionResults(null)
    setPollutionAnalysis(null)

    try {
      // Convert file to base64
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const base64data = reader.result.split(',')[1]

        // Call our API endpoint which will handle both Hugging Face and LLM analysis
        const response = await fetch('/api/analyze-pollution', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64data
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to analyze pollution')
        }

        const data = await response.json()
        setPollutionResults(data.detections)
        setPollutionAnalysis(data)
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setIsAnalyzingPollution(false)
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const observation = {
        id: Date.now(),
        ...data,
        location,
        status: 'Pending Review',
        createdAt: new Date().toISOString(),
        plantResults: selectedType === 'plant' ? plantResults : null,
      }
      addObservation(observation)
      router.push('/profile')
    } catch (error) {
      console.error('Error submitting observation:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  // Function to start noise measurement
  const startNoiseMeasurement = async () => {
    setIsMeasuringNoise(true)
    setNoiseLevel(null)
    setError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setAudioStream(stream)

      const context = new (window.AudioContext || window.webkitAudioContext)()
      setAudioContext(context)

      const analyser = context.createAnalyser()
      setAnalyserNode(analyser)

      const micSource = context.createMediaStreamSource(stream)
      setMicSourceNode(micSource)

      micSource.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      const getVolume = () => {
        analyser.getByteTimeDomainData(dataArray)
        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          const value = dataArray[i] - 128
          sum += value * value
        }
        const rms = Math.sqrt(sum / dataArray.length)
        // Estimate relative dB (simplified) - calibration needed for absolute dB
        // This formula gives a relative amplitude, converting to dB requires a reference pressure
        // For a simple indicator, we can use this relative value or a simplified dB scale
        const decibels = rms > 0 ? 20 * Math.log10(rms) : -Infinity
        
        // Simple smoothing (moving average over a few readings)
        // In a real app, you'd want a more robust average over a longer period
        setNoiseLevel(prevLevel => {
          if (prevLevel === null || !isFinite(decibels)) return isFinite(decibels) ? decibels : null
          return (prevLevel * 0.8 + decibels * 0.2)
        })
      }

      // Start measuring volume periodically
      intervalRef.current = setInterval(getVolume, 200) // Measure more frequently for smoother updates

    } catch (err) {
      console.error('Error accessing microphone:', err)
      setError('Could not access microphone. Please ensure permissions are granted.')
      setIsMeasuringNoise(false)
    }
  }

  // Function to stop noise measurement
  const stopNoiseMeasurement = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop())
      setAudioStream(null)
    }
    if (micSourceNode) {
      micSourceNode.disconnect()
      setMicSourceNode(null)
    }
    if (analyserNode) {
      analyserNode.disconnect()
      setAnalyserNode(null)
    }
    if (audioContext) {
      audioContext.close() // Close context when done
      setAudioContext(null)
    }
    setIsMeasuringNoise(false)
  }

  // Effect to detect sound pollution based on noise level
  useEffect(() => {
    if (isMeasuringNoise && noiseLevel !== null && noiseLevel > soundPollutionThreshold) {
      console.log(`Sound pollution threshold (${soundPollutionThreshold} dB) exceeded: ${noiseLevel.toFixed(2)} dB`);
      stopNoiseMeasurement();
      setIsSoundPollutionDetected(true);
    }
  }, [noiseLevel, isMeasuringNoise, soundPollutionThreshold]);

  // Clean up on component unmount or observation type change away from noise
  useEffect(() => {
    return () => {
      stopNoiseMeasurement()
    }
  }, [selectedType]) // Stop measurement if type changes

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Submit Observation</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg shadow-lg">
          {/* Observation Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Observation Type
            </label>
            <select
              {...register('type', { required: 'Please select an observation type' })}
              className="w-full p-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" className="text-muted-foreground">Select a type</option>
              {observationTypes.map((type) => (
                <option key={type.value} value={type.value} className="text-foreground">
                  {type.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <span className="text-destructive">•</span>
                <p>{errors.type.message}</p>
              </div>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Upload Photo or Audio
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 px-4 py-2 border border-input rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer">
                <Camera className="w-5 h-5 text-muted-foreground" />
                <span>Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <label className="flex items-center space-x-2 px-4 py-2 border border-input rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer">
                <Mic className="w-5 h-5 text-muted-foreground" />
                <span>Audio</span>
                <input
                  type="file"
                  accept="audio/wav,audio/mp3,audio/mpeg"
                  className="hidden"
                  onChange={handleAudioChange}
                />
              </label>
            </div>
            {selectedFile && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Selected file: {selectedFile.name}
                </p>
                {previewUrl && (
                  <div className="relative w-full h-48 mb-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                )}
                {selectedType === 'plant' && (
                  <button
                    type="button"
                    onClick={handleAnalyzePlant}
                    disabled={isIdentifying}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Search className="w-5 h-5" />
                    <span>{isIdentifying ? 'Analyzing...' : 'Analyze Plant'}</span>
                  </button>
                )}
                {selectedType === 'bird' && (
                  <button
                    type="button"
                    onClick={() => handleAnalyzeBirdPhoto(selectedFile)}
                    disabled={isAnalyzingBird}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Search className="w-5 h-5" />
                    <span>{isAnalyzingBird ? 'Analyzing...' : 'Analyze Bird Photo'}</span>
                  </button>
                )}
                {selectedType === 'pollution' && (
                  <button
                    type="button"
                    onClick={() => handleAnalyzePollution(selectedFile)}
                    disabled={isAnalyzingPollution}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Search className="w-5 h-5" />
                    <span>{isAnalyzingPollution ? 'Analyzing...' : 'Analyze Pollution'}</span>
                  </button>
                )}
              </div>
            )}
            {audioFile && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Selected audio: {audioFile.name}
                </p>
                {audioPreview && (
                  <div className="mb-4">
                    <audio controls className="w-full">
                      <source src={audioPreview} type={audioFile.type} />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleAnalyzeBird}
                  disabled={isAnalyzingBird}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Search className="w-5 h-5" />
                  <span>{isAnalyzingBird ? 'Analyzing...' : 'Analyze Bird'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Plant Identification Results */}
          {selectedType === 'plant' && isIdentifying && (
            <div className="flex items-center justify-center p-4 bg-muted rounded-md">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="ml-2 text-muted-foreground">Identifying plant...</span>
            </div>
          )}

          {selectedType === 'plant' && plantResults && (
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-semibold text-foreground mb-2">Plant Identification Results</h3>
              {plantResults.results && plantResults.results.length > 0 ? (
                <div className="space-y-2">
                  {plantResults.results.slice(0, 3).map((result, index) => (
                    <div key={index} className="bg-card p-3 rounded-md">
                      <p className="font-medium text-foreground">{result.species.scientificName}</p>
                      <p className="text-sm text-muted-foreground">
                        Confidence: {Math.round(result.score * 100)}%
                      </p>
                      {result.species.commonNames && result.species.commonNames.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Common names: {result.species.commonNames.join(', ')}
                        </p>
                      )}
                      {result.species.family && (
                        <p className="text-sm text-muted-foreground">
                          Family: {result.species.family.scientificName}
                        </p>
                      )}
                      {result.species.genus && (
                        <p className="text-sm text-muted-foreground">
                          Genus: {result.species.genus.scientificName}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No matches found</p>
              )}
            </div>
          )}

          {/* Plant Analysis Results */}
          {plantAnalysis && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Plant Importance Analysis</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-card rounded-md">
                    <p className="font-medium text-foreground">Rarity in Bangladesh</p>
                    <p className={plantAnalysis.analysis.isRare ? 'text-primary' : 'text-muted-foreground'}>
                      {plantAnalysis.analysis.isRare ? 'Rare' : 'Common'}
                    </p>
                  </div>
                  <div className="p-3 bg-card rounded-md">
                    <p className="font-medium text-foreground">Scientific Importance</p>
                    <p className={plantAnalysis.analysis.isScientificallyImportant ? 'text-primary' : 'text-muted-foreground'}>
                      {plantAnalysis.analysis.isScientificallyImportant ? 'Important' : 'Not Significant'}
                    </p>
                  </div>
                  <div className="p-3 bg-card rounded-md">
                    <p className="font-medium text-foreground">Medicinal Value</p>
                    <p className={plantAnalysis.analysis.hasMedicinalValue ? 'text-primary' : 'text-muted-foreground'}>
                      {plantAnalysis.analysis.hasMedicinalValue ? 'Has Medicinal Value' : 'No Known Medicinal Value'}
                    </p>
                  </div>
                  <div className="p-3 bg-card rounded-md">
                    <p className="font-medium text-foreground">Conservation Status</p>
                    <p className="text-muted-foreground">{plantAnalysis.analysis.conservationStatus}</p>
                  </div>
                </div>

                <div className="p-3 bg-card rounded-md">
                  <p className="font-medium text-foreground">Explanation</p>
                  <p className="text-muted-foreground">{plantAnalysis.analysis.explanation}</p>
                </div>

                {plantAnalysis.isImportant && (
                  <div className={`mt-4 p-4 rounded-md ${
                    plantAnalysis.storedInDatabase 
                      ? 'bg-green-100 border border-green-200' 
                      : 'bg-yellow-100 border border-yellow-200'
                  }`}>
                    <p className={`font-medium ${
                      plantAnalysis.storedInDatabase 
                        ? 'text-green-800' 
                        : 'text-yellow-800'
                    }`}>
                      {plantAnalysis.storedInDatabase 
                        ? `Important plant stored in database! ID: ${plantAnalysis.observationId}`
                        : 'Important plant detected but failed to store in database. Please try again.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bird Analysis Results */}
          {birdResults && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Bird Identification Results</h3>
              
              {/* Group detections by species */}
              {Object.entries(
                birdResults.reduce((acc, detection) => {
                  const key = detection.species;
                  if (!acc[key]) {
                    acc[key] = {
                      scientific_name: detection.scientific_name,
                      detections: [],
                      total_detections: 0,
                      avg_confidence: 0
                    };
                  }
                  acc[key].detections.push(detection);
                  acc[key].total_detections += 1;
                  acc[key].avg_confidence = acc[key].detections.reduce((sum, d) => sum + d.confidence, 0) / acc[key].total_detections;
                  return acc;
                }, {})
              ).map(([species, data]) => (
                <div key={species} className="mb-6 bg-card p-4 rounded-md shadow-sm">
                  {/* Species Header */}
                  <div className="border-b pb-3 mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-xl text-foreground">{species}</h4>
                        <p className="text-sm text-muted-foreground italic">{data.scientific_name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          Total Detections: {data.total_detections}
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(data.avg_confidence * 100).toFixed(1)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-muted-foreground">
                            Avg: {(data.avg_confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Detections */}
                  <div className="space-y-3">
                    {data.detections.map((detection, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-md">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-foreground">Time Range</div>
                            <div className="text-sm text-muted-foreground">
                              {detection.start_time === 0 && detection.end_time === 0 
                                ? 'Photo detection'
                                : `${detection.start_time}s - ${detection.end_time}s`
                              }
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">Confidence</div>
                            <div className="flex items-center">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    detection.confidence > 0.5 ? 'bg-green-500' :
                                    detection.confidence > 0.3 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${(detection.confidence * 100).toFixed(1)}%` }}
                                ></div>
                              </div>
                              <span className={`text-sm font-medium ${
                                detection.confidence > 0.5 ? 'text-green-600' :
                                detection.confidence > 0.3 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {(detection.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bird Impact Analysis Results */}
          {birdAnalysis && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Bird Impact Analysis</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-card rounded-md">
                    <p className="font-medium text-foreground">Conservation Status</p>
                    <p className={birdAnalysis.analysis.isEndangered ? 'text-red-600' : 'text-muted-foreground'}>
                      {birdAnalysis.analysis.conservationStatus}
                    </p>
                  </div>
                  <div className="p-3 bg-card rounded-md">
                    <p className="font-medium text-foreground">Ecological Importance</p>
                    <p className={birdAnalysis.analysis.isEcologicallyImportant ? 'text-primary' : 'text-muted-foreground'}>
                      {birdAnalysis.analysis.isEcologicallyImportant ? 'Important' : 'Not Significant'}
                    </p>
                  </div>
                  <div className="p-3 bg-card rounded-md">
                    <p className="font-medium text-foreground">Population Trend</p>
                    <p className={birdAnalysis.analysis.populationTrend === 'Increasing' ? 'text-green-600' : 
                                 birdAnalysis.analysis.populationTrend === 'Stable' ? 'text-blue-600' : 'text-red-600'}>
                      {birdAnalysis.analysis.populationTrend}
                    </p>
                  </div>
                  <div className="p-3 bg-card rounded-md">
                    <p className="font-medium text-foreground">Habitat Type</p>
                    <p className="text-muted-foreground">{birdAnalysis.analysis.habitatType}</p>
                  </div>
                </div>

                <div className="p-3 bg-card rounded-md">
                  <p className="font-medium text-foreground">Ecological Role</p>
                  <p className="text-muted-foreground">{birdAnalysis.analysis.ecologicalRole}</p>
                </div>

                <div className="p-3 bg-card rounded-md">
                  <p className="font-medium text-foreground">Conservation Recommendations</p>
                  <p className="text-muted-foreground">{birdAnalysis.analysis.conservationRecommendations}</p>
                </div>

                {birdAnalysis.analysis.shouldMonitor && (
                  <div className="mt-4 p-4 bg-accent border border-accent-foreground/20 rounded-md">
                    <p className="text-accent-foreground font-medium">
                      This bird species requires monitoring! Consider reporting this sighting to local conservation authorities.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pollution Analysis Results */}
          {selectedType === 'pollution' && (
            <div className="mt-4">
              {isAnalyzingPollution ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Analyzing pollution...</span>
                </div>
              ) : (
                <>
                  {pollutionResults && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Detection Results</h3>
                      <div className="space-y-4">
                        {/* Image with bounding boxes */}
                        <div className="relative w-full h-64 mb-4">
                          <img
                            src={previewUrl}
                            alt="Detection Preview"
                            className="w-full h-full object-contain"
                            onLoad={(e) => {
                              const img = e.target;
                              const containerWidth = img.clientWidth;
                              const containerHeight = img.clientHeight;
                              const imgWidth = img.naturalWidth;
                              const imgHeight = img.naturalHeight;
                              
                              // Calculate scaling factors
                              const scaleX = containerWidth / imgWidth;
                              const scaleY = containerHeight / imgHeight;
                              
                              // Update all bounding boxes
                              const boxes = document.querySelectorAll('.detection-box');
                              boxes.forEach(box => {
                                const xmin = parseFloat(box.dataset.xmin);
                                const ymin = parseFloat(box.dataset.ymin);
                                const xmax = parseFloat(box.dataset.xmax);
                                const ymax = parseFloat(box.dataset.ymax);
                                
                                // Calculate scaled positions and dimensions
                                const left = xmin * scaleX;
                                const top = ymin * scaleY;
                                const width = (xmax - xmin) * scaleX;
                                const height = (ymax - ymin) * scaleY;
                                
                                // Apply the scaled values
                                box.style.left = `${left}px`;
                                box.style.top = `${top}px`;
                                box.style.width = `${width}px`;
                                box.style.height = `${height}px`;
                              });
                            }}
                          />
                          {pollutionResults.detections && pollutionResults.detections.map((detection, index) => (
                            <div
                              key={index}
                              className="absolute border-2 border-red-500 detection-box"
                              data-xmin={detection.box.xmin}
                              data-ymin={detection.box.ymin}
                              data-xmax={detection.box.xmax}
                              data-ymax={detection.box.ymax}
                              style={{
                                left: '0px',
                                top: '0px',
                                width: '0px',
                                height: '0px',
                              }}
                            >
                              <div className="absolute -top-6 left-0 bg-red-500 text-white px-2 py-1 text-sm rounded">
                                {detection.label} ({Math.round(detection.score * 100)}%)
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Detection details */}
                        <div className="space-y-2">
                          {pollutionResults.detections && pollutionResults.detections.map((detection, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-md">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{detection.label}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Box: ({detection.box.xmin}, {detection.box.ymin}) to ({detection.box.xmax}, {detection.box.ymax})
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                      <div 
                                        className={`h-2 rounded-full ${
                                          detection.score > 0.7 ? 'bg-green-500' :
                                          detection.score > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${detection.score * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className={`text-sm font-medium ${
                                      detection.score > 0.7 ? 'text-green-600' :
                                      detection.score > 0.4 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                      {Math.round(detection.score * 100)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {pollutionAnalysis && pollutionAnalysis.analysis && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Pollution Analysis</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-card rounded-md">
                            <p className="font-medium">Pollution Level</p>
                            <p className={`${
                              pollutionAnalysis.analysis.pollutionLevel === 'High' ? 'text-red-600' :
                              pollutionAnalysis.analysis.pollutionLevel === 'Medium' ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {pollutionAnalysis.analysis.pollutionLevel}
                            </p>
                          </div>
                          <div className="p-3 bg-card rounded-md">
                            <p className="font-medium">Detected Objects</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {pollutionAnalysis.analysis.detectedObjects && 
                                pollutionAnalysis.analysis.detectedObjects.map((obj, index) => (
                                  <li key={index}>{typeof obj === 'string' ? obj : JSON.stringify(obj)}</li>
                                ))}
                            </ul>
                          </div>
                        </div>

                        <div className="p-3 bg-card rounded-md">
                          <p className="font-medium">Environmental Risks</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {pollutionAnalysis.analysis.environmentalRisks && 
                              pollutionAnalysis.analysis.environmentalRisks.map((risk, index) => (
                                <li key={index}>{typeof risk === 'string' ? risk : JSON.stringify(risk)}</li>
                              ))}
                          </ul>
                        </div>

                        <div className="p-3 bg-card rounded-md">
                          <p className="font-medium">Impact on Wildlife</p>
                          <p className="text-sm text-muted-foreground">
                            {typeof pollutionAnalysis.analysis.wildlifeImpact === 'string' 
                              ? pollutionAnalysis.analysis.wildlifeImpact 
                              : JSON.stringify(pollutionAnalysis.analysis.wildlifeImpact)}
                          </p>
                        </div>

                        <div className="p-3 bg-card rounded-md">
                          <p className="font-medium">Ecosystem Impact</p>
                          <p className="text-sm text-muted-foreground">
                            {typeof pollutionAnalysis.analysis.ecosystemImpact === 'string'
                              ? pollutionAnalysis.analysis.ecosystemImpact
                              : JSON.stringify(pollutionAnalysis.analysis.ecosystemImpact)}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-card rounded-md">
                            <p className="font-medium">Immediate Actions</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {pollutionAnalysis.analysis.immediateActions && 
                                pollutionAnalysis.analysis.immediateActions.map((action, index) => (
                                  <li key={index}>{typeof action === 'string' ? action : JSON.stringify(action)}</li>
                                ))}
                            </ul>
                          </div>
                          <div className="p-3 bg-card rounded-md">
                            <p className="font-medium">Long-term Solutions</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {pollutionAnalysis.analysis.longTermSolutions && 
                                pollutionAnalysis.analysis.longTermSolutions.map((solution, index) => (
                                  <li key={index}>{typeof solution === 'string' ? solution : JSON.stringify(solution)}</li>
                                ))}
                            </ul>
                          </div>
                        </div>

                        <div className="p-3 bg-card rounded-md">
                          <p className="font-medium">Detailed Explanation</p>
                          <p className="text-sm text-muted-foreground">
                            {typeof pollutionAnalysis.analysis.explanation === 'string'
                              ? pollutionAnalysis.analysis.explanation
                              : JSON.stringify(pollutionAnalysis.analysis.explanation)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Noise Pollution Section */}
          {selectedType === 'noise' && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Noise Pollution Measurement</h3>
              <div className="flex items-center space-x-4">
                {!isMeasuringNoise ? (
                  <button
                    type="button"
                    onClick={startNoiseMeasurement}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <Mic className="w-5 h-5" />
                    <span>Start Measurement</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopNoiseMeasurement}
                    className="flex items-center space-x-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                  >
                    <Mic className="w-5 h-5" />
                    <span>Stop Measurement</span>
                  </button>
                )}
                {isMeasuringNoise && noiseLevel !== null && (
                  <div className="text-lg font-bold text-foreground">
                    {/* Displaying a relative value or a simplified indicator */}
                    Noise Level: {noiseLevel.toFixed(2)} dB (relative)
                  </div>
                )}
                {isSoundPollutionDetected && !isMeasuringNoise && (
                  <div className="text-lg font-bold text-destructive">
                    Sound pollution detected!
                  </div>
                )}
              </div>
              {error && isMeasuringNoise && (
                <div className="mt-2 p-2 bg-destructive/10 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes
            </label>
            <textarea
              {...register('notes', { required: 'Please add some notes' })}
              rows={4}
              className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
              placeholder="Describe what you observed..."
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Location
            </label>
            <button
              type="button"
              onClick={getLocation}
              className="flex items-center space-x-2 px-4 py-2 border border-input rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span>Get Current Location</span>
            </button>
            {location && (
              <p className="mt-2 text-sm text-muted-foreground">
                Lat: {location.lat.toFixed(6)}, Lon: {location.lon.toFixed(6)}
              </p>
            )}
          </div>

          {/* Plant Identification */}
          {selectedType === 'plant' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Plant Images (up to 5)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              {images.length > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="space-y-2">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Plant ${index + 1}`}
                          className="w-full h-48 object-cover rounded"
                        />
                        <select
                          value={organs[index]}
                          onChange={(e) => handleOrganChange(index, e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="auto">Auto-detect</option>
                          <option value="leaf">Leaf</option>
                          <option value="flower">Flower</option>
                          <option value="fruit">Fruit</option>
                          <option value="bark">Bark</option>
                          <option value="habit">Habit</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeRelatedImages"
                        checked={options.includeRelatedImages}
                        onChange={(e) => setOptions(prev => ({
                          ...prev,
                          includeRelatedImages: e.target.checked
                        }))}
                        className="rounded"
                      />
                      <label htmlFor="includeRelatedImages">
                        Include related images
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="noReject"
                        checked={options.noReject}
                        onChange={(e) => setOptions(prev => ({
                          ...prev,
                          noReject: e.target.checked
                        }))}
                        className="rounded"
                      />
                      <label htmlFor="noReject">
                        Disable "no result" for reject class
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Number of Results
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={options.nbResults}
                        onChange={(e) => setOptions(prev => ({
                          ...prev,
                          nbResults: parseInt(e.target.value)
                        }))}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAnalyzePlant}
                    disabled={isAnalyzing}
                    className="w-full bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Plant'}
                  </button>
                </div>
              )}

              {results && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Identification Results</h3>
                  <div className="space-y-4">
                    {results.results.map((result, index) => (
                      <div key={index} className="border rounded p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">
                              {result.species.scientificNameWithoutAuthor}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {result.species.commonNames?.join(', ')}
                            </p>
                            <p className="text-sm">
                              Family: {result.species.family.scientificNameWithoutAuthor}
                            </p>
                            <p className="text-sm">
                              Genus: {result.species.genus.scientificNameWithoutAuthor}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                              {Math.round(result.score * 100)}% match
                            </span>
                          </div>
                        </div>

                        {options.includeRelatedImages && result.images && (
                          <div className="mt-4">
                            <h5 className="font-medium mb-2">Similar Images</h5>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {result.images.map((image, imgIndex) => (
                                <div key={imgIndex} className="relative">
                                  <img
                                    src={image.url.m}
                                    alt={`Similar ${image.organ}`}
                                    className="w-full h-32 object-cover rounded"
                                  />
                                  <span className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                    {image.organ}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Observation'}
          </button>
        </form>
      </div>
    </main>
  )
} 