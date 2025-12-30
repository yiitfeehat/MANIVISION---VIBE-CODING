import React from 'react';
import { Trash2, Layers, Move, RotateCw, Scaling } from 'lucide-react';

const MobileInspector = ({ selection, onUpdate, onRemove, onBringToFront, onSendToBack }) => {
  if (!selection || !selection.items || selection.items.length === 0) return null;

  const item = selection.items[0]; // Single item editing for now on mobile
  const isText = selection.type === 'text';

  // Handlers
  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    // Min size guard is handled here or parent, but UI range should respect min
    if (isText) {
       onUpdate(item.id, { fontSize: newSize });
    } else {
       onUpdate(item.id, { width: newSize });
    }
  };

  const handleRotationChange = (e) => {
    const degrees = parseInt(e.target.value);
    onUpdate(item.id, { rotation: degrees });
  };

  const currentValue = isText ? (item.fontSize || 48) : (item.width || 200);
  const minSize = isText ? 10 : 60;
  const maxSize = isText ? 200 : 800; // Cap width for mobile slider

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1200] bg-zinc-900/95 backdrop-blur-xl border-t border-white/10 pb-8 pt-4 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:hidden animate-in slide-in-from-bottom-10 fade-in duration-200">
      
      {/* Header / Title */}
      <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
             {isText ? <TypeIcon className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
             <span>{isText ? 'Edit Text' : 'Edit Image'}</span>
          </div>
          <button 
             onClick={() => onRemove(item.id)}
             className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
          >
             <Trash2 className="w-4 h-4" />
          </button>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-4 items-center mb-4">
          {/* Size Slider */}
          <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase">
                  <span>Size</span>
                  <span>{Math.round(currentValue)}px</span>
              </div>
              <div className="h-10 bg-black/40 rounded-xl flex items-center px-3 border border-white/5">
                  <Scaling className="w-4 h-4 text-zinc-500 mr-3" />
                  <input 
                    type="range" 
                    min={minSize} 
                    max={maxSize} 
                    value={currentValue} 
                    onChange={handleSizeChange}
                    className="w-full h-1 bg-zinc-700 rounded-full appearance-none accent-white cursor-pointer"
                  />
              </div>
          </div>

          {/* Z-Index Controls */}
          <div className="flex gap-2">
             <button onClick={() => onBringToFront(item.id, selection.type)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:bg-white hover:text-black">
                 <Layers className="w-4 h-4" />
             </button>
          </div>
      </div>

      {/* Rotation Slider */}
      <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase">
              <span>Rotation</span>
              <span>{Math.round(item.rotation || 0)}°</span>
          </div>
          <div className="h-10 bg-black/40 rounded-xl flex items-center px-3 border border-white/5">
              <RotateCw className="w-4 h-4 text-zinc-500 mr-3" />
              <input 
                type="range" 
                min="-180" 
                max="180" 
                value={item.rotation || 0} 
                onChange={handleRotationChange}
                className="w-full h-1 bg-zinc-700 rounded-full appearance-none accent-white cursor-pointer"
              />
          </div>
      </div>

    </div>
  );
};

// Simple icon helpers if not imported
const TypeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
);

const ImageIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);

export default MobileInspector;
