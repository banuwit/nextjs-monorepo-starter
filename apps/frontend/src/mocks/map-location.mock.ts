import type {
  CustomerProfile,
  CustomerRef,
  LocationCustomer,
} from "@/features/map-location/types/map-location";

// Customer distribution for a Jabodetabek FMCG distributor (Jakarta, Bogor, Depok, Tangerang, Bekasi). Rows are generated
// deterministically from the seed lists below so the page always shows the
// same world, with a few rows deliberately missing coordinates.

const ref = (key: string, name: string): CustomerRef => ({ key, name });

const branches = [
  ref("br-1", "Cabang Jakarta Utara"),
  ref("br-2", "Cabang Jakarta Selatan"),
  ref("br-3", "Cabang Jakarta Timur"),
  ref("br-4", "Cabang Bogor"),
  ref("br-5", "Cabang Depok"),
  ref("br-6", "Cabang Tangerang"),
  ref("br-7", "Cabang Bekasi"),
];

const employees = [
  ref("emp-1", "Andi Saputra"),
  ref("emp-2", "Budi Hartono"),
  ref("emp-3", "Citra Dewi"),
  ref("emp-4", "Dian Permata"),
  ref("emp-5", "Eko Nugroho"),
  ref("emp-6", "Fitri Handayani"),
  ref("emp-7", "Gilang Ramadhan"),
  ref("emp-8", "Hesti Wulandari"),
  ref("emp-9", "Irfan Maulana"),
  ref("emp-10", "Joko Susilo"),
  ref("emp-11", "Kartika Sari"),
  ref("emp-12", "Lukman Hakim"),
];

const categories = [
  ref("cat-1", "Grosir"),
  ref("cat-2", "Retail"),
  ref("cat-3", "Minimarket"),
  ref("cat-4", "Horeka"),
  ref("cat-5", "Warung"),
];

const regions = {
  jakarta: ref("reg-31", "DKI Jakarta"),
  jabar: ref("reg-32", "Jawa Barat"),
  banten: ref("reg-36", "Banten"),
};

type DistrictSeed = {
  region: CustomerRef;
  city: CustomerRef;
  district: CustomerRef;
  branch: CustomerRef;
  center: [lng: number, lat: number];
  streets: string[];
};

const jakpus = ref("city-1", "Jakarta Pusat");
const jakut = ref("city-2", "Jakarta Utara");
const jaksel = ref("city-3", "Jakarta Selatan");
const jaktim = ref("city-4", "Jakarta Timur");
const jakbar = ref("city-5", "Jakarta Barat");
const bogor = ref("city-6", "Kota Bogor");
const depok = ref("city-7", "Kota Depok");
const tangerang = ref("city-8", "Kota Tangerang");
const tangsel = ref("city-9", "Tangerang Selatan");
const bekasi = ref("city-10", "Kota Bekasi");

