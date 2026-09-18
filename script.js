import { profileConfig } from './config.js';

// SVG Icon definitions - Original Official Branding
const ICONS = {
  website: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="2 2 28 28"><path fill="currentColor" d="M11 16c0-1.393.078-2.734.222-4h9.556c.144 1.266.222 2.607.222 4c0 1.393-.078 2.734-.222 4h-9.556A35.485 35.485 0 0 1 11 16Zm-1.79 4A37.618 37.618 0 0 1 9 16c0-1.379.073-2.72.21-4H2.58A14.002 14.002 0 0 0 2 16c0 1.39.203 2.733.58 4h6.63Zm-5.863 2h6.138c.314 1.86.771 3.547 1.344 4.978c.369.922.793 1.758 1.272 2.472A14.036 14.036 0 0 1 3.347 22Zm8.168 0h8.97c-.29 1.6-.69 3.032-1.17 4.235c-.516 1.288-1.104 2.262-1.706 2.9c-.6.634-1.144.865-1.609.865c-.465 0-1.009-.231-1.609-.866c-.602-.637-1.19-1.611-1.705-2.899c-.481-1.203-.881-2.636-1.171-4.235Zm11 0c-.314 1.86-.771 3.547-1.344 4.978c-.369.922-.793 1.758-1.272 2.472A14.036 14.036 0 0 0 28.653 22h-6.138Zm6.905-2c.377-1.267.58-2.61.58-4c0-1.39-.203-2.733-.58-4h-6.63c.137 1.28.21 2.621.21 4s-.073 2.72-.21 4h6.63ZM19.314 5.765c.481 1.203.881 2.636 1.171 4.235h-8.97c.29-1.6.69-3.032 1.17-4.235c.516-1.288 1.104-2.263 1.706-2.9c.598-.631 1.14-.863 1.604-.865h.008c.464 0 1.007.233 1.606.866c.602.636 1.19 1.611 1.705 2.899ZM22.515 10h6.138a14.036 14.036 0 0 0-8.754-7.45c.479.714.903 1.55 1.272 2.472c.573 1.431 1.03 3.118 1.344 4.978ZM3.347 10h6.138c.314-1.86.771-3.547 1.344-4.978c.369-.922.793-1.758 1.272-2.472A14.036 14.036 0 0 0 3.347 10Z"/></svg>`,
  ltc: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm-.262 3.678h2.584a.343.343 0 0 1 .33.435l-2.03 6.918l1.905-.582l-.408 1.385l-1.924.56l-1.248 4.214h6.676a.343.343 0 0 1 .328.437l-.582 2a.459.459 0 0 1-.44.33H6.733l1.723-5.822l-1.906.58l.42-1.361l1.91-.58l2.422-8.18a.456.456 0 0 1 .437-.334Z"/></svg>`,
  discord: `<svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 127.14 96.36"><path fill="currentColor" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>`,
  spotify: `<svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 168 168"><path fill="currentColor" d="M83.996.002C37.6.002 0 37.602 0 84c0 46.394 37.6 83.994 83.996 83.994 46.398 0 84.004-37.6 84.004-83.994 0-46.398-37.606-83.998-84.004-83.998zm38.527 121.154c-1.504 2.47-4.725 3.246-7.195 1.742-19.718-12.049-44.536-14.773-73.765-8.086-2.82.645-5.61-1.121-6.255-3.941-.645-2.82 1.121-5.61 3.941-6.255 32.05-7.332 59.48-4.225 81.532 9.345 2.47 1.504 3.246 4.725 1.742 7.195zm10.285-22.859c-1.895 3.086-5.918 4.05-9.004 2.155-22.566-13.871-56.973-17.886-83.668-9.789-3.488 1.055-7.152-.926-8.211-4.418-1.055-3.488.926-7.152 4.418-8.211 30.512-9.258 68.375-4.785 94.31 11.258 3.086 1.895 4.05 5.918 2.155 9.004zm.883-23.774c-27.062-16.074-71.746-17.555-97.547-9.723-4.148 1.262-8.547-1.102-9.809-5.25-1.262-4.148 1.102-8.547 5.25-9.809 29.652-9.004 78.898-7.297 110.05 11.2 3.734 2.215 4.957 7.051 2.742 10.785-2.215 3.734-7.055 4.961-10.686 2.797z"/></svg>`,
  bitcoin: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="m10.84 11.22l-.688-2.568c.728-.18 2.839-1.051 3.39.506c.27 1.682-1.978 1.877-2.702 2.062zm.289 1.313l.755 2.829c.868-.228 3.496-.46 3.241-2.351c-.433-1.666-3.125-.706-3.996-.478zM24 12c0 6.627-5.373 12-12 12S0 18.627 0 12S5.373 0 12 0s12 5.373 12 12zm-6.341.661c-.183-1.151-1.441-2.095-2.485-2.202c.643-.57.969-1.401.57-2.488c-.603-1.368-1.989-1.66-3.685-1.377l-.546-2.114l-1.285.332l.536 2.108c-.338.085-.685.158-1.029.256L9.198 5.08l-1.285.332l.545 2.114c-.277.079-2.595.673-2.595.673l.353 1.377s.944-.265.935-.244c.524-.137.771.125.886.372l1.498 5.793c.018.168-.012.454-.372.551c.021.012-.935.241-.935.241l.14 1.605s2.296-.588 2.598-.664l.551 2.138l1.285-.332l-.551-2.153c.353-.082.697-.168 1.032-.256l.548 2.141l1.285-.332l-.551-2.135c1.982-.482 3.38-1.73 3.094-3.64z"/></svg>`
};

const SPEAKER_SVG_HIGH = `<defs><mask id="volMask"><g fill="none" stroke="#fff" stroke-width="4"><path fill="#555" stroke-linejoin="round" d="M24 6v36c-7 0-12.2-9.16-12.2-9.16H6a2 2 0 0 1-2-2V17a2 2 0 0 1 2-2h5.8S17 6 24 6Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M32 15a11.91 11.91 0 0 1 1.68 1.86A12.07 12.07 0 0 1 36 24c0 2.65-.85 5.1-2.28 7.09A11.94 11.94 0 0 1 32 33"/><path stroke-linecap="round" d="M34.24 41.19C40.08 37.7 44 31.3 44 24c0-7.2-3.8-13.5-9.49-17.02"/></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#volMask)"/>`;
const SPEAKER_SVG_MUTED = `<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M24 6v36c-7 0-12.2-9.16-12.2-9.16H6a2 2 0 0 1-2-2V17a2 2 0 0 1 2-2h5.8S17 6 24 6Zm10 13l8 8m0-8l-8 8"/>`;

// DOM Elements
const clickOverlay = document.getElementById('clickOverlay');
const profileCard = document.getElementById('profileCard');
const profileTiltWrapper = document.getElementById('profileTiltWrapper');
const bgAudio = document.getElementById('bgAudio');
const volumeToggleBtn = document.getElementById('volumeToggleBtn');
const speakerIcon = document.getElementById('speakerIcon');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const skipBackBtn = document.getElementById('skipBackBtn');
const skipForwardBtn = document.getElementById('skipForwardBtn');
const progressBarContainer = document.getElementById('progressBarContainer');
const progressFill = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const audioCurrentTime = document.getElementById('audioCurrentTime');
const audioDuration = document.getElementById('audioDuration');
const socialsRow = document.getElementById('socialsRow');
const floatingTooltip = document.getElementById('floatingTooltip');
const userBio = document.getElementById('userBio');
const userLocation = document.getElementById('userLocation');
const audioTitle = document.getElementById('audioTitle');
const audioCover = document.getElementById('audioCover');
const profileAvatar = document.getElementById('profileAvatar');

// Initialize Profile Info
const cardBanner = document.getElementById('cardBanner');
const userHandle = document.getElementById('userHandle');
const userPronouns = document.getElementById('userPronouns');
const guildBadge = document.getElementById('guildBadge');
const bioTitle = document.getElementById('bioTitle');
const bioDetails = document.getElementById('bioDetails');

if (cardBanner) cardBanner.src = profileConfig.banner;
if (userHandle) userHandle.textContent = profileConfig.handle;
if (userPronouns) userPronouns.textContent = profileConfig.pronouns;
if (bioTitle) bioTitle.textContent = profileConfig.description;
if (bioDetails) bioDetails.textContent = profileConfig.details;
if (guildBadge && profileConfig.guildTag) {
  const nameEl = guildBadge.querySelector('.guild-name');
  if (nameEl) nameEl.textContent = profileConfig.guildTag;
}

if (userHandle) {
  userHandle.style.cursor = 'pointer';
  userHandle.setAttribute('data-tooltip', 'Copy Discord');
  userHandle.addEventListener('click', (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(profileConfig.handle).then(() => {
      showTooltip(userHandle, 'Copied!', true);
    });
  });
}

if (guildBadge) {
  guildBadge.addEventListener('click', (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(profileConfig.guildTag).then(() => {
      showTooltip(guildBadge, 'Clan: AMEN', true);
    });
  });
}

if (audioTitle) {
  audioTitle.textContent = profileConfig.audio.title.split(' - ')[0] || profileConfig.audio.title;
}
if (audioCover) audioCover.src = profileConfig.audio.cover;
if (profileAvatar) profileAvatar.src = profileConfig.avatar;
bgAudio.src = profileConfig.audio.src;
bgAudio.volume = profileConfig.audio.defaultVolume;

// Render Socials with Original Brand Themes
if (socialsRow) {
  socialsRow.innerHTML = '';
  profileConfig.socials.forEach(social => {
    const el = document.createElement(social.type === 'link' ? 'a' : 'div');
    el.className = `social-item social-${social.icon}`;
    el.setAttribute('data-tooltip', social.title);
    el.innerHTML = ICONS[social.icon] || '';

    if (social.type === 'link') {
      el.href = social.url;
      el.target = '_blank';
      el.rel = 'nofollow ugc noopener noreferrer';
    } else if (social.type === 'copy') {
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(social.value).then(() => {
          showTooltip(el, 'Copied!', true);
        }).catch(() => {
          showTooltip(el, 'Failed to copy', true);
        });
      });
    }

    socialsRow.appendChild(el);
  });
}

