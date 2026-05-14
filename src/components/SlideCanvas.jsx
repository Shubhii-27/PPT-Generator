import React from 'react';

const SlideCanvas = ({ slide, template, onUpdate, isPreview = false, activeElement, setActiveElement }) => {
  const defaultStyle = {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    accentColor: '#ef4444',
    fontFamily: "'Outfit', sans-serif",
    layout: 'professional'
  };
  
  const style = (template && template.style) ? template.style : defaultStyle;
  const { backgroundColor, color, accentColor, fontFamily, layout } = style;

  const handleTextChange = (field, html) => {
    if (isPreview) return;
    onUpdate({ [field]: html });
  };

  const slideStyle = {
    backgroundColor: slide.backgroundColor || backgroundColor,
    color: slide.textColor || color,
    fontFamily: slide.fontFamily || fontFamily,
    border: `1px solid ${accentColor}`,
    aspectRatio: '16 / 9',
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 
      layout === 'bold' || layout === 'wave' || layout === 'elegant' ? 'center' : 
      (layout === 'professional' || layout === 'clean' ? 'center' : 'flex-start'),
    alignItems: layout === 'bold' || layout === 'wave' || layout === 'elegant' ? 'center' : 'flex-start',
    padding: 
      layout === 'wave' ? '8% 8% 8% 25%' : 
      (layout === 'clean' ? '12% 8%' : '8%'),
    borderRadius: isPreview ? '8px' : '16px',
    boxShadow: isPreview ? 'none' : '0 10px 25px -5px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    opacity: slide.opacity !== undefined ? slide.opacity / 100 : 1,
    textAlign: slide.textAlign || (layout === 'bold' || layout === 'wave' ? 'center' : 'left')
  };

  return (
    <div className={`slide-canvas ${layout} transition-${(slide.transition || 'none').toLowerCase()}`} style={slideStyle}>
      {/* Decorative Elements based on layout */}
      {/* {layout === 'professional' && <div className="decor-line" style={{ backgroundColor: accentColor }}></div>} */}
      {layout === 'stylish' && <div className="decor-circle" style={{ borderColor: accentColor }}></div>}
      {layout === 'wave' && (
        <>
          <div className="wave-decor navy"></div>
          <div className="wave-decor orange"></div>
        </>
      )}
      {layout === 'clean' && <div className="clean-accent" style={{ backgroundColor: accentColor }}></div>}
      {layout === 'grid' && <div className="grid-decor" style={{ backgroundImage: `radial-gradient(${accentColor}33 1px, transparent 0)` }}></div>}
      {layout === 'elegant' && <div className="elegant-border" style={{ borderColor: accentColor }}></div>}
      {layout === 'organic' && (
        <>
          <div className="organic-leaf top" style={{ backgroundColor: accentColor }}></div>
          <div className="organic-leaf bottom" style={{ backgroundColor: accentColor }}></div>
        </>
      )}

      {/* Draggable & Resizable Image */}
      {slide.image && (
        <div 
          className={`slide-image-container ${activeElement === 'image' ? 'focused' : ''}`}
          data-label="Image"
          onClick={(e) => { e.stopPropagation(); setActiveElement('image'); }}
          onMouseDown={(e) => {
            if (isPreview) return;
            const startX = e.clientX;
            const startY = e.clientY;
            const initialX = slide.imageX || 10;
            const initialY = slide.imageY || 40;
            const container = e.currentTarget.parentElement;
            const containerW = container.offsetWidth;
            const containerH = container.offsetHeight;

            const handleMouseMove = (moveEvent) => {
              const dx = ((moveEvent.clientX - startX) / containerW) * 100;
              const dy = ((moveEvent.clientY - startY) / containerH) * 100;
              onUpdate({
                imageX: Math.max(0, Math.min(90, initialX + dx)),
                imageY: Math.max(0, Math.min(90, initialY + dy))
              });
            };

            const handleMouseUp = () => {
              window.removeEventListener('mousemove', handleMouseMove);
              window.removeEventListener('mouseup', handleMouseUp);
            };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
          }}
          style={{
            position: 'absolute',
            left: `${slide.imageX || 10}%`,
            top: `${slide.imageY || 40}%`,
            width: `${slide.imageW || 40}%`,
            height: `${slide.imageH || 35}%`,
            borderRadius: `${slide.imageRadius || 0}px`,
            border: slide.imageBorder ? `${slide.imageBorder}px solid ${accentColor}` : '2px dashed transparent',
            overflow: 'hidden',
            cursor: 'move',
            zIndex: slide['imageZ'] || 10
          }}
        >
          <img 
            src={slide.image} 
            alt="Slide Content" 
            className="slide-image" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: slide.imageFit || 'cover',
              display: 'block' 
            }} 
          />
          {!isPreview && (
            <>
              <button 
                className="remove-image-btn" 
                onClick={(e) => { e.stopPropagation(); onUpdate({ image: null }); }}
              >
                ×
              </button>
              {/* Resize Handle */}
              <div 
                className="resize-handle"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const initialW = slide.imageW || 40;
                  const initialH = slide.imageH || 35;
                  const container = e.currentTarget.closest('.slide-canvas');
                  const containerW = container.offsetWidth;
                  const containerH = container.offsetHeight;

                  const handleMouseMove = (moveEvent) => {
                    const dx = ((moveEvent.clientX - startX) / containerW) * 100;
                    const dy = ((moveEvent.clientY - startY) / containerH) * 100;
                    onUpdate({
                      imageW: Math.max(5, Math.min(100, initialW + dx)),
                      imageH: Math.max(5, Math.min(100, initialH + dy))
                    });
                  };

                  const handleMouseUp = () => {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                  };

                  window.addEventListener('mousemove', handleMouseMove);
                  window.addEventListener('mouseup', handleMouseUp);
                }}
              />
            </>
          )}
        </div>
      )}

      <div className="slide-content-wrapper">
        {/* Dynamic Extra Text Elements */}
        {(slide.extraText || []).map((textObj, index) => (
          <div
            key={textObj.id}
            className={`slide-extra-text ${activeElement === textObj.id ? 'focused' : ''}`}
            data-label="Text Box"
            contentEditable={!isPreview}
            onBlur={(e) => {
              const newText = [...slide.extraText];
              newText[index] = { ...newText[index], content: e.target.innerHTML };
              onUpdate({ extraText: newText });
            }}
            onClick={(e) => { e.stopPropagation(); setActiveElement(textObj.id); }}
            onMouseDown={(e) => {
              if (isPreview || e.target !== e.currentTarget) return;
              const startX = e.clientX;
              const startY = e.clientY;
              const initialX = textObj.x;
              const initialY = textObj.y;
              const container = e.currentTarget.closest('.slide-canvas');
              const containerW = container.offsetWidth;
              const containerH = container.offsetHeight;

              const handleMouseMove = (moveEvent) => {
                const dx = ((moveEvent.clientX - startX) / containerW) * 100;
                const dy = ((moveEvent.clientY - startY) / containerH) * 100;
                const newText = [...slide.extraText];
                newText[index] = { ...newText[index], x: initialX + dx, y: initialY + dy };
                onUpdate({ extraText: newText });
              };

              const handleMouseUp = () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };

              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
            style={{
              position: 'absolute',
              left: `${textObj.x}%`,
              top: `${textObj.y}%`,
              fontSize: `${textObj.fontSize || 24}px`,
              color: textObj.color || 'inherit',
              cursor: 'move',
              zIndex: slide[textObj.id + 'Z'] || 15,
              padding: '8px',
              minWidth: '100px',
              outline: 'none',
              whiteSpace: 'pre-wrap',
              textShadow: slide.textShadow ? '1px 1px 2px rgba(0,0,0,0.2)' : 'none',
              textTransform: slide.textTransform || 'none'
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: textObj.content }} />
            {!isPreview && activeElement === textObj.id && (
              <button 
                className="remove-image-btn" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onUpdate({ extraText: (slide.extraText || []).filter((_, i) => i !== index) }); 
                  setActiveElement(null);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}

        {/* Dynamic Extra Images */}
        {(slide.extraImages || []).map((imgObj, index) => (
          <div
            key={imgObj.id}
            className={`slide-extra-image ${activeElement === imgObj.id ? 'focused' : ''}`}
            data-label="Image"
            onClick={(e) => { e.stopPropagation(); setActiveElement(imgObj.id); }}
            onMouseDown={(e) => {
              if (isPreview) return;
              const startX = e.clientX;
              const startY = e.clientY;
              const initialX = imgObj.x;
              const initialY = imgObj.y;
              const container = e.currentTarget.closest('.slide-canvas');
              const containerW = container.offsetWidth;
              const containerH = container.offsetHeight;

              const handleMouseMove = (moveEvent) => {
                const dx = ((moveEvent.clientX - startX) / containerW) * 100;
                const dy = ((moveEvent.clientY - startY) / containerH) * 100;
                const newImgs = [...slide.extraImages];
                newImgs[index] = { ...newImgs[index], x: initialX + dx, y: initialY + dy };
                onUpdate({ extraImages: newImgs });
              };

              const handleMouseUp = () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };

              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
            style={{
              position: 'absolute',
              left: `${imgObj.x}%`,
              top: `${imgObj.y}%`,
              width: `${imgObj.width}%`,
              height: `${imgObj.height}%`,
              cursor: 'move',
              zIndex: 12,
              borderRadius: '8px',
              overflow: 'hidden',
              border: activeElement === imgObj.id ? '2px solid var(--primary)' : 'none'
            }}
          >
            <img src={imgObj.url} alt="Extra" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {!isPreview && (
              <>
                <button 
                  className="remove-image-btn" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onUpdate({ extraImages: slide.extraImages.filter((_, i) => i !== index) }); 
                  }}
                >
                  ×
                </button>
                <div 
                  className="resize-handle"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const initialW = imgObj.width;
                    const initialH = imgObj.height;
                    const container = e.currentTarget.closest('.slide-canvas');
                    const containerW = container.offsetWidth;
                    const containerH = container.offsetHeight;
                    const handleMouseMove = (mv) => {
                      const dx = ((mv.clientX - startX) / containerW) * 100;
                      const dy = ((mv.clientY - startY) / containerH) * 100;
                      const newImgs = [...slide.extraImages];
                      newImgs[index] = { ...newImgs[index], width: Math.max(5, initialW + dx), height: Math.max(5, initialH + dy) };
                      onUpdate({ extraImages: newImgs });
                    };
                    const handleMouseUp = () => {
                      window.removeEventListener('mousemove', handleMouseMove);
                      window.removeEventListener('mouseup', handleMouseUp);
                    };
                    window.addEventListener('mousemove', handleMouseMove);
                    window.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              </>
            )}
          </div>
        ))}
        {/* Draggable Shapes */}
        {(slide.shapes || []).map((shape, index) => (
          <div
            key={shape.id}
            className={`slide-shape ${activeElement === shape.id ? 'focused' : ''}`}
            data-label={shape.type}
            onClick={(e) => { e.stopPropagation(); setActiveElement(shape.id); }}
            onMouseDown={(e) => {
              if (isPreview) return;
              const startX = e.clientX;
              const startY = e.clientY;
              const initialX = shape.x;
              const initialY = shape.y;
              const container = e.currentTarget.parentElement;
              const containerW = container.offsetWidth;
              const containerH = container.offsetHeight;

              const handleMouseMove = (moveEvent) => {
                const dx = ((moveEvent.clientX - startX) / containerW) * 100;
                const dy = ((moveEvent.clientY - startY) / containerH) * 100;
                const newShapes = [...slide.shapes];
                newShapes[index] = { ...newShapes[index], x: initialX + dx, y: initialY + dy };
                onUpdate({ shapes: newShapes });
              };

              const handleMouseUp = () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };

              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
            style={{
              position: 'absolute',
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.width}%`,
              height: `${shape.height}%`,
              backgroundColor: shape.color || accentColor,
              backgroundImage: shape.imageUrl ? `url(${shape.imageUrl})` : 'none',
              backgroundSize: 'cover',
              borderRadius: shape.type === 'circle' ? '50%' : `${shape.borderRadius || 0}px`,
              border: `${shape.borderWidth || 0}px solid ${shape.borderColor || '#000000'}`,
              zIndex: slide[shape.id + 'Z'] || 11,
              outline: activeElement === shape.id ? '2px solid var(--primary)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundImage: shape.imageUrl ? `url(${shape.imageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: shape.textColor || '#ffffff',
              fontSize: `${shape.fontSize || 14}px`,
              fontWeight: '600',
              textAlign: 'center',
              clipPath: shape.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : (shape.type === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none')
            }}
          >
            {shape.text}
            {!isPreview && (
              <>
                <button 
                  className="remove-image-btn" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onUpdate({ shapes: slide.shapes.filter((_, i) => i !== index) }); 
                  }}
                >
                  ×
                </button>
                <div 
                  className="resize-handle"
                  style={{ bottom: '2px', right: '2px' }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const initialW = shape.width;
                    const initialH = shape.height;
                    const container = e.currentTarget.closest('.slide-canvas');
                    const containerW = container.offsetWidth;
                    const containerH = container.offsetHeight;
                    const handleMouseMove = (mv) => {
                      const dx = ((mv.clientX - startX) / containerW) * 100;
                      const dy = ((mv.clientY - startY) / containerH) * 100;
                      const newShapes = [...slide.shapes];
                      newShapes[index] = { ...newShapes[index], width: Math.max(5, initialW + dx), height: Math.max(5, initialH + dy) };
                      onUpdate({ shapes: newShapes });
                    };
                    const handleMouseUp = () => {
                      window.removeEventListener('mousemove', handleMouseMove);
                      window.removeEventListener('mouseup', handleMouseUp);
                    };
                    window.addEventListener('mousemove', handleMouseMove);
                    window.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              </>
            )}
          </div>
        ))}
        <div
          className={`slide-title ${activeElement === 'title' ? 'focused' : ''}`}
          data-label="Title"
          contentEditable={!isPreview}
          placeholder="Enter Title"
          dangerouslySetInnerHTML={{ __html: slide.title }}
          onBlur={(e) => handleTextChange('title', e.target.innerHTML)}
          onFocus={() => setActiveElement('title')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              document.execCommand('insertLineBreak');
            }
          }}
          style={{ 
            color: 'inherit',
            fontSize: isPreview ? '1.5em' : `${(slide.fontSize || 56) / 14}em`,
            marginBottom: '0.5em',
            width: '100%',
            lineHeight: slide.lineHeight || 1.2,
            letterSpacing: `${slide.letterSpacing || 0}px`,
            textTransform: slide.textTransform || 'none',
            textAlign: slide.textAlign || 'inherit',
            textShadow: slide.textShadow ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none',
            outline: 'none',
            whiteSpace: 'pre-wrap',
            zIndex: slide['titleZ'] || 1
          }}
        />
        
        <div
          className={`slide-subtitle ${activeElement === 'subtitle' ? 'focused' : ''}`}
          data-label="Subtitle"
          contentEditable={!isPreview}
          placeholder="Enter Subtitle"
          dangerouslySetInnerHTML={{ __html: slide.subtitle }}
          onBlur={(e) => handleTextChange('subtitle', e.target.innerHTML)}
          onFocus={() => setActiveElement('subtitle')}
          style={{ 
            color: slide.textColor || accentColor,
            fontSize: isPreview ? '0.8em' : '1.5em',
            marginBottom: '1em',
            width: '100%',
            lineHeight: slide.lineHeight || 1.2,
            letterSpacing: `${slide.letterSpacing || 0}px`,
            textTransform: slide.textTransform || 'none',
            textAlign: slide.textAlign || 'inherit',
            outline: 'none',
            whiteSpace: 'pre-wrap'
          }}
        />

        <div
          className={`slide-body ${activeElement === 'content' ? 'focused' : ''}`}
          data-label="Body Content"
          contentEditable={!isPreview}
          placeholder="Enter content here..."
          dangerouslySetInnerHTML={{ __html: slide.content }}
          onBlur={(e) => handleTextChange('content', e.target.innerHTML)}
          onFocus={() => setActiveElement('content')}
          style={{ 
            color: 'inherit',
            fontSize: isPreview ? '0.6em' : '1.1em',
            opacity: 0.8,
            flex: 1,
            width: '100%',
            lineHeight: slide.lineHeight || 1.6,
            letterSpacing: `${slide.letterSpacing || 0}px`,
            textTransform: slide.textTransform || 'none',
            textAlign: slide.textAlign || 'inherit',
            outline: 'none',
            whiteSpace: 'pre-wrap'
          }}
        />
      </div>
    </div>
  );
};

export default SlideCanvas;
