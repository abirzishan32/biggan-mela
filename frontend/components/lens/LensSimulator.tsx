"use client";

import { useState, useEffect, useRef } from 'react';
import LensVisualizer from './LensVisualizer';
import ObjectImageRenderer from './ObjectImageRenderer';
import PrincipalRays from './PrincipalRays';
import LensControls from './LensControls';
import MeasurementRuler from './MeasurementRuler';
import LensFormulas from './LensFormulas';
import { LensType, ImageType, LensParameters } from './types';

export default function LensSimulator() {
    // Simulation state
    const [lensType, setLensType] = useState<LensType>('convex');
    const [lensParams, setLensParams] = useState<LensParameters>({
        type: 'convex', // Add the required lens type
        focalLength: 20, // in cm
        radius: 40, // Add the required radius property (in cm)
        diameter: 140, // in pixels
        thickness: 20, // in pixels
        refractiveIndex: 1.5
    });

    // Object properties
    const [objectDistance, setObjectDistance] = useState(200); // in pixels
    const [objectHeight, setObjectHeight] = useState(100); // in pixels

    // Calculated image properties
    const [imageDistance, setImageDistance] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);
    const [imageType, setImageType] = useState<ImageType>('real');

    // UI state
    const [showPrincipalRays, setShowPrincipalRays] = useState(true);
    const [showAllRays, setShowAllRays] = useState(false);
    const [showFocalPoints, setShowFocalPoints] = useState(true);
    const [showRuler, setShowRuler] = useState(false);

    // Container ref for measurements
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerDimensions, setContainerDimensions] = useState({ width: 800, height: 500 });

    // Pixel to centimeter conversion for the ruler
    const pixelToCm = 0.5; // 1 pixel = 0.5 cm (example scale)

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

    // Calculate image properties based on lens equation: 1/f = 1/do + 1/di
    useEffect(() => {
        calculateImageProperties();
    }, [lensType, lensParams.focalLength, objectDistance, objectHeight]);

    const calculateImageProperties = () => {
        // Sign convention: Convex lens has positive focal length, concave has negative
        const f = lensType === 'convex' ? lensParams.focalLength : -lensParams.focalLength;

        // If object is at focal point, image forms at infinity
        if (Math.abs(objectDistance - Math.abs(f)) < 1) {
            setImageDistance(Infinity);
            setImageHeight(Infinity);
            setImageType('real');
            return;
        }

        // Calculate image distance using the lens formula: 1/f = 1/do + 1/di
        // Solving for di: di = (do * f) / (do - f)
        const di = (objectDistance * f) / (objectDistance - f);

        // Calculate image height using magnification: M = -di/do = hi/ho
        // Solving for hi: hi = -ho * di / do
        const hi = -objectHeight * di / objectDistance;

        // Determine image type
        // For convex lens:
        //   - If di is positive, image is real (opposite side of object)
        //   - If di is negative, image is virtual (same side as object)
        // For concave lens:
        //   - Image is always virtual (di is negative)
        const isReal = di > 0;

        setImageDistance(Math.abs(di));
        setImageHeight(Math.abs(hi));
        setImageType(isReal ? 'real' : 'virtual');
    };

    // Update lens focal length when curvature radius changes
    const handleRadiusChange = (radius: number) => {
        // Lens maker's equation (simplified): 1/f = (n-1) * (1/R1 - 1/R2)
        // For a symmetric lens, R1 = -R2 = R, so 1/f = 2(n-1)/R
        // Solving for f: f = R / (2 * (n-1))
        const n = lensParams.refractiveIndex;
        const focalLength = radius / (2 * (n - 1));

        setLensParams(prev => ({
            ...prev,
            focalLength: Math.abs(focalLength)
        }));
    };

    // Directly update focal length (alternative control)
    const handleFocalLengthChange = (focalLength: number) => {
        setLensParams(prev => ({
            ...prev,
            focalLength
        }));
    };

    // Update lens diameter
    const handleDiameterChange = (diameter: number) => {
        setLensParams(prev => ({
            ...prev,
            diameter,
            thickness: lensType === 'convex' ? diameter * 0.15 : diameter * 0.05
        }));
    };

    // Toggle between convex and concave lens
    const handleLensTypeChange = (type: LensType) => {
        setLensType(type);

        // Adjust thickness based on lens type and diameter
        setLensParams(prev => ({
            ...prev,
            thickness: type === 'convex' ? prev.diameter * 0.15 : prev.diameter * 0.05
        }));
    };

    // Handle refractive index change
    const handleRefractiveIndexChange = (index: number) => {
        setLensParams(prev => ({
            ...prev,
            refractiveIndex: index
        }));

        // Recalculate focal length based on the lens maker's equation
        const radius = 2 * lensParams.focalLength * (index - 1);
        handleRadiusChange(radius);
    };

    return (
        <div className="flex flex-col md:flex-row h-full w-full">
            {/* Simulation visualization area */}
            <div
                ref={containerRef}
                className="flex-1 relative bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden min-h-[500px]"
            >
                <div className="absolute inset-0">
                    <LensVisualizer
                        lensType={lensType}
                        lensParams={lensParams}
                        showFocalPoints={showFocalPoints}
                    />

                    <PrincipalRays
                        lensType={lensType}
                        lensParams={lensParams}
                        objectDistance={objectDistance}
                        objectHeight={objectHeight}
                        imageDistance={imageDistance}
                        imageHeight={imageHeight}
                        imageType={imageType}
                        showAllRays={showAllRays}
                        visible={showPrincipalRays}
                    />

                    <ObjectImageRenderer
                        lensType={lensType}
                        objectDistance={objectDistance}
                        objectHeight={objectHeight}
                        imageDistance={imageDistance}
                        imageHeight={imageHeight}
                        imageType={imageType}
                    />

                    {showRuler && (
                        <MeasurementRuler
                            containerDimensions={containerDimensions}
                            pixelToCm={pixelToCm}
                        />
                    )}
                </div>

                {/* Information overlay */}
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-85 p-3 rounded-lg shadow-lg text-sm max-w-xs">
                    <h3 className="font-bold text-base mb-1">Image Properties:</h3>
                    <p>Distance: {imageDistance === Infinity ? "∞" : `${(imageDistance * pixelToCm).toFixed(1)} cm`}</p>
                    <p>Height: {imageHeight === Infinity ? "∞" : `${(imageHeight * pixelToCm).toFixed(1)} cm`}</p>
                    <p>Type: <span className={imageType === 'real' ? 'text-green-600' : 'text-blue-600'}>
                        {imageType.charAt(0).toUpperCase() + imageType.slice(1)}
                    </span></p>
                    <p>Orientation: {imageHeight > 0 ? 'Upright' : 'Inverted'}</p>
                </div>
            </div>

            {/* Controls and information panel */}
            <div className="w-full md:w-80 bg-white p-4 overflow-y-auto shadow-lg">
                <h2 className="text-xl font-bold mb-4">Lens Controls</h2>

                <LensControls
                    lensProperties={{
                        type: lensType,
                        focalLength: lensParams.focalLength,
                        radius: lensParams.radius,
                        diameter: lensParams.diameter,
                        thickness: lensParams.thickness,
                        refractiveIndex: lensParams.refractiveIndex
                    }}
                    objectProperties={{
                        distance: objectDistance,
                        height: objectHeight
                    }}
                    onLensChange={(newLensProps) => {
                        setLensType(newLensProps.type);
                        setLensParams(newLensProps);
                    }}
                    onObjectChange={(newObjectProps) => {
                        setObjectDistance(newObjectProps.distance);
                        setObjectHeight(newObjectProps.height);
                    }}
                />

                <div className="mt-4 space-y-2">
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
                </div>

                <LensFormulas
                    lensProperties={{
                        type: lensType,
                        focalLength: lensParams.focalLength,
                        radius: lensParams.radius,
                        diameter: lensParams.diameter,
                        thickness: lensParams.thickness,
                        refractiveIndex: lensParams.refractiveIndex
                    }}
                    objectProperties={{
                        distance: objectDistance,
                        height: objectHeight
                    }}
                    imageProperties={{
                        distance: imageDistance,
                        height: imageHeight,
                        isReal: imageType === 'real',
                        isMagnified: Math.abs(imageHeight / objectHeight) > 1
                    }}
                />
            </div>
        </div>
    );
}