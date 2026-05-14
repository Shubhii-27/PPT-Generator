import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Trash2, Bold, Italic, Underline, Palette, Image as ImageIcon, Copy, Loader2, CheckCircle2, Settings2, Play, Sun, Moon } from 'lucide-react';
import SlideCanvas from './SlideCanvas';

const Workspace = ({ 
  presentation, 
  selectedSlideIndex, 
  setSelectedSlideIndex, 
  onUpdateSlide, 
  onAddSlide, 
  onDeleteSlide,
  onDuplicateSlide,
  onReorder,
  onUpdatePresentationTitle,
  onSave,
  onPresent,
  isSaving,
  template,
  activeElement,
  setActiveElement,
  showProperties,
  setShowProperties,
  theme,
  setTheme
}) => {
  const [showAIModal, setShowAIModal] = React.useState(false);
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [ribbonTab, setRibbonTab] = React.useState('Home');
  const currentSlide = presentation.slides[selectedSlideIndex];

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(presentation.slides);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onReorder(items);
  };

  return (
    <div className="workspace-container">
      {/* Left Thumbnail Strip */}
      <div className="slide-list">
        <div className="slide-list-header">
          <span>Slides</span>
          <div className="header-actions">
            <button className="icon-btn-sm" onClick={onAddSlide} title="Add Slide">
              <Plus size={16} />
            </button>
          </div>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="slides">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {presentation.slides.map((slide, index) => (
                  <Draggable key={slide.id} draggableId={slide.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`slide-thumbnail ${selectedSlideIndex === index ? 'active' : ''}`}
                        onClick={() => setSelectedSlideIndex(index)}
                      >
                        <span className="slide-number">{index + 1}</span>
                        <SlideCanvas 
                          slide={slide} 
                          template={template} 
                          isPreview={true} 
                          activeElement={activeElement}
                          setActiveElement={setActiveElement}
                        />
                        <button 
                          className="thumb-action-btn delete" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSlide(index);
                          }}
                          title="Delete Slide"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button 
                          className="thumb-action-btn duplicate" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateSlide(index);
                          }}
                          title="Duplicate Slide"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Main Editor */}
      <div className="editor-area">
        <header className="editor-header">
          <input 
            type="text" 
            className="presentation-title-input" 
            value={presentation.title} 
            onChange={(e) => onUpdatePresentationTitle(e.target.value)} 
            placeholder="Untitled Presentation"
          />
          <div className="editor-actions">
            <span className={`status-badge ${isSaving ? 'saving' : 'saved'}`}>
              {isSaving ? (
                <>
                  <Loader2 size={12} className="spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 size={12} />
                  Saved
                </>
              )}
            </span>
            
            <button 
              className="theme-toggle-nav" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              className="toolbar-btn secondary" 
              onClick={() => setShowProperties(!showProperties)}
              style={{ marginLeft: '12px' }}
              title="Toggle Slide Properties"
            >
              <Settings2 size={18} />
              <span>Tools</span>
            </button>
          </div>
        </header>

        <div className="toolbar">
          <div className="toolbar-group">
            <button className="toolbar-btn primary" onClick={onSave} title="Save Presentation">
              <CheckCircle2 size={18} />
              <span>Save</span>
            </button>
            <button className="toolbar-btn danger" onClick={() => onDeleteSlide(selectedSlideIndex)} title="Delete Slide">
              <Trash2 size={18} />
              <span>Delete</span>
            </button>
          </div>

          <div className="toolbar-group">
            <button className="toolbar-btn" onClick={onPresent} title="Start Slide Show">
              <Play size={18} />
              <span>Present</span>
            </button>
          </div>

          <div style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--text-muted)' }}>
            Slide {selectedSlideIndex + 1} of {presentation.slides.length}
          </div>
        </div>

        <div className="canvas-wrapper">
          <SlideCanvas 
            slide={currentSlide} 
            template={template} 
            onUpdate={(updates) => onUpdateSlide(selectedSlideIndex, updates)} 
            activeElement={activeElement}
            setActiveElement={setActiveElement}
          />
        </div>
      </div>
    </div>
  );
};

export default Workspace;
