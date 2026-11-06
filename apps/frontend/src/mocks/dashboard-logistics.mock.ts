// Data contoh untuk dashboard Logistics; belum terhubung ke API.
import type { KpiItem } from "@/features/dashboard/logistics/types/dashboard";
import type {
  LogisticsException,
  LogisticsFleet,
  LogisticsOnTimePoint,
  LogisticsRoute,
  LogisticsShipment,
  LogisticsStage,
} from "@/features/dashboard/logistics/types/logistics";

export const logisticsMetrics = [
  {
    label: "Shipments today",
    value: "186",
    delta: { value: "+7%", direction: "up", sentiment: "good" },
    context: "vs 174 yesterday",
    trend: [152, 161, 158, 170, 174, 169, 186],
  },
  {
    label: "On-time rate",
    value: "93.4%",
    delta: { value: "-1.6 pts", direction: "down", sentiment: "bad" },
    context: "SLA 95%",
    trend: [96.1, 95.4, 94.8, 95.9, 95.0, 94.2, 93.4],
  },
  {
    label: "Active vehicles",
    value: "18 of 24",
    delta: { value: "6 off road", direction: "flat", sentiment: "neutral" },
    context: "4 idle, 6 in maintenance",
  },
  {
    label: "Avg delivery time",
    value: "41 min",
    delta: { value: "-3 min", direction: "down", sentiment: "good" },
    context: "door to door",
    trend: [48, 46, 45, 44, 44, 43, 41],
  },
] as const satisfies readonly KpiItem[];

export const logisticsStages = [
  { key: "picked", label: "Picked up", count: 24 },
  { key: "in-transit", label: "In transit", count: 38 },
  { key: "out-for-delivery", label: "Out for delivery", count: 47 },
  { key: "delivered", label: "Delivered", count: 71 },
  { key: "failed", label: "Failed", count: 6 },
] as const satisfies readonly LogisticsStage[];

export const logisticsSla = 95;

// Oldest first; the last entry is today. Values stay deterministic so the
// server and client render the same chart.
const onTimeSeries = [
  96.2, 95.8, 94.1, 96.5, 97.0, 95.3, 93.8, 94.6, 96.1, 95.9, 92.7, 94.4, 95.6,
  96.8, 95.2, 93.9, 94.8, 96.3, 95.7, 94.1, 96.4, 95.1, 93.5, 95.8, 96.0, 94.3,
  95.9, 95.0, 94.2, 93.4,
] as const;

const deliveriesSeries = [
  150, 162, 158, 171, 166, 149, 140, 168, 172, 175, 163, 159, 177, 180, 169,
  155, 161, 178, 174, 165, 182, 171, 157, 176, 179, 168, 183, 170, 174, 186,
] as const;

/** ISO day for `n` days before `today` (an ISO timestamp at noon UTC). */
function daysAgo(today: string, n: number) {
  const date = new Date(today);
  date.setUTCDate(date.getUTCDate() - n);
  return date.toISOString().slice(0, 10);
}

export function logisticsOnTimeSeries(today: string): LogisticsOnTimePoint[] {
  const total = onTimeSeries.length;
  return onTimeSeries.map((onTime, index) => ({
    date: daysAgo(today, total - 1 - index),
    onTime,
    deliveries: deliveriesSeries[index] ?? 0,
  }));
}

export const logisticsFleet = {
  moving: 14,
  idle: 4,
  maintenance: 6,
} as const satisfies LogisticsFleet;

