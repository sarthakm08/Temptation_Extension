'use client';

import React from 'react';
import { SecurityAuditReport, ValidationReport } from '@/types/extension';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, Lock, Globe, FileCheck } from 'lucide-react';

interface SecurityViewProps {
  security?: SecurityAuditReport;
  validation?: ValidationReport;
}

export const SecurityView: React.FC<SecurityViewProps> = ({
  security,
  validation
}) => {
  if (!security) {
    return (
      <div className="p-8 text-center text-xs text-[#9292A6]">
        No security audit data recorded for this build.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top Score Banner */}
      <div className="p-5 rounded-2xl bg-[#0F0F1A] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl border ${
            security.score >= 80
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40 shadow-[0_0_20px_rgba(52,211,153,0.2)]'
              : security.score >= 60
              ? 'bg-amber-950/40 text-amber-400 border-amber-500/40'
              : 'bg-red-950/40 text-[#FF3158] border-red-500/40 shadow-[0_0_20px_rgba(255,49,88,0.2)]'
          }`}>
            {security.passed ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Security & Manifest V3 Audit</h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                security.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {security.passed ? 'VERIFIED SECURE' : 'ADVISORIES DETECTED'}
              </span>
            </div>
            <p className="text-xs text-[#9292A6] mt-0.5">
              Automated scan against Chrome Web Store policies, CSP injection vulnerabilities, and privilege boundaries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">INTEGRITY SCORE</span>
            <span className="text-3xl font-black font-mono text-white">
              {security.score}<span className="text-base text-gray-500">/100</span>
            </span>
          </div>
        </div>
      </div>

      {/* Security Issues / Warnings */}
      {security.issues.length > 0 ? (
        <div className="p-4 rounded-xl bg-[#140F18] border border-red-500/20 space-y-3">
          <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>DETECTED ISSUES & ADVISORIES ({security.issues.length})</span>
          </span>

          <div className="space-y-2">
            {security.issues.map((issue, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-black/40 border border-red-500/20 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                    issue.severity === 'critical' ? 'bg-red-900 text-white' :
                    issue.severity === 'high' ? 'bg-orange-950 text-orange-400' :
                    'bg-yellow-950 text-yellow-400'
                  }`}>
                    {issue.severity}
                  </span>
                  {issue.file && (
                    <span className="text-[10px] font-mono text-gray-400">{issue.file}</span>
                  )}
                </div>
                <p className="text-white font-medium mb-1">{issue.message}</p>
                <p className="text-[11px] text-gray-400">💡 {issue.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Zero security vulnerabilities detected. Extension satisfies Manifest V3 strict CSP and isolation models.</span>
        </div>
      )}

      {/* Permissions Audit Table */}
      <div className="p-4 rounded-xl bg-[#0F0F1A] border border-white/[0.08]">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold text-white uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-[#A855F7]" />
          <span>PERMISSIONS AUDIT & JUSTIFICATIONS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.06] text-[10px] text-gray-400">
                <th className="pb-2">PERMISSION</th>
                <th className="pb-2">RISK RATING</th>
                <th className="pb-2">STORE JUSTIFICATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {security.permissionsAudit.map((p, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01]">
                  <td className="py-2 text-[#35E7FF] font-bold">{p.permission}</td>
                  <td className="py-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                      p.riskLevel === 'safe' ? 'bg-emerald-950/80 text-emerald-400' :
                      p.riskLevel === 'moderate' ? 'bg-blue-950/80 text-blue-400' :
                      'bg-orange-950/80 text-orange-400'
                    }`}>
                      {p.riskLevel}
                    </span>
                  </td>
                  <td className="py-2 text-gray-400 text-[11px] font-sans">{p.justification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Host Permissions Table */}
      <div className="p-4 rounded-xl bg-[#0F0F1A] border border-white/[0.08]">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold text-white uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5 text-[#35E7FF]" />
          <span>HOST PERMISSIONS & MATCH PATTERNS</span>
        </div>

        <div className="space-y-2">
          {security.hostPermissionsAudit.map((h, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-[#141422] border border-white/[0.04] flex items-center justify-between text-xs">
              <span className="font-mono text-[#35E7FF]">{h.pattern}</span>
              <span className="text-[11px] text-gray-400">{h.notes}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Checks */}
      {validation && (
        <div className="p-4 rounded-xl bg-[#0F0F1A] border border-white/[0.08]">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold text-white uppercase tracking-wider">
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>MANIFEST V3 INTEGRITY CHECKS ({validation.checks.length})</span>
          </div>

          <div className="space-y-1.5">
            {validation.checks.map((chk) => (
              <div key={chk.id} className="p-2.5 rounded-lg bg-[#12121E] flex items-center justify-between text-xs">
                <span className="text-white font-medium">{chk.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                  chk.status === 'passed' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                }`}>
                  {chk.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
