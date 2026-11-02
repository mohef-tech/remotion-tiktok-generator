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

// ── TYPES & HELPERS ───────────────────────────────────────────────────────────

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

export type CaptionWord = { word: string; start: number };

// ── RUNNING CAPTION ENGINE ─────────────────────────────────────────────────────
// Strict rule: Top Y: 1680px. Dedicated safe zone Y: 1600-1920px.

const RunningCaption: React.FC<{
  words: CaptionWord[];
  frame: number;
  accentColor?: string;
  top?: string | number;
}> = ({ words, frame, accentColor = "#10B981", top = "1680px" }) => {
  const visible = words.filter((w) => frame >= w.start);
  if (visible.length === 0) return null;

  const activeIdx = visible.length - 1;
  const LINE_SIZE = 7;
  const lines: CaptionWord[][] = [];
  for (let i = 0; i < visible.length; i += LINE_SIZE) {
    lines.push(visible.slice(i, i + LINE_SIZE));
  }
  const displayLines = lines.slice(-2);
  const fadeIn = clamp(
    interpolate(frame, [words[0].start, words[0].start + 5], [0, 1]),
    0,
    1
  );

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "40px",
        right: "40px",
        zIndex: 100,
        opacity: fadeIn,
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "rgba(3, 20, 15, 0.94)",
          borderRadius: "18px",
          padding: "16px 28px",
          backdropFilter: "blur(12px)",
          border: `2px solid ${accentColor}88`,
          boxShadow: `0 14px 36px rgba(0,0,0,0.7), 0 0 20px ${accentColor}33`,
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
              gap: "10px",
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
                    color: isActive ? "#FFFFFF" : "#94A3B8",
                    fontWeight: isActive ? 900 : 700,
                    fontSize: "28px",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    lineHeight: 1.35,
                    background: isActive ? accentColor : "transparent",
                    borderRadius: "6px",
                    padding: isActive ? "0 8px" : "0",
                    boxShadow: isActive
                      ? `0 0 14px ${accentColor}aa`
                      : "none",
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                    display: "inline-block",
                    transition: "transform 0.1s ease",
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

// ── CAPTION WORDS — SCENE 1 ───────────────────────────────────────────────────
// Naskah: "Skripsi kesehatan ditolak gara-gara metodologi? Biasanya salah di tiga hal ini."
// Audio duration: 6.36 detik (~191 frames) @ 30 FPS.
const CAPS_S1: CaptionWord[] = [
  { word: "Skripsi", start: 6 },
  { word: "kesehatan", start: 18 },
  { word: "ditolak", start: 34 },
  { word: "gara-gara", start: 50 },
  { word: "metodologi?", start: 66 },
  { word: "Biasanya", start: 96 },
  { word: "salah", start: 114 },
  { word: "di", start: 128 },
  { word: "tiga", start: 140 },
  { word: "hal", start: 154 },
  { word: "ini.", start: 168 },
];

// ── FULL CANVAS MEDICAL THEME BACKGROUND ──────────────────────────────────────
const MedicalBackground: React.FC = () => (
  <svg
    viewBox="0 0 1080 1920"
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    }}
  >
    <defs>
      <linearGradient id="s10BgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#02120E" />
        <stop offset="30%" stopColor="#05241C" />
        <stop offset="65%" stopColor="#072C22" />
        <stop offset="100%" stopColor="#010B08" />
      </linearGradient>

      {/* Grid Pattern with Medical Crosses */}
      <pattern id="s10MedGrid" width="90" height="90" patternUnits="userSpaceOnUse">
        <path
          d="M 45 40 L 45 50 M 40 45 L 50 45"
          stroke="#10B981"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.12"
        />
        <circle cx="0" cy="0" r="1" fill="#10B981" opacity="0.15" />
      </pattern>

      {/* Radial soft lighting */}
      <radialGradient id="s10TopGlow" cx="50%" cy="20%" r="45%">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="s10AlertGlow" cx="50%" cy="68%" r="40%">
        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Base Background & Subtle Grid */}
    <rect width="1080" height="1920" fill="url(#s10BgGrad)" />
    <rect width="1080" height="1920" fill="url(#s10MedGrid)" />
    <rect width="1080" height="1920" fill="url(#s10TopGlow)" />
    <rect width="1080" height="1920" fill="url(#s10AlertGlow)" />

    {/* Safe Zone Boundary Marker (Y: 1600-1920) */}
    <rect x="0" y="1600" width="1080" height="320" fill="#010806" opacity="0.4" />
  </svg>
);

// ── LEFT SIDE GRAPHIC: 2D STETHOSCOPE ─────────────────────────────────────────
const StethoscopeVisual: React.FC = () => (
  <svg
    viewBox="0 0 170 650"
    style={{
      width: "170px",
      height: "650px",
      position: "absolute",
      left: "14px",
      top: "55px",
      pointerEvents: "none",
      filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.5))",
    }}
  >
    <defs>
      <linearGradient id="stethTube" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="stethMetal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="50%" stopColor="#F1F5F9" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
    </defs>

    {/* Binaural Ear Tubes */}
    <path
      d="M 45 40 Q 60 90 85 140"
      stroke="url(#stethMetal)"
      strokeWidth="7"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M 125 40 Q 110 90 85 140"
      stroke="url(#stethMetal)"
      strokeWidth="7"
      fill="none"
      strokeLinecap="round"
    />
    {/* Eartips */}
    <ellipse cx="45" cy="38" rx="8" ry="6" fill="#1E293B" />
    <ellipse cx="125" cy="38" rx="8" ry="6" fill="#1E293B" />
    {/* Y-Connector */}
    <rect x="80" y="136" width="10" height="24" rx="4" fill="url(#stethMetal)" />

    {/* Flexible Tube Loop */}
    <path
      d="M 85 160 C 85 240, 25 290, 30 390 C 35 480, 110 500, 100 565"
      stroke="url(#stethTube)"
      strokeWidth="13"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M 85 160 C 85 240, 25 290, 30 390 C 35 480, 110 500, 100 565"
      stroke="#34D399"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      opacity="0.45"
    />

    {/* Chestpiece Diaphragm */}
    <circle cx="100" cy="578" r="32" fill="url(#stethMetal)" stroke="#334155" strokeWidth="3" />
    <circle cx="100" cy="578" r="23" fill="#047857" opacity="0.8" />
    <circle cx="100" cy="578" r="10" fill="#34D399" opacity="0.9" />
  </svg>
);

// ── RIGHT SIDE GRAPHIC: MEDICAL CLIPBOARD & ECG MONITOR ───────────────────────
const ClipboardVisual: React.FC<{ frame: number }> = ({ frame }) => {
  const ecgOffset = (frame * 3) % 180;

  return (
    <div
      style={{
        position: "absolute",
        right: "18px",
        top: "60px",
        width: "175px",
        height: "640px",
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "18px",
      }}
    >
      {/* Mini Clipboard Card */}
      <div
        style={{
          width: "160px",
          height: "230px",
          background: "linear-gradient(145deg, #0F2D24 0%, #071C16 100%)",
          borderRadius: "16px",
          border: "1.5px solid rgba(52, 211, 153, 0.3)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
          padding: "14px 12px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Silver Clamp Clip */}
        <div
          style={{
            position: "absolute",
            top: "-12px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "56px",
            height: "18px",
            background: "linear-gradient(180deg, #CBD5E1 0%, #64748B 100%)",
            borderRadius: "6px",
            border: "1px solid #94A3B8",
            boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
          }}
        />

        <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px" }}>📋</span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "#34D399",
              letterSpacing: "0.5px",
            }}
          >
            DATA KLINIS
          </span>
        </div>

        {/* Mock check list rows */}
        {[
          { label: "Kriteria Inklusi", ok: true },
          { label: "Ethical Clearance", ok: false },
          { label: "Uji Lemeshow", ok: false },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(0,0,0,0.3)",
              padding: "5px 8px",
              borderRadius: "6px",
            }}
          >
            <span style={{ fontSize: "10px", color: "#E2E8F0", fontWeight: 600 }}>
              {item.label}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: item.ok ? "#34D399" : "#EF4444",
              }}
            >
              {item.ok ? "✓" : "✗"}
            </span>
          </div>
        ))}

        <div
          style={{
            marginTop: "auto",
            background: "rgba(239,68,68,0.15)",
            border: "1px solid #EF4444",
            borderRadius: "6px",
            padding: "4px",
            textAlign: "center",
            fontSize: "10px",
            fontWeight: 800,
            color: "#FCA5A5",
          }}
        >
          STATUS: REVISI
        </div>
      </div>

      {/* ECG Vital Sign Monitor Widget */}
      <div
        style={{
          width: "160px",
          height: "170px",
          background: "#03140F",
          borderRadius: "16px",
          border: "1.5px solid rgba(16, 185, 129, 0.4)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.6), inset 0 0 15px rgba(16,185,129,0.1)",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, color: "#10B981" }}>
            ECG PULSE
          </span>
          <span style={{ fontSize: "12px", fontWeight: 900, color: "#EF4444" }}>
            118 bpm
          </span>
        </div>

        {/* ECG Wave SVG */}
        <svg
          viewBox="0 0 140 60"
          style={{ width: "100%", height: "60px", overflow: "visible" }}
        >
          <path
            d="M 0 30 L 25 30 L 32 10 L 40 50 L 48 20 L 55 35 L 62 30 L 95 30 L 102 10 L 110 50 L 118 20 L 125 35 L 140 30"
            stroke="#10B981"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: "drop-shadow(0 0 6px #10B981)",
            }}
          />
          {/* Scanning line */}
          <line
            x1={ecgOffset}
            y1="0"
            x2={ecgOffset}
            y2="60"
            stroke="#34D399"
            strokeWidth="2"
            opacity="0.8"
          />
        </svg>

        <div style={{ fontSize: "10px", color: "#94A3B8", textAlign: "center" }}>
          Tingkat Stres: <b style={{ color: "#EF4444" }}>TINGGI</b>
        </div>
      </div>

      {/* Floating Pill Tag */}
      <div
        style={{
          background: "rgba(239, 68, 68, 0.2)",
          border: "1px solid #EF4444",
          borderRadius: "20px",
          padding: "6px 12px",
          color: "#FEE2E2",
          fontSize: "12px",
          fontWeight: 800,
          boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span>⚠️</span>
        <span>p-value &gt; 0.05</span>
      </div>
    </div>
  );
};

