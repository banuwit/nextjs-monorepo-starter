# Struktur folder dan pola coding frontend

Rules ini menjadi acuan agent saat membuat file, folder, dan kode di `apps/frontend/src/`. Isinya menggabungkan struktur target [PRD Tahap 1 §6, §10, §11, §13](../../../apps/frontend/prd.md) dengan kondisi kode yang benar-benar ada. Ikuti juga [panduan repositori](../../../AGENTS.md), [Panduan Preferences](./preferences.md), [Panduan Data Grid](./data-grid.md), dan [Pola halaman CRUD](./crud-pattern.md).

**Keputusan pengguna, 24 Oktober 2026:** setiap fitur memiliki lima folder standar, meskipun masih kosong. Keputusan ini menggantikan ketentuan PRD (§0 butir 4 dan tabel §2 "hanya jika diperlukan") khusus untuk folder fitur. Folder global di luar `features/` tetap dibuat hanya ketika ada file nyata.

Jika kode dan PRD berbeda, ikuti kode yang ada untuk nama folder/route saat ini (lihat [Perbedaan dengan PRD](#perbedaan-kode-saat-ini-dengan-prd)) dan ikuti PRD untuk batas arsitektur yang ditandai **DIKUNCI**.

## Peta `apps/frontend/src/`

```text
src/
├── app/                    # App Router: route, layout, Route Handler
│   ├── (auth)/             # Halaman login tanpa shell dashboard (login-1 … login-5)
│   ├── (backoffice)/       # Halaman dengan shell dashboard; layout.tsx = sidebar/header
│   │   ├── dashboard/  chart/  table/  crud/  playground/  whiteboard/
│   ├── fonts/              # File font lokal untuk Preferences
│   ├── layout.tsx          # Root HTML, font, boot script tema, PreferencesProvider
│   ├── page.tsx            # Redirect root
│   └── globals.css         # Tailwind v4 + token tema
├── features/<fitur>/       # UI dan logika khusus fitur (lima folder standar)
├── components/             # Komponen lintas fitur
│   ├── ui/                 # Primitive shadcn (Base UI)
│   ├── layout/             # Sidebar, header, menubar, multi-sidebar, nav, Preferences
│   ├── crud/               # Empat pola CRUD global (CrudResource, page/dialog/sheet/inline)
│   ├── data-grid/          # DataGridClient / DataGridServer dan bagiannya
│   ├── filter/             # FacetedFilter, SelectBox
│   ├── chart/              # ChartCard, ChartLegendToggle
│   ├── gantt/              # Komponen Gantt bersama
│   ├── app-body.tsx        # Pembungkus konten halaman
│   ├── page-heading.tsx    # Breadcrumb + <h1>
│   └── navigation-breadcrumb.tsx
├── hooks/                  # Hook lintas fitur (use-mobile, use-highlighted-code)
├── lib/                    # Integrasi library: utils.ts (cn), preferences-config.ts, highlighter
├── providers/              # Provider React global (preferences-provider.tsx)
├── mocks/                  # Data contoh frontend-only (*.mock.ts) + hook mock CRUD
├── types/                  # Tipe UI lintas fitur (saat ini kosong)
└── utils/                  # Fungsi murni lintas fitur (saat ini kosong)
```

## Fungsi setiap direktori

| Lokasi                       | Tanggung jawab                                                                                                                        | Tidak boleh berisi                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `src/app/**/page.tsx`        | Entry point tipis: `metadata`, membaca `params`/`searchParams`, lalu merender satu komponen halaman dari `src/features/`.             | UI fitur, state, logika bisnis, query DB, data mock inline             |
| `src/app/**/layout.tsx`      | Tata letak bersama segmen (root: provider/font; `(backoffice)`: shell dashboard).                                                     | Logika fitur, provider Preferences kedua                               |
| `src/app/api/**/route.ts`    | Route Handler REST `/api/v1` (target PRD, belum ada).                                                                                 | Komponen React; logika bisnis inti (milik `packages/core`)             |
| `src/features/*/components/` | Komponen halaman (`*-page.tsx`), form, kolom/tabel fitur, widget, card, renderer, CSS/CSS Module, pemetaan ikon khusus fitur.         | Salinan Data Grid, pola CRUD, atau primitive shadcn                    |
| `src/features/*/hooks/`      | Custom hook fitur (`use-*.ts`). Saat API tersedia: hook TanStack Query yang memanggil `lib/api/endpoints/` dan mengatur invalidation. | Raw `fetch`, SQL/Drizzle, hook lintas fitur                            |
| `src/features/*/schemas/`    | Schema Zod form/UI dan konfigurasi schema editor/dokumen (`*.schema.ts`). Bila API ada, `extend`/`pick` dari `packages/contracts`.    | Sumber aturan request API baru yang menduplikasi contracts             |
| `src/features/*/types/`      | Tipe/interface fitur; tipe hasil schema diturunkan dengan `z.infer`.                                                                  | Duplikat DTO response API                                              |
| `src/features/*/utils/`      | Fungsi murni: formatter, mapper form → payload, reducer, filter, parser, export, konstanta/opsi UI fitur.                             | Komponen React, utilitas umum lintas fitur                             |
| `src/components/ui/`         | Primitive shadcn; ditambah dengan `pnpm dlx shadcn@latest add <nama>` dari `apps/frontend`.                                           | Logika bisnis atau pengetahuan fitur                                   |
| `src/components/<grup>/`     | Komponen generik lintas fitur (`crud`, `data-grid`, `filter`, `chart`, `gantt`, `layout`).                                            | Impor dari `@/features/*` atau `@/mocks/*`; endpoint/resource hardcode |
| `src/hooks/`                 | Hook yang dipakai lebih dari satu fitur.                                                                                              | Hook resource seperti `useUsers`                                       |
| `src/lib/`                   | Integrasi library dan konfigurasi teknis; target PRD: `lib/api/{client,server,errors}.ts` dan `lib/api/endpoints/<resource>.ts`.      | Komponen UI fitur                                                      |
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

- Kelima folder wajib ada di perangkat lokal, termasuk ketika belum memiliki file. Buat langsung di filesystem (`mkdir -p .../{components,hooks,schemas,types,utils}`).
- Jangan membuat `.gitkeep`, file placeholder, atau ekspor kosong untuk mempertahankan folder. Checkout Git baru tidak otomatis membentuk folder kosong, dan pembuatan ulangnya belum diotomatisasi.
- Aturan berlaku untuk fitur utama, subfitur/varian halaman, dan folder induk kelompok fitur. Contoh: `dashboard/`, `dashboard/sales/`, `authentication/`, `authentication/auth-1/`, `table/editable/`, dan `table/editable/sheet/` masing-masing memiliki lima folder tersebut.
- Folder standar tidak perlu memiliki lima subfolder standar lagi. Buat subfolder di dalamnya hanya untuk mengelompokkan file nyata.
- Jangan menaruh modul kode langsung di root fitur atau root kelompok fitur. Dokumen seperti `README.md` dan `LICENSE` boleh berada di root (contoh: `authentication/README.md`, `calendar/LICENSE`).
- Kerangka fitur tanpa halaman seperti `users/`, `menus/`, dan `parameters/` tetap memiliki struktur ini. Keberadaan folder tidak berarti halaman atau fungsinya telah diimplementasikan.

### Hubungan route dan fitur

Satu route biasanya dipetakan ke satu fitur atau subfitur. Nama folder fitur mengikuti segmen route bila memungkinkan:

| Route                                       | Fitur                                                   |
| ------------------------------------------- | ------------------------------------------------------- |
| `/login-1` … `/login-5`                     | `authentication/auth-1` … `auth-5`                      |
| `/dashboard/sales`                          | `dashboard/sales`                                       |
| `/dashboard/ai-chat/float`                  | `ai-chat/float`                                         |
| `/chart/area`                               | `chart/area`                                            |
| `/table/editable/sheet`                     | `table/editable/sheet`                                  |
| `/crud/{new-page,modal,sheet,panel-inline}` | `crud-examples` (satu fitur bersama, varian lewat prop) |
| `/playground/3d-scenes`                     | `scenes-3d`                                             |

### Subfitur dan kode bersama

- Setiap varian halaman memiliki lima folder standar sendiri (misalnya setiap varian login, chart, dan tabel).
- Kode yang dipakai beberapa varian dalam satu kelompok ditempatkan di folder standar milik induk kelompok. Contoh: `authentication/components/credentials-form.tsx`, `ai-chat/hooks/use-chat-thread.ts`, `chart/components/chart-example-page.tsx`, serta `table/editable/{schemas,types,utils}/user-editing*`.
- Kode yang dipakai lintas kelompok fitur dipindahkan ke `src/components/`, `src/hooks/`, `src/types/`, atau `src/utils/`; jangan mengimpor modul internal kelompok lain hanya untuk berbagi helper.
- Empat pola CRUD contoh memakai satu fitur `crud-examples/`; jangan menggandakan komponen untuk setiap route.
- Halaman chart: setiap kartu varian berada di file sendiri `<chart>-<varian>-card.tsx`; `<chart>-chart-page.tsx` hanya menyusun kartu.
- Varian shell/layout baru dibuat di file baru di `src/components/layout/`, bukan dengan menambah percabangan pada komponen shell yang sudah ada.

## Penamaan file dan ekspor

| Jenis                  | Pola                                          | Contoh                                      |
| ---------------------- | --------------------------------------------- | ------------------------------------------- |
| File/folder            | `kebab-case` (kecuali `[id]`, `(group)`)      | `sheet-user-table.tsx`                      |
| Komponen halaman fitur | `<nama>-page.tsx` → `export function XPage`   | `scroll-table-page.tsx` → `ScrollTablePage` |
| Komponen React         | PascalCase, named export                      | `export function InvoicePreview`            |
| Hook                   | `use-<nama>.ts` → `useNama`                   | `use-invoice-export.ts`                     |
| Schema Zod             | `<nama>.schema.ts`, konstanta suffix `Schema` | `invoice.schema.ts` → `invoiceSchema`       |
| Tipe                   | `types/<nama>.ts`, PascalCase                 | `types/invoice.ts` → `Invoice`              |
| Utilitas               | `utils/<nama>.ts`                             | `utils/invoice.ts`                          |
| CSS khusus fitur       | `components/<nama>.css` atau `*.module.css`   | `auth-2/components/login-page.module.css`   |
| Mock                   | `src/mocks/<fitur>[-<varian>].mock.ts`        | `dashboard-sales.mock.ts`                   |

- Gunakan `.ts`/`.tsx` untuk file baru, TypeScript strict, tanpa `any` dan non-null assertion tanpa alasan.
- Hanya `page.tsx`, `layout.tsx`, dan file khusus Next.js lain yang memakai `export default`.
- Komponen di `src/components/` menerima data aplikasi (misalnya user aktif) lewat props dari `src/app/**/layout.tsx` atau fitur, bukan mengimpor `@/mocks/*`. Contoh: `(backoffice)/layout.tsx` memasok `user` ke header dan sidebar.
- Props yang hanya dipakai satu komponen boleh tetap didefinisikan di file komponen tersebut.

## Impor dan batas dependensi

- Di dalam satu fitur/subfitur, gunakan impor relatif (`./invoice-items`, `../utils/invoice`, `../types/invoice`).
- Ke luar fitur atau ke induk kelompok, gunakan alias `@/` (`@/components/...`, `@/features/table/editable/utils/user-editing`, `@/mocks/...`, `@/lib/utils`).
- Impor modul secara langsung; jangan membuat barrel `index.ts` hanya untuk meringkas atau mempertahankan lokasi lama.
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
import { ExampleRecordPage } from "@/features/crud-examples/components/example-record-page";

export const metadata = { title: "Edit parameter contoh | Workspace" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // params/searchParams adalah Promise di Next.js 16
  return <ExampleRecordPage key={id} mode="edit" id={id} />;
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

- Tambahkan `"use client"` hanya pada komponen yang memerlukan state, efek, event handler, atau API browser; jaga komponen halaman tetap Server Component bila tidak perlu.
- Jangan meneruskan callback dari Server Component ke Client Component; kirim data serializable dan definisikan kolom/handler di komponen client fitur.
- Gunakan token tema, radius, dan ukuran `rem` sesuai [Panduan Preferences](./preferences.md); gunakan Data Grid dan CRUD global sesuai [Panduan Data Grid](./data-grid.md).
- Halaman baru di shell dashboard didaftarkan di `src/components/layout/app-navigation.tsx` dan pencarian menu `menu-search-tree.ts`.

## Data: mock sekarang, API kelak

- Semua halaman saat ini memakai data dari `src/mocks/`. Jangan menulis array dummy di komponen atau `page.tsx`; buat/perluas `*.mock.ts` yang bertipe (`satisfies` atau tipe dari `features/*/types`).
- Contoh CRUD menyimpan perubahan di localStorage melalui `mocks/use-crud-data.ts`/`use-crud-examples.ts` dengan aturan Zod di `mocks/crud-model.ts`. Ini pratinjau, bukan otorisasi server; hook ini nanti diganti hook TanStack Query di `features/*/hooks/`.
- Saat API tersedia (milestone PRD), alur wajibnya: `page.tsx → features/<x>/components → features/<x>/hooks/use-<x>.ts → lib/api/endpoints/<x>.ts → lib/api/client.ts → /api/v1/<x>`. Komponen presentasional tetap dipakai; hanya sumber data yang berpindah ke hook.
- Transform form → payload berada di `features/*/utils/`; field UI-only (misalnya konfirmasi password) tidak dikirim ke API.

## Yang tidak dibuat

- `features/*/api/` dan `features/*/patterns/` — endpoint terpusat di `lib/api/endpoints/`, pola CRUD di `components/crud/`.
- `src/constants/`, `src/stores/`, `src/styles/`, `src/validations/`, `src/server/` — jangan dibuat sebagai direktori persiapan. Bila kebutuhan nyata muncul, jelaskan alasannya kepada pengguna.
- Folder global kosong (`src/config/`, `src/lib/api/`, `tests/`) sebelum ada file nyata.
- Paket UI bersama di `packages/` sebelum ada komponen yang benar-benar dibagikan antar-aplikasi.
- Kode Tahap 2/3 di `apps/mobile` atau `apps/backend`.

## Perbedaan kode saat ini dengan PRD

| PRD §6 (target)                                                             | Kode saat ini                                 | Pegangan agent                                                |
| --------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------- |
| Route group `(dashboard)`                                                   | `(backoffice)`                                | Pakai `(backoffice)`                                          |
| `components/layouts/`                                                       | `components/layout/`                          | Pakai `components/layout/`                                    |
| `/login`, `/change-password`                                                | `/login-1` … `/login-5` (pratinjau)           | Ikuti kode; auth nyata menunggu milestone autentikasi         |
| `/users`, `/countries`, `/menus`, dll.                                      | Dihapus; diganti `/crud/*` (amendemen 21 Okt) | Dibuat ulang pada M4–M5 (amendemen 29 Okt); jangan lebih awal |
| `lib/api/`, `providers/query-provider.tsx`, `config/`, `tests/`, `app/api/` | Belum ada                                     | Buat saat milestone terkait dikerjakan, bukan lebih awal      |
| Folder fitur hanya jika diperlukan                                          | Lima folder selalu ada                        | Ikuti keputusan pengguna 24 Oktober 2026                      |

## Langkah saat menambah atau merapikan fitur

1. Tentukan route di `src/app/` dan nama fitur/subfitur yang sesuai; pastikan tidak ada fitur atau komponen global yang sudah memenuhi kebutuhan.
2. Buat kelima folder standar untuk fitur baru, setiap subfitur, dan induk kelompoknya.
3. Buat `components/<nama>-page.tsx` dengan `AppBody` + `PageHeading`, lalu `page.tsx` tipis yang merendernya.
4. Tempatkan schema, tipe, hook, dan utilitas di foldernya; data contoh di `src/mocks/`.
5. Saat memindahkan file, pertahankan nama ekspor, perilaku, validasi, dan batas Server/Client Component; perbarui semua import (route, mock, fitur lain).
6. Daftarkan navigasi di `app-navigation.tsx` dan `menu-search-tree.ts` bila halaman tampil di menu.
7. Periksa tidak ada modul kode di root fitur, impor ke lokasi lama, barrel baru, atau `.gitkeep`.
8. Jalankan `pnpm --filter frontend check-types` dan `pnpm --filter frontend lint` (warning ikut menggagalkan), lalu laporkan hasil sebenarnya. Untuk perubahan perilaku, cek manual di dev server karena test runner belum dikonfigurasi.
