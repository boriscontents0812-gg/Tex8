/**
 * Video Rendering and Recording Pipeline
 * Faithfully replicates the exact video output of botsy.app (e.g. imessage_video - 2026-09-19T120609.890.mp4)
 * - 1080x1920 resolution at 60 FPS
 * - Pure #00FF00 chroma key green background
 * - Centered floating white card (810px width) with square/rounded corners
 * - iOS contact header: blue chevron <, avatar circle, contact name Laura❤️ >, FaceTime camera icon, divider line
 * - Authentic iMessage bubble tails on left and right messages
 * - Synchronized pop and send sound effects + TTS voice clips
 * - Transcoded with FFmpeg to standard H.264/AAC MP4
 */

export async function renderAndRecordVideo({
  scriptData,
  audioClips,
  settings,
  platform = 'ios',
  theme = 'light',
  contactPhotos = {},
  scriptImages = {},
  onProgress = () => {}
}) {
  onProgress('Preparing 1080x1920 60fps video canvas and audio tracks...');

  const W = 1080;
  const H = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Preload images
  const loadedImages = {};
  for (const [tag, url] of Object.entries(scriptImages)) {
    if (url) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = url;
        await new Promise(r => { img.onload = r; img.onerror = r; });
        loadedImages[tag] = img;
      } catch (e) {}
    }
  }

  // Preload avatar only if custom image is uploaded (avoid hardcoded Laura L fallback)
  let avatarImg = null;
  const rawContactName = scriptData.contactName || 'Natasha 💖';
  const customPhoto = contactPhotos[rawContactName];
  const hasUploadedPhoto = customPhoto && !customPhoto.includes('avatar-laura.svg');
  if (hasUploadedPhoto) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = customPhoto;
      await new Promise(r => { img.onload = r; img.onerror = r; });
      avatarImg = img;
    } catch (e) {}
  }

  // Web Audio Context
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();
  const dest = audioCtx.createMediaStreamDestination();

  // Load sound effects
  async function loadAudioBuffer(url) {
    try {
      const res = await fetch(url);
      const arrayBuf = await res.arrayBuffer();
      return await audioCtx.decodeAudioData(arrayBuf);
    } catch (e) {
      return null;
    }
  }

  const popBuffer = await loadAudioBuffer('/audio/pop.wav');
  const sendBuffer = await loadAudioBuffer('/audio/send.wav');

  // Calculate message timelines
  let currentTime = 0.35; // initial brief lead-in
  const timeline = [];
  const messagesPerPage = settings.messagesPerPage || 4;

  for (let i = 0; i < scriptData.lines.length; i++) {
    const line = scriptData.lines[i];
    const clip = audioClips && audioClips[i];
    const duration = clip ? clip.duration : (line.isImage ? 2.0 : Math.max(1.2, line.text.split(' ').length * 0.4));
    const pageIndex = Math.floor(i / messagesPerPage);

    timeline.push({
      line,
      clip,
      pageIndex,
      startTime: currentTime,
      duration,
      endTime: currentTime + duration,
      image: line.isImage && line.imageTag ? loadedImages[line.imageTag] : null
    });

    currentTime += duration + (line.pauseAfter || 0.3);
  }

  const totalDuration = currentTime + 0.6; // brief tail

  // Schedule Audio Playback into Destination Stream
  timeline.forEach(item => {
    // Message SFX (pop for 1, send for 2)
    const sfxBuffer = item.line.speaker === 1 ? popBuffer : sendBuffer;
    if (sfxBuffer && settings.notificationSound !== false) {
      const sfxSource = audioCtx.createBufferSource();
      sfxSource.buffer = sfxBuffer;
      sfxSource.connect(dest);
      sfxSource.start(audioCtx.currentTime + item.startTime);
    }

    // TTS Voiceover Clip
    if (item.clip && item.clip.url) {
      fetch(item.clip.url)
        .then(r => r.arrayBuffer())
        .then(buf => audioCtx.decodeAudioData(buf))
        .then(decoded => {
          const voiceSource = audioCtx.createBufferSource();
          voiceSource.buffer = decoded;
          voiceSource.connect(dest);
          voiceSource.start(audioCtx.currentTime + item.startTime);
        })
        .catch(err => console.warn('Could not schedule audio clip:', err));
    }
  });

  // Setup MediaRecorder at 60 FPS
  const canvasStream = canvas.captureStream(60);
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...dest.stream.getAudioTracks()
  ]);

  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
    ? 'video/webm;codecs=vp9,opus'
    : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
      ? 'video/webm;codecs=vp8,opus'
      : 'video/webm';

  const recorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: 8000000 // 8 Mbps
  });

  const recordedChunks = [];
  recorder.ondataavailable = e => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };

  recorder.start(50);

  // 60 FPS Animation & Drawing Loop
  const startTime = performance.now();

  function drawFrame() {
    const elapsed = (performance.now() - startTime) / 1000;
    renderReferenceFrame(ctx, W, H, elapsed, timeline, scriptData, settings, platform, theme, avatarImg);

    onProgress(`Rendering frames: ${Math.min(100, Math.round((elapsed / totalDuration) * 100))}% (${elapsed.toFixed(1)}s / ${totalDuration.toFixed(1)}s)`);

    if (elapsed < totalDuration) {
      requestAnimationFrame(drawFrame);
    } else {
      recorder.stop();
    }
  }

  requestAnimationFrame(drawFrame);

  // Wait for WebM recording
  const recordedBlob = await new Promise(resolve => {
    recorder.onstop = () => {
      resolve(new Blob(recordedChunks, { type: mimeType }));
    };
  });

  onProgress('Encoding high-definition 1080x1920 MP4 with FFmpeg...');

  // Send to backend FFmpeg for H.264 + AAC MP4 conversion
  const formData = new FormData();
  formData.append('videoBlob', recordedBlob, 'recording.webm');
  formData.append('filename', `imessage_video - ${new Date().toISOString().replace(/[:.]/g, '').replace('T', '_').slice(0, 15)}.mp4`);

  const res = await fetch('/api/render-video', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Transcode failed' }));
    throw new Error(err.error || 'FFmpeg transcode failed');
  }

  const result = await res.json();
  onProgress(`Video ready! 0.0s - generated in ${totalDuration.toFixed(1)}s`);
  return result;
}

