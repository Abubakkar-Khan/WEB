import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Server, Cloud, Lock, AlertTriangle, Database, Eye, Key, Bug, FileWarning, MonitorX, Globe, Container, Rocket, GitBranch, Layers, Zap, BookOpen, CheckCircle, XCircle } from 'lucide-react';

/* ───────── shared inline style helpers ───────── */
const sectionStyle: React.CSSProperties = { marginBottom: 48 };
const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-dot)', letterSpacing: '0.1em', textTransform: 'uppercase' as const,
  fontSize: 28, marginBottom: 20, color: 'var(--nothing-text)',
};
const subHeadingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 14,
  color: 'var(--nothing-text)', borderBottom: '1px solid var(--nothing-border)', paddingBottom: 8,
};
const cardStyle: React.CSSProperties = {
  background: 'var(--nothing-surface)', border: '1px solid var(--nothing-border)',
  padding: 20, borderRadius: 0,
};
const monoLabel: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--nothing-text-muted)',
  letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 6,
};
const codeBlock: React.CSSProperties = {
  background: 'var(--nothing-bg)', padding: 14, fontFamily: 'var(--font-mono)', fontSize: 12,
  border: '1px solid var(--nothing-border)', overflowX: 'auto', lineHeight: 1.7,
  color: 'var(--nothing-text)', whiteSpace: 'pre',
};
const tableStyle: React.CSSProperties = {
  width: '100%', borderCollapse: 'collapse' as const, fontFamily: 'var(--font-mono)', fontSize: 13,
};
const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid var(--nothing-border)',
  color: 'var(--nothing-text-muted)', fontWeight: 600, textTransform: 'uppercase' as const,
  letterSpacing: '0.08em', fontSize: 11,
};
const tdStyle: React.CSSProperties = {
  padding: '10px 12px', borderBottom: '1px solid var(--nothing-border)',
  color: 'var(--nothing-text)', verticalAlign: 'top',
};
const tagStyle = (color: string): React.CSSProperties => ({
  display: 'inline-block', padding: '2px 8px', fontSize: 10, fontFamily: 'var(--font-mono)',
  letterSpacing: '0.1em', textTransform: 'uppercase' as const, border: `1px solid ${color}`,
  color, marginBottom: 6,
});
const btnStyle: React.CSSProperties = {
  padding: '10px 20px', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em',
  textTransform: 'uppercase' as const, border: '1px solid var(--nothing-text)',
  background: 'transparent', color: 'var(--nothing-text)', cursor: 'pointer',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)',
  color: 'var(--nothing-text)', fontFamily: 'var(--font-mono)', fontSize: 13,
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
    <div style={{ padding: 32, maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>

      {/* ──────── CHAPTER HEADER ──────── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div style={{ marginBottom: 8 }}>
          <span style={monoLabel}>BONUS MODULE</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-dot)', fontSize: 44, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>
          SECURITY · DEVOPS · ARCHITECTURE
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--nothing-text-muted)', fontSize: 13, marginTop: 10, letterSpacing: '0.05em' }}>
          Web Security Fundamentals · Modern Deployment · Architecture Patterns · Future Trends
        </p>
        <div style={{ height: 2, background: 'linear-gradient(90deg, var(--nothing-text), transparent)', marginTop: 16 }} />
      </motion.div>

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  SECTION 1: WEB SECURITY                                    ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      <section style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Shield size={28} />
          <h2 style={{ ...headingStyle, marginBottom: 0 }}>01 — WEB SECURITY</h2>
        </div>

        {/* ── OWASP Top 10 ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 style={subHeadingStyle}>OWASP Top 10 Vulnerabilities</h3>
          <p style={{ color: 'var(--nothing-text-muted)', fontSize: 14, marginBottom: 20, lineHeight: 1.7 }}>
            The Open Web Application Security Project (OWASP) publishes a list of the ten most critical web application security risks. Understanding these is essential for building secure software.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
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
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{item.name}</span>
                  </div>
                  <p style={{ color: 'var(--nothing-text-muted)', fontSize: 13, lineHeight: 1.6 }}>{item.desc}</p>
                  {isExpanded && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 14 }}>
                      <div style={monoLabel}>EXAMPLE</div>
                      <pre style={{ ...codeBlock, marginBottom: 12, color: '#d71921' }}>{item.example}</pre>
                      <div style={monoLabel}>PREVENTION</div>
                      <p style={{ fontSize: 13, color: 'var(--nothing-text)', lineHeight: 1.6, padding: '8px 12px', background: 'var(--nothing-surface)', border: '1px solid var(--nothing-border)' }}>{item.prevention}</p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Interactive SQL Injection Demo ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 style={subHeadingStyle}>🛡️ Interactive: SQL Injection Demo</h3>
          <p style={{ color: 'var(--nothing-text-muted)', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
            Type into the fields below to see how user input becomes part of a SQL query. Try typing <code style={{ color: '#d71921' }}>' OR '1'='1</code> into the username field.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
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
          <pre style={{ ...codeBlock, borderColor: isMalicious ? '#d71921' : 'var(--nothing-border)', marginBottom: 10 }}>
{unsafeQuery}
          </pre>
          {isMalicious && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ padding: '12px 16px', border: '1px solid #d71921', background: 'rgba(215,25,33,0.08)', marginBottom: 12 }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#d71921' }}>
                ⚠ INJECTION DETECTED — The single quote breaks out of the string literal, altering the SQL logic!
              </span>
            </motion.div>
          )}

          <button style={{ ...btnStyle, marginBottom: 12 }} onClick={() => setShowSanitized(!showSanitized)}>
            {showSanitized ? 'Hide' : 'Show'} Sanitized Query (Parameterized)
          </button>
          {showSanitized && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={monoLabel}>PARAMETERIZED QUERY (SAFE)</div>
              <pre style={{ ...codeBlock, borderColor: '#0f0' }}>
{sanitizedQuery}
              </pre>
              <p style={{ color: 'var(--nothing-text-muted)', fontSize: 12, marginTop: 8 }}>
                ✓ User input is treated as data, never as executable SQL. The database driver handles escaping.
              </p>
            </motion.div>
          )}
        </div>

        {/* ── Authentication vs Authorization ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 style={subHeadingStyle}>Authentication vs Authorization</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ ...cardStyle, borderTop: '3px solid #fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Key size={18} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>AUTHENTICATION</span>
              </div>
              <div style={{ ...tagStyle('var(--nothing-text-muted)'), marginBottom: 12 }}>WHO ARE YOU?</div>
              <p style={{ color: 'var(--nothing-text-muted)', fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
                The process of verifying a user's <strong style={{ color: 'var(--nothing-text)' }}>identity</strong>. It answers: "Are you who you say you are?"
              </p>
              <div style={monoLabel}>METHODS</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text)', fontSize: 13, lineHeight: 2 }}>
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
              <p style={{ color: 'var(--nothing-text-muted)', fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
                The process of verifying what <strong style={{ color: 'var(--nothing-text)' }}>permissions</strong> a user has. It answers: "Are you allowed to do this?"
              </p>
              <div style={monoLabel}>MECHANISMS</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text)', fontSize: 13, lineHeight: 2 }}>
                <li>Role-Based Access Control (RBAC)</li>
                <li>API scopes & permissions</li>
                <li>Admin panel access control</li>
                <li>File/resource permissions</li>
                <li>Policy engines (AWS IAM)</li>
              </ul>
            </div>
          </div>
          <div style={{ ...cardStyle, marginTop: 16, display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px' }}>
            <AlertTriangle size={16} style={{ color: '#d71921', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--nothing-text-muted)' }}>
              KEY INSIGHT: Authentication always comes BEFORE authorization. You must know WHO the user is before deciding WHAT they can do.
            </span>
          </div>
        </div>

        {/* ── HTTPS / TLS ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 style={subHeadingStyle}>HTTPS & TLS Handshake</h3>

          {/* HTTP vs HTTPS comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div style={{ ...cardStyle, borderLeft: '3px solid #d71921' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8, color: '#d71921' }}>HTTP</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text-muted)', fontSize: 13, lineHeight: 2 }}>
                <li>Data sent in <strong style={{ color: 'var(--nothing-text)' }}>plaintext</strong></li>
                <li>Vulnerable to eavesdropping</li>
                <li>No server identity verification</li>
                <li>Port 80</li>
                <li>Man-in-the-middle attacks possible</li>
              </ul>
            </div>
            <div style={{ ...cardStyle, borderLeft: '3px solid #0f0' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8, color: '#0f0' }}>HTTPS</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text-muted)', fontSize: 13, lineHeight: 2 }}>
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
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, textAlign: 'center', width: 100 }}>CLIENT</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, textAlign: 'center', width: 100 }}>SERVER</div>
            </div>
            {[
              { step: 1, label: 'Client Hello', desc: 'Supported TLS versions, cipher suites, random number', dir: 'right' },
              { step: 2, label: 'Server Hello', desc: 'Chosen cipher suite, server certificate, random number', dir: 'left' },
              { step: 3, label: 'Certificate Verify', desc: 'Client verifies server certificate against trusted CAs', dir: 'right' },
              { step: 4, label: 'Key Exchange', desc: 'Both derive shared session key (Diffie-Hellman)', dir: 'right' },
              { step: 5, label: 'Encrypted Connection', desc: 'All subsequent data encrypted with session key', dir: 'both' },
            ].map(({ step, label, desc, dir }) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 12 }}>
                <div style={{ width: 32, height: 32, border: '1px solid var(--nothing-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, flexShrink: 0 }}>
                  {step}
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--nothing-border)', position: 'relative' }}>
                  <span style={{
                    position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-mono)', fontSize: 11, whiteSpace: 'nowrap', color: 'var(--nothing-text)',
                  }}>{label}</span>
                  <span style={{
                    position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-mono)', fontSize: 10, whiteSpace: 'nowrap', color: 'var(--nothing-text-dim)',
                  }}>{desc}</span>
                  {dir === 'right' && <span style={{ position: 'absolute', right: -4, top: -4, fontSize: 10 }}>→</span>}
                  {dir === 'left' && <span style={{ position: 'absolute', left: -4, top: -4, fontSize: 10 }}>←</span>}
                  {dir === 'both' && <><span style={{ position: 'absolute', right: -4, top: -4, fontSize: 10 }}>↔</span></>}
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--nothing-text-muted)', fontSize: 13, marginTop: 12, lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--nothing-text)' }}>Why TLS matters:</strong> Encryption (nobody can read data), Integrity (nobody can tamper), Authentication (server is who it claims to be).
          </p>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  SECTION 2: DEVOPS & DEPLOYMENT                             ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      <section style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Rocket size={28} />
          <h2 style={{ ...headingStyle, marginBottom: 0 }}>02 — MODERN DEPLOYMENT & DEVOPS</h2>
        </div>

        {/* ── Docker / Containers ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 style={subHeadingStyle}>Containerization (Docker)</h3>

          {/* VM vs Container */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div style={cardStyle}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>VIRTUAL MACHINE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {['App A', 'Bins/Libs', 'Guest OS'].map(l => (
                  <div key={l} style={{ padding: '8px 12px', background: '#1a1a1a', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 11, textAlign: 'center' }}>{l}</div>
                ))}
                <div style={{ padding: '8px 12px', background: '#222', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 11, textAlign: 'center', color: '#d71921' }}>HYPERVISOR</div>
                <div style={{ padding: '8px 12px', background: '#333', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 11, textAlign: 'center' }}>HOST OS</div>
                <div style={{ padding: '8px 12px', background: '#444', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 11, textAlign: 'center' }}>HARDWARE</div>
              </div>
              <p style={{ color: 'var(--nothing-text-muted)', fontSize: 12, marginTop: 10 }}>Heavy — each VM runs full OS. GBs of overhead. Minutes to start.</p>
            </div>
            <div style={cardStyle}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>CONTAINER</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                  {['App A', 'App B'].map(l => (
                    <div key={l} style={{ padding: '8px 12px', background: '#1a1a1a', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 11, textAlign: 'center' }}>{l}</div>
                  ))}
                </div>
                <div style={{ padding: '8px 12px', background: '#222', border: '1px solid #0f0', fontFamily: 'var(--font-mono)', fontSize: 11, textAlign: 'center', color: '#0f0' }}>CONTAINER ENGINE (Docker)</div>
                <div style={{ padding: '8px 12px', background: '#333', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 11, textAlign: 'center' }}>HOST OS (shared kernel)</div>
                <div style={{ padding: '8px 12px', background: '#444', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 11, textAlign: 'center' }}>HARDWARE</div>
              </div>
              <p style={{ color: 'var(--nothing-text-muted)', fontSize: 12, marginTop: 10 }}>Light — shares host OS kernel. MBs of overhead. Seconds to start.</p>
            </div>
          </div>

          {/* Key Docker Concepts */}
          <div style={monoLabel}>KEY DOCKER CONCEPTS</div>
          <table style={tableStyle}>
            <thead><tr>
              <th style={thStyle}>Concept</th><th style={thStyle}>Description</th>
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
                <tr key={c}><td style={{ ...tdStyle, fontWeight: 600, color: 'var(--nothing-text)' }}>{c}</td><td style={tdStyle}>{d}</td></tr>
              ))}
            </tbody>
          </table>

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
          <h3 style={subHeadingStyle}>Cloud Hosting: PaaS vs IaaS</h3>
          <table style={tableStyle}>
            <thead><tr>
              <th style={thStyle}>Aspect</th>
              <th style={{ ...thStyle, color: '#0f0' }}>PaaS (Platform-as-a-Service)</th>
              <th style={thStyle}>IaaS (Infrastructure-as-a-Service)</th>
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
                  <td style={tdStyle}>{paas}</td>
                  <td style={tdStyle}>{iaas}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Deployment Advisor Interactive */}
          <div style={{ ...cardStyle, marginTop: 24, borderColor: 'var(--nothing-text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Cloud size={18} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>INTERACTIVE: DEPLOYMENT ADVISOR</span>
            </div>
            {advisorResult === null ? (
              <div>
                <p style={{ color: 'var(--nothing-text-muted)', fontSize: 13, marginBottom: 16 }}>
                  Answer the questions to get a hosting recommendation.
                </p>
                <div style={{ padding: 16, border: '1px solid var(--nothing-border)', marginBottom: 16 }}>
                  <div style={{ ...monoLabel, marginBottom: 8 }}>QUESTION {advisorStep + 1} OF {advisorQuestions.length}</div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16 }}>{advisorQuestions[advisorStep].q}</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button style={{ ...btnStyle, borderColor: '#0f0', color: '#0f0' }} onClick={() => handleAdvisorAnswer(true)}>YES</button>
                    <button style={{ ...btnStyle, borderColor: '#d71921', color: '#d71921' }} onClick={() => handleAdvisorAnswer(false)}>NO</button>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ padding: 20, border: '2px solid #0f0', background: 'rgba(0,255,0,0.04)' }}>
                  <div style={{ ...monoLabel, color: '#0f0' }}>RECOMMENDATION</div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginTop: 8 }}>{advisorResult}</p>
                </div>
                <button style={{ ...btnStyle, marginTop: 16 }} onClick={resetAdvisor}>TRY AGAIN</button>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── CI/CD Pipeline ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 style={subHeadingStyle}>CI/CD Pipeline</h3>
          <p style={{ color: 'var(--nothing-text-muted)', fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
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
                  borderColor: i < 4 ? 'var(--nothing-border)' : '#0f0',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{step.icon}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{step.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--nothing-text-dim)' }}>{step.sub}</div>
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
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--nothing-text-muted)' }}>CI (Integration)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, border: '1px solid #0f0' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--nothing-text-muted)' }}>CD (Deployment)</span>
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
      <section style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Layers size={28} />
          <h2 style={{ ...headingStyle, marginBottom: 0 }}>03 — WEB ARCHITECTURE & FUTURE TRENDS</h2>
        </div>

        {/* ── Monolith vs Microservices ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 style={subHeadingStyle}>Monolith vs Microservices</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            {/* Monolith Diagram */}
            <div style={cardStyle}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>MONOLITH</div>
              <div style={{ border: '2px solid var(--nothing-text-muted)', padding: 16, marginBottom: 12 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--nothing-text-muted)', textAlign: 'center', marginBottom: 8 }}>SINGLE APPLICATION</div>
                {['UI Layer', 'Business Logic', 'Data Access', 'Database'].map(l => (
                  <div key={l} style={{ padding: '6px 10px', background: '#1a1a1a', border: '1px solid var(--nothing-border)', fontFamily: 'var(--font-mono)', fontSize: 11, textAlign: 'center', marginBottom: 4 }}>{l}</div>
                ))}
              </div>
              <div style={monoLabel}>CHARACTERISTICS</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text-muted)', fontSize: 12, lineHeight: 2 }}>
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
                  <div key={s} style={{ padding: '10px 6px', background: '#1a1a1a', border: '1px solid var(--nothing-text-muted)', fontFamily: 'var(--font-mono)', fontSize: 10, textAlign: 'center' }}>{s}</div>
                ))}
              </div>
              <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--nothing-text-dim)', marginBottom: 12 }}>
                ↕ API / Message Queue Communication ↕
              </div>
              <div style={monoLabel}>CHARACTERISTICS</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text-muted)', fontSize: 12, lineHeight: 2 }}>
                <li>Independent services & deployments</li>
                <li>Loosely coupled via APIs</li>
                <li>Complex to set up & manage</li>
                <li>Scale individual services as needed</li>
                <li>Fault isolation — one service can fail independently</li>
              </ul>
            </div>
          </div>

          {/* Comparison table */}
          <table style={tableStyle}>
            <thead><tr>
              <th style={thStyle}>Aspect</th><th style={thStyle}>Monolith</th><th style={thStyle}>Microservices</th>
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
                  <td style={tdStyle}>{m}</td>
                  <td style={tdStyle}>{ms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Serverless ── */}
        <div style={{ marginBottom: 36 }}>
          <h3 style={subHeadingStyle}>Serverless Architecture</h3>
          <p style={{ color: 'var(--nothing-text-muted)', fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
            Serverless doesn't mean "no servers" — it means <strong style={{ color: 'var(--nothing-text)' }}>you don't manage servers</strong>. The cloud provider handles provisioning, scaling, and maintenance. You write functions that run in response to events.
          </p>

          {/* Execution Flow */}
          <div style={monoLabel}>SERVERLESS EXECUTION FLOW</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', padding: '16px 0', marginBottom: 16 }}>
            {[
              { label: 'EVENT TRIGGER', sub: 'HTTP request, schedule, queue message', color: 'var(--nothing-text-muted)' },
              { label: 'COLD START', sub: 'Container spins up (if needed)', color: '#d71921' },
              { label: 'FUNCTION RUNS', sub: 'Your code executes', color: 'var(--nothing-text)' },
              { label: 'RETURNS', sub: 'Response sent back', color: '#0f0' },
              { label: 'SCALES TO ZERO', sub: 'No charge when idle', color: 'var(--nothing-text-dim)' },
            ].map((step, i, arr) => (
              <React.Fragment key={step.label}>
                <div style={{
                  ...cardStyle, minWidth: 130, textAlign: 'center', padding: 14, flexShrink: 0,
                  borderColor: step.color,
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: step.color, marginBottom: 4 }}>{step.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--nothing-text-dim)' }}>{step.sub}</div>
                </div>
                {i < arr.length - 1 && <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--nothing-text-dim)', padding: '0 2px' }}>→</span>}
              </React.Fragment>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={cardStyle}>
              <div style={monoLabel}>PROVIDERS</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text)', fontSize: 13, lineHeight: 2 }}>
                <li>AWS Lambda</li>
                <li>Google Cloud Functions</li>
                <li>Azure Functions</li>
                <li>Cloudflare Workers</li>
                <li>Vercel Edge Functions</li>
              </ul>
            </div>
            <div style={cardStyle}>
              <div style={monoLabel}>USE CASES</div>
              <ul style={{ paddingLeft: 16, color: 'var(--nothing-text)', fontSize: 13, lineHeight: 2 }}>
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
          <h3 style={subHeadingStyle}>API-Driven Design (REST)</h3>
          <p style={{ color: 'var(--nothing-text-muted)', fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
            REST (Representational State Transfer) is an architectural style for designing APIs. Resources are identified by URLs, manipulated using standard HTTP methods, and the server is stateless.
          </p>

          <div style={monoLabel}>REST PRINCIPLES</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
            {[
              { title: 'Resources', desc: 'Everything is a resource identified by a URI (e.g. /api/posts/1)' },
              { title: 'HTTP Methods', desc: 'GET (read), POST (create), PUT (update), DELETE (remove)' },
              { title: 'Stateless', desc: 'Each request contains all info needed; no server-side session' },
              { title: 'Uniform Interface', desc: 'Consistent URL patterns and response formats (JSON)' },
            ].map(p => (
              <div key={p.title} style={{ ...cardStyle, padding: 14 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{p.title}</div>
                <p style={{ color: 'var(--nothing-text-muted)', fontSize: 12, lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </div>

          <div style={monoLabel}>EXAMPLE: BLOG API ENDPOINTS</div>
          <table style={tableStyle}>
            <thead><tr>
              <th style={thStyle}>Method</th><th style={thStyle}>Endpoint</th><th style={thStyle}>Description</th><th style={thStyle}>Request Body</th>
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
                  <td style={{ ...tdStyle, fontWeight: 700, color: m === 'GET' ? '#0f0' : m === 'POST' ? '#00bfff' : m === 'PUT' ? '#ff0' : '#d71921' }}>{m}</td>
                  <td style={{ ...tdStyle, color: 'var(--nothing-text)' }}>{e}</td>
                  <td style={tdStyle}>{d}</td>
                  <td style={{ ...tdStyle, fontSize: 11 }}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>

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
      <section style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <BookOpen size={28} />
          <h2 style={{ ...headingStyle, marginBottom: 0 }}>04 — CHEAT SHEET</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Security Terms */}
          <div style={cardStyle}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>🛡️ Security Quick Reference</div>
            <table style={{ ...tableStyle, fontSize: 12 }}>
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
                  <tr key={term}><td style={{ ...tdStyle, fontWeight: 700, color: 'var(--nothing-text)', width: 70 }}>{term}</td><td style={tdStyle}>{def}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Docker Commands */}
          <div style={cardStyle}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>🐳 Docker Commands</div>
            <pre style={{ ...codeBlock, fontSize: 11, lineHeight: 1.8 }}>{`docker build -t name .      # Build image
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
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>🏗️ Architecture At-a-Glance</div>
            <table style={{ ...tableStyle, fontSize: 11 }}>
              <thead><tr>
                <th style={{ ...thStyle, fontSize: 10 }}>Pattern</th>
                <th style={{ ...thStyle, fontSize: 10 }}>When to Use</th>
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
                  <tr key={p}><td style={{ ...tdStyle, fontWeight: 700, color: 'var(--nothing-text)' }}>{p}</td><td style={tdStyle}>{u}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  SECTION 5: QUIZ                                            ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      <section style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Zap size={28} />
          <h2 style={{ ...headingStyle, marginBottom: 0 }}>05 — QUIZ</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {quizQuestions.map((q, qi) => {
            const selected = quizAnswers[qi];
            const isCorrect = selected === q.answer;
            return (
              <div key={qi} style={{
                ...cardStyle,
                borderColor: quizSubmitted ? (isCorrect ? '#0f0' : '#d71921') : 'var(--nothing-border)',
              }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <span style={{ ...tagStyle('var(--nothing-text-muted)') }}>Q{qi + 1}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>{q.q}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {q.opts.map((opt, oi) => {
                    const isSelected = selected === oi;
                    const isAnswer = q.answer === oi;
                    let borderColor = 'var(--nothing-border)';
                    let bg = 'transparent';
                    if (quizSubmitted) {
                      if (isAnswer) { borderColor = '#0f0'; bg = 'rgba(0,255,0,0.06)'; }
                      else if (isSelected && !isAnswer) { borderColor = '#d71921'; bg = 'rgba(215,25,33,0.06)'; }
                    } else if (isSelected) {
                      borderColor = '#fff'; bg = 'rgba(255,255,255,0.04)';
                    }
                    return (
                      <div key={oi}
                        onClick={() => handleQuizSelect(qi, oi)}
                        style={{
                          padding: '10px 14px', border: `1px solid ${borderColor}`, background: bg,
                          cursor: quizSubmitted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                          fontFamily: 'var(--font-mono)', fontSize: 13,
                        }}
                      >
                        <span style={{ width: 20, height: 20, border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>
                          {quizSubmitted ? (isAnswer ? <CheckCircle size={14} color="#0f0" /> : isSelected ? <XCircle size={14} color="#d71921" /> : String.fromCharCode(65 + oi)) : String.fromCharCode(65 + oi)}
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
            <button style={{ ...btnStyle, borderColor: '#0f0', color: '#0f0' }}
              onClick={() => { if (quizAnswers.every(a => a !== null)) setQuizSubmitted(true); }}
            >
              SUBMIT QUIZ
            </button>
          ) : (
            <>
              <div style={{
                padding: '12px 20px', border: `2px solid ${quizScore >= 6 ? '#0f0' : '#d71921'}`,
                fontFamily: 'var(--font-mono)', fontSize: 14,
              }}>
                SCORE: {quizScore} / {quizQuestions.length} ({Math.round(quizScore / quizQuestions.length * 100)}%)
              </div>
              <button style={btnStyle} onClick={() => { setQuizAnswers(new Array(quizQuestions.length).fill(null)); setQuizSubmitted(false); }}>
                RETRY
              </button>
            </>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <div style={{ borderTop: '1px solid var(--nothing-border)', paddingTop: 20, textAlign: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--nothing-text-dim)', letterSpacing: '0.1em' }}>
          BONUS MODULE COMPLETE · WEB SECURITY · DEVOPS · ARCHITECTURE
        </span>
      </div>
    </div>
  );
};
