import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import * as htmlToImage from 'html-to-image';
import Moveable from 'react-moveable';
import Selecto from 'react-selecto';
import ImageCard from './ImageCard';
import TextCard from './TextCard';

// CONSTANT CONFIG: Define the truth table for dimensions
const BOARD_CONFIG = {
  '16:9': { width: 1920, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
  '4:5':  { width: 1080, height: 1350 },
  '1:1':  { width: 1080, height: 1080 },
};

const VisionBoard = forwardRef(({ 
    images, 
    texts,
    onRemove, 
    onUpdateImage, 
    onUpdateLayout, 
    onUpdateText,
    onBringToFront, 
    onSelectionChange, 
    activeBackground, 
    activeFilter,
    activeAspectRatio
}, ref) => {
  const boardRef = useRef(null);
  const containerRef = useRef(null);
  const moveableRef = useRef(null);
  const [selectedTargets, setSelectedTargets] = useState([]);
  
  // Resolution State
  const [scale, setScale] = useState(1);
  const [boardDimensions, setBoardDimensions] = useState(BOARD_CONFIG['16:9']);

  // 1. Resolution Logic: Update True Dimensions & Scale
  useEffect(() => {
     if (activeAspectRatio && BOARD_CONFIG[activeAspectRatio.id]) {
         const targetConfig = BOARD_CONFIG[activeAspectRatio.id];
         setBoardDimensions(targetConfig);
     }
  }, [activeAspectRatio]);

  // 2. Scale Logic: Dynamically fit the huge board into the screen
  useEffect(() => {
     const calculateScale = () => {
         if (!containerRef.current) return;
         
         const containerWidth = containerRef.current.clientWidth;
         const containerHeight = containerRef.current.clientHeight;
         
         // Mobile Refinements
         const isMobile = window.innerWidth < 768;
         const padding = isMobile ? 20 : 40; // Smaller padding on mobile
         const toolbarOffset = isMobile ? 180 : 100; // Account for Top/Bottom specific UI height

         const availableWidth = containerWidth - padding;
         const availableHeight = containerHeight - padding - toolbarOffset;

         const scaleX = availableWidth / boardDimensions.width;
         const scaleY = availableHeight / boardDimensions.height;
         
         // Fit to whichever is smaller to ensure full visibility, max 1
         const fitScale = Math.min(scaleX, scaleY, 1); 
         setScale(fitScale);
     };

     // Initial calculation
     calculateScale();
     
     // Debounced Resize Observer is better, but window resize is fine for now
     window.addEventListener('resize', calculateScale);
     return () => window.removeEventListener('resize', calculateScale);
  }, [boardDimensions]);


  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    exportBoard: async () => {
      if (!boardRef.current) return;
      
      // Temporarily clear selection for clean capture
      const currentSelection = selectedTargets;
      setSelectedTargets([]);
      await new Promise(r => setTimeout(r, 100)); 

      try {
        const node = boardRef.current;
        
        // --- WYSIWYG EXPORT STRATEGY ---
        // 1. The node IS already the correct size (e.g. 1080x1920).
        // 2. We just need to strip the "transform: scale(...)" to capture it at full 1:1 resolution.
        
        // Wait for styles/fonts
        await document.fonts.ready;
        
        // Capture computed background styles for fidelity
        const computedStyle = window.getComputedStyle(node);
        
        const dataUrl = await htmlToImage.toJpeg(node, {
          quality: 0.9,
          skipAutoScale: true,
          pixelRatio: 1, 
          
          width: boardDimensions.width,
          height: boardDimensions.height,
          canvasWidth: boardDimensions.width,
          canvasHeight: boardDimensions.height,

          // Force background fidelity
          backgroundColor: computedStyle.backgroundColor,
          backgroundImage: computedStyle.backgroundImage,

          // GLOBAL CACHE BUSTING:
          // We manually modify the CLONED node's image sources to force a fresh fetch.
          // This avoids the "Event" crash from the library's internal cacheBust, but solves the "Ghost Image" bug.
          onClone: (clonedNode) => {
             const images = clonedNode.querySelectorAll('img');
             images.forEach(img => {
                 if (img.src && !img.src.startsWith('data:')) {
                     // Add a timestamp to force the browser to treat this as a new request
                     const separator = img.src.includes('?') ? '&' : '?';
                     img.src = `${img.src}${separator}export_t=${Date.now()}`;
                 }
             });
          },

          // RESET & CAPTURE LOGIC:
          x: 0,
          y: 0,
          style: {
             transform: 'none', 
             transformOrigin: 'top left',
             margin: 0,
             padding: 0,
             width: `${boardDimensions.width}px`,
             height: `${boardDimensions.height}px`,
             backgroundSize: 'cover',
             backgroundPosition: 'center center',
             backgroundRepeat: 'no-repeat',
             backgroundImage: computedStyle.backgroundImage,
             backgroundColor: computedStyle.backgroundColor,
          },
          filter: (n) => {
             if (n.classList && (
                 n.classList.contains('moveable-control-box') || 
                 n.classList.contains('selecto-selection-box')
             )) return false;

             if (n.tagName === 'IMG') {
                if (!n.complete || n.naturalWidth === 0) return false;
             }

             return true;
          },
          onError: (error) => {
             console.warn('Skipping problematic node:', error);
          }
        });
        
        const link = document.createElement('a');
        link.download = `VIBE_VISION_${Date.now()}.jpg`;
        link.href = dataUrl;
        link.click();

      } catch (err) {
        console.error("Export failed:", err);
        // If it's a generic Event (load error), it's likely a network glitch with an image
        if (err.type === 'error' && err.target) {
             alert("Some images could not be processed. Please try again or check your internet connection.");
        } else {
             alert("Could not save image. Try again.");
        }
      } finally {
        setSelectedTargets(currentSelection);
      }
    }
  }));

  // Sync selection with parent
  useEffect(() => {
    if (!onSelectionChange) return;
    if (selectedTargets.length === 0) {
        onSelectionChange(null);
        return;
    }
    const items = selectedTargets.map(t => {
        const id = t.getAttribute('data-id');
        const type = t.getAttribute('data-type');
        const item = type === 'text' ? texts.find(x => x.id === id) : images.find(x => x.id === id);
        return { id, type, ...item };
    }).filter(Boolean);

    if (items.length > 0) {
        const allText = items.every(i => i.type === 'text');
        const allImage = items.every(i => i.type !== 'text');
        onSelectionChange({
            type: allText ? 'text' : (allImage ? 'image' : 'mixed'),
            items: items
        });
    } else {
        onSelectionChange(null);
    }
  }, [selectedTargets, texts, images]);


  const handleCanvasClick = (e) => {
    if (e.target === boardRef.current) {
        setSelectedTargets([]);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center p-0 overflow-hidden bg-[#050505]">
      
      {/* THE PHYSICAL BOARD 
          Logic: It exists at TRUE Resolution (e.g. 1080x1920) but is SCALED down visually 
      */}
      <div 
        ref={boardRef}
        onClick={handleCanvasClick}
        className="relative shadow-2xl overflow-hidden bg-black origin-center will-change-transform"
        style={{
             width: boardDimensions.width,
             height: boardDimensions.height,
             transform: `scale(${scale})`, // Visual sizing
             ...activeBackground?.style,
             
             // Mobile/Responsiveness Critical Props:
             touchAction: 'none',   // Prevent pull-to-refresh / scrolling while dragging
             flexShrink: 0,         // Ensure board never collapses
             transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', // Smooth zoom
          }}
          // Ensure drag events don't bubble to scroll
          onPointerDown={(e) => e.stopPropagation()}
      >
        {/* IMAGES: Strict Key Usage (image.id) */}
        {images.map((image) => (
            <div
                key={image.id} /* CRITICAL: Must be unique ID, never index */
                className="absolute target-common target-image origin-center will-change-transform"
                style={{
                    width: image.width,
                    zIndex: image.zIndex,
                    transform: `translate(${image.x}px, ${image.y}px) rotate(${image.rotation}deg)`,
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTargets([e.currentTarget]);
                    onBringToFront(image.id);
                }}
                data-id={image.id}
                data-type={image.type === 'polaroid' ? 'polaroid' : 'image'} 
            >
                <ImageCard 
                    image={image}
                    activeFilter={activeFilter}
                    onRemove={onRemove}
                    onUpdateImage={onUpdateImage}
                    onBringToFront={onBringToFront}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        ))}

        {/* TEXTS */}
        {texts && texts.map((text) => (
            <div
                key={text.id}
                className="absolute target-common target-text origin-center will-change-transform"
                style={{
                    width: text.width,
                    height: text.height,
                    zIndex: text.zIndex,
                    transform: `translate(${text.x}px, ${text.y}px) rotate(${text.rotation}deg)`,
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTargets([e.currentTarget]);
                    onBringToFront(text.id, 'text');
                }}
                data-id={text.id}
                data-type="text"
            >
                <TextCard 
                    textNode={text}
                    onUpdateText={onUpdateText}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        ))}

        {/* SELECTO (Drag Select) */}
        <Selecto
            dragContainer={boardRef.current}
            selectableTargets={[".target-common"]}
            hitRate={0}
            selectByClick={true}
            selectFromInside={false}
            onSelect={e => {
                setSelectedTargets(e.selected);
            }}
            // Adjust coordinates for scaled container
            ratio={1 / scale}
        />

        {/* MOVEABLE (Handles) */}
        <Moveable
            ref={moveableRef}
            target={selectedTargets}
            draggable={true}
            throttleDrag={0}
            resizable={true}
            throttleResize={0}
            rotatable={true}
            throttleRotate={0}
            padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
            
            // Adjust for scaled container
            zoom={scale}

            // Style the control box
            controlStyle={{
                backgroundColor: 'white',
                border: '1px solid black',
                width: '10px',
                height: '10px',
            }}
            
             // --- SYNC ---
            onDragStart={({ target, set }) => {
                const id = target.getAttribute('data-id');
                const type = target.getAttribute('data-type');
                const item = (type === 'text') 
                    ? texts.find(t => t.id === id) 
                    : images.find(i => i.id === id);
                if (item) set([item.x, item.y]);
            }}
            onDrag={({ target, beforeTranslate }) => {
                target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px) rotate(${target.style.transform.match(/rotate\(([-\d.]+)deg\)/)?.[1] || 0}deg)`;
            }}
            onDragEnd={({ target, lastEvent }) => {
                 if (lastEvent) {
                     const id = target.getAttribute('data-id');
                     const typeStr = target.getAttribute('data-type');
                     const isText = typeStr === 'text';
                     const [x, y] = lastEvent.beforeTranslate;
                     onUpdateLayout(id, { x, y }, isText ? 'text' : 'image');
                 }
            }}

            onResizeStart={({ target, setOrigin, dragStart }) => {
                 setOrigin(["%", "%"]);
                 const id = target.getAttribute('data-id');
                 const typeStr = target.getAttribute('data-type');
                 const isText = typeStr === 'text';
                 const item = isText ? texts.find(t => t.id === id) : images.find(i => i.id === id);
                 if (dragStart && item) dragStart.set([item.x, item.y]);
            }}
            onResize={({ target, width, height, drag }) => {
                target.style.width = `${width}px`;
                target.style.height = `${height}px`;
                target.style.transform = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px) rotate(${target.style.transform.match(/rotate\(([-\d.]+)deg\)/)?.[1] || 0}deg)`;
            }}
            onResizeEnd={({ target, lastEvent }) => {
                 if (lastEvent) {
                     const id = target.getAttribute('data-id');
                     const typeStr = target.getAttribute('data-type');
                     const isText = typeStr === 'text';
                     const [x, y] = lastEvent.drag.beforeTranslate;
                     onUpdateLayout(id, { width: lastEvent.width, height: lastEvent.height, x, y }, isText ? 'text' : 'image');
                 }
            }}

            onRotateStart={({ target, set }) => {
                 const id = target.getAttribute('data-id');
                 const typeStr = target.getAttribute('data-type');
                 const isText = typeStr === 'text';
                 const item = isText ? texts.find(t => t.id === id) : images.find(i => i.id === id);
                 if (item) set(item.rotation);
            }}
            onRotate={({ target, beforeRotate }) => {
                const translateMatch = target.style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
                const tx = translateMatch ? translateMatch[1] : 0;
                const ty = translateMatch ? translateMatch[2] : 0;
                target.style.transform = `translate(${tx}px, ${ty}px) rotate(${beforeRotate}deg)`;
            }}
            onRotateEnd={({ target, lastEvent }) => {
                 if (lastEvent) {
                     const id = target.getAttribute('data-id');
                     const typeStr = target.getAttribute('data-type');
                     const isText = typeStr === 'text';
                     onUpdateLayout(id, { rotation: lastEvent.beforeRotate }, isText ? 'text' : 'image');
                 }
            }}
        />

      </div>
    </div>
  );
});

export default VisionBoard;
