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

// ─── PALETTE ───────────────────────────────────────────────────────────────
const CAMPUS_CREAM = "#FAF6F0";
const CAMPUS_WOOD = "#C9A96E";
const CAMPUS_BOARD_GREEN = "#2D5F3E";
const WARM_AMBER = "#F59E0B";
const TERRACOTTA = "#E05638";
const EMERALD_NEON = "#10B981";
const SOFT_BROWN = "#8B6F47";
const TEXT_DARK = "#2C1810";
const TEXT_MEDIUM = "#5C4A3A";
const TERMINAL_BG = "#1A1A1A";
const TERMINAL_BAR = "#2D2D2D";
const TERMINAL_DIM = "#A1A1AA";
const WARM_CREAM = "#FFF7ED";

// ─── SCENE DURATIONS ────────────────────────────────────────────────────────
// Total: 840 frames = 28 detik @ 30fps
// Untuk perpanjang/persingkat: ubah nilai ini + samakan di Root.tsx
const SCENE1_DUR = 330; // 11 detik
const SCENE2_DUR = 215; // 7.2 detik
const SCENE3_DUR = 295; // 9.8 detik
const SCENE2_START = SCENE1_DUR;           // 330
const SCENE3_START = SCENE1_DUR + SCENE2_DUR; // 545

// ─── AUDIO TIMING (ABSOLUTE FRAMES) ────────────────────────────────────────
// Dihitung manual agar presisi dengan animasi konten
//
// Scene 1 typing: frame 30–155 (dur 125)
const ABS_S1_TYPING_START = 30;
const ABS_S1_TYPING_DUR   = 125;

// Scene 1 error: frame 190–330 (dur 140) — error.mp3 ~74fr, perlu loop
const ABS_S1_ERROR_START  = 190;
const ABS_S1_ERROR_DUR    = 330 - 190; // 140

// Scene 2 whoosh: frame 330–393
const ABS_S2_WHOOSH_START = 330;
const ABS_S2_WHOOSH_DUR   = 63;

// Scene 2 search bar typing: frame 395–539 (dur 144)
// SCENE2_START(330) + SEARCH_START(65) = 395, duration = ceil(36chars/0.25cpp) = 144
const ABS_S2_SEARCH_TYPING_START = 395;
const ABS_S2_SEARCH_TYPING_DUR   = 144;

// Scene 3 typing: frame 567–674 (dur 107)
const ABS_S3_TYPING_START = 567;
const ABS_S3_TYPING_DUR   = 107;

// Scene 3 success: frame 692–803 (dur 111)
const ABS_S3_SUCCESS_START = 692;
const ABS_S3_SUCCESS_DUR   = 111;

