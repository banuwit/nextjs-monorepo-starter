import type {
  Area,
  Driver,
  FleetException,
  FleetState,
  LngLat,
  Stop,
  StopStatus,
  Van,
  VanControls,
} from "@/features/map-delivery/types/map-delivery";

/** Heron Run depot in the Pulogadung industrial estate, East Jakarta. */
const depot: LngLat = [106.9145, -6.1856];

const drivers: Driver[] = [
  { id: "drv-1", name: "Maya Lestari", phone: "+62 812 1001 0141" },
  { id: "drv-2", name: "Yoga Prasetyo", phone: "+62 812 1001 0152" },
  { id: "drv-3", name: "Priya Anandita", phone: "+62 812 1001 0163" },
  { id: "drv-4", name: "Tomi Hardianto", phone: "+62 812 1001 0174" },
  { id: "drv-5", name: "Elena Siregar", phone: "+62 812 1001 0185" },
  { id: "drv-6", name: "Kenji Wibowo", phone: "+62 812 1001 0196" },
  { id: "drv-7", name: "Sofia Rahmawati", phone: "+62 812 1001 0107" },
  { id: "drv-8", name: "Darmawan Putra", phone: "+62 812 1001 0118" },
  { id: "drv-9", name: "Hana Nurjanah", phone: "+62 812 1001 0129" },
];

const areas: Area[] = [
  { id: "menteng", name: "Menteng", center: [106.8338, -6.1957] },
  { id: "kelapa-gading", name: "Kelapa Gading", center: [106.906, -6.158] },
  { id: "senayan", name: "Senayan & SCBD", center: [106.807, -6.225] },
  { id: "kemang", name: "Kemang", center: [106.8135, -6.2608] },
  { id: "kebayoran", name: "Kebayoran Baru", center: [106.7983, -6.2437] },
  { id: "pondok-indah", name: "Pondok Indah", center: [106.7836, -6.2663] },
  { id: "cempaka-putih", name: "Cempaka Putih", center: [106.87, -6.177] },
  { id: "thamrin", name: "Thamrin & Sudirman", center: [106.8227, -6.1944] },
];

const baseControls: VanControls = {
  driveMode: "normal",
  speedLimit: 60,
  laneAssist: true,
  autoBrake: true,
  geofence: true,
};

function van(
  partial: Omit<Van, "controls" | "activity"> & {
    controls?: Partial<VanControls>;
    activity?: Van["activity"];
  },
): Van {
  return {
    ...partial,
    controls: { ...baseControls, ...partial.controls },
    activity: partial.activity ?? [],
  };
}

