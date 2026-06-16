import React from 'react';
import { useStore } from '../../lib/store';
import {
  Box,
  CheckCircle2,
  FileCode,
  Pointer,
  RotateCcw,
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
  const { xp, level, streak, completedLessons, resetProgress } = useStore();
  const completedCount = Object.keys(completedLessons).filter((key) => completedLessons[key]).length;
  const progressPct = Math.round((completedCount / CHAPTERS.length) * 100);

  return (
    <aside className={`nothing-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-row">
          <h1 className="brand-title dot-text">WEB</h1>
          <span className="brand-subtitle">Study Engine</span>
        </div>

        <div className="study-meter" aria-label="Study progress">
          <div className="meter-row">
            <span>Progress</span>
            <strong>{progressPct}%</strong>
          </div>
          <div className="meter-track">
            <span style={{ width: `${progressPct}%` }} />
          </div>
          <div className="stat-grid">
            <span>
              <strong>{level}</strong>
              Level
            </span>
            <span>
              <strong>{xp}</strong>
              XP
            </span>
            <span>
              <strong>{streak}</strong>
              Streak
            </span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-title">Course Map</div>
        {CHAPTERS.map((chapter) => {
          const isComplete = completedLessons[chapter.id];
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
                {isComplete && <CheckCircle2 size={15} />}
                <Icon className="nav-btn-icon" size={16} />
              </div>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="reset-progress-btn" onClick={resetProgress}>
          <RotateCcw size={14} />
          Reset Progress
        </button>
      </div>
    </aside>
  );
};
