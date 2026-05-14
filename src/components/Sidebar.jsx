import { Plus, FolderOpen, Palette, Download, Layout, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import logo from '../assets/logo.png';

const Sidebar = ({ activeTab, setActiveTab, onCreateNew, isCollapsed, setIsCollapsed, theme, setTheme }) => {
  const menuItems = [
    { id: 'new', icon: Plus, label: 'New Presentation', action: onCreateNew },
    { id: 'my', icon: FolderOpen, label: 'My Presentations' },
    { id: 'templates', icon: Palette, label: 'Templates' },
    { id: 'export', icon: Download, label: 'Export' },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-container">
          <img src={logo} alt="PPT Logo" className="logo-img" />
        </div>
        {!isCollapsed && <span className="logo-text">PPT</span>}
      </div>

      <button className="collapse-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => {
              if (item.action) item.action();
              setActiveTab(item.id);
            }}
            title={isCollapsed ? item.label : ''}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
      </div>
    </aside>
  );
};

export default Sidebar;
