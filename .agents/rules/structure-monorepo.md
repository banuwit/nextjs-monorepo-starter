# Standar struktur folder monorepo

Dokumen ini adalah standar struktur folder monorepo yang dipakai bersama antar-tim, agar setiap project memiliki susunan folder yang **identik** dengan repo acuan `nextjs-monorepo-starter`. Cakupannya level monorepo: root, `apps/`, `packages/`, `tooling/`, dan `.agents/`. Struktur di dalam aplikasi Next.js (`apps/frontend/src/`) diatur di [Struktur folder frontend](./frontend/structure-folder.md).

- **Wajib**: folder/file harus ada di semua project.
- **Saat dibutuhkan**: dibuat hanya ketika fiturnya dikerjakan, tetapi nama dan lokasinya harus mengikuti standar ini.

## Struktur standar

```text
<nama-project>/
├── AGENTS.md                  # Wajib. Panduan repo untuk developer dan agen AI
├── CLAUDE.md -> AGENTS.md     # Wajib. Symlink, bukan salinan
├── README.md                  # Wajib. Setup, skrip, daftar aplikasi
├── package.json               # Wajib. Skrip root dan tooling repo
├── pnpm-workspace.yaml        # Wajib. Mendaftarkan apps/* dan packages/*
├── pnpm-lock.yaml             # Wajib. Satu lockfile untuk seluruh workspace
├── turbo.json                 # Wajib. Pipeline task Turborepo
├── .gitignore                 # Wajib
├── .env.example               # Saat dibutuhkan. Daftar env tanpa nilai rahasia
├── compose.yaml               # Saat dibutuhkan. PostgreSQL lokal / DB uji
├── .github/workflows/         # Saat dibutuhkan. CI
│
├── .agents/                   # Wajib. Sumber tunggal rules dan skill agen AI
│   ├── rules/
│   │   ├── structure-monorepo.md   # Dokumen ini (lintas area)
│   │   ├── frontend/               # Rules apps/frontend
│   │   ├── mobile/                 # Rules apps/mobile
│   │   └── backend/                # Rules apps/backend
│   └── skills/
├── .claude -> .agents         # Wajib. Symlink
│
├── apps/                      # Aplikasi yang dijalankan/di-deploy
│   ├── frontend/              # Wajib. Next.js (web + Route Handler /api/v1)
│   │   ├── prd.md
│   │   ├── public/
│   │   ├── src/               # Lihat Struktur folder frontend
│   │   └── tests/             # Saat dibutuhkan. integration/, contracts/, e2e/
│   ├── mobile/                # Tahap 2; cukup prd.md sampai disetujui
│   └── backend/               # Tahap 3; cukup prd.md sampai disetujui
│
├── packages/                  # Kode/konfigurasi yang diimpor bersama
│   ├── eslint-config/         # Wajib. Konfigurasi ESLint bersama
│   ├── typescript-config/     # Wajib. tsconfig bersama
│   ├── contracts/             # Saat dibutuhkan. Schema Zod API + OpenAPI
│   │   ├── src/{schemas,responses}/
│   │   ├── generated/         # openapi.json hasil generate
│   │   └── tests/
│   ├── core/                  # Saat dibutuhkan. Use case, policy, port repository
│   │   └── src/{<resource>,shared}/
│   ├── db/                    # Saat dibutuhkan. Drizzle + migrasi
│   │   ├── drizzle/           # File migrasi SQL
│   │   ├── src/{schema,repositories,seed}/
│   │   └── tests/
│   └── auth/                  # Saat dibutuhkan. Integrasi Better Auth
│       └── src/
│
└── tooling/
    └── scripts/               # Saat dibutuhkan. Skrip CLI repo (generate/check OpenAPI)
```

## Fungsi setiap folder

