import React from 'react';
import { Eye, Search, Sparkles, Compass, Leaf } from 'lucide-react';

interface AnalysisLoadingProps {
  stage: string;
  percent: number;
}

export const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({ stage, percent }) => {
  const stagesList = [
    { label: 'Observing image', icon: Eye, threshold: 25 },
    { label: 'Identifying nature', icon: Search, threshold: 55 },
    { label: 'Finding interesting details', icon: Leaf, threshold: 80 },
    { label: 'Creating your outdoor mission', icon: Compass, threshold: 95 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 text-center animate-fadeIn">
        {/* Pulsing nature radar icon */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-75" />
          <div className="absolute inset-2 rounded-full bg-emerald-200/60 animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Leaf className="w-8 h-8 animate-sway text-emerald-100" />
          </div>
        </div>

        {/* Headline */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
          NatureSnap AI is looking closely...
        </h3>
        <p className="text-stone-500 text-xs sm:text-sm mt-1.5 font-medium">
          Running open-weight analysis & synthesizing outdoor clues
        </p>

        {/* Progress Bar */}
        <div className="mt-6 w-full bg-stone-100 rounded-full h-2.5 overflow-hidden border border-stone-200/80">
          <div
            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Current Stage Indicator */}
        <div className="mt-3 text-xs font-bold text-emerald-700 tracking-wide uppercase">
          {stage || 'Observing image...'}
        </div>

        {/* 4 Stage checklist (Section 7) */}
        <div className="mt-6 space-y-2 text-left bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
          {stagesList.map((st, i) => {
            const StageIcon = st.icon;
            const isDone = percent > st.threshold;
            const isCurrent = percent <= st.threshold && (i === 0 || percent > stagesList[i - 1].threshold);

            return (
              <div
                key={st.label}
                className={`flex items-center gap-2.5 text-xs py-1 transition-colors ${
                  isDone
                    ? 'text-emerald-800 font-semibold'
                    : isCurrent
                    ? 'text-stone-900 font-bold'
                    : 'text-stone-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  {isDone ? '✓' : <StageIcon className="w-3 h-3" />}
                </div>
                <span className="flex-1">{st.label}</span>
                {isCurrent && (
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