/**
 * Renders a single frame matching the exact visual style of:
 * imessage_video - 2026-09-19T120609.890.mp4
 */
function renderReferenceFrame(ctx, W, H, elapsed, timeline, scriptData, settings, platform, theme, avatarImg) {
  // 1. Background (Pure Chroma Key Green #00FF00)
  const gameplay = settings.gameplay || 'greenscreen';
  if (gameplay === 'greenscreen') {
    ctx.fillStyle = '#00FF00';
  } else if (gameplay === 'dark') {
    ctx.fillStyle = '#0b0f19';
  } else {
    ctx.fillStyle = '#00FF00';
  }
  ctx.fillRect(0, 0, W, H);

  // 2. Determine Active Page and Visible Messages
  let activePageIndex = 0;
  for (let i = 0; i < timeline.length; i++) {
    if (elapsed >= timeline[i].startTime) {
      activePageIndex = timeline[i].pageIndex;
    }
  }

  const pageMessages = timeline.filter(t => t.pageIndex === activePageIndex && elapsed >= t.startTime);

  // 3. Layout Dimensions
  const containerW = 810;
  const containerX = Math.round((W - containerW) / 2); // 135px
  const containerY = Math.round(345 * ((settings.chatYPosition || 50) / 50));
  const isSquareCorners = settings.containerCorners === 'square';
  const cornerRadius = isSquareCorners ? 0 : 28;

  const headerH = 184;
  const fontSize = Math.round(36 * ((settings.bubbleScale || 110) / 100));
  const lineH = Math.round(fontSize * 1.35);
  const bubblePaddingX = 30;
  const bubblePaddingY = 18;
  const bubbleGap = 22;
  const maxBubbleW = Math.round(containerW * ((settings.maxBubbleWidth || 80) / 100)); // ~640px

  // Pre-calculate heights of visible bubbles to determine dynamic container height
  ctx.font = `400 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif`;

  let totalContentH = 0;
  const computedBubbles = pageMessages.map(item => {
    let bW = 0;
    let bH = 0;
    let lines = [];

    if (item.line.isImage) {
      bW = Math.min(maxBubbleW, 520);
      bH = Math.round(bW * 0.72);
    } else {
      lines = wrapText(ctx, item.line.text, maxBubbleW - (bubblePaddingX * 2));
      lines.forEach(l => {
        const cleanL = l.replace(/[{}]/g, '');
        const w = ctx.measureText(cleanL).width;
        if (w > bW) bW = w;
      });
      bW = Math.min(maxBubbleW, Math.max(120, bW + (bubblePaddingX * 2)));
      bH = Math.round(lines.length * lineH + (bubblePaddingY * 2));
    }

    const res = { item, bW, bH, lines };
    totalContentH += bH + bubbleGap;
    return res;
  });

  // Dynamic Container Height
  const bottomPadding = 26;
  const containerH = headerH + totalContentH + bottomPadding;

  // 4. Draw White Chat Container Card
  const isDark = theme === 'dark';
  ctx.save();
  ctx.fillStyle = isDark ? '#1c1c1e' : '#ffffff';

  if (cornerRadius > 0) {
    drawRoundRect(ctx, containerX, containerY, containerW, containerH, cornerRadius);
    ctx.fill();
    ctx.clip();
  } else {
    ctx.fillRect(containerX, containerY, containerW, containerH);
  }

  // 5. Header
  const headerY = containerY;

  // Header Background
  ctx.fillStyle = isDark ? '#1c1c1e' : '#ffffff';
  ctx.fillRect(containerX, headerY, containerW, headerH);

  // Left Chevron <
  ctx.strokeStyle = '#007aff';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(containerX + 48, headerY + 70);
  ctx.lineTo(containerX + 36, headerY + 84);
  ctx.lineTo(containerX + 48, headerY + 98);
  ctx.stroke();

  // Avatar Circle (Center)
  const avatarSize = 94;
  const avatarX = Math.round(W / 2 - avatarSize / 2);
  const avatarY = headerY + 22;

  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.clip();
  if (avatarImg) {
    ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
  } else {
    const grad = ctx.createLinearGradient(avatarX, avatarY, avatarX, avatarY + avatarSize);
    grad.addColorStop(0, '#8E8E93');
    grad.addColorStop(1, '#636366');
    ctx.fillStyle = grad;
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 46px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const letterMatch = (scriptData.contactName || 'Natasha').match(/[a-zA-Z0-9]/);
    const initial = letterMatch ? letterMatch[0].toUpperCase() : ((scriptData.contactName || 'N').trim().slice(0, 2) || 'N');
    ctx.fillText(initial, avatarX + avatarSize / 2, avatarY + avatarSize / 2);
  }
  ctx.restore();

  // Contact Name + Chevron
  const nameText = scriptData.contactName || 'Natasha 💖';
  ctx.fillStyle = isDark ? '#ffffff' : '#000000';
  ctx.font = '600 27px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(nameText, W / 2 - 8, headerY + 154);

  // Small grey chevron >
  const nameWidth = ctx.measureText(nameText).width;
  ctx.fillStyle = '#8e8e93';
  ctx.font = '600 20px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('>', W / 2 + (nameWidth / 2) + 6, headerY + 152);

  // Right FaceTime Camera Icon
  const camX = containerX + containerW - 74;
  const camY = headerY + 68;
  drawFaceTimeIcon(ctx, camX, camY, '#007aff');

  // Divider Line below header
  ctx.strokeStyle = isDark ? '#2c2c2e' : '#e5e5ea';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(containerX, headerY + headerH);
  ctx.lineTo(containerX + containerW, headerY + headerH);
  ctx.stroke();

  // 6. Draw Message Bubbles with Authentic iMessage Tails
  let currentBubbleY = headerY + headerH + 24;

  computedBubbles.forEach(({ item, bW, bH, lines }) => {
    const isSent = item.line.speaker === 2;
    const timeSinceAppear = elapsed - item.startTime;
    const popProgress = Math.min(1.0, timeSinceAppear * 9); // fast snap-in
    const bubbleX = isSent ? (containerX + containerW - 36 - bW) : (containerX + 36);

    ctx.save();

    // Scale pop-in animation
    if (popProgress < 1.0) {
      ctx.translate(bubbleX + bW / 2, currentBubbleY + bH / 2);
      ctx.scale(0.88 + 0.12 * popProgress, 0.88 + 0.12 * popProgress);
      ctx.translate(-(bubbleX + bW / 2), -(currentBubbleY + bH / 2));
      ctx.globalAlpha = popProgress;
    }

    if (item.line.isImage && item.image) {
      // Draw Attached Image
      ctx.save();
      drawRoundRect(ctx, bubbleX, currentBubbleY, bW, bH, 26);
      ctx.clip();
      ctx.drawImage(item.image, bubbleX, currentBubbleY, bW, bH);
      ctx.restore();
    } else {
      // Draw Authentic iMessage Bubble
      if (isSent) {
        // Outgoing Blue Bubble (#007aff) with right tail
        ctx.fillStyle = '#007aff';
        drawIosRightBubble(ctx, bubbleX, currentBubbleY, bW, bH, 32);

        // White text
        ctx.fillStyle = '#ffffff';
        ctx.font = `400 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        lines.forEach((line, idx) => {
          drawCensoredCanvasLine(ctx, line, bubbleX + bubblePaddingX - 2, currentBubbleY + bubblePaddingY + (idx + 0.82) * lineH, true, isDark, fontSize);
        });
      } else {
        // Incoming Grey Bubble (#e9e9eb) with left tail
        ctx.fillStyle = isDark ? '#26252a' : '#e9e9eb';
        drawIosLeftBubble(ctx, bubbleX, currentBubbleY, bW, bH, 32);

        // Black/White text
        ctx.fillStyle = isDark ? '#ffffff' : '#000000';
        ctx.font = `400 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        lines.forEach((line, idx) => {
          drawCensoredCanvasLine(ctx, line, bubbleX + bubblePaddingX + 2, currentBubbleY + bubblePaddingY + (idx + 0.82) * lineH, false, isDark, fontSize);
        });
      }
    }

    ctx.restore();
    currentBubbleY += bH + bubbleGap;
  });

  ctx.restore(); // Restore Container clip
}

