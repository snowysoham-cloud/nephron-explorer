export interface ReabsorptionDataPoint {
  substance: string;
  percentage: number;
}

export type AnimationType =
  | "filtration"
  | "reabsorption"
  | "loop"
  | "secretion"
  | "collection";

export type ExplorationPhase = "welcome" | "map" | "exploring" | "done";

export interface MapPosition {
  x: number; // 0-100, percentage within SVG viewport
  y: number; // 0-100, percentage within SVG viewport
}

export interface NephronStage {
  id: number;
  name: string;
  emoji: string;
  colorVar: string; // CSS variable name, e.g. "stage-1"
  shortDesc: string; // 1-2 sentence hook shown on map
  fullDesc: string; // 3-4 sentences of detail shown in explore view
  funFact: string; // interesting tidbit shown as highlight
  substances: string[]; // what's filtered/reabsorbed/secreted
  reabsorptionData: ReabsorptionDataPoint[];
  animationType: AnimationType;
  mapPosition: MapPosition;
}
