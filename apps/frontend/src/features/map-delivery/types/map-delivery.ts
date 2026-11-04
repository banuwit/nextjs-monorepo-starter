export type LngLat = [number, number];

export type VanBody = "cargo-van" | "box-truck" | "reefer" | "cargo-bike";
export type Powertrain = "ev" | "diesel" | "gas";
export type VanStatus =
  | "en-route"
  | "loading"
  | "returning"
  | "at-depot"
  | "breakdown"
  | "retired";
export type DriveMode = "eco" | "normal" | "sport";

export type StopStatus = "to-go" | "delivered" | "failed";
export type FailReason =
  | "no-answer"
  | "wrong-address"
  | "refused"
  | "damaged"
  | "no-access";

export type ExceptionKind =
  | "breakdown"
  | "late-stop"
  | "low-range"
  | "cargo-temp"
  | "failed-attempt";

export type Driver = { id: string; name: string; phone: string };
export type Area = { id: string; name: string; center: LngLat };

export type TimeWindow = { start: string; end: string };

export type Stop = {
  id: string;
  vanId: string;
  recipient: string;
  merchant: string;
  address: string;
  note?: string;
  position: LngLat;
  window: TimeWindow;
  /** Planned arrival, "HH:MM". */
  eta: string;
  status: StopStatus;
  parcels: number;
  coldChain: boolean;
  failReason?: FailReason;
  /** Actual completion time, "HH:MM". */
  completedAt?: string;
};

export type VanControls = {
  driveMode: DriveMode;
  /** Speed governor, 45–75 mph. */
  speedLimit: number;
  /** EV charge limit (%) — only on `ev` powertrains. */
  chargeLimit?: number;
  /** Refuel alert threshold (%) — only on combustion powertrains. */
  refuelAlert?: number;
  /** Cold setpoint (°C) — only on reefers. */
  coldSetpoint?: number;
  laneAssist: boolean;
  autoBrake: boolean;
  geofence: boolean;
};

export type ActivityEntry = { at: string; message: string };

export type Van = {
  id: string;
  /** Call sign, e.g. "HR-07". */
  name: string;
  plate: string;
  driverId: string;
  body: VanBody;
  powertrain: Powertrain;
  status: VanStatus;
  areaId: string;
  position: LngLat;
  /** Degrees clockwise from north. */
  heading: number;
  /** Remaining range in km. */
  rangeKm: number;
  /** Battery or fuel level, %. */
  energyPct: number;
  capacity: number;
  /** Cargo temperature in °C on reefers. */
  cargoTempC?: number;
  /** Time the van is expected back at the depot, "HH:MM". */
  returnEta: string;
  controls: VanControls;
  activity: ActivityEntry[];
};

export type FleetException = {
  id: string;
  kind: ExceptionKind;
  vanId: string;
  stopId?: string;
  message: string;
  /** "HH:MM" today. */
  at: string;
  acknowledged: boolean;
};

export type FleetState = {
  depot: LngLat;
  /** Current wall clock used by the demo, "HH:MM". */
  now: string;
  drivers: Driver[];
  areas: Area[];
  vans: Van[];
  stops: Stop[];
  exceptions: FleetException[];
};

export type VanDraft = {
  name: string;
  plate: string;
  driverId: string;
  body: VanBody;
  powertrain: Powertrain;
  areaId: string;
  capacity: number;
};

export type DeliveryDraft = {
  recipient: string;
  merchant: string;
  address: string;
  note: string;
  windowStart: string;
  parcels: number;
  coldChain: boolean;
  vanId: string;
  position: LngLat;
};

export type MapLayers = { routes: boolean; stops: boolean; labels: boolean };

/** OpenFreeMap style names; `auto` follows the app theme (positron / dark). */
export type MapBasemap = "auto" | "bright" | "positron" | "dark" | "fiord";
