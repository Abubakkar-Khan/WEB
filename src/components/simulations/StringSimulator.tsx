import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';

export const StringSimulator: React.FC = () => {
  const [text, setText] = useState("International Islamic University WEB");
  const [needle, setNeedle] = useState("WEB");

  const results = {
    length: text.length,
    charAt0: text.charAt(0),
    charCodeAt0: text.charCodeAt(0),
    indexOf: text.indexOf(needle),
    lastIndexOf: text.lastIndexOf(needle),
    toUpperCase: text.toUpperCase(),
    splitSpace: text.split(' '),
    substring: text.substring(0, 13)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>String Manipulator</CardTitle>
      </CardHeader>
      <CardBody style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--nothing-text-muted)', letterSpacing: '0.1em' }}>BASE TEXT</label>
            <textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', color: 'var(--nothing-text)', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '12px', minHeight: '80px', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--nothing-text-muted)', letterSpacing: '0.1em' }}>SEARCH NEEDLE</label>
            <input 
              value={needle} 
              onChange={(e) => setNeedle(e.target.value)}
              style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', color: 'var(--nothing-text)', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
            <span style={{ border: '1px solid var(--nothing-border-hover)', padding: '4px 8px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>Zero-based index</span>
            <span style={{ border: '1px solid var(--nothing-border-hover)', padding: '4px 8px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>Case sensitive</span>
          </div>
        </div>

        <div className="output-group" style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.8, overflowX: 'auto' }}>
          <div><span style={{ color: 'var(--nothing-text-muted)' }}>length:</span> {results.length}</div>
          <div><span style={{ color: 'var(--nothing-text-muted)' }}>charAt(0):</span> {results.charAt0}</div>
          <div><span style={{ color: 'var(--nothing-text-muted)' }}>charCodeAt(0):</span> {results.charCodeAt0}</div>
          <div><span style={{ color: 'var(--nothing-text-muted)' }}>indexOf("{needle}"):</span> {results.indexOf}</div>
          <div><span style={{ color: 'var(--nothing-text-muted)' }}>lastIndexOf("{needle}"):</span> {results.lastIndexOf}</div>
          <div><span style={{ color: 'var(--nothing-text-muted)' }}>toUpperCase():</span> {results.toUpperCase}</div>
          <div><span style={{ color: 'var(--nothing-text-muted)' }}>split(" "):</span> {JSON.stringify(results.splitSpace)}</div>
          <div><span style={{ color: 'var(--nothing-text-muted)' }}>substring(0, 13):</span> {results.substring}</div>
        </div>
      </CardBody>
    </Card>
  );
};
