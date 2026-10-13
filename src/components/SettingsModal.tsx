'use client';

import React, { useState } from 'react';
import { X, Key, Cpu, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Trash2, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  model: string;
  setModel: (m: string) => void;
  onClearHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  model,
  setModel,
  onClearHistory
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, model })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setTestResult({ success: false, message: msg });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0E0E17] border border-[#A855F7]/30 shadow-[0_0_35px_rgba(168,85,247,0.25)] p-6 overflow-hidden">
        {/* Glow corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#A855F7]/10 blur-2xl rounded-full pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/30">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Provider & Settings</h3>
              <p className="text-[11px] text-[#9292A6]">Configure Google Gemini API and runtime preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9292A6] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5 text-left">
          {/* API Key Section */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#F5F5FA] flex items-center gap-1.5">
                <span>Gemini API Key</span>
                <span className="text-[10px] text-[#9292A6] font-normal">(Client-Stored)</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-[#35E7FF] hover:underline flex items-center gap-1"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div className="relative flex items-center">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 pr-20 rounded-lg bg-[#141422] border border-white/10 focus:border-[#A855F7] text-xs text-white placeholder-gray-600 outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 text-[10px] text-[#9292A6] hover:text-white px-2 py-1 rounded bg-white/[0.05]"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-[10px] text-[#9292A6] mt-1.5">
              Your key is transmitted strictly over secure HTTPS for extension generation and is never saved to database or packaged into extensions.
            </p>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#F5F5FA] mb-1.5">
              Target Model
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['gemini-3.8-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModel(m)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-mono font-medium border text-center transition-all ${
                    model === m
                      ? 'bg-[#A855F7]/20 border-[#A855F7] text-[#A855F7] shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                      : 'bg-[#141422] border-white/10 text-[#9292A6] hover:text-white'
                  }`}
                >
                  {m.replace('gemini-', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Test Connection Button */}
          <div>
            <button
              onClick={handleTestKey}
              disabled={testing}
              className="w-full py-2.5 px-4 rounded-lg bg-[#181829] hover:bg-[#202035] border border-white/10 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#35E7FF]" />
                  <span>Testing Connectivity...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#35E7FF]" />
                  <span>Verify API Connectivity</span>
                </>
              )}
            </button>

            {testResult && (
              <div
                className={`mt-2.5 p-2.5 rounded-lg text-xs flex items-start gap-2 border ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-950/40 border-red-500/30 text-red-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Local History Management */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Local Project Cache</span>
              <span className="text-[10px] text-[#9292A6]">Clear locally cached builds and project state</span>
            </div>
            <button
              onClick={onClearHistory}
              className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#A855F7] hover:bg-[#9333EA] text-xs font-bold text-white transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)]"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
