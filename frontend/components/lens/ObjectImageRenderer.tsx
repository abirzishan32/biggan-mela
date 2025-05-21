"use client";

import { useRef, useEffect } from 'react';
import { LensType, ImageType } from './types';

interface ObjectImageRendererProps {
  lensType: LensType;
  objectDistance: number;
  objectHeight: number;
  imageDistance: number;
  imageHeight: number;
  imageType: ImageType;
}

export default function ObjectImageRenderer({
  lensType,
  objectDistance,
  objectHeight,
  imageDistance,
  imageHeight,
  imageType
}: ObjectImageRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw the object and its image
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        drawObjectAndImage(ctx, canvas.width, canvas.height);
      }
    };
    
    // Initial sizing
    resizeCanvas();
    
    // Listen for resize
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  // Redraw when parameters change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    drawObjectAndImage(ctx, canvas.width, canvas.height);
  }, [lensType, objectDistance, objectHeight, imageDistance, imageHeight, imageType]);
  
  const drawObjectAndImage = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate center point
    const centerY = height / 2;
    const lensX = width / 2;
    
    // Calculate object position
    const objectX = lensX - objectDistance;
    const objectBottom = centerY;
    const objectTop = objectBottom - objectHeight;
    
    // Draw object (a pencil)
    drawPencil(ctx, objectX, objectBottom, objectHeight, false);
    
    // Draw object label
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('Object', objectX, objectBottom + 20);
    
    // Draw object height indicator
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(objectX - 20, objectBottom);
    ctx.lineTo(objectX - 20, objectTop);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Add object height label
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'right';
    ctx.fillText(`${objectHeight.toFixed(0)}px`, objectX - 25, (objectBottom + objectTop) / 2);
    ctx.setLineDash([]);
    
    // Draw image if it's not at infinity
    if (imageDistance !== Infinity && imageHeight !== Infinity) {
      // Calculate image position
      let imageX: number;
      let imageBottom: number;
      let imageTop: number;
      
      if (imageType === 'real') {
        // Real image: opposite side of lens from object
        imageX = lensX + imageDistance;
        imageBottom = centerY;
        imageTop = imageBottom + imageHeight; // Inverted for real image
      } else {
        // Virtual image: same side as object
        imageX = lensX - imageDistance;
        imageBottom = centerY;
        imageTop = imageBottom - imageHeight; // Upright for virtual image
      }
      
      // Draw image (a pencil)
      const isInverted = imageType === 'real';
      drawPencil(ctx, imageX, imageBottom, Math.abs(imageHeight), isInverted, imageType === 'virtual');
      
      // Draw image label
      ctx.font = '14px Arial';
      ctx.fillStyle = imageType === 'real' ? '#333' : 'rgba(0, 0, 200, 0.7)';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${imageType.charAt(0).toUpperCase() + imageType.slice(1)} Image`, 
        imageX, 
        imageBottom + 20
      );
      
      // Draw image height indicator
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(imageX + 20, imageBottom);
      ctx.lineTo(imageX + 20, imageTop);
      ctx.strokeStyle = imageType === 'real' ? '#666' : 'rgba(0, 0, 200, 0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Add image height label
      ctx.font = '12px Arial';
      ctx.fillStyle = imageType === 'real' ? '#666' : 'rgba(0, 0, 200, 0.7)';
      ctx.textAlign = 'left';
      ctx.fillText(`${Math.abs(imageHeight).toFixed(0)}px`, imageX + 25, (imageBottom + imageTop) / 2);
      ctx.setLineDash([]);
      
      // Add information about the image characteristics
      let infoText = `${imageType.charAt(0).toUpperCase() + imageType.slice(1)}, `;
      infoText += imageHeight > 0 ? 'Upright' : 'Inverted';
      infoText += `, ${Math.abs(imageHeight / objectHeight).toFixed(2)}× size`;
      
      ctx.font = '12px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.fillText(infoText, imageX, imageBottom + 35);
    }
  };
  
  const drawPencil = (
    ctx: CanvasRenderingContext2D,
    x: number,
    bottom: number,
    height: number,
    inverted = false,
    isDashed = false
  ) => {
    // Calculate pencil dimensions - make it larger and more detailed
    const pencilWidth = 15; // Increased from 10
    const tipHeight = height * 0.2;
    const bodyHeight = height * 0.8;
    const eraserHeight = height * 0.1;
    
    // Adjust top position
    const top = bottom - height;
    
    // Set line style (dashed for virtual images)
    if (isDashed) {
      ctx.setLineDash([5, 3]);
    } else {
      ctx.setLineDash([]);
    }
    
    // Add shadow for 3D effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    if (inverted) {
      // Draw inverted pencil (eraser at bottom)
      
      // Eraser (at bottom)
      ctx.fillStyle = '#ffaaaa';
      ctx.fillRect(x - pencilWidth/2, bottom - eraserHeight, pencilWidth, eraserHeight);
      
      // Pencil body
      ctx.fillStyle = '#ffe566';
      ctx.fillRect(x - pencilWidth/2, bottom - eraserHeight - bodyHeight, pencilWidth, bodyHeight);
      
      // Pencil tip
      ctx.beginPath();
      ctx.moveTo(x - pencilWidth/2, top);
      ctx.lineTo(x + pencilWidth/2, top);
      ctx.lineTo(x, top + tipHeight);
      ctx.closePath();
      ctx.fillStyle = '#555';
      ctx.fill();
      
      // Draw line along pencil body to indicate it's a pencil
      ctx.beginPath();
      ctx.moveTo(x, bottom - eraserHeight - bodyHeight);
      ctx.lineTo(x, bottom - eraserHeight);
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      // Draw normal pencil (tip at bottom)
      
      // Pencil tip
      ctx.beginPath();
      ctx.moveTo(x - pencilWidth/2, bottom);
      ctx.lineTo(x + pencilWidth/2, bottom);
      ctx.lineTo(x, bottom - tipHeight);
      ctx.closePath();
      ctx.fillStyle = '#555';
      ctx.fill();
      
      // Pencil body
      ctx.fillStyle = '#ffe566';
      ctx.fillRect(x - pencilWidth/2, bottom - tipHeight - bodyHeight, pencilWidth, bodyHeight);
      
      // Eraser (at top)
      ctx.fillStyle = '#ffaaaa';
      ctx.fillRect(x - pencilWidth/2, top, pencilWidth, eraserHeight);
      
      // Draw line along pencil body to indicate it's a pencil
      ctx.beginPath();
      ctx.moveTo(x, bottom - tipHeight);
      ctx.lineTo(x, top + eraserHeight);
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Add pencil details like wood grain texture
    if (!inverted) {
      // Add wood grain lines
      for (let i = 1; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x - pencilWidth/2 + i * pencilWidth/5, bottom - tipHeight - bodyHeight * 0.1);
        ctx.lineTo(x - pencilWidth/2 + i * pencilWidth/5, top + eraserHeight);
        ctx.strokeStyle = 'rgba(160, 120, 80, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    } else {
      // Similar wood grain for inverted pencil
      for (let i = 1; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x - pencilWidth/2 + i * pencilWidth/5, bottom - eraserHeight);
        ctx.lineTo(x - pencilWidth/2 + i * pencilWidth/5, bottom - eraserHeight - bodyHeight * 0.9);
        ctx.strokeStyle = 'rgba(160, 120, 80, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Reset dash pattern
    ctx.setLineDash([]);
  };
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-20"
    />
  );
}