const vans: Van[] = [
  van({
    id: "van-1", name: "HR-01", plate: "B 1407 KDA", driverId: "drv-1",
    body: "cargo-van", powertrain: "ev", status: "en-route", areaId: "menteng",
    position: [106.8355, -6.1935], heading: 200, rangeKm: 96, energyPct: 58,
    capacity: 120, returnEta: "16:40",
    controls: { chargeLimit: 90 },
    activity: [
      { at: "13:58", message: "Delivered to Nadia Shafira (Jl. Cikini Raya)" },
      { at: "13:41", message: "Delivered to Toko Roti Menteng" },
      { at: "13:12", message: "Left depot with 38 parcels" },
    ],
  }),
  van({
    id: "van-2", name: "HR-02", plate: "B 8822 ZTR", driverId: "drv-2",
    body: "reefer", powertrain: "diesel", status: "en-route", areaId: "kelapa-gading",
    position: [106.9012, -6.1603], heading: 300, rangeKm: 210, energyPct: 64,
    capacity: 90, cargoTempC: 6.8, returnEta: "17:10",
    controls: { refuelAlert: 20, coldSetpoint: 3 },
    activity: [
      { at: "14:11", message: "Cargo temperature rose to 6.8 °C" },
      { at: "13:50", message: "Delivered to Pasar Segar Kelapa Gading" },
      { at: "13:05", message: "Left depot with 22 cold parcels" },
    ],
  }),
  van({
    id: "van-3", name: "HR-03", plate: "B 1299 PLM", driverId: "drv-3",
    body: "box-truck", powertrain: "diesel", status: "en-route", areaId: "senayan",
    position: [106.8088, -6.2241], heading: 180, rangeKm: 165, energyPct: 48,
    capacity: 200, returnEta: "17:35",
    controls: { refuelAlert: 15 },
    activity: [
      { at: "14:02", message: "Delivered 6 parcels to Toko Buku Senayan" },
      { at: "13:20", message: "Left depot with 61 parcels" },
    ],
  }),
  van({
    id: "van-4", name: "HR-04", plate: "B 5533 MQE", driverId: "drv-4",
    body: "cargo-van", powertrain: "ev", status: "breakdown", areaId: "pondok-indah",
    position: [106.7841, -6.2655], heading: 180, rangeKm: 44, energyPct: 29,
    capacity: 120, returnEta: "18:20",
    controls: { chargeLimit: 80 },
    activity: [
      { at: "14:06", message: "Driver reported a flat tyre on Jl. Metro Pondok Indah" },
      { at: "13:44", message: "Delivered to Pondok Indah Mall" },
      { at: "13:10", message: "Left depot with 29 parcels" },
    ],
  }),
  van({
    id: "van-5", name: "HR-05", plate: "B 1906 WRF", driverId: "drv-5",
    body: "cargo-bike", powertrain: "ev", status: "en-route", areaId: "thamrin",
    position: [106.8229, -6.1952], heading: 170, rangeKm: 18, energyPct: 37,
    capacity: 24, returnEta: "16:05",
    controls: { chargeLimit: 100, speedLimit: 45 },
    activity: [
      { at: "14:15", message: "Delivered to Grand Indonesia lobby" },
      { at: "13:55", message: "Delivered to Sarinah" },
      { at: "13:30", message: "Left depot with 14 parcels" },
    ],
  }),
  van({
    id: "van-6", name: "HR-06", plate: "B 7301 ACG", driverId: "drv-6",
    body: "cargo-van", powertrain: "gas", status: "en-route", areaId: "kemang",
    position: [106.8142, -6.2595], heading: 190, rangeKm: 240, energyPct: 71,
    capacity: 120, returnEta: "16:55",
    controls: { refuelAlert: 20 },
    activity: [
      { at: "14:08", message: "Delivered to Kemang Village" },
      { at: "13:15", message: "Left depot with 33 parcels" },
    ],
  }),
  van({
    id: "van-7", name: "HR-07", plate: "B 2841 VNH", driverId: "drv-7",
    body: "cargo-van", powertrain: "ev", status: "en-route", areaId: "kebayoran",
    position: [106.7991, -6.2423], heading: 240, rangeKm: 31, energyPct: 19,
    capacity: 120, returnEta: "17:25",
    controls: { chargeLimit: 90, driveMode: "eco" },
    activity: [
      { at: "14:12", message: "Range dropped under 35 km" },
      { at: "13:48", message: "Delivered to Blok M Square" },
      { at: "13:02", message: "Left depot with 41 parcels" },
    ],
  }),
  van({
    id: "van-8", name: "HR-08", plate: "B 6118 BSJ", driverId: "drv-8",
    body: "reefer", powertrain: "ev", status: "returning", areaId: "cempaka-putih",
    position: [106.8742, -6.1768], heading: 90, rangeKm: 120, energyPct: 61,
    capacity: 90, cargoTempC: 2.9, returnEta: "14:45",
    controls: { chargeLimit: 90, coldSetpoint: 3 },
    activity: [
      { at: "14:14", message: "Last stop done, heading back to depot" },
      { at: "13:36", message: "Delivered to RS Islam Cempaka Putih" },
      { at: "12:50", message: "Left depot with 18 cold parcels" },
    ],
  }),
  van({
    id: "van-9", name: "HR-09", plate: "B 9075 TGK", driverId: "drv-9",
    body: "box-truck", powertrain: "diesel", status: "loading", areaId: "thamrin",
    position: depot, heading: 0, rangeKm: 380, energyPct: 92,
    capacity: 200, returnEta: "18:00",
    controls: { refuelAlert: 15 },
    activity: [{ at: "14:05", message: "Loading the 3 PM Sudirman wave" }],
  }),
];

type StopSeed = [
  recipient: string,
  merchant: string,
  address: string,
  lng: number,
  lat: number,
  windowStart: string,
  eta: string,
  status: StopStatus,
  parcels: number,
  cold?: boolean,
  completedAt?: string,
];

function stops(vanId: string, seeds: StopSeed[]): Stop[] {
  return seeds.map((seed, index) => {
    const [recipient, merchant, address, lng, lat, start, eta, status, parcels, cold, completedAt] = seed;
    const [h = "0", m = "0"] = start.split(":");
    const end = `${String(Number(h) + 2).padStart(2, "0")}:${m}`;
    return {
      id: `${vanId}-s${index + 1}`,
      vanId,
      recipient,
      merchant,
      address,
      position: [lng, lat],
      window: { start, end },
      eta,
      status,
      parcels,
      coldChain: cold ?? false,
      completedAt,
      ...(status === "failed" ? { failReason: "no-answer" as const } : {}),
    };
  });
}

