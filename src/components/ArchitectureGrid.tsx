'use client';

import React, { useState } from 'react';
import { Monitor, Brain, Shield, FlaskConical, FileCode2, ArrowDown, CheckCircle2, ChevronRight, Terminal } from 'lucide-react';

export const ArchitectureGrid: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>('orchestrator');

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11111B] border border-[#A855F7]/30 text-xs font-mono text-[#A855F7] mb-3">
          <Terminal className="w-3.5 h-3.5 text-[#35E7FF]" />
          <span>SYSTEM TOPOLOGY // MULTI-AGENT PIPELINE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Autonomous Extension Architecture
        </h2>
        <p className="text-xs sm:text-sm text-[#9292A6] mt-2 max-w-xl mx-auto">
          Every request traverses our deterministic 7-stage agent pipeline before producing an installable Manifest V3 package.
        </p>
      </div>

      {/* Visual Pipeline Stack matching User's Architecture Image */}
      <div className="flex flex-col items-center gap-4 max-w-3xl mx-auto">
        {/* Layer 1: Dark Temptation Workspace */}
        <div 
          onClick={() => setSelectedLayer('workspace')}
          className={`w-full p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
            selectedLayer === 'workspace'
              ? 'bg-[#161626] border-[#A855F7] shadow-[0_0_25px_rgba(168,85,247,0.3)]'
              : 'bg-[#11111B]/80 hover:bg-[#141422] border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/30">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Dark Temptation Workspace</h3>
                <p className="text-xs text-[#9292A6]">Next.js · TypeScript · Neon glass UI · Three-panel command console</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#A855F7]/20 text-[#A855F7]">
              LAYER 01
            </span>
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex items-center justify-center text-[#A855F7]/60">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Layer 2: Agent Orchestrator */}
        <div 
          onClick={() => setSelectedLayer('orchestrator')}
          className={`w-full p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
            selectedLayer === 'orchestrator'
              ? 'bg-[#161626] border-[#A855F7] shadow-[0_0_25px_rgba(168,85,247,0.3)]'
              : 'bg-[#11111B]/80 hover:bg-[#141422] border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/30">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Agent Orchestrator</h3>
                <p className="text-xs text-[#9292A6]">Gemini API · Requirements analysis · Architecture planning · Self-repair loop</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#A855F7]/20 text-[#A855F7]">
              LAYER 02
            </span>
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex items-center justify-center text-[#A855F7]/60">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Layer 3: Parallel Security & Validation Agents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {/* Security Agent */}
          <div 
            onClick={() => setSelectedLayer('security')}
            className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
              selectedLayer === 'security'
                ? 'bg-[#161626] border-[#FF3158] shadow-[0_0_25px_rgba(255,49,88,0.3)]'
                : 'bg-[#11111B]/80 hover:bg-[#141422] border-white/10'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-[#FF3158]/10 text-[#FF3158] border border-[#FF3158]/30">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FF3158]/20 text-[#FF3158]">
                AGENT 04
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Security Agent</h3>
            <p className="text-xs text-[#9292A6]">Audit requested permissions, eliminate eval/CSP violations, scan secrets & unsafe DOM manipulation.</p>
          </div>

          {/* Validation Agent */}
          <div 
            onClick={() => setSelectedLayer('validation')}
            className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
              selectedLayer === 'validation'
                ? 'bg-[#161626] border-[#35E7FF] shadow-[0_0_25px_rgba(53,231,255,0.3)]'
                : 'bg-[#11111B]/80 hover:bg-[#141422] border-white/10'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-[#35E7FF]/10 text-[#35E7FF] border border-[#35E7FF]/30">
                <FlaskConical className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#35E7FF]/20 text-[#35E7FF]">
                AGENT 05
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Validation Agent</h3>
            <p className="text-xs text-[#9292A6]">Validate Manifest V3 JSON schema, ensure all referenced files exist, check syntax & listeners.</p>
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex items-center justify-center text-[#A855F7]/60">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Layer 4: Extension Builder */}
        <div 
          onClick={() => setSelectedLayer('builder')}
          className={`w-full p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
            selectedLayer === 'builder'
              ? 'bg-[#161626] border-[#35E7FF] shadow-[0_0_25px_rgba(53,231,255,0.3)]'
              : 'bg-[#11111B]/80 hover:bg-[#141422] border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-[#35E7FF]/10 text-[#35E7FF] border border-[#35E7FF]/30">
                <FileCode2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Extension Builder</h3>
                <p className="text-xs text-[#9292A6]">File generation · Binary icon assembly · ZIP packaging · Chrome installation guide</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#35E7FF]/20 text-[#35E7FF]">
              LAYER 04
            </span>
          </div>
        </div>
      </div>

      {/* Layer Detail Inspector */}
      <div className="mt-8 p-6 rounded-2xl bg-[#11111B] border border-[#A855F7]/20 max-w-3xl mx-auto text-left">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#A855F7]">
          <ChevronRight className="w-4 h-4" />
          <span>SPECIFICATION INSPECTOR: {selectedLayer.toUpperCase()}</span>
        </div>

        {selectedLayer === 'workspace' && (
          <div className="space-y-2 text-xs text-[#9292A6]">
            <p className="text-sm font-semibold text-white">Dark Temptation Client Architecture</p>
            <p>Constructed with Next.js App Router, Tailwind CSS, and cyber luxury dark aesthetics. Features real-time state persistence with client storage, an interactive Monaco-style code explorer, and live telemetry feeds.</p>
            <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-[11px] text-[#F5F5FA]">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#A855F7]" /> Responsive 3-Panel Layout</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#A855F7]" /> Sub-millisecond UI telemetry</div>
            </div>
          </div>
        )}

        {selectedLayer === 'orchestrator' && (
          <div className="space-y-2 text-xs text-[#9292A6]">
            <p className="text-sm font-semibold text-white">Agentic Orchestration Core</p>
            <p>Employs a deterministic 7-stage pipeline. Parses natural language, maps optimal Manifest V3 components (content scripts, service workers, popups), interfaces with Gemini 2.5 Flash, and applies self-repair routines whenever defects are identified.</p>
            <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-[11px] text-[#F5F5FA]">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#A855F7]" /> Gemini API Integration</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#A855F7]" /> Self-Repair Feedback Loop</div>
            </div>
          </div>
        )}

        {selectedLayer === 'security' && (
          <div className="space-y-2 text-xs text-[#9292A6]">
            <p className="text-sm font-semibold text-white">Strict Security Auditor</p>
            <p>Every line of code is inspected against Chrome Web Store policies. We block eval(), new Function(), inline event handlers, broad host permissions, unescaped innerHTML injections, and hardcoded API tokens.</p>
            <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-[11px] text-[#FF3158]">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#FF3158]" /> Zero eval/Function calls</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#FF3158]" /> Scoped host permissions</div>
            </div>
          </div>
        )}

        {selectedLayer === 'validation' && (
          <div className="space-y-2 text-xs text-[#9292A6]">
            <p className="text-sm font-semibold text-white">Automated Build & Manifest Validator</p>
            <p>Validates that manifest.json conforms to strict Manifest V3 specifications. Confirms that all referenced files, icons, scripts, and stylesheets physically exist, and checks for JavaScript/CSS syntax balance.</p>
            <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-[11px] text-[#35E7FF]">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#35E7FF]" /> Manifest V3 Schema Check</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#35E7FF]" /> 100% File Integrity Assurance</div>
            </div>
          </div>
        )}

        {selectedLayer === 'builder' && (
          <div className="space-y-2 text-xs text-[#9292A6]">
            <p className="text-sm font-semibold text-white">Extension Builder & Packaging Agent</p>
            <p>Packages all assets, manifests, binary icons, and documentation into a compliant .ZIP archive using JSZip. Automatically generates step-by-step developer mode installation instructions for instant loading in Google Chrome.</p>
            <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-[11px] text-[#35E7FF]">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#35E7FF]" /> Instant Client-Side ZIP Packaging</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#35E7FF]" /> Complete Installation Walkthrough</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
