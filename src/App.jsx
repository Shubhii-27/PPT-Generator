import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import TemplateGallery from './components/TemplateGallery';
import MyPresentations from './components/MyPresentations';
import PropertiesPanel from './components/PropertiesPanel';
import ExportMenu from './components/ExportMenu';
import SlideCanvas from './components/SlideCanvas';
import './App.css';

const TEMPLATES = {
  corporate: {
    name: 'Corporate',
    style: {
      backgroundColor: '#ffffff',
      color: '#0f172a',
      accentColor: '#ef4444',
      fontFamily: "'Outfit', sans-serif",
      layout: 'professional'
    }
  },
  startup: {
    name: 'Startup Pitch',
    style: {
      backgroundColor: '#0f172a',
      color: '#ffffff',
      accentColor: '#ef4444',
      fontFamily: "'Outfit', sans-serif",
      layout: 'bold'
    }
  },
  education: {
    name: 'Education',
    style: {
      backgroundColor: '#f0fdf4',
      color: '#14532d',
      accentColor: '#22c55e',
      fontFamily: "'Outfit', sans-serif",
      layout: 'readable'
    }
  },
  creative: {
    name: 'Creative Portfolio',
    style: {
      backgroundColor: '#faf5ff',
      color: '#581c87',
      accentColor: '#a855f7',
      fontFamily: "'Outfit', sans-serif",
      layout: 'stylish'
    }
  },
  report: {
    name: 'Data Report',
    style: {
      backgroundColor: '#f8fafc',
      color: '#334155',
      accentColor: '#64748b',
      fontFamily: "'Outfit', sans-serif",
      layout: 'structured'
    }
  },
  modernWave: {
    name: 'Modern Wave',
    style: {
      backgroundColor: '#ffffff',
      color: '#0f172a',
      accentColor: '#f59e0b',
      fontFamily: "'Outfit', sans-serif",
      layout: 'wave'
    }
  },
  minimalist: {
    name: 'Minimalist Clean',
    style: {
      backgroundColor: '#ffffff',
      color: '#18181b',
      accentColor: '#000000',
      fontFamily: "'Inter', sans-serif",
      layout: 'clean'
    }
  },
  techDark: {
    name: 'Tech Dark',
    style: {
      backgroundColor: '#020617',
      color: '#f8fafc',
      accentColor: '#f87171',
      fontFamily: "'Fira Code', monospace",
      layout: 'grid'
    }
  },
  luxury: {
    name: 'Luxury Gold',
    style: {
      backgroundColor: '#0c0a09',
      color: '#fafaf9',
      accentColor: '#d4af37',
      fontFamily: "'Playfair Display', serif",
      layout: 'elegant'
    }
  },
  eco: {
    name: 'Eco Green',
    style: {
      backgroundColor: '#f7fee7',
      color: '#064e3b',
      accentColor: '#65a30d',
      fontFamily: "'Outfit', sans-serif",
      layout: 'organic'
    }
  }
};

const DEFAULT_SLIDE = {
  id: 'slide-1',
  title: 'Welcome to My Presentation',
  subtitle: 'Click to edit this subtitle',
  content: 'Add your points here...',
  image: null,
  backgroundColor: '',
  textColor: '',
  fontSize: 56,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  textAlign: 'left',
  shapes: [],
  extraText: [],
  extraImages: []
};

