import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function SunMoonToggle({ theme = 'light', onChange, className = '' }) {
  const isDark = theme === 'dark';
  const [animating, setAnimating] = useState(false);

  const handleToggle = (targetTheme) => {
    if (targetTheme === theme) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);

    // Audio click feedback
    try {
      const audio = new Audio('/audio/pop.wav');
      audio.volume = 0.25;
      audio.play().catch(() => {});
    } catch (e) {}

    if (onChange) {
      onChange(targetTheme);
    }
  };

  return (
    <div
      className={`relative inline-flex items-center w-[74px] h-[36px] rounded-full p-[3px] select-none transition-all duration-300 ${
        isDark
          ? 'bg-[#0e1422] border border-white/10 shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.6)]'
          : 'bg-[#E5E9EE]/90 border border-white/80 shadow-[inset_0_1.5px_3px_rgba(181,186,203,0.35)]'
      } ${className}`}
      role="group"
      aria-label="Theme toggle"
    >
      {/* Spring Animated Sliding Active Pill Background (like but.mp4) */}
      <div
        className={`absolute top-[3px] w-[30px] h-[30px] rounded-full transition-all duration-400 ${
          isDark
            ? 'left-[39px] bg-[#1a2335] border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.4),0_0_10px_rgba(99,102,241,0.25)]'
            : 'left-[3px] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12),inset_0_1px_2px_rgba(255,255,255,1),0_0_10px_rgba(245,158,11,0.2)]'
        } ${animating ? 'scale-90' : 'scale-100'}`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      />

      {/* Sun Button (Light Mode) */}
      <button
        type="button"
        onClick={() => handleToggle('light')}
        aria-label="Switch to light mode"
        className={`relative z-10 w-[30px] h-[30px] flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
          !isDark
            ? 'text-amber-500 scale-105'
            : 'text-neutral-500 hover:text-neutral-300 scale-90 opacity-60 hover:opacity-100'
        } active:scale-90`}
        title="Light Mode"
      >
        <Sun
          className={`w-4 h-4 transition-transform duration-500 ${
            !isDark
              ? `${animating ? 'rotate-180 scale-125' : 'rotate-0 scale-100'}`
              : '-rotate-45 scale-90'
          }`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: !isDark ? 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.5))' : 'none'
          }}
        />
      </button>

      {/* Moon Button (Dark Mode) */}
      <button
        type="button"
        onClick={() => handleToggle('dark')}
        aria-label="Switch to dark mode"
        className={`relative z-10 w-[30px] h-[30px] flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
          isDark
            ? 'text-indigo-400 scale-105'
            : 'text-neutral-400 hover:text-neutral-600 scale-90 opacity-60 hover:opacity-100'
        } active:scale-90`}
        title="Dark Mode"
      >
        <Moon
          className={`w-4 h-4 transition-transform duration-500 ${
            isDark
              ? `${animating ? '-rotate-45 scale-125' : '-rotate-12 scale-100'}`
              : 'rotate-45 scale-90'
          }`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: isDark ? 'drop-shadow(0 0 5px rgba(129, 140, 248, 0.6))' : 'none'
          }}
        />
      </button>
    </div>
  );
}
