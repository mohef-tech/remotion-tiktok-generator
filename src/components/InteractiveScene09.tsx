import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Audio,
  staticFile,
} from "remotion";

// ── HELPERS ───────────────────────────────────────────────────────────────────

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

// ── RUNNING CAPTION ENGINE ─────────────────────────────────────────────────────
// Strict: top="1680px". No other element may overlap Y: 1680-1920.

type CaptionWord = { word: string; start: number };

const RunningCaption: React.FC<{
  words: CaptionWord[];
  frame: number;
  accentColor?: string;
  top?: string | number;
}> = ({ words, frame, accentColor = "#E84040", top = "1680px" }) => {
  const visible = words.filter((w) => frame >= w.start);
  if (visible.length === 0) return null;

  const activeIdx = visible.length - 1;
  const LINE_SIZE = 8;
  const lines: CaptionWord[][] = [];
  for (let i = 0; i < visible.length; i += LINE_SIZE) {
    lines.push(visible.slice(i, i + LINE_SIZE));
  }
  const displayLines = lines.slice(-2);
  const fadeIn = clamp(
    interpolate(frame, [words[0].start, words[0].start + 6], [0, 1]),
    0,
    1
  );

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "30px",
        right: "30px",
        zIndex: 100,
        opacity: fadeIn,
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "rgba(8, 12, 24, 0.94)",
          borderRadius: "18px",
          padding: "16px 24px",
          backdropFilter: "blur(8px)",
          border: `2px solid ${accentColor}66`,
          boxShadow: "0 12px 32px rgba(0,0,0,0.65)",
          maxWidth: "100%",
        }}
      >
        {displayLines.map((line, li) => (
          <div
            key={li}
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "8px",
              marginBottom: li < displayLines.length - 1 ? "6px" : 0,
            }}
          >
            {line.map((w, wi) => {
              const globalIdx =
                (lines.length - displayLines.length + li) * LINE_SIZE + wi;
              const isActive = globalIdx === activeIdx;
              return (
                <span
                  key={wi}
                  style={{
                    color: isActive ? accentColor : "#FFFFFF",
                    fontWeight: isActive ? 900 : 700,
                    fontSize: "26px",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    lineHeight: 1.35,
                    background: isActive ? `${accentColor}28` : "transparent",
                    borderRadius: "6px",
                    padding: isActive ? "0 6px" : "0",
                  }}
                >
                  {w.word}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── CAPTION WORDS — Scene 1 (1 kata ≈ 10 frames @ 30fps) ──────────────────────
// VO: "Dosen bilang, 'kurang tajam.' Sebenarnya, dia minta apa?
//      Ini tiga revisi samar yang sering bikin bingung."

const CAPS_S1: CaptionWord[] = [
  { word: "Dosen", start: 6 },
  { word: "bilang,", start: 15 },
  { word: "'kurang", start: 25 },
  { word: "tajam.'", start: 33 },
  { word: "Sebenarnya,", start: 48 },
  { word: "dia", start: 60 },
  { word: "minta", start: 68 },
  { word: "apa?", start: 76 },
  { word: "Ini", start: 92 },
  { word: "tiga", start: 100 },
  { word: "revisi", start: 108 },
  { word: "samar", start: 117 },
  { word: "yang", start: 126 },
  { word: "sering", start: 134 },
  { word: "bikin", start: 143 },
  { word: "bingung.", start: 152 },
];

// ── BACKGROUND — Ruang Kerja Dosen ────────────────────────────────────────────
// Wall Y: 0-1080. Desk surface Y: 1080-1200. Below desk/floor Y: 1200-1600.
// Safe zone Y: 1600-1920 — clear for RunningCaption.

const DosenRoomBg: React.FC = () => (
  <svg
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <defs>
      <linearGradient id="s9WallGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F5EFE0" />
        <stop offset="60%" stopColor="#EDE4CC" />
        <stop offset="100%" stopColor="#D9CDB0" />
      </linearGradient>
      <linearGradient id="s9DeskGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5C2D00" />
        <stop offset="50%" stopColor="#4A2300" />
        <stop offset="100%" stopColor="#361800" />
      </linearGradient>
      <linearGradient id="s9FloorGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2A1800" />
        <stop offset="100%" stopColor="#160C00" />
      </linearGradient>
    </defs>

    {/* Wall */}
    <rect width="1080" height="1920" fill="url(#s9WallGrad)" />
    <rect x="0" y="900" width="1080" height="14" fill="#BFB090" opacity="0.5" />
    <rect x="0" y="914" width="1080" height="3" fill="#A0926C" opacity="0.35" />

    {/* Left bookshelf */}
    <rect x="30" y="100" width="220" height="1000" rx="6" fill="#3B1F00" stroke="#2A1400" strokeWidth="3" />
    <rect x="30" y="278" width="220" height="12" rx="2" fill="#5C3800" />
    <rect x="30" y="490" width="220" height="12" rx="2" fill="#5C3800" />
    <rect x="30" y="700" width="220" height="12" rx="2" fill="#5C3800" />
    <rect x="30" y="910" width="220" height="12" rx="2" fill="#5C3800" />
    <rect x="50" y="130" width="28" height="142" rx="3" fill="#C0392B" />
    <rect x="82" y="148" width="24" height="124" rx="3" fill="#2980B9" />
    <rect x="110" y="136" width="32" height="136" rx="3" fill="#27AE60" />
    <rect x="146" y="154" width="26" height="118" rx="3" fill="#F39C12" />
    <rect x="176" y="130" width="30" height="142" rx="3" fill="#8E44AD" />
    <rect x="210" y="144" width="28" height="128" rx="3" fill="#1A5276" />
    <rect x="46" y="300" width="34" height="184" rx="3" fill="#7D3C98" />
    <rect x="84" y="316" width="28" height="168" rx="3" fill="#E74C3C" />
    <rect x="116" y="292" width="36" height="192" rx="3" fill="#117A65" />
    <rect x="156" y="310" width="30" height="174" rx="3" fill="#D68910" />
    <rect x="190" y="298" width="40" height="186" rx="3" fill="#154360" />
    <rect x="46" y="512" width="46" height="182" rx="3" fill="#E8DAEF" stroke="#AF7AC5" strokeWidth="2" />
    <rect x="96" y="520" width="44" height="174" rx="3" fill="#FDEBD0" stroke="#E59866" strokeWidth="2" />
    <rect x="144" y="508" width="40" height="186" rx="3" fill="#D5E8D4" stroke="#82B366" strokeWidth="2" />
    <rect x="188" y="524" width="36" height="170" rx="3" fill="#DAE8FC" stroke="#6C8EBF" strokeWidth="2" />
    <rect x="50" y="722" width="30" height="182" rx="3" fill="#FF6B35" />
    <rect x="84" y="710" width="30" height="194" rx="3" fill="#FFD23F" />
    <rect x="118" y="730" width="30" height="174" rx="3" fill="#06D6A0" />
    <rect x="152" y="718" width="30" height="186" rx="3" fill="#EF476F" />
    <rect x="186" y="726" width="30" height="178" rx="3" fill="#118AB2" />

    {/* Right bookshelf */}
    <rect x="830" y="100" width="220" height="1000" rx="6" fill="#3B1F00" stroke="#2A1400" strokeWidth="3" />
    <rect x="830" y="278" width="220" height="12" rx="2" fill="#5C3800" />
    <rect x="830" y="490" width="220" height="12" rx="2" fill="#5C3800" />
    <rect x="830" y="700" width="220" height="12" rx="2" fill="#5C3800" />
    <rect x="830" y="910" width="220" height="12" rx="2" fill="#5C3800" />
    <rect x="850" y="130" width="26" height="142" rx="3" fill="#154360" />
    <rect x="880" y="144" width="30" height="128" rx="3" fill="#922B21" />
    <rect x="914" y="132" width="28" height="140" rx="3" fill="#1E8449" />
    <rect x="946" y="148" width="32" height="124" rx="3" fill="#B7950B" />
    <rect x="982" y="136" width="24" height="136" rx="3" fill="#5B2333" />
    <rect x="852" y="300" width="40" height="184" rx="3" fill="#1B2631" />
    <rect x="896" y="314" width="30" height="170" rx="3" fill="#784212" />
    <rect x="930" y="296" width="38" height="188" rx="3" fill="#0E6655" />
    <rect x="972" y="308" width="26" height="176" rx="3" fill="#922B21" />
    <rect x="852" y="512" width="44" height="180" rx="3" fill="#FDEBD0" stroke="#E59866" strokeWidth="2" />
    <rect x="900" y="520" width="40" height="172" rx="3" fill="#D5E8D4" stroke="#82B366" strokeWidth="2" />
    <rect x="944" y="506" width="46" height="186" rx="3" fill="#DAE8FC" stroke="#6C8EBF" strokeWidth="2" />
    <rect x="852" y="722" width="30" height="180" rx="3" fill="#EF476F" />
    <rect x="886" y="712" width="30" height="190" rx="3" fill="#118AB2" />
    <rect x="920" y="726" width="30" height="176" rx="3" fill="#FFD23F" />
    <rect x="954" y="718" width="30" height="184" rx="3" fill="#06D6A0" />
    <rect x="988" y="728" width="30" height="174" rx="3" fill="#FF6B35" />

    {/* Academic wall clock — center top */}
    <circle cx="540" cy="130" r="72" fill="#F5EFE0" stroke="#4A2300" strokeWidth="6" />
    <circle cx="540" cy="130" r="64" fill="#FDFAF4" stroke="#5C3800" strokeWidth="2" />
    <line x1="540" y1="74" x2="540" y2="84" stroke="#3B1F00" strokeWidth="3" strokeLinecap="round" />
    <line x1="540" y1="176" x2="540" y2="186" stroke="#3B1F00" strokeWidth="3" strokeLinecap="round" />
    <line x1="476" y1="130" x2="486" y2="130" stroke="#3B1F00" strokeWidth="3" strokeLinecap="round" />
    <line x1="594" y1="130" x2="604" y2="130" stroke="#3B1F00" strokeWidth="3" strokeLinecap="round" />
    <line x1="540" y1="130" x2="519" y2="98" stroke="#2C1600" strokeWidth="4" strokeLinecap="round" />
    <line x1="540" y1="130" x2="574" y2="110" stroke="#2C1600" strokeWidth="6" strokeLinecap="round" />
    <circle cx="540" cy="130" r="5" fill="#2C1600" />

    {/* Desk surface Y: 1078-1210 */}
    <polygon points="0,1078 1080,1078 1080,1210 0,1210" fill="url(#s9DeskGrad)" />
    <rect x="0" y="1078" width="1080" height="6" fill="#000000" opacity="0.4" />
    <line x1="0" y1="1120" x2="1080" y2="1120" stroke="#6B3800" strokeWidth="1.5" opacity="0.3" />
    <line x1="0" y1="1158" x2="1080" y2="1158" stroke="#6B3800" strokeWidth="1.2" opacity="0.22" />
    <line x1="0" y1="1190" x2="1080" y2="1190" stroke="#6B3800" strokeWidth="1" opacity="0.18" />

    {/* Desk lamp — right side */}
    <line x1="940" y1="1068" x2="916" y2="900" stroke="#6B7280" strokeWidth="8" strokeLinecap="round" />
    <line x1="916" y1="900" x2="828" y2="836" stroke="#6B7280" strokeWidth="8" strokeLinecap="round" />
    <ellipse cx="790" cy="820" rx="52" ry="24" fill="#9CA3AF" stroke="#6B7280" strokeWidth="3" />
    <ellipse cx="790" cy="920" rx="90" ry="45" fill="#FDE68A" opacity="0.22" />

    {/* Pen holder — left desk */}
    <rect x="52" y="1024" width="58" height="70" rx="8" fill="#8B4513" stroke="#5C2D00" strokeWidth="3" />
    <rect x="62" y="990" width="7" height="40" rx="3" fill="#E74C3C" />
    <rect x="73" y="986" width="7" height="44" rx="3" fill="#2980B9" />
    <rect x="84" y="992" width="7" height="38" rx="3" fill="#27AE60" />
    <rect x="95" y="988" width="7" height="42" rx="3" fill="#F39C12" />

    {/* Coffee mug */}
    <rect x="162" y="1022" width="64" height="56" rx="10" fill="#FDFAF4" stroke="#C8B8A2" strokeWidth="3" />
    <path d="M 226 1038 Q 248 1050 226 1062" stroke="#C8B8A2" strokeWidth="6" fill="none" />
    <ellipse cx="194" cy="1032" rx="24" ry="6" fill="#6F4E37" opacity="0.8" />
    <path d="M 182 1022 Q 178 1008 184 996" stroke="#C8B8A2" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
    <path d="M 198 1018 Q 194 1004 200 990" stroke="#C8B8A2" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />

    {/* Floor Y: 1210-1600 */}
    <polygon points="0,1210 1080,1210 1080,1600 0,1600" fill="url(#s9FloorGrad)" />
    <line x1="0" y1="1290" x2="1080" y2="1290" stroke="#2A1400" strokeWidth="1.5" opacity="0.4" />
    <line x1="0" y1="1380" x2="1080" y2="1380" stroke="#2A1400" strokeWidth="1.5" opacity="0.4" />
    <line x1="0" y1="1470" x2="1080" y2="1470" stroke="#2A1400" strokeWidth="1.5" opacity="0.4" />
    <line x1="0" y1="1560" x2="1080" y2="1560" stroke="#2A1400" strokeWidth="1.5" opacity="0.4" />
    <line x1="270" y1="1210" x2="270" y2="1600" stroke="#2A1400" strokeWidth="1" opacity="0.25" />
    <line x1="540" y1="1210" x2="540" y2="1600" stroke="#2A1400" strokeWidth="1" opacity="0.25" />
    <line x1="810" y1="1210" x2="810" y2="1600" stroke="#2A1400" strokeWidth="1" opacity="0.25" />

    {/* Safe zone Y: 1600-1920 */}
    <rect x="0" y="1600" width="1080" height="320" fill="#0A0604" />
  </svg>
);

// ── KERTAS CORETAN DOSEN ───────────────────────────────────────────────────────

const KertasCoretan: React.FC<{ progress: number }> = ({ progress }) => (
  <svg
    viewBox="0 0 680 540"
    style={{
      width: "680px",
      height: "540px",
      filter: "drop-shadow(4px 12px 24px rgba(0,0,0,0.55))",
    }}
  >
    <defs>
      <linearGradient id="s9PaperGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFF8E7" />
        <stop offset="100%" stopColor="#F5E8CC" />
      </linearGradient>
    </defs>

    {/* Paper shadow layer */}
    <rect x="10" y="10" width="660" height="520" rx="4" fill="#F0E6CC" opacity="0.3" />
    <rect x="4" y="4" width="660" height="520" rx="4" fill="url(#s9PaperGrad)" />

    {/* Ruled lines */}
    {[80, 116, 152, 188, 224, 260, 296, 332, 368, 404, 440, 476].map((y, i) => (
      <line key={i} x1="64" x2="618" y1={y} y2={y} stroke="#C8B8A2" strokeWidth="1.2" opacity="0.6" />
    ))}
    {/* Left margin */}
    <line x1="64" y1="20" x2="64" y2="520" stroke="#E84040" strokeWidth="1.5" opacity="0.45" />

    {/* Subject header */}
    <text x="200" y="52" fill="#6B4C2A" fontSize="18" fontWeight="700" fontFamily="system-ui, sans-serif" opacity="0.8">
      Catatan Revisi Skripsi Mahasiswa
    </text>

    {/* MAIN: "KURANG TAJAM?" in large red pen */}
    <text
      x="340" y="220"
      textAnchor="middle"
      fill="#B91C1C"
      fontSize="102"
      fontWeight="900"
      fontFamily="system-ui, -apple-system, sans-serif"
      opacity={progress}
    >
      "KURANG
    </text>
    <text
      x="340" y="332"
      textAnchor="middle"
      fill="#B91C1C"
      fontSize="102"
      fontWeight="900"
      fontFamily="system-ui, -apple-system, sans-serif"
      opacity={progress}
    >
      TAJAM?"
    </text>

    {/* Underline scribble */}
    <path
      d="M 92 348 Q 200 360 340 350 Q 480 340 588 354"
      stroke="#B91C1C"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      opacity={progress * 0.85}
    />
    <path
      d="M 110 364 Q 260 376 420 366 Q 520 358 570 368"
      stroke="#B91C1C"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      opacity={progress * 0.5}
    />

    {/* Sub-annotations — blue pen notes */}
    <text x="90" y="418" fill="#2C5F8A" fontSize="18" fontFamily="system-ui, sans-serif" opacity={progress * 0.9}>
      Perkuat argumentasi teoritisnya
    </text>
    <text x="90" y="454" fill="#2C5F8A" fontSize="18" fontFamily="system-ui, sans-serif" opacity={progress * 0.7}>
      Hubungkan dgn fenomena penelitian
    </text>
    <text x="90" y="490" fill="#2C5F8A" fontSize="18" fontFamily="system-ui, sans-serif" opacity={progress * 0.5}>
      Spesifikkan ruang lingkup!!
    </text>

    {/* Prof signature */}
    <text x="560" y="510" fill="#C8A44A" fontSize="14" fontFamily="system-ui, sans-serif" opacity="0.7">
      Dr. A.
    </text>
  </svg>
);

// ── KARAKTER MAHASISWA BINGUNG ─────────────────────────────────────────────────

const MahasiswaBingung: React.FC = () => (
  <svg
    viewBox="0 0 380 480"
    style={{ width: "260px", height: "340px", overflow: "visible" }}
  >
    <defs>
      <filter id="s9CharShadow" x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="14" stdDeviation="12" floodOpacity="0.55" />
      </filter>
    </defs>
    <g filter="url(#s9CharShadow)">
      {/* Body — navy jacket */}
      <path d="M 90 290 Q 188 272 290 290 L 308 465 L 72 465 Z" fill="#1A3A5C" stroke="#0E2440" strokeWidth="3" />
      <line x1="190" y1="290" x2="190" y2="420" stroke="#0E2440" strokeWidth="3" strokeLinecap="round" />
      <path d="M 160 290 L 190 314 L 220 290" fill="#F0E6D3" stroke="#0E2440" strokeWidth="2" />
      <rect x="108" y="330" width="52" height="36" rx="6" fill="#163060" stroke="#0E2440" strokeWidth="2" />
      {/* Neck */}
      <rect x="172" y="242" width="46" height="52" rx="6" fill="#F0D5B8" />
      {/* Head */}
      <ellipse cx="194" cy="188" rx="70" ry="74" fill="#F0D5B8" stroke="#D4955A" strokeWidth="3" />
      {/* Hair */}
      <path d="M 124 162 Q 128 88 194 86 Q 264 86 266 164 Q 234 118 194 122 Q 152 118 124 162 Z" fill="#1C1208" />
      <path d="M 194 88 Q 204 60 218 78" stroke="#1C1208" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M 194 88 Q 182 54 168 72" stroke="#1C1208" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* Brows furrowed */}
      <path d="M 144 152 Q 162 140 176 153" stroke="#1C1208" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <path d="M 212 153 Q 226 140 244 152" stroke="#1C1208" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      {/* Wide confused eyes */}
      <ellipse cx="162" cy="182" rx="16" ry="19" fill="#FFFFFF" stroke="#1C1208" strokeWidth="3.5" />
      <circle cx="164" cy="185" r="7" fill="#1C1208" />
      <circle cx="166" cy="182" r="2.5" fill="#FFFFFF" />
      <ellipse cx="228" cy="182" rx="16" ry="19" fill="#FFFFFF" stroke="#1C1208" strokeWidth="3.5" />
      <circle cx="226" cy="185" r="7" fill="#1C1208" />
      <circle cx="228" cy="182" r="2.5" fill="#FFFFFF" />
      {/* Sweat drops */}
      <ellipse cx="264" cy="145" rx="7" ry="11" fill="#BAE6FD" opacity="0.9" />
      <ellipse cx="116" cy="160" rx="6" ry="9" fill="#BAE6FD" opacity="0.75" />
      {/* Open mouth */}
      <path d="M 172 230 Q 194 248 216 230 Q 194 220 172 230 Z" fill="#7F1D1D" stroke="#1C1208" strokeWidth="3" />
      <rect x="181" y="228" width="14" height="10" rx="2" fill="#FDFAF4" />
      <rect x="199" y="228" width="14" height="10" rx="2" fill="#FDFAF4" />
      {/* Arms */}
      <path d="M 96 308 Q 60 370 54 428" stroke="#0E2440" strokeWidth="34" strokeLinecap="round" fill="none" />
      <circle cx="54" cy="426" r="15" fill="#F0D5B8" />
      <path d="M 284 308 Q 318 344 330 376" stroke="#0E2440" strokeWidth="34" strokeLinecap="round" fill="none" />
      <circle cx="332" cy="380" r="15" fill="#F0D5B8" />
      {/* Hand on head */}
      <ellipse cx="278" cy="146" rx="28" ry="18" fill="#F0D5B8" stroke="#D4955A" strokeWidth="2" />
    </g>
  </svg>
);

// ── SCENE 1 ───────────────────────────────────────────────────────────────────

const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 130 } });
  const paperSpring  = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 100 } });
  const textProgress = clamp(interpolate(frame, [28, 60], [0, 1]), 0, 1);
  const charSpring   = spring({ frame: frame - 55, fps, config: { damping: 15, stiffness: 90 } });
  const bubbleOpacity = clamp(interpolate(frame, [65, 85], [0, 1]), 0, 1);

  const qFloat1 = interpolate(Math.sin(frame * 0.09), [-1, 1], [-8, 8]);
  const qFloat2 = interpolate(Math.sin(frame * 0.065 + 1.4), [-1, 1], [-10, 5]);
  const qFloat3 = interpolate(Math.sin(frame * 0.075 + 2.8), [-1, 1], [-6, 9]);
  const qOpacity = clamp(interpolate(frame, [30, 50], [0, 1]), 0, 1);

  const paperRotate = interpolate(Math.sin(frame * 0.04), [-1, 1], [-1.2, 1.2]);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <DosenRoomBg />

      {/* Header Card — Y: 120px */}
      <div
        style={{
          position: "absolute",
          top: "215px",
          left: "30px",
          right: "30px",
          zIndex: 40,
          transform: `scale(${headerSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #7F1D1D 0%, #991B1B 50%, #B91C1C 100%)",
            color: "#FEF2F2",
            padding: "22px 32px",
            borderRadius: "20px",
            boxShadow: "0 16px 44px rgba(127,29,29,0.7), 0 0 0 3px #EF4444",
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <polygon points="24,6 46,18 24,30 2,18" fill="#FCA5A5" />
            <line x1="36" y1="18" x2="36" y2="32" stroke="#FCA5A5" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="36" cy="34" rx="5" ry="4" fill="#FCA5A5" opacity="0.6" />
            <path d="M 10 20 L 10 32 Q 24 40 38 32 L 38 20" fill="#7F1D1D" stroke="#FCA5A5" strokeWidth="1.5" />
          </svg>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 700, color: "#FCA5A5", letterSpacing: "1.5px", marginBottom: "4px" }}>
              3 ARTI REVISI SAMAR DOSEN
            </div>
            <div style={{ fontSize: "30px", fontWeight: 900, lineHeight: 1.15 }}>
              Apa Maksud Dosen Sebenarnya?
            </div>
          </div>
        </div>
      </div>

      {/* Coretan Kertas Dosen — Y: 550px–1090px */}
      <div
        style={{
          position: "absolute",
          top: "550px",
          left: "50%",
          transform: `translateX(-50%) scale(${paperSpring}) rotate(${paperRotate}deg)`,
          transformOrigin: "top center",
          zIndex: 30,
        }}
      >
        <KertasCoretan progress={textProgress} />
      </div>

      {/* Floating question marks — Y: 1150-1470 flanking character */}
      <div
        style={{
          position: "absolute",
          top: `${1155 + qFloat1}px`,
          left: "64px",
          fontSize: "56px",
          fontWeight: 900,
          color: "#B91C1C",
          opacity: qOpacity * 0.85,
          fontFamily: "system-ui, sans-serif",
          zIndex: 35,
          textShadow: "0 4px 16px rgba(185,28,28,0.5)",
        }}
      >
        ?
      </div>
      <div
        style={{
          position: "absolute",
          top: `${1120 + qFloat2}px`,
          right: "58px",
          fontSize: "68px",
          fontWeight: 900,
          color: "#B91C1C",
          opacity: qOpacity * 0.9,
          fontFamily: "system-ui, sans-serif",
          zIndex: 35,
          textShadow: "0 4px 18px rgba(185,28,28,0.55)",
        }}
      >
        ?
      </div>
      <div
        style={{
          position: "absolute",
          top: `${1310 + qFloat3}px`,
          left: "38px",
          fontSize: "40px",
          fontWeight: 900,
          color: "#F59E0B",
          opacity: qOpacity * 0.65,
          fontFamily: "system-ui, sans-serif",
          zIndex: 35,
        }}
      >
        ?
      </div>

      {/* Karakter Mahasiswa Bingung — Y: 1150px–1490px */}
      <div
        style={{
          position: "absolute",
          top: "1150px",
          left: "50%",
          transform: `translateX(-50%) scale(${charSpring})`,
          transformOrigin: "top center",
          zIndex: 20,
        }}
      >
        <MahasiswaBingung />
      </div>

      {/* Speech bubble — Y: 1410px (above safe zone) */}
      <div
        style={{
          position: "absolute",
          top: "1410px",
          left: "30px",
          right: "30px",
          zIndex: 50,
          opacity: bubbleOpacity,
          transform: `translateY(${interpolate(bubbleOpacity, [0, 1], [18, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "#FDFAF4",
            border: "4px solid #7F1D1D",
            borderRadius: "20px",
            padding: "18px 26px",
            boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderBottom: "20px solid #7F1D1D",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-14px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderBottom: "15px solid #FDFAF4",
            }}
          />
          <div style={{ fontSize: "28px", fontWeight: 900, color: "#7F1D1D", lineHeight: 1.3 }}>
            Ini maksudnya{" "}
            <span style={{ color: "#B91C1C" }}>apa</span>
            {" "}pak??
          </div>
        </div>
      </div>

      {/* RunningCaption — strict Y: 1680px, no overlap above */}
      <RunningCaption words={CAPS_S1} frame={frame} accentColor="#E84040" top="1680px" />
    </AbsoluteFill>
  );
};

// ── CAPTION WORDS — Scene 2 (~3 kata/detik, 1 kata ≈ 10 frames @ 30fps) ──────
// VO: "Satu, 'kurang tajam.' Biasanya, masalahnya belum spesifik. Judul 'media
//      dan hasil belajar': media apa, kelas berapa? Tulis satu kalimat: apa yang
//      belum diketahui, dan kenapa penting."

const CAPS_S2: CaptionWord[] = [
  { word: "Satu,", start: 6 },
  { word: "'kurang", start: 14 },
  { word: "tajam.'", start: 22 },
  { word: "Biasanya,", start: 36 },
  { word: "masalahnya", start: 46 },
  { word: "belum", start: 57 },
  { word: "spesifik.", start: 65 },
  { word: "Judul", start: 80 },
  { word: "'media", start: 88 },
  { word: "dan", start: 96 },
  { word: "hasil", start: 103 },
  { word: "belajar':", start: 111 },
  { word: "media", start: 124 },
  { word: "apa,", start: 132 },
  { word: "kelas", start: 140 },
  { word: "berapa?", start: 148 },
  { word: "Tulis", start: 164 },
  { word: "satu", start: 172 },
  { word: "kalimat:", start: 180 },
  { word: "apa", start: 194 },
  { word: "yang", start: 202 },
  { word: "belum", start: 210 },
  { word: "diketahui,", start: 218 },
  { word: "dan", start: 230 },
  { word: "kenapa", start: 238 },
  { word: "penting.", start: 247 },
];

// ── SCENE 2 — KURANG TAJAM ────────────────────────────────────────────────────

const Scene2_KurangTajam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({ frame: frame - 2,  fps, config: { damping: 12, stiffness: 135 } });
  const cardSpring   = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 110 } });
  const fixSpring    = spring({ frame: frame - 80, fps, config: { damping: 13, stiffness: 105 } });
  const formulaSpring = spring({ frame: frame - 160, fps, config: { damping: 15, stiffness: 90 } });

  // Strike-through line animates across the bad title
  const strikeProgress = clamp(interpolate(frame, [40, 70], [0, 1]), 0, 1);

  // Pulse on formula box
  const formulaPulse = 0.97 + 0.03 * Math.sin(frame * 0.1);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Background — same warm academic room palette */}
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="s9S2Wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F0EAD8" />
            <stop offset="60%" stopColor="#E8DEC4" />
            <stop offset="100%" stopColor="#D4C8A8" />
          </linearGradient>
          <linearGradient id="s9S2Desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5C2D00" />
            <stop offset="100%" stopColor="#361800" />
          </linearGradient>
          <linearGradient id="s9S2Floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A1800" />
            <stop offset="100%" stopColor="#160C00" />
          </linearGradient>
          {/* Crimson glow — ties to scene topic */}
          <radialGradient id="s9S2Glow" cx="50%" cy="38%" r="50%">
            <stop offset="0%" stopColor="#991B1B" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#991B1B" stopOpacity="0" />
          </radialGradient>
          {/* Green glow for the fix */}
          <radialGradient id="s9S2GlowGreen" cx="50%" cy="65%" r="40%">
            <stop offset="0%" stopColor="#14532D" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#14532D" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="url(#s9S2Wall)" />
        <ellipse cx="540" cy="720" rx="600" ry="480" fill="url(#s9S2Glow)" />
        <ellipse cx="540" cy="1200" rx="500" ry="380" fill="url(#s9S2GlowGreen)" />

        {/* Wainscoting */}
        <rect x="0" y="900" width="1080" height="14" fill="#BFB090" opacity="0.4" />

        {/* Thin left bookshelf strip — visual continuity with Scene 1 */}
        <rect x="30" y="100" width="80" height="1000" rx="4" fill="#3B1F00" stroke="#2A1400" strokeWidth="2" />
        <rect x="30" y="310" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="30" y="550" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="46" y="130" width="18" height="174" rx="3" fill="#C0392B" />
        <rect x="68" y="148" width="18" height="156" rx="3" fill="#2980B9" />
        <rect x="46" y="326" width="20" height="218" rx="3" fill="#27AE60" />
        <rect x="70" y="318" width="18" height="226" rx="3" fill="#F39C12" />

        {/* Thin right bookshelf strip */}
        <rect x="970" y="100" width="80" height="1000" rx="4" fill="#3B1F00" stroke="#2A1400" strokeWidth="2" />
        <rect x="970" y="310" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="970" y="550" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="986" y="130" width="18" height="174" rx="3" fill="#8E44AD" />
        <rect x="1008" y="144" width="18" height="160" rx="3" fill="#1A5276" />
        <rect x="986" y="326" width="20" height="218" rx="3" fill="#E74C3C" />
        <rect x="1008" y="316" width="18" height="228" rx="3" fill="#D68910" />

        {/* Desk surface Y: 1100-1210 */}
        <polygon points="0,1100 1080,1100 1080,1210 0,1210" fill="url(#s9S2Desk)" />
        <rect x="0" y="1100" width="1080" height="6" fill="#000000" opacity="0.4" />
        <line x1="0" y1="1145" x2="1080" y2="1145" stroke="#6B3800" strokeWidth="1.5" opacity="0.28" />
        <line x1="0" y1="1182" x2="1080" y2="1182" stroke="#6B3800" strokeWidth="1" opacity="0.2" />

        {/* Desk items: eraser + red pen on desk */}
        <rect x="60" y="1052" width="70" height="28" rx="6" fill="#FECDD3" stroke="#E84040" strokeWidth="2" />
        <text x="95" y="1071" textAnchor="middle" fill="#9F1239" fontSize="10" fontWeight="700" fontFamily="system-ui, sans-serif">ERASER</text>
        <rect x="950" y="1048" width="12" height="56" rx="5" fill="#E84040" stroke="#991B1B" strokeWidth="1.5" />
        <polygon points="950,1048 962,1048 956,1036" fill="#FDFAF4" />

        {/* Floor Y: 1210-1600 */}
        <polygon points="0,1210 1080,1210 1080,1600 0,1600" fill="url(#s9S2Floor)" />
        <line x1="0" y1="1310" x2="1080" y2="1310" stroke="#2A1400" strokeWidth="1.5" opacity="0.35" />
        <line x1="0" y1="1420" x2="1080" y2="1420" stroke="#2A1400" strokeWidth="1.5" opacity="0.35" />
        <line x1="0" y1="1530" x2="1080" y2="1530" stroke="#2A1400" strokeWidth="1.5" opacity="0.35" />
        <line x1="270" y1="1210" x2="270" y2="1600" stroke="#2A1400" strokeWidth="1" opacity="0.2" />
        <line x1="540" y1="1210" x2="540" y2="1600" stroke="#2A1400" strokeWidth="1" opacity="0.2" />
        <line x1="810" y1="1210" x2="810" y2="1600" stroke="#2A1400" strokeWidth="1" opacity="0.2" />

        {/* Safe zone Y: 1600-1920 */}
        <rect x="0" y="1600" width="1080" height="320" fill="#0A0604" />
      </svg>

      {/* Header Card — Y: 120px, Crimson Red */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "30px",
          right: "30px",
          zIndex: 40,
          transform: `scale(${headerSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #7F1D1D 0%, #991B1B 50%, #B91C1C 100%)",
            color: "#FEF2F2",
            padding: "22px 32px",
            borderRadius: "20px",
            boxShadow: "0 16px 44px rgba(127,29,29,0.7), 0 0 0 3px #EF4444",
            fontFamily: "system-ui, -apple-system, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Number badge */}
          <div
            style={{
              background: "#FFFFFF",
              color: "#B91C1C",
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "42px",
              fontWeight: 900,
              flexShrink: 0,
              boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
            }}
          >
            1
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#FCA5A5", letterSpacing: "2px", marginBottom: "4px" }}>
              REVISI SAMAR
            </div>
            <div style={{ fontSize: "32px", fontWeight: 900, lineHeight: 1.15 }}>
              "KURANG TAJAM"
            </div>
          </div>
        </div>
      </div>

      {/* Card Contoh Judul Samar vs Spesifik — Y: 550px–1090px */}
      <div
        style={{
          position: "absolute",
          top: "550px",
          left: "30px",
          right: "30px",
          zIndex: 35,
          transform: `scale(${cardSpring})`,
          transformOrigin: "top center",
        }}
      >
        {/* Bad title card */}
        <div
          style={{
            background: "#FFF1F2",
            border: "4px solid #E84040",
            borderRadius: "20px",
            padding: "30px 34px",
            marginBottom: "28px",
            boxShadow: "0 12px 36px rgba(232,64,64,0.25)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Label */}
          <div style={{ fontSize: "18px", fontWeight: 800, color: "#9F1239", letterSpacing: "1px", marginBottom: "14px" }}>
            JUDUL SAMAR:
          </div>
          {/* Bad title text with animated strike-through */}
          <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
            <div
              style={{
                fontSize: "38px",
                fontWeight: 900,
                color: "#B91C1C",
                lineHeight: 1.25,
                textAlign: "center",
              }}
            >
              "Media dan Hasil Belajar"
            </div>
            {/* Animated red strikethrough line */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "0",
                height: "5px",
                background: "#B91C1C",
                borderRadius: "3px",
                width: `${strikeProgress * 100}%`,
                transform: "translateY(-50%)",
                boxShadow: "0 0 8px rgba(185,28,28,0.6)",
              }}
            />
          </div>
          {/* Sub-label: what's missing */}
          <div
            style={{
              marginTop: "18px",
              display: "flex",
              gap: "14px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {["Media apa?", "Kelas berapa?", "Hasil belajar apa?"].map((q) => (
              <span
                key={q}
                style={{
                  background: "#FFE4E6",
                  color: "#9F1239",
                  border: "2px solid #FDA4AF",
                  borderRadius: "10px",
                  padding: "8px 18px",
                  fontSize: "20px",
                  fontWeight: 800,
                }}
              >
                {q}
              </span>
            ))}
          </div>
        </div>

        {/* Fixed title card — appears with fixSpring */}
        <div
          style={{
            background: "#F0FDF4",
            border: "4px solid #16A34A",
            borderRadius: "20px",
            padding: "30px 34px",
            boxShadow: "0 12px 36px rgba(22,163,74,0.22)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            opacity: fixSpring,
            transform: `translateY(${interpolate(fixSpring, [0, 1], [24, 0])}px)`,
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 800, color: "#14532D", letterSpacing: "1px", marginBottom: "14px" }}>
            JUDUL SPESIFIK:
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 900,
              color: "#15803D",
              lineHeight: 1.3,
              textAlign: "center",
            }}
          >
            "Penggunaan Quizizz pada Kelas X untuk Meningkatkan Hasil Belajar"
          </div>
          {/* Check badge */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
            <div
              style={{
                background: "#16A34A",
                color: "#FFFFFF",
                borderRadius: "50%",
                width: "52px",
                height: "52px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: 900,
                boxShadow: "0 6px 18px rgba(22,163,74,0.5)",
              }}
            >
              ✓
            </div>
          </div>
        </div>
      </div>

      {/* Box Formula 'Satu Kalimat' — Y: 1150px–1500px */}
      <div
        style={{
          position: "absolute",
          top: "1150px",
          left: "30px",
          right: "30px",
          zIndex: 40,
          opacity: formulaSpring,
          transform: `scale(${formulaPulse}) translateY(${interpolate(formulaSpring, [0, 1], [30, 0])}px)`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #3730A3 100%)",
            border: "4px solid #818CF8",
            borderRadius: "24px",
            padding: "32px 36px",
            boxShadow: "0 18px 50px rgba(30,27,75,0.65), 0 0 0 2px #818CF866",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#A5B4FC",
              letterSpacing: "2px",
              textAlign: "center",
              marginBottom: "22px",
            }}
          >
            FORMULA SATU KALIMAT
          </div>
          {/* Formula box */}
          <div
            style={{
              background: "rgba(129,140,248,0.14)",
              border: "3px dashed #818CF8",
              borderRadius: "16px",
              padding: "24px 28px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "26px", fontWeight: 900, color: "#E0E7FF", lineHeight: 1.45 }}>
              [{"  "}
              <span style={{ color: "#FCD34D" }}>Apa yang belum diketahui</span>
              {"  +  "}
              <span style={{ color: "#6EE7B7" }}>Kenapa penting</span>
              {"  }"}
            </div>
          </div>
          {/* Example output */}
          <div
            style={{
              marginTop: "22px",
              background: "rgba(99,102,241,0.18)",
              borderRadius: "12px",
              padding: "18px 24px",
              fontSize: "22px",
              color: "#C7D2FE",
              fontWeight: 700,
              lineHeight: 1.45,
              textAlign: "center",
            }}
          >
            Contoh: "Belum diketahui efek Quizizz pada motivasi kelas X, padahal itu pengaruhi nilai akhir."
          </div>
        </div>
      </div>

      {/* RunningCaption — strict Y: 1680px */}
      <RunningCaption words={CAPS_S2} frame={frame} accentColor="#E84040" top="1680px" />
    </AbsoluteFill>
  );
};

// ── CAPTION WORDS — Scene 3 (~3 kata/detik, 1 kata ≈ 10 frames @ 30fps) ──────
// VO: "Dua, 'kurang mendalam.' Biasanya, analisismu berhenti di angka. Nilai
//      naik dari tujuh puluh ke delapan puluh, lalu selesai. Tambahkan: artinya
//      apa, dan kenapa bisa begitu."

const CAPS_S3: CaptionWord[] = [
  { word: "Dua,", start: 6 },
  { word: "'kurang", start: 14 },
  { word: "mendalam.'", start: 22 },
  { word: "Biasanya,", start: 36 },
  { word: "analisismu", start: 46 },
  { word: "berhenti", start: 57 },
  { word: "di", start: 66 },
  { word: "angka.", start: 73 },
  { word: "Nilai", start: 88 },
  { word: "naik", start: 96 },
  { word: "dari", start: 104 },
  { word: "tujuh", start: 112 },
  { word: "puluh", start: 120 },
  { word: "ke", start: 128 },
  { word: "delapan", start: 135 },
  { word: "puluh,", start: 144 },
  { word: "lalu", start: 156 },
  { word: "selesai.", start: 164 },
  { word: "Tambahkan:", start: 180 },
  { word: "artinya", start: 192 },
  { word: "apa,", start: 201 },
  { word: "dan", start: 210 },
  { word: "kenapa", start: 218 },
  { word: "bisa", start: 227 },
  { word: "begitu.", start: 235 },
];

// ── SCENE 3 — KURANG MENDALAM ─────────────────────────────────────────────────

const Scene3_KurangMendalam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring  = spring({ frame: frame - 2,   fps, config: { damping: 12, stiffness: 135 } });
  const shallowSpring = spring({ frame: frame - 16,  fps, config: { damping: 14, stiffness: 110 } });
  const formulaSpring = spring({ frame: frame - 160, fps, config: { damping: 15, stiffness: 88 } });

  // Progress bar fill: 70 -> 80, animates in
  const barFill = clamp(interpolate(frame, [20, 60], [0, 1]), 0, 1);
  // Deep layer reveal stagger
  const deepRow1 = clamp(interpolate(frame, [88, 108], [0, 1]), 0, 1);
  const deepRow2 = clamp(interpolate(frame, [108, 128], [0, 1]), 0, 1);
  const deepRow3 = clamp(interpolate(frame, [128, 148], [0, 1]), 0, 1);

  const formulaPulse = 0.97 + 0.03 * Math.sin(frame * 0.1);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Background — same warm room, mustard accent glow */}
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="s9S3Wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F2ECD6" />
            <stop offset="60%" stopColor="#EBE1C2" />
            <stop offset="100%" stopColor="#D6C9A2" />
          </linearGradient>
          <linearGradient id="s9S3Desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5C2D00" />
            <stop offset="100%" stopColor="#361800" />
          </linearGradient>
          <linearGradient id="s9S3Floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A1800" />
            <stop offset="100%" stopColor="#160C00" />
          </linearGradient>
          {/* Mustard glow — ties to scene color */}
          <radialGradient id="s9S3GlowY" cx="50%" cy="35%" r="52%">
            <stop offset="0%" stopColor="#92400E" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#92400E" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s9S3GlowDeep" cx="50%" cy="68%" r="44%">
            <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#1E3A5F" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="url(#s9S3Wall)" />
        <ellipse cx="540" cy="680" rx="620" ry="500" fill="url(#s9S3GlowY)" />
        <ellipse cx="540" cy="1220" rx="520" ry="400" fill="url(#s9S3GlowDeep)" />

        <rect x="0" y="900" width="1080" height="14" fill="#BFB090" opacity="0.4" />

        {/* Left bookshelf strip */}
        <rect x="30" y="100" width="80" height="1000" rx="4" fill="#3B1F00" stroke="#2A1400" strokeWidth="2" />
        <rect x="30" y="310" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="30" y="550" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="46" y="130" width="18" height="174" rx="3" fill="#D97706" />
        <rect x="68" y="148" width="18" height="156" rx="3" fill="#B45309" />
        <rect x="46" y="326" width="20" height="218" rx="3" fill="#92400E" />
        <rect x="70" y="318" width="18" height="226" rx="3" fill="#F59E0B" />

        {/* Right bookshelf strip */}
        <rect x="970" y="100" width="80" height="1000" rx="4" fill="#3B1F00" stroke="#2A1400" strokeWidth="2" />
        <rect x="970" y="310" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="970" y="550" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="986" y="130" width="18" height="174" rx="3" fill="#F59E0B" />
        <rect x="1008" y="144" width="18" height="160" rx="3" fill="#D97706" />
        <rect x="986" y="326" width="20" height="218" rx="3" fill="#B45309" />
        <rect x="1008" y="316" width="18" height="228" rx="3" fill="#92400E" />

        {/* Desk Y: 1100-1210 */}
        <polygon points="0,1100 1080,1100 1080,1210 0,1210" fill="url(#s9S3Desk)" />
        <rect x="0" y="1100" width="1080" height="6" fill="#000000" opacity="0.4" />
        <line x1="0" y1="1145" x2="1080" y2="1145" stroke="#6B3800" strokeWidth="1.5" opacity="0.28" />
        <line x1="0" y1="1182" x2="1080" y2="1182" stroke="#6B3800" strokeWidth="1" opacity="0.2" />

        {/* Desk items — calculator + notebook */}
        <rect x="55" y="1042" width="84" height="58" rx="8" fill="#374151" stroke="#1F2937" strokeWidth="2" />
        <rect x="63" y="1050" width="68" height="28" rx="4" fill="#D1FAE5" />
        <text x="97" y="1069" textAnchor="middle" fill="#065F46" fontSize="11" fontWeight="900" fontFamily="system-ui, sans-serif">70 → 80</text>
        {[0,1,2].map(row => [0,1,2,3].map(col => (
          <rect key={`${row}-${col}`} x={63 + col * 18} y={1082 + row * 10} width="14" height="7" rx="2" fill="#6B7280" />
        )))}
        <rect x="920" y="1038" width="110" height="66" rx="6" fill="#FEFCE8" stroke="#D97706" strokeWidth="2" />
        <line x1="930" y1="1058" x2="1020" y2="1058" stroke="#D97706" strokeWidth="1" opacity="0.5" />
        <line x1="930" y1="1072" x2="1020" y2="1072" stroke="#D97706" strokeWidth="1" opacity="0.5" />
        <line x1="930" y1="1086" x2="1020" y2="1086" stroke="#D97706" strokeWidth="1" opacity="0.5" />

        {/* Floor Y: 1210-1600 */}
        <polygon points="0,1210 1080,1210 1080,1600 0,1600" fill="url(#s9S3Floor)" />
        <line x1="0" y1="1310" x2="1080" y2="1310" stroke="#2A1400" strokeWidth="1.5" opacity="0.35" />
        <line x1="0" y1="1420" x2="1080" y2="1420" stroke="#2A1400" strokeWidth="1.5" opacity="0.35" />
        <line x1="0" y1="1530" x2="1080" y2="1530" stroke="#2A1400" strokeWidth="1.5" opacity="0.35" />
        <line x1="270" y1="1210" x2="270" y2="1600" stroke="#2A1400" strokeWidth="1" opacity="0.2" />
        <line x1="540" y1="1210" x2="540" y2="1600" stroke="#2A1400" strokeWidth="1" opacity="0.2" />
        <line x1="810" y1="1210" x2="810" y2="1600" stroke="#2A1400" strokeWidth="1" opacity="0.2" />

        {/* Safe zone Y: 1600-1920 */}
        <rect x="0" y="1600" width="1080" height="320" fill="#0A0604" />
      </svg>

      {/* Header Card — Y: 120px, Mustard Yellow */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "30px",
          right: "30px",
          zIndex: 40,
          transform: `scale(${headerSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #78350F 0%, #92400E 50%, #B45309 100%)",
            color: "#FFFBEB",
            padding: "22px 32px",
            borderRadius: "20px",
            boxShadow: "0 16px 44px rgba(120,53,15,0.7), 0 0 0 3px #F59E0B",
            fontFamily: "system-ui, -apple-system, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#FEF3C7",
              color: "#92400E",
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "42px",
              fontWeight: 900,
              flexShrink: 0,
              boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
            }}
          >
            2
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#FDE68A", letterSpacing: "2px", marginBottom: "4px" }}>
              REVISI SAMAR
            </div>
            <div style={{ fontSize: "32px", fontWeight: 900, lineHeight: 1.15 }}>
              "KURANG MENDALAM"
            </div>
          </div>
        </div>
      </div>

      {/* Card Perbandingan Analisis — Y: 550px–1090px */}
      <div
        style={{
          position: "absolute",
          top: "550px",
          left: "30px",
          right: "30px",
          zIndex: 35,
        }}
      >
        {/* Shallow analysis card */}
        <div
          style={{
            background: "#FFF7ED",
            border: "4px solid #F59E0B",
            borderRadius: "20px",
            padding: "28px 32px",
            marginBottom: "24px",
            boxShadow: "0 12px 36px rgba(245,158,11,0.22)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            opacity: shallowSpring,
            transform: `translateY(${interpolate(shallowSpring, [0, 1], [24, 0])}px)`,
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 800, color: "#92400E", letterSpacing: "1px", marginBottom: "16px" }}>
            ANALISIS DANGKAL:
          </div>
          {/* Animated progress bar 70 to 80 */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "22px", fontWeight: 900, color: "#78350F" }}>70</span>
              <span style={{ fontSize: "22px", fontWeight: 900, color: "#78350F" }}>80</span>
            </div>
            <div style={{ background: "#FDE68A", borderRadius: "8px", height: "20px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${barFill * 100}%`,
                  background: "linear-gradient(90deg, #D97706, #F59E0B)",
                  borderRadius: "8px",
                  transition: "width 0s",
                }}
              />
            </div>
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: 900,
              color: "#92400E",
              textAlign: "center",
              letterSpacing: "1px",
            }}
          >
            Nilai naik 70 → 80
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "14px",
            }}
          >
            <span
              style={{
                background: "#FEF3C7",
                color: "#92400E",
                border: "3px solid #F59E0B",
                borderRadius: "12px",
                padding: "10px 28px",
                fontSize: "26px",
                fontWeight: 900,
              }}
            >
              Selesai.
            </span>
          </div>
        </div>

        {/* Deep analysis card — staggered rows */}
        <div
          style={{
            background: "#EFF6FF",
            border: "4px solid #2563EB",
            borderRadius: "20px",
            padding: "28px 32px",
            boxShadow: "0 12px 36px rgba(37,99,235,0.2)",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 800, color: "#1E3A8A", letterSpacing: "1px", marginBottom: "18px" }}>
            ANALISIS MENDALAM:
          </div>
          <div style={{ fontSize: "30px", fontWeight: 900, color: "#1D4ED8", marginBottom: "16px" }}>
            Nilai 70 → 80... dan?
          </div>
          {/* Row 1 */}
          <div
            style={{
              opacity: deepRow1,
              transform: `translateX(${interpolate(deepRow1, [0, 1], [-20, 0])}px)`,
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              marginBottom: "12px",
              background: "#DBEAFE",
              borderRadius: "12px",
              padding: "14px 18px",
            }}
          >
            <span style={{ fontSize: "24px", flexShrink: 0 }}>📊</span>
            <span style={{ fontSize: "22px", fontWeight: 800, color: "#1E3A8A", lineHeight: 1.35 }}>
              Artinya: siswa mulai memahami konsep dasar setelah intervensi.
            </span>
          </div>
          {/* Row 2 */}
          <div
            style={{
              opacity: deepRow2,
              transform: `translateX(${interpolate(deepRow2, [0, 1], [-20, 0])}px)`,
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              marginBottom: "12px",
              background: "#DBEAFE",
              borderRadius: "12px",
              padding: "14px 18px",
            }}
          >
            <span style={{ fontSize: "24px", flexShrink: 0 }}>🔍</span>
            <span style={{ fontSize: "22px", fontWeight: 800, color: "#1E3A8A", lineHeight: 1.35 }}>
              Kenapa: Quizizz beri umpan balik langsung, dorong drill mandiri.
            </span>
          </div>
          {/* Row 3 */}
          <div
            style={{
              opacity: deepRow3,
              transform: `translateX(${interpolate(deepRow3, [0, 1], [-20, 0])}px)`,
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              background: "#BFDBFE",
              borderRadius: "12px",
              padding: "14px 18px",
            }}
          >
            <span style={{ fontSize: "24px", flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: "22px", fontWeight: 900, color: "#1D4ED8", lineHeight: 1.35 }}>
              Ini yang bikin analisismu jadi bermakna.
            </span>
          </div>
        </div>
      </div>

      {/* Box Formula — Y: 1150px–1500px */}
      <div
        style={{
          position: "absolute",
          top: "1370px",
          left: "30px",
          right: "30px",
          zIndex: 40,
          opacity: formulaSpring,
          transform: `scale(${formulaPulse}) translateY(${interpolate(formulaSpring, [0, 1], [30, 0])}px)`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #78350F 0%, #92400E 55%, #B45309 100%)",
            border: "4px solid #FCD34D",
            borderRadius: "24px",
            padding: "20px 28px",
            boxShadow: "0 18px 50px rgba(120,53,15,0.65), 0 0 0 2px #FCD34D66",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#FDE68A",
              letterSpacing: "2px",
              textAlign: "center",
              marginBottom: "14px",
            }}
          >
            FORMULA MENDALAM
          </div>
          <div
            style={{
              background: "rgba(253,211,77,0.14)",
              border: "3px dashed #FCD34D",
              borderRadius: "16px",
              padding: "16px 22px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "26px", fontWeight: 900, color: "#FFFBEB", lineHeight: 1.5 }}>
              {"[ "}
              <span style={{ color: "#FCD34D" }}>Tambahkan: Artinya Apa?</span>
              {" + "}
              <span style={{ color: "#6EE7B7" }}>Kenapa Bisa Begitu?</span>
              {" ]"}
            </div>
          </div>
          <div
            style={{
              marginTop: "14px",
              background: "rgba(253,211,77,0.15)",
              borderRadius: "12px",
              padding: "12px 20px",
              fontSize: "22px",
              color: "#FEF3C7",
              fontWeight: 700,
              lineHeight: 1.45,
              textAlign: "center",
            }}
          >
            Angka tanpa makna = data, bukan analisis.
          </div>
        </div>
      </div>

      {/* RunningCaption — strict Y: 1680px */}
      <RunningCaption words={CAPS_S3} frame={frame} accentColor="#F59E0B" top="1680px" />
    </AbsoluteFill>
  );
};

