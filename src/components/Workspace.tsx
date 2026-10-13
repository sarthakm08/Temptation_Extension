'use client';

import React, { useState } from 'react';
import { 
  ExtensionProject, 
  GeneratedFile 
} from '@/types/extension';
import { 
  Plus, 
  Sparkles, 
  Download, 
  Terminal, 
  Code2, 
  ShieldCheck, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Globe, 
  Wrench, 
  Play, 
  History, 
  ChevronRight,
  FolderArchive,
  HelpCircle,
  FileText
} from 'lucide-react';
import { BuildTimeline } from './BuildTimeline';
import { CodeStudio } from './CodeStudio';
import { SecurityView } from './SecurityView';
import { packageExtensionToZip, triggerBlobDownload } from '@/lib/agents/packagingAgent';

interface WorkspaceProps {
  currentProject: ExtensionProject | null;
  savedProjects: ExtensionProject[];
  onSelectProject: (p: ExtensionProject) => void;
  onNewProject: () => void;
  onSubmitPrompt: (prompt: string) => void;
  onUpdateFile: (path: string, newContent: string) => void;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
  isLoading: boolean;
}

const EXTENSION_TEMPLATES = [
  {
    id: 'youtube-neon',
    name: 'YouTube Cyber Distraction-Free',
    target: 'youtube.com',
    desc: 'Hides Shorts, suppresses recommendations, neon purple palette, viewing time telemetry.',
    prompt: 'Build a Chrome extension that gives YouTube a distraction-free interface, hides Shorts, lets me customize video controls, tracks my viewing time, and uses a black-and-purple neon theme.'
  },
  {
    id: 'focus-shield',
    name: 'Productivity & Focus Shield',
    target: 'Multiple hosts',
    desc: 'Blocks distracting sites during focus sessions with timers and cyber HUD.',
    prompt: 'Create a focus extension that blocks social media sites during work sessions with a cyber dark HUD timer.'
  },
  {
    id: 'dark-matrix',
    name: 'Obsidian Matrix Dark Theme',
    target: '<all_urls>',
    desc: 'Deep black & cyber violet styling with customizable contrast and reader mode.',
    prompt: 'Build a high-contrast dark theme extension for reading articles with customizable neon highlights and reader mode.'
  },
  {
    id: 'tab-commander',
    name: 'Apex Tab & Window Manager',
    target: 'Browser Tabs',
    desc: 'Auto-groups tabs, hibernates idle pages, and exports sessions to JSON.',
    prompt: 'Build a Chrome tab manager that groups tabs by project domain and lets me restore sessions with one click.'
  }
];

