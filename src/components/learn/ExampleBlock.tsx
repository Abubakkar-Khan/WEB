import React from 'react';

interface ExampleBlockProps {
  title: string;
  code: string;
  output?: React.ReactNode;
  children?: React.ReactNode;
}

export const ExampleBlock: React.FC<ExampleBlockProps> = ({ title, code, output, children }) => (
  <article className="example-card">
    <div>
      <div className="learn-card__eyebrow">Worked Example</div>
      <h3 className="learn-card__title">{title}</h3>
    </div>
    <div className="example-card__split">
      <pre>{code}</pre>
      <div className="example-output">{output ?? children}</div>
    </div>
  </article>
);
