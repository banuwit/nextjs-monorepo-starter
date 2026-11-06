// Data contoh untuk dashboard Hospitality; belum terhubung ke API.
import type { KpiItem } from "@/features/dashboard/hospitality/types/dashboard";
import type {
  HospitalityArrival,
  HospitalityArrivalBucket,
  HospitalityAttendant,
  HospitalityForecastDay,
  HospitalityHousekeepingColumn,
  HospitalityReservation,
  HospitalityReview,
  HospitalityReviewSummary,
  HospitalityRevenue,
} from "@/features/dashboard/hospitality/types/hospitality";

export const hospitalityMetrics = [
  {
    label: "Occupancy",
    value: "84%",
    delta: { value: "+5 pts", direction: "up", sentiment: "good" },
    context: "126 of 150 rooms",
    trend: [76, 79, 81, 78, 83, 79, 84],
  },
  {
    label: "ADR",
    value: "Rp 1.250.000",
    delta: { value: "+3%", direction: "up", sentiment: "good" },
    context: "average daily rate",
    trend: [1.18, 1.2, 1.19, 1.22, 1.21, 1.24, 1.25],
  },
  {
    label: "RevPAR",
    value: "Rp 1.050.000",
    delta: { value: "+9%", direction: "up", sentiment: "good" },
    context: "revenue per available room",
    trend: [0.9, 0.95, 0.96, 0.95, 1.0, 0.98, 1.05],
  },
  {
    label: "Guest rating",
    value: "4.6 / 5",
    delta: { value: "+0.1", direction: "up", sentiment: "good" },
    context: "from 38 reviews this week",
    trend: [4.4, 4.5, 4.4, 4.5, 4.6, 4.5, 4.6],
  },
] as const satisfies readonly KpiItem[];

export const hospitalityRoomCount = 150;

/** Occupancy a night must reach before rate pushes make sense. */
export const hospitalityOccupancyFloor = 70;

/** ISO day for `n` days before `today` (an ISO timestamp at noon UTC). */
function daysAgo(today: string, n: number) {
  const date = new Date(today);
  date.setUTCDate(date.getUTCDate() - n);
  return date.toISOString().slice(0, 10);
}

// Fourteen nights around tonight: seven already sold, tonight, and six more
// on the books. Pairs of occupancy % and ADR stay deterministic so the server
// and client render the same chart; offset 0 is tonight.
const forecastSeeds: ReadonlyArray<{
  offset: number;
  occupancy: number;
  adr: number;
}> = [
  { offset: -7, occupancy: 78, adr: 1_180_000 },
  { offset: -6, occupancy: 81, adr: 1_200_000 },
  { offset: -5, occupancy: 88, adr: 1_260_000 },
  { offset: -4, occupancy: 92, adr: 1_310_000 },
  { offset: -3, occupancy: 86, adr: 1_240_000 },
  { offset: -2, occupancy: 74, adr: 1_150_000 },
  { offset: -1, occupancy: 79, adr: 1_210_000 },
  { offset: 0, occupancy: 84, adr: 1_250_000 },
  { offset: 1, occupancy: 90, adr: 1_320_000 },
  { offset: 2, occupancy: 94, adr: 1_380_000 },
  { offset: 3, occupancy: 87, adr: 1_290_000 },
  { offset: 4, occupancy: 66, adr: 1_120_000 },
  { offset: 5, occupancy: 61, adr: 1_090_000 },
  { offset: 6, occupancy: 72, adr: 1_160_000 },
];

export function hospitalityForecast(today: string): HospitalityForecastDay[] {
  return forecastSeeds.map(({ offset, occupancy, adr }) => ({
    date: daysAgo(today, -offset),
    offset,
    occupancy,
    adr,
    roomsToSell:
      hospitalityRoomCount -
      Math.round((occupancy / 100) * hospitalityRoomCount),
  }));
}

/** Expected check-ins per hour from 12:00 to 21:00; 42 arrivals in total. */
export const hospitalityArrivalBuckets = [
  { hour: 12, expected: 2 },
  { hour: 13, expected: 3 },
  { hour: 14, expected: 7 },
  { hour: 15, expected: 9 },
  { hour: 16, expected: 6 },
  { hour: 17, expected: 5 },
  { hour: 18, expected: 4 },
  { hour: 19, expected: 3 },
  { hour: 20, expected: 2 },
  { hour: 21, expected: 1 },
] as const satisfies readonly HospitalityArrivalBucket[];