const allStops: Stop[] = [
  ...stops("van-1", [
    ["Toko Roti Menteng", "Gandum & Co.", "Jl. H.O.S. Cokroaminoto 78", 106.8321, -6.1985, "13:00", "13:41", "delivered", 4, false, "13:41"],
    ["Nadia Shafira", "Apotek Larkspur", "Jl. Cikini Raya 45", 106.8398, -6.1912, "13:00", "13:58", "delivered", 2, false, "13:58"],
    ["Studio Taman Suropati", "Paper Moon Prints", "Jl. Taman Suropati 5", 106.8322, -6.1992, "14:00", "14:28", "to-go", 5],
    ["Rafael Mahendra", "Nook Furniture", "Jl. Imam Bonjol 61", 106.8285, -6.1948, "14:00", "14:46", "to-go", 1],
    ["Kafe Gondangdia", "Gandum & Co.", "Jl. R.P. Soeroso 22", 106.8345, -6.1875, "13:00", "15:09", "to-go", 6],
    ["Ines Darmadi", "Apotek Larkspur", "Jl. Pegangsaan Timur 17", 106.8402, -6.1965, "14:00", "15:31", "to-go", 3],
  ]),
  ...stops("van-2", [
    ["Pasar Segar Kelapa Gading", "Laut Nusantara", "Jl. Boulevard Raya Blok QA", 106.9079, -6.1578, "13:00", "13:50", "delivered", 6, true, "13:50"],
    ["Dapur Bakmi Gading", "Laut Nusantara", "Jl. Kelapa Gading Boulevard 12", 106.9043, -6.1541, "13:00", "14:04", "failed", 2, true, "14:04"],
    ["Deli Summarecon", "Tambak Oyster", "Jl. Boulevard Timur 3", 106.9131, -6.1529, "14:00", "14:36", "to-go", 4, true],
    ["Restoran Sunter Danau", "Tambak Oyster", "Jl. Danau Sunter Utara 9", 106.8785, -6.1468, "14:00", "15:02", "to-go", 5, true],
    ["Apotek Artha Gading", "Cascade Biologics", "Jl. Artha Gading Selatan 1", 106.8936, -6.1456, "15:00", "15:40", "to-go", 1, true],
  ]),
  ...stops("van-3", [
    ["Toko Buku Senayan", "Shelfmark Distribution", "Jl. Asia Afrika 8", 106.8069, -6.2253, "13:00", "14:02", "delivered", 6, false, "14:02"],
    ["Residence Senayan Park", "Nook Furniture", "Jl. Gerbang Pemuda 3", 106.8037, -6.2184, "14:00", "14:24", "to-go", 9],
    ["Universitas Atma Jaya", "Shelfmark Distribution", "Jl. Jend. Sudirman 51", 106.8166, -6.2129, "14:00", "14:58", "to-go", 14],
    ["Laboratorium SCBD", "Cascade Biologics", "Jl. Jend. Sudirman Kav. 52-53", 106.8094, -6.2268, "15:00", "15:30", "to-go", 7],
    ["Lukman Fernandes", "Nook Furniture", "Jl. Senopati 47", 106.8105, -6.2318, "15:00", "16:05", "to-go", 2],
  ]),
  ...stops("van-4", [
    ["Pondok Indah Mall", "Tidewater Goods", "Jl. Metro Pondok Indah", 106.7833, -6.2655, "13:00", "13:44", "delivered", 3, false, "13:44"],
    ["Deli Pondok Indah", "Gandum & Co.", "Jl. Sultan Iskandar Muda 12", 106.7863, -6.2582, "13:00", "15:20", "to-go", 5],
    ["Mira Haddad", "Apotek Larkspur", "Jl. Radio Dalam Raya 33", 106.7905, -6.2497, "14:00", "15:50", "to-go", 2],
    ["Taman Kanak Bintaro", "Paper Moon Prints", "Jl. Bintaro Utama 3", 106.7612, -6.2735, "14:00", "16:30", "to-go", 4],
  ]),
  ...stops("van-5", [
    ["Sarinah", "Paper Moon Prints", "Jl. M.H. Thamrin 11", 106.8229, -6.1874, "13:00", "13:55", "delivered", 2, false, "13:55"],
    ["Grand Indonesia lobby", "Laut Nusantara", "Jl. M.H. Thamrin 1", 106.8217, -6.1953, "14:00", "14:15", "delivered", 1, true, "14:15"],
    ["Amir Qureshi", "Shelfmark Distribution", "Jl. Kebon Sirih 17", 106.8256, -6.1836, "14:00", "14:32", "to-go", 1],
    ["Lobi Wisma 46", "Apotek Larkspur", "Jl. Jend. Sudirman Kav. 1", 106.8206, -6.2048, "14:00", "14:47", "to-go", 3],
    ["Galeri Cikini", "Paper Moon Prints", "Jl. Cikini Raya 73", 106.8405, -6.1898, "15:00", "15:12", "to-go", 2],
  ]),
  ...stops("van-6", [
    ["Kemang Village", "Tambak Oyster", "Jl. Pangeran Antasari 36", 106.8153, -6.2601, "13:00", "14:08", "delivered", 5, false, "14:08"],
    ["Cokelat Kemang", "Gandum & Co.", "Jl. Kemang Raya 8", 106.8148, -6.2552, "14:00", "14:30", "to-go", 4],
    ["Ragunan gate", "Tidewater Goods", "Jl. Harsono RM 1", 106.8206, -6.3052, "14:00", "15:05", "to-go", 6],
    ["Perkakas Cilandak", "Nook Furniture", "Jl. Cilandak KKO 9", 106.8075, -6.2888, "15:00", "15:35", "to-go", 3],
    ["Hanna Berliana", "Apotek Larkspur", "Jl. Kemang Selatan 21", 106.8181, -6.2679, "15:00", "16:00", "to-go", 1],
  ]),
  ...stops("van-7", [
    ["Blok M Square", "Shelfmark Distribution", "Jl. Melawai 5", 106.7972, -6.2432, "13:00", "13:48", "delivered", 12, false, "13:48"],
    ["Museum Tekstil Kebayoran", "Paper Moon Prints", "Jl. Panglima Polim 10", 106.7993, -6.2491, "14:00", "14:26", "to-go", 3],
    ["Apotek Gandaria", "Cascade Biologics", "Jl. Gandaria Tengah 4", 106.7883, -6.2434, "14:00", "15:00", "to-go", 2],
    ["Ji-woo Park", "Nook Furniture", "Jl. Wijaya I 23", 106.8043, -6.2471, "15:00", "15:28", "to-go", 1],
    ["Klinik Permata Hijau", "Cascade Biologics", "Jl. Permata Hijau 6", 106.7813, -6.2229, "15:00", "16:10", "to-go", 4],
  ]),
  ...stops("van-8", [
    ["RS Islam Cempaka Putih", "Tambak Oyster", "Jl. Cempaka Putih Tengah I/1", 106.8719, -6.1775, "13:00", "13:36", "delivered", 8, true, "13:36"],
    ["Pasar Rawasari", "Laut Nusantara", "Jl. Rawasari Selatan 4", 106.8651, -6.1836, "13:00", "13:58", "delivered", 6, true, "13:58"],
    ["Kafe Cempaka Mas", "Gandum & Co.", "Jl. Letjen Suprapto 1", 106.8755, -6.1702, "13:00", "14:14", "delivered", 4, true, "14:14"],
  ]),
  ...stops("van-9", [
    ["Plaza Indonesia", "Tidewater Goods", "Jl. M.H. Thamrin Kav. 28-30", 106.8226, -6.1931, "15:00", "15:20", "to-go", 16],
    ["RSCM", "Cascade Biologics", "Jl. Diponegoro 71", 106.8366, -6.1874, "15:00", "15:48", "to-go", 9],
    ["Perpustakaan Nasional", "Shelfmark Distribution", "Jl. Medan Merdeka Selatan 11", 106.8257, -6.1794, "16:00", "16:15", "to-go", 20],
    ["Sudirman Suites", "Nook Furniture", "Jl. Jend. Sudirman Kav. 34", 106.8183, -6.2057, "16:00", "16:50", "to-go", 11],
  ]),
];

