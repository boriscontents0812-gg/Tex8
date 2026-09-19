import React, { useState } from 'react';
import { Download, Copy, Check, Film, Sparkles, PlayCircle, Award } from 'lucide-react';
import Lanyard from '../ui/Lanyard';

export default function VideoExportTab({ videoResult, onDownload }) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('video'); // 'video' | 'lanyard'

  if (!videoResult || !videoResult.videoUrl) {
    return (
      <div className="w-full max-w-[440px] aspect-[9/16] mx-auto bg-white/70 border border-white/80 rounded-[32px] flex flex-col items-center justify-center p-6 text-center text-[#456176] space-y-4 shadow-[0px_1.67px_4.18px_rgba(181,186,203,0.31),inset_0px_7px_32px_rgb(255,255,255)]">
        <div className="w-16 h-16 rounded-full bg-[#E5E9EE] flex items-center justify-center text-[#304F67] shadow-inner">
          <Film className="w-8 h-8 animate-pulse text-[#304F67]" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#304F67]">Video Export Pending</h4>
          <p className="text-xs text-[#456176] max-w-[260px] leading-relaxed">
            Generate voice tracks first, then click <b className="text-[#304F67]">Generate Video →</b> in the sidebar to unlock this section.
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
    <div className="w-full max-w-[440px] mx-auto space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
      {/* Kree8 View Switcher: Video Player vs Interactive 3D Lanyard Pass */}
      <div className="flex items-center justify-center gap-1.5 p-1 rounded-full bg-[#E5E9EE]/90 border border-white/70 shadow-[inset_0_1px_3px_rgba(181,186,203,0.25)]">
        <button
          type="button"
          onClick={() => setViewMode('video')}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer select-none ${
            viewMode === 'video'
              ? 'kree8-pill-active'
              : 'kree8-pill-inactive'
          }`}
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Video Player</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('lanyard')}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer select-none ${
            viewMode === 'lanyard'
              ? 'kree8-pill-active'
              : 'kree8-pill-inactive'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-[#38CB00]" />
          <span>3D Lanyard Card</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#38CB00] shadow-[0_0_6px_#38CB00] animate-pulse" />
        </button>
      </div>

      {viewMode === 'video' ? (
        /* Video Player View */
        <div className="space-y-3">
          <div className="w-full aspect-[9/16] bg-black rounded-[30px] overflow-hidden shadow-2xl border-[3px] border-neutral-900 flex items-center justify-center relative">
            <video
              src={videoResult.videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          </div>

          {/* Kree8 Studio Download Button */}
          <button
            onClick={() => onDownload(videoResult.videoUrl, videoResult.filename)}
            className="kree8-btn-primary w-full py-3.5 px-5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Download MP4 Reel</span>
            <span className="text-sm font-light">↓</span>
          </button>

          {/* Kree8 Inset Link Copy Pill */}
          <div className="bg-white/90 backdrop-blur-md border border-white/80 rounded-full p-1 pl-4 flex items-center justify-between gap-2 shadow-[0px_1.67px_4.18px_rgba(181,186,203,0.25),inset_0px_7px_32px_rgb(255,255,255)]">
            <span className="text-[11px] font-mono text-[#456176] truncate select-all">
              {fullShareUrl}
            </span>
            <button
              onClick={handleCopy}
              className="px-4 py-1.5 kree8-pill-active text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#304F67]" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* React Bits Interactive 3D Lanyard Card View */
        <div className="w-full aspect-[9/16] max-h-[580px] bg-gradient-to-b from-[#e2e7ec] to-[#d3dbe3] rounded-[32px] overflow-hidden border border-white/80 shadow-2xl relative flex flex-col items-center justify-between p-3 select-none">
          {/* Top Instruction Pill */}
          <div className="z-10 bg-white/80 backdrop-blur-md rounded-full px-3.5 py-1 border border-white/80 shadow-sm flex items-center gap-2 text-[11px] font-semibold text-[#304F67]">
            <Sparkles className="w-3.5 h-3.5 text-[#38CB00]" />
            <span>Interactive 3D • Click & Drag Card</span>
          </div>

          {/* 3D Canvas */}
          <div className="absolute inset-0 w-full h-full">
            <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
          </div>

          {/* Bottom Card Footer */}
          <div className="z-10 w-full bg-white/75 backdrop-blur-md rounded-2xl p-2.5 border border-white/70 shadow-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38CB00] shadow-[0_0_8px_#38CB00]" />
              <span className="font-semibold text-[#304F67]">React Bits Lanyard</span>
            </div>
            <button
              onClick={() => onDownload(videoResult.videoUrl, videoResult.filename)}
              className="kree8-btn-primary px-3 py-1 text-[11px] font-medium cursor-pointer"
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

