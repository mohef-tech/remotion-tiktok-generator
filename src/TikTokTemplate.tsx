import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { VideoContentConfig } from "./types";
import { Sparkles, MessageCircle, ArrowRight } from "lucide-react";

export const TikTokTemplate: React.FC<{ config: VideoContentConfig }> = ({
  config,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Progress Bar
  const progressPercent = Math.min(100, (frame / durationInFrames) * 100);

  // Background Ambient Motion
  const bgScale = interpolate(frame, [0, durationInFrames], [1, 1.15]);
  const orbX = interpolate(
    Math.sin(frame / 20),
    [-1, 1],
    [-80, 80]
  );
  const orbY = interpolate(
    Math.cos(frame / 25),
    [-1, 1],
    [-60, 60]
  );

  // Total frames allocation
  const pointsCount = config.points.length;
  // Reserve 45 frames at start for intro hook, 60 frames at end for CTA, remainder split among points
  const introFrames = 45;
  const ctaFrames = 60;
  const availableFrames = Math.max(90, durationInFrames - introFrames - ctaFrames);
  const framesPerPoint = Math.floor(availableFrames / pointsCount);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#030712",
        color: "#f9fafb",
        fontFamily: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px 50px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Background Animated Mesh & Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `scale(${bgScale})`,
          opacity: 0.6,
        }}
      />

      {/* Floating Glowing Neon Orbs */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: `calc(50% + ${orbX}px)`,
          width: "550px",
          height: "550px",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 70%)",
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: `calc(50% + ${orbY}px)`,
          width: "450px",
          height: "450px",
          transform: "translate(-50%, 50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(250, 204, 21, 0.2) 0%, rgba(244, 63, 94, 0.1) 50%, transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Top Header & Progress Bar */}
      <div style={{ zIndex: 30 }}>
        {/* Top Progress Line */}
        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, #10b981 0%, #38bdf8 50%, #facc15 100%)",
              boxShadow: "0 0 20px #10b981",
            }}
          />
        </div>

        {/* Brand Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 28px",
              borderRadius: "999px",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 0 25px rgba(16, 185, 129, 0.2)",
            }}
          >
            <Sparkles size={28} color="#34d399" />
            <span
              style={{
                fontSize: "26px",
                fontWeight: 800,
                color: "#34d399",
                letterSpacing: "1px",
              }}
            >
              {config.badgeText || "JAGONELITI"}
            </span>
          </div>

          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.6)",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            {config.authorHandle}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 30,
          margin: "40px 0",
        }}
      >
        {/* Intro Hook Scene */}
        <Sequence from={0} durationInFrames={introFrames} layout="none">
          <IntroHookScene title={config.title} subtitle={config.subtitle} />
        </Sequence>

        {/* Points Kinetic Text Scenes */}
        {config.points.map((point, index) => {
          const startFrame = introFrames + index * framesPerPoint;
          return (
            <Sequence
              key={index}
              from={startFrame}
              durationInFrames={framesPerPoint}
              layout="none"
            >
              <KineticPointScene
                index={index + 1}
                heading={point.heading}
                body={point.body}
                highlight={point.highlight}
              />
            </Sequence>
          );
        })}

        {/* CTA Outro Scene */}
        <Sequence
          from={introFrames + pointsCount * framesPerPoint}
          durationInFrames={ctaFrames}
          layout="none"
        >
          <CtaOutroScene ctaText={config.ctaText} ctaSubtext={config.ctaSubtext} />
        </Sequence>
      </div>

      {/* Bottom Permanent Floating Handle */}
      <div
        style={{
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "14px",
            padding: "16px 36px",
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
              boxShadow: "0 0 12px #10b981",
            }}
          />
          <span style={{ fontSize: "26px", fontWeight: 700, color: "#ffffff" }}>
            Konsultasi Skripsi & Penelitian
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 1. Intro Hook Scene
const IntroHookScene: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  return (
    <div
      style={{
        textAlign: "center",
        transform: `scale(${pop})`,
        padding: "0 20px",
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "8px 24px",
          borderRadius: "12px",
          backgroundColor: "#facc15",
          color: "#000000",
          fontSize: "28px",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "24px",
          boxShadow: "0 0 30px rgba(250, 204, 21, 0.4)",
        }}
      >
        MUST WATCH 📌
      </div>

      <h1
        style={{
          fontSize: "68px",
          fontWeight: 900,
          lineHeight: 1.15,
          margin: "0 0 24px 0",
          letterSpacing: "-1.5px",
          color: "#ffffff",
          textShadow: "0 10px 30px rgba(0,0,0,0.8)",
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          style={{
            fontSize: "34px",
            color: "#38bdf8",
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

// 2. Kinetic Point Scene (Word-by-Word Highlight Dynamic Animation)
const KineticPointScene: React.FC<{
  index: number;
  heading: string;
  body: string;
  highlight?: string;
}> = ({ index, heading, body, highlight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 220 },
  });

  const words = body.split(" ");

  return (
    <div
      style={{
        textAlign: "center",
        transform: `scale(${scale})`,
        maxWidth: "920px",
        padding: "0 20px",
      }}
    >
      {/* Index Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "90px",
          height: "90px",
          borderRadius: "30px",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "#ffffff",
          fontSize: "46px",
          fontWeight: 900,
          marginBottom: "28px",
          boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
        }}
      >
        #{index}
      </div>

      {/* Point Heading */}
      <h2
        style={{
          fontSize: "58px",
          fontWeight: 900,
          margin: "0 0 32px 0",
          color: "#ffffff",
          lineHeight: 1.2,
          letterSpacing: "-1px",
        }}
      >
        {heading}
      </h2>

      {/* Kinetic Animated Body Text */}
      <div
        style={{
          fontSize: "44px",
          fontWeight: 700,
          lineHeight: 1.45,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "14px 18px",
        }}
      >
        {words.map((word, wIdx) => {
          // Staggered word animation frame offset
          const wordFrame = Math.max(0, frame - wIdx * 2);
          const wordScale = spring({
            frame: wordFrame,
            fps,
            config: { damping: 10, stiffness: 300 },
          });

          const isHighlighted =
            highlight &&
            highlight.toLowerCase().includes(word.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""));

          return (
            <span
              key={wIdx}
              style={{
                transform: `scale(${wordScale})`,
                display: "inline-block",
                color: isHighlighted ? "#facc15" : "#e5e7eb",
                backgroundColor: isHighlighted ? "rgba(250, 204, 21, 0.15)" : "transparent",
                padding: isHighlighted ? "2px 14px" : "0",
                borderRadius: isHighlighted ? "12px" : "0",
                border: isHighlighted ? "2px solid rgba(250, 204, 21, 0.4)" : "none",
                boxShadow: isHighlighted ? "0 0 20px rgba(250, 204, 21, 0.3)" : "none",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// 3. CTA Outro Scene
const CtaOutroScene: React.FC<{
  ctaText: string;
  ctaSubtext?: string;
}> = ({ ctaText, ctaSubtext }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaSpring = spring({
    frame,
    fps,
    config: { damping: 9, stiffness: 150 },
  });

  return (
    <div
      style={{
        textAlign: "center",
        transform: `scale(${ctaSpring})`,
        padding: "48px 40px",
        borderRadius: "36px",
        background: "linear-gradient(135deg, #059669 0%, #0d9488 50%, #0284c7 100%)",
        boxShadow: "0 20px 60px rgba(13, 148, 136, 0.5)",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        maxWidth: "900px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <MessageCircle size={48} color="#ffffff" />
        <h2
          style={{
            fontSize: "48px",
            fontWeight: 900,
            color: "#ffffff",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          {ctaText}
        </h2>
      </div>

      {ctaSubtext && (
        <p
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#fef08a",
            margin: "12px 0 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <span>{ctaSubtext}</span>
          <ArrowRight size={32} color="#fef08a" />
        </p>
      )}
    </div>
  );
};