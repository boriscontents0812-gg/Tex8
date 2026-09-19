/**
 * Parses script lines in standardized texting-bot syntax:
 *
 * 1: Natasha> Hey
 * 2: Harry> Hi
 * 1: img> rizz (image name)
 * 2: Harry> F(uc)k
 *
 * - 1 = Left / Grey bubble (Contact)
 * - 2 = Right / Blue bubble (You)
 * - Name before '>' after 1: or 2: is the ElevenLabs Voice Actor (VA) name
 * - {...} or (...) in words represents Gaussian blur censor tape
 */

export function parseScript(rawScript) {
  if (!rawScript || typeof rawScript !== 'string') {
    return {
      contactName: 'Contact',
      lines: [],
      imageTags: [],
      imageCount: 0
    };
  }

  const rawLines = rawScript.split('\n').map(l => l.trim()).filter(Boolean);
  let contactName = 'Contact';
  let hasExplicitHeader = false;
  const lines = [];
  const imageTagsSet = new Set();

  let lineIndex = 0;

  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i];

    // Check if line is an explicit Contact Header (first line without 1: or 2:)
    if (i === 0 && !raw.match(/^[12]\s*:/)) {
      contactName = raw.replace(/^iMessage:\s*/i, '').trim();
      hasExplicitHeader = true;
      continue;
    }

    // Match 1: or 2: lines
    const lineMatch = raw.match(/^([12])\s*:\s*(.*)$/);
    if (!lineMatch) {
      // If header is somewhere else or fallback
      if (lines.length === 0 && !raw.match(/^[12]\s*:/)) {
        contactName = raw.replace(/^iMessage:\s*/i, '').trim();
        hasExplicitHeader = true;
      }
      continue;
    }

    const speaker = parseInt(lineMatch[1], 10);
    let content = lineMatch[2].trim();
    let voice = null;
    let pauseAfter = 0.4; // default pause in seconds
    let isImage = false;
    let imageTag = null;

    // 1. Check for pause tag like <c:1> or <c:1.5>
    const pauseMatch = content.match(/<c:([\d.]+)>/);
    if (pauseMatch) {
      pauseAfter = parseFloat(pauseMatch[1]) || 0.4;
      content = content.replace(/<c:[\d.]+>/g, '').trim();
    }

    // 2. Check for image syntax:
    // Format A: img> rizz (image name) or img> rizz
    // Format B: [img: rizz]
    // Format C: img: rizz
    const imgArrowMatch = content.match(/^img\s*>\s*(.+)$/i);
    const imgBracketMatch = content.match(/^\[img:\s*([^\]]+)\]$/i);
    const imgColonMatch = content.match(/^img:\s*(.+)$/i);

    if (imgArrowMatch || imgBracketMatch || imgColonMatch) {
      isImage = true;
      const rawTag = (imgArrowMatch ? imgArrowMatch[1] : (imgBracketMatch ? imgBracketMatch[1] : imgColonMatch[1])).trim();
      // Strip trailing parenthetical notes like "(image name)"
      imageTag = rawTag.replace(/\s*\([^)]*\)\s*$/, '').trim();
      imageTagsSet.add(imageTag);
    } else {
      // 3. Check for Voice Actor (VA) name:
      // Format A: Natasha> Hey
      const vaArrowMatch = content.match(/^([a-zA-Z0-9_\s-]+)>\s*(.*)$/);
      if (vaArrowMatch) {
        voice = vaArrowMatch[1].trim();
        content = vaArrowMatch[2].trim();
      } else {
        // Format B: harry: About that (legacy colon syntax)
        const vaColonMatch = content.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
        if (vaColonMatch) {
          voice = vaColonMatch[1].trim();
          content = vaColonMatch[2].trim();
        }
      }

      // If no explicit header was provided, default contactName to the first speaker 1 VA name
      if (!hasExplicitHeader && speaker === 1 && voice && contactName === 'Contact') {
        contactName = voice;
      }

      // 4. Normalize inline word parentheses like F(uc)k -> F{uc}k for Gaussian blur tape
      content = content.replace(/([a-zA-Z0-9])\(([a-zA-Z0-9*#@!]+)\)/g, '$1{$2}');
      content = content.replace(/\(([a-zA-Z0-9*#@!]+)\)([a-zA-Z0-9])/g, '{$1}$2');
    }

    // Clean text for TTS voiceover (strips brackets so ElevenLabs speaks clean natural words)
    const cleanText = isImage ? '' : content.replace(/[{}]/g, '').trim();
    const hasCensor = isImage ? false : /\{([^}]+)\}/.test(content);

    lines.push({
      id: `line_${lineIndex++}`,
      speaker, // 1 = Left / Grey, 2 = Right / Blue
      text: content,
      cleanText,
      hasCensor,
      voice,
      isImage,
      imageTag,
      pauseAfter,
      raw
    });
  }

  const imageTags = Array.from(imageTagsSet);

  return {
    contactName,
    lines,
    imageTags,
    imageCount: imageTags.length
  };
}
