"use client";

import { useRef, useEffect, useState } from 'react';
import BengaliPopup from './BengaliProp';
import ProcessAnimation from './ProcessAnimation';
import SunAnimation from './SunAnimation';
import WaterElements from './WaterElements';

interface WaterCycleSceneProps {
  currentStep: number;
  activeProcess: string | null;
  setActiveProcess: (process: string | null) => void;
}

export default function WaterCycleScene({ 
  currentStep, 
  activeProcess, 
  setActiveProcess 
}: WaterCycleSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [popupContent, setPopupContent] = useState({ title: '', description: '' });
  const [showPopup, setShowPopup] = useState(false);
  
  // Resize handler to make canvas responsive
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle step changes
  useEffect(() => {
    setShowPopup(false);
    
    // Display appropriate popup based on current step
    const timer = setTimeout(() => {
      if (currentStep > 0) {
        const processMap: Record<number, { title: string, description: string, position: { x: number, y: number } }> = {
          1: {
            title: 'বাষ্পীভবন',
            description: 'সূর্যের উত্তাপে নদী, সমুদ্র, পুকুর থেকে পানি বাষ্প হয়ে আকাশে উঠে যায়। একে বাষ্পীভবন বলে!',
            position: { x: dimensions.width * 0.5, y: dimensions.height * 0.45 }
          },
          2: {
            title: 'ঘনীভবন',
            description: 'আকাশে উপরে জলীয় বাষ্প ঠান্ডা হয়ে ছোট ছোট জলকণায় পরিণত হয় এবং মেঘ তৈরি হয়। একে ঘনীভবন বলে।',
            position: { x: dimensions.width * 0.65, y: dimensions.height * 0.2 }
          },
          3: {
            title: 'বৃষ্টিপাত',
            description: 'মেঘের ভেতরে জলকণা বড় হয়ে ভারী হয়ে যায় এবং বৃষ্টি হিসেবে পৃথিবীতে নেমে আসে। একে বৃষ্টিপাত বলে।',
            position: { x: dimensions.width * 0.35, y: dimensions.height * 0.3 }
          },
          4: {
            title: 'সংগ্রহ',
            description: 'বৃষ্টির পানি মাটিতে পড়ে নদী, পুকুর এবং মাটির নিচে সংগ্রহ হয়, যা আমরা ব্যবহার করি।',
            position: { x: dimensions.width * 0.5, y: dimensions.height * 0.75 }
          },
          5: {
            title: 'পানি চক্র',
            description: 'এভাবেই পানি চক্রের মাধ্যমে সারা বিশ্বের পানি ঘুরে বেড়ায় এবং পরিশোধিত হয়।',
            position: { x: dimensions.width * 0.5, y: dimensions.height * 0.5 }
          },
        };
        
        if (processMap[currentStep]) {
          const { title, description, position } = processMap[currentStep];
          setPopupContent({ title, description });
          setPopupPosition(position);
          setShowPopup(true);
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentStep, dimensions]);
  
  // Draw base scene
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#C9E9FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
    
    // Draw mountains in background
    drawMountains(ctx, canvas.width, canvas.height);
    
    // Draw ground and underground layers
    drawGroundLayers(ctx, canvas.width, canvas.height);
    
    // Draw water bodies (rivers, lakes)
    drawWaterBodies(ctx, canvas.width, canvas.height);
    
    // Draw groundwater
    drawGroundwater(ctx, canvas.width, canvas.height);
    
  }, [dimensions, currentStep]);
  
  // Draw mountains
  const drawMountains = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Mountain ranges in background
    const mountainHeight = height * 0.3;
    const groundLevel = height * 0.6;
    
    // Background mountains
    ctx.fillStyle = '#6a8caf';
    ctx.beginPath();
    ctx.moveTo(0, groundLevel);
    ctx.lineTo(width * 0.2, groundLevel - mountainHeight * 0.8);
    ctx.lineTo(width * 0.35, groundLevel - mountainHeight * 0.5);
    ctx.lineTo(width * 0.5, groundLevel - mountainHeight);
    ctx.lineTo(width * 0.7, groundLevel - mountainHeight * 0.7);
    ctx.lineTo(width * 0.85, groundLevel - mountainHeight * 0.9);
    ctx.lineTo(width, groundLevel - mountainHeight * 0.6);
    ctx.lineTo(width, groundLevel);
    ctx.closePath();
    ctx.fill();
    
    // Snow caps
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(width * 0.45, groundLevel - mountainHeight * 0.9);
    ctx.lineTo(width * 0.5, groundLevel - mountainHeight);
    ctx.lineTo(width * 0.55, groundLevel - mountainHeight * 0.9);
    ctx.closePath();
    ctx.fill();
  };
  
  // Draw ground layers
  const drawGroundLayers = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const groundLevel = height * 0.6;
    
    // Surface ground
    const groundGradient = ctx.createLinearGradient(0, groundLevel, 0, height);
    groundGradient.addColorStop(0, '#8cba51');
    groundGradient.addColorStop(0.2, '#6b8e34');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, groundLevel, width, height * 0.15);
    
    // Soil layer
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, groundLevel + height * 0.15, width, height * 0.1);
    
    // Rock layer
    ctx.fillStyle = '#696969';
    ctx.fillRect(0, groundLevel + height * 0.25, width, height * 0.15);
  };
  
  // Draw water bodies
  const drawWaterBodies = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const groundLevel = height * 0.6;
    
    // Lake or pond
    ctx.fillStyle = '#4fa4d3';
    ctx.beginPath();
    ctx.ellipse(
      width * 0.7, 
      groundLevel, 
      width * 0.15, 
      height * 0.05, 
      0, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // River
    ctx.fillStyle = '#4fa4d3';
    ctx.beginPath();
    ctx.moveTo(0, groundLevel - height * 0.02);
    ctx.quadraticCurveTo(
      width * 0.3, 
      groundLevel + height * 0.03, 
      width * 0.55, 
      groundLevel
    );
    ctx.lineTo(width * 0.55, groundLevel + height * 0.02);
    ctx.quadraticCurveTo(
      width * 0.3, 
      groundLevel + height * 0.05, 
      0, 
      groundLevel
    );
    ctx.closePath();
    ctx.fill();
  };
  
  // Draw groundwater
  const drawGroundwater = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const groundLevel = height * 0.6;
    
    // Groundwater pockets
    ctx.fillStyle = 'rgba(79, 164, 211, 0.5)';
    
    // Water table
    ctx.beginPath();
    ctx.ellipse(
      width * 0.3, 
      groundLevel + height * 0.25, 
      width * 0.2, 
      height * 0.05, 
      0, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Smaller water pockets
    ctx.beginPath();
    ctx.ellipse(
      width * 0.6, 
      groundLevel + height * 0.2, 
      width * 0.08, 
      height * 0.03, 
      0, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
  };
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Animated elements overlaid on the canvas */}
      <SunAnimation 
        isActive={currentStep === 1 || currentStep === 5} 
        position={{ x: dimensions.width * 0.15, y: dimensions.height * 0.15 }} 
      />
      
      <WaterElements 
        dimensions={dimensions} 
        currentStep={currentStep} 
        setActiveProcess={setActiveProcess} 
      />
      
      {/* Process animations (arrows) */}
      <ProcessAnimation 
        process="evaporation"
        isActive={currentStep === 1 || currentStep === 5}
        dimensions={dimensions}
        onClick={() => {
          setActiveProcess('evaporation');
          setPopupContent({
            title: 'বাষ্পীভবন',
            description: 'সূর্যের উত্তাপে নদী, সমুদ্র, পুকুর থেকে পানি বাষ্প হয়ে আকাশে উঠে যায়। একে বাষ্পীভবন বলে!'
          });
          setPopupPosition({ x: dimensions.width * 0.5, y: dimensions.height * 0.45 });
          setShowPopup(true);
        }}
      />
      
      <ProcessAnimation
        process="condensation"
        isActive={currentStep === 2 || currentStep === 5}
        dimensions={dimensions}
        onClick={() => {
          setActiveProcess('condensation');
          setPopupContent({
            title: 'ঘনীভবন',
            description: 'আকাশে উপরে জলীয় বাষ্প ঠান্ডা হয়ে ছোট ছোট জলকণায় পরিণত হয় এবং মেঘ তৈরি হয়। একে ঘনীভবন বলে।'
          });
          setPopupPosition({ x: dimensions.width * 0.65, y: dimensions.height * 0.2 });
          setShowPopup(true);
        }}
      />
      
      <ProcessAnimation
        process="precipitation"
        isActive={currentStep === 3 || currentStep === 5}
        dimensions={dimensions}
        onClick={() => {
          setActiveProcess('precipitation');
          setPopupContent({
            title: 'বৃষ্টিপাত',
            description: 'মেঘের ভেতরে জলকণা বড় হয়ে ভারী হয়ে যায় এবং বৃষ্টি হিসেবে পৃথিবীতে নেমে আসে। একে বৃষ্টিপাত বলে।'
          });
          setPopupPosition({ x: dimensions.width * 0.35, y: dimensions.height * 0.3 });
          setShowPopup(true);
        }}
      />
      
      <ProcessAnimation
        process="collection"
        isActive={currentStep === 4 || currentStep === 5}
        dimensions={dimensions}
        onClick={() => {
          setActiveProcess('collection');
          setPopupContent({
            title: 'সংগ্রহ',
            description: 'বৃষ্টির পানি মাটিতে পড়ে নদী, পুকুর এবং মাটির নিচে সংগ্রহ হয়, যা আমরা ব্যবহার করি।'
          });
          setPopupPosition({ x: dimensions.width * 0.5, y: dimensions.height * 0.75 });
          setShowPopup(true);
        }}
      />
      
      {/* Popup for explanations */}
      {showPopup && (
        <BengaliPopup
          title={popupContent.title}
          description={popupContent.description}
          position={popupPosition}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}