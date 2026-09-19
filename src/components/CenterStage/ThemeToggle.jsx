import React from 'react';
import SunMoonToggle from '../ui/SunMoonToggle';

export default function ThemeToggle({ platform = 'ios', theme = 'light', onThemeChange }) {
  const isIOS = platform === 'ios';
  const label = isIOS ? 'iOS Studio' : 'WhatsApp Studio';
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center justify-between backdrop-blur-md rounded-full px-4 py-2 mb-3.5 border transition-all duration-300 ${
      isDark
        ? 'bg-[#151c2c]/90 border-white/10 shadow-[0px_4px_16px_rgba(0,0,0,0.5),inset_0px_1px_1px_rgba(255,255,255,0.1)]'
        : 'bg-white/75 border-white/80 shadow-[0px_1.67px_4.18px_rgba(181,186,203,0.2),inset_0px_7px_32px_rgb(255,255,255)]'
    }`}>
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#38CB00] shadow-[0_0_10px_#38CB00] animate-pulse" />
        <span className={`text-xs font-semibold tracking-tight transition-colors ${
          isDark ? 'text-white' : 'text-[#304F67]'
        }`}>
          {label}
        </span>
      </div>

      {/* Sun & Moon Toggle with spring animation and no text names */}
      <SunMoonToggle theme={theme} onChange={onThemeChange} />
    </div>
  );
}



