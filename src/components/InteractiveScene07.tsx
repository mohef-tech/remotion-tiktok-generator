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

// ── HELPERS ──────────────────────────────────────────────────────────────────

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);

// ── RUNNING CAPTION ENGINE ────────────────────────────────────────────────────
//
// Positioned strictly at top="1650px" (top="1680px" in Scene 5) to guarantee
// safe zone margin from the bottom of 1080x1920 canvas without overlap.

type CaptionWord = { word: string; start: number };

const RunningCaption: React.FC<{
  words: CaptionWord[];
  frame: number;
  accentColor?: string;
  top?: string | number;
}> = ({ words, frame, accentColor = "#E9A21B", top = "1650px" }) => {
  const visible = words.filter((w) => frame >= w.start);
  if (visible.length === 0) return null;

  const activeIdx = visible.length - 1;

  const LINE_SIZE = 8;
  const lines: CaptionWord[][] = [];
  for (let i = 0; i < visible.length; i += LINE_SIZE) {
    lines.push(visible.slice(i, i + LINE_SIZE));
  }
  const displayLines = lines.slice(-2);

  const fadeIn = clamp(interpolate(frame, [words[0].start, words[0].start + 6], [0, 1]), 0, 1);

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
          background: "rgba(10, 15, 29, 0.92)",
          borderRadius: "18px",
          padding: "16px 24px",
          backdropFilter: "blur(8px)",
          border: `2px solid ${accentColor}66`,
          boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
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
                    transition: "all 0.1s ease",
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

// ── CAPTION WORD LISTS ────────────────────────────────────────────────────────

const CAPS_S1: CaptionWord[] = [
  { word: "Judul", start: 6 },
  { word: "skripsi", start: 16 },
  { word: "udah", start: 26 },
  { word: "di-ACC,", start: 36 },
  { word: "tapi", start: 50 },
  { word: "pas", start: 59 },
  { word: "mau", start: 68 },
  { word: "mulai", start: 77 },
  { word: "ngetik", start: 90 },
  { word: "Bab", start: 100 },
  { word: "Satu", start: 109 },
  { word: "malah", start: 120 },
  { word: "bingung?", start: 130 },
  { word: "Tenang,", start: 148 },
  { word: "ada", start: 158 },
  { word: "rumus", start: 167 },
  { word: "3", start: 176 },
  { word: "poin", start: 185 },
  { word: "latar", start: 195 },
  { word: "belakang", start: 205 },
  { word: "yang", start: 218 },
  { word: "bikin", start: 228 },
  { word: "kamu", start: 238 },
  { word: "langsung", start: 248 },
  { word: "paham!", start: 258 },
];

const CAPS_S2: CaptionWord[] = [
  { word: "Poin", start: 6 },
  { word: "pertama:", start: 15 },
  { word: "Poin", start: 30 },
  { word: "IDEAL.", start: 39 },
  { word: "Ini", start: 54 },
  { word: "kondisi", start: 63 },
  { word: "ideal", start: 73 },
  { word: "atau", start: 82 },
  { word: "standar", start: 91 },
  { word: "yang", start: 102 },
  { word: "seharusnya", start: 111 },
  { word: "terjadi,", start: 122 },
  { word: "berdasarkan", start: 135 },
  { word: "regulasi,", start: 146 },
  { word: "teori,", start: 158 },
  { word: "atau", start: 168 },
  { word: "target", start: 177 },
  { word: "program.", start: 188 },
];

const CAPS_S3: CaptionWord[] = [
  { word: "Poin", start: 6 },
  { word: "kedua:", start: 15 },
  { word: "Poin", start: 28 },
  { word: "REALITA", start: 37 },
  { word: "atau", start: 48 },
  { word: "Data", start: 57 },
  { word: "Gap.", start: 66 },
  { word: "Di", start: 80 },
  { word: "sinilah", start: 89 },
  { word: "letak", start: 100 },
  { word: "GAP", start: 109 },
  { word: "penelitianmu", start: 120 },
  { word: "antara", start: 134 },
  { word: "kondisi", start: 143 },
  { word: "ideal", start: 153 },
  { word: "dan", start: 162 },
  { word: "kenyataan", start: 171 },
  { word: "di", start: 183 },
  { word: "lapangan.", start: 191 },
];

const CAPS_S4: CaptionWord[] = [
  { word: "Poin", start: 6 },
  { word: "ketiga:", start: 15 },
  { word: "Poin", start: 30 },
  { word: "SOLUSI.", start: 39 },
  { word: "Metode", start: 56 },
  { word: "dan", start: 65 },
  { word: "judul", start: 74 },
  { word: "penelitianmu", start: 83 },
  { word: "adalah", start: 98 },
  { word: "jawaban", start: 108 },
  { word: "atas", start: 118 },
  { word: "GAP", start: 127 },
  { word: "itu.", start: 136 },
  { word: "Latar", start: 152 },
  { word: "belakangmu", start: 161 },
  { word: "jadi", start: 173 },
  { word: "auto-logis!", start: 182 },
];

const CAPS_S5: CaptionWord[] = [
  { word: "Jadi,", start: 8 },
  { word: "ingat", start: 18 },
  { word: "ya", start: 27 },
  { word: "tiga", start: 36 },
  { word: "poin", start: 45 },
  { word: "itu:", start: 54 },
  { word: "Ideal,", start: 65 },
  { word: "Realita,", start: 76 },
  { word: "Solusi.", start: 88 },
  { word: "Kalau", start: 108 },
  { word: "kamu", start: 118 },
  { word: "masih", start: 128 },
  { word: "pusing", start: 138 },
  { word: "bedah", start: 148 },
  { word: "Bab", start: 158 },
  { word: "Satu", start: 167 },
  { word: "skripsimu,", start: 178 },
  { word: "langsung", start: 196 },
  { word: "DM", start: 208 },
  { word: "@jagoneliti_", start: 218 },
  { word: "sekarang,", start: 232 },
  { word: "kita", start: 248 },
  { word: "bantu", start: 258 },
  { word: "bareng!", start: 268 },
];

// ── FULL-CANVAS SVG BACKGROUNDS ──────────────────────────────────────────────

// Scene 1: Laptop moved to Y: 600px - 1080px in center screen
const DeskStudyBg: React.FC = () => (
  <svg
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <defs>
      <linearGradient id="s7WallGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#080E1C" />
        <stop offset="55%" stopColor="#0F1E38" />
        <stop offset="100%" stopColor="#08101E" />
      </linearGradient>
      <linearGradient id="s7DeskGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#C4922A" />
        <stop offset="60%" stopColor="#9B6F1C" />
        <stop offset="100%" stopColor="#7A5410" />
      </linearGradient>
      <radialGradient id="s7LampGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="s7ScreenGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
      <filter id="s7LaptopShadow">
        <feDropShadow dx="0" dy="16" stdDeviation="20" floodOpacity="0.55" />
      </filter>
    </defs>

    {/* Room Wall */}
    <rect width="1080" height="1920" fill="url(#s7WallGrad)" />

    {/* Top Bookshelves */}
    <rect x="40" y="80" width="300" height="18" rx="4" fill="#C4922A" />
    <rect x="60" y="32" width="32" height="50" rx="3" fill="#3B82F6" />
    <rect x="96" y="22" width="28" height="60" rx="3" fill="#EF4444" />
    <rect x="128" y="38" width="34" height="44" rx="3" fill="#10B981" />
    <rect x="166" y="26" width="30" height="56" rx="3" fill="#F59E0B" />
    <rect x="200" y="42" width="40" height="40" rx="3" fill="#8B5CF6" />

    <rect x="740" y="90" width="300" height="18" rx="4" fill="#C4922A" />
    <rect x="760" y="32" width="36" height="60" rx="3" fill="#6366F1" />
    <rect x="800" y="48" width="30" height="44" rx="3" fill="#F59E0B" />
    <rect x="834" y="36" width="38" height="56" rx="3" fill="#EF4444" />
    <rect x="876" y="24" width="32" height="68" rx="3" fill="#10B981" />
    <rect x="912" y="44" width="42" height="48" rx="3" fill="#3B82F6" />

    {/* Desk Surface at Y: 1070px */}
    <polygon points="0,1070 1080,1070 1080,1190 0,1190" fill="url(#s7DeskGrad)" />
    <rect x="0" y="1070" width="1080" height="8" fill="#0A0000" opacity="0.4" />
    <polygon points="0,1190 1080,1190 1080,1920 0,1920" fill="#0A0C14" />

    {/* Desk Lamp */}
    <ellipse cx="150" cy="1030" rx="88" ry="44" fill="url(#s7LampGlow)" />
    <line x1="150" y1="1035" x2="150" y2="920" stroke="#94A3B8" strokeWidth="7" />
    <ellipse cx="150" cy="912" rx="42" ry="20" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="3" />

    {/* Coffee Mug & Notes on desk */}
    <rect x="910" y="1005" width="65" height="58" rx="8" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="3" />
    <path d="M 975 1020 Q 995 1032 975 1044" stroke="#CBD5E1" strokeWidth="6" fill="none" />
    <rect x="926" y="955" width="85" height="48" rx="4" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" />

    {/* Laptop di tengah layar (Y: 600px - 1080px) */}
    <rect x="190" y="600" width="700" height="465" rx="22" fill="#1E293B" filter="url(#s7LaptopShadow)" />
    <rect x="210" y="620" width="660" height="425" rx="14" fill="url(#s7ScreenGrad)" />
    <rect x="235" y="635" width="610" height="395" rx="8" fill="#FFFFFF" />
    <rect x="235" y="635" width="610" height="38" rx="8" fill="#F1F3F4" />
    <rect x="248" y="647" width="40" height="14" rx="3" fill="#4285F4" />
    <rect x="296" y="647" width="40" height="14" rx="3" fill="#CBD5E1" />
    <rect x="344" y="647" width="40" height="14" rx="3" fill="#CBD5E1" />

    {/* Document on screen */}
    <text x="540" y="706" textAnchor="middle" fill="#0F2044" fontSize="22" fontWeight="900" fontFamily="system-ui, sans-serif">
      BAB 1 - PENDAHULUAN
    </text>
    <text x="540" y="736" textAnchor="middle" fill="#64748B" fontSize="16" fontWeight="700" fontFamily="system-ui, sans-serif">
      A. Latar Belakang Masalah
    </text>
    <rect x="270" y="764" width="280" height="8" rx="3" fill="#CBD5E1" />
    <rect x="270" y="784" width="540" height="8" rx="3" fill="#E2E8F0" />
    <rect x="270" y="804" width="480" height="8" rx="3" fill="#E2E8F0" />
    <rect x="270" y="824" width="520" height="8" rx="3" fill="#E2E8F0" />

    {/* Laptop Base */}
    <rect x="160" y="1062" width="760" height="20" rx="6" fill="#334155" />
    <rect x="320" y="1072" width="440" height="10" rx="4" fill="#475569" />
  </svg>
);

// Scene 2: Monitor at Y: 540px - 1060px, Desk at Y: 1100px - 1920px (Rich wood, no yellow void)
const MonitorZoomBg: React.FC = () => (
  <svg
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <defs>
      <linearGradient id="s7MzBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#080E1C" />
        <stop offset="100%" stopColor="#0F1B30" />
      </linearGradient>
      <linearGradient id="s7DeskTopGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="30%" stopColor="#5B210B" />
        <stop offset="100%" stopColor="#381305" />
      </linearGradient>
      <radialGradient id="s7ScreenWarmGlow" cx="50%" cy="35%" r="55%">
        <stop offset="0%" stopColor="#E9A21B" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#E9A21B" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Room Background */}
    <rect width="1080" height="1920" fill="url(#s7MzBg)" />
    <ellipse cx="540" cy="540" rx="680" ry="400" fill="url(#s7ScreenWarmGlow)" />

    {/* Monitor Screen Frame at Y: 540px - 1060px */}
    <rect x="70" y="540" width="940" height="510" rx="24" fill="#1E293B" stroke="#334155" strokeWidth="3" />
    <rect x="90" y="560" width="900" height="470" rx="16" fill="#F8FAFC" />

    {/* Monitor Stand */}
    <rect x="470" y="1050" width="140" height="38" rx="6" fill="#334155" />
    <rect x="410" y="1084" width="260" height="18" rx="6" fill="#475569" />

    {/* Desk Surface at Y: 1100px - 1920px */}
    <polygon points="0,1100 1080,1100 1080,1160 0,1160" fill="#92400E" />
    <rect x="0" y="1100" width="1080" height="6" fill="#000000" opacity="0.35" />
    <polygon points="0,1160 1080,1160 1080,1920 0,1920" fill="url(#s7DeskTopGrad)" />

    {/* Subtle wood plank lines */}
    <line x1="0" y1="1260" x2="1080" y2="1260" stroke="#92400E" strokeWidth="2" opacity="0.3" />
    <line x1="0" y1="1380" x2="1080" y2="1380" stroke="#92400E" strokeWidth="2" opacity="0.3" />
    <line x1="0" y1="1500" x2="1080" y2="1500" stroke="#92400E" strokeWidth="2" opacity="0.3" />
  </svg>
);

// Scene 3: Chart Down Background at Y: 540px - 1080px
const ChartDownBg: React.FC = () => (
  <svg
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <defs>
      <linearGradient id="s7CdBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#14080A" />
        <stop offset="100%" stopColor="#1E0B10" />
      </linearGradient>
      <linearGradient id="s7CdDesk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#681822" />
        <stop offset="100%" stopColor="#380910" />
      </linearGradient>
      <radialGradient id="s7RedGlow2" cx="50%" cy="38%" r="55%">
        <stop offset="0%" stopColor="#E84040" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#E84040" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#s7CdBg)" />
    <ellipse cx="540" cy="760" rx="680" ry="400" fill="url(#s7RedGlow2)" />

    {/* Monitor Screen Frame (Y: 540px - 1080px) */}
    <rect x="70" y="540" width="940" height="520" rx="24" fill="#1A0810" stroke="#E84040" strokeWidth="3" />
    <rect x="90" y="560" width="900" height="480" rx="16" fill="#0F0509" />

    {/* Chart Grid Lines */}
    <line x1="160" y1="600" x2="160" y2="980" stroke="#475569" strokeWidth="3" />
    <line x1="160" y1="980" x2="920" y2="980" stroke="#475569" strokeWidth="3" />
    <line x1="160" y1="880" x2="920" y2="880" stroke="#1E293B" strokeWidth="2" />
    <line x1="160" y1="780" x2="920" y2="780" stroke="#1E293B" strokeWidth="2" />
    <line x1="160" y1="680" x2="920" y2="680" stroke="#1E293B" strokeWidth="2" />

    {/* Dropping Bars */}
    <rect x="200" y="650" width="100" height="330" rx="8" fill="#E84040" opacity="0.85" />
    <rect x="340" y="700" width="100" height="280" rx="8" fill="#E84040" opacity="0.78" />
    <rect x="480" y="780" width="100" height="200" rx="8" fill="#E84040" opacity="0.70" />
    <rect x="620" y="850" width="100" height="130" rx="8" fill="#E84040" opacity="0.62" />
    <rect x="760" y="900" width="100" height="80" rx="8" fill="#E84040" opacity="0.54" />

    {/* Trend Line */}
    <polyline
      points="250,650 390,700 530,780 670,850 810,900"
      stroke="#FCA5A5"
      strokeWidth="6"
      fill="none"
      strokeLinejoin="round"
    />

    {/* Desk Surface at Y: 1080px */}
    <polygon points="0,1080 1080,1080 1080,1920 0,1920" fill="url(#s7CdDesk)" />
  </svg>
);

// Scene 4: Idea Lightbulb Background at Y: 540px - 1080px
const IdeaLightBg: React.FC = () => (
  <svg
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <defs>
      <linearGradient id="s7IlBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#081A12" />
        <stop offset="60%" stopColor="#05140E" />
        <stop offset="100%" stopColor="#030C08" />
      </linearGradient>
      <radialGradient id="s7MintGlow" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#3ECFB2" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#3ECFB2" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="s7IlDesk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0E3324" />
        <stop offset="100%" stopColor="#071A12" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#s7IlBg)" />
    <ellipse cx="540" cy="740" rx="700" ry="450" fill="url(#s7MintGlow)" />

    {/* Lightbulb in Y: 560px - 960px */}
    <ellipse cx="540" cy="680" rx="140" ry="165" fill="#FEF08A" opacity="0.94" />
    <rect x="495" y="830" width="90" height="26" rx="5" fill="#D1D5DB" />
    <rect x="505" y="854" width="70" height="26" rx="5" fill="#9CA3AF" />
    <rect x="515" y="878" width="50" height="20" rx="5" fill="#6B7280" />

    {/* Glow Rays */}
    <line x1="540" y1="490" x2="540" y2="430" stroke="#FEF08A" strokeWidth="10" strokeLinecap="round" opacity="0.75" />
    <line x1="660" y1="540" x2="700" y2="500" stroke="#FEF08A" strokeWidth="9" strokeLinecap="round" opacity="0.65" />
    <line x1="420" y1="540" x2="380" y2="500" stroke="#FEF08A" strokeWidth="9" strokeLinecap="round" opacity="0.65" />
    <line x1="720" y1="670" x2="780" y2="650" stroke="#FEF08A" strokeWidth="8" strokeLinecap="round" opacity="0.55" />
    <line x1="360" y1="670" x2="300" y2="650" stroke="#FEF08A" strokeWidth="8" strokeLinecap="round" opacity="0.55" />

    {/* Sparkles */}
    <polygon points="210,480 216,498 234,498 220,510 226,528 210,516 194,528 200,510 186,498 204,498" fill="#3ECFB2" opacity="0.85" />
    <polygon points="870,520 876,536 892,536 878,546 884,562 870,550 856,562 862,546 848,536 864,536" fill="#E9A21B" opacity="0.85" />

    {/* Desk Surface at Y: 1080px */}
    <polygon points="0,1080 1080,1080 1080,1920 0,1920" fill="url(#s7IlDesk)" />
  </svg>
);

// Scene 5: Celebration Background
const AccCelebrationBg: React.FC = () => (
  <svg
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <defs>
      <linearGradient id="s7AcBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#042314" />
        <stop offset="50%" stopColor="#06351D" />
        <stop offset="100%" stopColor="#02140B" />
      </linearGradient>
      <radialGradient id="s7AcGlow" cx="50%" cy="38%" r="60%">
        <stop offset="0%" stopColor="#3ECFB2" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#3ECFB2" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="s7AcStage" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3ECFB2" />
        <stop offset="100%" stopColor="#2BA897" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#s7AcBg)" />
    <ellipse cx="540" cy="700" rx="700" ry="450" fill="url(#s7AcGlow)" />
    <polygon points="540,700 0,0 180,0" fill="#A7F3D0" opacity="0.06" />
    <polygon points="540,700 380,0 700,0" fill="#A7F3D0" opacity="0.06" />
    <polygon points="540,700 900,0 1080,0" fill="#A7F3D0" opacity="0.06" />

    {/* Confetti particles */}
    <rect x="95" y="140" width="22" height="12" rx="3" fill="#E9A21B" transform="rotate(28 106 146)" />
    <rect x="275" y="100" width="18" height="26" rx="4" fill="#E84040" transform="rotate(-18 284 113)" />
    <rect x="445" y="170" width="24" height="14" rx="3" fill="#3ECFB2" transform="rotate(45 457 177)" />
    <rect x="650" y="120" width="20" height="20" rx="4" fill="#E9A21B" transform="rotate(32 660 130)" />
    <rect x="860" y="160" width="26" height="12" rx="3" fill="#3B82F6" transform="rotate(-38 873 166)" />
    <rect x="170" y="320" width="16" height="24" rx="3" fill="#FDE68A" transform="rotate(20 178 332)" />
    <rect x="915" y="290" width="22" height="15" rx="3" fill="#3ECFB2" transform="rotate(-24 926 298)" />

    {/* Floor podium */}
    <polygon points="0,1520 1080,1520 1080,1920 0,1920" fill="#02140B" />
    <rect x="80" y="1480" width="920" height="40" rx="14" fill="url(#s7AcStage)" opacity="0.85" />
  </svg>
);

// ── CHARACTERS ────────────────────────────────────────────────────────────────

const CharBingung: React.FC = () => (
  <svg
    viewBox="0 0 380 540"
    style={{ width: "320px", height: "460px", display: "block", overflow: "visible" }}
  >
    <defs>
      <filter id="s7CharShadow">
        <feDropShadow dx="0" dy="10" stdDeviation="8" floodOpacity="0.35" />
      </filter>
    </defs>
    <g filter="url(#s7CharShadow)">
      <path d="M 100 300 Q 185 285 270 300 L 285 520 L 85 520 Z" fill="#0F2044" stroke="#1E3A5F" strokeWidth="3" />
      <polygon points="177,298 197,298 204,420 190,440 176,420" fill="#E9A21B" />
      <polygon points="135,300 177,330 157,300" fill="#F4F0EA" />
      <polygon points="245,300 197,330 217,300" fill="#F4F0EA" />
      <rect x="168" y="254" width="44" height="50" rx="6" fill="#FED7AA" />
      <ellipse cx="190" cy="196" rx="68" ry="76" fill="#FFEDD5" stroke="#EA580C" strokeWidth="3" />
      <path d="M 122 172 Q 128 104 192 102 Q 262 102 262 172 Q 228 132 190 136 Q 148 132 122 172 Z" fill="#1E293B" />
      <path d="M 142 158 Q 162 148 175 168" stroke="#1E293B" strokeWidth="5" fill="none" />
      <path d="M 206 168 Q 218 148 238 158" stroke="#1E293B" strokeWidth="5" fill="none" />
      <ellipse cx="160" cy="190" rx="14" ry="17" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
      <circle cx="162" cy="192" r="6" fill="#1E293B" />
      <ellipse cx="220" cy="190" rx="14" ry="17" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
      <circle cx="218" cy="192" r="6" fill="#1E293B" />
      <ellipse cx="260" cy="148" rx="8" ry="12" fill="#BAE6FD" opacity="0.9" />
      <ellipse cx="112" cy="168" rx="7" ry="10" fill="#BAE6FD" opacity="0.8" />
      <path d="M 170 234 Q 190 252 210 234 Q 190 226 170 234 Z" fill="#991B1B" stroke="#1E293B" strokeWidth="3" />
      <path d="M 268 320 Q 310 350 318 380" stroke="#0F2044" strokeWidth="38" strokeLinecap="round" fill="none" />
      <circle cx="320" cy="390" r="14" fill="#FED7AA" />
      <path d="M 110 320 Q 80 370 74 342" stroke="#0F2044" strokeWidth="36" strokeLinecap="round" fill="none" />
      <circle cx="72" cy="334" r="14" fill="#FED7AA" />
      <rect x="302" y="186" width="52" height="30" rx="10" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
    </g>
  </svg>
);

const CharSenangACC: React.FC = () => (
  <svg
    viewBox="0 0 420 580"
    style={{ width: "360px", height: "510px", display: "block", overflow: "visible" }}
  >
    <defs>
      <filter id="s7CelebShadow">
        <feDropShadow dx="0" dy="12" stdDeviation="10" floodOpacity="0.4" />
      </filter>
      <radialGradient id="s7HappyAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3ECFB2" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#3ECFB2" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="210" cy="290" r="220" fill="url(#s7HappyAura)" />
    <g filter="url(#s7CelebShadow)">
      <path d="M 108 298 Q 205 282 302 298 L 318 560 L 90 560 Z" fill="#0F2044" stroke="#1E3A5F" strokeWidth="3" />
      <polygon points="195,296 215,296 222,415 208,435 194,415" fill="#3ECFB2" />
      <polygon points="148,298 195,326 172,298" fill="#F4F0EA" />
      <polygon points="262,298 215,326 238,298" fill="#F4F0EA" />
      <rect x="185" y="252" width="44" height="50" rx="6" fill="#FED7AA" />
      <ellipse cx="207" cy="194" rx="68" ry="76" fill="#FFEDD5" stroke="#EA580C" strokeWidth="3" />
      <path d="M 140 170 Q 146 104 208 102 Q 278 102 275 170 Q 242 132 207 136 Q 162 132 140 170 Z" fill="#1E293B" />
      <path d="M 155 158 Q 175 150 195 160" stroke="#1E293B" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <path d="M 219 160 Q 239 150 260 158" stroke="#1E293B" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <ellipse cx="177" cy="186" rx="10" ry="12" fill="#1E293B" />
      <circle cx="175" cy="182" r="4" fill="#FFFFFF" />
      <ellipse cx="237" cy="186" rx="10" ry="12" fill="#1E293B" />
      <circle cx="235" cy="182" r="4" fill="#FFFFFF" />
      <path d="M 180 230 Q 207 265 234 230" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="155" cy="212" rx="16" ry="10" fill="#FBCFE8" opacity="0.6" />
      <ellipse cx="259" cy="212" rx="16" ry="10" fill="#FBCFE8" opacity="0.6" />
      <path d="M 118 330 Q 110 415 130 440" stroke="#0F2044" strokeWidth="38" strokeLinecap="round" fill="none" />
      <rect x="58" y="388" width="120" height="158" rx="10" transform="rotate(-14 58 388)" fill="#F4F0EA" stroke="#0F2044" strokeWidth="4" />
      <path d="M 295 330 Q 340 375 355 425" stroke="#0F2044" strokeWidth="38" strokeLinecap="round" fill="none" />
      <circle cx="360" cy="432" r="15" fill="#FED7AA" />
    </g>
  </svg>
);

// ── REUSABLE UI ELEMENTS ──────────────────────────────────────────────────────

const TypewriterText: React.FC<{
  text: string;
  charCount: number;
  cursorColor?: string;
}> = ({ text, charCount, cursorColor = "#E9A21B" }) => {
  const displayed = text.slice(0, charCount);
  return (
    <span>
      {displayed}
      {charCount < text.length && (
        <span
          style={{
            display: "inline-block",
            width: "3px",
            height: "1em",
            backgroundColor: cursorColor,
            marginLeft: "2px",
            verticalAlign: "middle",
          }}
        />
      )}
    </span>
  );
};

const SpeechBubble: React.FC<{
  children: React.ReactNode;
  side?: "left" | "right";
  bg?: string;
  border?: string;
  tailColor?: string;
  style?: React.CSSProperties;
}> = ({
  children,
  side = "left",
  bg = "#FFFFFF",
  border = "#0F2044",
  tailColor,
  style,
}) => {
  const tc = tailColor || bg;
  return (
    <div
      style={{
        position: "relative",
        background: bg,
        border: `3px solid ${border}`,
        borderRadius: "22px",
        padding: "20px 26px",
        boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        ...style,
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          bottom: "-18px",
          ...(side === "left" ? { left: "40px" } : { right: "40px" }),
          width: 0,
          height: 0,
          borderLeft: "16px solid transparent",
          borderRight: "16px solid transparent",
          borderTop: `18px solid ${tc}`,
        }}
      />
    </div>
  );
};

const PointCard: React.FC<{
  number: string;
  title: string;
  subtitle: string;
  accentColor: string;
  bgColor: string;
  icon: string;
}> = ({ number, title, subtitle, accentColor, bgColor, icon }) => (
  <div
    style={{
      background: bgColor,
      border: `4px solid ${accentColor}`,
      borderRadius: "24px",
      padding: "24px 30px",
      boxShadow: `0 16px 45px rgba(0,0,0,0.5), 0 0 0 2px ${accentColor}44`,
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
      <div
        style={{
          background: accentColor,
          color: "#FFFFFF",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "30px",
          fontWeight: 900,
          boxShadow: `0 8px 20px ${accentColor}66`,
          flexShrink: 0,
        }}
      >
        {number}
      </div>
      <span style={{ fontSize: "42px" }}>{icon}</span>
    </div>
    <div
      style={{
        color: accentColor,
        fontSize: "26px",
        fontWeight: 900,
        letterSpacing: "1px",
        marginBottom: "8px",
        textTransform: "uppercase",
      }}
    >
      {title}
    </div>
    <div style={{ color: "#F4F0EA", fontSize: "22px", fontWeight: 700, lineHeight: 1.35 }}>
      {subtitle}
    </div>
  </div>
);

// ── SCENES ────────────────────────────────────────────────────────────────────

// SCENE 1 — Hook (local frame 0-299)
// Layout:
// - Top Banner: Y: 60px - 140px
// - Laptop di tengah layar: Y: 600px - 1080px
// - Karakter & Speech Bubble: Y: 1180px - 1540px
// - Rumus 3 Poin Card (frame >= 167): Y: 1380px - 1540px
// - Gap >= 40px antar elemen
// - RunningCaption: Y: 1650px (area 1600-1920 bersih tanpa overlap)
const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 140 } });
  const charSpring = spring({ frame: frame - 130, fps, config: { damping: 16, stiffness: 100 } });
  const bubbleSpring = spring({ frame: frame - 50, fps, config: { damping: 14, stiffness: 125 } });
  const card2Spring = spring({ frame: frame - 167, fps, config: { damping: 14, stiffness: 120 } });

  const hookText = "JUDUL ACC... BINGUNG KETIK BAB 1?";
  const hookChars = Math.floor(
    interpolate(frame, [50, 130], [0, hookText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const screenBlink = Math.floor(frame / 20) % 2 === 0 ? 1 : 0.6;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <DeskStudyBg />

      {/* Blinking cursor on laptop screen (Y: 764px) */}
      <div
        style={{
          position: "absolute",
          top: "764px",
          left: "263px",
          width: "3px",
          height: "18px",
          background: "#0F2044",
          opacity: screenBlink,
          zIndex: 5,
        }}
      />

      {/* Top title banner: Y: 60px */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          left: "30px",
          right: "30px",
          zIndex: 40,
          transform: `scale(${titleSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#0F2044 0%,#1E3A6E 100%)",
            color: "#F4F0EA",
            padding: "16px 32px",
            borderRadius: "22px",
            boxShadow: "0 14px 40px rgba(15,32,68,0.75), 0 0 0 4px #E9A21B",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <span style={{ fontSize: "36px" }}>🎓</span>
          <span style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "0.5px", fontFamily: "system-ui, sans-serif" }}>
            PART 2 — BAB 1 LATAR BELAKANG
          </span>
        </div>
      </div>

      {/* Karakter Bingung di sebelah kiri (Y: 1160px - 1500px) */}
      {frame >= 130 && (
        <div
          style={{
            position: "absolute",
            top: "1160px",
            left: "20px",
            transform: `scale(${charSpring * 0.68})`,
            transformOrigin: "top left",
            zIndex: 25,
          }}
        >
          <CharBingung />
        </div>
      )}

      {/* Speech bubble di sebelah kanan karakter: Y: 1180px - 1340px */}
      {frame >= 50 && (
        <div
          style={{
            position: "absolute",
            top: "1180px",
            left: "260px",
            right: "30px",
            transform: `scale(${bubbleSpring})`,
            transformOrigin: "top left",
            zIndex: 35,
          }}
        >
          <SpeechBubble side="left" bg="#1E293B" border="#E9A21B" tailColor="#1E293B" style={{ color: "#FFFFFF" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#334155", color: "#E9A21B", padding: "4px 14px", borderRadius: "999px", fontSize: "14px", fontWeight: 800, marginBottom: "8px" }}>
              MAHASISWA
            </div>
            <div style={{ fontSize: "23px", fontWeight: 700, lineHeight: 1.35 }}>
              <TypewriterText text={hookText} charCount={hookChars} cursorColor="#E9A21B" />
            </div>
          </SpeechBubble>
        </div>
      )}

      {/* Rumus 3 poin card: Y: 1380px - 1550px (gap 40px dari bubble, >100px ke caption) */}
      {frame >= 167 && (
        <div
          style={{
            position: "absolute",
            top: "1380px",
            left: "260px",
            right: "30px",
            transform: `scale(${card2Spring})`,
            transformOrigin: "top left",
            zIndex: 38,
          }}
        >
          <div
            style={{
              background: "rgba(15,32,68,0.95)",
              border: "3px solid #E9A21B",
              borderRadius: "20px",
              padding: "16px 20px",
              fontFamily: "system-ui, sans-serif",
              backdropFilter: "blur(8px)",
              boxShadow: "0 16px 45px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ color: "#E9A21B", fontSize: "18px", fontWeight: 900, marginBottom: "10px" }}>
              Gunakan Rumus 3 Poin:
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {(["1. IDEAL", "2. REALITA", "3. SOLUSI"] as const).map((label, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: (["#0F2044", "#4A0B0B", "#063D22"] as const)[i],
                    border: `2px solid ${(["#3ECFB2", "#E84040", "#3ECFB2"] as const)[i]}`,
                    color: (["#3ECFB2", "#FCA5A5", "#3ECFB2"] as const)[i],
                    borderRadius: "10px",
                    padding: "8px 6px",
                    fontSize: "14px",
                    fontWeight: 900,
                    textAlign: "center",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Running caption di safe zone Y: 1650px */}
      <RunningCaption words={CAPS_S1} frame={frame} accentColor="#E9A21B" top="1650px" />
    </AbsoluteFill>
  );
};

// SCENE 2 — Poin Ideal & Area Setup Meja 2D Lengkap
// Layout:
// - Header "RUMUS 3 POIN": Y: 100px
// - Card "1. POIN IDEAL": Y: 240px - 480px (di ATAS laptop)
// - Laptop / Layar Dokumen: Y: 540px - 1080px
// - Setup Meja 2D Lengkap: Y: 1150px - 1580px (buku skripsi, memo contoh kalimat, kopi, mahasiswa)
// - RunningCaption: Y: 1650px
const Scene2_PoinIdeal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame: frame - 39, fps, config: { damping: 13, stiffness: 120 } });
  const stickerSpring = spring({ frame: frame - 100, fps, config: { damping: 14, stiffness: 130 } });
  const labelSpring = spring({ frame: frame - 4, fps, config: { damping: 12, stiffness: 140 } });
  const deskSetupSpring = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 110 } });

  const idealText =
    "Kondisi ideal yang seharusnya terjadi berdasarkan regulasi, teori, atau target program.";
  const idealChars = Math.floor(
    interpolate(frame, [54, 145], [0, idealText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <MonitorZoomBg />

      {/* Header "RUMUS 3 POIN" di Y: 100px */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "30px",
          right: "30px",
          transform: `scale(${labelSpring})`,
          zIndex: 40,
        }}
      >
        <div
          style={{
            background: "#E9A21B",
            color: "#0F2044",
            padding: "14px 32px",
            borderRadius: "20px",
            fontSize: "26px",
            fontWeight: 900,
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
            boxShadow: "0 12px 32px rgba(233,162,27,0.5)",
          }}
        >
          RUMUS 3 POIN — LATAR BELAKANG
        </div>
      </div>

      {/* Card "1. POIN IDEAL" di Y: 240px - 480px (di ATAS laptop) */}
      {frame >= 39 && (
        <div
          style={{
            position: "absolute",
            top: "240px",
            left: "40px",
            right: "40px",
            transform: `scale(${cardSpring})`,
            zIndex: 35,
          }}
        >
          <PointCard
            number="1"
            title="POIN IDEAL"
            subtitle="Kondisi Ideal / Target yang Seharusnya Terjadi"
            accentColor="#E9A21B"
            bgColor="rgba(15,32,68,0.96)"
            icon="🎯"
          />
        </div>
      )}

      {/* Konten Layar Dokumen Laptop di Y: 560px - 1040px */}
      <div
        style={{
          position: "absolute",
          top: "570px",
          left: "110px",
          right: "110px",
          zIndex: 30,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #E2E8F0", paddingBottom: "10px", marginBottom: "14px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#EF4444" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#F59E0B" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }} />
          </div>
          <div style={{ color: "#0F2044", fontSize: "16px", fontWeight: 800 }}>
            STANDAR & REGULASI SKRIPSI
          </div>
          <div style={{ width: "40px" }} />
        </div>

        <div style={{ background: "#FEF9C3", borderLeft: "4px solid #E9A21B", padding: "14px 18px", borderRadius: "8px", marginBottom: "14px" }}>
          <div style={{ color: "#78350F", fontSize: "19px", fontWeight: 700, lineHeight: 1.45 }}>
            <TypewriterText text={idealText} charCount={idealChars} cursorColor="#E9A21B" />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { icon: "📜", label: "Regulasi Pemerintah / Standar Nasional" },
            { icon: "📚", label: "Landasan Teori Pakar & Literatur Utama" },
            { icon: "🎯", label: "Target Capaian Program / KPI Baku" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#F1F5F9",
                borderRadius: "8px",
                padding: "8px 14px",
                color: "#1E293B",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stiker Dosen Setuju (ACC): frame >= 100 di pojok dokumen */}
      {frame >= 100 && (
        <div
          style={{
            position: "absolute",
            top: "840px",
            right: "120px",
            transform: `scale(${stickerSpring}) rotate(-8deg)`,
            zIndex: 42,
          }}
        >
          <div
            style={{
              background: "#E9A21B",
              color: "#0F2044",
              padding: "10px 20px",
              borderRadius: "16px",
              boxShadow: "0 10px 28px rgba(0,0,0,0.5)",
              border: "3px solid #FFFFFF",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "36px" }}>👨‍🏫</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "12px", fontWeight: 900, opacity: 0.85 }}>STATUS BAB 1</div>
              <div style={{ fontSize: "18px", fontWeight: 900 }}>DOSEN SETUJU!</div>
            </div>
          </div>
        </div>
      )}

      {/* ILUSTRASI SETUP MEJA 2D LENGKAP DI AREA Y: 1150px - 1580px */}
      <div
        style={{
          position: "absolute",
          top: "1150px",
          left: "30px",
          right: "30px",
          height: "420px",
          zIndex: 35,
          transform: `scale(${deskSetupSpring})`,
          transformOrigin: "top center",
          display: "flex",
          gap: "16px",
        }}
      >
        {/* 1. Tumpukan Buku Skripsi 2D di Kiri (width ~240px) */}
        <div
          style={{
            width: "240px",
            background: "rgba(15,23,42,0.85)",
            border: "3px solid #E9A21B66",
            borderRadius: "20px",
            padding: "16px 14px",
            boxShadow: "0 14px 40px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <div style={{ color: "#E9A21B", fontSize: "14px", fontWeight: 900, textAlign: "center", letterSpacing: "0.5px" }}>
            📚 REFERENSI TEORI
          </div>
          {[
            { title: "SKRIPSI 2024", color: "#881337", height: "36px" },
            { title: "TEORI UTAMA", color: "#B45309", height: "34px" },
            { title: "STANDAR NASIONAL", color: "#1D4ED8", height: "34px" },
            { title: "METODOLOGI", color: "#0F766E", height: "38px" },
          ].map((b, i) => (
            <div
              key={i}
              style={{
                height: b.height,
                background: b.color,
                borderRadius: "6px",
                border: "2px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 10px",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 900,
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            >
              <span>{b.title}</span>
              <span style={{ fontSize: "10px", opacity: 0.7 }}>VOL {4 - i}</span>
            </div>
          ))}
          <div style={{ textAlign: "center", color: "#CBD5E1", fontSize: "11px", marginTop: "2px" }}>
            Landasan Dokumen Ideal
          </div>
        </div>

        {/* 2. Notepad 2D "CONTOH KALIMAT" di Tengah (flex 1) */}
        <div
          style={{
            flex: 1,
            background: "#FFFBEB",
            border: "3px solid #78350F",
            borderRadius: "20px",
            padding: "18px 20px",
            boxShadow: "0 16px 45px rgba(0,0,0,0.65)",
            position: "relative",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {/* Binder Clip */}
          <div
            style={{
              position: "absolute",
              top: "-12px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#D97706",
              border: "2px solid #78350F",
              borderRadius: "6px",
              width: "60px",
              height: "20px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#92400E", fontSize: "15px", fontWeight: 900, marginBottom: "10px", marginTop: "4px" }}>
            <span>📝</span>
            <span>NOTEPAD: CONTOH KALIMAT IDEAL</span>
          </div>

          <div style={{ color: "#451A03", fontSize: "16px", lineHeight: 1.5, fontWeight: 600, borderLeft: "3px solid #D97706", paddingLeft: "12px", marginBottom: "12px" }}>
            "Menurut Permendikbud No. XX / Teori Smith (2023), sistem pelayanan publik idealnya memenuhi standar efisiensi 90%..."
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FEF3C7", borderRadius: "10px", padding: "8px 12px" }}>
            <span style={{ color: "#78350F", fontSize: "13px", fontWeight: 800 }}>
              ✔ Poin 1 Siap Masuk Bab 1
            </span>
            <span style={{ fontSize: "16px" }}>🖊️</span>
          </div>
        </div>

        {/* 3. Cangkir Kopi & Karakter Mahasiswa di Kanan (width ~220px) */}
        <div
          style={{
            width: "220px",
            background: "rgba(15,23,42,0.85)",
            border: "3px solid #E9A21B66",
            borderRadius: "20px",
            padding: "16px 14px",
            boxShadow: "0 14px 40px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Coffee Mug */}
          <div style={{ textAlign: "center", position: "relative" }}>
            <div style={{ fontSize: "12px", color: "#FDE68A", fontWeight: 800, marginBottom: "4px" }}>
              ☕ COFFEE BREAK
            </div>
            <div style={{ fontSize: "40px" }}>☕</div>
          </div>

          {/* Mahasiswa Mini Avatar */}
          <div style={{ textAlign: "center", marginTop: "4px" }}>
            <div style={{ fontSize: "52px", lineHeight: 1 }}>🧑‍🎓</div>
            <div style={{ color: "#3ECFB2", fontSize: "14px", fontWeight: 900, marginTop: "6px" }}>
              PAHAM RUMUS!
            </div>
            <div style={{ color: "#94A3B8", fontSize: "11px" }}>Siap Tulis Ideal</div>
          </div>
        </div>
      </div>

      {/* Running caption di safe zone Y: 1650px */}
      <RunningCaption words={CAPS_S2} frame={frame} accentColor="#E9A21B" top="1650px" />
    </AbsoluteFill>
  );
};

// SCENE 3 — Poin Realita & Data Gap
// Layout:
// - Header: Y: 100px
// - Card "2. POIN REALITA": Y: 240px - 480px
// - Monitor Grafik Gap: Y: 540px - 1080px
// - Real Text Card: Y: 1110px - 1270px
// - GAP Highlight Card: Y: 1320px - 1530px
// - RunningCaption: Y: 1650px
const Scene3_PoinRealita: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame: frame - 37, fps, config: { damping: 13, stiffness: 118 } });
  const highlightSpring = spring({ frame: frame - 109, fps, config: { damping: 12, stiffness: 125 } });
  const labelSpring = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 140 } });

  const realText =
    "Faktanya di lapangan, data menunjukkan kondisi yang jauh berbeda dari standar ideal tersebut.";
  const realChars = Math.floor(
    interpolate(frame, [28, 140], [0, realText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const gapPulse = 0.9 + Math.sin(frame * 0.18) * 0.1;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <ChartDownBg />

      {/* Header "RUMUS 3 POIN" di Y: 100px */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "30px",
          right: "30px",
          transform: `scale(${labelSpring})`,
          zIndex: 40,
        }}
      >
        <div
          style={{
            background: "#E84040",
            color: "#FFFFFF",
            padding: "14px 32px",
            borderRadius: "20px",
            fontSize: "26px",
            fontWeight: 900,
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
            boxShadow: "0 12px 32px rgba(232,64,64,0.5)",
          }}
        >
          RUMUS 3 POIN — POIN 2: REALITA
        </div>
      </div>

      {/* Card Poin 2: Y: 240px - 480px */}
      {frame >= 37 && (
        <div
          style={{
            position: "absolute",
            top: "240px",
            left: "40px",
            right: "40px",
            transform: `scale(${cardSpring})`,
            zIndex: 35,
          }}
        >
          <PointCard
            number="2"
            title="POIN REALITA (DATA GAP)"
            subtitle="Masalah Nyata dan Data Lapangan"
            accentColor="#E84040"
            bgColor="rgba(74,11,11,0.96)"
            icon="📉"
          />
        </div>
      )}

      {/* Explanation Text Box di Y: 1110px - 1270px */}
      <div
        style={{
          position: "absolute",
          top: "1110px",
          left: "40px",
          right: "40px",
          background: "rgba(10,4,6,0.92)",
          border: "3px solid #E84040",
          borderRadius: "20px",
          padding: "22px 28px",
          fontFamily: "system-ui, sans-serif",
          zIndex: 30,
        }}
      >
        <div style={{ color: "#FCA5A5", fontSize: "20px", fontWeight: 700, lineHeight: 1.45 }}>
          <TypewriterText text={realText} charCount={realChars} cursorColor="#E84040" />
        </div>
      </div>

      {/* GAP highlight: Y: 1320px - 1530px (berakhir sebelum 1600px) */}
      {frame >= 109 && (
        <div
          style={{
            position: "absolute",
            top: "1320px",
            left: "40px",
            right: "40px",
            transform: `scale(${highlightSpring * gapPulse})`,
            zIndex: 35,
          }}
        >
          <div
            style={{
              background: "rgba(232,64,64,0.22)",
              border: "4px solid #E84040",
              borderRadius: "20px",
              padding: "22px 30px",
              fontFamily: "system-ui, sans-serif",
              textAlign: "center",
              boxShadow: "0 0 40px rgba(232,64,64,0.5)",
            }}
          >
            <div style={{ color: "#FCA5A5", fontSize: "28px", fontWeight: 900, letterSpacing: "1px" }}>
              Di Sini Letak GAP Penelitianmu!
            </div>
            <div style={{ color: "#FFFFFF", fontSize: "19px", marginTop: "8px", opacity: 0.9 }}>
              Selisih IDEAL vs REALITA = Latar Belakang Skripsi
            </div>
          </div>
        </div>
      )}

      {/* Running caption di safe zone Y: 1650px */}
      <RunningCaption words={CAPS_S3} frame={frame} accentColor="#E84040" top="1650px" />
    </AbsoluteFill>
  );
};

// SCENE 4 — Poin Solusi
// Layout:
// - Header: Y: 100px
// - Card "3. POIN SOLUSI": Y: 240px - 480px
// - Solution Diagram & Lightbulb: Y: 540px - 1080px
// - Sol Text Box: Y: 1110px - 1270px
// - Success Badge: Y: 1320px - 1520px
// - RunningCaption: Y: 1650px
const Scene4_PoinSolusi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame: frame - 39, fps, config: { damping: 13, stiffness: 118 } });
  const badgeSpring = spring({ frame: frame - 182, fps, config: { damping: 12, stiffness: 130 } });
  const labelSpring = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 140 } });
  const flowSpring = spring({ frame: frame - 56, fps, config: { damping: 14, stiffness: 110 } });

  const solText =
    "Metode dan judul penelitianmu adalah jawaban atas GAP yang sudah kamu paparkan.";
  const solChars = Math.floor(
    interpolate(frame, [39, 140], [0, solText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <IdeaLightBg />

      {/* Header "RUMUS 3 POIN" di Y: 100px */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "30px",
          right: "30px",
          transform: `scale(${labelSpring})`,
          zIndex: 40,
        }}
      >
        <div
          style={{
            background: "#3ECFB2",
            color: "#0A1628",
            padding: "14px 32px",
            borderRadius: "20px",
            fontSize: "26px",
            fontWeight: 900,
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
            boxShadow: "0 12px 32px rgba(62,207,178,0.5)",
          }}
        >
          RUMUS 3 POIN — POIN 3: SOLUSI
        </div>
      </div>

      {/* Card Poin 3: Y: 240px - 480px */}
      {frame >= 39 && (
        <div
          style={{
            position: "absolute",
            top: "240px",
            left: "40px",
            right: "40px",
            transform: `scale(${cardSpring})`,
            zIndex: 35,
          }}
        >
          <PointCard
            number="3"
            title="POIN SOLUSI"
            subtitle="Metode dan Judul Pilihanmu Sebagai Jawaban"
            accentColor="#3ECFB2"
            bgColor="rgba(6,61,34,0.96)"
            icon="💡"
          />
        </div>
      )}

      {/* Flow diagram: Y: 940px */}
      {frame >= 56 && (
        <div
          style={{
            position: "absolute",
            top: "940px",
            left: "40px",
            right: "40px",
            transform: `scale(${flowSpring})`,
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "system-ui, sans-serif" }}>
            {[
              { label: "1. IDEAL", color: "#E9A21B" },
              { label: "2. GAP", color: "#E84040" },
              { label: "3. SOLUSI", color: "#3ECFB2" },
            ].map((item, i) => (
              <React.Fragment key={i}>
                <div
                  style={{
                    flex: 1,
                    background: `${item.color}22`,
                    border: `3px solid ${item.color}`,
                    borderRadius: "14px",
                    padding: "14px 8px",
                    textAlign: "center",
                    color: item.color,
                    fontSize: "20px",
                    fontWeight: 900,
                  }}
                >
                  {item.label}
                </div>
                {i < 2 && <div style={{ color: "#F4F0EA", fontSize: "24px", fontWeight: 900 }}>{">"}</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Explanation Text Box di Y: 1110px - 1270px */}
      <div
        style={{
          position: "absolute",
          top: "1110px",
          left: "40px",
          right: "40px",
          background: "rgba(4,14,10,0.92)",
          border: "3px solid #3ECFB2",
          borderRadius: "20px",
          padding: "22px 28px",
          fontFamily: "system-ui, sans-serif",
          zIndex: 30,
        }}
      >
        <div style={{ color: "#A7F3D0", fontSize: "20px", fontWeight: 700, lineHeight: 1.45 }}>
          <TypewriterText text={solText} charCount={solChars} cursorColor="#3ECFB2" />
        </div>
      </div>

      {/* Badge centang: Y: 1320px - 1520px (berakhir sebelum 1600px) */}
      {frame >= 182 && (
        <div
          style={{
            position: "absolute",
            top: "1320px",
            left: "40px",
            right: "40px",
            transform: `scale(${badgeSpring})`,
            zIndex: 35,
          }}
        >
          <div
            style={{
              background: "rgba(62,207,178,0.22)",
              border: "4px solid #3ECFB2",
              borderRadius: "20px",
              padding: "20px 30px",
              fontFamily: "system-ui, sans-serif",
              textAlign: "center",
              boxShadow: "0 0 50px rgba(62,207,178,0.5)",
            }}
          >
            <div style={{ fontSize: "34px", marginBottom: "6px" }}>✅</div>
            <div style={{ color: "#3ECFB2", fontSize: "26px", fontWeight: 900 }}>
              Latar Belakang Auto-Logis!
            </div>
          </div>
        </div>
      )}

      {/* Running caption di safe zone Y: 1650px */}
      <RunningCaption words={CAPS_S4} frame={frame} accentColor="#3ECFB2" top="1650px" />
    </AbsoluteFill>
  );
};

// SCENE 5 — Kesimpulan & CTA Final
// Layout:
// - Summary 3 Poin Card: Y: 70px - 380px
// - Karakter Senang & Dokumen ACC (Scaled): Y: 420px - 1260px
// - Floating CTA Box: Y: 1350px - 1550px
// - RunningCaption: Y: 1680px (tepat DI BAWAH Floating CTA)
const Scene5_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const charSpring = spring({ frame: frame - 8, fps, config: { damping: 15, stiffness: 100 } });
  const docSpring = spring({ frame: frame - 20, fps, config: { damping: 13, stiffness: 118 } });
  const summarySpring = spring({ frame: frame - 60, fps, config: { damping: 14, stiffness: 115 } });
  const ctaSpring = spring({ frame: frame - 218, fps, config: { damping: 12, stiffness: 110 } });

  const ctaFloat = Math.sin(frame * 0.06) * 6;
  const stampScale = easeOut(clamp(interpolate(frame, [30, 80], [0, 1]), 0, 1));

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AccCelebrationBg />

      {/* Summary 3 poin di Y: 70px - 380px */}
      {frame >= 60 && (
        <div
          style={{
            position: "absolute",
            top: "70px",
            left: "30px",
            right: "30px",
            transform: `scale(${summarySpring})`,
            zIndex: 40,
          }}
        >
          <div
            style={{
              background: "rgba(5,46,26,0.96)",
              border: "3px solid #3ECFB2",
              borderRadius: "22px",
              padding: "20px 26px",
              fontFamily: "system-ui, sans-serif",
              boxShadow: "0 18px 50px rgba(0,0,0,0.65)",
            }}
          >
            <div style={{ color: "#3ECFB2", fontSize: "24px", fontWeight: 900, textAlign: "center", marginBottom: "14px" }}>
              RUMUS 3 POIN LATAR BELAKANG
            </div>
            {[
              { no: "1", label: "IDEAL", desc: "Standar/regulasi/teori", color: "#E9A21B" },
              { no: "2", label: "REALITA", desc: "Data Gap lapangan", color: "#E84040" },
              { no: "3", label: "SOLUSI", desc: "Metode dan judul penelitian", color: "#3ECFB2" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  background: `${item.color}16`,
                  border: `2px solid ${item.color}55`,
                  borderRadius: "12px",
                  padding: "10px 14px",
                  marginBottom: i < 2 ? "8px" : 0,
                }}
              >
                <div
                  style={{
                    background: item.color,
                    color: "#FFFFFF",
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  {item.no}
                </div>
                <div>
                  <div style={{ color: item.color, fontSize: "18px", fontWeight: 900 }}>{item.label}</div>
                  <div style={{ color: "#F4F0EA", fontSize: "15px", opacity: 0.9 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Karakter Senang (Scaled ~0.78x di Y: 420px - 950px) */}
      <div
        style={{
          position: "absolute",
          top: "430px",
          left: "50%",
          transform: `translateX(-50%) scale(${charSpring * 0.78})`,
          transformOrigin: "top center",
          zIndex: 20,
        }}
      >
        <CharSenangACC />
      </div>

      {/* Animated ACC document di samping karakter (Y: 520px - 820px) */}
      <div
        style={{
          position: "absolute",
          top: "520px",
          right: "30px",
          transform: `scale(${docSpring * 0.88})`,
          zIndex: 25,
        }}
      >
        <div
          style={{
            background: "#F4F0EA",
            border: "4px solid #0F2044",
            borderRadius: "16px",
            width: "200px",
            padding: "18px",
            fontFamily: "system-ui, sans-serif",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            position: "relative",
          }}
        >
          <div style={{ color: "#0F2044", fontWeight: 900, fontSize: "15px", marginBottom: "8px" }}>
            BAB 1 LATAR BELAKANG
          </div>
          {[80, 95, 70, 90, 60].map((w, i) => (
            <div key={i} style={{ height: "7px", width: `${w}%`, background: "#CBD5E1", borderRadius: "4px", marginBottom: "5px" }} />
          ))}
          <div
            style={{
              position: "absolute",
              top: "55px",
              right: "15px",
              transform: `scale(${stampScale}) rotate(-14deg)`,
              transformOrigin: "center center",
              background: "transparent",
              border: "5px solid #3ECFB2",
              borderRadius: "50%",
              width: "74px",
              height: "74px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#3ECFB2", fontWeight: 900, fontSize: "20px" }}>ACC</span>
          </div>
          <div style={{ color: "#6B7280", fontSize: "11px", textAlign: "center", marginTop: "8px" }}>
            RUMUSAN MASALAH LOGIS
          </div>
        </div>
      </div>

      {/* Floating CTA Box dinaikkan tepat ke Y: 1350px - 1550px */}
      {frame >= 218 && (
        <div
          style={{
            position: "absolute",
            top: "1350px",
            left: "30px",
            right: "30px",
            transform: `scale(${ctaSpring}) translateY(${ctaFloat}px)`,
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg,#0F2044 0%,#1E3A6E 100%)",
              border: "4px solid #E9A21B",
              borderRadius: "26px",
              padding: "24px 30px",
              fontFamily: "system-ui, sans-serif",
              textAlign: "center",
              boxShadow: "0 20px 55px rgba(0,0,0,0.7), 0 0 0 2px #E9A21B44",
            }}
          >
            <div style={{ color: "#E9A21B", fontSize: "20px", fontWeight: 900, marginBottom: "8px", letterSpacing: "0.5px" }}>
              Pusing Bedah Bab 1 Skripsimu?
            </div>
            <div style={{ color: "#F4F0EA", fontSize: "26px", fontWeight: 900, lineHeight: 1.3, marginBottom: "14px" }}>
              DM @jagoneliti_ Sekarang!
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                background: "#E9A21B",
                color: "#0F2044",
                padding: "12px 28px",
                borderRadius: "999px",
                fontSize: "20px",
                fontWeight: 900,
                boxShadow: "0 8px 24px rgba(233,162,27,0.5)",
              }}
            >
              <span>📩</span>
              <span>DM Sekarang!</span>
            </div>
          </div>
        </div>
      )}

      {/* Running caption tepat di Y: 1680px DI BAWAH Floating CTA */}
      <RunningCaption words={CAPS_S5} frame={frame} accentColor="#3ECFB2" top="1680px" />
    </AbsoluteFill>
  );
};

// ── ROOT EXPORT ───────────────────────────────────────────────────────────────

export const InteractiveScene07: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      {/* VO audio */}
      <Sequence from={0} durationInFrames={300} layout="none">
        <Audio src={staticFile("audio/vo_scene1.wav")} volume={1} />
      </Sequence>
      <Sequence from={300} durationInFrames={210} layout="none">
        <Audio src={staticFile("audio/vo_scene2.wav")} volume={1} />
      </Sequence>
      <Sequence from={510} durationInFrames={230} layout="none">
        <Audio src={staticFile("audio/vo_scene3.wav")} volume={1} />
      </Sequence>
      <Sequence from={740} durationInFrames={210} layout="none">
        <Audio src={staticFile("audio/vo_scene4.wav")} volume={1} />
      </Sequence>
      <Sequence from={950} durationInFrames={411} layout="none">
        <Audio src={staticFile("audio/vo_scene5.wav")} volume={1} />
      </Sequence>

      {/* SFX */}
      <Sequence from={30} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/pop.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={300} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={510} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/pop.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={740} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.75} />
      </Sequence>
      {/* bell_ding: saat VO Scene4 "auto-logis!" = global frame 740+182=922 */}
      <Sequence from={922} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/bell_ding.mp3")} volume={0.85} />
      </Sequence>
      {/* applause: saat VO Scene5 "@jagoneliti_" = global frame 950+218=1168 */}
      <Sequence from={1168} durationInFrames={190} layout="none">
        <Audio src={staticFile("audio/applause.mp3")} volume={0.75} />
      </Sequence>

      {/* Visual scenes */}
      <Sequence from={0} durationInFrames={300}>
        <Scene1_Hook />
      </Sequence>
      <Sequence from={300} durationInFrames={210}>
        <Scene2_PoinIdeal />
      </Sequence>
      <Sequence from={510} durationInFrames={230}>
        <Scene3_PoinRealita />
      </Sequence>
      <Sequence from={740} durationInFrames={210}>
        <Scene4_PoinSolusi />
      </Sequence>
      <Sequence from={950} durationInFrames={411}>
        <Scene5_CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
