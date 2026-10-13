'use client';

import React from 'react';
import { X, CheckCircle2, Copy, ExternalLink, Terminal, AlertTriangle } from 'lucide-react';

interface ChromeInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  extensionName: string;
}

export const ChromeInstallGuideModal: React.FC<ChromeInstallGuideModalProps> = ({
  isOpen,
  onClose,
  extensionName
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText('chrome://extensions/');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0E0E17] border border-[#35E7FF]/30 shadow-[0_0_35px_rgba(53,231,255,0.2)] p-6 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#35E7FF]/10 blur-2xl rounded-full pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#35E7FF]/10 text-[#35E7FF] border border-[#35E7FF]/30">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">How to Install in Google Chrome</h3>
              <p className="text-[11px] text-[#9292A6]">Step-by-step developer mode installation guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9292A6] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-left">
          {/* Step 1 */}
          <div className="p-3.5 rounded-xl bg-[#141422] border border-white/[0.06] flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#A855F7]/20 text-[#A855F7] font-bold text-xs flex items-center justify-center shrink-0 border border-[#A855F7]/40">
              1
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white mb-0.5">Unzip the downloaded extension archive</h4>
              <p className="text-[11px] text-[#9292A6]">
                Extract the downloaded <code className="text-purple-300 font-mono">.zip</code> package to a folder on your computer (e.g. into your Documents or Developer folder).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-xl bg-[#141422] border border-white/[0.06] flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#A855F7]/20 text-[#A855F7] font-bold text-xs flex items-center justify-center shrink-0 border border-[#A855F7]/40">
              2
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white mb-0.5">Open Chrome Extensions Management</h4>
              <p className="text-[11px] text-[#9292A6] mb-2">
                Open a new tab in Google Chrome and navigate to the extensions page:
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#090910] border border-white/10 font-mono text-xs text-[#35E7FF]">
                  chrome://extensions/
                </span>
                <button
                  onClick={handleCopyUrl}
                  className="px-2 py-1 rounded bg-white/[0.05] hover:bg-white/10 text-[10px] text-white flex items-center gap-1 transition-all"
                >
                  {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy URL'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl bg-[#141422] border border-white/[0.06] flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#A855F7]/20 text-[#A855F7] font-bold text-xs flex items-center justify-center shrink-0 border border-[#A855F7]/40">
              3
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white mb-0.5">Enable &quot;Developer mode&quot;</h4>
              <p className="text-[11px] text-[#9292A6]">
                Look at the top-right corner of the Chrome extensions page and toggle the <strong>Developer mode</strong> switch to ON.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded-xl bg-[#141422] border border-white/[0.06] flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#35E7FF]/20 text-[#35E7FF] font-bold text-xs flex items-center justify-center shrink-0 border border-[#35E7FF]/40">
              4
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white mb-0.5">Click &quot;Load unpacked&quot;</h4>
              <p className="text-[11px] text-[#9292A6]">
                Click the <strong>Load unpacked</strong> button located on the top-left action bar, then select the extracted folder containing <code className="text-purple-300 font-mono">manifest.json</code>.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-3.5 rounded-xl bg-[#141422] border border-emerald-500/20 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/40">
              5
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-emerald-300 mb-0.5">Success! Pin and test</h4>
              <p className="text-[11px] text-[#9292A6]">
                <strong>{extensionName}</strong> is now loaded! Click the puzzle icon in Chrome&apos;s toolbar to pin the extension icon and navigate to your target site to see it in action.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 flex items-center gap-2.5 text-[11px] text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Chrome automatically persists unpacked extensions between browser restarts during development.</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#35E7FF] hover:bg-[#20D0EB] text-xs font-bold text-black transition-all shadow-[0_0_12px_rgba(53,231,255,0.3)]"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
