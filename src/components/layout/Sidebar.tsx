import React from 'react';
import { useStore } from '../../lib/store';
import { FileCode, Box, Pointer, Zap, Sparkles } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  activeChapter: string;
  setActiveChapter: (chapter: string) => void;
}

const CHAPTERS = [
  { id: 'ch11', no: '11', title: 'JS Objects', meta: 'String · Date · Storage', icon: FileCode },
  { id: 'ch12', no: '12', title: 'DOM', meta: 'Tree · Nodes · Styling', icon: Box },
  { id: 'ch13', no: '13', title: 'Events', meta: 'Object · Forms · Bubbling', icon: Pointer },
  { id: 'ch16', no: '16', title: 'Ajax & JSON', meta: 'XHR · JSON · Patterns', icon: Zap },
  { id: 'bonus', no: '++', title: 'Bonus', meta: 'Security · DevOps · Architecture', icon: Sparkles },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeChapter, setActiveChapter }) => {
  const { xp, level, streak, completedLessons } = useStore();
  const completedCount = Object.keys(completedLessons).filter(k => completedLessons[k]).length;
  const totalLessons = CHAPTERS.length;
  const progressPct = Math.round((completedCount / totalLessons) * 100);

  return (
    <aside className="nothing-sidebar">
      <div className="sidebar-brand">
        <div className="brand-row">
          <h1 className="brand-title" style={{ fontFamily: 'var(--font-dot)', fontSize: '42px', lineHeight: 0.85, margin: 0, letterSpacing: '0.05em' }}>
            WEB
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--nothing-text-muted)', marginTop: '10px', fontWeight: 400 }}>
              INTERACTIVE STUDY
            </span>
          </h1>
        </div>

        <div style={{ display: 'grid', gap: '6px', marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--nothing-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span>PROGRESS</span>
            <span>{progressPct}%</span>
          </div>
          <div style={{ height: '8px', border: '1px solid var(--nothing-border)', background: '#000', padding: '1px' }}>
            <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--nothing-text)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid var(--nothing-border)', marginTop: '8px' }}>
          <div style={{ padding: '10px 8px', borderRight: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--nothing-text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            XP<b style={{ display: 'block', color: 'var(--nothing-text)', fontSize: '18px', letterSpacing: '-0.03em', marginTop: '4px' }}>{xp}</b>
          </div>
          <div style={{ padding: '10px 8px', borderRight: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--nothing-text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            LEVEL<b style={{ display: 'block', color: 'var(--nothing-text)', fontSize: '18px', letterSpacing: '-0.03em', marginTop: '4px' }}>{level}</b>
          </div>
          <div style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--nothing-text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            STREAK<b style={{ display: 'block', color: 'var(--nothing-text)', fontSize: '18px', letterSpacing: '-0.03em', marginTop: '4px' }}>{streak}</b>
          </div>
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
              onClick={() => setActiveChapter(ch.id)}
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

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--nothing-border)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <button 
          onClick={() => { if (confirm('Reset all progress?')) { useStore.getState().resetProgress(); }}} 
          style={{ border: 0, borderRight: '1px solid var(--nothing-border)', padding: '14px 8px', fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--nothing-text-muted)', background: 'transparent', cursor: 'pointer' }}
        >
          Reset
        </button>
        <button 
          onClick={() => {
            const data = { xp, level, streak, completed: completedLessons };
            navigator.clipboard?.writeText(JSON.stringify(data, null, 2));
          }}
          style={{ border: 0, padding: '14px 8px', fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--nothing-text-muted)', background: 'transparent', cursor: 'pointer' }}
        >
          Export
        </button>
      </div>
    </aside>
  );
};
