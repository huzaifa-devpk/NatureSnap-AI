import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Bookmark,
  Share2,
  Clock,
  CheckCircle2,
  Eye,
  Info,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import type { AIAnalysisResult } from '../types/nature';

interface DiscoveryResultViewProps {
  imageUrl: string;
  result: AIAnalysisResult;
  isDemo?: boolean;
  onStartMission: () => void;
  onSaveForLater: () => void;
  onClose: () => void;
}

export const DiscoveryResultView: React.FC<DiscoveryResultViewProps> = ({
  imageUrl,
  result,
  isDemo,
  onStartMission,
  onSaveForLater,
  onClose,
}) => {
  const [showAlternatives, setShowAlternatives] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const { identification, description, environment, facts, observation_clues, mission, safety_notes } = result;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `I discovered ${identification.name} on NatureSnap AI!`,
        text: `Check out what I found outside: ${identification.name} (${identification.scientific_name}). Mission: ${mission.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(
        `I discovered ${identification.name} (${identification.scientific_name}) on NatureSnap AI! Mission: ${mission.title}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getConfidenceBadgeColor = (conf: string) => {
    switch (conf) {
      case 'High':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Low':
      case 'Uncertain':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-20 animate-fadeIn">
      {/* Top action row */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onClose}
          className="text-stone-600 hover:text-stone-900 font-semibold text-xs sm:text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-stone-100 transition-colors"
        >
          ← Back to Dashboard
        </button>

        <div className="flex items-center gap-2">
          {isDemo && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs px-2.5 py-1 rounded-full font-bold">
              Demo Discovery
            </span>
          )}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 px-3 py-1.5 rounded-xl hover:bg-stone-50 shadow-2xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Specimen Card, Right Details & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Identification Card & Image */}
        <div className="md:col-span-5 space-y-4">
          <div className="nature-card rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm">
            <div className="relative aspect-4/3 bg-stone-900 overflow-hidden">
              <img
                src={imageUrl}
                alt={identification.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                  {identification.category}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold border backdrop-blur-md ${getConfidenceBadgeColor(
                    identification.confidence
                  )}`}
                >
                  {identification.confidence} Confidence
                </span>
              </div>
            </div>

            <div className="p-5">
              <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                <span>{identification.name}</span>
              </h2>
              <p className="text-sm italic font-medium text-emerald-800 -mt-0.5">
                {identification.scientific_name}
              </p>

              {/* Uncertainty Disclaimer (Section 7 & 24) */}
              <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold text-stone-800 mb-1">
                  <Info className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Uncertainty Notice</span>
                </div>
                AI identification is an estimate. When unsure, NatureSnap suggests multiple possibilities instead of pretending to be certain.
              </div>

              {/* Alternative Possibilities */}
              {identification.alternatives && identification.alternatives.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowAlternatives(!showAlternatives)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/80 px-3 py-2 rounded-xl transition-colors"
                  >
                    <span>Other Possibilities ({identification.alternatives.length})</span>
                    <span className="text-stone-400">{showAlternatives ? '▲ Hide' : '▼ View'}</span>
                  </button>

                  {showAlternatives && (
                    <div className="mt-2 space-y-2">
                      {identification.alternatives.map((alt, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs"
                        >
                          <div className="flex items-center justify-between font-bold text-stone-800">
                            <span>{alt.name}</span>
                            {alt.probability && (
                              <span className="text-amber-800 font-semibold">{alt.probability}</span>
                            )}
                          </div>
                          {alt.scientific_name && (
                            <p className="text-[11px] italic text-stone-500">{alt.scientific_name}</p>
                          )}
                          <p className="text-[11px] text-stone-600 mt-1">
                            <strong>Look for:</strong> {alt.distinguishing_feature}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Safety Notes Banner */}
          {safety_notes && safety_notes.length > 0 && (
            <div className="p-4 bg-rose-50/80 border border-rose-200/90 rounded-2xl text-xs text-rose-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-rose-800">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Field Safety Notice</span>
              </div>
              {safety_notes.map((note, i) => (
                <p key={i} className="leading-relaxed">
                  • {note}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Mission (The Most Important Feature) & Facts */}
        <div className="md:col-span-7 space-y-6">
          {/* THE MOST IMPORTANT FEATURE — NATURE MISSION (Section 9) */}
          <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 bg-emerald-700/60 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Your Nature Mission 🌿</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
                <Clock className="w-3.5 h-3.5" />
                <span>{mission.estimated_minutes} mins</span>
                <span>•</span>
                <span className="text-amber-300">{mission.difficulty}</span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              {mission.title}
            </h3>

            <p className="mt-3 text-emerald-100 text-sm sm:text-base leading-relaxed bg-white/10 p-4 rounded-2xl backdrop-blur-xs border border-white/10">
              “{mission.description}”
            </p>

            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-emerald-700/50">
              <div className="text-left w-full sm:w-auto">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                  Your mission starts outside.
                </span>
                <span className="text-[11px] text-emerald-200/80">
                  Category: {mission.category}
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={onSaveForLater}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-colors"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Save for Later</span>
                </button>

                <button
                  onClick={onStartMission}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  <span>Start Mission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Section: What You Found */}
          <div className="nature-card rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>What You Found</span>
            </h4>
            <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-normal">
              {description}
            </p>
            {environment && (
              <div className="pt-2 border-t border-stone-100 flex items-start gap-2 text-xs text-stone-600">
                <span className="font-bold text-stone-700 shrink-0">Environment:</span>
                <span>{environment}</span>
              </div>
            )}
          </div>

          {/* Section: Quick Facts (3-5 short bullet facts) */}
          <div className="nature-card rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Quick Facts</span>
            </h4>
            <ul className="space-y-2">
              {facts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section: Look Closer (Visual observation clues - Section 8) */}
          <div className="nature-card rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Look Closer — Observation Clues</span>
              </h4>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                Inspect in Person
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Hold the specimen gently or stand right in front of it to verify these visual features:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {observation_clues.map((clue, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 text-xs text-stone-800 leading-relaxed flex items-start gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{clue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
