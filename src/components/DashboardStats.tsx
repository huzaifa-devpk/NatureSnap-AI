import React from 'react';
import { Camera, Image as ImageIcon, Flame, CheckCircle2, Compass, Clock, Sparkles } from 'lucide-react';
import type { ExplorationStats } from '../types/nature';

interface DashboardStatsProps {
  stats: ExplorationStats;
  onTakePhoto: () => void;
  onUploadPhoto: () => void;
  onStartDemo: (demoId: 'neem' | 'wildflower' | 'treeBark') => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  onTakePhoto,
  onUploadPhoto,
  onStartDemo,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Prompt Card */}
      <div className="nature-card rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm relative overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready for your outdoor exploration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              What did you discover today?
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-1.5 max-w-xl">
              Found a cool leaf, colorful bark, a wild mushroom, or an unfamiliar insect?
              Snap a picture to learn about it and unlock your micro-mission.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onTakePhoto}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-sm hover:shadow transition-all"
            >
              <Camera className="w-4 h-4 text-emerald-100" />
              <span>Take a Photo</span>
            </button>

            <button
              onClick={onUploadPhoto}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm px-5 py-3 rounded-2xl border border-stone-200 transition-all"
            >
              <ImageIcon className="w-4 h-4 text-stone-600" />
              <span>Upload Photo</span>
            </button>
          </div>
        </div>

        {/* Quick Demo discovery strip */}
        <div className="mt-5 pt-4 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
          <span className="font-medium text-stone-600">Sample Discoveries for Judges:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onStartDemo('neem')}
              className="px-2.5 py-1 rounded-md bg-stone-50 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200 font-medium transition-colors"
            >
              🌿 Neem Leaf Demo
            </button>
            <button
              onClick={() => onStartDemo('wildflower')}
              className="px-2.5 py-1 rounded-md bg-stone-50 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200 font-medium transition-colors"
            >
              🌸 Wildflower Demo
            </button>
            <button
              onClick={() => onStartDemo('treeBark')}
              className="px-2.5 py-1 rounded-md bg-stone-50 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200 font-medium transition-colors"
            >
              🪵 Paper Birch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Today's Exploration Progress Cards (Section 5) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Today's Outdoor Exploration</span>
          </h3>
          <span className="text-xs text-stone-500 font-medium">Updated real-time</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Outdoor Streak */}
          <div className="nature-card rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Outdoor Streak</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {stats.outdoorStreakDays}
              </span>
              <span className="text-sm font-semibold text-stone-500 ml-1">days</span>
            </div>
            <p className="text-xs text-amber-800 font-semibold mt-1">🌱 {stats.outdoorStreakDays}-Day Explorer</p>
          </div>

          {/* Nature Discoveries */}
          <div className="nature-card rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Discoveries</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {stats.natureDiscoveries}
              </span>
              <span className="text-sm font-semibold text-stone-500 ml-1">items</span>
            </div>
            <p className="text-xs text-emerald-800 font-semibold mt-1">Found & cataloged</p>
          </div>

          {/* Missions Completed */}
          <div className="nature-card rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Missions Done</span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {stats.missionsCompleted}
              </span>
              <span className="text-sm font-semibold text-stone-500 ml-1">completed</span>
            </div>
            <p className="text-xs text-blue-800 font-semibold mt-1">Micro-quests outdoors</p>
          </div>

          {/* Minutes Outdoors */}
          <div className="nature-card rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Time Outside</span>
              <div className="w-8 h-8 rounded-lg bg-lime-100 text-lime-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {stats.minutesOutdoors}
              </span>
              <span className="text-sm font-semibold text-stone-500 ml-1">mins</span>
            </div>
            <p className="text-xs text-lime-800 font-semibold mt-1">Screen-free exploration</p>
          </div>
        </div>
      </div>
    </div>
  );
};
