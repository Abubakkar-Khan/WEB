import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TreePine, Search, PlusCircle, Trash2, Paintbrush, BookOpen,
  HelpCircle, ChevronDown, ChevronRight, AlertTriangle, Check,
  X, Copy, ArrowRight, RotateCcw, Layers, Code2
} from 'lucide-react';

/* ─── style helpers ─── */
const sectionStyle: React.CSSProperties = {
  background: 'var(--nothing-surface)',
  border: '1px solid var(--nothing-border)',
  padding: '32px',
  marginBottom: '44px',
};
const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-dot)',
  fontSize: '24px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  marginBottom: '44px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};
const prose: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: '18px',
  lineHeight: 1.9,
  color: 'var(--nothing-text-muted)',
  marginBottom: '44px',
};
const codeBlock: React.CSSProperties = {
  background: 'var(--nothing-bg)',
  border: '1px solid var(--nothing-border)',
  padding: '24px',
  fontFamily: 'var(--font-mono)',
  fontSize: '18px',
  lineHeight: 1.9,
  overflowX: 'auto',
  color: '#ccc',
  marginBottom: '44px',
  whiteSpace: 'pre',
};
const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--font-mono)',
  fontSize: '18px',
  marginBottom: '44px',
};
const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '12px 16px',
  borderBottom: '2px solid var(--nothing-border)',
  color: 'var(--nothing-text)',
  fontWeight: 600,
  whiteSpace: 'nowrap',
};
const tdStyle: React.CSSProperties = {
  padding: '10px 16px',
  borderBottom: '1px solid var(--nothing-border)',
  color: 'var(--nothing-text-muted)',
  verticalAlign: 'top',
};
const trapBox: React.CSSProperties = {
  background: 'rgba(215,25,33,0.08)',
  border: '1px solid rgba(215,25,33,0.3)',
  padding: '16px 20px',
  marginBottom: '44px',
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-start',
};
const labelTag: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '18px',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  padding: '2px 8px',
  border: '1px solid var(--nothing-border)',
  color: 'var(--nothing-text-muted)',
  display: 'inline-block',
  marginBottom: '8px',
};
const btnStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '17px',
  padding: '6px 14px',
  background: 'transparent',
  border: '1px solid var(--nothing-border)',
  color: 'var(--nothing-text)',
  cursor: 'pointer',
  letterSpacing: '0.05em',
  transition: 'all 0.15s',
};
const btnActive: React.CSSProperties = {
  ...btnStyle,
  background: 'var(--nothing-text)',
  color: 'var(--nothing-bg)',
};

/* ─────────────────────── INTERACTIVE: DOM SURGEON ─────────────────────── */
interface TreeNode {
  id: string;
  tag: string;
  text?: string;
  children: TreeNode[];
}

let _nodeId = 100;
const nextId = () => `n${_nodeId++}`;

