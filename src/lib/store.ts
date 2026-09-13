import { create } from 'zustand';

export type ViewType = 'home' | 'timetable' | 'attendance' | 'class' | 'profile' | 'settings' | 'notifications';

type Theme = 'light' | 'dark' | 'system';

interface AppState {
  theme: Theme;
  currentView: ViewType;
  previousView: ViewType;
  activeClassId: string;
  isRoadmapOpen: boolean;

  setTheme: (theme: Theme) => void;
  setView: (view: ViewType) => void;
  setActiveClassId: (id: string) => void;
  setIsRoadmapOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: (localStorage.getItem('thesdel_theme') as Theme) || 'system',
  currentView: 'home',
  previousView: 'home',
  activeClassId: localStorage.getItem('thesdel_active_class_id') || '',
  isRoadmapOpen: false,

  setTheme: (theme) => {
    localStorage.setItem('thesdel_theme', theme);
    set({ theme });
  },
  setView: (view) => set((state) => ({ previousView: state.currentView, currentView: view })),
  setActiveClassId: (id) => {
    localStorage.setItem('thesdel_active_class_id', id);
    set({ activeClassId: id });
  },
  setIsRoadmapOpen: (isRoadmapOpen) => set({ isRoadmapOpen }),
}));