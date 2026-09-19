import React from 'react';
import { FileText, Image as ImageIcon } from 'lucide-react';

export default function ScriptEditor({
  scriptText = '',
  onChange,
  imageCount = 0
}) {
  return (
    <div className="anything-card p-4 mb-4 space-y-3">
      {/* Header & Image Count Badge */}
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-sky-600" />
          <span>SCRIPT EDITOR</span>
        </label>
        <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
          <ImageIcon className="w-3 h-3" />
          <span>{imageCount} imgs</span>
        </span>
      </div>

      {/* Script Textarea */}
      <div className="relative">
        <textarea
          value={scriptText}
          onChange={(e) => onChange(e.target.value)}
          rows={9}
          placeholder={`Natasha 💖\n1: Natasha> Hey\n2: Harry> Hi\n1: img> rizz\n2: Harry> F{uc}k`}
          className="w-full anything-input rounded-2xl p-3.5 text-xs text-neutral-900 font-mono leading-relaxed focus:outline-none resize-y placeholder-neutral-400"
        />
      </div>

      {/* Quick Syntax Hint Bar */}
      <div className="flex items-center justify-between text-[10px] text-neutral-500 px-0.5 pt-0.5">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neutral-300" />
          <span>1:VA&gt; (Grey)</span>
          <span className="w-2 h-2 rounded-full bg-sky-500 ml-1.5" />
          <span>2:VA&gt; (Blue)</span>
        </span>
        <span className="font-mono text-neutral-600 bg-white px-2 py-0.5 rounded-md border border-neutral-200/80 shadow-xs">
          img&gt;tag • f&#123;uc&#125;k blur
        </span>
      </div>
    </div>
  );
}

