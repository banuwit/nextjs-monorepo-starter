import type {
  Lead,
  LeadMove,
  LeadPriority,
  LeadSource,
  Pipeline,
} from "@/features/leads/types/leads";

export const leadOwners = [
  "Nora Bennett",
  "Arham Khan",
  "Clara Hughes",
  "Rohan Iyer",
  "Sinta Maharani",
] as const;

export const lostReasons = [
  "Harga terlalu tinggi",
  "Memilih kompetitor",
  "Tidak ada anggaran",
  "Tidak ada respons",
  "Kebutuhan tidak sesuai",
  "Waktu belum tepat",
] as const;

export const initialPipelines: Pipeline[] = [
  {
    id: "b2b-sales",
    name: "B2B Sales",
    description:
      "Penjualan enterprise dengan kualifikasi ketat. Lead bergerak satu tahap demi satu tahap.",
    movement: "sequential",
    stages: [
      { id: "new", name: "New", kind: "open", probability: 10, tone: "slate" },
      { id: "contacted", name: "Contacted", kind: "open", probability: 20, tone: "sky" },
      { id: "qualified", name: "Qualified", kind: "open", probability: 40, tone: "indigo" },
      { id: "proposal", name: "Proposal", kind: "open", probability: 60, tone: "violet" },
      { id: "negotiation", name: "Negotiation", kind: "open", probability: 80, tone: "amber" },
      { id: "won", name: "Won", kind: "won", probability: 100, tone: "emerald" },
      { id: "lost", name: "Lost", kind: "lost", probability: 0, tone: "rose" },
    ],
  },
  {
    id: "partnership",
    name: "Partnership",
    description:
      "Kemitraan reseller dan integrasi. Tahap boleh dilompati sesuai kesiapan mitra.",
    movement: "flexible",
    stages: [
      { id: "initial", name: "Initial", kind: "open", probability: 10, tone: "slate" },
      { id: "discovery", name: "Discovery", kind: "open", probability: 30, tone: "teal" },
      { id: "pilot", name: "Pilot", kind: "open", probability: 55, tone: "orange" },
      { id: "contract", name: "Contract", kind: "open", probability: 85, tone: "violet" },
      { id: "won", name: "Signed", kind: "won", probability: 100, tone: "emerald" },
      { id: "lost", name: "Dropped", kind: "lost", probability: 0, tone: "rose" },
    ],
  },
  {
    id: "inbound-smb",
    name: "Inbound SMB",
    description:
      "Lead self-serve dari website: demo singkat, trial, lalu konversi.",
    movement: "sequential",
    stages: [
      { id: "new", name: "New", kind: "open", probability: 15, tone: "sky" },
      { id: "demo", name: "Demo", kind: "open", probability: 40, tone: "indigo" },
      { id: "trial", name: "Trial", kind: "open", probability: 70, tone: "amber" },
      { id: "won", name: "Converted", kind: "won", probability: 100, tone: "emerald" },
      { id: "lost", name: "Churned", kind: "lost", probability: 0, tone: "rose" },
    ],
  },
];

type LeadSeed = {
  id: string;
  pipelineId: string;
  name: string;
  company: string;
  value: number;
  source: LeadSource;
  owner: (typeof leadOwners)[number];
  priority: LeadPriority;
  expectedClose: string;
  /** Stage path with the date each stage was entered; the last entry is the current stage. */
  path: [stageId: string, date: string][];
  lostReason?: string;
};

function buildLead(seed: LeadSeed): Lead {
  const history: LeadMove[] = seed.path.map(([stageId, date], index) => ({
    stageId,
    at: `${date}T0${(index % 7) + 2}:15:00.000Z`,
    by: seed.owner,
    note: index === 0 ? "Lead dibuat" : undefined,
  }));
  const slug = seed.name.toLowerCase().split(" ")[0] ?? "contact";
  const domain = seed.company.toLowerCase().replace(/[^a-z0-9]+/g, "");

  return {
    id: seed.id,
    pipelineId: seed.pipelineId,
    stageId: seed.path.at(-1)?.[0] ?? "new",
    name: seed.name,
    company: seed.company,
    email: `${slug}@${domain}.co.id`,
    phone: `+62 812 4410 ${seed.id.replace(/\D/g, "").padStart(4, "0")}`,
    value: seed.value,
    source: seed.source,
    owner: seed.owner,
    priority: seed.priority,
    expectedClose: seed.expectedClose,
    lostReason: seed.lostReason,
    history,
  };
}

