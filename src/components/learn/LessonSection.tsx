import React from 'react';

interface LessonSectionProps {
  no: string;
  title: string;
  icon?: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
}

export const LessonSection: React.FC<LessonSectionProps> = ({ no, title, icon, intro, children }) => (
  <section className="nt-section">
    <div className="section-heading">
      {icon && <span className="section-heading__icon">{icon}</span>}
      <span className="section-heading__number">{no}</span>
      <h2>{title}</h2>
    </div>
    {intro && <div className="nt-prose">{intro}</div>}
    {children}
  </section>
);
