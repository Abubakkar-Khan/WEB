import React from 'react';

interface ChapterHeroProps {
  number: string;
  title: string;
  subtitle: string;
  sections?: string[];
}

export const ChapterHero: React.FC<ChapterHeroProps> = ({ number, title, subtitle, sections = [] }) => (
  <header className="nt-chapter-hero">
    <span className="nt-chapter-kicker">Chapter {number}</span>
    <h1 className="nt-chapter-title dot-text">{title}</h1>
    <p className="nt-chapter-subtitle">{subtitle}</p>
    {sections.length > 0 && (
      <div className="chapter-map" aria-label="Chapter sections">
        {sections.map((section) => (
          <span key={section}>{section}</span>
        ))}
      </div>
    )}
  </header>
);