// ─── MAIN COMPOSITION ──────────────────────────────────────────────────────
export const InteractiveScene02: React.FC = () => {
  const frame = useCurrentFrame();

  const glowX = interpolate(Math.sin(frame / 45), [-1, 1], [-40, 40]);
  const glowY = interpolate(Math.cos(frame / 55), [-1, 1], [-30, 30]);
  const grainSeed = Math.floor(frame / 4);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: CAMPUS_CREAM,
        fontFamily: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND ─────────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {/* Sunlight dari jendela kelas */}
        <div style={{
          position: "absolute",
          top: `calc(5% + ${glowY}px)`,
          right: `calc(10% + ${glowX * -1}px)`,
          width: 700, height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,223,148,0.35) 0%, rgba(255,200,100,0.12) 40%, transparent 70%)`,
          filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: `calc(15% + ${glowY * -0.6}px)`,
          left: `calc(10% + ${glowX * 0.5}px)`,
          width: 500, height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)`,
          filter: "blur(90px)",
        }} />
        {/* Notebook ruled lines */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(180,160,130,0.12) 59px, rgba(180,160,130,0.12) 60px)`,
          backgroundSize: "100% 60px", opacity: 0.7,
        }} />
        {/* Left margin line merah */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 80, width: 2, backgroundColor: "rgba(224,86,56,0.15)" }} />
        {/* Pin decorations */}
        {[{top:120,left:30,c:TERRACOTTA},{top:200,left:45,c:WARM_AMBER},{top:290,left:25,c:EMERALD_NEON}].map((p,i)=>(
          <div key={i} style={{ position:"absolute", top:p.top, left:p.left, width:12, height:12, borderRadius:"50%", backgroundColor:p.c, opacity:0.4, boxShadow:`0 0 8px ${p.c}33` }} />
        ))}
      </div>

      {/* Paper grain */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' seed='${grainSeed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "256px 256px", mixBlendMode: "multiply",
      }} />

      {/* ─── AUDIO — presisi ke frame animasi ──────────────────────────────
          typing Scene1 : frame 30    → saat karakter pertama muncul
          error         : frame 190   → saat error box muncul, loop krn pendek
          whoosh        : frame 330   → saat transisi ke Scene 2
          typing Scene3 : frame 567   → saat karakter pertama muncul di scene 3
          success       : frame 692   → saat SUCCESS box muncul
      ─────────────────────────────────────────────────────────────────── */}

      <Sequence from={ABS_S1_TYPING_START} durationInFrames={ABS_S1_TYPING_DUR} layout="none">
        <Audio src={staticFile("audio/typing.mp3")} volume={0.65} />
      </Sequence>

      <Sequence from={ABS_S1_ERROR_START} durationInFrames={ABS_S1_ERROR_DUR} layout="none">
        <Audio src={staticFile("audio/error.mp3")} loop volume={0.8} />
      </Sequence>

      <Sequence from={ABS_S2_WHOOSH_START} durationInFrames={ABS_S2_WHOOSH_DUR} layout="none">
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.9} />
      </Sequence>

      <Sequence from={ABS_S2_SEARCH_TYPING_START} durationInFrames={ABS_S2_SEARCH_TYPING_DUR} layout="none">
        <Audio src={staticFile("audio/typing2.mp3")} loop volume={0.65} />
      </Sequence>

      <Sequence from={ABS_S3_TYPING_START} durationInFrames={ABS_S3_TYPING_DUR} layout="none">
        <Audio src={staticFile("audio/typing.mp3")} volume={0.65} />
      </Sequence>

      <Sequence from={ABS_S3_SUCCESS_START} durationInFrames={ABS_S3_SUCCESS_DUR} layout="none">
        <Audio src={staticFile("audio/success.mp3")} volume={1} />
      </Sequence>

      {/* ─── SCENES ──────────────────────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={SCENE1_DUR} layout="none">
        <Scene1_TerminalHook />
      </Sequence>

      <Sequence from={SCENE2_START} durationInFrames={SCENE2_DUR} layout="none">
        <Scene2_BRollSearch />
      </Sequence>

      <Sequence from={SCENE3_START} durationInFrames={SCENE3_DUR} layout="none">
        <Scene3_SolutionCTA />
      </Sequence>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 1 — 330 frames (11 detik)
// Frame  0– 30 : terminal entrance (diam)
// Frame 30–155 : typing command    ← typing.mp3 aktif di sini
// Frame 155–190: jeda baca command
// Frame 190–330: error box tampil  ← error.mp3 loop aktif di sini
//
// Untuk memperpanjang waktu baca error → naikkan SCENE1_DUR
// Untuk memperlambat typing → turunkan charsPerFrame (min 0.15)
// ═══════════════════════════════════════════════════════════════════════════
const Scene1_TerminalHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 20, stiffness: 70, mass: 1.4 } });

  const command = `$ cat skripsi_final_v12_REVISI.docx`;
  const TYPING_START = 30;   // ← ubah untuk geser kapan mulai ngetik
  const CPF = 0.28;          // chars per frame — lebih kecil = lebih pelan

  const typedN = Math.min(command.length, Math.max(0, Math.floor((frame - TYPING_START) * CPF)));
  const displayed = command.slice(0, typedN);
  const typingDone = typedN >= command.length;
  const typingDoneF = TYPING_START + Math.ceil(command.length / CPF); // = 155

  const ERROR_DELAY = 35;    // ← ubah untuk jeda setelah command selesai
  const errorStart = typingDoneF + ERROR_DELAY; // = 190
  const showError = frame >= errorStart;
  const errorRel = frame - errorStart;

  const errorSpring = showError ? spring({ frame: errorRel, fps, config: { damping: 14, stiffness: 110, mass: 1.2 } }) : 0;
  const errorShake = showError
    ? interpolate(Math.sin(errorRel * 1.6), [-1,1], [-4,4], {extrapolateLeft:"clamp",extrapolateRight:"clamp"})
      * Math.max(0, 1 - errorRel / 45)
    : 0;

  const cursorOn = Math.floor(frame / 14) % 2 === 0;
  const blinkOn  = showError ? Math.floor(errorRel / 18) % 2 === 0 : false;

  return (
    <AbsoluteFill style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 40px", paddingBottom:220, zIndex:10 }}>
      <div style={{
        width:"100%", maxWidth:980,
        transform: `scale(${entrance}) translateY(${interpolate(entrance,[0,1],[50,0])}px)`,
        opacity: entrance,
        filter: "drop-shadow(0 20px 60px rgba(44,24,16,0.25))",
      }}>
        {/* Title Bar */}
        <div style={{ background:TERMINAL_BAR, borderRadius:"16px 16px 0 0", padding:"18px 24px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", gap:10 }}>
            {["#FF5F57","#FFBD2E","#28C840"].map((c,i)=>(
              <div key={i} style={{ width:18, height:18, borderRadius:"50%", backgroundColor:c, boxShadow:`0 0 6px ${c}80` }} />
            ))}
          </div>
          <div style={{ flex:1, textAlign:"center", fontSize:22, fontWeight:600, color:TERMINAL_DIM, fontFamily:"'SF Mono','Fira Code',monospace", letterSpacing:"0.5px" }}>
            bash — jagoneliti@macbook-pro: ~
          </div>
        </div>

        {/* Body */}
        <div style={{ background:TERMINAL_BG, borderRadius:"0 0 16px 16px", padding:"36px 32px", minHeight:420, fontFamily:"'SF Mono','Fira Code',monospace", border:"1px solid rgba(255,255,255,0.06)", borderTop:"none" }}>
          <div style={{ fontSize:30, lineHeight:1.8, fontWeight:600, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
            <span style={{ color:WARM_AMBER }}>➜</span>{" "}
            <span style={{ color:"#E2E8F0" }}>{displayed}</span>
            {!typingDone && (
              <span style={{ display:"inline-block", width:14, height:32, backgroundColor:cursorOn?WARM_AMBER:"transparent", marginLeft:2, verticalAlign:"middle", transition:"background-color 0.15s" }} />
            )}
          </div>

          {typingDone && <div style={{ height:20 }} />}

          {showError && (
            <div style={{ transform:`scale(${errorSpring}) translateX(${errorShake}px)`, opacity:errorSpring, marginTop:16 }}>
              <div style={{ background:`linear-gradient(135deg,${TERRACOTTA}22,${TERRACOTTA}11)`, border:`2px solid ${TERRACOTTA}`, borderRadius:14, padding:"28px 28px", boxShadow:`0 0 40px ${TERRACOTTA}33,inset 0 0 30px ${TERRACOTTA}11` }}>
                <div style={{ fontSize:28, fontWeight:800, color:TERRACOTTA, lineHeight:1.7 }}>
                  <span style={{ display:"inline-block", background:TERRACOTTA, color:"#fff", padding:"4px 14px", borderRadius:8, fontSize:24, fontWeight:900, marginRight:12, letterSpacing:"1px" }}>
                    ERROR 404
                  </span>
                  <br />
                  <span style={{ color:WARM_CREAM, marginTop:8, display:"inline-block" }}>Dosen Penguji: Bab 1-3 Tolak Total.</span>
                  <br />
                  <span style={{ color:WARM_AMBER }}>Revisi Latar Belakang!</span>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:20, fontSize:24, color:TERRACOTTA, fontWeight:700, opacity:blinkOn?1:0.4, transition:"opacity 0.2s" }}>
                <span style={{ display:"inline-block", width:10, height:10, borderRadius:"50%", backgroundColor:TERRACOTTA, boxShadow:`0 0 8px ${TERRACOTTA}` }} />
                Process exited with code 1
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 2 — 215 frames (7.2 detik)
// Frame  0– 15 : entrance animation
// Frame 15– 80 : "STUCK DI BAB 1-3?" muncul & terbaca
// Frame 65–210 : search bar typing pelan
// Frame 210–215: semua tertahan terbaca
//
// Untuk memperpanjang → naikkan SCENE2_DUR
// Untuk perlambat search typing → turunkan searchCPF
// ═══════════════════════════════════════════════════════════════════════════
const Scene2_BRollSearch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance   = spring({ frame, fps, config:{ damping:18, stiffness:65, mass:1.5 } });
  const brollSpring = spring({ frame, fps, config:{ damping:14, stiffness:75, mass:1.3 } });

  const searchText = "Cara cepat ACC Bab 1 tanpa revisi...";
  const SEARCH_START = 65;   // ← ubah untuk geser kapan search bar mulai ngetik
  const searchCPF   = 0.25;  // chars per frame
  const searchN = Math.min(searchText.length, Math.max(0, Math.floor((frame - SEARCH_START) * searchCPF)));
  const displayedSearch = searchText.slice(0, searchN);
  const searchCursor = Math.floor(frame / 14) % 2 === 0;

  const FLOAT_DELAY = 15;    // ← ubah kapan teks STUCK muncul
  const showFloat = frame >= FLOAT_DELAY;
  const floatSpring = showFloat ? spring({ frame:frame-FLOAT_DELAY, fps, config:{ damping:16, stiffness:80, mass:1.4 } }) : 0;
  const floatBob = interpolate(Math.sin(frame / 25), [-1,1], [-5,5]);

  return (
    <AbsoluteFill style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 40px", paddingBottom:220, zIndex:10 }}>
      {/* STUCK DI BAB 1-3? */}
      {showFloat && (
        <div style={{ transform:`scale(${floatSpring}) translateY(${floatBob}px)`, opacity:floatSpring, marginBottom:40, textAlign:"center" }}>
          <div style={{ fontSize:72, fontWeight:900, color:TERRACOTTA, letterSpacing:"-1px", textShadow:`0 0 30px ${TERRACOTTA}33,0 4px 15px rgba(44,24,16,0.2)`, lineHeight:1.1 }}>
            STUCK DI
            <br />
            <span style={{ fontSize:88, background:`linear-gradient(135deg,${WARM_AMBER},${TERRACOTTA})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", filter:`drop-shadow(0 0 15px ${WARM_AMBER}33)` }}>
              BAB 1-3?
            </span>
          </div>
        </div>
      )}

      {/* B-Roll frame */}
      <div style={{ transform:`scale(${brollSpring})`, opacity:entrance, width:"100%", maxWidth:860, marginBottom:40 }}>
        <div style={{ border:`4px solid ${CAMPUS_WOOD}`, borderRadius:20, overflow:"hidden", boxShadow:`0 12px 50px rgba(139,111,71,0.25)`, position:"relative" }}>
          <div style={{ width:"100%", height:380, background:`linear-gradient(145deg,#F0E8DA 0%,#E8DFD0 40%,#FAF6F0 70%,#F5EDE0 100%)`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
            {/* Whiteboard */}
            <div style={{ position:"absolute", top:18, left:"50%", transform:"translateX(-50%)", width:"75%", height:90, borderRadius:8, background:CAMPUS_BOARD_GREEN, border:`3px solid ${SOFT_BROWN}`, boxShadow:"0 4px 16px rgba(0,0,0,0.15),inset 0 0 30px rgba(0,0,0,0.2)", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 20px" }}>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:20, fontWeight:600, letterSpacing:1, textAlign:"center" }}>
                📚 Metodologi Penelitian — Bab 1: Latar Belakang
              </div>
            </div>
            {/* Laptop */}
            <div style={{ position:"absolute", bottom:65, left:"50%", transform:"translateX(-50%) perspective(600px) rotateX(5deg)", width:300, height:185, borderRadius:"10px 10px 0 0", background:"linear-gradient(180deg,#E5E7EB,#D1D5DB)", border:"2px solid #9CA3AF", boxShadow:"0 -2px 20px rgba(0,0,0,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:"88%", height:"82%", borderRadius:4, background:"linear-gradient(135deg,#ffffff,#F8FAFC)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:6, border:"1px solid #E2E8F0" }}>
                {[0.8,0.65,0.75,0.55,0.7,0.5].map((w,i)=>(
                  <div key={i} style={{ width:`${w*100}%`, height:6, borderRadius:3, background:`rgba(44,24,16,${0.08+i*0.015})` }} />
                ))}
              </div>
            </div>
            <div style={{ position:"absolute", bottom:38, left:"50%", transform:"translateX(-50%)", width:340, height:27, borderRadius:"0 0 6px 6px", background:"linear-gradient(180deg,#D1D5DB,#9CA3AF)", border:"1px solid #9CA3AF" }} />
            <div style={{ position:"absolute", top:115, right:40, fontSize:65, transform:`rotate(${interpolate(Math.sin(frame/16),[-1,1],[-4,4])}deg)` }}>😫</div>
            <div style={{ position:"absolute", bottom:105, left:50, fontSize:42, opacity:0.85 }}>☕</div>
            <div style={{ position:"absolute", bottom:80, right:42, fontSize:36, transform:"rotate(-8deg)", opacity:0.8 }}>📚</div>
            <div style={{ position:"absolute", bottom:90, left:170, fontSize:30, transform:"rotate(10deg)", opacity:0.6 }}>📝</div>
            <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 80% 20%,rgba(255,223,148,0.2),transparent 60%)`, pointerEvents:"none" }} />
          </div>
          <div style={{ position:"absolute", inset:-2, borderRadius:22, border:`3px solid ${WARM_AMBER}`, opacity:interpolate(Math.sin(frame/18),[-1,1],[0.2,0.55]), pointerEvents:"none" }} />
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ width:"100%", maxWidth:860, transform:`translateY(${interpolate(entrance,[0,1],[30,0])}px)`, opacity:entrance }}>
        <div style={{ background:"rgba(255,255,255,0.92)", borderRadius:16, padding:"22px 28px", display:"flex", alignItems:"center", gap:16, border:`1px solid ${CAMPUS_WOOD}44`, boxShadow:"0 8px 40px rgba(139,111,71,0.15)", backdropFilter:"blur(20px)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={SOFT_BROWN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <div style={{ flex:1, fontSize:28, fontWeight:500, color:TEXT_MEDIUM, fontFamily:"'Inter',system-ui,sans-serif", whiteSpace:"nowrap", overflow:"hidden" }}>
            {displayedSearch}
            <span style={{ display:"inline-block", width:3, height:30, backgroundColor:searchCursor?WARM_AMBER:"transparent", marginLeft:2, verticalAlign:"middle" }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 3 — 295 frames (9.8 detik)
// Frame  0– 22 : terminal entrance (diam, tanpa suara)
// Frame 22–129 : typing command    ← typing.mp3 aktif (abs 567–674)
// Frame 129–147: loading dots
// Frame 147–202: SUCCESS tampil    ← success.mp3 aktif (abs 692–803)
// Frame 202–295: CTA tampil & terbaca
//
// Untuk perpanjang waktu baca SUCCESS → naikkan ctaDelay
// Untuk perpanjang waktu baca CTA    → naikkan SCENE3_DUR
// ═══════════════════════════════════════════════════════════════════════════
const Scene3_SolutionCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config:{ damping:20, stiffness:70, mass:1.4 } });

  const command = `$ npx jagoneliti --solusi-instan`;
  const TYPING_START = 22;   // ← ubah untuk geser kapan mulai ngetik
  const CPF = 0.30;          // chars per frame

  const typedN = Math.min(command.length, Math.max(0, Math.floor((frame - TYPING_START) * CPF)));
  const displayed = command.slice(0, typedN);
  const typingDone = typedN >= command.length;
  const typingDoneF = TYPING_START + Math.ceil(command.length / CPF); // = 129

  const SUCCESS_DELAY = 18;  // ← ubah jeda setelah typing → SUCCESS muncul
  const successStart = typingDoneF + SUCCESS_DELAY; // = 147
  const showSuccess = frame >= successStart;
  const successSpring = showSuccess ? spring({ frame:frame-successStart, fps, config:{ damping:14, stiffness:110, mass:1.2 } }) : 0;

  const CTA_DELAY = 55;      // ← ubah jeda baca SUCCESS sebelum CTA muncul (~1.8 dtk)
  const ctaStart = successStart + CTA_DELAY; // = 202
  const showCTA = frame >= ctaStart;
  const ctaSpring = showCTA ? spring({ frame:frame-ctaStart, fps, config:{ damping:14, stiffness:95, mass:1.2 } }) : 0;
  const ctaGlow = showCTA ? interpolate(Math.sin((frame-ctaStart)/16),[-1,1],[0.5,1]) : 0;

  const cursorOn = Math.floor(frame / 14) % 2 === 0;

  return (
    <AbsoluteFill style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 40px", paddingBottom:220, zIndex:10 }}>
      {/* Terminal */}
      <div style={{ width:"100%", maxWidth:980, transform:`scale(${entrance}) translateY(${interpolate(entrance,[0,1],[40,0])}px)`, opacity:entrance, filter:"drop-shadow(0 20px 60px rgba(44,24,16,0.25))" }}>
        {/* Title Bar */}
        <div style={{ background:TERMINAL_BAR, borderRadius:"16px 16px 0 0", padding:"18px 24px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", gap:10 }}>
            {["#FF5F57","#FFBD2E","#28C840"].map((c,i)=>(
              <div key={i} style={{ width:18, height:18, borderRadius:"50%", backgroundColor:c, boxShadow:`0 0 6px ${c}80` }} />
            ))}
          </div>
          <div style={{ flex:1, textAlign:"center", fontSize:22, fontWeight:600, color:TERMINAL_DIM, fontFamily:"'SF Mono','Fira Code',monospace", letterSpacing:"0.5px" }}>
            bash — jagoneliti@macbook-pro: ~
          </div>
        </div>

        {/* Body */}
        <div style={{ background:TERMINAL_BG, borderRadius:"0 0 16px 16px", padding:"36px 32px", minHeight:350, fontFamily:"'SF Mono','Fira Code',monospace", border:"1px solid rgba(255,255,255,0.06)", borderTop:"none" }}>
          <div style={{ fontSize:30, lineHeight:1.8, fontWeight:600, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
            <span style={{ color:WARM_AMBER }}>➜</span>{" "}
            <span style={{ color:"#E2E8F0" }}>{displayed}</span>
            {!typingDone && (
              <span style={{ display:"inline-block", width:14, height:32, backgroundColor:cursorOn?EMERALD_NEON:"transparent", marginLeft:2, verticalAlign:"middle" }} />
            )}
          </div>

          {/* Loading dots */}
          {typingDone && !showSuccess && (
            <div style={{ marginTop:16, fontSize:28, color:TERMINAL_DIM }}>
              <span>Loading</span>
              {[0,1,2].map(i=>(
                <span key={i} style={{ opacity:(frame-typingDoneF)%28 > i*8 ? 1 : 0.2 }}>.</span>
              ))}
            </div>
          )}

          {/* SUCCESS */}
          {showSuccess && (
            <div style={{ transform:`scale(${successSpring})`, opacity:successSpring, marginTop:20 }}>
              <div style={{ background:`linear-gradient(135deg,${EMERALD_NEON}18,${EMERALD_NEON}08)`, border:`2px solid ${EMERALD_NEON}88`, borderRadius:14, padding:"24px 28px", boxShadow:`0 0 40px ${EMERALD_NEON}22` }}>
                <div style={{ fontSize:28, fontWeight:800, lineHeight:1.7 }}>
                  <span style={{ display:"inline-block", background:EMERALD_NEON, color:"#fff", padding:"4px 14px", borderRadius:8, fontSize:24, fontWeight:900, marginRight:12, letterSpacing:"1px" }}>
                    SUCCESS
                  </span>
                  <br />
                  <span style={{ color:EMERALD_NEON, marginTop:8, display:"inline-block" }}>
                    Konsultasi & Pendampingan Skripsi Ready.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA Box */}
      {showCTA && (
        <div style={{ marginTop:40, width:"100%", maxWidth:980, transform:`scale(${ctaSpring})`, opacity:ctaSpring }}>
          <div style={{ background:`linear-gradient(135deg,rgba(245,158,11,0.1),rgba(224,86,56,0.06))`, border:`3px solid ${WARM_AMBER}`, borderRadius:18, padding:"28px 36px", textAlign:"center", boxShadow:`0 0 ${40*ctaGlow}px ${WARM_AMBER}33,0 10px 40px rgba(139,111,71,0.2)`, fontFamily:"'SF Mono','Fira Code',monospace", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, background:`repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(245,158,11,0.03) 4px,rgba(245,158,11,0.03) 5px)`, pointerEvents:"none" }} />
            <div style={{ fontSize:30, fontWeight:800, color:WARM_AMBER, lineHeight:1.6, position:"relative", zIndex:2 }}>
              <span style={{ color:TERMINAL_DIM, fontSize:26 }}>$</span>{" "}
              <span style={{ color:TEXT_DARK }}>Ketik</span>{" "}
              <span style={{ background:WARM_AMBER, color:"#fff", padding:"4px 16px", borderRadius:8, fontWeight:900, fontSize:32 }}>'DM'</span>{" "}
              <span style={{ color:TEXT_DARK }}>ke</span>{" "}
              <span style={{ color:TERRACOTTA, textDecoration:"underline", textUnderlineOffset:6, fontWeight:900 }}>@jagoneliti_</span>
            </div>
            <div style={{ fontSize:26, fontWeight:700, color:SOFT_BROWN, marginTop:12, position:"relative", zIndex:2 }}>
              untuk Amankan Kuota 🚀
            </div>
            {[
              {top:-2,left:-2,borderTop:`4px solid ${WARM_AMBER}`,borderLeft:`4px solid ${WARM_AMBER}`},
              {top:-2,right:-2,borderTop:`4px solid ${WARM_AMBER}`,borderRight:`4px solid ${WARM_AMBER}`},
              {bottom:-2,left:-2,borderBottom:`4px solid ${WARM_AMBER}`,borderLeft:`4px solid ${WARM_AMBER}`},
              {bottom:-2,right:-2,borderBottom:`4px solid ${WARM_AMBER}`,borderRight:`4px solid ${WARM_AMBER}`},
            ].map((s,i)=>(
              <div key={i} style={{ position:"absolute", width:24, height:24, ...s, opacity:ctaGlow } as React.CSSProperties} />
            ))}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
