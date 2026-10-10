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

// ==========================================
// COLORS & DESIGN TOKENS
// ==========================================

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);


// ==========================================
// 1. FULL-CANVAS SVG BACKGROUNDS
// ==========================================

const NightStudyRoomBg: React.FC<{ redGlow?: number }> = ({ redGlow = 0 }) => (
  <svg
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <defs>
      <linearGradient id="s6WallGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0B1019" />
        <stop offset="55%" stopColor="#0F172A" />
        <stop offset="100%" stopColor="#080E1A" />
      </linearGradient>
      <linearGradient id="s6FloorGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1C1108" />
        <stop offset="100%" stopColor="#0D0904" />
      </linearGradient>
      <linearGradient id="s6DeskGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A16207" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="s6MonitorGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1E1B4B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <radialGradient id="s6RedGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#DC2626" stopOpacity={redGlow * 0.35} />
        <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="s6LampGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
      </radialGradient>
      <filter id="s6Shadow">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.5" />
      </filter>
    </defs>
    <rect width="1080" height="1920" fill="url(#s6WallGrad)" />
    <rect x="800" y="60" width="230" height="320" rx="12" fill="#0B1929" stroke="#1E3A5F" strokeWidth="8" />
    <rect x="814" y="74" width="202" height="292" rx="8" fill="#0D2137" />
    <circle cx="940" cy="150" r="42" fill="#F1F5F9" opacity="0.9" />
    <circle cx="960" cy="138" r="34" fill="#0D2137" />
    <circle cx="820" cy="100" r="3" fill="#F8FAFC" opacity="0.8" />
    <circle cx="870" cy="88" r="2" fill="#F8FAFC" opacity="0.6" />
    <circle cx="990" cy="115" r="2.5" fill="#F8FAFC" opacity="0.7" />
    <rect x="40" y="50" width="360" height="22" rx="5" fill="#B45309" />
    <rect x="55" y="10" width="36" height="42" rx="4" fill="#EF4444" />
    <rect x="96" y="20" width="32" height="32" rx="4" fill="#3B82F6" />
    <rect x="133" y="5" width="40" height="47" rx="4" fill="#10B981" />
    <rect x="178" y="18" width="44" height="34" rx="4" fill="#F59E0B" />
    <rect x="227" y="8" width="36" height="44" rx="4" fill="#8B5CF6" />
    <rect x="268" y="22" width="50" height="30" rx="4" fill="#F43F5E" />
    <circle cx="135" cy="870" r="80" fill="url(#s6LampGlow)" />
    <line x1="135" y1="880" x2="135" y2="780" stroke="#94A3B8" strokeWidth="6" />
    <ellipse cx="135" cy="770" rx="38" ry="18" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="3" />
    <polygon points="0,900 1080,900 1080,1050 0,1050" fill="url(#s6DeskGrad)" />
    <rect x="0" y="900" width="1080" height="148" fill="#1A120A" opacity="0.6" />
    <rect x="480" y="870" width="120" height="36" rx="6" fill="#334155" />
    <rect x="440" y="904" width="200" height="16" rx="6" fill="#475569" />
    <rect x="220" y="460" width="640" height="440" rx="20" fill="#1E293B" filter="url(#s6Shadow)" />
    <rect x="236" y="476" width="608" height="388" rx="14" fill="url(#s6MonitorGrad)" />
    <ellipse cx="540" cy="670" rx="350" ry="220" fill="url(#s6RedGlow)" />
    <ellipse cx="910" cy="926" rx="44" ry="20" fill="#E2E8F0" />
    <rect x="866" y="890" width="88" height="36" rx="12" fill="#D1D5DB" />
    <ellipse cx="910" cy="890" rx="44" ry="18" fill="#7C3AED" />
    <path d="M 954 900 Q 978 912 954 924" stroke="#E2E8F0" strokeWidth="8" fill="none" />
    <path d="M 898 878 Q 895 860 902 848" stroke="#CBD5E1" strokeWidth="4" fill="none" opacity="0.6" strokeLinecap="round" />
    <path d="M 914 875 Q 911 855 920 843" stroke="#CBD5E1" strokeWidth="4" fill="none" opacity="0.5" strokeLinecap="round" />
    <rect x="720" y="876" width="130" height="28" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
    <rect x="715" y="862" width="136" height="18" rx="3" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
    <rect x="722" y="850" width="128" height="16" rx="3" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" />
    <polygon points="0,1050 1080,1050 1080,1920 0,1920" fill="url(#s6FloorGrad)" />
    <line x1="0" y1="1050" x2="1080" y2="1050" stroke="#000000" strokeWidth="6" opacity="0.4" />
  </svg>
);

const LaptopDeskBg: React.FC = () => (
  <svg
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <defs>
      <linearGradient id="s6LdRoom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#050A12" />
        <stop offset="50%" stopColor="#0F172A" />
        <stop offset="100%" stopColor="#080E1A" />
      </linearGradient>
      <linearGradient id="s6LdDesk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="60%" stopColor="#92400E" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#s6LdRoom)" />
    <rect x="80" y="100" width="920" height="22" rx="6" fill="#B45309" />
    <rect x="120" y="30" width="40" height="72" rx="4" fill="#EF4444" />
    <rect x="165" y="42" width="35" height="60" rx="4" fill="#3B82F6" />
    <rect x="205" y="20" width="45" height="82" rx="4" fill="#10B981" />
    <rect x="255" y="35" width="50" height="67" rx="4" fill="#F59E0B" />
    <rect x="310" y="25" width="40" height="77" rx="4" fill="#8B5CF6" />
    <ellipse cx="870" cy="110" rx="40" ry="20" fill="#334155" />
    <path d="M 850 112 Q 820 165 800 225" stroke="#10B981" strokeWidth="6" fill="none" />
    <path d="M 870 112 Q 878 185 885 258" stroke="#059669" strokeWidth="7" fill="none" />
    <path d="M 890 112 Q 920 170 940 232" stroke="#34D399" strokeWidth="6" fill="none" />
    <polygon points="0,530 1080,530 1080,1920 0,1920" fill="url(#s6LdDesk)" />
    <rect x="60" y="590" width="960" height="1200" rx="28" fill="#111827" opacity="0.95" />
    <circle cx="175" cy="720" r="44" fill="#E2E8F0" />
    <circle cx="175" cy="720" r="35" fill="#78350F" />
    <path d="M 214 710 Q 240 722 214 732" stroke="#E2E8F0" strokeWidth="10" fill="none" />
    <rect x="882" y="662" width="80" height="80" rx="4" fill="#FEF08A" transform="rotate(12 882 662)" />
    <rect x="854" y="782" width="90" height="24" rx="6" fill="#F43F5E" />
    <rect x="854" y="816" width="90" height="24" rx="6" fill="#38BDF8" />
  </svg>
);

const MonitorDashboardBg: React.FC = () => (
  <svg
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <defs>
      <linearGradient id="s6DbRoom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#080C15" />
        <stop offset="100%" stopColor="#0A1120" />
      </linearGradient>
      <linearGradient id="s6DbDesk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#92400E" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#s6DbRoom)" />
    <rect x="0" y="0" width="1080" height="640" fill="#0A0F1C" />
    <rect x="490" y="588" width="100" height="56" rx="6" fill="#334155" />
    <rect x="440" y="642" width="200" height="18" rx="6" fill="#475569" />
    <rect x="60" y="140" width="960" height="514" rx="24" fill="#1E293B" />
    <rect x="78" y="158" width="924" height="478" rx="16" fill="#060B14" />
    <polygon points="0,658 1080,658 1080,1920 0,1920" fill="url(#s6DbDesk)" />
    <rect x="0" y="658" width="1080" height="4" fill="#000000" opacity="0.5" />
    <rect x="280" y="700" width="520" height="120" rx="14" fill="#1E293B" stroke="#334155" strokeWidth="3" />
    <ellipse cx="870" cy="760" rx="38" ry="55" fill="#1E293B" stroke="#334155" strokeWidth="3" />
    <line x1="870" y1="705" x2="870" y2="760" stroke="#475569" strokeWidth="3" />
  </svg>
);