const districts: DistrictSeed[] = [
  // DKI Jakarta
  { region: regions.jakarta, city: jakpus, district: ref("dis-1", "Menteng"), branch: branches[2]!, center: [106.8338, -6.1957], streets: ["Jl. Cikini Raya", "Jl. H.O.S. Cokroaminoto", "Jl. Imam Bonjol", "Jl. Pegangsaan Timur"] },
  { region: regions.jakarta, city: jakpus, district: ref("dis-2", "Tanah Abang"), branch: branches[2]!, center: [106.8135, -6.1935], streets: ["Jl. K.H. Mas Mansyur", "Jl. Fachrudin", "Jl. Kebon Kacang Raya"] },
  { region: regions.jakarta, city: jakpus, district: ref("dis-3", "Cempaka Putih"), branch: branches[0]!, center: [106.87, -6.177], streets: ["Jl. Cempaka Putih Tengah", "Jl. Letjen Suprapto", "Jl. Rawasari Selatan"] },
  { region: regions.jakarta, city: jakut, district: ref("dis-4", "Kelapa Gading"), branch: branches[0]!, center: [106.906, -6.158], streets: ["Jl. Boulevard Raya", "Jl. Kelapa Gading Boulevard", "Jl. Boulevard Timur", "Jl. Artha Gading Selatan"] },
  { region: regions.jakarta, city: jakut, district: ref("dis-5", "Tanjung Priok"), branch: branches[0]!, center: [106.8805, -6.1265], streets: ["Jl. Yos Sudarso", "Jl. Enggano", "Jl. Sunter Agung"] },
  { region: regions.jakarta, city: jakut, district: ref("dis-6", "Penjaringan"), branch: branches[0]!, center: [106.7795, -6.1255], streets: ["Jl. Pluit Raya", "Jl. Pantai Indah Utara", "Jl. Muara Karang"] },
  { region: regions.jakarta, city: jaksel, district: ref("dis-7", "Kebayoran Baru"), branch: branches[1]!, center: [106.7983, -6.2437], streets: ["Jl. Melawai", "Jl. Panglima Polim", "Jl. Wijaya I", "Jl. Senopati"] },
  { region: regions.jakarta, city: jaksel, district: ref("dis-8", "Mampang Prapatan"), branch: branches[1]!, center: [106.8135, -6.2608], streets: ["Jl. Kemang Raya", "Jl. Pangeran Antasari", "Jl. Kemang Selatan"] },
  { region: regions.jakarta, city: jaksel, district: ref("dis-9", "Cilandak"), branch: branches[1]!, center: [106.7975, -6.2888], streets: ["Jl. Cilandak KKO", "Jl. T.B. Simatupang", "Jl. Fatmawati"] },
  { region: regions.jakarta, city: jaksel, district: ref("dis-10", "Tebet"), branch: branches[1]!, center: [106.8525, -6.2325], streets: ["Jl. Tebet Raya", "Jl. Tebet Barat Dalam", "Jl. Prof. Dr. Soepomo"] },
  { region: regions.jakarta, city: jaktim, district: ref("dis-11", "Jatinegara"), branch: branches[2]!, center: [106.87, -6.225], streets: ["Jl. Jatinegara Timur", "Jl. Matraman Raya", "Jl. Bekasi Barat"] },
  { region: regions.jakarta, city: jaktim, district: ref("dis-12", "Cakung"), branch: branches[2]!, center: [106.9405, -6.1845], streets: ["Jl. Raya Bekasi", "Jl. Cakung Cilincing", "Jl. Pulo Gadung"] },
  { region: regions.jakarta, city: jaktim, district: ref("dis-13", "Duren Sawit"), branch: branches[2]!, center: [106.9185, -6.2335], streets: ["Jl. Raden Inten II", "Jl. Pahlawan Revolusi", "Jl. Kolonel Sugiono"] },
  { region: regions.jakarta, city: jaktim, district: ref("dis-14", "Pasar Rebo"), branch: branches[2]!, center: [106.8605, -6.3215], streets: ["Jl. Raya Bogor", "Jl. T.B. Simatupang", "Jl. Kalisari"] },
  { region: regions.jakarta, city: jakbar, district: ref("dis-15", "Kebon Jeruk"), branch: branches[1]!, center: [106.7705, -6.1935], streets: ["Jl. Panjang", "Jl. Arjuna Utara", "Jl. Kebon Jeruk Raya"] },
  { region: regions.jakarta, city: jakbar, district: ref("dis-16", "Grogol Petamburan"), branch: branches[0]!, center: [106.79, -6.1665], streets: ["Jl. S. Parman", "Jl. Kyai Tapa", "Jl. Tanjung Duren Raya"] },
  { region: regions.jakarta, city: jakbar, district: ref("dis-17", "Cengkareng"), branch: branches[0]!, center: [106.7355, -6.1485], streets: ["Jl. Daan Mogot", "Jl. Lingkar Luar Barat", "Jl. Kamal Raya"] },
  // Kota Bogor
  { region: regions.jabar, city: bogor, district: ref("dis-18", "Bogor Tengah"), branch: branches[3]!, center: [106.7975, -6.5955], streets: ["Jl. Ir. H. Juanda", "Jl. Suryakencana", "Jl. Kapten Muslihat", "Jl. Pajajaran"] },
  { region: regions.jabar, city: bogor, district: ref("dis-19", "Bogor Utara"), branch: branches[3]!, center: [106.8105, -6.5685], streets: ["Jl. Raya Pajajaran", "Jl. Achmad Adnawijaya", "Jl. Bangbarung Raya"] },
  { region: regions.jabar, city: bogor, district: ref("dis-20", "Bogor Barat"), branch: branches[3]!, center: [106.7725, -6.5895], streets: ["Jl. Raya Dramaga", "Jl. Sindang Barang", "Jl. K.H. Abdullah bin Nuh"] },
  { region: regions.jabar, city: bogor, district: ref("dis-21", "Tanah Sareal"), branch: branches[3]!, center: [106.7925, -6.5675], streets: ["Jl. K.H. Sholeh Iskandar", "Jl. Raya Semplak", "Jl. Kebon Pedes"] },
  // Kota Depok
  { region: regions.jabar, city: depok, district: ref("dis-22", "Beji"), branch: branches[4]!, center: [106.8185, -6.3715], streets: ["Jl. Margonda Raya", "Jl. Nusantara Raya", "Jl. Juanda"] },
  { region: regions.jabar, city: depok, district: ref("dis-23", "Pancoran Mas"), branch: branches[4]!, center: [106.8135, -6.3995], streets: ["Jl. Margonda Raya", "Jl. Kartini", "Jl. Dewi Sartika"] },
  { region: regions.jabar, city: depok, district: ref("dis-24", "Sukmajaya"), branch: branches[4]!, center: [106.8425, -6.3945], streets: ["Jl. Tole Iskandar", "Jl. Raya Sukmajaya", "Jl. Proklamasi"] },
  { region: regions.jabar, city: depok, district: ref("dis-25", "Cimanggis"), branch: branches[4]!, center: [106.8645, -6.3645], streets: ["Jl. Raya Bogor", "Jl. Radar AURI", "Jl. Akses UI"] },
  // Kota Tangerang & Tangerang Selatan
  { region: regions.banten, city: tangerang, district: ref("dis-26", "Tangerang"), branch: branches[5]!, center: [106.6325, -6.1785], streets: ["Jl. Daan Mogot", "Jl. Kisamaun", "Jl. M.H. Thamrin"] },
  { region: regions.banten, city: tangerang, district: ref("dis-27", "Cipondoh"), branch: branches[5]!, center: [106.6845, -6.1775], streets: ["Jl. K.H. Hasyim Ashari", "Jl. Maulana Hasanudin", "Jl. Raya Cipondoh"] },
  { region: regions.banten, city: tangerang, district: ref("dis-28", "Karawaci"), branch: branches[5]!, center: [106.6165, -6.2125], streets: ["Jl. Boulevard Diponegoro", "Jl. Imam Bonjol", "Jl. Gatot Subroto"] },
  { region: regions.banten, city: tangsel, district: ref("dis-29", "Serpong"), branch: branches[5]!, center: [106.6655, -6.3045], streets: ["Jl. BSD Grand Boulevard", "Jl. Raya Serpong", "Jl. Pahlawan Seribu"] },
  { region: regions.banten, city: tangsel, district: ref("dis-30", "Ciputat"), branch: branches[5]!, center: [106.7545, -6.3135], streets: ["Jl. Ir. H. Juanda", "Jl. Dewi Sartika", "Jl. R.E. Martadinata"] },
  { region: regions.banten, city: tangsel, district: ref("dis-31", "Pondok Aren"), branch: branches[5]!, center: [106.7185, -6.2695], streets: ["Jl. Bintaro Utama", "Jl. Boulevard Bintaro Jaya", "Jl. Raya Jombang"] },
  // Kota Bekasi
  { region: regions.jabar, city: bekasi, district: ref("dis-32", "Bekasi Selatan"), branch: branches[6]!, center: [106.9865, -6.2605], streets: ["Jl. Ahmad Yani", "Jl. K.H. Noer Ali", "Jl. Pekayon Jaya"] },
  { region: regions.jabar, city: bekasi, district: ref("dis-33", "Bekasi Timur"), branch: branches[6]!, center: [107.0185, -6.2425], streets: ["Jl. Ir. H. Juanda", "Jl. Chairil Anwar", "Jl. Raya Hasibuan"] },
  { region: regions.jabar, city: bekasi, district: ref("dis-34", "Bekasi Barat"), branch: branches[6]!, center: [106.9615, -6.2305], streets: ["Jl. Sultan Agung", "Jl. Raya Kalimalang", "Jl. Bintara Raya"] },
  { region: regions.jabar, city: bekasi, district: ref("dis-35", "Jatiasih"), branch: branches[6]!, center: [106.9565, -6.3045], streets: ["Jl. Raya Jatiasih", "Jl. Wibawa Mukti", "Jl. Swatantra"] },
  { region: regions.jabar, city: bekasi, district: ref("dis-36", "Pondok Gede"), branch: branches[6]!, center: [106.9185, -6.2805], streets: ["Jl. Raya Pondok Gede", "Jl. Jatiwaringin", "Jl. Raya Hankam"] },
];

