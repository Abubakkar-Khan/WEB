import React from 'react';
import { Search, MonitorPlay, HelpCircle } from 'lucide-react';
import './Topbar.css';

export const Topbar: React.FC = () => {
  return (
    <header className="nothing-topbar">
      <div className="search-container">
        <Search size={16} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search lessons, cheats, and labs..." 
          className="search-input"
        />
        <kbd className="search-shortcut">/</kbd>
      </div>
      <div className="topbar-actions">
        <button className="topbtn">
          <MonitorPlay size={14} />
          <span>FOCUS</span>
        </button>
        <button className="topbtn">
          <HelpCircle size={14} />
          <span>KEYS</span>
        </button>
      </div>
    </header>
  );
};