const CelebrationBg: React.FC = () => (
  <svg
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <defs>
      <linearGradient id="s6CelebGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#064E3B" />
        <stop offset="45%" stopColor="#065F46" />
        <stop offset="100%" stopColor="#022C22" />
      </linearGradient>
      <linearGradient id="s6StageGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <radialGradient id="s6GreenGlow" cx="50%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#34D399" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#s6CelebGrad)" />
    <ellipse cx="540" cy="640" rx="680" ry="440" fill="url(#s6GreenGlow)" />
    <polygon points="540,640 0,0 180,0" fill="#A7F3D0" opacity="0.07" />
    <polygon points="540,640 380,0 700,0" fill="#A7F3D0" opacity="0.07" />
    <polygon points="540,640 900,0 1080,0" fill="#A7F3D0" opacity="0.07" />
    <rect x="100" y="120" width="22" height="12" rx="3" fill="#EF4444" transform="rotate(25 111 126)" />
    <rect x="280" y="80" width="18" height="26" rx="4" fill="#F59E0B" transform="rotate(-15 289 93)" />
    <rect x="450" y="155" width="24" height="14" rx="3" fill="#10B981" transform="rotate(45 462 162)" />
    <rect x="660" y="105" width="20" height="20" rx="4" fill="#38BDF8" transform="rotate(30 670 115)" />
    <rect x="860" y="145" width="26" height="12" rx="3" fill="#EC4899" transform="rotate(-35 873 151)" />
    <rect x="175" y="310" width="16" height="24" rx="3" fill="#FBBF24" transform="rotate(18 183 322)" />
    <rect x="920" y="285" width="22" height="15" rx="3" fill="#34D399" transform="rotate(-22 931 293)" />
    <polygon points="0,1520 1080,1520 1080,1920 0,1920" fill="#022C22" />
    <rect x="80" y="1480" width="920" height="48" rx="14" fill="url(#s6StageGrad)" />
  </svg>
);

// ==========================================
// 2. CHARACTER SVGs
// ==========================================

export const CharMahasiswaPanik: React.FC = () => (
  <svg
    viewBox="0 0 380 540"
    style={{ width: "360px", height: "520px", display: "block", overflow: "visible" }}
  >
    <defs>
      <filter id="s6CharShadow">
        <feDropShadow dx="0" dy="10" stdDeviation="8" floodOpacity="0.35" />
      </filter>
    </defs>
    <g filter="url(#s6CharShadow)">
      <path d="M 100 300 Q 185 285 270 300 L 285 520 L 85 520 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="4" />
      <polygon points="177,298 197,298 204,420 190,440 176,420" fill="#DC2626" />
      <polygon points="135,300 177,330 157,300" fill="#E2E8F0" />
      <polygon points="245,300 197,330 217,300" fill="#E2E8F0" />
      <rect x="168" y="254" width="44" height="50" rx="6" fill="#FED7AA" />
      <ellipse cx="190" cy="196" rx="68" ry="76" fill="#FFEDD5" stroke="#EA580C" strokeWidth="3" />
      <path d="M 122 172 Q 128 106 192 104 Q 262 104 262 172 Q 228 134 190 138 Q 148 134 122 172 Z" fill="#1E293B" />
      <path d="M 140 160 Q 160 144 178 165" stroke="#1E293B" strokeWidth="5" fill="none" />
      <path d="M 204 165 Q 222 144 242 160" stroke="#1E293B" strokeWidth="5" fill="none" />
      <ellipse cx="158" cy="188" rx="13" ry="17" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
      <circle cx="158" cy="188" r="5" fill="#1E293B" />
      <ellipse cx="222" cy="188" rx="13" ry="17" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
      <circle cx="222" cy="188" r="5" fill="#1E293B" />
      <path d="M 168 232 Q 190 255 212 232 Q 190 222 168 232 Z" fill="#991B1B" stroke="#1E293B" strokeWidth="3" />
      <path d="M 252 148 C 252 140 264 132 264 132 C 264 132 276 140 276 148 C 276 155 270 161 264 161 C 258 161 252 155 252 148 Z" fill="#38BDF8" />
      <path d="M 106 188 C 106 181 116 175 116 175 C 116 175 126 181 126 188 C 126 194 121 200 116 200 C 111 200 106 194 106 188 Z" fill="#38BDF8" />
      <path d="M 110 320 Q 90 370 80 340" stroke="#FFFFFF" strokeWidth="36" strokeLinecap="round" fill="none" />
      <circle cx="78" cy="332" r="14" fill="#FED7AA" />
      <path d="M 268 320 Q 300 360 310 390" stroke="#FFFFFF" strokeWidth="34" strokeLinecap="round" fill="none" />
      <circle cx="314" cy="400" r="14" fill="#FED7AA" />
    </g>
  </svg>
);

const CharMahasiswaSenang: React.FC = () => (
  <svg
    viewBox="0 0 420 580"
    style={{ width: "400px", height: "560px", display: "block", overflow: "visible" }}
  >
    <defs>
      <filter id="s6CelebShadow">
        <feDropShadow dx="0" dy="12" stdDeviation="10" floodOpacity="0.4" />
      </filter>
      <radialGradient id="s6AuraGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#34D399" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="210" cy="290" r="220" fill="url(#s6AuraGrad)" />
    <g filter="url(#s6CelebShadow)">
      <path d="M 108 298 Q 205 282 302 298 L 318 560 L 90 560 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="4" />
      <polygon points="195,296 215,296 222,415 208,435 194,415" fill="#10B981" />
      <polygon points="148,298 195,326 172,298" fill="#E2E8F0" />
      <polygon points="262,298 215,326 238,298" fill="#E2E8F0" />
      <rect x="185" y="252" width="44" height="50" rx="6" fill="#FED7AA" />
      <ellipse cx="207" cy="194" rx="68" ry="76" fill="#FFEDD5" stroke="#EA580C" strokeWidth="3" />
      <path d="M 140 170 Q 146 104 208 102 Q 278 102 275 170 Q 242 132 207 136 Q 162 132 140 170 Z" fill="#1E293B" />
      <path d="M 155 158 Q 175 150 195 160" stroke="#1E293B" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <path d="M 219 160 Q 239 150 260 158" stroke="#1E293B" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <ellipse cx="177" cy="186" rx="10" ry="12" fill="#1E293B" />
      <circle cx="175" cy="182" r="4" fill="#FFFFFF" />
      <ellipse cx="237" cy="186" rx="10" ry="12" fill="#1E293B" />
      <circle cx="235" cy="182" r="4" fill="#FFFFFF" />
      <path d="M 180 230 Q 207 260 234 230" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="155" cy="210" rx="16" ry="10" fill="#FBCFE8" opacity="0.6" />
      <ellipse cx="259" cy="210" rx="16" ry="10" fill="#FBCFE8" opacity="0.6" />
      <path d="M 118 330 Q 110 415 130 440" stroke="#FFFFFF" strokeWidth="38" strokeLinecap="round" fill="none" />
      <rect x="60" y="390" width="120" height="155" rx="10" transform="rotate(-12 60 390)" fill="#10B981" stroke="#059669" strokeWidth="5" />
      <path d="M 72 470 L 95 500 L 145 444" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="rotate(-12 100 470)" />
      <path d="M 295 320 Q 355 380 362 350" stroke="#FFFFFF" strokeWidth="36" strokeLinecap="round" fill="none" />
      <circle cx="365" cy="344" r="16" fill="#FED7AA" />
      <path d="M 365 344 L 360 314" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
      <path d="M 365 344 L 382 320" stroke="#FED7AA" strokeWidth="10" strokeLinecap="round" />
    </g>
  </svg>
);

// ==========================================
// 3. REUSABLE UI COMPONENTS
// ==========================================

const TypewriterText: React.FC<{
  text: string;
  charCount: number;
  style?: React.CSSProperties;
  cursorColor?: string;
}> = ({ text, charCount, style, cursorColor = "#F59E0B" }) => {
  const displayed = text.slice(0, charCount);
  const isTyping = charCount < text.length;
  return (
    <span style={style}>
      {displayed}
      {isTyping && (
        <span
          style={{
            display: "inline-block",
            width: "3px",
            height: "1.1em",
            background: cursorColor,
            marginLeft: "4px",
            verticalAlign: "middle",
          }}
        />
      )}
    </span>
  );
};