function App() {
  const [activeTab, setActiveTab] = useState('new'); // new, my, templates, export
  const [currentPresentation, setCurrentPresentation] = useState({
    id: Date.now(),
    title: 'Untitled Presentation',
    template: 'corporate',
    slides: [{ ...DEFAULT_SLIDE }]
  });
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [savedPresentations, setSavedPresentations] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeElement, setActiveElement] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('ppt_generator_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ppt_generator_theme', theme);
  }, [theme]);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showProperties, setShowProperties] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'rename'
  const [presentationToRename, setPresentationToRename] = useState(null);
  const [isPresenting, setIsPresenting] = useState(false);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPresenting) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setSelectedSlideIndex(prev => Math.min(currentPresentation.slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setSelectedSlideIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        setIsPresenting(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresenting, currentPresentation.slides.length]);


  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('ppt_generator_presentations');
    const lastActiveId = localStorage.getItem('ppt_generator_last_active_id');
    
    if (saved) {
      const presentations = JSON.parse(saved);
      setSavedPresentations(presentations);
      
      if (lastActiveId) {
        const lastActive = presentations.find(p => p.id === parseInt(lastActiveId));
        if (lastActive) {
          setCurrentPresentation(lastActive);
        }
      }
    }
  }, []);

  // Manual Save Function
  const handleSave = () => {
    if (!currentPresentation) return;
    
    setIsSaving(true);
    savePresentation(currentPresentation);
    showNotification("Presentation Saved Successfully!");
    
    setTimeout(() => setIsSaving(false), 1000);
  };

  const savePresentation = (presentation) => {
    setSavedPresentations(prev => {
      const updated = [...prev];
      const index = updated.findIndex(p => p.id === presentation.id);
      if (index > -1) {
        updated[index] = presentation;
      } else {
        updated.push(presentation);
      }
      localStorage.setItem('ppt_generator_presentations', JSON.stringify(updated));
      localStorage.setItem('ppt_generator_last_active_id', presentation.id.toString());
      return updated;
    });
  };

  const handleCreateNew = () => {
    setModalMode('create');
    setNewProjectName('New Presentation');
    setIsNameModalOpen(true);
  };

  const handleRenameRequest = (presentation) => {
    setModalMode('rename');
    setPresentationToRename(presentation);
    setNewProjectName(presentation.title);
    setIsNameModalOpen(true);
  };

  const handleModalConfirm = () => {
    if (modalMode === 'create') {
      const newPres = {
        id: Date.now(),
        title: newProjectName || 'Untitled Presentation',
        template: 'corporate',
        slides: [{ ...DEFAULT_SLIDE, id: `slide-${Date.now()}` }]
      };
      setCurrentPresentation(newPres);
      setSelectedSlideIndex(0);
      setActiveTab('new');
      showNotification('Presentation Created!');
    } else {
      const updatedPres = { ...presentationToRename, title: newProjectName };
      if (currentPresentation.id === presentationToRename.id) {
        setCurrentPresentation(updatedPres);
      }
      savePresentation(updatedPres);
      showNotification('Presentation Renamed!');
    }
    setIsNameModalOpen(false);
  };

  const handleSelectTemplate = (templateKey) => {
    setCurrentPresentation(prev => ({ ...prev, template: templateKey }));
    
    // Auto-save the change
    const updated = { ...currentPresentation, template: templateKey };
    savePresentation(updated);
    
    setActiveTab('new');
    showNotification(`Applied ${TEMPLATES[templateKey].name} template`);
  };

  const handleUpdateSlide = (index, updates) => {
    setCurrentPresentation(prev => {
      const newSlides = [...prev.slides];
      newSlides[index] = { ...newSlides[index], ...updates };
      return { ...prev, slides: newSlides };
    });
  };

  const handleUpdatePresentationTitle = (title) => {
    setCurrentPresentation(prev => ({ ...prev, title }));
  };

  const handleAddSlide = () => {
    const newSlide = {
      ...DEFAULT_SLIDE,
      id: `slide-${Date.now()}`,
      title: 'New Slide',
      subtitle: '',
      content: ''
    };
    setCurrentPresentation(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide]
    }));
    setSelectedSlideIndex(currentPresentation.slides.length);
  };

  const handleDeleteSlide = (index) => {
    if (currentPresentation.slides.length <= 1) return;
    setCurrentPresentation(prev => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index)
    }));
    setSelectedSlideIndex(Math.max(0, index - 1));
  };

  const handleReorderSlides = (newSlides) => {
    const updatedPres = { ...currentPresentation, slides: newSlides };
    setCurrentPresentation(updatedPres);
    savePresentation(updatedPres);
  };

  const handleDuplicateSlide = (index) => {
    const slideToDuplicate = currentPresentation.slides[index];
    const newSlide = { ...slideToDuplicate, id: `slide-${Date.now()}` };
    const newSlides = [...currentPresentation.slides];
    newSlides.splice(index + 1, 0, newSlide);
    const updatedPres = { ...currentPresentation, slides: newSlides };
    setCurrentPresentation(updatedPres);
    setSelectedSlideIndex(index + 1);
    savePresentation(updatedPres);
  };

  const handleDeletePresentation = (id) => {
    const updated = savedPresentations.filter(p => p.id !== id);
    setSavedPresentations(updated);
    localStorage.setItem('ppt_generator_presentations', JSON.stringify(updated));
    showNotification('Presentation Deleted');
  };

  return (
    <div id="ppt-generator-app" data-theme={theme}>
      <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onCreateNew={handleCreateNew}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          theme={theme}
          setTheme={setTheme}
        />
        
        <main className="main-content">
          {activeTab === 'new' && (
            <Workspace 
              presentation={currentPresentation}
              selectedSlideIndex={selectedSlideIndex}
              setSelectedSlideIndex={setSelectedSlideIndex}
              onUpdateSlide={handleUpdateSlide}
              onAddSlide={handleAddSlide}
              onDeleteSlide={handleDeleteSlide}
              onDuplicateSlide={handleDuplicateSlide}
              onReorder={handleReorderSlides}
              onUpdatePresentationTitle={handleUpdatePresentationTitle}
              onSave={handleSave}
              onPresent={() => setIsPresenting(true)}
              isSaving={isSaving}
              template={TEMPLATES[currentPresentation.template]}
              activeElement={activeElement}
              setActiveElement={setActiveElement}
              showProperties={showProperties}
              setShowProperties={setShowProperties}
              theme={theme}
              setTheme={setTheme}
            />
          )}
          
          {activeTab === 'my' && (
            <MyPresentations 
              presentations={savedPresentations}
              onSelect={(p) => {
                setCurrentPresentation(p);
                localStorage.setItem('ppt_generator_last_active_id', p.id.toString());
                setSelectedSlideIndex(0);
                setActiveTab('new');
                showNotification('Loaded: ' + p.title);
              }}
              onDelete={handleDeletePresentation}
              onRename={handleRenameRequest}
              theme={theme}
              setTheme={setTheme}
            />
          )}
          
          {activeTab === 'templates' && (
            <TemplateGallery 
              templates={TEMPLATES}
              onSelect={handleSelectTemplate}
              theme={theme}
              setTheme={setTheme}
            />
          )}
          
          {activeTab === 'export' && (
            <ExportMenu 
              presentation={currentPresentation} 
              template={TEMPLATES[currentPresentation.template]} 
            />
          )}
        </main>

        {activeTab === 'new' && (
          <PropertiesPanel 
            slide={currentPresentation.slides[selectedSlideIndex]}
            onUpdate={(updates) => handleUpdateSlide(selectedSlideIndex, updates)}
            template={TEMPLATES[currentPresentation.template]}
            activeElement={activeElement}
            setActiveElement={setActiveElement}
            isActive={showProperties}
            setIsActive={setShowProperties}
          />
        )}


        {notification && (
          <div className="success-toast">
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        )}

        {isNameModalOpen && (
          <div className="ai-modal-overlay">
            <div className="ai-modal glass">
              <h3>{modalMode === 'create' ? 'Name Your Project' : 'Rename Project'}</h3>
              <p>{modalMode === 'create' ? 'Give your new presentation a descriptive title.' : 'Enter a new name for this presentation.'}</p>
              <input 
                type="text" 
                className="modal-input" 
                value={newProjectName} 
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g., Annual Sales Report"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleModalConfirm()}
              />
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setIsNameModalOpen(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleModalConfirm}>
                  {modalMode === 'create' ? 'Create Presentation' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {isPresenting && (
          <div className="presentation-overlay">
            <button className="exit-present" onClick={() => setIsPresenting(false)}>Exit</button>
            <div className="present-container">
              <SlideCanvas 
                slide={currentPresentation.slides[selectedSlideIndex]} 
                template={TEMPLATES[currentPresentation.template]} 
                isPreview={false}
              />
            </div>
            <div className="present-controls">
              <button onClick={() => setSelectedSlideIndex(prev => Math.max(0, prev - 1))}>←</button>
              <span>{selectedSlideIndex + 1} / {currentPresentation.slides.length}</span>
              <button onClick={() => setSelectedSlideIndex(prev => Math.min(currentPresentation.slides.length - 1, prev + 1))}>→</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