| Folder                       | Isi                                                                                       | Tidak boleh berisi                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Root                         | File konfigurasi workspace dan dokumentasi repo.                                          | Kode aplikasi atau paket                               |
| `.agents/rules/`             | Rules per area (`frontend/`, `mobile/`, `backend/`); rules lintas area di root folder ini. | Skill atau dokumen produk                              |
| `.agents/skills/`            | Skill agen yang dipasang dari sumber eksternal.                                           | Rules project                                          |
| `apps/<app>/`                | Satu aplikasi yang bisa dijalankan, beserta `prd.md`-nya.                                 | Kode yang dipakai aplikasi lain                        |
| `packages/eslint-config/`    | Varian konfigurasi ESLint (`base`, `next-js`, `react-internal`).                          | Override khusus satu aplikasi                          |
| `packages/typescript-config/`| `base.json`, `nextjs.json`, `react-library.json`.                                         | Alias path aplikasi                                    |
| `packages/contracts/`        | Schema Zod request/response, envelope, tipe API, OpenAPI hasil generate.                  | Kode Next.js, Drizzle, atau Better Auth                |
| `packages/core/`             | Logika bisnis per resource dan `shared/` (tipe `Principal`, error domain).                | Kode framework, ORM, atau React                        |
| `packages/db/`               | Schema Drizzle, migrasi SQL, adapter repository, seed.                                    | Komponen UI                                            |
| `packages/auth/`             | Konfigurasi auth server dan ekspor client yang terpisah.                                  | Logika bisnis                                          |
| `tooling/scripts/`           | Skrip CLI untuk merawat repo.                                                             | Kode runtime aplikasi                                  |

## Aturan struktur

- `apps/` hanya untuk yang **dijalankan**; `packages/` hanya untuk yang **diimpor**. Aplikasi tidak mengimpor aplikasi lain, dan paket tidak mengimpor dari `apps/`.
- Nama folder aplikasi mengikuti peran (`frontend`, `mobile`, `backend`), bukan nama produk, agar sama di semua project.
- Nama paket di `packages/<nama>` selalu `@repo/<nama>`; nama paket aplikasi sama dengan nama foldernya (`frontend`).
- Setiap aplikasi dan paket memiliki `package.json`, `tsconfig.json`, dan (bila berisi kode) `eslint.config.js` sendiri di root foldernya. Kode sumber berada di `src/`, pengujian di `tests/`.
- Aplikasi atau tahap yang belum diimplementasikan cukup berisi `prd.md` tanpa `package.json`.
- Folder bertanda *Saat dibutuhkan* tidak dibuat sebagai kerangka kosong; buat bersamaan dengan file nyatanya.
- Jangan membuat `packages/ui` atau `packages/api-client` sebelum ada kode yang benar-benar dipakai lebih dari satu aplikasi.
- Jangan menambah folder level root lain (`libs/`, `services/`, `shared/`, `config/`) di luar standar ini.
- Hanya ada satu lockfile (`pnpm-lock.yaml`) di root; tidak ada lockfile per aplikasi/paket.
- `.claude` dan `CLAUDE.md` adalah symlink ke `.agents` dan `AGENTS.md`; edit file aslinya.

## Checklist kesesuaian

- [ ] Semua folder/file bertanda *Wajib* ada dengan nama yang sama.
- [ ] Tidak ada folder level root di luar standar.
- [ ] Setiap folder di `apps/` dan `packages/` mengikuti aturan nama dan isi di atas.
- [ ] Symlink `.claude` dan `CLAUDE.md` ada.
- [ ] Rules baru ditaruh di `.agents/rules/<area>/` dan didaftarkan di tabel rules `AGENTS.md`.

## Status repo acuan (`nextjs-monorepo-starter`)

Bagian ini hanya untuk repo acuan; jangan disalin ke project lain.

- Sudah ada: `apps/frontend`, `apps/mobile/prd.md`, `apps/backend/prd.md`, `packages/eslint-config`, `packages/typescript-config`, dan `.agents/`.
- Belum ada: `packages/{contracts,core,db,auth}`, `tooling/scripts`, `apps/frontend/tests`, `.env.example`, `compose.yaml`, dan `.github/workflows`. Semuanya dibuat sesuai milestone PRD.
