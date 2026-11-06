export type ManufactureShift = "Morning" | "Afternoon" | "Night";

export type ManufactureOee = {
  availability: number;
  performance: number;
  quality: number;
  /** World-class benchmark shown as a tick on the gauge. */
  target: number;
};

export type ManufactureLine = {
  id: string;
  name: string;
  shift: ManufactureShift;
  actual: number;
  target: number;
};

export type ManufactureMachineStatus =
  "running" | "idle" | "down" | "maintenance";

export type ManufactureMachine = {
  id: string;
  name: string;
  lineId: string;
  status: ManufactureMachineStatus;
  /** Last readings, oldest first. */
  temp: number[];
  vibration: number[];
  maxTemp: number;
  maxVibration: number;
  uptimePct: number;
};

export type ManufactureDowntimeReason = {
  reason: string;
  minutes: number;
};

export type ManufactureWorkOrderType =
  "Preventive" | "Corrective" | "Calibration";

export type ManufactureWorkOrderStatus =
  "open" | "in-progress" | "blocked" | "done";

export type ManufactureWorkOrder = {
  id: string;
  title: string;
  machineId: string;
  type: ManufactureWorkOrderType;
  priority: 1 | 2 | 3;
  /** Minutes from now; negative when overdue. */
  dueMinutes: number;
  status: ManufactureWorkOrderStatus;
};
