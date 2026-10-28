export type ConnectedApp = {
  id: string;
  name: string;
  /** Jenis data yang dibaca asisten dari aplikasi ini. */
  reads: string;
};

export type ChatMode = {
  id: string;
  label: string;
  description: string;
  /** Template yang menulis ulang prompt saat mode dipilih. */
  prompt: string;
  /** Aplikasi yang akan dibaca; yang belum terhubung dilewati. */
  sources: string[];
  steps: string[];
  answer: string;
};

export type ComposerFile = {
  id: string;
  name: string;
  size: string;
};

export type SourceReceipt = {
  appId: string;
  state: "read" | "skipped";
  /** Jumlah item yang dibaca; hanya untuk sumber berstatus `read`. */
  items: number;
};

export type ConnectedRun = {
  id: string;
  prompt: string;
  modeId: string;
  modelId: string;
  files: ComposerFile[];
  receipts: SourceReceipt[];
  /** Indeks langkah yang sedang berjalan; sama dengan jumlah langkah saat selesai. */
  stepIndex: number;
  answer: string;
  status: "working" | "answering" | "done";
};
