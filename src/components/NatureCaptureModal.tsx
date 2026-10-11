import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  X,
  RotateCcw,
  Sparkles,
  MapPin,
  AlertCircle,
  SwitchCamera,
} from 'lucide-react';
import { compressImage } from '../utils/imageUtils';
import type { AnalysisContext } from '../services/aiService';
import type { MissionDifficulty } from '../types/nature';

interface NatureCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (imageDataUrl: string, context: AnalysisContext) => void;
  initialMode?: 'camera' | 'upload';
}

export const NatureCaptureModal: React.FC<NatureCaptureModalProps> = ({
  isOpen,
  onClose,
  onAnalyze,
  initialMode = 'upload',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>(initialMode);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Context preferences (Section 16)
  const [activity, setActivity] = useState<'Walking' | 'Hiking' | 'Gardening' | 'Casual Stroll'>('Walking');
  const [availableMinutes, setAvailableMinutes] = useState<number>(15);
  const [difficulty, setDifficulty] = useState<MissionDifficulty>('Easy');
  const [includeLocation, setIncludeLocation] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>('Local Park / Trail');

  // Camera states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setActiveTab(initialMode);
    setPreviewImage(null);
    setErrorMsg(null);
  }, [initialMode, isOpen]);

  // Clean up camera stream on close or unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async (facing: 'environment' | 'user' = facingMode) => {
    stopCamera();
    setErrorMsg(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.warn('Camera access failed:', err);
      setIsCameraActive(false);
      setErrorMsg('Camera access was denied or not supported on this device. You can upload an image file instead!');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const flipCamera = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  const capturePhotoFromCamera = async () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const rawDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const compressed = await compressImage(rawDataUrl);
        setPreviewImage(compressed);
        stopCamera();
      }
    } catch (e) {
      console.error('Failed to grab snapshot:', e);
      setErrorMsg('Failed to capture frame from camera.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    try {
      setErrorMsg(null);
      const compressed = await compressImage(file);
      setPreviewImage(compressed);
    } catch (err) {
      console.error('File compression failed:', err);
      setErrorMsg('Could not process this image. Try another photo.');
    }
  };

  const handleLocationToggle = () => {
    if (!includeLocation) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocationName(`Near ${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°`);
            setIncludeLocation(true);
          },
          () => {
            setLocationName('Outdoor Natural Area');
            setIncludeLocation(true);
          },
          { timeout: 5000 }
        );
      } else {
        setLocationName('Outdoor Natural Area');
        setIncludeLocation(true);
      }
    } else {
      setIncludeLocation(false);
    }
  };

  const handleDiscover = () => {
    if (!previewImage) {
      setErrorMsg('Please upload or snap a photo of a nature specimen first!');
      return;
    }

    stopCamera();
    onAnalyze(previewImage, {
      activity,
      availableMinutes,
      difficulty,
      approximateLocation: includeLocation ? locationName : undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-100 bg-stone-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base sm:text-lg">Capture Nature</h3>
              <p className="text-xs text-stone-500 font-medium">Ready for open-weight AI identification</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guiding Nature Note (Section 6) */}
        <div className="px-5 sm:px-6 pt-4 pb-2 bg-emerald-50/50 border-b border-emerald-100/60">
          <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed flex items-start gap-2">
            <span className="text-base leading-none">🌿</span>
            <span>
              <strong>Tip:</strong> Take a photo of something you noticed outside — a leaf, flower, tree, bird, insect, rock, mushroom, or anything interesting. Perfect photos are not required!
            </span>
          </p>
        </div>

        {/* Main Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Mode Tabs if no preview */}
          {!previewImage && (
            <div className="flex rounded-xl bg-stone-100 p-1">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setActiveTab('upload');
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'upload' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('camera');
                  startCamera();
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'camera' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Device Camera</span>
              </button>
            </div>
          )}

          {/* Image Preview View */}
          {previewImage ? (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-950 aspect-4/3 flex items-center justify-center shadow-inner">
                <img
                  src={previewImage}
                  alt="Captured nature discovery preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    if (activeTab === 'camera') startCamera();
                  }}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake / Change</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Tab: Upload Photo */}
              {activeTab === 'upload' && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-stone-50/50 hover:bg-emerald-50/20"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-stone-800 text-sm sm:text-base">Click or drag image here</h4>
                  <p className="text-stone-500 text-xs mt-1">Supports JPG, PNG, WEBP, HEIC</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* Tab: Camera */}
              {activeTab === 'camera' && (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {!isCameraActive && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-stone-900 text-white">
                        <Camera className="w-8 h-8 text-stone-400 mb-2" />
                        <p className="text-sm font-medium mb-3">Camera is idle or permission required</p>
                        <button
                          type="button"
                          onClick={() => startCamera()}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                        >
                          Enable Camera
                        </button>
                      </div>
                    )}

                    {isCameraActive && (
                      <button
                        type="button"
                        onClick={flipCamera}
                        className="absolute top-3 right-3 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full backdrop-blur-md"
                        title="Flip Camera"
                      >
                        <SwitchCamera className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isCameraActive && (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={capturePhotoFromCamera}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-md active:scale-95 transition-transform"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Snap Photo</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Context Options */}
          <div className="pt-3 border-t border-stone-200/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>Outdoor Context (For Mission Generation)</span>
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Fine-tunes your task</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* Activity */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Your Activity</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value as 'Walking' | 'Hiking' | 'Gardening' | 'Casual Stroll')}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Walking">🚶 Walking</option>
                  <option value="Hiking">🥾 Hiking</option>
                  <option value="Gardening">🌱 Gardening</option>
                  <option value="Casual Stroll">🌿 Casual Stroll</option>
                </select>
              </div>

              {/* Time Available */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Available Time</label>
                <select
                  value={availableMinutes}
                  onChange={(e) => setAvailableMinutes(Number(e.target.value))}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value={5}>⏱️ 5 Minutes</option>
                  <option value={15}>⏱️ 15 Minutes</option>
                  <option value={30}>⏱️ 30 Minutes</option>
                </select>
              </div>

              {/* Difficulty */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as MissionDifficulty)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Easy">⭐ Easy</option>
                  <option value="Moderate">⭐⭐ Moderate</option>
                  <option value="Adventurous">⭐⭐⭐ Adventurous</option>
                </select>
              </div>
            </div>

            {/* Optional Location Toggle */}
            <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <div>
                  <span className="text-xs font-semibold text-stone-800">Approximate Location</span>
                  <p className="text-[10px] text-stone-500">Helps suggest native environment clues (never stored permanently)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLocationToggle}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  includeLocation ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {includeLocation ? 'Enabled ✓' : 'Add Location'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 font-medium text-xs sm:text-sm hover:bg-stone-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDiscover}
            disabled={!previewImage}
            className={`flex items-center gap-2 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-all ${
              previewImage
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover This</span>
          </button>
        </div>
      </div>
    </div>
  );
};
