import React from 'react';
import {
  Box,
  FileCode,
  Pointer,
  Sparkles,
  Zap,
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  activeChapter: string;
  setActiveChapter: (chapter: string) => void;
  mobileOpen: boolean;
  onCloseMenu?: () => void;
}

const CHAPTERS = [
  { id: 'ch11', no: '11', title: 'JS Objects', meta: 'String / Date / Storage', icon: FileCode },
  { id: 'ch12', no: '12', title: 'DOM', meta: 'Tree / Nodes / Styling', icon: Box },
  { id: 'ch13', no: '13', title: 'Events', meta: 'Forms / Bubbling / Delegation', icon: Pointer },
  { id: 'ch16', no: '16', title: 'Ajax & JSON', meta: 'XHR / JSON / Patterns', icon: Zap },
  { id: 'bonus', no: '++', title: 'Bonus', meta: 'Security / DevOps / Architecture', icon: Sparkles },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeChapter,
  setActiveChapter,
  mobileOpen,
  onCloseMenu,
}) => {
  return (
    <aside className={`nothing-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-row">
          <h1 className="brand-title dot-text">WEB</h1>
          <span className="brand-subtitle">Study Engine</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-title">Course Map</div>
        {CHAPTERS.map((chapter) => {
          const Icon = chapter.icon;

          return (
            <button
              key={chapter.id}
              className={`nav-btn ${activeChapter === chapter.id ? 'active' : ''}`}
              onClick={() => {
                setActiveChapter(chapter.id);
                onCloseMenu?.();
              }}
            >
              <div className="nav-btn-no">{chapter.no}</div>
              <div className="nav-btn-content">
                <span className="nav-btn-title">{chapter.title}</span>
                <span className="nav-btn-meta">{chapter.meta}</span>
              </div>
              <div className="nav-btn-status">
                <Icon className="nav-btn-icon" size={16} />
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
