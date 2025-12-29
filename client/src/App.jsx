import React, { useState, useRef, useEffect } from 'react';
import { defaultTheme } from './config/themeConfig';
import { worldFilters, worldBackgrounds } from './config/worldStyles';
import { fontOptions } from './config/fontStyles';
import VisionBoard from './components/VisionBoard';
import { removeBackground } from '@imgly/background-removal';
import { compressAndResizeImage } from './utils/imageOptimizer';

// Icons
import { Search, Plus, Type, Image as ImageIcon, Sparkles, Box, Smartphone, Monitor, Square, Sun, Zap, Film, Cloud, Aperture, X, Palette, Wand2, Trash2, Download, Bold, Frame } from 'lucide-react';

const aspectRatios = [
    { id: '16:9', label: '16:9', width: 16, height: 9, icon: <Monitor className="w-4 h-4" /> },
    { id: '9:16', label: '9:16', width: 9, height: 16, icon: <Smartphone className="w-4 h-4" /> },
    { id: '4:5', label: '4:5', width: 4, height: 5, icon: <Box className="w-4 h-4" /> },
    { id: '1:1', label: '1:1', width: 1, height: 1, icon: <Square className="w-4 h-4" /> },
];

function App() {
  // --- State ---
  const [boardImages, setBoardImages] = useState([]);
  const [boardTexts, setBoardTexts] = useState([]);
  
  const [activeFilter, setActiveFilter] = useState(null); 
  const [activeBackground, setActiveBackground] = useState(worldBackgrounds[2]); 
  const [activeFont, setActiveFont] = useState(fontOptions[0]);
  const [activeAspectRatio, setActiveAspectRatio] = useState(aspectRatios[0]);
  const [isPolaroid, setIsPolaroid] = useState(true); // Global Default

  const [selection, setSelection] = useState(null); // { type: 'text'|'image', items: [] }
  const [isProcessingAi, setIsProcessingAi] = useState(false);

  // UI State
  const [showSearch, setShowSearch] = useState(false);
  const [showTools, setShowTools] = useState(false); 
  const [activeToolTab, setActiveToolTab] = useState('add');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Refs
  const isAddingRef = useRef(false);
  const visionBoardRef = useRef(null);

  // --- Handlers ---

  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);

  // --- Debounced Search ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        if (searchQuery.trim()) {
            performSearch();
        }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (e) => {
    if (e) e.preventDefault(); // Optional if triggered by effect
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const payload = { query: searchQuery + " aesthetic" };
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = async () => {
      if (isSaving || !visionBoardRef.current) return;
      
      setIsSaving(true);
      setSaveProgress(0);

      // Simulate a 3-second progress bar
      const duration = 3000; 
      const intervalTime = 50; 
      const steps = duration / intervalTime;
      let currentStep = 0;

      const timer = setInterval(() => {
          currentStep++;
          const newProgress = Math.min((currentStep / steps) * 100, 100);
          setSaveProgress(newProgress);

          if (currentStep >= steps) {
              clearInterval(timer);
              // Trigger actual save
              visionBoardRef.current.exportBoard().then(() => {
                   // Small delay to show 100% completion before resetting
                   setTimeout(() => {
                       setIsSaving(false);
                       setSaveProgress(0);
                   }, 500);
              });
          }
      }, intervalTime);
  };

  const addToBoard = (img) => {
    if (isAddingRef.current) return;
    isAddingRef.current = true;
    setTimeout(() => { isAddingRef.current = false; }, 100);

    setBoardImages(prev => {
      const maxZ = Math.max(
          ...(prev.map(i => i.zIndex || 0)),
          ...(boardTexts.map(t => t.zIndex || 0)), 
          0
      );
      
      return [...prev, {
        ...img,
        // FIX: Use robust UUID to prevent reconciliation bugs
        id: window.crypto.randomUUID ? window.crypto.randomUUID() : `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: 50 + (Math.random() * 50), 
        y: 100 + (Math.random() * 50),
        width: 300,
        height: 'auto', 
        rotation: (Math.random() * 6) - 3,
        zIndex: maxZ + 1,
        type: isPolaroid ? 'polaroid' : 'raw',
      }];
    });
    setShowSearch(false);
  };

  const addTextToBoard = () => {
      setBoardTexts(prev => {
        const maxZ = Math.max(
            ...(boardImages.map(i => i.zIndex || 0)),
            ...(prev.map(t => t.zIndex || 0)), 
            0
        );

        return [...prev, {
            id: `text-${Date.now()}`,
            content: "Double Click",
            x: 100,
            y: 200,
            width: 300,
            height: 100,
            rotation: 0,
            zIndex: maxZ + 1,
            fontFamily: activeFont.family,
            fontSize: 48, // Default Size
            color: 'white'
        }];
      });
  };

  const removeFromBoard = (id) => {
    setBoardImages(prev => prev.filter(img => img.id !== id));
    setBoardTexts(prev => prev.filter(t => t.id !== id));
    setSelection(null);
  };

  const updateImage = (id, newUrl) => {
    setBoardImages(prev => prev.map(img => img.id === id ? { ...img, url: newUrl } : img));
  };
  
  // Logic to toggle Image Type (Polaroid/Raw) for existing image
  const toggleImageFrame = (id) => {
      setBoardImages(prev => prev.map(img => {
          if (img.id === id) {
              return { ...img, type: img.type === 'polaroid' ? 'raw' : 'polaroid' };
          }
          return img;
      }));
  };

  const updateText = (id, updates) => {
    setBoardTexts(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const updateLayout = (id, layoutChanges, type) => {
    if (type === 'text') {
        setBoardTexts(prev => prev.map(t => t.id === id ? { ...t, ...layoutChanges } : t));
    } else {
        setBoardImages(prev => prev.map(img => img.id === id ? { ...img, ...layoutChanges } : img));
    }
  };

  const bringToFront = (id, type) => {
     const maxZ = Math.max(
        ...(boardImages.map(i => i.zIndex || 0)),
        ...(boardTexts.map(t => t.zIndex || 0)), 
        0
     );
     if (type === 'text') {
         setBoardTexts(prev => prev.map(t => t.id === id ? { ...t, zIndex: maxZ + 1 } : t));
     } else {
         setBoardImages(prev => prev.map(img => img.id === id ? { ...img, zIndex: maxZ + 1 } : img));
     }
  };

  const toggleFilter = (filter) => {
      if (activeFilter?.id === filter.id) {
          setActiveFilter(null);
      } else {
          setActiveFilter(filter);
      }
  };

  const handleAiBackgroundRemoval = async () => {
      if (!selection || selection.type !== 'image' || isProcessingAi) return;
      
      const item = selection.items[0]; // Process first selected for now
      if (!item) return;

      setIsProcessingAi(true);
      try {
          // 1. Fetch the image through proxy to avoid CORS
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(item.url)}`;
          const response = await fetch(proxyUrl);
          if (!response.ok) throw new Error('Failed to fetch image');
          const originalBlob = await response.blob();

          // 2. Optimize (Resize & Compress)
          const optimizedBlob = await compressAndResizeImage(originalBlob);

          // 3. Remove Background using the small, efficient blob
          const imageBitmap = await removeBackground(optimizedBlob);
          const newUrl = URL.createObjectURL(imageBitmap);
          
          updateImage(item.id, newUrl);
      } catch (err) {
          console.error("AI BG Removal failed", err);
          alert("Could not remove background.");
      } finally {
          setIsProcessingAi(false);
      }
  };

  // --- Context Actions ---
  const handleSelectionChange = (newSelection) => {
      setSelection(newSelection);
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-zinc-100 font-sans overflow-hidden relative">

      {/* AI PROCESSING OVERLAY */}
      {isProcessingAi && (
          <div className="absolute inset-0 z-[2000] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="relative">
                  <div className="w-16 h-16 border-4 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-fuchsia-400 animate-pulse" />
                  </div>
              </div>
              <p className="mt-4 text-lg font-light tracking-wide text-white animate-pulse">AI is dreaming...</p>
          </div>
      )}
      
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-[1000] px-4 py-4 flex items-center justify-between pointer-events-none">
          {/* LEFT: Branding + Search */}
          <div className="flex items-center gap-3 pointer-events-auto">
             <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs font-black tracking-widest text-white">MANIVISION</span>
             </div>
             
             <button 
               onClick={() => setShowSearch(!showSearch)}
               className="bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white text-white hover:text-black rounded-full p-2.5 transition-all shadow-lg overflow-hidden group"
             >
                {/* 3. Dynamic Contrast for Search Button (mix-blend-difference) */}
                <Search className="w-4 h-4 mix-blend-difference text-white group-hover:text-black" />
             </button>
          </div>

          {/* RIGHT: Save Action */}
          <div className="pointer-events-auto">
               <button 
                  onClick={handleSave}
                  className="bg-white text-black px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
               >
                   <Download className="w-4 h-4" /> Save
               </button>
          </div>
      </header>

      {/* Search Overlay */}
      {showSearch && (
         <div className="fixed inset-0 z-[1500] bg-black/90 backdrop-blur-lg flex flex-col pt-20 px-4 animate-in fade-in duration-200">
             <div className="w-full max-w-5xl mx-auto relative group">
                 <button onClick={() => setShowSearch(false)} className="absolute -top-12 right-0 text-zinc-500 hover:text-white"><X /></button>
                 <form onSubmit={performSearch} className="mb-8">
                    <input 
                       autoFocus
                       type="text" 
                       placeholder="What is your vision?"
                       value={searchQuery}
                       onChange={e => setSearchQuery(e.target.value)}
                       className="w-full bg-transparent text-3xl md:text-5xl font-light text-white border-b border-white/20 pb-4 focus:outline-none focus:border-white transition-colors placeholder-white/30"
                    />
                 </form>

                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-20 overflow-y-auto max-h-[70vh]">
                     {searchResults.map((img, idx) => (
                         <div key={idx} onClick={() => addToBoard(img)} className="cursor-pointer group relative aspect-[3/4] rounded-lg overflow-hidden bg-zinc-900">
                             <img 
                               src={`/api/proxy-image?url=${encodeURIComponent(img.url)}`} 
                               className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all group-hover:scale-105" 
                               loading="lazy" 
                             />
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                 <Plus className="text-white w-8 h-8"/>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
         </div>
      )}

      {/* Main Canvas */}
      <main className="flex-1 w-full h-full relative overflow-hidden bg-[#050505] flex items-center justify-center">
         <VisionBoard 
            ref={visionBoardRef}
            images={boardImages} 
            texts={boardTexts}
            activeFilter={activeFilter}
            activeBackground={activeBackground}
            activeAspectRatio={activeAspectRatio}
            title="" 
            onRemove={removeFromBoard}
            onUpdateImage={updateImage}
            onUpdateText={updateText}
            onUpdateLayout={updateLayout}
            onBringToFront={bringToFront} 
            onSelectionChange={handleSelectionChange}
         />
      </main>

      {/* CONTEXT TOOLBAR OR BOTTOM DOCK */}
      {selection && !isSaving ? (
          // --- CONTEXT AWARE TOOLBAR ---
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1100] animate-in slide-in-from-bottom-5 fade-in duration-300">
               <div className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-full p-2 px-4 shadow-2xl">
                   
                   {/* TEXT TOOLS */}
                   {selection.type === 'text' && (
                       <>
                           <Type className="w-4 h-4 text-zinc-500 mr-2" />
                           <div className="h-6 w-[1px] bg-white/10 mx-1" />
                           
                           <select 
                                onChange={(e) => {
                                    selection.items.forEach(item => updateText(item.id, { fontFamily: e.target.value }));
                                }}
                                className="bg-transparent text-xs font-bold uppercase text-white outline-none cursor-pointer max-w-[100px]"
                                value={selection.items[0]?.fontFamily || activeFont.family}
                           >
                               {fontOptions.map(f => <option key={f.id} value={f.family} className="text-black">{f.name}</option>)}
                           </select>

                           <div className="h-6 w-[1px] bg-white/10 mx-1" />
                           
                           <input 
                              type="number"
                              min="10"
                              max="200"
                              value={parseInt(selection.items[0]?.fontSize || 48)}
                              onChange={(e) => selection.items.forEach(item => updateText(item.id, { fontSize: parseInt(e.target.value) }))}
                              className="w-12 bg-transparent text-xs font-bold text-center text-white border-b border-white/20 focus:border-white outline-none"
                              title="Font Size"
                           />
                           <span className="text-[10px] text-zinc-500 ml-1">px</span>

                           <div className="h-6 w-[1px] bg-white/10 mx-1" />
                           
                           {['#FFFFFF', '#000000', '#FF5B5B', '#FFFF00', '#00FFFF'].map(c => (
                               <button 
                                key={c}
                                onClick={() => selection.items.forEach(item => updateText(item.id, { color: c }))}
                                className="w-5 h-5 rounded-full border border-white/20"
                                style={{ background: c }}
                               />
                           ))}
                       </>
                   )}

                   {/* IMAGE TOOLS */}
                   {selection.type === 'image' && (
                       <>
                           <ImageIcon className="w-4 h-4 text-zinc-500 mr-2" />
                           <div className="h-6 w-[1px] bg-white/10 mx-1" />
                           
                           <button 
                                onClick={() => selection.items.forEach(item => toggleImageFrame(item.id))}
                                className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded-md transition-colors"
                           >
                               <Frame className="w-4 h-4 text-white" />
                               <span className="text-xs font-bold uppercase">{selection.items[0]?.type === 'polaroid' ? 'Frame On' : 'Frame Off'}</span>
                           </button>

                           <div className="h-6 w-[1px] bg-white/10 mx-1" />

                           <button 
                                onClick={handleAiBackgroundRemoval}
                                disabled={isProcessingAi}
                                className={`flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded-md transition-colors ${isProcessingAi ? 'opacity-50' : ''}`}
                           >
                               <Wand2 className={`w-4 h-4 ${isProcessingAi ? 'text-zinc-500 animate-spin' : 'text-fuchsia-400'}`} />
                               <span className="text-xs font-bold uppercase">{isProcessingAi ? 'Magic...' : 'AI Remove BG'}</span>
                           </button>
                       </>
                   )}

                   <div className="h-6 w-[1px] bg-white/10 mx-2" />

                   <button 
                        onClick={() => selection.items.forEach(item => removeFromBoard(item.id))}
                        className="p-2 hover:bg-red-500/20 text-red-500 rounded-full transition-colors"
                   >
                       <Trash2 className="w-4 h-4" />
                   </button>
                   
                   <button 
                        onClick={() => setSelection(null)}
                        className="ml-2 p-1 text-zinc-500 hover:text-white"
                   >
                       <X className="w-3 h-3" />
                   </button>
               </div>
          </div>
      ) : isSaving ? (
          // --- SAVING PROGRESS BAR ---
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] w-64 md:w-80">
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white animate-pulse">
                      <Download className="w-4 h-4" />
                      <span>Generating High-Res Art...</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-100 ease-linear rounded-full"
                          style={{ width: `${saveProgress}%` }}
                      />
                  </div>
              </div>
          </div>
      ) : (
          // --- DEFAULT BOTTOM DOCK ---
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex items-end gap-2 pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-1 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                  
                  <button onClick={() => { setShowTools(!showTools); setActiveToolTab('style'); }} className={`p-3 rounded-full transition-all ${showTools && activeToolTab === 'style' ? 'bg-white text-black' : 'hover:bg-white/10 text-zinc-300'}`}>
                      <Sparkles className="w-5 h-5" />
                  </button>

                  <button onClick={() => { setShowTools(!showTools); setActiveToolTab('add'); }} className={`p-3 rounded-full transition-all ${showTools && activeToolTab === 'add' ? 'bg-white text-black' : 'hover:bg-white/10 text-zinc-300'}`}>
                      <Plus className="w-5 h-5" />
                  </button>

                   <button onClick={addTextToBoard} className="p-3 rounded-full hover:bg-white/10 text-zinc-300 transition-all">
                      <Type className="w-5 h-5" />
                  </button>

                  <div className="w-[1px] h-6 bg-white/20 mx-1"></div>

                  <button 
                      onClick={() => {
                            const idx = aspectRatios.findIndex(r => r.id === activeAspectRatio.id);
                            const nextIdx = (idx + 1) % aspectRatios.length;
                            setActiveAspectRatio(aspectRatios[nextIdx]);
                       }}
                       className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                    >
                       {activeAspectRatio.icon}
                       <span className="text-[10px] font-bold uppercase hidden md:block">{activeAspectRatio.label}</span>
                  </button>
              </div>
          </div>
      )}

      {/* Tools Drawer */}
      {showTools && !selection && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[900] w-[95%] max-w-xl bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-200">
               
               {activeToolTab === 'style' && (
                   <div className="space-y-6">
                       {/* Aspect Ratio Selector */}
                       <div>
                           <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Canvas Size</div>
                           <div className="flex gap-2">
                               {aspectRatios.map(ratio => (
                                   <button 
                                      key={ratio.id} 
                                      onClick={() => setActiveAspectRatio(ratio)}
                                      className={`
                                        flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all
                                        ${activeAspectRatio.id === ratio.id ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-zinc-500 hover:text-white'}
                                      `}
                                   >
                                       {ratio.icon} {ratio.label}
                                   </button>
                               ))}
                           </div>
                       </div>

                       {/* Filters */}
                       <div>
                           <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Filters</div>
                           <div className="grid grid-cols-5 gap-2">
                               {worldFilters.map((f, i) => (
                                   <div key={f.id} onClick={() => toggleFilter(f)} className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer flex items-center justify-center relative group transition-all ${activeFilter?.id === f.id ? 'border-white scale-105' : 'border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'}`}>
                                       <div className="absolute inset-0 bg-zinc-800" style={f.style}></div>
                                       <div className="relative z-10 text-white/80 drop-shadow-md">
                                           {f.id === 'noir' && <Film className="w-5 h-5"/>}
                                           {f.id === 'analog' && <Aperture className="w-5 h-5"/>}
                                           {f.id === 'cyber' && <Zap className="w-5 h-5"/>}
                                           {f.id === 'sepia' && <Sun className="w-5 h-5"/>}
                                           {f.id === 'vogue' && <Bold className="w-5 h-5"/>}
                                           {/* Defaults for others */}
                                           {['noir','analog','cyber','sepia','vogue'].indexOf(f.id) === -1 && <Cloud className="w-5 h-5"/>}
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                       
                       {/* Canvas BG */}
                       <div>
                           <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Backgrounds</div>
                           <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                               {worldBackgrounds.map(b => (
                                   <div key={b.id} onClick={() => setActiveBackground(b)} className={`flex-shrink-0 w-12 h-12 rounded-full border-2 cursor-pointer transform transition-transform ${activeBackground.id === b.id ? 'border-white scale-110' : 'border-white/10 hover:scale-105'}`} style={b.style}></div>
                               ))}
                           </div>
                       </div>
                   </div>
               )}

               {activeToolTab === 'add' && (
                   <div className="grid grid-cols-4 gap-4">
                       <button onClick={() => { setShowSearch(true); setShowTools(false); }} className="flex flex-col items-center gap-2 text-zinc-400 hover:text-white group">
                           <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-colors"><ImageIcon className="w-6 h-6"/></div>
                           <span className="text-[10px] uppercase font-bold tracking-wider">Image</span>
                       </button>
                       <button onClick={() => { addTextToBoard(); setShowTools(false); }} className="flex flex-col items-center gap-2 text-zinc-400 hover:text-white group">
                           <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-colors"><Type className="w-6 h-6"/></div>
                           <span className="text-[10px] uppercase font-bold tracking-wider">Text</span>
                       </button>
                        <button onClick={() => { setIsPolaroid(!isPolaroid); }} className="flex flex-col items-center gap-2 text-zinc-400 hover:text-white group">
                           <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-colors"><Palette className="w-6 h-6"/></div>
                           <span className="text-[10px] uppercase font-bold tracking-wider">{isPolaroid ? 'Polaroid' : 'Raw'}</span>
                       </button>
                   </div>
               )}
          </div>
      )}

    </div>
  );
}

export default App;
