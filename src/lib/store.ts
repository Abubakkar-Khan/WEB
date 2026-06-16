import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  lastLoginDate: string | null;
  completedLessons: Record<string, boolean>;
  unlockedBadges: string[];
  theme: 'dark' | 'light';
  
  // Actions
  addXP: (amount: number) => void;
  markLessonComplete: (lessonId: string) => void;
  unlockBadge: (badgeId: string) => void;
  checkStreak: () => void;
  resetProgress: () => void;
  toggleTheme: () => void;
}

export const useStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      streak: 0,
      lastLoginDate: null,
      completedLessons: {},
      unlockedBadges: [],
      theme: 'dark',

      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      addXP: (amount) => set((state) => {
        const newXp = state.xp + amount;
        const newLevel = Math.floor(newXp / 100) + 1; // 100 XP per level
        return { xp: newXp, level: newLevel };
      }),

      markLessonComplete: (lessonId) => set((state) => {
        if (state.completedLessons[lessonId]) return state; // Already completed
        
        const newCompleted = { ...state.completedLessons, [lessonId]: true };
        
        // Auto-award XP on first completion
        const newXp = state.xp + 50; 
        const newLevel = Math.floor(newXp / 100) + 1;
        
        return { 
          completedLessons: newCompleted,
          xp: newXp,
          level: newLevel
        };
      }),

      unlockBadge: (badgeId) => set((state) => {
        if (state.unlockedBadges.includes(badgeId)) return state;
        return { unlockedBadges: [...state.unlockedBadges, badgeId] };
      }),

      checkStreak: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        
        if (state.lastLoginDate === today) return state; // Already logged in today
        
        let newStreak = state.streak;
        
        if (!state.lastLoginDate) {
          newStreak = 1; // First login ever
        } else {
          const lastDate = new Date(state.lastLoginDate);
          const todayDate = new Date(today);
          const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          
          if (diffDays === 1) {
            newStreak += 1; // Consecutive day
          } else {
            newStreak = 1; // Streak broken
          }
        }
        
        return { streak: newStreak, lastLoginDate: today };
      }),

      resetProgress: () => set({
        xp: 0,
        level: 1,
        streak: 0,
        lastLoginDate: null,
        completedLessons: {},
        unlockedBadges: []
      }),
    }),
    {
      name: 'web-study-storage', // key in localStorage
    }
  )
);