// ── PROPOSAL PAPER MOCKUP WITH STAMP ──────────────────────────────────────────
const ProposalMockup: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Stempel slams down at frame 42 (when VO says "ditolak")
  const stampSpring = spring({
    frame: frame - 42,
    fps,
    config: { damping: 11, stiffness: 220, mass: 0.9 },
  });

  const stampVisible = frame >= 42;
  const stampScale = interpolate(stampSpring, [0, 1], [2.2, 1]);
  const stampOpacity = clamp(interpolate(stampSpring, [0, 0.4], [0, 1]), 0, 1);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "35px",
        transform: "translateX(-50%)",
        width: "570px",
        height: "695px",
        background: "linear-gradient(180deg, #FDFDFD 0%, #F4F7F5 100%)",
        borderRadius: "14px",
        boxShadow:
          "0 20px 50px rgba(0,0,0,0.65), 0 2px 10px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.8)",
        padding: "36px 36px 28px 36px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Top Paper Binder Clip */}
      <div
        style={{
          position: "absolute",
          top: "-14px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "110px",
          height: "28px",
          background: "linear-gradient(180deg, #475569 0%, #1E293B 100%)",
          borderRadius: "7px",
          border: "1.5px solid #64748B",
          boxShadow: "0 6px 14px rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 5,
        }}
      >
        <div
          style={{
            width: "50px",
            height: "4px",
            background: "#94A3B8",
            borderRadius: "2px",
          }}
        />
      </div>

      {/* Academic Header */}
      <div
        style={{
          borderBottom: "2px solid #0F172A",
          paddingBottom: "12px",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: 800,
            color: "#0F766E",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "3px",
          }}
        >
          PROGRAM STUDI KESEHATAN MASYARAKAT & KEPERAWATAN
        </div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 900,
            color: "#0F172A",
            letterSpacing: "0.5px",
          }}
        >
          PROPOSAL PENELITIAN SKRIPSI
        </div>
        <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
          Tahun Akademik 2026/2027 • Ujian Seminar Proposal
        </div>
      </div>

      {/* Proposal Title */}
      <div
        style={{
          background: "#F1F5F9",
          borderRadius: "8px",
          padding: "10px 14px",
          borderLeft: "4px solid #0F766E",
          marginBottom: "16px",
        }}
      >
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748B" }}>
          JUDUL PENELITIAN:
        </div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 800,
            color: "#1E293B",
            lineHeight: 1.35,
            marginTop: "2px",
          }}
        >
          "Hubungan Pola Shift Kerja & Beban Kerja Fisik terhadap Kejadian Hipertensi pada Perawat Instalasi Gawat Darurat"
        </div>
      </div>

      {/* BAB III - METODOLOGI PENELITIAN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 900,
            color: "#0F172A",
            borderBottom: "1.5px dashed #CBD5E1",
            paddingBottom: "4px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>BAB III — METODE PENELITIAN</span>
          <span style={{ fontSize: "11px", color: "#EF4444", fontWeight: 800 }}>
            3 Catatan Penguji ❗
          </span>
        </div>

        {/* Item 1 */}
        <div
          style={{
            background: "#FFF",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #E2E8F0",
            position: "relative",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#1E293B" }}>
            3.1 Desain Penelitian: <i>Cross-Sectional</i>
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#DC2626",
              fontWeight: 700,
              marginTop: "2px",
              textDecoration: "underline",
            }}
          >
            ❌ Coretan: Tidak bisa tarik kesimpulan kausalitas (sebab-akibat)!
          </div>
        </div>

        {/* Item 2 */}
        <div
          style={{
            background: "#FFF",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #E2E8F0",
            position: "relative",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#1E293B" }}>
            3.2 Populasi & Sampel: N = 40 (Rumus Slovin)
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#DC2626",
              fontWeight: 700,
              marginTop: "2px",
              textDecoration: "underline",
            }}
          >
            ❌ Coretan: Salah rumus! Riset analitik wajib Lemeshow / 2 Proporsi!
          </div>
        </div>

        {/* Item 3 */}
        <div
          style={{
            background: "#FFF",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #E2E8F0",
            position: "relative",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#1E293B" }}>
            3.3 Instrumen: Kuesioner Adopsi Mandiri
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#DC2626",
              fontWeight: 700,
              marginTop: "2px",
              textDecoration: "underline",
            }}
          >
            ❌ Coretan: Belum uji validitas isi & reliabilitas Cronbach Alpha!
          </div>
        </div>
      </div>

      {/* Footer sign off */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingTop: "8px",
          borderTop: "1px solid #E2E8F0",
        }}
      >
        <span style={{ fontSize: "10px", color: "#94A3B8" }}>
          Halaman 24 dari 48 • Dokumen Rahasia
        </span>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "10px", color: "#64748B" }}>Tanda Tangan Penguji:</div>
          <div
            style={{
              fontSize: "14px",
              fontFamily: "cursive",
              color: "#0F172A",
              fontWeight: 700,
            }}
          >
            Prof. Dr. Med.
          </div>
        </div>
      </div>

      {/* ── STEMPEL MERAH "DITOLAK / REVISI METODE" ──────────────────────── */}
      {stampVisible && (
        <div
          style={{
            position: "absolute",
            top: "235px",
            left: "50%",
            transform: `translateX(-50%) scale(${stampScale}) rotate(-13deg)`,
            transformOrigin: "center center",
            opacity: stampOpacity,
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              border: "6px double #DC2626",
              borderRadius: "14px",
              padding: "16px 26px",
              background: "rgba(239, 68, 68, 0.16)",
              boxShadow:
                "0 0 35px rgba(220, 38, 38, 0.55), inset 0 0 20px rgba(220, 38, 38, 0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              backdropFilter: "blur(2px)",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: 900,
                color: "#DC2626",
                letterSpacing: "4px",
                textTransform: "uppercase",
              }}
            >
              ★ KEPUTUSAN SEMPRO ★
            </div>
            <div
              style={{
                fontSize: "58px",
                fontWeight: 900,
                color: "#DC2626",
                letterSpacing: "6px",
                lineHeight: 1,
                fontFamily: "Impact, 'Arial Black', sans-serif",
                textShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              DITOLAK
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 900,
                color: "#B91C1C",
                background: "#FEE2E2",
                padding: "3px 12px",
                borderRadius: "6px",
                letterSpacing: "2px",
                border: "1.5px solid #DC2626",
              }}
            >
              REVISI TOTAL METODOLOGI
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── SCENE 1: HOOK COMPONENT ───────────────────────────────────────────────────
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for main cards
  const enterSpring = spring({
    frame: frame - 2,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Pulse Glow for the Niche badge
  const pulseGlow = Math.sin(frame * 0.15);
  const badgeGlowRadius = 12 + 8 * pulseGlow;
  const badgeBorderOpacity = 0.45 + 0.35 * pulseGlow;

  // Staggered springs for Bottom Alert Items
  const item1Spring = spring({ frame: frame - 90, fps, config: { damping: 14, stiffness: 140 } });
  const item2Spring = spring({ frame: frame - 114, fps, config: { damping: 14, stiffness: 140 } });
  const item3Spring = spring({ frame: frame - 138, fps, config: { damping: 14, stiffness: 140 } });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* SFX: Whoosh at card entrance */}
      <Sequence from={4} durationInFrames={30}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.65} />
      </Sequence>

      {/* SFX: Error Buzz right when stamp hits at frame 42 */}
      <Sequence from={42} durationInFrames={45}>
        <Audio src={staticFile("audio/error_buzz.mp3")} volume={0.85} />
      </Sequence>

      {/* Full Canvas Medical Background */}
      <MedicalBackground />

      {/* ── TOP HEADER CARD (Y: 100px - 250px) ─────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "40px",
          right: "40px",
          height: "150px",
          zIndex: 40,
          transform: `scale(${enterSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(135deg, rgba(4, 28, 22, 0.95) 0%, rgba(6, 40, 31, 0.95) 100%)",
            border: "2px solid rgba(16, 185, 129, 0.45)",
            borderRadius: "24px",
            padding: "18px 28px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.65), 0 0 25px rgba(16, 185, 129, 0.2)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* Animated Pulse Glow Badge */}
            <div
              style={{
                alignSelf: "flex-start",
                background: "linear-gradient(90deg, #065F46 0%, #047857 100%)",
                border: `1.5px solid rgba(52, 211, 153, ${badgeBorderOpacity})`,
                borderRadius: "30px",
                padding: "6px 16px",
                boxShadow: `0 0 ${badgeGlowRadius}px rgba(16, 185, 129, 0.5)`,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#34D399",
                  boxShadow: "0 0 8px #34D399",
                }}
              />
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 900,
                  color: "#ECFDF5",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Niche: Skripsi Kesehatan
              </span>
            </div>

            {/* Header Subtitle */}
            <div
              style={{
                fontSize: "26px",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "0.5px",
                lineHeight: 1.2,
              }}
            >
              Bedah Metodologi & Desain Riset
            </div>
          </div>

          {/* Medical Shield Icon */}
          <div
            style={{
              width: "74px",
              height: "74px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #0F766E 0%, #047857 100%)",
              border: "2px solid #34D399",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 8px 20px rgba(16, 185, 129, 0.35)",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                fill="rgba(52, 211, 153, 0.25)"
                stroke="#34D399"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 8v8M8 12h8"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── MAIN GRAPHIC CARD (Y: 280px - 1050px) ───────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "280px",
          left: "40px",
          right: "40px",
          height: "770px",
          zIndex: 30,
          transform: `scale(${enterSpring})`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, rgba(5, 30, 23, 0.92) 0%, rgba(3, 19, 15, 0.96) 100%)",
            borderRadius: "28px",
            border: "2px solid rgba(16, 185, 129, 0.35)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {/* Left Side: Stethoscope */}
          <StethoscopeVisual />

          {/* Center: Proposal Skripsi Mockup with Pop-Up Stamp */}
          <ProposalMockup frame={frame} fps={fps} />

          {/* Right Side: Clipboard & ECG Vital Signs */}
          <ClipboardVisual frame={frame} />
        </div>
      </div>

      {/* ── BOTTOM ALERT BOX (Y: 1080px - 1520px) ───────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "1080px",
          left: "40px",
          right: "40px",
          height: "440px",
          zIndex: 35,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, rgba(28, 10, 10, 0.94) 0%, rgba(20, 6, 6, 0.96) 100%)",
            borderRadius: "26px",
            border: "2px solid rgba(239, 68, 68, 0.65)",
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.75), 0 0 35px rgba(239, 68, 68, 0.25), inset 0 0 20px rgba(239,68,68,0.1)",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Header Row */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid #EF4444",
                borderRadius: "20px",
                padding: "4px 14px",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "14px" }}>⚠️</span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 900,
                  color: "#FCA5A5",
                  letterSpacing: "1px",
                }}
              >
                PERINGATAN DOSEN PENGUJI
              </span>
            </div>
            <div
              style={{
                fontSize: "30px",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "0.5px",
                lineHeight: 1.15,
                textShadow: "0 2px 10px rgba(239,68,68,0.5)",
              }}
            >
              3 KESALAHAN FATAL METODOLOGI
            </div>
          </div>

          {/* Interactive List [1, 2, 3] */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Item 1 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1.5px solid rgba(239, 68, 68, 0.35)",
                borderRadius: "14px",
                padding: "10px 16px",
                transform: `translateX(${interpolate(item1Spring, [0, 1], [-40, 0])}px)`,
                opacity: clamp(item1Spring, 0, 1),
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "#DC2626",
                  color: "#FFFFFF",
                  fontWeight: 900,
                  fontSize: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(220, 38, 38, 0.6)",
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "17px", fontWeight: 800, color: "#FEE2E2" }}>
                  Desain Studi Tidak Nyambung
                </div>
                <div style={{ fontSize: "13px", color: "#FCA5A5", opacity: 0.85 }}>
                  Klaim sebab-akibat tapi cuma pakai <i>Cross-Sectional</i>
                </div>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  background: "rgba(220, 38, 38, 0.3)",
                  border: "1px solid #DC2626",
                  color: "#FCA5A5",
                  padding: "4px 8px",
                  borderRadius: "6px",
                }}
              >
                FATAL
              </div>
            </div>

            {/* Item 2 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1.5px solid rgba(239, 68, 68, 0.35)",
                borderRadius: "14px",
                padding: "10px 16px",
                transform: `translateX(${interpolate(item2Spring, [0, 1], [-40, 0])}px)`,
                opacity: clamp(item2Spring, 0, 1),
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "#DC2626",
                  color: "#FFFFFF",
                  fontWeight: 900,
                  fontSize: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(220, 38, 38, 0.6)",
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "17px", fontWeight: 800, color: "#FEE2E2" }}>
                  Rumus Besar Sampel Asal Pilih
                </div>
                <div style={{ fontSize: "13px", color: "#FCA5A5", opacity: 0.85 }}>
                  Pakai Slovin padahal analitik wajib Lemeshow / Cohort
                </div>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  background: "rgba(220, 38, 38, 0.3)",
                  border: "1px solid #DC2626",
                  color: "#FCA5A5",
                  padding: "4px 8px",
                  borderRadius: "6px",
                }}
              >
                BIAS
              </div>
            </div>

            {/* Item 3 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1.5px solid rgba(239, 68, 68, 0.35)",
                borderRadius: "14px",
                padding: "10px 16px",
                transform: `translateX(${interpolate(item3Spring, [0, 1], [-40, 0])}px)`,
                opacity: clamp(item3Spring, 0, 1),
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "#DC2626",
                  color: "#FFFFFF",
                  fontWeight: 900,
                  fontSize: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(220, 38, 38, 0.6)",
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "17px", fontWeight: 800, color: "#FEE2E2" }}>
                  Instrumen Kuesioner Tanpa Uji
                </div>
                <div style={{ fontSize: "13px", color: "#FCA5A5", opacity: 0.85 }}>
                  Adopsi kuesioner tanpa validitas isi & reliabilitas
                </div>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  background: "rgba(220, 38, 38, 0.3)",
                  border: "1px solid #DC2626",
                  color: "#FCA5A5",
                  padding: "4px 8px",
                  borderRadius: "6px",
                }}
              >
                DITOLAK
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SAFE ZONE Y: 1600px - 1920px (DEDICATED FOR RUNNING CAPTION) ── */}
      <RunningCaption words={CAPS_S1} frame={frame} accentColor="#10B981" top="1680px" />
    </AbsoluteFill>
  );
};

