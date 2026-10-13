'use client';

import React, { useState } from 'react';
import { ExtensionProject } from '@/types/extension';
import { 
  FolderGit2, 
  Search, 
  Download, 
  Trash2, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  FileCode2, 
  Plus 
} from 'lucide-react';
import { packageExtensionToZip, triggerBlobDownload } from '@/lib/agents/packagingAgent';

interface ExtensionLibraryProps {
  projects: ExtensionProject[];
  onOpenProject: (p: ExtensionProject) => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (p: ExtensionProject) => void;
  onNewProject: () => void;
}

export const ExtensionLibrary: React.FC<ExtensionLibraryProps> = ({
  projects,
  onOpenProject,
  onDeleteProject,
  onDuplicateProject,
  onNewProject
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = projects.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.specification?.targetSites || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownload = async (p: ExtensionProject, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const blob = await packageExtensionToZip(p.files);
      const filename = `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-extension.zip`;
      triggerBlobDownload(blob, filename);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return (
    <div className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto w-full text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderGit2 className="w-5 h-5 text-[#A855F7]" />
            <h2 className="text-2xl font-black text-white">Extension Archive & Library</h2>
          </div>
          <p className="text-xs text-[#9292A6]">
            Manage your synthesized Chrome extensions, examine build logs, and export standalone packages.
          </p>
        </div>

        <button
          onClick={onNewProject}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#A855F7] to-[#9333EA] text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>NEW EXTENSION</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search extensions by title, target host, or features..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#11111B] border border-white/10 text-xs text-white placeholder-gray-600 outline-none focus:border-[#A855F7]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'validated', 'repaired', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase font-mono transition-all ${
                statusFilter === status
                  ? 'bg-[#A855F7]/20 border border-[#A855F7] text-[#A855F7]'
                  : 'bg-[#11111B] border border-white/5 text-[#9292A6] hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0D0D16] border border-white/[0.04] text-center space-y-3">
          <FileCode2 className="w-12 h-12 text-gray-700 mx-auto" />
          <h3 className="text-base font-bold text-gray-300">No Extensions Matching Query</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery ? 'Try clearing your search query or switching filters.' : 'Generate your first extension in the Workspace!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => onOpenProject(p)}
              className="p-5 rounded-xl bg-[#11111C] border border-white/[0.06] hover:border-[#A855F7]/40 hover:bg-[#141422] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                    p.status === 'validated' || p.status === 'repaired'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                  }`}>
                    {p.status}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {p.files.length} files
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#A855F7] transition-colors mb-1.5">
                  {p.name}
                </h3>
                <p className="text-xs text-[#9292A6] line-clamp-2 leading-relaxed mb-4">
                  {p.description}
                </p>

                {/* Scope chips */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {p.specification?.targetSites.slice(0, 2).map((s) => (
                    <span key={s} className="px-1.5 py-0.5 rounded bg-blue-950/40 text-[#35E7FF] font-mono text-[9px] border border-blue-500/20 truncate max-w-[200px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
                <span className="text-[10px] font-mono text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateProject(p);
                    }}
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
                    title="Duplicate project"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => handleDownload(p, e)}
                    className="p-1.5 rounded hover:bg-white/10 hover:text-[#35E7FF] transition-colors"
                    title="Download ZIP"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProject(p.id);
                    }}
                    className="p-1.5 rounded hover:bg-red-950 hover:text-red-400 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
