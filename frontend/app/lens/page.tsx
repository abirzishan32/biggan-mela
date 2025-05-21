"use client";

import { useState, useEffect, useRef } from 'react';
import { LensType, LensProperties, ObjectProperties, ImageProperties, RulerProperties, ImageType } from '@/components/lens/types';
import LensVisualizer from '@/components/lens/LensVisualizer';
import ObjectImageRenderer from '@/components/lens/ObjectImageRenderer';
import PrincipalRays from '@/components/lens/PrincipalRays';
import LensControls from '@/components/lens/LensControls';
import MeasurementRuler from '@/components/lens/MeasurementRuler';
import LensFormulas from '@/components/lens/LensFormulas';

// Add import
import { useSpring, animated } from '@react-spring/web';

export default function LensLabPage() {
  // Default lens properties
  const [lensProperties, setLensProperties] = useState<LensProperties>({
    type: 'convex',
    focalLength: 20, // in cm
    radius: 40, // radius of curvature in cm
    diameter: 10, // in cm
    thickness: 2, // in cm
    refractiveIndex: 1.5
  });

  // Default object properties
  const [objectProperties, setObjectProperties] = useState<ObjectProperties>({
    distance: 40, // in cm
    height: 15 // in cm
  });

  // Calculated image properties
  const [imageProperties, setImageProperties] = useState<ImageProperties>({
    distance: 0,
    height: 0,
    isReal: true,
    isMagnified: false
  });

  // Derived image type
  const [imageType, setImageType] = useState<ImageType>('real');

  // Ruler properties
  const [containerDimensions, setContainerDimensions] = useState({ width: 800, height: 500 });
  
  // Conversion factor for pixel to cm
  const pixelToCm = 0.5;

  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });
  const [startPanOffset, setStartPanOffset] = useState({ x: 0, y: 0 });

  // UI options
  const [showFocalPoints, setShowFocalPoints] = useState(true);
  const [showPrincipalRays, setShowPrincipalRays] = useState(true);
  const [showAllRays, setShowAllRays] = useState(false);
  const [showRuler, setShowRuler] = useState(false);

  // Reference for the container element
  const containerRef = useRef<HTMLDivElement>(null);

  // Update container dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate image properties when lens or object properties change
  useEffect(() => {
    calculateImageProperties();
  }, [lensProperties, objectProperties]);

  // Calculate image properties using the lens equation
  const calculateImageProperties = () => {
    const { type, focalLength } = lensProperties;
    const { distance: objectDistance, height: objectHeight } = objectProperties;

    // Use correct focal length sign based on lens type
    const f = type === 'convex' ? focalLength : -focalLength;

    // If object is at focal point, image forms at infinity
    if (Math.abs(objectDistance - Math.abs(f)) < 0.1) {
      setImageProperties({
        distance: Infinity,
        height: Infinity,
        isReal: true,
        isMagnified: true
      });
      setImageType('real');
      return;
    }

    // Lens equation: 1/f = 1/do + 1/di
    // Rearranged: di = (do * f) / (do - f)
    const imageDistance = (objectDistance * f) / (objectDistance - f);
    
    // Magnification: m = -di/do
    const magnification = -imageDistance / objectDistance;
    
    // Image height = object height * magnification
    const imageHeight = objectHeight * magnification;
    
    // Image is real if image distance is positive (opposite side of lens from object)
    const isReal = imageDistance > 0;
    
    // Image is magnified if |magnification| > 1
    const isMagnified = Math.abs(magnification) > 1;

    setImageProperties({
      distance: Math.abs(imageDistance),
      height: imageHeight,
      isReal,
      isMagnified
    });

    setImageType(isReal ? 'real' : 'virtual');
  };

  // Handle zoom in action
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  // Handle zoom out action
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  // Handle reset zoom action
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Mouse event handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsPanning(true);
      setStartPanPoint({ x: e.clientX, y: e.clientY });
      setStartPanOffset({ ...panOffset });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoomLevel > 1) {
      const dx = e.clientX - startPanPoint.x;
      const dy = e.clientY - startPanPoint.y;
      
      // Calculate max pan limits based on zoom level
      const maxPanX = (containerDimensions.width * (zoomLevel - 1)) / 2;
      const maxPanY = (containerDimensions.height * (zoomLevel - 1)) / 2;
      
      const newX = Math.max(-maxPanX, Math.min(maxPanX, startPanOffset.x + dx));
      const newY = Math.max(-maxPanY, Math.min(maxPanY, startPanOffset.y + dy));
      
      setPanOffset({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Touch event handlers for mobile panning
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel > 1 && e.touches.length === 1) {
      setIsPanning(true);
      setStartPanPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setStartPanOffset({ ...panOffset });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPanning && zoomLevel > 1 && e.touches.length === 1) {
      const dx = e.touches[0].clientX - startPanPoint.x;
      const dy = e.touches[0].clientY - startPanPoint.y;
      
      // Calculate max pan limits based on zoom level
      const maxPanX = (containerDimensions.width * (zoomLevel - 1)) / 2;
      const maxPanY = (containerDimensions.height * (zoomLevel - 1)) / 2;
      
      const newX = Math.max(-maxPanX, Math.min(maxPanX, startPanOffset.x + dx));
      const newY = Math.max(-maxPanY, Math.min(maxPanY, startPanOffset.y + dy));
      
      setPanOffset({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };

  // Handle wheel event for zooming
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      // Zoom in
      setZoomLevel(prev => Math.min(prev + 0.1, 3));
    } else {
      // Zoom out
      setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Lens Optics Laboratory</h1>
        <p className="text-sm md:text-base">Explore the behavior of convex and concave lenses</p>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Main visualization area */}
        <div 
          ref={containerRef}
          className="flex-1 relative border-r border-gray-200 bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          style={{ cursor: isPanning ? 'grabbing' : (zoomLevel > 1 ? 'grab' : 'default') }}
        >
          <div 
            className="absolute w-full h-full transition-transform duration-100 ease-out"
            style={{ 
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              transformOrigin: 'center center',
            }}
          >
            <LensVisualizer 
              lensType={lensProperties.type}
              lensParams={lensProperties}
              showFocalPoints={showFocalPoints}
            />
            
            <PrincipalRays 
              lensType={lensProperties.type}
              lensParams={lensProperties}
              objectDistance={objectProperties.distance}
              objectHeight={objectProperties.height}
              imageDistance={imageProperties.distance}
              imageHeight={imageProperties.height}
              imageType={imageType}
              showAllRays={showAllRays}
              visible={showPrincipalRays}
            />
            
            <ObjectImageRenderer 
              lensType={lensProperties.type}
              objectDistance={objectProperties.distance}
              objectHeight={objectProperties.height}
              imageDistance={imageProperties.distance}
              imageHeight={imageProperties.height}
              imageType={imageType}
            />
            
            {showRuler && (
              <MeasurementRuler
                containerDimensions={containerDimensions}
                pixelToCm={pixelToCm / zoomLevel} // Adjust pixelToCm based on zoom level
              />
            )}
          </div>
          
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 flex flex-col bg-white bg-opacity-75 rounded-lg shadow-md overflow-hidden">
            <button 
              className="p-2 hover:bg-gray-100 transition-colors flex items-center justify-center border-b border-gray-200"
              onClick={handleZoomIn}
              title="Zoom In"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              className="p-2 hover:bg-gray-100 transition-colors flex items-center justify-center border-b border-gray-200"
              onClick={handleZoomOut}
              title="Zoom Out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              className="p-2 hover:bg-gray-100 transition-colors flex items-center justify-center"
              onClick={handleResetZoom}
              title="Reset Zoom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Zoom level indicator */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-75 px-2 py-1 rounded-md text-sm font-medium">
            {Math.round(zoomLevel * 100)}%
          </div>
          
          {/* Information overlay */}
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-85 p-3 rounded-lg shadow-lg text-sm max-w-xs">
            <h3 className="font-bold text-base mb-1">Image Properties:</h3>
            <p>
              Distance: {imageProperties.distance === Infinity 
                ? "∞" 
                : `${imageProperties.distance.toFixed(1)} cm ${imageProperties.isReal ? '(real)' : '(virtual)'}`
              }
            </p>
            <p>
              Height: {imageProperties.height === Infinity 
                ? "∞" 
                : `${Math.abs(imageProperties.height).toFixed(1)} cm ${imageProperties.height > 0 ? '(upright)' : '(inverted)'}`
              }
            </p>
            <p>
              Magnification: {imageProperties.distance === Infinity 
                ? "∞" 
                : `${Math.abs(imageProperties.height / objectProperties.height).toFixed(2)}×`
              }
            </p>
          </div>
          
          {/* Pan instructions when zoomed */}
          {zoomLevel > 1 && (
            <div className="absolute bottom-4 right-4 bg-white bg-opacity-75 p-2 rounded-md text-xs max-w-xs">
              <p>Click and drag to pan the view</p>
            </div>
          )}
        </div>
        
        {/* Controls and information area */}
        <div className="w-96 overflow-y-auto p-4 space-y-4">
          <LensControls 
            lensProperties={lensProperties}
            objectProperties={objectProperties}
            onLensChange={setLensProperties}
            onObjectChange={setObjectProperties}
          />
          
          <div className="mt-4 space-y-2 bg-white rounded-lg shadow-md p-4">
            <h3 className="font-medium mb-2">Display Options</h3>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-rays"
                checked={showPrincipalRays}
                onChange={(e) => setShowPrincipalRays(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="show-rays" className="text-sm font-medium">Show Principal Rays</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-all-rays"
                checked={showAllRays}
                onChange={(e) => setShowAllRays(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="show-all-rays" className="text-sm font-medium">Show Additional Rays</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-focal-points"
                checked={showFocalPoints}
                onChange={(e) => setShowFocalPoints(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="show-focal-points" className="text-sm font-medium">Show Focal Points</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-ruler"
                checked={showRuler}
                onChange={(e) => setShowRuler(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="show-ruler" className="text-sm font-medium">Show Measurement Ruler</label>
            </div>
            
            {/* Zoom controls in sidebar */}
            <div className="pt-2 mt-2 border-t border-gray-200">
              <h4 className="font-medium mb-2">Zoom Controls</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md"
                    onClick={handleZoomOut}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md"
                    onClick={handleZoomIn}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <button
                  className="text-xs text-blue-600 hover:text-blue-800 ml-2"
                  onClick={handleResetZoom}
                >
                  Reset
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Use mouse wheel to zoom in and out. When zoomed in, click and drag to pan.</p>
            </div>
          </div>
          
          <LensFormulas 
            lensProperties={lensProperties}
            objectProperties={objectProperties}
            imageProperties={imageProperties}
          />
        </div>
      </main>
    </div>
  );
}