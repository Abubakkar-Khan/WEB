import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Server, Cloud, Lock, AlertTriangle, Database, Eye, Key, Bug, FileWarning, MonitorX, Globe, Container, Rocket, GitBranch, Layers, Zap, BookOpen, CheckCircle, XCircle, HelpCircle, Cpu } from 'lucide-react';

/* ───────── shared inline style helpers ───────── */
const cardStyle: React.CSSProperties = {
  background: 'var(--nothing-surface)', border: '1px solid var(--nothing-border)',
  padding: 20, borderRadius: 0,
};
const monoLabel: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--nothing-text-muted)',
  letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 6,
};
const codeBlock: React.CSSProperties = {
  background: 'var(--nothing-bg)', padding: 14, fontFamily: 'var(--font-mono)', fontSize: 16,
  border: '1px solid var(--nothing-border)', overflowX: 'auto', lineHeight: 1.9,
  color: 'var(--nothing-text)', whiteSpace: 'pre',
};
const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid var(--nothing-border)',
  color: 'var(--nothing-text-muted)', fontWeight: 600, textTransform: 'uppercase' as const,
  letterSpacing: '0.08em', fontSize: 15,
};
const tdStyle: React.CSSProperties = {
  padding: '12px 16px', borderBottom: '1px solid var(--nothing-border)',
  color: 'var(--nothing-text)', verticalAlign: 'top',
};
const tagStyle = (color: string): React.CSSProperties => ({
  display: 'inline-block', padding: '2px 8px', fontSize: 16, fontFamily: 'var(--font-mono)',
  letterSpacing: '0.1em', textTransform: 'uppercase' as const, border: `1px solid ${color}`,
  color, marginBottom: 6,
});
const btnStyle: React.CSSProperties = {
  padding: '10px 20px', fontFamily: 'var(--font-mono)', fontSize: 16, letterSpacing: '0.08em',
  textTransform: 'uppercase' as const, border: '1px solid var(--nothing-text)',
  background: 'transparent', color: 'var(--nothing-text)', cursor: 'pointer',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)',
  color: 'var(--nothing-text)', fontFamily: 'var(--font-mono)', fontSize: 15,
};

/* ───────── OWASP Data ───────── */
const owaspData = [
  { id: 1, name: 'SQL Injection', icon: Database, desc: 'Attacker injects SQL code into input fields to manipulate database queries, potentially reading, modifying or deleting data.', example: "SELECT * FROM users WHERE name = '' OR '1'='1'", prevention: 'Use parameterized queries / prepared statements. Never concatenate user input into SQL.' },
  { id: 2, name: 'Cross-Site Scripting (XSS)', icon: Bug, desc: 'Malicious scripts are injected into trusted websites, executing in victim\'s browser to steal cookies, sessions, or redirect users.', example: '<script>document.cookie</script>', prevention: 'Sanitize & encode user output. Use Content-Security-Policy headers. Escape HTML entities.' },
  { id: 3, name: 'Broken Authentication', icon: Key, desc: 'Weak passwords, session fixation, credential stuffing, and missing MFA allow attackers to impersonate users.', example: 'admin/admin credentials, session IDs in URL, no brute-force protection', prevention: 'Enforce strong passwords, implement MFA, use secure session management, hash passwords with bcrypt.' },
  { id: 4, name: 'Sensitive Data Exposure', icon: Eye, desc: 'Unencrypted sensitive data in transit or at rest — credit cards, health records, personal info transmitted over HTTP.', example: 'Passwords stored in plaintext, API keys in client-side code', prevention: 'Encrypt data at rest and in transit (TLS). Don\'t store sensitive data unnecessarily. Use strong algorithms.' },
  { id: 5, name: 'XML External Entities (XXE)', icon: FileWarning, desc: 'Attackers exploit XML parsers to read local files, perform SSRF, or execute remote code via malicious XML payloads.', example: '<!ENTITY xxe SYSTEM "file:///etc/passwd">', prevention: 'Disable DTDs and external entities in XML parsers. Use JSON instead. Validate XML input.' },
  { id: 6, name: 'Broken Access Control', icon: Lock, desc: 'Users can access resources and perform actions outside their intended permissions — viewing other users\' data, admin endpoints.', example: 'Changing /api/user/123 to /api/user/456 to see another user\'s data', prevention: 'Deny by default. Implement RBAC. Validate permissions server-side on every request.' },
  { id: 7, name: 'Security Misconfiguration', icon: AlertTriangle, desc: 'Default credentials, unnecessary features enabled, verbose error messages exposing stack traces, open cloud storage buckets.', example: 'Default admin:admin on database, directory listing enabled, stack traces in production', prevention: 'Harden configs. Remove defaults. Automate config audits. Disable debug in production.' },
  { id: 8, name: 'Cross-Site Request Forgery (CSRF)', icon: Globe, desc: 'Forged requests are sent from a site the user is currently authenticated with, executing unwanted actions.', example: '<img src="https://bank.com/transfer?to=attacker&amount=10000">', prevention: 'Use CSRF tokens. Validate Origin/Referer headers. SameSite cookie attribute.' },
  { id: 9, name: 'Known Vulnerabilities', icon: MonitorX, desc: 'Using outdated libraries and frameworks with publicly known vulnerabilities that attackers can exploit automatically.', example: 'Running jQuery 1.x with known XSS, unpatched Log4j (Log4Shell)', prevention: 'Regularly update dependencies. Use npm audit / Snyk. Monitor CVE databases.' },
  { id: 10, name: 'Insufficient Logging', icon: Shield, desc: 'Lack of logging, monitoring, and alerting means breaches go undetected for weeks or months.', example: 'No logs for failed login attempts, no alerts for unusual data access patterns', prevention: 'Log security events. Set up alerts for anomalies. Retain logs for forensic analysis.' },
];

