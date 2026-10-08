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

// ─── PALETTE — Warm Studio Tech ─────────────────────────────────────────────
const BG_CHARCOAL = "#121212";
const WARM_AMBER  = "#F59E0B";
const TERRACOTTA  = "#E05638";
const EMERALD     = "#10B981";
const TEXT_LIGHT  = "#F1F5F9";
const TEXT_DIM    = "#94A3B8";

// ─── SCENE DURATIONS (Total 1100 frames = 36.67 detik @ 30fps) ───────────────
// Diberikan jeda 1 - 1.5 detik (30–45 frames) ekstra di setiap transisi scene agar teks terbaca santai
const SCENE1_DUR   = 255; // 0–255 (8.5 detik)
const SCENE2_DUR   = 290; // 255–545 (9.67 detik)
const SCENE3_DUR   = 290; // 545–835 (9.67 detik)
const SCENE4_DUR   = 265; // 835–1100 (8.83 detik)

const SCENE2_START = SCENE1_DUR;
const SCENE3_START = SCENE1_DUR + SCENE2_DUR;
const SCENE4_START = SCENE1_DUR + SCENE2_DUR + SCENE3_DUR;

const SAFE_BOTTOM = 200;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Waktu kemunculan masing-masing dari 5 file icon
const FILE_DROP_FRAMES = [0, 22, 44, 66, 88];

