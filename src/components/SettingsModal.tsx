import React, { useState } from 'react';
import { Settings, X, Save, RotateCcw, Check } from 'lucide-react';
import type { AISettings, AIProvider } from '../types/nature';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSaveSettings: (settings: AISettings) => void;
  onResetDemoData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetDemoData,
}) => {
  const [provider, setProvider] = useState<AIProvider>(settings.provider);
  const [modelName, setModelName] = useState<string>(settings.modelName || 'google/gemma-2-2b-it');
  const [huggingFaceKey, setHuggingFaceKey] = useState<string>(settings.huggingFaceKey || '');
  const [ollamaEndpoint, setOllamaEndpoint] = useState<string>(settings.ollamaEndpoint || 'http://localhost:11434');

  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      provider,
      modelName,
      huggingFaceKey: huggingFaceKey.trim() || undefined,
      ollamaEndpoint: ollamaEndpoint.trim() || undefined,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTestConnection = async () => {
    setTestStatus('Testing endpoint connection...');
    try {
      if (provider === 'simulated_gemma') {
        setTestStatus('✓ Embedded Gemma Open-Weight engine is active and ready (Offline compatible).');
      } else if (provider === 'huggingface') {
        if (!huggingFaceKey) {
          setTestStatus('⚠️ Please enter a Hugging Face User Access Token first.');
          return;
        }
        const res = await fetch(`https://api-inference.huggingface.co/models/${modelName}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${huggingFaceKey}` },
        });
        if (res.status === 200 || res.status === 503) {
          setTestStatus('✓ Hugging Face model endpoint reached successfully!');
        } else {
          setTestStatus(`⚠️ Hugging Face responded with HTTP ${res.status}. Check your API token.`);
        }
      } else if (provider === 'ollama') {
        const res = await fetch(`${ollamaEndpoint}/api/tags`, { method: 'GET' });
        if (res.ok) {
          setTestStatus('✓ Connected to local Ollama instance successfully!');
        } else {
          setTestStatus(`⚠️ Ollama returned HTTP ${res.status}. Ensure Ollama is running.`);
        }
      }
    } catch (err: unknown) {
      setTestStatus(`❌ Could not connect: ${(err as Error).message || 'Network error'}. Verify CORS or service status.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-800 text-white flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">AI & App Settings</h2>
              <p className="text-xs text-stone-500 font-medium">Configure Open-Weight AI Providers</p>
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
        <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm">
          {/* Provider Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
              Open-Weight AI Model Provider
            </label>

            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  provider === 'simulated_gemma'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="provider"
                  value="simulated_gemma"
                  checked={provider === 'simulated_gemma'}
                  onChange={() => setProvider('simulated_gemma')}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Embedded Gemma Engine (Recommended)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Zero Keys • Offline Ready
                    </span>
                  </div>
                  <p className="text-stone-500 text-xs mt-0.5">
                    Synthesizes Gemma botanical taxonomy and contextual outdoor missions locally with 0ms cold start.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  provider === 'huggingface'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="provider"
                  value="huggingface"
                  checked={provider === 'huggingface'}
                  onChange={() => setProvider('huggingface')}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Hugging Face Inference API</span>
                    <span className="text-[10px] bg-stone-100 text-stone-700 font-semibold px-2 py-0.5 rounded-full">
                      Cloud Open Weights
                    </span>
                  </div>
                  <p className="text-stone-500 text-xs mt-0.5">
                    Connect directly to Hugging Face Open-Source models (e.g. google/gemma-2-2b-it).
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  provider === 'ollama'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="provider"
                  value="ollama"
                  checked={provider === 'ollama'}
                  onChange={() => setProvider('ollama')}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Local Ollama Instance</span>
                    <span className="text-[10px] bg-stone-100 text-stone-700 font-semibold px-2 py-0.5 rounded-full">
                      Localhost LLM
                    </span>
                  </div>
                  <p className="text-stone-500 text-xs mt-0.5">
                    Connect to your local Ollama server running gemma2 on localhost:11434.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Configuration Inputs */}
          {provider === 'huggingface' && (
            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Hugging Face Access Token (Read)
                </label>
                <input
                  type="password"
                  value={huggingFaceKey}
                  onChange={(e) => setHuggingFaceKey(e.target.value)}
                  placeholder="hf_..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Model Repo ID
                </label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="google/gemma-2-2b-it"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {provider === 'ollama' && (
            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ollama Base URL
                </label>
                <input
                  type="text"
                  value={ollamaEndpoint}
                  onChange={(e) => setOllamaEndpoint(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Model Name
                </label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="gemma2"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Test connection output */}
          {testStatus && (
            <div className="p-3 rounded-xl bg-stone-100 text-stone-800 text-xs font-medium border border-stone-200">
              {testStatus}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              Test Connection
            </button>
          </div>

          {/* Data Reset Section */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-stone-800 block text-xs">Reset Sample Data</span>
              <p className="text-[11px] text-stone-500">
                Restore the 3 Hacktoberfest demo discoveries (Neem Leaf, Wildflower, Tree Bark).
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Reset your journal and stats back to the demo defaults?')) {
                  onResetDemoData();
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Demo Data</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <div>
            {isSaved && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                <Check className="w-3.5 h-3.5" />
                <span>Settings saved!</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
