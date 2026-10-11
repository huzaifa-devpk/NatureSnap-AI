import React from 'react';
import { Flame, CheckCircle2, Lock, Sparkles, HeartHandshake } from 'lucide-react';
import type { Achievement, ExplorationStats } from '../types/nature';

interface AchievementsViewProps {
  stats: ExplorationStats;
  achievements: Achievement[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ stats, achievements }) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-World Outdoor Milestones</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Exploration Streaks & Badges
        </h1>
        <p className="text-stone-600 text-sm mt-1.5 leading-relaxed">
          Designed strictly to encourage healthy time in nature — never social media dopamine loops or endless screen time.
        </p>
      </div>

      {/* Outdoor Streak Banner (Section 13) */}
      <div className="nature-card rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm mb-8 bg-gradient-to-r from-amber-50/60 via-stone-50 to-emerald-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-white flex items-center justify-center shadow-lg shadow-amber-900/15">
              <Flame className="w-9 h-9" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Current Outdoor Streak
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                🌱 {stats.outdoorStreakDays}-Day Explorer
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Stepped outside and observed nature {stats.outdoorStreakDays} consecutive days.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 border-stone-200">
            <div>
              <span className="text-2xl font-black text-stone-900">{unlockedCount} / {achievements.length}</span>
              <p className="text-xs text-stone-500 font-semibold">Badges Unlocked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid (Section 13) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map((ach) => {
          const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

          return (
            <div
              key={ach.id}
              className={`nature-card rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                ach.unlocked
                  ? 'border-emerald-300/80 bg-white shadow-2xs hover:shadow-md'
                  : 'border-stone-200/70 bg-stone-50/60 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{ach.icon}</span>
                  {ach.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" />
                      <span>In Progress</span>
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-stone-900 text-base">
                  {ach.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-5 pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 mb-1">
                  <span>Progress</span>
                  <span>
                    {ach.progress} / {ach.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ach.unlocked ? 'bg-emerald-600' : 'bg-stone-400'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {ach.unlockedAt && (
                  <p className="text-[10px] text-emerald-700 font-medium mt-2">
                    Achieved on {new Date(ach.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gentle Philosophy Reminder */}
      <div className="mt-10 p-5 rounded-2xl bg-stone-100/80 border border-stone-200 text-center text-xs text-stone-600 max-w-xl mx-auto">
        <HeartHandshake className="w-5 h-5 text-emerald-700 mx-auto mb-1.5" />
        <strong>Outdoor-First Design:</strong> Streaks in NatureSnap AI are intended only to celebrate real-world walks and outdoor observation. If you missed a day, don't worry — nature is always waiting when you're ready!
      </div>
    </div>
  );
};
