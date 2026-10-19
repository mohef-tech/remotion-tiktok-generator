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

// ── RUNNING CAPTION ENGINE ────────────────────────────────────────────────────
// Strict position: top="1680px" — safe zone Y: 1680-1920.
// No other element may overlap this zone.

type CaptionWord = { word: string; start: number };

const RunningCaption: React.FC<{
  words: CaptionWord[];
  frame: number;
  accentColor?: string;
  top?: string | number;
}> = ({ words, frame, accentColor = "#E9A21B", top = "1680px" }) => {
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

// ── CAPTION WORDS — Scene 1 (~3 kata/detik, 1 kata ≈ 10 frames) ───────────────
// VO: "Bab 1 udah ACC, tapi pas masuk Bab 2 tiba-tiba bingung bikin
//      diagram kerangka berpikir? Tenang, di sini kita bedah bareng
//      cara menyusun kerangka berpikir yang logis dan rapi."

const CAPS_S1: CaptionWord[] = [
  { word: "Bab", start: 6 },
  { word: "1", start: 13 },
  { word: "udah", start: 20 },
  { word: "ACC,", start: 27 },
  { word: "tapi", start: 37 },
  { word: "pas", start: 44 },
  { word: "masuk", start: 51 },
  { word: "Bab", start: 60 },
  { word: "2", start: 67 },
  { word: "tiba-tiba", start: 74 },
  { word: "bingung", start: 85 },
  { word: "bikin", start: 95 },
  { word: "diagram", start: 104 },
  { word: "kerangka", start: 114 },
  { word: "berpikir?", start: 124 },
  { word: "Tenang,", start: 140 },
  { word: "di", start: 150 },
  { word: "sini", start: 157 },
  { word: "kita", start: 165 },
  { word: "bedah", start: 173 },
  { word: "bareng", start: 182 },
  { word: "cara", start: 192 },
  { word: "menyusun", start: 200 },
  { word: "kerangka", start: 210 },
  { word: "berpikir", start: 220 },
  { word: "yang", start: 230 },
  { word: "logis", start: 238 },
  { word: "dan", start: 247 },
  { word: "rapi.", start: 255 },
];

// ── SVG BACKGROUND — Scene 1: Meja Belajar Mahasiswa ─────────────────────────
// Wall/room: Y 0-1070. Desk surface: Y 1070-1200. Below desk: Y 1200-1600.
// Safe zone for RunningCaption: Y 1680-1920 — NO elements here.

const MejaBelajarBg: React.FC = () => (
  <svg
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <defs>
      <linearGradient id="s8WallGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0C1220" />
        <stop offset="50%" stopColor="#11213A" />
        <stop offset="100%" stopColor="#0D1828" />
      </linearGradient>
      <radialGradient id="s8LampGlow" cx="18%" cy="52%" r="35%">
        <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.32" />
        <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="s8DeskGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#B87333" />
        <stop offset="50%" stopColor="#9B6019" />
        <stop offset="100%" stopColor="#7A4A0F" />
      </linearGradient>
      <linearGradient id="s8FloorGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#080D18" />
        <stop offset="100%" stopColor="#030609" />
      </linearGradient>
      <linearGradient id="s8ScreenGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F0F4F8" />
        <stop offset="100%" stopColor="#DCE5EF" />
      </linearGradient>
      <filter id="s8LapShadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="18" stdDeviation="22" floodOpacity="0.55" />
      </filter>
    </defs>

    {/* Room wall */}
    <rect width="1080" height="1920" fill="url(#s8WallGrad)" />
    <ellipse cx="200" cy="980" rx="320" ry="300" fill="url(#s8LampGlow)" />

    {/* Left bookshelf */}
    <rect x="44" y="120" width="310" height="16" rx="4" fill="#B87333" />
    <rect x="64" y="68" width="30" height="54" rx="3" fill="#3B82F6" />
    <rect x="98" y="56" width="26" height="66" rx="3" fill="#EF4444" />
    <rect x="128" y="72" width="34" height="50" rx="3" fill="#10B981" />
    <rect x="166" y="60" width="28" height="62" rx="3" fill="#F59E0B" />
    <rect x="198" y="78" width="38" height="44" rx="3" fill="#8B5CF6" />
    <rect x="240" y="64" width="30" height="58" rx="3" fill="#E84040" />

    {/* Right bookshelf */}
    <rect x="726" y="120" width="310" height="16" rx="4" fill="#B87333" />
    <rect x="748" y="54" width="34" height="68" rx="3" fill="#6366F1" />
    <rect x="786" y="68" width="28" height="54" rx="3" fill="#F59E0B" />
    <rect x="818" y="46" width="36" height="76" rx="3" fill="#EF4444" />
    <rect x="858" y="60" width="30" height="62" rx="3" fill="#10B981" />
    <rect x="892" y="72" width="40" height="50" rx="3" fill="#3B82F6" />
    <rect x="936" y="54" width="28" height="68" rx="3" fill="#E9A21B" />

    {/* Motivational poster — center wall top */}
    <rect x="400" y="80" width="280" height="190" rx="10" fill="#1A2A44" stroke="#E9A21B" strokeWidth="3" />
    <text x="540" y="138" textAnchor="middle" fill="#E9A21B" fontSize="18" fontWeight="900" fontFamily="system-ui, sans-serif">JANGAN MENYERAH</text>
    <text x="540" y="165" textAnchor="middle" fill="#64748B" fontSize="13" fontFamily="system-ui, sans-serif">Skripsi itu proses belajar</text>
    <line x1="430" y1="182" x2="650" y2="182" stroke="#334155" strokeWidth="1.5" />
    <text x="540" y="207" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="system-ui, sans-serif">@jagoneliti_</text>

    {/* Laptop centered at Y: 550-1060 */}
    <rect x="175" y="550" width="730" height="495" rx="24" fill="#1E293B" filter="url(#s8LapShadow)" />
    <rect x="196" y="572" width="688" height="453" rx="16" fill="url(#s8ScreenGrad)" />
    <rect x="212" y="588" width="656" height="421" rx="10" fill="#FFFFFF" />

    {/* Browser chrome */}
    <rect x="212" y="588" width="656" height="40" rx="10" fill="#F1F3F5" />
    <circle cx="236" cy="608" r="8" fill="#EF4444" opacity="0.8" />
    <circle cx="258" cy="608" r="8" fill="#F59E0B" opacity="0.8" />
    <circle cx="280" cy="608" r="8" fill="#10B981" opacity="0.8" />
    <rect x="308" y="599" width="480" height="18" rx="9" fill="#E2E8F0" />
    <text x="548" y="612" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="system-ui, sans-serif">docs.google.com/document/skripsi-bab2</text>

    {/* Document content on screen */}
    <text x="540" y="658" textAnchor="middle" fill="#0F172A" fontSize="20" fontWeight="900" fontFamily="system-ui, sans-serif">BAB 2 - KERANGKA BERPIKIR</text>
    <text x="540" y="684" textAnchor="middle" fill="#64748B" fontSize="14" fontFamily="system-ui, sans-serif">A. Kerangka Konseptual</text>
    <rect x="248" y="704" width="180" height="7" rx="3" fill="#CBD5E1" />
    <rect x="248" y="722" width="588" height="7" rx="3" fill="#E2E8F0" />
    <rect x="248" y="740" width="520" height="7" rx="3" fill="#E2E8F0" />

    {/* Confused diagram attempt */}
    <rect x="248" y="768" width="140" height="60" rx="8" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2" />
    <text x="318" y="803" textAnchor="middle" fill="#854D0E" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">Variabel X</text>
    <line x1="388" y1="798" x2="440" y2="798" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5,4" />
    <text x="418" y="793" fill="#EF4444" fontSize="18" fontWeight="900" fontFamily="system-ui, sans-serif">?</text>
    <rect x="440" y="768" width="140" height="60" rx="8" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2" />
    <text x="510" y="803" textAnchor="middle" fill="#854D0E" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">Variabel Y</text>
    <line x1="580" y1="798" x2="630" y2="798" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5,4" />
    <text x="612" y="793" fill="#EF4444" fontSize="18" fontWeight="900" fontFamily="system-ui, sans-serif">?</text>
    <rect x="630" y="768" width="140" height="60" rx="8" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2" />
    <text x="700" y="803" textAnchor="middle" fill="#854D0E" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">Variabel Z</text>

    <text x="390" y="870" textAnchor="middle" fill="#EF4444" fontSize="32" fontWeight="900" fontFamily="system-ui, sans-serif">???</text>
    <text x="540" y="916" textAnchor="middle" fill="#94A3B8" fontSize="13" fontFamily="system-ui, sans-serif">diagram belum selesai...</text>
    <rect x="248" y="935" width="340" height="7" rx="3" fill="#E2E8F0" />

    {/* Laptop base */}
    <rect x="145" y="1040" width="790" height="22" rx="7" fill="#334155" />
    <rect x="320" y="1052" width="440" height="10" rx="5" fill="#475569" />

    {/* Desk surface Y: 1070-1200 */}
    <polygon points="0,1068 1080,1068 1080,1200 0,1200" fill="url(#s8DeskGrad)" />
    <rect x="0" y="1068" width="1080" height="7" fill="#000000" opacity="0.35" />
    <line x1="0" y1="1110" x2="1080" y2="1110" stroke="#9B6019" strokeWidth="1.5" opacity="0.3" />
    <line x1="0" y1="1150" x2="1080" y2="1150" stroke="#9B6019" strokeWidth="1.5" opacity="0.25" />

    {/* Coffee mug */}
    <rect x="900" y="1010" width="62" height="52" rx="8" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="3" />
    <path d="M 962 1025 Q 980 1035 962 1046" stroke="#CBD5E1" strokeWidth="5" fill="none" />
    <text x="931" y="1042" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="system-ui, sans-serif">KOPI</text>

    {/* Sticky note deadline */}
    <rect x="78" y="990" width="82" height="70" rx="4" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" />
    <text x="119" y="1015" textAnchor="middle" fill="#854D0E" fontSize="10" fontWeight="700" fontFamily="system-ui, sans-serif">DEADLINE</text>
    <text x="119" y="1033" textAnchor="middle" fill="#991B1B" fontSize="13" fontWeight="900" fontFamily="system-ui, sans-serif">2 MGG</text>
    <text x="119" y="1049" textAnchor="middle" fill="#854D0E" fontSize="9" fontFamily="system-ui, sans-serif">LAGI!!!!</text>

    {/* Desk lamp */}
    <line x1="920" y1="1050" x2="900" y2="900" stroke="#94A3B8" strokeWidth="7" strokeLinecap="round" />
    <line x1="900" y1="900" x2="820" y2="840" stroke="#94A3B8" strokeWidth="7" strokeLinecap="round" />
    <ellipse cx="780" cy="824" rx="48" ry="22" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="3" />
    <ellipse cx="780" cy="920" rx="80" ry="40" fill="#FDE68A" opacity="0.28" />

    {/* Floor Y: 1200-1600 */}
    <polygon points="0,1200 1080,1200 1080,1600 0,1600" fill="url(#s8FloorGrad)" />

    {/* Safe zone Y: 1600-1920 — clear for RunningCaption */}
    <rect x="0" y="1600" width="1080" height="320" fill="#030609" />
  </svg>
);

// ── STUDENT CHARACTER ─────────────────────────────────────────────────────────

const MahasiswaBingung: React.FC = () => (
  <svg
    viewBox="0 0 400 560"
    style={{ width: "280px", height: "380px", display: "block", overflow: "visible" }}
  >
    <defs>
      <filter id="s8CharShadow" x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="12" stdDeviation="10" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#s8CharShadow)">
      {/* Body — navy hoodie */}
      <path d="M 100 305 Q 195 288 300 305 L 318 530 L 82 530 Z" fill="#1E3A6E" stroke="#0F2044" strokeWidth="3" />
      {/* Hoodie pocket */}
      <rect x="155" y="360" width="90" height="50" rx="8" fill="#163060" stroke="#0F2044" strokeWidth="2" />
      {/* Hoodie strings */}
      <line x1="190" y1="305" x2="175" y2="365" stroke="#0F2044" strokeWidth="4" strokeLinecap="round" />
      <line x1="210" y1="305" x2="225" y2="365" stroke="#0F2044" strokeWidth="4" strokeLinecap="round" />
      {/* Neck */}
      <rect x="178" y="258" width="44" height="52" rx="6" fill="#FFEDD5" />
      {/* Head */}
      <ellipse cx="200" cy="200" rx="72" ry="78" fill="#FFEDD5" stroke="#EA580C" strokeWidth="3" />
      {/* Hair messy */}
      <path d="M 128 172 Q 132 92 200 90 Q 272 90 272 172 Q 238 128 200 132 Q 158 128 128 172 Z" fill="#1E293B" />
      <path d="M 200 92 Q 208 62 220 80" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M 200 92 Q 188 58 178 76" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Furrowed eyebrows */}
      <path d="M 148 162 Q 170 150 180 162" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 220 162 Q 230 150 252 162" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Wide confused eyes */}
      <ellipse cx="166" cy="190" rx="15" ry="18" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
      <circle cx="168" cy="193" r="7" fill="#1E293B" />
      <ellipse cx="234" cy="190" rx="15" ry="18" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
      <circle cx="232" cy="193" r="7" fill="#1E293B" />
      {/* Sweat drops */}
      <ellipse cx="272" cy="152" rx="8" ry="12" fill="#BAE6FD" opacity="0.88" />
      <ellipse cx="118" cy="168" rx="7" ry="10" fill="#BAE6FD" opacity="0.78" />
      {/* Open mouth */}
      <path d="M 178 238 Q 200 255 222 238 Q 200 228 178 238 Z" fill="#991B1B" stroke="#1E293B" strokeWidth="3" />
      {/* Left arm resting */}
      <path d="M 106 325 Q 70 395 68 450" stroke="#1E293B" strokeWidth="36" strokeLinecap="round" fill="none" />
      <path d="M 68 450 Q 72 480 110 480" stroke="#1E293B" strokeWidth="28" strokeLinecap="round" fill="none" />
      <circle cx="68" cy="445" r="14" fill="#FFEDD5" />
      {/* Right arm raised — hand on head */}
      <path d="M 292 325 Q 328 355 340 388" stroke="#1E293B" strokeWidth="36" strokeLinecap="round" fill="none" />
      <circle cx="342" cy="395" r="14" fill="#FFEDD5" />
      <rect x="310" y="180" width="58" height="32" rx="12" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2" />
    </g>
  </svg>
);

// ── SCENE 1 ───────────────────────────────────────────────────────────────────

const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 140 } });
  const charSpring = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 110 } });
  const bubbleSpring = spring({ frame: frame - 50, fps, config: { damping: 14, stiffness: 125 } });

  const cursorBlink = Math.floor(frame / 18) % 2 === 0 ? 1 : 0;

  const qFloat1 = interpolate(Math.sin(frame * 0.08), [-1, 1], [-6, 6]);
  const qFloat2 = interpolate(Math.sin(frame * 0.06 + 1), [-1, 1], [-8, 4]);
  const qOpacity1 = clamp(interpolate(frame, [20, 40], [0, 1]), 0, 1);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <MejaBelajarBg />

      {/* Blinking cursor on laptop screen */}
      <div
        style={{
          position: "absolute",
          top: "940px",
          left: "260px",
          width: "3px",
          height: "18px",
          background: "#0F172A",
          opacity: cursorBlink,
          zIndex: 5,
        }}
      />

      {/* Floating question marks — flanking character below desk */}
      <div
        style={{
          position: "absolute",
          top: `${1150 + qFloat1}px`,
          left: "780px",
          fontSize: "52px",
          fontWeight: 900,
          color: "#E9A21B",
          opacity: qOpacity1 * 0.9,
          fontFamily: "system-ui, sans-serif",
          zIndex: 30,
          textShadow: "0 4px 16px rgba(233,162,27,0.5)",
        }}
      >
        ?
      </div>
      <div
        style={{
          position: "absolute",
          top: `${1120 + qFloat2}px`,
          left: "60px",
          fontSize: "38px",
          fontWeight: 900,
          color: "#E9A21B",
          opacity: qOpacity1 * 0.7,
          fontFamily: "system-ui, sans-serif",
          zIndex: 30,
          textShadow: "0 4px 16px rgba(233,162,27,0.4)",
        }}
      >
        ?
      </div>

      {/* Header Card — tepat di atas layar laptop (laptop SVG Y:550) */}
      <div
        style={{
          position: "absolute",
          top: "470px",
          left: "30px",
          right: "30px",
          zIndex: 40,
          transform: `scale(${titleSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0F2044 0%, #1A3660 100%)",
            color: "#F4F0EA",
            padding: "18px 30px",
            borderRadius: "20px",
            boxShadow: "0 14px 40px rgba(15,32,68,0.75), 0 0 0 4px #E9A21B",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <polygon points="20,5 38,15 20,25 2,15" fill="#E9A21B" />
            <rect x="29" y="15" width="4" height="14" rx="2" fill="#E9A21B" />
            <ellipse cx="31" cy="30" rx="5" ry="4" fill="#E9A21B" opacity="0.7" />
            <path d="M 10 17 L 10 28 Q 20 33 30 28 L 30 17" fill="#0F2044" stroke="#E9A21B" strokeWidth="1.5" />
          </svg>
          <span style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "0.5px" }}>
            PART 3 — BAB 2 KERANGKA BERPIKIR
          </span>
        </div>
      </div>

      {/* Karakter Mahasiswa Bingung — di bawah meja, Y: 1085px */}
      <div
        style={{
          position: "absolute",
          top: "1085px",
          left: "50%",
          transform: `translateX(-50%) scale(${charSpring})`,
          transformOrigin: "top center",
          zIndex: 20,
        }}
      >
        <MahasiswaBingung />
      </div>

      {/* Speech Bubble — proporsional di bawah karakter, Y: 1390px */}
      <div
        style={{
          position: "absolute",
          top: "1390px",
          left: "30px",
          right: "30px",
          zIndex: 50,
          opacity: bubbleSpring,
          transform: `translateY(${interpolate(bubbleSpring, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            position: "relative",
            background: "#FFFFFF",
            border: "4px solid #0F2044",
            borderRadius: "24px",
            padding: "22px 28px",
            boxShadow: "0 16px 45px rgba(0,0,0,0.5)",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              fontWeight: 900,
              color: "#0F2044",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            BAB 1 ACC...{" "}
            <span style={{ color: "#E84040" }}>PAS MASUK BAB 2</span>
            <br />
            BINGUNG DIAGRAM?
          </div>
          {/* Tail pointing up */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "16px solid transparent",
              borderRight: "16px solid transparent",
              borderBottom: "20px solid #0F2044",
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
              borderLeft: "13px solid transparent",
              borderRight: "13px solid transparent",
              borderBottom: "16px solid #FFFFFF",
            }}
          />
        </div>
      </div>

      {/* RunningCaption — strict Y: 1680px */}
      <RunningCaption words={CAPS_S1} frame={frame} accentColor="#E9A21B" top="1680px" />
    </AbsoluteFill>
  );
};

// ── CAPTION WORDS — Scene 2 (~3 kata/detik, 1 kata ≈ 10 frames) ──────────────
// VO: "Langkah pertama, tentukan dulu Variabel Y kamu, yaitu masalah
//      utama yang ingin kamu teliti. Contohnya: penurunan kinerja
//      karyawan. Ini jadi fondasi seluruh kerangka berpikir kamu."

const CAPS_S2: CaptionWord[] = [
  { word: "Langkah", start: 6 },
  { word: "pertama,", start: 15 },
  { word: "tentukan", start: 28 },
  { word: "dulu", start: 37 },
  { word: "Variabel", start: 46 },
  { word: "Y", start: 55 },
  { word: "kamu,", start: 62 },
  { word: "yaitu", start: 72 },
  { word: "masalah", start: 80 },
  { word: "utama", start: 89 },
  { word: "yang", start: 98 },
  { word: "ingin", start: 106 },
  { word: "kamu", start: 115 },
  { word: "teliti.", start: 123 },
  { word: "Contohnya:", start: 137 },
  { word: "penurunan", start: 148 },
  { word: "kinerja", start: 158 },
  { word: "karyawan.", start: 168 },
  { word: "Ini", start: 183 },
  { word: "jadi", start: 191 },
  { word: "fondasi", start: 199 },
  { word: "seluruh", start: 208 },
  { word: "kerangka", start: 218 },
  { word: "berpikir", start: 227 },
  { word: "kamu.", start: 236 },
];

// ── SCENE 2 ───────────────────────────────────────────────────────────────────
// Layout (Y dalam 1080x1920 canvas):
//   Card Poin 1   Y: 250px
//   Diagram Box Y Y: 650px - 1100px
//   Dekorasi meja Y: 1150px - 1550px
//   Safe zone     Y: 1600px - 1920px  →  RunningCaption Y: 1680px

const Scene2_Langkah1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame: frame - 4, fps, config: { damping: 12, stiffness: 130 } });
  const boxSpring  = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 110 } });
  const decoSpring = spring({ frame: frame - 45, fps, config: { damping: 16, stiffness: 100 } });

  // Arrow pulse for emphasis
  const arrowPulse = 0.85 + 0.15 * Math.sin(frame * 0.12);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* ── Background — deep study room, consistent with Scene 1 palette ── */}
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="s8S2Bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0A1020" />
            <stop offset="55%" stopColor="#0F1C34" />
            <stop offset="100%" stopColor="#080D18" />
          </linearGradient>
          {/* Crimson accent glow for Variabel Y theme */}
          <radialGradient id="s8S2Glow" cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="s8S2Desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="50%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
          <filter id="s8S2BoxShadow" x="-8%" y="-8%" width="116%" height="116%">
            <feDropShadow dx="0" dy="14" stdDeviation="18" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Room */}
        <rect width="1080" height="1920" fill="url(#s8S2Bg)" />
        <ellipse cx="540" cy="650" rx="680" ry="480" fill="url(#s8S2Glow)" />

        {/* Subtle wall line */}
        <line x1="0" y1="1150" x2="1080" y2="1150" stroke="#1E293B" strokeWidth="2" />

        {/* Desk surface Y: 1150-1260 */}
        <polygon points="0,1150 1080,1150 1080,1260 0,1260" fill="url(#s8S2Desk)" />
        <rect x="0" y="1150" width="1080" height="7" fill="#000000" opacity="0.4" />
        {/* Wood grain */}
        <line x1="0" y1="1195" x2="1080" y2="1195" stroke="#92400E" strokeWidth="1.5" opacity="0.3" />
        <line x1="0" y1="1235" x2="1080" y2="1235" stroke="#92400E" strokeWidth="1.5" opacity="0.25" />

        {/* Floor/wall area Y: 1260-1600 */}
        <rect x="0" y="1260" width="1080" height="340" fill="#05080F" />

        {/* Whiteboard leaning on back wall — center, Y: 1275-1545 */}
        <rect x="280" y="1278" width="520" height="260" rx="14" fill="#1A2A1A" stroke="#2D4A2D" strokeWidth="4" />
        {/* Whiteboard frame inner */}
        <rect x="294" y="1292" width="492" height="232" rx="8" fill="#F0FFF0" />
        {/* Whiteboard label */}
        <text x="540" y="1316" textAnchor="middle" fill="#166534" fontSize="14" fontWeight="900" fontFamily="system-ui, sans-serif">KERANGKA BERPIKIR</text>
        <line x1="310" y1="1322" x2="770" y2="1322" stroke="#166534" strokeWidth="1.5" opacity="0.5" />
        {/* Mini diagram on whiteboard: Y box in center */}
        <rect x="435" y="1335" width="210" height="70" rx="8" fill="#FEE2E2" stroke="#EF4444" strokeWidth="3" />
        <text x="540" y="1360" textAnchor="middle" fill="#991B1B" fontSize="13" fontWeight="900" fontFamily="system-ui, sans-serif">VARIABEL Y</text>
        <text x="540" y="1378" textAnchor="middle" fill="#DC2626" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">Penurunan Kinerja</text>
        {/* Dashed arrows from Y box indicating X vars to come */}
        <line x1="435" y1="1370" x2="360" y2="1370" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6,4" />
        <text x="330" y="1367" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="system-ui, sans-serif">X?</text>
        <line x1="645" y1="1370" x2="720" y2="1370" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6,4" />
        <text x="750" y="1367" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="system-ui, sans-serif">X?</text>
        {/* Board base */}
        <line x1="350" y1="1538" x2="440" y2="1540" stroke="#4ADE80" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
        <line x1="640" y1="1538" x2="730" y2="1540" stroke="#4ADE80" strokeWidth="5" strokeLinecap="round" opacity="0.5" />

        {/* File cabinet — left wall, Y: 1280-1540 */}
        <rect x="42" y="1284" width="120" height="250" rx="8" fill="#1E3A5F" stroke="#2D5A8E" strokeWidth="3" />
        {/* Drawer 1 */}
        <rect x="54" y="1300" width="96" height="60" rx="5" fill="#163060" stroke="#2D5A8E" strokeWidth="2" />
        <rect x="90" y="1326" width="24" height="8" rx="4" fill="#E9A21B" />
        <text x="102" y="1318" textAnchor="middle" fill="#93C5FD" fontSize="9" fontFamily="system-ui, sans-serif">DATA</text>
        {/* Drawer 2 */}
        <rect x="54" y="1372" width="96" height="60" rx="5" fill="#163060" stroke="#2D5A8E" strokeWidth="2" />
        <rect x="90" y="1398" width="24" height="8" rx="4" fill="#E9A21B" />
        <text x="102" y="1390" textAnchor="middle" fill="#93C5FD" fontSize="9" fontFamily="system-ui, sans-serif">JURNAL</text>
        {/* Drawer 3 */}
        <rect x="54" y="1444" width="96" height="60" rx="5" fill="#163060" stroke="#2D5A8E" strokeWidth="2" />
        <rect x="90" y="1470" width="24" height="8" rx="4" fill="#E9A21B" />
        <text x="102" y="1462" textAnchor="middle" fill="#93C5FD" fontSize="9" fontFamily="system-ui, sans-serif">REFERENSI</text>

        {/* Document stack — right wall, Y: 1310-1540 */}
        {/* Base stack */}
        <rect x="880" y="1420" width="130" height="16" rx="4" fill="#475569" />
        <rect x="884" y="1402" width="122" height="20" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
        <text x="945" y="1416" textAnchor="middle" fill="#1E293B" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">Literatur Review</text>
        <rect x="876" y="1380" width="128" height="24" rx="4" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2" />
        <text x="940" y="1396" textAnchor="middle" fill="#854D0E" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">Teori Kinerja SDM</text>
        <rect x="880" y="1356" width="120" height="26" rx="4" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
        <text x="940" y="1373" textAnchor="middle" fill="#991B1B" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">Variabel Y: Kinerja</text>
        <rect x="872" y="1330" width="132" height="28" rx="4" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
        <text x="938" y="1348" textAnchor="middle" fill="#5B21B6" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">Penelitian Terdahulu</text>

        {/* Safe zone Y: 1600-1920 */}
        <rect x="0" y="1600" width="1080" height="320" fill="#030609" />


        {/* ── Dekorasi meja: Buku, Kopi, Catatan ── */}
        {/* Stack of books — left of desk */}
        <rect x="60" y="1090" width="52" height="70" rx="4" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2" />
        <rect x="72" y="1082" width="48" height="70" rx="4" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
        <rect x="84" y="1074" width="50" height="70" rx="4" fill="#10B981" stroke="#065F46" strokeWidth="2" />
        {/* Book spines text */}
        <text x="95" y="1116" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif" transform="rotate(90 95 1116)">METODOLOGI</text>

        {/* Kopi mug — right side desk */}
        <rect x="900" y="1088" width="68" height="58" rx="10" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="3" />
        <path d="M 968 1104 Q 988 1115 968 1127" stroke="#CBD5E1" strokeWidth="6" fill="none" />
        <ellipse cx="934" cy="1100" rx="22" ry="6" fill="#C2410C" opacity="0.7" />
        <text x="934" y="1126" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="system-ui, sans-serif">KOPI</text>

        {/* Catatan/notes sticky — center-right desk */}
        <rect x="580" y="1078" width="110" height="80" rx="5" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" />
        {/* Pin */}
        <circle cx="635" cy="1082" r="5" fill="#EF4444" />
        <text x="635" y="1108" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">VARIABEL</text>
        <text x="635" y="1124" textAnchor="middle" fill="#991B1B" fontSize="14" fontWeight="900" fontFamily="system-ui, sans-serif">Y = ?</text>
        <text x="635" y="1143" textAnchor="middle" fill="#854D0E" fontSize="9" fontFamily="system-ui, sans-serif">tentukan dulu!</text>

        {/* Pensil */}
        <rect x="380" y="1140" width="200" height="12" rx="5" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
        <polygon points="380,1140 380,1152 366,1146" fill="#FFEDD5" />
        <rect x="554" y="1140" width="26" height="12" rx="2" fill="#EF4444" />
      </svg>

      {/* ── Card Poin 1 — Y: 250px ── */}
      <div
        style={{
          position: "absolute",
          top: "250px",
          left: "30px",
          right: "30px",
          zIndex: 40,
          transform: `scale(${cardSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #7F1D1D 0%, #991B1B 50%, #B91C1C 100%)",
            border: "4px solid #EF4444",
            borderRadius: "24px",
            padding: "28px 34px",
            boxShadow: "0 18px 50px rgba(220,38,38,0.45), 0 0 0 2px #EF444466",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Step label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                background: "#EF4444",
                color: "#FFFFFF",
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "34px",
                fontWeight: 900,
                boxShadow: "0 8px 24px rgba(239,68,68,0.6)",
                flexShrink: 0,
              }}
            >
              1
            </div>
            <div>
              <div
                style={{
                  color: "#FCA5A5",
                  fontSize: "20px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                LANGKAH 1
              </div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: "30px",
                  fontWeight: 900,
                  lineHeight: 1.2,
                }}
              >
                TENTUKAN MASALAH UTAMA
              </div>
            </div>
          </div>
          <div
            style={{
              color: "#FECACA",
              fontSize: "26px",
              fontWeight: 800,
              textAlign: "center",
              letterSpacing: "0.5px",
            }}
          >
            VARIABEL Y
          </div>
        </div>
      </div>

      {/* ── Diagram Box Variabel Y — Y: 650px ── */}
      <div
        style={{
          position: "absolute",
          top: "650px",
          left: "50px",
          right: "50px",
          zIndex: 35,
          opacity: boxSpring,
          transform: `translateY(${(1 - boxSpring) * 30}px)`,
        }}
      >
        {/* Context label */}
        <div
          style={{
            textAlign: "center",
            color: "#94A3B8",
            fontSize: "22px",
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
            marginBottom: "20px",
            letterSpacing: "1px",
          }}
        >
          KERANGKA BERPIKIR
        </div>

        {/* Main Y box */}
        <div
          style={{
            background: "linear-gradient(135deg, #450A0A 0%, #7F1D1D 100%)",
            border: "5px solid #EF4444",
            borderRadius: "28px",
            padding: "36px 40px",
            boxShadow: "0 20px 60px rgba(239,68,68,0.4), 0 0 0 3px #EF444433",
            fontFamily: "system-ui, -apple-system, sans-serif",
            position: "relative",
          }}
        >
          {/* Y label badge */}
          <div
            style={{
              position: "absolute",
              top: "-22px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#EF4444",
              color: "#FFFFFF",
              padding: "6px 28px",
              borderRadius: "30px",
              fontSize: "22px",
              fontWeight: 900,
              boxShadow: "0 6px 20px rgba(239,68,68,0.5)",
              letterSpacing: "2px",
            }}
          >
            VARIABEL Y
          </div>

          <div
            style={{
              color: "#FEF2F2",
              fontSize: "34px",
              fontWeight: 900,
              textAlign: "center",
              lineHeight: 1.25,
              paddingTop: "12px",
            }}
          >
            Penurunan Kinerja
            <br />
            <span style={{ color: "#FCA5A5" }}>Karyawan</span>
          </div>

          {/* Explanation row */}
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {["Masalah Utama", "Fenomena", "Yang Diteliti"].map((tag) => (
              <span
                key={tag}
                style={{
                  background: "#EF444422",
                  border: "2px solid #EF444466",
                  color: "#FCA5A5",
                  borderRadius: "10px",
                  padding: "6px 16px",
                  fontSize: "19px",
                  fontWeight: 700,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow down indicating "this feeds into the framework" */}
        <div
          style={{
            textAlign: "center",
            marginTop: "28px",
            transform: `scaleY(${arrowPulse})`,
            transformOrigin: "top center",
          }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M 30 4 L 30 44" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
            <path d="M 12 30 L 30 50 L 48 30" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        {/* Sub-note below arrow */}
        <div
          style={{
            textAlign: "center",
            color: "#64748B",
            fontSize: "21px",
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
            opacity: decoSpring,
          }}
        >
          Fondasi seluruh kerangka berpikir
        </div>
      </div>

      {/* ── RunningCaption — strict Y: 1680px ── */}
      <RunningCaption words={CAPS_S2} frame={frame} accentColor="#EF4444" top="1680px" />
    </AbsoluteFill>
  );
};

// ── CAPTION WORDS — Scene 3 (VO asli, ~10 frames/kata) ──────────────────────
// VO: "Kedua... cari dua faktor penyebabnya sebagai variabel X-SATU dan X-DUA.
//      Contoh... Beban Kerja, dan Lingkungan Kantor."

const CAPS_S3: CaptionWord[] = [
  { word: "Kedua...", start: 6 },
  { word: "cari", start: 28 },
  { word: "dua", start: 38 },
  { word: "faktor", start: 48 },
  { word: "penyebabnya", start: 58 },
  { word: "sebagai", start: 72 },
  { word: "variabel", start: 82 },
  { word: "X-SATU", start: 92 },
  { word: "dan", start: 103 },
  { word: "X-DUA.", start: 113 },
  { word: "Contoh...", start: 130 },
  { word: "Beban", start: 152 },
  { word: "Kerja,", start: 162 },
  { word: "dan", start: 175 },
  { word: "Lingkungan", start: 185 },
  { word: "Kantor.", start: 197 },
];

// ── SCENE 3: LANGKAH 2 — VARIABEL X (FAKTOR PENYEBAB) ─────────────────────────
// Layout budget (1080x1920):
//   Card Poin 2        Y: 240px - 410px
//   Diagram Hubungan   Y: 480px - 1090px (X1 & X2 -> Arrow -> Y)
//   Desk Surface       Y: 1150px - 1260px
//   Thematic Whiteboard Y: 1260px - 1580px (Updated evolving research board)
//   Safe Zone          Y: 1600px - 1920px (RunningCaption @ Y: 1680px)

const Scene3_Langkah2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame: frame - 3, fps, config: { damping: 12, stiffness: 130 } });
  const boxX1Spring = spring({ frame: frame - 18, fps, config: { damping: 13, stiffness: 120 } });
  const boxX2Spring = spring({ frame: frame - 28, fps, config: { damping: 13, stiffness: 120 } });
  const arrowSpring = spring({ frame: frame - 42, fps, config: { damping: 14, stiffness: 110 } });
  const boxYSpring  = spring({ frame: frame - 55, fps, config: { damping: 14, stiffness: 110 } });
  const boardSpring = spring({ frame: frame - 65, fps, config: { damping: 15, stiffness: 100 } });

  const pulse = 1 + 0.04 * Math.sin(frame * 0.15);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* ── Background SVG ── */}
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="s8S3Bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#070C1A" />
            <stop offset="50%" stopColor="#0B162E" />
            <stop offset="100%" stopColor="#050912" />
          </linearGradient>
          <radialGradient id="s8S3Glow" cx="50%" cy="32%" r="55%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="s8S3Desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="50%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
          <linearGradient id="s8S3BoardFrame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>

        {/* Studio wall */}
        <rect width="1080" height="1920" fill="url(#s8S3Bg)" />
        <rect width="1080" height="1920" fill="url(#s8S3Glow)" />

        {/* Ambient room vertical grid lines */}
        <line x1="200" y1="0" x2="200" y2="1150" stroke="#1E293B" strokeWidth="1" opacity="0.4" />
        <line x1="880" y1="0" x2="880" y2="1150" stroke="#1E293B" strokeWidth="1" opacity="0.4" />

        {/* Desk surface Y: 1150 - 1260px */}
        <polygon points="0,1150 1080,1150 1080,1260 0,1260" fill="url(#s8S3Desk)" />
        <rect x="0" y="1150" width="1080" height="7" fill="#000000" opacity="0.4" />
        <line x1="0" y1="1195" x2="1080" y2="1195" stroke="#92400E" strokeWidth="1.5" opacity="0.3" />
        <line x1="0" y1="1235" x2="1080" y2="1235" stroke="#92400E" strokeWidth="1.5" opacity="0.25" />

        {/* Floor area Y: 1260 - 1600px */}
        <rect x="0" y="1260" width="1080" height="340" fill="#05080F" />

        {/* ── THEMATIC OBJECT AREA Y: 1260 - 1600px (Updated Whiteboard + Research Workspace) ── */}
        <g opacity={boardSpring} transform={`translate(0, ${(1 - boardSpring) * 20})`}>
          {/* Main Whiteboard: Y: 1275 - 1555px */}
          <rect x="230" y="1275" width="620" height="275" rx="14" fill="#0F172A" stroke="#334155" strokeWidth="5" />
          <rect x="244" y="1288" width="592" height="248" rx="8" fill="#F8FAFC" />

          {/* Whiteboard Header */}
          <rect x="244" y="1288" width="592" height="34" rx="8" fill="#E2E8F0" />
          <text x="540" y="1310" textAnchor="middle" fill="#0F172A" fontSize="13" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1px">
            PROGRESS KERANGKA BERPIKIR (UPDATE)
          </text>
          <line x1="244" y1="1322" x2="836" y2="1322" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Diagram on Whiteboard: X1 and X2 leading to Y */}
          {/* Box X1 */}
          <rect x="268" y="1340" width="145" height="52" rx="6" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2.5" />
          <text x="340.5" y="1361" textAnchor="middle" fill="#1E40AF" fontSize="11" fontWeight="900" fontFamily="system-ui, sans-serif">X1: Beban Kerja</text>
          <text x="340.5" y="1378" textAnchor="middle" fill="#3B82F6" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">H1: Pengaruh Positif</text>

          {/* Box X2 */}
          <rect x="268" y="1410" width="145" height="52" rx="6" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2.5" />
          <text x="340.5" y="1431" textAnchor="middle" fill="#5B21B6" fontSize="11" fontWeight="900" fontFamily="system-ui, sans-serif">X2: Motivasi Kerja</text>
          <text x="340.5" y="1448" textAnchor="middle" fill="#8B5CF6" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">H2: Pengaruh Positif</text>

          {/* Connecting Arrows to Y on Whiteboard */}
          <path d="M 413 1366 L 490 1395" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" markerEnd="none" />
          <polygon points="494,1396 484,1390 488,1402" fill="#2563EB" />
          <path d="M 413 1436 L 490 1405" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" markerEnd="none" />
          <polygon points="494,1404 488,1398 484,1410" fill="#7C3AED" />

          {/* Box Y on Whiteboard */}
          <rect x="500" y="1365" width="165" height="70" rx="8" fill="#FEE2E2" stroke="#EF4444" strokeWidth="3" />
          <text x="582.5" y="1392" textAnchor="middle" fill="#991B1B" fontSize="12" fontWeight="900" fontFamily="system-ui, sans-serif">VARIABEL Y</text>
          <text x="582.5" y="1412" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="800" fontFamily="system-ui, sans-serif">Penurunan Kinerja</text>

          {/* Sticky notes on right side of whiteboard */}
          <rect x="686" y="1340" width="132" height="60" rx="4" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.5" />
          <circle cx="752" cy="1344" r="3" fill="#EF4444" />
          <text x="752" y="1362" textAnchor="middle" fill="#854D0E" fontSize="9" fontWeight="900" fontFamily="system-ui, sans-serif">TEORI SDM</text>
          <text x="752" y="1378" textAnchor="middle" fill="#A16207" fontSize="8" fontFamily="system-ui, sans-serif">Robbins & Judge (2020)</text>
          <text x="752" y="1391" textAnchor="middle" fill="#15803D" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">✓ 5 Jurnal Terindeks</text>

          <rect x="686" y="1415" width="132" height="48" rx="4" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1.5" />
          <circle cx="752" cy="1419" r="3" fill="#3B82F6" />
          <text x="752" y="1436" textAnchor="middle" fill="#166534" fontSize="9" fontWeight="900" fontFamily="system-ui, sans-serif">STATUS BAB 2</text>
          <text x="752" y="1451" textAnchor="middle" fill="#15803D" fontSize="8" fontFamily="system-ui, sans-serif">Kerangka Selesai 80%</text>

          {/* Whiteboard Pen Tray & Markers at bottom (Y: 1540 - 1555px) */}
          <rect x="360" y="1542" width="360" height="12" rx="3" fill="#475569" stroke="#334155" strokeWidth="1" />
          {/* Blue Marker */}
          <rect x="390" y="1540" width="70" height="7" rx="3" fill="#2563EB" />
          {/* Red Marker */}
          <rect x="475" y="1540" width="70" height="7" rx="3" fill="#EF4444" />
          {/* Eraser */}
          <rect x="580" y="1538" width="65" height="10" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1" />

          {/* Research Binders on Floor Left (Y: 1300 - 1565px) */}
          <rect x="42" y="1350" width="135" height="205" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="2" />
          {/* Binder Spines */}
          <rect x="52" y="1362" width="28" height="182" rx="3" fill="#1D4ED8" />
          <text x="66" y="1453" textAnchor="middle" fill="#DBEAFE" fontSize="9" fontWeight="900" fontFamily="system-ui, sans-serif" transform="rotate(90 66 1453)">JURNAL X1</text>
          <rect x="88" y="1362" width="28" height="182" rx="3" fill="#6D28D9" />
          <text x="102" y="1453" textAnchor="middle" fill="#EDE9FE" fontSize="9" fontWeight="900" fontFamily="system-ui, sans-serif" transform="rotate(90 102 1453)">JURNAL X2</text>
          <rect x="124" y="1362" width="38" height="182" rx="3" fill="#B91C1C" />
          <text x="143" y="1453" textAnchor="middle" fill="#FEE2E2" fontSize="9" fontWeight="900" fontFamily="system-ui, sans-serif" transform="rotate(90 143 1453)">GRAND THEORY</text>

          {/* Research Storage Box on Floor Right (Y: 1320 - 1565px) */}
          <rect x="890" y="1370" width="145" height="185" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="2.5" />
          <rect x="905" y="1385" width="115" height="40" rx="4" fill="#334155" />
          <rect x="940" y="1400" width="45" height="10" rx="5" fill="#E2E8F0" />
          <text x="962.5" y="1450" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="900" fontFamily="system-ui, sans-serif">ARSIP SKRIPSI</text>
          <text x="962.5" y="1470" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="system-ui, sans-serif">KUESIONER & DATA</text>
          <rect x="915" y="1495" width="95" height="42" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
          <text x="962.5" y="1520" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="800" fontFamily="system-ui, sans-serif">BAB 2 ACC</text>
        </g>

        {/* ── Desk Props (Y: 1080 - 1160px) ── */}
        {/* Laptop closed on edge */}
        <rect x="80" y="1120" width="140" height="15" rx="3" fill="#475569" stroke="#334155" strokeWidth="1.5" />
        <rect x="95" y="1112" width="110" height="8" rx="2" fill="#64748B" />
        {/* Coffee Mug */}
        <rect x="920" y="1090" width="60" height="52" rx="8" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2.5" />
        <path d="M 980 1104 Q 998 1114 980 1125" stroke="#CBD5E1" strokeWidth="5" fill="none" />
        <text x="950" y="1124" textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">KOPI</text>

        {/* Safe zone background Y: 1600 - 1920px */}
        <rect x="0" y="1600" width="1080" height="320" fill="#030609" />
      </svg>

      {/* ── Card Poin 2 — Y: 240px - 410px ── */}
      <div
        style={{
          position: "absolute",
          top: "240px",
          left: "30px",
          right: "30px",
          zIndex: 40,
          transform: `scale(${cardSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 50%, #2563EB 100%)",
            border: "4px solid #60A5FA",
            borderRadius: "24px",
            padding: "26px 32px",
            boxShadow: "0 18px 50px rgba(37,99,235,0.45), 0 0 0 2px #60A5FA55",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "10px" }}>
            <div
              style={{
                background: "#60A5FA",
                color: "#0F172A",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: 900,
                boxShadow: "0 8px 24px rgba(96,165,250,0.6)",
                flexShrink: 0,
              }}
            >
              2
            </div>
            <div>
              <div
                style={{
                  color: "#93C5FD",
                  fontSize: "18px",
                  fontWeight: 800,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: "2px",
                }}
              >
                LANGKAH 2
              </div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: "28px",
                  fontWeight: 900,
                  lineHeight: 1.2,
                }}
              >
                CARI FAKTOR PENYEBAB
              </div>
            </div>
          </div>
          <div
            style={{
              color: "#BFDBFE",
              fontSize: "23px",
              fontWeight: 800,
              textAlign: "center",
              letterSpacing: "1px",
              paddingTop: "4px",
              borderTop: "1px solid rgba(147,197,253,0.3)",
            }}
          >
            VARIABEL X (INDEPENDEN)
          </div>
        </div>
      </div>

      {/* ── DIAGRAM KERANGKA BERPIKIR (CLEAR SPACING & NO OVERLAP) — Y: 465px - 1100px ── */}
      <div
        style={{
          position: "absolute",
          top: "465px",
          left: "30px",
          right: "30px",
          zIndex: 35,
        }}
      >
        {/* Context Badge */}
        <div
          style={{
            textAlign: "center",
            color: "#94A3B8",
            fontSize: "20px",
            fontWeight: 800,
            fontFamily: "system-ui, sans-serif",
            marginBottom: "16px",
            letterSpacing: "1.5px",
          }}
        >
          HUBUNGAN KAUSALITAS (SEBAB - AKIBAT)
        </div>

        {/* Row of Variabel X Boxes */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "space-between" }}>
          {/* Box X1: Beban Kerja */}
          <div
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #172554 0%, #1E40AF 100%)",
              border: "3.5px solid #3B82F6",
              borderRadius: "20px",
              padding: "20px 16px",
              boxShadow: "0 14px 40px rgba(59,130,246,0.35)",
              transform: `scale(${boxX1Spring})`,
              transformOrigin: "center center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#3B82F6",
                color: "#FFFFFF",
                padding: "3px 14px",
                borderRadius: "14px",
                fontSize: "16px",
                fontWeight: 900,
                marginBottom: "8px",
              }}
            >
              VARIABEL X1
            </div>
            <div
              style={{
                color: "#FFFFFF",
                fontSize: "24px",
                fontWeight: 900,
                lineHeight: 1.25,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Beban Kerja
            </div>
            <div
              style={{
                marginTop: "8px",
                color: "#93C5FD",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              Faktor Eksternal
            </div>
          </div>

          {/* Box X2: Motivasi Kerja */}
          <div
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #2E1065 0%, #5B21B6 100%)",
              border: "3.5px solid #8B5CF6",
              borderRadius: "20px",
              padding: "20px 16px",
              boxShadow: "0 14px 40px rgba(139,92,246,0.35)",
              transform: `scale(${boxX2Spring})`,
              transformOrigin: "center center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#8B5CF6",
                color: "#FFFFFF",
                padding: "3px 14px",
                borderRadius: "14px",
                fontSize: "16px",
                fontWeight: 900,
                marginBottom: "8px",
              }}
            >
              VARIABEL X2
            </div>
            <div
              style={{
                color: "#FFFFFF",
                fontSize: "24px",
                fontWeight: 900,
                lineHeight: 1.25,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Motivasi Kerja
            </div>
            <div
              style={{
                marginTop: "8px",
                color: "#DDD6FE",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              Faktor Internal
            </div>
          </div>
        </div>

        {/* Clean Converging Flow Arrows towards Y */}
        <div
          style={{
            height: "90px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: arrowSpring,
            transform: `scaleY(${pulse})`,
            transformOrigin: "top center",
          }}
        >
          <svg width="600" height="90" viewBox="0 0 600 90" fill="none">
            {/* Arrow X1 -> Y */}
            <path
              d="M 170 10 L 270 70"
              stroke="#3B82F6"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <polygon points="278,75 264,71 272,60" fill="#3B82F6" />
            <rect x="180" y="38" width="46" height="20" rx="4" fill="#1E40AF" />
            <text x="203" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">H1 (+)</text>

            {/* Arrow X2 -> Y */}
            <path
              d="M 430 10 L 330 70"
              stroke="#8B5CF6"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <polygon points="322,75 328,60 336,71" fill="#8B5CF6" />
            <rect x="374" y="38" width="46" height="20" rx="4" fill="#6D28D9" />
            <text x="397" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">H2 (+)</text>
          </svg>
        </div>

        {/* Variabel Y Box (Target of Kausalitas) */}
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            background: "linear-gradient(135deg, #450A0A 0%, #7F1D1D 100%)",
            border: "4px solid #EF4444",
            borderRadius: "24px",
            padding: "22px 28px",
            boxShadow: "0 18px 50px rgba(239,68,68,0.35)",
            textAlign: "center",
            transform: `scale(${boxYSpring})`,
            transformOrigin: "center center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-16px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#EF4444",
              color: "#FFFFFF",
              padding: "4px 22px",
              borderRadius: "20px",
              fontSize: "17px",
              fontWeight: 900,
              letterSpacing: "1.5px",
            }}
          >
            VARIABEL Y (AKIBAT)
          </div>

          <div
            style={{
              color: "#FEF2F2",
              fontSize: "28px",
              fontWeight: 900,
              lineHeight: 1.25,
              paddingTop: "6px",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Penurunan Kinerja Karyawan
          </div>

          <div
            style={{
              marginTop: "10px",
              color: "#FCA5A5",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            Masalah Utama yang Dijelaskan oleh X1 & X2
          </div>
        </div>

        {/* Verification note */}
        <div
          style={{
            textAlign: "center",
            marginTop: "16px",
            color: "#60A5FA",
            fontSize: "18px",
            fontWeight: 800,
            fontFamily: "system-ui, sans-serif",
            opacity: arrowSpring,
          }}
        >
          ✓ Berlandaskan Grand Theory & Riset Terdahulu
        </div>
      </div>

      {/* ── RunningCaption — strict Y: 1680px safe zone ── */}
      <RunningCaption words={CAPS_S3} frame={frame} accentColor="#60A5FA" top="1680px" />
    </AbsoluteFill>
  );
};

// ── CAPTION WORDS — Scene 4 (VO asli, ~10 frames/kata) ──────────────────────
// VO: "Ketiga... hubungkan semuanya pakai TEORI PENDUKUNG dari jurnal terbaru!
//      Kasih tanda panah yang jelas dari X ke Y."

const CAPS_S4: CaptionWord[] = [
  { word: "Ketiga...", start: 6 },
  { word: "hubungkan", start: 28 },
  { word: "semuanya", start: 40 },
  { word: "pakai", start: 52 },
  { word: "TEORI", start: 63 },
  { word: "PENDUKUNG", start: 74 },
  { word: "dari", start: 88 },
  { word: "jurnal", start: 98 },
  { word: "terbaru!", start: 108 },
  { word: "Kasih", start: 128 },
  { word: "tanda", start: 140 },
  { word: "panah", start: 151 },
  { word: "yang", start: 162 },
  { word: "jelas", start: 172 },
  { word: "dari", start: 183 },
  { word: "X", start: 193 },
  { word: "ke", start: 203 },
  { word: "Y.", start: 212 },
];

// ── SCENE 4: LANGKAH 3 — TARIK GARIS HUBUNGAN & HIPOTESIS ─────────────────────
// Pace: Dibuat lebih pelan, transisi lembut (damping: 18, stiffness: 75), jeda lebih lapang.
// Layout budget (1080x1920):
//   Card Poin 3        Y: 240px - 410px
//   Diagram Final      Y: 465px - 1090px (X1 & X2 -> Arrow dengan Hipotesis -> Y)
//   Desk Surface       Y: 1150px - 1260px
//   Thematic Whiteboard Y: 1260px - 1580px (ACC Seminar Proposal & Teori Final)
//   Safe Zone          Y: 1600px - 1920px (RunningCaption @ Y: 1680px)

const Scene4_Langkah3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Gentler, slower spring animations for relaxed viewing pace
  const cardSpring = spring({ frame: frame - 6, fps, config: { damping: 18, stiffness: 80 } });
  const boxXSpring  = spring({ frame: frame - 28, fps, config: { damping: 18, stiffness: 75 } });
  const arrowSpring = spring({ frame: frame - 52, fps, config: { damping: 18, stiffness: 75 } });
  const boxYSpring  = spring({ frame: frame - 74, fps, config: { damping: 18, stiffness: 75 } });
  const noteSpring  = spring({ frame: frame - 96, fps, config: { damping: 20, stiffness: 70 } });
  const boardSpring = spring({ frame: frame - 110, fps, config: { damping: 20, stiffness: 70 } });

  const arrowPulse = 1 + 0.03 * Math.sin(frame * 0.1);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* ── Background SVG ── */}
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="s8S4Bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#061210" />
            <stop offset="50%" stopColor="#0B241E" />
            <stop offset="100%" stopColor="#040D0B" />
          </linearGradient>
          <radialGradient id="s8S4Glow" cx="50%" cy="32%" r="55%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="s8S4Desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="50%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
        </defs>

        {/* Studio Wall */}
        <rect width="1080" height="1920" fill="url(#s8S4Bg)" />
        <rect width="1080" height="1920" fill="url(#s8S4Glow)" />

        {/* Ambient room vertical grid lines */}
        <line x1="200" y1="0" x2="200" y2="1150" stroke="#134E4A" strokeWidth="1" opacity="0.4" />
        <line x1="880" y1="0" x2="880" y2="1150" stroke="#134E4A" strokeWidth="1" opacity="0.4" />

        {/* Desk surface Y: 1150 - 1260px */}
        <polygon points="0,1150 1080,1150 1080,1260 0,1260" fill="url(#s8S4Desk)" />
        <rect x="0" y="1150" width="1080" height="7" fill="#000000" opacity="0.4" />
        <line x1="0" y1="1195" x2="1080" y2="1195" stroke="#92400E" strokeWidth="1.5" opacity="0.3" />
        <line x1="0" y1="1235" x2="1080" y2="1235" stroke="#92400E" strokeWidth="1.5" opacity="0.25" />

        {/* Floor area Y: 1260 - 1600px */}
        <rect x="0" y="1260" width="1080" height="340" fill="#040A08" />

        {/* ── THEMATIC OBJECT AREA Y: 1260 - 1600px (Final Evolved Board with ACC Status) ── */}
        <g opacity={boardSpring} transform={`translate(0, ${(1 - boardSpring) * 15})`}>
          {/* Main Whiteboard: Y: 1275 - 1555px */}
          <rect x="230" y="1275" width="620" height="275" rx="14" fill="#064E3B" stroke="#047857" strokeWidth="5" />
          <rect x="244" y="1288" width="592" height="248" rx="8" fill="#F0FDF4" />

          {/* Whiteboard Header */}
          <rect x="244" y="1288" width="592" height="34" rx="8" fill="#DCFCE7" />
          <text x="540" y="1310" textAnchor="middle" fill="#065F46" fontSize="13" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1px">
            KERANGKA BERPIKIR LENGKAP & HIPOTESIS
          </text>
          <line x1="244" y1="1322" x2="836" y2="1322" stroke="#86EFAC" strokeWidth="1.5" />

          {/* Diagram preview on board */}
          {/* X1 */}
          <rect x="265" y="1340" width="135" height="48" rx="6" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2" />
          <text x="332.5" y="1360" textAnchor="middle" fill="#1E40AF" fontSize="11" fontWeight="900">X1: Beban Kerja</text>
          <text x="332.5" y="1376" textAnchor="middle" fill="#2563EB" fontSize="9" fontWeight="700">H1 (-)</text>

          {/* X2 */}
          <rect x="265" y="1410" width="135" height="48" rx="6" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
          <text x="332.5" y="1430" textAnchor="middle" fill="#5B21B6" fontSize="11" fontWeight="900">X2: Motivasi</text>
          <text x="332.5" y="1446" textAnchor="middle" fill="#7C3AED" fontSize="9" fontWeight="700">H2 (+)</text>

          {/* Arrows */}
          <path d="M 400 1364 L 485 1395" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
          <polygon points="489,1396 479,1390 483,1402" fill="#059669" />
          <path d="M 400 1434 L 485 1405" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
          <polygon points="489,1404 483,1398 479,1410" fill="#059669" />

          {/* Target Y Box */}
          <rect x="495" y="1365" width="155" height="70" rx="8" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2.5" />
          <text x="572.5" y="1392" textAnchor="middle" fill="#991B1B" fontSize="11" fontWeight="900">VARIABEL Y</text>
          <text x="572.5" y="1410" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="800">Kinerja Karyawan</text>

          {/* Stamp ACC DOSBING on Whiteboard */}
          <g transform="translate(670, 1345) rotate(-6)">
            <rect x="0" y="0" width="145" height="85" rx="6" fill="#FEF2F2" stroke="#DC2626" strokeWidth="3" strokeDasharray="6,3" />
            <text x="72.5" y="28" textAnchor="middle" fill="#DC2626" fontSize="14" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1px">
              ACC BAB 2
            </text>
            <text x="72.5" y="48" textAnchor="middle" fill="#991B1B" fontSize="10" fontWeight="800">
              LOGIS & TERUJI
            </text>
            <text x="72.5" y="68" textAnchor="middle" fill="#15803D" fontSize="10" fontWeight="900">
              ✓ SIAP SEMPRO
            </text>
          </g>

          {/* Whiteboard Pen Tray & Markers at bottom */}
          <rect x="360" y="1542" width="360" height="12" rx="3" fill="#475569" stroke="#334155" strokeWidth="1" />
          <rect x="390" y="1540" width="70" height="7" rx="3" fill="#10B981" />
          <rect x="475" y="1540" width="70" height="7" rx="3" fill="#EF4444" />
          <rect x="580" y="1538" width="65" height="10" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1" />

          {/* Left Floor: Research Document Box (Y: 1340 - 1565px) */}
          <rect x="42" y="1350" width="135" height="205" rx="6" fill="#134E4A" stroke="#2DD4BF" strokeWidth="2" />
          <rect x="55" y="1365" width="108" height="35" rx="4" fill="#0F766E" />
          <text x="109" y="1388" textAnchor="middle" fill="#CCFBF1" fontSize="10" fontWeight="900">UJI STATISTIK</text>
          <rect x="55" y="1410" width="108" height="40" rx="4" fill="#115E59" />
          <text x="109" y="1435" textAnchor="middle" fill="#A7F3D0" fontSize="9" fontWeight="700">Regresi Berganda</text>
          <rect x="55" y="1460" width="108" height="80" rx="4" fill="#042F2E" />
          <text x="109" y="1495" textAnchor="middle" fill="#5EEAD4" fontSize="10" fontWeight="800">Uji F & Uji t</text>
          <text x="109" y="1520" textAnchor="middle" fill="#99F6E4" fontSize="9">Sig &lt; 0.05</text>

          {/* Right Floor: Stack of Binders & Thesis draft (Y: 1330 - 1565px) */}
          <rect x="890" y="1360" width="145" height="195" rx="8" fill="#1F2937" stroke="#374151" strokeWidth="2.5" />
          <rect x="905" y="1375" width="115" height="42" rx="4" fill="#065F46" />
          <text x="962.5" y="1401" textAnchor="middle" fill="#D1FAE5" fontSize="10" fontWeight="900">DRAF BAB 2</text>
          <rect x="905" y="1428" width="115" height="50" rx="4" fill="#047857" />
          <text x="962.5" y="1452" textAnchor="middle" fill="#ECFDF5" fontSize="9" fontWeight="800">KERANGKA PIKIR</text>
          <text x="962.5" y="1468" textAnchor="middle" fill="#A7F3D0" fontSize="8">12 Jurnal Rujukan</text>
          <rect x="905" y="1490" width="115" height="52" rx="4" fill="#064E3B" />
          <text x="962.5" y="1516" textAnchor="middle" fill="#6EE7B7" fontSize="10" fontWeight="900">STATUS: SELESAI</text>
          <text x="962.5" y="1532" textAnchor="middle" fill="#D1FAE5" fontSize="8">Siap Bab 3</text>
        </g>

        {/* ── Desk Props (Y: 1080 - 1160px) ── */}
        <rect x="70" y="1115" width="150" height="20" rx="4" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
        <rect x="90" y="1106" width="110" height="10" rx="2" fill="#64748B" />
        {/* Coffee Mug */}
        <rect x="920" y="1090" width="60" height="52" rx="8" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2.5" />
        <path d="M 980 1104 Q 998 1114 980 1125" stroke="#CBD5E1" strokeWidth="5" fill="none" />
        <text x="950" y="1124" textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">KOPI</text>

        {/* Safe zone background Y: 1600 - 1920px */}
        <rect x="0" y="1600" width="1080" height="320" fill="#030609" />
      </svg>

      {/* ── Card Poin 3 — Y: 240px - 410px ── */}
      <div
        style={{
          position: "absolute",
          top: "240px",
          left: "30px",
          right: "30px",
          zIndex: 40,
          transform: `scale(${cardSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #065F46 0%, #047857 50%, #059669 100%)",
            border: "4px solid #34D399",
            borderRadius: "24px",
            padding: "26px 32px",
            boxShadow: "0 18px 50px rgba(16,185,129,0.4), 0 0 0 2px #34D39955",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "10px" }}>
            <div
              style={{
                background: "#34D399",
                color: "#064E3B",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: 900,
                boxShadow: "0 8px 24px rgba(52,211,153,0.6)",
                flexShrink: 0,
              }}
            >
              3
            </div>
            <div>
              <div
                style={{
                  color: "#A7F3D0",
                  fontSize: "18px",
                  fontWeight: 800,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: "2px",
                }}
              >
                LANGKAH 3
              </div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: "28px",
                  fontWeight: 900,
                  lineHeight: 1.2,
                }}
              >
                TARIK GARIS HUBUNGAN
              </div>
            </div>
          </div>
          <div
            style={{
              color: "#D1FAE5",
              fontSize: "23px",
              fontWeight: 800,
              textAlign: "center",
              letterSpacing: "1px",
              paddingTop: "4px",
              borderTop: "1px solid rgba(167,243,208,0.3)",
            }}
          >
            TENTUKAN ARAH HIPOTESIS (+ / -)
          </div>
        </div>
      </div>

      {/* ── DIAGRAM FINAL KERANGKA BERPIKIR (CLEAR SPACING & NO COLLISION) — Y: 465px - 1100px ── */}
      <div
        style={{
          position: "absolute",
          top: "465px",
          left: "30px",
          right: "30px",
          zIndex: 35,
        }}
      >
        {/* Context Badge */}
        <div
          style={{
            textAlign: "center",
            color: "#A7F3D0",
            fontSize: "20px",
            fontWeight: 800,
            fontFamily: "system-ui, sans-serif",
            marginBottom: "16px",
            letterSpacing: "1.5px",
          }}
        >
          FORMULASI HIPOTESIS PENELITIAN
        </div>

        {/* 2-Column Layout: Left (X1 & X2) -> Right (Y) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px" }}>
          {/* Left Column: Variabel X Boxes */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Box X1 */}
            <div
              style={{
                background: "linear-gradient(135deg, #172554 0%, #1E40AF 100%)",
                border: "3.5px solid #3B82F6",
                borderRadius: "18px",
                padding: "18px 16px",
                boxShadow: "0 10px 30px rgba(59,130,246,0.35)",
                transform: `scale(${boxXSpring})`,
                transformOrigin: "center left",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: "#3B82F6",
                  color: "#FFFFFF",
                  padding: "3px 12px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 900,
                  marginBottom: "6px",
                }}
              >
                VARIABEL X1
              </div>
              <div style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 900, lineHeight: 1.2 }}>
                Beban Kerja
              </div>
              <div style={{ color: "#93C5FD", fontSize: "14px", marginTop: "4px", fontWeight: 700 }}>
                Pengaruh Negatif (-)
              </div>
            </div>

            {/* Box X2 */}
            <div
              style={{
                background: "linear-gradient(135deg, #2E1065 0%, #5B21B6 100%)",
                border: "3.5px solid #8B5CF6",
                borderRadius: "18px",
                padding: "18px 16px",
                boxShadow: "0 10px 30px rgba(139,92,246,0.35)",
                transform: `scale(${boxXSpring})`,
                transformOrigin: "center left",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: "#8B5CF6",
                  color: "#FFFFFF",
                  padding: "3px 12px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 900,
                  marginBottom: "6px",
                }}
              >
                VARIABEL X2
              </div>
              <div style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 900, lineHeight: 1.2 }}>
                Motivasi Kerja
              </div>
              <div style={{ color: "#DDD6FE", fontSize: "14px", marginTop: "4px", fontWeight: 700 }}>
                Pengaruh Positif (+)
              </div>
            </div>
          </div>

          {/* Middle: Clear Directional Arrows with Hypothesis Badges */}
          <div
            style={{
              width: "160px",
              height: "230px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: arrowSpring,
              transform: `scale(${arrowPulse})`,
              transformOrigin: "center center",
            }}
          >
            <svg width="160" height="230" viewBox="0 0 160 230" fill="none">
              {/* Arrow X1 -> Y */}
              <path d="M 10 50 L 140 105" stroke="#34D399" strokeWidth="5" strokeLinecap="round" />
              <polygon points="148,108 134,103 138,115" fill="#34D399" />
              <rect x="42" y="58" width="65" height="24" rx="6" fill="#047857" stroke="#34D399" strokeWidth="1.5" />
              <text x="74.5" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="900">H1 (-)</text>

              {/* Arrow X2 -> Y */}
              <path d="M 10 180 L 140 125" stroke="#34D399" strokeWidth="5" strokeLinecap="round" />
              <polygon points="148,122 138,115 134,127" fill="#34D399" />
              <rect x="42" y="148" width="65" height="24" rx="6" fill="#047857" stroke="#34D399" strokeWidth="1.5" />
              <text x="74.5" y="164" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="900">H2 (+)</text>
            </svg>
          </div>

          {/* Right Column: Variabel Y Box */}
          <div
            style={{
              flex: 1.15,
              background: "linear-gradient(135deg, #450A0A 0%, #7F1D1D 100%)",
              border: "4px solid #EF4444",
              borderRadius: "20px",
              padding: "26px 20px",
              boxShadow: "0 16px 45px rgba(239,68,68,0.4)",
              transform: `scale(${boxYSpring})`,
              transformOrigin: "center right",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-16px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#EF4444",
                color: "#FFFFFF",
                padding: "3px 18px",
                borderRadius: "16px",
                fontSize: "15px",
                fontWeight: 900,
                letterSpacing: "1px",
                whiteSpace: "nowrap",
              }}
            >
              VARIABEL Y
            </div>

            <div
              style={{
                color: "#FEF2F2",
                fontSize: "24px",
                fontWeight: 900,
                lineHeight: 1.25,
                paddingTop: "6px",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Penurunan Kinerja
              <br />
              <span style={{ color: "#FCA5A5" }}>Karyawan</span>
            </div>

            <div
              style={{
                marginTop: "12px",
                background: "#EF444422",
                border: "1.5px solid #EF444466",
                borderRadius: "8px",
                padding: "6px 10px",
                color: "#FECACA",
                fontSize: "14px",
                fontWeight: 800,
              }}
            >
              Variabel Terikat
            </div>
          </div>
        </div>

        {/* Verification banner with theory checks */}
        <div
          style={{
            marginTop: "24px",
            background: "rgba(6, 78, 59, 0.75)",
            border: "2px solid #10B981",
            borderRadius: "16px",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            opacity: noteSpring,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#34D399", fontSize: "20px", fontWeight: 900 }}>✓</span>
            <span style={{ color: "#ECFDF5", fontSize: "16px", fontWeight: 800 }}>Dasar Teori Jurnal</span>
          </div>
          <div style={{ width: "2px", height: "24px", background: "#34D39944" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#34D399", fontSize: "20px", fontWeight: 900 }}>✓</span>
            <span style={{ color: "#ECFDF5", fontSize: "16px", fontWeight: 800 }}>Arah Kausatif Logis</span>
          </div>
        </div>
      </div>

      {/* ── RunningCaption — strict Y: 1680px safe zone ── */}
      <RunningCaption words={CAPS_S4} frame={frame} accentColor="#34D399" top="1680px" />
    </AbsoluteFill>
  );
};

// ── CAPTION WORDS — Scene 5 (VO asli, ~10 frames/kata, 13.88s = 417f) ─────────
// VO: "Hasilnya? Kerangka berpikir kamu langsung RAPI, LOGIS, dan bikin Dosen
//      Pembimbing gampang paham! Masih pusing nyusun Bab Dua? DM @jagoneliti_
//      sekarang, biar kita bantu sampai ACC!"

const CAPS_S5: CaptionWord[] = [
  { word: "Hasilnya?", start: 6 },
  { word: "Kerangka", start: 25 },
  { word: "berpikir", start: 36 },
  { word: "kamu", start: 47 },
  { word: "langsung", start: 57 },
  { word: "RAPI,", start: 68 },
  { word: "LOGIS,", start: 79 },
  { word: "dan", start: 91 },
  { word: "bikin", start: 100 },
  { word: "Dosen", start: 110 },
  { word: "Pembimbing", start: 120 },
  { word: "gampang", start: 133 },
  { word: "paham!", start: 144 },
  { word: "Masih", start: 165 },
  { word: "pusing", start: 176 },
  { word: "nyusun", start: 187 },
  { word: "Bab", start: 198 },
  { word: "Dua?", start: 207 },
  { word: "DM", start: 225 },
  { word: "@jagoneliti_", start: 235 },
  { word: "sekarang,", start: 250 },
  { word: "biar", start: 268 },
  { word: "kita", start: 278 },
  { word: "bantu", start: 288 },
  { word: "sampai", start: 298 },
  { word: "ACC!", start: 309 },
];

// ── SCENE 5: KESIMPULAN & CTA ─────────────────────────────────────────────────
// Layout (1080x1920):
//   Summary Diagram Box   Y: 250px - 800px
//   Karakter Selebrasi    Y: 850px - 1300px
//   Floating CTA Box      Y: 1350px - 1550px
//   Safe Zone             Y: 1600px - 1920px  (RunningCaption @ 1680px)

const Scene5_Kesimpulan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heroSpring  = spring({ frame: frame - 4,  fps, config: { damping: 14, stiffness: 120 } });
  const diagSpring  = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 110 } });
  const charSpring  = spring({ frame: frame - 40, fps, config: { damping: 13, stiffness: 100 } });
  const ctaSpring   = spring({ frame: frame - 70, fps, config: { damping: 15, stiffness: 90 } });

  const ctaPulse = 1 + 0.04 * Math.sin(frame * 0.14);
  const starSpin = frame * 3;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* ── Background ── */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="s8S5Bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0C0A20" />
            <stop offset="55%" stopColor="#130D35" />
            <stop offset="100%" stopColor="#07051A" />
          </linearGradient>
          <radialGradient id="s8S5Glow" cx="50%" cy="28%" r="60%">
            <stop offset="0%" stopColor="#E9A21B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#E9A21B" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s8S5GlowCta" cx="50%" cy="80%" r="40%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1080" height="1920" fill="url(#s8S5Bg)" />
        <rect width="1080" height="1920" fill="url(#s8S5Glow)" />
        <rect width="1080" height="1920" fill="url(#s8S5GlowCta)" />

        {/* Confetti dots floating */}
        {[...Array(18)].map((_, i) => (
          <circle
            key={i}
            cx={60 + (i * 58) % 960}
            cy={100 + ((i * 97 + frame * (0.5 + (i % 3) * 0.3)) % 700)}
            r={4 + (i % 3) * 3}
            fill={["#E9A21B", "#34D399", "#60A5FA", "#F472B6", "#A78BFA"][i % 5]}
            opacity={0.55}
          />
        ))}

        {/* Stars near top */}
        {[...Array(5)].map((_, i) => {
          const cx = 100 + i * 220;
          const cy = 180;
          const rot = starSpin + i * 72;
          return (
            <g key={i} transform={`translate(${cx},${cy}) rotate(${rot})`}>
              <polygon points="0,-14 3.3,-4.5 13,-4.5 5.5,1.7 8.5,12 0,6 -8.5,12 -5.5,1.7 -13,-4.5 -3.3,-4.5" fill={["#E9A21B","#34D399","#60A5FA","#F472B6","#A78BFA"][i]} opacity={0.7} />
            </g>
          );
        })}

        {/* Safe zone bottom */}
        <rect x="0" y="1600" width="1080" height="320" fill="#040309" />
      </svg>

      {/* ── Summary Header ── */}
      <div
        style={{
          position: "absolute",
          top: "220px",
          left: "30px",
          right: "30px",
          zIndex: 40,
          opacity: heroSpring,
          transform: `translateY(${(1 - heroSpring) * -20}px)`,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1A1040 0%, #2D1B6E 50%, #3B2494 100%)",
            border: "3px solid #A78BFA",
            borderRadius: "22px",
            padding: "22px 28px",
            boxShadow: "0 18px 50px rgba(139,92,246,0.4)",
            textAlign: "center",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div style={{ color: "#DDD6FE", fontSize: "20px", fontWeight: 800, letterSpacing: "2px", marginBottom: "6px" }}>
            HASILNYA?
          </div>
          <div style={{ color: "#FFFFFF", fontSize: "32px", fontWeight: 900, lineHeight: 1.2 }}>
            Kerangka Berpikir Kamu
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginTop: "14px",
              flexWrap: "wrap",
            }}
          >
            {["✅ RAPI", "✅ LOGIS", "✅ ACC!"].map((tag) => (
              <span
                key={tag}
                style={{
                  background: "rgba(167,139,250,0.2)",
                  border: "2px solid #A78BFA",
                  color: "#FFFFFF",
                  borderRadius: "12px",
                  padding: "6px 18px",
                  fontSize: "22px",
                  fontWeight: 900,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Diagram Summary Y: 430px - 800px ── */}
      <div
        style={{
          position: "absolute",
          top: "430px",
          left: "30px",
          right: "30px",
          zIndex: 38,
          opacity: diagSpring,
          transform: `scale(${diagSpring})`,
          transformOrigin: "top center",
        }}
      >
        {/* Mini diagram: X1 & X2 -> Y in one row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* X side */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #172554 0%, #1E40AF 100%)",
                border: "3px solid #3B82F6",
                borderRadius: "16px",
                padding: "16px 14px",
                textAlign: "center",
              }}
            >
              <div style={{ color: "#93C5FD", fontSize: "14px", fontWeight: 800, marginBottom: "4px" }}>X1</div>
              <div style={{ color: "#FFFFFF", fontSize: "20px", fontWeight: 900 }}>Beban Kerja</div>
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, #2E1065 0%, #5B21B6 100%)",
                border: "3px solid #8B5CF6",
                borderRadius: "16px",
                padding: "16px 14px",
                textAlign: "center",
              }}
            >
              <div style={{ color: "#DDD6FE", fontSize: "14px", fontWeight: 800, marginBottom: "4px" }}>X2</div>
              <div style={{ color: "#FFFFFF", fontSize: "20px", fontWeight: 900 }}>Lingkungan Kantor</div>
            </div>
          </div>

          {/* Arrow + hypothesis labels */}
          <div style={{ width: "110px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="110" height="160" viewBox="0 0 110 160" fill="none">
              <path d="M 10 40 L 90 80" stroke="#34D399" strokeWidth="4" strokeLinecap="round" />
              <polygon points="97,83 83,79 87,91" fill="#34D399" />
              <rect x="28" y="43" width="50" height="20" rx="5" fill="#047857" />
              <text x="53" y="57" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900">H1 (-)</text>
              <path d="M 10 120 L 90 80" stroke="#34D399" strokeWidth="4" strokeLinecap="round" />
              <polygon points="97,77 87,69 83,81" fill="#34D399" />
              <rect x="28" y="97" width="50" height="20" rx="5" fill="#047857" />
              <text x="53" y="111" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900">H2 (+)</text>
            </svg>
          </div>

          {/* Y box */}
          <div
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #450A0A 0%, #7F1D1D 100%)",
              border: "4px solid #EF4444",
              borderRadius: "16px",
              padding: "26px 14px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#EF4444",
                color: "#FFFFFF",
                padding: "2px 14px",
                borderRadius: "14px",
                fontSize: "13px",
                fontWeight: 900,
                whiteSpace: "nowrap",
              }}
            >
              VARIABEL Y
            </div>
            <div style={{ color: "#FEF2F2", fontSize: "20px", fontWeight: 900, paddingTop: "6px" }}>
              Penurunan Kinerja
            </div>
            <div style={{ color: "#FCA5A5", fontSize: "15px", marginTop: "6px", fontWeight: 700 }}>Karyawan</div>
          </div>
        </div>

        {/* Teori pendukung banner */}
        <div
          style={{
            marginTop: "18px",
            background: "rgba(16,185,129,0.15)",
            border: "2px solid #10B981",
            borderRadius: "14px",
            padding: "10px 18px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <div style={{ color: "#6EE7B7", fontSize: "15px", fontWeight: 800 }}>📚 12 Jurnal Terindeks</div>
          <div style={{ color: "#6EE7B7", fontSize: "15px", fontWeight: 800 }}>✓ Teori Pendukung Solid</div>
          <div style={{ color: "#6EE7B7", fontSize: "15px", fontWeight: 800 }}>✓ Siap Sempro</div>
        </div>
      </div>

      {/* ── Karakter Selebrasi Y: 850px - 1300px ── */}
      <div
        style={{
          position: "absolute",
          top: "850px",
          left: "50%",
          transform: `translateX(-50%) scale(${charSpring})`,
          zIndex: 42,
          transformOrigin: "bottom center",
        }}
      >
        <svg viewBox="0 0 360 420" style={{ width: "300px", height: "350px", overflow: "visible" }}>
          {/* Glow behind character */}
          <ellipse cx="180" cy="390" rx="120" ry="22" fill="#10B981" opacity="0.25" />

          {/* Body */}
          <ellipse cx="180" cy="310" rx="72" ry="88" fill="#F59E0B" />

          {/* Shirt/jacket — dark */}
          <path d="M 112 280 Q 108 370 148 400 L 212 400 Q 252 370 248 280 Q 210 300 180 300 Q 150 300 112 280 Z" fill="#1E3A8A" />
          <text x="180" y="350" textAnchor="middle" fill="#93C5FD" fontSize="15" fontWeight="900" fontFamily="system-ui, sans-serif">@jagoneliti_</text>

          {/* Head */}
          <ellipse cx="180" cy="200" rx="65" ry="70" fill="#FBBF24" />

          {/* Hair */}
          <path d="M 118 190 Q 120 130 180 125 Q 240 130 242 190 Q 230 160 180 158 Q 130 160 118 190 Z" fill="#1F2937" />

          {/* Eyes — happy squint */}
          <path d="M 155 197 Q 162 190 169 197" stroke="#1F2937" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 191 197 Q 198 190 205 197" stroke="#1F2937" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Big smile */}
          <path d="M 155 222 Q 180 248 205 222" stroke="#1F2937" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Cheek blush */}
          <ellipse cx="148" cy="218" rx="12" ry="8" fill="#FCA5A5" opacity="0.6" />
          <ellipse cx="212" cy="218" rx="12" ry="8" fill="#FCA5A5" opacity="0.6" />

          {/* Left arm raised holding paper */}
          <path d="M 112 280 Q 70 230 50 180" stroke="#FBBF24" strokeWidth="28" strokeLinecap="round" fill="none" />
          {/* Paper / berkas ACC */}
          <rect x="24" y="148" width="80" height="100" rx="8" fill="#FFFFFF" stroke="#10B981" strokeWidth="4" />
          <text x="64" y="178" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="900" fontFamily="system-ui, sans-serif">BAB 2</text>
          <text x="64" y="198" textAnchor="middle" fill="#059669" fontSize="20" fontWeight="900" fontFamily="system-ui, sans-serif">ACC</text>
          <text x="64" y="222" textAnchor="middle" fill="#10B981" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">✓ DISETUJUI</text>

          {/* Right arm raised */}
          <path d="M 248 280 Q 290 230 310 190" stroke="#FBBF24" strokeWidth="28" strokeLinecap="round" fill="none" />
          {/* Stars from right hand */}
          <text x="305" y="178" fill="#E9A21B" fontSize="26" fontWeight="900">★</text>
          <text x="325" y="152" fill="#F472B6" fontSize="18" fontWeight="900">✦</text>

          {/* Legs */}
          <path d="M 148 395 L 140 420" stroke="#1E3A8A" strokeWidth="24" strokeLinecap="round" />
          <path d="M 212 395 L 220 420" stroke="#1E3A8A" strokeWidth="24" strokeLinecap="round" />
          <ellipse cx="138" cy="418" rx="18" ry="10" fill="#1F2937" />
          <ellipse cx="222" cy="418" rx="18" ry="10" fill="#1F2937" />
        </svg>
      </div>

      {/* ── Floating CTA Box Y: 1350px - 1550px ── */}
      <div
        style={{
          position: "absolute",
          top: "1350px",
          left: "30px",
          right: "30px",
          zIndex: 50,
          transform: `scale(${ctaSpring * ctaPulse})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #064E3B 0%, #047857 40%, #059669 100%)",
            border: "5px solid #34D399",
            borderRadius: "28px",
            padding: "30px 32px",
            boxShadow: "0 24px 60px rgba(52,211,153,0.5), 0 0 0 3px #34D39930",
            textAlign: "center",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div
            style={{
              color: "#ECFDF5",
              fontSize: "26px",
              fontWeight: 900,
              lineHeight: 1.3,
              marginBottom: "16px",
            }}
          >
            Masih Pusing Nyusun
            <br />
            <span style={{ color: "#FEF08A", fontSize: "30px" }}>Bab 2?</span>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "16px",
              padding: "14px 20px",
              border: "2px solid rgba(255,255,255,0.3)",
            }}
          >
            <div style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 900, letterSpacing: "0.5px" }}>
              💬 DM @jagoneliti_
            </div>
            <div style={{ color: "#D1FAE5", fontSize: "19px", fontWeight: 700, marginTop: "6px" }}>
              Kita bantu sampai ACC!
            </div>
          </div>
        </div>
      </div>

      {/* ── RunningCaption — strict Y: 1680px safe zone ── */}
      <RunningCaption words={CAPS_S5} frame={frame} accentColor="#E9A21B" top="1680px" />
    </AbsoluteFill>
  );
};

export const InteractiveScene08: React.FC = () => {
  const S1_END = 300;
  const S2_END = 567;
  const S3_END = 839;
  const S4_END = 1103;
  const S5_END = 1520; // S4_END(1103) + ceil(13.88 * 30 = 417)

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={S1_END}>
        <Audio src={staticFile("audio/vo_scene1.wav")} />
        <Scene1_Hook />
      </Sequence>

      <Sequence from={S1_END} durationInFrames={S2_END - S1_END}>
        <Audio src={staticFile("audio/vo_scene2.wav")} />
        <Scene2_Langkah1 />
      </Sequence>

      <Sequence from={S2_END} durationInFrames={S3_END - S2_END}>
        <Audio src={staticFile("audio/vo_scene3.wav")} />
        <Scene3_Langkah2 />
      </Sequence>

      <Sequence from={S3_END} durationInFrames={S4_END - S3_END}>
        <Audio src={staticFile("audio/vo_scene4.wav")} />
        <Scene4_Langkah3 />
      </Sequence>

      <Sequence from={S4_END} durationInFrames={S5_END - S4_END}>
        <Audio src={staticFile("audio/vo_scene5.wav")} />
        <Scene5_Kesimpulan />
      </Sequence>
    </AbsoluteFill>
  );
};
