import type { ChatOption } from "@/features/ai-chat/panel/types/chat";
import type {
  CornerChatThread,
  PageSource,
  ReplyEntry,
} from "@/features/ai-chat/float/types/corner-chat";
import type {
  ChatMode,
  ComposerFile,
  ConnectedApp,
} from "@/features/ai-chat/page/types/connected-apps";
import type {
  AgentArtifact,
  AgentFile,
  AgentOwner,
  AgentSource,
  ForkChoice,
  PlanStep,
} from "@/features/ai-chat/panel/types/agent-task";

export const aiChatModels: ChatOption[] = [
  { value: "claude-opus-5-5", label: "Claude Opus 5.5" },
  { value: "claude-sonnet-5-5", label: "Claude Sonnet 5.5" },
  { value: "claude-haiku-5-5", label: "Claude Haiku 5.5" },
];

// Page · Connected Apps Chat

export const connectedApps: ConnectedApp[] = [
  { id: "drive", name: "Google Drive", reads: "dokumen" },
  { id: "slack", name: "Slack", reads: "pesan" },
  { id: "calendar", name: "Calendar", reads: "acara" },
  { id: "dropbox", name: "Dropbox", reads: "file" },
  { id: "onedrive", name: "OneDrive", reads: "file" },
  { id: "box", name: "Box", reads: "file" },
  { id: "zoom", name: "Zoom", reads: "rekaman" },
  { id: "loom", name: "Loom", reads: "video" },
  { id: "notion", name: "Notion", reads: "halaman" },
];

export const connectedAtStart = ["drive", "slack", "calendar"];

export const chatModes: ChatMode[] = [
  {
    id: "summarize",
    label: "Ringkas",
    description: "Ringkasan singkat dari semua sumber",
    prompt: "Ringkas perkembangan proyek peluncuran Q4 minggu ini.",
    sources: ["drive", "slack", "calendar", "notion"],
    steps: [
      "Mencari dokumen peluncuran Q4",
      "Membaca diskusi kanal #launch-q4",
      "Mencocokkan jadwal rapat minggu ini",
      "Menyusun ringkasan",
    ],
    answer:
      "Peluncuran Q4 masih sesuai jadwal untuk 18 November.\n\n• Desain halaman harga final dan sudah disetujui tim produk pada Senin.\n• Tim QA menemukan 3 bug prioritas tinggi di alur checkout; 2 sudah diperbaiki.\n• Rapat go/no-go dijadwalkan Kamis pukul 14.00.\n\nRisiko utama: materi pelatihan tim dukungan belum dimulai.",
  },
  {
    id: "research",
    label: "Riset",
    description: "Cari bukti dan kutipan dari dokumen",
    prompt:
      "Cari semua keputusan tentang harga paket Enterprise dan sumbernya.",
    sources: ["drive", "slack", "dropbox", "box"],
    steps: [
      "Mencari kata kunci “harga Enterprise”",
      "Menyaring keputusan yang disetujui",
      "Mengumpulkan kutipan sumber",
    ],
    answer:
      "Ditemukan 3 keputusan terkait harga paket Enterprise:\n\n1. Harga dasar naik menjadi Rp 4,5 jt/kursi/tahun (memo Pricing v3, 2 Okt).\n2. Diskon volume maksimal 20% untuk lebih dari 200 kursi (thread #sales-ops, 9 Okt).\n3. Uji coba 30 hari tetap gratis tanpa kartu kredit (notulen rapat 14 Okt).",
  },
  {
    id: "draft",
    label: "Tulis draf",
    description: "Buat draf email atau dokumen",
    prompt:
      "Tulis draf email pembaruan status peluncuran Q4 untuk stakeholder.",
    sources: ["drive", "slack", "calendar"],
    steps: [
      "Mengambil status terbaru",
      "Menentukan poin penting",
      "Menulis draf email",
    ],
    answer:
      "Subjek: Pembaruan status peluncuran Q4\n\nHalo semua,\n\nPeluncuran Q4 tetap dijadwalkan pada 18 November. Desain halaman harga sudah final, dan tim QA sedang menuntaskan bug terakhir di alur checkout. Keputusan go/no-go akan diambil pada rapat Kamis pukul 14.00.\n\nMohon tim dukungan mulai menyiapkan materi pelatihan minggu ini.\n\nTerima kasih.",
  },
  {
    id: "plan",
    label: "Rencanakan",
    description: "Susun langkah kerja dan tenggat",
    prompt: "Susun rencana kerja dua minggu menuju peluncuran Q4.",
    sources: ["calendar", "notion", "slack", "zoom"],
    steps: [
      "Membaca tenggat di kalender",
      "Mengambil daftar tugas terbuka",
      "Menyusun urutan kerja",
    ],
    answer:
      "Rencana dua minggu menuju 18 November:\n\nMinggu 1\n• Selesaikan 1 bug checkout tersisa (QA, Rabu).\n• Mulai materi pelatihan dukungan (Support, Jumat).\n\nMinggu 2\n• Uji regresi penuh dan rapat go/no-go (Kamis).\n• Siapkan pengumuman dan email pelanggan (Marketing, Jumat).",
  },
];

