import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Globe, Send, ArrowRight, CheckCircle, XCircle, AlertTriangle, Search, User, ChevronDown, ChevronUp, Zap, Clock, Database, Code2, Server, BookOpen, FileText, HelpCircle, Activity, RefreshCw } from 'lucide-react';

// ─── Style Constants ────────────────────────────────────────────────
const sectionStyle: React.CSSProperties = {
  padding: '32px',
  background: 'var(--nothing-surface)',
  border: '1px solid var(--nothing-border)',
  marginBottom: '44px',
};

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-dot)',
  fontSize: '24px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  marginBottom: '44px',
  color: 'var(--nothing-text)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const subHeading: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '18px',
  color: 'var(--nothing-text)',
  marginBottom: '12px',
  marginTop: '20px',
};

const bodyText: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: '18px',
  lineHeight: '1.75',
  color: 'var(--nothing-text-muted)',
  marginBottom: '12px',
};

const codeBlock: React.CSSProperties = {
  background: 'var(--nothing-bg)',
  border: '1px solid var(--nothing-border)',
  padding: '24px',
  fontFamily: 'var(--font-mono)',
  fontSize: '18px',
  lineHeight: '1.7',
  color: '#ccc',
  overflowX: 'auto',
  marginBottom: '44px',
  whiteSpace: 'pre',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  fontFamily: 'var(--font-mono)',
  fontSize: '18px',
  marginBottom: '44px',
};

const thStyle: React.CSSProperties = {
  borderBottom: '2px solid var(--nothing-border)',
  padding: '12px 16px',
  textAlign: 'left' as const,
  color: 'var(--nothing-text)',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  fontSize: '17px',
};

const tdStyle: React.CSSProperties = {
  borderBottom: '1px solid var(--nothing-border)',
  padding: '12px 16px',
  color: 'var(--nothing-text-muted)',
  verticalAlign: 'top' as const,
};

const trapBox: React.CSSProperties = {
  background: 'rgba(215, 25, 33, 0.06)',
  border: '1px solid rgba(215, 25, 33, 0.3)',
  padding: '24px',
  marginBottom: '44px',
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-start',
};

const btnStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '18px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  padding: '10px 20px',
  border: '1px solid var(--nothing-text)',
  background: 'transparent',
  color: 'var(--nothing-text)',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '17px',
  padding: '10px 14px',
  border: '1px solid var(--nothing-border)',
  background: 'var(--nothing-bg)',
  color: 'var(--nothing-text)',
  width: '100%',
};

// ─── Interactive: Ajax Simulator ────────────────────────────────────
const AjaxSimulator: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [currentState, setCurrentState] = useState(-1);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [responseText, setResponseText] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const stateLabels = [
    { code: 0, name: 'UNSENT', desc: 'XHR created, open() not yet called', response: '' },
    { code: 1, name: 'OPENED', desc: 'open() has been called', response: '' },
    { code: 2, name: 'HEADERS_RECEIVED', desc: 'send() called, headers received', response: '' },
    { code: 3, name: 'LOADING', desc: 'Downloading response body...', response: '{"contacts":[...' },
    { code: 4, name: 'DONE', desc: 'Request complete!', response: '{"contacts":[{"name":"Alice"},{"name":"Bob"}]}' },
  ];

  const reset = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    setRunning(false);
    setCurrentState(-1);
    setStatusCode(null);
    setResponseText('');
    setLog([]);
  };

  const simulate = () => {
    reset();
    setRunning(true);
    setLog(['▸ Creating new XMLHttpRequest()...']);

    const delays = [500, 1200, 2000, 3000, 4200];
    const msgs = [
      '▸ readyState → 0 (UNSENT) — object created',
      '▸ xhr.open("GET", "/api/contacts", true)\n▸ readyState → 1 (OPENED)',
      '▸ xhr.send()\n▸ readyState → 2 (HEADERS_RECEIVED) — status 200',
      '▸ readyState → 3 (LOADING) — partial data arriving...',
      '▸ readyState → 4 (DONE) — full response received\n▸ status: 200 OK\n▸ JSON.parse(responseText) → Object',
    ];
    const statuses = [null, null, 200, 200, 200];

    delays.forEach((delay, i) => {
      const t = setTimeout(() => {
        setCurrentState(i);
        setStatusCode(statuses[i]);
        setResponseText(stateLabels[i].response);
        setLog(prev => [...prev, msgs[i]]);
        if (i === 4) setRunning(false);
      }, delay);
      timerRef.current.push(t);
    });
  };

  return (
    <div style={{ border: '1px solid var(--nothing-border)', padding: '24px', background: 'var(--nothing-bg)' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={simulate}
          disabled={running}
          style={{
            ...btnStyle,
            opacity: running ? 0.4 : 1,
            background: running ? 'transparent' : 'var(--nothing-text)',
            color: running ? 'var(--nothing-text-dim)' : 'var(--nothing-bg)',
          }}
        >
          {running ? '⟳ Simulating...' : '▶ Simulate Ajax Request'}
        </button>
        <button onClick={reset} style={{ ...btnStyle, borderColor: 'var(--nothing-border)' }}>
          Reset
        </button>
      </div>

      {/* Timeline */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '44px', alignItems: 'center' }}>
        {stateLabels.map((s, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                flex: 1,
                padding: '10px 8px',
                background: currentState >= i ? 'var(--nothing-text)' : 'var(--nothing-surface)',
                color: currentState >= i ? 'var(--nothing-bg)' : 'var(--nothing-text-dim)',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '18px',
                transition: 'all 0.4s ease',
                border: `1px solid ${currentState >= i ? 'var(--nothing-text)' : 'var(--nothing-border)'}`,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '2px' }}>{s.code}</div>
              <div>{s.name}</div>
            </div>
            {i < stateLabels.length - 1 && (
              <ArrowRight size={12} style={{ color: currentState > i ? 'var(--nothing-text)' : 'var(--nothing-text-dim)', flexShrink: 0 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Status display */}
      {currentState >= 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '44px' }}>
          <div style={{ padding: '18px', border: '1px solid var(--nothing-border)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-dim)', marginBottom: '4px' }}>STATUS CODE</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: statusCode ? '#4f4' : 'var(--nothing-text-dim)' }}>
              {statusCode ?? '—'}
            </div>
          </div>
          <div style={{ padding: '18px', border: '1px solid var(--nothing-border)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-dim)', marginBottom: '4px' }}>DESCRIPTION</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-muted)' }}>
              {stateLabels[currentState]?.desc}
            </div>
          </div>
        </div>
      )}

      {/* Response text */}
      {responseText && (
        <div style={{ marginBottom: '44px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-dim)', marginBottom: '4px' }}>responseText</div>
          <pre style={{ ...codeBlock, marginBottom: 0, color: 'var(--nothing-green)', fontSize: '17px' }}>{responseText}</pre>
        </div>
      )}

      {/* Log */}
      {log.length > 0 && (
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-dim)', marginBottom: '4px' }}>CONSOLE LOG</div>
          <pre style={{ ...codeBlock, marginBottom: 0, fontSize: '17px', color: 'var(--nothing-text-muted)', maxHeight: '160px', overflowY: 'auto' }}>
            {log.join('\n')}
          </pre>
        </div>
      )}
    </div>
  );
};

