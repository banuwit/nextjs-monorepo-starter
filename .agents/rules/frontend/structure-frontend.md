# Struktur folder dan pola coding frontend

Rules ini menjadi acuan agent saat membuat file, folder, dan kode di `apps/frontend/src/`. Isinya menggabungkan struktur target [PRD Tahap 1 §6, §10, §11, §13](../../../apps/frontend/prd.md) dengan kondisi kode yang benar-benar ada. Ikuti juga [panduan repositori](../../../AGENTS.md), [Panduan Preferences](./preferences.md), [Panduan Data Grid](./data-grid.md), dan [Pola halaman CRUD](./crud-pattern.md).

**Keputusan pengguna, 24 Oktober 2026, diubah 30 Oktober 2026:** setiap fitur yang merupakan halaman (daun, memiliki route sendiri) memiliki lima folder standar, meskipun masih kosong. Folder induk kelompok fitur tidak boleh memiliki folder standar sama sekali; kode yang dipakai beberapa halaman anak disalin ke setiap halaman anak. Keputusan ini menggantikan ketentuan PRD (§0 butir 4 dan tabel §2 "hanya jika diperlukan") khusus untuk folder halaman fitur. Folder global di luar `features/` tetap dibuat hanya ketika ada file nyata.

Jika kode dan PRD berbeda, ikuti kode yang ada untuk nama folder/route saat ini (lihat [Perbedaan dengan PRD](#perbedaan-kode-saat-ini-dengan-prd)) dan ikuti PRD untuk batas arsitektur yang ditandai **DIKUNCI**.

## Peta `apps/frontend/src/`

```text
src/
├── app/                    # App Router: route, layout, Route Handler
│   ├── (auth)/             # Halaman login tanpa shell dashboard (login-1 … login-5)
│   ├── (backoffice)/       # Halaman dengan shell dashboard; layout.tsx = sidebar/header
│   │   ├── (page)/          # section sidebar "Page": dashboard/, access-management/, activity/, ai-chat/, ai-usage/, calendar/, checkout/, invoice/, leads/, product/, project/, receipt/, task/, workflow/
│   │   ├── (playground)/    # section "Playground": compare/, draft-preview/, file-manager/, live-document/, map-delivery/, map-location/, notes/, process/, rich-text-editor/, scenes-3d/, structure/, whiteboard/, wizard/
│   │   ├── (documentation)/ # section "Documentation": chart/  crud/  filter/  table/
│   │   └── (account)/       # halaman menu akun di luar sidebar: profile/, change-password/
│   ├── fonts/              # File font lokal untuk Preferences
│   ├── layout.tsx          # Root HTML, font, boot script tema, PreferencesProvider
│   ├── page.tsx            # Redirect root
│   ├── globals.css         # Tailwind v4 + token tema
│   └── favicon.ico, icon.svg, apple-icon.png   # Ikon aplikasi (konvensi file Next.js)
├── features/<fitur>/       # UI dan logika khusus fitur (lima folder standar di folder halaman)
├── components/             # Komponen lintas fitur
│   ├── ui/                 # Primitive shadcn (Base UI)
│   ├── layout/             # Sidebar, header, menubar, multi-sidebar, nav, menu search, Preferences
│   ├── crud/               # Empat pola CRUD global (CrudResource, page/dialog/sheet/inline)
│   ├── data-grid/          # DataGridClient / DataGridServer dan bagiannya
│   ├── filter/             # SearchFilter, SelectFilter, ComboboxFilter, FacetedFilter, advanced/, group/
│   ├── reui/               # Kode vendor ReUI (filters, cascader); lihat Panduan komponen Filter
│   ├── chart/              # ChartCard, ChartLegendToggle
│   ├── gantt/              # Komponen Gantt bersama
│   ├── map/                # maplibre-theme.css untuk peta MapLibre (map-delivery, map-location)
│   ├── app-body.tsx        # Pembungkus konten halaman
│   ├── app-logo.tsx        # Logo aplikasi
│   ├── page-heading.tsx    # Breadcrumb + <h1>
│   └── navigation-breadcrumb.tsx
├── hooks/                  # Hook lintas fitur (use-mobile, use-highlighted-code)
├── lib/                    # Integrasi library: utils.ts (cn), preferences-config.ts, highlighter.tsx, maplibre.ts (worker URL)
├── providers/              # Provider React global (preferences-provider.tsx)
├── mocks/                  # Data contoh frontend-only (*.mock.ts) + hook mock CRUD
├── types/                  # Tipe UI lintas fitur (saat ini kosong)
└── utils/                  # Fungsi murni lintas fitur: editor-link.ts, editor-shortcut.ts (dipakai note, live-document, rich-text-editor)
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
| `src/components/<grup>/`     | Komponen generik lintas fitur (`crud`, `data-grid`, `filter`, `chart`, `gantt`, `layout`, `map`); `reui/` khusus kode vendor ReUI.    | Impor dari `@/features/*` atau `@/mocks/*`; endpoint/resource hardcode |
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

- Kelima folder wajib ada di folder halaman (fitur daun), termasuk ketika belum memiliki file. Buat langsung di filesystem (`mkdir -p .../{components,hooks,schemas,types,utils}`).
- Jangan membuat `.gitkeep`, file placeholder, atau ekspor kosong untuk mempertahankan folder. Checkout Git baru tidak otomatis membentuk folder kosong, dan pembuatan ulangnya belum diotomatisasi.
- Aturan berlaku untuk folder terakhir yang menjadi halaman: fitur tingkat atas tanpa subfitur dan setiap subfitur/varian halaman. Contoh: `calendar/`, `dashboard/sales/`, `authentication/auth-1/`, `table/editable/sheet/`, dan `crud/modal/` masing-masing memiliki lima folder tersebut. Folder induk kelompok (`dashboard/`, `authentication/`, `table/`, `table/editable/`, `crud/`, `chart/`, `ai-chat/`) tidak boleh berisi `components/`, `hooks/`, `schemas/`, `types/`, atau `utils/`; isinya hanya folder halaman anak dan dokumen seperti `README.md`.
- Folder standar tidak perlu memiliki lima subfolder standar lagi. Buat subfolder di dalamnya hanya untuk mengelompokkan file nyata.
- Jangan menaruh modul kode langsung di root fitur atau root kelompok fitur. Dokumen seperti `README.md` dan `LICENSE` boleh berada di root (contoh: `authentication/README.md`, `calendar/LICENSE`).
- Kerangka fitur tanpa halaman seperti `user/` dan `payment-slip/` (belum berisi file dan belum memiliki route) tetap memiliki struktur ini. Keberadaan folder tidak berarti halaman atau fungsinya telah diimplementasikan.
- Karena folder kosong tidak ikut Git, periksa kelengkapan lima folder setiap kali menyentuh fitur dan lengkapi dengan `mkdir -p` bila ada yang hilang.

### Route group `(backoffice)` mengikuti sidebar

Di dalam `src/app/(backoffice)/`, setiap `page.tsx` berada di route group yang sama dengan section sidebar tempat menunya tampil di `src/components/layout/app-navigation.tsx`: `(page)` untuk Page, `(playground)` untuk Playground, `(documentation)` untuk Documentation. Halaman dari menu akun yang tidak ada di sidebar (`/profile` dan `/change-password` dari `nav-user.tsx`) masuk `(account)`. Route group tidak masuk URL. Di dalam group, menu induk dengan submenu menjadi folder induk dengan anak per submenu, dan menu tanpa submenu menjadi folder sendiri sejajar menu lain. Section Page dan Playground sudah mengikuti pola ini: `(page)/dashboard/{main,academy,crm,finance,healthcare,hospitality,hr,logistics,manufacturing,productivity,sales,zoo}`, `(page)/ai-chat/{page,panel,float}`, `(page)/ai-usage`, `(page)/leads`, `(page)/product`, dan seterusnya, sehingga URL-nya `/dashboard/main`, `/ai-chat/page`, `/ai-usage`, `/leads`, `/product`. `(page)/dashboard/page.tsx` me-re-export halaman `main`, sehingga `/dashboard` sama dengan `/dashboard/main`. Section Playground sama: `(playground)/wizard`, `(playground)/compare`, dan seterusnya, dengan URL `/wizard`, `/compare`. Section Documentation masih mempertahankan segmen URL lama (`/chart/*`, `/crud/*`, `/filter/*`, `/table/*`).

- Saat menambah atau memindahkan menu antar-section, pindahkan juga foldernya ke group section tujuan dan buat foldernya sejajar menu lain di group itu. Mengubah segmen URL halaman yang sudah ada harus atas permintaan pengguna.
- Urutan menu level atas di `app-navigation.tsx` alfabetis per section (tanpa memperhatikan huruf besar-kecil); satu-satunya pengecualian adalah Dashboard yang selalu pertama di Page. Menu baru disisipkan sesuai abjad. Di submenu Dashboard, Main selalu pertama dan sisanya alfabetis; submenu lain (AI Chat, Authentication, CRUD, Table) mempertahankan urutan yang ada.
- Satu URL hanya boleh dimiliki satu group; segmen yang sama (mis. `dashboard/`) boleh ada di beberapa group.
- Jangan menambah `layout.tsx` di group ini hanya untuk pengelompokan; shell tetap di `(backoffice)/layout.tsx`.
- Keputusan pengguna, 6 November 2026: hanya `src/app/` yang dikelompokkan per section; `src/features/` tidak.

### Hubungan route dan fitur

Satu route biasanya dipetakan ke satu fitur atau subfitur. Nama folder fitur mengikuti segmen route bila memungkinkan:

| Route                                       | Fitur                                                       |
| ------------------------------------------- | ----------------------------------------------------------- |
| `/login-1` … `/login-5`                     | `authentication/auth-1` … `auth-5`                          |
| `/dashboard/sales`                          | `dashboard/sales`                                           |
| `/ai-chat/float`                            | `ai-chat/float`                                             |
| `/chart/area`                               | `chart/area`                                                |
| `/table/editable/sheet`                     | `table/editable/sheet`                                      |
| `/crud/{new-page,modal,sheet,panel-inline}` | `crud` (induk) + `crud/{new-page,modal,sheet,panel-inline}` |
| `/filter/{base,advance,group,sidebar}`      | `filter` (induk) + `filter/{base,advance,group,sidebar}`    |
| `/scenes-3d`                                | `scenes-3d`                                                 |
| `/leads`, `/workflow`, `/activity`          | `leads`, `workflow`, `activity` (fitur tingkat atas)        |
| `/profile`, `/change-password`              | `profile`, `change-password`                                |
| `/notes`                                    | `note` (pengecualian lama: nama fitur tunggal)              |

- Pengecualian `/dashboard/*`: dashboard analitik (`main`, `academy`, `crm`, `finance`, `healthcare`, `hospitality`, `hr`, `logistics`, `manufacturing`, `productivity`, `sales`, `zoo`) berada di kelompok `features/dashboard/<nama>`, dengan mock `dashboard-<nama>.mock.ts`. Halaman aplikasi lain (`calendar`, `project`, `task`, `file-manager`, `receipt`, `workflow`, `activity`, `structure`, `process`, `leads`, `ai-chat/*`, dan seterusnya) berada di `/<nama>`, termasuk `/profile` dan `/change-password`, memakai folder fitur tingkat atas tanpa awalan `dashboard/`. Nama file halaman dashboard analitik: `<nama>-dashboard-page.tsx`.
- Nama fitur tidak diberi awalan kelompok visual (misalnya `timeline-` atau `flow-`); gunakan nama pendek yang sama dengan segmen route, dan pakai nama itu juga untuk file halaman, mock (`<fitur>.mock.ts`), dan CSS fitur.

### Subfitur dan kode bersama

- Setiap varian halaman memiliki lima folder standar sendiri (misalnya setiap varian login, chart, dan tabel).
- Kode yang dipakai beberapa varian dalam satu kelompok disalin ke folder standar masing-masing halaman anak dan diimpor secara relatif; induk kelompok tidak menampung kode bersama. Keputusan pengguna, 30 Oktober 2026. Contoh: `chart/<varian>/components/chart-example-page.tsx` dan `chart/<varian>/utils/format.ts`, `ai-chat/{float,page,panel}/{components,hooks,utils}/{chat-composer,use-timers,stream-text}`, serta `table/editable/{inline,row,sheet}/{schemas,types,utils}/user-editing*`. Perubahan pada satu salinan perlu diterapkan ke salinan lain bila perilakunya harus sama. Kode yang dipakai lintas kelompok tetap dipindahkan ke `src/components/`, `src/hooks/`, `src/types/`, atau `src/utils/`.
- Kode yang dipakai lintas kelompok fitur dipindahkan ke `src/components/`, `src/hooks/`, `src/types/`, atau `src/utils/`; jangan mengimpor modul internal kelompok lain hanya untuk berbagi helper.
- Empat pola CRUD contoh memakai induk `crud/` dan satu subfitur per route. Keputusan pengguna, 29 Oktober 2026: form, kolom, dan tipe contoh ditulis di masing-masing subfitur, bukan dibagikan lewat induk; sumber data mock tetap satu. Pengecualian ini hanya untuk contoh `/crud/*`.
- Halaman demo `/filter/{base,advance,group,sidebar}` juga menyalin skema field, tabel, dan utilitasnya di masing-masing subfitur, bukan di induk `filter/` (keputusan pengguna, 29 Oktober 2026). `filter/sidebar` memakai mock sendiri (`filter-sidebar.mock.ts`). Komponen filter yang reusable tetap di `src/components/filter/`.
- Halaman chart: setiap kartu varian berada di file sendiri `<chart>-<varian>-card.tsx`; `<chart>-chart-page.tsx` hanya menyusun kartu.
- Varian shell/layout baru dibuat di file baru di `src/components/layout/`, bukan dengan menambah percabangan pada komponen shell yang sudah ada.

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
- Komponen di `src/components/` menerima data aplikasi (misalnya user aktif) lewat props dari `src/app/**/layout.tsx` atau fitur, bukan mengimpor `@/mocks/*`. Contoh: `(backoffice)/layout.tsx` memasok `user` ke header dan sidebar.
- Props yang hanya dipakai satu komponen boleh tetap didefinisikan di file komponen tersebut.

## Impor dan batas dependensi

- Di dalam satu fitur/subfitur, gunakan impor relatif (`./draft-preview-items`, `../utils/draft-preview`, `../types/draft-preview`).
- Ke luar fitur, gunakan alias `@/` (`@/components/...`, `@/mocks/...`, `@/lib/utils`). Jangan mengimpor modul internal halaman lain.
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

- Setiap `page.tsx` yang dapat dikunjungi mengekspor `metadata: Metadata` (`import type { Metadata } from "next"`) dengan `title` berformat `<Nama> | <Bagian>` (`Dashboard`, `Playground`, atau `Workspace`; chart, table, dan CRUD memakai `<Bagian> · <Varian> | Workspace`) serta satu kalimat `description`. Halaman yang hanya `redirect` tidak memerlukannya.
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

| PRD §6 (target)                                                             | Kode saat ini                                                                           | Pegangan agent                                                |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Route group `(dashboard)`                                                   | `(backoffice)`                                                                          | Pakai `(backoffice)`                                          |
| `components/layouts/`                                                       | `components/layout/`                                                                    | Pakai `components/layout/`                                    |
| `/login`, `/change-password`                                                | `/login-1` … `/login-5` dan `/change-password` di `(account)` (pratinjau UI tanpa auth) | Ikuti kode; auth nyata menunggu milestone autentikasi         |
| `/users`, `/countries`, `/menus`, dll.                                      | Dihapus; diganti `/crud/*` (amendemen 21 Okt)                                           | Dibuat ulang pada M4–M5 (amendemen 29 Okt); jangan lebih awal |
| `lib/api/`, `providers/query-provider.tsx`, `config/`, `tests/`, `app/api/` | Belum ada                                                                               | Buat saat milestone terkait dikerjakan, bukan lebih awal      |
| Folder fitur hanya jika diperlukan                                          | Lima folder selalu ada di folder halaman                                                | Ikuti keputusan pengguna 24 Oktober 2026 (diubah 30 Oktober)  |

## Langkah saat menambah atau merapikan fitur

1. Tentukan route di `src/app/` dan nama fitur/subfitur yang sesuai; pastikan tidak ada fitur atau komponen global yang sudah memenuhi kebutuhan.
2. Buat kelima folder standar untuk fitur halaman baru dan setiap subfitur halaman. Jangan membuatnya di induk kelompok.
3. Buat `components/<nama>-page.tsx` dengan `AppBody` + `PageHeading`, lalu `page.tsx` tipis yang merendernya.
4. Tempatkan schema, tipe, hook, dan utilitas di foldernya; data contoh di `src/mocks/`.
5. Saat memindahkan file, pertahankan nama ekspor, perilaku, validasi, dan batas Server/Client Component; perbarui semua import (route, mock, fitur lain).
6. Daftarkan navigasi di `app-navigation.tsx` dan `menu-search-tree.ts` bila halaman tampil di menu.
7. Periksa tidak ada modul kode di root fitur, impor ke lokasi lama, barrel baru, atau `.gitkeep`.
8. Jalankan `pnpm --filter frontend check-types` dan `pnpm --filter frontend lint` (warning ikut menggagalkan), lalu laporkan hasil sebenarnya. Untuk perubahan perilaku, cek manual di dev server karena test runner belum dikonfigurasi.
