import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Info } from 'lucide-react';

export default function HowToUseModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="anything-card overflow-hidden mb-4 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-neutral-800 hover:bg-black/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span className="font-serif italic text-base font-normal text-neutral-900 tracking-tight">How to use</span>
          <span className="text-[10px] text-neutral-400 font-normal font-sans">(Guide)</span>
        </div>
        <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-1 text-xs text-neutral-600 border-t border-neutral-100 space-y-3 bg-neutral-50/50">
          <div className="space-y-1">
            <span className="font-semibold text-neutral-800 text-[11px] block">1. Script Format:</span>
            <p className="text-neutral-500 text-[11px] leading-relaxed">
              Line 1: Optional Contact name (e.g. <code className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-sky-700 font-mono">Natasha 💖</code>)
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-neutral-800 text-[11px] block">2. Message Bubbles &amp; Voice Actors:</span>
            <ul className="text-neutral-500 text-[11px] space-y-1.5 list-disc pl-4">
              <li><code className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-800 font-mono">1: Natasha&gt; Hey</code> = Left / Grey bubble (Contact), Voice Actor Natasha</li>
              <li><code className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-sky-700 font-mono">2: Harry&gt; Hi</code> = Right / Blue bubble (You), Voice Actor Harry</li>
              <li><code className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-emerald-700 font-mono">1: img&gt; rizz</code> = Attached image message with tag</li>
              <li><code className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-amber-700 font-mono">2: Harry&gt; f&#123;uc&#125;k</code> = Gaussian blur censor tape over <code className="font-mono">&#123;...&#125;</code> (spoken naturally by voice actor)</li>
              <li><code className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-purple-700 font-mono">&lt;c:1&gt;</code> = 1-second pause</li>
            </ul>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-neutral-800 text-[11px] block">3. Workflow:</span>
            <p className="text-neutral-500 text-[11px] leading-relaxed">
              1. Type or edit your script & uploads.<br/>
              2. Click <b className="text-neutral-800">Generate Audio</b> to audition voice lines.<br/>
              3. Click <b className="text-neutral-800">Generate Video</b> to render a vertical 9:16 MP4 ready for TikTok / Reels / Shorts!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

