'use client';

import React from 'react';
import { BuildStep, BuildLog } from '@/types/extension';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Wrench, 
  Loader2, 
  Terminal, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface BuildTimelineProps {
  steps: BuildStep[];
  logs: BuildLog[];
}

export const BuildTimeline: React.FC<BuildTimelineProps> = ({ steps, logs }) => {
  const [showLogs, setShowLogs] = React.useState(true);

  const getStepIcon = (status: BuildStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'repaired':
        return <Wrench className="w-4 h-4 text-purple-400" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-[#35E7FF] animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-[#FF3158]" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: BuildStep['status']) => {
    switch (status) {
      case 'completed':
        return <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">PASS</span>;
      case 'repaired':
        return <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">REPAIRED</span>;
      case 'running':
        return <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 text-[#35E7FF] border border-cyan-500/30 animate-pulse">RUNNING</span>;
      case 'failed':
        return <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-950/60 text-[#FF3158] border border-red-500/30">FAILED</span>;
      default:
        return <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-gray-900 text-gray-500">STANDBY</span>;
    }
  };

  return (
    <div className="space-y-4 text-left">
      {/* 7-Stage Pipeline Visualizer */}
      <div className="p-4 rounded-xl bg-[#0F0F1A] border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.05]">
          <span className="text-xs font-mono font-bold text-white tracking-wider">
            AGENTIC EXECUTION TIMELINE (7 STAGES)
          </span>
          <span className="text-[10px] font-mono text-[#35E7FF]">DETERMINISTIC PIPELINE</span>
        </div>

        <div className="space-y-2.5">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`p-3 rounded-lg border transition-all ${
                step.status === 'running'
                  ? 'bg-[#181829] border-[#35E7FF]/40 shadow-[0_0_12px_rgba(53,231,255,0.2)]'
                  : step.status === 'repaired'
                  ? 'bg-[#161224] border-purple-500/30'
                  : step.status === 'completed'
                  ? 'bg-[#12121E] border-white/[0.04]'
                  : 'bg-[#0B0B12] border-white/[0.02] opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {getStepIcon(step.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-[#A855F7]">
                        {step.number}
                      </span>
                      <h4 className="text-xs font-bold text-white">{step.title}</h4>
                      <span className="text-[10px] text-[#9292A6]">({step.agent})</span>
                    </div>
                    <p className="text-[11px] text-[#9292A6] mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                    {step.summary && (
                      <div className="mt-1.5 text-[10px] font-mono text-[#35E7FF] bg-black/40 px-2 py-1 rounded inline-block">
                        ↳ {step.summary}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  {getStatusBadge(step.status)}
                  {step.durationMs !== undefined && (
                    <span className="text-[10px] font-mono text-gray-500">
                      {step.durationMs}ms
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Build & Diagnostics Terminal */}
      <div className="rounded-xl bg-[#090910] border border-white/[0.08] overflow-hidden">
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="w-full px-4 py-2.5 bg-[#10101C] border-b border-white/[0.05] flex items-center justify-between text-xs font-mono font-bold text-white"
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#35E7FF]" />
            <span>ORCHESTRATION TERMINAL STREAM ({logs.length} EVENTS)</span>
          </div>
          {showLogs ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
        </button>

        {showLogs && (
          <div className="p-3 max-h-56 overflow-y-auto font-mono text-[11px] space-y-1.5 select-text">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 leading-tight">
                <span className="text-gray-600 shrink-0 text-[10px]">{log.timestamp}</span>
                <span className={`px-1 rounded text-[9px] font-bold shrink-0 ${
                  log.severity === 'success' ? 'bg-emerald-950 text-emerald-400' :
                  log.severity === 'warn' ? 'bg-amber-950 text-amber-400' :
                  log.severity === 'error' ? 'bg-red-950 text-red-400' :
                  'bg-blue-950 text-cyan-400'
                }`}>
                  [{log.stage.toUpperCase()}]
                </span>
                <span className={`break-all ${
                  log.severity === 'success' ? 'text-emerald-300' :
                  log.severity === 'warn' ? 'text-amber-300' :
                  log.severity === 'error' ? 'text-red-300' :
                  'text-gray-300'
                }`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