const DomSurgeon: React.FC = () => {
  const [tree, setTree] = useState<TreeNode>({
    id: 'root',
    tag: 'body',
    children: [
      { id: 'n1', tag: 'h1', text: 'Hello', children: [] },
      {
        id: 'n2',
        tag: 'div',
        children: [
          { id: 'n3', tag: 'p', text: 'Paragraph', children: [] },
          { id: 'n4', tag: 'span', text: 'Span', children: [] },
        ],
      },
      { id: 'n5', tag: 'ul', children: [
        { id: 'n6', tag: 'li', text: 'Item 1', children: [] },
        { id: 'n7', tag: 'li', text: 'Item 2', children: [] },
      ]},
    ],
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>(['// DOM Surgeon ready']);
  const [newTag, setNewTag] = useState('p');
  const [newText, setNewText] = useState('New node');

  const addLog = (msg: string) => setLog(prev => [...prev.slice(-14), msg]);

  const findNode = useCallback((node: TreeNode, id: string): TreeNode | null => {
    if (node.id === id) return node;
    for (const c of node.children) {
      const found = findNode(c, id);
      if (found) return found;
    }
    return null;
  }, []);

  const findParent = useCallback((node: TreeNode, id: string): TreeNode | null => {
    for (const c of node.children) {
      if (c.id === id) return node;
      const found = findParent(c, id);
      if (found) return found;
    }
    return null;
  }, []);

  const deepClone = (node: TreeNode): TreeNode => JSON.parse(JSON.stringify(node));

  const handleAppendChild = () => {
    if (!selected) { addLog('⚠ Select a parent node first'); return; }
    const t = deepClone(tree);
    const parent = findNode(t, selected);
    if (!parent) return;
    const id = nextId();
    parent.children.push({ id, tag: newTag, text: newText || undefined, children: [] });
    setTree(t);
    addLog(`appendChild: <${newTag}> → <${parent.tag}>`);
  };

  const handleInsertBefore = () => {
    if (!selected) { addLog('⚠ Select a reference node first'); return; }
    const t = deepClone(tree);
    const parent = findParent(t, selected);
    if (!parent) { addLog('⚠ Cannot insert before root'); return; }
    const idx = parent.children.findIndex(c => c.id === selected);
    const id = nextId();
    parent.children.splice(idx, 0, { id, tag: newTag, text: newText || undefined, children: [] });
    setTree(t);
    addLog(`insertBefore: <${newTag}> before <${findNode(t, selected)?.tag}>`);
  };

  const handleRemoveChild = () => {
    if (!selected) { addLog('⚠ Select a node to remove'); return; }
    if (selected === 'root') { addLog('⚠ Cannot remove root'); return; }
    const t = deepClone(tree);
    const parent = findParent(t, selected);
    if (!parent) return;
    const removed = parent.children.find(c => c.id === selected);
    parent.children = parent.children.filter(c => c.id !== selected);
    setTree(t);
    setSelected(null);
    addLog(`removeChild: <${removed?.tag}> from <${parent.tag}>`);
  };

  const handleReplaceChild = () => {
    if (!selected) { addLog('⚠ Select a node to replace'); return; }
    if (selected === 'root') { addLog('⚠ Cannot replace root'); return; }
    const t = deepClone(tree);
    const parent = findParent(t, selected);
    if (!parent) return;
    const idx = parent.children.findIndex(c => c.id === selected);
    const oldTag = parent.children[idx].tag;
    const id = nextId();
    parent.children[idx] = { id, tag: newTag, text: newText || undefined, children: [] };
    setTree(t);
    setSelected(id);
    addLog(`replaceChild: <${newTag}> replaces <${oldTag}>`);
  };

  const handleReset = () => {
    _nodeId = 100;
    setTree({
      id: 'root',
      tag: 'body',
      children: [
        { id: 'n1', tag: 'h1', text: 'Hello', children: [] },
        {
          id: 'n2',
          tag: 'div',
          children: [
            { id: 'n3', tag: 'p', text: 'Paragraph', children: [] },
            { id: 'n4', tag: 'span', text: 'Span', children: [] },
          ],
        },
        { id: 'n5', tag: 'ul', children: [
          { id: 'n6', tag: 'li', text: 'Item 1', children: [] },
          { id: 'n7', tag: 'li', text: 'Item 2', children: [] },
        ]},
      ],
    });
    setSelected(null);
    setLog(['// DOM Surgeon reset']);
  };

  const RenderNode: React.FC<{ node: TreeNode; depth: number }> = ({ node, depth }) => {
    const isSel = node.id === selected;
    return (
      <div style={{ marginLeft: depth * 20 }}>
        <motion.div
          layout
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          onClick={(e) => { e.stopPropagation(); setSelected(isSel ? null : node.id); }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '18px',
            padding: '4px 10px',
            marginBottom: '3px',
            cursor: 'pointer',
            background: isSel ? 'rgba(255,255,255,0.12)' : 'transparent',
            border: isSel ? '1px solid var(--nothing-text-muted)' : '1px solid transparent',
            color: isSel ? 'var(--nothing-text)' : 'var(--nothing-text-muted)',
            display: 'inline-block',
            borderRadius: '2px',
            transition: 'all 0.15s',
          }}
        >
          {'<'}{node.tag}{'>'}
          {node.text && <span style={{ color: 'var(--nothing-text-dim)', marginLeft: 6 }}>"{node.text}"</span>}
        </motion.div>
        <AnimatePresence>
          {node.children.map(c => <RenderNode key={c.id} node={c} depth={depth + 1} />)}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      {/* Tree view */}
      <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '24px', minHeight: 240 }}>
        <div style={{ ...labelTag, marginBottom: '12px' }}>Live DOM Tree</div>
        <RenderNode node={tree} depth={0} />
      </div>
      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-muted)' }}>Tag:</label>
          <select value={newTag} onChange={e => setNewTag(e.target.value)}
            style={{ ...btnStyle, padding: '4px 8px', background: 'var(--nothing-bg)' }}>
            {['div','p','span','h1','h2','h3','ul','ol','li','a','em','strong','section','article','img'].map(t =>
              <option key={t} value={t}>{`<${t}>`}</option>
            )}
          </select>
          <input value={newText} onChange={e => setNewText(e.target.value)} placeholder="text content"
            style={{ ...btnStyle, flex: 1, padding: '4px 8px', background: 'var(--nothing-bg)' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button className="nt-button" onClick={handleAppendChild} onMouseOver={e=>(e.currentTarget.style.borderColor='#888')} onMouseOut={e=>(e.currentTarget.style.borderColor='var(--nothing-border)')}>
            appendChild
          </button>
          <button className="nt-button" onClick={handleInsertBefore} onMouseOver={e=>(e.currentTarget.style.borderColor='#888')} onMouseOut={e=>(e.currentTarget.style.borderColor='var(--nothing-border)')}>
            insertBefore
          </button>
          <button className="nt-button" onClick={handleRemoveChild} onMouseOver={e=>(e.currentTarget.style.borderColor='#888')} onMouseOut={e=>(e.currentTarget.style.borderColor='var(--nothing-border)')}>
            removeChild
          </button>
          <button className="nt-button" onClick={handleReplaceChild} onMouseOver={e=>(e.currentTarget.style.borderColor='#888')} onMouseOut={e=>(e.currentTarget.style.borderColor='var(--nothing-border)')}>
            replaceChild
          </button>
          <button style={{ ...btnStyle, color: 'var(--nothing-red)' }} onClick={handleReset}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><RotateCcw size={12} /> Reset</span>
          </button>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-dim)', minHeight: 20 }}>
          {selected ? `Selected: <${findNode(tree, selected)?.tag}>` : 'Click a node to select it'}
        </div>
        {/* Log */}
        <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '16px', flex: 1, overflowY: 'auto', maxHeight: 160 }}>
          <div style={{ ...labelTag, marginBottom: '6px' }}>Action Log</div>
          {log.map((l, i) => (
            <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: l.startsWith('⚠') ? 'var(--nothing-red)' : 'var(--nothing-text-dim)', marginBottom: 2 }}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────── INTERACTIVE: STYLE TOGGLE ─────────────────────── */
const StyleToggle: React.FC = () => {
  const [classes, setClasses] = useState<string[]>(['box']);
  const [bgColor, setBgColor] = useState('#333333');
  const [borderRadius, setBorderRadius] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const toggleClass = (cls: string) => {
    setClasses(prev => prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]);
  };

  useEffect(() => {
    if (animating) {
      let deg = rotation;
      intervalRef.current = window.setInterval(() => {
        deg = (deg + 3) % 360;
        setRotation(deg);
      }, 30);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRotation(0);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [animating]);

  const availableClasses = ['rounded', 'shadow', 'glow', 'bordered', 'pulsate'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>
      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={labelTag}>classList Controls</div>
        {availableClasses.map(cls => (
          <button
            key={cls}
            style={classes.includes(cls) ? btnActive : btnStyle}
            onClick={() => toggleClass(cls)}
          >
            {classes.includes(cls) ? 'remove' : 'add'}("{cls}")
          </button>
        ))}
        <div style={{ borderTop: '1px solid var(--nothing-border)', paddingTop: '10px', marginTop: '4px' }}>
          <div style={labelTag}>element.style</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-muted)' }}>bgColor:</span>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
              style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-muted)' }}>radius:</span>
            <input type="range" min={0} max={50} value={borderRadius} onChange={e => setBorderRadius(+e.target.value)}
              style={{ flex: 1 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-dim)' }}>{borderRadius}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-muted)' }}>scale:</span>
            <input type="range" min={50} max={200} value={scale * 100} onChange={e => setScale(+e.target.value / 100)}
              style={{ flex: 1 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-dim)' }}>{scale.toFixed(1)}</span>
          </div>
        </div>
        <button style={animating ? btnActive : btnStyle} onClick={() => setAnimating(!animating)}>
          {animating ? '⏹ Stop' : '▶ setInterval spin'}
        </button>
      </div>
      {/* Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 250 }}>
        <div
          style={{
            width: 120,
            height: 120,
            background: bgColor,
            borderRadius: `${borderRadius}%`,
            transform: `rotate(${rotation}deg) scale(${scale})`,
            transition: animating ? 'none' : 'all 0.3s ease',
            border: classes.includes('bordered') ? '3px solid #fff' : '1px solid var(--nothing-border)',
            boxShadow: classes.includes('shadow')
              ? '0 8px 32px rgba(0,0,0,0.6)'
              : classes.includes('glow')
                ? '0 0 30px rgba(255,255,255,0.15)'
                : 'none',
          }}
        />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-dim)', marginTop: 20, textAlign: 'center' }}>
          className="{classes.join(' ')}"<br />
          style: bg={bgColor}, radius={borderRadius}%, scale={scale.toFixed(1)}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────── QUIZ ─────────────────────── */
interface QuizQ { q: string; opts: string[]; ans: number; explain: string; }
const quizData: QuizQ[] = [
  {
    q: 'What does querySelectorAll return?',
    opts: ['HTMLCollection (live)', 'NodeList (live)', 'NodeList (static)', 'Array'],
    ans: 2,
    explain: 'querySelectorAll returns a static NodeList. Changes to the DOM after the call are NOT reflected in the list.',
  },
  {
    q: 'What happens when you call appendChild with an existing DOM node?',
    opts: ['It clones the node', 'It moves the node', 'It throws an error', 'It does nothing'],
    ans: 1,
    explain: 'appendChild of an existing node MOVES it from its old position to the new parent. It does NOT copy.',
  },
  {
    q: 'Which method returns a LIVE HTMLCollection?',
    opts: ['querySelectorAll()', 'querySelector()', 'getElementsByClassName()', 'getElementById()'],
    ans: 2,
    explain: 'getElementsByClassName returns a live HTMLCollection that updates automatically when the DOM changes.',
  },
  {
    q: 'What does cloneNode(false) do?',
    opts: ['Clones the node and all its children', 'Clones the node without children', 'Returns null', 'Throws an error'],
    ans: 1,
    explain: 'cloneNode(false) performs a shallow clone — the node is copied but its child nodes are NOT included.',
  },
  {
    q: 'After createElement("div"), where does the new element exist?',
    opts: ['In the DOM tree', 'In memory only', 'In document.body', 'In a DocumentFragment'],
    ans: 1,
    explain: 'createElement creates a new element in memory only. You must explicitly append it to the DOM tree using appendChild/insertBefore.',
  },
  {
    q: 'What is the nodeType value for an Element node?',
    opts: ['0', '1', '3', '9'],
    ans: 1,
    explain: 'Element nodes have nodeType === 1. Text = 3, Comment = 8, Document = 9.',
  },
  {
    q: 'What does insertBefore(newNode, null) do?',
    opts: ['Inserts at the beginning', 'Acts like appendChild (inserts at end)', 'Throws an error', 'Inserts before the first child'],
    ans: 1,
    explain: 'When the reference node is null, insertBefore behaves exactly like appendChild — it appends at the end.',
  },
];

const Quiz: React.FC = () => {
  return <UnifiedQuiz questions={quizData} />;
};

/* ═══════════════════════ MAIN CHAPTER COMPONENT ═══════════════════════ */

interface SectionHeaderProps {
  no: string;
  title: string;
  icon?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ no, title, icon }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
      borderBottom: '1px solid var(--nothing-border)',
      paddingBottom: '16px',
      marginTop: '16px'
    }}>
      {icon && <span style={{ color: 'var(--nothing-text)', display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--nothing-text-muted)',
        border: '1px solid var(--nothing-border)',
        padding: '2px 6px',
        fontWeight: 400,
        background: 'var(--nothing-surface-hover)',
      }}>
        {no}
      </span>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px',
        fontWeight: 700,
        letterSpacing: '-0.015em',
        color: 'var(--nothing-text)',
        textTransform: 'uppercase',
        margin: 0,
      }}>
        {title}
      </h2>
    </div>
  );
};


