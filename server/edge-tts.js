import WebSocket from 'ws';
import crypto from 'crypto';

const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EA654081839223871393E37D';
const WSS_URL = `wss://speech.platform.bing.com/consumer/speech/synthesize/readahead/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}`;

// Map voice names to Edge Neural Voice identifiers
export const VOICE_MAP = {
  // Female voices
  rachel: 'en-US-JennyNeural',
  laura: 'en-US-JennyNeural',
  charlotte: 'en-US-AriaNeural',
  alice: 'en-US-AvaNeural',
  emily: 'en-GB-SoniaNeural',
  // Male voices
  harry: 'en-US-GuyNeural',
  adam: 'en-US-ChristopherNeural',
  charlie: 'en-US-BrianNeural',
  george: 'en-GB-RyanNeural',
  michael: 'en-US-EricNeural'
};

function getVoiceName(voiceId) {
  const normalized = (voiceId || '').toLowerCase().trim();
  return VOICE_MAP[normalized] || VOICE_MAP.harry;
}

export function synthesizeEdgeTTS(text, voice = 'harry', rate = 1.0) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(WSS_URL, {
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
        'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold'
      }
    });

    const voiceName = getVoiceName(voice);
    const ratePercent = Math.round((rate - 1.0) * 100);
    const rateStr = `${ratePercent >= 0 ? '+' : ''}${ratePercent}%`;
    const requestId = crypto.randomUUID().replace(/-/g, '');
    const audioChunks = [];

    const timeout = setTimeout(() => {
      try { ws.terminate(); } catch (e) {}
      reject(new Error('Edge TTS request timed out'));
    }, 12000);

    ws.on('open', () => {
      // 1. Send speech.config
      const configMsg = `X-Timestamp:${new Date().toISOString()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`;
      ws.send(configMsg);

      // 2. Send SSML request
      const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${voiceName}'><prosody pitch='+0Hz' rate='${rateStr}'>${escapeXml(text)}</prosody></voice></speak>`;
      const reqMsg = `X-RequestId:${requestId}\r\nX-Timestamp:${new Date().toISOString()}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n${ssml}`;
      ws.send(reqMsg);
    });

    ws.on('message', (data, isBinary) => {
      if (isBinary) {
        // Binary message contains 2-byte header length, followed by header, followed by audio data
        const headerLen = data.readUInt16BE(0);
        const header = data.subarray(2, 2 + headerLen).toString('utf-8');
        if (header.includes('Path:audio')) {
          const audioChunk = data.subarray(2 + headerLen);
          audioChunks.push(audioChunk);
        }
      } else {
        const textMsg = data.toString('utf-8');
        if (textMsg.includes('Path:turn.end')) {
          clearTimeout(timeout);
          ws.close();
          const fullAudio = Buffer.concat(audioChunks);
          resolve(fullAudio);
        }
      }
    });

    ws.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    ws.on('close', () => {
      clearTimeout(timeout);
      if (audioChunks.length > 0) {
        resolve(Buffer.concat(audioChunks));
      }
    });
  });
}

function escapeXml(unsafe) {
  return (unsafe || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}
