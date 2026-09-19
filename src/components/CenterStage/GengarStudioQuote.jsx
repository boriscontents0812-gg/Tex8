import React, { useState } from 'react';

export default function GengarStudioQuote({ theme = 'light' }) {
  const isDark = theme === 'dark';
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    try {
      const audio = new Audio('/audio/pop.wav');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  return (
    <div className="mb-4 text-center select-none flex flex-col items-center transition-colors duration-300">
      {/* Eyebrow Pill Badge */}
      <div className={`inline-flex items-center gap-2 px-3.5 py-1 mb-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
        isDark
          ? 'bg-white/10 border border-white/15 text-gray-200 shadow-md'
          : 'bg-white/80 border border-white/90 text-[#456176] shadow-[0_1.67px_4.18px_rgba(181,186,203,0.25),inset_0px_7px_20px_rgba(255,255,255,0.8)]'
      }`}>
        <span className="w-2 h-2 rounded-full bg-[#38CB00] shadow-[0_0_8px_#38CB00] animate-pulse" />
        <span className="text-[10px] sm:text-[10.5px] font-bold tracking-wider uppercase">
          VIRAL TEXT-TO-VIDEO STUDIO • 60FPS
        </span>
      </div>

      {/* Hero Quote with Gengar Pop-up Badge */}
      <h2 className={`text-xl sm:text-2xl md:text-[26px] font-extrabold tracking-tight leading-snug flex flex-wrap items-center justify-center gap-x-2 gap-y-1 max-w-[560px] transition-colors duration-300 ${
        isDark ? 'text-white' : 'text-[#304F67]'
      }`}>
        <span>The</span>

        {/* Gengar Illustration Pop-Up Badge (like Kree8 lizard) */}
        <span
          className="relative inline-flex items-center justify-center group mx-0.5 align-middle"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            type="button"
            onClick={handleClick}
            className="gengar-badge-btn overflow-hidden focus:outline-none"
            title="Gengar is listening to your dialogue! Click to pop."
          >
            <img
              src="/assets/gengar_badge.png"
              alt="Gengar listening to music"
              className="w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-300 group-hover:scale-110"
              style={{ imageRendering: 'pixelated' }}
            />
          </button>

          {/* Floating Music Notes when hovered */}
          {isHovered && (
            <>
              <span className="absolute -top-3 -right-2 text-sm gengar-note-1 pointer-events-none select-none">
                🎵
              </span>
              <span className="absolute -top-4 -left-2 text-xs gengar-note-2 pointer-events-none select-none">
                🎶
              </span>
            </>
          )}

          {/* Pop-up Speech Bubble Tooltip */}
          <span
            className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-[#304F67] shadow-lg border border-purple-400/40 whitespace-nowrap pointer-events-none transition-all duration-200 z-30 ${
              isHovered
                ? 'opacity-100 scale-100 -translate-y-1'
                : 'opacity-0 scale-90 pointer-events-none'
            }`}
          >
            🎧 Vibing to voiceovers!
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#304F67] rotate-45 border-r border-b border-purple-400/40" />
          </span>
        </span>

        <span>studio</span>
        <span className={`font-semibold ${isDark ? 'text-gray-400' : 'text-[#64748B]'}`}>for creators</span>

        <span className={`w-full block text-sm sm:text-base md:text-lg font-normal mt-0.5 ${
          isDark ? 'text-gray-400' : 'text-[#64748B]'
        }`}>
          who simply <span className={`font-extrabold ${isDark ? 'text-white' : 'text-[#304F67]'}`}>can't afford to be average</span>
        </span>
      </h2>
    </div>
  );
}