// ── CAPTION WORDS — SCENE 2 ───────────────────────────────────────────────────
// Naskah: "Satu, sampel. Dosen tanya, kenapa respondenmu segini? Jumlah sampel harus punya rumus dan alasan, bukan asal cukup."
// Audio duration: 8.96 detik (~269 frames) @ 30 FPS.
export const CAPS_S2: CaptionWord[] = [
  { word: "Satu,", start: 4 },
  { word: "sampel.", start: 16 },
  { word: "Dosen", start: 36 },
  { word: "tanya,", start: 48 },
  { word: "kenapa", start: 62 },
  { word: "respondenmu", start: 78 },
  { word: "segini?", start: 104 },
  { word: "Jumlah", start: 126 },
  { word: "sampel", start: 140 },
  { word: "harus", start: 154 },
  { word: "punya", start: 168 },
  { word: "rumus", start: 182 },
  { word: "dan", start: 196 },
  { word: "alasan,", start: 208 },
  { word: "bukan", start: 228 },
  { word: "asal", start: 242 },
  { word: "cukup.", start: 256 },
];

// ── SCENE 2: STATISTICAL POPULATION & BELL CURVE SVG GRAPHIC ──────────────────
const SampleDistributionGraphic: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = Math.sin(frame * 0.08);

  return (
    <svg
      viewBox="0 0 980 230"
      style={{
        width: "100%",
        height: "230px",
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient id="bellCurveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="rejectionGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Grid Lines */}
      <line x1="60" y1="180" x2="920" y2="180" stroke="#334155" strokeWidth="1.5" />
      <line x1="490" y1="30" x2="490" y2="180" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

      {/* Left Rejection Tail (α/2 = 0.025) */}
      <path
        d="M 120 180 Q 200 178 260 148 L 260 180 Z"
        fill="url(#rejectionGrad)"
      />
      <line x1="260" y1="140" x2="260" y2="180" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="180" y="165" fill="#FCA5A5" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        Rejeksi (2.5%)
      </text>

      {/* Right Rejection Tail (α/2 = 0.025) */}
      <path
        d="M 720 148 Q 780 178 860 180 L 720 180 Z"
        fill="url(#rejectionGrad)"
      />
      <line x1="720" y1="140" x2="720" y2="180" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="735" y="165" fill="#FCA5A5" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        Rejeksi (2.5%)
      </text>

      {/* Main Gaussian Bell Curve (95% Confidence Interval) */}
      <path
        d="M 120 180 C 240 180, 360 30, 490 30 C 620 30, 740 180, 860 180 Z"
        fill="url(#bellCurveGrad)"
      />
      <path
        d="M 120 180 C 240 180, 360 30, 490 30 C 620 30, 740 180, 860 180 Z"
        stroke="#34D399"
        strokeWidth="3.5"
        fill="none"
        style={{
          filter: "drop-shadow(0 0 8px rgba(52, 211, 153, 0.6))",
        }}
      />

      {/* Peak Indicator Z = 1.96 */}
      <circle cx="490" cy="30" r={6 + 2 * pulse} fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
      <text x="490" y="16" fill="#FDE68A" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
        Tingkat Kepercayaan 95% (Z = 1.96)
      </text>

      {/* Population -> Sample Funnel Icons (Left & Right) */}
      <g opacity="0.85">
        <text x="350" y="115" fill="#ECFDF5" fontSize="14" fontWeight="800" fontFamily="sans-serif">
          Populasi Target (N)
        </text>
        <path d="M 390 125 L 430 145" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" markerEnd="url(#arrow)" />
        <text x="560" y="115" fill="#34D399" fontSize="14" fontWeight="800" fontFamily="sans-serif">
          Sampel Riil (n)
        </text>
        <path d="M 590 125 L 550 145" stroke="#34D399" strokeWidth="2" strokeDasharray="3 2" />
      </g>
    </svg>
  );
};

// ── SCENE 2: RUMUS & KRITERIA SAMPEL ──────────────────────────────────────────
export const Scene2_RumusSampel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame: frame - 2,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Pulse animation for Interactive Formula Box
  const pulse = Math.sin(frame * 0.12);
  const formulaGlow = 18 + 10 * pulse;
  const formulaScale = 1 + 0.015 * pulse;

  // Staggered springs for comparison cards
  const wrongBoxSpring = spring({ frame: frame - 10, fps, config: { damping: 13, stiffness: 130 } });
  const vsSpring = spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 150 } });
  const rightBoxSpring = spring({ frame: frame - 50, fps, config: { damping: 13, stiffness: 130 } });
  const formulaBoxSpring = spring({ frame: frame - 120, fps, config: { damping: 14, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* SFX: Paper Flip at transition entrance */}
      <Sequence from={2} durationInFrames={35}>
        <Audio src={staticFile("audio/paper_flip.mp3")} volume={0.7} />
      </Sequence>

      {/* SFX: Pop when Formula Card enters */}
      <Sequence from={124} durationInFrames={35}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.85} />
      </Sequence>

      {/* Full Canvas Medical Background */}
      <MedicalBackground />

      {/* ── TOP HEADER CARD (Y: 100px - 220px) ─────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "40px",
          right: "40px",
          height: "120px",
          zIndex: 40,
          transform: `scale(${enterSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(135deg, rgba(35, 20, 4, 0.95) 0%, rgba(20, 12, 2, 0.95) 100%)",
            border: "2px solid rgba(245, 158, 11, 0.55)",
            borderRadius: "22px",
            padding: "16px 26px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.65), 0 0 25px rgba(245, 158, 11, 0.25)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div
              style={{
                alignSelf: "flex-start",
                background: "linear-gradient(90deg, #B45309 0%, #D97706 100%)",
                border: "1.5px solid #FCD34D",
                borderRadius: "30px",
                padding: "4px 14px",
                boxShadow: "0 0 12px rgba(245, 158, 11, 0.4)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#FEF3C7",
                  boxShadow: "0 0 6px #FCD34D",
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 900,
                  color: "#FFFBEB",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                POIN #1 • METODOLOGI
              </span>
            </div>
            <div
              style={{
                fontSize: "27px",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "0.5px",
                lineHeight: 1.15,
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              1. RUMUS & KRITERIA SAMPEL
            </div>
          </div>

          {/* Statistical Beaker / Sample Icon */}
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #D97706 0%, #92400E 100%)",
              border: "2px solid #FCD34D",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 8px 20px rgba(245, 158, 11, 0.35)",
            }}
          >
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path
                d="M4.5 3h15M6 3v16a2 2 0 002 2h8a2 2 0 002-2V3M6 14h12"
                stroke="#FEF3C7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="17" r="1.5" fill="#FCD34D" />
              <circle cx="14" cy="16" r="1.5" fill="#FCD34D" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── MAIN VISUAL COMPARISON CARD (Y: 250px - 980px) ──────────────── */}
      <div
        style={{
          position: "absolute",
          top: "250px",
          left: "40px",
          right: "40px",
          height: "730px",
          zIndex: 30,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, rgba(8, 24, 20, 0.94) 0%, rgba(4, 16, 13, 0.98) 100%)",
            borderRadius: "28px",
            border: "2px solid rgba(16, 185, 129, 0.35)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* ❌ BOX SALAH (Atas, Merah Soft) */}
          <div
            style={{
              height: "315px",
              background: "linear-gradient(135deg, rgba(45, 12, 12, 0.9) 0%, rgba(26, 7, 7, 0.95) 100%)",
              borderRadius: "20px",
              border: "2px solid rgba(239, 68, 68, 0.6)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5), inset 0 0 15px rgba(239, 68, 68, 0.12)",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box",
              transform: `scale(${wrongBoxSpring})`,
              transformOrigin: "top center",
            }}
          >
            {/* Header Salah */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.22)",
                  border: "1.5px solid #EF4444",
                  borderRadius: "20px",
                  padding: "4px 14px",
                  color: "#FCA5A5",
                  fontSize: "13px",
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>❌</span>
                <span>CARA SALAH (DITOLAK DOSEN)</span>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#EF4444",
                  fontWeight: 800,
                  background: "rgba(0,0,0,0.3)",
                  padding: "3px 10px",
                  borderRadius: "6px",
                }}
              >
                TIDAK VALID
              </span>
            </div>

            {/* Headline Salah */}
            <div>
              <div
                style={{
                  fontSize: "23px",
                  fontWeight: 900,
                  color: "#FEE2E2",
                  lineHeight: 1.25,
                }}
              >
                Asal Cukup / "Katanya Dosen 50 Orang Aja"
              </div>
              {/* Dialogue Quote Mahasiswa */}
              <div
                style={{
                  marginTop: "10px",
                  background: "rgba(0,0,0,0.4)",
                  borderLeft: "4px solid #EF4444",
                  borderRadius: "0 8px 8px 0",
                  padding: "10px 14px",
                }}
              >
                <div style={{ fontSize: "13px", color: "#FCA5A5", fontStyle: "italic" }}>
                  "Populasi IGD ada 120 orang, tapi saya ambil 40 aja bu biar cepet..."
                </div>
                <div style={{ fontSize: "12px", color: "#EF4444", fontWeight: 800, marginTop: "4px" }}>
                  💥 Respon Penguji: "DASAR TEORIMU APA?! Rawan bias & power drop!"
                </div>
              </div>
            </div>

            {/* Tags Salah */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["❌ Tanpa Power Analisis", "❌ Bias Seleksi", "❌ Hasil Generalisasi Lemah"].map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#F87171",
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    padding: "3px 10px",
                    borderRadius: "6px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ⚡ CENTER VS BADGE ─────────────────────────────── */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${vsSpring})`,
              zIndex: 10,
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
              border: "3px solid #FFFBEB",
              boxShadow: "0 0 20px rgba(245, 158, 11, 0.6), 0 4px 12px rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 900,
              fontSize: "18px",
              color: "#FFFFFF",
              letterSpacing: "1px",
            }}
          >
            VS
          </div>

          {/* ✅ BOX BENAR (Bawah, Hijau Emerald) */}
          <div
            style={{
              height: "330px",
              background: "linear-gradient(135deg, rgba(6, 38, 28, 0.94) 0%, rgba(3, 24, 18, 0.98) 100%)",
              borderRadius: "20px",
              border: "2px solid rgba(16, 185, 129, 0.75)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5), inset 0 0 20px rgba(16, 185, 129, 0.18)",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box",
              transform: `scale(${rightBoxSpring})`,
              transformOrigin: "bottom center",
            }}
          >
            {/* Header Benar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.22)",
                  border: "1.5px solid #10B981",
                  borderRadius: "20px",
                  padding: "4px 14px",
                  color: "#6EE7B7",
                  fontSize: "13px",
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>✅</span>
                <span>CARA BENAR (STANDAR RISET MEDIS)</span>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#34D399",
                  fontWeight: 800,
                  background: "rgba(0,0,0,0.3)",
                  padding: "3px 10px",
                  borderRadius: "6px",
                }}
              >
                ACC DOSEN
              </span>
            </div>

            {/* Headline Benar */}
            <div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 900,
                  color: "#ECFDF5",
                  lineHeight: 1.25,
                }}
              >
                Gunakan Rumus (Slovin / Lemeshow) + Kriteria Inklusi
              </div>
            </div>

            {/* 3 Step Breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                {
                  no: "1",
                  title: "Pilih Rumus Berdasarkan Desain Studi",
                  desc: "Slovin (deskriptif) vs Lemeshow (analitik hipotesis / case-control)",
                },
                {
                  no: "2",
                  title: "Kriteria Inklusi & Eksklusi Ketat",
                  desc: "Batasi masa kerja, status shift kerja, dan riwayat klinis jelas",
                },
                {
                  no: "3",
                  title: "Antisipasi Drop-Out (+10% Buffer)",
                  desc: "Cegah data gugur saat responden tidak menyelesaikan kuesioner",
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "rgba(0,0,0,0.35)",
                    padding: "7px 12px",
                    borderRadius: "8px",
                    borderLeft: "3px solid #10B981",
                  }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: "#047857",
                      color: "#FFFFFF",
                      fontSize: "11px",
                      fontWeight: 900,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {step.no}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px", fontWeight: 800, color: "#D1FAE5" }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: "11px", color: "#A7F3D0", opacity: 0.85 }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE FORMULA BOX (Y: 1010px - 1520px) ─────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "1010px",
          left: "40px",
          right: "40px",
          height: "510px",
          zIndex: 35,
          transform: `scale(${formulaBoxSpring})`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, rgba(3, 25, 20, 0.95) 0%, rgba(2, 14, 11, 0.98) 100%)",
            borderRadius: "26px",
            border: "2px solid rgba(52, 211, 153, 0.6)",
            boxShadow: `0 20px 50px rgba(0,0,0,0.75), 0 0 ${formulaGlow}px rgba(16, 185, 129, 0.35), inset 0 0 25px rgba(16, 185, 129, 0.12)`,
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            backdropFilter: "blur(12px)",
            position: "relative",
            overflow: "hidden",
            transform: `scale(${formulaScale})`,
          }}
        >
          {/* Header Row */}
          <div style={{ zIndex: 2 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(245, 158, 11, 0.2)",
                border: "1px solid #F59E0B",
                borderRadius: "20px",
                padding: "4px 14px",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "14px" }}>💡</span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 900,
                  color: "#FDE68A",
                  letterSpacing: "1px",
                }}
              >
                GOLDEN RULE METODOLOGI KESEHATAN
              </span>
            </div>

            {/* Formula Visual Card */}
            <div
              style={{
                background: "linear-gradient(90deg, rgba(6, 78, 59, 0.8) 0%, rgba(4, 120, 87, 0.8) 100%)",
                border: "2px solid #34D399",
                borderRadius: "16px",
                padding: "16px 20px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 16px rgba(52, 211, 153, 0.4)",
                textAlign: "center",
                marginTop: "6px",
              }}
            >
              <div
                style={{
                  fontSize: "25px",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  letterSpacing: "0.5px",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  lineHeight: 1.3,
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                }}
              >
                [ Jumlah Sampel = <span style={{ color: "#FDE68A" }}>Rumus Presisi</span> + <span style={{ color: "#A7F3D0" }}>Alasan Metodologis</span> ]
              </div>
            </div>
          </div>

          {/* Statistical Bell Curve Graphic Background (Canvas Filler) */}
          <div style={{ zIndex: 1, marginTop: "6px" }}>
            <SampleDistributionGraphic frame={frame} />
          </div>

          {/* Dual Rumus Formula Badges */}
          <div
            style={{
              zIndex: 2,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            <div
              style={{
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(52, 211, 153, 0.4)",
                borderRadius: "12px",
                padding: "10px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#34D399" }}>
                RUMUS SLOVIN (DESKRIPTIF)
              </div>
              <div style={{ fontSize: "15px", fontWeight: 900, color: "#F1F5F9" }}>
                n = N / (1 + N · e²)
              </div>
              <div style={{ fontSize: "10px", color: "#94A3B8" }}>
                Populasi diketahui pasti (e = 5%)
              </div>
            </div>

            <div
              style={{
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                borderRadius: "12px",
                padding: "10px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#F59E0B" }}>
                RUMUS LEMESHOW (ANALITIK)
              </div>
              <div style={{ fontSize: "15px", fontWeight: 900, color: "#F1F5F9" }}>
                n = (Z² · P(1-P)) / d²
              </div>
              <div style={{ fontSize: "10px", color: "#94A3B8" }}>
                Uji hipotesis & populasi tidak diketahui
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SAFE ZONE Y: 1600px - 1920px (DEDICATED FOR RUNNING CAPTION) ── */}
      <RunningCaption words={CAPS_S2} frame={frame} accentColor="#F59E0B" top="1680px" />
    </AbsoluteFill>
  );
};