// ─── Interactive: JSON Playground ───────────────────────────────────
const JSONPlayground: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('{\n  "name": "Alice",\n  "age": 30,\n  "hobbies": ["reading", "cycling"],\n  "address": {\n    "city": "Vienna",\n    "zip": "1010"\n  }\n}');
  const [parseResult, setParseResult] = useState('');
  const [parseError, setParseError] = useState('');

  const [jsInput, setJsInput] = useState('{ name: "Bob", scores: [95, 88, 72], active: true }');
  const [stringifyResult, setStringifyResult] = useState('');

  const handleParse = () => {
    setParseError('');
    try {
      const parsed = JSON.parse(jsonInput);
      setParseResult(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setParseError(e.message);
      setParseResult('');
    }
  };

  const handleStringify = () => {
    try {
      // eslint-disable-next-line no-eval
      const obj = new Function('return (' + jsInput + ')')();
      setStringifyResult(JSON.stringify(obj, null, 2));
    } catch (e: any) {
      setStringifyResult('Error: ' + e.message);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      {/* Parse side */}
      <div style={{ border: '1px solid var(--nothing-border)', padding: '20px', background: 'var(--nothing-bg)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-dim)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          JSON.parse() — JSON → Object
        </div>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows={8}
          style={{ ...inputStyle, resize: 'vertical', marginBottom: '8px' }}
          spellCheck={false}
        />
        <button onClick={handleParse} style={{ ...btnStyle, marginBottom: '12px' }}>Parse JSON</button>
        {parseError && (
          <div style={{ ...trapBox, marginBottom: '8px', padding: '16px' }}>
            <XCircle size={14} color="#d71921" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: '#d71921' }}>{parseError}</span>
          </div>
        )}
        {parseResult && (
          <pre style={{ ...codeBlock, marginBottom: 0, color: 'var(--nothing-green)', fontSize: '17px' }}>{parseResult}</pre>
        )}
      </div>

      {/* Stringify side */}
      <div style={{ border: '1px solid var(--nothing-border)', padding: '20px', background: 'var(--nothing-bg)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-dim)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          JSON.stringify() — Object → JSON
        </div>
        <textarea
          value={jsInput}
          onChange={(e) => setJsInput(e.target.value)}
          rows={8}
          style={{ ...inputStyle, resize: 'vertical', marginBottom: '8px' }}
          spellCheck={false}
        />
        <button onClick={handleStringify} style={{ ...btnStyle, marginBottom: '12px' }}>Stringify Object</button>
        {stringifyResult && (
          <pre style={{ ...codeBlock, marginBottom: 0, color: 'var(--nothing-green)', fontSize: '17px' }}>{stringifyResult}</pre>
        )}
      </div>
    </div>
  );
};

// ─── Interactive: Address Book ──────────────────────────────────────
interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
}

const FAKE_CONTACTS: Contact[] = [
  { id: 1, firstName: 'Alice', lastName: 'Anderson', email: 'alice@example.com', phone: '+43 660 1234567', city: 'Vienna' },
  { id: 2, firstName: 'Bob', lastName: 'Baker', email: 'bob@example.com', phone: '+43 660 2345678', city: 'Graz' },
  { id: 3, firstName: 'Carol', lastName: 'Clark', email: 'carol@example.com', phone: '+43 660 3456789', city: 'Salzburg' },
  { id: 4, firstName: 'David', lastName: 'Davis', email: 'david@example.com', phone: '+43 660 4567890', city: 'Innsbruck' },
  { id: 5, firstName: 'Eve', lastName: 'Evans', email: 'eve@example.com', phone: '+43 660 5678901', city: 'Linz' },
  { id: 6, firstName: 'Frank', lastName: 'Fischer', email: 'frank@example.com', phone: '+43 660 6789012', city: 'Klagenfurt' },
  { id: 7, firstName: 'Grace', lastName: 'Garcia', email: 'grace@example.com', phone: '+43 660 7890123', city: 'Bregenz' },
  { id: 8, firstName: 'Henry', lastName: 'Harris', email: 'henry@example.com', phone: '+43 660 8901234', city: 'Vienna' },
];

const AddressBook: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const loadContacts = useCallback(() => {
    setLoading(true);
    setLoaded(false);
    setContacts([]);
    setSelected(null);
    setSearch('');
    // Simulate async fetch
    setTimeout(() => {
      setContacts(FAKE_CONTACTS);
      setLoading(false);
      setLoaded(true);
    }, 1500);
  }, []);

  const filtered = contacts.filter(c =>
    c.lastName.toLowerCase().startsWith(search.toLowerCase()) ||
    c.firstName.toLowerCase().startsWith(search.toLowerCase())
  );

  const selectedContact = contacts.find(c => c.id === selected);

  return (
    <div style={{ border: '1px solid var(--nothing-border)', background: 'var(--nothing-bg)' }}>
      {/* Toolbar */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--nothing-border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button onClick={loadContacts} style={{ ...btnStyle, background: 'var(--nothing-text)', color: 'var(--nothing-bg)' }}>
          {loading ? '⟳ Loading...' : loaded ? '↻ Reload Contacts' : '▶ Fetch Contacts (Ajax)'}
        </button>
        {loaded && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-green)' }}>
            <CheckCircle size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
            {contacts.length} contacts loaded
          </span>
        )}
      </div>

      {loading && (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{ display: 'inline-block', marginBottom: '8px' }}
          >
            <Clock size={24} color="var(--nothing-text-muted)" />
          </motion.div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-muted)' }}>Fetching /api/contacts...</div>
        </div>
      )}

      {loaded && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {/* List panel */}
          <div style={{ borderRight: '1px solid var(--nothing-border)' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--nothing-border)' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--nothing-text-dim)' }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Typeahead search by name..."
                  style={{ ...inputStyle, paddingLeft: '32px' }}
                />
              </div>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {filtered.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-dim)' }}>
                  No contacts found
                </div>
              )}
              {filtered.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--nothing-border)',
                    cursor: 'pointer',
                    background: selected === c.id ? 'var(--nothing-surface-hover)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'background 0.15s',
                  }}
                >
                  <User size={14} color="var(--nothing-text-dim)" />
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '17px', color: 'var(--nothing-text)' }}>
                      {c.lastName}, {c.firstName}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-dim)' }}>
                      {c.city}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div style={{ padding: '20px' }}>
            {selectedContact ? (
              <div>
                <div style={{ fontFamily: 'var(--font-dot)', fontSize: '18px', letterSpacing: '0.1em', marginBottom: '44px' }}>
                  {selectedContact.firstName} {selectedContact.lastName}
                </div>
                {[
                  ['Email', selectedContact.email],
                  ['Phone', selectedContact.phone],
                  ['City', selectedContact.city],
                  ['ID', String(selectedContact.id)],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', borderBottom: '1px solid var(--nothing-border)', padding: '8px 0' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-dim)', width: '80px', textTransform: 'uppercase' }}>{label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-muted)' }}>{value}</span>
                  </div>
                ))}
                <pre style={{ ...codeBlock, marginTop: '16px', fontSize: '18px', color: 'var(--nothing-text-dim)' }}>
{`// Simulated server response for this contact:
GET /api/contacts/${selectedContact.id}
→ ${JSON.stringify(selectedContact)}`}
                </pre>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-dim)' }}>
                ← Select a contact to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Quiz Component ─────────────────────────────────────────────────
interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

const quizData: QuizQuestion[] = [
  {
    q: 'What does readyState === 4 indicate in an XMLHttpRequest?',
    options: ['Request is initializing', 'Headers received', 'Request is loading', 'Request is complete'],
    answer: 3,
    explanation: 'readyState 4 (DONE) means the entire response has been received and the operation is complete.',
  },
  {
    q: 'Which method must be called BEFORE send() on an XMLHttpRequest?',
    options: ['setRequestHeader()', 'open()', 'getResponseHeader()', 'abort()'],
    answer: 1,
    explanation: 'open(method, url, async) must be called first to initialize the request, then optionally setRequestHeader(), then send().',
  },
  {
    q: 'What will JSON.stringify(undefined) return?',
    options: ['"undefined"', 'null', 'undefined', 'throws an error'],
    answer: 2,
    explanation: 'JSON.stringify returns undefined (not the string "undefined") when given undefined, a function, or a Symbol as the top-level value.',
  },
  {
    q: 'Which Content-Type header should be set when sending JSON via POST?',
    options: ['text/plain', 'application/x-www-form-urlencoded', 'multipart/form-data', 'application/json'],
    answer: 3,
    explanation: 'When sending JSON data in a POST body, the Content-Type should be "application/json" so the server knows how to parse it.',
  },
  {
    q: 'What does HTTP status code 304 mean?',
    options: ['Moved Permanently', 'Not Modified', 'Bad Request', 'Forbidden'],
    answer: 1,
    explanation: '304 Not Modified means the resource has not changed since the last request — the browser can use its cached version.',
  },
  {
    q: 'Which is NOT valid JSON?',
    options: ['{"a": 1}', '{"a": null}', "{a: 1}", '{"a": [1,2]}'],
    answer: 2,
    explanation: 'JSON requires all keys to be double-quoted strings. {a: 1} uses an unquoted key, making it invalid JSON (though valid JS).',
  },
  {
    q: 'What happens if JSON.parse() receives malformed JSON?',
    options: ['Returns null', 'Returns undefined', 'Returns an empty object', 'Throws SyntaxError'],
    answer: 3,
    explanation: 'JSON.parse throws a SyntaxError when given invalid JSON. Always wrap it in a try/catch block.',
  },
];

const Quiz: React.FC = () => {
  return <UnifiedQuiz questions={quizData.map(q => ({ q: q.q, opts: q.options, ans: q.answer, explain: q.explanation }))} />;
};

// ═══════════════════════════════════════════════════════════════════
// MAIN CHAPTER COMPONENT
// ═══════════════════════════════════════════════════════════════════

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


