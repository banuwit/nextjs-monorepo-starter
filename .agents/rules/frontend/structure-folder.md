# Standar struktur folder frontend

Dokumen ini adalah standar struktur folder aplikasi Next.js di `apps/frontend/src/`, dipakai bersama antar-tim agar setiap project memiliki susunan yang **identik** dengan repo acuan `nextjs-monorepo-starter`. Level monorepo (root, `apps/`, `packages/`) diatur di [Standar struktur folder monorepo](../structure-monorepo.md). Ikuti juga [panduan repositori](../../../AGENTS.md), [Panduan Preferences](./preferences.md), [Panduan Data Grid](./data-grid.md), [Panduan komponen Filter](./filter.md), dan [Pola halaman CRUD](./crud-pattern.md).

- **Wajib**: folder/file harus ada di semua project.
- **Saat dibutuhkan**: dibuat hanya ketika fiturnya dikerjakan, tetapi nama dan lokasinya harus mengikuti standar ini.

Jika kode dan PRD berbeda, ikuti standar ini untuk nama folder/route dan ikuti PRD untuk batas arsitektur yang ditandai **DIKUNCI**.

## Struktur standar

```text
apps/frontend/src/
├── app/                        # Wajib. App Router: route, layout, Route Handler
│   ├── layout.tsx              # Wajib. Root HTML, font, boot script tema, PreferencesProvider
│   ├── page.tsx                # Wajib. Redirect root
│   ├── globals.css             # Wajib. Tailwind v4 + token tema
│   ├── favicon.ico, icon.svg, apple-icon.png   # Wajib. Ikon aplikasi (konvensi file Next.js)
│   ├── fonts/                  # Wajib. File font lokal untuk Preferences
│   ├── (auth)/                 # Wajib. Halaman tanpa shell dashboard (login)
│   ├── (backoffice)/           # Wajib. Halaman dengan shell dashboard
│   │   ├── layout.tsx          # Wajib. Sidebar, header, pembungkus multi-sidebar
│   │   ├── (page)/             # Wajib. Section sidebar "Page"
│   │   ├── (playground)/       # Saat dibutuhkan. Section sidebar "Playground"
│   │   ├── (documentation)/    # Saat dibutuhkan. Section sidebar "Documentation"
│   │   └── (account)/          # Wajib. Halaman menu akun di luar sidebar (profile, change-password)
│   └── api/v1/<resource>/route.ts   # Saat dibutuhkan. Route Handler REST
│
├── features/                   # Wajib. UI dan logika khusus fitur
│   └── <fitur>/                # Satu folder per halaman (lihat "Struktur wajib fitur")
│       ├── components/
│       ├── hooks/
│       ├── schemas/
│       ├── types/
│       └── utils/
│
├── components/                 # Wajib. Komponen lintas fitur
│   ├── ui/                     # Wajib. Primitive shadcn (Base UI)
│   ├── layout/                 # Wajib. Sidebar, header, menubar, multi-sidebar, nav, menu search, Preferences
│   ├── app-body.tsx            # Wajib. Pembungkus konten halaman
│   ├── app-logo.tsx            # Wajib. Logo aplikasi
│   ├── page-heading.tsx        # Wajib. Breadcrumb + <h1>
│   ├── navigation-breadcrumb.tsx   # Wajib
│   ├── crud/                   # Saat dibutuhkan. Empat pola CRUD global
│   ├── data-grid/              # Saat dibutuhkan. DataGridClient / DataGridServer
│   ├── filter/                 # Saat dibutuhkan. Filter toolbar, advanced/, group/
│   ├── reui/                   # Saat dibutuhkan. Kode vendor ReUI (jangan diedit manual)
│   ├── chart/                  # Saat dibutuhkan. ChartCard, ChartLegendToggle
│   ├── gantt/                  # Saat dibutuhkan
│   └── map/                    # Saat dibutuhkan. Tema MapLibre
│
├── hooks/                      # Wajib. Hook lintas fitur (use-mobile, …)
├── lib/                        # Wajib. Integrasi library: utils.ts (cn), preferences-config.ts
│   └── api/                    # Saat dibutuhkan. client.ts, server.ts, errors.ts, endpoints/<resource>.ts
├── providers/                  # Wajib. Provider React global (preferences-provider.tsx)
├── mocks/                      # Saat dibutuhkan. Data contoh frontend-only (<fitur>.mock.ts) + hook mock CRUD
├── types/                      # Wajib. Tipe UI lintas fitur (boleh kosong)
└── utils/                      # Wajib. Fungsi murni lintas fitur (boleh kosong)
```