// ── PLACEHOLDER COMPONENTS FOR SCENE 3 - 5 ────────────────────────────────────

// ── CAPTION WORDS — SCENE 3 ───────────────────────────────────────────────────
// Naskah: "Dua, uji statistik. Data kategorik tidak bisa dipaksa pakai uji untuk data angka. Pilih ujinya dari jenis data dan tujuanmu."
// Audio duration: 9.60 detik (~288 frames) @ 30 FPS + 15 frames breathing room.
export const CAPS_S3: CaptionWord[] = [
  { word: "Dua,", start: 19 },
  { word: "uji", start: 30 },
  { word: "statistik.", start: 42 },
  { word: "Data", start: 66 },
  { word: "kategorik", start: 78 },
  { word: "tidak", start: 102 },
  { word: "bisa", start: 114 },
  { word: "dipaksa", start: 126 },
  { word: "pakai", start: 142 },
  { word: "uji", start: 154 },
  { word: "untuk", start: 166 },
  { word: "data", start: 178 },
  { word: "angka.", start: 190 },
  { word: "Pilih", start: 218 },
  { word: "ujinya", start: 232 },
  { word: "dari", start: 246 },
  { word: "jenis", start: 258 },
  { word: "data", start: 272 },
  { word: "dan", start: 284 },
  { word: "tujuanmu.", start: 296 },
];

// ── SCENE 3: STATISTICAL DECISION TREE FLOW SVG ───────────────────────────────
const StatisticalFlowchartGraphic: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = Math.sin(frame * 0.1);

  return (
    <svg
      viewBox="0 0 980 140"
      style={{
        width: "100%",
        height: "140px",
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Connecting Flow Lines */}
      <path
        d="M 230 70 L 390 70"
        stroke="url(#flowGrad)"
        strokeWidth="3"
        strokeDasharray="6 4"
      />
      <polygon points="395,70 385,64 385,76" fill="#10B981" />

      <path
        d="M 600 70 L 760 70"
        stroke="url(#flowGrad)"
        strokeWidth="3"
        strokeDasharray="6 4"
      />
      <polygon points="765,70 755,64 755,76" fill="#F59E0B" />

      {/* Node 1: Input Data */}
      <g transform="translate(40, 30)">
        <rect
          width="190"
          height="80"
          rx="14"
          fill="#0C2540"
          stroke="#3B82F6"
          strokeWidth="2"
          style={{ filter: "drop-shadow(0 6px 16px rgba(59,130,246,0.3))" }}
        />
        <text x="95" y="34" fill="#93C5FD" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          LANGKAH 1
        </text>
        <text x="95" y="58" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          Identifikasi Data
        </text>
      </g>

      {/* Node 2: Tujuan & Kelompok */}
      <g transform="translate(400, 30)">
        <rect
          width="200"
          height="80"
          rx="14"
          fill="#06382A"
          stroke="#10B981"
          strokeWidth="2"
          style={{ filter: "drop-shadow(0 6px 16px rgba(16,185,129,0.3))" }}
        />
        <text x="100" y="34" fill="#6EE7B7" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          LANGKAH 2
        </text>
        <text x="100" y="58" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          Tujuan & Desain
        </text>
      </g>

      {/* Node 3: Uji Tepat */}
      <g transform="translate(770, 30)">
        <rect
          width="170"
          height="80"
          rx="14"
          fill="#3B1E05"
          stroke="#F59E0B"
          strokeWidth={2 + pulse}
          style={{ filter: "drop-shadow(0 6px 16px rgba(245,158,11,0.4))" }}
        />
        <text x="85" y="34" fill="#FCD34D" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          OUTPUT
        </text>
        <text x="85" y="58" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          Rumus Uji Valid
        </text>
      </g>
    </svg>
  );
};

