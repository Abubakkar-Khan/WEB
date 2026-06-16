import React, { useState, useEffect, useCallback } from 'react';

/* ──────────────────────────────────────────────────────────────
   Chapter 11 — JavaScript Built-in Objects
   String · Date · Web Storage
   ────────────────────────────────────────────────────────────── */

// ─── Reusable inline-style tokens ────────────────────────────
const S = {
  page: {
    padding: '48px 24px',
    maxWidth: 960,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 48,
    fontFamily: 'var(--font-sans)',
    color: 'var(--nothing-text)',
  },
  sectionHeader: {
    fontFamily: 'var(--font-dot)',
    fontSize: 28,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    marginBottom: 24,
    lineHeight: 1.2,
  },
  subHeader: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const,
    color: 'var(--nothing-text-muted)',
    marginBottom: 12,
    marginTop: 28,
  },
  code: {
    background: '#000',
    border: '1px solid var(--nothing-border)',
    padding: 16,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    whiteSpace: 'pre-wrap' as const,
    overflowX: 'auto' as const,
    borderRadius: 0,
    color: 'var(--nothing-text)',
    lineHeight: 1.7,
  },
  card: {
    border: '1px solid var(--nothing-border)',
    background: 'var(--nothing-surface)',
    padding: 24,
    marginBottom: 20,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
  },
  th: {
    background: 'var(--nothing-text)',
    color: 'var(--nothing-bg)',
    padding: 10,
    textAlign: 'left' as const,
    fontWeight: 600,
  },
  td: {
    border: '1px solid var(--nothing-border)',
    padding: 10,
    verticalAlign: 'top' as const,
  },
  interactive: {
    background: '#050505',
    border: '1px solid var(--nothing-border)',
    padding: 20,
  },
  btn: {
    background: 'var(--nothing-text)',
    color: 'var(--nothing-bg)',
    border: 'none',
    padding: '10px 20px',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
  },
  btnOutline: {
    background: 'transparent',
    color: 'var(--nothing-text)',
    border: '1px solid var(--nothing-border)',
    padding: '8px 16px',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
  },
  trap: {
    borderLeft: '3px solid #d71921',
    paddingLeft: 16,
    background: 'rgba(215,25,33,0.05)',
    padding: 16,
    marginBottom: 16,
    fontSize: 13,
  },
  input: {
    background: '#000',
    border: '1px solid var(--nothing-border)',
    color: 'var(--nothing-text)',
    padding: '8px 12px',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    width: '100%',
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'var(--nothing-text-muted)',
    marginBottom: 4,
    display: 'block' as const,
  },
  resultRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: '1px solid var(--nothing-border)',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
  },
  p: {
    lineHeight: 1.8,
    fontSize: 14,
    color: 'var(--nothing-text-muted)',
    marginBottom: 12,
  },
};