## Fungsi setiap direktori

| Lokasi                       | Tanggung jawab                                                                                                                        | Tidak boleh berisi                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `src/app/**/page.tsx`        | Entry point tipis: `metadata`, membaca `params`/`searchParams`, lalu merender satu komponen halaman dari `src/features/`.             | UI fitur, state, logika bisnis, query DB, data mock inline             |
| `src/app/**/layout.tsx`      | Tata letak bersama segmen (root: provider/font; `(backoffice)`: shell dashboard).                                                     | Logika fitur, provider Preferences kedua                               |
| `src/app/api/**/route.ts`    | Route Handler REST `/api/v1`.                                                                                                         | Komponen React; logika bisnis inti (milik `packages/core`)             |
| `src/features/*/components/` | Komponen halaman (`*-page.tsx`), form, kolom/tabel fitur, widget, card, renderer, CSS/CSS Module, pemetaan ikon khusus fitur.         | Salinan Data Grid, pola CRUD, atau primitive shadcn                    |
| `src/features/*/hooks/`      | Custom hook fitur (`use-*.ts`). Saat API tersedia: hook TanStack Query yang memanggil `lib/api/endpoints/` dan mengatur invalidation. | Raw `fetch`, SQL/Drizzle, hook lintas fitur                            |
| `src/features/*/schemas/`    | Schema Zod form/UI dan konfigurasi schema editor/dokumen (`*.schema.ts`). Bila API ada, `extend`/`pick` dari `packages/contracts`.    | Sumber aturan request API baru yang menduplikasi contracts             |
| `src/features/*/types/`      | Tipe/interface fitur; tipe hasil schema diturunkan dengan `z.infer`.                                                                  | Duplikat DTO response API                                              |
| `src/features/*/utils/`      | Fungsi murni: formatter, mapper form → payload, reducer, filter, parser, export, konstanta/opsi UI fitur.                             | Komponen React, utilitas umum lintas fitur                             |
| `src/components/ui/`         | Primitive shadcn; ditambah dengan `pnpm dlx shadcn@latest add <nama>` dari `apps/frontend`.                                           | Logika bisnis atau pengetahuan fitur                                   |
| `src/components/<grup>/`     | Komponen generik lintas fitur (`crud`, `data-grid`, `filter`, `chart`, `gantt`, `layout`, `map`); `reui/` khusus kode vendor ReUI.    | Impor dari `@/features/*` atau `@/mocks/*`; endpoint/resource hardcode |
| `src/hooks/`                 | Hook yang dipakai lebih dari satu fitur.                                                                                              | Hook resource seperti `useUsers`                                       |
| `src/lib/`                   | Integrasi library dan konfigurasi teknis; `lib/api/{client,server,errors}.ts` dan `lib/api/endpoints/<resource>.ts` saat API ada.     | Komponen UI fitur                                                      |
| `src/providers/`             | Provider React global.                                                                                                                | Persistensi domain; provider/state Preferences duplikat                |
| `src/types/`, `src/utils/`   | Tipe UI dan fungsi murni yang dipakai lintas fitur.                                                                                   | Duplikat DTO contracts; klien auth/session/network                     |
| `src/mocks/`                 | Data contoh bertipe untuk halaman frontend-only (`<nama>.mock.ts`) dan hook mock CRUD (`use-crud-data.ts`, `use-crud-examples.ts`).   | Pengganti diam-diam API untuk resource yang wajib memakai DB           |

## Struktur wajib fitur

```text
apps/frontend/src/features/<fitur>/
├── components/
├── hooks/
├── schemas/
├── types/
└── utils/
```

