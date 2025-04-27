import React, { useRef, useEffect } from 'react';

/**
 * LogoCanvas Component
 * Renders a logo for Elfriedes Accommodations using HTML5 Canvas.
 * Designed for use in a Next.js application.
 *
 * Props:
 * - width: displayed width of the canvas in pixels (default: 200)
 * - height: displayed height of the canvas in pixels (default: 200)
 */
export default function LogoCanvas({ width = 290, height = 200 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Setup for high-DPI displays
        canvas.width = width * 2;
        canvas.height = height * 2;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(2, 2);

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw roof (triangle)
        ctx.fillStyle = '#4F46E5'; // Indigo
        ctx.beginPath();
        ctx.moveTo(width * 0.5, height * 0.2);
        ctx.lineTo(width * 0.2, height * 0.5);
        ctx.lineTo(width * 0.8, height * 0.5);
        ctx.closePath();
        ctx.fill();

        // Draw house body
        ctx.fillStyle = '#6366F1'; // Lighter Indigo
        const houseX = width * 0.3;
        const houseY = height * 0.5;
        const houseW = width * 0.4;
        const houseH = height * 0.35;
        ctx.fillRect(houseX, houseY, houseW, houseH);

        // Draw door
        ctx.fillStyle = '#FFFFFF';
        const doorW = width * 0.06;
        const doorH = height * 0.2;
        const doorX = width * 0.47;
        const doorY = height * 0.65;
        ctx.fillRect(doorX, doorY, doorW, doorH);

        // Draw text
        ctx.fillStyle = '#111827'; // Dark Gray
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Elfriedes Accommodations', width / 2, height * 0.95);
    }, [width, height]);

    return (
        <canvas
            ref={canvasRef}
            role="img"
            aria-label="Elfriedes Accommodations Logo"
            className="shadow-lg rounded-2xl"
        />
    );
}
