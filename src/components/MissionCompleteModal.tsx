import React, { useState, useEffect } from 'react';
import { CheckCircle2, Upload, Camera, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { compressImage } from '../utils/imageUtils';
import { playSuccessChime } from '../utils/soundUtils';

interface MissionCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (evidenceImageUrl?: string, userNotes?: string) => void;
  missionTitle: string;
}

export const MissionCompleteModal: React.FC<MissionCompleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  missionTitle,
}) => {
  const [evidenceImage, setEvidenceImage] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger festive outdoor celebration
      playSuccessChime();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#6ee7b7', '#f59e0b', '#3b82f6'],
        });
      } catch (e) {
        console.debug('Confetti error:', e);
      }
    }
  }, [isOpen]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const compressed = await compressImage(file);
      setEvidenceImage(compressed);
    } catch (err) {
      console.warn('Evidence photo compression error', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    onConfirm(evidenceImage || undefined, notes.trim() || undefined);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-center p-6 sm:p-8 space-y-5">
        {/* Success badge */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Section 11 Headline */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Nice discovery! 🌿
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            You completed your outdoor mission: <strong>{missionTitle}</strong>
          </p>
        </div>

        {/* Optional Evidence Photo (Section 11: Do not force upload proof) */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>Optional Evidence Photo</span>
            </span>
            <span className="text-[11px] text-stone-400 font-medium">Not required</span>
          </div>

          {evidenceImage ? (
            <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-stone-950">
              <img
                src={evidenceImage}
                alt="Mission evidence"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setEvidenceImage(null)}
                className="absolute top-2 right-2 bg-black/60 text-white text-[11px] px-2 py-1 rounded-md font-semibold"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="border border-dashed border-stone-300 hover:border-emerald-500 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-colors bg-white hover:bg-emerald-50/30 text-stone-600 hover:text-emerald-700 text-xs font-semibold">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Compressing...' : 'Add second photo of your finding'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}

          {/* Personal Field Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Field Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you notice while looking? (e.g., smelled like pine, rough bark texture, cold morning wind...)"
              className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none h-20 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-semibold hover:bg-stone-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
          >
            <span>Record in Nature Journal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
