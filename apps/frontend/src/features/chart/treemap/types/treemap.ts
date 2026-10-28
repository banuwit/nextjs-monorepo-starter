export type TreemapItem = {
  name: string;
  size?: number;
  children?: { name: string; size: number }[];
};

/** Flat tile data: the renderer reads `tileFill`, `lightText`, `subLabel`. */
export type Tile = {
  name: string;
  size: number;
  tileFill: string;
  lightText?: boolean;
  subLabel?: string;
};

export type TileOptions = {
  /** Space between tiles in px; 0 uses a card-colored border instead. */
  gap?: number;
  radius?: number;
  /** Center the labels instead of the top-left corner. */
  centered?: boolean;
  /** Show a pointer cursor, e.g. for drill-down. */
  clickable?: boolean;
};
