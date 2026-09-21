import React, { useState } from 'react';
import {
  Settings,
  Palette,
  Type,
  Layers,
  Volume2,
  Sparkles,
  Video
} from 'lucide-react';

import BranchedMenu from '../ui/BranchedMenu';
import WakeSlider from '../ui/WakeSlider';
import SquishSwitch from '../ui/SquishSwitch';
import SpecularButton from '../ui/SpecularButton';

export default function RightSidebar({
  platform = 'ios',
  onPlatformChange,
  settings = {},
  onSettingChange,
  onGenerateAudio,
  isGeneratingAudio = false,
  updateNewLinesOnly = false,
  onUpdateNewLinesChange,
  onGenerateVideo,
  isGeneratingVideo = false
}) {
  const [activeMenu, setActiveMenu] = useState('settings');

  const menuItems = [
    {
      label: 'Settings',
      children: [
        { value: 'settings', label: 'Position & Size', icon: Settings }
      ]
    },
    {
      label: 'Voices',
      children: [
        { value: 'voices', label: 'Voice & Speech', icon: Volume2 }
      ]
    },
    {
      label: 'Bubble Design',
      children: [
        { value: 'bubble', label: 'Scale & Density', icon: Type }
      ]
    },
    {
      label: 'Header',
      children: [
        { value: 'header', label: 'Avatar & Elements', icon: Layers }
      ]
    },
    {
      label: 'Video',
      children: [
        { value: 'video', label: 'Effects & Background', icon: Palette }
      ]
    }
  ];

  return (
    <div className="w-full space-y-4 pb-8 text-xs">
      {/* 1. Platform Switcher (iOS / WhatsApp) - Anything.com Pill Segmented Control */}
      <div className="flex p-1 rounded-full bg-neutral-200/70 border border-neutral-300/50 shadow-inner">
        <button
          type="button"
          onClick={() => onPlatformChange('ios')}
          className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
            platform === 'ios'
              ? 'bg-black text-white shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          iOS
        </button>
        <button
          type="button"
          onClick={() => onPlatformChange('whatsapp')}
          className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
            platform === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          WhatsApp
        </button>
      </div>

      {/* 2. BranchedMenu Component from React Bits */}
      <div className="anything-card rounded-[22px] p-3.5 shadow-sm">
        <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2 px-1">
          NAVIGATION
        </label>
        <BranchedMenu
          items={menuItems}
          defaultOpen={[0, 1, 2, 3, 4]}
          defaultActive={activeMenu}
          onSelect={(val) => setActiveMenu(val)}
          color="#64748b"
          accentColor="#000000"
          lineColor="#e2e8f0"
          width={280}
          rowHeight={32}
          indent={36}
          fontSize={12}
        />
      </div>

      {/* 3. Settings Section Panel (Filtered by BranchedMenu or All Sections) */}
      <div className="space-y-3.5">
        {/* SETTINGS PANEL */}
        {(activeMenu === 'settings' || activeMenu === 'all') && (
          <div className="anything-card rounded-[22px] p-4 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold text-neutral-900 flex items-center gap-2 border-b border-neutral-200/70 pb-2.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
              Settings (Layout & Position)
            </h3>

            {/* Chat Y-Position with WakeSlider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-neutral-600">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">CHAT Y-POSITION</span>
                <span className="font-mono text-neutral-900 font-bold">{settings.chatYPosition || 50}%</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80 shadow-inner">
                <WakeSlider
                  value={settings.chatYPosition || 50}
                  min={0}
                  max={100}
                  step={1}
                  bars={28}
                  height={38}
                  restHeight={10}
                  gap={3}
                  fillColor="#0ea5e9"
                  trackColor="#f1f5f9"
                  crestColor="#38bdf8"
                  onChange={(val) => onSettingChange('chatYPosition', val)}
                />
              </div>
            </div>

            {/* Container Size with WakeSlider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-neutral-600">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">CONTAINER SIZE</span>
                <span className="font-mono text-neutral-900 font-bold">{settings.containerSize || 100}%</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80 shadow-inner">
                <WakeSlider
                  value={settings.containerSize || 100}
                  min={50}
                  max={120}
                  step={1}
                  bars={28}
                  height={38}
                  restHeight={10}
                  gap={3}
                  fillColor="#0ea5e9"
                  trackColor="#f1f5f9"
                  crestColor="#38bdf8"
                  onChange={(val) => onSettingChange('containerSize', val)}
                />
              </div>
            </div>
          </div>
        )}

        {/* VOICES PANEL */}
        {(activeMenu === 'voices' || activeMenu === 'all') && (
          <div className="anything-card rounded-[22px] p-4 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold text-neutral-900 flex items-center gap-2 border-b border-neutral-200/70 pb-2.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              Voices & Audio Speech
            </h3>

            {/* Model */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                MODEL
              </label>
              <div className="relative">
                <select
                  value={settings.model || 'eleven_multilingual_v2'}
                  onChange={(e) => onSettingChange('model', e.target.value)}
                  className="w-full anything-input rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-medium focus:outline-none cursor-pointer bg-white border border-neutral-200 shadow-sm"
                >
                  <option value="eleven_multilingual_v2" className="bg-white text-neutral-900">Multilingual v2 (Default)</option>
                  <option value="eleven_turbo_v2_5" className="bg-white text-neutral-900">Turbo v2.5 (faster)</option>
                  <option value="eleven_flash_v2_5" className="bg-white text-neutral-900">Flash v2.5 (fastest)</option>
                </select>
              </div>
            </div>

            {/* Voice 1 (Contact) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                CONTACT VOICE (1: GREY BUBBLE)
              </label>
              <div className="relative">
                <select
                  value={settings.voice1 || 'natasha'}
                  onChange={(e) => onSettingChange('voice1', e.target.value)}
                  className="w-full anything-input rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-medium focus:outline-none cursor-pointer bg-white border border-neutral-200 shadow-sm"
                >
                  <option value="natasha" className="bg-white text-neutral-900">Natasha (Female, energetic)</option>
                  <option value="rachel" className="bg-white text-neutral-900">Rachel (Female, natural)</option>
                  <option value="charlotte" className="bg-white text-neutral-900">Charlotte (Female, soft)</option>
                  <option value="alice" className="bg-white text-neutral-900">Alice (Female, clear)</option>
                  <option value="emily" className="bg-white text-neutral-900">Emily (Female, British)</option>
                </select>
              </div>
            </div>

            {/* Voice 2 (You) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                YOUR VOICE (2: BLUE BUBBLE)
              </label>
              <div className="relative">
                <select
                  value={settings.voice2 || 'harry'}
                  onChange={(e) => onSettingChange('voice2', e.target.value)}
                  className="w-full anything-input rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-medium focus:outline-none cursor-pointer bg-white border border-neutral-200 shadow-sm"
                >
                  <option value="harry" className="bg-white text-neutral-900">Harry (Male, casual)</option>
                  <option value="adam" className="bg-white text-neutral-900">Adam (Male, deep narration)</option>
                  <option value="charlie" className="bg-white text-neutral-900">Charlie (Male, Australian)</option>
                  <option value="george" className="bg-white text-neutral-900">George (Male, British)</option>
                </select>
              </div>
            </div>

            {/* Audio Speed with WakeSlider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-neutral-600">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">AUDIO SPEED</span>
                <span className="font-mono text-neutral-900 font-bold">{(settings.audioSpeed || 1.0).toFixed(2)}x</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80 shadow-inner">
                <WakeSlider
                  value={Math.round((settings.audioSpeed || 1.0) * 100)}
                  min={60}
                  max={160}
                  step={5}
                  bars={28}
                  height={38}
                  restHeight={10}
                  gap={3}
                  fillColor="#0ea5e9"
                  trackColor="#f1f5f9"
                  crestColor="#38bdf8"
                  onChange={(val) => onSettingChange('audioSpeed', val / 100)}
                />
              </div>
            </div>

            {/* Stability with WakeSlider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-neutral-600">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">STABILITY</span>
                <span className="font-mono text-neutral-900 font-bold">{settings.stability || 25}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80 shadow-inner">
                <WakeSlider
                  value={settings.stability || 25}
                  min={0}
                  max={100}
                  step={1}
                  bars={28}
                  height={38}
                  restHeight={10}
                  gap={3}
                  fillColor="#0ea5e9"
                  trackColor="#f1f5f9"
                  crestColor="#38bdf8"
                  onChange={(val) => onSettingChange('stability', val)}
                />
              </div>
            </div>

            {/* Similarity Boost with WakeSlider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-neutral-600">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">SIMILARITY BOOST</span>
                <span className="font-mono text-neutral-900 font-bold">{settings.similarityBoost || 75}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80 shadow-inner">
                <WakeSlider
                  value={settings.similarityBoost || 75}
                  min={0}
                  max={100}
                  step={1}
                  bars={28}
                  height={38}
                  restHeight={10}
                  gap={3}
                  fillColor="#0ea5e9"
                  trackColor="#f1f5f9"
                  crestColor="#38bdf8"
                  onChange={(val) => onSettingChange('similarityBoost', val)}
                />
              </div>
            </div>
          </div>
        )}

        {/* BUBBLE DESIGN PANEL */}
        {(activeMenu === 'bubble' || activeMenu === 'all') && (
          <div className="anything-card rounded-[22px] p-4 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold text-neutral-900 flex items-center gap-2 border-b border-neutral-200/70 pb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Bubble Design & Density
            </h3>

            {/* Bubble Scale with WakeSlider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-neutral-600">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">BUBBLE SCALE</span>
                <span className="font-mono text-neutral-900 font-bold">{settings.bubbleScale || 110}%</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80 shadow-inner">
                <WakeSlider
                  value={settings.bubbleScale || 110}
                  min={80}
                  max={150}
                  step={1}
                  bars={28}
                  height={38}
                  restHeight={10}
                  gap={3}
                  fillColor="#0ea5e9"
                  trackColor="#f1f5f9"
                  crestColor="#38bdf8"
                  onChange={(val) => onSettingChange('bubbleScale', val)}
                />
              </div>
            </div>

            {/* Max Bubble Width with WakeSlider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-neutral-600">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">MAX BUBBLE WIDTH</span>
                <span className="font-mono text-neutral-900 font-bold">{settings.maxBubbleWidth || 80}%</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80 shadow-inner">
                <WakeSlider
                  value={settings.maxBubbleWidth || 80}
                  min={50}
                  max={95}
                  step={1}
                  bars={28}
                  height={38}
                  restHeight={10}
                  gap={3}
                  fillColor="#0ea5e9"
                  trackColor="#f1f5f9"
                  crestColor="#38bdf8"
                  onChange={(val) => onSettingChange('maxBubbleWidth', val)}
                />
              </div>
            </div>

            {/* Messages Per Page with WakeSlider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-neutral-600">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">MESSAGES PER PAGE</span>
                <span className="font-mono text-neutral-900 font-bold">{settings.messagesPerPage || 4}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80 shadow-inner">
                <WakeSlider
                  value={settings.messagesPerPage || 4}
                  min={2}
                  max={8}
                  step={1}
                  bars={24}
                  height={38}
                  restHeight={10}
                  gap={3}
                  fillColor="#0ea5e9"
                  trackColor="#f1f5f9"
                  crestColor="#38bdf8"
                  onChange={(val) => onSettingChange('messagesPerPage', val)}
                />
              </div>
            </div>
          </div>
        )}

        {/* HEADER PANEL */}
        {(activeMenu === 'header' || activeMenu === 'all') && (
          <div className="anything-card rounded-[22px] p-4 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold text-neutral-900 flex items-center gap-2 border-b border-neutral-200/70 pb-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              Header & Avatar
            </h3>

            {/* Avatar Size with WakeSlider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-neutral-600">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">AVATAR SIZE</span>
                <span className="font-mono text-neutral-900 font-bold">{settings.avatarSize || 40}px</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80 shadow-inner">
                <WakeSlider
                  value={settings.avatarSize || 40}
                  min={24}
                  max={60}
                  step={1}
                  bars={28}
                  height={38}
                  restHeight={10}
                  gap={3}
                  fillColor="#0ea5e9"
                  trackColor="#f1f5f9"
                  crestColor="#38bdf8"
                  onChange={(val) => onSettingChange('avatarSize', val)}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIDEO PANEL */}
        {(activeMenu === 'video' || activeMenu === 'all') && (
          <div className="anything-card rounded-[22px] p-4 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold text-neutral-900 flex items-center gap-2 border-b border-neutral-200/70 pb-2.5">
              <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
              Video Settings & Switches
            </h3>

            {/* Container Corners - Pill Segmented Control */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                CONTAINER CORNERS
              </span>
              <div className="flex p-1 rounded-full bg-neutral-200/70 border border-neutral-300/50 shadow-inner">
                <button
                  type="button"
                  onClick={() => onSettingChange('containerCorners', 'square')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    settings.containerCorners === 'square'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Square
                </button>
                <button
                  type="button"
                  onClick={() => onSettingChange('containerCorners', 'rounded')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    settings.containerCorners !== 'square'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Rounded
                </button>
              </div>
            </div>

            {/* Animation Mode - Pill Segmented Control */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                ANIMATION
              </span>
              <div className="flex p-1 rounded-full bg-neutral-200/70 border border-neutral-300/50 shadow-inner">
                <button
                  type="button"
                  onClick={() => onSettingChange('animation', 'crop')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    settings.animation !== 'slide'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Crop (instant)
                </button>
                <button
                  type="button"
                  onClick={() => onSettingChange('animation', 'slide')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    settings.animation === 'slide'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Slide down
                </button>
              </div>
            </div>

            {/* Feature Switches - Anything.com Inset List */}
            <div className="pt-2">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                BEHAVIORS & EFFECTS
              </span>
              <div className="bg-white rounded-[18px] border border-neutral-200/80 divide-y divide-neutral-100 overflow-hidden px-3.5 py-0.5 shadow-sm">
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-[11px] text-neutral-700 font-medium">Fade between groups</span>
                  <SquishSwitch
                    checked={!!settings.fadeBetweenGroups}
                    onChange={(val) => onSettingChange('fadeBetweenGroups', val)}
                    trackOnColor="#000000"
                    width={44}
                    height={24}
                  />
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <span className="text-[11px] text-neutral-700 font-medium">Notification sound</span>
                  <SquishSwitch
                    checked={settings.notificationSound !== false}
                    onChange={(val) => onSettingChange('notificationSound', val)}
                    trackOnColor="#000000"
                    width={44}
                    height={24}
                  />
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <span className="text-[11px] text-neutral-700 font-medium">Header persistent</span>
                  <SquishSwitch
                    checked={settings.headerPersistent !== false}
                    onChange={(val) => onSettingChange('headerPersistent', val)}
                    trackOnColor="#000000"
                    width={44}
                    height={24}
                  />
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <span className="text-[11px] text-neutral-700 font-medium">Header gradient</span>
                  <SquishSwitch
                    checked={!!settings.headerGradient}
                    onChange={(val) => onSettingChange('headerGradient', val)}
                    trackOnColor="#000000"
                    width={44}
                    height={24}
                  />
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <span className="text-[11px] text-neutral-700 font-medium">Auto-shorten to 259</span>
                  <SquishSwitch
                    checked={!!settings.autoShorten}
                    onChange={(val) => onSettingChange('autoShorten', val)}
                    trackOnColor="#000000"
                    width={44}
                    height={24}
                  />
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <span className="text-[11px] text-neutral-700 font-medium">Sent bubble fade</span>
                  <SquishSwitch
                    checked={!!settings.sentBubbleFade}
                    onChange={(val) => onSettingChange('sentBubbleFade', val)}
                    trackOnColor="#000000"
                    width={44}
                    height={24}
                  />
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <span className="text-[11px] text-neutral-700 font-medium">Container shadow</span>
                  <SquishSwitch
                    checked={settings.containerShadow !== false}
                    onChange={(val) => onSettingChange('containerShadow', val)}
                    trackOnColor="#000000"
                    width={44}
                    height={24}
                  />
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <span className="text-[11px] text-neutral-700 font-medium">Pop-in effect</span>
                  <SquishSwitch
                    checked={settings.popInEffect !== false}
                    onChange={(val) => onSettingChange('popInEffect', val)}
                    trackOnColor="#000000"
                    width={44}
                    height={24}
                  />
                </div>
              </div>
            </div>

            {/* Gameplay / Background Select */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                GAMEPLAY / BACKGROUND
              </label>
              <div className="relative">
                <select
                  value={settings.gameplay || 'greenscreen'}
                  onChange={(e) => onSettingChange('gameplay', e.target.value)}
                  className="w-full anything-input rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-medium focus:outline-none cursor-pointer bg-white border border-neutral-200 shadow-sm"
                >
                  <option value="greenscreen" className="bg-white text-neutral-900">Chroma Key Green Screen (#00FF00)</option>
                  <option value="minecraft" className="bg-white text-neutral-900">Minecraft Parkour</option>
                  <option value="subway" className="bg-white text-neutral-900">Subway Surfers</option>
                  <option value="dark" className="bg-white text-neutral-900">Aesthetic Dark Gradient</option>
                </select>
              </div>
            </div>

            {/* Output Render Engine / Process */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                RENDER ENGINE
              </label>
              <div className="relative">
                <select
                  value={settings.renderEngine || 'botyk'}
                  onChange={(e) => onSettingChange('renderEngine', e.target.value)}
                  className="w-full anything-input rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-medium focus:outline-none cursor-pointer bg-white border border-neutral-200 shadow-sm"
                >
                  <option value="botyk" className="bg-white text-neutral-900">Botyk Engine (60 FPS Cloud MP4)</option>
                  <option value="local" className="bg-white text-neutral-900">Tex8 Canvas Engine (In-Browser 60 FPS)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Action Buttons with Anything.com Pill Style */}
      <div className="pt-2 space-y-3">
        {/* Generate Audio Button */}
        <div>
          <button
            type="button"
            disabled={isGeneratingAudio}
            onClick={onGenerateAudio}
            className="anything-pill-black w-full py-3.5 text-xs font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAudio ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAudio ? 'Generating Audio...' : 'Generate Audio'}</span>
            <span className="text-sm font-light">→</span>
          </button>
        </div>

        {/* Update (new lines only) Checkbox with SquishSwitch */}
        <div className="flex items-center justify-between anything-card px-4 py-2.5 rounded-full shadow-sm">
          <span className="text-[11px] text-neutral-700 font-medium">Update (new lines only)</span>
          <SquishSwitch
            checked={updateNewLinesOnly}
            onChange={onUpdateNewLinesChange}
            trackOnColor="#000000"
            width={40}
            height={22}
          />
        </div>

        {/* Generate Video Button */}
        <div>
          <button
            type="button"
            disabled={isGeneratingVideo}
            onClick={onGenerateVideo}
            className="w-full py-3.5 text-xs font-semibold flex items-center justify-center gap-2 rounded-full text-white bg-black hover:bg-neutral-800 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Video className={`w-3.5 h-3.5 ${isGeneratingVideo ? 'animate-bounce' : ''}`} />
            <span>{isGeneratingVideo ? 'Building Video (FFmpeg)...' : 'Generate Video'}</span>
            <span className="text-sm font-light">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
