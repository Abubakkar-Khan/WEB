import React from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useStore } from '../../lib/store';
import './Topbar.css';

interface TopbarProps {
  onToggleMenu: () => void;
  menuOpen: boolean;
  chapterTitle: string;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMenu, menuOpen, chapterTitle }) => {
  const { theme, toggleTheme } = useStore();

  return (
    <header className="nothing-topbar">
      <div className="topbar-context">
        <button className="menu-toggle-btn" onClick={onToggleMenu} aria-label="Toggle Navigation">
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div>
          <span className="topbar-kicker">Current Chapter</span>
          <strong>{chapterTitle}</strong>
        </div>
      </div>
      
      <div className="topbar-actions">
        <button className="topbtn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </header>
  );
};