- Kelima folder wajib ada di setiap folder halaman (fitur daun yang memiliki route sendiri), termasuk ketika belum memiliki file. Buat langsung di filesystem (`mkdir -p .../{components,hooks,schemas,types,utils}`). Keputusan pengguna, 24 Oktober 2026, diubah 30 Oktober 2026; menggantikan ketentuan PRD §0 butir 4 dan tabel §2 khusus untuk folder halaman fitur.
- Jangan membuat `.gitkeep`, file placeholder, atau ekspor kosong untuk mempertahankan folder. Checkout Git baru tidak otomatis membentuk folder kosong; periksa kelengkapan lima folder setiap kali menyentuh fitur dan lengkapi dengan `mkdir -p` bila ada yang hilang.
- Aturan berlaku untuk folder terakhir yang menjadi halaman: fitur tingkat atas tanpa subfitur dan setiap subfitur/varian halaman (mis. `calendar/`, `dashboard/sales/`, `authentication/auth-1/`, `table/editable/sheet/`, `crud/modal/`). Folder induk kelompok (`dashboard/`, `authentication/`, `table/`, `crud/`, `chart/`, `ai-chat/`, …) tidak boleh berisi folder standar; isinya hanya folder halaman anak dan dokumen seperti `README.md`.
- Folder standar tidak perlu memiliki lima subfolder standar lagi. Buat subfolder di dalamnya hanya untuk mengelompokkan file nyata.
- Jangan menaruh modul kode langsung di root fitur atau root kelompok fitur. Dokumen seperti `README.md` dan `LICENSE` boleh berada di root.
- Kerangka fitur tanpa halaman (belum berisi file dan belum memiliki route) tetap memiliki struktur ini. Keberadaan folder tidak berarti halaman atau fungsinya telah diimplementasikan.

## Aturan struktur

### Route group `(backoffice)` mengikuti sidebar

- Setiap `page.tsx` di `(backoffice)` berada di route group yang sama dengan section sidebar tempat menunya tampil di `components/layout/app-navigation.tsx`: `(page)`, `(playground)`, `(documentation)`. Halaman dari menu akun yang tidak ada di sidebar (`nav-user.tsx`) masuk `(account)`. Route group tidak masuk URL.
- Di dalam group, menu induk dengan submenu menjadi folder induk dengan anak per submenu (`(page)/dashboard/{main,sales,…}`, `(page)/ai-chat/{page,panel,float}`); menu tanpa submenu menjadi folder sendiri sejajar menu lain (`(page)/ai-usage`, `(playground)/wizard`). URL-nya `/dashboard/main`, `/ai-chat/page`, `/ai-usage`, `/wizard`.
- Saat menambah atau memindahkan menu antar-section, pindahkan juga foldernya ke group section tujuan, sejajar menu lain di group itu. Mengubah segmen URL halaman yang sudah ada harus atas permintaan pengguna.
- Satu URL hanya boleh dimiliki satu group; segmen yang sama (mis. `dashboard/`) boleh ada di beberapa group.
- Jangan menambah `layout.tsx` di group ini hanya untuk pengelompokan; shell tetap di `(backoffice)/layout.tsx`.
- Urutan menu level atas di `app-navigation.tsx` alfabetis per section (tanpa memperhatikan huruf besar-kecil); pengecualiannya Dashboard selalu pertama di Page. Di submenu Dashboard, Main selalu pertama dan sisanya alfabetis; submenu lain mempertahankan urutan yang ada. Menu baru disisipkan sesuai abjad.
- Keputusan pengguna, 6 November 2026: hanya `src/app/` yang dikelompokkan per section; `src/features/` tidak.

### Hubungan route dan fitur

- Satu route dipetakan ke satu fitur atau subfitur. Nama folder fitur sama dengan segmen route (`/calendar` → `features/calendar`, `/table/editable/sheet` → `features/table/editable/sheet`, `/login-1` → `features/authentication/auth-1`).
- Dashboard analitik (`/dashboard/<nama>`) berada di kelompok `features/dashboard/<nama>` dengan mock `dashboard-<nama>.mock.ts` dan file halaman `<nama>-dashboard-page.tsx`. Halaman aplikasi lain (`/calendar`, `/project`, `/task`, `/profile`, …) memakai folder fitur tingkat atas tanpa awalan `dashboard/`.
- Nama fitur tidak diberi awalan kelompok visual (mis. `timeline-`, `flow-`); gunakan nama pendek yang sama dengan segmen route, dan pakai nama itu juga untuk judul menu, file halaman, mock (`<fitur>.mock.ts`), dan CSS fitur. Saat sebuah halaman diganti nama, ganti serentak menu, route, folder fitur, nama file, identifier, dan mock-nya.

### Subfitur dan kode bersama

