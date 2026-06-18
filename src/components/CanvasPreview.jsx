import React, { useRef, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function CanvasPreview({ backgroundImage, processedLogo, blurAmount, logoScale, logoOffsetY = 0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!backgroundImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bgImg = new Image();
    
    bgImg.onload = () => {
      // Set canvas dimensions based on background image
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;

      // Enhance image quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw background with blur
      ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none'; // Reset filter

      // Draw logo if available
      if (processedLogo) {
        const logoImg = new Image();
        logoImg.onload = () => {
          // Calculate logo size and position
          // Base scale: logo takes up max 50% of the canvas width or height, modified by logoScale
          const maxLogoSize = Math.min(canvas.width, canvas.height) * 0.5 * logoScale;
          const scaleRatio = Math.min(maxLogoSize / logoImg.width, maxLogoSize / logoImg.height);
          
          const logoWidth = logoImg.width * scaleRatio;
          const logoHeight = logoImg.height * scaleRatio;
          
          const logoX = (canvas.width - logoWidth) / 2;
          const baseLogoY = (canvas.height - logoHeight) / 2;
          
          // logoOffsetY is from -100 to 100 percentage
          // Map to pixel offset where 100 is half the canvas height down
          const yOffsetPixels = (logoOffsetY / 100) * (canvas.height / 2);
          const logoY = baseLogoY + yOffsetPixels;
          
          // Draw logo centered
          ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
        };
        logoImg.src = processedLogo;
      }
    };
    bgImg.src = backgroundImage;
  }, [backgroundImage, processedLogo, blurAmount, logoScale, logoOffsetY]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'avatar-with-logo.png';
    link.href = dataUrl;
    link.click();
  };

  if (!backgroundImage && !processedLogo) {
    return (
      <div className="canvas-container">
        <span className="placeholder-text">Preview will appear here</span>
      </div>
    );
  }

  return (
    <div className="result-section">
      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>
      
      <button 
        className="btn" 
        onClick={handleDownload}
        disabled={!backgroundImage}
      >
        <Download size={20} />
        Download Image
      </button>
    </div>
  );
}
