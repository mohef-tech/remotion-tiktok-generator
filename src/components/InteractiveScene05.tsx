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

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

// Colors & Design Tokens
const COLORS = {
  navyDark: "#0F172A",
  navy: "#1E293B",
  navyBlue: "#1B2A6B",
  navyCard: "#243372",
  cream: "#F4F0EA",
  creamDark: "#E8E2D5",
  mustard: "#F59E0B",
  mustardLight: "#FDE68A",
  coral: "#EF4444",
  coralDark: "#DC2626",
  green: "#10B981",
  greenDark: "#059669",
  blueSky: "#38BDF8",
  purple: "#6366F1",
  white: "#FFFFFF",
  woodBrown: "#8B5A2B",
  woodLight: "#A06B37",
  chalkboard: "#1B3B2B",
  chalkboardFrame: "#5C3A21",
};

// ==========================================
// 1. FULL CANVAS SVG BACKGROUNDS & CHARACTERS
// ==========================================

// Full Canvas SVG Ruang Sidang (Scene 1 & Scene 3)
const RuangSidangBackground: React.FC<{ mood?: "tense" | "happy" }> = ({
  mood = "tense",
}) => {
  return (
    <svg
      viewBox="0 0 1080 1920"
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mood === "tense" ? "#1E293B" : "#1E3A5F"} />
          <stop offset="60%" stopColor={mood === "tense" ? "#0F172A" : "#132742"} />
          <stop offset="100%" stopColor="#0B1120" />
        </linearGradient>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
        <linearGradient id="chalkboardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#134E4A" />
          <stop offset="100%" stopColor="#0F3835" />
        </linearGradient>
        <linearGradient id="tableWoodGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9A3412" />
          <stop offset="100%" stopColor="#7C2D12" />
        </linearGradient>
        <filter id="shadowLight" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.4" />
        </filter>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Dinding Ruang Sidang */}
      <rect width="1080" height="1350" fill="url(#wallGrad)" />

      {/* Ceiling Lights / Beam */}
      <polygon points="100,0 250,0 350,900 0,900" fill="#FFFFFF" opacity="0.03" />
      <polygon points="830,0 980,0 1080,900 730,900" fill="#FFFFFF" opacity="0.03" />

      {/* Lamps */}
      <rect x="180" y="0" width="100" height="30" rx="8" fill="#F8FAFC" opacity="0.9" />
      <rect x="800" y="0" width="100" height="30" rx="8" fill="#F8FAFC" opacity="0.9" />

      {/* Papan Tulis / Screen Proyektor Sidang di Belakang */}
      <g filter="url(#shadowLight)">
        {/* Frame Papan */}
        <rect x="140" y="240" width="800" height="420" rx="16" fill={COLORS.chalkboardFrame} />
        {/* Isi Papan */}
        <rect x="160" y="260" width="760" height="380" rx="10" fill="url(#chalkboardGrad)" />
        {/* Diagram Garis & Tulisan Kapur */}
        <path
          d="M 220 540 Q 350 360 480 460 T 750 340 T 860 420"
          stroke="#5EEAD4"
          strokeWidth="5"
          fill="none"
          strokeDasharray="8 6"
        />
        <circle cx="480" cy="460" r="10" fill="#F43F5E" />
        <text x="500" y="470" fill="#FDA4AF" fontSize="24" fontWeight="bold" fontFamily="system-ui">
          Titik Anomali X
        </text>

        {/* Text Judul Sidang di Papan */}
        <rect x="220" y="290" width="640" height="40" rx="8" fill="#042F2E" opacity="0.8" />
        <text
          x="540"
          y="318"
          fill="#A7F3D0"
          fontSize="22"
          fontWeight="bold"
          fontFamily="system-ui"
          textAnchor="middle"
          letterSpacing="2"
        >
          RUANG SIDANG UJIAN SKRIPSI / TA
        </text>
        <text x="240" y="380" fill="#99F6E4" fontSize="20" fontFamily="system-ui">
          • Hipotesis A = Berbanding Lurus
        </text>
        <text x="240" y="415" fill="#FCA5A5" fontSize="20" fontFamily="system-ui">
          • Data Riil = Anomali Variabel (-34%) ⚠️
        </text>
      </g>

      {/* Jam Dinding di Atas */}
      <g filter="url(#shadowLight)">
        <circle cx="540" cy="140" r="55" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="8" />
        <line x1="540" y1="140" x2="540" y2="105" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
        <line x1="540" y1="140" x2="570" y2="140" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
        <circle cx="540" cy="140" r="6" fill="#EF4444" />
      </g>

      {/* Banner Nama Institusi / Akreditasi */}
      <rect x="40" y="700" width="1000" height="12" fill="#E2E8F0" opacity="0.1" />

      {/* Lantai Parket / Kayu Ruang Sidang */}
      <polygon points="0,1280 1080,1280 1080,1920 0,1920" fill="url(#floorGrad)" />
      {/* Garis Lantai Perspektif */}
      <line x1="150" y1="1280" x2="0" y2="1920" stroke="#000000" strokeWidth="4" opacity="0.3" />
      <line x1="380" y1="1280" x2="260" y2="1920" stroke="#000000" strokeWidth="4" opacity="0.3" />
      <line x1="700" y1="1280" x2="820" y2="1920" stroke="#000000" strokeWidth="4" opacity="0.3" />
      <line x1="930" y1="1280" x2="1080" y2="1920" stroke="#000000" strokeWidth="4" opacity="0.3" />

      {/* Meja Penguji Dosen di Depan */}
      <g filter="url(#shadowLight)">
        {/* Daun Meja */}
        <polygon points="40,1260 1040,1260 1080,1400 0,1400" fill="url(#tableWoodGrad)" />
        {/* Badan Meja Bawah */}
        <rect x="20" y="1400" width="1040" height="420" fill="#431407" />
        {/* Panel Dekorasi Kayu Meja */}
        <rect x="80" y="1430" width="280" height="340" rx="10" fill="#7C2D12" stroke="#B45309" strokeWidth="3" />
        <rect x="400" y="1430" width="280" height="340" rx="10" fill="#7C2D12" stroke="#B45309" strokeWidth="3" />
        <rect x="720" y="1430" width="280" height="340" rx="10" fill="#7C2D12" stroke="#B45309" strokeWidth="3" />

        {/* Aksesoris di atas meja: Microphone Sidang */}
        <circle cx="280" cy="1255" r="16" fill="#1E293B" />
        <path d="M 280 1255 Q 275 1200 290 1170" stroke="#94A3B8" strokeWidth="6" fill="none" />
        <ellipse cx="292" cy="1165" rx="10" ry="14" fill="#334155" />

        {/* Tumpukan Berkas Skripsi Dosen */}
        <rect x="140" y="1235" width="90" height="22" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="135" y="1225" width="95" height="15" rx="3" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="142" y="1215" width="88" height="14" rx="3" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" />
        {/* Nameplate Dosen Penguji */}
        <rect x="360" y="1230" width="180" height="28" rx="4" fill="#B45309" stroke="#FDE68A" strokeWidth="2" />
        <text x="450" y="1249" fill="#FFFBEB" fontSize="13" fontWeight="bold" fontFamily="system-ui" textAnchor="middle">
          DOSEN PENGUJI 1
        </text>

        {/* Laptop Dosen di Meja */}
        <rect x="700" y="1230" width="120" height="20" rx="3" fill="#64748B" />
        <polygon points="695,1230 825,1230 840,1250 680,1250" fill="#475569" />
      </g>
    </svg>
  );
};