interface UnifiedQuizQuestion {
  q: string;
  opts: string[];
  ans: number;
  explain: string;
}

const UnifiedQuiz: React.FC<{ questions: UnifiedQuizQuestion[] }> = ({ questions }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.ans ? 1 : 0), 0);

  return (
    <div className="nt-quiz-container">
      {questions.map((q, qi) => (
        <div key={qi} className="nt-quiz-question-card">
          <div className="nt-quiz-question-text">
            <span className="nt-quiz-question-no">Q{qi + 1}.</span> {q.q}
          </div>
          <div>
            {q.opts.map((opt, oi) => {
              const chosen = answers[qi] === oi;
              const isCorrect = showResults && oi === q.ans;
              const isWrong = showResults && chosen && oi !== q.ans;
              return (
                <div
                  key={oi}
                  onClick={() => !showResults && setAnswers(prev => ({ ...prev, [qi]: oi }))}
                  className={`nt-quiz-option ${chosen ? 'chosen' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'incorrect' : ''} ${showResults ? 'disabled' : ''}`}
                >
                  {showResults && isCorrect && <span style={{ marginRight: '8px', color: 'var(--nothing-green)' }}>✓</span>}
                  {showResults && isWrong && <span style={{ marginRight: '8px', color: 'var(--nothing-red)' }}>✗</span>}
                  <span style={{ color: 'var(--nothing-text-dim)', marginRight: '8px' }}>{String.fromCharCode(65 + oi)}.</span>
                  {opt}
                </div>
              );
            })}
          </div>
          {showResults && (
            <div className="nt-quiz-explanation">
              <strong>Explanation: </strong> {q.explain}
            </div>
          )}
        </div>
      ))}
      <div className="nt-quiz-actions">
        <button className="nt-button" onClick={() => setShowResults(true)}>Check Answers</button>
        <button className="nt-button-secondary" onClick={() => { setAnswers({}); setShowResults(false); }}>Reset</button>
        {showResults && (
          <span className="nt-quiz-score">
            Score: {score} / {questions.length}
          </span>
        )}
      </div>
    </div>
  );
};