// ── SCENE 3: PILIH UJI STATISTIK TEPAT ─────────────────────────────────────────
export const Scene3_UjiStatistik: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring with 15 frames breathing room consideration
  const enterSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Pulse & Shake for Warning Badge
  const shakeX = frame >= 65 && frame <= 140 ? Math.sin(frame * 0.6) * 3 : 0;
  const pulse = Math.sin(frame * 0.12);

  // Staggered highlights for rows
  const isRow1Active = frame >= 75;
  const isRow2Active = frame >= 140;

  const row1Spring = spring({ frame: frame - 20, fps, config: { damping: 13, stiffness: 130 } });
  const row2Spring = spring({ frame: frame - 40, fps, config: { damping: 13, stiffness: 130 } });
  const flowBoxSpring = spring({ frame: frame - 70, fps, config: { damping: 14, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* SFX: Whoosh at transition entrance */}
      <Sequence from={10} durationInFrames={35}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.65} />
      </Sequence>

      {/* SFX: Bell Ding when Matrix Highlight activates (frame 75) */}
      <Sequence from={75} durationInFrames={40}>
        <Audio src={staticFile("audio/bell_ding.mp3")} volume={0.8} />
      </Sequence>

      {/* Full Canvas Medical Background */}
      <MedicalBackground />

      {/* ── TOP HEADER CARD (Y: 100px - 220px) ─────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "40px",
          right: "40px",
          height: "120px",
          zIndex: 40,
          transform: `scale(${enterSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(135deg, rgba(12, 32, 60, 0.95) 0%, rgba(6, 18, 38, 0.95) 100%)",
            border: "2px solid rgba(59, 130, 246, 0.6)",
            borderRadius: "22px",
            padding: "16px 26px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.65), 0 0 25px rgba(59, 130, 246, 0.25)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div
              style={{
                alignSelf: "flex-start",
                background: "linear-gradient(90deg, #1D4ED8 0%, #2563EB 100%)",
                border: "1.5px solid #93C5FD",
                borderRadius: "30px",
                padding: "4px 14px",
                boxShadow: "0 0 12px rgba(59, 130, 246, 0.4)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#DBEAFE",
                  boxShadow: "0 0 6px #93C5FD",
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 900,
                  color: "#EFF6FF",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                POIN #2 • METODOLOGI
              </span>
            </div>
            <div
              style={{
                fontSize: "27px",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "0.5px",
                lineHeight: 1.15,
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              2. PILIH UJI STATISTIK TEPAT
            </div>
          </div>

          {/* Statistical Matrix Icon */}
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)",
              border: "2px solid #93C5FD",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 8px 20px rgba(59, 130, 246, 0.35)",
            }}
          >
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="#DBEAFE" strokeWidth="2" />
              <line x1="3" y1="9" x2="21" y2="9" stroke="#93C5FD" strokeWidth="1.5" />
              <line x1="3" y1="15" x2="21" y2="15" stroke="#93C5FD" strokeWidth="1.5" />
              <line x1="9" y1="3" x2="9" y2="21" stroke="#93C5FD" strokeWidth="1.5" />
              <line x1="15" y1="3" x2="15" y2="21" stroke="#93C5FD" strokeWidth="1.5" />
              <circle cx="6" cy="6" r="1.5" fill="#60A5FA" />
              <circle cx="12" cy="12" r="1.5" fill="#34D399" />
              <circle cx="18" cy="18" r="1.5" fill="#FCD34D" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── MAIN DATA TYPE COMPARISON CARD (Y: 250px - 980px) ───────────── */}
      <div
        style={{
          position: "absolute",
          top: "250px",
          left: "40px",
          right: "40px",
          height: "730px",
          zIndex: 30,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, rgba(6, 20, 36, 0.94) 0%, rgba(3, 12, 22, 0.98) 100%)",
            borderRadius: "28px",
            border: "2px solid rgba(59, 130, 246, 0.35)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* ⚠️ Warning Alert Badge (Animasi Shake/Pulse) */}
          <div
            style={{
              background: "rgba(239, 68, 68, 0.18)",
              border: "1.5px solid #EF4444",
              borderRadius: "14px",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: `0 4px ${15 + 6 * pulse}px rgba(239, 68, 68, ${0.25 + 0.15 * pulse})`,
              transform: `translateX(${shakeX}px) scale(${1 + 0.02 * pulse})`,
            }}
          >
            <span style={{ fontSize: "16px" }}>⚠️</span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 900,
                color: "#FEE2E2",
                letterSpacing: "1px",
              }}
            >
              DILARANG ASAL PAKAI UJI STATISTIK! (DATA KATEGORIK ≠ NUMERIK)
            </span>
          </div>

          {/* 🟢 ROW 1: DATA KATEGORIK (Nominal / Ordinal) */}
          <div
            style={{
              background: isRow1Active
                ? "linear-gradient(135deg, rgba(6, 40, 30, 0.94) 0%, rgba(3, 25, 18, 0.98) 100%)"
                : "linear-gradient(135deg, rgba(10, 25, 20, 0.7) 0%, rgba(6, 16, 12, 0.8) 100%)",
              borderRadius: "20px",
              border: isRow1Active ? "2.5px solid #10B981" : "1.5px solid rgba(16, 185, 129, 0.35)",
              boxShadow: isRow1Active
                ? "0 12px 30px rgba(0,0,0,0.6), 0 0 25px rgba(16, 185, 129, 0.3)"
                : "none",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              boxSizing: "border-box",
              transform: `scale(${row1Spring})`,
              transition: "border 0.2s, box-shadow 0.2s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div
                style={{
                  background: isRow1Active ? "#059669" : "rgba(16, 185, 129, 0.2)",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 900,
                  padding: "4px 12px",
                  borderRadius: "20px",
                  letterSpacing: "0.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>🏷️</span>
                <span>DATA KATEGORIK (NOMINAL / ORDINAL)</span>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#34D399",
                  background: "rgba(0,0,0,0.3)",
                  padding: "3px 8px",
                  borderRadius: "6px",
                }}
              >
                DATA PENGELOMPOKAN
              </span>
            </div>

            <div>
              <div style={{ fontSize: "13px", color: "#A7F3D0" }}>
                Contoh: Shift Kerja (Pagi / Malam), Riwayat Hipertensi (Ya / Tidak), Tingkat Stres (Ringan / Berat)
              </div>
            </div>

            {/* Recommended Test Box */}
            <div
              style={{
                background: "rgba(0,0,0,0.35)",
                borderLeft: "4px solid #10B981",
                borderRadius: "0 10px 10px 0",
                padding: "10px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: 900, color: "#ECFDF5" }}>
                👉 Gunakan: Uji Chi-Square (X²) / Fisher's Exact Test
              </div>
              <div style={{ fontSize: "12px", color: "#6EE7B7" }}>
                Digunakan untuk menguji asosiasi / hubungan antara 2 variabel kategorik.
              </div>
              <div style={{ fontSize: "11px", color: "#EF4444", fontWeight: 700, marginTop: "2px" }}>
                ❌ Pantangan: Jangan pakai T-Test! Data kategori tidak memiliki mean & standar deviasi!
              </div>
            </div>
          </div>

          {/* 🔵 ROW 2: DATA NUMERIK (Interval / Rasio) */}
          <div
            style={{
              background: isRow2Active
                ? "linear-gradient(135deg, rgba(12, 34, 62, 0.94) 0%, rgba(6, 20, 40, 0.98) 100%)"
                : "linear-gradient(135deg, rgba(8, 22, 40, 0.7) 0%, rgba(5, 14, 26, 0.8) 100%)",
              borderRadius: "20px",
              border: isRow2Active ? "2.5px solid #3B82F6" : "1.5px solid rgba(59, 130, 246, 0.35)",
              boxShadow: isRow2Active
                ? "0 12px 30px rgba(0,0,0,0.6), 0 0 25px rgba(59, 130, 246, 0.3)"
                : "none",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              boxSizing: "border-box",
              transform: `scale(${row2Spring})`,
              transition: "border 0.2s, box-shadow 0.2s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div
                style={{
                  background: isRow2Active ? "#2563EB" : "rgba(59, 130, 246, 0.2)",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 900,
                  padding: "4px 12px",
                  borderRadius: "20px",
                  letterSpacing: "0.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>🔢</span>
                <span>DATA NUMERIK / ANGKA (RASIO / INTERVAL)</span>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#60A5FA",
                  background: "rgba(0,0,0,0.3)",
                  padding: "3px 8px",
                  borderRadius: "6px",
                }}
              >
                DATA HASIL UKUR
              </span>
            </div>

            <div>
              <div style={{ fontSize: "13px", color: "#BAE6FD" }}>
                Contoh: Tekanan Darah Sistolik (mmHg), Kadar Glukosa (mg/dL), Usia (Tahun), Indeks Massa Tubuh
              </div>
            </div>

            {/* Recommended Test Box */}
            <div
              style={{
                background: "rgba(0,0,0,0.35)",
                borderLeft: "4px solid #3B82F6",
                borderRadius: "0 10px 10px 0",
                padding: "10px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: 900, color: "#EFF6FF" }}>
                👉 Gunakan: Uji T-Test (2 Kelompok) / ANOVA (&gt;2 Kelompok)
              </div>
              <div style={{ fontSize: "12px", color: "#93C5FD" }}>
                Distribusi normal: Independent/Paired T-Test | Tidak normal: Mann-Whitney / Kruskal-Wallis
              </div>
              <div style={{ fontSize: "11px", color: "#FCD34D", fontWeight: 700, marginTop: "2px" }}>
                💡 Syarat Mutlak: Wajib cantumkan uji normalitas (Shapiro-Wilk / Kolmogorov-Smirnov)!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE DECISION FLOW BOX (Y: 1010px - 1520px) ───────────── */}
      <div
        style={{
          position: "absolute",
          top: "1010px",
          left: "40px",
          right: "40px",
          height: "510px",
          zIndex: 35,
          transform: `scale(${flowBoxSpring})`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, rgba(6, 18, 34, 0.96) 0%, rgba(3, 10, 20, 0.98) 100%)",
            borderRadius: "26px",
            border: "2px solid rgba(59, 130, 246, 0.6)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.75), 0 0 30px rgba(59, 130, 246, 0.25), inset 0 0 25px rgba(59, 130, 246, 0.1)",
            padding: "22px 26px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            backdropFilter: "blur(12px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Header Row */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(59, 130, 246, 0.2)",
                border: "1px solid #3B82F6",
                borderRadius: "20px",
                padding: "4px 14px",
                marginBottom: "6px",
              }}
            >
              <span style={{ fontSize: "14px" }}>🧭</span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 900,
                  color: "#93C5FD",
                  letterSpacing: "1px",
                }}
              >
                ALUR PENGAMBILAN KEPUTUSAN UJI
              </span>
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "0.5px",
                lineHeight: 1.2,
              }}
            >
              Diagram Alir: [ Jenis Data + Tujuan ] → [ Uji Tepat ]
            </div>
          </div>

          {/* Flowchart SVG Graphic */}
          <StatisticalFlowchartGraphic frame={frame} />

          {/* 4-Quadrant Matrix Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            {/* Cell 1 */}
            <div
              style={{
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                borderRadius: "12px",
                padding: "10px 12px",
              }}
            >
              <div style={{ fontSize: "11px", color: "#6EE7B7", fontWeight: 800 }}>
                KATEGORIK vs KATEGORIK
              </div>
              <div style={{ fontSize: "14px", fontWeight: 900, color: "#FFFFFF", marginTop: "2px" }}>
                Chi-Square / Fisher
              </div>
              <div style={{ fontSize: "10px", color: "#94A3B8" }}>Hubungan 2 variabel kelompok</div>
            </div>

            {/* Cell 2 */}
            <div
              style={{
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(59, 130, 246, 0.4)",
                borderRadius: "12px",
                padding: "10px 12px",
              }}
            >
              <div style={{ fontSize: "11px", color: "#93C5FD", fontWeight: 800 }}>
                NUMERIK vs NUMERIK
              </div>
              <div style={{ fontSize: "14px", fontWeight: 900, color: "#FFFFFF", marginTop: "2px" }}>
                Korelasi Pearson / Spearman
              </div>
              <div style={{ fontSize: "10px", color: "#94A3B8" }}>Kekuatan hubungan 2 data ukur</div>
            </div>

            {/* Cell 3 */}
            <div
              style={{
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                borderRadius: "12px",
                padding: "10px 12px",
              }}
            >
              <div style={{ fontSize: "11px", color: "#FCD34D", fontWeight: 800 }}>
                2 KELOMPOK NUMERIK
              </div>
              <div style={{ fontSize: "14px", fontWeight: 900, color: "#FFFFFF", marginTop: "2px" }}>
                Independent T-Test
              </div>
              <div style={{ fontSize: "10px", color: "#94A3B8" }}>Bandingkan nilai mean 2 grup</div>
            </div>

            {/* Cell 4 */}
            <div
              style={{
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(168, 85, 247, 0.4)",
                borderRadius: "12px",
                padding: "10px 12px",
              }}
            >
              <div style={{ fontSize: "11px", color: "#D8B4FE", fontWeight: 800 }}>
                &gt;2 KELOMPOK NUMERIK
              </div>
              <div style={{ fontSize: "14px", fontWeight: 900, color: "#FFFFFF", marginTop: "2px" }}>
                One-Way ANOVA
              </div>
              <div style={{ fontSize: "10px", color: "#94A3B8" }}>Bandingkan nilai mean &gt;2 grup</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SAFE ZONE Y: 1600px - 1920px (DEDICATED FOR RUNNING CAPTION) ── */}
      <RunningCaption words={CAPS_S3} frame={frame} accentColor="#3B82F6" top="1680px" />
    </AbsoluteFill>
  );
};

