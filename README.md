# nextjs-monorepo-starter

Monorepo Turborepo + pnpm untuk starter backoffice. Saat ini hanya `apps/frontend` (Next.js) yang berisi kode; semua halaman memakai data contoh frontend-only tanpa API atau database.

## Spesifikasi produk

Spesifikasi dibagi per tahap:

- [PRD Tahap 1 — frontend](apps/frontend/prd.md): spesifikasi yang disetujui untuk `app-monorepo-starter`. Dokumen ini menjelaskan arsitektur target dan milestone, bukan fitur yang sudah tersedia.
- [PRD Tahap 2 — mobile](apps/mobile/prd.md) dan [PRD Tahap 3 — backend](apps/backend/prd.md): masih roadmap, belum diimplementasikan.

Panduan untuk agen AI ada di [AGENTS.md](AGENTS.md) (`CLAUDE.md` merupakan symlink ke file ini), dengan rules area di [.agents/rules/](.agents/rules/).

## Isi repositori

| Workspace                    | Isi                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `apps/frontend`              | Aplikasi Next.js (`frontend`), berjalan di port 3000                                 |
| `apps/mobile`                | Hanya `prd.md` (Tahap 2)                                                             |
| `apps/backend`               | Hanya `prd.md` (Tahap 3)                                                             |
| `packages/eslint-config`     | Konfigurasi ESLint bersama (`@repo/eslint-config`), termasuk plugin Next.js/Prettier |
| `packages/typescript-config` | `tsconfig` bersama (`@repo/typescript-config`)                                       |

Stack utama: Next.js 16, React 19, Tailwind CSS v4, shadcn/ui (Base UI), Zod 4, TanStack Table v9, TypeScript 7, ESLint 10, dan Prettier.

## Memulai

Prasyarat: Node.js 24 atau lebih baru dan pnpm 11 (`packageManager: pnpm@11.25.0`).