// ── CAPTION WORDS — Scene 4 (~3 kata/detik, 1 kata ≈ 10 frames @ 30fps) ──────
// VO: "Tiga, 'belum nyambung.' Biasanya, tujuan dan kesimpulan tidak satu garis.
//      Tujuannya meningkatkan hasil belajar, kesimpulannya cuma 'siswa senang.'
//      Cek: rumusan, tujuan, kesimpulan."

const CAPS_S4: CaptionWord[] = [
  { word: "Tiga,", start: 6 },
  { word: "'belum", start: 14 },
  { word: "nyambung.'", start: 22 },
  { word: "Biasanya,", start: 36 },
  { word: "tujuan", start: 47 },
  { word: "dan", start: 55 },
  { word: "kesimpulan", start: 63 },
  { word: "tidak", start: 74 },
  { word: "satu", start: 82 },
  { word: "garis.", start: 90 },
  { word: "Tujuannya", start: 105 },
  { word: "meningkatkan", start: 115 },
  { word: "hasil", start: 128 },
  { word: "belajar,", start: 136 },
  { word: "kesimpulannya", start: 148 },
  { word: "cuma", start: 162 },
  { word: "'siswa", start: 170 },
  { word: "senang.'", start: 178 },
  { word: "Cek:", start: 194 },
  { word: "rumusan,", start: 202 },
  { word: "tujuan,", start: 212 },
  { word: "kesimpulan.", start: 221 },
];