export const hospitalityArrivals = [
  {
    id: "a1",
    eta: "14:30",
    guest: "Rina Marlina",
    roomType: "Deluxe",
    tier: "Gold",
    preference: "High floor, feather-free pillows",
    vip: true,
  },
  {
    id: "a2",
    eta: "14:45",
    guest: "Agus Prasetyo",
    roomType: "Standard",
    tier: "Member",
    preference: "Twin beds, late checkout if available",
    vip: false,
  },
  {
    id: "a3",
    eta: "15:10",
    guest: "Dewi Lestari",
    roomType: "Suite",
    tier: "Gold",
    preference: "Anniversary stay, sparkling wine on arrival",
    vip: true,
  },
  {
    id: "a4",
    eta: "15:30",
    guest: "Bambang Susilo",
    roomType: "Standard",
    tier: "Silver",
    preference: "Quiet room away from the lift",
    vip: false,
  },
] as const satisfies readonly HospitalityArrival[];

// Room numbers follow floor + index; type codes: STD standard, DLX deluxe,
// STE suite, FAM family. Attendant initials match `hospitalityAttendants`.
export const hospitalityHousekeepingBoard = [
  {
    stage: "dirty",
    count: 23,
    rooms: [
      { number: "204", type: "STD", attendant: "" },
      { number: "211", type: "STD", attendant: "" },
      { number: "318", type: "DLX", attendant: "SA" },
      { number: "327", type: "FAM", attendant: "" },
      { number: "402", type: "STD", attendant: "DP" },
      { number: "415", type: "STD", attendant: "" },
    ],
  },
  {
    stage: "cleaning",
    count: 9,
    rooms: [
      { number: "209", type: "STD", attendant: "LW" },
      { number: "222", type: "DLX", attendant: "LW" },
      { number: "305", type: "STD", attendant: "SA" },
      { number: "411", type: "STD", attendant: "DP" },
      { number: "429", type: "STE", attendant: "RH" },
      { number: "516", type: "FAM", attendant: "NK" },
    ],
  },
  {
    stage: "inspecting",
    count: 6,
    rooms: [
      { number: "219", type: "DLX", attendant: "LW" },
      { number: "308", type: "STD", attendant: "SA" },
      { number: "423", type: "DLX", attendant: "DP" },
      { number: "530", type: "STE", attendant: "RH" },
      { number: "606", type: "STD", attendant: "NK" },
      { number: "614", type: "STD", attendant: "NK" },
    ],
  },
  {
    stage: "ready",
    count: 112,
    rooms: [
      { number: "201", type: "STD", attendant: "LW" },
      { number: "226", type: "DLX", attendant: "LW" },
      { number: "320", type: "DLX", attendant: "SA" },
      { number: "508", type: "STD", attendant: "RH" },
      { number: "524", type: "DLX", attendant: "RH" },
      { number: "628", type: "STE", attendant: "NK" },
    ],
  },
] as const satisfies readonly HospitalityHousekeepingColumn[];

export const hospitalityAttendants = [
  { id: "LW", name: "Lina Wijaya", done: 11, assigned: 14 },
  { id: "SA", name: "Sri Astuti", done: 9, assigned: 14 },
  { id: "DP", name: "Dedi Permana", done: 7, assigned: 13 },
  { id: "RH", name: "Rudi Hartono", done: 10, assigned: 12 },
  { id: "NK", name: "Nur Kholifah", done: 6, assigned: 12 },
] as const satisfies readonly HospitalityAttendant[];

export const hospitalityReviewSummary = {
  rating: 4.6,
  reviews: 128,
  needsReply: 5,
  distribution: [89, 24, 9, 4, 2],
} as const satisfies HospitalityReviewSummary;

export const hospitalityReviews = [
  {
    id: "r1",
    guest: "Maya Puspita",
    channel: "Google",
    stars: 5,
    quote:
      "Spotless room and the breakfast spread was the best we've had in Jakarta.",
    topics: ["Cleanliness", "Breakfast"],
    when: "09:40",
    replied: true,
  },
  {
    id: "r2",
    guest: "Hendra Gunawan",
    channel: "Booking",
    stars: 3,
    quote: "Great location, but the air conditioning in 224 rattled all night.",
    topics: ["Location", "Noise"],
    when: "08:15",
    replied: false,
  },
  {
    id: "r3",
    guest: "Nadia Safitri",
    channel: "TripAdvisor",
    stars: 5,
    quote:
      "Front desk remembered our anniversary and upgraded us without asking.",
    topics: ["Staff"],
    when: "Yesterday",
    replied: true,
  },
  {
    id: "r4",
    guest: "Fajar Nugroho",
    channel: "Google",
    stars: 4,
    quote: "Wi-Fi dropped during a call, otherwise a smooth business stay.",
    topics: ["Wi-Fi", "Staff"],
    when: "Yesterday",
    replied: false,
  },
] as const satisfies readonly HospitalityReview[];

export const hospitalityRevenue = {
  rooms: 157_500_000,
  fnb: 48_200_000,
  spa: 12_600_000,
  events: 35_000_000,
} as const satisfies HospitalityRevenue;

type ReservationSeed = Omit<HospitalityReservation, "checkIn" | "checkOut"> & {
  /** Days from today to check-in; negative means the stay already started. */
  offset: number;
};

