"use client";

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { calculateRefractionAngle, isTotalInternalReflection } from '../../lib/physics';
import LightRay from './LightRay';
import Medium from './Medium';

interface RefractionSceneProps {
    mediumType: 'air' | 'water' | 'glass' | 'oil';
    refractiveIndex: number;
    lightAngle: number;
}

export default function RefractionScene({ mediumType, refractiveIndex, lightAngle }: RefractionSceneProps) {
    const groupRef = useRef<THREE.Group>(null);
    const intersectionRef = useRef<THREE.Mesh>(null);
    const [cameraPosition] = useState(() => new THREE.Vector3(6, 2, 9));

    // Calculate refraction using physics lib for accuracy
    const refractionAngle = useMemo(() => {
        // Use the physics calculation for accuracy
        return calculateRefractionAngle(lightAngle, 1.0, refractiveIndex);
    }, [lightAngle, refractiveIndex]);

    // Check for total internal reflection
    const isTIR = useMemo(() => {
        return isTotalInternalReflection(lightAngle, 1.0, refractiveIndex);
    }, [lightAngle, refractiveIndex]);

    // Calculate light ray positions
    const { incidentRay, refractedRay, reflectedRay } = useMemo(() => {
        const incidentAngleRad = (lightAngle * Math.PI) / 180;

        // Start point above the surface
        const startPoint = new THREE.Vector3(0, 3, 0);

        // Intersection with medium surface (y=0)
        const intersectionPoint = new THREE.Vector3(
            startPoint.x - 3 * Math.tan(incidentAngleRad),
            0,
            0
        );

        let endPoint;

        if (isTIR) {
            // For total internal reflection, calculate reflected ray
            const reflectionAngleRad = incidentAngleRad;
            endPoint = new THREE.Vector3(
                intersectionPoint.x - 3 * Math.tan(reflectionAngleRad),
                3,
                0
            );

            return {
                incidentRay: {
                    start: startPoint,
                    end: intersectionPoint
                },
                refractedRay: {
                    start: intersectionPoint,
                    end: intersectionPoint // No refraction, just a point
                },
                reflectedRay: {
                    start: intersectionPoint,
                    end: endPoint
                }
            };
        } else {
            // Normal refraction
            const refractionAngleRad = (refractionAngle * Math.PI) / 180;
            endPoint = new THREE.Vector3(
                intersectionPoint.x - 3 * Math.tan(refractionAngleRad),
                -3,
                0
            );

            return {
                incidentRay: {
                    start: startPoint,
                    end: intersectionPoint
                },
                refractedRay: {
                    start: intersectionPoint,
                    end: endPoint
                },
                reflectedRay: {
                    start: intersectionPoint,
                    end: intersectionPoint // No reflection in this case
                }
            };
        }
    }, [lightAngle, refractionAngle, isTIR]);

    // Add subtle animation
    useFrame(({ clock }) => {
        if (groupRef.current) {
            // Subtle floating motion
            groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.05;
            groupRef.current.rotation.y += 0.001;
        }

        // Animate the intersection point
        if (intersectionRef.current) {
            // Pulsing effect
            intersectionRef.current.scale.setScalar(0.8 + Math.sin(clock.getElapsedTime() * 3) * 0.2);
        }
    });

    return (
        <group ref={groupRef}>
            {/* Custom camera positioning */}
            <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />

            {/* Environment and enhanced lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={0.8}
                castShadow
            />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#fff" />
            <pointLight position={[-5, 3, 2]} intensity={0.5} color={mediumType === 'water' ? '#90cdf4' : '#fefcbf'} />
            <Environment preset="sunset" background={false} />

            {/* Media with enhanced visuals */}
            <Medium
                mediumType={mediumType}
                position={[0, -1.5, 0]}
                size={[12, 3, 12]}
            />

            {/* Incident ray (above surface) */}
            <LightRay
                start={incidentRay.start}
                end={incidentRay.end}
                color="#FFD700" // Gold color
            />

            {/* Refracted ray (in medium) - only show if not TIR */}
            {!isTIR && (
                <LightRay
                    start={refractedRay.start}
                    end={refractedRay.end}
                    color="#4FD1C5" // Teal color
                    inMedium={true} // Teal color
                />
            )}

            {!isTIR && (
                <spotLight
                    position={[
                        refractedRay.start.x,
                        refractedRay.start.y + 0.5,
                        2
                    ]}
                    angle={0.5}
                    penumbra={0.5}
                    intensity={0.8}
                    color="#4FD1C5"
                    castShadow={false}
                    target-position={[
                        refractedRay.end.x,
                        refractedRay.end.y,
                        0
                    ]}
                />
            )}


            {!isTIR && (
                <mesh position={[
                    (refractedRay.start.x + refractedRay.end.x) / 2,
                    (refractedRay.start.y + refractedRay.end.y) / 2,
                    0
                ]}>
                    <tubeGeometry
                        args={[
                            new THREE.LineCurve3(refractedRay.start, refractedRay.end),
                            20, // tubularSegments
                            0.03, // radius
                            8, // radialSegments
                            false // closed
                        ]}
                    />
                    <meshBasicMaterial
                        color="#4FD1C5"
                        transparent
                        opacity={0.3}
                        depthWrite={false}
                    />
                </mesh>
            )}

            {/* Reflected ray for total internal reflection */}
            {isTIR && (
                <LightRay
                    start={reflectedRay.start}
                    end={reflectedRay.end}
                    color="#FC8181" // Red color
                />
            )}

            {/* Boundary line indicator with glow */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                <planeGeometry args={[12, 0.05]} />
                <meshBasicMaterial color="white" transparent opacity={0.5} />
            </mesh>

            {/* Contact shadows for realism */}
            <ContactShadows
                position={[0, -0.01, 0]}
                opacity={0.4}
                scale={10}
                blur={1}
                far={0.5}
            />

            {/* Intersection point with glowing effect */}
            <mesh
                ref={intersectionRef}
                position={incidentRay.end}
                castShadow
            >
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial
                    color="white"
                    emissive="white"
                    emissiveIntensity={1}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Angle visualization */}
            <group position={[incidentRay.end.x, 0, 0]}>
                {/* Incident angle indicator */}
                <mesh rotation={[0, 0, (Math.PI / 2) - (lightAngle * Math.PI / 180)]}>
                    <cylinderGeometry args={[0.02, 0.02, 1, 16]} />
                    <meshStandardMaterial
                        color="#FFD700"
                        emissive="#FFD700"
                        emissiveIntensity={0.5}
                    />
                </mesh>

                {/* Refraction angle indicator - only if not TIR */}
                {!isTIR && (
                    <mesh rotation={[0, 0, (Math.PI / 2) + (refractionAngle * Math.PI / 180)]}>
                        <cylinderGeometry args={[0.02, 0.02, 1, 16]} />
                        <meshStandardMaterial
                            color="#4FD1C5"
                            emissive="#4FD1C5"
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                )}

                {/* TIR indicator */}
                {isTIR && (
                    <mesh rotation={[0, 0, (Math.PI / 2) - (lightAngle * Math.PI / 180)]}>
                        <cylinderGeometry args={[0.02, 0.02, 1, 16]} />
                        <meshStandardMaterial
                            color="#FC8181"
                            emissive="#FC8181"
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                )}
            </group>

            {/* Normal line */}
            <mesh position={[incidentRay.end.x, 0, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 2, 16]} />
                <meshBasicMaterial color="white" transparent opacity={0.8} />
            </mesh>
        </group>
    );
}