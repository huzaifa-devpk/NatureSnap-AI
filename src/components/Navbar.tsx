import React from 'react';
import {
  Compass,
  BookOpen,
  Target,
  Award,
  Info,
  Settings,
  Camera,
  Leaf,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCapture: () => void;
  journalCount: number;
  activeMissionCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCapture,
  journalCount,
  activeMissionCount,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1"
            aria-label="NatureSnap AI Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-emerald-100 animate-sway" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-stone-900 tracking-tight">NatureSnap</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-stone-500 -mt-1 font-medium hidden sm:block">Touch Grass Edition</p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Explore</span>
            </button>

            <button
              onClick={() => onSelectTab('journal')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                currentTab === 'journal'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Journal</span>
              {journalCount > 0 && (
                <span className="ml-1 text-[11px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded-full font-semibold">
                  {journalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('missions')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                currentTab === 'missions'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <Target className="w-4 h-4 text-emerald-600" />
              <span>Missions</span>
              {activeMissionCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse ml-0.5" />
              )}
            </button>

            <button
              onClick={() => onSelectTab('achievements')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'achievements'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Achievements</span>
            </button>

            <button
              onClick={() => onSelectTab('about')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'about'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <Info className="w-4 h-4 text-emerald-600" />
              <span>About</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab('settings')}
              aria-label="AI Settings"
              className={`p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors ${
                currentTab === 'settings' ? 'bg-stone-100 text-stone-900' : ''
              }`}
              title="AI & Open-Weight Model Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenCapture}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-sm px-3.5 py-2 rounded-xl shadow-sm hover:shadow transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
            >
              <Camera className="w-4 h-4 text-emerald-100" />
              <span className="hidden sm:inline">Snap Nature</span>
              <span className="sm:hidden">Snap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-white/95 backdrop-blur-md border-t border-stone-200/80 py-2 px-1 fixed bottom-0 left-0 right-0 z-40">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-xs ${
            currentTab === 'dashboard' ? 'text-emerald-700 font-semibold' : 'text-stone-500'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => onSelectTab('journal')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-xs ${
            currentTab === 'journal' ? 'text-emerald-700 font-semibold' : 'text-stone-500'
          }`}
        >
          <div className="relative">
            <BookOpen className="w-5 h-5" />
            {journalCount > 0 && (
              <span className="absolute -top-1 -right-2 text-[10px] bg-emerald-600 text-white px-1 rounded-full font-bold">
                {journalCount}
              </span>
            )}
          </div>
          <span>Journal</span>
        </button>

        <button
          onClick={onOpenCapture}
          className="flex flex-col items-center -mt-5 bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white p-3 rounded-full shadow-lg shadow-emerald-900/20 active:scale-90 transition-transform"
          aria-label="Take Photo"
        >
          <Camera className="w-6 h-6" />
        </button>

        <button
          onClick={() => onSelectTab('missions')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-xs ${
            currentTab === 'missions' ? 'text-emerald-700 font-semibold' : 'text-stone-500'
          }`}
        >
          <div className="relative">
            <Target className="w-5 h-5" />
            {activeMissionCount > 0 && (
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </div>
          <span>Missions</span>
        </button>

        <button
          onClick={() => onSelectTab('achievements')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-xs ${
            currentTab === 'achievements' ? 'text-emerald-700 font-semibold' : 'text-stone-500'
          }`}
        >
          <Award className="w-5 h-5" />
          <span>Badges</span>
        </button>
      </div>
    </header>
  );
};
