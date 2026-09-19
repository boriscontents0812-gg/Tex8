import React, { useState, useEffect, useRef } from 'react';
import { Activity, ChevronDown, ChevronUp } from 'lucide-react';
import LatticeLoader from '../ui/LatticeLoader';

export default function StatusConsole({
  logs = [],
  currentStatus = 'Idle - waiting for your next action.',
  isGeneratingAudio = false,
  isGeneratingVideo = false,
  isRegeneratingLine = false
}) {
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current && showHistory) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, showHistory]);

  // Determine dynamic state for LatticeLoader from state & logs
  const lastLog = logs.length > 0 ? logs[logs.length - 1] : currentStatus;

  let latticeStatus = 'done';
  let label = 'Processing';
  let doneLabel = 'Engine standby';
  let errorLabel = 'Process failed';
  let pattern = 'orbit';

  if (isGeneratingAudio || lastLog.includes('Generating audio') || lastLog.includes('Synthesizing')) {
    latticeStatus = 'working';
    label = 'Synthesizing Voice';
    pattern = 'orbit';
  } else if (isRegeneratingLine || lastLog.includes('Regenerating')) {
    latticeStatus = 'working';
    label = 'Regenerating Line';
    pattern = 'snake';
  } else if (isGeneratingVideo || lastLog.includes('Building video') || lastLog.includes('Rendering frames') || lastLog.includes('Encoding')) {
    latticeStatus = 'working';
    label = lastLog.includes('Encoding') ? 'Encoding MP4' : 'Rendering 60FPS';
    pattern = 'ripple';
  } else if (lastLog.toLowerCase().includes('error') || lastLog.toLowerCase().includes('failed')) {
    latticeStatus = 'error';
    errorLabel = 'Error occurred';
  } else if (lastLog.includes('Video ready') || lastLog.includes('Audio ready')) {
    latticeStatus = 'done';
    doneLabel = lastLog.includes('Video ready') ? 'Video ready' : 'Audio ready';
  } else if (lastLog.includes('loaded') || lastLog.includes('saved')) {
    latticeStatus = 'done';
    doneLabel = 'Project synced';
  } else {
    latticeStatus = 'done';
    doneLabel = 'Engine ready';
  }

  const isWorking = latticeStatus === 'working';

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/90 p-3 shadow-[0px_1.67px_4.18px_rgba(181,186,203,0.25),inset_0px_7px_20px_rgba(255,255,255,0.7)] space-y-2 mt-auto select-none transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#304F67]" />
          <span className="text-[10.5px] font-bold text-[#456176] tracking-wider uppercase">
            STATUS & ENGINE
          </span>
        </div>

        {/* Pulsing state indicator */}
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isWorking
                ? 'bg-[#38CB00] shadow-[0_0_8px_#38CB00] animate-pulse'
                : latticeStatus === 'error'
                  ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                  : 'bg-[#38CB00]/70'
            }`}
          />
          <span className="text-[10px] font-medium text-[#64748B]">
            {isWorking ? 'Active' : 'Standby'}
          </span>
        </div>
      </div>

      {/* React Bits LatticeLoader Component */}
      <div className="py-1 px-1.5 flex items-center justify-between bg-white/70 rounded-xl border border-white/80 shadow-[inset_0_1px_3px_rgba(181,186,203,0.18)]">
        <LatticeLoader
          status={latticeStatus}
          label={label}
          doneLabel={doneLabel}
          errorLabel={errorLabel}
          pattern={pattern}
          grid={3}
          shape="round"
          cellSize={5.5}
          gap={2.5}
          fontSize={13}
          step={90}
          color="#304F67"
          doneColor="#38CB00"
          errorColor="#ef4444"
          idleOpacity={0.16}
          glow={isWorking}
          glowColor="#38CB00"
          showTimer={true}
        />

        {/* History Toggle Button */}
        {logs.length > 1 && (
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="p-1 rounded-md text-[#64748B] hover:text-[#304F67] hover:bg-white/80 transition-colors"
            title={showHistory ? 'Hide log history' : 'Show log history'}
          >
            {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Latest Log Message Line - Clean and Simple */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-50/70 border border-neutral-200/50 text-[11px] text-[#456176] font-mono truncate">
        <span className="text-[#38CB00] font-bold shrink-0">›</span>
        <span className="truncate">{lastLog}</span>
      </div>

      {/* Collapsible History Box (Only opens when user clicks toggle) */}
      {showHistory && logs.length > 1 && (
        <div
          ref={scrollRef}
          className="bg-[#0b0f19] border border-neutral-800 rounded-xl p-2.5 font-mono text-[10px] text-emerald-400 max-h-24 overflow-y-auto space-y-1 select-text shadow-inner animate-in fade-in duration-150"
        >
          {logs.map((log, i) => (
            <div key={i} className="leading-tight">
              <span className="text-emerald-500/50 mr-1.5 font-bold">›</span>
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
