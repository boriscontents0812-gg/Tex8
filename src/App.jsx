import React, { useState, useEffect } from 'react';
import TopNavbar from './components/TopNavbar';
import HowToUseModal from './components/LeftSidebar/HowToUseModal';
import ProjectManager from './components/LeftSidebar/ProjectManager';
import ElevenLabsCard from './components/LeftSidebar/ElevenLabsCard';
import ScriptEditor from './components/LeftSidebar/ScriptEditor';
import MediaUploads from './components/LeftSidebar/MediaUploads';
import StatusConsole from './components/LeftSidebar/StatusConsole';

import ThemeToggle from './components/CenterStage/ThemeToggle';
import GengarStudioQuote from './components/CenterStage/GengarStudioQuote';
import TabNavigation from './components/CenterStage/TabNavigation';
import PhoneMockup from './components/CenterStage/PhoneMockup';
import AudioPreviewTab from './components/CenterStage/AudioPreviewTab';
import VideoExportTab from './components/CenterStage/VideoExportTab';

import RightSidebar from './components/RightSidebar/RightSidebar';

import { parseScript } from './utils/scriptParser';
import { renderAndRecordVideo } from './utils/videoRecorder';
import JellyRadio from './components/ui/JellyRadio';

export default function App() {
  // Projects & Script State
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [scriptText, setScriptText] = useState(
    `Natasha 💖\n1: Natasha> Hey\n2: Harry> Hi\n1: img> rizz\n2: Harry> F{uc}k`
  );
  const [parsedScript, setParsedScript] = useState(() => parseScript(scriptText));
  const [contactPhotos, setContactPhotos] = useState({
    'Natasha 💖': '/assets/avatar-laura.svg',
    'Natasha': '/assets/avatar-laura.svg',
    'Laura 💖': '/assets/avatar-laura.svg'
  });
  const [unreadBadge, setUnreadBadge] = useState(0);
  const [scriptImages, setScriptImages] = useState({
    rizz: '/assets/fbi.svg',
    fbi: '/assets/fbi.svg'
  });
  const [leftNav, setLeftNav] = useState('all');

  // Settings & Theme
  const [platform, setPlatform] = useState('ios');
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('preview');
  const [settings, setSettings] = useState({
    chatYPosition: 50,
    containerSize: 100,
    bubbleScale: 110,
    maxBubbleWidth: 80,
    messagesPerPage: 4,
    avatarSize: 40,
    containerCorners: 'square',
    animation: 'crop',
    fadeBetweenGroups: false,
    notificationSound: true,
    headerPersistent: true,
    headerGradient: false,
    autoShorten: false,
    sentBubbleFade: false,
    containerShadow: true,
    popInEffect: true,
    endFadeOut: false,
    endFadeBlack: false,
    gameplay: 'greenscreen',
    audioSpeed: 1.0,
    stability: 25,
    similarityBoost: 75,
    model: 'eleven_multilingual_v2',
    voice1: 'natasha',
    voice2: 'harry'
  });

  // ElevenLabs
  const [elevenLabsProfiles, setElevenLabsProfiles] = useState([
    { name: 'Main account', apiKey: '' }
  ]);
  const [activeProfileName, setActiveProfileName] = useState('Main account');
  const [currentApiKey, setCurrentApiKey] = useState('');

  // Audio & Video Generation
  const [audioClips, setAudioClips] = useState([]);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [updateNewLinesOnly, setUpdateNewLinesOnly] = useState(false);
  const [isRegeneratingLine, setIsRegeneratingLine] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState(null);

  const [videoResult, setVideoResult] = useState(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // Video section only pops up after generating voice AND video
  const showVideoTab = audioClips.length > 0 && videoResult !== null;

  useEffect(() => {
    if (activeTab === 'video' && !showVideoTab) {
      setActiveTab('preview');
    }
  }, [showVideoTab, activeTab]);

  // Sync Dark Mode with <html> and <body>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);

  // Status logs
  const [logs, setLogs] = useState([
    'Idle - waiting for your next action.'
  ]);

  const addLog = (msg) => {
    setLogs(prev => [...prev, msg]);
  };

  // 1. Initial Data Fetch
  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
          // Default to Promo [iOS]
          const promo = data.find(p => p.name.includes('Promo')) || data[0];
          loadProject(promo);
        }
      })
      .catch(err => addLog(`Failed to load projects: ${err.message}`));
  }, []);

  // Update script parser on text change
  useEffect(() => {
    const parsed = parseScript(scriptText);
    setParsedScript(parsed);
  }, [scriptText]);

  // Load a project
  const loadProject = (proj) => {
    setCurrentProject(proj);
    setPlatform(proj.platform || 'ios');
    setTheme(proj.theme || 'light');
    setScriptText(proj.script || '');
    setUnreadBadge(proj.unreadBadge || 0);
    if (proj.settings) {
      setSettings(prev => ({ ...prev, ...proj.settings }));
    }
    if (proj.contactPhotos) {
      setContactPhotos(proj.contactPhotos);
    }
    if (proj.scriptImages) {
      setScriptImages(prev => ({ ...prev, ...proj.scriptImages }));
    }
    addLog(`Project "${proj.name}" loaded - ${proj.script.split('\n').filter(Boolean).length} lines (auto-saved)`);
  };

  // Save current project
  const handleSaveProject = async () => {
    const name = currentProject ? currentProject.name : prompt('Enter project name:', `Project [${platform.toUpperCase()}]`);
    if (!name) return;

    const projectData = {
      id: currentProject ? currentProject.id : `proj_${Date.now()}`,
      name,
      platform,
      theme,
      contactName: parsedScript.contactName,
      unreadBadge,
      script: scriptText,
      settings,
      contactPhotos,
      scriptImages
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
        setCurrentProject(projectData);
        addLog(`Project "${name}" successfully saved.`);
      }
    } catch (e) {
      addLog(`Error saving project: ${e.message}`);
    }
  };

  // Delete current project
  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
        if (data.projects.length > 0) {
          loadProject(data.projects[0]);
        } else {
          setCurrentProject(null);
        }
        addLog('Project deleted.');
      }
    } catch (e) {
      addLog(`Error deleting project: ${e.message}`);
    }
  };

  // New project
  const handleNewProject = () => {
    setCurrentProject(null);
    setScriptText(`Contact 💖\n1:Hey, are you free today?\n2:Yes! What's up?`);
    setUnreadBadge(0);
    setAudioClips([]);
    setVideoResult(null);
    setActiveTab('preview');
    addLog('Created new blank project.');
  };

  // Continue without project
  const handleContinueWithoutProject = () => {
    setCurrentProject(null);
    addLog('Continuing without saved project association.');
  };

  // Generate Audio for All Lines
  const handleGenerateAudio = async () => {
    if (parsedScript.lines.length === 0) {
      alert('Please enter at least one message line in the script editor.');
      return;
    }

    setIsGeneratingAudio(true);
    addLog('Generating audio - this may take a minute...');

    try {
      const res = await fetch('/api/tts/generate-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: parsedScript.lines,
          apiKey: currentApiKey,
          defaultVoice1: settings.voice1,
          defaultVoice2: settings.voice2,
          speed: settings.audioSpeed,
          stability: settings.stability,
          similarityBoost: settings.similarityBoost,
          updateNewOnly: updateNewLinesOnly,
          existingClips: audioClips
        })
      });

      const data = await res.json();
      if (data.success) {
        setAudioClips(data.clips);
        setActiveTab('audio');
        addLog(`Audio generated successfully! ${data.clips.length} voice clips ready.`);
      } else {
        addLog(`Audio generation error: ${data.error}`);
        alert('Audio generation failed: ' + data.error);
      }
    } catch (err) {
      addLog(`Audio generation error: ${err.message}`);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Regenerate a single line
  const handleRegenerateLine = async (lineIdx) => {
    const clip = audioClips[lineIdx];
    if (!clip) return;

    setIsRegeneratingLine(true);
    setRegeneratingIndex(lineIdx);
    addLog(`Regenerating clip ${lineIdx + 1}: "${clip.text}"...`);

    try {
      const res = await fetch('/api/tts/regenerate-line', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineIndex: lineIdx,
          text: clip.text,
          speaker: clip.speaker,
          voice: clip.voice,
          apiKey: currentApiKey,
          speed: settings.audioSpeed,
          stability: settings.stability,
          similarityBoost: settings.similarityBoost
        })
      });

      const data = await res.json();
      if (data.success) {
        const updated = [...audioClips];
        updated[lineIdx] = data.clip;
        setAudioClips(updated);
        addLog(`Clip ${lineIdx + 1} regenerated.`);
      }
    } catch (e) {
      addLog(`Error regenerating line: ${e.message}`);
    } finally {
      setIsRegeneratingLine(false);
      setRegeneratingIndex(null);
    }
  };

  // Update line text in Audio Tab
  const handleUpdateLineText = (lineIdx, newText) => {
    const updated = [...audioClips];
    if (updated[lineIdx]) {
      updated[lineIdx] = { ...updated[lineIdx], text: newText };
      setAudioClips(updated);
    }
  };

  // Generate Video
  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    addLog('Building video - Encoding with FFmpeg: preparing canvas and audio...');

    try {
      // 1. Ensure audio clips exist
      let currentClips = audioClips;
      if (!currentClips || currentClips.length === 0) {
        addLog('No audio clips found. Auto-generating audio voiceovers first...');
        const audioRes = await fetch('/api/tts/generate-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lines: parsedScript.lines,
            apiKey: currentApiKey,
            defaultVoice1: settings.voice1,
            defaultVoice2: settings.voice2,
            speed: settings.audioSpeed,
            stability: settings.stability,
            similarityBoost: settings.similarityBoost
          })
        });
        const audioData = await audioRes.json();
        if (audioData.success) {
          currentClips = audioData.clips;
          setAudioClips(currentClips);
        }
      }

      // 2. Render and record
      const result = await renderAndRecordVideo({
        scriptData: {
          ...parsedScript,
          unreadBadge
        },
        audioClips: currentClips,
        settings,
        platform,
        theme,
        contactPhotos,
        scriptImages,
        onProgress: (statusText) => {
          addLog(statusText);
        }
      });

      setVideoResult(result);
      setActiveTab('video');
      addLog(`Video ready! Download link available.`);
    } catch (err) {
      addLog(`Video building error: ${err.message}`);
      alert(`Video rendering failed: ${err.message}`);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // Download video handler
  const handleDownloadVideo = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'imessage_video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addLog(`Downloading video ${filename || 'imessage_video.mp4'}...`);
  };
  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-400 ease-in-out ${
      theme === 'dark'
        ? 'bg-[#080c14] text-white selection:bg-emerald-500'
        : 'kree8-studio-bg text-neutral-900 selection:bg-neutral-900 selection:text-white'
    }`}>
      {/* Top Navbar */}
      <TopNavbar credits={207} theme={theme} onThemeChange={setTheme} />

      {/* Main 3-Column Studio Layout */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: Project, Script, Uploads, Status (Col 3) */}
        <section className="lg:col-span-3 anything-card rounded-[30px] p-4 flex flex-col shadow-xl space-y-2">
          {/* React Bits JellyRadio for Left Sidebar Navigation */}
          <div className="flex justify-center pb-3 mb-2 border-b border-neutral-200/70">
            <JellyRadio
              items={[
                { value: 'all', label: 'All' },
                { value: 'projects', label: 'Projects' },
                { value: 'script', label: 'Script' },
                { value: 'media', label: 'Media' }
              ]}
              value={leftNav}
              onChange={setLeftNav}
              chipColor="#ffffff"
              activeColor="#000000"
              textColor="#64748b"
              activeTextColor="#ffffff"
              size="sm"
              gap={4}
              radius={12}
            />
          </div>

          <HowToUseModal />

          {(leftNav === 'all' || leftNav === 'projects') && (
            <>
              <ProjectManager
                projects={projects}
                currentProject={currentProject}
                onSelectProject={loadProject}
                onNewProject={handleNewProject}
                onContinueWithoutProject={handleContinueWithoutProject}
                onSaveProject={handleSaveProject}
                onDeleteProject={handleDeleteProject}
              />

              <ElevenLabsCard
                profiles={elevenLabsProfiles}
                activeProfileName={activeProfileName}
                currentApiKey={currentApiKey}
                onApiKeyChange={setCurrentApiKey}
                onSelectProfile={(name) => {
                  setActiveProfileName(name);
                  const p = elevenLabsProfiles.find(x => x.name === name);
                  if (p) setCurrentApiKey(p.apiKey);
                }}
                onSaveProfile={(name, key) => {
                  setElevenLabsProfiles(prev => [...prev.filter(x => x.name !== name), { name, apiKey: key }]);
                  setActiveProfileName(name);
                }}
                onDeleteProfile={(name) => {
                  setElevenLabsProfiles(prev => prev.filter(x => x.name !== name));
                  if (activeProfileName === name) {
                    setActiveProfileName('Main account');
                    setCurrentApiKey('');
                  }
                }}
                onLog={addLog}
              />
            </>
          )}

          {(leftNav === 'all' || leftNav === 'script') && (
            <ScriptEditor
              scriptText={scriptText}
              onChange={setScriptText}
              imageCount={parsedScript.imageCount}
            />
          )}

          {(leftNav === 'all' || leftNav === 'media') && (
            <MediaUploads
              contactName={parsedScript.contactName}
              contactPhotos={contactPhotos}
              onContactPhotoChange={(name, url) => {
                setContactPhotos(prev => ({ ...prev, [name]: url }));
                addLog(`Updated avatar for "${name}".`);
              }}
              unreadBadge={unreadBadge}
              onUnreadBadgeChange={setUnreadBadge}
              imageTags={parsedScript.imageTags}
              scriptImages={scriptImages}
              onScriptImageChange={(tag, url) => {
                setScriptImages(prev => ({ ...prev, [tag]: url }));
                addLog(`Updated script image for tag [img: ${tag}].`);
              }}
              onLog={addLog}
            />
          )}

          <StatusConsole
            logs={logs}
            isGeneratingAudio={isGeneratingAudio}
            isGeneratingVideo={isGeneratingVideo}
            isRegeneratingLine={isRegeneratingLine}
          />
        </section>

        {/* CENTER COLUMN: Kree8 Studio Workspace Phone Mockup, Audio Scrubber, Video Player (Col 6) */}
        <section className="lg:col-span-6 kree8-stage-card p-5 sm:p-6 flex flex-col relative overflow-hidden">
          {/* Kree8-Style Hero Quote with Gengar Pop-Up Illustration */}
          <GengarStudioQuote theme={theme} />

          {/* Theme Switcher Header */}
          <ThemeToggle
            platform={platform}
            theme={theme}
            onThemeChange={setTheme}
          />

          {/* Tab Navigation (Preview | Audio | Video only after audio & video generated) */}
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            showVideoTab={showVideoTab}
          />

          {/* Tab Content */}
          <div className="flex-1 flex items-center justify-center min-h-[620px]">
            {activeTab === 'preview' && (
              <PhoneMockup
                scriptData={{
                  ...parsedScript,
                  unreadBadge
                }}
                settings={settings}
                platform={platform}
                theme={theme}
                contactPhotos={contactPhotos}
                scriptImages={scriptImages}
              />
            )}

            {activeTab === 'audio' && (
              <AudioPreviewTab
                audioClips={audioClips}
                onRegenerateLine={handleRegenerateLine}
                isRegenerating={isRegeneratingLine}
                regeneratingIndex={regeneratingIndex}
                onUpdateLineText={handleUpdateLineText}
              />
            )}

            {activeTab === 'video' && showVideoTab && (
              <VideoExportTab
                videoResult={videoResult}
                onDownload={handleDownloadVideo}
              />
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Settings, Voices, Bubble Design, Video, Actions (Col 3) */}
        <section className="lg:col-span-3 anything-card rounded-[30px] p-4 shadow-xl">
          <RightSidebar
            platform={platform}
            onPlatformChange={setPlatform}
            settings={settings}
            onSettingChange={(key, val) => setSettings(prev => ({ ...prev, [key]: val }))}
            onGenerateAudio={handleGenerateAudio}
            isGeneratingAudio={isGeneratingAudio}
            updateNewLinesOnly={updateNewLinesOnly}
            onUpdateNewLinesChange={setUpdateNewLinesOnly}
            onGenerateVideo={handleGenerateVideo}
            isGeneratingVideo={isGeneratingVideo}
          />
        </section>
      </main>
    </div>
  );
}

