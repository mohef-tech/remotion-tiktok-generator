import { Composition } from "remotion";
import { TikTokTemplate } from "./TikTokTemplate";
import rawConfig from "./content.json";
import { VideoContentConfig } from "./types";

const contentConfig = rawConfig as VideoContentConfig;

export const RemotionRoot: React.FC = () => {
  // Calculate total duration based on points length + padding
  const pointsCount = contentConfig.points ? contentConfig.points.length : 3;
  // 30 frames header + points (35 frames each) + 60 frames CTA ending
  const totalFrames = 30 + pointsCount * 35 + 90;

  return (
    <>
      <Composition
        id="JagoNelitiTikTok"
        component={() => <TikTokTemplate config={contentConfig} />}
        durationInFrames={totalFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