const SpeechBubble06: React.FC<{
  children: React.ReactNode;
  side?: "left" | "right";
  bg?: string;
  border?: string;
  tailColor?: string;
  style?: React.CSSProperties;
}> = ({ children, side = "left", bg = "#FFFFFF", border = "#DC2626", tailColor, style }) => {
  const tc = tailColor ?? bg;
  return (
    <div
      style={{
        position: "relative",
        background: bg,
        borderRadius: "28px",
        padding: "28px 36px",
        boxShadow: `0 20px 50px rgba(0,0,0,0.45), 0 0 0 4px ${border}`,
        fontFamily: "system-ui, -apple-system, sans-serif",
        ...style,
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          bottom: "-20px",
          ...(side === "left" ? { left: "56px" } : { right: "56px" }),
          width: 0,
          height: 0,
          borderLeft: "18px solid transparent",
          borderRight: "18px solid transparent",
          borderTop: `22px solid ${tc}`,
        }}
      />
    </div>
  );
};

// ==========================================
// 4. TURNITIN MONITOR OVERLAY (Scene 1)
// ==========================================

const TurnitinMonitorUI: React.FC<{ flashRed?: boolean; frame?: number }> = ({
  flashRed = false,
  frame = 0,
}) => {
  const flashOpacity = flashRed ? 0.6 + Math.sin(frame * 0.4) * 0.4 : 1;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0C0E1A",
        borderRadius: "14px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        fontFamily: "system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          borderBottom: "2px solid #1E293B",
          paddingBottom: "14px",
        }}
      >
        <div
          style={{
            background: "#C1121F",
            color: "#FFFFFF",
            padding: "6px 18px",
            borderRadius: "8px",
            fontWeight: 900,
            fontSize: "22px",
            letterSpacing: "1px",
          }}
        >
          Turnitin
        </div>
        <div style={{ color: "#64748B", fontSize: "16px", fontWeight: 600 }}>
          Similarity Report v2.0
        </div>
        <div
          style={{
            marginLeft: "auto",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#EF4444",
            boxShadow: "0 0 8px #EF4444",
            opacity: flashOpacity,
          }}
        />
      </div>
      <div style={{ color: "#94A3B8", fontSize: "15px" }}>
        {"📄 Skripsi_Bab1_Rev3_Final_FINAL.docx"}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          background: `rgba(220,38,38,${flashRed ? flashOpacity * 0.18 : 0.12})`,
          border: `3px solid rgba(220,38,38,${flashRed ? flashOpacity : 0.6})`,
          borderRadius: "18px",
          gap: "8px",
          boxShadow: flashRed ? `0 0 40px rgba(220,38,38,${flashOpacity * 0.6})` : "none",
        }}
      >
        <div
          style={{
            fontSize: "108px",
            fontWeight: 900,
            lineHeight: 1,
            color: "#EF4444",
            textShadow: flashRed ? `0 0 30px rgba(239,68,68,${flashOpacity})` : "none",
          }}
        >
          68%
        </div>
        <div
          style={{
            background: "#DC2626",
            color: "#FFFFFF",
            padding: "8px 24px",
            borderRadius: "999px",
            fontWeight: 800,
            fontSize: "18px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          {"🚨 CRITICAL — HIGH SIMILARITY"}
        </div>
      </div>
      {[
        { label: "Internet Sources", pct: 38, color: "#EF4444" },
        { label: "Publications", pct: 18, color: "#F97316" },
        { label: "Student Papers", pct: 12, color: "#EAB308" },
      ].map(({ label, pct, color }) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#94A3B8",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <span>{label}</span>
            <span style={{ color }}>{pct}%</span>
          </div>
          <div style={{ height: "8px", background: "#1E293B", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "999px" }} />
          </div>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 5. TURNITIN FILTER SETTINGS UI (Scene 3)
// ==========================================

const TurnitinFilterUI: React.FC<{
  excludeBiblio: boolean;
  excludeQuotes: boolean;
  excludeSmallSources: boolean;
  similarityPct: number;
  cursorX?: number;
  cursorY?: number;
  showCursor?: boolean;
}> = ({ excludeBiblio, excludeQuotes, excludeSmallSources, similarityPct, cursorX = 0, cursorY = 0, showCursor = false }) => {
  const pctColor = similarityPct > 30 ? "#EF4444" : similarityPct > 15 ? "#F97316" : "#10B981";
  const barBg =
    similarityPct > 30
      ? "linear-gradient(90deg,#DC2626,#EF4444)"
      : similarityPct > 15
      ? "linear-gradient(90deg,#EA580C,#F97316)"
      : "linear-gradient(90deg,#059669,#10B981)";

  return (
    <div
      style={{
        width: "100%",
        background: "#0C0E1A",
        borderRadius: "14px",
        padding: "22px",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "18px",
          borderBottom: "2px solid #1E293B",
          paddingBottom: "14px",
        }}
      >
        <div
          style={{
            background: "#C1121F",
            color: "#FFFFFF",
            padding: "5px 16px",
            borderRadius: "6px",
            fontWeight: 900,
            fontSize: "20px",
          }}
        >
          Turnitin
        </div>
        <div style={{ color: "#64748B", fontSize: "15px", fontWeight: 600 }}>
          {"⚙️ Filter & Settings"}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          background: "#111827",
          borderRadius: "14px",
          padding: "16px 20px",
          marginBottom: "18px",
          border: `2px solid ${pctColor}`,
          boxShadow: `0 0 20px ${pctColor}33`,
        }}
      >
        <div
          style={{
            fontSize: "74px",
            fontWeight: 900,
            color: pctColor,
            lineHeight: 1,
            minWidth: "160px",
            textAlign: "center",
          }}
        >
          {Math.round(similarityPct)}%
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ color: "#94A3B8", fontSize: "13px", fontWeight: 700 }}>SIMILARITY SCORE</div>
          <div style={{ height: "22px", background: "#1E293B", borderRadius: "999px", overflow: "hidden" }}>
            <div
              style={{
                width: `${similarityPct}%`,
                height: "100%",
                background: barBg,
                borderRadius: "999px",
              }}
            />
          </div>
          <div style={{ color: pctColor, fontSize: "14px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
            {similarityPct > 30
              ? "🚨 CRITICAL — REVISI SEGERA"
              : similarityPct > 15
              ? "⚠️ MODERATE — PERLU PERBAIKAN"
              : "✅ AMAN — LULUS CEK TURNITIN"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {[
          { id: "bib", label: "Exclude Bibliography", sub: "Daftar Pustaka & Referensi tidak di-scan", active: excludeBiblio, emoji: "📚" },
          { id: "quotes", label: "Exclude Quotes", sub: 'Kutipan langsung (tanda " ") dikeluarkan', active: excludeQuotes, emoji: "💬" },
          { id: "small", label: "Exclude Small Sources", sub: "Sumber < 8 kata diabaikan", active: excludeSmallSources, emoji: "🔍" },
        ].map(({ id, label, sub, active, emoji }) => (
          <div
            key={id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              background: active ? "#052E16" : "#111827",
              border: `2px solid ${active ? "#10B981" : "#334155"}`,
              borderRadius: "14px",
              padding: "14px 18px",
            }}
          >
            <span style={{ fontSize: "26px" }}>{emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: active ? "#A7F3D0" : "#CBD5E1", fontWeight: 800, fontSize: "17px" }}>{label}</div>
              <div style={{ color: "#64748B", fontSize: "13px", marginTop: "2px" }}>{sub}</div>
            </div>
            <div
              style={{
                width: "52px",
                height: "28px",
                background: active ? "#10B981" : "#334155",
                borderRadius: "999px",
                position: "relative",
                boxShadow: active ? "0 0 12px #10B98188" : "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  left: active ? "26px" : "4px",
                  width: "20px",
                  height: "20px",
                  background: "#FFFFFF",
                  borderRadius: "50%",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {showCursor && (
        <div
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            width: "24px",
            height: "24px",
            pointerEvents: "none",
            zIndex: 99,
          }}
        >
          <svg viewBox="0 0 24 24" width="32" height="32">
            <path
              d="M 5 3 L 5 19 L 9 15 L 13 23 L 15 22 L 11 14 L 17 14 Z"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

// Component: File Explorer Berisi Ratusan Jurnal Skripsi
const FileExplorerJurnal: React.FC<{ frame: number }> = ({ frame }) => {
  void frame;
  const journals = [
    { name: "IEEE_Trans_NLP_Attention_Mechanism_2023.pdf", size: "3.8 MB", date: "14/09/2024", tag: "SCOPUS Q1", color: "#3B82F6" },
    { name: "Elsevier_Systematic_Literature_Review_Method.pdf", size: "2.4 MB", date: "10/09/2024", tag: "SCOPUS Q1", color: "#3B82F6" },
    { name: "Springer_Machine_Learning_Evaluation_Metrics.pdf", size: "4.1 MB", date: "05/09/2024", tag: "SCOPUS Q2", color: "#60A5FA" },
    { name: "Sugiyono_Metode_Penelitian_Kuantitatif_Kualitatif.pdf", size: "8.2 MB", date: "28/08/2024", tag: "BUKU WAJIB", color: "#F59E0B" },
    { name: "Jurnal_Sinta2_Pendidikan_Teknologi_Informasi.pdf", size: "1.7 MB", date: "20/08/2024", tag: "SINTA 2", color: "#10B981" },
    { name: "ACM_Computing_Surveys_State_Of_The_Art.pdf", size: "5.3 MB", date: "15/08/2024", tag: "SCOPUS Q1", color: "#3B82F6" },
    { name: "Scopus_Q1_Deep_Learning_Framework_Final.pdf", size: "3.1 MB", date: "08/08/2024", tag: "SCOPUS Q1", color: "#3B82F6" },
    { name: "Daftar_Pustaka_Lengkap_140_Referensi_Bab2.pdf", size: "920 KB", date: "02/08/2024", tag: "DAFPUS", color: "#EF4444" },
    { name: "Harvard_Business_Review_Digital_Transformation.pdf", size: "2.9 MB", date: "26/07/2024", tag: "INTL REF", color: "#8B5CF6" },
    { name: "Wiley_Data_Science_Foundations_Handbook.pdf", size: "6.7 MB", date: "18/07/2024", tag: "HANDBOOK", color: "#F59E0B" },
    { name: "Taylor_Francis_Qualitative_Data_Analysis.pdf", size: "3.5 MB", date: "12/07/2024", tag: "SCOPUS Q2", color: "#60A5FA" },
    { name: "Oxford_Academic_Research_Methods_Review.pdf", size: "2.8 MB", date: "04/07/2024", tag: "OXFORD", color: "#8B5CF6" },
    { name: "Sinta1_Jurnal_Ilmiah_Sistem_Informasi_Nasional.pdf", size: "1.9 MB", date: "29/06/2024", tag: "SINTA 1", color: "#10B981" },
    { name: "Nature_Machine_Intelligence_Survey_Paper.pdf", size: "4.5 MB", date: "21/06/2024", tag: "NATURE", color: "#EC4899" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "20px",
        overflow: "hidden",
        border: "2px solid #334155",
        background: "#0A0F1D",
        boxShadow: "0 25px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* 1. Window Title Bar */}
      <div
        style={{
          height: "48px",
          background: "#1E293B",
          borderBottom: "1px solid #334155",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#EF4444", display: "inline-block" }} />
            <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#F59E0B", display: "inline-block" }} />
            <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "10px" }}>
            <span style={{ fontSize: "18px" }}>📁</span>
            <span style={{ color: "#E2E8F0", fontSize: "14px", fontWeight: 700, letterSpacing: "0.4px" }}>
              File Explorer — Kumpulan_Jurnal_Skripsi_Final (847 Dokumen)
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "#94A3B8", fontSize: "13px" }}>
          <span style={{ background: "#334155", padding: "2px 10px", borderRadius: "6px", color: "#38BDF8", fontWeight: 800 }}>
            847 ITEMS
          </span>
          <span style={{ cursor: "pointer", fontWeight: 700 }}>—</span>
          <span style={{ cursor: "pointer", fontWeight: 700 }}>□</span>
          <span style={{ cursor: "pointer", color: "#EF4444", fontWeight: 700 }}>✕</span>
        </div>
      </div>

      {/* 2. Address / Path bar & Navigation */}
      <div
        style={{
          height: "48px",
          background: "#0F172A",
          borderBottom: "1px solid #1E293B",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "0 16px",
        }}
      >
        <div style={{ display: "flex", gap: "6px", color: "#94A3B8", fontSize: "15px" }}>
          <span style={{ background: "#1E293B", padding: "4px 8px", borderRadius: "6px" }}>←</span>
          <span style={{ background: "#1E293B", padding: "4px 8px", borderRadius: "6px" }}>→</span>
          <span style={{ background: "#1E293B", padding: "4px 8px", borderRadius: "6px" }}>↑</span>
        </div>

        {/* Path breadcrumb */}
        <div
          style={{
            flex: 1,
            height: "32px",
            background: "#1E293B",
            borderRadius: "6px",
            border: "1px solid #334155",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: "8px",
            fontSize: "13px",
            color: "#CBD5E1",
          }}
        >
          <span>📂</span>
          <span style={{ color: "#64748B" }}>This PC</span>
          <span style={{ color: "#475569" }}>›</span>
          <span style={{ color: "#64748B" }}>Documents</span>
          <span style={{ color: "#475569" }}>›</span>
          <span style={{ color: "#64748B" }}>Skripsi_2024</span>
          <span style={{ color: "#475569" }}>›</span>
          <span style={{ color: "#38BDF8", fontWeight: 700 }}>📚 847_Jurnal_Referensi_Bab2</span>
        </div>

        {/* Search input */}
        <div
          style={{
            width: "240px",
            height: "32px",
            background: "#1E293B",
            borderRadius: "6px",
            border: "1px solid #334155",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            gap: "8px",
            fontSize: "12px",
            color: "#94A3B8",
          }}
        >
          <span>🔍</span>
          <span style={{ color: "#64748B" }}>Search 847 files...</span>
        </div>
      </div>

      {/* 3. Main Explorer Body (Sidebar + File List) */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "250px",
            background: "#080E1A",
            borderRight: "1px solid #1E293B",
            padding: "14px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            fontSize: "13px",
          }}
        >
          <div style={{ color: "#64748B", fontSize: "11px", fontWeight: 800, letterSpacing: "1px", padding: "4px 8px" }}>
            FOLDER SKRIPSI
          </div>
          {[
            { icon: "⭐️", name: "Kumpulan Jurnal", count: 847, active: true },
            { icon: "📁", name: "Bab 1 Pendahuluan", count: 18, active: false },
            { icon: "📁", name: "Bab 2 Tinjauan Pustaka", count: 430, active: false },
            { icon: "📁", name: "Jurnal Scopus Q1-Q4", count: 220, active: false },
            { icon: "📁", name: "Jurnal Sinta 1-3", count: 145, active: false },
            { icon: "📁", name: "Buku & Prosiding", count: 34, active: false },
            { icon: "📁", name: "Draft Skripsi Final V38", count: 38, active: false },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                borderRadius: "8px",
                background: item.active ? "rgba(59, 130, 246, 0.2)" : "transparent",
                border: item.active ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid transparent",
                color: item.active ? "#60A5FA" : "#CBD5E1",
                fontWeight: item.active ? 700 : 500,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>{item.icon}</span>
                <span style={{ fontSize: "12px" }}>{item.name}</span>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  padding: "1px 6px",
                  borderRadius: "999px",
                  background: item.active ? "#2563EB" : "#1E293B",
                  color: item.active ? "#FFFFFF" : "#94A3B8",
                  fontWeight: 700,
                }}
              >
                {item.count}
              </span>
            </div>
          ))}

          {/* Storage card widget at bottom of sidebar */}
          <div
            style={{
              marginTop: "auto",
              background: "#0F172A",
              border: "1px solid #1E293B",
              borderRadius: "10px",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94A3B8" }}>
              <span>Skripsi Drive</span>
              <span style={{ color: "#38BDF8", fontWeight: 700 }}>847 PDFs</span>
            </div>
            <div style={{ width: "100%", height: "6px", background: "#1E293B", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ width: "85%", height: "100%", background: "linear-gradient(90deg, #3B82F6, #EC4899)" }} />
            </div>
            <div style={{ fontSize: "10px", color: "#64748B" }}>1.42 GB of 2.0 GB used</div>
          </div>
        </div>

        {/* Main Files Table */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#0B1120" }}>
          {/* Table Header */}
          <div
            style={{
              height: "36px",
              borderBottom: "1px solid #1E293B",
              background: "#0F172A",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#64748B",
            }}
          >
            <div style={{ flex: 4, display: "flex", alignItems: "center", gap: "6px" }}>
              <span>Nama File (847 Dokumen)</span>
              <span style={{ color: "#3B82F6" }}>↓</span>
            </div>
            <div style={{ flex: 2 }}>Tanggal Revisi</div>
            <div style={{ flex: 1.5 }}>Kategori</div>
            <div style={{ flex: 1, textAlign: "right" }}>Ukuran</div>
          </div>

          {/* Table Rows */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {journals.map((j, i) => {
              const isSelected = i < 6 || i === 7;
              return (
                <div
                  key={i}
                  style={{
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 14px",
                    borderBottom: "1px solid rgba(30, 41, 59, 0.6)",
                    background: isSelected ? "rgba(59, 130, 246, 0.09)" : i % 2 === 0 ? "rgba(15, 23, 42, 0.4)" : "transparent",
                    borderLeft: isSelected ? "3px solid #3B82F6" : "3px solid transparent",
                    fontSize: "12px",
                  }}
                >
                  {/* File Name + PDF icon */}
                  <div style={{ flex: 4, display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    <svg viewBox="0 0 28 32" width="20" height="24" style={{ flexShrink: 0 }}>
                      <path d="M 4 2 L 18 2 L 24 8 L 24 30 L 4 30 Z" fill="#DC2626" />
                      <polygon points="18,2 24,8 18,8" fill="#FCA5A5" />
                      <rect x="7" y="14" width="14" height="10" rx="2" fill="#FFFFFF" />
                      <text x="8" y="21" fill="#DC2626" fontSize="6" fontWeight="900" fontFamily="sans-serif">
                        PDF
                      </text>
                    </svg>

                    <span
                      style={{
                        color: isSelected ? "#F8FAFC" : "#CBD5E1",
                        fontWeight: isSelected ? 700 : 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {j.name}
                    </span>
                  </div>

                  {/* Date */}
                  <div style={{ flex: 2, color: "#64748B", fontSize: "11px" }}>{j.date}</div>

                  {/* Tag */}
                  <div style={{ flex: 1.5 }}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: `${j.color}22`,
                        color: j.color,
                        border: `1px solid ${j.color}55`,
                      }}
                    >
                      {j.tag}
                    </span>
                  </div>

                  {/* Size */}
                  <div style={{ flex: 1, textAlign: "right", color: "#94A3B8", fontSize: "11px", fontWeight: 600 }}>
                    {j.size}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Alert / Status bar */}
          <div
            style={{
              height: "46px",
              background: "#080E1A",
              borderTop: "1px solid #1E293B",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              fontSize: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#CBD5E1" }}>
              <span style={{ fontSize: "14px" }}>📚</span>
              <span>
                <strong style={{ color: "#38BDF8" }}>847 file jurnal</strong> terpilih di direktori skripsi
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(220, 38, 38, 0.2)",
                border: "1px solid rgba(220, 38, 38, 0.6)",
                padding: "4px 12px",
                borderRadius: "999px",
                color: "#FCA5A5",
                fontWeight: 700,
                fontSize: "11px",
              }}
            >
              <span>⚠️</span>
              <span>Semua referensi ini ikut terhitung jika belum difilter!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. SCENES
// ==========================================

// SCENE 1: Hook — Panik Turnitin 68% Merah (Frames 0-210)
const Scene1_PanikTurnitin: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popSpring = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 130 } });
  void popSpring;
  const monitorSpring = spring({ frame: frame - 5, fps, config: { damping: 16, stiffness: 110 } });
  const explorerSpring = spring({ frame: frame - 8, fps, config: { damping: 15, stiffness: 115 } });
  const bubbleSpring = spring({ frame: frame - 60, fps, config: { damping: 14, stiffness: 130 } });
  const titleScale = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 150 } });

  const bubbleText = "HAH?! Padahal ngetik sendiri, kok Turnitin bisa 68% merah?!";
  const bubbleChars = Math.floor(
    interpolate(frame, [60, 145], [0, bubbleText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const redFlash = clamp(interpolate(frame, [30, 60], [0, 1]), 0, 1);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <NightStudyRoomBg redGlow={redFlash} />

      {/* Top kinetic banner */}
      <div
        style={{
          position: "absolute",
          top: "72px",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          transform: `scale(${titleScale})`,
          zIndex: 40,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#DC2626 0%,#991B1B 100%)",
            color: "#FFFFFF",
            padding: "14px 36px",
            borderRadius: "20px",
            boxShadow: "0 12px 30px rgba(220,38,38,0.55),0 0 0 4px #FEE2E2",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <span style={{ fontSize: "34px" }}>{"🚨"}</span>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 900,
              letterSpacing: "1px",
              fontFamily: "system-ui, sans-serif",
              textTransform: "uppercase",
            }}
          >
            TURNITIN MERAH PADAHAL NGGAK PLAGIAT?
          </span>
        </div>
        <div
          style={{
            background: "rgba(15,23,42,0.88)",
            color: "#FDE68A",
            padding: "8px 28px",
            borderRadius: "999px",
            fontSize: "21px",
            fontWeight: 800,
            border: "2px solid #F59E0B",
            backdropFilter: "blur(8px)",
          }}
        >
          {"⚡ Kenali penyebabnya dalam 30 detik!"}
        </div>
      </div>

      {/* Monitor with Turnitin UI */}
      <div
        style={{
          position: "absolute",
          top: "236px",
          left: "220px",
          width: "640px",
          height: "388px",
          transform: `scale(${monitorSpring})`,
          zIndex: 30,
        }}
      >
        <TurnitinMonitorUI flashRed={frame > 30} frame={frame} />
      </div>

      {/* File Explorer Berisi Ratusan Jurnal di bagian bawah (mengisi area hitam) */}
      <div
        style={{
          position: "absolute",
          top: "930px",
          left: "40px",
          width: "1000px",
          height: "930px",
          transform: `scale(${explorerSpring})`,
          zIndex: 35,
        }}
      >
        <FileExplorerJurnal frame={frame} />
      </div>

      {/* Speech bubble */}
      {frame >= 60 && (
        <div
          style={{
            position: "absolute",
            top: "710px",
            left: "30px",
            right: "30px",
            transform: `scale(${bubbleSpring})`,
            zIndex: 38,
          }}
        >
          <SpeechBubble06
            side="right"
            bg="#1E293B"
            border="#38BDF8"
            tailColor="#1E293B"
            style={{ color: "#FFFFFF" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#334155",
                color: "#38BDF8",
                padding: "4px 14px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 800,
                letterSpacing: "1px",
                marginBottom: "10px",
                textTransform: "uppercase",
              }}
            >
              {"🎓 MAHASISWA"}
            </div>
            <div style={{ fontSize: "24px", fontWeight: 700, lineHeight: 1.4 }}>
              <TypewriterText text={bubbleText} charCount={bubbleChars} cursorColor="#38BDF8" />
            </div>
          </SpeechBubble06>
        </div>
      )}
    </AbsoluteFill>
  );
};

// SCENE 2: Penyebab Konyol — Laptop Transition (Frames 210-450)
const Scene2_PenyebabKonyol: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const laptopSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });
  const chatSpring = spring({ frame: frame - 22, fps, config: { damping: 14, stiffness: 122 } });
  const badgeSpring = spring({ frame: frame - 70, fps, config: { damping: 13, stiffness: 130 } });
  const c1Spring = spring({ frame: frame - 100, fps, config: { damping: 14, stiffness: 115 } });
  const c2Spring = spring({ frame: frame - 130, fps, config: { damping: 14, stiffness: 115 } });
  const c3Spring = spring({ frame: frame - 160, fps, config: { damping: 14, stiffness: 115 } });

  const chatMsg = "CEK FILTER TURNITIN-MU! Cover, Daftar Pustaka, & Nama Kampus ikut ke-scan!";
  const chatChars = Math.floor(
    interpolate(frame, [22, 110], [0, chatMsg.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const causes = [
    { icon: "📄", title: "Cover Page", desc: "Judul, nama, NIM ikut dihitung similarity", spring: c1Spring },
    { icon: "📚", title: "Daftar Pustaka", desc: "Referensi buku & jurnal = kontributor terbesar!", spring: c2Spring },
    { icon: "🏛️", title: "Nama Institusi", desc: "Logo & nama kampus bisa ter-detect sebagai match", spring: c3Spring },
  ];

  const hintOpacity = interpolate(frame, [160, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LaptopDeskBg />

      {/* Top kinetic badge */}
      <div
        style={{
          position: "absolute",
          top: "68px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${badgeSpring})`,
          zIndex: 40,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#F59E0B 0%,#B45309 100%)",
            color: "#0F172A",
            padding: "14px 36px",
            borderRadius: "20px",
            boxShadow: "0 12px 30px rgba(245,158,11,0.45),0 0 0 4px #FEF3C7",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontWeight: 900,
            fontSize: "26px",
            letterSpacing: "1px",
            fontFamily: "system-ui, sans-serif",
            textTransform: "uppercase",
          }}
        >
          <span>{"⚠️"}</span>
          <span>Penyebab Konyol Similarity Membengkak!</span>
        </div>
      </div>

      {/* Laptop frame */}
      <div
        style={{
          position: "absolute",
          top: "300px",
          left: "60px",
          width: "960px",
          transform: `scale(${laptopSpring})`,
          zIndex: 30,
        }}
      >
        <div
          style={{
            background: "#1E293B",
            borderRadius: "24px 24px 0 0",
            padding: "18px 18px 0",
            boxShadow: "0 30px 70px rgba(0,0,0,0.65),0 0 0 4px #475569",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "#334155",
              borderRadius: "50%",
              margin: "0 auto 10px auto",
              border: "1px solid #64748B",
            }}
          />
          <div
            style={{
              background: "#0A0F1C",
              borderRadius: "14px 14px 0 0",
              padding: "22px",
              border: "2px solid #334155",
              minHeight: "1060px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {/* Browser bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#1E293B",
                borderRadius: "10px",
                padding: "10px 16px",
              }}
            >
              {(["#EF4444", "#F59E0B", "#10B981"] as string[]).map((col) => (
                <div key={col} style={{ width: "13px", height: "13px", borderRadius: "50%", background: col }} />
              ))}
              <div
                style={{
                  flex: 1,
                  background: "#0F172A",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  color: "#64748B",
                  fontSize: "14px",
                }}
              >
                {"💬 Chat @jagoneliti_"}
              </div>
            </div>

            {/* Chat message */}
            {frame >= 22 && (
              <div style={{ transform: `scale(${chatSpring})`, display: "flex", flexDirection: "column", gap: "6px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#10B981",
                    fontSize: "16px",
                    fontWeight: 800,
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "#10B981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                    }}
                  >
                    {"🎓"}
                  </div>
                  @jagoneliti_
                  <span
                    style={{
                      background: "#065F46",
                      color: "#A7F3D0",
                      padding: "2px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 900,
                    }}
                  >
                    {"✓ VERIFIED"}
                  </span>
                </div>
                <div
                  style={{
                    background: "#1A2744",
                    border: "2px solid #38BDF8",
                    borderRadius: "0 18px 18px 18px",
                    padding: "18px 22px",
                    color: "#F1F5F9",
                    fontSize: "22px",
                    fontWeight: 700,
                    lineHeight: 1.4,
                    boxShadow: "0 8px 24px rgba(56,189,248,0.2)",
                    maxWidth: "860px",
                  }}
                >
                  <TypewriterText text={chatMsg} charCount={chatChars} cursorColor="#38BDF8" />
                </div>
              </div>
            )}

            {/* Cause cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "10px" }}>
              {causes.map(({ icon, title, desc, spring: cs }, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    background: "#111827",
                    border: "2px solid #F59E0B",
                    borderRadius: "16px",
                    padding: "16px 20px",
                    transform: `scale(${cs}) translateX(${interpolate(cs, [0, 1], [-30, 0])}px)`,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                  }}
                >
                  <span style={{ fontSize: "36px" }}>{icon}</span>
                  <div>
                    <div style={{ color: "#FDE68A", fontWeight: 900, fontSize: "21px" }}>{title}</div>
                    <div style={{ color: "#94A3B8", fontSize: "16px", marginTop: "3px" }}>{desc}</div>
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      background: "#7F1D1D",
                      color: "#FCA5A5",
                      padding: "4px 14px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      fontWeight: 800,
                    }}
                  >
                    MERAH!
                  </div>
                </div>
              ))}
            </div>

            {/* Tip hint */}
            {frame >= 160 && (
              <div
                style={{
                  background: "#1E293B",
                  border: "2px dashed #F59E0B",
                  borderRadius: "14px",
                  padding: "14px 18px",
                  color: "#FDE68A",
                  fontSize: "18px",
                  fontWeight: 700,
                  textAlign: "center",
                  opacity: hintOpacity,
                }}
              >
                {"💡 Tenang! Ada trik filter EXCLUDE yang bisa langsung nurunin similarity-mu!"}
              </div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// SCENE 3: Simulasi Setting Filter Exclude (Frames 450-690)
const Scene3_FilterExclude: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 130 } });
  const panelSpring = spring({ frame: frame - 10, fps, config: { damping: 15, stiffness: 110 } });
  const bubbleSpring = spring({ frame: frame - 150, fps, config: { damping: 13, stiffness: 120 } });
  const successSpring = spring({ frame: frame - 118, fps, config: { damping: 12, stiffness: 140 } });

  const excludeBiblio = frame >= 20;
  const excludeQuotes = frame >= 50;
  const excludeSmallSources = frame >= 80;

  const simPct =
    frame < 20
      ? 68
      : frame < 50
      ? interpolate(frame, [20, 48], [68, 42], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : frame < 80
      ? interpolate(frame, [50, 78], [42, 27], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : interpolate(frame, [80, 118], [27, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cursorY =
    frame < 20
      ? 130
      : frame < 50
      ? interpolate(frame, [20, 48], [130, 196], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : frame < 80
      ? 196
      : interpolate(frame, [80, 108], [196, 262], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const clickFlash =
    (frame >= 19 && frame <= 26) ||
    (frame >= 49 && frame <= 56) ||
    (frame >= 79 && frame <= 86);

  const stepLabel =
    frame < 20
      ? "Buka Settings > Filter & Exclude"
      : frame < 50
      ? "✅ Exclude Bibliography diaktifkan! Similarity: 42%"
      : frame < 80
      ? "✅ Exclude Quotes diaktifkan! Similarity: 27%"
      : frame < 118
      ? "✅ Exclude Small Sources diaktifkan! Similarity: 14%"
      : "🟢 Semua filter aktif! Similarity aman!";

  const stepColor = frame < 20 ? "#F59E0B" : frame < 118 ? "#38BDF8" : "#10B981";
  const bubbleText = "Wah gila! Langsung aman 14% sekali klik!";
  const bubbleChars = Math.floor(
    interpolate(frame, [150, 210], [0, bubbleText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <MonitorDashboardBg />

      {/* Top title */}
      <div
        style={{
          position: "absolute",
          top: "66px",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          transform: `scale(${titleSpring})`,
          zIndex: 40,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#0EA5E9 0%,#0284C7 100%)",
            color: "#FFFFFF",
            padding: "14px 36px",
            borderRadius: "20px",
            boxShadow: "0 12px 30px rgba(14,165,233,0.45),0 0 0 4px #BAE6FD",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontWeight: 900,
            fontSize: "24px",
            letterSpacing: "1px",
            fontFamily: "system-ui, sans-serif",
            textTransform: "uppercase",
          }}
        >
          <span>{"⚙️"}</span>
          <span>Simulasi: Setting Filter Exclude Turnitin</span>
        </div>
        <div
          style={{
            background: "rgba(15,23,42,0.9)",
            color: stepColor,
            padding: "8px 24px",
            borderRadius: "999px",
            fontSize: "18px",
            fontWeight: 800,
            border: `2px solid ${stepColor}`,
            backdropFilter: "blur(8px)",
          }}
        >
          {stepLabel}
        </div>
      </div>

      {/* Filter panel inside monitor */}
      <div
        style={{
          position: "absolute",
          top: "158px",
          left: "78px",
          width: "924px",
          height: "478px",
          transform: `scale(${panelSpring})`,
          zIndex: 30,
          overflow: "hidden",
          borderRadius: "14px",
        }}
      >
        <TurnitinFilterUI
          excludeBiblio={excludeBiblio}
          excludeQuotes={excludeQuotes}
          excludeSmallSources={excludeSmallSources}
          similarityPct={simPct}
          cursorX={840}
          cursorY={cursorY}
          showCursor
        />
        {clickFlash && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.12)",
              pointerEvents: "none",
              borderRadius: "14px",
            }}
          />
        )}
      </div>

      {/* Klik badge */}
      {clickFlash && (
        <div
          style={{
            position: "absolute",
            top: "580px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#F59E0B",
            color: "#0F172A",
            padding: "10px 30px",
            borderRadius: "999px",
            fontWeight: 900,
            fontSize: "26px",
            boxShadow: "0 8px 24px rgba(245,158,11,0.5)",
            zIndex: 50,
          }}
        >
          {"🖱️ KLIK!"}
        </div>
      )}

      {/* 14% success popup */}
      {frame >= 118 && (
        <div
          style={{
            position: "absolute",
            top: "830px",
            left: "50%",
            transform: `translateX(-50%) scale(${successSpring})`,
            zIndex: 45,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg,#059669 0%,#047857 100%)",
              color: "#FFFFFF",
              padding: "18px 48px",
              borderRadius: "24px",
              fontWeight: 900,
              fontSize: "44px",
              boxShadow: "0 16px 40px rgba(5,150,105,0.55),0 0 0 4px #A7F3D0",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span>{"✅"}</span>
            <span>14% — AMAN!</span>
          </div>
        </div>
      )}

      {/* Speech bubble */}
      {frame >= 150 && (
        <div
          style={{
            position: "absolute",
            bottom: "200px",
            left: "40px",
            right: "40px",
            transform: `scale(${bubbleSpring})`,
            zIndex: 44,
          }}
        >
          <SpeechBubble06
            side="right"
            bg="#1E293B"
            border="#10B981"
            tailColor="#1E293B"
            style={{ color: "#FFFFFF" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#052E16",
                color: "#A7F3D0",
                padding: "4px 14px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 800,
                letterSpacing: "1px",
                marginBottom: "10px",
                textTransform: "uppercase",
              }}
            >
              {"🎓 MAHASISWA"}
            </div>
            <div style={{ fontSize: "26px", fontWeight: 700, lineHeight: 1.4 }}>
              <TypewriterText text={bubbleText} charCount={bubbleChars} cursorColor="#10B981" />
            </div>
          </SpeechBubble06>
        </div>
      )}
    </AbsoluteFill>
  );
};

// SCENE 4: Celebration & Interactive CTA (Frames 690-900)
const Scene4_Celebration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: frame - 5, fps, config: { damping: 13, stiffness: 140 } });
  const checkSpring = spring({ frame: frame - 15, fps, config: { damping: 11, stiffness: 130 } });
  const charSpring = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 110 } });
  const plakSpring = spring({ frame: frame - 40, fps, config: { damping: 12, stiffness: 125 } });
  const ctaSpring = spring({ frame: frame - 100, fps, config: { damping: 13, stiffness: 120 } });

  const pulse = 1 + Math.sin(frame * 0.18) * 0.04;
  const confettiSyms = ["🎊", "✨", "🎉", "⭐", "🌟"];

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <CelebrationBg />

      {/* Top success title */}
      <div
        style={{
          position: "absolute",
          top: "68px",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          transform: `scale(${titleSpring})`,
          zIndex: 40,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#10B981 0%,#059669 100%)",
            color: "#FFFFFF",
            padding: "14px 38px",
            borderRadius: "22px",
            boxShadow: "0 14px 35px rgba(16,185,129,0.5),0 0 0 4px #A7F3D0",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontWeight: 900,
            fontSize: "32px",
            letterSpacing: "1px",
            fontFamily: "system-ui, sans-serif",
            textTransform: "uppercase",
          }}
        >
          <span>{"🎉"}</span>
          <span>TURNITIN BANJIR ACC!</span>
          <span>{"🎓"}</span>
        </div>
      </div>

      {/* Big green checkmark */}
      <div
        style={{
          position: "absolute",
          top: "185px",
          left: "50%",
          transform: `translateX(-50%) scale(${checkSpring})`,
          zIndex: 35,
        }}
      >
        <div
          style={{
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#10B981 0%,#059669 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 0 14px rgba(16,185,129,0.22),0 16px 50px rgba(16,185,129,0.55)",
            fontSize: "94px",
          }}
        >
          {"✅"}
        </div>
      </div>

      {/* Trophy + LoA Document — fills empty center */}
      <div
        style={{
          position: "absolute",
          top: "390px",
          left: "50%",
          transform: `translateX(-50%) scale(${plakSpring})`,
          zIndex: 36,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          width: "960px",
        }}
      >
        {/* Plakat LULUS badge */}
        <div
          style={{
            background: "linear-gradient(135deg,#F59E0B 0%,#B45309 100%)",
            color: "#0F172A",
            padding: "14px 40px",
            borderRadius: "18px",
            fontWeight: 900,
            fontSize: "24px",
            textAlign: "center",
            boxShadow: "0 12px 30px rgba(245,158,11,0.5),0 0 0 4px #FEF3C7",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {"🏆 LULUS CEK TURNITIN — SIMILARITY 14% ✅"}
        </div>

        {/* Trophy + LoA + Dokumen SVG object */}
        <svg
          viewBox="0 0 880 380"
          style={{ width: "880px", height: "380px", display: "block", overflow: "visible" }}
        >
          <defs>
            <linearGradient id="trophyGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="loaDocGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F0FDF4" />
              <stop offset="100%" stopColor="#DCFCE7" />
            </linearGradient>
            <linearGradient id="medalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <filter id="trophyGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="18" floodColor="#F59E0B" floodOpacity="0.55" />
            </filter>
            <filter id="docShadow">
              <feDropShadow dx="4" dy="8" stdDeviation="10" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* ── PIALA / TROPHY (center) ── */}
          <g transform="translate(440, 20)" filter="url(#trophyGlow)">
            {/* Base pedestal */}
            <rect x="-70" y="290" width="140" height="20" rx="6" fill="url(#trophyGold)" />
            <rect x="-46" y="268" width="92" height="28" rx="5" fill="#B45309" />
            <rect x="-22" y="238" width="44" height="32" rx="4" fill="#92400E" />
            {/* Cup body */}
            <path d="M -68 60 Q -80 150 -50 200 Q -28 230 0 235 Q 28 230 50 200 Q 80 150 68 60 Z" fill="url(#trophyGold)" stroke="#B45309" strokeWidth="4" />
            {/* Cup inner shade */}
            <path d="M -50 70 Q -58 140 -36 188 Q -18 210 0 214" stroke="#FDE68A" strokeWidth="6" fill="none" opacity="0.6" />
            {/* Handles */}
            <path d="M -68 80 Q -118 80 -118 138 Q -118 180 -72 180" stroke="url(#trophyGold)" strokeWidth="18" fill="none" strokeLinecap="round" />
            <path d="M 68 80 Q 118 80 118 138 Q 118 180 72 180" stroke="url(#trophyGold)" strokeWidth="18" fill="none" strokeLinecap="round" />
            {/* Star on top */}
            <polygon points="0,-18 5.6,-3.8 20,-3.8 8.6,4.6 12.4,20 0,11 -12.4,20 -8.6,4.6 -20,-3.8 -5.6,-3.8" fill="#FBBF24" transform="translate(0,22)" />
            {/* Text inside cup */}
            <text x="0" y="148" textAnchor="middle" fill="#7C2D12" fontSize="28" fontWeight="900" fontFamily="system-ui">14%</text>
            <text x="0" y="178" textAnchor="middle" fill="#7C2D12" fontSize="16" fontWeight="800" fontFamily="system-ui">AMAN!</text>
          </g>

          {/* ── LoA / SERTIFIKAT JURNAL (kiri) ── */}
          <g transform="translate(90, 20)" filter="url(#docShadow)">
            {/* Kertas LoA */}
            <rect x="0" y="0" width="210" height="290" rx="12" fill="url(#loaDocGrad)" stroke="#10B981" strokeWidth="5" />
            {/* Header bar hijau */}
            <rect x="0" y="0" width="210" height="52" rx="12" fill="#059669" />
            <rect x="0" y="38" width="210" height="14" fill="#059669" />
            <text x="105" y="35" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900" fontFamily="system-ui" letterSpacing="1">LETTER OF ACCEPTANCE</text>
            {/* Journal logo area */}
            <rect x="16" y="64" width="178" height="30" rx="6" fill="#D1FAE5" />
            <text x="105" y="85" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="800" fontFamily="system-ui">📖 INTERNATIONAL JOURNAL</text>
            {/* Body lines */}
            <rect x="16" y="106" width="178" height="10" rx="4" fill="#A7F3D0" />
            <rect x="16" y="124" width="140" height="10" rx="4" fill="#A7F3D0" />
            <rect x="16" y="142" width="165" height="10" rx="4" fill="#A7F3D0" />
            <rect x="16" y="160" width="120" height="10" rx="4" fill="#A7F3D0" />
            <rect x="16" y="178" width="155" height="10" rx="4" fill="#A7F3D0" />
            <rect x="16" y="196" width="90" height="10" rx="4" fill="#A7F3D0" />
            {/* Accepted stamp */}
            <circle cx="148" cy="248" r="38" fill="none" stroke="#10B981" strokeWidth="5" strokeDasharray="6 3" />
            <text x="148" y="244" textAnchor="middle" fill="#059669" fontSize="13" fontWeight="900" fontFamily="system-ui">ACCEPTED</text>
            <text x="148" y="260" textAnchor="middle" fill="#10B981" fontSize="11" fontFamily="system-ui">✓ PUBLISHED</text>
            {/* Tanda tangan */}
            <path d="M 16 276 Q 40 268 64 276 Q 88 284 110 276" stroke="#0F172A" strokeWidth="3" fill="none" />
            <rect x="16" y="280" width="80" height="2" fill="#94A3B8" />
            <text x="56" y="294" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="system-ui">Editor-in-Chief</text>
          </g>

          {/* ── DOKUMEN TURNITIN HIJAU (kanan) ── */}
          <g transform="translate(580, 20)" filter="url(#docShadow)">
            <rect x="0" y="0" width="210" height="290" rx="12" fill="#F8FAFC" stroke="#10B981" strokeWidth="5" />
            {/* Header */}
            <rect x="0" y="0" width="210" height="52" rx="12" fill="#C1121F" />
            <rect x="0" y="38" width="210" height="14" fill="#C1121F" />
            <text x="105" y="25" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900" fontFamily="system-ui">Turnitin</text>
            <text x="105" y="44" textAnchor="middle" fill="#FECACA" fontSize="11" fontFamily="system-ui">Similarity Report</text>
            {/* Big green score */}
            <text x="105" y="130" textAnchor="middle" fill="#059669" fontSize="64" fontWeight="900" fontFamily="system-ui">14%</text>
            <rect x="30" y="144" width="150" height="26" rx="12" fill="#10B981" />
            <text x="105" y="162" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800" fontFamily="system-ui">✅ SIMILARITY OK</text>
            {/* Bars */}
            <rect x="16" y="185" width="178" height="8" rx="4" fill="#ECFDF5" />
            <rect x="16" y="185" width="25" height="8" rx="4" fill="#10B981" />
            <text x="200" y="193" textAnchor="end" fill="#059669" fontSize="10" fontFamily="system-ui">14%</text>
            <rect x="16" y="202" width="178" height="8" rx="4" fill="#ECFDF5" />
            <rect x="16" y="202" width="12" height="8" rx="4" fill="#34D399" />
            <text x="200" y="210" textAnchor="end" fill="#059669" fontSize="10" fontFamily="system-ui">7%</text>
            <rect x="16" y="219" width="178" height="8" rx="4" fill="#ECFDF5" />
            <rect x="16" y="219" width="8" height="8" rx="4" fill="#6EE7B7" />
            <text x="200" y="227" textAnchor="end" fill="#059669" fontSize="10" fontFamily="system-ui">4%</text>
            {/* Verified seal */}
            <circle cx="105" cy="264" r="22" fill="#059669" />
            <text x="105" y="269" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontFamily="system-ui">✓</text>
          </g>

          {/* ── MEDALI (floating between trophy & docs) ── */}
          <g transform="translate(180, 280)">
            <circle cx="0" cy="0" r="30" fill="url(#medalGrad)" stroke="#B45309" strokeWidth="4" />
            <circle cx="0" cy="0" r="22" fill="none" stroke="#FDE68A" strokeWidth="2" />
            <text x="0" y="7" textAnchor="middle" fill="#7C2D12" fontSize="18" fontWeight="900" fontFamily="system-ui">1</text>
            <rect x="-6" y="-52" width="12" height="28" rx="3" fill="#EF4444" />
          </g>
          <g transform="translate(700, 280)">
            <circle cx="0" cy="0" r="30" fill="url(#medalGrad)" stroke="#B45309" strokeWidth="4" />
            <circle cx="0" cy="0" r="22" fill="none" stroke="#FDE68A" strokeWidth="2" />
            <text x="0" y="7" textAnchor="middle" fill="#7C2D12" fontSize="18" fontWeight="900" fontFamily="system-ui">★</text>
            <rect x="-6" y="-52" width="12" height="28" rx="3" fill="#10B981" />
          </g>
        </svg>
      </div>

      {/* Character selebrasi */}
      <div
        style={{
          position: "absolute",
          top: "900px",
          left: "50%",
          transform: `translateX(-50%) scale(${charSpring})`,
          zIndex: 30,
        }}
      >
        <CharMahasiswaSenang />
      </div>

      {/* Floating confetti */}
      {confettiSyms.map((sym, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${50 + i * 40}px`,
            left: `${120 + i * 180}px`,
            transform: `translateY(${interpolate(frame, [0, 210], [0, 80 + i * 15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px) rotate(${frame * (i % 2 === 0 ? 2.2 : -1.8) + i * 40}deg)`,
            fontSize: "32px",
            opacity: 0.85,
            zIndex: 28,
          }}
        >
          {sym}
        </div>
      ))}

      {/* Interactive CTA — bottom safe zone >= 180px */}
      <div
        style={{
          position: "absolute",
          bottom: "190px",
          left: "48px",
          right: "48px",
          transform: `scale(${ctaSpring})`,
          zIndex: 46,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#0F172A 0%,#1E293B 100%)",
            borderRadius: "28px",
            padding: "26px 32px",
            border: "3px solid #10B981",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7),0 0 30px rgba(16,185,129,0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              color: "#FDE68A",
              fontSize: "20px",
              fontWeight: 900,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Turnitin Masih Merah Pekat?
          </div>
          <div
            style={{
              transform: `scale(${pulse})`,
              background: "linear-gradient(135deg,#10B981 0%,#059669 100%)",
              color: "#FFFFFF",
              padding: "18px 44px",
              borderRadius: "22px",
              fontSize: "26px",
              fontWeight: 900,
              boxShadow: "0 12px 28px rgba(16,185,129,0.5),0 0 0 3px #A7F3D0",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span>{"👉"}</span>
            <span>DM @jagoneliti_ — Siap Bantu Paraphrase!</span>
          </div>
          <div
            style={{
              color: "#94A3B8",
              fontSize: "17px",
              fontWeight: 700,
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <span>{"✨ Paraphrase Profesional"}</span>
            <span>{"•"}</span>
            <span>{"⚡ Turun Similarity Kilat"}</span>
            <span>{"•"}</span>
            <span>{"🎓 Lolos Turnitin Kampus"}</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// MAIN EXPORT
// ==========================================

export const InteractiveScene06: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F172A" }}>
      {/* ── AUDIO & SFX ── */}
      <Sequence from={20} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/pop.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={40} durationInFrames={60} layout="none">
        <Audio src={staticFile("audio/error_buzz.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={210} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={240} durationInFrames={110} layout="none">
        <Audio src={staticFile("audio/mecha_keyboard.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={360} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/pop.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={470} durationInFrames={18} layout="none">
        <Audio src={staticFile("audio/mouse_click.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={500} durationInFrames={18} layout="none">
        <Audio src={staticFile("audio/mouse_click.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={530} durationInFrames={18} layout="none">
        <Audio src={staticFile("audio/mouse_click.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={568} durationInFrames={50} layout="none">
        <Audio src={staticFile("audio/coin_gain.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={690} durationInFrames={190} layout="none">
        <Audio src={staticFile("audio/applause.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={710} durationInFrames={60} layout="none">
        <Audio src={staticFile("audio/bell_ding.mp3")} volume={0.85} />
      </Sequence>

      {/* ── VISUAL SCENES (900 frames) ── */}
      <Sequence from={0} durationInFrames={210}>
        <Scene1_PanikTurnitin />
      </Sequence>
      <Sequence from={210} durationInFrames={240}>
        <Scene2_PenyebabKonyol />
      </Sequence>
      <Sequence from={450} durationInFrames={240}>
        <Scene3_FilterExclude />
      </Sequence>
      <Sequence from={690} durationInFrames={210}>
        <Scene4_Celebration />
      </Sequence>
    </AbsoluteFill>
  );
};
