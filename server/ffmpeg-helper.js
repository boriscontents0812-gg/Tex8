import fs from 'fs';
import { spawn } from 'child_process';

const candidatePaths = [
  'C:\\KMPlayer\\ffmpeg.exe',
  'C:\\Program Files\\KMPlayer 64X\\LAVFilters64\\ffmpeg.exe',
  'C:\\Program Files\\Topaz Labs LLC\\Topaz Video AI\\ffmpeg.exe',
  'ffmpeg'
];

let cachedFfmpegPath = null;

export function getFfmpegPath() {
  if (cachedFfmpegPath) return cachedFfmpegPath;

  for (const p of candidatePaths) {
    if (p !== 'ffmpeg' && fs.existsSync(p)) {
      cachedFfmpegPath = p;
      return p;
    }
  }

  return 'ffmpeg';
}

export function runFfmpeg(args, onProgress) {
  return new Promise((resolve, reject) => {
    const ffmpegPath = getFfmpegPath();
    console.log(`[FFmpeg] Executing: "${ffmpegPath}" ${args.join(' ')}`);

    const proc = spawn(ffmpegPath, args);
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      const text = data.toString();
      stderr += text;
      if (onProgress) {
        onProgress(text);
      }
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        console.error(`[FFmpeg Error] Code ${code}:\n${stderr.slice(-500)}`);
        reject(new Error(`FFmpeg process exited with code ${code}: ${stderr.slice(-300)}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}