- Setiap varian halaman memiliki lima folder standar sendiri (setiap varian login, chart, tabel, CRUD, filter, dashboard).
- Kode yang dipakai beberapa varian dalam satu kelompok **disalin** ke folder standar masing-masing halaman anak dan diimpor secara relatif; induk kelompok tidak menampung kode bersama. Keputusan pengguna, 29–30 Oktober 2026. Perubahan pada satu salinan perlu diterapkan ke salinan lain bila perilakunya harus sama.
- Kode yang dipakai lintas kelompok fitur dipindahkan ke `src/components/`, `src/hooks/`, `src/types/`, atau `src/utils/`; jangan mengimpor modul internal kelompok lain hanya untuk berbagi helper.
- Sumber data mock yang sama boleh dipakai beberapa subfitur (contoh: empat pola `/crud/*` memakai satu set mock).
- Halaman chart: setiap kartu varian berada di file sendiri `<chart>-<varian>-card.tsx`; `<chart>-chart-page.tsx` hanya menyusun kartu.
- Varian shell/layout baru dibuat di file baru di `src/components/layout/`, bukan dengan menambah percabangan pada komponen shell yang sudah ada.

### Yang tidak dibuat

- `features/*/api/` dan `features/*/patterns/` — endpoint terpusat di `lib/api/endpoints/`, pola CRUD di `components/crud/`.
- `src/constants/`, `src/stores/`, `src/styles/`, `src/validations/`, `src/server/` — tidak dibuat sebagai direktori persiapan. Bila kebutuhan nyata muncul, jelaskan alasannya kepada pengguna.
- Folder global kosong bertanda _Saat dibutuhkan_ (`src/lib/api/`, `src/app/api/`, `tests/`) sebelum ada file nyata.
- Barrel `index.ts` untuk meringkas atau mempertahankan lokasi lama.
- Paket UI bersama di `packages/` sebelum ada komponen yang benar-benar dibagikan antar-aplikasi.

## Penamaan file dan ekspor

| Jenis                  | Pola                                          | Contoh                                           |
| ---------------------- | --------------------------------------------- | ------------------------------------------------ |
| File/folder            | `kebab-case` (kecuali `[id]`, `(group)`)      | `sheet-user-table.tsx`                           |
| Komponen halaman fitur | `<nama>-page.tsx` → `export function XPage`   | `scroll-table-page.tsx` → `ScrollTablePage`      |
| Komponen React         | PascalCase, named export                      | `export function DraftPreviewPreview`            |
| Hook                   | `use-<nama>.ts` → `useNama`                   | `use-draft-preview-export.ts`                    |
| Schema Zod             | `<nama>.schema.ts`, konstanta suffix `Schema` | `draft-preview.schema.ts` → `draftPreviewSchema` |
| Tipe                   | `types/<nama>.ts`, PascalCase                 | `types/draft-preview.ts` → `DraftPreview`        |
| Utilitas               | `utils/<nama>.ts`                             | `utils/draft-preview.ts`                         |
| CSS khusus fitur       | `components/<nama>.css` atau `*.module.css`   | `auth-2/components/login-page.module.css`        |
| Mock                   | `src/mocks/<fitur>[-<varian>].mock.ts`        | `dashboard-sales.mock.ts`                        |

- Gunakan `.ts`/`.tsx` untuk file baru, TypeScript strict, tanpa `any` dan non-null assertion tanpa alasan.
- Hanya `page.tsx`, `layout.tsx`, dan file khusus Next.js lain yang memakai `export default`.
- Komponen di `src/components/` menerima data aplikasi (misalnya user aktif) lewat props dari `src/app/**/layout.tsx` atau fitur, bukan mengimpor `@/mocks/*`.
- Props yang hanya dipakai satu komponen boleh tetap didefinisikan di file komponen tersebut.

## Impor dan batas dependensi

- Di dalam satu fitur/subfitur, gunakan impor relatif (`./draft-preview-items`, `../utils/draft-preview`, `../types/draft-preview`).
- Ke luar fitur, gunakan alias `@/` (`@/components/...`, `@/mocks/...`, `@/lib/utils`). Jangan mengimpor modul internal halaman lain.
- Dependensi tipe memakai `import type`; jaga agar dependensi runtime tidak melingkar.
- Arah yang diizinkan:

