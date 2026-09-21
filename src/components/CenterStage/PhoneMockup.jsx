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
            className="relative inline-block mx-[2px] align-baseline select-none"
            title="Censored"
          >
            <span className="inline-block filter blur-[3.5px] font-semibold px-[2px] tracking-tight">
              {part.text}
            </span>
            <span
              className={`absolute inset-0 -top-[1.5px] -bottom-[1.5px] -left-[3px] -right-[3px] rounded-[3px] pointer-events-none ${
                isSent
                  ? 'bg-white/45 border border-white/70 shadow-[0_1px_2px_rgba(0,0,0,0.15)]'
                  : isDark
                    ? 'bg-white/30 border border-white/45 shadow-[0_1px_2px_rgba(0,0,0,0.3)]'
                    : 'bg-black/16 border border-black/25 shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
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
  const isSquareCorners = settings.containerCorners !== 'rounded';
  const isGreenScreen = settings.gameplay === 'greenscreen';

  const rawContactName = scriptData.contactName || 'Natasha';
  const hasUploadedPhoto = contactPhotos[rawContactName] && !contactPhotos[rawContactName].includes('avatar-laura.svg');
  const avatarUrl = hasUploadedPhoto ? contactPhotos[rawContactName] : null;

  const letterMatch = rawContactName.match(/[a-zA-Z0-9]/);
  const avatarInitial = letterMatch ? letterMatch[0].toUpperCase() : (rawContactName.trim()[0] || 'N');
  const avatarSize = settings.avatarSize || 42;

  // Header is shown on Page 1 by default, or all pages if headerPersistent is enabled
  const showHeader = safePage === 0 || settings.headerPersistent === true;

  return (
    <div className="flex flex-col items-center w-full">
      {/* 9:16 Portrait Canvas Frame */}
      <div
        className="w-full max-w-[400px] aspect-[9/16] p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl border-[3px] border-neutral-900/90 select-none rounded-[38px] transition-colors duration-300"
        style={{ backgroundColor: isGreenScreen ? '#00FF00' : (isDark ? '#080c14' : '#0f172a') }}
      >
        {/* Top Camera Notch / Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[84px] h-[22px] bg-black rounded-full z-20 shadow-md" />

        {/* Floating White Chat Container Card (Centered) */}
        <div
          className={`w-[88%] max-w-[340px] overflow-hidden flex flex-col transition-all duration-300 ${
            isDark ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'
          } ${isSquareCorners ? 'rounded-none' : 'rounded-2xl'} ${
            settings.containerShadow !== false ? 'shadow-[0_12px_36px_rgba(0,0,0,0.22)]' : ''
          }`}
          style={{
            transform: `scale(${(settings.containerSize || 100) / 100})`,
            transformOrigin: 'center center'
          }}
        >
          {/* iOS Contact Header (Only on Page 1 or persistent) */}
          {showHeader && (
            <div className={`flex flex-col items-center relative px-3 pt-2 pb-1.5 border-b ${isDark ? 'border-[#2c2c2e]' : 'border-[#e5e5ea]'}`}>
              {/* Left Chevron < */}
              <div className="absolute left-2.5 top-2.5 text-[#007aff]">
                <ChevronLeft className="w-5 h-5 stroke-[3]" />
              </div>

              {/* Avatar Circle */}
              <div
                className="rounded-full overflow-hidden flex items-center justify-center mb-0.5 shadow-sm"
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

              {/* Contact Name & Chevron */}
              <div className="flex items-center gap-0.5">
                <span className={`text-[12px] font-semibold leading-tight ${isDark ? 'text-white' : 'text-black'}`}>
                  {rawContactName}
                </span>
                <span className="text-[#8e8e93] text-[10px] font-semibold">&gt;</span>
              </div>

              {/* Right FaceTime Camera Icon */}
              <div className="absolute right-2.5 top-2.5 text-[#007aff]">
                <VideoIcon className="w-[18px] h-[18px] stroke-[2.2]" />
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="px-3.5 py-3 flex flex-col">
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
                const fontSize = `${((settings.bubbleScale || 110) / 100) * 12.8}px`;

                // iOS Cluster Rules: Does the next visible message have the same speaker?
                const hasNextSameSpeaker = idx < currentLines.length - 1 && currentLines[idx + 1].speaker === line.speaker;
                const hasTail = !hasNextSameSpeaker;
                const bubbleMarginBottom = hasNextSameSpeaker ? 'mb-1' : (idx < currentLines.length - 1 ? 'mb-2.5' : 'mb-0');

                // Bubble corner radius
                const borderRadius = isSent
                  ? (hasTail ? '17px 17px 3px 17px' : '17px')
                  : (hasTail ? '17px 17px 17px 3px' : '17px');

                return (
                  <div
                    key={line.id || idx}
                    className={`flex ${isSent ? 'justify-end' : 'justify-start'} ${bubbleMarginBottom}`}
                  >
                    {line.isImage && imgUrl ? (
                      <div
                        className="rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
                        style={{ maxWidth: `${settings.maxBubbleWidth || 75}%`, maxHeight: '130px' }}
                      >
                        <img src={imgUrl} alt={line.imageTag} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="relative" style={{ maxWidth: `${settings.maxBubbleWidth || 78}%` }}>
                        <div
                          className={`px-3 py-1.5 leading-snug break-words relative z-10 ${
                            isSent
                              ? 'bg-[#007aff] text-white font-normal'
                              : isDark
                                ? 'bg-[#26252a] text-white font-normal'
                                : 'bg-[#e9e9eb] text-black font-normal'
                          }`}
                          style={{
                            fontSize,
                            borderRadius,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif'
                          }}
                        >
                          {renderCensoredBubbleText(line.text, isSent, isDark)}
                        </div>

                        {/* Authentic iOS SVG Tail */}
                        {hasTail && isSent && (
                          <svg
                            className="absolute -bottom-0 -right-[6px] w-[13px] h-[15px] pointer-events-none fill-[#007aff] z-0"
                            viewBox="0 0 13 15"
                          >
                            <path d="M0 0 C0 6 3 12 13 15 C5 15 0 15 0 15 Z" />
                          </svg>
                        )}

                        {hasTail && !isSent && (
                          <svg
                            className={`absolute -bottom-0 -left-[6px] w-[13px] h-[15px] pointer-events-none z-0 ${
                              isDark ? 'fill-[#26252a]' : 'fill-[#e9e9eb]'
                            }`}
                            viewBox="0 0 13 15"
                          >
                            <path d="M13 0 C13 6 10 12 0 15 C8 15 13 15 13 15 Z" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Page Navigation Controls */}
      <div className="flex items-center gap-3 mt-3 py-1.5 px-4 bg-white/90 dark:bg-slate-800/90 border border-white/80 dark:border-white/10 rounded-full text-xs shadow-[0px_2px_8px_rgba(181,186,203,0.22),inset_0px_1px_1px_rgb(255,255,255)] backdrop-blur-md">
        <button
          type="button"
          onClick={() => setCurrentPage(Math.max(0, safePage - 1))}
          disabled={safePage === 0}
          className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[#304F67] dark:text-sky-300"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-mono text-[11px] font-semibold text-[#304F67] dark:text-slate-200">
          Page {safePage + 1} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setCurrentPage(Math.min(totalPages - 1, safePage + 1))}
          disabled={safePage >= totalPages - 1}
          className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[#304F67] dark:text-sky-300"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