export const composerFiles: ComposerFile[] = [
  { id: "brief", name: "launch-brief-q4.pdf", size: "1,2 MB" },
  { id: "pricing", name: "pricing-v3.xlsx", size: "320 KB" },
  { id: "notes", name: "notulen-14-okt.docx", size: "88 KB" },
];

// Panel · Agentic Task Panel

export const agentSources: AgentSource[] = [
  { id: "crm", name: "CRM Pipeline", kind: "Database", access: "read" },
  {
    id: "pricing",
    name: "Pricing Workbook",
    kind: "Spreadsheet",
    access: "edit",
  },
  { id: "warehouse", name: "Revenue Warehouse", kind: "SQL", access: "run" },
  { id: "wiki", name: "Wiki Kebijakan Harga", kind: "Dokumen", access: "read" },
];

export const agentInitialFiles: AgentFile[] = [
  { id: "competitor", name: "kompetitor-q3.pdf", size: "2,4 MB" },
];

export const agentPickableFiles: AgentFile[] = [
  { id: "survey", name: "survei-pelanggan.csv", size: "540 KB" },
  { id: "churn", name: "laporan-churn-q3.pdf", size: "1,1 MB" },
  { id: "deck", name: "deck-board-okt.pptx", size: "6,8 MB" },
];

export const agentPlanSteps: PlanStep[] = [
  {
    id: "step_collect",
    title: "Kumpulkan data pendapatan Q3",
    detail: "Query Revenue Warehouse per paket dan segmen.",
    runMs: 1400,
    tokens: 1800,
  },
  {
    id: "step_compare",
    title: "Bandingkan harga dengan kompetitor",
    detail: "Cocokkan tabel harga kompetitor dengan Pricing Workbook.",
    runMs: 1600,
    tokens: 2600,
    failFirstRun: true,
  },
  {
    id: "step_segment",
    title: "Hitung elastisitas per segmen",
    detail: "Gunakan data CRM untuk memperkirakan dampak kenaikan harga.",
    runMs: 1500,
    tokens: 2100,
  },
  {
    id: "step_enterprise",
    title: "Simulasikan skenario Enterprise",
    detail: "Kenaikan 8% dengan diskon volume 20%.",
    runMs: 1300,
    tokens: 1500,
    branch: "enterprise",
  },
  {
    id: "step_smb",
    title: "Simulasikan skenario UKM",
    detail: "Paket Starter baru dengan harga tetap.",
    runMs: 1300,
    tokens: 1400,
    branch: "smb",
  },
  {
    id: "step_report",
    title: "Tulis rekomendasi",
    detail: "Ringkasan eksekutif dan lampiran perhitungan.",
    runMs: 1700,
    tokens: 3200,
  },
];

/** Agen bertanya setelah langkah ini selesai. */
export const agentForkAfterStep = "step_segment";

export const agentForkChoices: ForkChoice[] = [
  {
    id: "enterprise",
    label: "Fokus Enterprise",
    description: "Lewati simulasi UKM",
  },
  { id: "smb", label: "Fokus UKM", description: "Lewati simulasi Enterprise" },
  { id: "both", label: "Keduanya", description: "Jalankan kedua simulasi" },
];

export const agentOwners: AgentOwner[] = [
  { value: "sofia", label: "Sofia Chen" },
  { value: "daniel", label: "Daniel Okafor" },
  { value: "priya", label: "Priya Sharma" },
];

