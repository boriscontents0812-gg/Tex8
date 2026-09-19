import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RefreshCw, Volume2 } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

export default function AudioPreviewTab({
  audioClips = [],
  onRegenerateLine,
  isRegenerating = false,
  regeneratingIndex = null,
  onUpdateLineText
}) {
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const [fullProgress, setFullProgress] = useState(0);
  const [selectedClipIdx, setSelectedClipIdx] = useState(0);
  const [isPlayingLine, setIsPlayingLine] = useState(false);
  const [lineProgress, setLineProgress] = useState(0);

  const fullAudioRef = useRef(null);
  const lineAudioRef = useRef(null);

  // Safe clip index
  const safeIdx = Math.min(selectedClipIdx, Math.max(0, audioClips.length - 1));
  const currentClip = audioClips[safeIdx] || null;

  // Calculate total audio duration
  const totalDuration = audioClips.reduce((acc, c) => acc + (c.duration || 1.5), 0);

  // Play Full Audio
  const togglePlayFull = () => {
    if (isPlayingFull) {
      audioEngine.stopAll();
      setIsPlayingFull(false);
    } else {
      setIsPlayingFull(true);
      playSequence(0);
    }
  };

  const playSequence = (index) => {
    if (index >= audioClips.length) {
      setIsPlayingFull(false);
      setFullProgress(0);
      return;
    }
    const clip = audioClips[index];
    if (clip && clip.url) {
      audioEngine.playClip(clip.url, () => {
        playSequence(index + 1);
      });
    } else {
      setTimeout(() => playSequence(index + 1), 1000);
    }
  };

  // Play Single Line
  const togglePlayLine = () => {
    if (!currentClip || !currentClip.url) return;
    if (isPlayingLine) {
      audioEngine.stopAll();
      setIsPlayingLine(false);
    } else {
      setIsPlayingLine(true);
      audioEngine.playClip(currentClip.url, () => {
        setIsPlayingLine(false);
      });
    }
  };

  return (
    <div className="w-full max-w-[480px] mx-auto space-y-5 py-4">
      {/* 1. Full Audio Preview */}
      <div className="space-y-2">
        <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
          FULL AUDIO PREVIEW
        </label>
        <div className="bg-white border border-neutral-200/80 rounded-[20px] p-4 flex items-center gap-4 shadow-sm">
          <button
            onClick={togglePlayFull}
            className="w-10 h-10 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
          >
            {isPlayingFull ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <div className="flex-1 space-y-1">
            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden relative">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-150"
                style={{ width: `${isPlayingFull ? 60 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
              <span>{isPlayingFull ? '0:02' : '0:00'}</span>
              <span>0:{Math.round(totalDuration).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Line Stepper */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setSelectedClipIdx(Math.max(0, safeIdx - 1))}
          disabled={safeIdx === 0}
          className="p-1.5 rounded-full bg-white border border-neutral-200/80 text-neutral-700 hover:bg-neutral-50 disabled:opacity-30 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="font-mono text-xs font-semibold text-neutral-800 bg-white border border-neutral-200/80 px-4 py-1.5 rounded-full shadow-sm">
          {audioClips.length > 0 ? `${safeIdx + 1} / ${audioClips.length}` : '0 / 0'}
        </span>

        <button
          onClick={() => setSelectedClipIdx(Math.min(audioClips.length - 1, safeIdx + 1))}
          disabled={safeIdx >= audioClips.length - 1}
          className="p-1.5 rounded-full bg-white border border-neutral-200/80 text-neutral-700 hover:bg-neutral-50 disabled:opacity-30 transition-colors shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Single Line Inspector */}
      {currentClip ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-500 font-mono text-[11px]">
              LINEAUDIO • {currentClip.duration}s •{' '}
              <span className={currentClip.speaker === 2 ? 'text-sky-600 font-medium' : 'text-neutral-700 font-medium'}>
                {currentClip.speaker === 2 ? 'sent' : 'received'}
              </span>
            </span>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-[20px] p-3.5 flex items-center gap-3 shadow-sm">
            <button
              onClick={togglePlayLine}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center border border-neutral-200 transition-colors"
            >
              {isPlayingLine ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="flex-1 bg-neutral-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-0" />
            </div>
            <span className="text-[11px] font-mono text-neutral-500">
              0:00 / 0:{Math.round(currentClip.duration).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Editable TTS Text */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
              TTS TEXT (EDITABLE)
            </label>
            <input
              type="text"
              value={currentClip.text || ''}
              onChange={(e) => onUpdateLineText(safeIdx, e.target.value)}
              className="w-full anything-input rounded-xl p-2.5 text-xs text-neutral-900 font-medium focus:outline-none bg-white border border-neutral-200 shadow-sm"
            />
          </div>

          {/* Regenerate Line Button */}
          <button
            onClick={() => onRegenerateLine(safeIdx)}
            disabled={isRegenerating}
            className="anything-pill-black w-full py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating && regeneratingIndex === safeIdx ? 'animate-spin text-sky-400' : ''}`} />
            <span>
              {isRegenerating && regeneratingIndex === safeIdx ? 'Regenerating...' : 'Regenerate this line'}
            </span>
            <span className="text-sm font-light">→</span>
          </button>
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-neutral-500 bg-white/50 border border-dashed border-neutral-200 rounded-2xl">
          Click "Generate Audio →" in the right sidebar to create voice tracks.
        </div>
      )}
    </div>
  );
}
