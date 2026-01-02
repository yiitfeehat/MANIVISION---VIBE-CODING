import React, { useState, useEffect, useRef } from 'react';

const TextCard = ({ textNode, onUpdateText, style, forceEditing, onEditEnd }) => {
  const contentRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  // Sync with external forceEditing prop
  useEffect(() => {
    if (forceEditing) {
        setIsEditing(true);
    }
  }, [forceEditing]);

  useEffect(() => {
    if (isEditing && contentRef.current) {
        contentRef.current.focus();
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(contentRef.current);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
  }, [isEditing]);

  const handleBlur = (e) => {
    setIsEditing(false);
    if (onEditEnd) onEditEnd(); // Notify parent
    if (onUpdateText) {
       // innerText kullanarak metni alıyoruz
       onUpdateText(textNode.id, { content: e.target.innerText });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        contentRef.current.blur();
    }
  };

  return (
    <div 
      className={`w-full h-full flex items-center justify-center ${isEditing ? 'cursor-text' : 'cursor-move'}`}
      style={style}
      onDoubleClick={(e) => {
          e.stopPropagation(); 
          setIsEditing(true);
      }}
      onMouseDown={(e) => {
          if (isEditing) e.stopPropagation();
      }}
      onTouchStart={(e) => {
          if (isEditing) e.stopPropagation();
      }}
    >
      <div
        ref={contentRef}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`outline-none min-w-[50px] text-center w-full h-full flex items-center justify-center bg-transparent leading-tight ${isEditing ? 'cursor-text' : 'cursor-inherit select-none'}`}
        style={{
            fontFamily: textNode.fontFamily,
            color: textNode.color || 'white',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            fontSize: `${textNode.fontSize || 48}px`, 
            lineHeight: 1.2
        }}
      >
        {/* DÜZELTME: İçerik buraya taşındı */}
        {textNode.content}
      </div>
    </div>
  );
};

export default TextCard;