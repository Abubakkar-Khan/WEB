import React from 'react';

interface DemoPanelProps {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}

export const DemoPanel: React.FC<DemoPanelProps> = ({ title, description, children }) => (
  <section className="demo-panel">
    <div className="learn-card__eyebrow">Live Demo</div>
    <h3 className="learn-card__title">{title}</h3>
    {description && <div className="learn-card__body">{description}</div>}
    <div className="demo-panel__body">{children}</div>
  </section>
);
