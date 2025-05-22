"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BengaliPopup from './BengaliPopup';
import FireTriangle from './FireTriangle';
import FireExtinguisherAnimation from './FireExtinguisherAnimation';

interface FireSceneProps {
  currentStep: number;
  setActiveProcess: (process: string | null) => void;
  activeProcess: string | null;
}

export default function FireScene({ currentStep, activeProcess, setActiveProcess }: FireSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({
    title: '',
    description: '',
    position: { x: 0, y: 0 }
  });
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('fire-scene-container');
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
  
  // Draw scene based on current step
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw room
    drawRoom(ctx, canvas.width, canvas.height);
    
    // Draw different elements based on step
    if (currentStep >= 1) {
      drawFire(ctx, canvas.width * 0.6, canvas.height * 0.65, currentStep);
    }
    
    if (currentStep >= 2) {
      drawFireExtinguisher(ctx, canvas.width * 0.15, canvas.height * 0.6);
    }
    
    // Show popups based on step
    if (currentStep === 1 && !showPopup) {
      setTimeout(() => {
        setPopupContent({
          title: 'আগুন কীভাবে জ্বলে?',
          description: 'আগুন জ্বলার জন্য তিনটি জিনিসের প্রয়োজন: জ্বালানি, অক্সিজেন এবং তাপ। এই তিনটি জিনিস একত্রিত হলেই আগুন জ্বলতে পারে। একে আগুনের ত্রিভুজ বলে।',
          position: { x: canvas.width * 0.6, y: canvas.height * 0.4 }
        });
        setShowPopup(true);
      }, 500);
    }
    
    if (currentStep === 2 && !showPopup) {
      setTimeout(() => {
        setPopupContent({
          title: 'অগ্নি নির্বাপক',
          description: 'অগ্নি নির্বাপক একটি বিশেষ যন্ত্র যা আগুন নেভাতে সাহায্য করে। এটি আগুনের ত্রিভুজের একটি অংশকে সরিয়ে দেয়, যাতে আগুন আর জ্বলতে না পারে।',
          position: { x: canvas.width * 0.3, y: canvas.height * 0.5 }
        });
        setShowPopup(true);
      }, 500);
    }
    
    if (currentStep === 3 && !showPopup) {
      setTimeout(() => {
        setPopupContent({
          title: 'আগুন নেভানো',
          description: 'অগ্নি নির্বাপক থেকে বেরোনো ফোম আগুনকে ঢেকে দেয়। এতে আগুনে অক্সিজেন পৌঁছাতে পারে না এবং আগুন নিভে যায়। ফোম জ্বালানি ও অক্সিজেনের মধ্যে একটি আবরণ তৈরি করে।',
          position: { x: canvas.width * 0.6, y: canvas.height * 0.5 }
        });
        setShowPopup(true);
      }, 500);
    }
    
    if (currentStep === 4 && !showPopup) {
      setTimeout(() => {
        setPopupContent({
          title: 'আগুন নেভার কারণ',
          description: 'অগ্নি নির্বাপক আগুনের ত্রিভুজকে ভেঙে দেয়। এটি হয় অক্সিজেন সরিয়ে ফেলে, জ্বালানি ঢেকে দেয়, অথবা আগুনকে ঠান্ডা করে। আগুনের ত্রিভুজ ভাঙলে আগুন নিভে যায়।',
          position: { x: canvas.width * 0.5, y: canvas.height * 0.4 }
        });
        setShowPopup(true);
      }, 500);
    }
    
  }, [currentStep, dimensions, showPopup]);
  
  // Drawing functions
  const drawRoom = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Floor
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, height * 0.7, width, height * 0.3);
    
    // Wall
    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(0, 0, width, height * 0.7);
    
    // Draw furniture
    drawTable(ctx, width * 0.6, height * 0.65);
    drawSofa(ctx, width * 0.2, height * 0.6);
    
    // Wall decoration
    ctx.fillStyle = '#A52A2A';
    ctx.fillRect(width * 0.3, height * 0.2, width * 0.2, height * 0.15);
  };
  
  const drawTable = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 50, y - 30, 100, 10); // Table top
    ctx.fillRect(x - 45, y - 20, 10, 40); // Left leg
    ctx.fillRect(x + 35, y - 20, 10, 40); // Right leg
    
    // Candle on table
    ctx.fillStyle = '#F8F8FF';
    ctx.fillRect(x - 5, y - 40, 10, 25);
    
    // Candle wick
    ctx.fillStyle = '#000000';
    ctx.fillRect(x - 2, y - 45, 4, 5);
  };
  
  const drawSofa = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#6B8E23';
    ctx.fillRect(x - 80, y - 50, 160, 70);
    ctx.fillRect(x - 80, y - 100, 20, 50); // Left arm
    ctx.fillRect(x + 60, y - 100, 20, 50); // Right arm
    
    // Back of sofa
    ctx.fillStyle = '#556B2F';
    ctx.fillRect(x - 80, y - 100, 160, 20);
  };
  
  const drawFire = (ctx: CanvasRenderingContext2D, x: number, y: number, step: number) => {
    // Don't draw fire if we're at step 4 (fire is extinguished)
    if (step === 4) return;
    
    // Fire on the table
    const gradient = ctx.createRadialGradient(x, y - 60, 5, x, y - 60, 30);
    gradient.addColorStop(0, '#FFFF00');
    gradient.addColorStop(0.6, '#FF4500');
    gradient.addColorStop(1, 'rgba(255,69,0,0)');
    
    ctx.fillStyle = gradient;
    
    // Draw flames
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 40);
    ctx.quadraticCurveTo(x - 15, y - 70, x, y - 90);
    ctx.quadraticCurveTo(x + 15, y - 70, x + 10, y - 40);
    ctx.closePath();
    ctx.fill();
    
    // Additional flames
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 40);
    ctx.quadraticCurveTo(x - 10, y - 60, x - 5, y - 75);
    ctx.quadraticCurveTo(x, y - 60, x + 5, y - 40);
    ctx.closePath();
    ctx.fill();
    
    if (step === 3) {
      // Draw extinguisher foam over fire
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.ellipse(x, y - 50, 25, 50, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  const drawFireExtinguisher = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Extinguisher body
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.ellipse(x, y, 25, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Top part
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(x, y - 45, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Nozzle
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 10, y - 50, 20, 10);
    
    // Handle
    ctx.fillRect(x, y - 30, 8, 20);
  };
  
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  
  const handleFireTriangleClick = () => {
    if (currentStep === 1) {
      setActiveProcess('fireTriangle');
    }
  };
  
  const handleExtinguisherClick = () => {
    if (currentStep === 2) {
      setActiveProcess('extinguisherTypes');
    }
  };
  
  return (
    <div 
      id="fire-scene-container" 
      className="w-full h-full min-h-[400px] relative bg-white rounded-xl overflow-hidden"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      
      {currentStep === 1 && (
        <div 
          className="absolute cursor-pointer" 
          style={{ left: '50%', top: '30%', transform: 'translate(-50%, -50%)' }}
          onClick={handleFireTriangleClick}
        >
          <FireTriangle isActive={activeProcess === 'fireTriangle'} />
        </div>
      )}
      
      {currentStep === 2 && (
        <div 
          className="absolute cursor-pointer" 
          style={{ left: '15%', top: '60%', width: '60px', height: '100px' }}
          onClick={handleExtinguisherClick}
        >
          {/* Invisible clickable area over extinguisher */}
        </div>
      )}
      
      {currentStep === 3 && (
        <FireExtinguisherAnimation isActive={true} startPosition={{ x: dimensions.width * 0.15, y: dimensions.height * 0.6 }} endPosition={{ x: dimensions.width * 0.6, y: dimensions.height * 0.5 }} />
      )}
      
      <AnimatePresence>
        {showPopup && (
          <BengaliPopup
            title={popupContent.title}
            description={popupContent.description}
            position={popupContent.position}
            onClose={handleClosePopup}
          />
        )}
      </AnimatePresence>
    </div>
  );
}