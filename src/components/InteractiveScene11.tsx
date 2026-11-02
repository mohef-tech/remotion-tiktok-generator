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

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

// ── SCENE DURATIONS (V11) ─────────────────────────────────────────────────────
export const SCENE_DURATIONS_V11 = {
  s1: 210, // 7.0 detik @ 30 FPS (termasuk >60 frames hold pause)
  s2: 300, // 10.0 detik @ 30 FPS (termasuk >60 frames hold pause)
  s3: 300, // 10.0 detik @ 30 FPS (termasuk >60 frames hold pause)
  s4: 300, // 10.0 detik @ 30 FPS (termasuk >60 frames hold pause)
  s5: 300, // 10.0 detik @ 30 FPS (Double CTA & Freebie Trigger)
};

// ── WORD-BY-WORD KINETIC REVEAL WITH SCALE BOUNCE ─────────────────────────────
const KineticWordLine: React.FC<{
  words: {
    text: string;
    color?: string;
    bg?: string;
    underline?: boolean;
  }[];
  startFrame: number;
  interval?: number;
  fontSize?: number;
  gap?: number;
}> = ({
  words,
  startFrame,
  interval = 8,
  fontSize = 52,
  gap = 14,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: `${gap}px`,
      }}
    >
      {words.map((w, idx) => {
        const wStart = startFrame + idx * interval;
        const bounce = spring({
          frame: frame - wStart,
          fps,
          config: { damping: 9, stiffness: 210, mass: 0.75 },
        });
        const visible = frame >= wStart;
        const isJustPopped = frame >= wStart && frame <= wStart + interval + 4;
        const scale = visible
          ? interpolate(bounce, [0, 1], [0.25, 1]) *
            (isJustPopped ? 1.07 : 1)
          : 0;
        const opacity = clamp(
          interpolate(frame, [wStart, wStart + 4], [0, 1]),
          0,
          1
        );

        return (
          <span
            key={idx}
            style={{
              display: "inline-block",
              transform: `scale(${scale}) translateY(${interpolate(
                bounce,
                [0, 1],
                [18, 0]
              )}px)`,
              opacity,
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: `${fontSize}px`,
              fontWeight: 900,
              color: w.color || "#FFFFFF",
              backgroundColor: w.bg || "transparent",
              padding: w.bg ? "4px 18px" : "0 2px",
              borderRadius: w.bg ? "12px" : "0",
              textDecoration: w.underline ? "underline" : "none",
              letterSpacing: "1.5px",
              lineHeight: 1.15,
              boxShadow: w.bg
                ? `0 8px 24px ${w.bg}88`
                : isJustPopped
                ? "0 0 22px rgba(250, 204, 21, 0.55)"
                : "none",
              textShadow: isJustPopped
                ? "0 0 18px rgba(250, 204, 21, 0.75)"
                : "0 4px 12px rgba(0, 0, 0, 0.65)",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

// ── DARK SLATE CANVAS BACKGROUND (#0F172A) ────────────────────────────────────
const DarkSlateBackground: React.FC = () => (
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
      <linearGradient id="v11SlateBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#090F1D" />
        <stop offset="35%" stopColor="#0F172A" />
        <stop offset="75%" stopColor="#131D35" />
        <stop offset="100%" stopColor="#070B14" />
      </linearGradient>

      <radialGradient id="v11YellowGlow" cx="50%" cy="12%" r="40%">
        <stop offset="0%" stopColor="#FACC15" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
      </radialGradient>

      <radialGradient id="v11CrimsonGlow" cx="50%" cy="46%" r="42%">
        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect width="1080" height="1920" fill="url(#v11SlateBg)" />
    <rect width="1080" height="1920" fill="url(#v11YellowGlow)" />
    <rect width="1080" height="1920" fill="url(#v11CrimsonGlow)" />

    {/* Bottom Area Backdrop (Y: 1600 - 1920) */}
    <rect
      x="0"
      y="1600"
      width="1080"
      height="320"
      fill="#070B14"
      opacity="0.55"
    />
  </svg>
);

// ── SCENE 1: THE NIGHTMARE HOOK (210 FRAMES / 7 DETIK) ────────────────────────
export const Scene1_NightmareHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance animations
  const badgeSpring = spring({
    frame: frame - 2,
    fps,
    config: { damping: 13, stiffness: 160 },
  });

  const laptopSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.9 },
  });

  // Onomatopoeia Badge: "TUNGGU! ✋" pops in at frame 10
  const tungguSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 9, stiffness: 200, mass: 0.8 },
  });
  const tungguWiggle = Math.sin(frame * 0.25) * 4;

  // Trigger "SLIDE TEKS TEMBOK" alert + Red Cross + Screen Shake at frame 42
  const alertFrame = 42;
  const crossProgress = clamp(
    interpolate(frame, [alertFrame, alertFrame + 18], [0, 1]),
    0,
    1
  );

  const stampSpring = spring({
    frame: frame - (alertFrame + 10),
    fps,
    config: { damping: 9, stiffness: 210, mass: 0.85 },
  });
  const stampVisible = frame >= alertFrame + 10;
  const stampScale =
    interpolate(stampSpring, [0, 1], [2.4, 1]) *
    (1 + 0.025 * Math.sin(frame * 0.18));
  const stampOpacity = clamp(interpolate(stampSpring, [0, 0.35], [0, 1]), 0, 1);

  // Screen shake synced with error_buzz.mp3 at alertFrame (frame 42..64)
  const isShaking = frame >= alertFrame && frame <= alertFrame + 22;
  const shakeX = isShaking
    ? Math.sin((frame - alertFrame) * 2.8) *
      interpolate(frame, [alertFrame, alertFrame + 22], [14, 0])
    : 0;
  const shakeY = isShaking
    ? Math.cos((frame - alertFrame) * 3.4) *
      interpolate(frame, [alertFrame, alertFrame + 22], [8, 0])
    : 0;

  // Continuous lifelike floating motion during Hold Pause (Frame 130 - 210)
  const floatY = Math.sin(frame * 0.12) * 6;
  const neonPulse = 0.5 + 0.5 * Math.sin(frame * 0.2);

  // Progress Bar Timer Visual (0 -> 100% across 210 frames)
  const progressRatio = clamp(frame / (durationInFrames - 1), 0, 1);
  const remainingSec = Math.max(0, (durationInFrames - frame) / fps).toFixed(1);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0F172A", overflow: "hidden" }}>
      {/* ── CONTINUOUS MULTI-LAYERED SFX (ZERO DEAD SILENCE) ──────────────── */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.75} />
      </Sequence>

      {/* Pop for "TUNGGU! ✋" Onomatopoeia badge */}
      <Sequence from={10} durationInFrames={25}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.8} />
      </Sequence>

      {/* Ambient rapid typing while wall-of-text & kinetic words appear */}
      <Sequence from={16} durationInFrames={115}>
        <Audio src={staticFile("audio/typing2.mp3")} volume={0.35} />
      </Sequence>

      {/* Error Buzz synced directly with Slide Teks Tembok Shake & Cross-out */}
      <Sequence from={alertFrame} durationInFrames={55}>
        <Audio src={staticFile("audio/error_buzz.mp3")} volume={0.9} />
      </Sequence>

      {/* Impact sound when "AUTO DOSEN NGANTUK!" stamp hits */}
      <Sequence from={alertFrame + 10} durationInFrames={40}>
        <Audio src={staticFile("audio/error.mp3")} volume={0.8} />
      </Sequence>

      {/* Pop accents synced with kinetic word-by-word headline reveals */}
      <Sequence from={70} durationInFrames={25}>
        <Audio src={staticFile("audio/mouse_click.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={94} durationInFrames={25}>
        <Audio src={staticFile("audio/mouse_click.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={118} durationInFrames={25}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.7} />
      </Sequence>

      {/* Hold Pause emphasis chime so viewer reads the completed board */}
      <Sequence from={142} durationInFrames={55}>
        <Audio src={staticFile("audio/bell_ding.mp3")} volume={0.55} />
      </Sequence>

      <DarkSlateBackground />

      {/* ── 1. TOP BADGE (Y: 120px) ────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 40,
          transform: `scale(${badgeSpring})`,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.92)",
            border: "2.5px solid #FACC15",
            borderRadius: "999px",
            padding: "16px 38px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: `0 0 ${22 + neonPulse * 14}px rgba(250, 204, 21, 0.45), inset 0 0 14px rgba(250, 204, 21, 0.18)`,
          }}
        >
          <span
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "#FACC15",
              boxShadow: "0 0 12px #FACC15",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "26px",
              fontWeight: 900,
              color: "#FACC15",
              letterSpacing: "3px",
              textTransform: "uppercase",
              textShadow: "0 0 12px rgba(250, 204, 21, 0.4)",
            }}
          >
            TIPS SIDANG SKRIPSI 2026
          </span>
        </div>
      </div>

      {/* ── ONOMATOPOEIA GLOW BADGE: "TUNGGU! ✋" ──────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "225px",
          right: "64px",
          zIndex: 55,
          transform: `scale(${tungguSpring}) rotate(${8 + tungguWiggle}deg)`,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #FACC15 0%, #EAB308 100%)",
            border: "3px solid #FEF08A",
            borderRadius: "20px",
            padding: "10px 24px",
            boxShadow: `0 12px 30px rgba(0,0,0,0.65), 0 0 ${
              22 + neonPulse * 16
            }px rgba(250, 204, 21, 0.85)`,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontFamily: "Impact, 'Arial Black', sans-serif",
              fontSize: "30px",
              fontWeight: 900,
              color: "#0F172A",
              letterSpacing: "2px",
            }}
          >
            TUNGGU! ✋
          </span>
        </div>
      </div>

      {/* ── 2. MAIN VISUAL (Y: 300px - 1100px): MOCKUP LAPTOP PPT JADUL ─────── */}
      <div
        style={{
          position: "absolute",
          top: "300px",
          left: "44px",
          right: "44px",
          height: "800px",
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${shakeX}px, ${
            shakeY + floatY
          }px) scale(${laptopSpring})`,
        }}
      >
        {/* Top Floating Alert Tag: SLIDE TEKS TEMBOK */}
        <div
          style={{
            marginBottom: "18px",
            background: frame >= alertFrame ? "#EF4444" : "#1E293B",
            border: `2px solid ${frame >= alertFrame ? "#FCA5A5" : "#FACC15"}`,
            borderRadius: "12px",
            padding: "8px 24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow:
              frame >= alertFrame
                ? "0 8px 25px rgba(239, 68, 68, 0.5)"
                : "0 6px 20px rgba(0, 0, 0, 0.4)",
          }}
        >
          <span style={{ fontSize: "22px" }}>⚠️</span>
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "21px",
              fontWeight: 900,
              color: frame >= alertFrame ? "#FFFFFF" : "#FACC15",
              letterSpacing: "2px",
            }}
          >
            CONTOH: SLIDE TEKS TEMBOK (COPY-PASTE BAB 1-3)
          </span>
        </div>

        {/* Old-School Thick Laptop Screen Frame */}
        <div
          style={{
            width: "960px",
            height: "650px",
            background: "linear-gradient(180deg, #334155 0%, #1E293B 100%)",
            borderRadius: "24px 24px 8px 8px",
            padding: "24px 24px 32px 24px",
            border: `3px solid ${
              frame >= alertFrame ? "#EF4444" : "#475569"
            }`,
            boxShadow:
              frame >= alertFrame
                ? "0 24px 60px rgba(0,0,0,0.85), 0 0 40px rgba(239, 68, 68, 0.35)"
                : "0 24px 60px rgba(0,0,0,0.85)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Webcam dot on thick bezel */}
          <div
            style={{
              position: "absolute",
              top: "9px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#0F172A",
              border: "1px solid #64748B",
            }}
          />

          {/* Retro PowerPoint 2003/2007 Application Window */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#CBD5E1",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              border: "2px solid #0F172A",
              position: "relative",
            }}
          >
            {/* Retro Window Title Bar */}
            <div
              style={{
                height: "38px",
                background:
                  "linear-gradient(90deg, #1E3A8A 0%, #3B82F6 50%, #1D4ED8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 14px",
                color: "#FFFFFF",
                fontFamily: "Tahoma, sans-serif",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    background: "#EF4444",
                    color: "#FFF",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    fontSize: "12px",
                    fontWeight: 900,
                  }}
                >
                  P
                </span>
                <span>
                  Presentasi_Sidang_Skripsi_FINAL_FIX_BANGET_v9.ppt - PowerPoint
                </span>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                {["_", "□", "✕"].map((btn, i) => (
                  <div
                    key={i}
                    style={{
                      width: "22px",
                      height: "22px",
                      background: i === 2 ? "#DC2626" : "#E2E8F0",
                      color: i === 2 ? "#FFF" : "#0F172A",
                      border: "1px solid #475569",
                      borderRadius: "3px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 900,
                    }}
                  >
                    {btn}
                  </div>
                ))}
              </div>
            </div>

            {/* Retro Toolbar */}
            <div
              style={{
                height: "28px",
                backgroundColor: "#E2E8F0",
                borderBottom: "1px solid #94A3B8",
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                gap: "16px",
                fontFamily: "Tahoma, sans-serif",
                fontSize: "12px",
                color: "#334155",
                fontWeight: 700,
              }}
            >
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Insert</span>
              <span>Slide Show</span>
              <span
                style={{
                  marginLeft: "auto",
                  color: "#DC2626",
                  fontWeight: 800,
                }}
              >
                Font: Times New Roman (9pt) • 648 Kata di 1 Slide!
              </span>
            </div>

            {/* PPT Workspace: Left Thumbnail Pane + Main Wall-of-Text Slide */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              {/* Left Slide Thumbnails */}
              <div
                style={{
                  width: "125px",
                  backgroundColor: "#94A3B8",
                  borderRight: "2px solid #64748B",
                  padding: "10px 8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <div
                    key={num}
                    style={{
                      height: "68px",
                      backgroundColor: "#FFFFFF",
                      border:
                        num === 2 ? "3px solid #EF4444" : "1px solid #475569",
                      borderRadius: "4px",
                      padding: "4px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 900,
                        color: "#0F172A",
                      }}
                    >
                      Slide {num}
                    </div>
                    {[...Array(5)].map((_, idx) => (
                      <div
                        key={idx}
                        style={{
                          height: "4px",
                          backgroundColor: "#64748B",
                          width: `${95 - idx * 8}%`,
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Main Slide Canvas: Cramped Wall of Text */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#FEFCE8",
                  margin: "12px",
                  border: "2px solid #64748B",
                  boxShadow: "inset 0 0 0 4px #E2E8F0",
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Cramped Slide Title */}
                <div
                  style={{
                    backgroundColor: "#1E3A8A",
                    color: "#FFFFFF",
                    padding: "6px 12px",
                    fontFamily: "'Times New Roman', serif",
                    fontSize: "19px",
                    fontWeight: 800,
                    textAlign: "center",
                    letterSpacing: "0.3px",
                  }}
                >
                  BAB I: LATAR BELAKANG, RUMUSAN MASALAH, TUJUAN &amp; MANFAAT
                  PENELITIAN LENGKAP
                </div>

                {/* Wall of Text Paragraphs */}
                {[
                  "1.1 Berdasarkan pengamatan pendahuluan yang telah dilakukan oleh peneliti sejak bulan Januari hingga Maret pada objek penelitian, ditemukan bahwa perkembangan teknologi informasi dan komunikasi memberikan dampak signifikan terhadap seluruh aspek operasional instansi secara menyeluruh dan berkesinambungan tanpa terkecuali pada setiap divisi kerja.",
                  "1.2 Menurut teori yang dikemukakan oleh Para Ahli (2018, 2019, 2020, 2021) dalam buku teks halaman 142 sampai dengan 319 menyebutkan bahwa definisi variabel independen merupakan faktor determinan utama yang secara simultan maupun parsial memengaruhi variabel dependen melalui variabel intervening yang sangat kompleks.",
                  "1.3 Adapun rumusan masalah dalam penelitian skripsi ini adalah: (a) Bagaimana pengaruh variabel X1 terhadap Y secara parsial? (b) Bagaimana pengaruh variabel X2 terhadap Y secara parsial? (c) Bagaimana pengaruh variabel X3 terhadap Y? (d) Bagaimana pengaruh X1, X2, dan X3 secara simultan terhadap variabel Y melalui variabel Z?",
                  "1.4 Seluruh paragraf dari dokumen Word Bab 1 sampai Bab 3 langsung di-copy paste mentah-mentah ke dalam satu halaman slide PowerPoint ini tanpa diringkas sedikit pun sehingga ukuran huruf menjadi sangat kecil, rapat, penuh sesak seperti koran, dan mahasiswa hanya membaca teks membelakangi dosen penguji.",
                  "1.5 Akibatnya dosen pembimbing dan dosen penguji langsung mengantuk, bosan melihat tembok tulisan ini, lalu langsung memotong presentasi di menit ke-2 dan membombardir mahasiswa dengan puluhan pertanyaan sidang yang mematikan!",
                ].map((paragraph, pIdx) => (
                  <div
                    key={pIdx}
                    style={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13.2px",
                      lineHeight: 1.26,
                      color: "#0F172A",
                      textAlign: "justify",
                      backgroundColor:
                        pIdx % 2 === 1
                          ? "rgba(239, 68, 68, 0.08)"
                          : "transparent",
                      padding: "3px 6px",
                      borderLeft: "3px solid #94A3B8",
                    }}
                  >
                    {paragraph}
                  </div>
                ))}

                {/* ── ANIMATED GIANT RED CROSS-OUT (CORETAN SILANG MERAH BESAR) ── */}
                {frame >= alertFrame && (
                  <svg
                    viewBox="0 0 760 500"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                      zIndex: 10,
                    }}
                  >
                    <rect
                      width="760"
                      height="500"
                      fill="#EF4444"
                      opacity={0.18 * crossProgress}
                    />
                    <line
                      x1="35"
                      y1="30"
                      x2={35 + 690 * clamp(crossProgress * 1.6, 0, 1)}
                      y2={30 + 440 * clamp(crossProgress * 1.6, 0, 1)}
                      stroke="#EF4444"
                      strokeWidth="22"
                      strokeLinecap="round"
                      style={{
                        filter: "drop-shadow(0 4px 14px rgba(239, 68, 68, 0.8))",
                      }}
                    />
                    {crossProgress > 0.35 && (
                      <line
                        x1="725"
                        y1="30"
                        x2={
                          725 -
                          690 * clamp((crossProgress - 0.35) * 1.55, 0, 1)
                        }
                        y2={
                          30 +
                          440 * clamp((crossProgress - 0.35) * 1.55, 0, 1)
                        }
                        stroke="#EF4444"
                        strokeWidth="22"
                        strokeLinecap="round"
                        style={{
                          filter:
                            "drop-shadow(0 4px 14px rgba(239, 68, 68, 0.8))",
                        }}
                      />
                    )}
                  </svg>
                )}

                {/* ── POP-IN SCALE STAMP: "AUTO DOSEN NGANTUK" ──────────────── */}
                {stampVisible && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: `translate(-50%, -50%) scale(${stampScale}) rotate(-10deg)`,
                      opacity: stampOpacity,
                      zIndex: 25,
                      pointerEvents: "none",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "rgba(15, 23, 42, 0.96)",
                        border: "7px double #EF4444",
                        borderRadius: "20px",
                        padding: "18px 34px",
                        boxShadow:
                          "0 20px 50px rgba(0,0,0,0.85), 0 0 40px rgba(239, 68, 68, 0.75)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          backgroundColor: "#EF4444",
                          color: "#FFFFFF",
                          padding: "4px 18px",
                          borderRadius: "8px",
                          fontSize: "17px",
                          fontWeight: 900,
                          letterSpacing: "3px",
                          fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                      >
                        <span>🚫 FATAL ERROR SIDANG</span>
                      </div>

                      <div
                        style={{
                          fontFamily: "Impact, 'Arial Black', sans-serif",
                          fontSize: "52px",
                          fontWeight: 900,
                          color: "#FACC15",
                          letterSpacing: "3px",
                          lineHeight: 1.05,
                          textAlign: "center",
                          textShadow: "0 4px 12px rgba(0,0,0,0.8)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        AUTO DOSEN NGANTUK! 😴
                      </div>

                      <div
                        style={{
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          fontSize: "16px",
                          fontWeight: 800,
                          color: "#FCA5A5",
                          letterSpacing: "1.5px",
                        }}
                      >
                        SLIDE PRESENTASI BUKAN KORAN / DOKUMEN WORD!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Laptop Base / Hinge Chin */}
        <div
          style={{
            width: "1000px",
            height: "30px",
            background: "linear-gradient(180deg, #64748B 0%, #334155 100%)",
            borderRadius: "0 0 22px 22px",
            border: "2px solid #475569",
            boxShadow: "0 16px 35px rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "8px",
              backgroundColor: "#1E293B",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>

      {/* ── 3. BOTTOM KINETIC HEADLINE (Y: 1180px - 1520px) ───────────────── */}
      <div
        style={{
          position: "absolute",
          top: "1180px",
          left: "44px",
          right: "44px",
          height: "340px",
          zIndex: 35,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            background:
              "linear-gradient(180deg, rgba(30, 41, 59, 0.96) 0%, rgba(15, 23, 42, 0.99) 100%)",
            border: "3px solid #334155",
            borderRadius: "28px",
            padding: "26px 30px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.75)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            boxSizing: "border-box",
          }}
        >
          {/* Word-by-Word Reveal Line 1: "3 DOSA BESAR" (Interval 8 frames) */}
          <KineticWordLine
            startFrame={62}
            interval={8}
            fontSize={52}
            words={[
              { text: "3", color: "#FFFFFF", bg: "#EF4444" },
              { text: "DOSA", color: "#FFFFFF", bg: "#EF4444" },
              { text: "BESAR", color: "#FFFFFF", bg: "#EF4444" },
            ]}
          />

          {/* Word-by-Word Reveal Line 2: "SLIDE SIDANG SKRIPSI" (Interval 8 frames) */}
          <KineticWordLine
            startFrame={86}
            interval={8}
            fontSize={52}
            words={[
              { text: "SLIDE", color: "#FACC15" },
              { text: "SIDANG", color: "#FACC15" },
              { text: "SKRIPSI", color: "#FFFFFF" },
            ]}
          />

          {/* Word-by-Word Sub-teks (Interval 6 frames, finishes @ frame 146 -> >64 frames hold!) */}
          <div
            style={{
              marginTop: "6px",
              backgroundColor: "rgba(15, 23, 42, 0.92)",
              border: "1.5px solid rgba(250, 204, 21, 0.45)",
              borderRadius: "14px",
              padding: "12px 24px",
            }}
          >
            <KineticWordLine
              startFrame={110}
              interval={6}
              fontSize={26}
              gap={10}
              words={[
                { text: "Bikin", color: "#F8FAFC" },
                { text: "Dospem", color: "#FACC15" },
                { text: "Cepat", color: "#F8FAFC" },
                { text: "Bosen", color: "#F8FAFC" },
                { text: "&", color: "#94A3B8" },
                { text: "Bikin", color: "#EF4444", underline: true },
                { text: "Ujian", color: "#EF4444", underline: true },
                { text: "Lama!", color: "#EF4444", underline: true },
              ]}
            />
          </div>
        </div>
      </div>

      {/* ── 4. BOTTOM AREA (Y: 1600px - 1920px): PROGRESS BAR TIMER VISUAL ── */}
      <div
        style={{
          position: "absolute",
          top: "1600px",
          left: "56px",
          right: "56px",
          height: "320px",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "18px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.94)",
            border: "2px solid #334155",
            borderRadius: "22px",
            padding: "24px 30px",
            boxShadow: "0 14px 35px rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#EF4444",
                  boxShadow: "0 0 10px #EF4444",
                }}
              />
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  color: "#F8FAFC",
                  letterSpacing: "1.5px",
                }}
              >
                SCENE 01 • THE NIGHTMARE HOOK
              </span>
            </div>

            <span
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "#FACC15",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ⏱ {remainingSec}s
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "22px",
              backgroundColor: "#1E293B",
              borderRadius: "999px",
              overflow: "hidden",
              border: "1.5px solid #475569",
              padding: "3px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: `${progressRatio * 100}%`,
                height: "100%",
                borderRadius: "999px",
                background:
                  "linear-gradient(90deg, #FACC15 0%, #EF4444 100%)",
                boxShadow: "0 0 16px rgba(250, 204, 21, 0.6)",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "15px",
              fontWeight: 800,
              color: "#94A3B8",
              letterSpacing: "1px",
            }}
          >
            <span style={{ color: "#FACC15" }}>▶ HOOK MASALAH</span>
            <span>DOSA #1</span>
            <span>DOSA #2</span>
            <span>DOSA #3</span>
            <span>SOLUSI</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── SCENE 2: DOSA #1 & SOLUSI DIAGRAM (300 FRAMES / 10 DETIK) ─────────────────
export const Scene2_Dosa1Diagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 15-frame transition breathing room at scene start
  const enterOpacity = clamp(interpolate(frame, [0, 15], [0, 1]), 0, 1);
  const enterSlideY = interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 140 } }),
    [0, 1],
    [45, 0]
  );

  // Header Badge Spring
  const badgeSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 13, stiffness: 160 },
  });

  // ── PHASE 1 (Frame 0 - 80): Bad Practice "Teks Tembok" + Glitch & Shake ──
  const badEnterSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 150 },
  });

  // Shrink / collapse out between frame 68 and 84
  const badCollapse = clamp(interpolate(frame, [68, 84], [1, 0]), 0, 1);
  const badScale = badEnterSpring * badCollapse;
  const badRotate = interpolate(frame, [68, 84], [0, -12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glitch & Shake physics between frame 18 and 68 (synced with error_buzz.mp3 & error.mp3)
  const isGlitching = frame >= 18 && frame <= 68;
  const shakeX = isGlitching
    ? Math.sin(frame * 2.8) * 15 * Math.cos(frame * 1.3)
    : 0;
  const shakeY = isGlitching ? Math.cos(frame * 3.4) * 8 : 0;
  const glitchSkew = isGlitching ? Math.sin(frame * 4.2) * 4.5 : 0;
  const rgbOffset = isGlitching ? Math.sin(frame * 3.1) * 9 : 0;

  // ── PHASE 2 (Frame 76 - 300): 3-Node Flowchart Diagram + Hold Pause ──
  const containerSpring = spring({
    frame: frame - 76,
    fps,
    config: { damping: 14, stiffness: 135, mass: 0.9 },
  });
  const phase2Visible = frame >= 74;

  // Onomatopoeia Badge: "UBAH JADI INI! 👇" pops in at frame 78
  const ubahBadgeSpring = spring({
    frame: frame - 78,
    fps,
    config: { damping: 9, stiffness: 200, mass: 0.8 },
  });
  const ubahFloatY = Math.sin(frame * 0.25) * 6;

  // Staggered Node Springs (synced with pop.mp3 at 92, 126, 160)
  const node1Frame = 92;
  const node2Frame = 126;
  const node3Frame = 160;

  const node1Spring = spring({
    frame: frame - node1Frame,
    fps,
    config: { damping: 12, stiffness: 170 },
  });
  const node2Spring = spring({
    frame: frame - node2Frame,
    fps,
    config: { damping: 12, stiffness: 170 },
  });
  const node3Spring = spring({
    frame: frame - node3Frame,
    fps,
    config: { damping: 12, stiffness: 170 },
  });

  // Sequential SVG Connector Path animations (Node 1 -> Node 2 -> Node 3)
  const conn1Progress = clamp(
    interpolate(frame, [node1Frame + 12, node2Frame + 2], [0, 1]),
    0,
    1
  );
  const conn2Progress = clamp(
    interpolate(frame, [node2Frame + 12, node3Frame + 2], [0, 1]),
    0,
    1
  );

  // Continuous lifelike motion during Hold Pause (Frame 220 - 300 = 80 frames / 2.67s hold!)
  const pulseWave = 0.5 + 0.5 * Math.sin(frame * 0.22);
  const shimmerAngle = (frame * 4) % 360;
  const cardBreathY = Math.sin(frame * 0.12) * 5;

  // Sub-headline card entrance (Y: 1300px - 1520px)
  const subCardSpring = spring({
    frame: frame - 84,
    fps,
    config: { damping: 13, stiffness: 150 },
  });

  // Progress Bar Timer Visual (0 -> 100% across 300 frames)
  const progressRatio = clamp(frame / (durationInFrames - 1), 0, 1);
  const remainingSec = Math.max(0, (durationInFrames - frame) / fps).toFixed(1);

  const flowNodes = [
    {
      num: "01",
      tag: "[ MASALAH & GAP ]",
      title: "Fenomena & Urgensi Riset",
      desc: "1 kalimat masalah utama + data gap lapangan (bukan 4 paragraf sejarah).",
      accent: "#10B981",
      border: "#34D399",
      icon: "🎯",
      springVal: node1Spring,
    },
    {
      num: "02",
      tag: "[ METODE UTAMA ]",
      title: "Alur Desain & Uji Analisis",
      desc: "Bagan ringkas: Sampel (N) → Instrumen → Metode Uji / Algoritma.",
      accent: "#06B6D4",
      border: "#22D3EE",
      icon: "⚙️",
      springVal: node2Spring,
    },
    {
      num: "03",
      tag: "[ TEMUAN KUNCI ]",
      title: "Hasil Inti & Bukti Angka",
      desc: "Highlight grafik/tabel utama + kesimpulan langsung menjawab rumusan.",
      accent: "#10B981",
      border: "#22D3EE",
      icon: "🚀",
      springVal: node3Spring,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        overflow: "hidden",
        opacity: enterOpacity,
        transform: `translateY(${enterSlideY}px)`,
      }}
    >
      {/* ── HIGH-COMPLEXITY SFX SYNC (ZERO DEAD SILENCE) ─────────────────── */}
      {/* 1. Fast Swish at initial transition */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("audio/fast_swish.mp3")} volume={0.8} />
      </Sequence>

      {/* 2. Error Buzz + Error synced with Bad Practice Card Glitch/Shake */}
      <Sequence from={18} durationInFrames={50}>
        <Audio src={staticFile("audio/error_buzz.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={32} durationInFrames={40}>
        <Audio src={staticFile("audio/error.mp3")} volume={0.85} />
      </Sequence>

      {/* 3. Morph Transition Swish + "UBAH JADI INI! 👇" Badge Pop */}
      <Sequence from={70} durationInFrames={35}>
        <Audio src={staticFile("audio/fast_swish.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={78} durationInFrames={30}>
        <Audio src={staticFile("audio/paper_flip.mp3")} volume={0.75} />
      </Sequence>

      {/* 4. Staggered Pop SFX for each of the 3 Interactive Diagram Nodes */}
      <Sequence from={node1Frame} durationInFrames={25}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={node2Frame} durationInFrames={25}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={node3Frame} durationInFrames={25}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.9} />
      </Sequence>

      {/* 5. Sub-headline kinetic word reveal typing & completion chime */}
      <Sequence from={172} durationInFrames={50}>
        <Audio src={staticFile("audio/typing2.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={210} durationInFrames={55}>
        <Audio src={staticFile("audio/level_up.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={248} durationInFrames={50}>
        <Audio src={staticFile("audio/bell_ding.mp3")} volume={0.55} />
      </Sequence>

      <DarkSlateBackground />

      {/* ── TOP HEADER (Y: 120px) — CRIMSON BADGE ────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "40px",
          right: "40px",
          display: "flex",
          justifyContent: "center",
          zIndex: 45,
          transform: `scale(${badgeSpring})`,
        }}
      >
        <div
          style={{
            background:
              frame < 74
                ? "linear-gradient(90deg, #7F1D1D 0%, #991B1B 50%, #7F1D1D 100%)"
                : "linear-gradient(90deg, rgba(127,29,29,0.9) 0%, rgba(15,23,42,0.95) 100%)",
            border: "2.5px solid #EF4444",
            borderRadius: "999px",
            padding: "16px 34px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: `0 0 ${24 + pulseWave * 14}px rgba(239, 68, 68, 0.55), inset 0 0 16px rgba(239, 68, 68, 0.25)`,
          }}
        >
          <span
            style={{
              backgroundColor: "#EF4444",
              color: "#FFFFFF",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "20px",
              fontWeight: 900,
              padding: "4px 12px",
              borderRadius: "999px",
              letterSpacing: "1.5px",
            }}
          >
            ALERT
          </span>
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "25px",
              fontWeight: 900,
              color: "#FEE2E2",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textShadow: "0 2px 10px rgba(239, 68, 68, 0.5)",
            }}
          >
            DOSA #1: COPY-PASTE BAB 1-5 KE SLIDE
          </span>
        </div>
      </div>

      {/* ── ONOMATOPOEIA GLOW BADGE: "UBAH JADI INI! 👇" (Phase 2) ───────── */}
      {phase2Visible && (
        <div
          style={{
            position: "absolute",
            top: "205px",
            right: "56px",
            zIndex: 60,
            transform: `translateY(${ubahFloatY}px) scale(${ubahBadgeSpring}) rotate(-4deg)`,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #FACC15 0%, #10B981 100%)",
              border: "3px solid #FEF08A",
              borderRadius: "20px",
              padding: "10px 26px",
              boxShadow: `0 14px 32px rgba(0,0,0,0.7), 0 0 ${
                22 + pulseWave * 16
              }px rgba(52, 211, 153, 0.85)`,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                fontFamily: "Impact, 'Arial Black', sans-serif",
                fontSize: "28px",
                fontWeight: 900,
                color: "#0F172A",
                letterSpacing: "1.5px",
              }}
            >
              UBAH JADI INI! 👇
            </span>
          </div>
        </div>
      )}

      {/* ── PHASE 1 (Frame 0-80): BAD PRACTICE CARD (Y: 280px - 850px) ─────── */}
      {badScale > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: "280px",
            left: "56px",
            right: "56px",
            height: "570px",
            zIndex: 35,
            transform: `translate(${shakeX}px, ${shakeY}px) scale(${badScale}) rotate(${badRotate}deg) skewX(${glitchSkew}deg)`,
            transformOrigin: "center center",
            opacity: badCollapse,
          }}
        >
          {/* Chromatic Aberration Glitch Shadow Layers */}
          {isGlitching && (
            <>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "28px",
                  border: "3px solid #EF4444",
                  background: "rgba(239, 68, 68, 0.18)",
                  transform: `translate(${rgbOffset * 1.4}px, -4px)`,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "28px",
                  border: "3px solid #06B6D4",
                  background: "rgba(6, 182, 212, 0.14)",
                  transform: `translate(${-rgbOffset * 1.4}px, 4px)`,
                  pointerEvents: "none",
                }}
              />
            </>
          )}

          {/* Main Bad Practice Card Container */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(180deg, rgba(30, 41, 59, 0.97) 0%, rgba(15, 23, 42, 0.99) 100%)",
              borderRadius: "28px",
              border: "3px solid #EF4444",
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.85), 0 0 45px rgba(239, 68, 68, 0.4)",
              padding: "28px 32px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Card Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "2px dashed rgba(239, 68, 68, 0.45)",
                paddingBottom: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    backgroundColor: "#EF4444",
                    color: "#FFF",
                    fontWeight: 900,
                    fontSize: "20px",
                    padding: "6px 14px",
                    borderRadius: "10px",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  ❌ BAD PRACTICE
                </span>
                <span
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "26px",
                    fontWeight: 900,
                    color: "#FCA5A5",
                    letterSpacing: "1px",
                  }}
                >
                  SLIDE &quot;TEKS TEMBOK&quot;
                </span>
              </div>

              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#FACC15",
                  backgroundColor: "rgba(250, 204, 21, 0.14)",
                  border: "1.5px solid #FACC15",
                  padding: "6px 14px",
                  borderRadius: "8px",
                }}
              >
                OVERLOAD: 580+ KATA/SLIDE
              </span>
            </div>

            {/* Simulated Dense Wall of Text Blocks with Glitch Bars */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#090D16",
                borderRadius: "18px",
                border: "1.5px solid #334155",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {[
                "BAB I PENDAHULUAN — Berdasarkan latar belakang masalah yang diuraikan sepanjang 6 halaman di dokumen skripsi Word lalu di-copy-paste utuh tanpa diringkas sedikit pun ke dalam slide...",
                "BAB II TINJAUAN PUSTAKA — Menurut 14 ahli dari jurnal tahun 1998 sampai 2024 menyebutkan bahwa definisi operasional variabel X1, X2, X3 sangat panjang dan memenuhi seluruh layar proyektor...",
                "BAB III METODOLOGI — Populasi, rumus sampel, teknik pengambilan data, kisi-kisi instrumen, dan tahapan penelitian ditulis dalam bentuk paragraf rapat berukuran font 10pt yang mustahil terbaca...",
                "BAB IV & V HASIL — Seluruh tabel output SPSS mentah dan pembahasan 5 paragraf penuh ditempel langsung sehingga audiens & dosen penguji pusing melihat tembok teks ini!",
              ].map((txt, idx) => (
                <div
                  key={idx}
                  style={{
                    fontFamily: "monospace",
                    fontSize: "16px",
                    lineHeight: 1.38,
                    color: idx % 2 === 0 ? "#CBD5E1" : "#94A3B8",
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    borderLeft: "4px solid #EF4444",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    transform: isGlitching
                      ? `translateX(${(idx % 2 === 0 ? 1 : -1) * rgbOffset}px)`
                      : "none",
                  }}
                >
                  {txt}
                </div>
              ))}

              {/* Horizontal Glitch Scanline Overlay */}
              {isGlitching && (
                <div
                  style={{
                    position: "absolute",
                    top: `${((frame * 23) % 85) + 5}%`,
                    left: 0,
                    right: 0,
                    height: "28px",
                    background:
                      "linear-gradient(90deg, rgba(239,68,68,0.65), rgba(250,204,21,0.5), rgba(6,182,212,0.65))",
                    mixBlendMode: "screen",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Big Center Glitch Stamp */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "rgba(15, 23, 42, 0.45)",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#EF4444",
                    color: "#FFFFFF",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "34px",
                    fontWeight: 900,
                    padding: "14px 32px",
                    borderRadius: "16px",
                    border: "3px solid #FEF08A",
                    letterSpacing: "2px",
                    boxShadow: "0 14px 40px rgba(0,0,0,0.85)",
                    transform: `rotate(-5deg) scale(${
                      1 + (isGlitching ? Math.abs(Math.sin(frame * 1.5)) * 0.08 : 0)
                    })`,
                  }}
                >
                  ⚡ HAPUS TEKS TEMBOK INI!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PHASE 2 (Frame 74-300): 3-NODE INTERACTIVE FLOWCHART DIAGRAM ──── */}
      {phase2Visible && (
        <div
          style={{
            position: "absolute",
            top: "250px",
            left: "48px",
            right: "48px",
            height: "1000px",
            zIndex: 38,
            transform: `translateY(${cardBreathY}px) scale(${containerSpring})`,
            transformOrigin: "top center",
          }}
        >
          {/* Glassmorphism Container (Green Emerald & Neon Cyan Theme) */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(165deg, rgba(6, 78, 59, 0.32) 0%, rgba(15, 23, 42, 0.88) 55%, rgba(8, 51, 68, 0.42) 100%)",
              backdropFilter: "blur(18px)",
              borderRadius: "32px",
              border: "2.5px solid rgba(34, 211, 238, 0.45)",
              boxShadow:
                "0 28px 70px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.18)",
              padding: "30px 38px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Header inside Glassmorphism Container */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "22px",
                zIndex: 5,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #10B981 0%, #06B6D4 100%)",
                    color: "#042F2E",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "19px",
                    fontWeight: 900,
                    padding: "6px 16px",
                    borderRadius: "999px",
                    letterSpacing: "1.5px",
                  }}
                >
                  ✓ SOLUSI VISUAL
                </span>
                <span
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "26px",
                    fontWeight: 900,
                    color: "#ECFDF5",
                    letterSpacing: "1px",
                  }}
                >
                  FLOWCHART 3 NODE INTI
                </span>
              </div>

              <span
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "17px",
                  fontWeight: 800,
                  color: "#22D3EE",
                  backgroundColor: "rgba(6, 182, 212, 0.15)",
                  border: "1.5px solid rgba(34, 211, 238, 0.5)",
                  padding: "6px 16px",
                  borderRadius: "999px",
                }}
              >
                100% Mudah Dipahami Penguji
              </span>
            </div>

            {/* ── GLOWING SEQUENTIAL SVG CONNECTOR LAYER ─────────────────── */}
            <svg
              viewBox="0 0 908 860"
              style={{
                position: "absolute",
                top: "90px",
                left: "38px",
                width: "908px",
                height: "860px",
                pointerEvents: "none",
                zIndex: 2,
              }}
            >
              <defs>
                <linearGradient
                  id="v11NodeConnectorGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <filter
                  id="v11GlowFilter"
                  x="-40%"
                  y="-40%"
                  width="180%"
                  height="180%"
                >
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Base Track Line (Dimmed) */}
              <path
                d="M 92 140 L 92 420 L 92 700"
                stroke="rgba(148, 163, 184, 0.22)"
                strokeWidth="8"
                strokeDasharray="12 10"
                fill="none"
                strokeLinecap="round"
              />

              {/* Connector 1: Node 1 (Y:140) -> Node 2 (Y:420) */}
              {conn1Progress > 0 && (
                <>
                  <path
                    d={`M 92 140 L 92 ${140 + 280 * conn1Progress}`}
                    stroke="url(#v11NodeConnectorGrad)"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#v11GlowFilter)"
                    opacity={0.75 + 0.25 * pulseWave}
                  />
                  <circle
                    cx="92"
                    cy={140 + 280 * conn1Progress}
                    r={11 + pulseWave * 4}
                    fill="#22D3EE"
                    filter="url(#v11GlowFilter)"
                  />
                </>
              )}

              {/* Connector 2: Node 2 (Y:420) -> Node 3 (Y:700) */}
              {conn2Progress > 0 && (
                <>
                  <path
                    d={`M 92 420 L 92 ${420 + 280 * conn2Progress}`}
                    stroke="url(#v11NodeConnectorGrad)"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#v11GlowFilter)"
                    opacity={0.75 + 0.25 * pulseWave}
                  />
                  <circle
                    cx="92"
                    cy={420 + 280 * conn2Progress}
                    r={11 + pulseWave * 4}
                    fill="#10B981"
                    filter="url(#v11GlowFilter)"
                  />
                </>
              )}
            </svg>

            {/* ── 3 INTERACTIVE FLOWCHART NODE CARDS ─────────────────────── */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "24px",
                zIndex: 5,
                paddingTop: "8px",
                paddingBottom: "8px",
              }}
            >
              {flowNodes.map((node, i) => {
                const scaleVal = interpolate(node.springVal, [0, 1], [0.7, 1]);
                const opacityVal = clamp(node.springVal, 0, 1);

                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "26px",
                      transform: `scale(${scaleVal})`,
                      opacity: opacityVal,
                      transformOrigin: "left center",
                    }}
                  >
                    {/* Left Circular Node Hub (Aligned with SVG Path X = 92) */}
                    <div
                      style={{
                        width: "110px",
                        height: "110px",
                        borderRadius: "50%",
                        background:
                          "radial-gradient(circle, #0F172A 0%, #042F2E 100%)",
                        border: `4px solid ${node.border}`,
                        boxShadow: `0 0 ${
                          20 + pulseWave * 14
                        }px ${node.accent}88, inset 0 0 18px ${node.accent}44`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginLeft: "37px",
                      }}
                    >
                      <span style={{ fontSize: "34px", lineHeight: 1 }}>
                        {node.icon}
                      </span>
                      <span
                        style={{
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          fontSize: "16px",
                          fontWeight: 900,
                          color: node.border,
                          marginTop: "4px",
                          letterSpacing: "1px",
                        }}
                      >
                        NODE {node.num}
                      </span>
                    </div>

                    {/* Interactive Glass Card for Node Content */}
                    <div
                      style={{
                        flex: 1,
                        background:
                          "linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(6, 78, 59, 0.38) 100%)",
                        border: `2.5px solid ${node.border}`,
                        borderRadius: "24px",
                        padding: "22px 28px",
                        boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 24px ${node.accent}33`,
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            fontSize: "24px",
                            fontWeight: 900,
                            color: node.border,
                            letterSpacing: "2px",
                            backgroundColor: "rgba(6, 182, 212, 0.14)",
                            padding: "4px 16px",
                            borderRadius: "10px",
                            border: `1.5px solid ${node.border}66`,
                          }}
                        >
                          {node.tag}
                        </span>

                        <span
                          style={{
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            fontSize: "16px",
                            fontWeight: 800,
                            color: "#A7F3D0",
                          }}
                        >
                          ● Maks. 15 Kata
                        </span>
                      </div>

                      <div
                        style={{
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          fontSize: "30px",
                          fontWeight: 900,
                          color: "#FFFFFF",
                          letterSpacing: "0.5px",
                          marginTop: "2px",
                        }}
                      >
                        {node.title}
                      </div>

                      <div
                        style={{
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          fontSize: "21px",
                          fontWeight: 600,
                          color: "#CBD5E1",
                          lineHeight: 1.35,
                        }}
                      >
                        {node.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-HEADLINE CARD (Y: 1300px - 1520px) WITH SHIMMERING BORDER ── */}
      <div
        style={{
          position: "absolute",
          top: "1300px",
          left: "48px",
          right: "48px",
          height: "220px",
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${
            frame < 74 ? clamp(badEnterSpring, 0, 1) : clamp(subCardSpring, 0, 1)
          })`,
        }}
      >
        {/* Outer Shimmering Gradient Border Wrapper */}
        <div
          style={{
            width: "100%",
            padding: "4px",
            borderRadius: "28px",
            background: `linear-gradient(${shimmerAngle}deg, #10B981 0%, #22D3EE 35%, #FACC15 70%, #10B981 100%)`,
            boxShadow: `0 18px 45px rgba(0,0,0,0.75), 0 0 ${
              20 + pulseWave * 15
            }px rgba(34, 211, 238, 0.4)`,
          }}
        >
          <div
            style={{
              background: "rgba(15, 23, 42, 0.96)",
              borderRadius: "24px",
              padding: "24px 30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "19px",
                fontWeight: 900,
                color: "#22D3EE",
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              💡 FORMULA SLIDE ANTI-REVISI
            </div>

            {/* Word-by-Word Kinetic Reveal with Scale Bounce (finishes @ frame 216 -> 84 frames hold!) */}
            <KineticWordLine
              startFrame={frame < 74 ? 14 : 168}
              interval={7}
              fontSize={36}
              gap={11}
              words={[
                { text: "Ubah", color: "#FFFFFF" },
                { text: "Teks", color: "#FFFFFF" },
                { text: "Paragraf", color: "#FCA5A5" },
                { text: "Jadi", color: "#FFFFFF" },
                { text: "Diagram", color: "#042F2E", bg: "#34D399" },
                { text: "3", color: "#FACC15" },
                { text: "Poin", color: "#34D399" },
                { text: "Kunci!", color: "#22D3EE", underline: true },
              ]}
            />
          </div>
        </div>
      </div>

      {/* ── BOTTOM AREA (Y: 1600px - 1920px): PROGRESS BAR TIMER VISUAL ───── */}
      <div
        style={{
          position: "absolute",
          top: "1600px",
          left: "56px",
          right: "56px",
          height: "320px",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "18px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.94)",
            border: "2px solid #334155",
            borderRadius: "22px",
            padding: "24px 30px",
            boxShadow: "0 14px 35px rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#22D3EE",
                  boxShadow: "0 0 10px #22D3EE",
                }}
              />
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  color: "#F8FAFC",
                  letterSpacing: "1.5px",
                }}
              >
                SCENE 02 • DOSA #1 &amp; SOLUSI DIAGRAM
              </span>
            </div>

            <span
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "#22D3EE",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ⏱ {remainingSec}s
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "22px",
              backgroundColor: "#1E293B",
              borderRadius: "999px",
              overflow: "hidden",
              border: "1.5px solid #475569",
              padding: "3px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: `${progressRatio * 100}%`,
                height: "100%",
                borderRadius: "999px",
                background:
                  "linear-gradient(90deg, #EF4444 0%, #10B981 50%, #22D3EE 100%)",
                boxShadow: "0 0 16px rgba(34, 211, 238, 0.6)",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "15px",
              fontWeight: 800,
              color: "#94A3B8",
              letterSpacing: "1px",
            }}
          >
            <span style={{ color: "#10B981" }}>✓ HOOK</span>
            <span style={{ color: "#22D3EE" }}>▶ DOSA #1 (DIAGRAM)</span>
            <span>DOSA #2</span>
            <span>DOSA #3</span>
            <span>SOLUSI</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── SCENE 3: DOSA #2 WARNA RAINBOW & FONT ALAY (300 FRAMES / 10 DETIK) ───────
export const Scene3_Dosa2WarnaFont: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 15-frame transition breathing room at scene start
  const enterOpacity = clamp(interpolate(frame, [0, 15], [0, 1]), 0, 1);
  const enterSlideY = interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 140 } }),
    [0, 1],
    [45, 0]
  );

  // Header Badge Spring
  const badgeSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 13, stiffness: 160 },
  });

  // ── PHASE 1 (Frame 0 - 90): Bad Practice "Slide Rainbow & Font Tabrakan" ──
  const badEnterSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 12, stiffness: 155 },
  });

  // Morph / fade out between frame 78 and 94
  const badMorphOut = clamp(interpolate(frame, [78, 94], [1, 0]), 0, 1);
  const badScale = badEnterSpring * badMorphOut;
  const badRotate = interpolate(frame, [78, 94], [0, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shake effect on Bad Practice Card & "SAKIT MATA! 😵💫" Badge (Frame 18 - 76)
  const isShaking = frame >= 18 && frame <= 76;
  const shakeX = isShaking
    ? Math.sin(frame * 2.9) * 13 * Math.cos(frame * 1.4)
    : 0;
  const shakeY = isShaking ? Math.cos(frame * 3.6) * 8 : 0;
  const badgeShakeRot = isShaking ? Math.sin(frame * 3.2) * 9 : 0;

  const sakitMataSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 8, stiffness: 210, mass: 0.8 },
  });

  // ── PHASE 2 (Frame 90 - 300): Palette Card "ATURAN 60-30-10" + Callout Box ──
  const phase2Visible = frame >= 86;
  const paletteCardSpring = spring({
    frame: frame - 90,
    fps,
    config: { damping: 14, stiffness: 135, mass: 0.9 },
  });

  // Staggered Swatch Springs (synced with pop.mp3 at 104, 134, 164)
  const swatch1Frame = 104;
  const swatch2Frame = 134;
  const swatch3Frame = 164;

  const swatch1Spring = spring({
    frame: frame - swatch1Frame,
    fps,
    config: { damping: 11, stiffness: 175 },
  });
  const swatch2Spring = spring({
    frame: frame - swatch2Frame,
    fps,
    config: { damping: 11, stiffness: 175 },
  });
  const swatch3Spring = spring({
    frame: frame - swatch3Frame,
    fps,
    config: { damping: 11, stiffness: 175 },
  });

  // Callout Box Spring (Y: 1000px - 1480px)
  const calloutSpring = spring({
    frame: frame - 115,
    fps,
    config: { damping: 13, stiffness: 150 },
  });

  // Continuous lifelike motion during Hold Pause (Frame 225 - 300 = 75 frames hold!)
  const pulseWave = 0.5 + 0.5 * Math.sin(frame * 0.22);
  const shimmerAngle = (frame * 4) % 360;
  const floatY = Math.sin(frame * 0.12) * 5;

  // Progress Bar Timer Visual (0 -> 100% across 300 frames)
  const progressRatio = clamp(frame / (durationInFrames - 1), 0, 1);
  const remainingSec = Math.max(0, (durationInFrames - frame) / fps).toFixed(1);

  const colorSwatches = [
    {
      pct: "60%",
      tag: "[ 60% DOMINAN ]",
      name: "Dark Slate / White Base",
      desc: "Background utama wajib bersih & kontras tinggi agar mata dosen fokus.",
      hex1: "#0F172A",
      hex2: "#F8FAFC",
      border: "#94A3B8",
      badgeBg: "#334155",
      badgeText: "#F8FAFC",
      springVal: swatch1Spring,
    },
    {
      pct: "30%",
      tag: "[ 30% SEKUNDER ]",
      name: "Soft Emerald / Navy",
      desc: "Untuk container kartu, tabel, struktur grafik, dan sub-header.",
      hex1: "#10B981",
      hex2: "#1E3A8A",
      border: "#34D399",
      badgeBg: "#065F46",
      badgeText: "#A7F3D0",
      springVal: swatch2Spring,
    },
    {
      pct: "10%",
      tag: "[ 10% AKSEN ]",
      name: "Neon Yellow / Coral Glow",
      desc: "Hanya untuk highlight angka temuan kunci & kesimpulan utama!",
      hex1: "#FACC15",
      hex2: "#FB7185",
      border: "#FACC15",
      badgeBg: "#854D0E",
      badgeText: "#FEF08A",
      springVal: swatch3Spring,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        overflow: "hidden",
        opacity: enterOpacity,
        transform: `translateY(${enterSlideY}px)`,
      }}
    >
      {/* ── SFX SYNC & AUDIO RHYTHM ───────────────────────────────────────── */}
      {/* 1. Whoosh at initial transition */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.8} />
      </Sequence>

      {/* 2. Error Buzz when "Slide Rainbow & Font Tabrakan" + "SAKIT MATA!" shakes */}
      <Sequence from={18} durationInFrames={55}>
        <Audio src={staticFile("audio/error_buzz.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={34} durationInFrames={35}>
        <Audio src={staticFile("audio/error.mp3")} volume={0.8} />
      </Sequence>

      {/* 3. Bell Ding + Fast Swish when transforming to "Aturan 60-30-10 & Max 2 Font" */}
      <Sequence from={84} durationInFrames={35}>
        <Audio src={staticFile("audio/fast_swish.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={90} durationInFrames={55}>
        <Audio src={staticFile("audio/bell_ding.mp3")} volume={0.85} />
      </Sequence>

      {/* 4. Staggered Pop SFX when 3 color swatches appear */}
      <Sequence from={swatch1Frame} durationInFrames={25}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={swatch2Frame} durationInFrames={25}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={swatch3Frame} durationInFrames={25}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.9} />
      </Sequence>

      {/* 5. Kinetic Word Reveal typing & completion accents */}
      <Sequence from={176} durationInFrames={50}>
        <Audio src={staticFile("audio/typing2.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={222} durationInFrames={55}>
        <Audio src={staticFile("audio/level_up.mp3")} volume={0.75} />
      </Sequence>

      <DarkSlateBackground />

      {/* ── HEADER (Y: 120px, CRIMSON RED BADGE) ─────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "36px",
          right: "36px",
          display: "flex",
          justifyContent: "center",
          zIndex: 45,
          transform: `scale(${badgeSpring})`,
        }}
      >
        <div
          style={{
            background:
              frame < 90
                ? "linear-gradient(90deg, #7F1D1D 0%, #991B1B 50%, #7F1D1D 100%)"
                : "linear-gradient(90deg, rgba(127,29,29,0.92) 0%, rgba(15,23,42,0.96) 100%)",
            border: "2.5px solid #EF4444",
            borderRadius: "999px",
            padding: "16px 32px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: `0 0 ${24 + pulseWave * 14}px rgba(239, 68, 68, 0.55), inset 0 0 16px rgba(239, 68, 68, 0.25)`,
          }}
        >
          <span
            style={{
              backgroundColor: "#EF4444",
              color: "#FFFFFF",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "19px",
              fontWeight: 900,
              padding: "4px 12px",
              borderRadius: "999px",
              letterSpacing: "1.5px",
            }}
          >
            ALERT
          </span>
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "24px",
              fontWeight: 900,
              color: "#FEE2E2",
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              textShadow: "0 2px 10px rgba(239, 68, 68, 0.5)",
            }}
          >
            DOSA #2: WARNA RAINBOW &amp; FONT TABRAKAN
          </span>
        </div>
      </div>

      {/* ── PHASE 1 (Frame 0-90): BAD PRACTICE RAINBOW CARD (Y: 280px - 850px) ── */}
      {badScale > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: "280px",
            left: "52px",
            right: "52px",
            height: "570px",
            zIndex: 35,
            transform: `translate(${shakeX}px, ${shakeY}px) scale(${badScale}) rotate(${badRotate}deg)`,
            transformOrigin: "center center",
            opacity: badMorphOut,
          }}
        >
          {/* ONOMATOPOEIA BADGE: "SAKIT MATA! 😵💫" (Shake Effect) */}
          <div
            style={{
              position: "absolute",
              top: "-28px",
              right: "20px",
              zIndex: 55,
              transform: `scale(${sakitMataSpring}) rotate(${
                8 + badgeShakeRot
              }deg)`,
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(135deg, #EF4444 0%, #FACC15 100%)",
                border: "4px solid #FFFFFF",
                borderRadius: "22px",
                padding: "12px 28px",
                boxShadow:
                  "0 16px 36px rgba(0,0,0,0.8), 0 0 30px rgba(239, 68, 68, 0.85)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  fontFamily: "Impact, 'Arial Black', sans-serif",
                  fontSize: "32px",
                  fontWeight: 900,
                  color: "#0F172A",
                  letterSpacing: "2px",
                }}
              >
                SAKIT MATA! 😵💫
              </span>
            </div>
          </div>

          {/* Tacky Rainbow Slide Card with 6+ Clashing Colors & 5 Unreadable Fonts */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, #FF007F 0%, #7928CA 25%, #00FF87 55%, #FFEB3B 80%, #FF512F 100%)",
              borderRadius: "28px",
              border: "5px dashed #00FFFF",
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.85), 0 0 50px rgba(255, 0, 127, 0.6)",
              padding: "24px 28px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Clashing Header Bar */}
            <div
              style={{
                backgroundColor: "#39FF14",
                border: "4px ridge #FF00FF",
                borderRadius: "14px",
                padding: "10px 18px",
                textAlign: "center",
                boxShadow: "0 6px 0 #FF0055",
              }}
            >
              <span
                style={{
                  fontFamily: "'Comic Sans MS', cursive, sans-serif",
                  fontSize: "30px",
                  fontWeight: 900,
                  color: "#FF0055",
                  textShadow: "2px 2px 0 #FFFF00, -2px -2px 0 #00FFFF",
                  letterSpacing: "2px",
                }}
              >
                ★ BAB II: LANDASAN TEORI &amp; KERANGKA PIKIR ★
              </span>
            </div>

            {/* 4 Clashing Neon Boxes with Unreadable Fonts */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
                flex: 1,
                marginTop: "14px",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#FFFF00",
                  border: "4px dotted #FF0000",
                  borderRadius: "16px",
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "cursive",
                    fontSize: "23px",
                    fontWeight: 900,
                    color: "#00FF00",
                    backgroundColor: "#800080",
                    padding: "4px 8px",
                  }}
                >
                  Font #1: Script Sambung Tipis
                </div>
                <div
                  style={{
                    fontFamily: "cursive",
                    fontSize: "19px",
                    color: "#FF00FF",
                    marginTop: "6px",
                    lineHeight: 1.25,
                  }}
                >
                  Kuning terang ketemu teks ungu &amp; hijau stabilo bikin buta!
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#00FFFF",
                  border: "4px solid #FF6600",
                  borderRadius: "16px",
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "Impact, fantasy",
                    fontSize: "25px",
                    color: "#FF3300",
                    letterSpacing: "3px",
                  }}
                >
                  FONT #2: IMPACT CONDENSED
                </div>
                <div
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "17px",
                    fontWeight: 900,
                    color: "#0000FF",
                    marginTop: "6px",
                  }}
                >
                  Font #3: Courier Mesin Ketik Nabrak Background Cyan!
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#FF00FF",
                  border: "4px double #FFFF00",
                  borderRadius: "16px",
                  padding: "14px",
                  gridColumn: "1 / span 2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: "Papyrus, fantasy, serif",
                    fontSize: "22px",
                    fontWeight: 900,
                    color: "#39FF14",
                    textShadow: "2px 2px #000",
                  }}
                >
                  Font #4 &amp; #5: 7 Warna Pelangi + WordArt 3D Jadul = AUTO PUSING!
                </span>
                <span
                  style={{
                    backgroundColor: "#FF0000",
                    color: "#FFFF00",
                    fontFamily: "system-ui, sans-serif",
                    fontWeight: 900,
                    fontSize: "18px",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "2px solid #FFF",
                  }}
                >
                  ❌ 7 WARNA + 5 FONT
                </span>
              </div>
            </div>

            {/* Bottom Warning Strip inside Bad Slide */}
            <div
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.92)",
                borderRadius: "12px",
                padding: "10px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "2px solid #EF4444",
              }}
            >
              <span
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "19px",
                  fontWeight: 900,
                  color: "#FCA5A5",
                }}
              >
                ⚠️ Kontras Hancur • Hirarki Visual Nol • Tidak Profesional
              </span>
              <span
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "18px",
                  fontWeight: 900,
                  color: "#FACC15",
                }}
              >
                NILAI DESAIN: E
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── PHASE 2 (Frame 90-300): PALETTE CARD "ATURAN 60-30-10" ────────── */}
      {phase2Visible && (
        <div
          style={{
            position: "absolute",
            top: "245px",
            left: "48px",
            right: "48px",
            height: "715px",
            zIndex: 38,
            transform: `translateY(${floatY}px) scale(${paletteCardSpring})`,
            transformOrigin: "top center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(165deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 60%, rgba(6, 78, 59, 0.35) 100%)",
              backdropFilter: "blur(18px)",
              borderRadius: "32px",
              border: "2.5px solid rgba(52, 211, 153, 0.5)",
              boxShadow:
                "0 28px 65px rgba(0,0,0,0.8), 0 0 38px rgba(16, 185, 129, 0.2)",
              padding: "28px 34px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {/* Header Row + Proportional 60-30-10 Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #10B981 0%, #34D399 100%)",
                    color: "#042F2E",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "19px",
                    fontWeight: 900,
                    padding: "6px 16px",
                    borderRadius: "999px",
                    letterSpacing: "1.5px",
                  }}
                >
                  ✓ SOLUSI PALET
                </span>
                <span
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "27px",
                    fontWeight: 900,
                    color: "#FFFFFF",
                    letterSpacing: "1px",
                  }}
                >
                  ATURAN WARNA 60 - 30 - 10
                </span>
              </div>

              {/* Visual Ratio Bar (60% : 30% : 10%) */}
              <div
                style={{
                  width: "260px",
                  height: "24px",
                  borderRadius: "999px",
                  overflow: "hidden",
                  display: "flex",
                  border: "2px solid #64748B",
                }}
              >
                <div
                  style={{
                    width: "60%",
                    backgroundColor: "#0F172A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 900,
                    color: "#F8FAFC",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  60%
                </div>
                <div
                  style={{
                    width: "30%",
                    backgroundColor: "#10B981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 900,
                    color: "#042F2E",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  30%
                </div>
                <div
                  style={{
                    width: "10%",
                    backgroundColor: "#FACC15",
                  }}
                />
              </div>
            </div>

            {/* 3 Staggered Swatch Cards */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              {colorSwatches.map((sw, idx) => {
                const scaleVal = interpolate(sw.springVal, [0, 1], [0.75, 1]);
                const opacityVal = clamp(sw.springVal, 0, 1);

                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      background: "rgba(15, 23, 42, 0.9)",
                      border: `2.5px solid ${sw.border}`,
                      borderRadius: "22px",
                      padding: "16px 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: "24px",
                      transform: `scale(${scaleVal})`,
                      opacity: opacityVal,
                      boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
                    }}
                  >
                    {/* Dual Swatch Preview Chip */}
                    <div
                      style={{
                        width: "135px",
                        height: "115px",
                        borderRadius: "18px",
                        overflow: "hidden",
                        border: "2.5px solid rgba(255,255,255,0.25)",
                        display: "flex",
                        flexDirection: "column",
                        flexShrink: 0,
                        position: "relative",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
                      }}
                    >
                      <div style={{ flex: 1, backgroundColor: sw.hex1 }} />
                      <div style={{ flex: 1, backgroundColor: sw.hex2 }} />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: "rgba(15, 23, 42, 0.88)",
                            color: "#FFFFFF",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            fontSize: "26px",
                            fontWeight: 900,
                            padding: "4px 14px",
                            borderRadius: "10px",
                            border: `1.5px solid ${sw.border}`,
                          }}
                        >
                          {sw.pct}
                        </span>
                      </div>
                    </div>

                    {/* Swatch Text Details */}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: sw.badgeBg,
                            color: sw.badgeText,
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            fontSize: "20px",
                            fontWeight: 900,
                            padding: "4px 14px",
                            borderRadius: "8px",
                            letterSpacing: "1.5px",
                          }}
                        >
                          {sw.tag}
                        </span>
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontSize: "16px",
                            fontWeight: 800,
                            color: "#94A3B8",
                          }}
                        >
                          {sw.hex1} • {sw.hex2}
                        </span>
                      </div>

                      <div
                        style={{
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          fontSize: "28px",
                          fontWeight: 900,
                          color: "#FFFFFF",
                        }}
                      >
                        {sw.name}
                      </div>

                      <div
                        style={{
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          fontSize: "19px",
                          fontWeight: 600,
                          color: "#CBD5E1",
                          lineHeight: 1.3,
                        }}
                      >
                        {sw.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── CALLOUT BOX (Y: 1000px - 1480px): MAX 2 TYPEFACE + SHIMMER ────── */}
      <div
        style={{
          position: "absolute",
          top: "1000px",
          left: "48px",
          right: "48px",
          height: "480px",
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${
            frame < 90 ? clamp(badEnterSpring, 0, 1) : clamp(calloutSpring, 0, 1)
          })`,
        }}
      >
        {/* Shimmering Border Container */}
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: "4px",
            borderRadius: "30px",
            background: `linear-gradient(${shimmerAngle}deg, #FACC15 0%, #10B981 40%, #22D3EE 75%, #FACC15 100%)`,
            boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 ${
              22 + pulseWave * 16
            }px rgba(250, 204, 21, 0.35)`,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "rgba(15, 23, 42, 0.97)",
              borderRadius: "26px",
              padding: "26px 34px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Top Tag */}
            <div
              style={{
                backgroundColor: "rgba(250, 204, 21, 0.14)",
                border: "1.5px solid #FACC15",
                borderRadius: "999px",
                padding: "6px 22px",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "19px",
                fontWeight: 900,
                color: "#FACC15",
                letterSpacing: "2.5px",
              }}
            >
              🔤 ATURAN TIPOGRAFI SLIDE SKRIPSI
            </div>

            {/* Word-by-Word Kinetic Reveal Headline */}
            <KineticWordLine
              startFrame={frame < 90 ? 16 : 172}
              interval={7}
              fontSize={38}
              gap={12}
              words={[
                { text: "Gunakan", color: "#FFFFFF" },
                { text: "Maksimal", color: "#FFFFFF" },
                { text: "2", color: "#0F172A", bg: "#FACC15" },
                { text: "Typeface", color: "#FACC15", underline: true },
                { text: "(1", color: "#34D399" },
                { text: "Header,", color: "#34D399" },
                { text: "1", color: "#22D3EE" },
                { text: "Body)!", color: "#22D3EE" },
              ]}
            />

            {/* Visual Pairing Comparison: 1 Header Font vs 1 Body Font */}
            <div
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(30, 41, 59, 0.9)",
                  border: "2px solid #34D399",
                  borderRadius: "18px",
                  padding: "16px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 900,
                    color: "#34D399",
                    letterSpacing: "1.5px",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  1. FONT HEADER (JUDUL)
                </div>
                <div
                  style={{
                    fontSize: "27px",
                    fontWeight: 900,
                    color: "#FFFFFF",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  Plus Jakarta / Montserrat
                </div>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "#94A3B8",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  Bold / ExtraBold • Ukuran 32–44pt
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "rgba(30, 41, 59, 0.9)",
                  border: "2px solid #22D3EE",
                  borderRadius: "18px",
                  padding: "16px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 900,
                    color: "#22D3EE",
                    letterSpacing: "1.5px",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  2. FONT BODY (ISI POIN)
                </div>
                <div
                  style={{
                    fontSize: "27px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  Inter / Roboto Regular
                </div>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "#94A3B8",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  Clean Sans-Serif • Min. 20–24pt
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM AREA (Y: 1600px - 1920px): PROGRESS BAR TIMER VISUAL ───── */}
      <div
        style={{
          position: "absolute",
          top: "1600px",
          left: "56px",
          right: "56px",
          height: "320px",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "18px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.94)",
            border: "2px solid #334155",
            borderRadius: "22px",
            padding: "24px 30px",
            boxShadow: "0 14px 35px rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#FACC15",
                  boxShadow: "0 0 10px #FACC15",
                }}
              />
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  color: "#F8FAFC",
                  letterSpacing: "1.5px",
                }}
              >
                SCENE 03 • ATURAN WARNA 60-30-10 &amp; FONT
              </span>
            </div>

            <span
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "#FACC15",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ⏱ {remainingSec}s
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "22px",
              backgroundColor: "#1E293B",
              borderRadius: "999px",
              overflow: "hidden",
              border: "1.5px solid #475569",
              padding: "3px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: `${progressRatio * 100}%`,
                height: "100%",
                borderRadius: "999px",
                background:
                  "linear-gradient(90deg, #10B981 0%, #FACC15 55%, #FB7185 100%)",
                boxShadow: "0 0 16px rgba(250, 204, 21, 0.6)",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "15px",
              fontWeight: 800,
              color: "#94A3B8",
              letterSpacing: "1px",
            }}
          >
            <span style={{ color: "#10B981" }}>✓ HOOK</span>
            <span style={{ color: "#10B981" }}>✓ DOSA #1</span>
            <span style={{ color: "#FACC15" }}>▶ DOSA #2 (60-30-10)</span>
            <span>DOSA #3</span>
            <span>SOLUSI</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── SCENE 4: DOSA #3 TABEL DATA RUMIT (300 FRAMES / 10 DETIK) ────────────────
export const Scene4_Dosa3TabelRumit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 15-frame transition breathing room at scene start
  const enterOpacity = clamp(interpolate(frame, [0, 15], [0, 1]), 0, 1);
  const enterSlideY = interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 140 } }),
    [0, 1],
    [45, 0]
  );

  // Header Badge Spring
  const badgeSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 13, stiffness: 160 },
  });

  // ── PHASE 1 (Frame 0 - 90): Bad Practice "Tabel Data Raksasa SPSS" ──
  const badEnterSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 12, stiffness: 155 },
  });

  // Morph / scale out between frame 78 and 94
  const badMorphOut = clamp(interpolate(frame, [78, 94], [1, 0]), 0, 1);
  const badScale = badEnterSpring * badMorphOut;
  const badRotate = interpolate(frame, [78, 94], [0, -8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shake effect on Bad Table Card & "DOSEN GA SEMPAT BACA! ❌" Badge (Frame 18 - 76)
  const isShaking = frame >= 18 && frame <= 76;
  const shakeX = isShaking
    ? Math.sin(frame * 3.1) * 13 * Math.cos(frame * 1.5)
    : 0;
  const shakeY = isShaking ? Math.cos(frame * 3.7) * 7 : 0;
  const badgeShakeRot = isShaking ? Math.sin(frame * 3.4) * 8 : 0;

  const gakSempatSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 8, stiffness: 210, mass: 0.8 },
  });

  // ── PHASE 2 (Frame 90 - 300): Key Metric Highlight Card + Callout Box ──
  const phase2Visible = frame >= 86;
  const metricCardSpring = spring({
    frame: frame - 90,
    fps,
    config: { damping: 13, stiffness: 140, mass: 0.9 },
  });

  // Staggered Stat Pops (synced with pop.mp3 at 104, 134, 162)
  const stat1Frame = 104;
  const stat2Frame = 134;
  const stat3Frame = 162;

  const stat1Spring = spring({
    frame: frame - stat1Frame,
    fps,
    config: { damping: 10, stiffness: 185 },
  });
  const stat2Spring = spring({
    frame: frame - stat2Frame,
    fps,
    config: { damping: 10, stiffness: 185 },
  });
  const stat3Spring = spring({
    frame: frame - stat3Frame,
    fps,
    config: { damping: 11, stiffness: 170 },
  });

  // Animated count-up for 87.5%
  const pctCount = interpolate(
    clamp(stat1Spring, 0, 1),
    [0, 1],
    [0, 87.5]
  ).toFixed(1);

  // Callout Box Spring (Y: 1100px - 1480px)
  const calloutSpring = spring({
    frame: frame - 118,
    fps,
    config: { damping: 13, stiffness: 150 },
  });

  // Continuous lifelike motion during Hold Pause (Frame 230 - 300 = 70 frames hold!)
  const pulseWave = 0.5 + 0.5 * Math.sin(frame * 0.22);
  const shimmerAngle = (frame * 4) % 360;
  const floatY = Math.sin(frame * 0.12) * 5;

  // Progress Bar Timer Visual (0 -> 100% across 300 frames)
  const progressRatio = clamp(frame / (durationInFrames - 1), 0, 1);
  const remainingSec = Math.max(0, (durationInFrames - frame) / fps).toFixed(1);

  const rawRows = [
    ["1 (Constant)", "14.284", "3.812", "-", "3.747", ".000", "-", "-"],
    ["X1_Beban_Kerja", "0.418", "0.089", ".342", "4.697", ".001", ".712", "1.404"],
    ["X2_Shift_Malam", "0.309", "0.074", ".289", "4.176", ".000", ".684", "1.462"],
    ["X3_Stres_Klinis", "0.521", "0.102", ".411", "5.108", ".001", ".641", "1.560"],
    ["X4_Usia_Perawat", "-0.042", "0.065", "-.048", "-0.646", ".520", ".891", "1.122"],
    ["X5_Masa_Kerja", "0.119", "0.081", ".104", "1.469", ".145", ".775", "1.290"],
    ["X6_Lingkungan", "0.277", "0.069", ".265", "4.014", ".001", ".738", "1.355"],
    ["F-Stat = 48.912", "R = .935", "R Square = .875", "Adj R2 = .861", "SEE = 2.14", "dw = 1.98", "df = 142", "Sig = .001"],
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        overflow: "hidden",
        opacity: enterOpacity,
        transform: `translateY(${enterSlideY}px)`,
      }}
    >
      {/* ── SFX SYNC & AUDIO RHYTHM ───────────────────────────────────────── */}
      {/* 1. Whoosh at initial transition */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.8} />
      </Sequence>

      {/* 2. Error Buzz when "Tabel Data Raksasa" + "DOSEN GA SEMPAT BACA!" shakes */}
      <Sequence from={18} durationInFrames={55}>
        <Audio src={staticFile("audio/error_buzz.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={36} durationInFrames={35}>
        <Audio src={staticFile("audio/error.mp3")} volume={0.8} />
      </Sequence>

      {/* 3. Level Up + Coin Gain when transforming to "Key Metric Highlight Card" */}
      <Sequence from={84} durationInFrames={35}>
        <Audio src={staticFile("audio/fast_swish.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={90} durationInFrames={55}>
        <Audio src={staticFile("audio/level_up.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={98} durationInFrames={45}>
        <Audio src={staticFile("audio/coin_gain.mp3")} volume={0.8} />
      </Sequence>

      {/* 4. Staggered Pop SFX when key statistics & insight appear */}
      <Sequence from={stat1Frame} durationInFrames={25}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={stat2Frame} durationInFrames={25}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={stat3Frame} durationInFrames={25}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.9} />
      </Sequence>

      {/* 5. Kinetic Word Reveal typing & hold pause chime */}
      <Sequence from={176} durationInFrames={55}>
        <Audio src={staticFile("audio/typing2.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={232} durationInFrames={55}>
        <Audio src={staticFile("audio/bell_ding.mp3")} volume={0.65} />
      </Sequence>

      <DarkSlateBackground />

      {/* ── HEADER (Y: 120px, CRIMSON RED BADGE) ─────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "36px",
          right: "36px",
          display: "flex",
          justifyContent: "center",
          zIndex: 45,
          transform: `scale(${badgeSpring})`,
        }}
      >
        <div
          style={{
            background:
              frame < 90
                ? "linear-gradient(90deg, #7F1D1D 0%, #991B1B 50%, #7F1D1D 100%)"
                : "linear-gradient(90deg, rgba(127,29,29,0.92) 0%, rgba(15,23,42,0.96) 100%)",
            border: "2.5px solid #EF4444",
            borderRadius: "999px",
            padding: "16px 34px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: `0 0 ${24 + pulseWave * 14}px rgba(239, 68, 68, 0.55), inset 0 0 16px rgba(239, 68, 68, 0.25)`,
          }}
        >
          <span
            style={{
              backgroundColor: "#EF4444",
              color: "#FFFFFF",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "19px",
              fontWeight: 900,
              padding: "4px 12px",
              borderRadius: "999px",
              letterSpacing: "1.5px",
            }}
          >
            ALERT
          </span>
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "25px",
              fontWeight: 900,
              color: "#FEE2E2",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textShadow: "0 2px 10px rgba(239, 68, 68, 0.5)",
            }}
          >
            DOSA #3: TAMPILIN TABEL DATA RUMIT
          </span>
        </div>
      </div>

      {/* ── PHASE 1 (Frame 0-90): BAD PRACTICE RAW SPSS TABLE (Y: 280px - 850px) ── */}
      {badScale > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: "280px",
            left: "48px",
            right: "48px",
            height: "570px",
            zIndex: 35,
            transform: `translate(${shakeX}px, ${shakeY}px) scale(${badScale}) rotate(${badRotate}deg)`,
            transformOrigin: "center center",
            opacity: badMorphOut,
          }}
        >
          {/* ONOMATOPOEIA BADGE: "DOSEN GA SEMPAT BACA! ❌" (Shake Effect) */}
          <div
            style={{
              position: "absolute",
              top: "-28px",
              right: "18px",
              zIndex: 55,
              transform: `scale(${gakSempatSpring}) rotate(${
                6 + badgeShakeRot
              }deg)`,
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(135deg, #EF4444 0%, #991B1B 100%)",
                border: "4px solid #FACC15",
                borderRadius: "22px",
                padding: "12px 26px",
                boxShadow:
                  "0 16px 36px rgba(0,0,0,0.85), 0 0 32px rgba(239, 68, 68, 0.9)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  fontFamily: "Impact, 'Arial Black', sans-serif",
                  fontSize: "30px",
                  fontWeight: 900,
                  color: "#FEF08A",
                  letterSpacing: "1.8px",
                }}
              >
                DOSEN GA SEMPAT BACA! ❌
              </span>
            </div>
          </div>

          {/* Giant Cramped Raw SPSS Output Card */}
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#F8FAFC",
              borderRadius: "26px",
              border: "4px solid #EF4444",
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.85), 0 0 45px rgba(239, 68, 68, 0.45)",
              padding: "22px 24px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Raw SPSS Screenshot Header */}
            <div
              style={{
                backgroundColor: "#1E293B",
                color: "#F8FAFC",
                padding: "10px 16px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "monospace",
                fontSize: "15px",
                fontWeight: 800,
              }}
            >
              <span>
                📊 SCREENSHOT MENTAH: Coefficientsᵃ &amp; ANOVAᵇ (SPSS Outputv26.spv)
              </span>
              <span style={{ color: "#FCA5A5" }}>FONT 8pt • 64 SEL ANGKA!</span>
            </div>

            {/* Ultra-Dense Statistical Table */}
            <div
              style={{
                flex: 1,
                marginTop: "12px",
                marginBottom: "12px",
                border: "2px solid #0F172A",
                backgroundColor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                fontFamily: "'Courier New', monospace",
              }}
            >
              {/* Table Column Headers */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.9fr 0.9fr 0.9fr 0.8fr 0.9fr 0.8fr 0.8fr 0.8fr",
                  backgroundColor: "#CBD5E1",
                  borderBottom: "2px solid #0F172A",
                  padding: "7px 8px",
                  fontSize: "12px",
                  fontWeight: 900,
                  color: "#0F172A",
                }}
              >
                <span>Model Variabel</span>
                <span>Unstd. B</span>
                <span>Std.Err</span>
                <span>Beta</span>
                <span>t-hitung</span>
                <span>Sig.(p)</span>
                <span>Toler.</span>
                <span>VIF</span>
              </div>

              {/* 8 Cramped Data Rows */}
              {rawRows.map((row, rIdx) => (
                <div
                  key={rIdx}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1.9fr 0.9fr 0.9fr 0.8fr 0.9fr 0.8fr 0.8fr 0.8fr",
                    borderBottom: "1px solid #94A3B8",
                    backgroundColor:
                      rIdx % 2 === 1 ? "#FEE2E2" : "#F1F5F9",
                    padding: "8px 8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#0F172A",
                  }}
                >
                  {row.map((cell, cIdx) => (
                    <span
                      key={cIdx}
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* Bottom Red Warning Strip */}
            <div
              style={{
                backgroundColor: "#7F1D1D",
                borderRadius: "10px",
                padding: "10px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#FEE2E2",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "17px",
                fontWeight: 800,
              }}
            >
              <span>
                ❌ Audiens bingung mana angka yang penting karena semua ditempel!
              </span>
              <span style={{ color: "#FACC15", fontWeight: 900 }}>
                STOP COPY-PASTE SPSS!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── PHASE 2 (Frame 90-300): KEY METRIC HIGHLIGHT CARD ────────────── */}
      {phase2Visible && (
        <div
          style={{
            position: "absolute",
            top: "235px",
            left: "48px",
            right: "48px",
            height: "825px",
            zIndex: 38,
            transform: `translateY(${floatY}px) scale(${metricCardSpring})`,
            transformOrigin: "top center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(165deg, rgba(15, 23, 42, 0.96) 0%, rgba(8, 51, 68, 0.55) 55%, rgba(6, 78, 59, 0.45) 100%)",
              backdropFilter: "blur(18px)",
              borderRadius: "32px",
              border: "3px solid #22D3EE",
              boxShadow: `0 28px 70px rgba(0,0,0,0.85), 0 0 ${
                30 + pulseWave * 18
              }px rgba(34, 211, 238, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)`,
              padding: "28px 34px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Card Top Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #FACC15 0%, #22D3EE 100%)",
                    color: "#0F172A",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "19px",
                    fontWeight: 900,
                    padding: "6px 18px",
                    borderRadius: "999px",
                    letterSpacing: "1.5px",
                  }}
                >
                  ✓ KEY METRIC HIGHLIGHT
                </span>
                <span
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "26px",
                    fontWeight: 900,
                    color: "#FFFFFF",
                    letterSpacing: "1px",
                  }}
                >
                  HASIL UJI HIPOTESIS UTAMA
                </span>
              </div>

              <span
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "17px",
                  fontWeight: 800,
                  color: "#FACC15",
                  backgroundColor: "rgba(250, 204, 21, 0.14)",
                  border: "1.5px solid #FACC15",
                  padding: "6px 16px",
                  borderRadius: "999px",
                }}
              >
                Terbaca Dalam 2 Detik!
              </span>
            </div>

            {/* ── 1. [ ANGKA UTAMA ] — DUAL GIANT STAT CARDS ──────────────── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                marginTop: "10px",
              }}
            >
              {/* Giant Metric 1: 87.5% (Neon Yellow Glow) */}
              <div
                style={{
                  background:
                    "linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(133, 77, 14, 0.28) 100%)",
                  border: "3px solid #FACC15",
                  borderRadius: "26px",
                  padding: "24px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${interpolate(stat1Spring, [0, 1], [0.6, 1])})`,
                  opacity: clamp(stat1Spring, 0, 1),
                  boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 ${
                    22 + pulseWave * 14
                  }px rgba(250, 204, 21, 0.35)`,
                }}
              >
                <span
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "18px",
                    fontWeight: 900,
                    color: "#FEF08A",
                    backgroundColor: "rgba(250, 204, 21, 0.18)",
                    padding: "4px 16px",
                    borderRadius: "999px",
                    letterSpacing: "2px",
                  }}
                >
                  [ ANGKA UTAMA #1 ]
                </span>

                <div
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "96px",
                    fontWeight: 900,
                    color: "#FACC15",
                    lineHeight: 1.05,
                    marginTop: "10px",
                    fontVariantNumeric: "tabular-nums",
                    textShadow: "0 0 32px rgba(250, 204, 21, 0.65)",
                  }}
                >
                  {pctCount}%
                </div>

                <div
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#FFFFFF",
                    marginTop: "6px",
                  }}
                >
                  Kontribusi Pengaruh (R²)
                </div>

                {/* Mini Visual Progress Bar inside Stat 1 */}
                <div
                  style={{
                    width: "100%",
                    height: "14px",
                    backgroundColor: "#1E293B",
                    borderRadius: "999px",
                    marginTop: "14px",
                    overflow: "hidden",
                    border: "1px solid #475569",
                  }}
                >
                  <div
                    style={{
                      width: `${87.5 * clamp(stat1Spring, 0, 1)}%`,
                      height: "100%",
                      background:
                        "linear-gradient(90deg, #FACC15 0%, #34D399 100%)",
                    }}
                  />
                </div>
              </div>

              {/* Giant Metric 2: p = 0.001 (Neon Cyan Glow) */}
              <div
                style={{
                  background:
                    "linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(8, 51, 68, 0.45) 100%)",
                  border: "3px solid #22D3EE",
                  borderRadius: "26px",
                  padding: "24px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${interpolate(stat2Spring, [0, 1], [0.6, 1])})`,
                  opacity: clamp(stat2Spring, 0, 1),
                  boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 ${
                    22 + pulseWave * 14
                  }px rgba(34, 211, 238, 0.35)`,
                }}
              >
                <span
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "18px",
                    fontWeight: 900,
                    color: "#A5F3FC",
                    backgroundColor: "rgba(34, 211, 238, 0.18)",
                    padding: "4px 16px",
                    borderRadius: "999px",
                    letterSpacing: "2px",
                  }}
                >
                  [ ANGKA UTAMA #2 ]
                </span>

                <div
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "84px",
                    fontWeight: 900,
                    color: "#22D3EE",
                    lineHeight: 1.12,
                    marginTop: "14px",
                    textShadow: "0 0 32px rgba(34, 211, 238, 0.65)",
                  }}
                >
                  p = 0.001
                </div>

                <div
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#FFFFFF",
                    marginTop: "8px",
                  }}
                >
                  Nilai Signifikansi (&lt; 0.05)
                </div>

                <div
                  style={{
                    marginTop: "12px",
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    border: "1.5px solid #34D399",
                    borderRadius: "999px",
                    padding: "4px 18px",
                    fontSize: "16px",
                    fontWeight: 900,
                    color: "#34D399",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  ✓ HIPOTESIS H₁ DITERIMA
                </div>
              </div>
            </div>

            {/* ── 2. [ KESIMPULAN 1 KALIMAT ] BANNER ──────────────────────── */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(6, 78, 59, 0.55) 0%, rgba(15, 23, 42, 0.95) 100%)",
                border: "2.5px solid #34D399",
                borderRadius: "24px",
                padding: "22px 30px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                transform: `scale(${interpolate(stat3Spring, [0, 1], [0.8, 1])})`,
                opacity: clamp(stat3Spring, 0, 1),
                boxShadow: "0 14px 35px rgba(0,0,0,0.55)",
              }}
            >
              <span
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "18px",
                  fontWeight: 900,
                  color: "#34D399",
                  letterSpacing: "2.5px",
                }}
              >
                📌 [ KESIMPULAN 1 KALIMAT ]
              </span>

              <div
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "33px",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  textAlign: "center",
                  lineHeight: 1.25,
                }}
              >
                &ldquo;Ada Pengaruh{" "}
                <span style={{ color: "#FACC15", textDecoration: "underline" }}>
                  Signifikan
                </span>{" "}
                Antara Variabel X &amp; Y&rdquo;
              </div>

              <div
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#CBD5E1",
                }}
              >
                (Tabel lengkap 64 angka cukup dilampirkan di Buku Skripsi / Lampiran)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CALLOUT BOX (Y: 1100px - 1480px) WITH SHIMMERING EFFECT ───────── */}
      <div
        style={{
          position: "absolute",
          top: "1100px",
          left: "48px",
          right: "48px",
          height: "380px",
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${
            frame < 90 ? clamp(badEnterSpring, 0, 1) : clamp(calloutSpring, 0, 1)
          })`,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: "4px",
            borderRadius: "30px",
            background: `linear-gradient(${shimmerAngle}deg, #22D3EE 0%, #FACC15 40%, #10B981 75%, #22D3EE 100%)`,
            boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 ${
              22 + pulseWave * 16
            }px rgba(34, 211, 238, 0.35)`,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "rgba(15, 23, 42, 0.97)",
              borderRadius: "26px",
              padding: "26px 34px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(34, 211, 238, 0.14)",
                border: "1.5px solid #22D3EE",
                borderRadius: "999px",
                padding: "6px 24px",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "19px",
                fontWeight: 900,
                color: "#22D3EE",
                letterSpacing: "2.5px",
              }}
            >
              💡 TIPS PRESENTASI BAB 4 (HASIL OLAH DATA)
            </div>

            {/* Word-by-word Kinetic Reveal (finishes @ frame 230 -> 70 frames hold!) */}
            <KineticWordLine
              startFrame={frame < 90 ? 16 : 168}
              interval={6}
              fontSize={38}
              gap={12}
              words={[
                { text: "Jangan", color: "#FCA5A5" },
                { text: "Copy", color: "#FCA5A5" },
                { text: "Tabel", color: "#FFFFFF" },
                { text: "SPSS", color: "#FFFFFF" },
                { text: "Raw!", color: "#FFFFFF", bg: "#EF4444" },
                { text: "Tampilkan", color: "#FFFFFF" },
                { text: "Angka", color: "#0F172A", bg: "#FACC15" },
                { text: "Kunci", color: "#FACC15" },
                { text: "+", color: "#22D3EE" },
                { text: "1", color: "#34D399" },
                { text: "Kalimat", color: "#34D399" },
                { text: "Insight!", color: "#22D3EE", underline: true },
              ]}
            />
          </div>
        </div>
      </div>

      {/* ── BOTTOM AREA (Y: 1600px - 1920px): PROGRESS BAR TIMER VISUAL ───── */}
      <div
        style={{
          position: "absolute",
          top: "1600px",
          left: "56px",
          right: "56px",
          height: "320px",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "18px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.94)",
            border: "2px solid #334155",
            borderRadius: "22px",
            padding: "24px 30px",
            boxShadow: "0 14px 35px rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#22D3EE",
                  boxShadow: "0 0 10px #22D3EE",
                }}
              />
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  color: "#F8FAFC",
                  letterSpacing: "1.5px",
                }}
              >
                SCENE 04 • KEY METRIC HIGHLIGHT DATA
              </span>
            </div>

            <span
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "#22D3EE",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ⏱ {remainingSec}s
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "22px",
              backgroundColor: "#1E293B",
              borderRadius: "999px",
              overflow: "hidden",
              border: "1.5px solid #475569",
              padding: "3px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: `${progressRatio * 100}%`,
                height: "100%",
                borderRadius: "999px",
                background:
                  "linear-gradient(90deg, #FACC15 0%, #22D3EE 55%, #10B981 100%)",
                boxShadow: "0 0 16px rgba(34, 211, 238, 0.6)",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "15px",
              fontWeight: 800,
              color: "#94A3B8",
              letterSpacing: "1px",
            }}
          >
            <span style={{ color: "#10B981" }}>✓ HOOK</span>
            <span style={{ color: "#10B981" }}>✓ DOSA #1</span>
            <span style={{ color: "#10B981" }}>✓ DOSA #2</span>
            <span style={{ color: "#22D3EE" }}>▶ DOSA #3 (KEY METRIC)</span>
            <span>SOLUSI</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── SCENE 5: DOUBLE CTA & FREEBIE TRIGGER (300 FRAMES / 10 DETIK) ────────────
export const Scene5_DoubleCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 15-frame transition breathing room at scene start
  const enterOpacity = clamp(interpolate(frame, [0, 15], [0, 1]), 0, 1);
  const enterSlideY = interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 140 } }),
    [0, 1],
    [45, 0]
  );

  // Header Badge Spring (Vibrant Purple/Violet)
  const badgeSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 12, stiffness: 165 },
  });

  // Top Interactive Trigger Card Spring (Y: 260px - 830px)
  const topCardSpring = spring({
    frame: frame - 16,
    fps,
    config: { damping: 13, stiffness: 145, mass: 0.9 },
  });

  // Mockup PPT Slides Staggered Springs
  const slide1Spring = spring({
    frame: frame - 32,
    fps,
    config: { damping: 11, stiffness: 175 },
  });
  const slide2Spring = spring({
    frame: frame - 48,
    fps,
    config: { damping: 11, stiffness: 175 },
  });
  const slide3Spring = spring({
    frame: frame - 64,
    fps,
    config: { damping: 11, stiffness: 175 },
  });

  // Profile Link CTA Box Spring (Y: 860px - 1500px)
  const bottomBoxSpring = spring({
    frame: frame - 84,
    fps,
    config: { damping: 13, stiffness: 145, mass: 0.9 },
  });

  const actionBtnSpring = spring({
    frame: frame - 126,
    fps,
    config: { damping: 10, stiffness: 185 },
  });

  // Continuous lifelike animations (Shimmering Gold + Pulse + Floating Finger)
  const pulseWave = 0.5 + 0.5 * Math.sin(frame * 0.24);
  const shimmerAngle = (frame * 5) % 360;
  const floatY = Math.sin(frame * 0.14) * 5;
  const fingerBounceX = Math.sin(frame * 0.3) * 8;

  // Progress Bar Timer Visual (0 -> 100% across 300 frames)
  const progressRatio = clamp(frame / (durationInFrames - 1), 0, 1);
  const remainingSec = Math.max(0, (durationInFrames - frame) / fps).toFixed(1);

  const previewSlides = [
    {
      num: "SLIDE 01",
      title: "Diagram 3 Node",
      tag: "Bebas Teks Tembok",
      accent: "#10B981",
      springVal: slide1Spring,
    },
    {
      num: "SLIDE 02",
      title: "Palet 60-30-10",
      tag: "Kontras & Profesional",
      accent: "#FACC15",
      springVal: slide2Spring,
    },
    {
      num: "SLIDE 03",
      title: "Key Metric 87.5%",
      tag: "1 Kalimat Insight",
      accent: "#22D3EE",
      springVal: slide3Spring,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        overflow: "hidden",
        opacity: enterOpacity,
        transform: `translateY(${enterSlideY}px)`,
      }}
    >
      {/* ── SFX SYNC & AUDIO RHYTHM ───────────────────────────────────────── */}
      {/* 1. Audio CTA at initial transition into Scene 5 */}
      <Sequence from={0} durationInFrames={180}>
        <Audio src={staticFile("audio/audio_cta.mp3")} volume={0.85} />
      </Sequence>

      {/* 2. Applause SFX when Call to Action & Modern PPT Mockup activate */}
      <Sequence from={26} durationInFrames={140}>
        <Audio src={staticFile("audio/applause.mp3")} volume={0.55} />
      </Sequence>

      {/* 3. Staggered Pop SFX when interactive options & slides appear */}
      <Sequence from={18} durationInFrames={25}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={48} durationInFrames={25}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={86} durationInFrames={25}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={128} durationInFrames={25}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.9} />
      </Sequence>

      {/* 4. Accent Chimes for Freebie & Bio Link CTA completion */}
      <Sequence from={168} durationInFrames={55}>
        <Audio src={staticFile("audio/level_up.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={225} durationInFrames={55}>
        <Audio src={staticFile("audio/bell_ding.mp3")} volume={0.65} />
      </Sequence>

      <DarkSlateBackground />

      {/* Extra Purple/Violet Radial Glow for Scene 5 */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, rgba(15, 23, 42, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── HEADER (Y: 120px, VIBRANT PURPLE/VIOLET BADGE) ───────────────── */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "36px",
          right: "36px",
          display: "flex",
          justifyContent: "center",
          zIndex: 45,
          transform: `scale(${badgeSpring})`,
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(90deg, #581C87 0%, #7E22CE 50%, #4C1D95 100%)",
            border: "2.5px solid #C084FC",
            borderRadius: "999px",
            padding: "16px 38px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: `0 0 ${26 + pulseWave * 16}px rgba(192, 132, 252, 0.6), inset 0 0 18px rgba(192, 132, 252, 0.3)`,
          }}
        >
          <span
            style={{
              backgroundColor: "#FACC15",
              color: "#0F172A",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "19px",
              fontWeight: 900,
              padding: "4px 14px",
              borderRadius: "999px",
              letterSpacing: "1.5px",
            }}
          >
            SOLUSI FINAL
          </span>
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "26px",
              fontWeight: 900,
              color: "#FAF5FF",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textShadow: "0 2px 12px rgba(192, 132, 252, 0.6)",
            }}
          >
            MAU SLIDE SIDANG AUTO ACC DOSPEM?
          </span>
        </div>
      </div>

      {/* ── TOP INTERACTIVE TRIGGER CARD (Y: 260px - 830px) ──────────────── */}
      <div
        style={{
          position: "absolute",
          top: "260px",
          left: "48px",
          right: "48px",
          height: "570px",
          zIndex: 38,
          transform: `translateY(${floatY}px) scale(${topCardSpring})`,
          transformOrigin: "top center",
        }}
      >
        {/* Shimmering Gold Border Outer Container */}
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: "4px",
            borderRadius: "32px",
            background: `linear-gradient(${shimmerAngle}deg, #FACC15 0%, #FEF08A 30%, #F59E0B 65%, #FACC15 100%)`,
            boxShadow: `0 25px 60px rgba(0,0,0,0.85), 0 0 ${
              24 + pulseWave * 18
            }px rgba(250, 204, 21, 0.45)`,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(165deg, rgba(15, 23, 42, 0.97) 0%, rgba(30, 27, 75, 0.92) 60%, rgba(15, 23, 42, 0.98) 100%)",
              borderRadius: "28px",
              padding: "24px 32px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            {/* Visual Pin Comment Badge */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(250, 204, 21, 0.16)",
                  border: "1.5px solid #FACC15",
                  borderRadius: "999px",
                  padding: "6px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "18px" }}>📌</span>
                <span
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "17px",
                    fontWeight: 900,
                    color: "#FEF08A",
                    letterSpacing: "1.5px",
                  }}
                >
                  FREEBIE EKSKLUSIF KOMENTAR
                </span>
              </div>

              <span
                style={{
                  backgroundColor: "#10B981",
                  color: "#042F2E",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "16px",
                  fontWeight: 900,
                  padding: "5px 16px",
                  borderRadius: "999px",
                  letterSpacing: "1px",
                }}
              >
                100% GRATIS • SIAP PAKAI
              </span>
            </div>

            {/* Card Utama Title */}
            <div
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "31px",
                fontWeight: 900,
                color: "#FFFFFF",
                textAlign: "center",
                letterSpacing: "0.8px",
                textShadow: "0 4px 16px rgba(250, 204, 21, 0.35)",
              }}
            >
              🎁 PPT TEMPLATE SLIDE SIDANG{" "}
              <span style={{ color: "#FACC15" }}>BEBAS REVISI 2026</span>
            </div>

            {/* Mockup Frame PPT Modern yang Berkilau (3 Slide Previews) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "18px",
                margin: "6px 0",
              }}
            >
              {previewSlides.map((sl, idx) => (
                <div
                  key={idx}
                  style={{
                    background:
                      "linear-gradient(145deg, #1E293B 0%, #0F172A 100%)",
                    border: `2.5px solid ${sl.accent}`,
                    borderRadius: "18px",
                    padding: "16px 16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "185px",
                    boxSizing: "border-box",
                    transform: `scale(${interpolate(
                      sl.springVal,
                      [0, 1],
                      [0.65, 1]
                    )})`,
                    opacity: clamp(sl.springVal, 0, 1),
                    boxShadow: `0 12px 28px rgba(0,0,0,0.6), 0 0 18px ${sl.accent}33`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "14px",
                        fontWeight: 900,
                        color: sl.accent,
                      }}
                    >
                      {sl.num}
                    </span>
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: sl.accent,
                      }}
                    />
                  </div>

                  {/* Mini visual diagram bars inside slide mockup */}
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      alignItems: "flex-end",
                      height: "48px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: "65%",
                        backgroundColor: `${sl.accent}55`,
                        borderRadius: "6px",
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        height: "100%",
                        backgroundColor: sl.accent,
                        borderRadius: "6px",
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        height: "80%",
                        backgroundColor: `${sl.accent}99`,
                        borderRadius: "6px",
                      }}
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        fontSize: "20px",
                        fontWeight: 900,
                        color: "#FFFFFF",
                      }}
                    >
                      {sl.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#CBD5E1",
                        marginTop: "2px",
                      }}
                    >
                      ✓ {sl.tag}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Comment Trigger Button (Pulse/Glow + Word-by-word Kinetic Reveal) */}
            <div
              style={{
                background:
                  "linear-gradient(90deg, rgba(250, 204, 21, 0.18) 0%, rgba(168, 85, 247, 0.25) 50%, rgba(250, 204, 21, 0.18) 100%)",
                border: "2.5px solid #FACC15",
                borderRadius: "20px",
                padding: "16px 24px",
                boxShadow: `0 0 ${18 + pulseWave * 16}px rgba(250, 204, 21, 0.45)`,
                transform: `scale(${1 + pulseWave * 0.018})`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <KineticWordLine
                startFrame={42}
                interval={6}
                fontSize={27}
                gap={10}
                words={[
                  { text: "💬", color: "#FFFFFF" },
                  { text: "Ketik", color: "#FFFFFF" },
                  { text: "'SLIDE'", color: "#0F172A", bg: "#FACC15" },
                  { text: "di", color: "#FFFFFF" },
                  { text: "kolom", color: "#FFFFFF" },
                  { text: "komentar", color: "#FACC15", underline: true },
                  { text: "buat", color: "#FFFFFF" },
                  { text: "ambil", color: "#34D399" },
                  { text: "filenya!", color: "#34D399" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── PROFILE LINK CTA BOX (Y: 860px - 1500px) ─────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "860px",
          left: "48px",
          right: "48px",
          height: "640px",
          zIndex: 40,
          transform: `scale(${bottomBoxSpring})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(165deg, rgba(15, 23, 42, 0.96) 0%, rgba(46, 16, 101, 0.55) 55%, rgba(6, 78, 59, 0.4) 100%)",
            backdropFilter: "blur(18px)",
            borderRadius: "32px",
            border: "3px solid #A855F7",
            boxShadow: `0 28px 65px rgba(0,0,0,0.85), 0 0 ${
              24 + pulseWave * 16
            }px rgba(168, 85, 247, 0.35)`,
            padding: "28px 36px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Badge Highlight */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(168, 85, 247, 0.2)",
                border: "2px solid #C084FC",
                borderRadius: "999px",
                padding: "8px 26px",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "21px",
                fontWeight: 900,
                color: "#E9D5FF",
                letterSpacing: "2px",
              }}
            >
              🚀 BUTUH BANTUAN REVIEW SLIDE &amp; SKRIPSI?
            </div>

            <div
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "24px",
                fontWeight: 700,
                color: "#CBD5E1",
                textAlign: "center",
              }}
            >
              Didampingi Mentor Riset{" "}
              <b style={{ color: "#FACC15" }}>JagoNeliti</b> Sampai Lulus Sidang!
            </div>
          </div>

          {/* 3 Benefit Pills */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {[
              {
                icon: "✅",
                title: "Bedah Struktur Slide & Alur Presentasi Sidang",
                tag: "Anti Grogi",
                color: "#34D399",
              },
              {
                icon: "✅",
                title: "Validasi Metodologi, Rumus Sampel & Olah Data",
                tag: "Bab 1 - 5",
                color: "#22D3EE",
              },
              {
                icon: "✅",
                title: "Simulasi Pertanyaan Jebakan Dosen Penguji",
                tag: "1-on-1 Privat",
                color: "#FACC15",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "rgba(15, 23, 42, 0.88)",
                  border: `2px solid ${item.color}66`,
                  borderRadius: "18px",
                  padding: "14px 22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#F8FAFC",
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </div>

                <span
                  style={{
                    backgroundColor: `${item.color}22`,
                    color: item.color,
                    border: `1.5px solid ${item.color}`,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "16px",
                    fontWeight: 900,
                    padding: "4px 14px",
                    borderRadius: "999px",
                  }}
                >
                  {item.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Action Banner: "👉 KLIK LINK DI BIO UNTUK KONSULTASI LANGSUNG" */}
          <div
            style={{
              transform: `scale(${interpolate(
                actionBtnSpring,
                [0, 1],
                [0.8, 1]
              )})`,
              opacity: clamp(actionBtnSpring, 0, 1),
              background:
                "linear-gradient(90deg, #D97706 0%, #EA580C 50%, #D97706 100%)",
              border: "3px solid #FEF08A",
              borderRadius: "24px",
              padding: "20px 26px",
              boxShadow: `0 16px 40px rgba(234, 88, 12, 0.55), 0 0 ${
                22 + pulseWave * 18
              }px rgba(250, 204, 21, 0.65)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "36px",
                  transform: `translateX(${fingerBounceX}px)`,
                  display: "inline-block",
                }}
              >
                👉
              </span>
              <KineticWordLine
                startFrame={128}
                interval={6}
                fontSize={31}
                gap={10}
                words={[
                  { text: "KLIK", color: "#FEF08A" },
                  { text: "LINK", color: "#FEF08A" },
                  { text: "DI", color: "#FFFFFF" },
                  { text: "BIO", color: "#0F172A", bg: "#FACC15" },
                  { text: "UNTUK", color: "#FFFFFF" },
                  { text: "KONSULTASI", color: "#FFFFFF" },
                  { text: "LANGSUNG", color: "#FEF08A", underline: true },
                ]}
              />
            </div>

            <div
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "18px",
                fontWeight: 800,
                color: "#FEF3C7",
                letterSpacing: "1px",
              }}
            >
              ⚡ Slot Bimbingan Minggu Ini Terbatas • Fast Response via WhatsApp
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM AREA (Y: 1600px - 1920px): PROGRESS BAR VISUAL PENUTUP ── */}
      <div
        style={{
          position: "absolute",
          top: "1600px",
          left: "56px",
          right: "56px",
          height: "320px",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "18px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.94)",
            border: "2px solid #A855F7",
            borderRadius: "22px",
            padding: "24px 30px",
            boxShadow: "0 14px 35px rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#C084FC",
                  boxShadow: "0 0 10px #C084FC",
                }}
              />
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  color: "#F8FAFC",
                  letterSpacing: "1.5px",
                }}
              >
                SCENE 05 • TEMPLATE GRATIS &amp; KONSULTASI
              </span>
            </div>

            <span
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "#FACC15",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ⏱ {remainingSec}s
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "22px",
              backgroundColor: "#1E293B",
              borderRadius: "999px",
              overflow: "hidden",
              border: "1.5px solid #475569",
              padding: "3px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: `${progressRatio * 100}%`,
                height: "100%",
                borderRadius: "999px",
                background:
                  "linear-gradient(90deg, #A855F7 0%, #FACC15 50%, #10B981 100%)",
                boxShadow: "0 0 16px rgba(250, 204, 21, 0.6)",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "15px",
              fontWeight: 800,
              color: "#94A3B8",
              letterSpacing: "1px",
            }}
          >
            <span style={{ color: "#10B981" }}>✓ HOOK</span>
            <span style={{ color: "#10B981" }}>✓ DOSA #1</span>
            <span style={{ color: "#10B981" }}>✓ DOSA #2</span>
            <span style={{ color: "#10B981" }}>✓ DOSA #3</span>
            <span style={{ color: "#FACC15" }}>★ SOLUSI &amp; FREEBIE</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── MAIN COMPOSITION COMPONENT (JagoNeliti-V11) ───────────────────────────────
