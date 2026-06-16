import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import './AppLayout.css';

interface AppLayoutProps {
  children: React.ReactNode;
  activeChapter: string;
  setActiveChapter: (chapter: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, activeChapter, setActiveChapter }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const chapterTitle = {
    ch11: 'JS Objects',
    ch12: 'DOM',
    ch13: 'Events',
    ch16: 'Ajax & JSON',
    bonus: 'Bonus Module',
  }[activeChapter] ?? 'Study Engine';

  return (
    <div className="nothing-app">
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <Sidebar 
        activeChapter={activeChapter} 
        setActiveChapter={setActiveChapter} 
        mobileOpen={mobileOpen}
        onCloseMenu={() => setMobileOpen(false)}
      />
      <main className="nothing-main">
        <Topbar
          onToggleMenu={() => setMobileOpen(!mobileOpen)}
          menuOpen={mobileOpen}
          chapterTitle={chapterTitle}
        />
        <div className="nothing-content">
          {children}
        </div>
      </main>
    </div>
  );
};