// ─── ROOT COMPONENT ──────────────────────────────────────────────────────────
export const InteractiveScene03: React.FC = () => {
  const frame = useCurrentFrame();
  const ambientPulse = interpolate(Math.sin(frame / 40), [-1, 1], [0.97, 1.03]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG_CHARCOAL,
        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `radial-gradient(ellipse 80% 40% at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 70%)`,
          transform: `scale(${ambientPulse})`,
        }}
      />

      {/* ─── AUDIO SEQUENCES ──────────────────────────────────────────────── */}

      {/* Scene 1: file_fall dipicu tepat sesuai kemunculan tiap icon file (0, 22, 44, 66, 88) */}
      {FILE_DROP_FRAMES.map((dropFrame, idx) => (
        <Sequence
          key={`fall-${idx}`}
          from={dropFrame}
          durationInFrames={30}
          layout="none"
        >
          <Audio src={staticFile("audio/file_fall.mp3")} volume={0.8} />
        </Sequence>
      ))}

      {/* Scene 1: funny_scream berbunyi sepanjang alert merah error hingga jeda scene selesai */}
      <Sequence from={105} durationInFrames={150} layout="none">
        <Audio src={staticFile("audio/funny_scream.mp3")} loop volume={0.85} />
      </Sequence>

      {/* Scene 2: whoosh transisi masuk */}
      <Sequence from={SCENE2_START} durationInFrames={45} layout="none">
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.8} />
      </Sequence>

      {/* Scene 2: typing2 berbunyi selama teks error diketik (280) sampai "Tenang ada solusinya" muncul (405) */}
      <Sequence from={280} durationInFrames={125} layout="none">
        <Audio src={staticFile("audio/typing2.mp3")} loop volume={0.7} />
      </Sequence>

      {/* Scene 2: pop sound tepat saat badge "Tenang! Ada Solusinya" muncul (405) */}
      <Sequence from={405} durationInFrames={45} layout="none">
        <Audio src={staticFile("audio/pop.mp3")} volume={0.85} />
      </Sequence>

      {/* Scene 3: whoosh transisi HP jatuh & zoom */}
      <Sequence from={SCENE3_START} durationInFrames={50} layout="none">
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.85} />
      </Sequence>

      {/* Scene 3: typing sound effect saat mengetik DM di keyboard layar HP */}
      <Sequence from={SCENE3_START + 40} durationInFrames={100} layout="none">
        <Audio src={staticFile("audio/typing.mp3")} loop volume={0.75} />
      </Sequence>

      {/* Scene 3: pop saat DM terkirim */}
      <Sequence from={SCENE3_START + 140} durationInFrames={45} layout="none">
        <Audio src={staticFile("audio/pop.mp3")} volume={0.75} />
      </Sequence>

      {/* Scene 3: bell saat balasan JagoNeliti masuk */}
      <Sequence from={SCENE3_START + 180} durationInFrames={70} layout="none">
        <Audio src={staticFile("audio/bell_ding.mp3")} volume={0.9} />
      </Sequence>

      {/* Scene 4: success bell saat hasil clean & ACC tampil */}
      <Sequence from={SCENE4_START + 15} durationInFrames={90} layout="none">
        <Audio src={staticFile("audio/bell_ding.mp3")} volume={1} />
      </Sequence>

      {/* Scene 4: applause tepuk tangan sekali sampai akhir durasi video */}
      <Sequence from={SCENE4_START + 15} durationInFrames={1100 - (SCENE4_START + 15)} layout="none">
        <Audio src={staticFile("audio/applause.mp3")} volume={0.8} />
      </Sequence>

      {/* ─── SCENE RENDERING ─────────────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={SCENE1_DUR} layout="none">
        <Scene1_FileFall />
      </Sequence>
      <Sequence from={SCENE2_START} durationInFrames={SCENE2_DUR} layout="none">
        <Scene2_OlahDataProblem />
      </Sequence>
      <Sequence from={SCENE3_START} durationInFrames={SCENE3_DUR} layout="none">
        <Scene3_DMJagoNeliti />
      </Sequence>
      <Sequence from={SCENE4_START} durationInFrames={SCENE4_DUR} layout="none">
        <Scene4_SuccessCTA />
      </Sequence>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 1 — File Jatuh Numpuk & Alert Error (Dengan jeda baca 1–1.5 detik)
// ════════════════════════════════════════════════════════════════════════════
const Scene1_FileFall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneOpacity = clamp(frame / 15, 0, 1);

  // Kilat deterministik
  const lightningPhases = [30, 65, 140, 185];
  const activeLP = lightningPhases.find((p) => frame >= p && frame <= p + 6);
  const lightningIntensity =
    activeLP !== undefined
      ? interpolate((frame - activeLP) % 7, [0, 2, 4, 6], [0, 1, 0.6, 0])
      : 0;

  // Hujan SVG
  const rainSeeds = Array.from({ length: 26 }, (_, i) => ({
    x: (i * 43 + 17) % 1080,
    speed: 0.85 + (i % 5) * 0.3,
    length: 20 + (i % 8) * 5,
    opacity: 0.12 + (i % 4) * 0.05,
    offset: (i * 79) % 200,
  }));

  // 5 file jatuh bertahap dengan timing sinkron ke FILE_DROP_FRAMES
  const files = [
    { icon: "📄", label: ".csv", color: EMERALD, stagger: FILE_DROP_FRAMES[0] },
    { icon: "📊", label: ".xlsx", color: WARM_AMBER, stagger: FILE_DROP_FRAMES[1] },
    { icon: "🗃️", label: ".sav", color: TERRACOTTA, stagger: FILE_DROP_FRAMES[2] },
    { icon: "📋", label: ".csv", color: EMERALD, stagger: FILE_DROP_FRAMES[3] },
    { icon: "📈", label: ".xlsx", color: WARM_AMBER, stagger: FILE_DROP_FRAMES[4] },
  ];

  const filePositions = files.map((f, i) => {
    const localF = frame - f.stagger;
    if (localF < 0) return null;
    const s = spring({
      frame: localF,
      fps,
      config: { damping: 12, stiffness: 130, mass: 1.1 },
    });
    const yPos = interpolate(s, [0, 1], [-220, 370 + i * 115]);
    const rotation = interpolate(Math.sin(localF / 8 + i), [-1, 1], [-16, 16]);
    const xPos = [170, 390, 570, 290, 480][i];
    return { ...f, yPos, xPos, rotation };
  });

  // Alert merah error auto-type
  const ERROR_TEXT = "[ERROR] 1.500 Data Dummy Missing & Duplicate!";
  const ERROR_START = 105;
  const CPF = 0.65;
  const errorChars = Math.min(
    ERROR_TEXT.length,
    Math.max(0, Math.floor((frame - ERROR_START) * CPF))
  );
  const displayedError = ERROR_TEXT.slice(0, errorChars);
  const showError = frame >= ERROR_START;
  const errorSpring = showError
    ? spring({
        frame: frame - ERROR_START,
        fps,
        config: { damping: 15, stiffness: 120 },
      })
    : 0;
  const errorShake = showError
    ? interpolate(Math.sin((frame - ERROR_START) * 1.8), [-1, 1], [-6, 6]) *
      Math.max(0, 1 - (frame - ERROR_START) / 45)
    : 0;
  const cursorBlink = Math.floor(frame / 12) % 2 === 0;

  // Bridge Card pengganti "KANTONG BOLONG" (muncul frame 155, ada jeda baca sampai 255)
  const BRIDGE_START = 155;
  const showBridge = frame >= BRIDGE_START;
  const bridgeSpring = showBridge
    ? spring({
        frame: frame - BRIDGE_START,
        fps,
        config: { damping: 14, stiffness: 95, mass: 1.1 },
      })
    : 0;
  const bridgePulse = interpolate(Math.sin(frame / 14), [-1, 1], [0.98, 1.02]);

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity, zIndex: 10 }}>
      {/* Background malam */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #0A0A0F 0%, #10101A 60%, #121212 100%)",
        }}
      />

      {/* Jendela kamar malam */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: "translateX(-50%)",
          width: 540,
          height: 330,
          border: "8px solid #2A2A3A",
          borderRadius: 16,
          boxShadow:
            "0 0 60px rgba(80,80,160,0.15), inset 0 0 40px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, #090915 0%, #111128 60%, #0A0A18 100%)",
          }}
        />
        {/* Bintang */}
        {[
          { x: 60, y: 30 },
          { x: 200, y: 50 },
          { x: 380, y: 25 },
          { x: 460, y: 70 },
          { x: 140, y: 80 },
          { x: 300, y: 40 },
          { x: 80, y: 120 },
          { x: 430, y: 100 },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: 2.5,
              height: 2.5,
              borderRadius: "50%",
              backgroundColor: "#E8EAF6",
              opacity: 0.5 + Math.sin(frame / 30 + i) * 0.3,
            }}
          />
        ))}
        {/* Kilat di jendela */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `rgba(180,200,255,${lightningIntensity * 0.55})`,
          }}
        />
        {activeLP !== undefined && (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 540 330"
            style={{ position: "absolute", inset: 0, opacity: lightningIntensity }}
          >
            <polyline
              points="270,10 250,100 280,100 230,280"
              fill="none"
              stroke="rgba(200,220,255,0.9)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <polyline
              points="270,10 250,100 280,100 230,280"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="8"
              strokeLinecap="round"
              style={{ filter: "blur(4px)" }}
            />
          </svg>
        )}
        {/* Bingkai jendela */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: 6,
            background: "#2A2A3A",
            transform: "translateX(-50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            height: 6,
            background: "#2A2A3A",
            transform: "translateY(-50%)",
          }}
        />
      </div>

      {/* Flash kilat fullscreen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `rgba(150,180,255,${lightningIntensity * 0.08})`,
        }}
      />

      {/* Hujan SVG */}
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
      >
        {rainSeeds.map((r, i) => {
          const yOff = (frame * r.speed * 12 + r.offset) % 1920;
          return (
            <line
              key={i}
              x1={r.x}
              y1={yOff}
              x2={r.x - 4}
              y2={yOff + r.length}
              stroke={`rgba(160,180,220,${r.opacity})`}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* File icons berjatuhan sinkron dengan suara */}
      <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
        {filePositions.map((fp, i) => {
          if (!fp) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: fp.xPos,
                top: fp.yPos,
                transform: `rotate(${fp.rotation}deg)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(145deg, #1E1E2A, #16161F)",
                  border: `2px solid ${fp.color}55`,
                  borderRadius: 18,
                  padding: "16px 20px",
                  boxShadow: `0 10px 32px rgba(0,0,0,0.5), 0 0 24px ${fp.color}25`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  minWidth: 100,
                }}
              >
                <div style={{ fontSize: 50 }}>{fp.icon}</div>
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: 800,
                    color: fp.color,
                    fontFamily: "'SF Mono',monospace",
                  }}
                >
                  {fp.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error box merah bergetar */}
      {showError && (
        <div
          style={{
            position: "absolute",
            bottom: SAFE_BOTTOM + 320,
            left: 48,
            right: 48,
            transform: `scale(${errorSpring}) translateX(${errorShake}px)`,
            opacity: errorSpring,
            zIndex: 20,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${TERRACOTTA}28, ${TERRACOTTA}10)`,
              border: `2.5px solid ${TERRACOTTA}`,
              borderRadius: 20,
              padding: "24px 28px",
              boxShadow: `0 0 50px ${TERRACOTTA}55, 0 10px 35px rgba(0,0,0,0.6)`,
            }}
          >
            <div
              style={{
                fontSize: 29,
                fontWeight: 800,
                color: TERRACOTTA,
                fontFamily: "'SF Mono',monospace",
                lineHeight: 1.45,
              }}
            >
              {displayedError}
              {errorChars < ERROR_TEXT.length && (
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 29,
                    backgroundColor: cursorBlink ? TERRACOTTA : "transparent",
                    marginLeft: 4,
                    verticalAlign: "middle",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bridge Card ke Scene 2 (Dengan jeda baca 1–1.5 detik sebelum transisi) */}
      {showBridge && (
        <div
          style={{
            position: "absolute",
            bottom: SAFE_BOTTOM + 140,
            left: 48,
            right: 48,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${bridgeSpring * bridgePulse})`,
            opacity: bridgeSpring,
            zIndex: 25,
          }}
        >
          <div
            style={{
              width: "100%",
              background: "rgba(18,18,24,0.92)",
              border: `2px solid ${WARM_AMBER}77`,
              borderRadius: 22,
              padding: "20px 28px",
              textAlign: "center",
              backdropFilter: "blur(18px)",
              boxShadow: `0 0 45px ${WARM_AMBER}25, 0 12px 40px rgba(0,0,0,0.6)`,
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: TEXT_LIGHT,
                letterSpacing: "-0.5px",
              }}
            >
              😰 Dataset Berantakan & Deadline Mepet?
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: WARM_AMBER,
                marginTop: 8,
              }}
            >
              Tenang, ini masalah yang paling sering terjadi! 👇
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 2 — Masalah Olah Data (Dengan jeda baca 1–1.5 detik setelah pill muncul)
// ════════════════════════════════════════════════════════════════════════════
const Scene2_OlahDataProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneIn = clamp(frame / 18, 0, 1);

  // Background karakter besar kepala-pinggang (TIDAK PERLU GERAK / STATIC)
  const bgOpacity = clamp(frame / 12, 0, 1);

  // Chat auto-typing
  const CHAT_TEXT =
    "SyntaxError: Nggak Paham Olah Data!\nDataset .csv/.sav missing & duplikat dimana-mana.\nUji Normalitas & Regresi gagal terus... 😭";
  const CHAT_START = 25;
  const CPF = 0.55;
  const chatChars = Math.min(
    CHAT_TEXT.length,
    Math.max(0, Math.floor((frame - CHAT_START) * CPF))
  );
  const displayedChat = CHAT_TEXT.slice(0, chatChars);
  const showChat = frame >= CHAT_START;
  const chatSpring = showChat
    ? spring({
        frame: frame - CHAT_START,
        fps,
        config: { damping: 16, stiffness: 110, mass: 1.1 },
      })
    : 0;
  const chatTypingDone = chatChars >= CHAT_TEXT.length;
  const chatCursor = Math.floor(frame / 12) % 2 === 0;

  // Pill "Tenang! Ada Solusinya" — muncul local frame 150 (abs 405), sound typing2 berhenti
  // Memberikan waktu jeda baca santai dari frame 150 sampai frame 290 (140 frames = 4.6 detik!)
  const PILL_START = 150;
  const showPill = frame >= PILL_START;
  const pillSpring = showPill
    ? spring({
        frame: frame - PILL_START,
        fps,
        config: { damping: 14, stiffness: 110 },
      })
    : 0;

  return (
    <AbsoluteFill style={{ opacity: sceneIn, zIndex: 10 }}>
      {/* Background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, #1C130A 0%, #261608 35%, ${BG_CHARCOAL} 80%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 95% 70% at 50% 30%, rgba(245,158,11,0.20) 0%, rgba(224,86,56,0.08) 45%, transparent 75%)`,
        }}
      />

      {/* ── BACKGROUND KARAKTER BESAR (Kepala sampai Pinggang, Suntuk & Diam) ── */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: bgOpacity,
          zIndex: 3,
        }}
      >
        <svg
          width="820"
          height="880"
          viewBox="0 0 820 880"
          style={{ filter: "drop-shadow(0 25px 60px rgba(0,0,0,0.6))" }}
        >
          {/* Efek stress / aura pusing static */}
          <circle cx="410" cy="300" r="230" fill="rgba(245,158,11,0.06)" />
          <circle cx="410" cy="300" r="190" fill="rgba(224,86,56,0.08)" />

          <text x="180" y="210" fill={TERRACOTTA} fontSize="52" fontWeight="900" opacity="0.85">‼️</text>
          <text x="600" y="210" fill={TERRACOTTA} fontSize="52" fontWeight="900" opacity="0.85">⁉️</text>
          <text x="140" y="320" fill={WARM_AMBER} fontSize="44" fontWeight="900" opacity="0.75">⚡</text>
          <text x="640" y="320" fill={WARM_AMBER} fontSize="44" fontWeight="900" opacity="0.75">⚡</text>

          {/* Torso / Badan jaket almamater */}
          <path
            d="M 270,550 L 250,860 L 570,860 L 550,550 Z"
            fill="#1E2838"
            stroke="#2E3C52"
            strokeWidth="4"
          />
          <line x1="410" y1="550" x2="410" y2="860" stroke="#3A4D68" strokeWidth="6" />

          {/* Bahu lemas membungkuk */}
          <path
            d="M 270,550 C 220,550 140,590 130,680 L 220,720 L 270,590 Z"
            fill="#273448"
          />
          <path
            d="M 550,550 C 600,550 680,590 690,680 L 600,720 L 550,590 Z"
            fill="#273448"
          />

          {/* Lengan naik memegang kepala (pose pusing/suntuk) */}
          <path
            d="M 130,680 C 120,620 180,470 270,410 L 310,460 C 240,510 190,630 190,690 Z"
            fill="#1E2838"
          />
          <ellipse cx="300" cy="410" rx="42" ry="32" fill="#E8B088" />
          <circle cx="280" cy="395" r="14" fill="#D69B74" />
          <circle cx="300" cy="390" r="14" fill="#D69B74" />
          <circle cx="320" cy="395" r="14" fill="#D69B74" />

          <path
            d="M 690,680 C 700,620 640,470 550,410 L 510,460 C 580,510 630,630 630,690 Z"
            fill="#1E2838"
          />
          <ellipse cx="520" cy="410" rx="42" ry="32" fill="#E8B088" />
          <circle cx="500" cy="395" r="14" fill="#D69B74" />
          <circle cx="520" cy="390" r="14" fill="#D69B74" />
          <circle cx="540" cy="395" r="14" fill="#D69B74" />

          {/* Leher lemas */}
          <rect x="365" y="490" width="90" height="70" rx="15" fill="#D69B74" />

          {/* ── KEPALA MAHASISWA SUNTUK (STATIC) ── */}
          <ellipse cx="410" cy="350" rx="155" ry="170" fill="#E8B088" />
          <path
            d="M 255,330 C 250,210 320,170 410,170 C 500,170 570,210 565,330 C 550,280 520,240 480,240 C 440,240 430,260 410,250 C 390,260 380,240 340,240 C 300,240 270,280 255,330 Z"
            fill="#231A15"
          />

          {/* Topi wisuda/toga miring */}
          <path
            d="M 280,180 L 410,130 L 540,180 L 410,215 Z"
            fill="#111827"
            stroke="#1F2937"
            strokeWidth="3"
          />
          <polygon points="410,140 435,175 425,180 400,145" fill={WARM_AMBER} />
          <circle cx="430" cy="185" r="7" fill={WARM_AMBER} />

          {/* Alis stres berkerut */}
          <path
            d="M 310,305 Q 355,325 385,310"
            fill="none"
            stroke="#231A15"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 510,305 Q 465,325 435,310"
            fill="none"
            stroke="#231A15"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Kelopak sayu */}
          <ellipse cx="345" cy="345" rx="32" ry="20" fill="#231A15" />
          <ellipse cx="475" cy="345" rx="32" ry="20" fill="#231A15" />
          <path
            d="M 315,365 Q 345,385 375,365"
            fill="none"
            stroke="rgba(80,50,40,0.5)"
            strokeWidth="4"
          />
          <path
            d="M 445,365 Q 475,385 505,365"
            fill="none"
            stroke="rgba(80,50,40,0.5)"
            strokeWidth="4"
          />

          {/* Keringat dingin */}
          <path
            d="M 525,290 C 535,275 545,290 540,310 C 535,325 515,325 515,310 C 515,295 520,295 525,290 Z"
            fill="#60A5FA"
            opacity="0.85"
          />

          {/* Mulut pusing */}
          <path
            d="M 355,430 Q 410,405 465,430"
            fill="none"
            stroke="#231A15"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* ── LABEL UTAMA ── */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "center",
          zIndex: 20,
        }}
      >
        <div
          style={{
            background: "rgba(18,18,24,0.92)",
            border: `2px solid ${TERRACOTTA}`,
            borderRadius: 40,
            padding: "16px 36px",
            fontSize: 24,
            fontWeight: 800,
            color: "#FFF",
            letterSpacing: "0.5px",
            textAlign: "center",
            boxShadow: `0 0 35px ${TERRACOTTA}44, 0 8px 24px rgba(0,0,0,0.5)`,
          }}
        >
          ⚠️ Masalah yang Sering Terjadi di Olah Data atau Tugas Akhir
        </div>
      </div>

      {/* ── ERROR TERMINAL CARD (SyntaxError langsung) ── */}
      {showChat && (
        <div
          style={{
            position: "absolute",
            bottom: SAFE_BOTTOM + 240,
            left: 48,
            right: 48,
            transform: `scale(${chatSpring})`,
            opacity: chatSpring,
            zIndex: 25,
          }}
        >
          <div
            style={{
              background: "rgba(13,13,20,0.96)",
              border: `2px solid ${TERRACOTTA}88`,
              borderRadius: 22,
              padding: "26px 30px",
              backdropFilter: "blur(20px)",
              boxShadow: `0 16px 48px rgba(0,0,0,0.7), 0 0 40px ${TERRACOTTA}25`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: TERRACOTTA }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: WARM_AMBER }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: EMERALD }} />
              <span
                style={{
                  fontSize: 16,
                  color: TEXT_DIM,
                  marginLeft: 8,
                  fontFamily: "'SF Mono',monospace",
                }}
              >
                console.error
              </span>
            </div>

            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: TEXT_LIGHT,
                fontFamily: "'SF Mono',monospace",
                lineHeight: 1.65,
                whiteSpace: "pre-wrap",
              }}
            >
              <span style={{ color: TERRACOTTA, fontWeight: 800 }}>⛔ </span>
              {displayedChat}
              {!chatTypingDone && (
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 28,
                    backgroundColor: chatCursor ? TERRACOTTA : "transparent",
                    marginLeft: 4,
                    verticalAlign: "middle",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PILL "Tenang! Ada Solusinya" ── */}
      {showPill && (
        <div
          style={{
            position: "absolute",
            bottom: SAFE_BOTTOM + 130,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${pillSpring})`,
            opacity: pillSpring,
            zIndex: 30,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${EMERALD}, #059669)`,
              color: "#FFF",
              borderRadius: 40,
              padding: "16px 46px",
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: "0.5px",
              boxShadow: `0 0 40px ${EMERALD}77, 0 10px 30px rgba(0,0,0,0.5)`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span>💡</span>
            <span>Tenang, Ada Solusinya! 👉</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 3 — DM JagoNeliti & Layar HP (Dengan jeda baca 1–1.5 detik setelah balasan)
// ════════════════════════════════════════════════════════════════════════════
const Scene3_DMJagoNeliti: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneIn = clamp(frame / 20, 0, 1);

  // HP jatuh dari atas + ZOOM BESAR hampir fullscreen dipegang tangan
  const phoneDropSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 75, mass: 1.3 },
  });
  const phoneY = interpolate(phoneDropSpring, [0, 1], [-700, 0]);
  const phoneScale = interpolate(phoneDropSpring, [0, 1], [0.55, 1.02]);

  // DM pesan user
  const DM_TEXT = "Kak, bantu olah data TA-ku sampai ACC dong!";
  const DM_START = 40;
  const CPF = 0.45;
  const dmChars = Math.min(
    DM_TEXT.length,
    Math.max(0, Math.floor((frame - DM_START) * CPF))
  );
  const displayedDM = DM_TEXT.slice(0, dmChars);
  const dmDone = dmChars >= DM_TEXT.length;
  const dmCursor = Math.floor(frame / 12) % 2 === 0;
  const MSG_SENT_FRAME = 140;
  const msgSent = frame >= MSG_SENT_FRAME;

  // Balasan JagoNeliti (muncul frame 180, jeda baca sampai 290 = 110 frames = 3.6 detik!)
  const REPLY_TEXT = "Siap! Kirim dataset-nya sekarang, kita bereskan! 🚀";
  const REPLY_START = 180;
  const replyCPF = 0.65;
  const replyChars = Math.min(
    REPLY_TEXT.length,
    Math.max(0, Math.floor((frame - REPLY_START) * replyCPF))
  );
  const displayedReply = REPLY_TEXT.slice(0, replyChars);
  const showReply = frame >= REPLY_START;
  const replySpring = showReply
    ? spring({
        frame: frame - REPLY_START,
        fps,
        config: { damping: 14, stiffness: 105, mass: 1.1 },
      })
    : 0;
  const replyCursor = Math.floor(frame / 11) % 2 === 0;
  const replyDone = replyChars >= REPLY_TEXT.length;

  // Animasi jempol mengetik di layar keyboard
  const isTyping = frame >= DM_START && frame < MSG_SENT_FRAME && !dmDone;
  const thumbTap = isTyping ? interpolate(Math.sin(frame * 1.5), [-1, 1], [-8, 4]) : 0;

  // Matahari & sinar taman cerah
  const sunBob = interpolate(Math.sin(frame / 25), [-1, 1], [-6, 6]);

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["⇧", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ];

  return (
    <AbsoluteFill style={{ opacity: sceneIn, zIndex: 10 }}>
      {/* ── BACKGROUND TAMAN CERAH & MATAHARI ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #60A5FA 0%, #93C5FD 35%, #BAE6FD 65%, #86EFAC 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 60 + sunBob,
          right: 90,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #FEF08A 20%, #FDE047 60%, rgba(253,224,71,0) 80%)",
          boxShadow: "0 0 80px rgba(253,224,71,0.9), 0 0 150px rgba(250,204,21,0.6)",
        }}
      />

      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 130 + sunBob,
            right: 160,
            width: 80,
            height: 4,
            borderRadius: 2,
            background: "rgba(254,240,138,0.55)",
            transformOrigin: "0 50%",
            transform: `rotate(${deg}deg)`,
          }}
        />
      ))}

      {[
        { x: 80, y: 120, w: 200, h: 60 },
        { x: 620, y: 180, w: 240, h: 70 },
        { x: 260, y: 90, w: 170, h: 50 },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.x + Math.sin(frame / 40 + i) * 12,
            top: c.y,
            width: c.w,
            height: c.h,
            borderRadius: 35,
            background: "rgba(255,255,255,0.88)",
            filter: "blur(2px)",
            boxShadow: "0 8px 25px rgba(255,255,255,0.4)",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 380,
          background: "linear-gradient(180deg, #4ADE80 0%, #22C55E 100%)",
          borderRadius: "50% 50% 0 0 / 40px 40px 0 0",
        }}
      />
      <div style={{ position: "absolute", bottom: 330, left: 30, fontSize: 80 }}>🌲</div>
      <div style={{ position: "absolute", bottom: 330, right: 40, fontSize: 100 }}>🌳</div>
      {["🌸", "🌼", "🌷", "🌻", "🌸", "🌼"].map((fl, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: 300 + (i % 2) * 20,
            left: 100 + i * 160,
            fontSize: 32,
          }}
        >
          {fl}
        </div>
      ))}

      {/* ── SMARTPHONE & TANGAN MENGGENGGAM ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: `translateX(-50%) translateY(${phoneY}px) scale(${phoneScale})`,
          zIndex: 20,
          width: 820,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Jari kiri */}
        <div
          style={{
            position: "absolute",
            left: -50,
            top: 260,
            width: 80,
            height: 480,
            zIndex: 35,
            pointerEvents: "none",
          }}
        >
          <svg width="80" height="480" viewBox="0 0 80 480">
            {[70, 160, 250, 340].map((y, idx) => (
              <g key={idx}>
                <rect x="0" y={y} width="70" height="65" rx="28" fill="#E8B088" />
                <ellipse cx="50" cy={y + 32} rx="12" ry="20" fill="#F4CDB2" opacity="0.8" />
                <path
                  d={`M 10,${y + 15} Q 25,${y + 32} 10,${y + 50}`}
                  stroke="#D69B74"
                  strokeWidth="3"
                  fill="none"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Jari kanan */}
        <div
          style={{
            position: "absolute",
            right: -50,
            top: 260,
            width: 80,
            height: 480,
            zIndex: 35,
            pointerEvents: "none",
          }}
        >
          <svg width="80" height="480" viewBox="0 0 80 480">
            {[70, 160, 250, 340].map((y, idx) => (
              <g key={idx}>
                <rect x="10" y={y} width="70" height="65" rx="28" fill="#E8B088" />
                <ellipse cx="30" cy={y + 32} rx="12" ry="20" fill="#F4CDB2" opacity="0.8" />
                <path
                  d={`M 70,${y + 15} Q 55,${y + 32} 70,${y + 50}`}
                  stroke="#D69B74"
                  strokeWidth="3"
                  fill="none"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Body HP */}
        <div
          style={{
            background: "linear-gradient(170deg, #1C1C28 0%, #12121D 100%)",
            border: "4px solid #33334A",
            borderRadius: 48,
            overflow: "hidden",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.08), inset 0 2px 0 rgba(255,255,255,0.12)",
            width: "100%",
            position: "relative",
          }}
        >
          {/* Status Bar */}
          <div
            style={{
              background: "#0E0E18",
              padding: "18px 36px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 18, color: TEXT_DIM, fontWeight: 700 }}>09:41</div>
            <div
              style={{
                width: 100,
                height: 20,
                borderRadius: 10,
                background: "#05050A",
                border: "1px solid #2A2A38",
              }}
            />
            <div style={{ fontSize: 16, color: TEXT_DIM, fontWeight: 600 }}>5G 100% 🔋</div>
          </div>

          {/* DM Header */}
          <div
            style={{
              background: "linear-gradient(90deg, #181826, #1C1C2E)",
              padding: "16px 26px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${WARM_AMBER}, ${TERRACOTTA})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 900,
                color: "#fff",
                boxShadow: `0 0 0 3px ${WARM_AMBER}55`,
              }}
            >
              JN
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: TEXT_LIGHT }}>
                @jagoneliti_
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: EMERALD,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: EMERALD,
                    display: "inline-block",
                  }}
                />
                Online • Siap Bantu Olah Data
              </div>
            </div>
            <div style={{ fontSize: 26 }}>📞</div>
          </div>

          {/* Chat Messages */}
          <div
            style={{
              background: "linear-gradient(180deg, #0F0F1A 0%, #111122 100%)",
              padding: "24px 22px",
              minHeight: 520,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px 20px 20px 6px",
                  padding: "14px 20px",
                  maxWidth: "80%",
                  fontSize: 21,
                  color: TEXT_LIGHT,
                  fontWeight: 500,
                }}
              >
                Hai! Ada data skripsi/TA yang mau dibantu? 😊
              </div>
            </div>

            {frame >= DM_START && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    background: msgSent
                      ? `linear-gradient(135deg, ${WARM_AMBER}, #D97706)`
                      : "rgba(245,158,11,0.18)",
                    border: msgSent ? "none" : `2px dashed ${WARM_AMBER}88`,
                    borderRadius: "20px 20px 6px 20px",
                    padding: "15px 22px",
                    maxWidth: "86%",
                    fontSize: 22,
                    color: msgSent ? "#0A0A10" : TEXT_LIGHT,
                    fontWeight: 700,
                    boxShadow: msgSent ? `0 6px 20px ${WARM_AMBER}44` : "none",
                  }}
                >
                  {displayedDM}
                  {!dmDone && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 22,
                        backgroundColor: dmCursor ? WARM_AMBER : "transparent",
                        marginLeft: 4,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {msgSent && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  fontSize: 16,
                  color: EMERALD,
                  fontWeight: 600,
                  alignItems: "center",
                  gap: 6,
                }}
              >
                ✓✓ Terkirim
              </div>
            )}

            {frame >= 148 && !showReply && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${WARM_AMBER}, ${TERRACOTTA})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 900,
                    color: "#fff",
                  }}
                >
                  JN
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "18px 18px 18px 6px",
                    padding: "14px 20px",
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: TEXT_DIM,
                        opacity: (frame - 148) % 24 > i * 7 ? 1 : 0.3,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {showReply && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 12,
                  transform: `scale(${replySpring})`,
                  opacity: replySpring,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${WARM_AMBER}, ${TERRACOTTA})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 900,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  JN
                </div>
                <div
                  style={{
                    background: `linear-gradient(135deg, ${EMERALD}28, ${EMERALD}12)`,
                    border: `2px solid ${EMERALD}77`,
                    borderRadius: "20px 20px 20px 6px",
                    padding: "16px 22px",
                    maxWidth: "82%",
                    fontSize: 22,
                    color: EMERALD,
                    fontWeight: 700,
                    boxShadow: `0 6px 25px ${EMERALD}33`,
                  }}
                >
                  {displayedReply}
                  {!replyDone && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 22,
                        backgroundColor: replyCursor ? EMERALD : "transparent",
                        marginLeft: 4,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Virtual Keyboard */}
          <div
            style={{
              background: "#131322",
              padding: "16px 20px 24px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              position: "relative",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 30,
                padding: "14px 22px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 18, color: TEXT_DIM, flex: 1 }}>
                {msgSent ? "Ketik pesan..." : ""}
              </div>
              <div style={{ fontSize: 22 }}>😊</div>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${WARM_AMBER}, ${TERRACOTTA})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  color: "#fff",
                }}
              >
                ➤
              </div>
            </div>

            {keyboardRows.map((row, ri) => (
              <div
                key={ri}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                {row.map((k, ki) => {
                  const activeKey =
                    isTyping &&
                    DM_TEXT[dmChars % DM_TEXT.length]?.toUpperCase() === k;
                  return (
                    <div
                      key={ki}
                      style={{
                        background: activeKey
                          ? `linear-gradient(135deg, ${WARM_AMBER}, ${TERRACOTTA})`
                          : "rgba(255,255,255,0.09)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        width:
                          ri === 0
                            ? 54
                            : ri === 1
                            ? 58
                            : k === "⇧" || k === "⌫"
                            ? 72
                            : 56,
                        height: 46,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 17,
                        fontWeight: 700,
                        color: activeKey ? "#fff" : TEXT_LIGHT,
                        boxShadow: activeKey
                          ? `0 4px 15px ${WARM_AMBER}66`
                          : "none",
                      }}
                    >
                      {k}
                    </div>
                  );
                })}
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  position: "absolute",
                  bottom: 25,
                  right: 170,
                  transform: `translateY(${thumbTap}px)`,
                  pointerEvents: "none",
                  zIndex: 40,
                }}
              >
                <svg width="100" height="90" viewBox="0 0 100 90">
                  <path
                    d="M 20,80 C 40,50 60,30 75,25 C 88,20 95,30 90,45 C 85,60 65,85 45,90 Z"
                    fill="#E8B088"
                  />
                  <ellipse cx="78" cy="28" rx="12" ry="8" fill="#F4CDB2" opacity="0.8" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Chin HP & Telapak Tangan */}
        <div style={{ width: "100%", position: "relative", marginTop: -20, zIndex: 10 }}>
          <svg width="820" height="150" viewBox="0 0 820 150">
            <path
              d="M 60,30 C 120,30 200,60 260,150 L 0,150 L 20,70 Z"
              fill="#D69B74"
            />
            <path
              d="M 760,30 C 700,30 620,60 560,150 L 820,150 L 800,70 Z"
              fill="#D69B74"
            />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 4 — Hasil Bersih, Berhasil ACC & CTA (Suasana Ceria & Terang)
