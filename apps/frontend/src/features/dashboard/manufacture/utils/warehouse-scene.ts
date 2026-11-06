/**
 * Data for the isometric production-warehouse cutaway. Everything is in grid
 * units; `x` runs to the lower right, `y` to the lower left, `z` up. Machines
 * are built from boxes so they read as recognisable silhouettes without any
 * 3D library.
 */
export const WAREHOUSE = {
  width: 15,
  depth: 10.5,
  wallHeight: 3.4,
  lipHeight: 0.45,
  roofLift: 1.5,
};

export type PartTone =
  | "metal"
  | "metalDark"
  | "accent"
  | "belt"
  | "roller"
  | "pallet"
  | "crate"
  | "fence"
  | "glass"
  | "rack"
  | "forklift"
  | "tyre";

export type ScenePart = {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  tone: PartTone;
};

export type MachineSprite = {
  machineId: string;
  /** Anchor on the floor; part coordinates are relative to it. */
  x: number;
  y: number;
  /** Footprint for the selection halo. */
  w: number;
  d: number;
  /** Where the status beacon sits, relative to the anchor. */
  beacon: { x: number; y: number; z: number };
  parts: ScenePart[];
};

const press = (): ScenePart[] => [
  { x: 0, y: 0, z: 0, w: 2.2, d: 1.6, h: 0.9, tone: "metalDark" },
  { x: 0.25, y: 0.25, z: 0.9, w: 0.5, d: 1.1, h: 1.6, tone: "metal" },
  { x: 1.45, y: 0.25, z: 0.9, w: 0.5, d: 1.1, h: 1.6, tone: "metal" },
  { x: 0.1, y: 0.15, z: 2.5, w: 2.0, d: 1.3, h: 0.45, tone: "metalDark" },
  { x: 0.75, y: 0.5, z: 0.9, w: 0.7, d: 0.6, h: 0.5, tone: "accent" },
];

const robotCell = (): ScenePart[] => [
  // Safety fence: four low rails.
  { x: 0, y: 0, z: 0, w: 2.6, d: 0.08, h: 0.9, tone: "fence" },
  { x: 0, y: 2.1, z: 0, w: 2.6, d: 0.08, h: 0.9, tone: "fence" },
  { x: 0, y: 0, z: 0, w: 0.08, d: 2.18, h: 0.9, tone: "fence" },
  { x: 2.52, y: 0, z: 0, w: 0.08, d: 2.18, h: 0.9, tone: "fence" },
  // Robot: base, column, arm, wrist.
  { x: 0.95, y: 0.75, z: 0, w: 0.7, d: 0.7, h: 0.35, tone: "metalDark" },
  { x: 1.1, y: 0.9, z: 0.35, w: 0.4, d: 0.4, h: 1.1, tone: "accent" },
  { x: 1.1, y: 0.95, z: 1.45, w: 1.3, d: 0.3, h: 0.3, tone: "accent" },
  { x: 2.25, y: 0.9, z: 0.9, w: 0.3, d: 0.4, h: 0.85, tone: "metal" },
  // Work table.
  { x: 0.3, y: 0.3, z: 0, w: 0.6, d: 1.4, h: 0.55, tone: "metal" },
];

const casePacker = (): ScenePart[] => [
  { x: 0, y: 0, z: 0, w: 3.0, d: 1.4, h: 1.3, tone: "metal" },
  { x: 0.2, y: -0.05, z: 1.3, w: 2.6, d: 0.3, h: 0.5, tone: "glass" },
  { x: 2.4, y: 0.35, z: 1.3, w: 0.5, d: 0.7, h: 0.35, tone: "metalDark" },
  // Infeed conveyor.
  { x: 3.0, y: 0.45, z: 0.45, w: 2.3, d: 0.5, h: 0.12, tone: "belt" },
  { x: 3.2, y: 0.6, z: 0, w: 0.12, d: 0.2, h: 0.45, tone: "metalDark" },
  { x: 5.0, y: 0.6, z: 0, w: 0.12, d: 0.2, h: 0.45, tone: "metalDark" },
  { x: 3.6, y: 0.5, z: 0.57, w: 0.4, d: 0.4, h: 0.3, tone: "crate" },
  { x: 4.4, y: 0.5, z: 0.57, w: 0.4, d: 0.4, h: 0.3, tone: "crate" },
];

const palletizer = (): ScenePart[] => [
  { x: 0, y: 0, z: 0, w: 0.35, d: 0.35, h: 2.4, tone: "metal" },
  { x: 2.05, y: 0, z: 0, w: 0.35, d: 0.35, h: 2.4, tone: "metal" },
  { x: 0, y: 1.6, z: 0, w: 0.35, d: 0.35, h: 2.4, tone: "metal" },
  { x: 2.05, y: 1.6, z: 0, w: 0.35, d: 0.35, h: 2.4, tone: "metal" },
  { x: 0, y: 0, z: 2.4, w: 2.4, d: 1.95, h: 0.25, tone: "metalDark" },
  { x: 0.9, y: 0.7, z: 1.5, w: 0.5, d: 0.5, h: 0.9, tone: "accent" },
  // Pallet with stacked cases.
  { x: 0.45, y: 0.35, z: 0, w: 1.4, d: 1.2, h: 0.15, tone: "pallet" },
  { x: 0.5, y: 0.4, z: 0.15, w: 1.3, d: 1.1, h: 0.45, tone: "crate" },
  { x: 0.5, y: 0.4, z: 0.6, w: 1.3, d: 1.1, h: 0.45, tone: "crate" },
];

