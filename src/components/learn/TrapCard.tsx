import React from 'react';

interface TrapCardProps {
  title: string;
  children: React.ReactNode;
}

export const TrapCard: React.FC<TrapCardProps> = ({ title, children }) => (
  <aside className="nt-trap">
    <div className="nt-trap-title">{title}</div>
    <div>{children}</div>
  </aside>
);
