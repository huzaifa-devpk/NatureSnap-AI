import React from 'react';
import { Leaf, Sparkles, X, Cpu, Compass, Smartphone } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">About NatureSnap AI</h2>
              <p className="text-xs text-stone-500 font-medium">Hacktoberfest 2026 Open-Source AI Challenge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed max-h-[75vh] overflow-y-auto">
          {/* Hacktoberfest Theme: Touch Grass */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Week 1 Theme: “Touch Grass”</span>
            </div>
            <p className="text-emerald-950">
              Technology too often traps us in infinite feeds and artificial dopamine loops.
              <strong> NatureSnap AI is built on the radical premise that AI should sometimes help people spend LESS time with technology.</strong>
            </p>
            <p className="text-emerald-900">
              The screen is designed to be the shortest part of the experience:
              <br />
              <strong className="text-emerald-950">
                Snap Nature → AI Explains It → Get Outdoor Mission → Put Phone Away → Touch Grass!
              </strong>
            </p>
          </div>

          {/* Core Philosophy Callout */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <span>The Anti-Screen Philosophy</span>
            </h3>
            <p>
              Instead of keeping your eyes glued to the display, every identification delivers a real-world outdoor mission (observing leaf edges, listening to canopy birds, counting petal rays, or inspecting bark lenticels).
              The companion mode prompts you to lock your screen, take a walk, and re-engage with the living world.
            </p>
          </div>

          {/* Open-Source AI & Gemma Architecture (Section 3 & 30) */}
          <div className="space-y-2.5 pt-3 border-t border-stone-200">
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-700" />
              <span>Open-Weight AI Architecture (Gemma)</span>
            </h3>
            <p>
              NatureSnap AI is engineered around open innovation:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-stone-600">
              <li>
                <strong>Model Flexibility:</strong> Built around Google's open-weight <strong>Gemma 2</strong> and <strong>PaliGemma</strong> vision-language architecture.
              </li>
              <li>
                <strong>Modular Service:</strong> Can run through local endpoints (Ollama), open Hugging Face Inference API, or embedded taxonomy inference without closed proprietary lock-in.
              </li>
              <li>
                <strong>Zero Vendor Monopolies:</strong> The prompt architecture and structured response schema can be swapped to any open-weights model anytime.
              </li>
              <li>
                <strong>Privacy by Default:</strong> Specimen images are processed ephemerally on the client or sent directly to your configured open endpoints. No tracking or permanent cloud image storage.
              </li>
            </ul>
          </div>

          {/* Target Audience */}
          <div className="space-y-2 pt-3 border-t border-stone-200">
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>Who Is This For?</span>
            </h3>
            <p>
              Students, hikers, casual dog walkers, families, beginner naturalists, photographers, and anyone who wants to rediscover the joy of their local outdoors without needing a botany degree.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 font-medium">
            Open-source under the MIT License • Hacktoberfest 2026
          </span>
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
