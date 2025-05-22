'use client'

import { useEffect, useState } from 'react'
import useStore from '@/lib/store'
import { Camera, Mic, MapPin, Clock, Leaf } from 'lucide-react'

export default function Profile() {
  const observations = useStore((state) => state.observations)
  const [sortedObservations, setSortedObservations] = useState([])

  useEffect(() => {
    // Sort observations by date, newest first
    const sorted = [...observations].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )
    setSortedObservations(sorted)
  }, [observations])

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-green-800 mb-8">My Observations</h1>

        <div className="grid gap-6">
          {sortedObservations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <p className="text-gray-600">No observations yet. Start by submitting your first observation!</p>
            </div>
          ) : (
            sortedObservations.map((observation) => (
              <div
                key={observation.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold capitalize">
                      {observation.type}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        observation.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {observation.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Media Preview */}
                    <div className="flex items-center space-x-4">
                      {observation.type === 'audio' ? (
                        <Mic className="w-6 h-6 text-gray-500" />
                      ) : (
                        <Camera className="w-6 h-6 text-gray-500" />
                      )}
                      <span className="text-gray-600">
                        {observation.type === 'audio' ? 'Audio Recording' : 'Photo'}
                      </span>
                    </div>

                    {/* Plant Identification Results */}
                    {observation.type === 'plant' && observation.plantResults && (
                      <div className="bg-green-50 p-4 rounded-md">
                        <div className="flex items-center space-x-2 mb-2">
                          <Leaf className="w-5 h-5 text-green-600" />
                          <h4 className="font-medium text-green-800">Plant Identification</h4>
                        </div>
                        {observation.plantResults.results && observation.plantResults.results.length > 0 ? (
                          <div className="space-y-2">
                            {observation.plantResults.results.slice(0, 3).map((result, index) => (
                              <div key={index} className="bg-white p-3 rounded-md">
                                <p className="font-medium">{result.species.scientificName}</p>
                                <p className="text-sm text-gray-600">
                                  Confidence: {Math.round(result.score * 100)}%
                                </p>
                                {result.species.commonNames && result.species.commonNames.length > 0 && (
                                  <p className="text-sm text-gray-600">
                                    Common names: {result.species.commonNames.join(', ')}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600">No matches found</p>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    <p className="text-gray-600">{observation.notes}</p>

                    {/* Location */}
                    {observation.location && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-5 h-5" />
                        <span>
                          Lat: {observation.location.lat.toFixed(6)}, Lon:{' '}
                          {observation.location.lon.toFixed(6)}
                        </span>
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center space-x-2 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(observation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
} 