// Generate minimal silent MP3 placeholder files
// A minimal valid MP3 file (MPEG audio frame)
const fs = require('fs');
const path = require('path');

// Minimal valid MP3 frame (silence) — 417 bytes MPEG1 Layer3 frame
// This is a single valid MPEG frame header + silence data
const createMinimalMp3 = () => {
  // MP3 frame header for 128kbps, 44100Hz, stereo, padding
  // FF FB 90 00 = sync word + MPEG1, Layer III, 128kbps, 44100Hz
  const header = Buffer.from([
    0xFF, 0xFB, 0x90, 0x00
  ]);
  
  // Frame size for 128kbps at 44100Hz = 417 bytes (including header)
  // Fill rest with zeros (silence)
  const frameSize = 417;
  const frame = Buffer.alloc(frameSize, 0);
  header.copy(frame, 0);
  
  // Create multiple frames for ~1 second of silence
  const framesNeeded = Math.ceil(44100 / 1152); // ~38 frames for 1 sec
  const frames = [];
  for (let i = 0; i < framesNeeded; i++) {
    frames.push(Buffer.from(frame));
  }
  
  return Buffer.concat(frames);
};

const audioDir = path.join(__dirname, '..', 'public', 'audio');

// Create directory if not exists
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const files = ['typing.mp3', 'error.mp3', 'whoosh.mp3', 'success.mp3'];
const silentMp3 = createMinimalMp3();

files.forEach(file => {
  const filePath = path.join(audioDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, silentMp3);
    console.log(`✅ Created placeholder: ${file}`);
  } else {
    console.log(`⏭️  Already exists: ${file}`);
  }
});

console.log('\n🎵 Audio placeholders ready! Replace with real audio files later.');