const reservationSeeds: ReservationSeed[] = [
  {
    id: "RSV-2041",
    guest: "Hendra Gunawan",
    room: "201",
    roomType: "Standard",
    offset: -2,
    nights: 3,
    channel: "OTA",
    status: "checked-in",
  },
  {
    id: "RSV-2042",
    guest: "Maya Puspita",
    room: "219",
    roomType: "Deluxe",
    offset: -1,
    nights: 2,
    channel: "Direct",
    status: "checked-in",
  },
  {
    id: "RSV-2043",
    guest: "Rina Marlina",
    room: "320",
    roomType: "Deluxe",
    offset: 0,
    nights: 4,
    channel: "Corporate",
    status: "confirmed",
  },
  {
    id: "RSV-2044",
    guest: "Dewi Lestari",
    room: "628",
    roomType: "Suite",
    offset: 0,
    nights: 2,
    channel: "Direct",
    status: "confirmed",
  },
  {
    id: "RSV-2045",
    guest: "Lina Hartati",
    room: "402",
    roomType: "Standard",
    offset: -3,
    nights: 3,
    channel: "OTA",
    status: "checked-out",
  },
  {
    id: "RSV-2046",
    guest: "Rizky Ramadhan",
    room: "530",
    roomType: "Suite",
    offset: -1,
    nights: 5,
    channel: "Corporate",
    status: "checked-in",
  },
  {
    id: "RSV-2047",
    guest: "Nadia Safitri",
    room: "305",
    roomType: "Standard",
    offset: -1,
    nights: 1,
    channel: "Walk-in",
    status: "checked-out",
  },
  {
    id: "RSV-2048",
    guest: "Fajar Nugroho",
    room: "423",
    roomType: "Deluxe",
    offset: -2,
    nights: 2,
    channel: "OTA",
    status: "no-show",
  },
  {
    id: "RSV-2049",
    guest: "Agus Prasetyo",
    room: "208",
    roomType: "Standard",
    offset: 0,
    nights: 2,
    channel: "Direct",
    status: "confirmed",
  },
  {
    id: "RSV-2050",
    guest: "Intan Permata",
    room: "512",
    roomType: "Standard",
    offset: 1,
    nights: 3,
    channel: "OTA",
    status: "confirmed",
  },
  {
    id: "RSV-2051",
    guest: "Doni Saputra",
    room: "606",
    roomType: "Standard",
    offset: 2,
    nights: 1,
    channel: "Corporate",
    status: "cancelled",
  },
  {
    id: "RSV-2052",
    guest: "Wati Rahayu",
    room: "229",
    roomType: "Suite",
    offset: -4,
    nights: 4,
    channel: "Direct",
    status: "checked-in",
  },
  {
    id: "RSV-2053",
    guest: "Eko Setiawan",
    room: "326",
    roomType: "Deluxe",
    offset: 1,
    nights: 2,
    channel: "OTA",
    status: "confirmed",
  },
  {
    id: "RSV-2054",
    guest: "Citra Anggraini",
    room: "414",
    roomType: "Standard",
    offset: -2,
    nights: 2,
    channel: "Walk-in",
    status: "checked-out",
  },
  {
    id: "RSV-2055",
    guest: "Bayu Wicaksono",
    room: "503",
    roomType: "Standard",
    offset: 0,
    nights: 1,
    channel: "Walk-in",
    status: "checked-in",
  },
  {
    id: "RSV-2056",
    guest: "Bambang Susilo",
    room: "615",
    roomType: "Standard",
    offset: 0,
    nights: 3,
    channel: "OTA",
    status: "confirmed",
  },
  {
    id: "RSV-2057",
    guest: "Mega Utami",
    room: "222",
    roomType: "Deluxe",
    offset: 3,
    nights: 2,
    channel: "Corporate",
    status: "confirmed",
  },
  {
    id: "RSV-2058",
    guest: "Taufik Hidayat",
    room: "429",
    roomType: "Suite",
    offset: -1,
    nights: 1,
    channel: "Direct",
    status: "no-show",
  },
  {
    id: "RSV-2059",
    guest: "Sari Wulandari",
    room: "524",
    roomType: "Deluxe",
    offset: 0,
    nights: 2,
    channel: "Direct",
    status: "confirmed",
  },
  {
    id: "RSV-2060",
    guest: "Ayu Kusuma",
    room: "311",
    roomType: "Standard",
    offset: 4,
    nights: 2,
    channel: "OTA",
    status: "cancelled",
  },
];

export function hospitalityReservations(
  today: string,
): HospitalityReservation[] {
  return reservationSeeds.map(({ offset, ...seed }) => ({
    ...seed,
    checkIn: daysAgo(today, -offset),
    checkOut: daysAgo(today, -(offset + seed.nights)),
  }));
}
