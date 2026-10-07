import * as googleTTS from 'google-tts-api';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentPath = path.join(__dirname, '../src/content.json');
const publicDir = path.join(__dirname, '../public');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generateAudioChunk(text, filename) {
  try {
    const results = await googleTTS.getAllAudioBase64(text, {
      lang: 'id',
      slow: false,
      host: 'https://translate.google.com',
      timeout: 10000,
      splitPunct: '.,!?'
    });

    const buffer = Buffer.concat(
      results.map((item) => Buffer.from(item.base64, 'base64'))
    );

    const filePath = path.join(publicDir, filename);
    fs.writeFileSync(filePath, buffer);
    console.log(`  ✓ Generated ${filename} for: "${text.substring(0, 40)}..."`);
    return filename;
  } catch (err) {
    console.error(`  ✗ Error generating ${filename}:`, err);
    throw err;
  }
}

async function run() {
  console.log("🔊 Generating Per-Scene Audio Dubbing Clips...");

  const manifest = {
    intro: {
      text: `${content.title}. ${content.subtitle || ''}`,
      file: "audio_intro.mp3"
    },
    points: [],
    cta: {
      text: `${content.ctaText}. ${content.ctaSubtext || ''}`,
      file: "audio_cta.mp3"
    }
  };

  // 1. Intro
  await generateAudioChunk(manifest.intro.text, manifest.intro.file);

  // 2. Points
  for (let i = 0; i < content.points.length; i++) {
    const pt = content.points[i];
    const ptText = `Poin ${i + 1}. ${pt.heading}. ${pt.body}`;
    const filename = `audio_point_${i}.mp3`;
    await generateAudioChunk(ptText, filename);
    manifest.points.push({
      text: ptText,
      file: filename
    });
  }

  // 3. CTA
  await generateAudioChunk(manifest.cta.text, manifest.cta.file);

  // Save manifest
  const manifestPath = path.join(publicDir, 'audio_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("✨ Audio Dubbing Per-Scene Generation Complete!");
}

run();