export const logisticsRoutes: LogisticsRoute[] = [
  {
    id: "R-01",
    driver: "Dedi Kurniawan",
    vehicle: "B 1120 KZ",
    color: 1,
    progress: 0.62,
    nextEtaMinutes: 14,
    stops: [
      { id: "R-01-1", label: "Kemang", status: "done", x: 150, y: 60 },
      { id: "R-01-2", label: "Cilandak", status: "done", x: 230, y: 40 },
      { id: "R-01-3", label: "Pondok Indah", status: "done", x: 320, y: 55 },
      { id: "R-01-4", label: "Bintaro", status: "pending", x: 410, y: 35 },
      { id: "R-01-5", label: "Ciputat", status: "pending", x: 490, y: 60 },
      { id: "R-01-6", label: "Pamulang", status: "pending", x: 560, y: 45 },
    ],
  },
  {
    id: "R-02",
    driver: "Siti Nurhaliza",
    vehicle: "B 2231 PQ",
    color: 2,
    progress: 0.85,
    nextEtaMinutes: 6,
    stops: [
      { id: "R-02-1", label: "Senayan", status: "done", x: 140, y: 105 },
      { id: "R-02-2", label: "Sudirman", status: "done", x: 220, y: 95 },
      { id: "R-02-3", label: "Thamrin", status: "done", x: 300, y: 110 },
      { id: "R-02-4", label: "Menteng", status: "done", x: 380, y: 100 },
      { id: "R-02-5", label: "Cikini", status: "done", x: 460, y: 115 },
      { id: "R-02-6", label: "Salemba", status: "pending", x: 540, y: 105 },
    ],
  },
  {
    id: "R-03",
    driver: "Rahmat Hidayat",
    vehicle: "B 3410 RT",
    color: 3,
    progress: 0.38,
    nextEtaMinutes: null,
    stops: [
      { id: "R-03-1", label: "Tebet", status: "done", x: 150, y: 150 },
      { id: "R-03-2", label: "Pancoran", status: "done", x: 230, y: 165 },
      { id: "R-03-3", label: "Kalibata", status: "failed", x: 310, y: 150 },
      {
        id: "R-03-4",
        label: "Pasar Minggu",
        status: "pending",
        x: 390,
        y: 170,
      },
      { id: "R-03-5", label: "Jagakarsa", status: "pending", x: 470, y: 155 },
      {
        id: "R-03-6",
        label: "Lenteng Agung",
        status: "pending",
        x: 540,
        y: 170,
      },
    ],
  },
  {
    id: "R-04",
    driver: "Putri Ayu",
    vehicle: "B 4521 UV",
    color: 4,
    progress: 0.2,
    nextEtaMinutes: 22,
    stops: [
      { id: "R-04-1", label: "Kuningan", status: "done", x: 145, y: 205 },
      { id: "R-04-2", label: "Setiabudi", status: "pending", x: 225, y: 195 },
      { id: "R-04-3", label: "Karet", status: "pending", x: 305, y: 210 },
      { id: "R-04-4", label: "Tanah Abang", status: "pending", x: 385, y: 195 },
      { id: "R-04-5", label: "Petamburan", status: "pending", x: 465, y: 210 },
      { id: "R-04-6", label: "Slipi", status: "pending", x: 545, y: 200 },
    ],
  },
];

export const logisticsExceptions: LogisticsException[] = [
  {
    id: "e1",
    severity: "danger",
    title: "Vehicle B 3410 RT reported a breakdown",
    detail:
      "R-03 stopped near Kalibata. 3 stops still pending; a backup van is 25 min away.",
    routeId: "R-03",
    minutesAgo: 8,
  },
  {
    id: "e2",
    severity: "warning",
    title: "Address not found for SHP-4411",
    detail:
      "Driver called the customer twice with no answer. Stop marked failed.",
    routeId: "R-03",
    minutesAgo: 19,
  },
  {
    id: "e3",
    severity: "warning",
    title: "R-01 running 12 minutes behind",
    detail:
      "Traffic on the Bintaro toll road. Two stops at risk of missing the SLA.",
    routeId: "R-01",
    minutesAgo: 27,
  },
  {
    id: "e4",
    severity: "info",
    title: "Customs hold on 2 inbound parcels",
    detail: "Expected release tomorrow morning. Customers have been notified.",
    minutesAgo: 64,
  },
  {
    id: "e5",
    severity: "info",
    title: "Cold-chain sensor reconnected",
    detail: "B 2231 PQ reefer unit back online after a 4-minute gap.",
    routeId: "R-02",
    minutesAgo: 92,
  },
];

