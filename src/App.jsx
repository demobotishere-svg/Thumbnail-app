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
  const [logoOffsetX, setLogoOffsetX] = useState(0);
  const [showOutline, setShowOutline] = useState(false);
  const [outlineColor, setOutlineColor] = useState('#ffffff');


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
          
          <div className="control-group">
            <div className="control-header">
              <label>Logo Horizontal Position: {logoOffsetX}%</label>
            </div>
            <input 
              type="range" 
              min="-100" 
              max="100" 
              step="1"
              value={logoOffsetX} 
              onChange={(e) => setLogoOffsetX(e.target.value)} 
            />
          </div>
          
          <div className="control-group">
            <div className="control-header">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={showOutline}
                  onChange={(e) => setShowOutline(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                Enable Logo Outline
              </label>
            </div>
            
            {showOutline && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <input 
                  type="color" 
                  value={outlineColor}
                  onChange={(e) => setOutlineColor(e.target.value)}
                  style={{ width: '40px', height: '40px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>Choose Outline Color</span>
              </div>
            )}
          </div>
        </div>
      )}

      <CanvasPreview 
        backgroundImage={backgroundUrl} 
        processedLogo={processedLogoUrl} 
        blurAmount={blurAmount}
        logoScale={logoScale}
        logoOffsetY={logoOffsetY}
        logoOffsetX={logoOffsetX}
        showOutline={showOutline}
        outlineColor={outlineColor}
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