const AjaxRequestCycle: React.FC = () => {
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const steps = [
    { id: 1, side: 'client', title: 'new XMLHttpRequest()', desc: 'Initialize XHR object. readyState = 0 (UNSENT)' },
    { id: 2, side: 'client', title: 'xhr.open("GET", "/api/data", true)', desc: 'Configure request method, URL, async flag. readyState = 1 (OPENED)' },
    { id: 3, side: 'network-to', title: 'xhr.send()', desc: 'Send HTTP Request over network. readyState = 1' },
    { id: 4, side: 'server', title: 'Receive & Process Request', desc: 'Server receives headers, queries DB, processes payload.' },
    { id: 5, side: 'network-from', title: 'Send Response Packet', desc: 'Server sends HTTP response. Content-Type: application/json.' },
    { id: 6, side: 'client', title: 'onreadystatechange fires', desc: 'Callback triggered as download progresses. readyState = 3 (LOADING)' },
    { id: 7, side: 'client', title: 'Verify: readyState === 4 && status === 200', desc: 'Verify completed download (readyState 4) and success status (200).' },
    { id: 8, side: 'client', title: 'JSON.parse(xhr.responseText)', desc: 'Parse the response JSON string into a native JS object.' },
    { id: 9, side: 'client', title: 'Update DOM surgically', desc: 'Inject parsed data into the web page without reloading.' },
  ];

  const logMessages = [
    "[CLIENT] Initialized XMLHttpRequest object. readyState: 0",
    "[CLIENT] Configured request. Method: GET, Target: /api/data. readyState: 1",
    "[NETWORK] Transmitting HTTP GET Request headers to server...",
    "[SERVER] Connection established. Processing requested resource /api/data...",
    "[SERVER] Database lookup complete. Transmitting HTTP/1.1 200 OK (256 bytes)...",
    "[CLIENT] Downloading packet. readyState: 3 (LOADING)",
    "[CLIENT] Connection closed. Download complete. readyState: 4 (DONE), status: 200 (OK)",
    "[CLIENT] Parsing string: '{\"id\": 101, \"status\": \"success\"}'",
    "[CLIENT] Surgical DOM injection complete! Text updated."
  ];

  const triggerNext = (s: number) => {
    if (s > steps.length) return;
    setStep(s);
    if (s > 0) {
      setLogs(prev => [...prev, logMessages[s - 1]]);
    }
  };

  const runFull = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setStep(0);
    setLogs([]);
    for (let i = 1; i <= steps.length; i++) {
      triggerNext(i);
      await new Promise(r => setTimeout(r, 1200));
    }
    setIsSimulating(false);
  };

  const reset = () => {
    setStep(0);
    setLogs([]);
    setIsSimulating(false);
  };

  return (
    <div style={{ background: 'var(--nothing-surface)', border: '1px solid var(--nothing-border)', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* Client Box */}
        <div style={{ flex: '1 1 300px', border: '1px solid var(--nothing-border)', padding: '16px', background: 'var(--nothing-bg)', position: 'relative' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid var(--nothing-border)', paddingBottom: '8px', marginBottom: '12px' }}>
            🖥️ Client (Browser)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {steps.filter(s => s.side === 'client' || s.id === 3).map(s => {
              const active = step >= s.id;
              const current = step === s.id;
              return (
                <div key={s.id} style={{
                  padding: '8px 12px',
                  border: `1px solid ${current ? 'var(--nothing-text)' : active ? 'var(--nothing-border-hover)' : 'var(--nothing-border)'}`,
                  background: current ? 'var(--nothing-surface-hover)' : 'transparent',
                  opacity: active ? 1 : 0.4,
                  transition: 'all 0.3s ease',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px'
                }}>
                  <div style={{ fontWeight: 'bold', color: current ? 'var(--nothing-text)' : 'var(--nothing-text-muted)' }}>
                    Step {s.id}: {s.title}
                  </div>
                  {current && <div style={{ fontSize: '11px', color: 'var(--nothing-text-dim)', marginTop: '4px' }}>{s.desc}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Network link in middle */}
        <div style={{ width: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--nothing-text-dim)', marginBottom: '8px' }}>
            Network
          </div>
          <div style={{ width: '2px', flex: 1, background: 'var(--nothing-border)', position: 'relative' }}>
            {/* Packet animation */}
            {step === 3 && (
              <div className="packet-dot-to" style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                background: 'var(--nothing-text)',
                left: '-3px',
                animation: 'travel-to 1.2s infinite linear'
              }} />
            )}
            {step === 5 && (
              <div className="packet-dot-from" style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                background: 'var(--nothing-green)',
                left: '-3px',
                animation: 'travel-from 1.2s infinite linear'
              }} />
            )}
          </div>
          <style>{`
            @keyframes travel-to {
              0% { top: 10%; opacity: 1; }
              100% { top: 90%; opacity: 0; }
            }
            @keyframes travel-from {
              0% { top: 90%; opacity: 1; }
              100% { top: 10%; opacity: 0; }
            }
          `}</style>
        </div>

        {/* Server Box */}
        <div style={{ flex: '1 1 300px', border: '1px solid var(--nothing-border)', padding: '16px', background: 'var(--nothing-bg)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid var(--nothing-border)', paddingBottom: '8px', marginBottom: '12px' }}>
            🔀 Server
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {steps.filter(s => s.side === 'server' || s.id === 5).map(s => {
              const active = step >= s.id;
              const current = step === s.id;
              return (
                <div key={s.id} style={{
                  padding: '8px 12px',
                  border: `1px solid ${current ? 'var(--nothing-text)' : active ? 'var(--nothing-border-hover)' : 'var(--nothing-border)'}`,
                  background: current ? 'var(--nothing-surface-hover)' : 'transparent',
                  opacity: active ? 1 : 0.4,
                  transition: 'all 0.3s ease',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px'
                }}>
                  <div style={{ fontWeight: 'bold', color: current ? 'var(--nothing-text)' : 'var(--nothing-text-muted)' }}>
                    Step {s.id}: {s.title}
                  </div>
                  {current && <div style={{ fontSize: '11px', color: 'var(--nothing-text-dim)', marginTop: '4px' }}>{s.desc}</div>}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Control buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button className="nt-button" onClick={runFull} disabled={isSimulating}>
          {isSimulating ? 'Simulating...' : 'Run Simulation'}
        </button>
        <button className="nt-button-secondary" onClick={() => triggerNext(Math.min(step + 1, steps.length))} disabled={isSimulating || step === steps.length}>
          Step Next
        </button>
        <button className="nt-button-secondary" onClick={reset}>
          Reset
        </button>
      </div>

      {/* Terminal log panel */}
      <div style={{ marginTop: '24px', background: '#000', border: '1px solid var(--nothing-border)', padding: '16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--nothing-text-dim)', borderBottom: '1px solid var(--nothing-border)', paddingBottom: '6px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <span>CONSOLE LOGS</span>
          <span style={{ color: 'var(--nothing-green)' }}>● ONLINE</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', minHeight: '120px', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {logs.length === 0 ? (
            <div style={{ color: 'var(--nothing-text-dim)' }}>Console empty. Click "Run Simulation" or "Step Next" to start...</div>
          ) : (
            logs.map((log, li) => {
              let color = 'var(--nothing-text-muted)';
              if (log.startsWith('[CLIENT]')) color = 'var(--nothing-text)';
              if (log.startsWith('[SERVER]')) color = 'var(--nothing-yellow)';
              if (log.includes('complete') || log.includes('success')) color = 'var(--nothing-green)';
              return (
                <div key={li} style={{ color }}>
                  {log}
                </div>
              );
            })
          )}
        </div>
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

export const Chapter16: React.FC = () => {
  return (
    <div className="nt-page">
      {/* ── Chapter Header ────────────────────────────────────────── */}
      <ChapterHeader num="16" title="Ajax &amp; JSON" subtitle="XMLHttpRequest · Asynchronous Requests · Data Interchange" chapterWord="Chapter Sixteen" />

      <div className="study-callout">
        <strong>Study route:</strong> learn Ajax as a request lifecycle: create the request, send it, watch readyState, check status, parse JSON, then update the DOM. The address-book demo is the exam-style mental model for async data loading.
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SECTION 1: WHAT IS AJAX                                  */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="nt-section">
        <SectionHeader no="01" title="What Is Ajax" icon={<Globe size={18} />} />

        <p className="nt-prose">
          <strong style={{ color: 'var(--nothing-text)' }}>AJAX</strong> stands for <strong style={{ color: 'var(--nothing-text)' }}>Asynchronous JavaScript and XML</strong>. Despite the name, modern Ajax typically uses JSON rather than XML. The core idea: <em>send HTTP requests in the background and update only part of the page, without a full reload</em>.
        </p>
        <p className="nt-prose">
          Before Ajax, every user interaction required the server to send a complete new HTML page. With Ajax, JavaScript can request data from the server asynchronously, process the response, and surgically update just the relevant DOM elements — resulting in faster, more responsive web applications.
        </p>

        <h3 className="nt-sub-header">Traditional Model vs. Ajax Model</h3>
        {/* Diagram: Traditional vs Ajax */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
          {/* Traditional */}
          <div style={{ border: '1px solid var(--nothing-border)', padding: '20px', background: 'var(--nothing-bg)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-dim)', marginBottom: '44px', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>
              Traditional Model
            </div>
            {['User clicks link', 'Full HTTP Request →', 'Server processes', '← Full HTML Page', 'Browser reloads ENTIRE page', 'User clicks again...', '← Another FULL page'].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  border: '1px solid var(--nothing-border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--nothing-text-dim)', flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: step.includes('FULL') || step.includes('ENTIRE') ? '#d71921' : 'var(--nothing-text-muted)' }}>
                  {step}
                </span>
              </div>
            ))}
            <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(215,25,33,0.08)', border: '1px solid rgba(215,25,33,0.2)', fontFamily: 'var(--font-mono)', fontSize: '18px', color: '#d71921', textAlign: 'center' }}>
              ⚠ Screen flashes white on every interaction
            </div>
          </div>

          {/* Ajax */}
          <div style={{ border: '1px solid var(--nothing-border)', padding: '20px', background: 'var(--nothing-bg)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-dim)', marginBottom: '44px', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>
              Ajax Model
            </div>
            {['User interacts', 'JS creates XHR in background', 'Async HTTP Request →', 'User continues browsing', '← JSON/XML data response', 'JS updates ONLY changed DOM', 'Page stays loaded ✓'].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  border: `1px solid ${step.includes('✓') ? '#4f4' : 'var(--nothing-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '9px', color: step.includes('✓') ? '#4f4' : 'var(--nothing-text-dim)', flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: step.includes('ONLY') || step.includes('✓') ? '#4f4' : 'var(--nothing-text-muted)' }}>
                  {step}
                </span>
              </div>
            ))}
            <div style={{ marginTop: '12px', padding: '8px', background: 'var(--nothing-green-bg)', border: '1px solid var(--nothing-green-bg)', fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-green)', textAlign: 'center' }}>
              ✓ Seamless, no page flicker
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SECTION 2: XMLHttpRequest OBJECT                         */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="nt-section">
        <div style={sectionTitle}>
          <Send size={18} />
          <span>02 — XMLHttpRequest Object</span>
        </div>

        <p className="nt-prose">
          The <code style={{ color: 'var(--nothing-text)' }}>XMLHttpRequest</code> (XHR) object is the original browser API for making HTTP requests from JavaScript. While modern code often uses <code>fetch()</code>, XHR remains foundational and is still widely used and tested.
        </p>

        <h3 className="nt-sub-header">Full Lifecycle Example</h3>
        <pre style={codeBlock}>
{`// 1. Create the XHR object
const xhr = new XMLHttpRequest();

// 2. Set up the callback BEFORE calling open/send
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {          // Request complete
    if (xhr.status === 200) {          // Success
      const data = JSON.parse(xhr.responseText);
      console.log("Data received:", data);
      // Update the DOM with the data
      document.getElementById("result").innerHTML = data.message;
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  }
};

// 3. Initialize the request
xhr.open("GET", "/api/data", true);    // true = async

// 4. Send the request
xhr.send();`}
        </pre>

        <h3 className="nt-sub-header">Properties &amp; Methods Reference</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="nt-table">
            <thead>
              <tr>
                <th className="nt-th">Member</th>
                <th className="nt-th">Type</th>
                <th className="nt-th">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['open(method, url, async)', 'Method', 'Initializes a request. method = "GET"|"POST". async = true (async) or false (sync, deprecated).'],
                ['send(body?)', 'Method', 'Sends the request. Pass body for POST (string/FormData). For GET, pass null or omit.'],
                ['onreadystatechange', 'Property', 'Event handler called every time readyState changes (0→1→2→3→4).'],
                ['readyState', 'Property', 'Current state of the request: 0 (UNSENT) through 4 (DONE). Read-only.'],
                ['status', 'Property', 'HTTP status code (200, 404, 500, etc.). Only available when readyState ≥ 2.'],
                ['statusText', 'Property', 'HTTP status message string ("OK", "Not Found", etc.).'],
                ['responseText', 'Property', 'Response body as a string. Available progressively from readyState 3.'],
                ['responseXML', 'Property', 'Response parsed as XML DOM Document (if Content-Type is XML). Otherwise null.'],
                ['setRequestHeader(name, val)', 'Method', 'Sets an HTTP header. Must be called AFTER open() and BEFORE send().'],
                ['getResponseHeader(name)', 'Method', 'Returns the value of a specific response header after headers are received.'],
                ['abort()', 'Method', 'Cancels the current request immediately.'],
                ['timeout', 'Property', 'Time in ms before the request auto-aborts. 0 = no timeout (default).'],
              ].map(([member, type, desc], i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text)', whiteSpace: 'nowrap' }}>{member}</td>
                  <td style={{ ...tdStyle, fontSize: '18px', color: 'var(--nothing-text-dim)' }}>{type}</td>
                  <td className="nt-td">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SECTION 3: readyState VALUES                             */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="nt-section">
        <div style={sectionTitle}>
          <Zap size={18} />
          <span>03 — readyState Values</span>
        </div>

        <p className="nt-prose">
          The <code style={{ color: 'var(--nothing-text)' }}>readyState</code> property tracks the lifecycle of an XHR request through five discrete stages. The <code>onreadystatechange</code> handler fires at each transition.
        </p>

        <table className="nt-table">
          <thead>
            <tr>
              <th style={{ ...thStyle, width: '60px' }}>Value</th>
              <th style={{ ...thStyle, width: '180px' }}>Constant</th>
              <th className="nt-th">Description</th>
              <th className="nt-th">Available Data</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['0', 'UNSENT', 'XHR object created, open() not yet called', 'None'],
              ['1', 'OPENED', 'open() has been called successfully', 'None'],
              ['2', 'HEADERS_RECEIVED', 'send() called, response headers received', 'status, statusText, response headers'],
              ['3', 'LOADING', 'Downloading response body (partial data)', 'Partial responseText'],
              ['4', 'DONE', 'Operation complete (success or failure)', 'Full responseText, responseXML, status'],
            ].map(([val, constant, desc, data], i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, color: 'var(--nothing-text)', fontSize: '18px', fontWeight: 700, textAlign: 'center' }}>{val}</td>
                <td style={{ ...tdStyle, color: 'var(--nothing-text)' }}>{constant}</td>
                <td className="nt-td">{desc}</td>
                <td style={{ ...tdStyle, fontSize: '17px' }}>{data}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="nt-sub-header">Interactive Ajax Simulator</h3>
        <p style={{ ...bodyText, marginBottom: '44px' }}>
          Click the button to simulate an asynchronous XMLHttpRequest. Watch <code>readyState</code> progress from 0 → 4 in real time.
        </p>
        <AjaxSimulator />
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SECTION 4: HTTP STATUS CODES                             */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="nt-section">
        <SectionHeader no="04" title="HTTP Status Codes" icon={<Database size={18} />} />

        <p className="nt-prose">
          When a server responds, it includes a numeric status code indicating the result. These are grouped by category. You must always check <code style={{ color: 'var(--nothing-text)' }}>xhr.status</code> in your Ajax callbacks.
        </p>

        {[
          {
            group: '2xx — Success',
            color: 'var(--nothing-green)',
            codes: [
              ['200', 'OK', 'Standard success response. The request was fulfilled.'],
              ['201', 'Created', 'Resource successfully created (typically after POST).'],
            ],
          },
          {
            group: '3xx — Redirection',
            color: 'var(--nothing-yellow)',
            codes: [
              ['301', 'Moved Permanently', 'Resource has a new permanent URL. Update bookmarks.'],
              ['304', 'Not Modified', 'Resource unchanged since last request. Use cached version.'],
            ],
          },
          {
            group: '4xx — Client Error',
            color: 'var(--nothing-yellow)',
            codes: [
              ['400', 'Bad Request', 'Server cannot process the request due to client error (malformed syntax).'],
              ['401', 'Unauthorized', 'Authentication required. User is not logged in.'],
              ['403', 'Forbidden', 'Server understood but refuses to authorize. User lacks permission.'],
              ['404', 'Not Found', 'The requested resource does not exist on the server.'],
            ],
          },
          {
            group: '5xx — Server Error',
            color: '#d71921',
            codes: [
              ['500', 'Internal Server Error', 'Generic server-side failure. Bug in server code.'],
              ['503', 'Service Unavailable', 'Server is temporarily overloaded or under maintenance.'],
            ],
          },
        ].map((cat, ci) => (
          <div key={ci} style={{ marginBottom: '20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: cat.color, marginBottom: '8px', letterSpacing: '0.06em' }}>
              {cat.group}
            </div>
            <table className="nt-table">
              <tbody>
                {cat.codes.map(([code, text, desc], i) => (
                  <tr key={i}>
                    <td style={{ ...tdStyle, width: '60px', color: cat.color, fontWeight: 700 }}>{code}</td>
                    <td style={{ ...tdStyle, width: '180px', color: 'var(--nothing-text)' }}>{text}</td>
                    <td className="nt-td">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SECTION 5: GET vs POST                                   */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="nt-section">
        <div style={sectionTitle}>
          <ArrowRight size={18} />
          <span>05 — GET vs POST Requests</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* GET */}
          <div>
            <h3 className="nt-sub-header">GET Request</h3>
            <p className="nt-prose">
              Used to <strong style={{ color: 'var(--nothing-text)' }}>retrieve</strong> data. Parameters go in the URL query string. No request body.
            </p>
            <pre style={codeBlock}>
{`// GET request with query parameters
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const users = JSON.parse(xhr.responseText);
    renderUserList(users);
  }
};

// Parameters encoded in URL
xhr.open("GET", "/api/users?role=admin&page=1", true);
xhr.send();  // No body for GET`}
            </pre>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-dim)', lineHeight: 1.9 }}>
              ✓ Cacheable by browser<br />
              ✓ Can be bookmarked<br />
              ✓ Idempotent (same result every time)<br />
              ⚠ URL length limits (~2048 chars)<br />
              ⚠ Parameters visible in URL
            </div>
          </div>

          {/* POST */}
          <div>
            <h3 className="nt-sub-header">POST Request</h3>
            <p className="nt-prose">
              Used to <strong style={{ color: 'var(--nothing-text)' }}>send/create</strong> data. Data goes in the request body. Must set Content-Type header.
            </p>
            <pre style={codeBlock}>
{`// POST request with JSON body
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 201) {
      console.log("Created:", JSON.parse(xhr.responseText));
    } else {
      console.error("Failed:", xhr.status);
    }
  }
};

xhr.open("POST", "/api/users", true);

// MUST set Content-Type for POST with JSON
xhr.setRequestHeader("Content-Type", "application/json");

const payload = JSON.stringify({
  name: "Alice",
  email: "alice@example.com"
});

xhr.send(payload);  // Body with data`}
            </pre>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-dim)', lineHeight: 1.9 }}>
              ✓ No URL length limits<br />
              ✓ Data hidden from URL<br />
              ✓ Can send large payloads<br />
              ✓ Supports all data types<br />
              ⚠ Not cacheable by default
            </div>
          </div>
        </div>

        <div style={{ ...trapBox, marginTop: '20px' }}>
          <AlertTriangle size={16} color="#d71921" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-muted)' }}>
            <strong style={{ color: '#d71921' }}>TRAP:</strong> Forgetting <code>setRequestHeader("Content-Type", "application/json")</code> before <code>send()</code> on POST requests means the server won't parse your JSON body correctly. The call order is always: <code>open() → setRequestHeader() → send()</code>.
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SECTION 6: JSON FORMAT                                   */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="nt-section">
        <div style={sectionTitle}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px' }}>&#123;&#125;</span>
          <span>06 — JSON Format</span>
        </div>

        <p className="nt-prose">
          <strong style={{ color: 'var(--nothing-text)' }}>JSON</strong> (JavaScript Object Notation) is a lightweight text-based data interchange format. It's language-independent but uses conventions familiar to JavaScript programmers.
        </p>

        <h3 className="nt-sub-header">JSON Syntax Rules</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ padding: '24px', border: '1px solid var(--nothing-border)', background: 'var(--nothing-bg)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-green)', marginBottom: '10px' }}>✓ VALID JSON</div>
            <pre style={{ ...codeBlock, border: 'none', padding: 0, marginBottom: 0 }}>
{`{
  "name": "Alice",
  "age": 30,
  "active": true,
  "address": null,
  "scores": [95, 88, 72],
  "profile": {
    "bio": "Developer"
  }
}`}
            </pre>
          </div>
          <div style={{ padding: '24px', border: '1px solid var(--nothing-border)', background: 'var(--nothing-bg)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: '#d71921', marginBottom: '10px' }}>✗ INVALID JSON</div>
            <pre style={{ ...codeBlock, border: 'none', padding: 0, marginBottom: 0, color: '#d71921' }}>
{`{
  name: "Alice",        // unquoted key
  'age': 30,            // single-quoted key
  "active": undefined,  // no undefined
  "greet": function(){},// no functions
  "scores": [1, 2,],   // trailing comma
  // this is a comment  // no comments
}`}
            </pre>
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-muted)', lineHeight: 2, marginBottom: '20px', paddingLeft: '12px', borderLeft: '2px solid var(--nothing-border)' }}>
          <strong style={{ color: 'var(--nothing-text)' }}>Allowed value types:</strong> string (double-quoted), number, boolean (true/false), null, object, array<br />
          <strong style={{ color: '#d71921' }}>NOT allowed:</strong> undefined, functions, Symbol, comments, trailing commas, single quotes, unquoted keys
        </div>

        <h3 className="nt-sub-header">JSON.parse(text, reviver?)</h3>
        <p className="nt-prose">Converts a JSON string into a JavaScript object.</p>
        <pre style={codeBlock}>
{`const jsonString = '{"name":"Alice","age":30,"scores":[95,88]}';
const obj = JSON.parse(jsonString);

console.log(obj.name);      // "Alice"
console.log(obj.scores[0]); // 95

// With reviver function (transforms values during parsing)
const data = JSON.parse('{"date":"2026-01-15"}', (key, value) => {
  if (key === "date") return new Date(value);
  return value;
});
console.log(data.date instanceof Date); // true`}
        </pre>

        <h3 className="nt-sub-header">JSON.stringify(value, replacer?, space?)</h3>
        <p className="nt-prose">Converts a JavaScript value to a JSON string.</p>
        <pre style={codeBlock}>
{`const obj = { name: "Bob", age: 25, active: true };

// Basic stringify
JSON.stringify(obj);
// '{"name":"Bob","age":25,"active":true}'

// With spacing (pretty print)
JSON.stringify(obj, null, 2);
// {
//   "name": "Bob",
//   "age": 25,
//   "active": true
// }

// With replacer array (include only listed keys)
JSON.stringify(obj, ["name", "age"]);
// '{"name":"Bob","age":25}'

// With replacer function
JSON.stringify(obj, (key, value) => {
  if (typeof value === "number") return value * 2;
  return value;
});
// '{"name":"Bob","age":50}'`}
        </pre>

        <div style={trapBox}>
          <AlertTriangle size={16} color="#d71921" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-muted)', lineHeight: 1.9 }}>
            <strong style={{ color: '#d71921' }}>TRAPS:</strong><br />
            • <code>JSON.parse("invalid")</code> → throws <strong>SyntaxError</strong>. Always use try/catch!<br />
            • <code>JSON.stringify(undefined)</code> → returns <strong>undefined</strong> (not a string)<br />
            • <code>JSON.stringify(&#123;a: undefined, b: function()&#123;&#125;&#125;)</code> → <code>'&#123;&#125;'</code> — properties with undefined/function values are <strong>omitted</strong><br />
            • Circular references: <code>const o = &#123;&#125;; o.self = o; JSON.stringify(o)</code> → throws <strong>TypeError</strong>
          </div>
        </div>

        <h3 className="nt-sub-header">Interactive JSON Playground</h3>
        <p style={{ ...bodyText, marginBottom: '44px' }}>
          Try parsing JSON strings and stringifying JS objects. Experiment with valid and invalid inputs to see the errors.
        </p>
        <JSONPlayground />
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SECTION 7: AJAX REQUEST LIFECYCLE DIAGRAM                */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="nt-section">
        <div style={sectionTitle}>
          <Clock size={18} />
          <span>07 — Ajax Request Lifecycle</span>
        </div>

        <p className="nt-prose">
          Complete visual walkthrough of every step in an Ajax request/response cycle:
        </p>

        <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '24px', overflowX: 'auto' }}>
          {/* Client and Server labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ fontFamily: 'var(--font-dot)', fontSize: '18px', letterSpacing: '0.1em', padding: '8px 20px', border: '1px solid var(--nothing-text)', display: 'inline-block' }}>
              CLIENT (Browser)
            </div>
            <div style={{ fontFamily: 'var(--font-dot)', fontSize: '18px', letterSpacing: '0.1em', padding: '8px 20px', border: '1px solid var(--nothing-text)', display: 'inline-block' }}>
              SERVER
            </div>
          </div>

          {/* Steps */}
          {[
            { side: 'left', label: '1', text: 'const xhr = new XMLHttpRequest()', note: 'readyState = 0 (UNSENT)' },
            { side: 'left', label: '2', text: 'xhr.open("GET", "/api/data", true)', note: 'readyState = 1 (OPENED)' },
            { side: 'left', label: '3', text: 'xhr.send()', note: 'HTTP Request sent →' },
            { side: 'right', label: '4', text: 'Server receives request', note: 'Routes, processes, queries DB' },
            { side: 'right', label: '5', text: 'Server sends response', note: '← HTTP Response with JSON body' },
            { side: 'left', label: '6', text: 'onreadystatechange fires', note: 'readyState = 2, 3, 4' },
            { side: 'left', label: '7', text: 'Check: readyState===4 && status===200', note: 'Guard clause in callback' },
            { side: 'left', label: '8', text: 'JSON.parse(xhr.responseText)', note: 'Convert JSON string → JS object' },
            { side: 'left', label: '9', text: 'Update DOM with parsed data', note: 'innerHTML, createElement, etc.' },
          ].map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: step.side === 'left' ? 'flex-start' : 'flex-end',
                marginBottom: '8px',
              }}
            >
              <div style={{
                padding: '10px 16px',
                border: `1px solid ${step.side === 'right' ? 'var(--nothing-border)' : 'var(--nothing-text-dim)'}`,
                background: step.side === 'right' ? 'var(--nothing-surface)' : 'transparent',
                maxWidth: '70%',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  border: '1px solid var(--nothing-text)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text)',
                  flexShrink: 0,
                }}>
                  {step.label}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text)' }}>{step.text}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-dim)', marginTop: '2px' }}>{step.note}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Arrow indicators between client/server */}
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-dim)', textAlign: 'center', lineHeight: 1.9 }}>
              ━━━ REQUEST ━━━▶ (steps 1-3: client → server)<br />
              ◀━━━ RESPONSE ━━━ (steps 4-5: server → client)<br />
              ━━━ PROCESS ━━━ (steps 6-9: client-side handling)
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SECTION 8: FULL APPLICATION PATTERN                      */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="nt-section">
        <div style={sectionTitle}>
          <User size={18} />
          <span>08 — Full Application Pattern: Address Book</span>
        </div>

        <p className="nt-prose">
          A realistic Ajax application pattern: load contacts from a "server" (simulated), render them as a searchable list with typeahead filtering, and show detail views on selection. This demonstrates the complete data flow from request → parse → render → interact.
        </p>

        <h3 className="nt-sub-header">The Pattern (Real Code)</h3>
        <pre style={codeBlock}>
{`// 1. Create XHR and fetch contact list
function loadContacts() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const contacts = JSON.parse(xhr.responseText);
      renderContactList(contacts);
      setupTypeahead(contacts);
    } else if (xhr.readyState === 4) {
      showError("Failed to load contacts: " + xhr.status);
    }
  };
  xhr.open("GET", "/api/contacts", true);
  xhr.send();
}

// 2. Render the list
function renderContactList(contacts) {
  const list = document.getElementById("contact-list");
  list.innerHTML = "";
  contacts.forEach(c => {
    const li = document.createElement("li");
    li.textContent = c.lastName + ", " + c.firstName;
    li.onclick = () => showDetail(c);
    list.appendChild(li);
  });
}

// 3. Typeahead search
function setupTypeahead(contacts) {
  const input = document.getElementById("search");
  input.addEventListener("input", function() {
    const query = this.value.toLowerCase();
    const filtered = contacts.filter(c =>
      c.lastName.toLowerCase().startsWith(query)
    );
    renderContactList(filtered);
  });
}

// 4. Show detail
function showDetail(contact) {
  document.getElementById("detail-name").textContent =
    contact.firstName + " " + contact.lastName;
  document.getElementById("detail-email").textContent = contact.email;
  document.getElementById("detail-phone").textContent = contact.phone;
}`}
        </pre>

        <h3 className="nt-sub-header">Interactive Address Book Demo</h3>
        <p style={{ ...bodyText, marginBottom: '44px' }}>
          Click "Fetch Contacts" to simulate an Ajax request. Then use the typeahead search and click contacts to view details.
        </p>
        <AddressBook />

        <div style={{ ...trapBox, marginTop: '20px' }}>
          <AlertTriangle size={16} color="#d71921" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-muted)', lineHeight: 1.9 }}>
            <strong style={{ color: '#d71921' }}>APPLICATION TRAPS:</strong><br />
            • <strong>CORS:</strong> Ajax requests from <code>file://</code> protocol will be blocked. Must use a local HTTP server (e.g., <code>python -m http.server</code> or Live Server).<br />
            • <strong>Error handling:</strong> Always handle <code>xhr.status !== 200</code> and network failures. Show user-friendly error messages.<br />
            • <strong>Loading feedback:</strong> Show a spinner or "Loading..." message while <code>readyState &lt; 4</code>. Users need visual feedback.<br />
            • <strong>Empty states:</strong> Handle the case where the server returns an empty array — show "No results" instead of a blank screen.
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SECTION 9: CHEAT SHEET                                   */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="nt-section">
        <div style={sectionTitle}>
          <CheckCircle size={18} />
          <span>09 — Cheat Sheet</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          {/* XHR Quick Ref */}
          <div style={{ padding: '24px', border: '1px solid var(--nothing-border)', background: 'var(--nothing-bg)' }}>
            <div style={{ fontFamily: 'var(--font-dot)', fontSize: '18px', letterSpacing: '0.1em', marginBottom: '12px' }}>XMLHttpRequest</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-muted)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
{`const xhr = new XMLHttpRequest();
xhr.onreadystatechange = fn;
xhr.open(method, url, async);
xhr.setRequestHeader(h, v);
xhr.send(body);

// In callback:
xhr.readyState  // 0-4
xhr.status      // 200, 404...
xhr.statusText  // "OK"...
xhr.responseText // string
xhr.responseXML  // XML DOM
xhr.getResponseHeader(name)`}
            </pre>
          </div>

          {/* JSON Quick Ref */}
          <div style={{ padding: '24px', border: '1px solid var(--nothing-border)', background: 'var(--nothing-bg)' }}>
            <div style={{ fontFamily: 'var(--font-dot)', fontSize: '18px', letterSpacing: '0.1em', marginBottom: '12px' }}>JSON</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-muted)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
{`// Parse: string → object
JSON.parse(text)
JSON.parse(text, reviver)

// Stringify: object → string
JSON.stringify(value)
JSON.stringify(val, replacer)
JSON.stringify(val, null, 2)

// Rules:
// ✓ double-quoted keys
// ✓ string,number,bool,null
// ✗ undefined, functions
// ✗ trailing commas
// ✗ comments, single quotes`}
            </pre>
          </div>

          {/* Status Codes Quick Ref */}
          <div style={{ padding: '24px', border: '1px solid var(--nothing-border)', background: 'var(--nothing-bg)' }}>
            <div style={{ fontFamily: 'var(--font-dot)', fontSize: '18px', letterSpacing: '0.1em', marginBottom: '12px' }}>Status Codes</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-muted)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
{`200  OK
201  Created
301  Moved Permanently
304  Not Modified
400  Bad Request
401  Unauthorized
403  Forbidden
404  Not Found
500  Internal Server Error
503  Service Unavailable

readyState:
0 UNSENT
1 OPENED
2 HEADERS_RECEIVED
3 LOADING
4 DONE`}
            </pre>
          </div>
        </div>

        {/* GET vs POST quick */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ padding: '24px', border: '1px solid var(--nothing-border)', background: 'var(--nothing-bg)' }}>
            <div style={{ fontFamily: 'var(--font-dot)', fontSize: '18px', letterSpacing: '0.1em', marginBottom: '12px' }}>GET Pattern</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-muted)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
{`xhr.open("GET", url + "?k=v", true);
xhr.send();
// No body, params in URL`}
            </pre>
          </div>
          <div style={{ padding: '24px', border: '1px solid var(--nothing-border)', background: 'var(--nothing-bg)' }}>
            <div style={{ fontFamily: 'var(--font-dot)', fontSize: '18px', letterSpacing: '0.1em', marginBottom: '12px' }}>POST Pattern</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-muted)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
{`xhr.open("POST", url, true);
xhr.setRequestHeader(
  "Content-Type",
  "application/json"
);
xhr.send(JSON.stringify(data));`}
            </pre>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SECTION 10: QUIZ                                         */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="nt-section">
        <div style={sectionTitle}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px' }}>?</span>
          <span>10 — Quiz</span>
        </div>

        <p style={{ ...bodyText, marginBottom: '20px' }}>
          Answer all {quizData.length} questions, then click "Check Answers" to see your score and explanations.
        </p>

        <Quiz />
      </div>

      {/* ── Footer ────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '32px 0', borderTop: '1px solid var(--nothing-border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--nothing-text-dim)', letterSpacing: '0.1em' }}>
          CHAPTER 16 — AJAX &amp; JSON — END
        </div>
      </div>
    </div>
  );
};