// Authentic iOS Left Bubble with Tail
function drawIosLeftBubble(ctx, x, y, w, h, r = 32) {
  ctx.beginPath();
  // Top-left
  ctx.moveTo(x + r, y);
  // Top edge to top-right
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  // Right edge down to bottom-right
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  // Bottom edge towards bottom-left
  ctx.lineTo(x + 22, y + h);
  // Left tail curve
  ctx.bezierCurveTo(x + 10, y + h, x - 2, y + h + 2, x - 12, y + h + 2);
  ctx.bezierCurveTo(x - 2, y + h - 4, x + 2, y + h - 14, x + 2, y + h - 22);
  // Left edge up to top-left
  ctx.lineTo(x + 2, y + r);
  ctx.arcTo(x + 2, y, x + r, y, r);
  ctx.closePath();
  ctx.fill();
}

// Authentic iOS Right Bubble with Tail
function drawIosRightBubble(ctx, x, y, w, h, r = 32) {
  ctx.beginPath();
  // Top-left
  ctx.moveTo(x + r, y);
  // Top edge to top-right
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  // Right edge down to tail
  ctx.lineTo(x + w - 2, y + h - 22);
  // Right tail curve
  ctx.bezierCurveTo(x + w - 2, y + h - 14, x + w + 2, y + h - 4, x + w + 12, y + h + 2);
  ctx.bezierCurveTo(x + w + 2, y + h + 2, x + w - 10, y + h, x + w - 22, y + h);
  // Bottom edge to bottom-left
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  // Left edge up to top-left
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  ctx.fill();
}