// ── CAPTION WORDS — SCENE 4 ───────────────────────────────────────────────────
// Naskah: "Tiga, instrumen. Kuesioner langsung disebar tanpa diuji? Uji validitas dan reliabilitas dulu, atau datamu akan dipertanyakan."
// Audio duration: 9.96 detik (~299 frames) @ 30 FPS + 15 frames breathing room.
export const CAPS_S4: CaptionWord[] = [
  { word: "Tiga,", start: 19 },
  { word: "instrumen.", start: 31 },
  { word: "Kuesioner", start: 57 },
  { word: "langsung", start: 71 },
  { word: "disebar", start: 85 },
  { word: "tanpa", start: 101 },
  { word: "diuji?", start: 113 },
  { word: "Uji", start: 145 },
  { word: "validitas", start: 157 },
  { word: "dan", start: 173 },
  { word: "reliabilitas", start: 185 },
  { word: "dulu,", start: 211 },
  { word: "atau", start: 231 },
  { word: "datamu", start: 243 },
  { word: "akan", start: 259 },
  { word: "dipertanyakan.", start: 273 },
];

// ── SCENE 4: QUESTIONNAIRE TRY-OUT FLOW SVG ───────────────────────────────────
const QuestionnaireFlowGraphic: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = Math.sin(frame * 0.1);

  return (
    <svg
      viewBox="0 0 980 130"
      style={{
        width: "100%",
        height: "130px",
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient id="qFlowGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      {/* Process Arrows */}
      <path d="M 220 65 L 340 65" stroke="url(#qFlowGrad)" strokeWidth="3" strokeDasharray="5 3" />
      <polygon points="345,65 335,60 335,70" fill="#F59E0B" />

      <path d="M 520 65 L 640 65" stroke="url(#qFlowGrad)" strokeWidth="3" strokeDasharray="5 3" />
      <polygon points="645,65 635,60 635,70" fill="#10B981" />

      {/* Step 1: Draft Kuesioner */}
      <g transform="translate(30, 25)">
        <rect width="180" height="78" rx="14" fill="#2E0E16" stroke="#F43F5E" strokeWidth="2" />
        <text x="90" y="32" fill="#FECDD3" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          TAHAP 1
        </text>
        <text x="90" y="56" fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          Draft Kuesioner
        </text>
      </g>

      {/* Step 2: Try Out 30 Responden */}
      <g transform="translate(350, 25)">
        <rect width="165" height="78" rx="14" fill="#2D1C08" stroke="#F59E0B" strokeWidth="2" />
        <text x="82" y="32" fill="#FDE68A" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          TAHAP 2
        </text>
        <text x="82" y="56" fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          Try Out (N=30)
        </text>
      </g>

      {/* Step 3: Uji Valid & Sebar */}
      <g transform="translate(650, 25)">
        <rect
          width="290"
          height="78"
          rx="14"
          fill="#063426"
          stroke="#10B981"
          strokeWidth={2 + pulse}
          style={{ filter: "drop-shadow(0 6px 16px rgba(16,185,129,0.35))" }}
        />
        <text x="145" y="32" fill="#A7F3D0" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          TAHAP 3 • VALID & RELIABEL
        </text>
        <text x="145" y="56" fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          r-hitung &gt; r-tabel • α &gt; 0.70
        </text>
      </g>
    </svg>
  );
};

// ── SCENE 4: UJI VALIDITAS & RELIABILITAS ──────────────────────────────────────
export const Scene4_InstrumenValiditas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring with 15 frames breathing room consideration
  const enterSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Warning error buzz state around frame 65-130
  const isErrorBuzzActive = frame >= 65 && frame <= 140;
  const shakeX = isErrorBuzzActive ? Math.sin(frame * 0.7) * 3 : 0;
  const pulse = Math.sin(frame * 0.12);

  const badBoxSpring = spring({ frame: frame - 15, fps, config: { damping: 13, stiffness: 130 } });
  const bestBoxSpring = spring({ frame: frame - 35, fps, config: { damping: 13, stiffness: 130 } });
  const checklistSpring = spring({ frame: frame - 70, fps, config: { damping: 14, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* SFX: Pop when Questionnaire Card enters */}
      <Sequence from={12} durationInFrames={35}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.8} />
      </Sequence>

      {/* SFX: Error Buzz when Warning "Kuesioner Tanpa Uji" activates */}
      <Sequence from={68} durationInFrames={45}>
        <Audio src={staticFile("audio/error_buzz.mp3")} volume={0.85} />
      </Sequence>

      {/* Full Canvas Medical Background */}
      <MedicalBackground />

      {/* ── TOP HEADER CARD (Y: 100px - 220px) ─────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "40px",
          right: "40px",
          height: "120px",
          zIndex: 40,
          transform: `scale(${enterSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(135deg, rgba(42, 10, 20, 0.95) 0%, rgba(26, 6, 12, 0.95) 100%)",
            border: "2px solid rgba(244, 63, 94, 0.65)",
            borderRadius: "22px",
            padding: "16px 26px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.65), 0 0 25px rgba(244, 63, 94, 0.3)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div
              style={{
                alignSelf: "flex-start",
                background: "linear-gradient(90deg, #BE123C 0%, #E11D48 100%)",
                border: "1.5px solid #FECDD3",
                borderRadius: "30px",
                padding: "4px 14px",
                boxShadow: "0 0 12px rgba(244, 63, 94, 0.45)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#FFE4E6",
                  boxShadow: "0 0 6px #FECDD3",
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 900,
                  color: "#FFF1F2",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                POIN #3 • METODOLOGI
              </span>
            </div>
            <div
              style={{
                fontSize: "27px",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "0.5px",
                lineHeight: 1.15,
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              3. UJI VALIDITAS & RELIABILITAS
            </div>
          </div>

          {/* Checklist / Survey Shield Icon */}
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #E11D48 0%, #9F1239 100%)",
              border: "2px solid #FECDD3",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 8px 20px rgba(244, 63, 94, 0.4)",
            }}
          >
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 11l3 3L22 4"
                stroke="#FFE4E6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                stroke="#FECDD3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── QUESTIONNAIRE FLOW CARD (Y: 250px - 980px) ──────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "250px",
          left: "40px",
          right: "40px",
          height: "730px",
          zIndex: 30,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, rgba(22, 6, 12, 0.94) 0%, rgba(12, 3, 6, 0.98) 100%)",
            borderRadius: "28px",
            border: "2px solid rgba(244, 63, 94, 0.35)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* ❌ BAD PRACTICE (Atas, Merah) */}
          <div
            style={{
              height: "315px",
              background: "linear-gradient(135deg, rgba(46, 12, 18, 0.94) 0%, rgba(28, 6, 10, 0.98) 100%)",
              borderRadius: "20px",
              border: isErrorBuzzActive ? "2.5px solid #EF4444" : "1.5px solid rgba(239, 68, 68, 0.5)",
              boxShadow: isErrorBuzzActive
                ? `0 0 ${25 + 10 * pulse}px rgba(239, 68, 68, 0.5), inset 0 0 15px rgba(239, 68, 68, 0.2)`
                : "0 10px 25px rgba(0,0,0,0.5)",
              padding: "18px 22px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box",
              transform: `translateX(${shakeX}px) scale(${badBoxSpring})`,
              transformOrigin: "top center",
              transition: "border 0.2s, box-shadow 0.2s",
            }}
          >
            {/* Header Bad Practice */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.22)",
                  border: "1.5px solid #EF4444",
                  borderRadius: "20px",
                  padding: "4px 14px",
                  color: "#FCA5A5",
                  fontSize: "13px",
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>❌</span>
                <span>BAD PRACTICE (DATA GUGUR SAAT SIDANG)</span>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#EF4444",
                  fontWeight: 800,
                  background: "rgba(0,0,0,0.3)",
                  padding: "3px 10px",
                  borderRadius: "6px",
                }}
              >
                TIDAK DIAKUI
              </span>
            </div>

            {/* Headline Bad Practice */}
            <div>
              <div style={{ fontSize: "21px", fontWeight: 900, color: "#FEE2E2", lineHeight: 1.25 }}>
                Bikin Kuesioner ➔ Langsung Sebarkan ke Responden
              </div>
              {/* Dialogue Quote */}
              <div
                style={{
                  marginTop: "8px",
                  background: "rgba(0,0,0,0.45)",
                  borderLeft: "4px solid #EF4444",
                  borderRadius: "0 8px 8px 0",
                  padding: "8px 12px",
                }}
              >
                <div style={{ fontSize: "12px", color: "#FCA5A5", fontStyle: "italic" }}>
                  "Kuesioner adopsi dari internet langsung saya sebar tanpa uji coba lapangan..."
                </div>
                <div style={{ fontSize: "12px", color: "#EF4444", fontWeight: 800, marginTop: "3px" }}>
                  💥 Dosen Penguji: "Siapa jamin butir pertanyaanmu dipahami perawat?! Ulangi penelitian!"
                </div>
              </div>
            </div>

            {/* Bad Practice Warnings */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["❌ Pertanyaan Bias / Ambigu", "❌ Butir Tidak Relevan", "❌ Nilai Validitas Fiktif"].map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#FCA5A5",
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    padding: "3px 10px",
                    borderRadius: "6px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ⚡ CENTER DIVIDER ──────────────────────────────── */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div style={{ height: "1px", flex: 1, background: "rgba(16, 185, 129, 0.3)" }} />
            <div
              style={{
                background: "linear-gradient(90deg, #059669 0%, #10B981 100%)",
                border: "1.5px solid #6EE7B7",
                borderRadius: "20px",
                padding: "4px 16px",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "1px",
                boxShadow: "0 0 14px rgba(16, 185, 129, 0.4)",
              }}
            >
              SOLUSI STANDAR AKADEMIK
            </div>
            <div style={{ height: "1px", flex: 1, background: "rgba(16, 185, 129, 0.3)" }} />
          </div>

          {/* ✅ BEST PRACTICE (Bawah, Hijau) */}
          <div
            style={{
              height: "330px",
              background: "linear-gradient(135deg, rgba(6, 38, 28, 0.94) 0%, rgba(3, 24, 18, 0.98) 100%)",
              borderRadius: "20px",
              border: "2px solid rgba(16, 185, 129, 0.75)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5), inset 0 0 20px rgba(16, 185, 129, 0.18)",
              padding: "18px 22px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box",
              transform: `scale(${bestBoxSpring})`,
              transformOrigin: "bottom center",
            }}
          >
            {/* Header Best Practice */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.22)",
                  border: "1.5px solid #10B981",
                  borderRadius: "20px",
                  padding: "4px 14px",
                  color: "#6EE7B7",
                  fontSize: "13px",
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>✅</span>
                <span>BEST PRACTICE: ALUR STANDAR METODOLOGI</span>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#34D399",
                  fontWeight: 800,
                  background: "rgba(0,0,0,0.3)",
                  padding: "3px 10px",
                  borderRadius: "6px",
                }}
              >
                DATA DIAKUI
              </span>
            </div>

            {/* Headline Best Practice */}
            <div>
              <div style={{ fontSize: "20px", fontWeight: 900, color: "#ECFDF5", lineHeight: 1.25 }}>
                Bikin Kuesioner ➔ Try Out ➔ Uji Validitas (r) & Cronbach Alpha ➔ Sebar
              </div>
            </div>

            {/* 3 Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                {
                  badge: "TRY OUT N=30",
                  text: "Uji coba kuesioner ke 30 responden sejenis di luar sampel utama riset.",
                },
                {
                  badge: "UJI VALIDITAS",
                  text: "Korelasikan butir soal (Pearson r). Gugurkan item jika r-hitung < r-tabel.",
                },
                {
                  badge: "CRONBACH ALPHA",
                  text: "Pastikan nilai Alpha >= 0.70 agar instrumen terbukti reliabel konsisten.",
                },
              ].map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "rgba(0,0,0,0.35)",
                    padding: "7px 12px",
                    borderRadius: "8px",
                    borderLeft: "3px solid #10B981",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 900,
                      background: "rgba(16, 185, 129, 0.25)",
                      color: "#34D399",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      border: "1px solid #10B981",
                      flexShrink: 0,
                    }}
                  >
                    {s.badge}
                  </span>
                  <span style={{ fontSize: "12px", color: "#D1FAE5", fontWeight: 600 }}>
                    {s.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ACTION CHECKLIST BOX (Y: 1010px - 1520px) ────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "1010px",
          left: "40px",
          right: "40px",
          height: "510px",
          zIndex: 35,
          transform: `scale(${checklistSpring})`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, rgba(20, 6, 12, 0.96) 0%, rgba(10, 3, 6, 0.98) 100%)",
            borderRadius: "26px",
            border: "2px solid rgba(244, 63, 94, 0.6)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.75), 0 0 30px rgba(244, 63, 94, 0.25), inset 0 0 25px rgba(244, 63, 94, 0.1)",
            padding: "22px 26px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            backdropFilter: "blur(12px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Header Row */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(244, 63, 94, 0.2)",
                border: "1px solid #F43F5E",
                borderRadius: "20px",
                padding: "4px 14px",
                marginBottom: "6px",
              }}
            >
              <span style={{ fontSize: "14px" }}>📋</span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 900,
                  color: "#FECDD3",
                  letterSpacing: "1px",
                }}
              >
                CHECKLIST AKSI MAHASISWA
              </span>
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "0.5px",
                lineHeight: 1.2,
              }}
            >
              2 Langkah Wajib Sebelum Ambil Data Lapangan:
            </div>
          </div>

          {/* Interactive Flow Graphic */}
          <QuestionnaireFlowGraphic frame={frame} />

          {/* Dual Action Checklist Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {/* Step 1 Card */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(40, 10, 18, 0.7) 0%, rgba(20, 5, 9, 0.9) 100%)",
                border: "1.5px solid rgba(244, 63, 94, 0.5)",
                borderRadius: "14px",
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "15px" }}>✅</span>
                <span style={{ fontSize: "13px", fontWeight: 900, color: "#FB7185" }}>
                  1. UJI VALIDITAS ISI & BUTIR
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#FFE4E6", fontWeight: 700, marginTop: "2px" }}>
                Rumus: r-hitung &gt; r-tabel (N=30, α=0.05)
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                Pastikan butir pertanyaan mengukur variabel dengan tepat. Butir tidak valid wajib dibuang.
              </div>
            </div>

            {/* Step 2 Card */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(8, 38, 28, 0.7) 0%, rgba(4, 20, 15, 0.9) 100%)",
                border: "1.5px solid rgba(16, 185, 129, 0.5)",
                borderRadius: "14px",
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "15px" }}>✅</span>
                <span style={{ fontSize: "13px", fontWeight: 900, color: "#34D399" }}>
                  2. UJI RELIABILITAS CRONBACH
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#ECFDF5", fontWeight: 700, marginTop: "2px" }}>
                Standar: Cronbach Alpha (α) &gt; 0.70
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                Instrumen stabil dan konsisten jika diuji berulang kali pada kelompok responden lain.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SAFE ZONE Y: 1600px - 1920px (DEDICATED FOR RUNNING CAPTION) ── */}
      <RunningCaption words={CAPS_S4} frame={frame} accentColor="#FB7185" top="1680px" />
    </AbsoluteFill>
  );
};

