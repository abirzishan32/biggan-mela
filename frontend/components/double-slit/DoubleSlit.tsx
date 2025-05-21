"use client";

import { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { wavelengthToColor } from '@/lib/physics';

interface DoubleSlitProps {
    wavelength: number;
    slitDistance: number;
    slitWidth: number;
    screenDistance: number;
    isSimulating: boolean;
    showWaves: boolean;
    slitPosition: number;
    waveSpeed: number;
    onMeasure: (position: number, intensity: number) => void;
}

export default function DoubleSlit({
    wavelength,
    slitDistance,
    slitWidth,
    screenDistance,
    isSimulating,
    showWaves,
    slitPosition,
    waveSpeed,
    onMeasure
}: DoubleSlitProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
    const [intensity, setIntensity] = useState<number>(0);
    const [waveFrequency, setWaveFrequency] = useState(0.05); // Controls wave spacing
    const [waveTime, setWaveTime] = useState(0);

    // Animation spring
    const { animTime } = useSpring({
        animTime: isSimulating ? 1 : 0,
        from: { animTime: 0 },
        config: { duration: 100 },
        loop: isSimulating,
        reset: true,
        onChange: () => {
            if (canvasRef.current && isSimulating) {
                setWaveTime(prev => prev + 0.1 * waveSpeed);
            }
        }
    });

    // Handle mouse movement for measurements
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMousePosition({ x, y });

        // Calculate intensity at this position
        const intensity = calculateIntensity(x, y);
        setIntensity(intensity);
    };

    // Handle click to record measurements
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if measuring on screen
        const screenX = canvasRef.current.width * 0.9;
        if (x >= screenX) {
            onMeasure(x, calculateIntensity(x, y));
        }
    };

    // Calculate the intensity at a screen position
    const calculateIntensity = (x: number, y: number) => {
        if (!canvasRef.current) return 0;

        const canvas = canvasRef.current;
        const width = canvas.width;
        const height = canvas.height;
        const screenX = width * 0.9;

        // Only calculate for positions on screen
        if (x < screenX) return 0;

        // Position relative to center
        const centerY = height / 2;
        const positionY = y - centerY;
        const positionMm = (positionY / height) * 100;

        // Wavelength in mm
        const wavelengthMm = wavelength * 1e-6; // Convert nm to mm

        // Calculate for double slit interference
        const slit1Y = centerY - (slitDistance * height / 100) / 2;
        const slit2Y = centerY + (slitDistance * height / 100) / 2;

        // Distance from each slit to measurement point
        const d1 = Math.sqrt(Math.pow(x - width * slitPosition, 2) + Math.pow(y - slit1Y, 2));
        const d2 = Math.sqrt(Math.pow(x - width * slitPosition, 2) + Math.pow(y - slit2Y, 2));

        // Phase difference
        const pathDiff = d2 - d1;
        const phaseDiff = (2 * Math.PI * pathDiff) / (wavelengthMm * 10);

        // Single slit diffraction factor
        const slitWidthMm = slitWidth;
        const beta = (Math.PI * slitWidthMm * positionMm) / (wavelengthMm * screenDistance);
        const singleSlitFactor = beta === 0 ? 1 : Math.pow(Math.sin(beta) / beta, 2);

        // Double slit interference factor
        const interference = Math.pow(Math.cos(phaseDiff / 2), 2);

        // Combined intensity
        const maxIntensity = 100;
        const intensity = maxIntensity * singleSlitFactor * interference;

        return intensity;
    };

    // Draw the simulation on canvas
    const drawCanvas = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = '#0a1929';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid for scientific feel
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;

        for (let i = 0; i < canvas.width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }

        for (let i = 0; i < canvas.height; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        // Calculate positions
        const sourceX = canvas.width * 0.1; // Wave generator position
        const slitX = canvas.width * slitPosition; // Slit position (adjustable)
        const screenX = canvas.width * 0.9; // Screen position

        // Draw wave generator
        ctx.beginPath();
        ctx.fillStyle = '#444';
        ctx.fillRect(sourceX - 10, canvas.height / 2 - 40, 20, 80);
        
        // Add light indicator for wave generator (will always light up when simulation is running)
        ctx.beginPath();
        if (isSimulating) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.7)'; // Green light when simulating
        } else {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)'; // Red light when paused
        }
        ctx.arc(sourceX, canvas.height / 2, 10, 0, Math.PI * 2);
        ctx.fill();

        // Draw barrier with slits
        const centerY = canvas.height / 2;
        const slitHeight = slitWidth * canvas.height / 50;
        const slitY1 = centerY - (slitDistance * canvas.height / 100) / 2 - slitHeight / 2;
        const slitY2 = centerY + (slitDistance * canvas.height / 100) / 2 - slitHeight / 2;

        ctx.fillStyle = '#555';

        // Top part
        ctx.fillRect(slitX - 5, 0, 10, slitY1);

        // Middle part
        ctx.fillRect(slitX - 5, slitY1 + slitHeight, 10, slitY2 - (slitY1 + slitHeight));

        // Bottom part
        ctx.fillRect(slitX - 5, slitY2 + slitHeight, 10, canvas.height - (slitY2 + slitHeight));

        // Add barrier shadow for 3D effect
        const shadowGradient = ctx.createLinearGradient(slitX - 10, 0, slitX, 0);
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = shadowGradient;
        ctx.fillRect(slitX - 10, 0, 5, canvas.height);

        // Highlight for 3D effect
        const highlightGradient = ctx.createLinearGradient(slitX + 5, 0, slitX + 10, 0);
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = highlightGradient;
        ctx.fillRect(slitX + 5, 0, 5, canvas.height);

        // Draw screen
        const screenGradient = ctx.createLinearGradient(screenX - 5, 0, screenX + 5, 0);
        screenGradient.addColorStop(0, '#888');
        screenGradient.addColorStop(0.5, '#ddd');
        screenGradient.addColorStop(1, '#888');
        ctx.fillStyle = screenGradient;
        ctx.fillRect(screenX - 2, 0, 4, canvas.height);

        // Draw distance labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            `${Math.round((slitPosition - 0.1) * screenDistance).toFixed(0)} mm`,
            (sourceX + slitX) / 2,
            canvas.height - 10
        );

        ctx.fillText(
            `${Math.round((0.9 - slitPosition) * screenDistance).toFixed(0)} mm`,
            (slitX + screenX) / 2,
            canvas.height - 10
        );

        // Draw waves if simulation is running - no need for separate active state
        if (isSimulating) {
            // Draw vertical wave lines
            const waveArea = slitX - sourceX;
            const minWavePos = sourceX + 15; // Start after the wave generator

            // Draw incident waves (vertical lines)
            for (let x = minWavePos; x < slitX; x++) {
                // Calculate wave intensity at this point
                const distFromSource = x - sourceX;
                const wavePeriod = canvas.width * waveFrequency;
                const wavePhase = ((distFromSource + waveTime * wavePeriod) % wavePeriod) / wavePeriod;

                // Alternate between light and dark bands
                const alpha = Math.sin(wavePhase * Math.PI * 2) * 0.5 + 0.5;

                // Attenuate with distance
                const attenuation = 1 - (distFromSource / waveArea) * 0.3;

                // Set color based on wavelength
                const waveColor = wavelengthToColor(wavelength);
                ctx.strokeStyle = waveColor.replace('rgb', 'rgba').replace(')', `, ${alpha * attenuation})`);
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw interference patterns after slit
            if (slitX < screenX) {
                // Positions of the two slits
                const slit1Center = slitY1 + slitHeight / 2;
                const slit2Center = slitY2 + slitHeight / 2;

                // Draw emerging waves from slits (semicircle patterns)
                for (let r = 10; r < screenX - slitX; r += canvas.width * waveFrequency) {
                    // Phase based on time and distance
                    const phase1 = (r + waveTime * canvas.width * waveFrequency) % (canvas.width * waveFrequency);
                    const normalizedPhase = phase1 / (canvas.width * waveFrequency);

                    // Alternate between light and dark bands
                    const alpha = Math.sin(normalizedPhase * Math.PI * 2) * 0.5 + 0.5;

                    // Attenuate with distance
                    const attenuation = 1 - (r / (screenX - slitX)) * 0.5;

                    // Set color based on wavelength
                    const waveColor = wavelengthToColor(wavelength);

                    // First slit interference
                    ctx.beginPath();
                    ctx.strokeStyle = waveColor.replace('rgb', 'rgba').replace(')', `, ${alpha * attenuation})`);
                    ctx.arc(slitX, slit1Center, r, -Math.PI / 2, Math.PI / 2, false);
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Second slit interference 
                    ctx.beginPath();
                    ctx.arc(slitX, slit2Center, r, -Math.PI / 2, Math.PI / 2, false);
                    ctx.stroke();
                }

                // Draw interference pattern on screen
                const maxIntensityWidth = 50;
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';

                for (let y = 0; y < canvas.height; y += 2) {
                    const intensity = calculateIntensity(screenX, y) / 100;
                    if (intensity > 0.1) {
                        const waveRGB = wavelengthToRGB(wavelength);
                        const glowColor = `rgba(${waveRGB.r}, ${waveRGB.g}, ${waveRGB.b}, ${intensity * 0.5})`;

                        const gradient = ctx.createLinearGradient(
                            screenX, y,
                            screenX + maxIntensityWidth * intensity, y
                        );
                        gradient.addColorStop(0, glowColor);
                        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                        ctx.fillStyle = gradient;
                        ctx.fillRect(screenX, y, maxIntensityWidth * intensity, 2);
                    }
                }
                ctx.restore();
            }
        }

        // Draw measurement cursor
        if (mousePosition && mousePosition.x >= screenX) {
            ctx.beginPath();
            ctx.moveTo(mousePosition.x, 0);
            ctx.lineTo(mousePosition.x, canvas.height);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw measurement data
            const bgHeight = 70;
            const bgWidth = 150;
            const padding = 10;

            // Position the measurement panel
            let panelX = mousePosition.x + padding;
            if (panelX + bgWidth > canvas.width) {
                panelX = mousePosition.x - padding - bgWidth;
            }

            let panelY = mousePosition.y - bgHeight / 2;
            if (panelY < padding) {
                panelY = padding;
            } else if (panelY + bgHeight > canvas.height - padding) {
                panelY = canvas.height - bgHeight - padding;
            }

            // Draw panel background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(panelX, panelY, bgWidth, bgHeight);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.strokeRect(panelX, panelY, bgWidth, bgHeight);

            // Draw measurement data
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.textAlign = 'left';

            const posFromCenter = ((mousePosition.y - canvas.height / 2) / (canvas.height / 2) * 50).toFixed(1);
            ctx.fillText(`Position: ${posFromCenter} mm`, panelX + 10, panelY + 25);
            ctx.fillText(`Intensity: ${intensity.toFixed(1)}%`, panelX + 10, panelY + 50);
        }

        // Draw controls hint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Use the control panel to adjust parameters →', 10, 20);
        ctx.fillText('Click on the screen to take measurements', screenX + 10, 20);
    };

    // Helper function to convert wavelength to RGB values
    const wavelengthToRGB = (wavelength: number): { r: number, g: number, b: number } => {
        // Parse the wavelengthToColor output to extract RGB values
        const colorStr = wavelengthToColor(wavelength);
        const match = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

        if (match) {
            return {
                r: parseInt(match[1], 10),
                g: parseInt(match[2], 10),
                b: parseInt(match[3], 10)
            };
        }

        // Default fallback
        return { r: 255, g: 255, b: 255 };
    };

    // Effect to update wave frequency based on wavelength
    useEffect(() => {
        // Higher wavelength = lower frequency
        setWaveFrequency(0.1 - (wavelength - 380) / (750 - 380) * 0.08);
    }, [wavelength]);

    // Handle animation frame updates
    useEffect(() => {
        // Set up canvas dimensions on initial render
        if (canvasRef.current) {
            const parent = canvasRef.current.parentElement;
            if (parent) {
                canvasRef.current.width = parent.clientWidth;
                canvasRef.current.height = parent.clientHeight;
            }
        }

        if (!isSimulating) {
            drawCanvas(); // Still draw once even when paused
            cancelAnimationFrame(animationRef.current);
            return;
        }

        // Animation loop
        const animate = () => {
            drawCanvas();
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [
        isSimulating,
        wavelength,
        slitDistance,
        slitWidth,
        screenDistance,
        slitPosition,
        waveSpeed
    ]);

    // Redraw canvas when parameters change
    useEffect(() => {
        drawCanvas();
    }, []);

    return (
        <div className="w-full h-full relative">
            <canvas
                ref={canvasRef}
                className="w-full h-full cursor-pointer"
                onMouseMove={handleMouseMove}
                onClick={handleCanvasClick}
            />
        </div>
    );
}