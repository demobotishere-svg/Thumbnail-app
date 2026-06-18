import React, { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';

export default function ImageUploader({ id, label, description, image, onImageChange, onRemove }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="col">
      <h3 className="section-title">{label}</h3>
      <div 
        className={`uploader-container ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={image ? undefined : onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          id={id}
          accept="image/*"
          className="hidden-input"
          onChange={handleChange}
        />
        
        {image ? (
          <>
            <img src={image} alt={label} className="image-preview" />
            <button className="remove-btn" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
              <X size={18} />
            </button>
          </>
        ) : (
          <>
            <UploadCloud size={48} className="uploader-icon" />
            <p className="uploader-text">Drag & drop or click</p>
            <p className="uploader-subtext">{description}</p>
          </>
        )}
      </div>
    </div>
  );
}