// ── PLACEHOLDER COMPONENTS FOR SCENE 5 ────────────────────────────────────────

// ── CAPTION WORDS — SCENE 5 ───────────────────────────────────────────────────
// Naskah: "Peta memilih uji statistik ada di komentar yang disematkan. Skripsimu kuantitatif atau kualitatif? Jawab satu kata. Mau metodologimu dicek? Cek bio."
// Audio duration: 11.68 detik (~351 frames) @ 30 FPS + 15 frames breathing room.
export const CAPS_S5: CaptionWord[] = [
  { word: "Peta", start: 19 },
  { word: "memilih", start: 29 },
  { word: "uji", start: 41 },
  { word: "statistik", start: 51 },
  { word: "ada", start: 65 },
  { word: "di", start: 75 },
  { word: "komentar", start: 85 },
  { word: "yang", start: 99 },
  { word: "disematkan.", start: 111 },
  { word: "Skripsimu", start: 139 },
  { word: "kuantitatif", start: 153 },
  { word: "atau", start: 173 },
  { word: "kualitatif?", start: 185 },
  { word: "Jawab", start: 213 },
  { word: "satu", start: 227 },
  { word: "kata.", start: 239 },
  { word: "Mau", start: 263 },
  { word: "metodologimu", start: 275 },
  { word: "dicek?", start: 299 },
  { word: "Cek", start: 323 },
  { word: "bio.", start: 335 },
];