/* ───────── Quiz Data ───────── */
const quizQuestions = [
  { q: 'Which OWASP vulnerability involves injecting malicious SQL into input fields?', opts: ['XSS', 'SQL Injection', 'CSRF', 'XXE'], answer: 1 },
  { q: 'What is the difference between Authentication and Authorization?', opts: ['Auth is about identity, Authz is about permissions', 'They are the same thing', 'Auth is server-side, Authz is client-side', 'Auth uses tokens, Authz uses cookies'], answer: 0 },
  { q: 'In a TLS handshake, what does the client send first?', opts: ['Certificate', 'Session key', 'Client Hello with supported cipher suites', 'Encrypted payload'], answer: 2 },
  { q: 'What is the main advantage of containers over virtual machines?', opts: ['More secure', 'Lighter weight — share host OS kernel', 'Faster network', 'Built-in database'], answer: 1 },
  { q: 'Which deployment model is best for a static frontend site?', opts: ['AWS EC2 (IaaS)', 'Vercel / Netlify (PaaS)', 'Bare metal server', 'FTP upload'], answer: 1 },
  { q: 'In a microservices architecture, services communicate via:', opts: ['Shared memory', 'APIs / message queues', 'Direct function calls', 'Global variables'], answer: 1 },
  { q: 'Serverless functions are best described as:', opts: ['Always-on servers', 'Event-driven, pay-per-execution cloud functions', 'Local dev servers', 'Database engines'], answer: 1 },
  { q: 'What does CI/CD stand for?', opts: ['Code Integration / Code Deployment', 'Continuous Integration / Continuous Deployment', 'Compiled Interface / Compiled Design', 'Client Integration / Client Delivery'], answer: 1 },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */

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
        fontSize: '13px',
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


interface ChapterHeaderProps {
  num: string;
  title: string;
  subtitle: string;
  chapterWord: string;
}

const ChapterHeader: React.FC<ChapterHeaderProps> = ({ num, title, subtitle, chapterWord }) => {
  return (
    <div style={{ marginBottom: '40px', borderBottom: '1px solid var(--nothing-border)', paddingBottom: '24px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--nothing-text-dim)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
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

export const BonusChapter: React.FC = () => {
  /* SQL Injection Demo state */
  const [sqlUser, setSqlUser] = useState('');
  const [sqlPass, setSqlPass] = useState('');
  const [showSanitized, setShowSanitized] = useState(false);

  /* Deployment Advisor state */
  const [advisorStep, setAdvisorStep] = useState(0);
  const [advisorResult, setAdvisorResult] = useState<string | null>(null);

  /* Quiz state */
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  /* Expanded OWASP card */
  const [expandedOwasp, setExpandedOwasp] = useState<number | null>(null);

  /* ── SQL injection helpers ── */
  const unsafeQuery = `SELECT * FROM users\n  WHERE username = '${sqlUser}'\n  AND password = '${sqlPass}'`;
  const isMalicious = sqlUser.includes("'") || sqlPass.includes("'");
  const sanitizedQuery = `SELECT * FROM users\n  WHERE username = $1\n  AND password = $2\n-- $1 = ${JSON.stringify(sqlUser)}\n-- $2 = ${JSON.stringify(sqlPass)}`;

  /* ── Deployment Advisor logic ── */
  const advisorQuestions = [
    { q: 'Is your project a static frontend (HTML/CSS/JS only)?', yes: 'Vercel / Netlify — Free tier, instant deploys, global CDN.', noNext: 1 },
    { q: 'Do you need full server access (SSH, custom software)?', yes: 'AWS EC2 / GCP Compute / Azure VM (IaaS) — Full control, manual setup.', noNext: 2 },
    { q: 'Is it a Node.js / Python / Ruby backend application?', yes: 'Heroku / Railway / Render (PaaS) — Git push to deploy, managed infra.', noNext: 3 },
    { q: 'Do you need container orchestration at scale?', yes: 'AWS ECS / Google Kubernetes Engine — Container orchestration, auto-scaling.', noNext: 4 },
    { q: 'Is it a simple API or background task?', yes: 'AWS Lambda / Google Cloud Functions (Serverless) — Pay per execution, auto-scales.', noNext: -1 },
  ];

  const handleAdvisorAnswer = (isYes: boolean) => {
    const current = advisorQuestions[advisorStep];
    if (isYes) {
      setAdvisorResult(current.yes);
    } else if (current.noNext === -1) {
      setAdvisorResult('Consider a traditional VPS or dedicated server for your specific use case.');
    } else {
      setAdvisorStep(current.noNext);
    }
  };

  const resetAdvisor = () => { setAdvisorStep(0); setAdvisorResult(null); };

  /* ── Quiz helpers ── */
  const handleQuizSelect = (qi: number, oi: number) => {
    if (quizSubmitted) return;
    const copy = [...quizAnswers];
    copy[qi] = oi;
    setQuizAnswers(copy);
  };
  const quizScore = quizAnswers.reduce<number>((acc, a, i) => acc + (a === quizQuestions[i].answer ? 1 : 0), 0);

  /* ═══════════ RENDER ═══════════ */
  return (
    <div className="nt-page bonus-page">

      {/* ──────── CHAPTER HEADER ──────── */}
      <ChapterHeader num="++" title="Security &amp; DevOps" subtitle="Web Security · Modern Deployment · Architecture &amp; Trends" chapterWord="Bonus Module" />

      <div className="study-callout">
        <strong>Study route:</strong> connect security, hosting, containers, CI/CD, REST, and architecture to the class assignments. You should be able to justify a framework choice, deploy a simple page, and explain how frontend, backend, database, and network layers fit together.
      </div>

      <nav className="bonus-map" aria-label="Bonus module sections">
        <a href="#bonus-security">Security</a>
        <a href="#bonus-deployment">Deployment</a>
        <a href="#bonus-architecture">Architecture</a>
        <a href="#bonus-cheatsheet">Cheat Sheet</a>
        <a href="#bonus-practice">Practice</a>
        <a href="#bonus-quiz">Quiz</a>
      </nav>

      <div className="exercise-strip">
        {[
          ['Security Drill', 'Identify the vulnerability, explain the attack path, then name the prevention.'],
          ['Hosting Drill', 'Choose Vercel, PaaS, VPS, or serverless for three project scenarios.'],
          ['Architecture Drill', 'Draw client, server, API, database, deployment, and CI/CD flow for a class project.'],
        ].map(([title, desc]) => (
          <article className="exercise-card" key={title}>
            <span>Exercise</span>
            <h3>{title}</h3>
            <p>{desc}</p>
          </article>
        ))}
      </div>

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  SECTION 1: WEB SECURITY                                    ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      <section className="nt-section bonus-section" id="bonus-security">
        <SectionHeader no="01" title="Web Security" icon={<Shield size={22} />} />

        {/* ── OWASP Top 10 ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 className="nt-sub-header">OWASP Top 10 Vulnerabilities</h3>
          <p className="nt-prose">
            The Open Web Application Security Project (OWASP) publishes a list of the ten most critical web application security risks. Understanding these is essential for building secure software.
          </p>
          <div className="bonus-card-grid">
            {owaspData.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedOwasp === item.id;
              return (
                <motion.div key={item.id} layout
                  style={{ ...cardStyle, cursor: 'pointer', borderColor: isExpanded ? 'var(--nothing-text-muted)' : 'var(--nothing-border)' }}
                  onClick={() => setExpandedOwasp(isExpanded ? null : item.id)}
                  whileHover={{ borderColor: '#666' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ ...tagStyle('#fff'), minWidth: 24, textAlign: 'center' }}>#{item.id}</span>
                    <Icon size={16} style={{ color: 'var(--nothing-text-muted)' }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>{item.name}</span>
                  </div>
                  <p style={{ color: 'var(--nothing-text-muted)', fontSize: 15, lineHeight: 1.9 }}>{item.desc}</p>
                  {isExpanded && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 14 }}>
                      <div style={monoLabel}>EXAMPLE</div>
                      <pre style={{ ...codeBlock, marginBottom: 12, color: 'var(--nothing-red)' }}>{item.example}</pre>
                      <div style={monoLabel}>PREVENTION</div>
                      <p style={{ fontSize: 15, color: 'var(--nothing-text)', lineHeight: 1.9, padding: '10px 16px', background: 'var(--nothing-surface)', border: '1px solid var(--nothing-border)' }}>{item.prevention}</p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Interactive SQL Injection Demo ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 className="nt-sub-header">Interactive: SQL Injection Demo</h3>
          <p style={{ color: 'var(--nothing-text-muted)', fontSize: 15, marginBottom: 16, lineHeight: 1.9 }}>
            Type into the fields below to see how user input becomes part of a SQL query. Try typing <code style={{ color: 'var(--nothing-red)' }}>' OR '1'='1</code> into the username field.
          </p>
          <div className="bonus-cluster" style={{ marginBottom: 16 }}>
            <div>
              <div style={monoLabel}>USERNAME</div>
              <input style={inputStyle} value={sqlUser} onChange={e => setSqlUser(e.target.value)} placeholder="e.g. admin" />
            </div>
            <div>
              <div style={monoLabel}>PASSWORD</div>
              <input style={inputStyle} type="text" value={sqlPass} onChange={e => setSqlPass(e.target.value)} placeholder="e.g. secret123" />
            </div>
          </div>

          <div style={monoLabel}>GENERATED SQL QUERY (UNSAFE)</div>
          <pre style={{ ...codeBlock, borderColor: isMalicious ? 'var(--nothing-red)' : 'var(--nothing-border)', marginBottom: 10 }}>
{unsafeQuery}
          </pre>
          {isMalicious && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ padding: '12px 16px', border: '1px solid var(--nothing-red)', background: 'var(--nothing-red-bg)', marginBottom: 12 }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--nothing-red)' }}>
                Injection detected - the single quote breaks out of the string literal, altering the SQL logic.
              </span>
            </motion.div>
          )}

          <button style={{ ...btnStyle, marginBottom: 12 }} onClick={() => setShowSanitized(!showSanitized)}>
            {showSanitized ? 'Hide' : 'Show'} Sanitized Query (Parameterized)
          </button>
          {showSanitized && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={monoLabel}>PARAMETERIZED QUERY (SAFE)</div>
              <pre style={{ ...codeBlock, borderColor: 'var(--nothing-green)' }}>
{sanitizedQuery}
              </pre>
              <p style={{ color: 'var(--nothing-text-muted)', fontSize: 16, marginTop: 8 }}>
                User input is treated as data, never as executable SQL. The database driver handles escaping.
              </p>
            </motion.div>
          )}
        </div>

        {/* ── Authentication vs Authorization ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 className="nt-sub-header">Authentication vs Authorization</h3>
          <div className="bonus-cluster bonus-cluster--wide">
            <div style={{ ...cardStyle, borderTop: '3px solid #fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Key size={18} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>AUTHENTICATION</span>
              </div>
              <div style={{ ...tagStyle('var(--nothing-text-muted)'), marginBottom: 12 }}>WHO ARE YOU?</div>
              <p style={{ color: 'var(--nothing-text-muted)', fontSize: 15, lineHeight: 1.9, marginBottom: 14 }}>
                The process of verifying a user's <strong style={{ color: 'var(--nothing-text)' }}>identity</strong>. It answers: "Are you who you say you are?"
              </p>
              <div style={monoLabel}>METHODS</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text)', fontSize: 15, lineHeight: 2 }}>
                <li>Username + Password login</li>
                <li>OAuth / OpenID Connect (Google, GitHub)</li>
                <li>Biometrics (fingerprint, face ID)</li>
                <li>Multi-Factor Authentication (MFA)</li>
                <li>JWT / Session tokens</li>
              </ul>
            </div>
            <div style={{ ...cardStyle, borderTop: '3px solid var(--nothing-text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Shield size={18} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>AUTHORIZATION</span>
              </div>
              <div style={{ ...tagStyle('var(--nothing-text-muted)'), marginBottom: 12 }}>WHAT CAN YOU DO?</div>
              <p style={{ color: 'var(--nothing-text-muted)', fontSize: 15, lineHeight: 1.9, marginBottom: 14 }}>
                The process of verifying what <strong style={{ color: 'var(--nothing-text)' }}>permissions</strong> a user has. It answers: "Are you allowed to do this?"
              </p>
              <div style={monoLabel}>MECHANISMS</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text)', fontSize: 15, lineHeight: 2 }}>
                <li>Role-Based Access Control (RBAC)</li>
                <li>API scopes & permissions</li>
                <li>Admin panel access control</li>
                <li>File/resource permissions</li>
                <li>Policy engines (AWS IAM)</li>
              </ul>
            </div>
          </div>
          <div style={{ ...cardStyle, marginTop: 16, display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px' }}>
            <AlertTriangle size={16} style={{ color: 'var(--nothing-red)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--nothing-text-muted)' }}>
              KEY INSIGHT: Authentication always comes BEFORE authorization. You must know WHO the user is before deciding WHAT they can do.
            </span>
          </div>
        </div>

        {/* ── HTTPS / TLS ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 className="nt-sub-header">HTTPS & TLS Handshake</h3>

          {/* HTTP vs HTTPS comparison */}
          <div className="bonus-cluster" style={{ marginBottom: 24 }}>
            <div style={{ ...cardStyle, borderLeft: '3px solid var(--nothing-red)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8, color: 'var(--nothing-red)' }}>HTTP</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text-muted)', fontSize: 15, lineHeight: 2 }}>
                <li>Data sent in <strong style={{ color: 'var(--nothing-text)' }}>plaintext</strong></li>
                <li>Vulnerable to eavesdropping</li>
                <li>No server identity verification</li>
                <li>Port 80</li>
                <li>Man-in-the-middle attacks possible</li>
              </ul>
            </div>
            <div style={{ ...cardStyle, borderLeft: '3px solid var(--nothing-green)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8, color: 'var(--nothing-green)' }}>HTTPS</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text-muted)', fontSize: 15, lineHeight: 2 }}>
                <li>Data <strong style={{ color: 'var(--nothing-text)' }}>encrypted</strong> via TLS</li>
                <li>Confidentiality guaranteed</li>
                <li>Server authenticated via certificate</li>
                <li>Port 443</li>
                <li>Data integrity ensured</li>
              </ul>
            </div>
          </div>

          {/* TLS Handshake Diagram */}
          <div style={monoLabel}>TLS HANDSHAKE — STEP BY STEP</div>
          <div style={{ ...cardStyle, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, textAlign: 'center', width: 100 }}>CLIENT</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, textAlign: 'center', width: 100 }}>SERVER</div>
            </div>
            {[
              { step: 1, label: 'Client Hello', desc: 'Supported TLS versions, cipher suites, random number', dir: 'right' },
              { step: 2, label: 'Server Hello', desc: 'Chosen cipher suite, server certificate, random number', dir: 'left' },
              { step: 3, label: 'Certificate Verify', desc: 'Client verifies server certificate against trusted CAs', dir: 'right' },
              { step: 4, label: 'Key Exchange', desc: 'Both derive shared session key (Diffie-Hellman)', dir: 'right' },
              { step: 5, label: 'Encrypted Connection', desc: 'All subsequent data encrypted with session key', dir: 'both' },
            ].map(({ step, label, desc, dir }) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 12 }}>
                <div style={{ width: 32, height: 32, border: '1px solid var(--nothing-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 16, flexShrink: 0 }}>
                  {step}
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--nothing-border)', position: 'relative' }}>
                  <span style={{
                    position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-mono)', fontSize: 15, whiteSpace: 'nowrap', color: 'var(--nothing-text)',
                  }}>{label}</span>
                  <span style={{
                    position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-mono)', fontSize: 16, whiteSpace: 'nowrap', color: 'var(--nothing-text-dim)',
                  }}>{desc}</span>
                  {dir === 'right' && <span style={{ position: 'absolute', right: -4, top: -4, fontSize: 16 }}>→</span>}
                  {dir === 'left' && <span style={{ position: 'absolute', left: -4, top: -4, fontSize: 16 }}>←</span>}
                  {dir === 'both' && <><span style={{ position: 'absolute', right: -4, top: -4, fontSize: 16 }}>↔</span></>}
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--nothing-text-muted)', fontSize: 15, marginTop: 12, lineHeight: 1.9 }}>
            <strong style={{ color: 'var(--nothing-text)' }}>Why TLS matters:</strong> Encryption (nobody can read data), Integrity (nobody can tamper), Authentication (server is who it claims to be).
          </p>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  SECTION 2: DEVOPS & DEPLOYMENT                             ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      <section className="nt-section bonus-section" id="bonus-deployment">
        <SectionHeader no="02" title="Modern Deployment & DevOps" icon={<Rocket size={22} />} />

        {/* ── Docker / Containers ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 className="nt-sub-header">Containerization (Docker)</h3>

          {/* VM vs Container */}
          <div className="bonus-cluster bonus-cluster--wide" style={{ marginBottom: 24 }}>
            <div style={cardStyle}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>VIRTUAL MACHINE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {['App A', 'Bins/Libs', 'Guest OS'].map(l => (
                  <div key={l} style={{ padding: '10px 16px', background: '#1a1a1a', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 15, textAlign: 'center' }}>{l}</div>
                ))}
                <div style={{ padding: '10px 16px', background: '#222', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 15, textAlign: 'center', color: 'var(--nothing-red)' }}>HYPERVISOR</div>
                <div style={{ padding: '10px 16px', background: '#333', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 15, textAlign: 'center' }}>HOST OS</div>
                <div style={{ padding: '10px 16px', background: '#444', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 15, textAlign: 'center' }}>HARDWARE</div>
              </div>
              <p style={{ color: 'var(--nothing-text-muted)', fontSize: 16, marginTop: 10 }}>Heavy — each VM runs full OS. GBs of overhead. Minutes to start.</p>
            </div>
            <div style={cardStyle}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>CONTAINER</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                  {['App A', 'App B'].map(l => (
                    <div key={l} style={{ padding: '10px 16px', background: '#1a1a1a', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 15, textAlign: 'center' }}>{l}</div>
                  ))}
                </div>
                <div style={{ padding: '10px 16px', background: '#222', border: '1px solid var(--nothing-green)', fontFamily: 'var(--font-mono)', fontSize: 15, textAlign: 'center', color: 'var(--nothing-green)' }}>CONTAINER ENGINE (Docker)</div>
                <div style={{ padding: '10px 16px', background: '#333', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 15, textAlign: 'center' }}>HOST OS (shared kernel)</div>
                <div style={{ padding: '10px 16px', background: '#444', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 15, textAlign: 'center' }}>HARDWARE</div>
              </div>
              <p style={{ color: 'var(--nothing-text-muted)', fontSize: 16, marginTop: 10 }}>Light — shares host OS kernel. MBs of overhead. Seconds to start.</p>
            </div>
          </div>

          {/* Key Docker Concepts */}
          <div style={monoLabel}>KEY DOCKER CONCEPTS</div>
          <div className="bonus-table-wrap">
          <table className="nt-table">
            <thead><tr>
              <th className="nt-th">Concept</th><th className="nt-th">Description</th>
            </tr></thead>
            <tbody>
              {[
                ['Image', 'A read-only template with OS, runtime, app code. Like a blueprint.'],
                ['Container', 'A running instance of an image. Isolated process.'],
                ['Dockerfile', 'Text file with instructions to build an image (FROM, RUN, COPY, CMD).'],
                ['Docker Hub', 'Public registry for sharing Docker images (like npm for containers).'],
                ['Volume', 'Persistent storage that survives container restarts.'],
                ['docker-compose', 'Tool to define and run multi-container apps with a YAML file.'],
              ].map(([c, d]) => (
                <tr key={c}><td style={{ ...tdStyle, fontWeight: 600, color: 'var(--nothing-text)' }}>{c}</td><td className="nt-td">{d}</td></tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* Example Dockerfile */}
          <div style={{ ...monoLabel, marginTop: 20 }}>EXAMPLE DOCKERFILE (NODE.JS APP)</div>
          <pre style={codeBlock}>{`# Use official Node.js image as base
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package files first (layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]`}</pre>
          <pre style={{ ...codeBlock, marginTop: 8, color: 'var(--nothing-text-muted)' }}>{`# Build & run commands:
$ docker build -t my-app .
$ docker run -p 3000:3000 my-app`}</pre>
        </div>

        {/* ── Cloud Hosting ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 className="nt-sub-header">Cloud Hosting: PaaS vs IaaS</h3>
          <div className="bonus-table-wrap">
          <table className="nt-table">
            <thead><tr>
              <th className="nt-th">Aspect</th>
              <th style={{ ...thStyle, color: 'var(--nothing-green)' }}>PaaS (Platform-as-a-Service)</th>
              <th className="nt-th">IaaS (Infrastructure-as-a-Service)</th>
            </tr></thead>
            <tbody>
              {[
                ['Examples', 'Heroku, Vercel, Netlify, Railway', 'AWS EC2, GCP Compute, Azure VMs'],
                ['Setup', 'Git push to deploy', 'Manual server provisioning & config'],
                ['Control', 'Limited — platform manages infra', 'Full — root access, install anything'],
                ['Scaling', 'Auto-scaling built-in', 'Manual or self-configured auto-scaling'],
                ['Cost', 'Free tiers; pay for usage', 'Pay for uptime regardless of usage'],
                ['Best For', 'Startups, MVPs, static sites, APIs', 'Custom stacks, compliance, enterprise'],
                ['Maintenance', 'Platform handles patching & updates', 'You manage OS, security, updates'],
              ].map(([aspect, paas, iaas]) => (
                <tr key={aspect}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--nothing-text)' }}>{aspect}</td>
                  <td className="nt-td">{paas}</td>
                  <td className="nt-td">{iaas}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* Deployment Advisor Interactive */}
          <div style={{ ...cardStyle, marginTop: 24, borderColor: 'var(--nothing-text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Cloud size={18} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>INTERACTIVE: DEPLOYMENT ADVISOR</span>
            </div>
            {advisorResult === null ? (
              <div>
                <p style={{ color: 'var(--nothing-text-muted)', fontSize: 15, marginBottom: 16 }}>
                  Answer the questions to get a hosting recommendation.
                </p>
                <div style={{ padding: 24, border: '1px solid var(--nothing-border)', marginBottom: 16 }}>
                  <div style={{ ...monoLabel, marginBottom: 8 }}>QUESTION {advisorStep + 1} OF {advisorQuestions.length}</div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16 }}>{advisorQuestions[advisorStep].q}</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button style={{ ...btnStyle, borderColor: 'var(--nothing-green)', color: 'var(--nothing-green)' }} onClick={() => handleAdvisorAnswer(true)}>YES</button>
                    <button style={{ ...btnStyle, borderColor: 'var(--nothing-red)', color: 'var(--nothing-red)' }} onClick={() => handleAdvisorAnswer(false)}>NO</button>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ padding: 20, border: '2px solid var(--nothing-text)', background: 'var(--nothing-green-bg)' }}>
                  <div style={{ ...monoLabel, color: 'var(--nothing-green)' }}>RECOMMENDATION</div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginTop: 8 }}>{advisorResult}</p>
                </div>
                <button style={{ ...btnStyle, marginTop: 16 }} onClick={resetAdvisor}>TRY AGAIN</button>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── CI/CD Pipeline ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 className="nt-sub-header">CI/CD Pipeline</h3>
          <p style={{ color: 'var(--nothing-text-muted)', fontSize: 15, marginBottom: 16, lineHeight: 1.9 }}>
            <strong style={{ color: 'var(--nothing-text)' }}>Continuous Integration (CI):</strong> Automatically build and test code on every commit.{' '}
            <strong style={{ color: 'var(--nothing-text)' }}>Continuous Deployment (CD):</strong> Automatically deploy tested code to production.
          </p>
          <div style={monoLabel}>CI/CD PIPELINE FLOW</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', padding: '16px 0' }}>
            {[
              { label: 'CODE', sub: 'Developer writes code', icon: '💻' },
              { label: 'COMMIT', sub: 'Push to Git repo', icon: '📝' },
              { label: 'BUILD', sub: 'Compile & bundle', icon: '🔨' },
              { label: 'TEST', sub: 'Run automated tests', icon: '🧪' },
              { label: 'DEPLOY', sub: 'Ship to production', icon: '🚀' },
              { label: 'MONITOR', sub: 'Watch metrics & logs', icon: '📊' },
            ].map((step, i, arr) => (
              <React.Fragment key={step.label}>
                <div style={{
                  ...cardStyle, minWidth: 120, textAlign: 'center', padding: '16px 12px', flexShrink: 0,
                  borderColor: i < 4 ? 'var(--nothing-border)' : 'var(--nothing-text)',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{step.icon}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{step.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--nothing-text-dim)' }}>{step.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--nothing-text-dim)', flexShrink: 0, padding: '0 2px' }}>→</div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, border: '1px solid var(--nothing-border)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--nothing-text-muted)' }}>CI (Integration)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, border: '1px solid var(--nothing-green)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--nothing-text-muted)' }}>CD (Deployment)</span>
            </div>
          </div>
          <div style={monoLabel}>POPULAR CI/CD TOOLS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {['GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'Travis CI', 'Azure DevOps'].map(t => (
              <span key={t} style={{ ...tagStyle('var(--nothing-text-muted)') }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  SECTION 3: WEB ARCHITECTURE & FUTURE TRENDS                ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      <section className="nt-section bonus-section" id="bonus-architecture">
        <SectionHeader no="03" title="Web Architecture & Future Trends" icon={<Layers size={22} />} />

        {/* ── Monolith vs Microservices ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 className="nt-sub-header">Monolith vs Microservices</h3>
          <div className="bonus-cluster bonus-cluster--wide" style={{ marginBottom: 24 }}>
            {/* Monolith Diagram */}
            <div style={cardStyle}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>MONOLITH</div>
              <div style={{ border: '2px solid var(--nothing-text-muted)', padding: 24, marginBottom: 12 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--nothing-text-muted)', textAlign: 'center', marginBottom: 8 }}>SINGLE APPLICATION</div>
                {['UI Layer', 'Business Logic', 'Data Access', 'Database'].map(l => (
                  <div key={l} style={{ padding: '6px 10px', background: '#1a1a1a', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 15, textAlign: 'center', marginBottom: 4 }}>{l}</div>
                ))}
              </div>
              <div style={monoLabel}>CHARACTERISTICS</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text-muted)', fontSize: 16, lineHeight: 2 }}>
                <li>Single codebase & deployment</li>
                <li>Tightly coupled components</li>
                <li>Simple to develop initially</li>
                <li>Scale by replicating entire app</li>
                <li>One failure can crash everything</li>
              </ul>
            </div>

            {/* Microservices Diagram */}
            <div style={cardStyle}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>MICROSERVICES</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
                {['Auth Service', 'User Service', 'Payment Service', 'Email Service', 'Search Service', 'API Gateway'].map(s => (
                  <div key={s} style={{ padding: '10px 6px', background: '#1a1a1a', border: '1px solid var(--nothing-text-muted)', fontFamily: 'var(--font-mono)', fontSize: 16, textAlign: 'center' }}>{s}</div>
                ))}
              </div>
              <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--nothing-text-dim)', marginBottom: 12 }}>
                ↕ API / Message Queue Communication ↕
              </div>
              <div style={monoLabel}>CHARACTERISTICS</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text-muted)', fontSize: 16, lineHeight: 2 }}>
                <li>Independent services & deployments</li>
                <li>Loosely coupled via APIs</li>
                <li>Complex to set up & manage</li>
                <li>Scale individual services as needed</li>
                <li>Fault isolation — one service can fail independently</li>
              </ul>
            </div>
          </div>

          {/* Comparison table */}
          <div className="bonus-table-wrap">
          <table className="nt-table">
            <thead><tr>
              <th className="nt-th">Aspect</th><th className="nt-th">Monolith</th><th className="nt-th">Microservices</th>
            </tr></thead>
            <tbody>
              {[
                ['Complexity', 'Low initially, grows over time', 'High initially, manageable at scale'],
                ['Deployment', 'Deploy entire app as one unit', 'Deploy services independently'],
                ['Scaling', 'Scale entire application', 'Scale individual services'],
                ['Tech Stack', 'Single language/framework', 'Mix of technologies per service'],
                ['Team Size', 'Small teams', 'Large, distributed teams'],
                ['Fault Tolerance', 'Single point of failure', 'Isolated failures'],
                ['Data', 'Single shared database', 'Database per service'],
              ].map(([a, m, ms]) => (
                <tr key={a}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--nothing-text)' }}>{a}</td>
                  <td className="nt-td">{m}</td>
                  <td className="nt-td">{ms}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* ── Serverless ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 className="nt-sub-header">Serverless Architecture</h3>
          <p style={{ color: 'var(--nothing-text-muted)', fontSize: 15, marginBottom: 16, lineHeight: 1.9 }}>
            Serverless doesn't mean "no servers" — it means <strong style={{ color: 'var(--nothing-text)' }}>you don't manage servers</strong>. The cloud provider handles provisioning, scaling, and maintenance. You write functions that run in response to events.
          </p>

          {/* Execution Flow */}
          <div style={monoLabel}>SERVERLESS EXECUTION FLOW</div>
          <div className="bonus-flow" style={{ marginBottom: 16 }}>
            {[
              { label: 'EVENT TRIGGER', sub: 'HTTP request, schedule, queue message', color: 'var(--nothing-text-muted)' },
              { label: 'COLD START', sub: 'Container spins up (if needed)', color: 'var(--nothing-red)' },
              { label: 'FUNCTION RUNS', sub: 'Your code executes', color: 'var(--nothing-text)' },
              { label: 'RETURNS', sub: 'Response sent back', color: 'var(--nothing-green)' },
              { label: 'SCALES TO ZERO', sub: 'No charge when idle', color: 'var(--nothing-text-dim)' },
            ].map((step, i, arr) => (
              <React.Fragment key={step.label}>
                <div style={{
                  ...cardStyle, minWidth: 130, textAlign: 'center', padding: 14, flexShrink: 0,
                  borderColor: step.color,
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: step.color, marginBottom: 4 }}>{step.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--nothing-text-dim)' }}>{step.sub}</div>
                </div>
                {i < arr.length - 1 && <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--nothing-text-dim)', padding: '0 2px' }}>→</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="bonus-cluster">
            <div style={cardStyle}>
              <div style={monoLabel}>PROVIDERS</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text)', fontSize: 15, lineHeight: 2 }}>
                <li>AWS Lambda</li>
                <li>Google Cloud Functions</li>
                <li>Azure Functions</li>
                <li>Cloudflare Workers</li>
                <li>Vercel Edge Functions</li>
              </ul>
            </div>
            <div style={cardStyle}>
              <div style={monoLabel}>USE CASES</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text)', fontSize: 15, lineHeight: 2 }}>
                <li>REST APIs & webhooks</li>
                <li>Scheduled tasks (cron jobs)</li>
                <li>Image/video processing</li>
                <li>Real-time file transformations</li>
                <li>Chatbots & IoT backends</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── API-Driven Design ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 className="nt-sub-header">API-Driven Design (REST)</h3>
          <p style={{ color: 'var(--nothing-text-muted)', fontSize: 15, marginBottom: 16, lineHeight: 1.9 }}>
            REST (Representational State Transfer) is an architectural style for designing APIs. Resources are identified by URLs, manipulated using standard HTTP methods, and the server is stateless.
          </p>

          <div style={monoLabel}>REST PRINCIPLES</div>
          <div className="bonus-card-grid bonus-card-grid--dense" style={{ marginBottom: 20 }}>
            {[
              { title: 'Resources', desc: 'Everything is a resource identified by a URI (e.g. /api/posts/1)' },
              { title: 'HTTP Methods', desc: 'GET (read), POST (create), PUT (update), DELETE (remove)' },
              { title: 'Stateless', desc: 'Each request contains all info needed; no server-side session' },
              { title: 'Uniform Interface', desc: 'Consistent URL patterns and response formats (JSON)' },
            ].map(p => (
              <div key={p.title} style={{ ...cardStyle, padding: 14 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{p.title}</div>
                <p style={{ color: 'var(--nothing-text-muted)', fontSize: 16, lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </div>

          <div style={monoLabel}>EXAMPLE: BLOG API ENDPOINTS</div>
          <div className="bonus-table-wrap">
          <table className="nt-table">
            <thead><tr>
              <th className="nt-th">Method</th><th className="nt-th">Endpoint</th><th className="nt-th">Description</th><th className="nt-th">Request Body</th>
            </tr></thead>
            <tbody>
              {[
                ['GET', '/api/posts', 'List all blog posts', '—'],
                ['GET', '/api/posts/:id', 'Get a single post by ID', '—'],
                ['POST', '/api/posts', 'Create a new post', '{ title, content, author }'],
                ['PUT', '/api/posts/:id', 'Update an existing post', '{ title, content }'],
                ['DELETE', '/api/posts/:id', 'Delete a post', '—'],
                ['GET', '/api/posts/:id/comments', 'List comments on a post', '—'],
                ['POST', '/api/posts/:id/comments', 'Add a comment to a post', '{ body, author }'],
              ].map(([m, e, d, b]) => (
                <tr key={`${m}-${e}`}>
                  <td style={{ ...tdStyle, fontWeight: 700, color: m === 'GET' ? 'var(--nothing-text)' : m === 'POST' ? 'var(--nothing-text)' : m === 'PUT' ? 'var(--nothing-text-muted)' : 'var(--nothing-red)' }}>{m}</td>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text)' }}>{e}</td>
                  <td className="nt-td">{d}</td>
                  <td style={{ ...tdStyle, fontSize: 15 }}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <pre style={{ ...codeBlock, marginTop: 16 }}>{`// Example: Express.js REST endpoint
app.get('/api/posts', async (req, res) => {
  const posts = await db.posts.findAll();
  res.json({ data: posts, count: posts.length });
});

app.post('/api/posts', async (req, res) => {
  const { title, content, author } = req.body;
  const post = await db.posts.create({ title, content, author });
  res.status(201).json({ data: post });
});

// Response format:
// { "data": { "id": 1, "title": "...", ... }, "status": "success" }`}</pre>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  SECTION 4: CHEAT SHEET                                     ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      <section className="nt-section bonus-section" id="bonus-cheatsheet">
        <SectionHeader no="04" title="Cheat Sheet" icon={<BookOpen size={22} />} />

        <div className="bonus-cluster bonus-cluster--wide">
          {/* Security Terms */}
          <div style={cardStyle}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>Security Quick Reference</div>
            <div className="bonus-table-wrap">
            <table className="bonus-mini-table">
              <tbody>
                {[
                  ['SQLi', 'Inject SQL via user input to manipulate database'],
                  ['XSS', 'Inject scripts that run in victim\'s browser'],
                  ['CSRF', 'Forge requests from authenticated user\'s browser'],
                  ['HTTPS', 'HTTP + TLS encryption (port 443)'],
                  ['MFA', 'Multi-Factor Authentication (2+ verification steps)'],
                  ['RBAC', 'Role-Based Access Control'],
                  ['JWT', 'JSON Web Token — stateless auth token'],
                  ['CORS', 'Cross-Origin Resource Sharing — browser security'],
                  ['CSP', 'Content Security Policy — restrict script sources'],
                  ['OWASP', 'Open Web Application Security Project'],
                ].map(([term, def]) => (
                  <tr key={term}><td>{term}</td><td>{def}</td></tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Docker Commands */}
          <div style={cardStyle}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>Docker Commands</div>
            <pre style={{ ...codeBlock, fontSize: 15, lineHeight: 1.9 }}>{`docker build -t name .      # Build image
docker run -p 3000:3000 name # Run container
docker ps                    # List running
docker stop <id>             # Stop container
docker images                # List images
docker rm <id>               # Remove container
docker rmi <name>            # Remove image
docker logs <id>             # View logs
docker exec -it <id> sh     # Shell into container
docker-compose up -d         # Start services`}</pre>
          </div>

          {/* Architecture Comparison */}
          <div style={cardStyle}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>Architecture At-a-Glance</div>
            <div className="bonus-table-wrap">
            <table className="bonus-mini-table">
              <thead><tr>
                <th>Pattern</th>
                <th>When to Use</th>
              </tr></thead>
              <tbody>
                {[
                  ['Monolith', 'Small team, MVP, simple app'],
                  ['Microservices', 'Large team, complex domain, independent scaling'],
                  ['Serverless', 'Event-driven, variable traffic, cost-sensitive'],
                  ['REST API', 'Standard CRUD operations, public APIs'],
                  ['GraphQL', 'Complex data needs, mobile apps, avoid over-fetching'],
                  ['PaaS', 'Quick deployment, no infra management'],
                  ['IaaS', 'Full control, custom infrastructure'],
                ].map(([p, u]) => (
                  <tr key={p}><td>{p}</td><td>{u}</td></tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </section>

      <section className="nt-section bonus-section" id="bonus-practice">
        <SectionHeader no="05" title="Practice Lab" icon={<Zap size={22} />} />
        <p className="nt-prose">
          Use these as short assignment-style checks. Each one forces you to connect the term to a decision, a risk, or a working implementation detail.
        </p>
        <div className="bonus-practice-grid">
          {[
            {
              title: 'Attack Trace',
              label: 'Security',
              body: 'Given a login form, show how SQL injection changes the query. Then rewrite it as a parameterized query.',
              checks: ['Name the vulnerable string concatenation', 'Show the safe query shape', 'Explain why escaping alone is weaker'],
            },
            {
              title: 'Deploy Decision',
              label: 'DevOps',
              body: 'Pick hosting for a static portfolio, a Node API, and a containerized team app. Defend each choice in one sentence.',
              checks: ['Mention cost and scaling', 'Mention operational control', 'Mention deployment workflow'],
            },
            {
              title: 'Architecture Sketch',
              label: 'System',
              body: 'Draw a request from browser to API to database, then add CDN, CI/CD, logging, and TLS into the diagram.',
              checks: ['Separate frontend/backend/database', 'Mark trust boundaries', 'Show where monitoring belongs'],
            },
            {
              title: 'REST Review',
              label: 'API',
              body: 'Design endpoints for posts and comments. Use correct HTTP verbs and explain which requests need a body.',
              checks: ['Use plural resource names', 'Keep GET body-free', 'Return clear JSON response shapes'],
            },
          ].map((task) => (
            <article className="bonus-practice-card" key={task.title}>
              <span>{task.label}</span>
              <h3>{task.title}</h3>
              <p>{task.body}</p>
              <ul>
                {task.checks.map((check) => <li key={check}>{check}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  SECTION 5: QUIZ                                            ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      <section className="nt-section bonus-section" id="bonus-quiz">
        <SectionHeader no="06" title="Quiz" icon={<HelpCircle size={22} />} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {quizQuestions.map((q, qi) => {
            const selected = quizAnswers[qi];
            const isCorrect = selected === q.answer;
            return (
              <div key={qi} style={{
                ...cardStyle,
                borderColor: quizSubmitted ? (isCorrect ? 'var(--nothing-text)' : 'var(--nothing-red)') : 'var(--nothing-border)',
              }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <span style={{ ...tagStyle('var(--nothing-text-muted)') }}>Q{qi + 1}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>{q.q}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {q.opts.map((opt, oi) => {
                    const isSelected = selected === oi;
                    const isAnswer = q.answer === oi;
                    let borderColor = 'var(--nothing-border)';
                    let bg = 'transparent';
                    if (quizSubmitted) {
                      if (isAnswer) { borderColor = 'var(--nothing-text)'; bg = 'var(--nothing-green-bg)'; }
                      else if (isSelected && !isAnswer) { borderColor = 'var(--nothing-red)'; bg = 'var(--nothing-red-bg)'; }
                    } else if (isSelected) {
                      borderColor = '#fff'; bg = 'rgba(255,255,255,0.04)';
                    }
                    return (
                      <div key={oi}
                        onClick={() => handleQuizSelect(qi, oi)}
                        style={{
                          padding: '10px 14px', border: `1px solid ${borderColor}`, background: bg,
                          cursor: quizSubmitted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                          fontFamily: 'var(--font-mono)', fontSize: 15,
                        }}
                      >
                        <span style={{ width: 20, height: 20, border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                          {quizSubmitted ? (isAnswer ? <CheckCircle size={14} color="var(--nothing-text)" /> : isSelected ? <XCircle size={14} color="var(--nothing-red)" /> : String.fromCharCode(65 + oi)) : String.fromCharCode(65 + oi)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24 }}>
          {!quizSubmitted ? (
            <button style={{ ...btnStyle, borderColor: 'var(--nothing-green)', color: 'var(--nothing-green)' }}
              onClick={() => { if (quizAnswers.every(a => a !== null)) setQuizSubmitted(true); }}
            >
              SUBMIT QUIZ
            </button>
          ) : (
            <>
              <div style={{
                padding: '12px 20px', border: `2px solid ${quizScore >= 6 ? 'var(--nothing-text)' : 'var(--nothing-red)'}`,
                fontFamily: 'var(--font-mono)', fontSize: 16,
              }}>
                SCORE: {quizScore} / {quizQuestions.length} ({Math.round(quizScore / quizQuestions.length * 100)}%)
              </div>
              <button className="nt-button" onClick={() => { setQuizAnswers(new Array(quizQuestions.length).fill(null)); setQuizSubmitted(false); }}>
                RETRY
              </button>
            </>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <div style={{ borderTop: '1px solid var(--nothing-border)', paddingTop: 20, textAlign: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--nothing-text-dim)', letterSpacing: '0.1em' }}>
          BONUS MODULE COMPLETE · WEB SECURITY · DEVOPS · ARCHITECTURE
        </span>
      </div>
    </div>
  );
};
