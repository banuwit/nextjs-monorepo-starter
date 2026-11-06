// Data contoh untuk dashboard Hospitality; belum terhubung ke API.
import type { KpiItem } from "@/features/dashboard/hospitality/types/dashboard";
import type {
  HospitalityArrival,
  HospitalityFlaggedRoom,
  HospitalityFloor,
  HospitalityHousekeepingTeam,
  HospitalityMovement,
  HospitalityOccupancyPoint,
  HospitalityReservation,
  HospitalityRevenue,
  HospitalityRoom,
  HospitalityRoomState,
  HospitalityRoomType,
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

export const hospitalityOccupancyTarget = 80;

// Oldest first; the last entry is tonight. Values stay deterministic so the
// server and client render the same chart.
const occupancySeries = [
  74, 71, 78, 86, 91, 88, 76, 72, 75, 81, 89, 93, 85, 73, 70, 77, 84, 90, 87,
  79, 74, 76, 82, 88, 92, 86, 78, 79, 83, 84,
] as const;

const lastYearSeries = [
  70, 68, 73, 80, 85, 83, 72, 69, 71, 77, 84, 88, 80, 70, 67, 72, 79, 86, 82,
  75, 70, 72, 78, 83, 87, 81, 74, 73, 78, 79,
] as const;

/** ISO day for `n` days before `today` (an ISO timestamp at noon UTC). */
function daysAgo(today: string, n: number) {
  const date = new Date(today);
  date.setUTCDate(date.getUTCDate() - n);
  return date.toISOString().slice(0, 10);
}

export function hospitalityOccupancySeries(
  today: string,
): HospitalityOccupancyPoint[] {
  const total = occupancySeries.length;
  return occupancySeries.map((occupancy, index) => ({
    date: daysAgo(today, total - 1 - index),
    occupancy,
    lastYear: lastYearSeries[index] ?? 0,
  }));
}

export const hospitalityMovement = {
  arrivals: { total: 42, checkedIn: 18, expected: 24 },
  departures: { total: 37, checkedOut: 29, pending: 8 },
} as const satisfies HospitalityMovement;

export const hospitalityArrivals = [
  {
    id: "a1",
    time: "14:30",
    guest: "Rina Marlina",
    roomType: "Deluxe",
    vip: true,
  },
  {
    id: "a2",
    time: "14:45",
    guest: "Agus Prasetyo",
    roomType: "Standard",
    vip: false,
  },
  {
    id: "a3",
    time: "15:10",
    guest: "Dewi Lestari",
    roomType: "Suite",
    vip: true,
  },
  {
    id: "a4",
    time: "15:30",
    guest: "Bambang Susilo",
    roomType: "Standard",
    vip: false,
  },
  {
    id: "a5",
    time: "16:00",
    guest: "Sari Wulandari",
    roomType: "Deluxe",
    vip: false,
  },
] as const satisfies readonly HospitalityArrival[];

const guestNames = [
  "Hendra Gunawan",
  "Maya Puspita",
  "Yudi Kurniawan",
  "Lina Hartati",
  "Rizky Ramadhan",
  "Nadia Safitri",
  "Fajar Nugroho",
  "Intan Permata",
  "Doni Saputra",
  "Wati Rahayu",
  "Eko Setiawan",
  "Citra Anggraini",
  "Bayu Wicaksono",
  "Mega Utami",
  "Taufik Hidayat",
  "Ayu Kusuma",
  "Galih Pratama",
  "Siska Amelia",
  "Ridwan Kamil",
  "Novi Andriani",
  "Arif Budiman",
  "Putri Maharani",
  "Dian Sastro",
  "Irfan Hakim",
  "Lia Kartika",
  "Wahyu Santoso",
  "Ratna Dewi",
  "Andi Firmansyah",
  "Nia Ramadhani",
  "Joko Widodo",
  "Sinta Dewi",
  "Reza Rahadian",
  "Tika Panggabean",
  "Hadi Sucipto",
  "Rina Marlina",
  "Agus Prasetyo",
  "Dewi Lestari",
  "Bambang Susilo",
  "Sari Wulandari",
  "Yosef Tampubolon",
] as const;

export const hospitalityFloors: readonly HospitalityFloor[] = [2, 3, 4, 5, 6];

// State per room, written as a compact string so the pattern is easy to read:
// o = occupied, u = due out, c = vacant clean, d = vacant dirty, x = out of order.
// Occupied plus due out adds up to 126 of 150 rooms.
const roomPlan: Record<HospitalityFloor, string> = {
  2: "ooooouooocoooodooouoocoxoooouo",
  3: "oooocooouooodooooxooocoooouodo",
  4: "ouoooocoooodoooouoooxcoooodooo",
  5: "oooodoooucooooooodooxoooucoooo",
  6: "ocoooouoooxooodooocooouooooodo",
};

const stateByCode: Record<string, HospitalityRoomState> = {
  o: "occupied",
  u: "due-out",
  c: "vacant-clean",
  d: "vacant-dirty",
  x: "out-of-order",
};

/** Rooms 01–18 are Standard, 19–27 Deluxe, 28–30 Suite on every floor. */
function roomTypeFor(index: number): HospitalityRoomType {
  if (index >= 27) return "Suite";
  if (index >= 18) return "Deluxe";
  return "Standard";
}

function buildRooms(): HospitalityRoom[] {
  const rooms: HospitalityRoom[] = [];
  let guestIndex = 0;
  for (const floor of hospitalityFloors) {
    const plan = roomPlan[floor];
    for (let index = 0; index < plan.length; index += 1) {
      const state = stateByCode[plan[index] ?? "c"] ?? "vacant-clean";
      const number = `${floor}${String(index + 1).padStart(2, "0")}`;
      const type = roomTypeFor(index);
      if (state === "occupied" || state === "due-out") {
        rooms.push({
          number,
          floor,
          type,
          state,
          guest: guestNames[guestIndex % guestNames.length],
        });
        guestIndex += 1;
      } else {
        rooms.push({ number, floor, type, state });
      }
    }
  }
  return rooms;
}

export const hospitalityRooms = buildRooms();

export const hospitalityHousekeeping = [
  { id: "f2", name: "Floor 2 · Team Melati", cleaned: 22, total: 30 },
  { id: "f3", name: "Floor 3 · Team Anggrek", cleaned: 19, total: 30 },
  { id: "f4", name: "Floor 4 · Team Kenanga", cleaned: 27, total: 30 },
  { id: "f5", name: "Floor 5 · Team Cempaka", cleaned: 14, total: 30 },
  { id: "f6", name: "Floor 6 · Team Dahlia", cleaned: 24, total: 30 },
  { id: "public", name: "Lobby & public areas", cleaned: 7, total: 9 },
] as const satisfies readonly HospitalityHousekeepingTeam[];

export const hospitalityFlaggedRooms = [
  {
    room: "224",
    reason: "maintenance",
    note: "Air conditioning not cooling; technician booked for 15:00.",
  },
  {
    room: "318",
    reason: "maintenance",
    note: "Shower drain blocked, room held until cleared.",
  },
  {
    room: "421",
    reason: "deep-clean",
    note: "Long stay checked out after 14 nights.",
  },
  {
    room: "521",
    reason: "maintenance",
    note: "Balcony door lock jammed.",
  },
  {
    room: "611",
    reason: "deep-clean",
    note: "Carpet shampoo requested by front desk.",
  },
] as const satisfies readonly HospitalityFlaggedRoom[];

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
