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
  return (
    <div className="nothing-app">
      <Sidebar activeChapter={activeChapter} setActiveChapter={setActiveChapter} />
      <main className="nothing-main">
        <Topbar />
        <div className="nothing-content" style={{ overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};
