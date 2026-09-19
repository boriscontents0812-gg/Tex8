import React from 'react';
import { Smartphone, Volume2, Video } from 'lucide-react';

export default function TabNavigation({ activeTab = 'preview', onTabChange, showVideoTab = false }) {
  const tabs = [
    { id: 'preview', label: 'Preview', icon: Smartphone },
    { id: 'audio', label: 'Audio', icon: Volume2 },
  ];

  if (showVideoTab) {
    tabs.push({ id: 'video', label: 'Video', icon: Video, isNew: true });
  }

  return (
    <div className="flex items-center justify-center pb-3.5 mb-3 border-b border-[#D6DCE1]/60">
      <div className="inline-flex items-center p-1 rounded-full bg-[#E5E9EE]/90 border border-white/70 shadow-[inset_0_1px_4px_rgba(181,186,203,0.25)] gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer select-none ${
                isActive
                  ? 'kree8-pill-active'
                  : 'kree8-pill-inactive'
              } ${tab.isNew ? 'animate-in zoom-in-95 duration-200' : ''}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.isNew && (
                <span className="w-2 h-2 rounded-full bg-[#38CB00] shadow-[0_0_8px_#38CB00] animate-pulse" title="Video Ready!" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