// Setup Discord Widget Click to Copy
const discordWidget = document.getElementById('discordWidget');
if (discordWidget) {
  discordWidget.addEventListener('click', (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(profileConfig.handle || 'moykz_').then(() => {
      showTooltip(discordWidget, 'Copied!', true);
    }).catch(() => {
      showTooltip(discordWidget, 'Failed to copy', true);
    });
  });
}

// Setup Tooltips
function showTooltip(target, text, isTemporary = false) {
  floatingTooltip.textContent = text;
  floatingTooltip.classList.add('show');

  const rect = target.getBoundingClientRect();
  const ttRect = floatingTooltip.getBoundingClientRect();

  const left = rect.left + rect.width / 2 - ttRect.width / 2;
  const top = rect.top - ttRect.height - 8;

  floatingTooltip.style.left = `${Math.max(10, Math.min(window.innerWidth - ttRect.width - 10, left))}px`;
  floatingTooltip.style.top = `${top > 10 ? top : rect.bottom + 8}px`;

  if (isTemporary) {
    setTimeout(() => {
      floatingTooltip.classList.remove('show');
    }, 1200);
  }
}

function hideTooltip() {
  floatingTooltip.classList.remove('show');
}

document.addEventListener('mouseover', (e) => {
  const target = e.target.closest('[data-tooltip]');
  if (target) {
    showTooltip(target, target.getAttribute('data-tooltip'));
  }
});

