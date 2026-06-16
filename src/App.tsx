import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { useStore } from './lib/store';

// Lazy load chapters for better performance
const Chapter11 = React.lazy(() => import('./pages/Chapter11').then(m => ({ default: m.Chapter11 })));
const Chapter12 = React.lazy(() => import('./pages/Chapter12').then(m => ({ default: m.Chapter12 })));
const Chapter13 = React.lazy(() => import('./pages/Chapter13').then(m => ({ default: m.Chapter13 })));
const Chapter16 = React.lazy(() => import('./pages/Chapter16').then(m => ({ default: m.Chapter16 })));
const BonusChapter = React.lazy(() => import('./pages/BonusChapter').then(m => ({ default: m.BonusChapter })));

const LoadingFallback = () => (
  <div style={{ 
    padding: '64px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontFamily: 'var(--font-mono)', 
    fontSize: '12px', 
    color: 'var(--nothing-text-muted)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase'
  }}>
    LOADING CHAPTER...
  </div>
);

function App() {
  const [activeChapter, setActiveChapter] = useState('ch11');
  const { checkStreak, theme } = useStore();

  React.useEffect(() => {
    checkStreak();
  }, [checkStreak]);

  React.useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  const renderChapter = () => {
    switch (activeChapter) {
      case 'ch11': return <Chapter11 />;
      case 'ch12': return <Chapter12 />;
      case 'ch13': return <Chapter13 />;
      case 'ch16': return <Chapter16 />;
      case 'bonus': return <BonusChapter />;
      default: return <Chapter11 />;
    }
  };

  return (
    <AppLayout activeChapter={activeChapter} setActiveChapter={setActiveChapter}>
      <React.Suspense fallback={<LoadingFallback />}>
        {renderChapter()}
      </React.Suspense>
    </AppLayout>
  );
}

export default App;
