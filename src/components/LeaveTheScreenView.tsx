import React, { useState, useEffect } from 'react';
import {
  Compass,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Footprints,
} from 'lucide-react';
import type { NatureMission } from '../types/nature';
import { toggleGentleWind } from '../utils/soundUtils';

interface LeaveTheScreenViewProps {
  mission: NatureMission;
  specimenName: string;
  onCompleteMission: () => void;
  onExit: () => void;
}

export const LeaveTheScreenView: React.FC<LeaveTheScreenViewProps> = ({
  mission,
  specimenName,
  onCompleteMission,
  onExit,
}) => {
  const initialSeconds = (mission.estimated_minutes || 5) * 60;
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isWindPlaying, setIsWindPlaying] = useState<boolean>(false);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);

  // Timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  // Orientation sensor for compass if supported
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setCompassHeading(Math.round(e.alpha));
      }
    };
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      toggleGentleWind(false);
    };
  }, []);

  const handleToggleSound = () => {
    const playing = toggleGentleWind(!isWindPlaying);
    setIsWindPlaying(playing);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-stone-950 via-emerald-950 to-stone-900 text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
        <button
          onClick={() => {
            toggleGentleWind(false);
            onExit();
          }}
          className="flex items-center gap-1.5 text-stone-400 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Ambient Outdoor Breeze Audio Toggle */}
          <button
            onClick={handleToggleSound}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-semibold backdrop-blur-md transition-all ${
              isWindPlaying
                ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/30'
                : 'bg-white/10 text-stone-300 hover:text-white hover:bg-white/15'
            }`}
            title="Toggle synthetic gentle outdoor breeze audio"
          >
            {isWindPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isWindPlaying ? 'Breeze Playing' : 'Ambient Breeze'}</span>
          </button>
        </div>
      </div>

      {/* Center Screen: Anti-Screen Philosophy (Section 14) */}
      <div className="max-w-xl mx-auto w-full text-center my-auto py-8 space-y-6">
        {/* Glowing Leave The Screen Leaf Badge */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <Footprints className="w-10 h-10 text-stone-950 animate-bounce" />
          </div>
        </div>

        {/* Section 14 Core Message */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
            Outdoor Companion Mode
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-3">
            You have everything you need.
          </h1>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
            Now go explore. 🌿
          </p>
        </div>

        {/* The Mission Prompt Card */}
        <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-3xl p-5 sm:p-6 text-left shadow-lg">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-bold mb-2">
            <span>MISSION: {mission.title.toUpperCase()}</span>
            <span>FOR: {specimenName}</span>
          </div>
          <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
            “{mission.description}”
          </p>
        </div>

        {/* Timer & Screen Lock Tip (Section 14) */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-5xl sm:text-6xl font-mono font-black tracking-wider text-white">
              {formatTime(secondsLeft)}
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
                title={isRunning ? 'Pause Timer' : 'Resume Timer'}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setSecondsLeft(initialSeconds)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-400 hover:text-white transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm px-4 py-2 rounded-full font-semibold">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Tip: Lock your phone and come back when you're done.</span>
          </div>
        </div>

        {/* Subtle Compass Heading if available */}
        {compassHeading !== null && (
          <div className="inline-flex items-center gap-1.5 text-xs text-stone-400">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Heading: {compassHeading}°</span>
          </div>
        )}
      </div>

      {/* Bottom Completion Action (Section 11) */}
      <div className="max-w-md mx-auto w-full pt-4">
        <button
          onClick={() => {
            toggleGentleWind(false);
            onCompleteMission();
          }}
          className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-stone-950 font-black text-base sm:text-lg py-4 px-6 rounded-2xl shadow-xl shadow-emerald-500/25 active:scale-95 transition-all"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>Mission Complete ✓</span>
        </button>
        <p className="text-[11px] text-stone-400 text-center mt-2 font-medium">
          Done exploring? Click here to record your accomplishment.
        </p>
      </div>
    </div>
  );
};