// Character Dosen 2D Comic (Left Side)
const CharacterDosen: React.FC<{
  expression: "angry" | "impressed";
  armRaised?: boolean;
}> = ({ expression, armRaised = true }) => {
  return (
    <svg
      viewBox="0 0 450 650"
      style={{ width: "440px", height: "620px", display: "block", overflow: "visible" }}
    >
      <defs>
        <filter id="charShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodOpacity="0.3" />
        </filter>
      </defs>

      <g filter="url(#charShadow)">
        {/* Badan / Jas Dosen */}
        {/* Tubuh / Jas Navy Formal */}
        <path
          d="M 120 320 Q 220 300 320 320 L 350 600 L 90 600 Z"
          fill="#1E293B"
          stroke="#0F172A"
          strokeWidth="6"
        />
        {/* Kemeja Dalam Putih & Dasi Merah */}
        <polygon points="190,310 250,310 230,460 210,460" fill="#FFFFFF" />
        <polygon points="215,310 225,310 230,440 220,450 210,440" fill={COLORS.coral} />

        {/* Kerah Jas */}
        <polygon points="150,315 200,420 180,420 130,320" fill="#334155" />
        <polygon points="290,315 240,420 260,420 310,320" fill="#334155" />

        {/* Leher */}
        <rect x="195" y="270" width="50" height="50" rx="6" fill="#FBCFE8" />

        {/* Kepala Dosen */}
        <ellipse cx="220" cy="210" rx="75" ry="85" fill="#FDE2E4" stroke="#475569" strokeWidth="5" />

        {/* Rambut Dosen (Abu-abu / Belah Samping Formal) */}
        <path
          d="M 140 180 Q 220 100 300 170 Q 305 130 220 115 Q 145 125 140 180 Z"
          fill="#64748B"
          stroke="#334155"
          strokeWidth="4"
        />
        {/* Kumis / Karakteristik Dosen Senior */}
        <path
          d="M 195 245 Q 220 250 245 245 Q 230 238 220 240 Q 210 238 195 245 Z"
          fill="#475569"
        />

        {/* Kacamata Dosen Persegi */}
        <g>
          {/* Frame Kiri */}
          <rect x="160" y="185" width="48" height="32" rx="6" fill="#FFFFFF" fillOpacity="0.4" stroke="#0F172A" strokeWidth="5" />
          {/* Frame Kanan */}
          <rect x="232" y="185" width="48" height="32" rx="6" fill="#FFFFFF" fillOpacity="0.4" stroke="#0F172A" strokeWidth="5" />
          {/* Bridge */}
          <line x1="208" y1="198" x2="232" y2="198" stroke="#0F172A" strokeWidth="5" />

          {/* Mata Dosen */}
          {expression === "angry" ? (
            <>
              {/* Alis Menukik Tajam */}
              <line x1="155" y1="175" x2="205" y2="190" stroke="#0F172A" strokeWidth="7" strokeLinecap="round" />
              <line x1="285" y1="175" x2="235" y2="190" stroke="#0F172A" strokeWidth="7" strokeLinecap="round" />
              {/* Pupil Fokus Menatap Tajam */}
              <circle cx="184" cy="201" r="6" fill="#0F172A" />
              <circle cx="256" cy="201" r="6" fill="#0F172A" />
              {/* Mulut Tegas / Berbicara */}
              <ellipse cx="220" cy="265" rx="18" ry="10" fill="#7F1D1D" stroke="#0F172A" strokeWidth="3" />
            </>
          ) : (
            <>
              {/* Alis Terangkat Kagum */}
              <path d="M 160 175 Q 185 160 210 175" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M 230 175 Q 255 160 280 175" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" fill="none" />
              {/* Mata Lebar Terkesan */}
              <circle cx="184" cy="201" r="8" fill="#0F172A" />
              <circle cx="182" cy="198" r="3" fill="#FFFFFF" />
              <circle cx="256" cy="201" r="8" fill="#0F172A" />
              <circle cx="254" cy="198" r="3" fill="#FFFFFF" />
              {/* Senyum Mengangguk Puas */}
              <path d="M 200 258 Q 220 275 240 258" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" fill="none" />
            </>
          )}
        </g>

        {/* Lengan Kiri (Menunjuk Tegas / Pose Dosen) */}
        {armRaised ? (
          <g>
            {/* Lengan mengarah ke kanan (ke mahasiswa) */}
            <path
              d="M 310 350 Q 380 340 410 320"
              stroke="#1E293B"
              strokeWidth="48"
              strokeLinecap="round"
              fill="none"
            />
            {/* Tangan menunjuk */}
            <circle cx="415" cy="315" r="18" fill="#FDE2E4" />
            <path d="M 415 315 L 450 305" stroke="#FDE2E4" strokeWidth="14" strokeLinecap="round" />
            <path d="M 415 315 L 440 325" stroke="#FDE2E4" strokeWidth="10" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            {/* Lengan Terbuka Mengangguk Menerima */}
            <path
              d="M 310 360 Q 370 410 380 460"
              stroke="#1E293B"
              strokeWidth="44"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="385" cy="470" r="18" fill="#FDE2E4" />
          </g>
        )}
      </g>
    </svg>
  );
};

