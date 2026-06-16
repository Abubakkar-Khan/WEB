const fs = require('fs');
const path = require('path');

const pagesDir = 'd:/PROGRAMS/projects/random/WEB_ENG/src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

console.log('Unifying headers and structures in files:', files);

const sectionHeaderComponent = `
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
`;

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Inject SectionHeader component before export const
  if (!content.includes('const SectionHeader:')) {
    const exportIndex = content.indexOf('export const ');
    if (exportIndex !== -1) {
      content = content.slice(0, exportIndex) + sectionHeaderComponent + '\n' + content.slice(exportIndex);
    }
  }

  // 2. File-specific replacements (Chapter Header & Section Headers)
  if (file === 'Chapter11.tsx') {
    // Add imports
    content = content.replace(
      "import React, { useState, useEffect, useCallback } from 'react';",
      "import React, { useState, useEffect, useCallback } from 'react';\nimport { Code2, Calendar, Database, FileText, HelpCircle } from 'lucide-react';"
    );

    // Replace Chapter Header
    content = content.replace(
      /\{\/\* ──────────── CHAPTER HEADER ──────────── \*\/\s*<header>[\s\S]*?<\/header>/,
      `<div style={{ marginBottom: '40px', borderBottom: '1px solid var(--nothing-border)', paddingBottom: '24px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--nothing-text-dim)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Chapter Eleven
        </div>
        <h1 style={{ fontFamily: 'var(--font-dot)', fontSize: '48px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0, lineHeight: 1.0, color: 'var(--nothing-text)' }}>
          11 · JS Objects
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--nothing-text-muted)', fontSize: '13px', marginTop: '12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          String · Date · Web Storage
        </p>
      </div>`
    );

    // Replace Section Headers
    content = content.replace(/<h2 style=\{S\.sectionHeader\}>1 · String Object<\/h2>/g, '<SectionHeader no="01" title="String Object" icon={<Code2 size={20} />} />');
    content = content.replace(/<h2 style=\{S\.sectionHeader\}>2 · Date Object<\/h2>/g, '<SectionHeader no="02" title="Date Object" icon={<Calendar size={20} />} />');
    content = content.replace(/<h2 style={S.sectionHeader}>3 · Web Storage API<\/h2>/g, '<SectionHeader no="03" title="Web Storage API" icon={<Database size={20} />} />');
    content = content.replace(/<h2 style={S.sectionHeader}>4 · Cheat Sheet<\/h2>/g, '<SectionHeader no="04" title="Cheat Sheet" icon={<FileText size={20} />} />');
    content = content.replace(/<h2 style={S.sectionHeader}>5 · Quiz<\/h2>/g, '<SectionHeader no="05" title="Quiz" icon={<HelpCircle size={20} />} />');
  }

  if (file === 'Chapter12.tsx') {
    // Replace Chapter Header
    content = content.replace(
      `<div style={{ marginBottom: '44px' }}>\n        <div style={{ fontFamily: 'var(--font-dot)', fontSize: '60px', letterSpacing: '0.08em', lineHeight: 0.9, textTransform: 'uppercase' }}>\n          12\n        </div>\n        <div style={{ fontFamily: 'var(--font-dot)', fontSize: '32px', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '8px' }}>\n          Document Object Model\n        </div>\n        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--nothing-text-muted)', letterSpacing: '0.1em', marginTop: '8px' }}>\n          DOM Tree · Selecting · Creating · Inserting · Removing · Collections · Dynamic Styling\n        </div>\n      </div>`,
      `<div style={{ marginBottom: '40px', borderBottom: '1px solid var(--nothing-border)', paddingBottom: '24px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--nothing-text-dim)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Chapter Twelve
        </div>
        <h1 style={{ fontFamily: 'var(--font-dot)', fontSize: '48px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0, lineHeight: 1.0, color: 'var(--nothing-text)' }}>
          12 · DOM
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--nothing-text-muted)', fontSize: '13px', marginTop: '12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          DOM Tree · Selecting · Creating · Inserting · Removing · Collections · Dynamic Styling
        </p>
      </div>`
    );

    // Replace Section Headers
    content = content.replace(/<div style=\{sectionTitle\}>\s*<TreePine size=\{20\} \/> 01 · DOM Tree Structure\s*<\/div>/g, '<SectionHeader no="01" title="DOM Tree Structure" icon={<TreePine size={20} />} />');
    content = content.replace(/<div style=\{sectionTitle\}>\s*<Search size=\{20\} \/> 02 · Selecting Elements\s*<\/div>/g, '<SectionHeader no="02" title="Selecting Elements" icon={<Search size={20} />} />');
    content = content.replace(/<div style=\{sectionTitle\}>\s*<PlusCircle size=\{20\} \/> 03 · Creating, Inserting & Removing Nodes\s*<\/div>/g, '<SectionHeader no="03" title="Creating, Inserting & Removing Nodes" icon={<PlusCircle size={20} />} />');
    content = content.replace(/<div style=\{sectionTitle\}>\s*<Layers size=\{20\} \/> 04 · Document Collections\s*<\/div>/g, '<SectionHeader no="04" title="Document Collections" icon={<Layers size={20} />} />');
    content = content.replace(/<div style=\{sectionTitle\}>\s*<Paintbrush size=\{20\} \/> 05 · Dynamic Styling\s*<\/div>/g, '<SectionHeader no="05" title="Dynamic Styling" icon={<Paintbrush size={20} />} />');
    content = content.replace(/<div style=\{sectionTitle\}>\s*<BookOpen size=\{20\} \/> 06 · Cheat Sheet\s*<\/div>/g, '<SectionHeader no="06" title="Cheat Sheet" icon={<BookOpen size={20} />} />');
    content = content.replace(/<div style=\{sectionTitle\}>\s*<HelpCircle size=\{20\} \/> 07 · Quiz\s*<\/div>/g, '<SectionHeader no="07" title="Quiz" icon={<HelpCircle size={20} />} />');
  }

  if (file === 'Chapter13.tsx') {
    // Replace Chapter Header
    content = content.replace(
      /<header style=\{\{\s*marginBottom:\s*['"]40px['"]\s*\}\}>[\s\S]*?<\/header>/,
      `<div style={{ marginBottom: '40px', borderBottom: '1px solid var(--nothing-border)', paddingBottom: '24px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--nothing-text-dim)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Chapter Thirteen
        </div>
        <h1 style={{ fontFamily: 'var(--font-dot)', fontSize: '48px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0, lineHeight: 1.0, color: 'var(--nothing-text)' }}>
          13 · Events
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--nothing-text-muted)', fontSize: '13px', marginTop: '12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Mouse · Keyboard · Form · Bubbling · Capturing · Delegation
        </p>
      </div>`
    );

    // Replace Section Headers
    content = content.replace(/<h2 style=\{sectionTitle\}><Zap size=\{22\} \/> Event Object Properties<\/h2>/g, '<SectionHeader no="01" title="Event Object Properties" icon={<Zap size={22} />} />');
    content = content.replace(/<h2 style=\{sectionTitle\}><MousePointer size=\{22\} \/> Mouse Events<\/h2>/g, '<SectionHeader no="02" title="Mouse Events" icon={<MousePointer size={22} />} />');
    content = content.replace(/<h2 style=\{sectionTitle\}><Keyboard size=\{22\} \/> Keyboard Events<\/h2>/g, '<SectionHeader no="03" title="Keyboard Events" icon={<Keyboard size={22} />} />');
    content = content.replace(/<h2 style=\{sectionTitle\}><FileText size=\{22\} \/> Form Events<\/h2>/g, '<SectionHeader no="04" title="Form Events" icon={<FileText size={22} />} />');
    content = content.replace(/<h2 style=\{sectionTitle\}><Layers size=\{22\} \/> Event Bubbling & Capturing<\/h2>/g, '<SectionHeader no="05" title="Event Bubbling & Capturing" icon={<Layers size={22} />} />');
    content = content.replace(/<h2 style=\{sectionTitle\}><ShieldOff size=\{22\} \/> stopPropagation vs preventDefault<\/h2>/g, '<SectionHeader no="06" title="stopPropagation vs preventDefault" icon={<ShieldOff size={22} />} />');
    content = content.replace(/<h2 style=\{sectionTitle\}><GitMerge size=\{22\} \/> Event Delegation<\/h2>/g, '<SectionHeader no="07" title="Event Delegation" icon={<GitMerge size={22} />} />');
    content = content.replace(/<h2 style=\{sectionTitle\}><BookOpen size=\{22\} \/> Cheat Sheet<\/h2>/g, '<SectionHeader no="08" title="Cheat Sheet" icon={<BookOpen size={22} />} />');
    content = content.replace(/<h2 style=\{sectionTitle\}><HelpCircle size=\{22\} \/> Quiz<\/h2>/g, '<SectionHeader no="09" title="Quiz" icon={<HelpCircle size={22} />} />');
  }

  if (file === 'Chapter16.tsx') {
    // Add imports
    content = content.replace(
      "import { Globe, Send, ArrowRight, CheckCircle, XCircle, AlertTriangle, Search, User, ChevronDown, ChevronUp, Zap, Clock, Database } from 'lucide-react';",
      "import { Globe, Send, ArrowRight, CheckCircle, XCircle, AlertTriangle, Search, User, ChevronDown, ChevronUp, Zap, Clock, Database, Code2, Server, BookOpen, FileText, HelpCircle, Activity, RefreshCw } from 'lucide-react';"
    );

    // Replace Chapter Header
    content = content.replace(
      /<motion\.div\s*initial=\{\{\s*opacity:\s*0,\s*y:\s*-20\s*\}\}[\s\S]*?<\/motion\.div>/,
      `<div style={{ marginBottom: '40px', borderBottom: '1px solid var(--nothing-border)', paddingBottom: '24px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--nothing-text-dim)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Chapter Sixteen
        </div>
        <h1 style={{ fontFamily: 'var(--font-dot)', fontSize: '48px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0, lineHeight: 1.0, color: 'var(--nothing-text)' }}>
          16 · Ajax &amp; JSON
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--nothing-text-muted)', fontSize: '13px', marginTop: '12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          XMLHttpRequest · Asynchronous Requests · Data Interchange
        </p>
      </div>`
    );

    // Replace Section Headers
    content = content.replace(/<div style=\{sectionTitle\}>\s*<Globe size=\{18\} \/>\s*<span>01 — What Is Ajax<\/span>\s*<\/div>/g, '<SectionHeader no="01" title="What Is Ajax" icon={<Globe size={18} />} />');
    content = content.replace(/<div style=\{sectionTitle\}>\s*<Code2 size=\{18\} \/>\s*<span>02 — XMLHttpRequest Object<\/span>\s*<\/div>/g, '<SectionHeader no="02" title="XMLHttpRequest Object" icon={<Code2 size={18} />} />');
    content = content.replace(/<div style=\{sectionTitle\}>\s*<Clock size=\{18\} \/>\s*<span>03 — readyState Values<\/span>\s*<\/div>/g, '<SectionHeader no="03" title="readyState Values" icon={<Clock size={18} />} />');
    content = content.replace(/<div style=\{sectionTitle\}>\s*<Database size=\{18\} \/>\s*<span>04 — HTTP Status Codes<\/span>\s*<\/div>/g, '<SectionHeader no="04" title="HTTP Status Codes" icon={<Database size={18} />} />');
    content = content.replace(/<div style=\{sectionTitle\}>\s*<Send size=\{18\} \/>\s*<span>05 — GET vs POST Requests<\/span>\s*<\/div>/g, '<SectionHeader no="05" title="GET vs POST" icon={<Send size={18} />} />');
    content = content.replace(/<div style=\{sectionTitle\}>\s*<Database size=\{18\} \/>\s*<span>06 — JSON Format &amp; Rules<\/span>\s*<\/div>/g, '<SectionHeader no="06" title="JSON Format" icon={<Database size={18} />} />');
    content = content.replace(/<div style=\{sectionTitle\}>\s*<Zap size=\{18\} \/>\s*<span>07 — Ajax Request Lifecycle<\/span>\s*<\/div>/g, '<SectionHeader no="07" title="Ajax Request Lifecycle" icon={<Zap size={18} />} />');
    content = content.replace(/<div style=\{sectionTitle\}>\s*<BookOpen size=\{18\} \/>\s*<span>08 — Full Application Pattern<\/span>\s*<\/div>/g, '<SectionHeader no="08" title="Full Application Pattern" icon={<BookOpen size={18} />} />');
    content = content.replace(/<div style=\{sectionTitle\}>\s*<FileText size=\{18\} \/>\s*<span>09 — Cheat Sheet &amp; Reference<\/span>\s*<\/div>/g, '<SectionHeader no="09" title="Cheat Sheet" icon={<FileText size={18} />} />');
    content = content.replace(/<div style=\{sectionTitle\}>\s*<HelpCircle size=\{18\} \/>\s*<span>10 — Practice Quiz<\/span>\s*<\/div>/g, '<SectionHeader no="10" title="Quiz" icon={<HelpCircle size={18} />} />');
  }

  if (file === 'BonusChapter.tsx') {
    // Add imports
    content = content.replace(
      "import { Shield, Server, Cloud, Lock, AlertTriangle, Database, Eye, Key, Bug, FileWarning, MonitorX, Globe, Container, Rocket, GitBranch, Layers, Zap, BookOpen, CheckCircle, XCircle } from 'lucide-react';",
      "import { Shield, Server, Cloud, Lock, AlertTriangle, Database, Eye, Key, Bug, FileWarning, MonitorX, Globe, Container, Rocket, GitBranch, Layers, Zap, BookOpen, CheckCircle, XCircle, HelpCircle, Cpu } from 'lucide-react';"
    );

    // Replace Chapter Header
    content = content.replace(
      /<motion\.div\s*initial=\{\{\s*opacity:\s*0,\s*y:\s*-20\s*\}\}[\s\S]*?<\/motion\.div>/,
      `<div style={{ marginBottom: '40px', borderBottom: '1px solid var(--nothing-border)', paddingBottom: '24px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--nothing-text-dim)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Bonus Module
        </div>
        <h1 style={{ fontFamily: 'var(--font-dot)', fontSize: '48px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0, lineHeight: 1.0, color: 'var(--nothing-text)' }}>
          ++ · Security &amp; DevOps
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--nothing-text-muted)', fontSize: '13px', marginTop: '12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Web Security · Modern Deployment · Architecture &amp; Trends
        </p>
      </div>`
    );

    // Replace Section Headers
    content = content.replace(/<div style=\{\{\s*display:\s*['"]flex['"],\s*alignItems:\s*['"]center['"],\s*gap:\s*12,\s*marginBottom:\s*24\s*\}\}>\s*<Shield size=\{28\} \/>\s*<h2 style=\{\{\s*\.\.\.headingStyle,\s*marginBottom:\s*0\s*\}\}>01 — WEB SECURITY<\/h2>\s*<\/div>/g, '<SectionHeader no="01" title="Web Security" icon={<Shield size={22} />} />');
    content = content.replace(/<div style=\{\{\s*display:\s*['"]flex['"],\s*alignItems:\s*['"]center['"],\s*gap:\s*12,\s*marginBottom:\s*24\s*\}\}>\s*<Server size=\{28\} \/>\s*<h2 style=\{\{\s*\.\.\.headingStyle,\s*marginBottom:\s*0\s*\}\}>02 — MODERN DEPLOYMENT &amp; DEVOPS<\/h2>\s*<\/div>/g, '<SectionHeader no="02" title="Modern Deployment & DevOps" icon={<Cpu size={22} />} />');
    content = content.replace(/<div style=\{\{\s*display:\s*['"]flex['"],\s*alignItems:\s*['"]center['"],\s*gap:\s*12,\s*marginBottom:\s*24\s*\}\}>\s*<GitBranch size=\{28\} \/>\s*<h2 style=\{\{\s*\.\.\.headingStyle,\s*marginBottom:\s*0\s*\}\}>03 — WEB ARCHITECTURE &amp; FUTURE TRENDS<\/h2>\s*<\/div>/g, '<SectionHeader no="03" title="Web Architecture & Future Trends" icon={<GitBranch size={22} />} />');
    content = content.replace(/<h2 style=\{\{\s*\.\.\.headingStyle,\s*marginBottom:\s*0\s*\}\}>04 — CHEAT SHEET<\/h2>/g, '<SectionHeader no="04" title="Cheat Sheet" icon={<BookOpen size={22} />} />');
    content = content.replace(/<h2 style=\{\{\s*\.\.\.headingStyle,\s*marginBottom:\s*0\s*\}\}>05 — QUIZ<\/h2>/g, '<SectionHeader no="05" title="Quiz" icon={<HelpCircle size={22} />} />');
  }

  // 3. Replace neon greens, yellows and inline backgrounds with desaturated ones using variables
  content = content.replace(/color:\s*['"]#4f4['"]/g, "color: 'var(--nothing-green)'");
  content = content.replace(/color:\s*['"]#0f0['"]/g, "color: 'var(--nothing-green)'");
  content = content.replace(/color:\s*['"]#0f8['"]/g, "color: 'var(--nothing-green)'");
  content = content.replace(/color:\s*['"]#2a6['"]/g, "color: 'var(--nothing-green)'");
  content = content.replace(/color:\s*['"]#ff0['"]/g, "color: 'var(--nothing-yellow)'");
  content = content.replace(/color:\s*['"]#f80['"]/g, "color: 'var(--nothing-yellow)'"); // desaturate orange to yellow/amber
  
  content = content.replace(/borderColor:\s*['"]#4f4['"]/g, "borderColor: 'var(--nothing-green)'");
  content = content.replace(/borderColor:\s*['"]#0f0['"]/g, "borderColor: 'var(--nothing-green)'");
  content = content.replace(/borderColor:\s*['"]#ff0['"]/g, "borderColor: 'var(--nothing-yellow)'");
  content = content.replace(/borderColor:\s*['"]#d71921['"]/g, "borderColor: 'var(--nothing-red)'");

  // Replace background-colors
  content = content.replace(/rgba\(0,\s*255,\s*0,\s*0\.\d+\)/g, "var(--nothing-green-bg)");
  content = content.replace(/rgba\(0,\s*255,\s*100,\s*0\.\d+\)/g, "var(--nothing-green-bg)");
  content = content.replace(/rgba\(255,\s*255,\s*0,\s*0\.\d+\)/g, "var(--nothing-yellow-bg)");
  content = content.replace(/rgba\(0,\s*255,\s*136,\s*0\.\d+\)/g, "var(--nothing-green-bg)");
  
  content = content.replace(/background:\s*['"]#001a00['"]/g, "background: 'var(--nothing-green-bg)'");
  content = content.replace(/background:\s*['"]#1a0000['"]/g, "background: 'var(--nothing-red-bg)'");
  content = content.replace(/background:\s*['"]#0a3a0a['"]/g, "background: 'var(--nothing-green-bg)'");
  content = content.replace(/background:\s*['"]#3a0a0a['"]/g, "background: 'var(--nothing-red-bg)'");
  content = content.replace(/border:\s*['"]1px solid #1a5a1a['"]/g, "border: '1px solid var(--nothing-green)'");
  content = content.replace(/border:\s*['"]1px solid #5a1a1a['"]/g, "border: '1px solid var(--nothing-red)'");
  content = content.replace(/border:\s*['"]1px solid #2a6['"]/g, "border: '1px solid var(--nothing-green)'");
  content = content.replace(/border:\s*['"]1px solid #0f0['"]/g, "border: '1px solid var(--nothing-green)'");
  content = content.replace(/borderLeft:\s*['"]3px solid #0f0['"]/g, "borderLeft: '3px solid var(--nothing-green)'");
  content = content.replace(/borderLeft:\s*['"]3px solid #d71921['"]/g, "borderLeft: '3px solid var(--nothing-red)'");
  
  // Specific quiz feedback colors
  content = content.replace(/color:\s*score\s*===\s*quizData\.length\s*\?\s*['"]#0f0['"]/g, "color: score === quizData.length ? 'var(--nothing-green)'");
  content = content.replace(/color:\s*score\s*===\s*quizQuestions\.length\s*\?\s*['"]#0f0['"]/g, "color: score === quizQuestions.length ? 'var(--nothing-green)'");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned up and unified ${file}`);
});

console.log('All unifications completed successfully!');
