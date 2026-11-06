export type HospitalityRoomType = "Standard" | "Deluxe" | "Suite";

export type HospitalityForecastDay = {
  /** ISO day, e.g. "2026-11-06". */
  date: string;
  /** Days from today; 0 is tonight, negative is the past. */
  offset: number;
  /** Rooms sold (or forecast) as a share of 150. */
  occupancy: number;
  /** Average daily rate in IDR. */
  adr: number;
  /** Rooms still unsold for that night. */
  roomsToSell: number;
};

export type HospitalityArrivalBucket = {
  /** Hour of day, 12–21. */
  hour: number;
  expected: number;
};

export type HospitalityLoyaltyTier = "Gold" | "Silver" | "Member";

export type HospitalityArrival = {
  id: string;
  /** "HH:mm" expected arrival time. */
  eta: string;
  guest: string;
  roomType: HospitalityRoomType;
  tier: HospitalityLoyaltyTier;
  /** One-line stay preference from the guest profile. */
  preference: string;
  vip: boolean;
};

export type HospitalityHousekeepingStage =
  "dirty" | "cleaning" | "inspecting" | "ready";

/** Short room-type code printed on housekeeping chips. */
export type HospitalityRoomTypeCode = "STD" | "DLX" | "STE" | "FAM";

export type HospitalityBoardRoom = {
  /** Room number, e.g. "204". */
  number: string;
  type: HospitalityRoomTypeCode;
  /** Initials of the assigned attendant; empty when still unassigned. */
  attendant: string;
};

export type HospitalityHousekeepingColumn = {
  stage: HospitalityHousekeepingStage;
  /** Total rooms in this stage, including ones not listed in `rooms`. */
  count: number;
  rooms: readonly HospitalityBoardRoom[];
};

export type HospitalityAttendant = {
  id: string;
  name: string;
  done: number;
  assigned: number;
};

export type HospitalityReviewChannel = "Google" | "Booking" | "TripAdvisor";

export type HospitalityReviewSummary = {
  rating: number;
  reviews: number;
  needsReply: number;
  /** Review counts for 5★ down to 1★. */
  distribution: readonly [number, number, number, number, number];
};

export type HospitalityReviewTopic =
  "Cleanliness" | "Breakfast" | "Staff" | "Location" | "Noise" | "Wi-Fi";

export type HospitalityReview = {
  id: string;
  guest: string;
  channel: HospitalityReviewChannel;
  stars: 1 | 2 | 3 | 4 | 5;
  quote: string;
  topics: readonly HospitalityReviewTopic[];
  /** "HH:mm" or relative label such as "Yesterday". */
  when: string;
  replied: boolean;
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
