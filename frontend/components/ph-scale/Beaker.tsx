"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { BeakerState } from './types';

interface BeakerProps {
    state: BeakerState;
    onProbeInsert: (inside: boolean) => void;
    isPouring: 'none' | 'solution' | 'water';
}

export default function Beaker({ state, onProbeInsert, isPouring }: BeakerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [probePosition, setProbePosition] = useState({ x: 300, y: 100 });
    const [draggingProbe, setDraggingProbe] = useState(false);
    const prevProbeInsideRef = useRef(false);
    const [droplets, setDroplets] = useState<Array<{ x: number, y: number, size: number, speed: number, color: string }>>([]);
    const animationRef = useRef<number | undefined>(undefined);


    // React to isPouring prop
    useEffect(() => {
        if (isPouring !== 'none') {
            createDroplets(isPouring === 'water');
        }
    }, [isPouring]);

    // Draw the beaker and contents
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw beaker
        drawBeaker(ctx, canvas.width, canvas.height);

        // Draw liquid in beaker
        if (state.volumeSolution > 0 || state.volumeWater > 0) {
            drawLiquid(ctx, canvas.width, canvas.height, state);
        }

        // Draw nozzles
        drawNozzles(ctx, canvas.width, canvas.height, isPouring);

        // Draw droplets
        if (droplets.length > 0) {
            drawDroplets(ctx);
        }

        // Draw pH probe
        drawProbe(ctx, probePosition.x, probePosition.y);

        // Check if probe is in liquid
        checkProbeInLiquid();

    }, [state, probePosition, droplets, isPouring]);

    // Animation loop for droplets
    useEffect(() => {
        const updateDroplets = () => {
            setDroplets(prev => {
                // Move droplets down
                const updated = prev.map(drop => ({
                    ...drop,
                    y: drop.y + drop.speed,
                }));

                // Remove droplets that have reached the liquid or bottom of beaker
                const totalVolume = state.volumeSolution + state.volumeWater;
                const liquidLevel = 400 - (totalVolume * 2.5);

                const filtered = updated.filter(drop => {
                    // Remove if below liquid level or at bottom
                    if (drop.y > liquidLevel && totalVolume > 0) {
                        return false;
                    }

                    // Remove if at bottom of beaker
                    if (drop.y > 400) {
                        return false;
                    }

                    return true;
                });

                return filtered;
            });

            animationRef.current = requestAnimationFrame(updateDroplets);
        };

        if (droplets.length > 0) {
            animationRef.current = requestAnimationFrame(updateDroplets);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [droplets, state.volumeSolution, state.volumeWater]);

    // Create droplets for pouring animation
    const createDroplets = (isWater: boolean) => {
        const sourceX = isWater ? 300 : 200;
        const color = isWater ? '#e6f7ff' : (state.solution ? state.solution.color : '#888888');

        // Create a stream of 8-12 droplets
        const newDroplets: any = [];
        const numDrops = Math.floor(Math.random() * 5) + 8;

        for (let i = 0; i < numDrops; i++) {
            newDroplets.push({
                x: sourceX + (Math.random() * 4 - 2),
                y: 105 + (i * 5),
                size: Math.random() * 3 + 4,
                speed: Math.random() * 2 + 4,
                color
            });
        }

        setDroplets(prev => [...prev, ...newDroplets]);
    };

    // Check if probe is inside the liquid
    const checkProbeInLiquid = useCallback(() => {
        const totalVolume = state.volumeSolution + state.volumeWater;
        const liquidHeight = totalVolume * 2.5; // 100mL = 250px
        const liquidTop = 400 - liquidHeight;

        // Check if probe tip is inside liquid
        const isInside = probePosition.x > 150 &&
            probePosition.x < 350 &&
            probePosition.y + 10 > liquidTop &&
            probePosition.y + 10 < 400 &&
            totalVolume > 0;

        // Only call onProbeInsert if the state has changed
        if (isInside !== prevProbeInsideRef.current) {
            prevProbeInsideRef.current = isInside;
            onProbeInsert(isInside);
        }
    }, [probePosition, state.volumeSolution, state.volumeWater, onProbeInsert]);

    // Draw the beaker
    const drawBeaker = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // Beaker walls
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.lineTo(150, 400);
        ctx.lineTo(350, 400);
        ctx.lineTo(350, 150);
        ctx.strokeStyle = '#dddddd';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Beaker bottom
        ctx.beginPath();
        ctx.moveTo(150, 400);
        ctx.lineTo(350, 400);
        ctx.strokeStyle = '#dddddd';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Beaker measurement marks
        for (let y = 400; y > 150; y -= 25) {
            ctx.beginPath();
            ctx.moveTo(150, y);
            ctx.lineTo(160, y);
            ctx.strokeStyle = '#aaaaaa';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(350, y);
            ctx.lineTo(340, y);
            ctx.stroke();

            // Add measurement labels every 50px
            if ((400 - y) % 50 === 0) {
                const value = (400 - y) / 2.5; // Convert to mL (100mL at 250px)
                ctx.font = '12px Arial';
                ctx.fillStyle = '#aaaaaa';
                ctx.textAlign = 'right';
                ctx.fillText(`${value}mL`, 145, y + 4);
            }
        }
    };

    // Draw the liquid in the beaker
    const drawLiquid = (ctx: CanvasRenderingContext2D, width: number, height: number, state: BeakerState) => {
        const totalVolume = state.volumeSolution + state.volumeWater;
        const liquidHeight = totalVolume * 2.5; // 100mL = 250px

        if (liquidHeight <= 0) return;

        // Background for liquid
        ctx.beginPath();
        ctx.rect(150, 400 - liquidHeight, 200, liquidHeight);

        // Create gradient for liquid
        const gradient = ctx.createLinearGradient(150, 400 - liquidHeight, 350, 400);

        if (state.solution) {
            // Determine liquid color based on mixture
            if (state.volumeWater === 0) {
                // Pure solution
                gradient.addColorStop(0, state.solution.color);
                gradient.addColorStop(1, adjustColor(state.solution.color, -20));
            } else {
                // Diluted solution - blend with water color
                const waterRatio = state.volumeWater / totalVolume;
                const dilutedColor = blendColors(state.solution.color, '#e6f7ff', waterRatio);
                gradient.addColorStop(0, dilutedColor);
                gradient.addColorStop(1, adjustColor(dilutedColor, -20));
            }
        } else {
            // Only water
            gradient.addColorStop(0, '#e6f7ff');
            gradient.addColorStop(1, '#c2eaff');
        }

        ctx.fillStyle = gradient;
        ctx.fill();

        // Add shine effect
        ctx.beginPath();
        ctx.rect(170, 400 - liquidHeight, 30, liquidHeight);
        const shineGradient = ctx.createLinearGradient(170, 0, 200, 0);
        shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = shineGradient;
        ctx.fill();

        // Add meniscus effect at top of liquid
        ctx.beginPath();
        ctx.moveTo(150, 400 - liquidHeight);
        ctx.bezierCurveTo(
            200, 400 - liquidHeight - 5,
            300, 400 - liquidHeight - 5,
            350, 400 - liquidHeight
        );
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    // Draw the nozzles
    const drawNozzles = (ctx: CanvasRenderingContext2D, width: number, height: number, pouringState: 'none' | 'solution' | 'water') => {
        // Solution nozzle
        ctx.beginPath();
        ctx.moveTo(200, 50);
        ctx.lineTo(190, 100);
        ctx.lineTo(210, 100);
        ctx.closePath();
        ctx.fillStyle = pouringState === 'solution' ? '#aaaaaa' : '#888888';
        ctx.fill();
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Water nozzle
        ctx.beginPath();
        ctx.moveTo(300, 50);
        ctx.lineTo(290, 100);
        ctx.lineTo(310, 100);
        ctx.closePath();
        ctx.fillStyle = pouringState === 'water' ? '#80b0e0' : '#6495ED';
        ctx.fill();
        ctx.strokeStyle = '#4169E1';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Nozzle tips
        ctx.beginPath();
        ctx.arc(200, 100, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#666666';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(300, 100, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#4169E1';
        ctx.fill();

        // Highlight the active nozzle
        if (pouringState === 'solution') {
            ctx.beginPath();
            ctx.arc(200, 100, 5, 0, Math.PI * 2);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (pouringState === 'water') {
            ctx.beginPath();
            ctx.arc(300, 100, 5, 0, Math.PI * 2);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    };

    // Draw the pH probe
    const drawProbe = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
        // Probe body
        ctx.beginPath();
        ctx.roundRect(x - 5, y - 40, 10, 50, 5);
        ctx.fillStyle = '#dddddd';
        ctx.fill();
        ctx.strokeStyle = '#aaaaaa';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Probe tip
        ctx.beginPath();
        ctx.roundRect(x - 7, y, 14, 20, 7);
        ctx.fillStyle = '#888888';
        ctx.fill();
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Sensor
        ctx.beginPath();
        ctx.arc(x, y + 10, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffcc00';
        ctx.fill();

        // Cable
        ctx.beginPath();
        ctx.moveTo(x, y - 40);
        ctx.bezierCurveTo(
            x, y - 80,
            x + 50, y - 100,
            x + 100, y - 100
        );
        ctx.strokeStyle = '#aaaaaa';
        ctx.lineWidth = 3;
        ctx.stroke();
    };

    // Draw droplets
    const drawDroplets = (ctx: CanvasRenderingContext2D) => {
        droplets.forEach(drop => {
            ctx.beginPath();
            ctx.ellipse(
                drop.x,
                drop.y,
                drop.size / 2,
                drop.size,
                0,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = drop.color;
            ctx.fill();

            // Add shine to droplet
            ctx.beginPath();
            ctx.ellipse(
                drop.x - drop.size / 4,
                drop.y - drop.size / 4,
                drop.size / 6,
                drop.size / 4,
                0,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
        });
    };

    // Handle mouse events for probe dragging
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if click is on probe
        if (Math.abs(x - probePosition.x) < 20 && Math.abs(y - probePosition.y) < 40) {
            setDraggingProbe(true);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!draggingProbe) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Constrain movement
        const constrainedX = Math.max(50, Math.min(450, x));
        const constrainedY = Math.max(50, Math.min(390, y));

        setProbePosition({ x: constrainedX, y: constrainedY });
    };

    const handleMouseUp = () => {
        setDraggingProbe(false);
    };

    // Utility function to adjust color brightness
    const adjustColor = (color: string, amount: number): string => {
        // Remove # if present
        let hex = color.replace('#', '');

        // Convert to RGB
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // Adjust
        r = Math.max(0, Math.min(255, r + amount));
        g = Math.max(0, Math.min(255, g + amount));
        b = Math.max(0, Math.min(255, b + amount));

        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    // Utility function to blend two colors
    const blendColors = (color1: string, color2: string, ratio: number): string => {
        // Remove # if present
        let hex1 = color1.replace('#', '');
        let hex2 = color2.replace('#', '');

        // Convert to RGB
        let r1 = parseInt(hex1.substring(0, 2), 16);
        let g1 = parseInt(hex1.substring(2, 4), 16);
        let b1 = parseInt(hex1.substring(4, 6), 16);

        let r2 = parseInt(hex2.substring(0, 2), 16);
        let g2 = parseInt(hex2.substring(2, 4), 16);
        let b2 = parseInt(hex2.substring(4, 6), 16);

        // Blend
        let r = Math.round(r1 * (1 - ratio) + r2 * ratio);
        let g = Math.round(g1 * (1 - ratio) + g2 * ratio);
        let b = Math.round(b1 * (1 - ratio) + b2 * ratio);

        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <canvas
                ref={canvasRef}
                width={500}
                height={500}
                className={`cursor-${draggingProbe ? 'grabbing' : 'grab'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />

         
        </div>
    );
}