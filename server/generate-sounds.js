import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const audioDir = path.join(__dirname, 'audio');

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Generate simple RIFF WAV header and PCM samples
function createWavBuffer(sampleRate, durationSec, sampleFn) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const blockAlign = 2; // 16-bit mono = 2 bytes
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(1, 22);  // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = sampleFn(t, durationSec);
    sample = Math.max(-1, Math.min(1, sample));
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

// 1. Pop Sound (iOS message received bubble pop)
const sampleRate = 44100;
const popWav = createWavBuffer(sampleRate, 0.12, (t, dur) => {
  const env = Math.exp(-t * 35);
  const freq = 600 - t * 2500;
  return Math.sin(2 * Math.PI * freq * t) * env;
});
fs.writeFileSync(path.join(audioDir, 'pop.wav'), popWav);

// 2. Send Sound (iOS message sent whoosh/pop)
const sendWav = createWavBuffer(sampleRate, 0.18, (t, dur) => {
  const env = Math.exp(-t * 18);
  const freq = 380 + Math.sin(t * 50) * 100 + t * 400;
  return (Math.sin(2 * Math.PI * freq * t) * 0.7 + (Math.random() - 0.5) * 0.15) * env;
});
fs.writeFileSync(path.join(audioDir, 'send.wav'), sendWav);

// 3. Ding Sound (iOS notification chime)
const dingWav = createWavBuffer(sampleRate, 0.35, (t, dur) => {
  const env = Math.exp(-t * 12);
  const s1 = Math.sin(2 * Math.PI * 1318.5 * t); // E6
  const s2 = Math.sin(2 * Math.PI * 2093.0 * t) * 0.5; // C7
  return (s1 + s2) * 0.5 * env;
});
fs.writeFileSync(path.join(audioDir, 'ding.wav'), dingWav);

console.log('Successfully generated sound effects: pop.wav, send.wav, ding.wav in server/audio/');