const exceptions: FleetException[] = [
  { id: "exc-1", kind: "breakdown", vanId: "van-4", message: "HR-04 reported a flat tyre on Jl. Metro Pondok Indah. Three stops still open.", at: "14:06", acknowledged: false },
  { id: "exc-2", kind: "low-range", vanId: "van-7", message: "HR-07 has 31 km of range left but the route still needs about 38 km.", at: "14:12", acknowledged: false },
  { id: "exc-3", kind: "cargo-temp", vanId: "van-2", message: "HR-02 cargo is at 6.8 °C, above the 3 °C setpoint for 9 minutes.", at: "14:11", acknowledged: false },
  { id: "exc-4", kind: "failed-attempt", vanId: "van-2", stopId: "van-2-s2", message: "No answer at Dapur Bakmi Gading. 2 cold parcels still on board.", at: "14:04", acknowledged: false },
  { id: "exc-5", kind: "late-stop", vanId: "van-1", stopId: "van-1-s5", message: "Kafe Gondangdia ETA 3:09 PM is past its 3:00 PM window.", at: "14:02", acknowledged: false },
  { id: "exc-6", kind: "late-stop", vanId: "van-4", stopId: "van-4-s2", message: "Deli Pondok Indah ETA 3:20 PM is past its 3:00 PM window.", at: "14:07", acknowledged: false },
  { id: "exc-7", kind: "late-stop", vanId: "van-3", stopId: "van-3-s2", message: "Residence Senayan Park was running 11 minutes late; recovered.", at: "13:30", acknowledged: true },
];

export const initialFleet: FleetState = {
  depot,
  now: "14:20",
  drivers,
  areas,
  vans,
  stops: allStops,
  exceptions,
};