document.addEventListener('mouseout', (e) => {
  const target = e.target.closest('[data-tooltip]');
  if (target) {
    hideTooltip();
  }
});

// Canvas Fuzzy Username Algorithm (exact replica of guns.lol jitter shader)
function initFuzzyUsername() {
  const canvas = document.getElementById('usernameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const text = profileConfig.username;
  const fontSize = 28;
  const fontWeight = 600;
  const fontFamily = 'Satoshi, sans-serif';

  // Create offscreen buffer canvas
  const offCanvas = document.createElement('canvas');
  const offCtx = offCanvas.getContext('2d');

  offCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  offCtx.textBaseline = 'alphabetic';
  const metrics = offCtx.measureText(text);

  const textWidth = Math.ceil(metrics.width) + 10;
  const textHeight = Math.ceil(fontSize * 1.3);

  offCanvas.width = textWidth;
  offCanvas.height = textHeight;

  offCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  offCtx.textBaseline = 'middle';
  offCtx.fillStyle = '#ffffff';
  offCtx.fillText(text, 5, textHeight / 2);

  canvas.width = textWidth;
  canvas.height = textHeight;

  let baseIntensity = 0.16;
  let isHovered = false;

  canvas.parentElement.addEventListener('mouseenter', () => { isHovered = true; });
  canvas.parentElement.addEventListener('mouseleave', () => { isHovered = false; });

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const intensity = isHovered ? 0.42 : baseIntensity;

    // Guns.lol scanline displacement slicing
    for (let y = 0; y < textHeight; y++) {
      const shift = Math.floor(intensity * (Math.random() - 0.5) * 28);
      ctx.drawImage(offCanvas, 0, y, textWidth, 1, shift, y, textWidth, 1);
    }
    requestAnimationFrame(render);
  }

  render();
}

