import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  User as UserIcon,
} from 'lucide-react';
import { trackClick } from '../utils/tracker';
import type { NavStrings } from '../i18n/types.app';

type View =
  | 'home'
  | 'timetable'
  | 'attendance'
  | 'class'
  | 'profile';

interface AppBottomNavProps {
  currentView: View;
  strings: NavStrings;
  onNavigate: (view: View) => void;
}

const AppBottomNav: React.FC<AppBottomNavProps> = ({
  currentView,
  strings,
  onNavigate,
}) => {
  const go = (view: View, label: string) => {
    trackClick(`Nav: ${label}`);
    onNavigate(view);
  };

  const activeClass = (view: View) =>
    currentView === view
      ? 'text-zinc-950 dark:text-zinc-50'
      : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350';

  const stroke = (view: View) =>
    currentView === view ? 'stroke-[2.5px]' : 'stroke-[1.8px]';

  return (
    <div
      className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 fixed bottom-0 left-0 right-0 h-16 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-safe"
      id="thesdel-bottom-nav"
    >
      <nav className="max-w-4xl mx-auto grid grid-cols-5 h-full">
        <button
          id="nav-home"
          onClick={() => go('home', 'Today')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${activeClass('home')}`}
        >
          <Clock className={`w-5 h-5 ${stroke('home')}`} />
          <span className="text-[10px] font-mono font-bold tracking-wider">
            {strings.today}
          </span>
        </button>

        <button
          id="nav-timetable"
          onClick={() => go('timetable', 'Timetable')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${activeClass('timetable')}`}
        >
          <Calendar className={`w-5 h-5 ${stroke('timetable')}`} />
          <span className="text-[10px] font-mono font-bold tracking-wider">
            {strings.timetable}
          </span>
        </button>

        <button
          id="nav-attendance"
          onClick={() => go('attendance', 'Attendance')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${activeClass('attendance')}`}
        >
          <CheckCircle2 className={`w-5 h-5 ${stroke('attendance')}`} />
          <span className="text-[10px] font-mono font-bold tracking-wider">
            {strings.attendance}
          </span>
        </button>

        <button
          id="nav-class"
          onClick={() => go('class', 'Class')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${activeClass('class')}`}
        >
          <Layers className={`w-5 h-5 ${stroke('class')}`} />
          <span className="text-[10px] font-mono font-bold tracking-wider">
            {strings.class}
          </span>
        </button>

        <button
          id="nav-profile"
          onClick={() => go('profile', 'Profile')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${activeClass('profile')}`}
        >
          <UserIcon className={`w-5 h-5 ${stroke('profile')}`} />
          <span className="text-[10px] font-mono font-bold tracking-wider">
            {strings.profile}
          </span>
        </button>
      </nav>
    </div>
  );
};

export default AppBottomNav;