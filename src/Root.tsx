import React from "react";
import { Composition, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { TikTokTemplate } from "./TikTokTemplate";
import { InteractiveScene02 } from "./components/InteractiveScene02";
import rawConfig from "./content.json";
import { VideoContentConfig, SceneDurations } from "./types";

const contentConfig = rawConfig as VideoContentConfig;
const fps = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="JagoNelitiTikTok"
        component={(props) => (
          <TikTokTemplate
            config={(props.config as VideoContentConfig) || contentConfig}
            sceneDurations={
              (props.sceneDurations as SceneDurations) || {
                introFrames: 120,
                pointsFrames: [150, 150, 150],
                ctaFrames: 120,
              }
            }
          />
        )}
        durationInFrames={450}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          config: contentConfig,
          sceneDurations: {
            introFrames: 120,
            pointsFrames: [150, 150, 150],
            ctaFrames: 120,
          },
        }}
        calculateMetadata={async () => {
          try {
            // 1. Measure Intro
            const introSec = await getAudioDurationInSeconds(staticFile("audio_intro.mp3"));
            const introFrames = Math.max(30, Math.ceil(introSec * fps));

            // 2. Measure Points
            const pointsFrames: number[] = [];
            for (let i = 0; i < contentConfig.points.length; i++) {
              const sec = await getAudioDurationInSeconds(staticFile(`audio_point_${i}.mp3`));
              pointsFrames.push(Math.max(30, Math.ceil(sec * fps)));
            }

            // 3. Measure CTA
            const ctaSec = await getAudioDurationInSeconds(staticFile("audio_cta.mp3"));
            const ctaFrames = Math.max(30, Math.ceil(ctaSec * fps));

            const sceneDurations: SceneDurations = {
              introFrames,
              pointsFrames,
              ctaFrames,
            };

            const totalDurationInFrames =
              introFrames + pointsFrames.reduce((a, b) => a + b, 0) + ctaFrames;

            console.log("🔊 Precise Audio Sync Calculated:", {
              totalDurationInFrames,
              sceneDurations,
            });

            return {
              durationInFrames: totalDurationInFrames,
              props: {
                config: contentConfig,
                sceneDurations,
              },
            };
          } catch (error) {
            console.warn("Could not calculate exact audio durations, using fallback", error);
            return {
              durationInFrames: 570,
              props: {
                config: contentConfig,
                sceneDurations: {
                  introFrames: 120,
                  pointsFrames: [150, 150, 150],
                  ctaFrames: 120,
                },
              },
            };
          }
        }}
      />
      <Composition
        id="JagoNeliti-V02"
        component={InteractiveScene02}
        durationInFrames={840}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
