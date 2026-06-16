import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useStore } from '../../lib/store';
import './Topbar.css';

export const Topbar: React.FC = () => {
  const { theme, toggleTheme } = useStore();

  return (
    <header className="nothing-topbar" style={{ justifyContent: 'flex-end' }}>
      <div className="topbar-actions">
        <button className="topbtn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span>THEME: {theme === 'dark' ? 'DARK' : 'LIGHT'}</span>
        </button>
      </div>
    </header>
  );
};
