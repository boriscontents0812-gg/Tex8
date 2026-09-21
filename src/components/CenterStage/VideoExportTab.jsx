import React, { useState } from 'react';
import { Download, Copy, Check, Film, ExternalLink, Sparkles } from 'lucide-react';

export default function VideoExportTab({ videoResult, onDownload }) {
  const [copied, setCopied] = useState(false);

  if (!videoResult || !videoResult.videoUrl) {
    return (
      <div className="w-full max-w-[420px] aspect-[9/16] mx-auto bg-white/80 dark:bg-slate-900/80 border border-white/80 dark:border-white/10 rounded-[32px] flex flex-col items-center justify-center p-6 text-center text-[#456176] dark:text-slate-400 space-y-4 shadow-[0px_2px_8px_rgba(0,0,0,0.04),0px_16px_36px_rgba(181,186,203,0.25)] dark:shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-[#E5E9EE] dark:bg-slate-800 flex items-center justify-center text-[#304F67] dark:text-sky-400 shadow-inner">
          <Film className="w-8 h-8 animate-pulse text-[#304F67] dark:text-sky-400" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-[#304F67] dark:text-white">Video Export Pending</h4>
          <p className="text-xs text-[#456176] dark:text-slate-400 max-w-[260px] leading-relaxed">
            Generate voice tracks first, then click <b className="text-[#304F67] dark:text-white font-semibold">Generate Video →</b> in the sidebar to create your MP4 reel.
          </p>
        </div>
      </div>
    );
  }

  const fullShareUrl = window.location.origin + videoResult.downloadUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
      {/* Top Status & Specs Badge */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/85 dark:bg-slate-800/80 backdrop-blur-md rounded-full border border-white/80 dark:border-white/10 shadow-sm text-[11px]">
        <div className="flex items-center gap-2 font-medium text-[#304F67] dark:text-slate-200">
          <span className="w-2 h-2 rounded-full bg-[#38CB00] shadow-[0_0_8px_#38CB00] animate-pulse" />
          <span>Render Complete</span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-500 dark:text-slate-400 font-mono text-[10px]">
          <span>1080×1920</span>
          <span>•</span>
          <span>60 FPS</span>
        </div>
      </div>

      {/* Video Player Frame */}
      <div className="w-full aspect-[9/16] bg-black rounded-[30px] overflow-hidden shadow-2xl border-[3px] border-neutral-900/90 flex items-center justify-center relative group">
        <video
          src={videoResult.videoUrl}
          controls
          autoPlay
          playsInline
          className="w-full h-full object-contain"
        />
      </div>

      {/* Primary Download Button */}
      <button
        type="button"
        onClick={() => onDownload(videoResult.videoUrl, videoResult.filename)}
        className="kree8-btn-primary w-full py-3.5 px-5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
      >
        <Download className="w-4 h-4" />
        <span>Download MP4 Reel</span>
        <span className="text-sm font-light">↓</span>
      </button>

      {/* Inset Link Copy Pill */}
      <div className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-md border border-white/80 dark:border-white/10 rounded-full p-1 pl-4 flex items-center justify-between gap-2 shadow-[0px_2px_8px_rgba(0,0,0,0.04),inset_0px_1px_1px_rgba(255,255,255,0.8)]">
        <span className="text-[11px] font-mono text-[#456176] dark:text-slate-300 truncate select-all">
          {fullShareUrl}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <a
            href={videoResult.videoUrl}
            target="_blank"
            rel="noreferrer"
            title="Open Video in New Tab"
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-slate-700 text-neutral-500 dark:text-slate-400 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 kree8-pill-active text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#304F67] dark:text-sky-300" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
