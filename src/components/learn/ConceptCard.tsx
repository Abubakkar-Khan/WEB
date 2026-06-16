import React from 'react';

interface ConceptCardProps {
  label?: string;
  title: string;
  children: React.ReactNode;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({ label = 'Concept', title, children }) => (
  <article className="concept-card">
    <div className="learn-card__eyebrow">{label}</div>
    <h3 className="learn-card__title">{title}</h3>
    <div className="learn-card__body">{children}</div>
  </article>
);