document.fonts.ready.then(initFuzzyUsername);

// Click To Enter Overlay Handler
let siteEntered = false;

function enterSite() {
  if (siteEntered) return;
  siteEntered = true;

  clickOverlay.classList.add('fade-out');
  profileCard.classList.remove('initial-hidden');

  const bgVideo = document.getElementById('bgVideo');
  if (bgVideo && bgVideo.paused) {
    bgVideo.play().catch((err) => {
      console.warn('Video playback notice:', err);
    });
  }

  bgAudio.play().then(() => {
    updatePlayState(true);
  }).catch((err) => {
    console.warn('Autoplay blocked:', err);
    updatePlayState(false);
  });
}

clickOverlay.addEventListener('click', enterSite);
document.addEventListener('keydown', (e) => {
  if (!siteEntered && (e.key === 'Enter' || e.key === ' ')) {
    enterSite();
  }
});

// 3D Card Tilt Effect
let bounds;
function updateBounds() {
  bounds = profileCard.getBoundingClientRect();
}
window.addEventListener('resize', updateBounds);
window.addEventListener('scroll', updateBounds);

document.addEventListener('mousemove', (e) => {
  if (!bounds) updateBounds();
  const cardCenterX = bounds.left + bounds.width / 2;
  const cardCenterY = bounds.top + bounds.height / 2;

  const mouseX = e.clientX - cardCenterX;
  const mouseY = e.clientY - cardCenterY;

  const maxTilt = 9; // subtle, authentic guns.lol tilt
  const tiltX = -(mouseY / (window.innerHeight / 2)) * maxTilt;
  const tiltY = (mouseX / (window.innerWidth / 2)) * maxTilt;

  profileTiltWrapper.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
});

document.addEventListener('mouseleave', () => {
  profileTiltWrapper.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
});

// Audio Player Functions
function formatTime(seconds) {
  if (isNaN(seconds) || !Number.isFinite(seconds)) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updatePlayState(isPlaying) {
  if (isPlaying) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  } else {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  }
}

playPauseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (bgAudio.paused) {
    bgAudio.play().then(() => updatePlayState(true));
  } else {
    bgAudio.pause();
    updatePlayState(false);
  }
});

skipBackBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  bgAudio.currentTime = 0;
});

skipForwardBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  bgAudio.currentTime = 0;
  bgAudio.play();
  updatePlayState(true);
});

bgAudio.addEventListener('timeupdate', () => {
  if (!Number.isFinite(bgAudio.duration)) return;
  const percent = (bgAudio.currentTime / bgAudio.duration) * 100;
  progressFill.style.width = `${percent}%`;
  progressThumb.style.left = `${percent}%`;
  audioCurrentTime.textContent = formatTime(bgAudio.currentTime);
  const remaining = Math.max(0, bgAudio.duration - bgAudio.currentTime);
  audioDuration.textContent = `-${formatTime(remaining)}`;
});

bgAudio.addEventListener('loadedmetadata', () => {
  audioDuration.textContent = `-${formatTime(bgAudio.duration)}`;
});

// Scrubbing on Progress Bar
let isScrubbing = false;

function seekAudio(e) {
  const rect = progressBarContainer.getBoundingClientRect();
  const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  const fraction = clickX / rect.width;
  if (Number.isFinite(bgAudio.duration)) {
    bgAudio.currentTime = fraction * bgAudio.duration;
  }
}

