export interface PointItem {
  icon?: string;
  heading: string;
  body: string;
  highlight?: string;
}

export interface VideoContentConfig {
  theme: "academic-dark" | "emerald-night" | "purple-cosmos" | "midnight-blue";
  showBadge: boolean;
  badgeText: string;
  badgeCategory?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  points: PointItem[];
  ctaText: string;
  ctaSubtext?: string;
  authorHandle: string;
  authorName: string;
}