export const logisticsShipments: LogisticsShipment[] = [
  {
    id: "SHP-4402",
    customer: "Toko Maju Jaya",
    area: "Bintaro",
    routeId: "R-01",
    status: "out-for-delivery",
    etaMinutes: 14,
    stopsLeft: 1,
    weightKg: 12.4,
  },
  {
    id: "SHP-4403",
    customer: "Klinik Sehat",
    area: "Ciputat",
    routeId: "R-01",
    status: "out-for-delivery",
    etaMinutes: 36,
    stopsLeft: 2,
    weightKg: 4.1,
  },
  {
    id: "SHP-4404",
    customer: "Warung Bu Ani",
    area: "Pamulang",
    routeId: "R-01",
    status: "out-for-delivery",
    etaMinutes: 58,
    stopsLeft: 3,
    weightKg: 22.0,
  },
  {
    id: "SHP-4405",
    customer: "PT Nusantara Teknik",
    area: "Kemang",
    routeId: "R-01",
    status: "delivered",
    etaMinutes: null,
    closedAt: "09:12",
    stopsLeft: 0,
    weightKg: 8.7,
  },
  {
    id: "SHP-4406",
    customer: "Kopi Senja",
    area: "Salemba",
    routeId: "R-02",
    status: "out-for-delivery",
    etaMinutes: 6,
    stopsLeft: 1,
    weightKg: 3.3,
  },
  {
    id: "SHP-4407",
    customer: "Apotek Kimia",
    area: "Cikini",
    routeId: "R-02",
    status: "delivered",
    etaMinutes: null,
    closedAt: "10:48",
    stopsLeft: 0,
    weightKg: 5.9,
  },
  {
    id: "SHP-4408",
    customer: "Hotel Grand Menteng",
    area: "Menteng",
    routeId: "R-02",
    status: "delivered",
    etaMinutes: null,
    closedAt: "10:21",
    stopsLeft: 0,
    weightKg: 31.5,
  },
  {
    id: "SHP-4409",
    customer: "Studio Delapan",
    area: "Thamrin",
    routeId: "R-02",
    status: "delivered",
    etaMinutes: null,
    closedAt: "09:55",
    stopsLeft: 0,
    weightKg: 2.2,
  },
  {
    id: "SHP-4410",
    customer: "Bengkel Pancoran",
    area: "Pancoran",
    routeId: "R-03",
    status: "delivered",
    etaMinutes: null,
    closedAt: "09:40",
    stopsLeft: 0,
    weightKg: 18.0,
  },
  {
    id: "SHP-4411",
    customer: "Rumah Makan Padang",
    area: "Kalibata",
    routeId: "R-03",
    status: "failed",
    etaMinutes: null,
    closedAt: "10:05",
    stopsLeft: 0,
    weightKg: 6.4,
  },
  {
    id: "SHP-4412",
    customer: "SDN Pasar Minggu 03",
    area: "Pasar Minggu",
    routeId: "R-03",
    status: "in-transit",
    etaMinutes: 45,
    stopsLeft: 1,
    weightKg: 14.8,
  },
  {
    id: "SHP-4413",
    customer: "Laundry Kilat",
    area: "Jagakarsa",
    routeId: "R-03",
    status: "in-transit",
    etaMinutes: 70,
    stopsLeft: 2,
    weightKg: 9.6,
  },
  {
    id: "SHP-4414",
    customer: "Toko Bangunan Sinar",
    area: "Lenteng Agung",
    routeId: "R-03",
    status: "in-transit",
    etaMinutes: 95,
    stopsLeft: 3,
    weightKg: 40.2,
  },
  {
    id: "SHP-4415",
    customer: "Kantor Notaris Rini",
    area: "Setiabudi",
    routeId: "R-04",
    status: "out-for-delivery",
    etaMinutes: 22,
    stopsLeft: 1,
    weightKg: 1.8,
  },
  {
    id: "SHP-4416",
    customer: "Gym Karet",
    area: "Karet",
    routeId: "R-04",
    status: "out-for-delivery",
    etaMinutes: 41,
    stopsLeft: 2,
    weightKg: 27.3,
  },
  {
    id: "SHP-4417",
    customer: "Pasar Tanah Abang Blok B",
    area: "Tanah Abang",
    routeId: "R-04",
    status: "in-transit",
    etaMinutes: 63,
    stopsLeft: 3,
    weightKg: 55.0,
  },
  {
    id: "SHP-4418",
    customer: "Percetakan Petamburan",
    area: "Petamburan",
    routeId: "R-04",
    status: "in-transit",
    etaMinutes: 84,
    stopsLeft: 4,
    weightKg: 19.9,
  },
  {
    id: "SHP-4419",
    customer: "Toko Elektronik Slipi",
    area: "Slipi",
    routeId: "R-04",
    status: "picked",
    etaMinutes: 110,
    stopsLeft: 5,
    weightKg: 11.1,
  },
  {
    id: "SHP-4420",
    customer: "CV Sumber Rejeki",
    area: "Kuningan",
    routeId: "R-04",
    status: "delivered",
    etaMinutes: null,
    closedAt: "09:30",
    stopsLeft: 0,
    weightKg: 7.5,
  },
  {
    id: "SHP-4421",
    customer: "Café Cilandak",
    area: "Cilandak",
    routeId: "R-01",
    status: "delivered",
    etaMinutes: null,
    closedAt: "09:44",
    stopsLeft: 0,
    weightKg: 3.0,
  },
];