```text
app/**/page.tsx → features/* → components/*, hooks/, lib/, mocks/ (selama belum ada API)
features/*      → lib/api/endpoints/* → lib/api/client.ts → /api/v1   (target PRD)
mocks/*         → features/*/types (hanya import type)
components/*    → components/ui, lib/, hooks/   (tidak ke features/ atau mocks/)
```

- `components/crud/` dan `components/data-grid/` tidak boleh mengenal resource tertentu; adapter data, kolom, dan form dipasok oleh fitur.
- UI tidak pernah mengimpor Drizzle/repository DB, session secret, atau konfigurasi server.

## Pola kode halaman

**Route entry (`src/app/(backoffice)/.../page.tsx`)** — Server Component tipis:

```tsx
import { NewPageRecordPage } from "@/features/crud/new-page/components/new-page-record-page";

export const metadata = { title: "Edit parameter contoh | Workspace" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // params/searchParams adalah Promise di Next.js 16
  return <NewPageRecordPage key={id} mode="edit" id={id} />;
}
```

**Komponen halaman fitur (`components/<nama>-page.tsx`)** — membungkus konten dengan `AppBody` dan `PageHeading`:

```tsx
import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { ScrollUserTable } from "./scroll-user-table";

export function ScrollTablePage() {
  return (
    <AppBody>
      <PageHeading title="Scroll" currentPage="Scroll" />
      <ScrollUserTable />
    </AppBody>
  );
}
```

- Setiap `page.tsx` yang dapat dikunjungi mengekspor `metadata: Metadata` dengan `title` berformat `<Nama> | <Bagian>` (`Dashboard`, `Playground`, atau `Workspace`; chart, table, dan CRUD memakai `<Bagian> · <Varian> | Workspace`) serta satu kalimat `description`. Halaman yang hanya `redirect` tidak memerlukannya.
- Tambahkan `"use client"` hanya pada komponen yang memerlukan state, efek, event handler, atau API browser; jaga komponen halaman tetap Server Component bila tidak perlu.
- Jangan meneruskan callback dari Server Component ke Client Component; kirim data serializable dan definisikan kolom/handler di komponen client fitur.
- Gunakan token tema, radius, dan ukuran `rem` sesuai [Panduan Preferences](./preferences.md); gunakan Data Grid dan CRUD global sesuai [Panduan Data Grid](./data-grid.md).
- Halaman baru di shell dashboard didaftarkan di `components/layout/app-navigation.tsx`; pencarian menu (`menu-search-tree.ts`) mengikuti otomatis.

## Data: mock sekarang, API kelak

- Selama belum ada API, semua halaman memakai data dari `src/mocks/`. Jangan menulis array dummy di komponen atau `page.tsx`; buat/perluas `*.mock.ts` yang bertipe (`satisfies` atau tipe dari `features/*/types`).
- Contoh CRUD menyimpan perubahan di localStorage melalui `mocks/use-crud-data.ts`/`use-crud-examples.ts` dengan aturan Zod di `mocks/crud-model.ts`. Ini pratinjau, bukan otorisasi server; hook ini nanti diganti hook TanStack Query di `features/*/hooks/`.
- Saat API tersedia (milestone PRD), alur wajibnya: `page.tsx → features/<x>/components → features/<x>/hooks/use-<x>.ts → lib/api/endpoints/<x>.ts → lib/api/client.ts → /api/v1/<x>`. Komponen presentasional tetap dipakai; hanya sumber data yang berpindah ke hook.
- Transform form → payload berada di `features/*/utils/`; field UI-only (misalnya konfirmasi password) tidak dikirim ke API.

## Langkah saat menambah atau merapikan fitur

1. Tentukan route di `src/app/` (group sesuai section sidebar) dan nama fitur/subfitur yang sesuai; pastikan tidak ada fitur atau komponen global yang sudah memenuhi kebutuhan.
2. Buat kelima folder standar untuk fitur halaman baru dan setiap subfitur halaman. Jangan membuatnya di induk kelompok.
3. Buat `components/<nama>-page.tsx` dengan `AppBody` + `PageHeading`, lalu `page.tsx` tipis yang merendernya.
4. Tempatkan schema, tipe, hook, dan utilitas di foldernya; data contoh di `src/mocks/`.
5. Saat memindahkan atau mengganti nama file, pertahankan nama ekspor, perilaku, validasi, dan batas Server/Client Component; perbarui semua import (route, mock, fitur lain).
6. Daftarkan navigasi di `app-navigation.tsx` bila halaman tampil di menu, sesuai urutan alfabetis section-nya.
7. Periksa tidak ada modul kode di root fitur, impor ke lokasi lama, barrel baru, atau `.gitkeep`.
8. Jalankan `pnpm --filter frontend check-types` dan `pnpm --filter frontend lint` (warning ikut menggagalkan), lalu laporkan hasil sebenarnya. Untuk perubahan perilaku, cek manual di dev server karena test runner belum dikonfigurasi.

