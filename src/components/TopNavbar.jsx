import React from 'react';
import { HelpCircle, LogOut } from 'lucide-react';
import SunMoonToggle from './ui/SunMoonToggle';

export default function TopNavbar({ credits = 207, theme = 'light', onThemeChange }) {
  const isDark = theme === 'dark';

  return (
    <header className={`h-16 border-b flex items-center justify-between px-6 sm:px-8 text-sm select-none z-30 sticky top-0 transition-all duration-400 ${
      isDark
        ? 'bg-[#0b101b]/85 backdrop-blur-xl border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)] text-white'
        : 'bg-white/75 backdrop-blur-xl border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-neutral-900'
    }`}>
      {/* Left: Tex8 Brand & Animated Msg Icon */}
      <div className="flex items-center gap-3">
        <div className="tex8-logo-wrap flex items-center gap-2.5 group py-1" title="Tex8 - Message Video Generator">
          {/* Animated Message Icon (like Kree8 icon effect) */}
          <div className="relative flex items-center justify-center">
            <svg
              viewBox="0 0 28 28"
              fill="currentColor"
              className="w-7 h-7 tex8-msg-icon-svg"
            >
              {/* Apple iMessage / SMS Bubble with authentic tail */}
              <path d="M14 2C7.37 2 2 6.81 2 12.75c0 3.32 1.7 6.27 4.38 8.23-.33 1.94-1.34 3.97-2.73 4.96-.28.2-.19.65.17.65 3.33-.06 6.13-1.63 7.64-2.61.82.16 1.66.25 2.54.25 6.63 0 12-4.81 12-10.73C26 6.81 20.63 2 14 2z" />
              {/* Three chat dots */}
              <circle cx="9.5" cy="12.75" r="1.4" fill="white" className="group-hover:fill-[#1c1c1e] transition-colors" />
              <circle cx="14" cy="12.75" r="1.4" fill="white" className="group-hover:fill-[#1c1c1e] transition-colors" />
              <circle cx="18.5" cy="12.75" r="1.4" fill="white" className="group-hover:fill-[#1c1c1e] transition-colors" />
            </svg>
          </div>

          {/* Tex8 Title with Kree8 Iridescent Shimmer */}
          <div className="flex items-baseline gap-2">
            <span className={`tex8-logo-text text-[26px] font-black tracking-tight leading-none ${isDark ? '!text-white' : ''}`}>
              Tex8
            </span>
            <span className={`text-xs hidden sm:inline-block border-l pl-2.5 font-medium ${
              isDark ? 'text-gray-400 border-neutral-700' : 'text-[#64748B] border-neutral-300/80'
            }`}>
              Message Video Generator
            </span>
          </div>
        </div>
      </div>

      {/* Right: Theme Toggle, Pro/MAX Badges, Credits, & Pill Buttons */}
      <div className="flex items-center gap-3">
        {/* Sun & Moon Theme Toggle (no text, spring animation) */}
        {onThemeChange && (
          <SunMoonToggle theme={theme} onChange={onThemeChange} />
        )}

        {/* Pro & MAX pill badges */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm transition-colors ${
          isDark
            ? 'bg-[#151c2c] border-white/10 text-white'
            : 'bg-white/90 border-neutral-200/80 text-neutral-800'
        }`}>
          <span className="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-semibold px-2 py-0.5 rounded-md text-[11px] leading-tight">
            Pro
          </span>
          <span className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold italic px-2 py-0.5 rounded-md text-[11px] leading-tight">
            MAX
          </span>
          <span className={`font-semibold text-xs pl-1 ${isDark ? 'text-gray-200' : 'text-neutral-800'}`}>
            {credits} credits
          </span>
        </div>

        {/* Help button */}
        <button 
          onClick={() => alert('Tex8 Message Video Generator Support\n\nFor help, check the "How to use" guide or visit Tex8 documentation.')}
          className={`px-4 py-1.5 text-xs flex items-center gap-1.5 rounded-full border transition-all ${
            isDark
              ? 'bg-[#151c2c] text-neutral-300 border-white/10 hover:bg-[#1e273d] hover:text-white'
              : 'anything-pill-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
          <span>Help</span>
        </button>

        <button 
          onClick={() => { if (confirm('Are you sure you want to sign out?')) window.location.reload(); }}
          className={`px-3.5 py-1.5 text-xs flex items-center gap-1 rounded-full border transition-all ${
            isDark
              ? 'bg-[#151c2c] text-neutral-400 border-white/10 hover:text-rose-400 hover:border-rose-900/40 hover:bg-[#201826]'
              : 'anything-pill-white text-neutral-600 hover:text-rose-600 hover:border-rose-200'
          }`}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </div>
    </header>
  );
}



