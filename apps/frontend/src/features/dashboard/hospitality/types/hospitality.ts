export type HospitalityOccupancyPoint = {
  /** ISO day, e.g. "2026-11-06". */
  date: string;
  occupancy: number;
  lastYear: number;
};

export type HospitalityFloor = 2 | 3 | 4 | 5 | 6;

export type HospitalityRoomType = "Standard" | "Deluxe" | "Suite";

export type HospitalityRoomState =
  "occupied" | "vacant-clean" | "vacant-dirty" | "out-of-order" | "due-out";

export type HospitalityRoom = {
  /** Room number, e.g. "204". */
  number: string;
  floor: HospitalityFloor;
  type: HospitalityRoomType;
  state: HospitalityRoomState;
  guest?: string;
};

export type HospitalityMovement = {
  arrivals: { total: number; checkedIn: number; expected: number };
  departures: { total: number; checkedOut: number; pending: number };
};

export type HospitalityArrival = {
  id: string;
  /** "HH:mm" expected arrival time. */
  time: string;
  guest: string;
  roomType: HospitalityRoomType;
  vip: boolean;
};

export type HospitalityHousekeepingTeam = {
  id: string;
  name: string;
  cleaned: number;
  total: number;
};

export type HospitalityFlagReason = "maintenance" | "deep-clean";

export type HospitalityFlaggedRoom = {
  room: string;
  reason: HospitalityFlagReason;
  note: string;
};

export type HospitalityRevenue = {
  rooms: number;
  fnb: number;
  spa: number;
  events: number;
};

export type HospitalityChannel = "Direct" | "OTA" | "Corporate" | "Walk-in";

export type HospitalityReservationStatus =
  "confirmed" | "checked-in" | "checked-out" | "no-show" | "cancelled";

export type HospitalityReservation = {
  /** Booking code, e.g. "RSV-2041". */
  id: string;
  guest: string;
  room: string;
  roomType: HospitalityRoomType;
  /** ISO day. */
  checkIn: string;
  /** ISO day. */
  checkOut: string;
  nights: number;
  channel: HospitalityChannel;
  status: HospitalityReservationStatus;
};
