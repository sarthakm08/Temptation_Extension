'use client';

import React, { useState } from 'react';
import { GeneratedFile, SecurityIssue } from '@/types/extension';
import { 
  FileCode2, 
  FileJson, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Save, 
  AlertTriangle, 
  ShieldAlert, 
  Eye, 
  Edit3, 
  ImageIcon 
} from 'lucide-react';

interface CodeStudioProps {
  files: GeneratedFile[];
  onUpdateFile: (path: string, newContent: string) => void;
  issues?: SecurityIssue[];
}

export const CodeStudio: React.FC<CodeStudioProps> = ({
  files,
  onUpdateFile,
  issues = []
}) => {
  const [activeFilePath, setActiveFilePath] = useState<string>(files[0]?.path || 'manifest.json');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<string>('');

  const activeFile = files.find(f => f.path === activeFilePath) || files[0];

  // Sync editedContent when activeFile changes
  React.useEffect(() => {
    if (activeFile) {
      setEditedContent(activeFile.content);
      setIsEditing(false);
    }
  }, [activeFilePath, activeFile]);

  const handleCopy = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    if (activeFile) {
      onUpdateFile(activeFile.path, editedContent);
      setIsEditing(false);
    }
  };

  const handleDownloadSingle = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.path.split('/').pop() || 'file.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (file: GeneratedFile) => {
    if (file.path.endsWith('.json')) return <FileJson className="w-3.5 h-3.5 text-amber-400" />;
    if (file.path.endsWith('.js')) return <FileCode2 className="w-3.5 h-3.5 text-yellow-400" />;
    if (file.path.endsWith('.html')) return <FileCode2 className="w-3.5 h-3.5 text-orange-400" />;
    if (file.path.endsWith('.css')) return <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />;
    if (file.path.endsWith('.png') || file.path.endsWith('.svg')) return <ImageIcon className="w-3.5 h-3.5 text-purple-400" />;
    return <FileText className="w-3.5 h-3.5 text-blue-400" />;
  };

  const fileIssues = issues.filter(i => i.file === activeFile?.path);

  return (
    <div className="flex flex-col h-[580px] rounded-xl bg-[#0D0D15] border border-white/[0.08] overflow-hidden text-left shadow-2xl">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#12121E] border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          {activeFile && getFileIcon(activeFile)}
          <span className="text-xs font-mono font-bold text-white tracking-wide">
            {activeFile?.path}
          </span>
          {activeFile?.modifiedByUser && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              EDITED
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFile?.language !== 'image' && (
            <>
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="px-2.5 py-1 rounded bg-[#A855F7] hover:bg-[#9333EA] text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                >
                  <Save className="w-3 h-3" />
                  <span>Save</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-2.5 py-1 rounded bg-white/[0.05] hover:bg-white/10 text-[#9292A6] hover:text-white text-[11px] font-medium flex items-center gap-1 transition-all"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}

              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-white/[0.05] hover:bg-white/10 text-[#9292A6] hover:text-white text-[11px] font-medium flex items-center gap-1 transition-all"
                title="Copy content"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </>
          )}

          <button
            onClick={handleDownloadSingle}
            className="px-2.5 py-1 rounded bg-white/[0.05] hover:bg-white/10 text-[#9292A6] hover:text-white text-[11px] font-medium flex items-center gap-1 transition-all"
            title="Download file"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body: File Tree + Code Editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: File Explorer Sidebar */}
        <div className="w-48 sm:w-56 bg-[#090910] border-r border-white/[0.06] flex flex-col shrink-0">
          <div className="px-3 py-2 text-[10px] font-mono text-[#9292A6] uppercase tracking-wider border-b border-white/[0.04]">
            PROJECT FILES ({files.length})
          </div>

          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
            {files.map((file) => {
              const isSelected = file.path === activeFilePath;
              const hasIssue = issues.some(i => i.file === file.path);
              return (
                <button
                  key={file.path}
                  onClick={() => setActiveFilePath(file.path)}
                  className={`w-full px-2.5 py-1.5 rounded-md text-xs font-mono text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[#A855F7]/15 text-[#F5F5FA] border border-[#A855F7]/30 font-semibold'
                      : 'text-[#9292A6] hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {getFileIcon(file)}
                    <span className="truncate">{file.path}</span>
                  </div>
                  {hasIssue && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3158] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer / Editor Area */}
        <div className="flex-1 flex flex-col bg-[#0D0D15] overflow-hidden">
          {/* File Description Header */}
          {activeFile && (
            <div className="px-4 py-1.5 bg-[#141422]/60 border-b border-white/[0.04] text-[11px] text-[#9292A6] flex items-center justify-between">
              <span>{activeFile.description}</span>
              <span className="font-mono text-[10px] uppercase text-[#35E7FF]">{activeFile.language}</span>
            </div>
          )}

          {/* Issue Alert if applicable */}
          {fileIssues.length > 0 && (
            <div className="p-2.5 bg-red-950/40 border-b border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <div className="truncate">
                <strong>Security Notice:</strong> {fileIssues[0].message}
              </div>
            </div>
          )}

          {/* Code Text Area or Binary Image Preview */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-[#E2E8F0] leading-relaxed">
            {activeFile?.language === 'image' ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <div className="p-4 rounded-xl bg-[#161626] border border-[#A855F7]/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <img
                    src={`data:image/png;base64,${activeFile.content}`}
                    alt={activeFile.path}
                    className="w-16 h-16 object-contain image-rendering-pixelated"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{activeFile.path}</span>
                  <span className="text-[11px] text-[#9292A6]">Valid Manifest V3 PNG Binary (Base64 Packaged)</span>
                </div>
              </div>
            ) : isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-full bg-transparent text-[#F5F5FA] resize-none outline-none font-mono text-xs leading-relaxed"
                spellCheck={false}
              />
            ) : (
              <pre className="m-0 select-text font-mono">
                <code>
                  {activeFile?.content.split('\n').map((line, idx) => (
                    <div key={idx} className="flex hover:bg-white/[0.02]">
                      <span className="w-8 shrink-0 select-none text-[#505068] text-right pr-3 font-mono">
                        {idx + 1}
                      </span>
                      <span className="whitespace-pre-wrap break-all">{line}</span>
                    </div>
                  ))}
                </code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
