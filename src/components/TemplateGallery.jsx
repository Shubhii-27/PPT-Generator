import { Check, Sun, Moon } from 'lucide-react';

const TemplateGallery = ({ templates, onSelect, theme, setTheme }) => {
  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>Choose a Template</h1>
        <p>Select a starting style for your presentation</p>
        
        <button 
          className="theme-toggle-nav absolute-top-right" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
      
      <div className="template-grid">
        {Object.entries(templates).map(([key, template]) => (
          <div 
            key={key} 
            className="template-card"
            onClick={() => onSelect(key)}
          >
            <div 
              className="template-preview"
              style={{ 
                backgroundColor: template.style.backgroundColor,
                fontFamily: template.style.fontFamily,
                color: template.style.color,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {template.style.layout === 'wave' && (
                <>
                  <div className="wave-decor navy" style={{ width: '20%' }}></div>
                  <div className="wave-decor orange" style={{ width: '30%' }}></div>
                </>
              )}
              <div style={{ width: '40px', height: '4px', background: template.style.accentColor, marginBottom: '8px', zIndex: 5 }}></div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, zIndex: 5 }}>{template.name}</div>
              <div style={{ fontSize: '0.6rem', opacity: 0.6, zIndex: 5 }}>Professional Layout</div>
            </div>
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>Clean and modern</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateGallery;
