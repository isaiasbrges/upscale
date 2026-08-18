"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScratchCellProps {
  maskColor: string;
  maskTexture?: string;
  centerIcon?: string;
  maskOpacity: number;
  revealThreshold?: number; // default 0.55
  onReveal?: () => void;
  prizeContent: React.ReactNode;
}

export const ScratchCell: React.FC<ScratchCellProps> = ({
  maskColor,
  maskTexture,
  centerIcon,
  maskOpacity,
  revealThreshold = 0.55,
  onReveal,
  prizeContent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    ctx.scale(dpr, dpr);

    // Initial fill
    ctx.globalAlpha = maskOpacity;
    ctx.fillStyle = maskColor;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // If texture is provided, load and draw it
    if (maskTexture) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = maskTexture;
      img.onload = () => {
        // Draw texture scaled to cover
        ctx.globalAlpha = maskOpacity;
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        
        // Redraw center icon if needed since texture overlaps
        drawCenterIcon();
      };
    }

    const drawCenterIcon = () => {
      if (centerIcon) {
        const icon = new Image();
        icon.crossOrigin = "anonymous";
        icon.src = centerIcon;
        icon.onload = () => {
          const iconSize = Math.min(rect.width, rect.height) * 0.4;
          const x = (rect.width - iconSize) / 2;
          const y = (rect.height - iconSize) / 2;
          ctx.globalAlpha = 1;
          ctx.drawImage(icon, x, y, iconSize, iconSize);
        };
      }
    };
    
    if (!maskTexture) {
      drawCenterIcon();
    }

    // Prepare for erasing
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 30; // Eraser size
    ctx.globalCompositeOperation = "destination-out";

  }, [maskColor, maskTexture, centerIcon, maskOpacity]);

  const checkRevealThreshold = () => {
    if (isRevealed) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    const totalPixels = pixels.length / 4;

    // Check alpha channel (every 4th value)
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 50) { // Consider mostly transparent
        transparentPixels++;
      }
    }

    if (transparentPixels / totalPixels > revealThreshold) {
      setIsRevealed(true);
      if (onReveal) onReveal();
    }
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (!isDrawing.current) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      isDrawing.current = true;
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDrawing.current = false;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      checkRevealThreshold();
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full overflow-hidden rounded-md"
      style={{ touchAction: "none" }} // Crucial for mobile scratching
    >
      <div className="absolute inset-0 flex items-center justify-center bg-white z-0">
        {prizeContent}
      </div>
      
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 w-full h-full cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      )}
    </div>
  );
};
