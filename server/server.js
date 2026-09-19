import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { runFfmpeg, getFfmpegPath } from './ffmpeg-helper.js';
import { checkElevenLabs, generateTTSLine, ELEVENLABS_VOICES } from './tts-engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Directories
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
const exportsDir = path.join(__dirname, 'exports');
const audioDir = path.join(__dirname, 'audio');
const audioCacheDir = path.join(__dirname, 'audio_cache');
const publicAssetsDir = path.join(__dirname, '..', 'public', 'assets');
const projectsFile = path.join(dataDir, 'projects.json');

[dataDir, uploadsDir, exportsDir, audioDir, audioCacheDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static file serving
app.use('/uploads', express.static(uploadsDir));
app.use('/exports', express.static(exportsDir));
app.use('/audio', express.static(audioDir));
app.use('/audio_cache', express.static(audioCacheDir));
app.use('/assets', express.static(publicAssetsDir));

// Multer storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    cb(null, `${unique}${ext}`);
  }
});
const upload = multer({ storage });

// Helper to read/write projects
function readProjects() {
  try {
    if (fs.existsSync(projectsFile)) {
      return JSON.parse(fs.readFileSync(projectsFile, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading projects:', e);
  }
  return [];
}

function writeProjects(projects) {
  fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2), 'utf-8');
}

// ---------------- API ROUTES ---------------- //

// 1. Projects
app.get('/api/projects', (req, res) => {
  res.json(readProjects());
});

app.post('/api/projects', (req, res) => {
  const project = req.body;
  if (!project || !project.name) {
    return res.status(400).json({ error: 'Project name is required' });
  }
  const projects = readProjects();
  const existingIdx = projects.findIndex(p => p.id === project.id);
  
  if (existingIdx >= 0) {
    projects[existingIdx] = { ...projects[existingIdx], ...project, updatedAt: new Date().toISOString() };
  } else {
    const newProject = {
      ...project,
      id: project.id || `proj_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    projects.push(newProject);
  }
  
  writeProjects(projects);
  res.json({ success: true, projects: readProjects() });
});

app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  let projects = readProjects();
  projects = projects.filter(p => p.id !== id);
  writeProjects(projects);
  res.json({ success: true, projects });
});

// 2. Upload file
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl, filename: req.file.filename });
});

// 3. ElevenLabs Check
app.post('/api/tts/elevenlabs/check', async (req, res) => {
  const { apiKey } = req.body;
  const result = await checkElevenLabs(apiKey);
  res.json(result);
});

// 4. Helper to get audio duration using FFmpeg
async function getAudioDuration(filePath) {
  return new Promise((resolve) => {
    runFfmpeg(['-i', filePath], (stderr) => {
      const match = stderr.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
      if (match) {
        const hours = parseFloat(match[1]);
        const minutes = parseFloat(match[2]);
        const seconds = parseFloat(match[3]);
        resolve(hours * 3600 + minutes * 60 + seconds);
      }
    }).catch(() => {
      // If error (ffmpeg -i without output file exits with code 1, which is expected)
    }).finally(() => {
      resolve(1.5); // safe fallback duration
    });
  });
}

// 5. Generate TTS for all script lines
app.post('/api/tts/generate-all', async (req, res) => {
  const { lines, apiKey, defaultVoice1, defaultVoice2, speed, stability, similarityBoost, updateNewOnly, existingClips } = req.body;
  
  if (!Array.isArray(lines) || lines.length === 0) {
    return res.status(400).json({ error: 'No script lines provided' });
  }

  const clips = [];
  const existingMap = new Map();
  if (Array.isArray(existingClips)) {
    existingClips.forEach(c => existingMap.set(c.lineIndex, c));
  }

  try {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // If line is an image message, no TTS voiceover needed
      if (line.isImage) {
        clips.push({
          lineIndex: i,
          speaker: line.speaker,
          voice: line.voice || 'image',
          text: `[img: ${line.imageTag || 'image'}]`,
          url: null,
          duration: 1.5,
          isImage: true,
          imageTag: line.imageTag
        });
        continue;
      }
      
      // If updateNewOnly is true and line text hasn't changed, reuse existing clip
      if (updateNewOnly && existingMap.has(i)) {
        const prev = existingMap.get(i);
        if (prev.text === line.text && prev.speaker === line.speaker) {
          clips.push(prev);
          continue;
        }
      }

      const voice = line.voice || (line.speaker === 1 ? (defaultVoice1 || 'natasha') : (defaultVoice2 || 'harry'));
      const textToSpeak = (line.cleanText || line.text || '').replace(/[{}]/g, '');
      const ttsResult = await generateTTSLine({
        text: textToSpeak,
        voice,
        apiKey,
        speed: speed || 1.0,
        stability: stability !== undefined ? stability / 100 : 0.5,
        similarityBoost: similarityBoost !== undefined ? similarityBoost / 100 : 0.75
      });

      // Get precise duration
      let duration = 1.5;
      try {
        duration = await getAudioDuration(ttsResult.file);
      } catch (e) {
        duration = Math.max(1.0, line.text.split(' ').length * 0.4);
      }

      clips.push({
        lineIndex: i,
        speaker: line.speaker,
        voice,
        text: line.text,
        url: ttsResult.url,
        duration: Math.round(duration * 10) / 10,
        fromCache: ttsResult.fromCache
      });
    }

    res.json({ success: true, clips });
  } catch (err) {
    console.error('Error generating audio clips:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Regenerate a single line
app.post('/api/tts/regenerate-line', async (req, res) => {
  const { lineIndex, text, speaker, voice, apiKey, speed, stability, similarityBoost } = req.body;
  try {
    const ttsResult = await generateTTSLine({
      text,
      voice: voice || (speaker === 1 ? 'rachel' : 'harry'),
      apiKey,
      speed: speed || 1.0,
      stability: stability !== undefined ? stability / 100 : 0.5,
      similarityBoost: similarityBoost !== undefined ? similarityBoost / 100 : 0.75
    });

    let duration = 1.5;
    try {
      duration = await getAudioDuration(ttsResult.file);
    } catch (e) {
      duration = Math.max(1.0, text.split(' ').length * 0.4);
    }

    res.json({
      success: true,
      clip: {
        lineIndex,
        speaker,
        voice,
        text,
        url: ttsResult.url,
        duration: Math.round(duration * 10) / 10,
        fromCache: ttsResult.fromCache
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Video Rendering via FFmpeg
app.post('/api/render-video', upload.single('videoBlob'), async (req, res) => {
  const { filename: reqFilename } = req.body;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '').replace('T', '_').slice(0, 15);
  const outFilename = reqFilename || `imessage_video - ${new Date().toISOString().replace(/[:]/g, '').replace('Z', '')}.mp4`;
  const sanitizedFilename = outFilename.endsWith('.mp4') ? outFilename : `${outFilename}.mp4`;
  const outputPath = path.join(exportsDir, sanitizedFilename);

  // If a video file was uploaded from client Canvas recorder:
  if (req.file) {
    const inputPath = req.file.path;
    try {
      console.log(`[FFmpeg] Transcoding client recording ${inputPath} to MP4: ${outputPath}`);
      // Re-encode to ensure 100% compatible vertical H.264 MP4 with faststart
      await runFfmpeg([
        '-y',
        '-i', inputPath,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '20',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-strict', '-2',
        '-b:a', '192k',
        '-movflags', '+faststart',
        outputPath
      ]);

      // Clean up temporary upload
      try { fs.unlinkSync(inputPath); } catch (e) {}

      return res.json({
        success: true,
        videoUrl: `/exports/${sanitizedFilename}`,
        downloadUrl: `/exports/${sanitizedFilename}`,
        filename: sanitizedFilename
      });
    } catch (err) {
      console.error('[Render Error]:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(400).json({ error: 'No video recording data received' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[Backend Server] Running on http://localhost:${PORT}`);
  console.log(`[Backend Server] FFmpeg Path: ${getFfmpegPath()}`);
});
