import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Video as VideoIcon } from 'lucide-react';

function renderCensoredBubbleText(text, isSent, isDark) {
  if (!text) return null;
  if (!text.includes('{')) return text;

  const parts = [];
  const regex = /\{([^}]+)\}/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ censored: false, text: text.substring(lastIndex, match.index) });
    }
    parts.push({ censored: true, text: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ censored: false, text: text.substring(lastIndex) });
  }

  return (
    <span>
      {parts.map((part, i) => {
        if (!part.censored) {
          return <span key={i}>{part.text}</span>;
        }
        return (
          <span
            key={i}
            className="relative inline-block mx-[1.5px] align-baseline select-none"
            title="Censored"
          >
            <span className="inline-block filter blur-[4px] font-bold px-[2px] tracking-tight">
              {part.text}
            </span>
            <span
              className={`absolute inset-0 -top-[2px] -bottom-[2px] -left-[3px] -right-[3px] rounded-[3px] pointer-events-none ${
                isSent
                  ? 'bg-white/40 border border-white/60 shadow-[0_1px_2px_rgba(0,0,0,0.15)]'
                  : isDark
                    ? 'bg-white/30 border border-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.3)]'
                    : 'bg-black/15 border border-black/25 shadow-[0_1px_2px_rgba(0,0,0,0.1)]'
              }`}
            />
          </span>
        );
      })}
    </span>
  );
}

export default function PhoneMockup({
  scriptData,
  settings,
  platform = 'ios',
  theme = 'light',
  contactPhotos = {},
  scriptImages = {}
}) {
  const [currentPage, setCurrentPage] = useState(0);

  const messagesPerPage = settings.messagesPerPage || 4;
  const lines = scriptData.lines || [];
  const totalPages = Math.max(1, Math.ceil(lines.length / messagesPerPage));

  const safePage = Math.min(currentPage, totalPages - 1);
  const startIdx = safePage * messagesPerPage;
  const currentLines = lines.slice(startIdx, startIdx + messagesPerPage);

  const isDark = theme === 'dark';
  const isSquareCorners = settings.containerCorners === 'square';
  const isGreenScreen = settings.gameplay === 'greenscreen';

  const rawContactName = scriptData.contactName || 'Natasha';
  const hasUploadedPhoto = contactPhotos[rawContactName] && !contactPhotos[rawContactName].includes('avatar-laura.svg');
  const avatarUrl = hasUploadedPhoto ? contactPhotos[rawContactName] : null;

  const letterMatch = rawContactName.match(/[a-zA-Z0-9]/);
  const avatarInitial = letterMatch ? letterMatch[0].toUpperCase() : (rawContactName.trim()[0] || 'N');
  const avatarSize = settings.avatarSize || 42;

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className="w-full max-w-[420px] aspect-[9/16] p-4 flex flex-col items-center justify-start pt-10 relative overflow-hidden shadow-2xl border-[3px] border-neutral-900/90 select-none rounded-[38px]"
        style={{ backgroundColor: isGreenScreen ? '#00FF00' : '#0f172a' }}
      >
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[26px] bg-black rounded-full z-20" />

        <div
          className={`w-[88%] overflow-hidden flex flex-col ${
            isDark ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'
          } ${isSquareCorners ? 'rounded-none' : 'rounded-2xl'} ${
            settings.containerShadow !== false ? 'shadow-[0_8px_32px_rgba(0,0,0,0.18)]' : ''
          }`}
          style={{
            transform: `scale(${(settings.containerSize || 100) / 100})`,
            transformOrigin: 'top center'
          }}
        >
          <div className={`flex flex-col items-center relative px-3 pt-2.5 pb-2 border-b ${isDark ? 'border-[#2c2c2e]' : 'border-[#e5e5ea]'}`}>
            <div className="absolute left-2.5 top-3 text-[#007aff]">
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </div>

            <div
              className="rounded-full overflow-hidden flex items-center justify-center mb-0.5"
              style={{
                width: `${avatarSize}px`,
                height: `${avatarSize}px`,
                background: 'linear-gradient(180deg, #8E8E93 0%, #636366 100%)'
              }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-semibold leading-none" style={{ fontSize: `${Math.round(avatarSize * 0.45)}px` }}>
                  {avatarInitial}
                </span>
              )}
            </div>

            <div className="flex items-center gap-0.5">
              <span className={`text-[12px] font-semibold leading-tight ${isDark ? 'text-white' : 'text-black'}`}>
                {rawContactName}
              </span>
              <span className="text-[#8e8e93] text-[11px] font-semibold">&gt;</span>
            </div>

            <div className="absolute right-2.5 top-3 text-[#007aff]">
              <VideoIcon className="w-[18px] h-[18px] stroke-[2.2]" />
            </div>
          </div>

          <div className="px-3 py-2.5 space-y-2 flex flex-col">
            {currentLines.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-400 italic">
                Type messages in the script editor...
              </div>
            ) : (
              currentLines.map((line, idx) => {
                const isSent = line.speaker === 2;
                const imgUrl = line.isImage && line.imageTag
                  ? (scriptImages[line.imageTag] || (line.imageTag.toLowerCase() === 'fbi' ? '/assets/fbi.svg' : null))
                  : null;
                const fontSize = `${((settings.bubbleScale || 110) / 100) * 12.5}px`;

                return (
                  <div key={line.id || idx} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                    {line.isImage && imgUrl ? (
                      <div
                        className="rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
                        style={{ maxWidth: `${settings.maxBubbleWidth || 75}%`, maxHeight: '130px' }}
                      >
                        <img src={imgUrl} alt={line.imageTag} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="relative" style={{ maxWidth: `${settings.maxBubbleWidth || 75}%` }}>
                        <div
                          className={`px-3 py-1.5 leading-snug break-words ${
                            isSent
                              ? 'bg-[#007aff] text-white'
                              : isDark
                                ? 'bg-[#26252a] text-white'
                                : 'bg-[#e9e9eb] text-black'
                          }`}
                          style={{
                            fontSize,
                            borderRadius: isSent ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          }}
                        >
                          {renderCensoredBubbleText(line.text, isSent, isDark)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 py-1.5 px-4 bg-white/90 border border-white/80 rounded-full text-xs shadow-[0px_1.67px_4.18px_rgba(181,186,203,0.2),inset_0px_7px_32px_rgb(255,255,255)] backdrop-blur-md">
        <button
          onClick={() => setCurrentPage(Math.max(0, safePage - 1))}
          disabled={safePage === 0}
          className="p-1 rounded-full hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[#304F67]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-mono text-[11px] font-semibold text-[#304F67]">
          {safePage + 1} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages - 1, safePage + 1))}
          disabled={safePage >= totalPages - 1}
          className="p-1 rounded-full hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[#304F67]"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