const sprayBooth = (): ScenePart[] => [
  { x: 0, y: 0, z: 0, w: 2.6, d: 0.2, h: 2.2, tone: "metal" },
  { x: 0, y: 0, z: 0, w: 0.2, d: 1.9, h: 2.2, tone: "metal" },
  { x: 0, y: 0, z: 2.2, w: 2.6, d: 1.9, h: 0.2, tone: "metalDark" },
  { x: 0.2, y: 0.2, z: 0, w: 2.4, d: 1.7, h: 0.08, tone: "glass" },
  { x: 1.0, y: 0.5, z: 0.08, w: 0.8, d: 0.8, h: 0.9, tone: "accent" },
  { x: 0.5, y: 0.6, z: 2.4, w: 0.5, d: 0.5, h: 0.7, tone: "metalDark" },
  { x: 1.7, y: 0.6, z: 2.4, w: 0.5, d: 0.5, h: 0.7, tone: "metalDark" },
];

const curingOven = (): ScenePart[] => [
  { x: 0, y: 0, z: 0, w: 3.6, d: 1.6, h: 1.7, tone: "metalDark" },
  { x: 0.15, y: 1.6, z: 0.25, w: 3.3, d: 0.05, h: 1.1, tone: "glass" },
  { x: 0.6, y: 0.4, z: 1.7, w: 0.45, d: 0.45, h: 1.1, tone: "metal" },
  { x: 2.6, y: 0.4, z: 1.7, w: 0.45, d: 0.45, h: 1.1, tone: "metal" },
  { x: -0.9, y: 0.5, z: 0.4, w: 0.9, d: 0.5, h: 0.12, tone: "belt" },
  { x: 3.6, y: 0.5, z: 0.4, w: 0.9, d: 0.5, h: 0.12, tone: "belt" },
];

const testBench = (): ScenePart[] => [
  { x: 0.05, y: 0.05, z: 0, w: 0.12, d: 0.12, h: 0.9, tone: "metalDark" },
  { x: 2.0, y: 0.05, z: 0, w: 0.12, d: 0.12, h: 0.9, tone: "metalDark" },
  { x: 0.05, y: 1.2, z: 0, w: 0.12, d: 0.12, h: 0.9, tone: "metalDark" },
  { x: 2.0, y: 1.2, z: 0, w: 0.12, d: 0.12, h: 0.9, tone: "metalDark" },
  { x: 0, y: 0, z: 0.9, w: 2.2, d: 1.4, h: 0.12, tone: "metal" },
  { x: 0.3, y: 0.2, z: 1.02, w: 0.9, d: 0.6, h: 0.35, tone: "accent" },
  { x: 1.5, y: 0.1, z: 1.02, w: 0.1, d: 0.7, h: 0.6, tone: "glass" },
];

export const machineSprites: MachineSprite[] = [
  {
    machineId: "M-01",
    x: 1.2,
    y: 0.9,
    w: 2.2,
    d: 1.6,
    beacon: { x: 1.1, y: 0.8, z: 3.1 },
    parts: press(),
  },
  {
    machineId: "M-02",
    x: 7.3,
    y: 0.9,
    w: 2.2,
    d: 1.6,
    beacon: { x: 1.1, y: 0.8, z: 3.1 },
    parts: press(),
  },
  {
    machineId: "M-03",
    x: 1.0,
    y: 3.1,
    w: 2.6,
    d: 2.2,
    beacon: { x: 1.3, y: 1.1, z: 2.0 },
    parts: robotCell(),
  },
  {
    machineId: "M-04",
    x: 7.1,
    y: 3.1,
    w: 2.6,
    d: 2.2,
    beacon: { x: 1.3, y: 1.1, z: 2.0 },
    parts: robotCell(),
  },
  {
    machineId: "M-05",
    x: 1.0,
    y: 5.9,
    w: 5.3,
    d: 1.4,
    beacon: { x: 1.5, y: 0.7, z: 2.0 },
    parts: casePacker(),
  },
  {
    machineId: "M-06",
    x: 7.6,
    y: 5.6,
    w: 2.4,
    d: 1.95,
    beacon: { x: 1.2, y: 1.0, z: 2.8 },
    parts: palletizer(),
  },
  {
    machineId: "M-07",
    x: 1.0,
    y: 8.1,
    w: 2.6,
    d: 1.9,
    beacon: { x: 1.3, y: 0.95, z: 3.3 },
    parts: sprayBooth(),
  },
  {
    machineId: "M-08",
    x: 5.6,
    y: 8.3,
    w: 3.6,
    d: 1.6,
    beacon: { x: 1.8, y: 0.8, z: 3.0 },
    parts: curingOven(),
  },
  {
    machineId: "M-09",
    x: 11.6,
    y: 4.4,
    w: 2.2,
    d: 1.4,
    beacon: { x: 1.1, y: 0.7, z: 1.9 },
    parts: testBench(),
  },
];

