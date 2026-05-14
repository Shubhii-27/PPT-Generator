import { FileText, Trash2, Calendar, Download, Upload, Sun, Moon, Edit2, ExternalLink } from 'lucide-react';

const MyPresentations = ({ presentations, onSelect, onDelete, onRename, theme, setTheme }) => {
  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>My Presentations</h1>
        <p>Access and edit your saved work</p>
        
        <button 
          className="theme-toggle-nav absolute-top-right" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

      </div>

      {presentations.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} color="var(--text-muted)" />
          <h3>No presentations found</h3>
          <p>Create a new one to get started!</p>
        </div>
      ) : (
        <div className="presentation-list">
          {presentations.map((p) => (
            <div key={p.id} className="presentation-item">
              <div className="pres-icon">
                <FileText size={24} />
              </div>
              <div className="pres-details" onClick={() => onSelect(p)}>
                <h3>{p.title}</h3>
                <div className="pres-meta">
                  <Calendar size={14} />
                  <span>{new Date(p.id).toLocaleDateString()}</span>
                  <span className="dot">•</span>
                  <span>{p.slides.length} Slides</span>
                </div>
              </div>
              <div className="pres-actions">
                <button className="btn-primary-sm" onClick={() => onSelect(p)} title="Open in Editor">
                  <ExternalLink size={14} /> Open
                </button>
                <button className="btn-secondary-sm" onClick={() => onRename(p)} title="Rename Presentation">
                  <Edit2 size={14} /> Rename
                </button>
                <button className="delete-btn" onClick={() => onDelete(p.id)} title="Delete Presentation">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPresentations;