// Character Mahasiswa 2D Comic (Right Side)
const CharacterMahasiswa: React.FC<{
  mood: "panicked" | "confident";
  holdingDocs?: boolean;
}> = ({ mood, holdingDocs = true }) => {
  return (
    <svg
      viewBox="0 0 450 650"
      style={{ width: "440px", height: "620px", display: "block", overflow: "visible" }}
    >
      <defs>
        <filter id="studShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodOpacity="0.3" />
        </filter>
        <linearGradient id="auraGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Aura Percaya Diri saat mood === "confident" */}
      {mood === "confident" && (
        <circle cx="220" cy="300" r="230" fill="url(#auraGrad)" filter="url(#softGlow)" />
      )}

      <g filter="url(#studShadow)">
        {/* Badan / Kemeja Putih Mahasiswa Sidang */}
        <path
          d="M 120 320 Q 220 305 320 320 L 340 600 L 100 600 Z"
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="5"
        />
        {/* Celana Hitam Formal */}
        <rect x="100" y="580" width="240" height="70" fill="#0F172A" />

        {/* Dasi Hitam Mahasiswa */}
        <polygon points="210,320 230,320 236,460 220,480 204,460" fill="#0F172A" />

        {/* Kerah Kemeja */}
        <polygon points="160,320 210,350 185,320" fill="#E2E8F0" />
        <polygon points="280,320 230,350 255,320" fill="#E2E8F0" />

        {/* Leher */}
        <rect x="195" y="270" width="50" height="55" rx="6" fill="#FED7AA" />

        {/* Kepala Mahasiswa */}
        <ellipse cx="220" cy="210" rx="72" ry="80" fill="#FFEDD5" stroke="#EA580C" strokeWidth="3" />

        {/* Rambut Mahasiswa Rapi */}
        <path
          d="M 145 190 Q 150 120 220 120 Q 295 120 295 190 Q 260 145 220 150 Q 170 145 145 190 Z"
          fill="#1E293B"
        />

        {/* Ekspresi Wajah */}
        {mood === "panicked" ? (
          <>
            {/* Alis Panik Bergelombang */}
            <path d="M 160 180 Q 180 165 200 185" stroke="#1E293B" strokeWidth="5" fill="none" />
            <path d="M 240 185 Q 260 165 280 180" stroke="#1E293B" strokeWidth="5" fill="none" />

            {/* Mata Panik Melotot Lebar */}
            <ellipse cx="180" cy="205" rx="14" ry="18" fill="#FFFFFF" stroke="#1E293B" strokeWidth="4" />
            <circle cx="180" cy="205" r="5" fill="#1E293B" />
            <ellipse cx="260" cy="205" rx="14" ry="18" fill="#FFFFFF" stroke="#1E293B" strokeWidth="4" />
            <circle cx="260" cy="205" r="5" fill="#1E293B" />

            {/* Mulut Panik Ternganga Ketakutan */}
            <path
              d="M 195 250 Q 220 275 245 250 Q 220 240 195 250 Z"
              fill="#991B1B"
              stroke="#1E293B"
              strokeWidth="4"
            />

            {/* Butiran Keringat Dingin Menetes */}
            <path
              d="M 285 170 C 285 160 300 150 300 150 C 300 150 315 160 315 170 C 315 178 308 185 300 185 C 292 185 285 178 285 170 Z"
              fill="#38BDF8"
            />
            <path
              d="M 130 210 C 130 202 142 195 142 195 C 142 195 154 202 154 210 C 154 216 148 222 142 222 C 136 222 130 216 130 210 Z"
              fill="#38BDF8"
            />
          </>
        ) : (
          <>
            {/* Alis Yakin Percaya Diri */}
            <path d="M 160 175 Q 185 170 205 178" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 235 178 Q 255 170 280 175" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" fill="none" />

            {/* Mata Percaya Diri & Berbinar */}
            <ellipse cx="182" cy="202" rx="10" ry="12" fill="#1E293B" />
            <circle cx="180" cy="198" r="4" fill="#FFFFFF" />
            <ellipse cx="258" cy="202" rx="10" ry="12" fill="#1E293B" />
            <circle cx="256" cy="198" r="4" fill="#FFFFFF" />

            {/* Senyum Lebar Mantap */}
            <path
              d="M 195 245 Q 220 270 245 245"
              stroke="#1E293B"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {/* Tangan & Map Dokumen Skripsi */}
        {holdingDocs && (
          <g>
            {/* Lengan Kiri Memegang Dokumen */}
            <path
              d="M 130 350 Q 150 440 190 450"
              stroke="#FFFFFF"
              strokeWidth="38"
              strokeLinecap="round"
              fill="none"
            />
            {/* Map Skripsi Biru Tua / Hardcover */}
            <rect
              x="170"
              y="390"
              width="110"
              height="140"
              rx="8"
              transform="rotate(-15 170 390)"
              fill="#1E3A8A"
              stroke="#FBBF24"
              strokeWidth="4"
            />
            {/* Tulisan SKRIPSI Emas */}
            <rect
              x="195"
              y="420"
              width="60"
              height="8"
              transform="rotate(-15 195 420)"
              fill="#FDE68A"
            />
            <rect
              x="190"
              y="435"
              width="70"
              height="6"
              transform="rotate(-15 190 435)"
              fill="#FDE68A"
            />

            {/* Tangan Mahasiswa Memegang Map */}
            <circle cx="230" cy="460" r="16" fill="#FED7AA" />
          </g>
        )}

        {/* Gesture Tangan Kanan saat Percaya Diri */}
        {mood === "confident" && (
          <g>
            {/* Tangan kanan gestur menjelaskan */}
            <path
              d="M 310 360 Q 360 400 370 370"
              stroke="#FFFFFF"
              strokeWidth="36"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="375" cy="365" r="16" fill="#FED7AA" />
          </g>
        )}
      </g>
    </svg>
  );
};

// Full Canvas SVG 2D Workspace Laptop Setup (Scene 2)
const LaptopDeskBackground: React.FC = () => {
  return (
    <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="roomGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#090D16" />
        </linearGradient>
        <linearGradient id="deskWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="60%" stopColor="#92400E" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#F59E0B" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Background Room */}
      <rect width="1080" height="1920" fill="url(#roomGrad)" />

      {/* Dinding Estetik dengan Rak Buku */}
      <rect x="80" y="100" width="920" height="24" rx="6" fill="#D97706" />
      {/* Buku-buku di Rak */}
      <rect x="120" y="30" width="40" height="70" rx="4" fill="#EF4444" />
      <rect x="165" y="40" width="35" height="60" rx="4" fill="#3B82F6" />
      <rect x="205" y="20" width="45" height="80" rx="4" fill="#10B981" />
      <rect x="255" y="35" width="50" height="65" rx="4" fill="#F59E0B" />
      <rect x="310" y="25" width="40" height="75" rx="4" fill="#8B5CF6" />

      {/* Tanaman Hias Gantung */}
      <ellipse cx="850" cy="110" rx="40" ry="20" fill="#334155" />
      <path d="M 830 110 Q 800 160 780 220" stroke="#10B981" strokeWidth="6" fill="none" />
      <path d="M 850 110 Q 860 180 870 250" stroke="#059669" strokeWidth="7" fill="none" />
      <path d="M 870 110 Q 910 170 930 230" stroke="#34D399" strokeWidth="6" fill="none" />

      {/* Permukaan Meja Kayu Estetik Luas */}
      <polygon points="0,520 1080,520 1080,1920 0,1920" fill="url(#deskWood)" />
      {/* Desk Mat Gelap Premium */}
      <rect x="60" y="580" width="960" height="1200" rx="28" fill="#111827" opacity="0.95" />

      {/* Cangkir Kopi Estetik */}
      <circle cx="170" cy="720" r="45" fill="#E2E8F0" />
      <circle cx="170" cy="720" r="36" fill="#78350F" />
      <path d="M 210 710 Q 235 720 210 730" stroke="#E2E8F0" strokeWidth="10" fill="none" />

      {/* Sticky Notes & Highlighter di Meja */}
      <rect x="880" y="660" width="80" height="80" rx="4" fill="#FEF08A" transform="rotate(12 880 660)" />
      <rect x="850" y="780" width="90" height="24" rx="6" fill="#F43F5E" />
      <rect x="850" y="815" width="90" height="24" rx="6" fill="#38BDF8" />
    </svg>
  );
};

// Full Canvas SVG Celebration Scene 4 (High-Five 2D Cartoon)
const CelebrationBackground: React.FC = () => {
  return (
    <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="celebSkyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="40%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="stageGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>

      {/* Background Gradient */}
      <rect width="1080" height="1920" fill="url(#celebSkyGrad)" />

      {/* Subtle Rays of Light */}
      <polygon points="540,600 0,0 200,0" fill="#FBBF24" opacity="0.08" />
      <polygon points="540,600 400,0 680,0" fill="#FBBF24" opacity="0.08" />
      <polygon points="540,600 880,0 1080,0" fill="#FBBF24" opacity="0.08" />

      {/* Confetti & Streamers */}
      <g>
        <rect x="120" y="140" width="22" height="12" rx="3" fill="#EF4444" transform="rotate(25 120 140)" />
        <rect x="280" y="90" width="18" height="26" rx="4" fill="#F59E0B" transform="rotate(-15 280 90)" />
        <rect x="450" y="160" width="24" height="14" rx="3" fill="#10B981" transform="rotate(45 450 160)" />
        <rect x="680" y="110" width="20" height="20" rx="4" fill="#38BDF8" transform="rotate(30 680 110)" />
        <rect x="880" y="150" width="26" height="12" rx="3" fill="#EC4899" transform="rotate(-35 880 150)" />
        <rect x="180" y="320" width="16" height="24" rx="3" fill="#FBBF24" transform="rotate(18 180 320)" />
        <rect x="920" y="290" width="22" height="15" rx="3" fill="#34D399" transform="rotate(-22 920 290)" />
      </g>

      {/* Floor / Stage Podium */}
      <polygon points="0,1500 1080,1500 1080,1920 0,1920" fill="#111827" />
      <rect x="80" y="1460" width="920" height="50" rx="12" fill="url(#stageGrad)" />
    </svg>
  );
};

// 2D Cartoon High-Five Characters Illustration (Polished to match reference style)
const HighFiveCharacters: React.FC = () => {
  return (
    <svg
      viewBox="0 0 900 850"
      style={{ width: "880px", height: "820px", display: "block", overflow: "visible" }}
    >
      <defs>
        <filter id="highFiveShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#000000" floodOpacity="0.5" />
        </filter>
        <linearGradient id="maleSuitGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="femaleBlazerGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="skinGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF1E6" />
          <stop offset="100%" stopColor="#FED7AA" />
        </linearGradient>
      </defs>

      <g filter="url(#highFiveShadow)">
        {/* Glowing Star at High-Five Point */}
        <g transform="translate(450, 110)">
          <circle cx="0" cy="0" r="35" fill="#FBBF24" opacity="0.3" filter="url(#softGlow)" />
          <polygon
            points="0,-48 14,-14 48,0 14,14 0,48 -14,14 -48,0 -14,-14"
            fill="#FBBF24"
          />
          <circle cx="0" cy="0" r="15" fill="#FFFFFF" />
        </g>

        {/* ----------------- LAKI-LAKI (KIRI) ----------------- */}
        <g id="maleCharacter">
          {/* Kaki & Celana Biru Tua */}
          <line x1="280" y1="520" x2="220" y2="760" stroke="#1E293B" strokeWidth="52" strokeLinecap="round" />
          <line x1="340" y1="520" x2="360" y2="760" stroke="#1E293B" strokeWidth="52" strokeLinecap="round" />
          {/* Sepatu Cokelat Formal */}
          <rect x="175" y="745" width="90" height="35" rx="14" fill="#78350F" stroke="#451A03" strokeWidth="3" />
          <rect x="335" y="745" width="85" height="35" rx="14" fill="#78350F" stroke="#451A03" strokeWidth="3" />

          {/* Badan / Jas Biru */}
          <path d="M 220 300 Q 320 290 380 300 L 380 540 L 210 540 Z" fill="url(#maleSuitGrad)" />
          {/* Kemeja & Dasi Merah */}
          <polygon points="275,300 325,300 308,440 292,440" fill="#FFFFFF" />
          <polygon points="296,300 304,300 310,420 300,435 290,420" fill={COLORS.coral} />
          {/* Sabuk Kuning/Emas */}
          <rect x="210" y="520" width="170" height="22" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />

          {/* Lengan Kanan Menjulang ke Atas Tos */}
          <path
            d="M 370 320 Q 425 210 442 140"
            stroke="url(#maleSuitGrad)"
            strokeWidth="50"
            strokeLinecap="round"
            fill="none"
          />
          {/* Telapak Tangan Kanan Tos */}
          <circle cx="445" cy="130" r="24" fill="url(#skinGrad1)" />

          {/* Lengan Kiri Membawa Tas Kerja / Briefcase Hijau */}
          <path
            d="M 230 320 Q 170 420 160 520"
            stroke="url(#maleSuitGrad)"
            strokeWidth="44"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="160" cy="530" r="20" fill="url(#skinGrad1)" />
          {/* Briefcase Hijau Mewah */}
          <rect x="95" y="520" width="125" height="95" rx="14" fill="#10B981" stroke="#059669" strokeWidth="5" />
          <rect x="140" y="495" width="35" height="30" rx="6" fill="none" stroke="#059669" strokeWidth="7" />
          <rect x="145" y="555" width="25" height="18" rx="4" fill="#FBBF24" />

          {/* Kepala & Wajah Pria */}
          <ellipse cx="295" cy="210" rx="70" ry="78" fill="url(#skinGrad1)" stroke="#EA580C" strokeWidth="2" />
          {/* Rambut Cokelat Pompadour */}
          <path
            d="M 225 180 Q 225 100 310 95 Q 380 95 370 170 Q 335 130 290 140 Q 245 140 225 180 Z"
            fill="#B45309"
          />
          {/* Mata Ceria & Senyum Lebar */}
          <circle cx="278" cy="200" r="9" fill="#1E293B" />
          <circle cx="275" cy="196" r="3.5" fill="#FFFFFF" />
          <circle cx="332" cy="200" r="9" fill="#1E293B" />
          <circle cx="329" cy="196" r="3.5" fill="#FFFFFF" />
          {/* Senyum Lebar */}
          <path d="M 280 235 Q 305 270 335 235 Z" fill="#DC2626" />
        </g>

        {/* ----------------- WANITA (KANAN) ----------------- */}
        <g id="femaleCharacter">
          {/* Kaki & Stocking Kuning/Mustard */}
          <line x1="570" y1="580" x2="570" y2="760" stroke="#FBBF24" strokeWidth="26" strokeLinecap="round" />
          <line x1="630" y1="580" x2="690" y2="735" stroke="#FBBF24" strokeWidth="26" strokeLinecap="round" />
          {/* High Heels Navy */}
          <polygon points="550,750 585,750 575,780 545,770" fill="#1E293B" />
          <polygon points="680,725 710,740 700,765 670,745" fill="#1E293B" />

          {/* Rok Hitam */}
          <polygon points="520,500 670,500 680,600 510,600" fill="#1E293B" />

          {/* Blazer Ungu / Magenta */}
          <path d="M 510 310 Q 600 300 670 310 L 670 510 L 510 510 Z" fill="url(#femaleBlazerGrad)" />
          {/* Kemeja Putih */}
          <polygon points="565,310 615,310 598,440 582,440" fill="#FFFFFF" />

          {/* Lengan Kiri Menjulang ke Atas Tos */}
          <path
            d="M 525 320 Q 465 210 450 140"
            stroke="url(#femaleBlazerGrad)"
            strokeWidth="46"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="452" cy="130" r="22" fill="url(#skinGrad1)" />

          {/* Lengan Kanan Membawa Briefcase Merah/Coral */}
          <path
            d="M 660 330 Q 730 430 740 530"
            stroke="url(#femaleBlazerGrad)"
            strokeWidth="40"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="740" cy="540" r="20" fill="url(#skinGrad1)" />
          {/* Briefcase Merah */}
          <rect x="715" y="530" width="115" height="90" rx="14" fill="#EF4444" stroke="#B91C1C" strokeWidth="5" />
          <rect x="755" y="505" width="35" height="30" rx="6" fill="none" stroke="#B91C1C" strokeWidth="7" />
          <rect x="760" y="565" width="25" height="18" rx="4" fill="#FBBF24" />

          {/* Kepala & Wajah Wanita */}
          <ellipse cx="600" cy="215" rx="68" ry="74" fill="url(#skinGrad1)" stroke="#EA580C" strokeWidth="2" />
          {/* Rambut Kuncir Ponytail Hitam */}
          <path
            d="M 545 200 Q 545 125 620 120 Q 685 125 675 200 Q 630 155 600 155 Q 565 155 545 200 Z"
            fill="#1E293B"
          />
          {/* Ponytail Kanan */}
          <path
            d="M 665 155 Q 745 165 755 265 Q 720 320 675 265 Z"
            fill="#1E293B"
          />
          <ellipse cx="670" cy="175" rx="12" ry="8" fill="#F43F5E" />

          {/* Mata Ceria & Senyum */}
          <circle cx="572" cy="205" r="9" fill="#1E293B" />
          <circle cx="569" cy="201" r="3.5" fill="#FFFFFF" />
          <circle cx="628" cy="205" r="9" fill="#1E293B" />
          <circle cx="625" cy="201" r="3.5" fill="#FFFFFF" />
          <path d="M 580 238 Q 600 270 622 238 Z" fill="#DC2626" />
        </g>
      </g>
    </svg>
  );
};

// ==========================================
// 2. HELPER UI COMPONENTS (Speech Bubbles, Cards)
// ==========================================

// Speech Bubble Component with Tail
const SpeechBubble: React.FC<{
  text: string;
  sender: "dosen" | "mahasiswa";
  charLimit?: number;
  highlightWords?: string[];
}> = ({ text, sender, charLimit, highlightWords = [] }) => {
  const isDosen = sender === "dosen";
  const displayedText = charLimit !== undefined ? text.slice(0, charLimit) : text;

  // Split and render with optional highlights
  const renderHighlighted = (str: string) => {
    if (!str || !highlightWords || highlightWords.length === 0) return str;
    const escapedWords = highlightWords
      .filter(Boolean)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (escapedWords.length === 0) return str;
    const regex = new RegExp(`(${escapedWords.join("|")})`, "gi");
    const parts = str.split(regex);
    return parts.map((part, i) => {
      if (!part) return null;
      const isMatch = highlightWords.some(
        (hw) => hw && hw.toLowerCase() === part.toLowerCase()
      );
      if (isMatch) {
        return (
          <span
            key={i}
            style={{
              backgroundColor: isDosen ? "#FEE2E2" : "#FEF08A",
              color: isDosen ? "#DC2626" : "#B45309",
              padding: "2px 8px",
              borderRadius: "6px",
              fontWeight: 800,
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div
      style={{
        position: "relative",
        background: isDosen ? "#FFFFFF" : "#1E293B",
        color: isDosen ? "#0F172A" : "#FFFFFF",
        borderRadius: "24px",
        padding: "24px 32px",
        maxWidth: "540px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 0 4px " + (isDosen ? "#EF4444" : "#38BDF8"),
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Sender Tag Header */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: isDosen ? "#FEE2E2" : "#334155",
          color: isDosen ? "#B91C1C" : "#38BDF8",
          padding: "4px 14px",
          borderRadius: "999px",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "1px",
          marginBottom: "12px",
          textTransform: "uppercase",
        }}
      >
        <span>{isDosen ? "👨‍🏫 DOSEN PENGUJI" : "🎓 MAHASISWA TA"}</span>
      </div>

      <div
        style={{
          fontSize: "24px",
          lineHeight: "1.4",
          fontWeight: 700,
        }}
      >
        "{renderHighlighted(displayedText)}"
        {charLimit !== undefined && charLimit < text.length && (
          <span
            style={{
              display: "inline-block",
              width: "4px",
              height: "24px",
              background: isDosen ? "#EF4444" : "#38BDF8",
              marginLeft: "6px",
              verticalAlign: "middle",
            }}
          />
        )}
      </div>

      {/* Bubble Tail */}
      {isDosen ? (
        // Tail pointing left-down to dosen
        <div
          style={{
            position: "absolute",
            bottom: "-18px",
            left: "60px",
            width: "0",
            height: "0",
            borderLeft: "16px solid transparent",
            borderRight: "16px solid transparent",
            borderTop: "20px solid #FFFFFF",
          }}
        />
      ) : (
        // Tail pointing right-down to mahasiswa
        <div
          style={{
            position: "absolute",
            bottom: "-18px",
            right: "60px",
            width: "0",
            height: "0",
            borderLeft: "16px solid transparent",
            borderRight: "16px solid transparent",
            borderTop: "20px solid #1E293B",
          }}
        />
      )}
    </div>
  );
};

// ==========================================
// 3. SCENE IMPLEMENTATIONS
// ==========================================

// SCENE 1: HOOK - DI-SKAKMAT DOSEN SIDANG (Frames 0 - 210)
const Scene1_SidangHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance Spring
  const popSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Kinetic Header Badge Entrance
  const badgeSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // Panic Shake Effect for Mahasiswa
  const panicShake = frame > 50 && frame < 180 ? Math.sin(frame * 1.5) * 6 : 0;
  const panicRotate = frame > 50 && frame < 180 ? Math.cos(frame * 1.2) * 2 : 0;

  // Dosen Typing Speech Bubble
  // Starts typing at frame 25, finishes around frame 110 (85 frames typing), holds until frame 210 (100 frames hold)
  const dosenFullText =
    "Data kamu beda sama teori! Kenapa metodenya pakai ini?";
  const typeProgress = interpolate(frame, [25, 110], [0, dosenFullText.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const charCount = Math.floor(typeProgress);

  // Floating Question Marks above Mahasiswa Head
  const qMarkOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="overflow-hidden">
      {/* 1. Full Canvas 2D Illustration Environment */}
      <RuangSidangBackground mood="tense" />

      {/* 2. Top Kinetic Hook Banner */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${badgeSpring})`,
          zIndex: 40,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            color: "#FFFFFF",
            padding: "16px 36px",
            borderRadius: "20px",
            boxShadow: "0 12px 30px rgba(239, 68, 68, 0.5), 0 0 0 4px #FEE2E2",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <span style={{ fontSize: "36px" }}>🚨</span>
          <span
            style={{
              fontSize: "34px",
              fontWeight: 900,
              letterSpacing: "1px",
              fontFamily: "system-ui, sans-serif",
              textTransform: "uppercase",
            }}
          >
            DI-SKAKMAT DOSEN PAS SIDANG?
          </span>
        </div>
        <div
          style={{
            marginTop: "12px",
            background: "rgba(15, 23, 42, 0.85)",
            color: "#FDE68A",
            padding: "8px 24px",
            borderRadius: "999px",
            fontSize: "20px",
            fontWeight: 800,
            border: "2px solid #F59E0B",
            backdropFilter: "blur(8px)",
          }}
        >
          ⚠️ JANGAN PANIK, INI CARA JAWABNYA!
        </div>
      </div>

      {/* 3. Karakter Dosen (Kiri) */}
      <div
        style={{
          position: "absolute",
          top: "700px",
          left: "20px",
          zIndex: 25,
        }}
      >
        <CharacterDosen expression="angry" armRaised={true} />
      </div>

      {/* 4. Karakter Mahasiswa (Kanan) with Panic Animation */}
      <div
        style={{
          position: "absolute",
          top: "700px",
          right: "20px",
          transform: `translate(${panicShake}px, 0px) rotate(${panicRotate}deg)`,
          zIndex: 25,
        }}
      >
        <CharacterMahasiswa mood="panicked" holdingDocs={true} />

        {/* Floating Rotating Question Marks & Sweat */}
        {frame > 50 && (
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: "140px",
              opacity: qMarkOpacity,
              display: "flex",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontSize: "48px",
                color: "#EF4444",
                fontWeight: 900,
                transform: `rotate(${Math.sin(frame * 0.2) * 20}deg) scale(1.1)`,
                textShadow: "0 4px 10px rgba(0,0,0,0.5)",
              }}
            >
              ❓
            </span>
            <span
              style={{
                fontSize: "56px",
                color: "#F59E0B",
                fontWeight: 900,
                transform: `rotate(${Math.cos(frame * 0.2) * 20}deg) translateY(-10px)`,
                textShadow: "0 4px 10px rgba(0,0,0,0.5)",
              }}
            >
              ⚠️
            </span>
            <span
              style={{
                fontSize: "44px",
                color: "#EF4444",
                fontWeight: 900,
                transform: `rotate(${Math.sin(frame * 0.25) * -15}deg)`,
                textShadow: "0 4px 10px rgba(0,0,0,0.5)",
              }}
            >
              ❓
            </span>
          </div>
        )}
      </div>

      {/* 5. Speech Bubble Dosen (Mepet di Atas Kepala Dosen) */}
      <div
        style={{
          position: "absolute",
          top: "560px",
          left: "30px",
          transform: `scale(${popSpring})`,
          zIndex: 35,
        }}
      >
        <SpeechBubble
          text={dosenFullText}
          sender="dosen"
          charLimit={charCount}
          highlightWords={["beda", "teori", "metodenya"]}
        />
      </div>
    </AbsoluteFill>
  );
};

// SCENE 2: CHEAT SHEET LAPTOP TRANSITION (Frames 210 - 450)
const Scene2_CheatSheetLaptop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance Zoom Spring
  const zoomIn = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Chat Bubble Spring Entrance (Starts around frame 20 / absolute 230)
  const chatSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Formula Card Spring Entrance (Starts around frame 70 / absolute 280)
  const formulaSpring = spring({
    frame: frame - 65,
    fps,
    config: { damping: 13, stiffness: 130 },
  });

  // Breakdown Card Spring Entrance (Starts around frame 120 / absolute 330)
  const breakdownSpring = spring({
    frame: frame - 110,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  // Typing animation for chat message (frame 30 to 110)
  const chatMsg = "JAWAB PAKAI FORMULA INI:";
  const chatProgress = interpolate(frame, [25, 60], [0, chatMsg.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chatChars = Math.floor(chatProgress);

  return (
    <AbsoluteFill className="overflow-hidden">
      {/* 1. Full Canvas SVG 2D Workspace Desk Background */}
      <LaptopDeskBackground />

      {/* 2. Top Header Highlight Badge */}
      <div
        style={{
          position: "absolute",
          top: "70px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 40,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
            color: "#0F172A",
            padding: "16px 36px",
            borderRadius: "20px",
            boxShadow: "0 12px 30px rgba(245, 158, 11, 0.4), 0 0 0 4px #FEF3C7",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontWeight: 900,
            fontSize: "28px",
            letterSpacing: "1px",
            fontFamily: "system-ui, sans-serif",
            textTransform: "uppercase",
          }}
        >
          <span>⚡</span>
          <span>RUMUS AUTO-ACC PERTANYAAN METODOLOGI!</span>
        </div>
      </div>

      {/* 3. Laptop Screen Frame & UI (Centered in 1080x1920) */}
      <div
        style={{
          position: "absolute",
          top: "220px",
          left: "60px",
          width: "960px",
          transform: `scale(${zoomIn})`,
          zIndex: 30,
        }}
      >
        {/* Laptop Bezel Outer */}
        <div
          style={{
            background: "#1E293B",
            borderRadius: "24px 24px 0 0",
            padding: "20px 20px 0 20px",
            boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 0 4px #475569",
          }}
        >
          {/* Laptop Webcam Dot */}
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "#334155",
              borderRadius: "50%",
              margin: "0 auto 12px auto",
              border: "1px solid #64748B",
            }}
          />

          {/* Screen Content Container */}
          <div
            style={{
              background: "#090D16",
              borderRadius: "16px 16px 0 0",
              padding: "28px",
              minHeight: "1200px",
              border: "2px solid #334155",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* Window Top Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "16px",
                borderBottom: "2px solid #1E293B",
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#EF4444" }} />
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#F59E0B" }} />
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#10B981" }} />
              </div>
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>🛡️ JagoNeliti Secret Defense Protocol.app</span>
              </div>
              <div
                style={{
                  background: "#1E293B",
                  color: "#38BDF8",
                  padding: "4px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 800,
                }}
              >
                v5.0 PRO
              </div>
            </div>

            {/* Chat Message Box from @jagoneliti_ */}
            <div
              style={{
                transform: `scale(${chatSpring})`,
                background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                borderRadius: "20px",
                padding: "20px 24px",
                border: "2px solid #38BDF8",
                boxShadow: "0 10px 25px rgba(56, 189, 248, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #38BDF8 0%, #2563EB 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
                  flexShrink: 0,
                }}
              >
                JN
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#38BDF8", fontSize: "20px", fontWeight: 800 }}>
                    @jagoneliti_
                  </span>
                  <span style={{ background: "#0284C7", color: "#FFF", fontSize: "12px", padding: "2px 8px", borderRadius: "6px", fontWeight: 800 }}>
                    VERIFIED
                  </span>
                </div>
                <div style={{ color: "#FFFFFF", fontSize: "26px", fontWeight: 900, marginTop: "4px" }}>
                  {chatMsg.slice(0, chatChars)}
                  {chatChars < chatMsg.length && (
                    <span style={{ display: "inline-block", width: "3px", height: "24px", background: "#38BDF8", marginLeft: "4px" }} />
                  )}
                </div>
              </div>
            </div>

            {/* The Golden Formula Card */}
            <div
              style={{
                transform: `scale(${formulaSpring})`,
                background: "linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)",
                borderRadius: "24px",
                padding: "32px",
                border: "3px solid #F59E0B",
                boxShadow: "0 15px 35px rgba(245, 158, 11, 0.3)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
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
                    background: "#F59E0B",
                    color: "#000",
                    padding: "6px 16px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 900,
                    letterSpacing: "1px",
                  }}
                >
                  FORMULA JAWABAN EMAS
                </span>
                <span style={{ color: "#FDE68A", fontSize: "16px", fontWeight: 700 }}>
                  ⭐ 100% Anti-Skakmat Dosen
                </span>
              </div>

              {/* The Formula Equation */}
              <div
                style={{
                  background: "rgba(0,0,0,0.6)",
                  padding: "24px",
                  borderRadius: "16px",
                  border: "2px dashed #F59E0B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "14px",
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  textAlign: "center",
                  lineHeight: "1.3",
                }}
              >
                <div style={{ color: "#F87171" }}>[ Kondisi Anomali ]</div>
                <div style={{ color: "#FBBF24", fontSize: "34px" }}>+</div>
                <div style={{ color: "#34D399" }}>[ Referensi Jurnal 2025 ]</div>
              </div>
            </div>

            {/* Step-by-Step Breakdown Cards */}
            <div
              style={{
                transform: `scale(${breakdownSpring})`,
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Step 1 */}
              <div
                style={{
                  background: "rgba(30, 41, 59, 0.9)",
                  borderRadius: "18px",
                  padding: "20px 24px",
                  borderLeft: "8px solid #F87171",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    background: "#EF4444",
                    color: "#FFF",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "20px",
                    flexShrink: 0,
                  }}
                >
                  1
                </div>
                <div>
                  <div style={{ color: "#FCA5A5", fontSize: "18px", fontWeight: 800 }}>
                    LANGKAH 1: AKUI ANOMALI LAPANGAN
                  </div>
                  <div style={{ color: "#F1F5F9", fontSize: "22px", fontWeight: 700, marginTop: "4px" }}>
                    "Izin Pak, perbedaan terjadi karena dinamika variabel di lapangan..."
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div
                style={{
                  background: "rgba(30, 41, 59, 0.9)",
                  borderRadius: "18px",
                  padding: "20px 24px",
                  borderLeft: "8px solid #34D399",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    background: "#10B981",
                    color: "#FFF",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "20px",
                    flexShrink: 0,
                  }}
                >
                  2
                </div>
                <div>
                  <div style={{ color: "#6EE7B7", fontSize: "18px", fontWeight: 800 }}>
                    LANGKAH 2: KUNCI DENGAN SITASI TERKINI
                  </div>
                  <div style={{ color: "#F1F5F9", fontSize: "22px", fontWeight: 700, marginTop: "4px" }}>
                    "Hal ini sejalan dengan temuan riset terbaru (Smith et al., 2025)!"
                  </div>
                </div>
              </div>
            </div>

            {/* Readability Hold Indicator Banner */}
            <div
              style={{
                marginTop: "auto",
                background: "rgba(56, 189, 248, 0.15)",
                border: "2px solid #38BDF8",
                borderRadius: "14px",
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                color: "#BAE6FD",
                fontSize: "18px",
                fontWeight: 800,
              }}
            >
              <span>💡</span>
              <span>Dosen langsung terdiam karena jawabanmu berbasis bukti ilmiah!</span>
            </div>
          </div>
        </div>

        {/* Laptop Keyboard Base Bottom */}
        <div
          style={{
            background: "#334155",
            height: "28px",
            borderRadius: "0 0 24px 24px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <div style={{ width: "120px", height: "8px", background: "#475569", borderRadius: "0 0 8px 8px" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// SCENE 3: JAWABAN PEMUNGKAS MAHASISWA (Frames 450 - 690)
const Scene3_JawabanMahasiswa: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance Spring
  const popSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Stamp ACC Spring & Slam Effect (Starts at frame 150 / absolute 600)
  const stampSpring = spring({
    frame: frame - 150,
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  // Mahasiswa Confident Typing Speech Bubble
  // Starts typing at frame 15, finishes around frame 120 (105 frames typing), holds until frame 240 (120 frames hold!)
  const answerText =
    "Izin menjawab Pak, perbedaan ini terjadi karena anomali variabel X, sesuai temuan jurnal terbaru (2025)!";
  const typeProgress = interpolate(frame, [15, 120], [0, answerText.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const charCount = Math.floor(typeProgress);

  return (
    <AbsoluteFill className="overflow-hidden">
      {/* 1. Full Canvas 2D Illustration Ruang Sidang */}
      <RuangSidangBackground mood="happy" />

      {/* 2. Top Banner Jawaban Mantap */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 40,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            color: "#FFFFFF",
            padding: "16px 36px",
            borderRadius: "20px",
            boxShadow: "0 12px 30px rgba(16, 185, 129, 0.4), 0 0 0 4px #D1FAE5",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <span style={{ fontSize: "34px" }}>💡</span>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 900,
              letterSpacing: "1px",
              fontFamily: "system-ui, sans-serif",
              textTransform: "uppercase",
            }}
          >
            EKSEKUSI JAWABAN PEMUNGKAS!
          </span>
        </div>
      </div>

      {/* 3. Karakter Dosen (Kiri) - Tetap Hadir, Ekspresi Terkesan */}
      <div
        style={{
          position: "absolute",
          top: "700px",
          left: "20px",
          zIndex: 25,
        }}
      >
        <CharacterDosen expression="impressed" armRaised={false} />
      </div>

      {/* 4. Karakter Mahasiswa (Kanan) - Percaya Diri & Glowing */}
      <div
        style={{
          position: "absolute",
          top: "700px",
          right: "20px",
          zIndex: 25,
        }}
      >
        <CharacterMahasiswa mood="confident" holdingDocs={true} />
      </div>

      {/* 5. Speech Bubble Mahasiswa Percaya Diri (Mepet di Atas Kepala Mahasiswa) */}
      <div
        style={{
          position: "absolute",
          top: "560px",
          right: "30px",
          transform: `scale(${popSpring})`,
          zIndex: 35,
        }}
      >
        <SpeechBubble
          text={answerText}
          sender="mahasiswa"
          charLimit={charCount}
          highlightWords={["anomali", "variabel", "X,", "jurnal", "terbaru", "(2025)!"]}
        />
      </div>

      {/* 6. Stamp / Badge "AUTO ACC! 💯" Jatuh di Atas Dosen */}
      {frame > 145 && (
        <div
          style={{
            position: "absolute",
            top: "620px",
            left: "100px",
            transform: `scale(${stampSpring}) rotate(-12deg)`,
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
              color: "#FFFFFF",
              border: "6px solid #FFFFFF",
              borderRadius: "28px",
              padding: "20px 36px",
              boxShadow: "0 20px 50px rgba(16, 185, 129, 0.6), 0 0 0 6px #10B981",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "2px" }}>
              ✅ AUTO ACC! 💯
            </div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#D1FAE5" }}>
              Dosen Puas & Tanpa Revisi Mayor!
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// SCENE 4: CELEBRATION & INTERACTIVE CTA (Frames 690 - 900)
const Scene4_CelebrationCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance Spring for Top Plaque
  const plaqueSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  // Entrance Spring for Characters
  const charSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Entrance Spring for CTA Box
  const ctaSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 13, stiffness: 110 },
  });

  // Pulsing animation for the CTA Button
  const pulse = Math.sin(frame * 0.15) * 0.04 + 1;

  return (
    <AbsoluteFill className="overflow-hidden">
      {/* 1. Full Canvas 2D Cartoon Celebration Background */}
      <CelebrationBackground />

      {/* 2. Success Plaque Banner: "SIDANG BERHASIL ACC!" */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${plaqueSpring})`,
          zIndex: 40,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
            color: "#0F172A",
            padding: "20px 48px",
            borderRadius: "24px",
            boxShadow: "0 20px 40px rgba(245, 158, 11, 0.5), 0 0 0 6px #FEF3C7",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "48px" }}>🎉</span>
          <div>
            <div
              style={{
                fontSize: "36px",
                fontWeight: 900,
                letterSpacing: "1px",
                fontFamily: "system-ui, sans-serif",
                textTransform: "uppercase",
              }}
            >
              SIDANG BERHASIL ACC!
            </div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#78350F" }}>
              PREDIKAT: CUMLAUDE ⭐⭐⭐⭐⭐
            </div>
          </div>
          <span style={{ fontSize: "48px" }}>🎓</span>
        </div>
      </div>

      {/* 3. 2D Cartoon High-Five Characters (Menapak Langsung di Atas Bar Podium Orange) */}
      <div
        style={{
          position: "absolute",
          top: "710px",
          left: "50%",
          transform: `translateX(-50%) scale(${charSpring})`,
          zIndex: 30,
        }}
      >
        <HighFiveCharacters />
      </div>

      {/* 4. Floating Interactive CTA Box (Bottom Safe Zone: >= 180px margin bottom) */}
      <div
        style={{
          position: "absolute",
          bottom: "190px",
          left: "60px",
          right: "60px",
          transform: `scale(${ctaSpring})`,
          zIndex: 45,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            borderRadius: "28px",
            padding: "28px 32px",
            border: "3px solid #38BDF8",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 30px rgba(56, 189, 248, 0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "16px",
          }}
        >
          {/* Tagline */}
          <div
            style={{
              color: "#FDE68A",
              fontSize: "24px",
              fontWeight: 900,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Pusing Menghadapi Pertanyaan Sidang?
          </div>

          {/* Main Action Button */}
          <div
            style={{
              transform: `scale(${pulse})`,
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              color: "#FFFFFF",
              padding: "18px 42px",
              borderRadius: "20px",
              fontSize: "28px",
              fontWeight: 900,
              boxShadow: "0 10px 25px rgba(239, 68, 68, 0.5), 0 0 0 3px #FEE2E2",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
            }}
          >
            <span>👉</span>
            <span>DM @jagoneliti_ SEKARANG!</span>
          </div>

          {/* Subtext Features */}
          <div
            style={{
              color: "#94A3B8",
              fontSize: "18px",
              fontWeight: 700,
              display: "flex",
              gap: "18px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <span>✨ Template Jawaban Sidang</span>
            <span>•</span>
            <span>⚡ Konsultasi Skripsi Kilat</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// 4. MAIN EXPORT COMPONENT: InteractiveScene05
// ==========================================

export const InteractiveScene05: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F172A" }}>
      {/* ---------------------------------------------------- */}
      {/* AUDIO & SFX SEQUENCES (Synchronized to PRD Storyboard) */}
      {/* ---------------------------------------------------- */}

      {/* Scene 1 SFX */}
      <Sequence from={20} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/pop.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={60} durationInFrames={45} layout="none">
        <Audio src={staticFile("audio/error_buzz.mp3")} volume={0.7} />
      </Sequence>

      {/* Scene 2 SFX */}
      <Sequence from={210} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={240} durationInFrames={110} layout="none">
        <Audio src={staticFile("audio/mecha_keyboard.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={360} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/pop.mp3")} volume={0.8} />
      </Sequence>

      {/* Scene 3 SFX */}
      <Sequence from={450} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={460} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/pop.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={600} durationInFrames={50} layout="none">
        <Audio src={staticFile("audio/coin_gain.mp3")} volume={0.85} />
      </Sequence>

      {/* Scene 4 SFX */}
      <Sequence from={690} durationInFrames={180} layout="none">
        <Audio src={staticFile("audio/applause.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={710} durationInFrames={60} layout="none">
        <Audio src={staticFile("audio/bell_ding.mp3")} volume={0.8} />
      </Sequence>

      {/* ---------------------------------------------------- */}
      {/* VISUAL SCENE SEQUENCES (Total: 900 frames / 30s)      */}
      {/* ---------------------------------------------------- */}

      {/* Scene 1: Hook - Di-Skakmat Dosen (Frames 0 - 210) */}
      <Sequence from={0} durationInFrames={210}>
        <Scene1_SidangHook />
      </Sequence>

      {/* Scene 2: Cheat Sheet Laptop Transition (Frames 210 - 450) */}
      <Sequence from={210} durationInFrames={240}>
        <Scene2_CheatSheetLaptop />
      </Sequence>

      {/* Scene 3: Jawaban Pemungkas Mahasiswa (Frames 450 - 690) */}
      <Sequence from={450} durationInFrames={240}>
        <Scene3_JawabanMahasiswa />
      </Sequence>

      {/* Scene 4: Celebration & Interactive CTA (Frames 690 - 900) */}
      <Sequence from={690} durationInFrames={210}>
        <Scene4_CelebrationCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
