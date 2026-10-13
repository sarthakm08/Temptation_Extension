'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Wand2, PlayCircle, ShieldCheck, Zap, Layers } from 'lucide-react';

interface HeroSectionProps {
  onSubmitPrompt: (prompt: string) => void;
  isLoading: boolean;
}

const PRESET_PROMPTS = [
  {
    title: 'YouTube Distraction-Free & Neon Controls',
    badge: 'RECOMMENDED',
    prompt: 'Build a Chrome extension that gives YouTube a distraction-free interface, hides Shorts, lets me customize video controls, tracks my viewing time, and uses a black-and-purple neon theme.'
  },
  {
    title: 'Focus Shield & Site Blocker',
    badge: 'PRODUCTIVITY',
    prompt: 'Create a productivity extension that blocks distracting websites during focus sessions with a countdown timer, break intervals, and dark cyberpunk styling.'
  },
  {
    title: 'Obsidian Matrix Dark Reader',
    badge: 'UI/THEME',
    prompt: 'Build a high-contrast dark theme extension for reading articles with customizable neon highlights, font scaling, and zero-distraction reader mode.'
  },
  {
    title: 'Tab Commander & Memory Optimizer',
    badge: 'WORKSPACE',
    prompt: 'Build a Chrome tab manager that groups tabs by project domain, hibernates idle tabs to save RAM, and lets me restore sessions with one click.'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSubmitPrompt,
  isLoading
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmitPrompt(prompt.trim());
    }
  };

  const handleSelectPreset = (presetPrompt: string) => {
    setPrompt(presetPrompt);
    onSubmitPrompt(presetPrompt);
  };

  return (
    <section className="relative w-full py-12 px-4 sm:px-6 lg:px-8 overflow-hidden cyber-grid border-b border-[#A855F7]/10">
      {/* Ambient gradient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#A855F7]/10 via-[#FF3158]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11111B] border border-[#A855F7]/30 text-xs font-mono text-[#A855F7] mb-6 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-[#35E7FF]" />
          <span>AUTONOMOUS AGENT PIPELINE // MANIFEST V3</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3158] animate-ping" />
        </div>

        {/* Main Hero Headings */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
          Imagine It. Command It.{' '}
          <span className="bg-gradient-to-r from-[#FF3158] via-[#A855F7] to-[#35E7FF] bg-clip-text text-transparent">
            Build It.
          </span>
        </h1>

        <p className="max-w-2xl text-sm sm:text-base text-[#9292A6] mb-8 leading-relaxed">
          The cyber-luxury engineering laboratory for generating production-ready Chrome extensions from natural language. Multi-agent planning, Manifest V3 source compilation, automated security audits, and instant ZIP downloads.
        </p>

        {/* Prompt Input Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mb-8">
          <div className="relative flex flex-col sm:flex-row items-stretch p-2 rounded-xl bg-[#11111B]/90 border border-[#A855F7]/30 focus-within:border-[#A855F7] focus-within:shadow-[0_0_25px_rgba(168,85,247,0.35)] transition-all">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your Chrome extension in natural language... (e.g. YouTube distraction blocker with neon dark theme, hidden Shorts, and watch time telemetry)"
              className="w-full bg-transparent p-3 text-sm text-[#F5F5FA] placeholder-[#606078] resize-none outline-none min-h-[70px] sm:min-h-[50px] font-sans"
              rows={2}
            />

            <div className="flex items-center justify-end p-1 sm:p-0">
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-lg text-xs font-bold tracking-wider text-white bg-gradient-to-r from-[#A855F7] to-[#9333EA] hover:brightness-110 shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>ORCHESTRATING...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>CREATE EXTENSION</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Example Prompt Chips */}
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#9292A6]">
            <PlayCircle className="w-3.5 h-3.5 text-[#35E7FF]" />
            <span>COMMAND TEMPLATES:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
            {PRESET_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(item.prompt)}
                disabled={isLoading}
                className="group p-3 rounded-lg bg-[#11111B]/60 hover:bg-[#161624] border border-white/[0.06] hover:border-[#A855F7]/40 text-left transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#F5F5FA] group-hover:text-[#A855F7] transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[#9292A6] line-clamp-2 leading-relaxed">
                  {item.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mt-12 pt-8 border-t border-white/[0.05]">
          <div className="flex flex-col items-center p-3 rounded-lg bg-[#11111B]/40 border border-white/[0.03]">
            <Layers className="w-5 h-5 text-[#A855F7] mb-1.5" />
            <span className="text-xs font-bold text-white">Manifest V3 Strict</span>
            <span className="text-[10px] text-[#9292A6]">Zero deprecated MV2 code</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-[#11111B]/40 border border-white/[0.03]">
            <ShieldCheck className="w-5 h-5 text-[#35E7FF] mb-1.5" />
            <span className="text-xs font-bold text-white">Security Auditor</span>
            <span className="text-[10px] text-[#9292A6]">XSS, CSP, & permission scans</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-[#11111B]/40 border border-white/[0.03]">
            <Zap className="w-5 h-5 text-[#FF3158] mb-1.5" />
            <span className="text-xs font-bold text-white">Self-Repair Loop</span>
            <span className="text-[10px] text-[#9292A6]">Automated error rectification</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-[#11111B]/40 border border-white/[0.03]">
            <Sparkles className="w-5 h-5 text-purple-400 mb-1.5" />
            <span className="text-xs font-bold text-white">Instant ZIP Export</span>
            <span className="text-[10px] text-[#9292A6]">Ready for Chrome Dev Mode</span>
          </div>
        </div>
      </div>
    </section>
  );
};
