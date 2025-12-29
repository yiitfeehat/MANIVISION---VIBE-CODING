import { compressAndResizeImage } from '../utils/imageOptimizer';
import React, { useState } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { Wand2, X, Trash2 } from 'lucide-react'; // Icons

const ImageCard = ({ image, activeFilter, onClick, onRemove, onUpdateImage, onBringToFront, style }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Type: 'polaroid' (White border, shadow) or 'raw' (Transparent, full bleed)
  const isPolaroid = image?.type === 'polaroid';

  if (!isVisible) return null;

  const handleMagicWand = async (e) => {
    e.stopPropagation();
    if (isProcessing) return;
    
    setIsProcessing(true);
    // console.log("Processing BG Removal for:", image.title);

    try {
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(image.url)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error(`Network error: ${response.status}`);
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.startsWith("image/")) throw new Error(`Invalid format: ${contentType}`);
      
      const originalBlob = await response.blob();
      
      // Optimize before processing
      const optimizedBlob = await compressAndResizeImage(originalBlob);
      
      const imageBitmap = await removeBackground(optimizedBlob);
      const newUrl = URL.createObjectURL(imageBitmap);
      
      if (onUpdateImage) {
        onUpdateImage(image.id, newUrl);
      }
    } catch (error) {
      console.error("BG Removal failed:", error);
      alert(`Magic Wand failed: ${error.message}. Try another image.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className={`relative group w-full h-full cursor-grab active:cursor-grabbing`}
      style={style}
      onMouseDown={(e) => {
        if (onClick) onClick(e);
        if (onBringToFront) onBringToFront(image.id);
      }}
    >
      <div 
        className={`w-full h-full transition-all duration-300 relative overflow-hidden
          ${isPolaroid 
            ? 'bg-white p-3 pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.2)]' 
            : 'bg-transparent' 
          }
        `}
      >
        <img
          src={image.url.startsWith('blob:') ? image.url : `/api/proxy-image?url=${encodeURIComponent(image.url)}`}
          alt={image.title}
          loading="lazy"
          crossOrigin="anonymous" 
          // APPLY THE WORLD FILTER HERE
          style={activeFilter?.style} 
          className={`w-full h-full ${isPolaroid ? 'object-cover' : 'object-contain'} ${isProcessing ? 'opacity-50 blur-sm' : ''} transition-all duration-500`}
          onError={() => setIsVisible(false)}
          draggable={false} 
        />
        
        {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}
      </div>
      
      {/* --- INNOVATIVE MICRO-MENU --- */}
      {/* Floats above the image, fades in on hover */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-black/80 backdrop-blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-xl border border-white/10 z-50 pointer-events-auto">
             
            {/* 1. Magic Wand */}
            {onUpdateImage && (
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={handleMagicWand}
                    className="p-1.5 text-zinc-400 hover:text-fuchsia-400 hover:bg-white/10 rounded-full transition-colors"
                    title="Remove Background"
                >
                    <Wand2 className="w-4 h-4" />
                </button>
            )}

            {/* Divider */}
            <div className="w-[1px] h-3 bg-white/20"></div>

            {/* 2. Delete */}
            {onRemove && (
                <button
                    onPointerDown={(e) => e.stopPropagation()} 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        onRemove(image.id);
                    }}
                     className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
                    title="Delete Image"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
      </div>

    </div>
  );
};

export default ImageCard;
