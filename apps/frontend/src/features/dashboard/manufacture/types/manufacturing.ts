export type ManufacturingShift = "Morning" | "Afternoon" | "Night";

export type ManufacturingOee = {
  availability: number;
  performance: number;
  quality: number;
  /** World-class benchmark shown as a tick on the gauge. */
  target: number;
};

export type ManufacturingLine = {
  id: string;
  name: string;
  shift: ManufacturingShift;
  actual: number;
  target: number;
};

export type ManufacturingMachineStatus =
  "running" | "idle" | "down" | "maintenance";

export type ManufacturingMachine = {
  id: string;
  name: string;
  lineId: string;
  status: ManufacturingMachineStatus;
  /** Last readings, oldest first. */
  temp: number[];
  vibration: number[];
  maxTemp: number;
  maxVibration: number;
  uptimePct: number;
};

/** Footprint of a machine on the isometric floor plan, in grid units. */
export type ManufacturingFloorSlot = {
  machineId: string;
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
};

/** A production lane on the floor plan, spanning rows `y` to `y + d`. */
export type ManufacturingFloorLane = {
  lineId: string;
  label: string;
  y: number;
  d: number;
};

export type ManufacturingDowntimeReason = {
  reason: string;
  minutes: number;
};

export type ManufacturingWorkOrderType =
  "Preventive" | "Corrective" | "Calibration";

export type ManufacturingWorkOrderStatus =
  "open" | "in-progress" | "blocked" | "done";

export type ManufacturingWorkOrder = {
  id: string;
  title: string;
  machineId: string;
  type: ManufacturingWorkOrderType;
  priority: 1 | 2 | 3;
  /** Minutes from now; negative when overdue. */
  dueMinutes: number;
  status: ManufacturingWorkOrderStatus;
};