// ── SCENE 5: DOUBLE INTERACTIVE CTA CARD ──────────────────────────────────────
export const Scene5_DoubleCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring with 15 frames breathing room consideration
  const enterSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Pulse & Shimmer for Gold Border and Buttons
  const pulse = Math.sin(frame * 0.12);
  const btnPulse1 = Math.sin(frame * 0.15);
  const btnPulse2 = Math.sin(frame * 0.15 + Math.PI);
  const bounceDown = Math.sin(frame * 0.2) * 5;

  const commentCardSpring = spring({ frame: frame - 15, fps, config: { damping: 13, stiffness: 130 } });
  const bioCtaSpring = spring({ frame: frame - 40, fps, config: { damping: 13, stiffness: 120 } });

  // Applause trigger active around frame 260+
  const isBioTriggerActive = frame >= 260;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* SFX: Transition whoosh at scene entrance (menggantikan audio_cta yang berisi suara vokal) */}
      <Sequence from={2} durationInFrames={35}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.65} />
      </Sequence>

      {/* SFX: Applause when Profile Link CTA activates (frame 260) */}
      <Sequence from={260} durationInFrames={110}>
        <Audio src={staticFile("audio/applause.mp3")} volume={0.65} />
      </Sequence>

      {/* Full Canvas Medical Background */}
      <MedicalBackground />

      {/* ── TOP HEADER CARD (Y: 100px - 220px) ─────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "40px",
          right: "40px",
          height: "120px",
          zIndex: 40,
          transform: `scale(${enterSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(135deg, rgba(30, 16, 55, 0.95) 0%, rgba(18, 8, 38, 0.95) 100%)",
            border: "2px solid rgba(139, 92, 246, 0.65)",
            borderRadius: "22px",
            padding: "16px 26px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.65), 0 0 25px rgba(139, 92, 246, 0.3)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div
              style={{
                alignSelf: "flex-start",
                background: "linear-gradient(90deg, #7C3AED 0%, #8B5CF6 100%)",
                border: "1.5px solid #DDD6FE",
                borderRadius: "30px",
                padding: "4px 14px",
                boxShadow: "0 0 12px rgba(139, 92, 246, 0.45)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#F5F3FF",
                  boxShadow: "0 0 6px #DDD6FE",
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 900,
                  color: "#FAF5FF",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                FREE RESOURCE • MAHASISWA ACC
              </span>
            </div>
            <div
              style={{
                fontSize: "27px",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "0.5px",
                lineHeight: 1.15,
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              PETA UJI STATISTIK SKRIPSI
            </div>
          </div>

          {/* Map / Compass Blueprint Icon */}
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
              border: "2px solid #DDD6FE",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 8px 20px rgba(139, 92, 246, 0.4)",
            }}
          >
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" stroke="#DDD6FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="8" y1="2" x2="8" y2="18" stroke="#DDD6FE" strokeWidth="2" />
              <line x1="16" y1="6" x2="16" y2="22" stroke="#DDD6FE" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" fill="#A78BFA" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── CARD 1: INTERACTIVE COMMENT TRIGGER CARD (Y: 250px - 850px) ── */}
      <div
        style={{
          position: "absolute",
          top: "250px",
          left: "40px",
          right: "40px",
          height: "600px",
          zIndex: 30,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, rgba(16, 12, 32, 0.95) 0%, rgba(8, 6, 20, 0.98) 100%)",
            borderRadius: "28px",
            border: "2px solid rgba(139, 92, 246, 0.45)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
            padding: "24px 26px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            transform: `scale(${commentCardSpring})`,
            transformOrigin: "center center",
            position: "relative",
          }}
        >
          {/* Pinned Badge Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                background: "rgba(139, 92, 246, 0.22)",
                border: "1.5px solid #8B5CF6",
                borderRadius: "20px",
                padding: "6px 16px",
                color: "#DDD6FE",
                fontSize: "13px",
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>📌</span>
              <span>PINNED COMMENT RESMI @JAGONELITI</span>
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#A78BFA",
                fontWeight: 800,
                background: "rgba(0,0,0,0.4)",
                padding: "4px 12px",
                borderRadius: "8px",
              }}
            >
              GRATIS 100%
            </span>
          </div>

          {/* Main Card Announcement */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(109, 40, 217, 0.3) 0%, rgba(76, 29, 149, 0.4) 100%)",
              border: "2px solid #8B5CF6",
              borderRadius: "18px",
              padding: "16px 20px",
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(109, 40, 217, 0.25)",
            }}
          >
            <div style={{ fontSize: "22px", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.3 }}>
              📌 CEK KOMENTAR TERSEMAT BUMPER PETA UJI STATISTIK
            </div>
            <div style={{ fontSize: "13px", color: "#C4B5FD", marginTop: "4px" }}>
              Download PDF Cheatsheet Alur Uji Hipotesis Medis 1 Halaman Siap Cetak
            </div>
          </div>

          {/* Quick Poll Interactive Box */}
          <div
            style={{
              background: "rgba(0,0,0,0.4)",
              border: "1.5px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "18px",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "16px", fontWeight: 900, color: "#EDE9FE" }}>
                POLL CEPAT: Skripsimu Masuk Kategori Yang Mana?
              </div>
              <div style={{ fontSize: "12px", color: "#94A3B8" }}>
                Ketik satu kata di kolom komentar sekarang:
              </div>
            </div>

            {/* 2 Poll Option Buttons with Pulse Glow */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {/* Option 1: KUANTITATIF */}
              <div
                style={{
                  background: "linear-gradient(135deg, #065F46 0%, #047857 100%)",
                  border: "2px solid #34D399",
                  borderRadius: "14px",
                  padding: "14px",
                  textAlign: "center",
                  boxShadow: `0 0 ${15 + 8 * btnPulse1}px rgba(16, 185, 129, 0.4)`,
                  transform: `scale(${1 + 0.02 * btnPulse1})`,
                }}
              >
                <div style={{ fontSize: "18px", fontWeight: 900, color: "#FFFFFF" }}>
                  📊 KUANTITATIF
                </div>
                <div style={{ fontSize: "11px", color: "#A7F3D0", marginTop: "2px" }}>
                  Data Angka &amp; Statistik
                </div>
              </div>

              {/* Option 2: KUALITATIF */}
              <div
                style={{
                  background: "linear-gradient(135deg, #7C2D12 0%, #9A3412 100%)",
                  border: "2px solid #FB923C",
                  borderRadius: "14px",
                  padding: "14px",
                  textAlign: "center",
                  boxShadow: `0 0 ${15 + 8 * btnPulse2}px rgba(249, 115, 22, 0.4)`,
                  transform: `scale(${1 + 0.02 * btnPulse2})`,
                }}
              >
                <div style={{ fontSize: "18px", fontWeight: 900, color: "#FFFFFF" }}>
                  📝 KUALITATIF
                </div>
                <div style={{ fontSize: "11px", color: "#FED7AA", marginTop: "2px" }}>
                  Wawancara &amp; Observasi
                </div>
              </div>
            </div>
          </div>

          {/* Teks Pendukung with Bouncing Down Arrow */}
          <div
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              transform: `translateY(${bounceDown}px)`,
            }}
          >
            <span style={{ fontSize: "20px" }}>👇</span>
            <span style={{ fontSize: "15px", fontWeight: 900, color: "#FDE68A", letterSpacing: "0.5px" }}>
              Jawab 1 kata di kolom komentar di bawah! 👇
            </span>
          </div>
        </div>
      </div>

      {/* ── CARD 2: PROFILE LINK CTA BOX (Y: 880px - 1520px) ────────────── */}
      <div
        style={{
          position: "absolute",
          top: "880px",
          left: "40px",
          right: "40px",
          height: "640px",
          zIndex: 35,
          transform: `scale(${bioCtaSpring})`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, rgba(20, 14, 4, 0.96) 0%, rgba(10, 7, 2, 0.98) 100%)",
            borderRadius: "28px",
            border: `2.5px solid ${isBioTriggerActive ? "#F59E0B" : "rgba(245, 158, 11, 0.6)"}`,
            boxShadow: `0 20px 50px rgba(0,0,0,0.75), 0 0 ${20 + 15 * pulse}px rgba(245, 158, 11, ${isBioTriggerActive ? 0.45 : 0.25}), inset 0 0 25px rgba(245, 158, 11, 0.15)`,
            padding: "26px 28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            backdropFilter: "blur(12px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Highlight Badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                background: "linear-gradient(90deg, #B45309 0%, #D97706 100%)",
                border: "1.5px solid #FCD34D",
                borderRadius: "20px",
                padding: "6px 16px",
                color: "#FFFBEB",
                fontSize: "13px",
                fontWeight: 900,
                letterSpacing: "1px",
                boxShadow: "0 0 14px rgba(245, 158, 11, 0.5)",
              }}
            >
              🎯 MENTORING 1-ON-1 SKRIPSI KESEHATAN
            </div>
            <div
              style={{
                background: "rgba(245, 158, 11, 0.18)",
                border: "1px solid #F59E0B",
                color: "#FDE68A",
                fontSize: "11px",
                fontWeight: 800,
                padding: "4px 10px",
                borderRadius: "6px",
              }}
            >
              SLOT TERBATAS
            </div>
          </div>

          {/* Heading */}
          <div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 1.2,
                textShadow: "0 2px 10px rgba(0,0,0,0.6)",
              }}
            >
              MAU METODOLOGIMU DICEK LANGSUNG OLEH AHLI?
            </div>
            <div style={{ fontSize: "14px", color: "#FDE68A", marginTop: "6px" }}>
              Jangan tunggu disemprot penguji saat Sempro. Bedah tuntas metodologimu sekarang:
            </div>
          </div>

          {/* 3 Pillars of Consultation */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              {
                icon: "🩺",
                title: "Cek Keselarasan Judul, Masalah & Desain Riset",
                desc: "Pastikan korelasi atau komparasi memiliki dasar teori yang kokoh.",
              },
              {
                icon: "📐",
                title: "Hitung Besar Sampel (Slovin vs Lemeshow)",
                desc: "Hitungan presisi rumus dan kriteria inklusi/eksklusi anti-gugur.",
              },
              {
                icon: "📊",
                title: "Bedah Instrumen & Peta Uji SPSS / PLS",
                desc: "Uji coba validitas, reliabilitas, hingga normalitas data lengkap.",
              },
            ].map((col, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "rgba(0,0,0,0.4)",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  borderLeft: "3.5px solid #F59E0B",
                }}
              >
                <span style={{ fontSize: "20px" }}>{col.icon}</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#FEF3C7" }}>
                    {col.title}
                  </div>
                  <div style={{ fontSize: "11px", color: "#FCD34D", opacity: 0.85 }}>
                    {col.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Action Banner Button (Efek Shimmering Gold Border) */}
          <div
            style={{
              background: "linear-gradient(90deg, #D97706 0%, #B45309 50%, #D97706 100%)",
              border: "2px solid #FEF3C7",
              borderRadius: "18px",
              padding: "16px 20px",
              textAlign: "center",
              boxShadow: `0 8px 30px rgba(245, 158, 11, ${0.4 + 0.2 * pulse}), 0 0 20px rgba(254, 243, 199, 0.4)`,
              transform: `scale(${1 + 0.015 * pulse})`,
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "0.5px",
                lineHeight: 1.25,
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              👉 KLIK LINK DI BIO UNTUK KONSULTASI METODE
            </div>
            <div style={{ fontSize: "12px", color: "#FEF3C7", fontWeight: 700, marginTop: "2px" }}>
              Bimbingan Privat Sampai Proposal &amp; Skripsi Siap Ujian ACC
            </div>
          </div>
        </div>
      </div>

      {/* ── SAFE ZONE Y: 1600px - 1920px (DEDICATED FOR RUNNING CAPTION) ── */}
      <RunningCaption words={CAPS_S5} frame={frame} accentColor="#A78BFA" top="1680px" />
    </AbsoluteFill>
  );
};

// ── SCENE DURATIONS ───────────────────────────────────────────────────────────
export const SCENE_DURATIONS = {
  s1: 210, // ~7.0 detik (Audio VO 6.36 detik / 191 frames + 19 frames hold)
  s2: 285, // ~9.5 detik
  s3: 320, // ~10.6 detik (Audio VO 9.6 detik / 288 frames + 15 frames breathing room + 17 frames hold)
  s4: 330, // ~11.0 detik (Audio VO 9.96 detik / 299 frames + 15 frames breathing room + 16 frames hold)
  s5: 380, // ~12.6 detik (Audio VO 11.68 detik / 351 frames + 15 frames breathing room + 14 frames hold)
};

// ── MAIN COMPONENT EXPORT ─────────────────────────────────────────────────────
export const InteractiveScene10: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#02120E" }}>
      {/* SCENE 1: HOOK */}
      <Sequence from={0} durationInFrames={SCENE_DURATIONS.s1}>
        <Audio src={staticFile("audio/vo-metode-s1.wav")} />
        <Scene1_Hook />
      </Sequence>

      {/* SCENE 2: RUMUS & KRITERIA SAMPEL */}
      <Sequence from={SCENE_DURATIONS.s1} durationInFrames={SCENE_DURATIONS.s2}>
        <Audio src={staticFile("audio/vo-metode-s2.wav")} />
        <Scene2_RumusSampel />
      </Sequence>

      {/* SCENE 3: PILIH UJI STATISTIK TEPAT */}
      <Sequence
        from={SCENE_DURATIONS.s1 + SCENE_DURATIONS.s2}
        durationInFrames={SCENE_DURATIONS.s3}
      >
        {/* Jeda transisi / breathing room 15 frames sebelum audio & ucapan VO dimulai */}
        <Sequence from={15}>
          <Audio src={staticFile("audio/vo-metode-s3.wav")} />
        </Sequence>
        <Scene3_UjiStatistik />
      </Sequence>

      {/* SCENE 4: UJI VALIDITAS & RELIABILITAS */}
      <Sequence
        from={SCENE_DURATIONS.s1 + SCENE_DURATIONS.s2 + SCENE_DURATIONS.s3}
        durationInFrames={SCENE_DURATIONS.s4}
      >
        {/* Jeda transisi / breathing room 15 frames sebelum audio & ucapan VO dimulai */}
        <Sequence from={15}>
          <Audio src={staticFile("audio/vo-metode-s4.wav")} />
        </Sequence>
        <Scene4_InstrumenValiditas />
      </Sequence>

      {/* SCENE 5: DOUBLE CTA & PENUTUP */}
      <Sequence
        from={
          SCENE_DURATIONS.s1 +
          SCENE_DURATIONS.s2 +
          SCENE_DURATIONS.s3 +
          SCENE_DURATIONS.s4
        }
        durationInFrames={SCENE_DURATIONS.s5}
      >
        {/* Jeda transisi / breathing room 15 frames sebelum audio & ucapan VO dimulai */}
        <Sequence from={15}>
          <Audio src={staticFile("audio/vo-metode-s5.wav")} />
        </Sequence>
        <Scene5_DoubleCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
