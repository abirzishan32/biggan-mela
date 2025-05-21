import { useState, useEffect, useRef } from 'react';
import { Particle, ParticleSettings } from './types';

// Constants for simulation
const CHAMBER_WIDTH = 800;
const CHAMBER_HEIGHT = 500;
const DIVIDER_WIDTH = 6;
const DIVIDER_X = CHAMBER_WIDTH / 2 - DIVIDER_WIDTH / 2;
const BOLTZMANN = 1.380649e-23; // Boltzmann constant

// Scale factors to make the simulation visually appealing
const RADIUS_SCALE = 0.5;   // Scale the radius for display
const VELOCITY_SCALE = 10.0; 
const TIME_SCALE = 0.3;     // Increased from 0.1 for faster simulation

// Initialize particles based on settings
export function initializeParticles(
    leftSettings: ParticleSettings,
    rightSettings: ParticleSettings,
    dividerPresent: boolean
): Particle[] {
    const particles: Particle[] = [];
    let id = 0;

    // Helper function to initialize particles for a side
    const initForSide = (
        side: 'left' | 'right',
        settings: ParticleSettings,
        bounds: { minX: number, maxX: number, minY: number, maxY: number }
    ) => {
        for (let i = 0; i < settings.count; i++) {
            // Calculate realistic velocity based on temperature
            // Using Maxwell-Boltzmann distribution approximation
            const kT = BOLTZMANN * settings.temperature;
            const stdDev = Math.sqrt(kT / settings.mass);

            // Random direction for initial velocity (always moving, never static)
            const angle = Math.random() * Math.PI * 2; // Random angle in radians (0 to 2π)

            const minSpeed = 1.5; // Increased from 0.5 for more noticeable movement
            const tempBasedSpeed = Math.sqrt(settings.temperature / settings.mass) * VELOCITY_SCALE;
            const speed = Math.max(minSpeed, tempBasedSpeed);

            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            // Random position within bounds
            const radius = Math.max(10, settings.radius * RADIUS_SCALE); // Ensure minimum radius
            let x, y;
            let overlap = true;
            let attempts = 0;

            // Try to place particle without overlapping (max 100 attempts)
            while (overlap && attempts < 100) {
                x = bounds.minX + radius + Math.random() * (bounds.maxX - bounds.minX - 2 * radius);
                y = bounds.minY + radius + Math.random() * (bounds.maxY - bounds.minY - 2 * radius);

                overlap = false;
                for (const p of particles) {
                    const dx = p.x - x;
                    const dy = p.y - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    // Ensure no overlap at initialization (strict check)
                    if (distance < p.radius + radius + 1) { // +1 for safety margin
                        overlap = true;
                        break;
                    }
                }
                attempts++;
            }

            // If we couldn't place without overlap after 100 attempts, try one more time with minimum distance
            if (attempts === 100) {
                // Find furthest possible point from existing particles
                let bestX = bounds.minX + radius;
                let bestY = bounds.minY + radius;
                let maxMinDistance = 0;
                
                // Try several random positions and pick the best one
                for (let a = 0; a < 20; a++) {
                    const testX = bounds.minX + radius + Math.random() * (bounds.maxX - bounds.minX - 2 * radius);
                    const testY = bounds.minY + radius + Math.random() * (bounds.maxY - bounds.minY - 2 * radius);
                    
                    let minDistance = Number.MAX_VALUE;
                    for (const p of particles) {
                        const dx = p.x - testX;
                        const dy = p.y - testY;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        minDistance = Math.min(minDistance, distance);
                    }
                    
                    if (minDistance > maxMinDistance) {
                        maxMinDistance = minDistance;
                        bestX = testX;
                        bestY = testY;
                    }
                }
                
                x = bestX;
                y = bestY;
            }

            particles.push({
                id: id++,
                x: isFinite(x!) ? x! : bounds.minX + radius,
                y: isFinite(y!) ? y! : bounds.minY + radius,
                vx: isFinite(vx) ? vx : (Math.random() * 2 - 1) * minSpeed, // Stronger fallback
                vy: isFinite(vy) ? vy : (Math.random() * 2 - 1) * minSpeed, // Stronger fallback
                radius,
                mass: settings.mass,
                color: side === 'left' ? '#3B82F6' : '#EF4444', // Blue for left, Red for right
                originalSide: side
            });
        }
    };

    // Initialize left particles
    initForSide('left', leftSettings, {
        minX: 0,
        maxX: dividerPresent ? DIVIDER_X : CHAMBER_WIDTH,
        minY: 0,
        maxY: CHAMBER_HEIGHT
    });

    // Initialize right particles
    initForSide('right', rightSettings, {
        minX: dividerPresent ? DIVIDER_X + DIVIDER_WIDTH : 0,
        maxX: CHAMBER_WIDTH,
        minY: 0,
        maxY: CHAMBER_HEIGHT
    });

    return particles;
}