// ════════════════════════════════════════════════════════════════════════════
const Scene4_SuccessCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneIn = clamp(frame / 18, 0, 1);

  const boxSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 1.1 },
  });

  const checkProgress = clamp(frame / 30, 0, 1);

  const ctaPulse = interpolate(Math.sin(frame / 12), [-1, 1], [0.98, 1.02]);
  const ctaGlow = interpolate(Math.sin(frame / 10), [-1, 1], [0.5, 1]);

  const floatingIcons = [
    { emoji: "📊", x: 120, y: 150, speed: 0.9, rot: 15 },
    { emoji: "📈", x: 920, y: 180, speed: 1.1, rot: -20 },
    { emoji: "🎓", x: 160, y: 840, speed: 0.8, rot: 12 },
    { emoji: "⭐", x: 900, y: 820, speed: 1.2, rot: -10 },
    { emoji: "✨", x: 200, y: 1460, speed: 1.0, rot: 25 },
    { emoji: "💖", x: 880, y: 1480, speed: 0.9, rot: -15 },
  ];

  const butterflies = [
    { seed: 0, baseY: 320, spanX: 380 },
    { seed: 60, baseY: 760, spanX: 420 },
    { seed: 120, baseY: 1200, spanX: 360 },
  ];

  const confetti = ["🎉", "✨", "⭐", "🌟", "🎊", "🏆", "🥳", "🌈"];

  return (
    <AbsoluteFill style={{ opacity: sceneIn, zIndex: 10 }}>
      {/* ── BACKGROUND CERIA & TERANG ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #FFFBEB 0%, #F0FDF4 30%, #DCFCE7 70%, #FEF9C3 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 60% at 50% 35%, rgba(254,240,138,0.4) 0%, rgba(16,185,129,0.12) 50%, transparent 80%)",
        }}
      />

      {/* Partikel Confetti */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}>
        {confetti.map((p, i) => {
          const x = 50 + ((i * 130 + frame * 0.6) % 980);
          const y = ((frame * (1.3 + (i % 3) * 0.2) + i * 220) % 1920) - 80;
          const rot = (frame * (1.2 + i * 0.2) + i * 45) % 360;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                fontSize: 28 + (i % 3) * 6,
                transform: `rotate(${rot}deg)`,
                opacity: 0.85,
              }}
            >
              {p}
            </div>
          );
        })}
      </div>

      {/* Icon bergerak bebas */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4 }}>
        {floatingIcons.map((ic, i) => {
          const floatY = Math.sin(frame / 20 + i) * 20;
          const floatX = Math.cos(frame / 25 + i) * 15;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: ic.x + floatX,
                top: ic.y + floatY,
                fontSize: 46,
                transform: `rotate(${ic.rot + Math.sin(frame / 18 + i) * 8}deg)`,
                filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.12))",
              }}
            >
              {ic.emoji}
            </div>
          );
        })}
      </div>

      {/* Kupu-kupu terbang lucu */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
        {butterflies.map((b, i) => {
          const t = (frame + b.seed) / 45;
          const bx = 540 + Math.sin(t) * b.spanX;
          const by = b.baseY + Math.cos(t * 1.4) * 80;
          const bRot = Math.cos(t) * 25;
          const flap = Math.abs(Math.sin(frame / 5 + i * 2));
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: bx,
                top: by,
                fontSize: 48,
                transform: `rotate(${bRot}deg)`,
                display: "inline-block",
                filter: "drop-shadow(0 4px 10px rgba(16,185,129,0.35))",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  transform: `scaleX(${0.5 + flap * 0.5})`,
                }}
              >
                🦋
              </span>
            </div>
          );
        })}
      </div>

      {/* ── DUA KOTAK HASIL BERDEKATAN ── */}
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 48,
          right: 48,
          display: "flex",
          flexDirection: "column",
          gap: 22,
          zIndex: 15,
          transform: `scale(${boxSpring})`,
          opacity: boxSpring,
        }}
      >
        {/* KOTAK 1: HASIL BERSIH & ACC */}
        <div
          style={{
            background: "rgba(255,255,255,0.92)",
            border: `3px solid ${EMERALD}`,
            borderRadius: 32,
            padding: "36px 32px",
            textAlign: "center",
            boxShadow: `0 18px 50px rgba(16,185,129,0.22), 0 0 40px rgba(16,185,129,0.15)`,
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${EMERALD}, #059669)`,
              margin: "0 auto 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 8px 30px ${EMERALD}66`,
            }}
          >
            <svg width="56" height="56" viewBox="0 0 60 60">
              <polyline
                points="14,32 26,44 46,18"
                fill="none"
                stroke="#FFF"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="60"
                strokeDashoffset={`${60 - checkProgress * 60}`}
              />
            </svg>
          </div>

          <div
            style={{
              display: "inline-block",
              background: "#ECFDF5",
              color: "#065F46",
              border: `1.5px solid ${EMERALD}`,
              padding: "8px 24px",
              borderRadius: 30,
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: "1px",
              marginBottom: 12,
            }}
          >
            ✅ HASIL SELESAI
          </div>

          <div
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: "#0F172A",
              lineHeight: 1.25,
            }}
          >
            DATASET 100% CLEAN
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${EMERALD}, #059669)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              LANGSUNG ACC DOSEN! 🎓
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 20,
              marginTop: 24,
              paddingTop: 20,
              borderTop: "2px dashed #E2E8F0",
            }}
          >
            {[
              { label: "Data Cleaned", val: "1.500+", color: EMERALD },
              { label: "Error Fixed", val: "100%", color: "#059669" },
              { label: "Status Uji", val: "ACC ✓", color: TERRACOTTA },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "#F8FAFC",
                  borderRadius: 18,
                  padding: "12px 22px",
                  border: "1px solid #E2E8F0",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 16, color: "#64748B", fontWeight: 600 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KOTAK 2: CTA BOX BERDEKATAN */}
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            border: `3.5px solid ${WARM_AMBER}`,
            borderRadius: 32,
            padding: "36px 32px",
            textAlign: "center",
            boxShadow: `0 18px 50px rgba(245,158,11,0.25), 0 0 ${40 * ctaGlow}px ${WARM_AMBER}44`,
            backdropFilter: "blur(20px)",
            transform: `scale(${ctaPulse})`,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#B45309",
              letterSpacing: "1px",
              marginBottom: 10,
            }}
          >
            🔥 SLOT BULANAN SANGAT TERBATAS!
          </div>

          <div
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: "#78350F",
              lineHeight: 1.3,
            }}
          >
            {"DM "}
            <span
              style={{
                color: TERRACOTTA,
                textDecoration: "underline",
                textUnderlineOffset: "6px",
              }}
            >
              @jagoneliti_
            </span>
            <br />
            <span style={{ fontSize: 26, color: "#1E293B", fontWeight: 800 }}>
              SEKARANG SEBELUM FULL BOOKED!
            </span>
          </div>

          <div
            style={{
              marginTop: 22,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              background: `linear-gradient(135deg, ${WARM_AMBER}, ${TERRACOTTA})`,
              color: "#FFF",
              padding: "18px 46px",
              borderRadius: 40,
              fontSize: 28,
              fontWeight: 900,
              boxShadow: `0 8px 30px ${TERRACOTTA}66`,
            }}
          >
            <span>👉</span>
            <span>KLIK LINK DI BIO SEKARANG!</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