## Checklist kesesuaian

- [ ] Semua folder/file bertanda _Wajib_ ada dengan nama yang sama.
- [ ] Setiap `page.tsx` di `(backoffice)` berada di group yang sesuai section sidebar-nya; tidak ada `layout.tsx` tambahan di group.
- [ ] Setiap folder halaman fitur memiliki lima folder standar; induk kelompok tidak memilikinya; tidak ada `.gitkeep`.
- [ ] Tidak ada folder di luar standar (`constants/`, `stores/`, `styles/`, `validations/`, `server/`, `features/*/api/`, `features/*/patterns/`).
- [ ] Tidak ada impor `components/* → features/*` atau `components/* → mocks/*`, dan tidak ada barrel `index.ts` baru.
- [ ] Nama menu, segmen route, folder fitur, file, dan mock memakai nama yang sama.
- [ ] Menu di `app-navigation.tsx` urut alfabetis per section (Dashboard/Main sebagai pengecualian).

## Status repo acuan (`nextjs-monorepo-starter`)

Bagian ini hanya untuk repo acuan; jangan disalin ke project lain.

- Isi `(backoffice)` saat ini:
  - `(page)/`: `dashboard/{main,academy,crm,finance,healthcare,hospitality,human-resource,logistics,manufacture,productivity,sales,zoo}` (`dashboard/page.tsx` me-re-export `main`), `access-management/`, `activity/`, `ai-chat/{page,panel,float}`, `ai-usage/`, `calendar/`, `checkout/`, `invoice/`, `leads/`, `product/`, `project/`, `receipt/`, `task/`, `workflow/`.
  - `(playground)/`: `compare/`, `draft-preview/`, `file-manager/`, `live-document/`, `map-delivery/`, `map-location/`, `notes/`, `process/`, `rich-text-editor/`, `scenes-3d/`, `structure/`, `whiteboard/`, `wizard/`.
  - `(documentation)/`: `chart/*`, `crud/*`, `filter/*`, `table/*` — masih memakai segmen URL lama (`/chart/area`, `/crud/modal`, …).
  - `(account)/`: `profile/`, `change-password/`.
  - `(auth)/`: `login-1` … `login-5` → `features/authentication/auth-1` … `auth-5`.
- Pengecualian nama yang dipertahankan: route `/notes` memakai fitur `note`.
- Kelompok yang menyalin kode per varian: `chart/<varian>`, `ai-chat/{float,page,panel}`, `table/editable/{inline,row,sheet}`, `crud/{new-page,modal,sheet,panel-inline}` (satu set mock bersama), `filter/{base,advance,group,sidebar}` (`filter/sidebar` memakai `filter-sidebar.mock.ts`), dan `dashboard/<nama>` (helper `kpi-strip`, `sparkline`, `trend-delta`, `status-badge`, `types/dashboard.ts`).
- Kerangka fitur tanpa halaman: `user/`, `payment-slip/`.
- Folder global yang sudah ada selain yang Wajib: `components/{crud,data-grid,filter,reui,chart,gantt,map}`, `src/utils/{editor-link,editor-shortcut}.ts`, `lib/{highlighter.tsx,maplibre.ts}`, `mocks/`.
- Belum ada (dibuat sesuai milestone PRD): `app/api/`, `lib/api/`, `providers/query-provider.tsx`, `tests/`. Halaman resource `/users`, `/countries`, `/menus`, dll. dibuat ulang pada M4–M5 (amendemen 29 Oktober 2026); sebelum itu `/crud/*` tetap demo mock. Login nyata menunggu milestone autentikasi; `/login-*` dan `/change-password` masih pratinjau UI.
- Perbedaan dengan PRD §6 yang disengaja: route group `(backoffice)` (bukan `(dashboard)`), `components/layout/` (bukan `components/layouts/`), lima folder selalu ada di folder halaman (bukan "hanya jika diperlukan").