// FaceTime Video Icon
function drawFaceTimeIcon(ctx, x, y, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Camera Body
  drawRoundRect(ctx, x, y, 36, 26, 7);
  ctx.stroke();

  // Camera Lens
  ctx.beginPath();
  ctx.moveTo(x + 36, y + 8);
  ctx.lineTo(x + 48, y + 2);
  ctx.lineTo(x + 48, y + 24);
  ctx.lineTo(x + 36, y + 18);
  ctx.closePath();
  ctx.stroke();
}

// Rounded Rectangle
function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// Word wrapping helper (measures line width excluding censor brackets)
function wrapText(ctx, text, maxWidth) {
  const words = (text || '').split(' ');
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
    const cleanTestLine = testLine.replace(/[{}]/g, '');
    const metrics = ctx.measureText(cleanTestLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// Canvas Line Renderer with Gaussian Blur Censor Tape
function drawCensoredCanvasLine(ctx, lineText, startX, y, isSent, isDark, fontSize) {
  if (!lineText.includes('{')) {
    ctx.fillText(lineText, startX, y);
    return;
  }

  // Split line by censor blocks {...}
  const parts = [];
  const regex = /\{([^}]+)\}/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(lineText)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ censored: false, text: lineText.substring(lastIndex, match.index) });
    }
    parts.push({ censored: true, text: match[1] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < lineText.length) {
    parts.push({ censored: false, text: lineText.substring(lastIndex) });
  }

  let curX = startX;
  parts.forEach(part => {
    const partW = ctx.measureText(part.text).width;
    if (!part.censored) {
      ctx.fillText(part.text, curX, y);
    } else {
      // 1. Draw Gaussian Blurred Letters
      ctx.save();
      ctx.filter = 'blur(6px)';
      ctx.fillText(part.text, curX, y);
      ctx.restore();

      // 2. Draw Frosted Censor Tape Overlay
      ctx.save();
      const tapePadX = 4;
      const tapeX = curX - tapePadX;
      const tapeY = y - fontSize * 0.84;
      const tapeW = partW + tapePadX * 2;
      const tapeH = fontSize * 1.08;

      ctx.fillStyle = isSent
        ? 'rgba(255, 255, 255, 0.42)'
        : (isDark ? 'rgba(255, 255, 255, 0.32)' : 'rgba(0, 0, 0, 0.16)');
      ctx.strokeStyle = isSent
        ? 'rgba(255, 255, 255, 0.68)'
        : (isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.25)');
      ctx.lineWidth = 1.5;
      drawRoundRect(ctx, tapeX, tapeY, tapeW, tapeH, 4);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    curX += partW;
  });
}

