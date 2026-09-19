import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cacheDir = path.join(__dirname, 'audio_cache');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// ElevenLabs default voice IDs
export const ELEVENLABS_VOICES = {
  natasha: 'uxKr2vlA4hYgXZR1oPRT',
  rachel: '21m00Tcm4TlvDq8ikWAM',
  harry: 'SOYHLrjzK2X1ezoPC6cr',
  charlotte: 'XB0fDUnXU5ikFXcvcxZs',
  alice: 'Xb7hH8MSUJpSbSDYk0k2',
  adam: 'pNInz6obpgDQGcFmaJgB',
  charlie: 'IKne3meq5aSn9XLyUdCD',
  george: 'JBFqnCBsd6RMkjVDRZzb',
  callum: 'N2lVS1w4EtoT3dr4eOWO',
  brian: 'nPczCjzI2devNBz1zQrb',
  sarah: 'EXAVITQu4vr4xnSDxMaL',
  lily: 'pFZP5JQG7iQjIQuC4Bku',
  daniel: 'onwK4e9ZLuTAKqWW03F9',
  chris: 'iP95p4xoKVk53GoZ742B',
  eric: 'cjVigY5qzO86Huf0OWal',
  jessica: 'cgSgspJ2msm6clMCkdW9',
  liam: 'TX3LPaxmHKxFdv7VOQHJ',
  will: 'bIHbv24MWmeRgasZH58o'
};

// Cached voices from user's ElevenLabs account
let cachedUserVoices = null;
let lastCachedApiKey = null;

async function resolveVoiceId(voiceName, apiKey) {
  const norm = (voiceName || '').toLowerCase().trim();
  
  // If norm matches static table
  if (ELEVENLABS_VOICES[norm]) {
    return ELEVENLABS_VOICES[norm];
  }

  // If it's already a raw ElevenLabs Voice ID (e.g. 20 chars alphanumeric)
  if (/^[a-zA-Z0-9]{18,24}$/.test(norm)) {
    return voiceName.trim();
  }

  // Attempt dynamic lookup from user's account if API key provided
  if (apiKey) {
    try {
      if (!cachedUserVoices || lastCachedApiKey !== apiKey) {
        const res = await fetch('https://api.elevenlabs.io/v1/voices', {
          headers: { 'xi-api-key': apiKey }
        });
        if (res.ok) {
          const data = await res.json();
          cachedUserVoices = data.voices || [];
          lastCachedApiKey = apiKey;
        }
      }
      if (cachedUserVoices) {
        const found = cachedUserVoices.find(v => v.name.toLowerCase() === norm || v.voice_id === norm);
        if (found) return found.voice_id;
      }
    } catch (e) {
      console.warn('[resolveVoiceId] Could not query account voices:', e.message);
    }
  }

  return ELEVENLABS_VOICES.rachel;
}

// Check ElevenLabs user account status and character limit
export async function checkElevenLabs(apiKey) {
  if (!apiKey) {
    return { valid: false, error: 'No API key provided' };
  }
  try {
    const res = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
      headers: { 'xi-api-key': apiKey }
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { valid: false, error: errData.detail?.message || `HTTP ${res.status}` };
    }
    const data = await res.json();
    const characterCount = data.character_count || 0;
    const characterLimit = data.character_limit || 10000;
    const remaining = Math.max(0, characterLimit - characterCount);
    const percent = ((remaining / characterLimit) * 100).toFixed(1);

    return {
      valid: true,
      tier: data.tier || 'free',
      characterCount,
      characterLimit,
      remaining,
      percent,
      status: data.status || 'active'
    };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

// Generate TTS for a line
export async function generateTTSLine({ text, voice = 'rachel', apiKey = '', speed = 1.0, stability = 0.5, similarityBoost = 0.75 }) {
  // Strip censor brackets {...} and (...) so ElevenLabs pronounces clean words
  const cleanText = text.replace(/[{}]/g, '').trim();
  const hash = crypto.createHash('md5').update(`${cleanText}_${voice}_${speed}_${apiKey ? 'el' : 'free'}`).digest('hex');
  const cacheFile = path.join(cacheDir, `${hash}.mp3`);
  const wavCacheFile = path.join(cacheDir, `${hash}.wav`);

  if (fs.existsSync(cacheFile)) {
    return { file: cacheFile, url: `/audio_cache/${hash}.mp3`, fromCache: true };
  }
  if (fs.existsSync(wavCacheFile)) {
    return { file: wavCacheFile, url: `/audio_cache/${hash}.wav`, fromCache: true };
  }

  // 1. If ElevenLabs API Key is provided:
  if (apiKey) {
    try {
      const voiceId = await resolveVoiceId(voice, apiKey);
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: Number(stability) || 0.5,
            similarity_boost: Number(similarityBoost) || 0.75,
            speed: Number(speed) || 1.0
          }
        })
      });

      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);
        fs.writeFileSync(cacheFile, buffer);
        return { file: cacheFile, url: `/audio_cache/${hash}.mp3`, fromCache: false };
      } else {
        console.warn('[ElevenLabs] Failed, falling back to built-in TTS:', await res.text());
      }
    } catch (err) {
      console.warn('[ElevenLabs] Error, falling back:', err.message);
    }
  }

  // 2. Try Google Translate TTS (Free, natural online speech)
  try {
    const isMale = ['harry', 'adam', 'charlie', 'george', 'michael'].includes(voice.toLowerCase());
    const lang = isMale ? 'en-uk' : 'en-us';
    const encoded = encodeURIComponent(cleanText);
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encoded}`;
    
    const res = await fetch(googleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (res.ok) {
      const arrayBuf = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      if (buffer.length > 500) {
        fs.writeFileSync(cacheFile, buffer);
        return { file: cacheFile, url: `/audio_cache/${hash}.mp3`, fromCache: false };
      }
    }
  } catch (err) {
    console.warn('[Google TTS] Error, falling back to SAPI:', err.message);
  }

  // 3. Native Windows SpeechSynthesizer fallback (Offline, 100% reliable)
  return new Promise((resolve, reject) => {
    const isMale = ['harry', 'adam', 'charlie', 'george', 'michael'].includes(voice.toLowerCase());
    const voiceName = isMale ? 'Microsoft David Desktop' : 'Microsoft Zira Desktop';
    const escapedText = cleanText.replace(/'/g, "''").replace(/"/g, '`"');
    const psCommand = `Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; try { $s.SelectVoice('${voiceName}') } catch {}; $s.Rate = ${Math.round((speed - 1) * 5)}; $s.SetOutputToWaveFile('${wavCacheFile.replace(/\\/g, '\\\\')}'); $s.Speak('${escapedText}'); $s.Dispose();`;

    exec(`powershell -NoProfile -Command "${psCommand}"`, (error) => {
      if (error || !fs.existsSync(wavCacheFile)) {
        reject(new Error(`Local TTS failed: ${error ? error.message : 'File not generated'}`));
      } else {
        resolve({ file: wavCacheFile, url: `/audio_cache/${hash}.wav`, fromCache: false });
      }
    });
  });
}