```sh
pnpm install
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000), lalu `/dashboard` untuk melihat shell backoffice.

## Skrip

Jalankan dari root repositori:

| Perintah           | Fungsi                                                   |
| ------------------ | -------------------------------------------------------- |
| `pnpm dev`         | `turbo run dev` untuk semua aplikasi                     |
| `pnpm build`       | `turbo run build`                                        |
| `pnpm lint`        | `turbo run lint` (frontend memakai `--max-warnings 0`)   |
| `pnpm check-types` | `turbo run check-types` (`next typegen && tsc --noEmit`) |
| `pnpm format`      | Prettier untuk `**/*.{ts,tsx,md}` — menulis ulang file   |

Untuk frontend saja: `pnpm --filter frontend <dev|build|lint|check-types>`. Test runner, skrip database, dan `pnpm typecheck` masih merupakan target PRD dan belum dikonfigurasi; verifikasi dengan check-types, lint, build, dan pemeriksaan manual di dev server.

## Frontend

### Struktur

- `src/app/` — route, layout, dan Route Handler. `page.tsx` tipis dan merender komponen dari `src/features/`.
- `src/features/<fitur>/` — UI dan logika khusus fitur, masing-masing dengan lima folder standar `components/`, `hooks/`, `schemas/`, `types/`, `utils/`.
- `src/components/` — komponen lintas fitur: `ui/` (primitive shadcn), `layout/`, `crud/`, `data-grid/`, `filter/`, `chart/`, `gantt/`.
- `src/mocks/` — data contoh bertipe (`*.mock.ts`) dan hook mock CRUD berbasis localStorage.

Aturan lengkap: [Struktur folder](.agents/rules/frontend/structure-folder.md). Tambahkan primitive shadcn dengan `pnpm dlx shadcn@latest add <nama-komponen>` dari `apps/frontend`.

### Halaman yang tersedia

| Grup       | Route                                                                                                                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login      | `/login-1` … `/login-5` (pratinjau UI, belum ada autentikasi)                                                                                                                                                     |
| Dashboard  | `/dashboard/{main,sales,crm,finance,productivity}`, serta aplikasi contoh: AI chat (`float`, `page`, `panel`), calendar, file manager, flow process/structure, invoice, profile, project, receipt, task, timeline |
| Chart      | `/chart/*` — 21 jenis chart (area, bar, line, pie, sankey, treemap, waterfall, dll.)                                                                                                                              |
| Table      | `/table/base`, `column`, `scroll`, `drag-and-drop/{row,column}`, `editable/{inline,row,sheet}`, `group/{expansion,section,tree}`                                                                                  |
| CRUD       | `/crud/{new-page,modal,sheet,panel-inline}` — empat pola CRUD dengan satu sumber data                                                                                                                             |
| Playground | `/playground/{3d-scenes,invoice,notes,rich-text-editor,wizard}`, `/whiteboard`                                                                                                                                    |

Menu navigasi didefinisikan di [app-navigation.tsx](apps/frontend/src/components/layout/app-navigation.tsx) dan pencarian menu di [menu-search-tree.ts](apps/frontend/src/components/layout/menu-search-tree.ts).

### Shell backoffice

[Layout backoffice](<apps/frontend/src/app/(backoffice)/layout.tsx>) merender sidebar, header, dan pembungkus gaya Multi untuk setiap route backoffice. Setiap halaman memakai [AppBody](apps/frontend/src/components/app-body.tsx) sebagai pembungkus konten dan [PageHeading](apps/frontend/src/components/page-heading.tsx) untuk breadcrumb serta `<h1>` (`parents` untuk induk bertaut, `children` untuk teks/badge di bawah judul).

### Komponen global

- **CRUD** — `CrudResource` memilih pola `page`, `dialog`, `sheet`, atau `inline` lewat prop `pattern`; fitur memasok data, kolom, form, dan aksi simpan/hapus. Lihat [Pola halaman CRUD](.agents/rules/frontend/crud-pattern.md).
- **Data Grid** — `DataGridClient` untuk data lokal dan `DataGridServer` untuk daftar REST (query di URL). Mendukung sort, filter, pin, DnD baris/kolom, inline/sheet editing, grouping, tree, dan virtual scroll. Lihat [Panduan Data Grid](.agents/rules/frontend/data-grid.md).

### Preferences tampilan

Tombol **Preferences** di header membuka popover untuk mengatur Font (Geist, Inter, Nunito, Roboto, DM Sans, Poppins, Raleway), Primary Color, Sidebar Color, Header Color, App Body Color, Page Layout (Centered/Full Width), Sidebar Style (Sidebar, Inset, Floating, Header, Multi), Border Radius, dan Scale. Tombol ikon tema mengganti mode terang/gelap.

Default dan flag diatur di [preferences-config.ts](apps/frontend/src/lib/preferences-config.ts):

- `showPreferences` — menampilkan/menyembunyikan tombol Preferences.
- `persistToCookie` — menyimpan font, layout, gaya sidebar, radius, dan scale ke cookie. Keempat warna tidak pernah disimpan; tema selalu disimpan ke cookie `app_theme`.

Font dilayani lokal melalui `next/font/local` dengan lisensi OFL di [fonts](apps/frontend/src/app/fonts/). Detail perilaku dan kasus verifikasi: [Panduan Preferences](.agents/rules/frontend/preferences.md).

### Data

Belum ada API atau database. Halaman memakai fixture di `src/mocks/`; contoh CRUD menyimpan perubahan di localStorage dengan validasi Zod di `crud-model.ts`. Ini hanya pratinjau, bukan otorisasi server. Hook mock tersebut nantinya diganti hook TanStack Query dan endpoint terpusat sesuai PRD.

## Turborepo

Konfigurasi task ada di [turbo.json](turbo.json) (`build`, `lint`, `check-types` dengan dependensi `^`, dan `dev` persisten tanpa cache). Sebelum mengubah konfigurasi atau perintah Turborepo, baca dokumentasi paket `turbo` yang terpasang (`node_modules/turbo/docs/`). Referensi: [Running tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks), [Caching](https://turborepo.dev/docs/crafting-your-repository/caching), [Configuration](https://turborepo.dev/docs/reference/configuration).
