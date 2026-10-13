'use client';

import React from 'react';
import { Cpu, Terminal, Shield, Sparkles, Sliders, FolderGit2, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeView: 'workspace' | 'library' | 'architecture';
  setActiveView: (view: 'workspace' | 'library' | 'architecture') => void;
  onOpenSettings: () => void;
  onNewProject: () => void;
  isConfigured: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenSettings,
  onNewProject,
  isConfigured
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#A855F7]/15 bg-[#08080D]/90 backdrop-blur-md">
      {/* Top Cyber Telemetry Bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1 border-b border-white/[0.04] text-[10px] font-mono tracking-wider text-[#9292A6]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35E7FF] animate-pulse"></span>
            <span>SYSTEM CORE: <strong className="text-[#35E7FF]">STABLE</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3 text-[#A855F7]" />
            <span>TERMINAL OPS: <strong className="text-[#F5F5FA]">ENCRYPTED</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-[#FF3158]" />
            <span>SECURITY LEVEL: <strong className="text-[#FF3158]">STRICT MV3</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <span className="text-[#9292A6]">ENGINE LATENCY:</span>
            <span className="text-[#35E7FF] font-semibold">0.0004ms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#9292A6]">AI PROVIDER:</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
              isConfigured ? 'bg-purple-900/50 text-[#A855F7] border border-[#A855F7]/30' : 'bg-gray-800 text-gray-400'
            }`}>
              {isConfigured ? 'GEMINI 3.8 FLASH' : 'LOCAL SYNTHESIS'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveView('workspace')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#1A1A2E] to-[#0A0A10] border border-[#A855F7]/40 shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:border-[#FF3158]/60 transition-all duration-300">
            <Cpu className="w-5 h-5 text-[#A855F7] group-hover:text-[#FF3158] transition-colors" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF3158] animate-ping" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF3158]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base bg-gradient-to-r from-white via-[#F5F5FA] to-[#A855F7] bg-clip-text text-transparent">
                TEMPTATION AI
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FF3158]/10 text-[#FF3158] border border-[#FF3158]/30">
                LAB V2
              </span>
            </div>
            <p className="text-[10px] text-[#9292A6] tracking-tight">AGENTIC EXTENSION ENGINE</p>
          </div>
        </div>

        {/* View Switcher Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveView('workspace')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'workspace'
                ? 'bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                : 'text-[#9292A6] hover:text-[#F5F5FA] hover:bg-white/[0.03]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>

          <button
            onClick={() => setActiveView('library')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'library'
                ? 'bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                : 'text-[#9292A6] hover:text-[#F5F5FA] hover:bg-white/[0.03]'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Library</span>
          </button>

          <button
            onClick={() => setActiveView('architecture')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'architecture'
                ? 'bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                : 'text-[#9292A6] hover:text-[#F5F5FA] hover:bg-white/[0.03]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-[#9292A6] hover:text-[#F5F5FA] hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-all"
            title="AI & Environment Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={onNewProject}
            className="px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide text-white bg-gradient-to-r from-[#FF3158] to-[#D91B40] hover:brightness-110 shadow-[0_0_15px_rgba(255,49,88,0.35)] active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>+ NEW BUILD</span>
          </button>
        </div>
      </div>
    </header>
  );
};
