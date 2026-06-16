import React from 'react';
import { useStore } from '../../lib/store';
import { FileCode, Box, Pointer, Zap, Sparkles } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  activeChapter: string;
  setActiveChapter: (chapter: string) => void;
  mobileOpen: boolean;
  onCloseMenu?: () => void;
}

const CHAPTERS = [
  { id: 'ch11', no: '11', title: 'JS Objects', meta: 'String · Date · Storage', icon: FileCode },
  { id: 'ch12', no: '12', title: 'DOM', meta: 'Tree · Nodes · Styling', icon: Box },
  { id: 'ch13', no: '13', title: 'Events', meta: 'Object · Forms · Bubbling', icon: Pointer },
  { id: 'ch16', no: '16', title: 'Ajax & JSON', meta: 'XHR · JSON · Patterns', icon: Zap },
  { id: 'bonus', no: '++', title: 'Bonus', meta: 'Security · DevOps · Architecture', icon: Sparkles },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeChapter, setActiveChapter, mobileOpen, onCloseMenu }) => {
  const { xp, level, streak, completedLessons } = useStore();
  const completedCount = Object.keys(completedLessons).filter(k => completedLessons[k]).length;
  const totalLessons = CHAPTERS.length;
  const progressPct = Math.round((completedCount / totalLessons) * 100);

  return (
    <aside className={`nothing-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-row" style={{ padding: '12px 0' }}>
          <h1 className="brand-title dot-text" style={{ fontFamily: 'var(--font-dot)', fontWeight: 700, fontSize: '32px', letterSpacing: '0.05em', margin: 0, color: 'var(--nothing-text)' }}>
            WEB
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--nothing-text-muted)', marginTop: '8px', fontWeight: 400, textTransform: 'uppercase' }}>
              Study Engine
            </span>
          </h1>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-title">CHAPTERS</div>
        {CHAPTERS.map((ch) => {
          const isComplete = completedLessons[ch.id];
          return (
            <button
              key={ch.id}
              className={`nav-btn ${activeChapter === ch.id ? 'active' : ''}`}
              onClick={() => {
                setActiveChapter(ch.id);
                if (onCloseMenu) onCloseMenu();
              }}
            >
              <div className="nav-btn-no">{ch.no}</div>
              <div className="nav-btn-content">
                <span className="nav-btn-title">{ch.title}</span>
                <span className="nav-btn-meta">{ch.meta}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isComplete && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--nothing-text)' }}>✓</span>}
                <ch.icon className="nav-btn-icon" size={16} />
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
