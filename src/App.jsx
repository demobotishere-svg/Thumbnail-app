import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import CanvasPreview from './components/CanvasPreview';
import { removeImageBackground, readFileAsDataURL } from './utils/imageProcessing';

function App() {
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [backgroundUrl, setBackgroundUrl] = useState(null);
  
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [processedLogoUrl, setProcessedLogoUrl] = useState(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  
  const [blurAmount, setBlurAmount] = useState(15);
  const [logoScale, setLogoScale] = useState(1.0);
  const [logoOffsetY, setLogoOffsetY] = useState(0);

  const handleBackgroundUpload = async (file) => {
    setBackgroundFile(file);
    const url = await readFileAsDataURL(file);
    setBackgroundUrl(url);
  };

  const handleLogoUpload = async (file) => {
    setLogoFile(file);
    const url = await readFileAsDataURL(file);
    setLogoUrl(url);
    
    // Auto-process the logo to remove background
    processLogo(url);
  };

  const processLogo = async (imgSrc) => {
    if (!imgSrc) return;
    
    setIsProcessing(true);
    setProgressMsg('Initializing AI model...');
    
    try {
      const processedUrl = await removeImageBackground(imgSrc, (msg) => {
        setProgressMsg(msg);
      });
      setProcessedLogoUrl(processedUrl);
    } catch (error) {
      console.error("Failed to process logo:", error);
      alert("Failed to remove background from logo. See console for details.");
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const clearBackground = () => {
    setBackgroundFile(null);
    setBackgroundUrl(null);
  };

  const clearLogo = () => {
    setLogoFile(null);
    setLogoUrl(null);
    setProcessedLogoUrl(null);
  };

  return (
    <div className="glass-panel">
      <h1>Avatar Generator</h1>
      <p className="subtitle">Upload a background and a logo to generate a stunning composite image.</p>
      
      <div className="app-grid">
        <ImageUploader 
          id="bg-upload"
          label="1. Avatar Background" 
          description="Upload the raw background image"
          image={backgroundUrl}
          onImageChange={handleBackgroundUpload}
          onRemove={clearBackground}
        />
        
        <ImageUploader 
          id="logo-upload"
          label="2. Tool Logo" 
          description="Upload logo (we'll remove the background)"
          image={logoUrl}
          onImageChange={handleLogoUpload}
          onRemove={clearLogo}
        />
      </div>

      {(backgroundUrl || logoUrl) && (
        <div className="controls">
          <div className="control-group">
            <div className="control-header">
              <label>Background Blur: {blurAmount}px</label>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50" 
              value={blurAmount} 
              onChange={(e) => setBlurAmount(e.target.value)} 
            />
          </div>
          
          <div className="control-group">
            <div className="control-header">
              <label>Logo Size Scale: {logoScale}x</label>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="5.0" 
              step="0.1"
              value={logoScale} 
              onChange={(e) => setLogoScale(e.target.value)} 
            />
          </div>
          
          <div className="control-group">
            <div className="control-header">
              <label>Logo Vertical Position: {logoOffsetY}%</label>
            </div>
            <input 
              type="range" 
              min="-100" 
              max="100" 
              step="1"
              value={logoOffsetY} 
              onChange={(e) => setLogoOffsetY(e.target.value)} 
            />
          </div>
        </div>
      )}

      <CanvasPreview 
        backgroundImage={backgroundUrl} 
        processedLogo={processedLogoUrl} 
        blurAmount={blurAmount}
        logoScale={logoScale}
        logoOffsetY={logoOffsetY}
      />
      
      {isProcessing && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>{progressMsg}</p>
        </div>
      )}
    </div>
  );
}

export default App;
