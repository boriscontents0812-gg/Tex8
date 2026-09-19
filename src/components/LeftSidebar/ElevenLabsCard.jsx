import React, { useState, useEffect } from 'react';
import { Sparkles, Eye, EyeOff, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, RefreshCw, Bookmark, Trash2 } from 'lucide-react';

export default function ElevenLabsCard({
  profiles = [],
  activeProfileName = 'Main account',
  onSaveProfile,
  onDeleteProfile,
  onSelectProfile,
  onApiKeyChange,
  currentApiKey = '',
  onLog = () => {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState({
    remaining: 74346,
    limit: 100000,
    used: 25654,
    percent: 74.3,
    status: 'idle'
  });

  const checkQuota = async () => {
    if (!currentApiKey) {
      onLog('ElevenLabs: No API key entered. Using built-in high-quality free voice synthesis.');
      setQuotaInfo(prev => ({ ...prev, status: 'free-mode' }));
      return;
    }

    setIsChecking(true);
    onLog('ElevenLabs: Checking API key and quota status...');
    try {
      const res = await fetch('/api/tts/elevenlabs/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: currentApiKey })
      });
      const data = await res.json();
      if (data.valid) {
        setQuotaInfo({
          remaining: data.remaining,
          limit: data.characterLimit,
          used: data.characterCount,
          percent: parseFloat(data.percent),
          status: 'valid'
        });
        onLog(`ElevenLabs verified: ${data.remaining.toLocaleString()} chars remaining (${data.percent}%)`);
      } else {
        setQuotaInfo(prev => ({ ...prev, status: 'error' }));
        onLog(`ElevenLabs check: ${data.error || 'Invalid key'}`);
      }
    } catch (e) {
      setQuotaInfo(prev => ({ ...prev, status: 'error' }));
      onLog(`ElevenLabs check error: ${e.message}`);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = () => {
    const name = newProfileName.trim() || activeProfileName;
    if (name) {
      onSaveProfile(name, currentApiKey);
      setNewProfileName('');
      onLog(`ElevenLabs profile "${name}" saved.`);
    }
  };

  return (
    <div className="anything-card overflow-hidden mb-4 transition-all duration-300">
      {/* Header / Accordion Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-semibold text-neutral-800 hover:bg-black/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-serif italic text-lg font-normal text-neutral-900 tracking-tight">
            ElevenLabs
          </span>
          <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 text-[10px] font-semibold">
            Voiceover
          </span>
        </div>
        <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-1 space-y-3.5 border-t border-neutral-100 bg-neutral-50/50 text-xs">
          {/* Active Profile */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
              ACTIVE PROFILE
            </label>
            <div className="relative">
              <select
                value={activeProfileName}
                onChange={(e) => onSelectProfile(e.target.value)}
                className="w-full anything-input rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-medium focus:outline-none cursor-pointer"
              >
                {profiles.length === 0 ? (
                  <option value="Main account" className="bg-white text-neutral-900">Main account</option>
                ) : (
                  profiles.map(p => (
                    <option key={p.name} value={p.name} className="bg-white text-neutral-900">{p.name}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* API Key */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                API KEY
              </label>
              <span className="text-[10px] text-neutral-400 font-normal">Optional (free voices if empty)</span>
            </div>
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={currentApiKey}
                  onChange={(e) => onApiKeyChange(e.target.value)}
                  placeholder="xi-api-key-..."
                  className="w-full anything-input rounded-xl px-3.5 py-2.5 pr-9 text-xs text-neutral-900 focus:outline-none font-mono placeholder-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                onClick={checkQuota}
                disabled={isChecking}
                className="anything-pill-white px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {isChecking ? <RefreshCw className="w-3 h-3 animate-spin text-sky-600" /> : 'Check'}
              </button>
            </div>
          </div>

          {/* Quota Progress Bar - Anything Inner Card Style */}
          <div className="space-y-2 anything-card-inner p-3.5">
            <div className="flex justify-between items-center text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-900 font-semibold">
                  {quotaInfo.remaining.toLocaleString()} chars
                </span>
                <span className="text-neutral-400 text-[10px]">remaining</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                {quotaInfo.percent}%
              </span>
            </div>
            
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, quotaInfo.percent))}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-neutral-400 pt-0.5">
              <span>{quotaInfo.used.toLocaleString()} used</span>
              <span>{quotaInfo.limit.toLocaleString()} total</span>
            </div>
          </div>

          {/* New Profile Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
              NEW PROFILE NAME
            </label>
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="e.g. Main account"
              className="w-full anything-input rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none"
            />
          </div>

          {/* Profile Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              className="anything-pill-black flex-1 py-2.5 px-4 text-xs flex items-center justify-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-neutral-300" />
              <span>Save profile</span>
            </button>
            <button
              onClick={() => onDeleteProfile(activeProfileName)}
              className="py-2 px-3.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