progressBarContainer.addEventListener('mousedown', (e) => {
  isScrubbing = true;
  seekAudio(e);
});

window.addEventListener('mousemove', (e) => {
  if (isScrubbing) {
    seekAudio(e);
  }
});

window.addEventListener('mouseup', () => {
  isScrubbing = false;
});

// Volume Controls
let previousVolume = profileConfig.audio.defaultVolume;

function updateVolumeIcon(vol) {
  if (vol === 0 || bgAudio.muted) {
    speakerIcon.innerHTML = SPEAKER_SVG_MUTED;
  } else {
    speakerIcon.innerHTML = SPEAKER_SVG_HIGH;
  }
}

bgAudio.addEventListener('volumechange', () => {
  const isMuted = bgAudio.muted || bgAudio.volume === 0;
  updateVolumeIcon(isMuted ? 0 : bgAudio.volume);
  if (!isMuted && bgAudio.volume > 0) {
    previousVolume = bgAudio.volume;
  }
});

volumeToggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (bgAudio.muted || bgAudio.volume === 0) {
    bgAudio.muted = false;
    bgAudio.volume = previousVolume > 0 ? previousVolume : 0.8;
  } else {
    previousVolume = bgAudio.volume > 0 ? bgAudio.volume : 0.8;
    bgAudio.muted = true;
  }
  updateVolumeIcon(bgAudio.muted ? 0 : bgAudio.volume);
});

// Animated Browser Tab Title
const fullTitle = `@${profileConfig.username} | guns.lol`;
let titleIndex = 0;
let titleDirection = 1;

setInterval(() => {
  if (titleDirection === 1) {
    titleIndex++;
    if (titleIndex >= fullTitle.length) {
      titleDirection = -1;
    }
  } else {
    titleIndex--;
    if (titleIndex <= 1) {
      titleDirection = 1;
    }
  }
  document.title = fullTitle.slice(0, titleIndex);
}, 350);

// Interactive Sparkle Particles on Click
document.addEventListener('click', (e) => {
  const particleCount = 7;
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'click-particle';
    const angle = Math.random() * Math.PI * 2;
    const distance = 25 + Math.random() * 45;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const size = 3 + Math.random() * 4;

    p.style.left = `${e.clientX}px`;
    p.style.top = `${e.clientY}px`;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.setProperty('--tx', `${tx}px`);
    p.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(p);
    setTimeout(() => p.remove(), 600);
  }
});

// Real-Time iOS Views Counter Engine
const profileViewCountEl = document.getElementById('profileViewCount');
const viewsWidget = document.getElementById('viewsWidget');

let liveViewCount = parseInt(localStorage.getItem('monsey_views') || '2847', 10);

// Increment on visit session
if (!sessionStorage.getItem('monsey_visited')) {
  liveViewCount += 1;
  sessionStorage.setItem('monsey_visited', 'true');
  localStorage.setItem('monsey_views', liveViewCount.toString());
}

function updateLiveViewDisplay(count, shouldBump = false) {
  if (!profileViewCountEl) return;
  profileViewCountEl.textContent = Number(count).toLocaleString();
  if (shouldBump) {
    profileViewCountEl.classList.remove('bump');
    void profileViewCountEl.offsetWidth; // trigger reflow
    profileViewCountEl.classList.add('bump');
  }
}

updateLiveViewDisplay(liveViewCount);

// Simulated live real-time visitors
function scheduleNextLiveVisitor() {
  const delay = Math.floor(Math.random() * 6000) + 5000; // 5 - 11 seconds
  setTimeout(() => {
    const increment = Math.random() < 0.25 ? 2 : 1;
    liveViewCount += increment;
    localStorage.setItem('monsey_views', liveViewCount.toString());
    updateLiveViewDisplay(liveViewCount, true);
    scheduleNextLiveVisitor();
  }, delay);
}

scheduleNextLiveVisitor();

if (viewsWidget) {
  viewsWidget.addEventListener('click', (e) => {
    e.stopPropagation();
    liveViewCount += 1;
    localStorage.setItem('monsey_views', liveViewCount.toString());
    updateLiveViewDisplay(liveViewCount, true);
    showTooltip(viewsWidget, `Live Views: ${liveViewCount.toLocaleString()}`, true);
  });
}