export const InteractiveScene11: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F172A" }}>
      {/* SCENE 1: THE NIGHTMARE HOOK (210 Frames / 7 Detik) */}
      <Sequence from={0} durationInFrames={SCENE_DURATIONS_V11.s1}>
        <Scene1_NightmareHook />
      </Sequence>

      {/* SCENE 2: DOSA #1 & SOLUSI DIAGRAM (300 Frames / 10 Detik) */}
      <Sequence
        from={SCENE_DURATIONS_V11.s1}
        durationInFrames={SCENE_DURATIONS_V11.s2}
      >
        <Scene2_Dosa1Diagram />
      </Sequence>

      {/* SCENE 3: DOSA #2 WARNA RAINBOW & FONT ALAY (300 Frames / 10 Detik) */}
      <Sequence
        from={SCENE_DURATIONS_V11.s1 + SCENE_DURATIONS_V11.s2}
        durationInFrames={SCENE_DURATIONS_V11.s3}
      >
        <Scene3_Dosa2WarnaFont />
      </Sequence>

      {/* SCENE 4: DOSA #3 TABEL DATA RUMIT (300 Frames / 10 Detik) */}
      <Sequence
        from={
          SCENE_DURATIONS_V11.s1 +
          SCENE_DURATIONS_V11.s2 +
          SCENE_DURATIONS_V11.s3
        }
        durationInFrames={SCENE_DURATIONS_V11.s4}
      >
        <Scene4_Dosa3TabelRumit />
      </Sequence>

      {/* SCENE 5: DOUBLE CTA & FREEBIE TRIGGER (300 Frames / 10 Detik) */}
      <Sequence
        from={
          SCENE_DURATIONS_V11.s1 +
          SCENE_DURATIONS_V11.s2 +
          SCENE_DURATIONS_V11.s3 +
          SCENE_DURATIONS_V11.s4
        }
        durationInFrames={SCENE_DURATIONS_V11.s5}
      >
        <Scene5_DoubleCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
