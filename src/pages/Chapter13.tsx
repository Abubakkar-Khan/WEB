import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Zap, MousePointer, Keyboard, FileText, Layers, ShieldOff, GitMerge, BookOpen, HelpCircle } from 'lucide-react';

/* ─── style constants ─── */
const sectionStyle: React.CSSProperties = {
  marginBottom: '48px',
};
const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-dot)',
  fontSize: '28px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: '24px',
  color: 'var(--nothing-text)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};
const cardStyle: React.CSSProperties = {
  background: 'var(--nothing-surface)',
  border: '1px solid var(--nothing-border)',
  borderRadius: '0',
  padding: '24px',
  marginBottom: '20px',
};
const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
};
const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 12px',
  borderBottom: '2px solid var(--nothing-border)',
  color: 'var(--nothing-text-muted)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: '11px',
};
const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--nothing-border)',
  verticalAlign: 'top',
};
const codeBlock: React.CSSProperties = {
  background: 'var(--nothing-bg)',
  border: '1px solid var(--nothing-border)',
  padding: '16px',
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  overflowX: 'auto',
  lineHeight: 1.7,
  color: 'var(--nothing-text)',
  whiteSpace: 'pre',
  marginBottom: '16px',
};
const labelMono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  color: 'var(--nothing-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  marginBottom: '8px',
};
const pitfallBox: React.CSSProperties = {
  background: '#1a0000',
  border: '1px solid var(--nothing-red)',
  padding: '16px',
  marginBottom: '16px',
};
const tipBox: React.CSSProperties = {
  background: '#001a00',
  border: '1px solid #2a6',
  padding: '16px',
  marginBottom: '16px',
};
const btnStyle: React.CSSProperties = {
  background: 'var(--nothing-text)',
  color: 'var(--nothing-bg)',
  border: 'none',
  padding: '8px 20px',
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

/* ─────────────────────── COMPONENT ─────────────────────── */
export const Chapter13: React.FC = () => {
  /* ── Section 1 – Event Radar state ── */
  const [radarData, setRadarData] = useState<Record<string, string>>({
    type: '—', target: '—', clientX: '—', clientY: '—',
    pageX: '—', pageY: '—', screenX: '—', screenY: '—',
    ctrlKey: '—', shiftKey: '—', altKey: '—', metaKey: '—',
    button: '—', key: '—', code: '—', timeStamp: '—',
  });

  const handleRadarMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setRadarData(prev => ({
      ...prev,
      type: e.type,
      target: (e.target as HTMLElement).tagName || '—',
      clientX: String(e.clientX),
      clientY: String(e.clientY),
      pageX: String(e.pageX),
      pageY: String(e.pageY),
      screenX: String(e.screenX),
      screenY: String(e.screenY),
      ctrlKey: String(e.ctrlKey),
      shiftKey: String(e.shiftKey),
      altKey: String(e.altKey),
      metaKey: String(e.metaKey),
      button: `${e.button} (${e.button === 0 ? 'left' : e.button === 1 ? 'middle' : 'right'})`,
      timeStamp: e.timeStamp.toFixed(1),
    }));
  }, []);

  const handleRadarKey = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    setRadarData(prev => ({
      ...prev,
      type: e.type,
      key: e.key,
      code: e.code,
      ctrlKey: String(e.ctrlKey),
      shiftKey: String(e.shiftKey),
      altKey: String(e.altKey),
      metaKey: String(e.metaKey),
      timeStamp: e.timeStamp.toFixed(1),
    }));
  }, []);

  /* ── Section 4 – Form Coach state ── */
  const [formValues, setFormValues] = useState({ name: '', email: '', comment: '' });
  const [formFocus, setFormFocus] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formResult, setFormResult] = useState<string | null>(null);

  const focusHints: Record<string, string> = {
    name: 'Enter your full name (min 2 characters)',
    email: 'Must end with @iiu.edu.pk',
    comment: 'Optional — any additional notes',
  };

  const validateField = (field: string, value: string): string => {
    if (field === 'name' && value.length < 2) return 'Name must be at least 2 characters';
    if (field === 'email' && !/^[^@\s]+@iiu\.edu\.pk$/.test(value)) return 'Must match pattern user@iiu.edu.pk';
    return '';
  };

  const handleFormBlur = (field: string) => {
    setFormFocus(null);
    const err = validateField(field, formValues[field as keyof typeof formValues]);
    setFormErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    errs.name = validateField('name', formValues.name);
    errs.email = validateField('email', formValues.email);
    setFormErrors(errs);
    const hasErr = Object.values(errs).some(v => v);
    if (hasErr) {
      setFormResult('❌ Validation failed. Check highlighted fields.');
    } else {
      const user = formValues.email.split('@')[0];
      setFormResult(`✅ Submitted! Token extracted from email: "${user}"`);
    }
  };

  const handleFormReset = () => {
    setFormValues({ name: '', email: '', comment: '' });
    setFormErrors({});
    setFormResult(null);
    setFormFocus(null);
  };

  /* ── Section 5 – Bubbling Chamber state ── */
  const [bubbleLog, setBubbleLog] = useState<string[]>([]);
  const [stopProp, setStopProp] = useState(false);
  const [captureMode, setCaptureMode] = useState(false);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const logBubble = (layer: string, phase: string, stop: boolean) => {
    setBubbleLog(prev => [...prev, `[${phase}] ${layer}`]);
    setActiveLayer(layer);
    setTimeout(() => setActiveLayer(null), 400);
    if (stop) return true;
    return false;
  };

  const handleBubbleClick = (layer: string) => (e: React.MouseEvent) => {
    const phase = e.eventPhase === 1 ? 'CAPTURE' : e.eventPhase === 2 ? 'TARGET' : 'BUBBLE';
    logBubble(layer, phase, false);
    if (stopProp && layer === 'inner') {
      e.stopPropagation();
      setBubbleLog(prev => [...prev, '🛑 stopPropagation() called on INNER']);
    }
  };

  /* ── Section 6 – delegation demo ── */
  const [delegationItems, setDelegationItems] = useState(['Item A', 'Item B', 'Item C']);
  const [delegationLog, setDelegationLog] = useState<string[]>([]);

  const handleDelegationClick = (e: React.MouseEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'LI') {
      setDelegationLog(prev => [...prev, `Clicked: ${target.textContent}`]);
    }
  };

  /* ── Quiz state ── */
  const questions = [
    {
      q: 'Which event does NOT bubble?',
      opts: ['click', 'mouseenter', 'keydown', 'submit'],
      ans: 1,
      explain: 'mouseenter does NOT bubble. Use mouseover if you need bubbling.',
    },
    {
      q: 'What does event.preventDefault() do?',
      opts: [
        'Stops event from reaching parent elements',
        'Prevents the browser\'s default action for the event',
        'Removes all event listeners',
        'Stops other handlers on the same element',
      ],
      ans: 1,
      explain: 'preventDefault() only prevents the browser default (e.g., form submission, link navigation). It does NOT stop propagation.',
    },
    {
      q: 'event.key vs event.code — which is affected by Shift?',
      opts: ['event.code', 'event.key', 'Both', 'Neither'],
      ans: 1,
      explain: 'event.key gives the character produced ("A" with Shift), while event.code gives the physical key ("KeyA" regardless of Shift).',
    },
    {
      q: 'What is the third parameter of addEventListener when set to true?',
      opts: ['Enable once mode', 'Enable passive mode', 'Use capturing phase', 'Prevent default'],
      ans: 2,
      explain: 'Passing true as the third argument registers the handler for the capturing phase instead of the default bubbling phase.',
    },
    {
      q: 'Which event fires in real-time as a user types?',
      opts: ['change', 'blur', 'input', 'submit'],
      ans: 2,
      explain: 'The "input" event fires on every keystroke in real time. "change" fires only on blur (when focus leaves the element).',
    },
    {
      q: 'In event delegation, the listener is attached to:',
      opts: ['Each child element', 'The target element', 'A parent/ancestor element', 'The window object only'],
      ans: 2,
      explain: 'Event delegation attaches ONE listener to a parent. It uses event.target to determine which child was actually clicked.',
    },
    {
      q: 'Which method stops propagation AND prevents other handlers on the SAME element?',
      opts: ['stopPropagation()', 'preventDefault()', 'stopImmediatePropagation()', 'cancelBubble()'],
      ans: 2,
      explain: 'stopImmediatePropagation() does both: stops propagation AND prevents remaining handlers on the same element from executing.',
    },
  ];
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [quizRevealed, setQuizRevealed] = useState(false);

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ═══ HEADER ═══ */}
      <header style={{ marginBottom: '40px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--nothing-text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Chapter Thirteen
        </div>
        <h1 style={{ fontFamily: 'var(--font-dot)', fontSize: '56px', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0, lineHeight: 0.95 }}>
          13 EVENTS
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--nothing-text-muted)', fontSize: '13px', marginTop: '12px', letterSpacing: '0.04em' }}>
          Mouse · Keyboard · Form · Bubbling · Capturing · Delegation
        </p>
      </header>

      {/* ═══ SECTION 1 — EVENT OBJECT PROPERTIES ═══ */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}><Zap size={22} /> Event Object Properties</h2>

        <p style={{ color: 'var(--nothing-text-muted)', fontFamily: 'var(--font-sans)', fontSize: '14px', marginBottom: '20px', lineHeight: 1.7 }}>
          Every event handler receives an <strong style={{ color: 'var(--nothing-text)' }}>Event object</strong> containing metadata about what happened. Mouse events carry coordinates; keyboard events carry key info; all events share a common base set of properties.
        </p>

        <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Property</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['type', 'string', 'Name of the event ("click", "keydown", etc.)'],
                ['target', 'Element', 'The element that ORIGINATED the event'],
                ['currentTarget', 'Element', 'The element the handler is attached to (may differ from target during bubbling)'],
                ['clientX / clientY', 'number', 'Mouse position relative to browser VIEWPORT (visible area)'],
                ['pageX / pageY', 'number', 'Mouse position relative to DOCUMENT (includes scroll offset)'],
                ['screenX / screenY', 'number', 'Mouse position relative to PHYSICAL SCREEN'],
                ['ctrlKey', 'boolean', 'true if Ctrl key held during event'],
                ['shiftKey', 'boolean', 'true if Shift key held during event'],
                ['altKey', 'boolean', 'true if Alt key held during event'],
                ['metaKey', 'boolean', 'true if Meta (Win/Cmd) key held during event'],
                ['button', 'number', '0 = left, 1 = middle (wheel), 2 = right'],
                ['timeStamp', 'number', 'Milliseconds since page load when event was created'],
                ['key', 'string', 'Character produced by keypress ("a", "Enter", "Shift")'],
                ['code', 'string', 'Physical key on keyboard ("KeyA", "Enter", "ShiftLeft")'],
                ['keyCode', 'number', '⚠ DEPRECATED – numeric key code, use key/code instead'],
                ['repeat', 'boolean', 'true if key is being held down (auto-repeat)'],
              ].map(([prop, type, desc], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text)', fontWeight: 600 }}>{prop}</td>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text-dim)' }}>{type}</td>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text-muted)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={pitfallBox}>
          <div style={labelMono}>⚠ Pitfall: target vs currentTarget</div>
          <p style={{ fontSize: '13px', color: 'var(--nothing-text-muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--nothing-text)' }}>event.target</strong> is the element that <em>originated</em> the event (e.g. the clicked button).
            <strong style={{ color: 'var(--nothing-text)' }}> event.currentTarget</strong> is the element the handler is <em>attached to</em> (may be a parent if bubbling). They are the same only when the listener is on the exact target element.
          </p>
        </div>

        {/* ── INTERACTIVE EVENT RADAR ── */}
        <div style={labelMono}>Interactive: Event Radar</div>
        <p style={{ color: 'var(--nothing-text-dim)', fontSize: '12px', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
          Move your mouse, click, or press keys inside the box below to see event properties update in real-time.
        </p>
        <div
          tabIndex={0}
          onMouseMove={handleRadarMouse}
          onMouseDown={handleRadarMouse}
          onMouseUp={handleRadarMouse}
          onClick={handleRadarMouse}
          onContextMenu={(e) => { e.preventDefault(); handleRadarMouse(e); }}
          onKeyDown={handleRadarKey}
          onKeyUp={handleRadarKey}
          style={{
            border: '1px solid var(--nothing-border)',
            background: 'var(--nothing-surface)',
            minHeight: '340px',
            padding: '20px',
            cursor: 'crosshair',
            outline: 'none',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '8px',
            alignContent: 'start',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: '8px', right: '12px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--nothing-text-dim)', textTransform: 'uppercase' }}>
            Click or press keys here ↓
          </div>
          {Object.entries(radarData).map(([k, v]) => (
            <div key={k} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '6px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nothing-border)' }}>
              <span style={{ color: 'var(--nothing-text-dim)', marginRight: '6px' }}>{k}:</span>
              <span style={{ color: v !== '—' ? 'var(--nothing-text)' : 'var(--nothing-text-dim)' }}>{v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 2 — MOUSE EVENTS ═══ */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}><MousePointer size={22} /> Mouse Events</h2>

        <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Event</th>
                <th style={thStyle}>Fires When</th>
                <th style={thStyle}>Bubbles?</th>
                <th style={thStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['click', 'Mouse button pressed & released on element', 'Yes', 'Fires after mousedown + mouseup'],
                ['dblclick', 'Two rapid clicks', 'Yes', 'Preceded by two click events'],
                ['mousedown', 'Button pressed (before release)', 'Yes', 'Fires on any button (check event.button)'],
                ['mouseup', 'Button released', 'Yes', 'Fires on any button'],
                ['mouseover', 'Pointer enters element', 'Yes ✓', 'Fires again entering children (bubbles)'],
                ['mouseout', 'Pointer leaves element', 'Yes ✓', 'Fires again leaving children (bubbles)'],
                ['mouseenter', 'Pointer enters element', 'No ✗', 'Does NOT fire on children — NO bubbling'],
                ['mouseleave', 'Pointer leaves element', 'No ✗', 'Does NOT fire on children — NO bubbling'],
                ['mousemove', 'Pointer moves over element', 'Yes', 'Fires many times — use throttle!'],
                ['contextmenu', 'Right-click / context menu', 'Yes', 'preventDefault() to suppress menu'],
              ].map(([evt, when, bubbles, notes], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text)', fontWeight: 600 }}>{evt}</td>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text-muted)' }}>{when}</td>
                  <td style={{ ...tdStyle, color: bubbles.includes('No') ? 'var(--nothing-red)' : '#2a6' }}>{bubbles}</td>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text-dim)', fontSize: '12px' }}>{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={pitfallBox}>
          <div style={labelMono}>⚠ mouseover vs mouseenter</div>
          <p style={{ fontSize: '13px', color: 'var(--nothing-text-muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--nothing-text)' }}>mouseover</strong> BUBBLES — it fires again when entering child elements.
            <strong style={{ color: 'var(--nothing-text)' }}> mouseenter</strong> does NOT bubble — it fires ONLY once when entering the element. Use mouseenter for hover effects, mouseover for delegation.
          </p>
        </div>

        <div style={cardStyle}>
          <div style={labelMono}>Code: Registering mouse events</div>
          <pre style={codeBlock}>{`// Add event listeners
const box = document.getElementById('box');

box.addEventListener('click', function(e) {
  console.log('Clicked at:', e.clientX, e.clientY);
  console.log('Button:', e.button); // 0=left, 1=middle, 2=right
});

box.addEventListener('dblclick', function(e) {
  console.log('Double clicked!');
});

// Suppress right-click menu
box.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  console.log('Right-click suppressed');
});

// mouseover bubbles into children, mouseenter does not
box.addEventListener('mouseenter', function(e) {
  this.style.background = 'red';
});
box.addEventListener('mouseleave', function(e) {
  this.style.background = '';
});`}</pre>
        </div>

        <div style={cardStyle}>
          <div style={labelMono}>Code: Click sequence</div>
          <pre style={codeBlock}>{`// Full click sequence:
// mousedown → mouseup → click
// For double click:
// mousedown → mouseup → click → mousedown → mouseup → click → dblclick

element.addEventListener('mousedown', () => console.log('1. mousedown'));
element.addEventListener('mouseup',   () => console.log('2. mouseup'));
element.addEventListener('click',     () => console.log('3. click'));
element.addEventListener('dblclick',  () => console.log('4. dblclick'));`}</pre>
        </div>
      </section>

      {/* ═══ SECTION 3 — KEYBOARD EVENTS ═══ */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}><Keyboard size={22} /> Keyboard Events</h2>

        <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Event</th>
                <th style={thStyle}>Fires When</th>
                <th style={thStyle}>Repeats?</th>
                <th style={thStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['keydown', 'Key is pressed down', 'Yes (auto-repeat)', 'Fires for ALL keys including Shift, Ctrl, Alt'],
                ['keyup', 'Key is released', 'No', 'Fires once on release'],
                ['keypress', 'Character key is pressed', 'Yes', '⚠ DEPRECATED – Do not use. Use keydown instead.'],
              ].map(([evt, when, repeats, notes], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text)', fontWeight: 600 }}>{evt}</td>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text-muted)' }}>{when}</td>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text-muted)' }}>{repeats}</td>
                  <td style={{ ...tdStyle, color: notes.includes('DEPRECATED') ? 'var(--nothing-red)' : 'var(--nothing-text-dim)', fontSize: '12px' }}>{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={cardStyle}>
          <div style={labelMono}>event.key vs event.code</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div style={{ padding: '16px', border: '1px solid var(--nothing-border)', background: 'var(--nothing-bg)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: 'var(--nothing-text)' }}>event.key</div>
              <p style={{ fontSize: '13px', color: 'var(--nothing-text-muted)', lineHeight: 1.6 }}>
                The <strong style={{ color: 'var(--nothing-text)' }}>character produced</strong> by the key press. Affected by Shift and keyboard layout.
              </p>
              <pre style={{ ...codeBlock, margin: '8px 0 0', border: 'none', padding: '10px' }}>{`// Press 'a'      → key = "a"
// Press Shift+'a' → key = "A"
// Press Enter     → key = "Enter"
// Press Shift     → key = "Shift"`}</pre>
            </div>
            <div style={{ padding: '16px', border: '1px solid var(--nothing-border)', background: 'var(--nothing-bg)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: 'var(--nothing-text)' }}>event.code</div>
              <p style={{ fontSize: '13px', color: 'var(--nothing-text-muted)', lineHeight: 1.6 }}>
                The <strong style={{ color: 'var(--nothing-text)' }}>physical key position</strong> on the keyboard. NOT affected by Shift or layout.
              </p>
              <pre style={{ ...codeBlock, margin: '8px 0 0', border: 'none', padding: '10px' }}>{`// Press 'a'      → code = "KeyA"
// Press Shift+'a' → code = "KeyA"
// Press Enter     → code = "Enter"
// Press LShift    → code = "ShiftLeft"`}</pre>
            </div>
          </div>
        </div>

        <div style={pitfallBox}>
          <div style={labelMono}>⚠ Pitfall: keyCode is deprecated</div>
          <p style={{ fontSize: '13px', color: 'var(--nothing-text-muted)', lineHeight: 1.6 }}>
            <code style={{ color: 'var(--nothing-text)' }}>event.keyCode</code> returns a numeric code (e.g., 13 for Enter, 65 for 'A'). It is <strong style={{ color: 'var(--nothing-red)' }}>DEPRECATED</strong> and inconsistent across browsers. Always use <code style={{ color: 'var(--nothing-text)' }}>event.key</code> or <code style={{ color: 'var(--nothing-text)' }}>event.code</code> instead.
          </p>
        </div>

        <div style={cardStyle}>
          <div style={labelMono}>Code: Keyboard event handling</div>
          <pre style={codeBlock}>{`document.addEventListener('keydown', function(e) {
  console.log('key:', e.key);       // "a", "A", "Enter"
  console.log('code:', e.code);     // "KeyA", "Enter"
  console.log('repeat:', e.repeat); // true if held down

  // Common patterns:
  if (e.key === 'Enter') { /* submit */ }
  if (e.key === 'Escape') { /* close modal */ }
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault(); // Prevent browser save dialog
    saveDocument();
  }
});

// keyup fires once on release, no repeat
document.addEventListener('keyup', function(e) {
  console.log('Released:', e.key);
});`}</pre>
        </div>
      </section>

      {/* ═══ SECTION 4 — FORM EVENTS ═══ */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}><FileText size={22} /> Form Events</h2>

        <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Event</th>
                <th style={thStyle}>Fires When</th>
                <th style={thStyle}>Bubbles?</th>
                <th style={thStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['focus', 'Element gains focus', 'No ✗', 'Does NOT bubble — use focusin for delegation'],
                ['blur', 'Element loses focus', 'No ✗', 'Does NOT bubble — use focusout for delegation'],
                ['focusin', 'Element gains focus', 'Yes ✓', 'Same as focus but BUBBLES — use for delegation'],
                ['focusout', 'Element loses focus', 'Yes ✓', 'Same as blur but BUBBLES — use for delegation'],
                ['submit', 'Form is submitted', 'Yes', 'Use preventDefault() to handle in JS'],
                ['reset', 'Form is reset', 'Yes', 'Fires before form values are cleared'],
                ['change', 'Value changed AND element lost focus', 'Yes', 'Fires on BLUR, not in real-time'],
                ['input', 'Value is being changed', 'Yes', 'Fires in REAL-TIME on every keystroke'],
              ].map(([evt, when, bubbles, notes], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text)', fontWeight: 600 }}>{evt}</td>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text-muted)' }}>{when}</td>
                  <td style={{ ...tdStyle, color: bubbles.includes('No') ? 'var(--nothing-red)' : '#2a6' }}>{bubbles}</td>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text-dim)', fontSize: '12px' }}>{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={pitfallBox}>
          <div style={labelMono}>⚠ Pitfall: change vs input</div>
          <p style={{ fontSize: '13px', color: 'var(--nothing-text-muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--nothing-text)' }}>change</strong> fires only when the element loses focus (on blur) — NOT while typing.
            <strong style={{ color: 'var(--nothing-text)' }}> input</strong> fires in <em>real-time</em> on every character typed. For live validation or search-as-you-type, use <code style={{ color: 'var(--nothing-text)' }}>input</code>.
          </p>
        </div>

        <div style={pitfallBox}>
          <div style={labelMono}>⚠ Pitfall: focus/blur don't bubble</div>
          <p style={{ fontSize: '13px', color: 'var(--nothing-text-muted)', lineHeight: 1.6 }}>
            <code style={{ color: 'var(--nothing-text)' }}>focus</code> and <code style={{ color: 'var(--nothing-text)' }}>blur</code> do NOT bubble. If you need to listen on a parent (event delegation), use <code style={{ color: 'var(--nothing-text)' }}>focusin</code> and <code style={{ color: 'var(--nothing-text)' }}>focusout</code> instead.
          </p>
        </div>

        {/* ── INTERACTIVE FORM COACH ── */}
        <div style={labelMono}>Interactive: Form Coach</div>
        <p style={{ color: 'var(--nothing-text-dim)', fontSize: '12px', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
          Focus on fields to see help. Blur to see validation. Submit to check all fields.
        </p>
        <div style={{ ...cardStyle, padding: '0' }}>
          <form onSubmit={handleFormSubmit} onReset={handleFormReset} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {(['name', 'email', 'comment'] as const).map(field => (
                <div key={field}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--nothing-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
                    {field}
                  </label>
                  {field === 'comment' ? (
                    <textarea
                      value={formValues[field]}
                      onChange={e => setFormValues(p => ({ ...p, [field]: e.target.value }))}
                      onFocus={() => setFormFocus(field)}
                      onBlur={() => handleFormBlur(field)}
                      rows={3}
                      style={{
                        width: '100%',
                        background: 'var(--nothing-bg)',
                        border: `1px solid ${formErrors[field] ? 'var(--nothing-red)' : formFocus === field ? 'var(--nothing-text)' : 'var(--nothing-border)'}`,
                        color: 'var(--nothing-text)',
                        padding: '10px 12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        resize: 'vertical',
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={formValues[field]}
                      onChange={e => setFormValues(p => ({ ...p, [field]: e.target.value }))}
                      onFocus={() => setFormFocus(field)}
                      onBlur={() => handleFormBlur(field)}
                      style={{
                        width: '100%',
                        background: 'var(--nothing-bg)',
                        border: `1px solid ${formErrors[field] ? 'var(--nothing-red)' : formFocus === field ? 'var(--nothing-text)' : 'var(--nothing-border)'}`,
                        color: 'var(--nothing-text)',
                        padding: '10px 12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                      }}
                    />
                  )}
                  {formFocus === field && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#2a6', marginTop: '4px' }}
                    >
                      💡 {focusHints[field]}
                    </motion.div>
                  )}
                  {formErrors[field] && !formFocus && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--nothing-red)', marginTop: '4px' }}>
                      ✗ {formErrors[field]}
                    </div>
                  )}
                </div>
              ))}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={btnStyle}>Submit</button>
                <button type="reset" style={{ ...btnStyle, background: 'transparent', color: 'var(--nothing-text-muted)', border: '1px solid var(--nothing-border)' }}>Reset</button>
              </div>
            </div>
          </form>
          {formResult && (
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: '13px', color: formResult.startsWith('✅') ? '#2a6' : 'var(--nothing-red)' }}>
              {formResult}
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={labelMono}>Code: IIUI Email Validation & Token Extraction</div>
          <pre style={codeBlock}>{`// Validate IIUI email pattern
const emailRegex = /^[^@\\s]+@iiu\\.edu\\.pk$/;

function validateEmail(email) {
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Must be user@iiu.edu.pk' };
  }
  // Extract username token
  const token = email.split('@')[0];
  return { valid: true, token: token };
}

// Usage:
validateEmail('ahmed@iiu.edu.pk');
// → { valid: true, token: 'ahmed' }

validateEmail('test@gmail.com');
// → { valid: false, error: 'Must be user@iiu.edu.pk' }

// Form submit handler with preventDefault
form.addEventListener('submit', function(e) {
  e.preventDefault(); // STOP form from reloading page
  const result = validateEmail(emailInput.value);
  if (result.valid) {
    console.log('Token:', result.token);
  }
});

// Reset handler
form.addEventListener('reset', function(e) {
  outputDiv.textContent = '';
});`}</pre>
        </div>
      </section>

      {/* ═══ SECTION 5 — BUBBLING & CAPTURING ═══ */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}><Layers size={22} /> Event Bubbling & Capturing</h2>

        <p style={{ color: 'var(--nothing-text-muted)', fontFamily: 'var(--font-sans)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.7 }}>
          When an event occurs, it doesn't just fire on the target element — it travels through the entire DOM tree in <strong style={{ color: 'var(--nothing-text)' }}>three phases</strong>.
        </p>

        {/* ── THREE PHASES DIAGRAM ── */}
        <div style={labelMono}>Three Phases of Event Propagation</div>
        <div style={{
          border: '1px solid var(--nothing-border)',
          background: 'var(--nothing-surface)',
          padding: '32px',
          marginBottom: '24px',
          overflowX: 'auto',
        }}>
          {/* Phase Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            <div style={{ color: '#f80', padding: '6px 14px', border: '1px solid #f80', textTransform: 'uppercase' }}>
              Phase 1: Capturing ↓
            </div>
            <div style={{ color: '#0af', padding: '6px 14px', border: '1px solid #0af', textTransform: 'uppercase' }}>
              Phase 2: Target ●
            </div>
            <div style={{ color: '#0f8', padding: '6px 14px', border: '1px solid #0f8', textTransform: 'uppercase' }}>
              Phase 3: Bubbling ↑
            </div>
          </div>

          {/* Nested boxes diagram */}
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Capturing path */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', textAlign: 'center' }}>
              <div style={{ color: '#f80', marginBottom: '4px' }}>CAPTURING ↓</div>
              {['window', 'document', 'html', 'body', 'div', '● button'].map((n, i) => (
                <div key={i} style={{
                  padding: '6px 20px',
                  border: `1px solid ${i === 5 ? '#0af' : '#f80'}`,
                  color: i === 5 ? '#0af' : '#f80',
                  marginBottom: '4px',
                  background: i === 5 ? 'rgba(0,170,255,0.1)' : 'transparent',
                }}>
                  {n}
                </div>
              ))}
            </div>

            {/* Arrow */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', color: 'var(--nothing-text-dim)' }}>→</div>

            {/* Bubbling path */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', textAlign: 'center' }}>
              <div style={{ color: '#0f8', marginBottom: '4px' }}>BUBBLING ↑</div>
              {['● button', 'div', 'body', 'html', 'document', 'window'].map((n, i) => (
                <div key={i} style={{
                  padding: '6px 20px',
                  border: `1px solid ${i === 0 ? '#0af' : '#0f8'}`,
                  color: i === 0 ? '#0af' : '#0f8',
                  marginBottom: '4px',
                  background: i === 0 ? 'rgba(0,170,255,0.1)' : 'transparent',
                }}>
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={labelMono}>addEventListener Third Parameter</div>
          <pre style={codeBlock}>{`// Default: BUBBLING phase (third param = false or omitted)
element.addEventListener('click', handler);       // bubbling
element.addEventListener('click', handler, false); // bubbling (explicit)

// CAPTURING phase (third param = true)
element.addEventListener('click', handler, true);  // capturing

// Options object (modern):
element.addEventListener('click', handler, {
  capture: true,  // use capturing phase
  once: true,     // auto-remove after first invocation
  passive: true,  // promise not to call preventDefault (scroll perf)
});`}</pre>
        </div>

        {/* ── INTERACTIVE BUBBLING CHAMBER ── */}
        <div style={labelMono}>Interactive: Bubbling Chamber</div>
        <p style={{ color: 'var(--nothing-text-dim)', fontSize: '12px', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
          Click the inner div. Watch the event bubble up through the layers.
        </p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--nothing-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={stopProp} onChange={e => setStopProp(e.target.checked)} style={{ accentColor: 'var(--nothing-text)' }} />
            stopPropagation on INNER
          </label>
          <button
            onClick={() => setBubbleLog([])}
            style={{ ...btnStyle, padding: '4px 12px', fontSize: '11px', background: 'transparent', color: 'var(--nothing-text-muted)', border: '1px solid var(--nothing-border)' }}
          >
            Clear Log
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Nested divs */}
          <div
            onClick={handleBubbleClick('outer')}
            style={{
              border: `2px solid ${activeLayer === 'outer' ? '#0f8' : 'var(--nothing-border)'}`,
              background: activeLayer === 'outer' ? 'rgba(0,255,136,0.08)' : '#0a0a0a',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              position: 'relative',
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--nothing-text-dim)', position: 'absolute', top: '6px', left: '8px', textTransform: 'uppercase' }}>
              outer div
            </div>
            <div
              onClick={handleBubbleClick('middle')}
              style={{
                border: `2px solid ${activeLayer === 'middle' ? '#f80' : 'var(--nothing-border)'}`,
                background: activeLayer === 'middle' ? 'rgba(255,136,0,0.08)' : '#111',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                marginTop: '16px',
                position: 'relative',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--nothing-text-dim)', position: 'absolute', top: '6px', left: '8px', textTransform: 'uppercase' }}>
                middle div
              </div>
              <div
                onClick={handleBubbleClick('inner')}
                style={{
                  border: `2px solid ${activeLayer === 'inner' ? '#0af' : 'var(--nothing-border)'}`,
                  background: activeLayer === 'inner' ? 'rgba(0,170,255,0.1)' : '#1a1a1a',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  marginTop: '16px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--nothing-text-muted)',
                }}
              >
                inner div — click me!
              </div>
            </div>
          </div>

          {/* Log panel */}
          <div style={{
            border: '1px solid var(--nothing-border)',
            background: 'var(--nothing-bg)',
            padding: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            maxHeight: '260px',
            overflowY: 'auto',
          }}>
            <div style={{ color: 'var(--nothing-text-dim)', textTransform: 'uppercase', marginBottom: '8px', fontSize: '10px', letterSpacing: '0.1em' }}>
              Propagation Log
            </div>
            {bubbleLog.length === 0 ? (
              <div style={{ color: 'var(--nothing-text-dim)' }}>Click inner div to see events...</div>
            ) : (
              bubbleLog.map((entry, i) => (
                <div key={i} style={{
                  padding: '4px 0',
                  color: entry.includes('CAPTURE') ? '#f80' : entry.includes('TARGET') ? '#0af' : entry.includes('🛑') ? 'var(--nothing-red)' : '#0f8',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  {i + 1}. {entry}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6 — stopPropagation vs preventDefault ═══ */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}><ShieldOff size={22} /> stopPropagation vs preventDefault</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div style={{ ...cardStyle, borderColor: '#f80' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: '#f80', marginBottom: '12px' }}>
              stopPropagation()
            </div>
            <p style={{ fontSize: '13px', color: 'var(--nothing-text-muted)', lineHeight: 1.7, marginBottom: '12px' }}>
              Stops the event from traveling <strong style={{ color: 'var(--nothing-text)' }}>up (bubbling) or down (capturing)</strong> the DOM tree. Other handlers on the <em>same</em> element still fire.
            </p>
            <pre style={{ ...codeBlock, border: 'none', padding: '10px' }}>{`inner.addEventListener('click', (e) => {
  e.stopPropagation();
  // parent's click handler will NOT fire
});`}</pre>
          </div>

          <div style={{ ...cardStyle, borderColor: '#0af' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: '#0af', marginBottom: '12px' }}>
              preventDefault()
            </div>
            <p style={{ fontSize: '13px', color: 'var(--nothing-text-muted)', lineHeight: 1.7, marginBottom: '12px' }}>
              Prevents the <strong style={{ color: 'var(--nothing-text)' }}>browser's default action</strong> for the event (e.g., form submit, link navigation, checkbox toggle). Does NOT affect propagation.
            </p>
            <pre style={{ ...codeBlock, border: 'none', padding: '10px' }}>{`form.addEventListener('submit', (e) => {
  e.preventDefault();
  // form will NOT reload the page
  // event still bubbles normally!
});`}</pre>
          </div>
        </div>

        <div style={{ ...cardStyle, borderColor: '#d71921' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: 'var(--nothing-red)', marginBottom: '12px' }}>
            stopImmediatePropagation()
          </div>
          <p style={{ fontSize: '13px', color: 'var(--nothing-text-muted)', lineHeight: 1.7, marginBottom: '12px' }}>
            Does everything <code style={{ color: 'var(--nothing-text)' }}>stopPropagation()</code> does <strong style={{ color: 'var(--nothing-text)' }}>PLUS</strong> prevents other handlers <em>on the same element</em> from executing.
          </p>
          <pre style={{ ...codeBlock, border: 'none', padding: '10px' }}>{`// Two handlers on the same element:
btn.addEventListener('click', (e) => {
  console.log('Handler 1');
  e.stopImmediatePropagation();
});

btn.addEventListener('click', (e) => {
  console.log('Handler 2'); // NEVER fires!
});`}</pre>
        </div>

        <div style={tipBox}>
          <div style={labelMono}>🔑 Key Insight</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--nothing-text-muted)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--nothing-text)' }}>preventDefault()</strong> does <strong style={{ color: 'var(--nothing-red)' }}>NOT</strong> stop propagation.
              <br />The event still bubbles up to parent handlers.
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--nothing-text-muted)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--nothing-text)' }}>stopPropagation()</strong> does <strong style={{ color: 'var(--nothing-red)' }}>NOT</strong> prevent the default action.
              <br />The browser's default behavior still happens.
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={labelMono}>Comparison Table</div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Method</th>
                <th style={thStyle}>Stops Propagation?</th>
                <th style={thStyle}>Stops Same-Element Handlers?</th>
                <th style={thStyle}>Prevents Default?</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['stopPropagation()', 'Yes ✓', 'No ✗', 'No ✗'],
                ['stopImmediatePropagation()', 'Yes ✓', 'Yes ✓', 'No ✗'],
                ['preventDefault()', 'No ✗', 'No ✗', 'Yes ✓'],
              ].map(([method, prop, same, def], i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text)', fontWeight: 600 }}>{method}</td>
                  <td style={{ ...tdStyle, color: prop.includes('Yes') ? '#2a6' : 'var(--nothing-red)' }}>{prop}</td>
                  <td style={{ ...tdStyle, color: same.includes('Yes') ? '#2a6' : 'var(--nothing-red)' }}>{same}</td>
                  <td style={{ ...tdStyle, color: def.includes('Yes') ? '#2a6' : 'var(--nothing-red)' }}>{def}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══ SECTION 7 — EVENT DELEGATION ═══ */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}><GitMerge size={22} /> Event Delegation</h2>

        <p style={{ color: 'var(--nothing-text-muted)', fontFamily: 'var(--font-sans)', fontSize: '14px', marginBottom: '20px', lineHeight: 1.7 }}>
          Instead of attaching a listener to <em>every</em> child element, attach <strong style={{ color: 'var(--nothing-text)' }}>ONE listener to the parent</strong> and use <code style={{ color: 'var(--nothing-text)' }}>event.target</code> to determine which child was clicked. This leverages event bubbling.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { title: 'Memory Efficient', desc: 'One handler instead of N handlers. Fewer objects in memory.' },
            { title: 'Dynamic Elements', desc: 'Works with elements added AFTER the listener was attached.' },
            { title: 'Centralized Logic', desc: 'All event handling in one place, easier to maintain.' },
          ].map((b, i) => (
            <div key={i} style={{ ...cardStyle, padding: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--nothing-text)', marginBottom: '6px' }}>{b.title}</div>
              <p style={{ fontSize: '12px', color: 'var(--nothing-text-muted)', lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>

        <div style={pitfallBox}>
          <div style={labelMono}>⚠ Limitation: focus/blur don't bubble</div>
          <p style={{ fontSize: '13px', color: 'var(--nothing-text-muted)', lineHeight: 1.6 }}>
            <code style={{ color: 'var(--nothing-text)' }}>focus</code> and <code style={{ color: 'var(--nothing-text)' }}>blur</code> do NOT bubble, so delegation won't work with them. Use <code style={{ color: 'var(--nothing-text)' }}>focusin</code> and <code style={{ color: 'var(--nothing-text)' }}>focusout</code> instead (they bubble).
          </p>
        </div>

        <div style={cardStyle}>
          <div style={labelMono}>Code: Event delegation pattern</div>
          <pre style={codeBlock}>{`// BAD: Adding handler to EVERY button
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', handleClick); // N listeners!
});

// GOOD: ONE handler on the parent
document.getElementById('toolbar').addEventListener('click', function(e) {
  // Check what was actually clicked
  if (e.target.matches('.btn')) {
    handleClick(e);
  }
  // Or use closest() for nested elements
  const btn = e.target.closest('.btn');
  if (btn) {
    console.log('Clicked button:', btn.textContent);
  }
});

// Works with dynamically added elements!
const newBtn = document.createElement('button');
newBtn.className = 'btn';
newBtn.textContent = 'New Button';
toolbar.appendChild(newBtn);
// ↑ This button is automatically handled by the parent listener`}</pre>
        </div>

        {/* ── INTERACTIVE DELEGATION DEMO ── */}
        <div style={labelMono}>Interactive: Delegation Demo</div>
        <p style={{ color: 'var(--nothing-text-dim)', fontSize: '12px', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
          Click items below. ONE handler is on the &lt;ul&gt;, not on each &lt;li&gt;. Add items dynamically and they still work!
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <ul
              onClick={handleDelegationClick}
              style={{
                listStyle: 'none',
                padding: 0,
                border: '1px solid var(--nothing-border)',
                background: 'var(--nothing-surface)',
              }}
            >
              {delegationItems.map((item, i) => (
                <li
                  key={i}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--nothing-border)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: 'var(--nothing-text)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setDelegationItems(prev => [...prev, `Item ${String.fromCharCode(65 + prev.length)}`])}
              style={{ ...btnStyle, marginTop: '8px', width: '100%' }}
            >
              + Add Item (Dynamic)
            </button>
          </div>
          <div style={{
            border: '1px solid var(--nothing-border)',
            background: 'var(--nothing-bg)',
            padding: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            maxHeight: '220px',
            overflowY: 'auto',
          }}>
            <div style={{ color: 'var(--nothing-text-dim)', textTransform: 'uppercase', marginBottom: '8px', fontSize: '10px', letterSpacing: '0.1em' }}>
              Delegation Log (handler on &lt;ul&gt;)
            </div>
            {delegationLog.length === 0 ? (
              <div style={{ color: 'var(--nothing-text-dim)' }}>Click items...</div>
            ) : (
              delegationLog.map((entry, i) => (
                <div key={i} style={{ padding: '3px 0', color: '#2a6', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {i + 1}. {entry}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 8 — CHEAT SHEET ═══ */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}><BookOpen size={22} /> Cheat Sheet</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Event Registration */}
          <div style={cardStyle}>
            <div style={labelMono}>Event Registration</div>
            <pre style={{ ...codeBlock, fontSize: '12px' }}>{`// Add listener
el.addEventListener('click', fn);
el.addEventListener('click', fn, true); // capture
el.addEventListener('click', fn, {
  capture: true,
  once: true,
  passive: true
});

// Remove listener (must be same reference!)
el.removeEventListener('click', fn);

// Inline (HTML) — avoid this
<button onclick="handleClick()">

// DOM property — only one handler per event
el.onclick = function(e) { ... };`}</pre>
          </div>

          {/* Mouse Events */}
          <div style={cardStyle}>
            <div style={labelMono}>Mouse Events Quick Ref</div>
            <pre style={{ ...codeBlock, fontSize: '12px' }}>{`click       — press + release
dblclick    — two rapid clicks
mousedown   — button pressed
mouseup     — button released
mousemove   — pointer moves
mouseenter  — enter element (NO bubble)
mouseleave  — leave element (NO bubble)
mouseover   — enter element (BUBBLES)
mouseout    — leave element (BUBBLES)
contextmenu — right-click

e.button: 0=left, 1=middle, 2=right
e.clientX/Y: viewport coords
e.pageX/Y: document coords`}</pre>
          </div>

          {/* Keyboard Events */}
          <div style={cardStyle}>
            <div style={labelMono}>Keyboard Events Quick Ref</div>
            <pre style={{ ...codeBlock, fontSize: '12px' }}>{`keydown  — key pressed (repeats)
keyup    — key released (once)
keypress — DEPRECATED ✗

e.key:  "a", "A", "Enter", "Shift"
e.code: "KeyA", "Enter", "ShiftLeft"
e.keyCode: DEPRECATED numeric ✗
e.repeat: true if held down

// key = character (Shift-aware)
// code = physical key (Shift-unaware)`}</pre>
          </div>

          {/* Form Events */}
          <div style={cardStyle}>
            <div style={labelMono}>Form Events Quick Ref</div>
            <pre style={{ ...codeBlock, fontSize: '12px' }}>{`focus    — gained focus (NO bubble)
blur     — lost focus (NO bubble)
focusin  — gained focus (BUBBLES)
focusout — lost focus (BUBBLES)
submit   — form submitted
reset    — form reset
change   — value changed + blur
input    — value changing (real-time)

// For delegation: use focusin/focusout
// For live validation: use input
// For submit: always e.preventDefault()`}</pre>
          </div>

          {/* Propagation */}
          <div style={cardStyle}>
            <div style={labelMono}>Propagation</div>
            <pre style={{ ...codeBlock, fontSize: '12px' }}>{`// Three phases:
// 1. CAPTURING: root → target
// 2. TARGET: on the target element
// 3. BUBBLING: target → root

e.stopPropagation()
  — stops bubbling/capturing
  — other same-element handlers fire

e.stopImmediatePropagation()
  — stops bubbling/capturing
  — stops same-element handlers too

e.preventDefault()
  — stops browser default action
  — does NOT stop propagation`}</pre>
          </div>

          {/* Delegation */}
          <div style={cardStyle}>
            <div style={labelMono}>Delegation Pattern</div>
            <pre style={{ ...codeBlock, fontSize: '12px' }}>{`// One listener on parent:
parent.addEventListener('click', (e) => {
  if (e.target.matches('.child')) {
    // handle child click
  }
  // Or for nested elements:
  const el = e.target.closest('.child');
  if (el && parent.contains(el)) {
    // handle
  }
});

// Benefits: memory, dynamic, central
// Limitation: focus/blur don't bubble
//   → use focusin / focusout`}</pre>
          </div>
        </div>

        {/* Event Coordinates diagram */}
        <div style={{ ...cardStyle, marginTop: '12px' }}>
          <div style={labelMono}>Coordinate Systems Visualized</div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '24px',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            {[
              { name: 'clientX/Y', desc: 'Relative to VIEWPORT', color: '#0af', sub: '(visible area, ignores scroll)' },
              { name: 'pageX/Y', desc: 'Relative to DOCUMENT', color: '#f80', sub: '(includes scroll offset)' },
              { name: 'screenX/Y', desc: 'Relative to SCREEN', color: '#0f8', sub: '(physical monitor)' },
            ].map((c, i) => (
              <div key={i} style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                <div style={{
                  width: '110px',
                  height: '80px',
                  border: `2px solid ${c.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                  position: 'relative',
                  margin: '0 auto 8px',
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.color }} />
                  <div style={{ position: 'absolute', top: '4px', left: '4px', fontSize: '9px', color: c.color }}>0,0</div>
                </div>
                <div style={{ color: c.color, fontWeight: 700 }}>{c.name}</div>
                <div style={{ color: 'var(--nothing-text-muted)', fontSize: '11px' }}>{c.desc}</div>
                <div style={{ color: 'var(--nothing-text-dim)', fontSize: '10px' }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 9 — QUIZ ═══ */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}><HelpCircle size={22} /> Quiz</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {questions.map((q, qi) => (
            <div key={qi} style={{ ...cardStyle, borderColor: quizRevealed ? (quizAnswers[qi] === q.ans ? '#2a6' : 'var(--nothing-red)') : 'var(--nothing-border)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--nothing-text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Question {qi + 1}
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--nothing-text)', marginBottom: '16px', lineHeight: 1.6 }}>
                {q.q}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.opts.map((opt, oi) => {
                  const selected = quizAnswers[qi] === oi;
                  const isCorrect = oi === q.ans;
                  let bg = 'transparent';
                  let border = 'var(--nothing-border)';
                  if (quizRevealed && isCorrect) { bg = 'rgba(34,170,102,0.1)'; border = '#2a6'; }
                  else if (quizRevealed && selected && !isCorrect) { bg = 'rgba(215,25,33,0.1)'; border = 'var(--nothing-red)'; }
                  else if (selected) { bg = 'rgba(255,255,255,0.05)'; border = '#fff'; }

                  return (
                    <div
                      key={oi}
                      onClick={() => !quizRevealed && setQuizAnswers(prev => { const n = [...prev]; n[qi] = oi; return n; })}
                      style={{
                        padding: '10px 14px',
                        border: `1px solid ${border}`,
                        background: bg,
                        cursor: quizRevealed ? 'default' : 'pointer',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        color: 'var(--nothing-text-muted)',
                        transition: 'all 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span style={{
                        width: '20px',
                        height: '20px',
                        border: `1px solid ${selected ? 'var(--nothing-text)' : 'var(--nothing-border)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        flexShrink: 0,
                        color: selected ? 'var(--nothing-text)' : 'var(--nothing-text-dim)',
                      }}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </div>
                  );
                })}
              </div>
              {quizRevealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--nothing-border)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--nothing-text-muted)',
                    lineHeight: 1.6,
                  }}
                >
                  <strong style={{ color: 'var(--nothing-text)' }}>Explanation:</strong> {q.explain}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setQuizRevealed(true)}
            style={btnStyle}
          >
            Check Answers
          </button>
          <button
            onClick={() => { setQuizRevealed(false); setQuizAnswers(new Array(questions.length).fill(null)); }}
            style={{ ...btnStyle, background: 'transparent', color: 'var(--nothing-text-muted)', border: '1px solid var(--nothing-border)' }}
          >
            Reset Quiz
          </button>
          {quizRevealed && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--nothing-text-muted)' }}>
              Score: {quizAnswers.filter((a, i) => a === questions[i].ans).length} / {questions.length}
            </span>
          )}
        </div>
      </section>
    </div>
  );
};