const seeds: LeadSeed[] = [
  // B2B Sales
  { id: "lead-001", pipelineId: "b2b-sales", name: "Dimas Pratama", company: "Bank Arunika", value: 480_000_000, source: "outbound", owner: "Nora Bennett", priority: "high", expectedClose: "2026-12-12", path: [["new", "2026-09-02"], ["contacted", "2026-09-06"], ["qualified", "2026-09-20"], ["proposal", "2026-10-08"], ["negotiation", "2026-10-28"]] },
  { id: "lead-002", pipelineId: "b2b-sales", name: "Ayu Lestari", company: "Logistik Samudra", value: 260_000_000, source: "referral", owner: "Arham Khan", priority: "high", expectedClose: "2026-11-30", path: [["new", "2026-09-15"], ["contacted", "2026-09-18"], ["qualified", "2026-10-01"], ["proposal", "2026-10-22"]] },
  { id: "lead-003", pipelineId: "b2b-sales", name: "Hendra Wijaya", company: "Pabrik Baja Utama", value: 720_000_000, source: "event", owner: "Clara Hughes", priority: "medium", expectedClose: "2027-01-20", path: [["new", "2026-10-03"], ["contacted", "2026-10-09"], ["qualified", "2026-10-30"]] },
  { id: "lead-004", pipelineId: "b2b-sales", name: "Maya Putri", company: "RS Harapan Kasih", value: 195_000_000, source: "website", owner: "Rohan Iyer", priority: "medium", expectedClose: "2026-12-30", path: [["new", "2026-10-20"], ["contacted", "2026-10-27"]] },
  { id: "lead-005", pipelineId: "b2b-sales", name: "Rizky Ramadhan", company: "Asuransi Pelita", value: 340_000_000, source: "outbound", owner: "Sinta Maharani", priority: "low", expectedClose: "2027-02-14", path: [["new", "2026-11-02"]] },
  { id: "lead-006", pipelineId: "b2b-sales", name: "Fajar Nugroho", company: "Telko Nusantara", value: 910_000_000, source: "partner", owner: "Nora Bennett", priority: "high", expectedClose: "2026-11-15", path: [["new", "2026-08-01"], ["contacted", "2026-08-05"], ["qualified", "2026-08-21"], ["proposal", "2026-09-10"], ["negotiation", "2026-10-02"], ["won", "2026-10-24"]] },
  { id: "lead-007", pipelineId: "b2b-sales", name: "Intan Permata", company: "Retail Mandala", value: 150_000_000, source: "website", owner: "Arham Khan", priority: "low", expectedClose: "2026-10-30", path: [["new", "2026-08-18"], ["contacted", "2026-08-25"], ["qualified", "2026-09-12"], ["lost", "2026-10-05"]], lostReason: "Tidak ada anggaran" },
  { id: "lead-008", pipelineId: "b2b-sales", name: "Bayu Saputra", company: "Energi Hijau", value: 560_000_000, source: "event", owner: "Clara Hughes", priority: "high", expectedClose: "2026-12-05", path: [["new", "2026-09-08"], ["contacted", "2026-09-10"], ["qualified", "2026-09-28"], ["proposal", "2026-10-15"]] },
  { id: "lead-009", pipelineId: "b2b-sales", name: "Citra Anggraini", company: "Universitas Cendekia", value: 230_000_000, source: "referral", owner: "Rohan Iyer", priority: "medium", expectedClose: "2027-01-08", path: [["new", "2026-11-01"]] },
  { id: "lead-010", pipelineId: "b2b-sales", name: "Gilang Mahendra", company: "Properti Graha", value: 410_000_000, source: "outbound", owner: "Sinta Maharani", priority: "medium", expectedClose: "2026-10-20", path: [["new", "2026-07-20"], ["contacted", "2026-07-28"], ["qualified", "2026-08-15"], ["proposal", "2026-09-01"], ["negotiation", "2026-09-19"], ["lost", "2026-10-11"]], lostReason: "Memilih kompetitor" },
  // Partnership
  { id: "lead-011", pipelineId: "partnership", name: "Yoga Prasetyo", company: "Kasirku", value: 320_000_000, source: "partner", owner: "Clara Hughes", priority: "high", expectedClose: "2026-12-18", path: [["initial", "2026-09-12"], ["pilot", "2026-10-06"]] },
  { id: "lead-012", pipelineId: "partnership", name: "Laras Wulandari", company: "Integra Cloud", value: 540_000_000, source: "event", owner: "Nora Bennett", priority: "high", expectedClose: "2026-11-28", path: [["initial", "2026-08-20"], ["discovery", "2026-09-02"], ["pilot", "2026-09-25"], ["contract", "2026-10-30"]] },
  { id: "lead-013", pipelineId: "partnership", name: "Andi Kurniawan", company: "Mitra Distribusi", value: 180_000_000, source: "referral", owner: "Arham Khan", priority: "medium", expectedClose: "2027-01-31", path: [["initial", "2026-10-25"]] },
  { id: "lead-014", pipelineId: "partnership", name: "Putri Ramadhani", company: "Akuntan Digital", value: 260_000_000, source: "website", owner: "Sinta Maharani", priority: "medium", expectedClose: "2026-12-22", path: [["initial", "2026-10-02"], ["discovery", "2026-10-19"]] },
  { id: "lead-015", pipelineId: "partnership", name: "Teguh Santoso", company: "Gudang Pintar", value: 390_000_000, source: "partner", owner: "Rohan Iyer", priority: "low", expectedClose: "2026-10-15", path: [["initial", "2026-07-11"], ["contract", "2026-08-30"], ["won", "2026-09-21"]] },
  { id: "lead-016", pipelineId: "partnership", name: "Nadia Safitri", company: "Payfast", value: 470_000_000, source: "outbound", owner: "Clara Hughes", priority: "medium", expectedClose: "2026-10-31", path: [["initial", "2026-08-03"], ["discovery", "2026-08-19"], ["lost", "2026-09-30"]], lostReason: "Kebutuhan tidak sesuai" },
  // Inbound SMB
  { id: "lead-017", pipelineId: "inbound-smb", name: "Eka Saputri", company: "Toko Bunga Melati", value: 18_000_000, source: "website", owner: "Sinta Maharani", priority: "low", expectedClose: "2026-11-20", path: [["new", "2026-11-03"]] },
  { id: "lead-018", pipelineId: "inbound-smb", name: "Bima Aditya", company: "Kopi Senja", value: 24_000_000, source: "website", owner: "Arham Khan", priority: "medium", expectedClose: "2026-11-25", path: [["new", "2026-10-21"], ["demo", "2026-10-28"]] },
  { id: "lead-019", pipelineId: "inbound-smb", name: "Rani Oktavia", company: "Klinik Gigi Sehat", value: 36_000_000, source: "referral", owner: "Rohan Iyer", priority: "high", expectedClose: "2026-11-18", path: [["new", "2026-10-10"], ["demo", "2026-10-14"], ["trial", "2026-10-21"]] },
  { id: "lead-020", pipelineId: "inbound-smb", name: "Joko Susilo", company: "Bengkel Maju", value: 12_000_000, source: "website", owner: "Nora Bennett", priority: "low", expectedClose: "2026-11-12", path: [["new", "2026-10-30"], ["demo", "2026-11-04"]] },
  { id: "lead-021", pipelineId: "inbound-smb", name: "Sari Indah", company: "Butik Anggun", value: 21_000_000, source: "event", owner: "Sinta Maharani", priority: "medium", expectedClose: "2026-10-28", path: [["new", "2026-09-28"], ["demo", "2026-10-02"], ["trial", "2026-10-09"], ["won", "2026-10-23"]] },
  { id: "lead-022", pipelineId: "inbound-smb", name: "Wahyu Hidayat", company: "Laundry Kilat", value: 9_000_000, source: "website", owner: "Arham Khan", priority: "low", expectedClose: "2026-10-25", path: [["new", "2026-09-30"], ["demo", "2026-10-05"], ["trial", "2026-10-11"], ["lost", "2026-10-26"]], lostReason: "Harga terlalu tinggi" },
  { id: "lead-023", pipelineId: "inbound-smb", name: "Dewi Kartika", company: "Les Privat Pintar", value: 15_000_000, source: "referral", owner: "Rohan Iyer", priority: "medium", expectedClose: "2026-11-29", path: [["new", "2026-11-05"]] },
  { id: "lead-024", pipelineId: "inbound-smb", name: "Agus Salim", company: "Katering Berkah", value: 27_000_000, source: "website", owner: "Nora Bennett", priority: "high", expectedClose: "2026-11-16", path: [["new", "2026-10-18"], ["demo", "2026-10-22"], ["trial", "2026-11-01"]] },
];

export const initialLeads: Lead[] = seeds.map(buildLead);