const shopNames = [
  "Toko Sumber Rejeki", "Warung Bu Yati", "Minimarket Sejahtera", "Toko Maju Jaya", "Grosir Berkah Abadi",
  "Kedai Kopi Senja", "Toko Sinar Harapan", "Warung Pak Ujang", "Toko Makmur", "Restoran Bahari",
  "Toko Lima Saudara", "Warung Mbak Sri", "Minimarket Cahaya", "Toko Sari Rasa", "Grosir Jaya Makmur",
  "Kafe Teras Kota", "Toko Harapan Baru", "Warung Nasi Padang Sederhana", "Toko Bintang Terang", "Hotel Nusantara",
  "Toko Mitra Usaha", "Warung Kopi Tugu", "Minimarket Prima", "Toko Dua Putri", "Grosir Sentosa",
];

/** Small deterministic PRNG so the mock is stable between renders and reloads. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(20261104);
const pick = <T,>(items: T[]) => items[Math.floor(random() * items.length)]!;

function sales(scale: number, invoices: number, month: number) {
  return {
    totalInvoice: invoices,
    salesAmount: Math.round(scale * invoices * (0.8 + random() * 0.6)),
    quantityCtn: Math.round(invoices * (3 + random() * 9)),
    quantityKg: Math.round(invoices * (40 + random() * 120)),
    lastDateInvoice: invoices ? `2026-${String(month).padStart(2, "0")}-${String(1 + Math.floor(random() * 27)).padStart(2, "0")}` : null,
  };
}

const profiles: CustomerProfile[] = [];
let streetKey = 0;
const streetKeys = new Map<string, string>();

for (const seed of districts) {
  const count = 10 + Math.floor(random() * 9);
  for (let i = 0; i < count; i += 1) {
    const index = profiles.length + 1;
    const streetName = pick(seed.streets);
    const streetId = `${seed.district.key}:${streetName}`;
    if (!streetKeys.has(streetId)) streetKeys.set(streetId, `st-${++streetKey}`);
    const category = pick(categories);
    const hasCoords = random() > 0.06;
    const invoices = 4 + Math.floor(random() * 40);
    const returns = Math.floor(random() * 5);
    profiles.push({
      key: `cust-${index}`,
      name: `${pick(shopNames)} ${index}`,
      branch: seed.branch,
      employee: pick(employees),
      category,
      region: seed.region,
      city: seed.city,
      district: seed.district,
      street: ref(streetKeys.get(streetId)!, `${streetName} No. ${1 + Math.floor(random() * 180)}`),
      ...(hasCoords
        ? {
            longitude: Number((seed.center[0] + (random() - 0.5) * 0.024).toFixed(5)),
            latitude: Number((seed.center[1] + (random() - 0.5) * 0.02).toFixed(5)),
          }
        : {}),
      salesInvoice: sales(category.key === "cat-1" ? 9_500_000 : category.key === "cat-5" ? 850_000 : 2_400_000, invoices, 10),
      salesReturn: sales(category.key === "cat-1" ? 1_200_000 : 300_000, returns, 9),
    });
  }
}

export const customerProfiles: CustomerProfile[] = profiles;

export const locationCustomers: LocationCustomer[] = profiles.map(
  ({ salesInvoice: _invoice, salesReturn: _return, ...customer }) => customer,
);