export const Workspace: React.FC<WorkspaceProps> = ({
  currentProject,
  savedProjects,
  onSelectProject,
  onNewProject,
  onSubmitPrompt,
  onUpdateFile,
  onOpenGuide,
  onOpenSettings,
  isLoading
}) => {
  const [activeCenterTab, setActiveCenterTab] = useState<'prompt' | 'timeline' | 'code' | 'security'>('code');
  const [promptInput, setPromptInput] = useState('');
  const [isPackaging, setIsPackaging] = useState(false);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptInput.trim() && !isLoading) {
      onSubmitPrompt(promptInput.trim());
      setPromptInput('');
      setActiveCenterTab('timeline');
    }
  };

  const handleDownloadZip = async () => {
    if (!currentProject || currentProject.files.length === 0) return;
    setIsPackaging(true);
    try {
      const blob = await packageExtensionToZip(currentProject.files);
      const filename = `${currentProject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-extension.zip`;
      triggerBlobDownload(blob, filename);
    } catch (err) {
      console.error('Packaging error:', err);
    } finally {
      setIsPackaging(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#08080D]">
      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR: Projects, Templates, Builds            */}
      {/* ======================================================== */}
      <aside className="w-full lg:w-64 xl:w-72 bg-[#0B0B13] border-b lg:border-b-0 lg:border-r border-white/[0.06] flex flex-col shrink-0 text-left">
        {/* New Build Button */}
        <div className="p-3 border-b border-white/[0.06]">
          <button
            onClick={onNewProject}
            className="w-full py-2 px-3 rounded-lg bg-[#A855F7]/15 hover:bg-[#A855F7]/25 text-[#A855F7] border border-[#A855F7]/30 text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
          >
            <Plus className="w-4 h-4" />
            <span>NEW EXTENSION BUILD</span>
          </button>
        </div>

        {/* Scrollable Templates and Recent Builds */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* Extension Templates */}
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#9292A6] uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-[#35E7FF]" />
              <span>PRODUCTION TEMPLATES</span>
            </div>

            <div className="space-y-1.5">
              {EXTENSION_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    onSubmitPrompt(tmpl.prompt);
                    setActiveCenterTab('timeline');
                  }}
                  disabled={isLoading}
                  className="w-full p-2.5 rounded-lg bg-[#12121E]/80 hover:bg-[#181829] border border-white/[0.04] hover:border-[#A855F7]/40 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-white group-hover:text-[#A855F7] transition-colors truncate">
                      {tmpl.name}
                    </span>
                    <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-[#A855F7] shrink-0" />
                  </div>
                  <span className="text-[10px] text-[#35E7FF] font-mono block mb-1">↳ {tmpl.target}</span>
                  <p className="text-[11px] text-[#9292A6] line-clamp-2 leading-tight">
                    {tmpl.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Builds List */}
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#9292A6] uppercase tracking-wider mb-2">
              <History className="w-3 h-3 text-[#A855F7]" />
              <span>SAVED BUILDS ({savedProjects.length})</span>
            </div>

            {savedProjects.length === 0 ? (
              <div className="p-3 rounded-lg bg-black/30 border border-white/[0.03] text-[11px] text-gray-500 text-center">
                No saved builds yet. Execute your first prompt above!
              </div>
            ) : (
              <div className="space-y-1">
                {savedProjects.map((p) => {
                  const isCurrent = currentProject?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => onSelectProject(p)}
                      className={`w-full p-2 rounded-lg text-left transition-all flex items-center justify-between border ${
                        isCurrent
                          ? 'bg-[#A855F7]/15 border-[#A855F7]/40 text-white'
                          : 'bg-[#12121E]/40 border-transparent text-[#9292A6] hover:text-white hover:bg-[#161626]'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <span className="text-xs font-semibold block truncate">{p.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {p.files.length} files · {p.status}
                        </span>
                      </div>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        p.status === 'validated' || p.status === 'repaired' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer Link */}
        <div className="p-3 border-t border-white/[0.06] text-xs text-gray-500 flex items-center justify-between">
          <button 
            onClick={onOpenSettings}
            className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"
          >
            <span>AI Model & Keys</span>
          </button>
          <span className="font-mono text-[10px] text-[#A855F7]">MV3 LAB</span>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. CENTER PANEL: Prompt, Timeline, Code, Security       */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#08080D]">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-[#0E0E18]">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveCenterTab('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeCenterTab === 'code'
                  ? 'bg-[#A855F7]/20 text-white border border-[#A855F7]/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : 'text-[#9292A6] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>Code Studio</span>
              {currentProject && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-950 text-purple-300">
                  {currentProject.files.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveCenterTab('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeCenterTab === 'timeline'
                  ? 'bg-[#A855F7]/20 text-white border border-[#A855F7]/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : 'text-[#9292A6] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#35E7FF]" />
              <span>Agent Pipeline</span>
              {currentProject?.steps.some(s => s.status === 'running') && (
                <span className="w-2 h-2 rounded-full bg-[#35E7FF] animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveCenterTab('security')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeCenterTab === 'security'
                  ? 'bg-[#A855F7]/20 text-white border border-[#A855F7]/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : 'text-[#9292A6] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF3158]" />
              <span>Security & Audit</span>
              {currentProject?.securityReport && (
                <span className="text-[10px] font-mono text-emerald-400">
                  {currentProject.securityReport.score}/100
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveCenterTab('prompt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeCenterTab === 'prompt'
                  ? 'bg-[#A855F7]/20 text-white border border-[#A855F7]/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : 'text-[#9292A6] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Requirements Spec</span>
            </button>
          </div>

          {/* Quick Refresh Prompt Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#35E7FF]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#35E7FF] animate-ping" />
              <span className="hidden sm:inline">ORCHESTRATING BUILD</span>
            </div>
          )}
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeCenterTab === 'code' && (
            currentProject ? (
              <CodeStudio
                files={currentProject.files}
                onUpdateFile={onUpdateFile}
                issues={currentProject.securityReport?.issues}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500">
                <Code2 className="w-12 h-12 text-gray-700 mb-3" />
                <h3 className="text-base font-bold text-gray-300">No Active Extension Build</h3>
                <p className="text-xs text-gray-500 max-w-sm mt-1">
                  Submit a prompt above or pick a production template to synthesize an extension.
                </p>
              </div>
            )
          )}

          {activeCenterTab === 'timeline' && (
            currentProject ? (
              <BuildTimeline
                steps={currentProject.steps}
                logs={currentProject.logs}
              />
            ) : (
              <div className="text-center p-8 text-xs text-gray-500">
                Build timeline will appear when an extension generation job begins.
              </div>
            )
          )}

          {activeCenterTab === 'security' && (
            <SecurityView
              security={currentProject?.securityReport}
              validation={currentProject?.validationReport}
            />
          )}

          {activeCenterTab === 'prompt' && (
            <div className="space-y-4 max-w-3xl mx-auto text-left">
              {/* Specification Card */}
              <div className="p-5 rounded-xl bg-[#0F0F1A] border border-white/[0.08]">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#A855F7]" />
                  <span>Extension Specification</span>
                </h3>
                {currentProject?.specification ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-gray-400 block font-mono text-[10px]">NAME & VERSION</span>
                      <span className="text-white font-bold">{currentProject.specification.name} (v{currentProject.specification.version})</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-mono text-[10px]">DESCRIPTION</span>
                      <span className="text-[#9292A6]">{currentProject.specification.description}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-mono text-[10px]">TARGET WEBSITES</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {currentProject.specification.targetSites.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded bg-blue-950/50 text-[#35E7FF] font-mono text-[10px] border border-blue-500/30">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-mono text-[10px]">FEATURES</span>
                      <ul className="list-disc list-inside text-gray-300 space-y-1 mt-1">
                        {currentProject.specification.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-mono text-[10px]">TECHNICAL LIMITATIONS</span>
                      <ul className="list-disc list-inside text-amber-300/80 space-y-1 mt-1">
                        {currentProject.specification.limitations.map((l, i) => (
                          <li key={i}>{l}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Run an extension build to see structured specs.</p>
                )}
              </div>

              {/* Natural Language Refinement Input */}
              <form onSubmit={handlePromptSubmit} className="p-4 rounded-xl bg-[#0F0F1A] border border-white/[0.08]">
                <label className="text-xs font-bold text-white mb-2 block">
                  Refine Extension Prompt
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Provide additional instructions or modifications..."
                    className="flex-1 px-3 py-2 rounded-lg bg-[#141422] border border-white/10 text-xs text-white placeholder-gray-600 outline-none focus:border-[#A855F7]"
                  />
                  <button
                    type="submit"
                    disabled={!promptInput.trim() || isLoading}
                    className="px-4 py-2 rounded-lg bg-[#A855F7] text-white text-xs font-bold hover:bg-[#9333EA] transition-all disabled:opacity-50"
                  >
                    Execute
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* ======================================================== */}
      {/* 3. RIGHT PANEL: Command Center & Telemetry               */}
      {/* ======================================================== */}
      <aside className="w-full lg:w-72 xl:w-80 bg-[#0B0B13] border-t lg:border-t-0 lg:border-l border-white/[0.06] p-4 flex flex-col justify-between shrink-0 text-left">
        <div className="space-y-4">
          {/* Header Title */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <span className="text-xs font-mono font-bold text-white tracking-wider">
              EXTENSION TELEMETRY
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              MV3 COMPLIANT
            </span>
          </div>

          {currentProject ? (
            <div className="space-y-3.5">
              {/* Extension Identity */}
              <div className="p-3 rounded-lg bg-[#11111C] border border-white/[0.04]">
                <span className="text-[9px] font-mono text-[#9292A6] block mb-0.5">PROJECT TITLE</span>
                <h4 className="text-xs font-bold text-white leading-tight mb-1">{currentProject.name}</h4>
                <p className="text-[11px] text-[#9292A6] line-clamp-2 leading-relaxed">
                  {currentProject.description}
                </p>
              </div>

              {/* Target Sites & Permissions */}
              <div className="p-3 rounded-lg bg-[#11111C] border border-white/[0.04] space-y-2.5">
                <div>
                  <span className="text-[9px] font-mono text-[#9292A6] block mb-1">TARGET WEBSITES</span>
                  <div className="flex flex-wrap gap-1">
                    {currentProject.specification?.targetSites.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-[#35E7FF]/10 text-[#35E7FF] font-mono text-[10px] border border-[#35E7FF]/20 truncate max-w-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-mono text-[#9292A6] block mb-1">PERMISSIONS DECLARED</span>
                  <div className="flex flex-wrap gap-1">
                    {currentProject.specification?.permissions.map(p => (
                      <span key={p} className="px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 font-mono text-[9px] border border-purple-500/30">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Security Score Meter */}
              <div className="p-3 rounded-lg bg-[#11111C] border border-white/[0.04] flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-[#9292A6] block">SECURITY AUDIT</span>
                  <span className="text-xs font-bold text-white">
                    {currentProject.securityReport?.passed ? 'VERIFIED PASS' : 'WARNINGS FOUND'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black font-mono text-emerald-400">
                    {currentProject.securityReport?.score || 100}
                    <span className="text-[10px] text-gray-500">/100</span>
                  </span>
                </div>
              </div>

              {/* Build Status Indicator */}
              <div className="p-3 rounded-lg bg-[#11111C] border border-white/[0.04] flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-400">STATUS:</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  currentProject.status === 'validated' || currentProject.status === 'repaired'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                }`}>
                  {currentProject.status}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-lg bg-[#11111C] text-center text-xs text-gray-500">
              No project currently active. Select a template or submit a prompt.
            </div>
          )}
        </div>

        {/* Primary Download and Installation CTAs */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
          <button
            onClick={handleDownloadZip}
            disabled={!currentProject || isPackaging}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold tracking-wider text-white bg-gradient-to-r from-[#FF3158] to-[#D91B40] hover:brightness-110 shadow-[0_0_20px_rgba(255,49,88,0.35)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isPackaging ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>PACKAGING ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>DOWNLOAD EXTENSION .ZIP</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenGuide}
            className="w-full py-2 px-3 rounded-lg bg-[#141422] hover:bg-[#1A1A2E] border border-white/10 hover:border-[#35E7FF]/40 text-xs text-[#9292A6] hover:text-[#35E7FF] transition-all flex items-center justify-center gap-1.5 font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#35E7FF]" />
            <span>How to Install in Chrome</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
