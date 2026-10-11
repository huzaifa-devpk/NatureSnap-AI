import React from 'react';
import { Camera, Sparkles, Footprints, ArrowRight, Smartphone, Compass } from 'lucide-react';

interface LandingHeroProps {
  onStartExploring: () => void;
  onOpenHowItWorks: () => void;
  onTryDemo: (demoId: 'neem' | 'wildflower' | 'treeBark') => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartExploring,
  onOpenHowItWorks,
  onTryDemo,
}) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 bg-gradient-to-b from-emerald-50/70 via-stone-50 to-stone-100/50 border-b border-stone-200/60">
      {/* Decorative nature backdrop elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-lime-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hacktoberfest Week 1 Badge */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 bg-emerald-100/90 border border-emerald-300/70 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Hacktoberfest 2026: Open-Source AI Challenge</span>
            <span className="text-emerald-500">•</span>
            <span className="font-bold text-emerald-900">Week 1: “Touch Grass”</span>
          </div>
        </div>

        {/* Hero Headline & Subhead */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.12]">
            Snap Nature. <br className="hidden sm:inline" />
            Discover More. <br />
            <span className="text-emerald-700 bg-clip-text bg-gradient-to-r from-emerald-800 to-emerald-600">
              Touch Grass.
            </span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto font-normal">
            NatureSnap AI turns the things you discover outside into tiny adventures.
            Powered by open-weight AI to help you learn fast and leave your screen behind.
          </p>

          {/* Core Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onStartExploring}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-base px-7 py-3.5 rounded-2xl shadow-md hover:shadow-lg hover:shadow-emerald-900/15 transition-all transform hover:-translate-y-0.5"
            >
              <Compass className="w-5 h-5 text-emerald-100" />
              <span>Start Exploring</span>
              <ArrowRight className="w-4 h-4 text-emerald-200" />
            </button>

            <button
              onClick={onOpenHowItWorks}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 font-medium text-base px-6 py-3.5 rounded-2xl border border-stone-300 shadow-xs hover:shadow transition-all"
            >
              <span>How It Works</span>
            </button>
          </div>

          {/* Quick Demo Launchers */}
          <div className="mt-6 pt-4 border-t border-stone-200/50 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-stone-600">Try Instant Demo:</span>
            <button
              onClick={() => onTryDemo('neem')}
              className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-700 rounded-lg border border-stone-200 transition-colors font-medium"
            >
              🌿 Neem Leaf
            </button>
            <button
              onClick={() => onTryDemo('wildflower')}
              className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-700 rounded-lg border border-stone-200 transition-colors font-medium"
            >
              🌸 Wildflower
            </button>
            <button
              onClick={() => onTryDemo('treeBark')}
              className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-700 rounded-lg border border-stone-200 transition-colors font-medium"
            >
              🪵 Tree Bark
            </button>
          </div>
        </div>

        {/* 3-Step Simple Explanation */}
        <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="nature-card rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col items-start hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <Camera className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/70 px-2 py-0.5 rounded">
                Step 1
              </span>
              <h3 className="font-bold text-stone-900 text-base">Snap Something</h3>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed mt-1">
              Photograph a leaf, wildflower, tree bark, or insect you noticed on your walk. No scientific expertise needed.
            </p>
          </div>

          <div className="nature-card rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col items-start hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/70 px-2 py-0.5 rounded">
                Step 2
              </span>
              <h3 className="font-bold text-stone-900 text-base">Learn With Open AI</h3>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed mt-1">
              Open-weight Gemma identifies the specimen, provides 3 quick facts, and highlights visual observation clues.
            </p>
          </div>

          <div className="nature-card rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col items-start hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center mb-3">
              <Footprints className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/70 px-2 py-0.5 rounded">
                Step 3
              </span>
              <h3 className="font-bold text-stone-900 text-base">Complete Outdoor Mission</h3>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed mt-1">
              Receive a 5-minute physical exploration mission. Lock your screen, explore the outdoors, and come back when done.
            </p>
          </div>
        </div>

        {/* Section 28 Prominent Touch Grass Message */}
        <div className="mt-10 max-w-3xl mx-auto text-center bg-gradient-to-r from-emerald-800 via-emerald-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl" />
          <div className="inline-flex items-center gap-2 bg-emerald-700/60 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Anti-Screen Philosophy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            “The best part of NatureSnap happens after you put your phone down.”
          </h2>
          <p className="mt-3 text-emerald-100/90 text-sm sm:text-base max-w-xl mx-auto">
            Use AI to understand what you discover outside — then follow the mission and explore it yourself.
            The screen is the shortest part of the adventure.
          </p>
        </div>
      </div>
    </section>
  );
};
