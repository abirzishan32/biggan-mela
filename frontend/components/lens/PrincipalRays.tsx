"use client";

import { useRef, useEffect } from 'react';
import { LensType, LensParameters, ImageType } from './types';

interface PrincipalRaysProps {
    lensType: LensType;
    lensParams: LensParameters;
    objectDistance: number;
    objectHeight: number;
    imageDistance: number;
    imageHeight: number;
    imageType: ImageType;
    showAllRays: boolean;
    visible: boolean;
}

export default function PrincipalRays({
    lensType,
    lensParams,
    objectDistance,
    objectHeight,
    imageDistance,
    imageHeight,
    imageType,
    showAllRays,
    visible
}: PrincipalRaysProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Draw the principal rays
    useEffect(() => {
        if (!canvasRef.current || !visible) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions
        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                drawRays(ctx, canvas.width, canvas.height);
            }
        };

        // Initial sizing
        resizeCanvas();

        // Listen for resize
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [visible]);

    // Redraw when ray parameters change
    useEffect(() => {
        if (!visible) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        drawRays(ctx, canvas.width, canvas.height);
    }, [
        lensType,
        lensParams,
        objectDistance,
        objectHeight,
        imageDistance,
        imageHeight,
        imageType,
        showAllRays,
        visible
    ]);

    const drawRays = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        if (!visible) return;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Calculate center point and focal length
        const centerY = height / 2;
        const lensX = width / 2;
        const focalLength = lensType === 'convex' ? lensParams.focalLength : -lensParams.focalLength;
    
        // Add a subtle glow effect to the canvas
        ctx.shadowColor = 'rgba(255, 255, 0, 0.3)';
        ctx.shadowBlur = 10;
    
        // Increase line width for better visibility
        ctx.lineWidth = 3; // Increased from 2
    
        // Calculate object and image positions
        const objectX = lensX - objectDistance;
        const objectTop = centerY - objectHeight;

        // Determine if we need to draw rays for real or virtual image
        // For convex lens with object beyond focal point: real, inverted image
        // For convex lens with object within focal point: virtual, upright image
        // For concave lens: always virtual, upright image

        // Draw different rays based on lens type and object position
        if (lensType === 'convex') {
            drawConvexLensRays(
                ctx,
                lensX,
                centerY,
                objectX,
                objectTop,
                objectHeight,
                focalLength,
                imageDistance,
                imageHeight,
                imageType,
                showAllRays,
                width
            );
        } else {
            drawConcaveLensRays(
                ctx,
                lensX,
                centerY,
                objectX,
                objectTop,
                objectHeight,
                focalLength,
                imageDistance,
                imageHeight,
                showAllRays,
                width
            );
        }
    };

    const drawConvexLensRays = (
        ctx: CanvasRenderingContext2D,
        lensX: number,
        centerY: number,
        objectX: number,
        objectTop: number,
        objectHeight: number,
        focalLength: number,
        imageDistance: number,
        imageHeight: number,
        imageType: ImageType,
        showAllRays: boolean,
        width: number
    ) => {
        // Calculate key points
        const objectTip = { x: objectX, y: objectTop };
        const leftFocalX = lensX - focalLength;
        const rightFocalX = lensX + focalLength;

        // We need the image position to draw rays correctly
        let imageX: number;
        let imageTip: { x: number, y: number };

        if (imageDistance === Infinity) {
            // Special case: Object at focal point, rays parallel to axis
            imageX = Infinity;
            imageTip = { x: width, y: centerY }; // Just draw to edge of canvas
        } else {
            imageX = lensX + imageDistance * (imageType === 'real' ? 1 : -1);
            imageTip = {
                x: imageX,
                y: centerY - imageHeight * (imageType === 'real' ? -1 : 1)
            };
        }

        // Draw principal rays
        ctx.lineWidth = 2;

        // Ray 1: Parallel to the optical axis, then through the focal point
        ctx.beginPath();
        ctx.moveTo(objectTip.x, objectTip.y);
        ctx.lineTo(lensX, objectTip.y);

        if (imageDistance === Infinity) {
            // Special case: Object at focal point
            ctx.lineTo(width, objectTip.y); // Continues parallel
        } else {
            // After refraction, ray goes through (or appears to come from) the right focal point
            ctx.lineTo(imageTip.x, imageTip.y);
        }

        ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
        ctx.stroke();

        // Ray 2: Through the center of the lens (undeviated)
        ctx.beginPath();
        ctx.moveTo(objectTip.x, objectTip.y);
        ctx.lineTo(lensX, centerY);

        if (imageDistance === Infinity) {
            // Special case: Just draw to edge of canvas in the direction of the ray
            const angle = Math.atan2(centerY - objectTip.y, lensX - objectTip.x);
            ctx.lineTo(
                lensX + Math.cos(angle) * width,
                centerY + Math.sin(angle) * width
            );
        } else {
            ctx.lineTo(imageTip.x, imageTip.y);
        }

        ctx.strokeStyle = 'rgba(0, 128, 0, 0.7)';
        ctx.stroke();

        // Ray 3: Through the focal point, then parallel to the optical axis
        ctx.beginPath();
        ctx.moveTo(objectTip.x, objectTip.y);
        ctx.lineTo(leftFocalX, centerY);
        ctx.lineTo(lensX, centerY + (objectTip.y - centerY) * lensX / leftFocalX);

        if (imageDistance === Infinity) {
            // Special case: Draw horizontally to edge of canvas
            ctx.lineTo(width, centerY + (objectTip.y - centerY) * lensX / leftFocalX);
        } else {
            ctx.lineTo(imageTip.x, imageTip.y);
        }

        ctx.strokeStyle = 'rgba(0, 0, 255, 0.7)';
        ctx.stroke();

        // Optional: Draw additional rays for better visualization
        if (showAllRays) {
            // Ray 4: From object to top of lens
            const lensTopY = centerY - lensParams.diameter / 2;

            ctx.beginPath();
            ctx.moveTo(objectTip.x, objectTip.y);
            ctx.lineTo(lensX, lensTopY);

            // Calculate refraction angle and continue ray
            const incidentAngle = Math.atan2(objectTip.y - lensTopY, lensX - objectTip.x);

            if (imageDistance === Infinity) {
                // Draw to edge of canvas using an appropriate angle
                ctx.lineTo(width, lensTopY + (width - lensX) * Math.tan(incidentAngle));
            } else {
                ctx.lineTo(imageTip.x, imageTip.y);
            }

            ctx.strokeStyle = 'rgba(128, 0, 128, 0.7)';
            ctx.stroke();

            // Ray 5: From object to bottom of lens
            const lensBottomY = centerY + lensParams.diameter / 2;

            ctx.beginPath();
            ctx.moveTo(objectTip.x, objectTip.y);
            ctx.lineTo(lensX, lensBottomY);

            if (imageDistance === Infinity) {
                // Draw to edge of canvas
                const angle2 = Math.atan2(objectTip.y - lensBottomY, lensX - objectTip.x);
                ctx.lineTo(width, lensBottomY + (width - lensX) * Math.tan(angle2));
            } else {
                ctx.lineTo(imageTip.x, imageTip.y);
            }

            ctx.strokeStyle = 'rgba(255, 165, 0, 0.7)';
            ctx.stroke();
        }

        // Add ray labels
        ctx.font = '12px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';

        // Ray 1 label
        ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
        ctx.fillText('Ray 1', objectX + 40, objectTip.y - 10);

        // Ray 2 label
        ctx.fillStyle = 'rgba(0, 128, 0, 0.9)';
        ctx.fillText('Ray 2', (objectX + lensX) / 2 - 20, (objectTip.y + centerY) / 2 + 15);

        // Ray 3 label
        ctx.fillStyle = 'rgba(0, 0, 255, 0.9)';
        ctx.fillText('Ray 3', (objectX + leftFocalX) / 2, (objectTip.y + centerY) / 2 - 15);
    };

    const drawConcaveLensRays = (
        ctx: CanvasRenderingContext2D,
        lensX: number,
        centerY: number,
        objectX: number,
        objectTop: number,
        objectHeight: number,
        focalLength: number, // Note: focalLength is negative for concave lens
        imageDistance: number,
        imageHeight: number,
        showAllRays: boolean,
        width: number
    ) => {
        // Calculate key points
        const objectTip = { x: objectX, y: objectTop };
        const leftFocalX = lensX + focalLength; // Note: focalLength is negative
        const rightFocalX = lensX - focalLength;

        // For concave lens, image is always virtual and on the same side as the object
        const imageX = lensX - imageDistance;
        const imageTip = { x: imageX, y: centerY - imageHeight };

        // Draw principal rays
        ctx.lineWidth = 2;

        // Ray 1: Parallel to the optical axis, then appears to come from focal point
        ctx.beginPath();
        ctx.moveTo(objectTip.x, objectTip.y);
        ctx.lineTo(lensX, objectTip.y);

        // Calculate the angle from lens to focal point
        const angle1 = Math.atan2(objectTip.y - centerY, leftFocalX - lensX);

        // Extended ray line that appears to come from focal point
        const extendedX1 = width; // Extend to edge of canvas
        const extendedY1 = objectTip.y + Math.tan(angle1) * (extendedX1 - lensX);

        ctx.lineTo(extendedX1, extendedY1);

        ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
        ctx.stroke();

        // Draw dotted line to show virtual ray path
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(lensX, objectTip.y);
        ctx.lineTo(leftFocalX, centerY);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)';
        ctx.stroke();
        ctx.setLineDash([]);

        // Ray 2: Through the center of the lens (undeviated)
        ctx.beginPath();
        ctx.moveTo(objectTip.x, objectTip.y);
        ctx.lineTo(lensX, centerY);

        // Extend this ray
        const extendedX2 = width;
        const slope = (centerY - objectTip.y) / (lensX - objectTip.x);
        const extendedY2 = centerY + (extendedX2 - lensX) * slope;

        ctx.lineTo(extendedX2, extendedY2);
        ctx.strokeStyle = 'rgba(0, 128, 0, 0.7)';
        ctx.stroke();

        // Ray 3: Aimed at the focal point on the lens side, then parallel to axis
        ctx.beginPath();
        ctx.moveTo(objectTip.x, objectTip.y);
        ctx.lineTo(lensX, centerY + (objectTip.y - centerY) * (lensX - rightFocalX) / (objectX - rightFocalX));
        ctx.lineTo(width, centerY + (objectTip.y - centerY) * (lensX - rightFocalX) / (objectX - rightFocalX));
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.7)';
        ctx.stroke();

        // Draw dotted line to show the path to focal point
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(objectTip.x, objectTip.y);
        ctx.lineTo(rightFocalX, centerY);
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.4)';
        ctx.stroke();
        ctx.setLineDash([]);

        // Optional: Draw additional rays for better visualization
        if (showAllRays) {
            // Ray 4: From object to top of lens
            const lensTopY = centerY - lensParams.diameter / 2;

            ctx.beginPath();
            ctx.moveTo(objectTip.x, objectTip.y);
            ctx.lineTo(lensX, lensTopY);

            // Calculate refraction angle and continue ray
            const incidentAngle = Math.atan2(objectTip.y - lensTopY, lensX - objectTip.x);
            const extendedX4 = width;
            const extendedY4 = lensTopY + Math.tan(incidentAngle) * (extendedX4 - lensX);

            ctx.lineTo(extendedX4, extendedY4);
            ctx.strokeStyle = 'rgba(128, 0, 128, 0.7)';
            ctx.stroke();

            // Ray 5: From object to bottom of lens
            const lensBottomY = centerY + lensParams.diameter / 2;

            ctx.beginPath();
            ctx.moveTo(objectTip.x, objectTip.y);
            ctx.lineTo(lensX, lensBottomY);

            const incidentAngle2 = Math.atan2(objectTip.y - lensBottomY, lensX - objectTip.x);
            const extendedX5 = width;
            const extendedY5 = lensBottomY + Math.tan(incidentAngle2) * (extendedX5 - lensX);

            ctx.lineTo(extendedX5, extendedY5);
            ctx.strokeStyle = 'rgba(255, 165, 0, 0.7)';
            ctx.stroke();
        }

        // Draw the virtual image position and the extrapolated rays meeting point
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(imageX, imageTip.y);
        ctx.lineTo(imageX, centerY);
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
        ctx.stroke();
        ctx.setLineDash([]);

        // Add ray labels
        ctx.font = '12px Arial';

        // Ray 1 label
        ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
        ctx.fillText('Ray 1', objectX + 40, objectTip.y - 10);

        // Ray 2 label
        ctx.fillStyle = 'rgba(0, 128, 0, 0.9)';
        ctx.fillText('Ray 2', (objectX + lensX) / 2 - 20, (objectTip.y + centerY) / 2 + 15);

        // Ray 3 label
        ctx.fillStyle = 'rgba(0, 0, 255, 0.9)';
        ctx.fillText('Ray 3', (objectX + rightFocalX) / 2, (objectTip.y + centerY) / 2 - 15);
    };

    return (
        <canvas
            ref={canvasRef}
            className={`absolute top-0 left-0 w-full h-full z-10 ${!visible ? 'hidden' : ''}`}
        />
    );
}