// ── SCENE 4 — BELUM NYAMBUNG ──────────────────────────────────────────────────

const Scene4_BelumNyambung: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring  = spring({ frame: frame - 2,   fps, config: { damping: 12, stiffness: 135 } });
  const tujuanSpring  = spring({ frame: frame - 14,  fps, config: { damping: 14, stiffness: 115 } });
  const wrongSpring   = spring({ frame: frame - 55,  fps, config: { damping: 13, stiffness: 108 } });
  const rightSpring   = spring({ frame: frame - 100, fps, config: { damping: 13, stiffness: 105 } });
  const checkSpring   = spring({ frame: frame - 155, fps, config: { damping: 15, stiffness: 90 } });

  // Arrow pulse between tujuan and wrong/right boxes
  const arrowPulse = 0.85 + 0.15 * Math.sin(frame * 0.12);

  // X mark shake when wrong box appears
  const xShake = wrongSpring > 0.8
    ? interpolate(Math.sin(frame * 0.6), [-1, 1], [-4, 4])
    : 0;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Background — warm room, green accent glow */}
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="s9S4Wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EEF4ED" />
            <stop offset="60%" stopColor="#E4EFE2" />
            <stop offset="100%" stopColor="#D0E5CE" />
          </linearGradient>
          <linearGradient id="s9S4Desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5C2D00" />
            <stop offset="100%" stopColor="#361800" />
          </linearGradient>
          <linearGradient id="s9S4Floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A1800" />
            <stop offset="100%" stopColor="#160C00" />
          </linearGradient>
          <radialGradient id="s9S4GlowGreen" cx="50%" cy="35%" r="52%">
            <stop offset="0%" stopColor="#14532D" stopOpacity="0.11" />
            <stop offset="100%" stopColor="#14532D" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s9S4GlowRed" cx="38%" cy="62%" r="38%">
            <stop offset="0%" stopColor="#7F1D1D" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#7F1D1D" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="url(#s9S4Wall)" />
        <ellipse cx="540" cy="680" rx="620" ry="500" fill="url(#s9S4GlowGreen)" />
        <ellipse cx="400" cy="1150" rx="480" ry="380" fill="url(#s9S4GlowRed)" />

        <rect x="0" y="900" width="1080" height="14" fill="#A8C4A5" opacity="0.45" />

        {/* Left bookshelf strip — mint-tinted books */}
        <rect x="30" y="100" width="80" height="1000" rx="4" fill="#3B1F00" stroke="#2A1400" strokeWidth="2" />
        <rect x="30" y="310" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="30" y="550" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="46" y="130" width="18" height="174" rx="3" fill="#059669" />
        <rect x="68" y="148" width="18" height="156" rx="3" fill="#047857" />
        <rect x="46" y="326" width="20" height="218" rx="3" fill="#10B981" />
        <rect x="70" y="318" width="18" height="226" rx="3" fill="#34D399" />

        {/* Right bookshelf strip */}
        <rect x="970" y="100" width="80" height="1000" rx="4" fill="#3B1F00" stroke="#2A1400" strokeWidth="2" />
        <rect x="970" y="310" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="970" y="550" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="986" y="130" width="18" height="174" rx="3" fill="#34D399" />
        <rect x="1008" y="144" width="18" height="160" rx="3" fill="#059669" />
        <rect x="986" y="326" width="20" height="218" rx="3" fill="#047857" />
        <rect x="1008" y="316" width="18" height="228" rx="3" fill="#10B981" />

        {/* Desk Y: 1100-1210 */}
        <polygon points="0,1100 1080,1100 1080,1210 0,1210" fill="url(#s9S4Desk)" />
        <rect x="0" y="1100" width="1080" height="6" fill="#000000" opacity="0.4" />
        <line x1="0" y1="1145" x2="1080" y2="1145" stroke="#6B3800" strokeWidth="1.5" opacity="0.28" />
        <line x1="0" y1="1182" x2="1080" y2="1182" stroke="#6B3800" strokeWidth="1" opacity="0.2" />

        {/* Desk items — checklist clipboard */}
        <rect x="55" y="1028" width="80" height="76" rx="6" fill="#FDFAF4" stroke="#A8C4A5" strokeWidth="2" />
        <rect x="82" y="1022" width="26" height="14" rx="4" fill="#4B5563" />
        <line x1="67" y1="1050" x2="127" y2="1050" stroke="#A8C4A5" strokeWidth="1.5" opacity="0.6" />
        <line x1="67" y1="1064" x2="127" y2="1064" stroke="#A8C4A5" strokeWidth="1.5" opacity="0.6" />
        <line x1="67" y1="1078" x2="110" y2="1078" stroke="#A8C4A5" strokeWidth="1.5" opacity="0.6" />
        <text x="71" y="1048" fill="#059669" fontSize="10" fontWeight="900" fontFamily="system-ui, sans-serif">✓</text>
        <text x="71" y="1062" fill="#059669" fontSize="10" fontWeight="900" fontFamily="system-ui, sans-serif">✓</text>
        <text x="71" y="1076" fill="#EF4444" fontSize="10" fontWeight="900" fontFamily="system-ui, sans-serif">✗</text>
        {/* Red marker pen */}
        <rect x="950" y="1042" width="12" height="62" rx="5" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
        <polygon points="950,1042 962,1042 956,1030" fill="#FDFAF4" />

        {/* Floor Y: 1210-1600 */}
        <polygon points="0,1210 1080,1210 1080,1600 0,1600" fill="url(#s9S4Floor)" />
        <line x1="0" y1="1310" x2="1080" y2="1310" stroke="#2A1400" strokeWidth="1.5" opacity="0.35" />
        <line x1="0" y1="1420" x2="1080" y2="1420" stroke="#2A1400" strokeWidth="1.5" opacity="0.35" />
        <line x1="0" y1="1530" x2="1080" y2="1530" stroke="#2A1400" strokeWidth="1.5" opacity="0.35" />
        <line x1="270" y1="1210" x2="270" y2="1600" stroke="#2A1400" strokeWidth="1" opacity="0.2" />
        <line x1="540" y1="1210" x2="540" y2="1600" stroke="#2A1400" strokeWidth="1" opacity="0.2" />
        <line x1="810" y1="1210" x2="810" y2="1600" stroke="#2A1400" strokeWidth="1" opacity="0.2" />

        {/* Safe zone Y: 1600-1920 */}
        <rect x="0" y="1600" width="1080" height="320" fill="#0A0604" />
      </svg>

      {/* Header Card — Y: 120px, Mint Green */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "30px",
          right: "30px",
          zIndex: 40,
          transform: `scale(${headerSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)",
            color: "#ECFDF5",
            padding: "22px 32px",
            borderRadius: "20px",
            boxShadow: "0 16px 44px rgba(6,78,59,0.7), 0 0 0 3px #34D399",
            fontFamily: "system-ui, -apple-system, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#D1FAE5",
              color: "#065F46",
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "42px",
              fontWeight: 900,
              flexShrink: 0,
              boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
            }}
          >
            3
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#6EE7B7", letterSpacing: "2px", marginBottom: "4px" }}>
              REVISI SAMAR
            </div>
            <div style={{ fontSize: "32px", fontWeight: 900, lineHeight: 1.15 }}>
              "BELUM NYAMBUNG"
            </div>
          </div>
        </div>
      </div>

      {/* Card Diagram Alignment — Y: 550px–1090px */}
      <div
        style={{
          position: "absolute",
          top: "550px",
          left: "30px",
          right: "30px",
          zIndex: 35,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* TUJUAN box */}
        <div
          style={{
            background: "#F0FDF4",
            border: "4px solid #059669",
            borderRadius: "18px",
            padding: "22px 28px",
            textAlign: "center",
            opacity: tujuanSpring,
            transform: `scale(${tujuanSpring})`,
            transformOrigin: "top center",
            marginBottom: "18px",
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: 800, color: "#065F46", letterSpacing: "2px", marginBottom: "8px" }}>
            TUJUAN PENELITIAN
          </div>
          <div style={{ fontSize: "34px", fontWeight: 900, color: "#047857" }}>
            Meningkatkan Hasil Belajar
          </div>
        </div>

        {/* Arrow row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "18px",
            opacity: tujuanSpring,
            transform: `scale(${arrowPulse})`,
          }}
        >
          <svg width="60" height="36" viewBox="0 0 60 36">
            <line x1="30" y1="0" x2="30" y2="26" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
            <polygon points="18,20 42,20 30,36" fill="#64748B" />
          </svg>
        </div>

        {/* Two kesimpulan columns side by side */}
        <div style={{ display: "flex", gap: "18px" }}>
          {/* WRONG kesimpulan */}
          <div
            style={{
              flex: 1,
              background: "#FFF1F2",
              border: "4px solid #E84040",
              borderRadius: "18px",
              padding: "22px 18px",
              textAlign: "center",
              opacity: wrongSpring,
              transform: `translateX(${interpolate(wrongSpring, [0, 1], [-30, 0])}px) translateX(${xShake}px)`,
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#9F1239", letterSpacing: "1.5px", marginBottom: "10px" }}>
              KESIMPULAN SALAH
            </div>
            {/* Big X */}
            <div
              style={{
                width: "52px",
                height: "52px",
                background: "#E84040",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                fontSize: "30px",
                fontWeight: 900,
                color: "#FFFFFF",
                boxShadow: "0 6px 16px rgba(232,64,64,0.55)",
              }}
            >
              ✗
            </div>
            <div style={{ fontSize: "24px", fontWeight: 900, color: "#B91C1C", lineHeight: 1.3 }}>
              "Siswa Senang"
            </div>
            <div style={{ fontSize: "16px", color: "#9F1239", fontWeight: 700, marginTop: "8px" }}>
              Tidak menjawab tujuan
            </div>
          </div>

          {/* CORRECT kesimpulan */}
          <div
            style={{
              flex: 1,
              background: "#F0FDF4",
              border: "4px solid #16A34A",
              borderRadius: "18px",
              padding: "22px 18px",
              textAlign: "center",
              opacity: rightSpring,
              transform: `translateX(${interpolate(rightSpring, [0, 1], [30, 0])}px)`,
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#14532D", letterSpacing: "1.5px", marginBottom: "10px" }}>
              KESIMPULAN BENAR
            </div>
            {/* Big check */}
            <div
              style={{
                width: "52px",
                height: "52px",
                background: "#16A34A",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                fontSize: "30px",
                fontWeight: 900,
                color: "#FFFFFF",
                boxShadow: "0 6px 16px rgba(22,163,74,0.55)",
              }}
            >
              ✓
            </div>
            <div style={{ fontSize: "22px", fontWeight: 900, color: "#15803D", lineHeight: 1.3 }}>
              "Hasil Belajar Meningkat 14%"
            </div>
            <div style={{ fontSize: "16px", color: "#14532D", fontWeight: 700, marginTop: "8px" }}>
              Satu garis dengan tujuan
            </div>
          </div>
        </div>
      </div>

      {/* Box Alignment Checklist — Y: 1150px */}
      <div
        style={{
          position: "absolute",
          top: "1150px",
          left: "30px",
          right: "30px",
          zIndex: 40,
          opacity: checkSpring,
          transform: `translateY(${interpolate(checkSpring, [0, 1], [28, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #064E3B 0%, #065F46 55%, #047857 100%)",
            border: "4px solid #34D399",
            borderRadius: "24px",
            padding: "24px 32px",
            boxShadow: "0 18px 50px rgba(6,78,59,0.65), 0 0 0 2px #34D39966",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#6EE7B7", letterSpacing: "2px", textAlign: "center", marginBottom: "18px" }}>
            CEK SATU GARIS
          </div>
          {/* Flow: Rumusan -> Tujuan -> Kesimpulan */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "18px",
            }}
          >
            {[
              { label: "Rumusan", color: "#A7F3D0" },
              { label: "Tujuan", color: "#6EE7B7" },
              { label: "Kesimpulan", color: "#34D399" },
            ].map(({ label, color }, i) => (
              <React.Fragment key={label}>
                <div
                  style={{
                    background: "rgba(52,211,153,0.18)",
                    border: `3px solid ${color}`,
                    borderRadius: "12px",
                    padding: "12px 16px",
                    textAlign: "center",
                    flex: 1,
                  }}
                >
                  <div style={{ fontSize: "18px", fontWeight: 900, color, lineHeight: 1.2 }}>{label}</div>
                </div>
                {i < 2 && (
                  <div style={{ fontSize: "28px", fontWeight: 900, color: "#6EE7B7", flexShrink: 0 }}>
                    →
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div
            style={{
              background: "rgba(52,211,153,0.14)",
              border: "2px dashed #34D399",
              borderRadius: "12px",
              padding: "14px 20px",
              fontSize: "21px",
              color: "#D1FAE5",
              fontWeight: 700,
              lineHeight: 1.45,
              textAlign: "center",
            }}
          >
            Kalau ketiganya tidak satu arah, dosen pasti minta revisi.
          </div>
        </div>
      </div>

      {/* RunningCaption — strict Y: 1680px */}
      <RunningCaption words={CAPS_S4} frame={frame} accentColor="#34D399" top="1680px" />
    </AbsoluteFill>
  );
};

// ── SCENE 5 CAPTIONS ──────────────────────────────────────────────────────────
// Naskah: "Ini pola umum, tiap dosen bisa beda. Komen 'REVISI,' dan tulis kalimat dosenmu, nanti kuterjemahkan."

const CAPS_S5: CaptionWord[] = [
  { word: "Ini", start: 4 },
  { word: "pola", start: 12 },
  { word: "umum,", start: 20 },
  { word: "tiap", start: 32 },
  { word: "dosen", start: 42 },
  { word: "bisa", start: 52 },
  { word: "beda.", start: 62 },
  { word: "Komen", start: 82 },
  { word: "'REVISI,'", start: 94 },
  { word: "dan", start: 110 },
  { word: "tulis", start: 118 },
  { word: "kalimat", start: 128 },
  { word: "dosenmu,", start: 140 },
  { word: "nanti", start: 156 },
  { word: "kuterjemahkan.", start: 166 },
];

// ── SCENE 5 CHARACTER: MAHASISWA SELEBRASI & MENUNJUK ─────────────────────────

const MahasiswaSelebrasi: React.FC = () => (
  <svg
    viewBox="0 0 380 480"
    style={{ width: "260px", height: "340px", overflow: "visible" }}
  >
    <defs>
      <filter id="s9S5CharShadow" x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="14" stdDeviation="12" floodOpacity="0.55" />
      </filter>
    </defs>
    <g filter="url(#s9S5CharShadow)">
      {/* Body — navy jacket */}
      <path d="M 90 290 Q 188 272 290 290 L 308 465 L 72 465 Z" fill="#1A3A5C" stroke="#0E2440" strokeWidth="3" />
      <line x1="190" y1="290" x2="190" y2="420" stroke="#0E2440" strokeWidth="3" strokeLinecap="round" />
      <path d="M 160 290 L 190 314 L 220 290" fill="#F0E6D3" stroke="#0E2440" strokeWidth="2" />
      <rect x="108" y="330" width="52" height="36" rx="6" fill="#163060" stroke="#0E2440" strokeWidth="2" />

      {/* Neck */}
      <rect x="172" y="242" width="46" height="52" rx="6" fill="#F0D5B8" />

      {/* Head */}
      <ellipse cx="194" cy="188" rx="70" ry="74" fill="#F0D5B8" stroke="#D4955A" strokeWidth="3" />

      {/* Hair */}
      <path d="M 124 162 Q 128 88 194 86 Q 264 86 266 164 Q 234 118 194 122 Q 152 118 124 162 Z" fill="#1C1208" />
      <path d="M 194 88 Q 204 60 218 78" stroke="#1C1208" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M 194 88 Q 182 54 168 72" stroke="#1C1208" strokeWidth="9" strokeLinecap="round" fill="none" />

      {/* Cheerful Eyebrows raised */}
      <path d="M 142 144 Q 160 132 178 144" stroke="#1C1208" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <path d="M 210 144 Q 228 132 246 144" stroke="#1C1208" strokeWidth="5.5" strokeLinecap="round" fill="none" />

      {/* Happy curved eyes (^ ^) */}
      <path d="M 146 178 Q 162 162 178 178" stroke="#1C1208" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 210 178 Q 226 162 242 178" stroke="#1C1208" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Cheerful blush */}
      <ellipse cx="138" cy="195" rx="14" ry="9" fill="#FB7185" opacity="0.45" />
      <ellipse cx="250" cy="195" rx="14" ry="9" fill="#FB7185" opacity="0.45" />

      {/* Big happy open smile */}
      <path d="M 162 216 Q 194 256 226 216 Z" fill="#991B1B" stroke="#1C1208" strokeWidth="3" />
      <path d="M 166 216 Q 194 228 222 216 Z" fill="#FFFFFF" />
      <path d="M 180 244 Q 194 238 208 244 Q 194 256 180 244 Z" fill="#F43F5E" />

      {/* Left arm: Raised high celebrating with thumbs up */}
      <path d="M 94 308 Q 48 244 68 174" stroke="#0E2440" strokeWidth="34" strokeLinecap="round" fill="none" />
      <circle cx="68" cy="172" r="18" fill="#F0D5B8" stroke="#D4955A" strokeWidth="2" />
      <path d="M 68 172 L 68 148" stroke="#F0D5B8" strokeWidth="12" strokeLinecap="round" />

      {/* Right arm: Bent down pointing firmly towards comments */}
      <path d="M 286 308 Q 328 360 286 426" stroke="#0E2440" strokeWidth="34" strokeLinecap="round" fill="none" />
      <circle cx="286" cy="426" r="16" fill="#F0D5B8" />
      {/* Index finger pointing straight down */}
      <path d="M 286 426 L 286 468" stroke="#F0D5B8" strokeWidth="14" strokeLinecap="round" />
    </g>
  </svg>
);

// ── SCENE 5: CTA INTERAKTIF & PENUTUP ─────────────────────────────────────────

const Scene5_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 130 } });
  const charSpring   = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 100 } });
  const bubbleSpring = spring({ frame: frame - 18, fps, config: { damping: 13, stiffness: 110 } });
  const ctaSpring    = spring({ frame: frame - 26, fps, config: { damping: 13, stiffness: 120 } });

  const pulse = 1 + 0.02 * Math.sin(frame * 0.16);
  const glowVal = 0.55 + 0.35 * Math.sin(frame * 0.16);
  const pointerY = interpolate(Math.sin(frame * 0.22), [-1, 1], [-5, 5]);
  const cursorBlink = Math.floor(frame / 14) % 2 === 0 ? 1 : 0;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Background — warm room, deep purple/indigo accent glow */}
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: "1080px", height: "1920px" }}
      >
        <defs>
          <linearGradient id="s9S5Wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5F3FF" />
            <stop offset="60%" stopColor="#EDE9FE" />
            <stop offset="100%" stopColor="#DDD6FE" />
          </linearGradient>
          <linearGradient id="s9S5Desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5C2D00" />
            <stop offset="100%" stopColor="#361800" />
          </linearGradient>
          <linearGradient id="s9S5Floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A1800" />
            <stop offset="100%" stopColor="#160C00" />
          </linearGradient>
          <radialGradient id="s9S5GlowPurple" cx="50%" cy="32%" r="52%">
            <stop offset="0%" stopColor="#4338CA" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#4338CA" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s9S5GlowIndigo" cx="50%" cy="72%" r="45%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="url(#s9S5Wall)" />
        <ellipse cx="540" cy="620" rx="600" ry="480" fill="url(#s9S5GlowPurple)" />
        <ellipse cx="540" cy="1320" rx="520" ry="360" fill="url(#s9S5GlowIndigo)" />

        <rect x="0" y="900" width="1080" height="14" fill="#C4B5FD" opacity="0.45" />

        {/* Left bookshelf strip — purple-tinted books */}
        <rect x="30" y="100" width="80" height="1000" rx="4" fill="#3B1F00" stroke="#2A1400" strokeWidth="2" />
        <rect x="30" y="310" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="30" y="550" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="46" y="130" width="18" height="174" rx="3" fill="#4338CA" />
        <rect x="68" y="148" width="18" height="156" rx="3" fill="#6366F1" />
        <rect x="46" y="326" width="20" height="218" rx="3" fill="#8B5CF6" />
        <rect x="70" y="318" width="18" height="226" rx="3" fill="#A855F7" />

        {/* Right bookshelf strip */}
        <rect x="970" y="100" width="80" height="1000" rx="4" fill="#3B1F00" stroke="#2A1400" strokeWidth="2" />
        <rect x="970" y="310" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="970" y="550" width="80" height="10" rx="2" fill="#5C3800" />
        <rect x="986" y="130" width="18" height="174" rx="3" fill="#8B5CF6" />
        <rect x="1008" y="144" width="18" height="160" rx="3" fill="#4338CA" />
        <rect x="986" y="326" width="20" height="218" rx="3" fill="#6366F1" />
        <rect x="1008" y="316" width="18" height="228" rx="3" fill="#A855F7" />

        {/* Desk Y: 1100-1210 */}
        <polygon points="0,1100 1080,1100 1080,1210 0,1210" fill="url(#s9S5Desk)" />
        <rect x="0" y="1100" width="1080" height="6" fill="#000000" opacity="0.4" />
        <line x1="0" y1="1145" x2="1080" y2="1145" stroke="#6B3800" strokeWidth="1.5" opacity="0.28" />
        <line x1="0" y1="1182" x2="1080" y2="1182" stroke="#6B3800" strokeWidth="1" opacity="0.2" />

        {/* Floor Y: 1210-1600 */}
        <polygon points="0,1210 1080,1210 1080,1600 0,1600" fill="url(#s9S5Floor)" />
        <line x1="0" y1="1310" x2="1080" y2="1310" stroke="#2A1400" strokeWidth="1.5" opacity="0.35" />
        <line x1="0" y1="1420" x2="1080" y2="1420" stroke="#2A1400" strokeWidth="1.5" opacity="0.35" />
        <line x1="0" y1="1530" x2="1080" y2="1530" stroke="#2A1400" strokeWidth="1.5" opacity="0.35" />
        <line x1="270" y1="1210" x2="270" y2="1600" stroke="#2A1400" strokeWidth="1" opacity="0.2" />
        <line x1="540" y1="1210" x2="540" y2="1600" stroke="#2A1400" strokeWidth="1" opacity="0.2" />
        <line x1="810" y1="1210" x2="810" y2="1600" stroke="#2A1400" strokeWidth="1" opacity="0.2" />

        {/* Safe zone Y: 1600-1920 strictly clear */}
        <rect x="0" y="1600" width="1080" height="320" fill="#0A0604" />
      </svg>

      {/* Header Card — Y: 120px, Deep Purple */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "30px",
          right: "30px",
          zIndex: 40,
          transform: `scale(${headerSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1E1B4B 0%, #2E1065 50%, #4338CA 100%)",
            color: "#F5F3FF",
            padding: "22px 32px",
            borderRadius: "20px",
            boxShadow: "0 16px 44px rgba(46,16,101,0.7), 0 0 0 3px #818CF8",
            fontFamily: "system-ui, -apple-system, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#EDE9FE",
              color: "#3730A3",
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: 900,
              flexShrink: 0,
              boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
            }}
          >
            💬
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#C4B5FD", letterSpacing: "2px", marginBottom: "4px" }}>
              DISKUSI & BEDAH REVISI
            </div>
            <div style={{ fontSize: "32px", fontWeight: 900, lineHeight: 1.15 }}>
              TRANSLATE REVISI DOSENMU!
            </div>
          </div>
        </div>
      </div>

      {/* Karakter Selebrasi & Speech Card — Y: 500px–1000px */}
      <div
        style={{
          position: "absolute",
          top: "500px",
          left: "30px",
          right: "30px",
          height: "500px",
          zIndex: 35,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Karakter Selebrasi di kiri */}
        <div
          style={{
            position: "absolute",
            left: "20px",
            top: "40px",
            opacity: charSpring,
            transform: `scale(${charSpring}) translateY(${Math.sin(frame * 0.08) * 6}px)`,
          }}
        >
          <MahasiswaSelebrasi />
        </div>

        {/* Speech Card di kanan */}
        <div
          style={{
            position: "absolute",
            left: "320px",
            right: "10px",
            top: "60px",
            opacity: bubbleSpring,
            transform: `scale(${bubbleSpring})`,
            transformOrigin: "left center",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.96)",
              border: "3px solid #818CF8",
              borderRadius: "22px",
              padding: "24px 28px",
              boxShadow: "0 16px 40px rgba(79, 70, 229, 0.22)",
            }}
          >
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#4F46E5", letterSpacing: "1.5px", marginBottom: "8px" }}>
              ✨ KONSULTASI GRATIS
            </div>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "#1E1B4B", lineHeight: 1.25, marginBottom: "10px" }}>
              Ada kalimat dosen yang ambigu?
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#4338CA", lineHeight: 1.4 }}>
              Drop di kolom komentar sekarang, nanti kubantu bedah maksud & solusinya!
            </div>
          </div>

          {/* Mini highlight chips */}
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <div
              style={{
                background: "#EDE9FE",
                border: "2px solid #A78BFA",
                borderRadius: "12px",
                padding: "10px 16px",
                fontSize: "17px",
                fontWeight: 800,
                color: "#4C1D95",
              }}
            >
              🎯 Tiap Dosen Bisa Beda
            </div>
            <div
              style={{
                background: "#FEF3C7",
                border: "2px solid #F59E0B",
                borderRadius: "12px",
                padding: "10px 16px",
                fontSize: "17px",
                fontWeight: 800,
                color: "#92400E",
              }}
            >
              💡 Dibantu Terjemahkan
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA Box Interaktif — Y: 1150px–1500px (Pulse / Glow) */}
      <div
        style={{
          position: "absolute",
          top: "1150px",
          left: "30px",
          right: "30px",
          zIndex: 40,
          opacity: ctaSpring,
          transform: `scale(${ctaSpring * pulse})`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1E1B4B 0%, #2E1065 48%, #4338CA 100%)",
            border: "4px solid #A78BFA",
            borderRadius: "24px",
            padding: "26px 32px",
            boxShadow: `0 18px 50px rgba(79,70,229,${glowVal}), 0 0 0 3px #C4B5FD`,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Top Badge */}
          <div style={{ textAlign: "center", marginBottom: "14px" }}>
            <span
              style={{
                background: "#FBBF24",
                color: "#1E1B4B",
                fontSize: "16px",
                fontWeight: 900,
                letterSpacing: "1.5px",
                padding: "6px 16px",
                borderRadius: "20px",
                display: "inline-block",
                boxShadow: "0 4px 12px rgba(251,191,36,0.45)",
              }}
            >
              👉 DROP REVISIMU SEKARANG 👈
            </span>
          </div>

          {/* Main CTA Text */}
          <div
            style={{
              fontSize: "31px",
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.25,
              textAlign: "center",
              marginBottom: "18px",
              letterSpacing: "0.5px",
            }}
          >
            [ KOMEN <span style={{ color: "#FDE047", textDecoration: "underline" }}>'REVISI'</span> + TULIS KALIMAT DOSENMU DI BAWAH! ]
          </div>

          {/* Mock comment input bar */}
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "2px dashed #C4B5FD",
              borderRadius: "14px",
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#E0E7FF" }}>
              💬 Ketik: "REVISI: [kalimat dosenmu]"
              <span style={{ opacity: cursorBlink, color: "#FDE047", fontWeight: 900 }}>|</span>
            </div>
            <div
              style={{
                background: "#818CF8",
                color: "#FFFFFF",
                padding: "8px 18px",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: 900,
                letterSpacing: "1px",
              }}
            >
              KIRIM
            </div>
          </div>

          {/* Bouncing finger arrow */}
          <div
            style={{
              textAlign: "center",
              fontSize: "21px",
              fontWeight: 900,
              color: "#FDE047",
              transform: `translateY(${pointerY}px)`,
              letterSpacing: "0.5px",
            }}
          >
            👇 TULIS DI KOLOM KOMENTAR DI BAWAH INI 👇
          </div>
        </div>
      </div>

      {/* RunningCaption — strict Y: 1680px */}
      <RunningCaption words={CAPS_S5} frame={frame} accentColor="#A78BFA" top="1680px" />
    </AbsoluteFill>
  );
};

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────

export const InteractiveScene09: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={244}>
        <Audio src={staticFile("audio/vo-revisi-s1.wav")} />
        <Scene1_Hook />
      </Sequence>
      <Sequence from={244} durationInFrames={418}>
        <Audio src={staticFile("audio/vo-revisi-s2.wav")} />
        <Scene2_KurangTajam />
      </Sequence>
      <Sequence from={662} durationInFrames={395}>
        <Audio src={staticFile("audio/vo-revisi-s3.wav")} />
        <Scene3_KurangMendalam />
      </Sequence>
      <Sequence from={1057} durationInFrames={421}>
        <Audio src={staticFile("audio/vo-revisi-s4.wav")} />
        <Scene4_BelumNyambung />
      </Sequence>
      <Sequence from={1478} durationInFrames={233}>
        <Audio src={staticFile("audio/vo-revisi-s5.wav")} />
        <Scene5_CTA />
      </Sequence>
    </AbsoluteFill>
  );
};