/** Conveyors linking the lines, storage racks, pallets and a forklift. */
export const sceneProps: ScenePart[] = [
  // Line 1 and 2 transfer conveyors.
  { x: 3.5, y: 1.45, z: 0.45, w: 3.7, d: 0.5, h: 0.12, tone: "belt" },
  { x: 3.8, y: 1.6, z: 0, w: 0.12, d: 0.2, h: 0.45, tone: "metalDark" },
  { x: 6.8, y: 1.6, z: 0, w: 0.12, d: 0.2, h: 0.45, tone: "metalDark" },
  { x: 3.7, y: 4.0, z: 0.45, w: 3.3, d: 0.5, h: 0.12, tone: "belt" },
  { x: 4.0, y: 4.15, z: 0, w: 0.12, d: 0.2, h: 0.45, tone: "metalDark" },
  { x: 6.6, y: 4.15, z: 0, w: 0.12, d: 0.2, h: 0.45, tone: "metalDark" },
  // Storage racks along the right wall.
  { x: 11.2, y: 6.6, z: 0, w: 3.2, d: 0.9, h: 0.1, tone: "rack" },
  { x: 11.2, y: 6.6, z: 1.3, w: 3.2, d: 0.9, h: 0.1, tone: "rack" },
  { x: 11.2, y: 6.6, z: 2.6, w: 3.2, d: 0.9, h: 0.1, tone: "rack" },
  { x: 11.2, y: 6.6, z: 0, w: 0.1, d: 0.9, h: 2.7, tone: "rack" },
  { x: 14.3, y: 6.6, z: 0, w: 0.1, d: 0.9, h: 2.7, tone: "rack" },
  { x: 12.75, y: 6.6, z: 0, w: 0.1, d: 0.9, h: 2.7, tone: "rack" },
  { x: 11.45, y: 6.7, z: 0.1, w: 1.1, d: 0.7, h: 0.8, tone: "crate" },
  { x: 13.0, y: 6.7, z: 0.1, w: 1.1, d: 0.7, h: 0.6, tone: "crate" },
  { x: 11.45, y: 6.7, z: 1.4, w: 1.1, d: 0.7, h: 0.7, tone: "crate" },
  { x: 13.0, y: 6.7, z: 1.4, w: 1.1, d: 0.7, h: 0.9, tone: "crate" },
  { x: 13.0, y: 6.7, z: 2.7, w: 1.1, d: 0.7, h: 0.5, tone: "crate" },
  // Pallets waiting by the racks.
  { x: 11.4, y: 8.5, z: 0, w: 1.2, d: 1.0, h: 0.15, tone: "pallet" },
  { x: 11.45, y: 8.55, z: 0.15, w: 1.1, d: 0.9, h: 0.5, tone: "crate" },
  { x: 12.9, y: 8.5, z: 0, w: 1.2, d: 1.0, h: 0.15, tone: "pallet" },
  { x: 12.95, y: 8.55, z: 0.15, w: 1.1, d: 0.9, h: 0.5, tone: "crate" },
  { x: 12.95, y: 8.55, z: 0.65, w: 1.1, d: 0.9, h: 0.5, tone: "crate" },
  // Forklift near the loading corner.
  { x: 12.0, y: 1.0, z: 0.25, w: 1.3, d: 0.9, h: 0.5, tone: "forklift" },
  { x: 12.1, y: 1.1, z: 0.75, w: 0.6, d: 0.7, h: 0.9, tone: "forklift" },
  { x: 12.1, y: 1.1, z: 1.65, w: 1.1, d: 0.7, h: 0.08, tone: "metalDark" },
  { x: 13.3, y: 1.0, z: 0, w: 0.1, d: 0.9, h: 1.9, tone: "metalDark" },
  { x: 13.4, y: 1.1, z: 0.1, w: 0.9, d: 0.08, h: 0.06, tone: "metal" },
  { x: 13.4, y: 1.75, z: 0.1, w: 0.9, d: 0.08, h: 0.06, tone: "metal" },
  { x: 12.1, y: 0.9, z: 0, w: 0.3, d: 0.15, h: 0.3, tone: "tyre" },
  { x: 12.9, y: 0.9, z: 0, w: 0.3, d: 0.15, h: 0.3, tone: "tyre" },
  { x: 12.1, y: 1.85, z: 0, w: 0.3, d: 0.15, h: 0.3, tone: "tyre" },
  { x: 12.9, y: 1.85, z: 0, w: 0.3, d: 0.15, h: 0.3, tone: "tyre" },
];

/** Yellow floor lanes between the production lines. */
export const floorLanes = [2.75, 5.3, 7.75].map((y) => ({
  x: 0.4,
  y,
  w: 10.2,
  d: 0.08,
}));

export const sortKey = (part: ScenePart) => part.x + part.y + part.z * 0.01;
