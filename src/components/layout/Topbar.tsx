import React from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useStore } from '../../lib/store';
import './Topbar.css';

interface TopbarProps {
  onToggleMenu: () => void;
  menuOpen: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMenu, menuOpen }) => {
  const { theme, toggleTheme } = useStore();

  return (
    <header className="nothing-topbar">
      <button className="menu-toggle-btn" onClick={onToggleMenu} aria-label="Toggle Navigation">
        {menuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
      
      <div className="topbar-actions" style={{ marginLeft: 'auto' }}>
        <button className="topbtn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span>THEME: {theme === 'dark' ? 'DARK' : 'LIGHT'}</span>
        </button>
      </div>
    </header>
  );
};