/* ══════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════ */
export const Chapter11: React.FC = () => {
  // ── String Console state ───────────────────────────────────
  const [strInput, setStrInput] = useState('Hello, World!');
  const [needle, setNeedle] = useState('World');

  // ── Date Explorer state ────────────────────────────────────
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Storage Lab state ──────────────────────────────────────
  const [storageKey, setStorageKey] = useState('');
  const [storageValue, setStorageValue] = useState('');
  const [storageItems, setStorageItems] = useState<[string, string][]>([]);
  const [storageResult, setStorageResult] = useState('');

  const refreshStorage = useCallback(() => {
    const items: [string, string][] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) items.push([k, localStorage.getItem(k) ?? '']);
    }
    setStorageItems(items);
  }, []);

  useEffect(() => { refreshStorage(); }, [refreshStorage]);

  // ── Quiz state ─────────────────────────────────────────────
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const quizzes = [
    { q: 'What does "hello".indexOf("xyz") return?', opts: ['undefined', 'false', '-1', '0'], correct: 2 },
    { q: 'What is new Date(2026, 0, 1).getMonth()?', opts: ['1', '0', 'January', 'Error'], correct: 1 },
    { q: 'localStorage stores values as:', opts: ['JSON objects', 'Numbers', 'Strings only', 'Any type'], correct: 2 },
    { q: '"abc".substring(1, 2) returns:', opts: ['"bc"', '"b"', '"ab"', '"a"'], correct: 1 },
    { q: 'JSON.parse(undefined) will:', opts: ['Return null', 'Return undefined', 'Throw an error', 'Return ""'], correct: 2 },
    { q: 'What does "Hello".charAt(99) return?', opts: ['undefined', 'null', 'Error', '""  (empty string)'], correct: 3 },
    { q: '"Hello".split("") produces:', opts: ['["Hello"]', '["H","e","l","l","o"]', '["H ello"]', 'Error'], correct: 1 },
  ];

  // ── Helpers ────────────────────────────────────────────────
  const safe = (fn: () => unknown): string => {
    try {
      const v = fn();
      if (Array.isArray(v)) return JSON.stringify(v);
      return String(v);
    } catch (e) { return `Error: ${e}`; }
  };

  /* ════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════ */
  return (
    <div style={S.page}>
      {/* ──────────── CHAPTER HEADER ──────────── */}
      <header>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--nothing-text-dim)', marginBottom: 8 }}>
          CHAPTER
        </div>
        <h1 style={{ fontFamily: 'var(--font-dot)', fontSize: 56, margin: 0, lineHeight: 0.95, letterSpacing: '0.05em' }}>
          11
        </h1>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, marginTop: 8, letterSpacing: '0.02em' }}>
          JavaScript Built-in Objects
        </h2>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--nothing-text-muted)', letterSpacing: '0.08em', marginTop: 4 }}>
          String · Date · Web Storage
        </p>
        <div style={{ height: 1, background: 'var(--nothing-border)', marginTop: 24 }} />
      </header>

      {/* ╔══════════════════════════════════════════════════════╗
         ║  SECTION 1 — STRING OBJECT                          ║
         ╚══════════════════════════════════════════════════════╝ */}
      <section>
        <h2 style={S.sectionHeader}>1 · String Object</h2>

        <p style={S.p}>
          JavaScript strings are <strong style={{ color: '#fff' }}>immutable</strong> sequences of UTF-16 code units.
          Primitive strings are auto-boxed to <code>String</code> objects when you call methods on them.
          Every method returns a <strong style={{ color: '#fff' }}>new</strong> string — the original is never modified.
          Strings are <strong style={{ color: '#fff' }}>zero-indexed</strong>: the first character is at index 0.
        </p>

        <pre style={S.code}>{`// Primitive vs Object
const prim = "hello";          // string primitive
const obj  = new String("hi"); // String object (avoid this)
typeof prim; // "string"
typeof obj;  // "object"

// Immutability
const s = "Hello";
s.toUpperCase();   // "HELLO" (new string returned)
console.log(s);    // "Hello" (original unchanged)

// Zero-based indexing
"ABCDE"[0];  // "A"
"ABCDE"[4];  // "E"
"ABCDE".length; // 5`}</pre>

        {/* ── String Methods Table ── */}
        <h3 style={S.subHeader}>Complete String Method Reference</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Method</th>
                <th style={S.th}>Parameters</th>
                <th style={S.th}>Returns</th>
                <th style={S.th}>Description</th>
              </tr>
            </thead>
            <tbody>
              {([
                ['charAt(i)', 'i: number', 'string', 'Character at index i. Returns "" if out of range.'],
                ['charCodeAt(i)', 'i: number', 'number', 'UTF-16 code unit at index i. NaN if out of range.'],
                ['indexOf(s, from?)', 's: string, from?: number', 'number', 'First index of s, or -1 if not found.'],
                ['lastIndexOf(s, from?)', 's: string, from?: number', 'number', 'Last index of s, searching backwards.'],
                ['split(sep, limit?)', 'sep: string|RegExp, limit?: number', 'string[]', 'Splits string by separator into array.'],
                ['substring(start, end?)', 'start: number, end?: number', 'string', 'Chars from start up to (but NOT including) end.'],
                ['slice(start, end?)', 'start: number, end?: number', 'string', 'Like substring but supports negative indices.'],
                ['toUpperCase()', '—', 'string', 'Converts all characters to upper case.'],
                ['toLowerCase()', '—', 'string', 'Converts all characters to lower case.'],
                ['trim()', '—', 'string', 'Removes whitespace from both ends.'],
                ['replace(s, r)', 's: string|RegExp, r: string', 'string', 'Replaces first match of s with r.'],
                ['includes(s)', 's: string', 'boolean', 'Whether string contains s. Case-sensitive.'],
                ['startsWith(s)', 's: string', 'boolean', 'Whether string begins with s.'],
                ['endsWith(s)', 's: string', 'boolean', 'Whether string ends with s.'],
                ['concat(...s)', '...s: string[]', 'string', 'Concatenates one or more strings.'],
              ] as string[][]).map(([m, p, r, d], i) => (
                <tr key={i}>
                  <td style={{ ...S.td, color: '#fff', fontWeight: 600 }}>{m}</td>
                  <td style={S.td}>{p}</td>
                  <td style={{ ...S.td, color: 'var(--nothing-text-muted)' }}>{r}</td>
                  <td style={S.td}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Per-method Code Examples ── */}
        <h3 style={S.subHeader}>charAt &amp; charCodeAt</h3>
        <pre style={S.code}>{`const str = "JavaScript";

str.charAt(0);    // "J"
str.charAt(4);    // "S"
str.charAt(99);   // ""   ← empty string, NOT undefined

str.charCodeAt(0);  // 74  (Unicode for 'J')
str.charCodeAt(4);  // 83  (Unicode for 'S')
"A".charCodeAt(0);  // 65
"a".charCodeAt(0);  // 97
"€".charCodeAt(0);  // 8364`}</pre>

        <h3 style={S.subHeader}>indexOf &amp; lastIndexOf</h3>
        <pre style={S.code}>{`const str = "banana";

str.indexOf("a");         // 1   (first occurrence)
str.indexOf("a", 2);      // 3   (search from index 2)
str.indexOf("z");         // -1  (not found — NOT false!)

str.lastIndexOf("a");     // 5   (last occurrence)
str.lastIndexOf("a", 4);  // 3   (search backwards from index 4)

// Common pattern: check if substring exists
if (str.indexOf("nan") !== -1) {
  console.log("Found!");  // ✓ correct way
}
// WRONG: if (str.indexOf("nan")) — 0 is falsy!`}</pre>

        <h3 style={S.subHeader}>split</h3>
        <pre style={S.code}>{`"a,b,c".split(",");        // ["a", "b", "c"]
"a,b,c".split(",", 2);    // ["a", "b"]         ← limit
"hello".split("");         // ["h","e","l","l","o"]  ← every char
"hello".split();           // ["hello"]          ← no separator = whole string
"a--b--c".split("--");    // ["a", "b", "c"]`}</pre>

        <h3 style={S.subHeader}>substring &amp; slice</h3>
        <pre style={S.code}>{`const str = "Hello, World!";

// substring(start, end)  — end is EXCLUSIVE
str.substring(0, 5);   // "Hello"
str.substring(7);      // "World!"
str.substring(7, 12);  // "World"

// slice(start, end) — also end-exclusive, supports NEGATIVES
str.slice(0, 5);    // "Hello"
str.slice(-6);      // "orld!"    ← last 6 chars
str.slice(-6, -1);  // "orld"

// Key difference:
str.substring(5, 0);  // "Hello" ← swaps arguments if start > end
str.slice(5, 0);      // ""      ← returns empty string`}</pre>

        <h3 style={S.subHeader}>toUpperCase, toLowerCase &amp; trim</h3>
        <pre style={S.code}>{`"hello".toUpperCase();         // "HELLO"
"WORLD".toLowerCase();         // "world"

"  spaced  ".trim();           // "spaced"
"  spaced  ".trimStart();      // "spaced  "
"  spaced  ".trimEnd();        // "  spaced"

// NOTE: These return NEW strings!
const x = "abc";
x.toUpperCase();   // "ABC"
console.log(x);    // "abc" (unchanged)`}</pre>

        <h3 style={S.subHeader}>replace, includes, startsWith, endsWith</h3>
        <pre style={S.code}>{`// replace — first occurrence only (without /g regex)
"aabaa".replace("a", "X");   // "Xabaa"  ← only first 'a'
"aabaa".replace(/a/g, "X");  // "XXbXX"  ← all occurrences

// includes — case-sensitive boolean check
"Hello World".includes("World");  // true
"Hello World".includes("world");  // false  ← case matters!

// startsWith / endsWith
"index.html".startsWith("index");   // true
"index.html".endsWith(".html");     // true
"index.html".startsWith("Index");   // false  ← case-sensitive`}</pre>

        <h3 style={S.subHeader}>concat</h3>
        <pre style={S.code}>{`"Hello".concat(" ", "World");    // "Hello World"
"a".concat("b", "c", "d");      // "abcd"

// Template literals are preferred in modern JS:
const name = "Alice";
\`Hello, \${name}!\`;    // "Hello, Alice!"`}</pre>

        {/* ── String Traps ── */}
        <h3 style={S.subHeader}>⚠ Common String Traps</h3>
        <div style={S.trap}>
          <strong style={{ color: '#d71921' }}>TRAP 1:</strong> <code>indexOf</code> returns <strong>-1</strong>, not <code>false</code> or <code>undefined</code>.
          Using it in a boolean context is dangerous because <code>0</code> (valid index) is falsy.
        </div>
        <div style={S.trap}>
          <strong style={{ color: '#d71921' }}>TRAP 2:</strong> <code>substring(start, end)</code> — the <strong>end index is exclusive</strong>.
          <code>"abc".substring(0, 2)</code> → <code>"ab"</code> (not <code>"abc"</code>).
        </div>
        <div style={S.trap}>
          <strong style={{ color: '#d71921' }}>TRAP 3:</strong> <code>"hello".split("")</code> splits into <strong>every single character</strong>.
        </div>
        <div style={S.trap}>
          <strong style={{ color: '#d71921' }}>TRAP 4:</strong> All string methods are <strong>CASE SENSITIVE</strong>.
          <code>"Hello".includes("hello")</code> → <code>false</code>.
        </div>
        <div style={S.trap}>
          <strong style={{ color: '#d71921' }}>TRAP 5:</strong> <code>charAt()</code> out of range returns <strong>""</strong> (empty string), not <code>undefined</code>.
        </div>
        <div style={S.trap}>
          <strong style={{ color: '#d71921' }}>TRAP 6:</strong> Strings are <strong>IMMUTABLE</strong>. Methods always return <strong>new</strong> strings; the original is never modified.
        </div>

        {/* ── Interactive String Console ── */}
        <h3 style={S.subHeader}>Interactive String Console</h3>
        <div style={S.interactive}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={S.label}>Input String</label>
              <input style={S.input} value={strInput} onChange={e => setStrInput(e.target.value)} placeholder="Type your string..." />
            </div>
            <div>
              <label style={S.label}>Search / Needle</label>
              <input style={S.input} value={needle} onChange={e => setNeedle(e.target.value)} placeholder="Needle for search methods..." />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--nothing-text-dim)', marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Live Results
          </div>
          <div style={{ background: '#000', border: '1px solid var(--nothing-border)', padding: 12 }}>
            {([
              ['.length', () => strInput.length],
              [`.charAt(0)`, () => strInput.charAt(0)],
              [`.charAt(${strInput.length - 1})`, () => strInput.charAt(strInput.length - 1)],
              [`.charCodeAt(0)`, () => strInput.charCodeAt(0)],
              [`.indexOf("${needle}")`, () => strInput.indexOf(needle)],
              [`.lastIndexOf("${needle}")`, () => strInput.lastIndexOf(needle)],
              [`.includes("${needle}")`, () => strInput.includes(needle)],
              [`.startsWith("${needle}")`, () => strInput.startsWith(needle)],
              [`.endsWith("${needle}")`, () => strInput.endsWith(needle)],
              [`.toUpperCase()`, () => strInput.toUpperCase()],
              [`.toLowerCase()`, () => strInput.toLowerCase()],
              [`.trim()`, () => strInput.trim()],
              [`.substring(0, 5)`, () => strInput.substring(0, 5)],
              [`.slice(-3)`, () => strInput.slice(-3)],
              [`.split("${needle}")`, () => strInput.split(needle)],
              [`.replace("${needle}", "___")`, () => strInput.replace(needle, '___')],
              [`.concat(" + extra")`, () => strInput.concat(' + extra')],
            ] as [string, () => unknown][]).map(([label, fn], i) => (
              <div key={i} style={S.resultRow}>
                <span style={{ color: 'var(--nothing-text-muted)' }}>{label}</span>
                <span style={{ color: '#fff', maxWidth: '50%', textAlign: 'right', wordBreak: 'break-all' }}>{safe(fn)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════╗
         ║  SECTION 2 — DATE OBJECT                            ║
         ╚══════════════════════════════════════════════════════╝ */}
      <section>
        <h2 style={S.sectionHeader}>2 · Date Object</h2>

        <p style={S.p}>
          The <code>Date</code> object represents a single point in time, stored internally as the number of <strong style={{ color: '#fff' }}>milliseconds since January 1, 1970 00:00:00 UTC</strong> (the Unix Epoch).
        </p>

        {/* ── Construction ── */}
        <h3 style={S.subHeader}>Date Construction</h3>
        <pre style={S.code}>{`// 1. No arguments — current date and time
const now = new Date();

// 2. Milliseconds since epoch
const epoch = new Date(0);           // Jan 1, 1970 00:00:00 UTC
const later = new Date(1000000000);  // some time in 2001

// 3. Components: year, month (0-based!), day, h, m, s, ms
const christmas = new Date(2026, 11, 25);       // Dec 25, 2026
const precise   = new Date(2026, 0, 15, 10, 30, 0, 0);

// 4. Date string (ISO 8601 recommended)
const parsed = new Date("2026-06-15T10:30:00");
const simple = new Date("June 15, 2026");

// ⚠ CRITICAL: Month 0 = January, Month 11 = December
new Date(2026, 0, 1);   // January 1, 2026
new Date(2026, 11, 31); // December 31, 2026`}</pre>

        {/* ── Getter Methods Table ── */}
        <h3 style={S.subHeader}>Date Getter Methods</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Method</th>
                <th style={S.th}>Returns</th>
                <th style={S.th}>Range</th>
                <th style={S.th}>Description</th>
              </tr>
            </thead>
            <tbody>
              {([
                ['getFullYear()', 'number', '4 digits', 'Full year (e.g. 2026)'],
                ['getMonth()', 'number', '0–11', '⚠ Month (0 = Jan, 11 = Dec)'],
                ['getDate()', 'number', '1–31', 'Day of month'],
                ['getDay()', 'number', '0–6', 'Day of week (0 = Sunday)'],
                ['getHours()', 'number', '0–23', 'Hours'],
                ['getMinutes()', 'number', '0–59', 'Minutes'],
                ['getSeconds()', 'number', '0–59', 'Seconds'],
                ['getMilliseconds()', 'number', '0–999', 'Milliseconds'],
                ['getTime()', 'number', 'ms since epoch', 'Milliseconds since Jan 1 1970'],
                ['valueOf()', 'number', 'ms since epoch', 'Same as getTime()'],
              ] as string[][]).map(([m, r, range, d], i) => (
                <tr key={i}>
                  <td style={{ ...S.td, color: '#fff', fontWeight: 600 }}>{m}</td>
                  <td style={S.td}>{r}</td>
                  <td style={{ ...S.td, color: 'var(--nothing-text-muted)' }}>{range}</td>
                  <td style={S.td}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={S.subHeader}>Setter Methods</h3>
        <pre style={S.code}>{`const d = new Date();
d.setFullYear(2030);      // Set year
d.setMonth(5);            // Set month (June, 0-based)
d.setDate(15);            // Set day of month
d.setHours(10);           // Set hours
d.setMinutes(30);         // Set minutes
d.setSeconds(0);          // Set seconds
d.setMilliseconds(0);     // Set milliseconds
d.setTime(0);             // Set to epoch`}</pre>

        {/* ── UTC Methods ── */}
        <h3 style={S.subHeader}>UTC Methods</h3>
        <pre style={S.code}>{`const d = new Date();

// UTC getters — same as local getters but in UTC timezone
d.getUTCFullYear();    // Year in UTC
d.getUTCMonth();       // Month in UTC (still 0-based)
d.getUTCDate();        // Day in UTC
d.getUTCDay();         // Day of week in UTC
d.getUTCHours();       // Hours in UTC
d.getUTCMinutes();     // Minutes in UTC
d.getUTCSeconds();     // Seconds in UTC`}</pre>

        {/* ── Static Methods ── */}
        <h3 style={S.subHeader}>Static Methods</h3>
        <pre style={S.code}>{`// Date.now() — ms since epoch (no need to create a Date object)
const timestamp = Date.now();   // e.g. 1781743200000

// Date.UTC(year, month, day, h, m, s, ms) — returns ms value
const utcMs = Date.UTC(2026, 0, 1);  // Jan 1 2026 in UTC
const d = new Date(utcMs);

// Date.parse(string) — parse date string to ms
Date.parse("2026-06-15");    // ms since epoch`}</pre>

        {/* ── Formatting ── */}
        <h3 style={S.subHeader}>Date Formatting Methods</h3>
        <pre style={S.code}>{`const d = new Date(2026, 5, 15, 14, 30, 0);

d.toString();          // "Mon Jun 15 2026 14:30:00 GMT+0500 ..."
d.toDateString();      // "Mon Jun 15 2026"
d.toTimeString();      // "14:30:00 GMT+0500 ..."
d.toISOString();       // "2026-06-15T09:30:00.000Z"
d.toLocaleDateString();// locale-dependent, e.g. "6/15/2026"
d.toLocaleTimeString();// locale-dependent, e.g. "2:30:00 PM"
d.toJSON();            // same as toISOString()`}</pre>

        {/* ── Date Arithmetic ── */}
        <h3 style={S.subHeader}>Date Arithmetic</h3>
        <pre style={S.code}>{`// Difference between two dates (in ms)
const d1 = new Date(2026, 0, 1);
const d2 = new Date(2026, 5, 15);
const diffMs = d2 - d1;
const diffDays = diffMs / (1000 * 60 * 60 * 24); // ~165 days

// Add 7 days
const next = new Date();
next.setDate(next.getDate() + 7);

// Compare dates
if (d2 > d1) { console.log("d2 is later"); }
if (d1.getTime() === d2.getTime()) { console.log("same moment"); }`}</pre>

        {/* ── Date Traps ── */}
        <h3 style={S.subHeader}>⚠ Common Date Traps</h3>
        <div style={S.trap}>
          <strong style={{ color: '#d71921' }}>TRAP 1:</strong> Months are <strong>0-indexed</strong>! January = 0, December = 11.
          <code style={{ display: 'block', marginTop: 4 }}>new Date(2026, 1, 1)</code> → <strong>February</strong> 1, not January.
        </div>
        <div style={S.trap}>
          <strong style={{ color: '#d71921' }}>TRAP 2:</strong> <code>getDate()</code> returns the <strong>day of the month</strong> (1-31).
          <code>getDay()</code> returns the <strong>day of the week</strong> (0 = Sunday, 6 = Saturday). Don't confuse them!
        </div>
        <div style={S.trap}>
          <strong style={{ color: '#d71921' }}>TRAP 3:</strong> <code>getYear()</code> is <strong>DEPRECATED</strong>. Always use <code>getFullYear()</code>.
          <code>getYear()</code> returns years since 1900 (e.g., 126 for 2026).
        </div>
        <div style={S.trap}>
          <strong style={{ color: '#d71921' }}>TRAP 4:</strong> <code>new Date()</code> without <code>new</code> → returns a <strong>string</strong>, not a Date object.
          <code>Date()</code> → string. <code>new Date()</code> → Date object.
        </div>

        {/* ── Interactive Date Explorer ── */}
        <h3 style={S.subHeader}>Interactive Date Explorer — Live Clock</h3>
        <div style={S.interactive}>
          <div style={{
            fontFamily: 'var(--font-dot)',
            fontSize: 40,
            letterSpacing: '0.1em',
            textAlign: 'center',
            marginBottom: 20,
            color: '#fff',
          }}>
            {now.toLocaleTimeString()}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {([
              ['getFullYear()', now.getFullYear()],
              ['getMonth()', `${now.getMonth()} (${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][now.getMonth()]})`],
              ['getDate()', now.getDate()],
              ['getDay()', `${now.getDay()} (${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][now.getDay()]})`],
              ['getHours()', now.getHours()],
              ['getMinutes()', now.getMinutes()],
              ['getSeconds()', now.getSeconds()],
              ['getMilliseconds()', now.getMilliseconds()],
              ['getTime()', now.getTime()],
              ['getTimezoneOffset()', `${now.getTimezoneOffset()} min`],
              ['toISOString()', now.toISOString()],
              ['toDateString()', now.toDateString()],
            ] as [string, unknown][]).map(([label, val], i) => (
              <div key={i} style={{
                background: '#000',
                border: '1px solid var(--nothing-border)',
                padding: '8px 12px',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--nothing-text-dim)', letterSpacing: '0.1em', marginBottom: 4 }}>
                  {label}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#fff', wordBreak: 'break-all' }}>
                  {String(val)}
                </div>
              </div>
            ))}
          </div>

          {/* ── Month visual ── */}
          <div style={{ marginTop: 16, padding: 12, background: '#000', border: '1px solid var(--nothing-border)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--nothing-text-dim)', letterSpacing: '0.12em', marginBottom: 8, textTransform: 'uppercase' }}>
              Month Index Map (0-based!)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                <div key={i} style={{
                  padding: '4px 8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  background: i === now.getMonth() ? '#fff' : 'transparent',
                  color: i === now.getMonth() ? '#000' : 'var(--nothing-text-dim)',
                  border: '1px solid var(--nothing-border)',
                }}>
                  {i}:{m}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════╗
         ║  SECTION 3 — WEB STORAGE                            ║
         ╚══════════════════════════════════════════════════════╝ */}
      <section>
        <h2 style={S.sectionHeader}>3 · Web Storage API</h2>

        <p style={S.p}>
          The Web Storage API provides two mechanisms for storing key-value pairs in the browser:
          <strong style={{ color: '#fff' }}> localStorage</strong> (persists until explicitly cleared) and
          <strong style={{ color: '#fff' }}> sessionStorage</strong> (cleared when the tab/window closes).
          Both share the same API but differ in lifecycle and scope.
        </p>

        {/* ── Comparison Table ── */}
        <h3 style={S.subHeader}>localStorage vs sessionStorage</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Feature</th>
                <th style={S.th}>localStorage</th>
                <th style={S.th}>sessionStorage</th>
              </tr>
            </thead>
            <tbody>
              {([
                ['Persistence', 'Until explicitly cleared (survives browser restart)', 'Until tab/window is closed'],
                ['Scope', 'Same origin (protocol + domain + port)', 'Same origin AND same tab/window'],
                ['Capacity', '~5–10 MB per origin', '~5–10 MB per origin'],
                ['Shared across tabs?', 'Yes', 'No — each tab has its own'],
                ['Accessible from', 'Any script on the same origin', 'Only the tab that created it'],
                ['Survives page reload?', 'Yes', 'Yes'],
                ['Survives browser close?', 'Yes', 'No'],
              ] as string[][]).map(([f, l, s], i) => (
                <tr key={i}>
                  <td style={{ ...S.td, fontWeight: 600, color: '#fff' }}>{f}</td>
                  <td style={S.td}>{l}</td>
                  <td style={S.td}>{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── API Methods Table ── */}
        <h3 style={S.subHeader}>Storage API Methods</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Method / Property</th>
                <th style={S.th}>Parameters</th>
                <th style={S.th}>Returns</th>
                <th style={S.th}>Description</th>
              </tr>
            </thead>
            <tbody>
              {([
                ['setItem(key, value)', 'key: string, value: string', 'void', 'Stores a key-value pair. Overwrites if key exists.'],
                ['getItem(key)', 'key: string', 'string | null', 'Returns value for key, or null if not found.'],
                ['removeItem(key)', 'key: string', 'void', 'Removes the key and its value.'],
                ['clear()', '—', 'void', 'Removes ALL keys from this storage.'],
                ['key(index)', 'index: number', 'string | null', 'Returns the key name at the given index.'],
                ['.length', '—', 'number', 'Number of stored key-value pairs.'],
              ] as string[][]).map(([m, p, r, d], i) => (
                <tr key={i}>
                  <td style={{ ...S.td, color: '#fff', fontWeight: 600 }}>{m}</td>
                  <td style={S.td}>{p}</td>
                  <td style={{ ...S.td, color: 'var(--nothing-text-muted)' }}>{r}</td>
                  <td style={S.td}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Usage Examples ── */}
        <h3 style={S.subHeader}>Basic Usage</h3>
        <pre style={S.code}>{`// Store
localStorage.setItem("username", "Alice");
localStorage.setItem("theme", "dark");

// Retrieve
const user = localStorage.getItem("username");  // "Alice"
const missing = localStorage.getItem("xyz");     // null

// Remove one key
localStorage.removeItem("theme");

// How many items?
console.log(localStorage.length);  // 1

// Get key name by index
localStorage.key(0);  // "username"

// Remove everything
localStorage.clear();`}</pre>

        {/* ── JSON Pattern ── */}
        <h3 style={S.subHeader}>JSON Integration Pattern</h3>
        <pre style={S.code}>{`// ⚠ Web Storage only stores STRINGS!
// To store objects or arrays, use JSON.stringify / JSON.parse

// STORING an object
const user = { name: "Alice", age: 25, roles: ["admin", "user"] };
localStorage.setItem("user", JSON.stringify(user));
// Stored as: '{"name":"Alice","age":25,"roles":["admin","user"]}'

// RETRIEVING and parsing
const raw = localStorage.getItem("user");  // string or null
const parsed = JSON.parse(raw);            // object (or null)

// SAFE pattern (defensive coding)
function getStoredData(key) {
  const raw = localStorage.getItem(key);
  if (raw === null) return null;       // key not found
  try {
    return JSON.parse(raw);
  } catch (e) {
    return raw;  // return as plain string if not valid JSON
  }
}

// ⚠ JSON.parse(null)      → null        (safe!)
// ⚠ JSON.parse(undefined) → THROWS!     (dangerous!)
// ⚠ JSON.parse("")        → THROWS!     (dangerous!)`}</pre>

        {/* ── sessionStorage ── */}
        <h3 style={S.subHeader}>sessionStorage Example</h3>
        <pre style={S.code}>{`// Exact same API as localStorage
sessionStorage.setItem("tempData", "123");
sessionStorage.getItem("tempData");   // "123"
sessionStorage.removeItem("tempData");
sessionStorage.clear();

// Use case: wizard/form progress that shouldn't persist
sessionStorage.setItem("step", "3");`}</pre>

        {/* ── Iterating Storage ── */}
        <h3 style={S.subHeader}>Iterating Over All Stored Items</h3>
        <pre style={S.code}>{`// Method 1: for loop with key()
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(key, "=", value);
}

// Method 2: Object.keys
Object.keys(localStorage).forEach(key => {
  console.log(key, "=", localStorage.getItem(key));
});`}</pre>

        {/* ── Storage Traps ── */}
        <h3 style={S.subHeader}>⚠ Common Web Storage Traps</h3>
        <div style={S.trap}>
          <strong style={{ color: '#d71921' }}>TRAP 1:</strong> Storage only stores <strong>STRINGS</strong>.
          <code>localStorage.setItem("num", 42)</code> stores the string <code>"42"</code>.
          <code>localStorage.getItem("num") === 42</code> → <code>false</code> (it's <code>"42"</code>).
        </div>
        <div style={S.trap}>
          <strong style={{ color: '#d71921' }}>TRAP 2:</strong> <code>JSON.parse(null)</code> returns <code>null</code> (safe).
          <code>JSON.parse(undefined)</code> <strong>throws a SyntaxError</strong>!
        </div>
        <div style={S.trap}>
          <strong style={{ color: '#d71921' }}>TRAP 3:</strong> <strong>Never store passwords or sensitive data</strong> in Web Storage.
          It's accessible to any JavaScript on the same origin (XSS vulnerable).
        </div>
        <div style={S.trap}>
          <strong style={{ color: '#d71921' }}>TRAP 4:</strong> All storage operations are <strong>synchronous</strong> and block the main thread.
          Avoid storing very large amounts of data.
        </div>
        <div style={S.trap}>
          <strong style={{ color: '#d71921' }}>TRAP 5:</strong> <code>getItem()</code> returns <code>null</code> (not <code>undefined</code>) for missing keys.
        </div>

        {/* ── Storage Event ── */}
        <h3 style={S.subHeader}>The storage Event</h3>
        <pre style={S.code}>{`// Fires in OTHER tabs/windows when localStorage changes
window.addEventListener("storage", (event) => {
  console.log("Key changed:", event.key);
  console.log("Old value:", event.oldValue);
  console.log("New value:", event.newValue);
  console.log("URL:", event.url);
  console.log("Storage area:", event.storageArea);
});
// NOTE: Does NOT fire in the same tab that made the change!`}</pre>

        {/* ── Interactive Storage Lab ── */}
        <h3 style={S.subHeader}>Interactive Storage Lab</h3>
        <div style={S.interactive}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={S.label}>Key</label>
              <input style={S.input} value={storageKey} onChange={e => setStorageKey(e.target.value)} placeholder="e.g. username" />
            </div>
            <div>
              <label style={S.label}>Value</label>
              <input style={S.input} value={storageValue} onChange={e => setStorageValue(e.target.value)} placeholder="e.g. Alice" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <button style={S.btn} onClick={() => {
              if (storageKey) { localStorage.setItem(storageKey, storageValue); refreshStorage(); setStorageResult(`Set "${storageKey}" = "${storageValue}"`); }
            }}>setItem</button>
            <button style={S.btn} onClick={() => {
              const v = localStorage.getItem(storageKey);
              setStorageResult(`getItem("${storageKey}") → ${v === null ? 'null' : `"${v}"`}`);
            }}>getItem</button>
            <button style={S.btn} onClick={() => {
              localStorage.removeItem(storageKey); refreshStorage();
              setStorageResult(`Removed "${storageKey}"`);
            }}>removeItem</button>
            <button style={{ ...S.btn, background: '#d71921', color: '#fff' }} onClick={() => {
              localStorage.clear(); refreshStorage();
              setStorageResult('Cleared all localStorage');
            }}>clear()</button>
          </div>

          {storageResult && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--nothing-text-muted)', marginBottom: 12, padding: '8px 12px', background: '#000', border: '1px solid var(--nothing-border)' }}>
              → {storageResult}
            </div>
          )}

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--nothing-text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            Current localStorage Contents ({storageItems.length} items)
          </div>
          <div style={{ background: '#000', border: '1px solid var(--nothing-border)', padding: 12, maxHeight: 200, overflowY: 'auto' }}>
            {storageItems.length === 0 ? (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--nothing-text-dim)' }}>
                (empty)
              </div>
            ) : storageItems.map(([k, v], i) => (
              <div key={i} style={S.resultRow}>
                <span style={{ color: '#fff' }}>{k}</span>
                <span style={{ color: 'var(--nothing-text-muted)', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════╗
         ║  SECTION 4 — CHEAT SHEET                            ║
         ╚══════════════════════════════════════════════════════╝ */}
      <section>
        <h2 style={S.sectionHeader}>4 · Cheat Sheet</h2>

        <h3 style={S.subHeader}>String Methods</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Method</th>
                <th style={S.th}>Example</th>
                <th style={S.th}>Result</th>
              </tr>
            </thead>
            <tbody>
              {([
                ['charAt(i)', '"abc".charAt(1)', '"b"'],
                ['charCodeAt(i)', '"A".charCodeAt(0)', '65'],
                ['indexOf(s)', '"banana".indexOf("a")', '1'],
                ['lastIndexOf(s)', '"banana".lastIndexOf("a")', '5'],
                ['includes(s)', '"hello".includes("ell")', 'true'],
                ['startsWith(s)', '"hello".startsWith("he")', 'true'],
                ['endsWith(s)', '"hello".endsWith("lo")', 'true'],
                ['split(sep)', '"a,b,c".split(",")', '["a","b","c"]'],
                ['substring(s,e)', '"hello".substring(1,3)', '"el"'],
                ['slice(s,e)', '"hello".slice(-2)', '"lo"'],
                ['toUpperCase()', '"hi".toUpperCase()', '"HI"'],
                ['toLowerCase()', '"HI".toLowerCase()', '"hi"'],
                ['trim()', '"  x  ".trim()', '"x"'],
                ['replace(s,r)', '"abc".replace("a","X")', '"Xbc"'],
                ['concat(...s)', '"a".concat("b","c")', '"abc"'],
              ] as string[][]).map(([m, ex, res], i) => (
                <tr key={i}>
                  <td style={{ ...S.td, fontWeight: 600, color: '#fff' }}>{m}</td>
                  <td style={S.td}>{ex}</td>
                  <td style={{ ...S.td, color: 'var(--nothing-text-muted)' }}>{res}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={S.subHeader}>Date Quick Reference</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Method</th>
                <th style={S.th}>Example</th>
                <th style={S.th}>Note</th>
              </tr>
            </thead>
            <tbody>
              {([
                ['new Date()', 'new Date()', 'Current date/time'],
                ['new Date(y,m,d)', 'new Date(2026,0,1)', 'Jan 1 2026 (month 0-based!)'],
                ['getFullYear()', 'd.getFullYear()', '2026'],
                ['getMonth()', 'd.getMonth()', '0 = Jan, 11 = Dec'],
                ['getDate()', 'd.getDate()', 'Day of month (1-31)'],
                ['getDay()', 'd.getDay()', 'Day of week (0=Sun)'],
                ['getHours()', 'd.getHours()', '0-23'],
                ['getTime()', 'd.getTime()', 'ms since epoch'],
                ['Date.now()', 'Date.now()', 'ms since epoch (static)'],
                ['toISOString()', 'd.toISOString()', 'ISO 8601 format'],
              ] as string[][]).map(([m, ex, note], i) => (
                <tr key={i}>
                  <td style={{ ...S.td, fontWeight: 600, color: '#fff' }}>{m}</td>
                  <td style={S.td}>{ex}</td>
                  <td style={{ ...S.td, color: 'var(--nothing-text-muted)' }}>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={S.subHeader}>Web Storage Quick Reference</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Operation</th>
                <th style={S.th}>Code</th>
                <th style={S.th}>Note</th>
              </tr>
            </thead>
            <tbody>
              {([
                ['Store string', 'localStorage.setItem("k","v")', 'Overwrites if exists'],
                ['Retrieve', 'localStorage.getItem("k")', 'Returns null if missing'],
                ['Delete', 'localStorage.removeItem("k")', 'No error if missing'],
                ['Clear all', 'localStorage.clear()', 'Removes everything'],
                ['Count', 'localStorage.length', 'Number of pairs'],
                ['Key by index', 'localStorage.key(0)', 'Key name at index'],
                ['Store object', 'localStorage.setItem("k", JSON.stringify(obj))', 'Must stringify'],
                ['Retrieve object', 'JSON.parse(localStorage.getItem("k"))', 'Must parse'],
              ] as string[][]).map(([op, code, note], i) => (
                <tr key={i}>
                  <td style={{ ...S.td, fontWeight: 600, color: '#fff' }}>{op}</td>
                  <td style={S.td}>{code}</td>
                  <td style={{ ...S.td, color: 'var(--nothing-text-muted)' }}>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Visual Diagram: Storage Lifecycle ── */}
        <h3 style={S.subHeader}>Storage Lifecycle Diagram</h3>
        <div style={{ ...S.interactive, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
              {/* localStorage column */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ padding: '12px 24px', border: '2px solid #fff', marginBottom: 8, fontWeight: 700, fontSize: 13 }}>
                  localStorage
                </div>
                <div style={{ color: 'var(--nothing-text-muted)', fontSize: 10 }}>
                  ↓ persists
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                  {['Page reload', 'Tab close', 'Browser close', 'System restart'].map((e, i) => (
                    <div key={i} style={{ padding: '4px 12px', background: '#0a3a0a', border: '1px solid #1a5a1a', fontSize: 10 }}>
                      ✓ Survives {e}
                    </div>
                  ))}
                  <div style={{ padding: '4px 12px', background: '#3a0a0a', border: '1px solid #5a1a1a', fontSize: 10 }}>
                    ✗ clear() / removeItem()
                  </div>
                </div>
              </div>

              {/* sessionStorage column */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ padding: '12px 24px', border: '2px solid var(--nothing-text-muted)', marginBottom: 8, fontWeight: 700, fontSize: 13 }}>
                  sessionStorage
                </div>
                <div style={{ color: 'var(--nothing-text-muted)', fontSize: 10 }}>
                  ↓ temporary
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                  <div style={{ padding: '4px 12px', background: '#0a3a0a', border: '1px solid #1a5a1a', fontSize: 10 }}>
                    ✓ Survives Page reload
                  </div>
                  {['Tab close', 'Browser close', 'System restart'].map((e, i) => (
                    <div key={i} style={{ padding: '4px 12px', background: '#3a0a0a', border: '1px solid #5a1a1a', fontSize: 10 }}>
                      ✗ Lost on {e}
                    </div>
                  ))}
                  <div style={{ padding: '4px 12px', background: '#3a0a0a', border: '1px solid #5a1a1a', fontSize: 10 }}>
                    ✗ Not shared across tabs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════╗
         ║  SECTION 5 — QUIZ                                   ║
         ╚══════════════════════════════════════════════════════╝ */}
      <section>
        <h2 style={S.sectionHeader}>5 · Quiz</h2>
        <p style={S.p}>
          Test your understanding of String, Date, and Web Storage. Select an answer for each question, then check your results.
        </p>

        {quizzes.map((quiz, qi) => (
          <div key={qi} style={{ ...S.card, marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--nothing-text-dim)', letterSpacing: '0.1em', marginBottom: 8 }}>
              QUESTION {qi + 1}
            </div>
            <div style={{ fontSize: 14, marginBottom: 12, lineHeight: 1.6 }}>
              {quiz.q}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {quiz.opts.map((opt, oi) => {
                const selected = quizAnswers[qi] === oi;
                const isCorrect = quiz.correct === oi;
                let bg = 'transparent';
                let borderColor = 'var(--nothing-border)';
                if (showQuizResults && selected && isCorrect) { bg = 'rgba(0,180,0,0.12)'; borderColor = '#0a5'; }
                if (showQuizResults && selected && !isCorrect) { bg = 'rgba(215,25,33,0.12)'; borderColor = '#d71921'; }
                if (showQuizResults && !selected && isCorrect) { bg = 'rgba(0,180,0,0.06)'; borderColor = '#0a5'; }

                return (
                  <button
                    key={oi}
                    onClick={() => { if (!showQuizResults) setQuizAnswers(a => ({ ...a, [qi]: oi })); }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 14px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      background: selected && !showQuizResults ? 'rgba(255,255,255,0.08)' : bg,
                      border: `1px solid ${selected && !showQuizResults ? '#fff' : borderColor}`,
                      color: 'var(--nothing-text)',
                      cursor: showQuizResults ? 'default' : 'pointer',
                    }}
                  >
                    <span style={{ color: 'var(--nothing-text-dim)', marginRight: 8 }}>
                      {String.fromCharCode(65 + oi)}.
                    </span>
                    {opt}
                    {showQuizResults && isCorrect && <span style={{ marginLeft: 8, color: '#0a5' }}>✓</span>}
                    {showQuizResults && selected && !isCorrect && <span style={{ marginLeft: 8, color: '#d71921' }}>✗</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            style={S.btn}
            onClick={() => setShowQuizResults(true)}
          >
            Check Answers
          </button>
          <button
            style={S.btnOutline}
            onClick={() => { setQuizAnswers({}); setShowQuizResults(false); }}
          >
            Reset
          </button>
        </div>

        {showQuizResults && (
          <div style={{
            marginTop: 16,
            padding: 16,
            border: '1px solid var(--nothing-border)',
            background: 'var(--nothing-surface)',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
          }}>
            Score: {quizzes.filter((q, i) => quizAnswers[i] === q.correct).length} / {quizzes.length}
            {quizzes.filter((q, i) => quizAnswers[i] === q.correct).length === quizzes.length && (
              <span style={{ marginLeft: 12, color: '#0a5' }}>★ Perfect!</span>
            )}
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <div style={{ height: 1, background: 'var(--nothing-border)' }} />
      <footer style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--nothing-text-dim)', letterSpacing: '0.1em', textAlign: 'center' }}>
        CHAPTER 11 · STRING · DATE · WEB STORAGE · END
      </footer>
    </div>
  );
};
