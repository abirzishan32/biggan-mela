"use client";

import { useState, useRef, useEffect } from 'react';
import EnvironmentLayer from './EnvironmentLayer';
import Launcher from './Launcher';
import TrajectoryPath from './TrajectoryPath';
import PhysicsCalculations from './PhysicsCalculations';
import ControlPanel from './ControlPanel';

// Physics constants
const GRAVITY = 9.81; // m/s²

interface ProjectileState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  time: number;
  isMoving: boolean;
  hasLanded: boolean;
  angle: number;
  velocity: number;
  mass: number;
  airResistance: boolean;
  windSpeed: number;
  maxHeight: number; // Track max height during flight
}

export default function ProjectileSimulator() {
  // Canvas dimensions and scale
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(10); // pixels per meter - initial scale
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 }); // For panning/following the projectile
  
  // Get container dimensions safely
  const getContainerHeight = () => containerRef.current?.clientHeight ?? 500;
  
  // Simulation parameters
  const [projectile, setProjectile] = useState<ProjectileState>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    time: 0,
    isMoving: false,
    hasLanded: false,
    angle: 45, // degrees
    velocity: 20, // m/s
    mass: 1, // kg
    airResistance: false,
    windSpeed: 0, // m/s
    maxHeight: 0, // Track maximum height
  });
  
  // Path tracking for visualization
  const [path, setPath] = useState<{x: number, y: number}[]>([]);
  
  // Physics results
  const [results, setResults] = useState({
    maxHeight: 0,
    distance: 0,
    flightTime: 0,
    initialEnergy: 0,
  });
  
  // Reference to animation frame for cleanup
  const animationRef = useRef<number>(0);
  
  // Zoom control functions
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 30)); // Increase scale with upper limit
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 3)); // Decrease scale with lower limit
  };
  
  const handleResetZoom = () => {
    setScale(10); // Reset to default scale
    setCameraOffset({ x: 0, y: 0 }); // Reset camera position
  };
  
  // Add auto-follow functionality to keep projectile in view
  useEffect(() => {
    if (projectile.isMoving && !projectile.hasLanded) {
      // Calculate where projectile is in relation to viewport
      const viewportWidth = containerRef.current?.clientWidth ?? 1000;
      const viewportHeight = containerRef.current?.clientHeight ?? 500;
      
      const projectileScreenX = projectile.x * scale;
      const projectileScreenY = projectile.y * scale;
      
      // Check if projectile is getting close to edge of visible area
      const margin = 100; // pixels from edge to start scrolling
      let newOffsetX = cameraOffset.x;
      let newOffsetY = cameraOffset.y;
      
      // Follow horizontally if getting close to right edge
      if (projectileScreenX > viewportWidth - margin - cameraOffset.x) {
        newOffsetX = projectileScreenX - (viewportWidth - margin);
      }
      
      // Follow vertically if needed (less common with projectile motion)
      if (projectileScreenY < margin - cameraOffset.y) {
        newOffsetY = projectileScreenY - margin;
      } else if (projectileScreenY > viewportHeight - margin - cameraOffset.y) {
        newOffsetY = projectileScreenY - (viewportHeight - margin);
      }
      
      if (newOffsetX !== cameraOffset.x || newOffsetY !== cameraOffset.y) {
        setCameraOffset({ x: newOffsetX, y: newOffsetY });
      }
    }
  }, [projectile.x, projectile.y, projectile.isMoving, projectile.hasLanded, scale, cameraOffset]);
  
  // Initialize canvas dimensions
  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const container = containerRef.current;
      canvasRef.current.width = container.clientWidth;
      canvasRef.current.height = container.clientHeight;
      
      // Reset projectile to launcher position
      setProjectile(prev => ({
        ...prev,
        x: 50 / scale, // 50px from left edge
        y: (container.clientHeight - 20) / scale, // Position correctly on ground
        maxHeight: 0,
      }));
    }
    
    // Cleanup animation on unmount
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [scale]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle angle change from the launcher
  const handleAngleChange = (angle: number) => {
    if (!projectile.isMoving) {
      setProjectile(prev => ({ ...prev, angle }));
    }
  };
  
  // Handle parameter changes from control panel
  const handleVelocityChange = (velocity: number) => {
    if (!projectile.isMoving) {
      setProjectile(prev => ({ ...prev, velocity }));
    }
  };
  
  const handleMassChange = (mass: number) => {
    if (!projectile.isMoving) {
      setProjectile(prev => ({ ...prev, mass }));
    }
  };
  
  const handleAirResistanceToggle = (enabled: boolean) => {
    if (!projectile.isMoving) {
      setProjectile(prev => ({ ...prev, airResistance: enabled }));
    }
  };
  
  const handleWindSpeedChange = (windSpeed: number) => {
    if (!projectile.isMoving) {
      setProjectile(prev => ({ ...prev, windSpeed }));
    }
  };
  
  // Launch the projectile
  const handleLaunch = () => {
    if (projectile.isMoving) return;
    
    // Convert angle to radians
    const angleRadians = projectile.angle * Math.PI / 180;
    
    // Calculate initial velocity components
    const vx = projectile.velocity * Math.cos(angleRadians);
    const vy = -projectile.velocity * Math.sin(angleRadians); // negative because y increases downward in canvas
    
    // Calculate initial kinetic energy
    const initialEnergy = 0.5 * projectile.mass * Math.pow(projectile.velocity, 2);
    
    // Reset path and start simulation
    setPath([{x: projectile.x * scale, y: projectile.y * scale}]);
    setCameraOffset({ x: 0, y: 0 }); // Reset camera when launching
    
    setProjectile(prev => ({
      ...prev,
      vx,
      vy,
      time: 0,
      isMoving: true,
      hasLanded: false,
      maxHeight: 0,
    }));
    
    setResults(prev => ({
      ...prev,
      initialEnergy,
      maxHeight: 0,
      distance: 0,
      flightTime: 0,
    }));
    
    // Start animation loop
    animate();
  };
  
  // Reset the simulation
  const handleReset = () => {
    cancelAnimationFrame(animationRef.current);
    
    // Use the safe getter function we defined earlier
    const containerHeight = getContainerHeight();
    
    // Reset camera position
    setCameraOffset({ x: 0, y: 0 });
    
    setProjectile(prev => ({
      ...prev,
      x: 50 / scale,
      y: (containerHeight - 20) / scale, // Align with ground
      vx: 0,
      vy: 0,
      time: 0,
      isMoving: false,
      hasLanded: false,
      maxHeight: 0,
    }));
    
    setPath([]);
  };
  
  // Animation function
  const animate = () => {
    if (!canvasRef.current || !containerRef.current) {
      // If refs are not available, just schedule the next frame and exit
      if (!projectile.hasLanded && projectile.isMoving) {
        animationRef.current = requestAnimationFrame(animate);
      }
      return;
    }
    
    // Time step for simulation (adjust for smoother physics)
    const dt = 1/60; // seconds
    
    setProjectile(prev => {
      // If already landed, don't update physics
      if (prev.hasLanded) return prev;
      
      // Calculate new time
      const time = prev.time + dt;
      
      // Apply physics
      let vx = prev.vx;
      let vy = prev.vy;
      
      // Apply air resistance if enabled
      if (prev.airResistance) {
        const dragCoefficient = 0.47; // typical for a sphere
        const airDensity = 1.2; // kg/m³
        const crossSectionalArea = Math.PI * 0.1 * 0.1; // m² (assuming 20cm diameter)
        
        const speed = Math.sqrt(vx * vx + vy * vy);
        const dragForce = 0.5 * dragCoefficient * airDensity * crossSectionalArea * speed * speed;
        const dragAcceleration = dragForce / prev.mass;
        
        // Apply drag against velocity vector
        if (speed > 0) {
          const dragX = -dragAcceleration * vx / speed;
          const dragY = -dragAcceleration * vy / speed;
          vx += dragX * dt;
          vy += dragY * dt;
        }
        
        // Apply wind (as a horizontal force)
        vx += (prev.windSpeed * 0.05) * dt; // simplified wind effect
      }
      
      // Apply gravity
      vy += GRAVITY * dt;
      
      // Calculate new position
      let x = prev.x + vx * dt;
      let y = prev.y + vy * dt;
      
      // Ground collision detection - using optional chaining and a safe default
      const containerHeight = containerRef.current?.clientHeight ?? 500;
      const groundLevel = containerHeight - 20; // Align with visual ground level
      const groundY = groundLevel / scale; // Convert to simulation units (meters)
      
      let hasLanded = false;
      
      // Track maximum height (distance above ground)
      let currentHeight = groundY - y;
      let maxHeight = Math.max(currentHeight, prev.maxHeight);
      
      if (y >= groundY) {
        // Object has hit the ground
        y = groundY;
        hasLanded = true;
        
        // Calculate results
        const distance = x - (50 / scale); // distance from launch point
        const flightTime = time;
        
        setResults(prev => ({
          ...prev,
          distance,
          flightTime,
          maxHeight: maxHeight, // Use tracked max height
        }));
      }
      
      // Update path for visualization
      if (prev.isMoving) {
        setPath(prevPath => [...prevPath, {x: x * scale, y: y * scale}]);
      }
      
      return {
        ...prev,
        x,
        y,
        vx,
        vy,
        time,
        hasLanded,
        maxHeight,
      };
    });
    
    // Continue animation if object is still moving
    if (!projectile.hasLanded) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main simulation area */}
      <div 
        ref={containerRef}
        className="relative w-2/3 bg-blue-300 overflow-hidden"
      >
        <canvas 
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
        
        <EnvironmentLayer 
          canvasRef={canvasRef}
          groundLevel={getContainerHeight() - 20}
          cameraOffset={cameraOffset}
          scale={scale}
        />
        
        <Launcher 
          x={50 - cameraOffset.x}
          y={getContainerHeight() - 20}
          angle={projectile.angle}
          onAngleChange={handleAngleChange}
          disabled={projectile.isMoving}
          cameraOffset={cameraOffset}
        />
        
        <TrajectoryPath 
          path={path}
          projectileX={projectile.x * scale}
          projectileY={projectile.y * scale}
          isMoving={projectile.isMoving}
          hasLanded={projectile.hasLanded}
          cameraOffset={cameraOffset}
          scale={scale}
        />
        
        {/* Zoom controls */}
        <div className="absolute top-4 right-4 flex space-x-2 z-30">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white bg-opacity-75 rounded shadow hover:bg-opacity-100"
            title="Zoom In"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white bg-opacity-75 rounded shadow hover:bg-opacity-100"
            title="Zoom Out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            onClick={handleResetZoom}
            className="p-2 bg-white bg-opacity-75 rounded shadow hover:bg-opacity-100"
            title="Reset View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Zoom level indicator */}
        <div className="absolute top-16 right-4 bg-white bg-opacity-75 rounded px-2 py-1 text-xs z-30">
          Zoom: {scale.toFixed(1)}×
        </div>
        
        {projectile.hasLanded && (
          <div className="absolute bottom-4 left-4 bg-gray-700 bg-opacity-75 p-3 rounded-lg shadow-lg z-30">
            <h3 className="font-bold text-lg mb-2">Results:</h3>
            <p>Maximum Height: {results.maxHeight.toFixed(2)} meters</p>
            <p>Distance: {results.distance.toFixed(2)} meters</p>
            <p>Flight Time: {results.flightTime.toFixed(2)} seconds</p>
          </div>
        )}
      </div>
      
      {/* Control panel */}
      <div className="w-1/3 p-4 overflow-y-auto">
        <ControlPanel 
          velocity={projectile.velocity}
          mass={projectile.mass}
          angle={projectile.angle}
          airResistance={projectile.airResistance}
          windSpeed={projectile.windSpeed}
          onVelocityChange={handleVelocityChange}
          onMassChange={handleMassChange}
          onAngleChange={handleAngleChange}
          onAirResistanceToggle={handleAirResistanceToggle}
          onWindSpeedChange={handleWindSpeedChange}
          onLaunch={handleLaunch}
          onReset={handleReset}
          isSimulating={projectile.isMoving}
        />
        
        <PhysicsCalculations 
          angle={projectile.angle}
          velocity={projectile.velocity}
          mass={projectile.mass}
          airResistance={projectile.airResistance}
          windSpeed={projectile.windSpeed}
          results={results}
        />
      </div>
    </div>
  );
}