// Custom hook for particle physics
export function useParticlePhysics(
    leftSettings: ParticleSettings,
    rightSettings: ParticleSettings,
    dividerPresent: boolean,
    isRunning: boolean,
    speed: number
) {
    const [particles, setParticles] = useState<Particle[]>([]);
    const requestRef = useRef<number | undefined>(undefined);
    const prevTimeRef = useRef<number | undefined>(undefined);
    const prevSettingsRef = useRef({
        leftCount: leftSettings.count,
        rightCount: rightSettings.count
    });

    // Keep track of the divider state to handle divider removal properly
    const prevDividerRef = useRef(dividerPresent);

    // Handle particle count changes (adding or removing)
    useEffect(() => {
        const leftDiff = leftSettings.count - prevSettingsRef.current.leftCount;
        const rightDiff = rightSettings.count - prevSettingsRef.current.rightCount;

        if (leftDiff !== 0 || rightDiff !== 0) {
            setParticles(prevParticles => {
                let updatedParticles = [...prevParticles];

                // Handle left particles change
                if (leftDiff > 0) {
                    // Add new particles to left side
                    const newLeftParticles = initializeParticles(
                        { ...leftSettings, count: leftDiff },
                        { ...rightSettings, count: 0 },
                        dividerPresent
                    );
                    updatedParticles = [...updatedParticles, ...newLeftParticles];
                } else if (leftDiff < 0) {
                    // Remove particles from left side
                    const leftParticles = updatedParticles.filter(p => p.originalSide === 'left');
                    const otherParticles = updatedParticles.filter(p => p.originalSide !== 'left');
                    // Sort by ID to remove newest particles first (more intuitive for user)
                    leftParticles.sort((a, b) => b.id - a.id);
                    updatedParticles = [
                        ...otherParticles,
                        ...leftParticles.slice(0, leftParticles.length + leftDiff)
                    ];
                }

                // Handle right particles change
                if (rightDiff > 0) {
                    // Add new particles to right side
                    const newRightParticles = initializeParticles(
                        { ...leftSettings, count: 0 },
                        { ...rightSettings, count: rightDiff },
                        dividerPresent
                    );
                    updatedParticles = [...updatedParticles, ...newRightParticles];
                } else if (rightDiff < 0) {
                    // Remove particles from right side
                    const rightParticles = updatedParticles.filter(p => p.originalSide === 'right');
                    const otherParticles = updatedParticles.filter(p => p.originalSide !== 'right');
                    // Sort by ID to remove newest particles first
                    rightParticles.sort((a, b) => b.id - a.id);
                    updatedParticles = [
                        ...otherParticles,
                        ...rightParticles.slice(0, rightParticles.length + rightDiff)
                    ];
                }

                return updatedParticles;
            });
        }

        // Update previous counts
        prevSettingsRef.current = {
            leftCount: leftSettings.count,
            rightCount: rightSettings.count
        };
    }, [leftSettings.count, rightSettings.count, dividerPresent]);

    // Initialize particles when radius/mass/temperature changes
    useEffect(() => {
        // Only completely reinitialize if properties other than count change
        const shouldReinitialize = (
            // First load
            particles.length === 0 ||
            // Left settings changed (except count, which is handled separately)
            particles.some(p => p.originalSide === 'left' &&
                (p.radius !== leftSettings.radius * RADIUS_SCALE ||
                    p.mass !== leftSettings.mass)) ||
            // Right settings changed (except count, which is handled separately)
            particles.some(p => p.originalSide === 'right' &&
                (p.radius !== rightSettings.radius * RADIUS_SCALE ||
                    p.mass !== rightSettings.mass))
        );

        if (shouldReinitialize) {
            const newParticles = initializeParticles(leftSettings, rightSettings, dividerPresent);
            setParticles(newParticles);
        }
    }, [
        leftSettings.radius, leftSettings.mass, leftSettings.temperature,
        rightSettings.radius, rightSettings.mass, rightSettings.temperature
    ]);

    // Handle divider state changes
    useEffect(() => {
        if (prevDividerRef.current !== dividerPresent) {
            // No need to recreate particles when divider is added/removed
            // We just need to manage collisions in the animation loop
            prevDividerRef.current = dividerPresent;
        }
    }, [dividerPresent]);

    // Handle animation loop for particle movement
    useEffect(() => {
        if (!isRunning) {
            return;
        }

        const animate = (time: number) => {
            if (prevTimeRef.current !== undefined) {
                const deltaTime = Math.max(
                    0.016, // Minimum of ~60fps equivalent
                    Math.min((time - prevTimeRef.current) * 0.001 * speed * TIME_SCALE, 0.1)
                );

                if (isFinite(deltaTime) && deltaTime > 0) {
                    setParticles(prev => {
                        // Create a copy of the particles array to update
                        const updated = [...prev];

                        // Move particles and handle wall collisions
                        for (let i = 0; i < updated.length; i++) {
                            const p = updated[i];

                            // If particle is almost stationary, give it a nudge
                            if (Math.abs(p.vx) < 0.2 && Math.abs(p.vy) < 0.2) { // Increased threshold
                                const angle = Math.random() * Math.PI * 2;
                                const speed = 1.5 + Math.random() * 1.0; // Increased from 0.5 + 0.5
                                p.vx = Math.cos(angle) * speed;
                                p.vy = Math.sin(angle) * speed;
                            }

                            // Skip update if particle has invalid properties
                            if (!isFinite(p.x) || !isFinite(p.y) || !isFinite(p.vx) || !isFinite(p.vy)) {
                                // Reset to safe values if invalid
                                p.x = CHAMBER_WIDTH / 2;
                                p.y = CHAMBER_HEIGHT / 2;
                                p.vx = Math.random() * 3 - 1.5; // Stronger random direction
                                p.vy = Math.random() * 3 - 1.5;
                                continue;
                            }

                            // Update position
                            p.x += p.vx * deltaTime;
                            p.y += p.vy * deltaTime;

                            // Ensure position values are finite after update
                            if (!isFinite(p.x) || !isFinite(p.y)) {
                                p.x = Math.min(Math.max(p.x || 0, 0), CHAMBER_WIDTH);
                                p.y = Math.min(Math.max(p.y || 0, 0), CHAMBER_HEIGHT);
                                p.vx = Math.random() * 3 - 1.5; // Stronger random
                                p.vy = Math.random() * 3 - 1.5;
                            }

                            // Wall collisions
                            if (p.x - p.radius < 0) {
                                p.x = p.radius;
                                p.vx = Math.abs(p.vx) * 1.01; // Slight energy boost on wall collision
                            } else if (p.x + p.radius > CHAMBER_WIDTH) {
                                p.x = CHAMBER_WIDTH - p.radius;
                                p.vx = -Math.abs(p.vx) * 1.01; // Slight energy boost
                            }

                            if (p.y - p.radius < 0) {
                                p.y = p.radius;
                                p.vy = Math.abs(p.vy) * 1.01; // Slight energy boost
                            } else if (p.y + p.radius > CHAMBER_HEIGHT) {
                                p.y = CHAMBER_HEIGHT - p.radius;
                                p.vy = -Math.abs(p.vy) * 1.01; // Slight energy boost
                            }

                            // Divider collision - only if divider is present
                            if (dividerPresent) {
                                if (p.x - p.radius < DIVIDER_X + DIVIDER_WIDTH && p.x + p.radius > DIVIDER_X) {
                                    if (p.x < DIVIDER_X + DIVIDER_WIDTH / 2) {
                                        p.x = DIVIDER_X - p.radius;
                                        p.vx = -Math.abs(p.vx) * 1.01; // Slight energy boost
                                    } else {
                                        p.x = DIVIDER_X + DIVIDER_WIDTH + p.radius;
                                        p.vx = Math.abs(p.vx) * 1.01; // Slight energy boost
                                    }
                                }
                            }
                        }

                        // Particle-particle collisions - enhanced for more accurate physics
                        for (let i = 0; i < updated.length; i++) {
                            for (let j = i + 1; j < updated.length; j++) {
                                const p1 = updated[i];
                                const p2 = updated[j];

                                // Skip collision detection if particles have invalid properties
                                if (!isFinite(p1.x) || !isFinite(p1.y) || !isFinite(p2.x) || !isFinite(p2.y)) {
                                    continue;
                                }

                                const dx = p2.x - p1.x;
                                const dy = p2.y - p1.y;

                                // Safety check for distance calculation
                                if (!isFinite(dx) || !isFinite(dy)) {
                                    continue;
                                }

                                const distanceSquared = dx * dx + dy * dy;
                                const radiusSum = p1.radius + p2.radius;
                                
                                // Check collision only when actual peripheries touch (more efficient)
                                if (distanceSquared < radiusSum * radiusSum) {
                                    // Actual collision detected - particles touching at periphery
                                    const distance = Math.sqrt(distanceSquared);
                                    
                                    // Safety check for division by zero
                                    if (distance === 0 || !isFinite(distance)) {
                                        // Move particles slightly apart to prevent division by zero
                                        p1.x -= 0.5;
                                        p2.x += 0.5;
                                        p1.y -= 0.5;
                                        p2.y += 0.5;
                                        continue;
                                    }
                                    
                                    // Calculate collision normal
                                    const nx = dx / distance;
                                    const ny = dy / distance;
                                    
                                    // Safety check for NaN values
                                    if (!isFinite(nx) || !isFinite(ny)) {
                                        continue;
                                    }
                                    
                                    // CRITICAL: First ensure particles don't overlap by separating them properly
                                    const overlap = radiusSum - distance;
                                    if (overlap > 0) {
                                        // Move particles apart to exactly touch at peripheries
                                        const separationX = nx * (overlap / 2);
                                        const separationY = ny * (overlap / 2);
                                        
                                        p1.x -= separationX;
                                        p1.y -= separationY;
                                        p2.x += separationX;
                                        p2.y += separationY;
                                    }
                                    
                                    // Calculate relative velocity
                                    const vx = p1.vx - p2.vx;
                                    const vy = p1.vy - p2.vy;
                                    
                                    // Calculate relative velocity along normal
                                    const relativeVelocity = vx * nx + vy * ny;
                                    
                                    // Do not resolve if objects are moving away from each other
                                    if (relativeVelocity > 0) continue;
                                    
                                    // Calculate restitution (bounciness) - more energetic collisions
                                    const restitution = 1.05; // Slightly more than 1 for more energetic collisions
                                    
                                    // Calculate impulse scalar (elastic collision with restitution)
                                    const impulse = -(1 + restitution) * relativeVelocity / (1/p1.mass + 1/p2.mass);
                                    
                                    // Apply impulse with safety checks - more physically accurate
                                    if (isFinite(impulse)) {
                                        p1.vx += impulse * nx / p1.mass;
                                        p1.vy += impulse * ny / p1.mass;
                                        p2.vx -= impulse * nx / p2.mass;
                                        p2.vy -= impulse * ny / p2.mass;
                                    }
                                }
                            }
                        }

                        // Final velocity capping and sanity checks
                        for (let i = 0; i < updated.length; i++) {
                            const p = updated[i];
                            if (!isFinite(p.x) || !isFinite(p.y) || !isFinite(p.vx) || !isFinite(p.vy)) {
                                p.x = CHAMBER_WIDTH / 2;
                                p.y = CHAMBER_HEIGHT / 2;
                                p.vx = Math.random() * 3 - 1.5;
                                p.vy = Math.random() * 3 - 1.5;
                            }

                            // Ensure particles are never stationary
                            if (Math.abs(p.vx) < 0.05 && Math.abs(p.vy) < 0.05) {
                                const angle = Math.random() * Math.PI * 2;
                                const speed = 1.0 + Math.random() * 1.0; // Increased minimum speed
                                p.vx = Math.cos(angle) * speed;
                                p.vy = Math.sin(angle) * speed;
                            }

                            // Limit maximum velocity to prevent explosive behavior
                            const maxSpeed = 150; // Increased from 100
                            const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                            if (currentSpeed > maxSpeed) {
                                p.vx = (p.vx / currentSpeed) * maxSpeed;
                                p.vy = (p.vy / currentSpeed) * maxSpeed;
                            }
                        }

                        return updated;
                    });
                }
            }

            prevTimeRef.current = time;
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isRunning, dividerPresent, speed]);

    return particles;
}