interface ChapterHeaderProps {
  num: string;
  title: string;
  subtitle: string;
  chapterWord: string;
}

const ChapterHeader: React.FC<ChapterHeaderProps> = ({ num, title, subtitle, chapterWord }) => {
  return (
    <div style={{ marginBottom: '40px', borderBottom: '1px solid var(--nothing-border)', paddingBottom: '24px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--nothing-text-dim)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
        {chapterWord}
      </div>
      <h1 style={{ fontFamily: 'var(--font-dot)', fontSize: '48px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0, lineHeight: 1.0, color: 'var(--nothing-text)' }} className="dot-text">
        {num} · {title}
      </h1>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--nothing-text-muted)', fontSize: '13px', marginTop: '12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {subtitle}
      </p>
    </div>
  );
};

export const Chapter12: React.FC = () => {
  return (
    <div className="nt-page">
      {/* ── HEADER ── */}
      <div style={{ marginBottom: '44px' }}>
        <div style={{ fontFamily: 'var(--font-dot)', fontSize: '60px', letterSpacing: '0.08em', lineHeight: 0.9, textTransform: 'uppercase' }}>
          12
        </div>
        <div style={{ fontFamily: 'var(--font-dot)', fontSize: '32px', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '8px' }}>
          Document Object Model
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-muted)', letterSpacing: '0.1em', marginTop: '8px' }}>
          DOM Tree · Selecting · Creating · Inserting · Removing · Collections · Dynamic Styling
        </div>
      </div>

      <div className="study-callout">
        <strong>Study route:</strong> think of the DOM as the browser's live tree. Master how to select nodes, inspect relationships, change structure, and explain why live collections behave differently from static query results.
      </div>

      {/* ═══════ SECTION 1: DOM TREE STRUCTURE ═══════ */}
      <div className="nt-section">
        <SectionHeader no="01" title="DOM Tree Structure" icon={<TreePine size={20} />} />

        <p className="nt-prose">
          When a browser loads an HTML page, it parses the markup and constructs a tree data structure called the
          <strong style={{ color: 'var(--nothing-text)' }}> Document Object Model (DOM)</strong>. Every element, text node, comment, and attribute
          becomes a <strong style={{ color: 'var(--nothing-text)' }}>node</strong> in this tree. JavaScript can then traverse, query, and
          manipulate this tree to dynamically change the page content, structure, and appearance.
        </p>

        <p className="nt-prose">
          The DOM is <strong style={{ color: 'var(--nothing-text)' }}>not</strong> your HTML source code — it's the browser's living, in-memory
          representation. If JavaScript modifies the DOM, the page updates immediately but the source file on disk stays unchanged.
        </p>

        {/* Node Types Table */}
        <div style={labelTag}>Node Types</div>
        <table className="nt-table">
          <thead>
            <tr>
              <th className="nt-th">Type</th>
              <th className="nt-th">nodeType</th>
              <th className="nt-th">Example</th>
              <th className="nt-th">nodeName</th>
              <th className="nt-th">nodeValue</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Document', '9', 'document', '#document', 'null'],
              ['Element', '1', '<div>, <p>, <a>', 'Tag name (uppercase)', 'null'],
              ['Text', '3', '"Hello World"', '#text', 'The text content'],
              ['Comment', '8', '<!-- comment -->', '#comment', 'Comment text'],
              ['Attribute', '2', 'class="foo"', 'Attribute name', 'Attribute value'],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => <td key={j} className="nt-td">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>

        {/* DOM Tree Diagram */}
        <div style={labelTag}>DOM Tree Visualization</div>
        <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '24px', marginBottom: '44px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '18px' }}>
            {/* document */}
            <div style={{ padding: '6px 16px', border: '2px solid var(--nothing-border)', color: '#888', marginBottom: '4px' }}>document (nodeType: 9)</div>
            <div style={{ width: '1px', height: '16px', background: 'var(--nothing-border)' }} />
            {/* html */}
            <div style={{ padding: '6px 16px', border: '1px solid var(--nothing-text-muted)', color: 'var(--nothing-text)', marginBottom: '4px' }}>&lt;html&gt;</div>
            <div style={{ width: '1px', height: '16px', background: 'var(--nothing-border)' }} />
            {/* head + body row */}
            <div style={{ display: 'flex', gap: '60px', position: 'relative' }}>
              {/* connecting line */}
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '220px', height: '1px', background: 'var(--nothing-border)' }} />
              {/* head branch */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '1px', height: '16px', background: 'var(--nothing-border)' }} />
                <div style={{ padding: '6px 16px', border: '1px solid var(--nothing-text-muted)', color: 'var(--nothing-text)', marginBottom: '4px' }}>&lt;head&gt;</div>
                <div style={{ width: '1px', height: '12px', background: 'var(--nothing-border)' }} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ padding: '4px 10px', border: '1px solid var(--nothing-border)', color: 'var(--nothing-text-dim)', fontSize: '17px' }}>&lt;title&gt;</div>
                  <div style={{ padding: '4px 10px', border: '1px solid var(--nothing-border)', color: 'var(--nothing-text-dim)', fontSize: '17px' }}>&lt;meta&gt;</div>
                </div>
              </div>
              {/* body branch */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '1px', height: '16px', background: 'var(--nothing-border)' }} />
                <div style={{ padding: '6px 16px', border: '1px solid var(--nothing-text-muted)', color: 'var(--nothing-text)', marginBottom: '4px' }}>&lt;body&gt;</div>
                <div style={{ width: '1px', height: '12px', background: 'var(--nothing-border)' }} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ padding: '4px 10px', border: '1px solid var(--nothing-border)', color: 'var(--nothing-text-dim)', fontSize: '17px' }}>&lt;h1&gt;</div>
                    <div style={{ width: '1px', height: '8px', background: 'var(--nothing-border)' }} />
                    <div style={{ padding: '2px 8px', border: '1px dashed var(--nothing-border)', color: '#555', fontSize: '18px' }}>"Hello"</div>
                  </div>
                  <div style={{ padding: '4px 10px', border: '1px solid var(--nothing-border)', color: 'var(--nothing-text-dim)', fontSize: '17px' }}>&lt;div&gt;</div>
                  <div style={{ padding: '4px 10px', border: '1px solid var(--nothing-border)', color: 'var(--nothing-text-dim)', fontSize: '17px' }}>&lt;p&gt;</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Node Properties Table */}
        <div style={labelTag}>Node Navigation Properties</div>
        <table className="nt-table">
          <thead>
            <tr>
              <th className="nt-th">Property</th>
              <th className="nt-th">Returns</th>
              <th className="nt-th">Notes</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['parentNode', 'Node | null', 'Parent of this node (Document for <html>)'],
              ['childNodes', 'NodeList (live)', 'ALL child nodes including text & comments'],
              ['children', 'HTMLCollection (live)', 'Only Element children (no text/comment)'],
              ['firstChild', 'Node | null', 'First child (may be text/whitespace!)'],
              ['lastChild', 'Node | null', 'Last child (may be text/whitespace!)'],
              ['firstElementChild', 'Element | null', 'First Element child (skips text nodes)'],
              ['lastElementChild', 'Element | null', 'Last Element child (skips text nodes)'],
              ['nextSibling', 'Node | null', 'Next sibling (may be text/whitespace!)'],
              ['previousSibling', 'Node | null', 'Previous sibling (may be text/whitespace!)'],
              ['nextElementSibling', 'Element | null', 'Next Element sibling (skips text)'],
              ['previousElementSibling', 'Element | null', 'Previous Element sibling (skips text)'],
              ['nodeType', 'number', '1=Element, 3=Text, 8=Comment, 9=Document'],
              ['nodeName', 'string', 'Tag name (uppercase) for elements, "#text" for text'],
              ['nodeValue', 'string | null', 'Text content for text/comment nodes, null for elements'],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ ...tdStyle, ...(j === 0 ? { color: 'var(--nothing-text)', fontWeight: 500 } : {}) }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div style={trapBox}>
          <AlertTriangle size={18} color="var(--nothing-red)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-red)', fontWeight: 600, marginBottom: 4 }}>
              WHITESPACE TRAP
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', color: 'var(--nothing-text-muted)' }}>
              Browsers treat whitespace between tags as <strong style={{ color: 'var(--nothing-text)' }}>Text nodes</strong>. So
              <code style={{ color: 'var(--nothing-text)' }}> firstChild</code> and <code style={{ color: 'var(--nothing-text)' }}>nextSibling</code> may
              return <code style={{ color: 'var(--nothing-text)' }}>#text</code> nodes containing just whitespace. Use
              <code style={{ color: 'var(--nothing-text)' }}> firstElementChild</code> and <code style={{ color: 'var(--nothing-text)' }}>nextElementSibling</code> to
              skip them.
            </div>
          </div>
        </div>

        <pre style={codeBlock}>{`// Traversal examples
const body = document.body;

body.childNodes;           // NodeList: [text, h1, text, div, text, p, text]
body.children;             // HTMLCollection: [h1, div, p]  — elements only

body.firstChild;           // #text (whitespace!)
body.firstElementChild;    // <h1>

const h1 = body.firstElementChild;
h1.nextSibling;            // #text (whitespace!)
h1.nextElementSibling;     // <div>

h1.nodeType;               // 1 (Element)
h1.nodeName;               // "H1"
h1.firstChild.nodeType;    // 3 (Text)
h1.firstChild.nodeValue;   // "Hello"`}</pre>
      </div>

      {/* ═══════ SECTION 2: SELECTING ELEMENTS ═══════ */}
      <div className="nt-section">
        <SectionHeader no="02" title="Selecting Elements" icon={<Search size={20} />} />

        <p className="nt-prose">
          Before you can manipulate an element, you need a reference to it. The DOM provides several methods on
          <code style={{ color: 'var(--nothing-text)' }}> document</code> (and on elements) to find nodes.
        </p>

        <div style={labelTag}>Selection Methods</div>
        <table className="nt-table">
          <thead>
            <tr>
              <th className="nt-th">Method</th>
              <th className="nt-th">Signature</th>
              <th className="nt-th">Returns</th>
              <th className="nt-th">Collection</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['getElementById', 'getElementById(id: string)', 'Element | null', '—'],
              ['getElementsByTagName', 'getElementsByTagName(tag: string)', 'HTMLCollection', 'LIVE'],
              ['getElementsByClassName', 'getElementsByClassName(cls: string)', 'HTMLCollection', 'LIVE'],
              ['querySelector', 'querySelector(css: string)', 'Element | null', '—'],
              ['querySelectorAll', 'querySelectorAll(css: string)', 'NodeList', 'STATIC'],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    ...tdStyle,
                    ...(j === 0 ? { color: 'var(--nothing-text)', fontWeight: 500 } : {}),
                    ...(j === 3 ? { color: cell === 'LIVE' ? '#0f0' : cell === 'STATIC' ? '#ff0' : 'var(--nothing-text-dim)' } : {}),
                  }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Live vs Static explanation */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '44px' }}>
          <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-green)', marginBottom: '8px', fontWeight: 600 }}>
              LIVE Collection (HTMLCollection)
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', color: 'var(--nothing-text-muted)', lineHeight: 1.9 }}>
              Automatically updates when the DOM changes. If you add or remove elements matching the query,
              the collection's <code style={{ color: 'var(--nothing-text)' }}>length</code> and contents update in real-time.
              Returned by <code style={{ color: 'var(--nothing-text)' }}>getElementsByTagName</code> and <code style={{ color: 'var(--nothing-text)' }}>getElementsByClassName</code>.
            </p>
          </div>
          <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-yellow)', marginBottom: '8px', fontWeight: 600 }}>
              STATIC Collection (NodeList)
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', color: 'var(--nothing-text-muted)', lineHeight: 1.9 }}>
              A snapshot taken at the moment of the call. Adding/removing elements from the DOM does NOT change the list.
              Returned by <code style={{ color: 'var(--nothing-text)' }}>querySelectorAll</code>. Safer for iteration because
              the list won't change under your feet.
            </p>
          </div>
        </div>

        <pre style={codeBlock}>{`// ── getElementById ──
const header = document.getElementById('main-header');
// Returns the ONE element with id="main-header", or null

// ── getElementsByTagName ── (LIVE)
const allParas = document.getElementsByTagName('p');
console.log(allParas.length);  // e.g. 5
// If you add a new <p>, allParas.length automatically becomes 6!

// ── getElementsByClassName ── (LIVE)
const warnings = document.getElementsByClassName('warning');
// Returns all elements with class="warning"

// ── querySelector ── (first match)
const first = document.querySelector('.card > h2');
// Returns first element matching CSS selector, or null

// ── querySelectorAll ── (STATIC)
const allCards = document.querySelectorAll('.card');
// Returns a static NodeList of ALL matching elements

// You can also call querySelector on any element:
const nav = document.querySelector('nav');
const navLinks = nav.querySelectorAll('a');  // only <a> inside <nav>`}</pre>

        <div style={trapBox}>
          <AlertTriangle size={18} color="var(--nothing-red)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-red)', fontWeight: 600, marginBottom: 4 }}>
              LIVE COLLECTION TRAP
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', color: 'var(--nothing-text-muted)' }}>
              Iterating a live collection with a <code style={{ color: 'var(--nothing-text)' }}>for</code> loop while adding/removing
              elements can cause <strong style={{ color: 'var(--nothing-text)' }}>infinite loops or skipped elements</strong> because
              the length changes during iteration. Convert to array first:
              <code style={{ color: 'var(--nothing-text)' }}> [...liveCollection]</code> or <code style={{ color: 'var(--nothing-text)' }}>Array.from(liveCollection)</code>.
            </div>
          </div>
        </div>

        <pre style={codeBlock}>{`// DANGER: Looping a live collection while modifying DOM
const divs = document.getElementsByTagName('div'); // LIVE!
for (let i = 0; i < divs.length; i++) {
  divs[i].remove(); // length shrinks, indices shift → skips elements!
}

// SAFE: Convert to static array first
const divArr = [...document.getElementsByTagName('div')];
divArr.forEach(div => div.remove()); // Works correctly`}</pre>
      </div>

      {/* ═══════ SECTION 3: CREATING / INSERTING / REMOVING ═══════ */}
      <div className="nt-section">
        <SectionHeader no="03" title="Creating, Inserting & Removing Nodes" icon={<PlusCircle size={20} />} />

        <p className="nt-prose">
          The DOM API lets you create new nodes, insert them at specific positions, replace existing nodes,
          remove nodes, and clone subtrees — all programmatically.
        </p>

        <div style={labelTag}>Mutation Methods</div>
        <table className="nt-table">
          <thead>
            <tr>
              <th className="nt-th">Method</th>
              <th className="nt-th">Signature</th>
              <th className="nt-th">Returns</th>
              <th className="nt-th">Key Behavior</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['createElement', 'document.createElement(tag)', 'Element', 'Creates IN MEMORY ONLY!'],
              ['createTextNode', 'document.createTextNode(text)', 'Text', 'Creates text node in memory'],
              ['appendChild', 'parent.appendChild(node)', 'The appended node', 'Appends as last child; MOVES existing nodes'],
              ['insertBefore', 'parent.insertBefore(new, ref)', 'The inserted node', 'Inserts before ref; if ref=null → appendChild'],
              ['replaceChild', 'parent.replaceChild(new, old)', 'The replaced (old) node', 'Replaces old with new'],
              ['removeChild', 'parent.removeChild(node)', 'The removed node', 'Must be called on the PARENT'],
              ['cloneNode', 'node.cloneNode(deep)', 'Cloned node', 'true = deep (with children), false = shallow'],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    ...tdStyle,
                    ...(j === 0 ? { color: 'var(--nothing-text)', fontWeight: 500 } : {}),
                    ...(j === 3 && cell.includes('!') ? { color: 'var(--nothing-red)' } : {}),
                  }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div style={labelTag}>Common Pattern: Create → Configure → Append</div>
        <pre style={codeBlock}>{`// Step 1: Create element (exists in memory only)
const card = document.createElement('div');

// Step 2: Configure it
card.className = 'card';
card.id = 'new-card';
card.textContent = 'Hello World';
card.setAttribute('data-index', '1');

// Step 3: Append to DOM (NOW it's visible)
document.body.appendChild(card);

// ── Building a complex structure ──
const list = document.createElement('ul');
for (let i = 1; i <= 3; i++) {
  const li = document.createElement('li');
  li.textContent = 'Item ' + i;
  list.appendChild(li);
}
document.getElementById('container').appendChild(list);`}</pre>

        <pre style={codeBlock}>{`// ── insertBefore ──
const parent = document.getElementById('list');
const newItem = document.createElement('li');
newItem.textContent = 'Inserted!';
const refNode = parent.children[1]; // insert before 2nd child
parent.insertBefore(newItem, refNode);

// insertBefore with null reference → acts like appendChild
parent.insertBefore(newItem, null); // appends at end

// ── replaceChild ──
const oldPara = document.querySelector('.old');
const newPara = document.createElement('p');
newPara.textContent = 'Replaced content!';
oldPara.parentNode.replaceChild(newPara, oldPara);

// ── removeChild ──
const child = document.querySelector('.delete-me');
child.parentNode.removeChild(child);
// OR the modern shorthand:
child.remove();

// ── cloneNode ──
const original = document.querySelector('.template');
const shallowCopy = original.cloneNode(false);  // no children
const deepCopy = original.cloneNode(true);       // with children
document.body.appendChild(deepCopy);`}</pre>

        {/* Traps */}
        <div style={trapBox}>
          <AlertTriangle size={18} color="var(--nothing-red)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-red)', fontWeight: 600, marginBottom: 4 }}>
              DOM MUTATION TRAPS
            </div>
            <ul style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', color: 'var(--nothing-text-muted)', paddingLeft: '16px', lineHeight: 1.9 }}>
              <li><strong style={{ color: 'var(--nothing-text)' }}>createElement</strong> creates in memory ONLY — you must explicitly attach it with appendChild or insertBefore</li>
              <li><strong style={{ color: 'var(--nothing-text)' }}>appendChild of existing node</strong> MOVES it (doesn't copy!). To copy, use cloneNode first</li>
              <li><strong style={{ color: 'var(--nothing-text)' }}>removeChild</strong> must be called on the PARENT: <code style={{ color: 'var(--nothing-text)' }}>node.parentNode.removeChild(node)</code></li>
              <li><strong style={{ color: 'var(--nothing-text)' }}>insertBefore(newNode, null)</strong> behaves exactly like appendChild</li>
              <li><strong style={{ color: 'var(--nothing-text)' }}>cloneNode</strong> does NOT copy event listeners — only DOM structure and attributes</li>
            </ul>
          </div>
        </div>

        {/* Interactive DOM Surgeon */}
        <div style={{ borderTop: '1px solid var(--nothing-border)', paddingTop: '24px', marginTop: '16px' }}>
          <div style={labelTag}>Interactive · DOM Surgeon</div>
          <p style={{ ...prose, marginBottom: '44px' }}>
            Click nodes to select them, then use the mutation buttons to modify the tree. Watch the action log.
          </p>
          <DomSurgeon />
        </div>
      </div>

      {/* ═══════ SECTION 4: DOCUMENT COLLECTIONS ═══════ */}
      <div className="nt-section">
        <SectionHeader no="04" title="Document Collections" icon={<Layers size={20} />} />

        <p className="nt-prose">
          The <code style={{ color: 'var(--nothing-text)' }}>document</code> object provides built-in HTMLCollections for commonly accessed element types.
          These are <strong style={{ color: 'var(--nothing-text)' }}>live collections</strong> that update automatically.
        </p>

        <table className="nt-table">
          <thead>
            <tr>
              <th className="nt-th">Collection</th>
              <th className="nt-th">Contains</th>
              <th className="nt-th">Access</th>
              <th className="nt-th">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['document.images', 'All <img> elements', 'document.images[0]', 'Active'],
              ['document.links', 'All <a> with href attribute', 'document.links[0]', 'Active'],
              ['document.forms', 'All <form> elements', 'document.forms["myForm"]', 'Active'],
              ['document.anchors', 'All <a> with name attribute', 'document.anchors[0]', 'DEPRECATED'],
              ['document.scripts', 'All <script> elements', 'document.scripts[0]', 'Active'],
              ['document.styleSheets', 'All stylesheets', 'document.styleSheets[0]', 'Active'],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    ...tdStyle,
                    ...(j === 0 ? { color: 'var(--nothing-text)', fontWeight: 500 } : {}),
                    ...(j === 3 && cell === 'DEPRECATED' ? { color: 'var(--nothing-red)' } : {}),
                  }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <pre style={codeBlock}>{`// ── Accessing document collections ──

// All images on the page
const imgs = document.images;
console.log(imgs.length);       // number of <img> elements
console.log(imgs[0].src);       // src of the first image

// All forms — access by index or name
const form = document.forms[0];           // first form
const named = document.forms['loginForm']; // form with name="loginForm"

// All links (only <a> with href)
for (let i = 0; i < document.links.length; i++) {
  console.log(document.links[i].href);
}

// Accessing form elements within a form
const email = document.forms['login'].elements['email'];
console.log(email.value);

// ⚠ document.anchors is DEPRECATED — do not use
// It returned <a> elements with name attribute (not href)`}</pre>
      </div>

      {/* ═══════ SECTION 5: DYNAMIC STYLING ═══════ */}
      <div className="nt-section">
        <SectionHeader no="05" title="Dynamic Styling" icon={<Paintbrush size={20} />} />

        <p className="nt-prose">
          JavaScript can dynamically change an element's visual appearance by modifying its
          <strong style={{ color: 'var(--nothing-text)' }}> inline styles</strong> (via <code style={{ color: 'var(--nothing-text)' }}>element.style</code>)
          or by toggling <strong style={{ color: 'var(--nothing-text)' }}>CSS classes</strong> (via <code style={{ color: 'var(--nothing-text)' }}>element.classList</code>).
          The classList API is preferred because it keeps styling concerns in CSS.
        </p>

        <div style={labelTag}>classList API</div>
        <table className="nt-table">
          <thead>
            <tr>
              <th className="nt-th">Method</th>
              <th className="nt-th">Signature</th>
              <th className="nt-th">Returns</th>
              <th className="nt-th">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['add', 'classList.add(cls1, cls2, ...)', 'void', 'Adds one or more classes (ignores if already present)'],
              ['remove', 'classList.remove(cls1, cls2, ...)', 'void', 'Removes one or more classes (no error if absent)'],
              ['toggle', 'classList.toggle(cls, force?)', 'boolean', 'Toggles class on/off; returns new state. force=true → add, force=false → remove'],
              ['contains', 'classList.contains(cls)', 'boolean', 'Returns true if class is present'],
              ['replace', 'classList.replace(old, new)', 'boolean', 'Replaces old class with new; returns true if old existed'],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ ...tdStyle, ...(j === 0 ? { color: 'var(--nothing-text)', fontWeight: 500 } : {}) }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <pre style={codeBlock}>{`// ── classList examples ──
const box = document.querySelector('.box');

box.classList.add('active', 'visible');
box.classList.remove('hidden');
box.classList.toggle('dark-mode');       // adds if absent, removes if present
box.classList.contains('active');         // true
box.classList.replace('active', 'inactive');

// ── Inline styles ──
box.style.backgroundColor = 'red';       // camelCase!
box.style.border = '2px solid white';
box.style.transform = 'rotate(45deg)';
box.style.cssText = 'color: red; font-size: 20px;'; // overwrites all inline styles

// Read computed (final) style
const computed = getComputedStyle(box);
console.log(computed.fontSize);          // "16px" (resolved value)

// ── Animation with setInterval ──
let angle = 0;
const timer = setInterval(() => {
  angle = (angle + 5) % 360;
  box.style.transform = \`rotate(\${angle}deg)\`;
}, 50);
clearInterval(timer); // stop the animation

// ── Animation with requestAnimationFrame (smoother) ──
function animate() {
  angle = (angle + 2) % 360;
  box.style.transform = \`rotate(\${angle}deg)\`;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);`}</pre>

        <div style={trapBox}>
          <AlertTriangle size={18} color="var(--nothing-red)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-red)', fontWeight: 600, marginBottom: 4 }}>
              STYLING BEST PRACTICE
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', color: 'var(--nothing-text-muted)' }}>
              Prefer <code style={{ color: 'var(--nothing-text)' }}>classList.add/remove/toggle</code> over direct <code style={{ color: 'var(--nothing-text)' }}>style</code> manipulation.
              Keep visual rules in CSS; use JavaScript only to toggle <strong style={{ color: 'var(--nothing-text)' }}>state classes</strong> like
              <code style={{ color: 'var(--nothing-text)' }}> .active</code>, <code style={{ color: 'var(--nothing-text)' }}>.hidden</code>, <code style={{ color: 'var(--nothing-text)' }}>.error</code>.
              Inline styles have highest specificity and are harder to override.
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--nothing-border)', paddingTop: '24px', marginTop: '16px' }}>
          <div style={labelTag}>Interactive · Style Toggle Lab</div>
          <p style={{ ...prose, marginBottom: '44px' }}>
            Use the controls to dynamically add/remove classes and change inline styles. Watch the preview update.
          </p>
          <StyleToggle />
        </div>
      </div>

      {/* ═══════ SECTION 6: CHEAT SHEET ═══════ */}
      <div className="nt-section">
        <SectionHeader no="06" title="Cheat Sheet" icon={<BookOpen size={20} />} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {/* Selecting */}
          <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '24px' }}>
            <div style={{ ...labelTag, marginBottom: '10px' }}>Selecting Elements</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-muted)', whiteSpace: 'pre', lineHeight: 1.9 }}>
{`getElementById(id)        → Element|null
getElementsByTagName(tag) → HTMLCollection ◉LIVE
getElementsByClassName(c) → HTMLCollection ◉LIVE
querySelector(css)        → Element|null
querySelectorAll(css)     → NodeList ○STATIC`}
            </pre>
          </div>

          {/* Creating */}
          <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '24px' }}>
            <div style={{ ...labelTag, marginBottom: '10px' }}>Creating & Inserting</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-muted)', whiteSpace: 'pre', lineHeight: 1.9 }}>
{`document.createElement(tag) → Element
document.createTextNode(s)  → Text
parent.appendChild(node)    → appended node
parent.insertBefore(n, ref) → inserted node
parent.replaceChild(n, old) → replaced node
parent.removeChild(node)    → removed node
node.cloneNode(deep)        → cloned node`}
            </pre>
          </div>

          {/* Traversal */}
          <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '24px' }}>
            <div style={{ ...labelTag, marginBottom: '10px' }}>Traversal (All Nodes)</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-muted)', whiteSpace: 'pre', lineHeight: 1.9 }}>
{`node.parentNode
node.childNodes        (NodeList, live)
node.firstChild
node.lastChild
node.nextSibling
node.previousSibling
node.nodeType / nodeName / nodeValue`}
            </pre>
          </div>

          {/* Element Traversal */}
          <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '24px' }}>
            <div style={{ ...labelTag, marginBottom: '10px' }}>Traversal (Elements Only)</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-muted)', whiteSpace: 'pre', lineHeight: 1.9 }}>
{`el.children             (HTMLCollection, live)
el.firstElementChild
el.lastElementChild
el.nextElementSibling
el.previousElementSibling
el.childElementCount`}
            </pre>
          </div>

          {/* classList */}
          <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '24px' }}>
            <div style={{ ...labelTag, marginBottom: '10px' }}>classList API</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-muted)', whiteSpace: 'pre', lineHeight: 1.9 }}>
{`el.classList.add('a', 'b')
el.classList.remove('a', 'b')
el.classList.toggle('a')      → boolean
el.classList.toggle('a', force)
el.classList.contains('a')    → boolean
el.classList.replace('a','b') → boolean`}
            </pre>
          </div>

          {/* Content & Attributes */}
          <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '24px' }}>
            <div style={{ ...labelTag, marginBottom: '10px' }}>Content & Attributes</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-muted)', whiteSpace: 'pre', lineHeight: 1.9 }}>
{`el.textContent         (text only)
el.innerHTML           (HTML string)
el.outerHTML           (includes el itself)
el.getAttribute(name)
el.setAttribute(name, value)
el.removeAttribute(name)
el.hasAttribute(name)  → boolean
el.dataset.key         (data-* attributes)`}
            </pre>
          </div>

          {/* Styling */}
          <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '24px' }}>
            <div style={{ ...labelTag, marginBottom: '10px' }}>Inline Styles</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-muted)', whiteSpace: 'pre', lineHeight: 1.9 }}>
{`el.style.propertyName = value
el.style.cssText = 'full css string'
getComputedStyle(el).property
el.style.removeProperty('color')`}
            </pre>
          </div>

          {/* Collections */}
          <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '24px' }}>
            <div style={{ ...labelTag, marginBottom: '10px' }}>Document Collections</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-muted)', whiteSpace: 'pre', lineHeight: 1.9 }}>
{`document.images        → all <img>
document.links         → all <a href>
document.forms         → all <form>
document.forms[0].elements → form controls
document.scripts       → all <script>
document.anchors       → DEPRECATED`}
            </pre>
          </div>

          {/* Node Type Constants */}
          <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '24px' }}>
            <div style={{ ...labelTag, marginBottom: '10px' }}>nodeType Constants</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-muted)', whiteSpace: 'pre', lineHeight: 1.9 }}>
{`1  Node.ELEMENT_NODE
2  Node.ATTRIBUTE_NODE
3  Node.TEXT_NODE
8  Node.COMMENT_NODE
9  Node.DOCUMENT_NODE
10 Node.DOCUMENT_TYPE_NODE
11 Node.DOCUMENT_FRAGMENT_NODE`}
            </pre>
          </div>
        </div>
      </div>

      {/* ═══════ SECTION 7: QUIZ ═══════ */}
      <div className="nt-section">
        <SectionHeader no="07" title="Quiz" icon={<HelpCircle size={20} />} />
        <p style={{ ...prose, marginBottom: '20px' }}>
          Test your understanding of the Document Object Model. Select one answer per question, then click <strong style={{ color: 'var(--nothing-text)' }}>Check Answers</strong>.
        </p>
        <Quiz />
      </div>
    </div>
  );
};
