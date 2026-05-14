import React, { useState } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, Palette, Layers, Settings2, Image, Plus, Minus, ChevronDown, Droplets, Grid, Move, Play, Wand2, MousePointer2, Trash2, List, ArrowUp, ArrowDown, Type as CaseIcon, Maximize2, Square, Circle, Triangle, Star } from 'lucide-react';

const PropertiesPanel = ({ slide, onUpdate, template, activeElement, setActiveElement, isActive, setIsActive }) => {
  const [activeTab, setActiveTab] = useState('home');

  if (!slide) return null;

  const tabs = [
    { id: 'home', label: 'Home', icon: <MousePointer2 size={16} /> },
    { id: 'insert', label: 'Insert', icon: <Plus size={16} /> },
    { id: 'design', label: 'Design', icon: <Palette size={16} /> },
    { id: 'transitions', label: 'Transitions', icon: <Move size={16} /> },
    { id: 'layers', label: 'Layers', icon: <Layers size={16} /> },
  ];

  const handleFontSizeChange = (delta) => {
    const currentSize = slide.fontSize || 56;
    const newSize = Math.max(8, currentSize + delta);
    document.execCommand('styleWithCSS', false, true);
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().length > 0) {
      const span = document.createElement('span');
      span.style.fontSize = `${newSize}px`;
      const range = selection.getRangeAt(0);
      range.surroundContents(span);
    } else {
      onUpdate({ fontSize: newSize });
    }
  };

  return (
    <aside className={`properties-panel ${isActive ? 'active' : ''}`}>
      <div className="mobile-panel-header">
        <button className="panel-close-btn" onClick={() => setIsActive(false)}>
          <ChevronDown size={24} />
        </button>
      </div>
      <div className="panel-tabs">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="panel-content">
        {activeTab === 'home' && (
          <>
            <div className="control-card">
              <div className="card-title">Typography</div>
              <select 
                className="font-family-select" 
                value={slide.fontFamily || template.style.fontFamily} 
                onChange={(e) => onUpdate({ fontFamily: e.target.value })}
              >
                <option value="'Outfit', sans-serif">Outfit (Default)</option>
                <option value="'Inter', sans-serif">Inter</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Playfair Display', serif">Playfair</option>
                <option value="'Fira Code', monospace">Fira Code</option>
              </select>

              <div className="font-size-stepper">
                <button className="stepper-btn" title="Decrease Font Size" onMouseDown={(e) => { e.preventDefault(); handleFontSizeChange(-2); }}><Minus size={16} /></button>
                <input type="number" className="stepper-input" value={slide.fontSize || 56} onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) || 56 })} />
                <button className="stepper-btn" title="Increase Font Size" onMouseDown={(e) => { e.preventDefault(); handleFontSizeChange(2); }}><Plus size={16} /></button>
              </div>

              <div className="format-pill-group">
                <button className="format-pill" title="Bold" onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold'); }}><Bold size={18} /></button>
                <button className="format-pill" title="Italic" onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic'); }}><Italic size={18} /></button>
                <button className="format-pill" title="Underline" onMouseDown={(e) => { e.preventDefault(); document.execCommand('underline'); }}><Underline size={18} /></button>
                <button className="format-pill" title="Bullet List" onMouseDown={(e) => { e.preventDefault(); document.execCommand('insertUnorderedList'); }}><List size={18} /></button>
                <div className="color-swatch-large" title="Text Color" style={{ width: '40px', height: '40px', marginLeft: 'auto' }}>
                  <input type="color" title="Pick Color" value={slide.textColor || template.style.color || '#000000'} onInput={(e) => {
                    document.execCommand('styleWithCSS', false, true);
                    document.execCommand('foreColor', false, e.target.value);
                    onUpdate({ textColor: e.target.value });
                  }} />
                  <div style={{ width: '100%', height: '100%', backgroundColor: slide.textColor || template.style.color || '#000000' }} />
                </div>
              </div>

              <div className="slider-group" style={{ marginTop: '16px' }}>
                <div className="slider-header"><span>Line Height</span><span>{slide.lineHeight || 1.2}</span></div>
                <input type="range" className="modern-slider" min="1" max="3" step="0.1" value={slide.lineHeight || 1.2} onChange={(e) => onUpdate({ lineHeight: parseFloat(e.target.value) })} />
              </div>

              <div className="slider-group">
                <div className="slider-header"><span>Letter Spacing</span><span>{slide.letterSpacing || 0}px</span></div>
                <input type="range" className="modern-slider" min="-2" max="10" step="0.5" value={slide.letterSpacing || 0} onChange={(e) => onUpdate({ letterSpacing: parseFloat(e.target.value) })} />
              </div>

              <div className="toggle-group" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button className={`btn-secondary-sm ${slide.textShadow ? 'active' : ''}`} onClick={() => onUpdate({ textShadow: !slide.textShadow })}>
                  <Wand2 size={14} style={{ marginRight: '6px' }} /> Shadow
                </button>
                <button className={`btn-secondary-sm ${slide.textTransform === 'uppercase' ? 'active' : ''}`} onClick={() => onUpdate({ textTransform: slide.textTransform === 'uppercase' ? 'none' : 'uppercase' })}>
                  <CaseIcon size={14} style={{ marginRight: '6px' }} /> Uppercase
                </button>
              </div>
            </div>

            <div className="control-card">
              <div className="card-title">Alignment</div>
              <div className="format-pill-group">
                <button className={`format-pill ${slide.textAlign === 'left' ? 'active' : ''}`} title="Align Left" onClick={() => onUpdate({ textAlign: 'left' })}><AlignLeft size={18} /></button>
                <button className={`format-pill ${slide.textAlign === 'center' ? 'active' : ''}`} title="Align Center" onClick={() => onUpdate({ textAlign: 'center' })}><AlignCenter size={18} /></button>
                <button className={`format-pill ${slide.textAlign === 'right' ? 'active' : ''}`} title="Align Right" onClick={() => onUpdate({ textAlign: 'right' })}><AlignRight size={18} /></button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'insert' && (
          <>
            <div className="control-card">
              <div className="card-title">Pictures</div>
              <label htmlFor="prop-image-input-multi" className="upload-zone">
                <Image size={24} />
                <span>Add Picture</span>
              </label>
              <input id="prop-image-input-multi" type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const newImg = {
                      id: `img-${Date.now()}`,
                      url: reader.result,
                      x: 30,
                      y: 30,
                      width: 30,
                      height: 30
                    };
                    onUpdate({ extraImages: [...(slide.extraImages || []), newImg] });
                  };
                  reader.readAsDataURL(file);
                }
              }} />
            </div>

            <div className="control-card">
              <div className="card-title">Insert Elements</div>
              <div className="button-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button className="tool-insert-btn" title="Add Text" onClick={() => {
                  const newText = { id: `text-${Date.now()}`, content: 'Double click to edit', x: 40, y: 40, fontSize: 24, color: '#000000', titleZ: 20 };
                  onUpdate({ extraText: [...(slide.extraText || []), newText] });
                }}>
                  <Type size={16} /><span className="tool-label">Text</span>
                </button>
                <button className="tool-insert-btn" title="Add Square" onClick={() => {
                  const newShape = { id: `shape-${Date.now()}`, type: 'square', x: 20, y: 20, width: 20, height: 20, color: template.style.accentColor, borderRadius: 8 };
                  onUpdate({ shapes: [...(slide.shapes || []), newShape] });
                }}>
                  <Square size={16} /><span className="tool-label">Square</span>
                </button>
                <button className="tool-insert-btn" title="Add Circle" onClick={() => {
                  const newShape = { id: `shape-${Date.now()}`, type: 'circle', x: 30, y: 30, width: 20, height: 20, color: template.style.accentColor };
                  onUpdate({ shapes: [...(slide.shapes || []), newShape] });
                }}>
                  <Circle size={16} /><span className="tool-label">Circle</span>
                </button>
                <button className="tool-insert-btn" title="Add Triangle" onClick={() => {
                  const newShape = { id: `shape-${Date.now()}`, type: 'triangle', x: 40, y: 40, width: 20, height: 20, color: template.style.accentColor };
                  onUpdate({ shapes: [...(slide.shapes || []), newShape] });
                }}>
                  <Triangle size={16} /><span className="tool-label">Triangle</span>
                </button>
                <button className="tool-insert-btn" title="Add Star" onClick={() => {
                  const newShape = { id: `shape-${Date.now()}`, type: 'star', x: 50, y: 50, width: 20, height: 20, color: template.style.accentColor };
                  onUpdate({ shapes: [...(slide.shapes || []), newShape] });
                }}>
                  <Star size={16} /><span className="tool-label">Star</span>
                </button>
                <button className="tool-insert-btn" title="Add Image" onClick={() => document.getElementById('extra-image-upload').click()}>
                  <Image size={16} /><span className="tool-label">Image</span>
                  <input id="extra-image-upload" type="file" hidden accept="image/*" onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const newImg = { id: `img-${Date.now()}`, url: reader.result, x: 25, y: 25, width: 30, height: 30 };
                        onUpdate({ extraImages: [...(slide.extraImages || []), newImg] });
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
                </button>
              </div>
            </div>

            {slide.image && (
              <div className="control-card">
                <div className="card-title">Image Styling</div>
                <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div className="input-with-label">
                    <label style={{ fontSize: '0.65rem' }}>Width (%)</label>
                    <input type="number" value={slide.imageW || 40} onChange={(e) => onUpdate({ imageW: parseInt(e.target.value) })} />
                  </div>
                  <div className="input-with-label">
                    <label style={{ fontSize: '0.65rem' }}>Height (%)</label>
                    <input type="number" value={slide.imageH || 35} onChange={(e) => onUpdate({ imageH: parseInt(e.target.value) })} />
                  </div>
                </div>
                <div className="slider-group">
                  <div className="slider-header"><span>Radius</span><span>{slide.imageRadius || 0}px</span></div>
                  <input type="range" className="modern-slider" min="0" max="100" value={slide.imageRadius || 0} onChange={(e) => onUpdate({ imageRadius: parseInt(e.target.value) })} />
                </div>
                <div className="control-card" style={{ padding: '0', border: 'none', background: 'transparent' }}>
                  <div className="card-title" style={{ fontSize: '0.7rem', marginBottom: '8px' }}>Fitting Mode</div>
                  <div className="format-pill-group">
                    <button className={`format-pill ${(!slide.imageFit || slide.imageFit === 'cover') ? 'active' : ''}`} onClick={() => onUpdate({ imageFit: 'cover' })}>Cover</button>
                    <button className={`format-pill ${slide.imageFit === 'contain' ? 'active' : ''}`} onClick={() => onUpdate({ imageFit: 'contain' })}>Contain</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'design' && (
          <>
            <div className="control-card">
              <div className="card-title">Slide Background</div>
              <div className="input-group-row" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div className="color-swatch-large" style={{ flex: '0 0 48px', height: '48px' }}>
                  <input type="color" value={slide.backgroundColor || '#ffffff'} onChange={(e) => onUpdate({ backgroundColor: e.target.value })} />
                  <div style={{ width: '100%', height: '100%', backgroundColor: slide.backgroundColor || '#ffffff', borderRadius: '12px', border: '1px solid var(--border)' }} />
                </div>
                <div className="hex-input-group" style={{ flex: 1 }}>
                  <span>#</span>
                  <input className="hex-input-field" type="text" value={(slide.backgroundColor || '#ffffff').replace('#', '').toUpperCase()} onChange={(e) => onUpdate({ backgroundColor: '#' + e.target.value })} />
                </div>
              </div>
              <div className="color-palette-grid" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['#ffffff', '#f8fafc', '#1e293b', '#7c3aed', '#f43f5e', '#10b981', '#fbbf24', '#000000'].map(color => (
                  <div key={color} onClick={() => onUpdate({ backgroundColor: color })} className={`palette-color ${slide.backgroundColor === color ? 'active' : ''}`} style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
            
            <div className="control-card">
              <div className="card-title">Slide Opacity</div>
              <input type="range" className="modern-slider" min="0" max="100" value={slide.opacity || 100} onChange={(e) => onUpdate({ opacity: parseInt(e.target.value) })} />
            </div>
          </>
        )}

        {activeTab === 'transitions' && (
          <div className="control-card">
            <div className="card-title">Transitions</div>
            <div className="layers-list">
              {['None', 'Fade', 'Slide', 'Zoom', 'Dissolve'].map(effect => (
                <div key={effect} className={`layer-item ${slide.transition === effect ? 'active' : ''}`} onClick={() => onUpdate({ transition: effect })}>
                  <Play size={14} className="layer-icon" />
                  <span className="layer-label">{effect}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="layers-view">
            <div className="card-title" style={{ marginBottom: '16px' }}>Canvas Layers</div>
            <div className="layers-list">
              {[
                { id: 'title', label: 'Title' },
                { id: 'subtitle', label: 'Subtitle' },
                { id: 'content', label: 'Content' },
                ...(slide.image ? [{ id: 'image', label: 'Main Image' }] : []),
                ...(slide.shapes || []).map(s => ({ id: s.id, label: `Shape (${s.type})` })),
                ...(slide.extraImages || []).map(i => ({ id: i.id, label: 'Image Layer' })),
                ...(slide.extraText || []).map(t => ({ id: t.id, label: 'Text Layer' }))
              ].map(layer => (
                <div key={layer.id} className={`layer-item ${activeElement === layer.id ? 'active' : ''}`} onClick={() => setActiveElement(layer.id)}>
                  <Layers size={14} className="layer-icon" />
                  <span className="layer-label">{layer.label}</span>
                  {activeElement === layer.id && (
                    <div className="layer-actions" style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                      <button className="layer-action-btn" title="Send to Back" onClick={(e) => { e.stopPropagation(); onUpdate({ [activeElement + 'Z']: (slide[activeElement + 'Z'] || 10) - 1 }); }}><ArrowDown size={12} /></button>
                      <button className="layer-action-btn" title="Bring to Front" onClick={(e) => { e.stopPropagation(); onUpdate({ [activeElement + 'Z']: (slide[activeElement + 'Z'] || 10) + 1 }); }}><ArrowUp size={12} /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeElement && activeElement.startsWith('shape-') && (
          <div className="control-card" style={{ marginTop: '20px', borderTop: '2px solid var(--primary)', paddingTop: '20px' }}>
            <div className="card-title">Shape Content</div>
            <div className="input-with-label">
              <label>Text Inside</label>
              <input 
                type="text" 
                value={slide.shapes.find(s => s.id === activeElement)?.text || ''} 
                onChange={(e) => {
                  const newShapes = [...slide.shapes];
                  const idx = newShapes.findIndex(s => s.id === activeElement);
                  newShapes[idx] = { ...newShapes[idx], text: e.target.value };
                  onUpdate({ shapes: newShapes });
                }}
                placeholder="Type here..."
              />
            </div>
            
            <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
              <div className="input-with-label">
                <label>Text Color</label>
                <input 
                  type="color" 
                  value={slide.shapes.find(s => s.id === activeElement)?.textColor || '#ffffff'} 
                  onChange={(e) => {
                    const newShapes = [...slide.shapes];
                    const idx = newShapes.findIndex(s => s.id === activeElement);
                    newShapes[idx] = { ...newShapes[idx], textColor: e.target.value };
                    onUpdate({ shapes: newShapes });
                  }}
                />
              </div>
              <div className="input-with-label">
                <label>Font Size</label>
                <input 
                  type="number" 
                  value={slide.shapes.find(s => s.id === activeElement)?.fontSize || 14} 
                  onChange={(e) => {
                    const newShapes = [...slide.shapes];
                    const idx = newShapes.findIndex(s => s.id === activeElement);
                    newShapes[idx] = { ...newShapes[idx], fontSize: parseInt(e.target.value) };
                    onUpdate({ shapes: newShapes });
                  }}
                />
              </div>
            </div>

            <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
              <div className="input-with-label">
                <label>Shape Color</label>
                <input 
                  type="color" 
                  value={slide.shapes.find(s => s.id === activeElement)?.color || '#1e40af'} 
                  onChange={(e) => {
                    const newShapes = [...slide.shapes];
                    const idx = newShapes.findIndex(s => s.id === activeElement);
                    newShapes[idx] = { ...newShapes[idx], color: e.target.value };
                    onUpdate({ shapes: newShapes });
                  }}
                />
              </div>
              <div className="input-with-label">
                <label>Border Color</label>
                <input 
                  type="color" 
                  value={slide.shapes.find(s => s.id === activeElement)?.borderColor || '#000000'} 
                  onChange={(e) => {
                    const newShapes = [...slide.shapes];
                    const idx = newShapes.findIndex(s => s.id === activeElement);
                    newShapes[idx] = { ...newShapes[idx], borderColor: e.target.value };
                    onUpdate({ shapes: newShapes });
                  }}
                />
              </div>
            </div>

            <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
              <div className="input-with-label">
                <label>Border (px)</label>
                <input 
                  type="number" 
                  value={slide.shapes.find(s => s.id === activeElement)?.borderWidth || 0} 
                  onChange={(e) => {
                    const newShapes = [...slide.shapes];
                    const idx = newShapes.findIndex(s => s.id === activeElement);
                    newShapes[idx] = { ...newShapes[idx], borderWidth: parseInt(e.target.value) };
                    onUpdate({ shapes: newShapes });
                  }}
                />
              </div>
              <div className="input-with-label">
                <label>Radius</label>
                <input 
                  type="number" 
                  value={slide.shapes.find(s => s.id === activeElement)?.borderRadius || 0} 
                  onChange={(e) => {
                    const newShapes = [...slide.shapes];
                    const idx = newShapes.findIndex(s => s.id === activeElement);
                    newShapes[idx] = { ...newShapes[idx], borderRadius: parseInt(e.target.value) };
                    onUpdate({ shapes: newShapes });
                  }}
                />
              </div>
            </div>

            <label className="upload-zone" style={{ marginTop: '16px' }}>
              <Image size={20} />
              <span>Image Background</span>
              <input type="file" hidden accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const newShapes = [...slide.shapes];
                    const idx = newShapes.findIndex(s => s.id === activeElement);
                    newShapes[idx] = { ...newShapes[idx], imageUrl: reader.result };
                    onUpdate({ shapes: newShapes });
                  };
                  reader.readAsDataURL(file);
                }
              }} />
            </label>
          </div>
        )}

        {activeElement && (activeElement === 'image' || activeElement.startsWith('img-') || activeElement.startsWith('shape-')) && (
          <div className="control-card">
            <div className="card-title">Element Dimensions</div>
            <div className="grid-2col">
              <div className="input-with-label">
                <label>Width (%)</label>
                <input 
                  type="number" 
                  value={
                    activeElement === 'image' ? (slide.imageW || 40) : 
                    (activeElement.startsWith('img-') ? (slide.extraImages.find(i => i.id === activeElement)?.width || 30) : 
                    (slide.shapes.find(s => s.id === activeElement)?.width || 20))
                  } 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (activeElement === 'image') onUpdate({ imageW: val });
                    else if (activeElement.startsWith('img-')) {
                      const newImgs = [...slide.extraImages];
                      const idx = newImgs.findIndex(i => i.id === activeElement);
                      newImgs[idx] = { ...newImgs[idx], width: val };
                      onUpdate({ extraImages: newImgs });
                    } else {
                      const newShapes = [...slide.shapes];
                      const idx = newShapes.findIndex(s => s.id === activeElement);
                      newShapes[idx] = { ...newShapes[idx], width: val };
                      onUpdate({ shapes: newShapes });
                    }
                  }} 
                />
              </div>
              <div className="input-with-label">
                <label>Height (%)</label>
                <input 
                  type="number" 
                  value={
                    activeElement === 'image' ? (slide.imageH || 35) : 
                    (activeElement.startsWith('img-') ? (slide.extraImages.find(i => i.id === activeElement)?.height || 30) : 
                    (slide.shapes.find(s => s.id === activeElement)?.height || 20))
                  } 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (activeElement === 'image') onUpdate({ imageH: val });
                    else if (activeElement.startsWith('img-')) {
                      const newImgs = [...slide.extraImages];
                      const idx = newImgs.findIndex(i => i.id === activeElement);
                      newImgs[idx] = { ...newImgs[idx], height: val };
                      onUpdate({ extraImages: newImgs });
                    } else {
                      const newShapes = [...slide.shapes];
                      const idx = newShapes.findIndex(s => s.id === activeElement);
                      newShapes[idx] = { ...newShapes[idx], height: val };
                      onUpdate({ shapes: newShapes });
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        )}

        {activeElement && (activeElement.startsWith('shape-') || activeElement.startsWith('text-') || activeElement.startsWith('img-')) && (
          <div className="control-card" style={{ marginTop: '10px', borderTop: '2px solid #fee2e2', paddingTop: '10px' }}>
            <button 
              className="toolbar-btn danger" 
              style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
              onClick={() => {
                if (activeElement.startsWith('shape-')) {
                  onUpdate({ shapes: slide.shapes.filter(s => s.id !== activeElement) });
                } else if (activeElement.startsWith('text-')) {
                  onUpdate({ extraText: slide.extraText.filter(t => t.id !== activeElement) });
                } else if (activeElement.startsWith('img-')) {
                  onUpdate({ extraImages: slide.extraImages.filter(i => i.id !== activeElement) });
                }
                setActiveElement(null);
              }}
            >
              <Trash2 size={16} /> Delete Selected Element
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default PropertiesPanel;