export const agentArtifacts: AgentArtifact[] = [
  { id: "summary", name: "rekomendasi-harga-q4.md", size: "14 KB" },
  { id: "model", name: "model-elastisitas.xlsx", size: "410 KB" },
];

/** Biaya simulasi per 1.000 token, dalam dolar AS. */
export const agentCostPerThousandTokens = 0.012;

// Float · Corner Chat Popup

export const cornerPageSource: PageSource = {
  id: "sales-october",
  title: "Laporan Penjualan Oktober",
  description: "Halaman ini · 4 KPI dan 5 produk teratas",
};

export const cornerStarters = [
  "Ringkas laporan di halaman ini",
  "Produk mana yang tumbuh paling cepat?",
  "Kenapa tingkat konversi turun?",
  "Bagaimana cara mengekspor laporan?",
];

export const cornerReplyLibrary: ReplyEntry[] = [
  {
    keywords: ["ringkas", "ringkasan", "summary"],
    needsContext: true,
    answer:
      "Pendapatan Oktober Rp 1,28 M, naik 12,4% dari September. Pesanan naik 8,1% menjadi 3.420, tetapi konversi turun 0,3 poin menjadi 2,9%. Produk teratas adalah Paket Pro Tahunan dengan kontribusi 31% pendapatan.",
  },
  {
    keywords: ["tumbuh", "produk", "cepat"],
    needsContext: true,
    answer:
      "Add-on Analytics tumbuh paling cepat: +38% dibanding bulan lalu. Paket Pro Tahunan tetap terbesar secara nilai, tetapi pertumbuhannya hanya +9%.",
  },
  {
    keywords: ["konversi", "turun"],
    needsContext: true,
    answer:
      "Penurunan konversi terutama terjadi pada trafik seluler (−0,6 poin), bersamaan dengan rilis halaman checkout baru pada 14 Oktober. Trafik desktop relatif stabil. Saya sarankan memeriksa langkah pembayaran di perangkat seluler.",
  },
  {
    keywords: ["ekspor", "export", "unduh", "csv"],
    needsContext: false,
    answer:
      "Buka menu titik tiga di kanan atas tabel, lalu pilih Ekspor CSV atau Ekspor PDF. File akan memakai filter dan rentang tanggal yang sedang aktif.",
  },
];

export const cornerFallbackReply =
  "Saya bisa membantu membaca angka di halaman ini, membandingkan periode, atau menjelaskan cara memakai fitur laporan. Coba tanyakan tentang pendapatan, produk, atau konversi.";

export const cornerNeedsContextReply =
  "Saya belum bisa melihat halaman ini. Lampirkan konteks halaman melalui tombol di kotak pesan, lalu tanyakan lagi.";

export const cornerThreads: CornerChatThread[] = [
  {
    id: "thread-target",
    title: "Target penjualan Q4",
    updatedAt: "Kemarin",
    pinned: true,
    messages: [
      {
        id: "thread-target-1",
        role: "user",
        text: "Berapa target penjualan Q4?",
        status: "done",
      },
      {
        id: "thread-target-2",
        role: "assistant",
        text: "Target Q4 adalah Rp 4,2 M, atau rata-rata Rp 1,4 M per bulan. Oktober mencapai 91% dari target bulanan.",
        status: "done",
        meta: { sources: [cornerPageSource.title] },
      },
    ],
  },
  {
    id: "thread-refund",
    title: "Kebijakan refund",
    updatedAt: "24 Okt",
    pinned: false,
    messages: [
      {
        id: "thread-refund-1",
        role: "user",
        text: "Bagaimana refund dihitung di laporan?",
        status: "done",
      },
      {
        id: "thread-refund-2",
        role: "assistant",
        text: "Refund dikurangkan dari pendapatan pada tanggal refund diproses, bukan tanggal pesanan awal.",
        status: "done",
      },
    ],
  },
  {
    id: "thread-region",
    title: "Perbandingan wilayah",
    updatedAt: "19 Okt",
    pinned: false,
    messages: [
      {
        id: "thread-region-1",
        role: "user",
        text: "Wilayah mana yang paling kuat bulan ini?",
        status: "done",
      },
      {
        id: "thread-region-2",
        role: "assistant",
        text: "Jabodetabek menyumbang 46% pendapatan, disusul Jawa Timur 18% dan Bali 9%.",
        status: "done",
      },
    ],
  },
];
