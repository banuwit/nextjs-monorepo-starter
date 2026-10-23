# PRD — app-monorepo-starter, Tahap 1 (Frontend)

> **Product Requirements Document & AI Agent Implementation Specification**  
> **Versi:** 1.0 — Baseline Tahap 1 terkunci  
> **Tanggal baseline:** 15 Oktober 2026  
> **Status:** Approved for implementation (spesifikasi, **bukan** klaim kode sudah dibuat)  
> **Bahasa implementasi utama:** TypeScript  
> **Nama repository baru:** `app-monorepo-starter`

> **Amendemen UI, 21 Oktober 2026:** Sesuai keputusan pengguna terbaru, halaman dan entri navigasi Province (`/provinces`) serta City (`/cities`) dihapus dari scope frontend. Rujukan halaman Province/City pada baseline di bawah tidak lagi berlaku. Model data mock geografis tetap tersedia; keputusan ini tidak mengubah rencana API atau database.

> **Amendemen UI, 21 Oktober 2026 (contoh CRUD):** Setelah empat contoh pola tersedia di `/crud/new-page`, `/crud/modal`, `/crud/sheet`, dan `/crud/panel-inline`, pengguna meminta halaman dan entri navigasi User (`/users`), Country (`/countries`), Menu (`/menus`), serta Parameter (`/parameters`) dihapus. Rujukan halaman tersebut pada baseline di bawah adalah riwayat rancangan, bukan scope frontend saat ini. Contoh CRUD memakai salinan data mock Parameter yang terpisah. Keputusan ini tidak menghapus model mock maupun menetapkan perubahan API/database Tahap 1.

> **Amendemen UI, 23 Oktober 2026 (Preferences):** Tambahkan Header Color dengan pilihan palet dan kebijakan persistensi yang sama seperti Sidebar Color, default White. Pada gaya Floating, sidebar dan header sama-sama mengambang dengan radius yang sama; latar di belakang keduanya memakai warna App Body Color. Rujukan Preferences pada baseline di bawah dibaca bersama amendemen ini.

> **Amendemen UI, 23 Oktober 2026 (Sidebar):** Sidebar hanya dibuka/ditutup melalui ikon trigger di header; rail hover/click dan shortcut keyboard untuk toggle dihapus.

> **Amendemen UI, 23 Oktober 2026 (Header style):** Preferences menyediakan gaya Header. Pada desktop, sidebar dan trigger disembunyikan; header menampilkan menubar navigasi ringkas di baris kedua menggunakan komponen shadcn Base UI Menubar. Search menu berada di header tepat di kiri menu akun. Pada mobile, menubar disembunyikan; trigger di kiri logo dan nama aplikasi membuka drawer sidebar yang sama. Permukaan menubar putih pada mode terang dan memakai warna Card pada mode gelap, terlepas dari Header Color. Border header dan menubar mengikuti warna garis Card. Preferences berada dalam menu akun.

> **Amendemen UI, 23 Oktober 2026 (App Body Color):** Warna App Body mengisi latar shell dashboard pada gaya Sidebar, Floating, dan Header, serta area konten pada gaya Inset dengan warna visual yang sama. Latar di belakang sidebar gaya Inset mengikuti Sidebar Color, sedangkan gaya Floating mengikuti App Body Color. Pembungkus konten halaman transparan agar warna tidak tertumpuk dua kali.

> **Amendemen UI, 23 Oktober 2026 (Preferences modal):** Preferences dibuka sebagai modal dari menu akun dan tombol pada dashboard Finance. Halaman `/dashboard/preferences` serta direktori `features/preferences` dihapus.

> **Amendemen UI, 23 Oktober 2026 (Toggle tema):** Tombol ikon terang/gelap berada di header, tepat di kiri menu akun, pada semua gaya header. Toggle tema di dalam menu akun dihapus.

Roadmap tahap berikutnya: [Tahap 2 (Mobile)](../mobile/prd.md) dan [Tahap 3 (Backend)](../backend/prd.md). Kedua dokumen tersebut belum memberi izin untuk memulai implementasinya.

---

## 0. Cara menggunakan dokumen ini (wajib dibaca agent AI)

Dokumen ini adalah **sumber kebenaran produk dan arsitektur** untuk membangun repository **baru dari nol**. Agent AI **tidak** boleh menganggap repository referensi sebagai repository dasar, melakukan fork, atau menyalin keseluruhan struktur/fiturnya. Referensi hanya untuk inspirasi perilaku UX dan praktik implementasi.

**Instruksi eksekusi untuk agent:**

1. Baca seluruh PRD sebelum membuat file; identifikasi dependency antarmilestone.
2. Implementasikan **hanya Tahap 1** sampai pengguna secara eksplisit meminta Tahap 2 atau 3.
3. Ikuti keputusan yang diberi label **DIKUNCI**; jangan mengganti framework, memindahkan batas package, atau mengganti metode komunikasi internal tanpa persetujuan pengguna.
4. Jadikan direktori pada Bagian 6 sebagai **target struktur**, bukan perintah membuat folder kosong. Buat direktori ketika ada file yang nyata; gunakan `.gitkeep` hanya bila beralasan.
5. Kerjakan secara bertahap menurut Bagian 17. Setelah setiap milestone, jalankan pemeriksaan yang relevan, laporkan perubahan, dan jangan menandai checklist selesai jika belum diuji.
6. Jika menemukan ambiguitas non-kritis, pilih implementasi paling sederhana yang konsisten dengan PRD, dokumentasikan asumsi, dan lanjutkan. Untuk perubahan keputusan arsitektur yang terkunci, minta persetujuan.
7. Jangan mengarang bahwa build, test, migration, atau deploy telah berhasil; tunjukkan perintah dan hasil aktual.
8. `apps/mobile` dan `apps/backend` hanya berisi PRD masing-masing selama Tahap 1. Jangan menambahkan kode aplikasi atau menetapkan struktur teknis final Tahap 2/3 sebelum diminta pengguna.
9. Terapkan coding conventions, batas dependensi, keamanan, dan pengujian pada seluruh fitur; jangan menyelesaikan UI menggunakan data dummy jika fitur diwajibkan terintegrasi database.
10. Prioritas konflik: keputusan pengguna terbaru > bagian **DIKUNCI** pada PRD > implementasi terdahulu > preferensi agent.

### 0.1 Definisi status

- **DIKUNCI:** requirement wajib dan tidak boleh diubah sepihak.
- **TARGET:** bentuk rancangan yang perlu dicapai, tetapi nama file kecil dapat disesuaikan jika dijelaskan tanpa mengubah batas arsitektur.
- **OPSIONAL:** implementasikan hanya ketika diperlukan.
- **DI LUAR SCOPE:** jangan implementasikan pada Tahap 1.

---

## 1. Ringkasan produk

`app-monorepo-starter` adalah **starter kit aplikasi admin/dashboard full-stack berbasis monorepo**, dirancang untuk berkembang dalam tiga tahap tanpa membongkar UI atau kontrak API.

- **Tahap 1 (scope dokumen ini):** Next.js full-stack; UI, route handler REST API, auth, business use cases, database PostgreSQL/Drizzle; deploy web ke Vercel.
- **Tahap 2 (roadmap):** tambah aplikasi Flutter yang menggunakan REST API yang sama. Struktur arsitektur Flutter akan diputuskan saat Tahap 2 dimulai.
- **Tahap 3 (roadmap):** tambah backend Go dan migrasikan tanggung jawab API/logic/database/auth secara terencana, mempertahankan kontrak REST dan pengalaman UI. Struktur Go akan diputuskan saat Tahap 3 dimulai.

Produk ditujukan sebagai **fondasi reusable** untuk proyek baru, bukan sekadar demo CRUD. Fitur referensi menjadi contoh cara memakai primitives global: Data Grid, empat pola CRUD, kontrak API, permissions, dan dependency separation.

### 1.1 Tujuan utama

1. Menghasilkan starter yang dapat dijalankan lokal dan di-deploy.
2. Menyediakan UI dashboard dengan autentikasi dan sidebar berbasis database.
3. Menyediakan **empat pola CRUD global** yang dapat dipilih per fitur: multi-page, dialog, sheet, inline side panel.
4. Menyediakan **Data Grid global** yang dapat dipakai dengan maupun tanpa fitur CRUD.
5. Menyediakan enam fitur referensi dengan database/API nyata: users, countries, provinces, cities, menus, parameters.
6. Memisahkan kontrak, use case, persistence, auth, dan presentasi untuk memudahkan Tahap 2–3.
7. Membuat setiap fitur memiliki unit, integration, dan API contract test sejak awal.
8. Memungkinkan halaman frontend-only memakai `src/mocks/` tanpa merusak pola integrasi ketika dihubungkan ke API kelak.

### 1.2 Non-goals Tahap 1

- Tidak membangun aplikasi Flutter atau backend Go.
- Tidak menetapkan struktur folder Tahap 2 dan 3.
- Tidak melakukan copy/paste besar dari repository referensi.
- Tidak membuat GraphQL, tRPC, atau Server Actions sebagai jalur CRUD utama.
- Tidak membangun auth token mobile penuh sebelum ada kebutuhan Flutter.
- Tidak menambahkan microservices, event broker, cache terdistribusi, atau state manager baru tanpa kebutuhan nyata.
- Tidak membuat semua fitur memakai semua pola CRUD; **satu pola default per halaman referensi** sudah cukup, tetapi pola global harus reusable.

### 1.3 Repository inspirasi

- Frontend dan UX referensi: https://github.com/banuwit/template-nextjs-drizzle
- Inspirasi arsitektur backend untuk evaluasi Tahap 3: https://github.com/asal-gasruk/mddw-go

**Catatan:** detail codebase referensi bisa berubah. Requirements pada PRD ini lebih tinggi prioritasnya daripada implementasi referensi. Peta halaman pada §5 mengacu pada deskripsi pola CRUD yang tercantum di README frontend referensi saat spesifikasi dibuat.

---

## 2. Keputusan arsitektur yang DIKUNCI

| Area                    | Keputusan                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------- |
| Repository              | Buat monorepo baru `app-monorepo-starter` dari nol                                     |
| Package management      | `pnpm` workspace + Turborepo                                                           |
| Web                     | Next.js App Router + React + TypeScript                                                |
| Styling                 | Tailwind CSS + shadcn/ui                                                               |
| Data Grid               | TanStack Table, reusable global                                                        |
| Async/server state      | TanStack Query untuk interaksi client-side CRUD                                        |
| Database                | PostgreSQL + Drizzle ORM                                                               |
| Auth Tahap 1            | Better Auth dengan session/cookie untuk web                                            |
| API                     | REST lewat Next.js App Router Route Handlers, prefix `/api/v1`                         |
| Schema/contract         | **Zod sebagai source of truth**; OpenAPI **digenerate otomatis**                       |
| HTTP client frontend    | Terpusat di `apps/frontend/src/lib/api/`                                               |
| Response REST bisnis    | Envelope konsisten: `data`, `meta`, `error`                                            |
| Pengecualian response   | Better Auth `/api/auth/*` mengikuti protokolnya sendiri; HTTP 204 tanpa body           |
| CRUD UX                 | Empat pola komponen **global**, bukan `features/*/patterns/`                           |
| Data Grid UX            | Komponen **global** di `components/data-grid/`                                         |
| Feature folders         | `components/`, `hooks/`, `schemas/`, `types/`, `utils/` hanya jika diperlukan          |
| Shared frontend folders | `components/`, `hooks/`, `types/`, `utils/`, `lib/`, `providers/`, `config/`, `mocks/` |
| Pemisahan layer         | `packages/contracts`, `packages/core`, `packages/db`, `packages/auth`                  |
| Test                    | Unit + integration + API contract wajib dari Tahap 1                                   |
| CI                      | Lint, typecheck, tests, build, check generated OpenAPI, migration safety               |
| Tahap 2/3               | Roadmap saja; diputuskan dan dibangun hanya atas instruksi pengguna                    |

### 2.1 Batas dependensi wajib

```text
Browser / UI
    ├── features/* → components/* → shadcn/ui
    ├── features/* → lib/api/endpoints/* → HTTP /api/v1
    └── features/* → packages/contracts (types & Zod safe for browser)

Next.js Route Handler (/api/v1)
    ├── packages/contracts  (validate + response schemas)
    ├── packages/auth       (session + server permissions)
    ├── packages/core       (use case + repository ports)
    └── packages/db         (Drizzle repository adapter + connection)

packages/core:  TIDAK bergantung pada Next.js atau Drizzle
packages/contracts: TIDAK bergantung pada Next.js, Drizzle, atau Better Auth
packages/db:    implementasi persistence, TIDAK dipakai langsung oleh UI
packages/auth:  integrasi Better Auth dan session; server-only dipisahkan dari client
```

**Larangan:** UI tidak boleh mengimpor Drizzle/repository DB. Core tidak boleh mengimpor komponen React/Next.js. Jangan mengirim session secret atau konfigurasi database ke client bundle. Jangan menulis ulang logika bisnis inti di route handler.

---

## 3. Persona, peran, dan use case

### 3.1 Pengguna

- **Administrator:** mengelola user, master data geografi, navigasi, parameter, dan hak akses.
- **Editor/operator (opsional untuk starter):** mengelola resource yang diizinkan.
- **Viewer:** melihat data sesuai izin tanpa menulis.
- **Developer/agent:** menambahkan fitur baru dengan memilih pola CRUD reusable, tanpa menyalin implementasi UI/API.

### 3.2 User stories & acceptance umum

| ID    | User story                                                     | Bukti diterima                                                                              |
| ----- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| US-01 | Sebagai user, saya dapat login/logout                          | Cookie session valid, route terlindungi, logout invalidasi session                          |
| US-02 | Sebagai admin, saya dapat mengelola users                      | List, detail, create, edit, tindakan delete/deactivate sesuai kebijakan                     |
| US-03 | Sebagai admin, saya dapat mengelola countries/provinces/cities | Data konsisten secara relasional; CRUD melalui dialog                                       |
| US-04 | Sebagai admin, saya dapat mengelola menus                      | Sidebar mengikuti entri menu terotorisasi dari DB; form CRUD via sheet                      |
| US-05 | Sebagai admin, saya dapat mengelola parameters                 | CRUD memakai inline side panel                                                              |
| US-06 | Sebagai user, saya dapat search/sort/filter/paginate           | Data Grid server-side bekerja konsisten dengan API                                          |
| US-07 | Sebagai developer, saya dapat membuat fitur baru               | Hanya menambahkan konfigurasi/komponen fitur + API/domain, tanpa menyalin Data Grid/pattern |
| US-08 | Sebagai developer, saya dapat membuat halaman frontend-only    | Dummy data berasal dari `src/mocks/`, tanpa dependency DB                                   |
| US-09 | Sebagai pengelola produk, saya dapat menambah mobile/Go kelak  | OpenAPI dan batas layer mendukung evolusi tanpa rewrite UI besar                            |

---

## 4. Stack teknis & kebijakan versi

- **Runtime:** Node.js LTS yang kompatibel dengan Next.js/Better Auth saat implementasi; kunci versi dengan `packageManager` dan lockfile.
- **Frontend:** Next.js (App Router), React, TypeScript strict mode.
- **Style:** Tailwind CSS, shadcn/ui, Lucide icons.
- **Form:** React Hook Form + Zod resolver jika cocok; validasi server tetap wajib.
- **Table:** `@tanstack/react-table`; Query menggunakan `@tanstack/react-query`.
- **Database:** PostgreSQL (lokal via Docker Compose), Drizzle ORM + Drizzle Kit migrations.
- **Auth:** Better Auth untuk web session.
- **Contracts:** Zod + generator OpenAPI yang kompatibel dengan versi Zod terpilih; artefak JSON deterministik.
- **Test:** Vitest untuk unit/integration, database PostgreSQL test terisolasi, API contract assertions; browser E2E (mis. Playwright) boleh ditambahkan untuk empat pola CRUD dan login.
- **Hosting:** Next.js di Vercel, PostgreSQL managed yang kompatibel dengan driver dan migrations.

**Versi paket final dipilih saat implementasi**, dengan cek kompatibilitas dan lockfile. Jangan menyalin versi lama secara buta dari repository inspirasi.

---

## 5. Ruang lingkup halaman dan empat pola CRUD

### 5.1 Peta halaman referensi — DIKUNCI

| Menu/route         | Resource       | Pola default          | Perilaku                                                           |
| ------------------ | -------------- | --------------------- | ------------------------------------------------------------------ |
| `/dashboard`       | Dashboard      | Non-CRUD              | Ringkasan, dapat menggunakan mock data untuk widget presentasional |
| `/users`           | Users          | **Multi-page**        | List → `/users/new` → `/users/[id]` → `/users/[id]/edit`           |
| `/countries`       | Countries      | **Dialog**            | Create/edit melalui modal di halaman list                          |
| `/provinces`       | Provinces      | **Dialog**            | Create/edit melalui modal di halaman list; memilih country         |
| `/cities`          | Cities         | **Dialog**            | Create/edit melalui modal di halaman list; memilih province        |
| `/menus`           | Menus          | **Sheet**             | Create/edit di overlay samping; mengatur sidebar                   |
| `/parameters`      | Parameters     | **Inline side panel** | Create/edit di panel tertanam pada halaman tanpa modal overlay     |
| `/login`           | Authentication | Non-CRUD              | Login Better Auth                                                  |
| `/change-password` | Authentication | Non-CRUD              | Penggantian password untuk pengguna terautentikasi                 |

**Penting:** ada **empat jenis pola**, bukan harus persis empat URL; Tahap 1 menggunakan **enam halaman CRUD** untuk membuktikan keempat pola tersebut (3 halaman memakai dialog).

### 5.2 Kontrak perilaku pola CRUD global

| Pattern      | Komponen utama          | State UI                             | Navigasi                               |
| ------------ | ----------------------- | ------------------------------------ | -------------------------------------- |
| Multi-page   | `crud-page.tsx`         | Berbasis URL/route dan form terpisah | Navigasi ke create/detail/edit URL     |
| Dialog       | `crud-dialog.tsx`       | `open`, `mode`, `selectedRow`        | Tidak perlu pindah halaman             |
| Sheet        | `crud-sheet.tsx`        | `open`, `mode`, `selectedRow`        | Panel overlay dari samping             |
| Inline panel | `crud-inline-panel.tsx` | `visible`, `mode`, `selectedRow`     | Panel menjadi bagian layout, responsif |

**Persyaratan reusable:**

1. Komponen pola berada di `src/components/crud/`, **bukan** `features/*/patterns/`.
2. Komponen hanya mengurus orkestrasi UI/form, bukan detail DB/domain.
3. Menerima generic typings (`TEntity`, `TCreate`, `TUpdate`), columns, form renderer, API adapter/hook, permissions, labels, dan callbacks.
4. Mendukung loading, success, error, validation feedback, submit disabled, dan dialog konfirmasi delete.
5. Memakai Data Grid global untuk list. Penggunaan Data Grid tanpa CRUD juga harus didukung.
6. Pola multi-page menggunakan route Next.js nyata. Tidak memaksakan semua mode menjadi sekadar satu prop tanpa route configuration.
7. Komponen tidak membentuk URL endpoint otomatis berdasarkan `resource` saja; adapter API diberikan secara eksplisit.
8. Penghapusan tidak dilakukan optimistis tanpa penanganan rollback/feedback yang memadai.
9. Accessible keyboard navigation/focus management, label form, mobile layout, dan screen-reader semantics.

**Contoh API komponen (rancangan, bukan library bawaan):**

```tsx
<CrudResource
  pattern="dialog"
  title="Countries"
  columns={countryColumns}
  form={CountryForm}
  api={countriesApi}
  permissions={{ create: canCreate, update: canUpdate, delete: canDelete }}
/>
```

Untuk multi-page, route dapat menggunakan `CrudPage`/form generik dengan `mode` dan routing Next.js; **hindari abstraksi tunggal yang mempersulit custom UX**.

### 5.3 Spesifikasi Data Grid global

Folder `src/components/data-grid/` wajib memberi kemampuan:

- Column definitions TanStack Table, cell rendering, custom row actions.
- Sorting (single/multi hanya bila backend didukung), global search, filters terdefinisi, pagination, page size.
- Column visibility; aksi per baris dikonfigurasi per fitur. Data Grid tidak menyediakan row selection, checkbox, atau bulk actions.
- Loading skeleton, empty state, error state, retry, responsive layout.
- **Client-side mode** untuk data lokal/mock dan **server-side mode** untuk daftar REST bisnis.
- Pada server-side mode, query/table state menjadi parameter fetch; pagination/search/sort/filter **dijalankan oleh API/database**; jangan hanya memfilter halaman yang sudah diambil.
- Debounce input search; query key stabil; URL query state sinkron bila bermanfaat untuk back/forward/shareable filters.
- Whitelist kolom sorting/filter di server dan amankan parameter database query.
- Tidak mengandung pengetahuan mengenai resource `users`, `countries`, dll.

### 5.4 Kebutuhan domain per fitur

**Users (multi-page):**

- List dengan nama, email, status, role, aksi detail/edit/status/delete sesuai permission.
- Create user oleh admin; **tidak** menyediakan public sign-up.
- Detail dan edit di URL terpisah; tidak pernah menampilkan password/hash pada response.
- Akun admin terakhir dan akun diri sendiri dilindungi dari operasi destruktif yang berisiko.
- Model identitas menggunakan tabel pengguna Better Auth sebagai sumber utama; metadata aplikasi/role yang diperlukan ditambahkan lewat desain schema yang kompatibel dengan auth, bukan membuat dua identitas yang saling bersaing.

**Countries (dialog):**

- Data minimal `id`, `code` unik, `name`, timestamp; pencarian/filter.
- Validasi uniqueness di schema+DB, API mengembalikan `409` saat bentrok.

**Provinces (dialog):**

- `id`, `countryId`, `code` (sesuai kebutuhan scope), `name`, timestamp.
- Validasi `countryId` valid; opsi country dari API.

**Cities (dialog):**

- `id`, `provinceId`, `name`, optional code, timestamp.
- Validasi `provinceId` valid; opsi province dari API; dependent filter bila UI menggunakannya.

**Menus (sheet):**

- `id`, `title`, `path`, `icon`, `parentId?`, `sortOrder`, `isActive`, aturan visibility/permission.
- Sidebar membaca menu aktif yang **telah difilter berdasarkan hak akses**.
- Validasi parent hierarchy: parent tidak boleh dirinya sendiri atau membuat cycle; hanya path internal yang diizinkan sesuai kebijakan.
- Urutan menu stabil, multi-level sesuai dukungan UI; invalidasi query/navigation setelah mutation.

**Parameters (inline side panel):**

- `id`, `key` unik, `value`, `description?`, `type` yang didukung, status sesuai kebutuhan.
- Jika parameter sensitif, **jangan** tampilkan nilai sensitif di UI/API; pemisahan secret/environment dari parameter biasa.
- Validasi value berdasarkan type, edit via panel yang tidak menutupi Data Grid.

**Deletion:** definisikan kebijakan per resource: relasi geografi yang masih digunakan ditolak dengan `409`, atau mekanisme bisnis eksplisit; jangan cascade destruktif secara diam-diam. Policies untuk user lebih konservatif (deactivate bila relevan). Dokumentasikan kebijakan final di test.

---

## 6. Struktur direktori target Tahap 1 — lengkap dengan fungsi

> Semua lokasi relatif terhadap root `app-monorepo-starter/`. Nama direktori `(auth)` dan `(dashboard)` merupakan **Next.js route groups** dan tidak menjadi bagian URL.

Di frontend, `src/app/` adalah **direktori App Router**. Subdirektorinya membentuk segmen rute; file `page.tsx` menjadi entry point halaman yang merender komponen dari `src/features/<fitur>/components/`, sedangkan file `route.ts` adalah **Route Handler HTTP/API**. `layout.tsx` mengatur tata letak bersama untuk segmen di bawahnya. UI dan logika khusus fitur berada di `src/features/`; komponen yang dipakai lintas fitur berada di `src/components/`.

```text
app-monorepo-starter/
├── AGENTS.md                           # Petunjuk agent ringkas turunan PRD (dibuat saat setup)
├── README.md                           # Setup, scripts, fitur, deployment
├── .env.example                        # Daftar env tanpa kredensial
├── .gitignore
├── .editorconfig
├── compose.yaml                        # PostgreSQL lokal dan opsional DB khusus test
├── package.json                        # Scripts root + packageManager
├── pnpm-lock.yaml
├── pnpm-workspace.yaml                  # Workspace apps/* + packages/*
├── turbo.json                          # Pipeline build/lint/typecheck/test
├── tsconfig.base.json                  # TypeScript strict shared config
├── .github/
│   └── workflows/
│       └── ci.yml                      # Pemeriksaan pull request/build
│
├── apps/
│   ├── mobile/
│   │   └── prd.md                       # Roadmap Tahap 2 saja
│   ├── backend/
│   │   └── prd.md                       # Roadmap Tahap 3 saja
│   └── frontend/                       # Satu-satunya aplikasi yang diimplementasikan pada Tahap 1
│       ├── prd.md                       # PRD Tahap 1 (dokumen ini)
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.ts
│       ├── postcss.config.mjs
│       ├── eslint.config.mjs            # Jika config lint tidak dishare
│       ├── components.json             # Konfigurasi shadcn/ui
│       ├── proxy.ts                     # Redirect optimistis; auth final di server
│       ├── public/                      # Asset statis
│       ├── tests/
│       │   ├── integration/             # Pengujian handler / integrasi frontend
│       │   ├── contracts/              # Validasi endpoint vs Zod/OpenAPI
│       │   └── e2e/                    # OPSIONAL: smoke flow browser
│       └── src/
│           ├── app/                      # Direktori App Router; subfolder = segmen rute
│           │   ├── (auth)/
│           │   │   ├── login/page.tsx
│           │   │   └── change-password/page.tsx
│           │   ├── (dashboard)/
│           │   │   ├── layout.tsx       # Authenticated dashboard layout
│           │   │   ├── dashboard/page.tsx
│           │   │   ├── users/           # MULTI-PAGE
│           │   │   │   ├── page.tsx     # Data Grid users
│           │   │   │   ├── new/page.tsx # Create user
│           │   │   │   └── [id]/
│           │   │   │       ├── page.tsx # Detail user
│           │   │   │       └── edit/page.tsx
│           │   │   ├── countries/page.tsx   # DIALOG
│           │   │   ├── provinces/page.tsx   # DIALOG
│           │   │   ├── cities/page.tsx      # DIALOG
│           │   │   ├── menus/page.tsx       # SHEET
│           │   │   └── parameters/page.tsx  # INLINE SIDE PANEL
│           │   ├── api/                  # Segmen API; endpoint memakai route.ts
│           │   │   ├── auth/
│           │   │   │   └── [...all]/route.ts   # Better Auth (native response)
│           │   │   └── v1/
│           │   │       ├── users/
│           │   │       │   ├── route.ts       # GET collection / POST
│           │   │       │   └── [id]/route.ts  # GET / PATCH / DELETE
│           │   │       ├── countries/
│           │   │       │   ├── route.ts
│           │   │       │   └── [id]/route.ts
│           │   │       ├── provinces/
│           │   │       │   ├── route.ts
│           │   │       │   └── [id]/route.ts
│           │   │       ├── cities/
│           │   │       │   ├── route.ts
│           │   │       │   └── [id]/route.ts
│           │   │       ├── menus/
│           │   │       │   ├── route.ts
│           │   │       │   └── [id]/route.ts
│           │   │       └── parameters/
│           │   │           ├── route.ts
│           │   │           └── [id]/route.ts
│           │   ├── layout.tsx                # HTML root layout/providers
│           │   ├── page.tsx                  # File halaman rute /; root redirect sesuai auth
│           │   ├── globals.css               # Tailwind + theme globals
│           │   ├── not-found.tsx
│           │   └── error.tsx
│           │
│           ├── features/                      # UI dan logika khusus fitur, di luar entry point rute
│           │   ├── authentication/
│           │   │   └── auth-1/
│           │   │       └── components/
│           │   │           ├── login-page.tsx
│           │   │           └── login-form.tsx
│           │   ├── dashboard/
│           │   │   └── components/
│           │   │       └── dashboard-page.tsx
│           │   ├── users/
│           │   │   ├── components/
│           │   │   │   ├── user-page.tsx
│           │   │   │   ├── user-form.tsx
│           │   │   │   ├── user-columns.tsx
│           │   │   │   └── user-detail.tsx
│           │   │   ├── hooks/
│           │   │   │   ├── use-users.ts
│           │   │   │   └── use-user-mutations.ts
│           │   │   ├── schemas/
│           │   │   │   └── user-form.schema.ts
│           │   │   ├── types/                # Tipe UI saja bila diperlukan
│           │   │   └── utils/                # Formatter/mapper UI users
│           │   ├── countries/
│           │   │   ├── components/           # Country form + columns
│           │   │   ├── hooks/
│           │   │   ├── schemas/
│           │   │   ├── types/
│           │   │   └── utils/
│           │   ├── provinces/                # Struktur feature sama
│           │   ├── cities/                   # Struktur feature sama
│           │   ├── menus/                    # Struktur feature sama
│           │   └── parameters/               # Struktur feature sama
│           │
│           ├── components/                    # Reusable lintas feature
│           │   ├── ui/                        # Primitive shadcn/ui
│           │   ├── layouts/
│           │   │   ├── app-sidebar.tsx
│           │   │   ├── app-header.tsx
│           │   │   └── dashboard-shell.tsx
│           │   ├── data-grid/
│           │   │   ├── data-grid.tsx          # Generic grid + TanStack Table
│           │   │   ├── data-grid-toolbar.tsx
│           │   │   ├── data-grid-filters.tsx
│           │   │   ├── data-grid-pagination.tsx
│           │   │   ├── data-grid-columns.tsx
│           │   │   ├── data-grid-row-actions.tsx
│           │   │   └── data-grid-skeleton.tsx
│           │   └── crud/
│           │       ├── crud-resource.tsx      # Common composition/controller
│           │       ├── crud-page.tsx          # Multi-page composition
│           │       ├── crud-dialog.tsx        # Dialog composition
│           │       ├── crud-sheet.tsx         # Sheet composition
│           │       └── crud-inline-panel.tsx  # Inline composition
│           │
│           ├── hooks/                         # React hooks global
│           │   ├── use-debounce.ts
│           │   ├── use-mobile.ts
│           │   └── use-confirm.ts
│           ├── types/                         # Shared UI types, bukan DTO API
│           │   ├── common.ts
│           │   └── navigation.ts
│           ├── utils/                         # Pure functions global
│           │   ├── format-date.ts
│           │   └── format-number.ts
│           ├── lib/                           # Integrasi frontend
│           │   ├── api/
│           │   │   ├── client.ts              # Fetch browser, credential cookies
│           │   │   ├── server.ts              # Server-only HTTP + cookie forwarding
│           │   │   ├── errors.ts              # Typed API error handling
│           │   │   └── endpoints/
│           │   │       ├── users.ts
│           │   │       ├── countries.ts
│           │   │       ├── provinces.ts
│           │   │       ├── cities.ts
│           │   │       ├── menus.ts
│           │   │       ├── parameters.ts
│           │   │       └── index.ts
│           │   └── auth/
│           │       └── client.ts              # Browser auth adapter (jika dibutuhkan)
│           ├── providers/
│           │   └── query-provider.tsx
│           ├── config/
│           │   ├── navigation.ts              # Mapping icon/fallback config
│           │   └── site.ts                    # Branding
│           └── mocks/
│               ├── dashboard.mock.ts         # Dummy widget/frontend-only
│               └── index.ts
│
├── packages/
│   ├── contracts/                             # Zod/API source of truth
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── schemas/
│   │   │   │   ├── users.ts
│   │   │   │   ├── countries.ts
│   │   │   │   ├── provinces.ts
│   │   │   │   ├── cities.ts
│   │   │   │   ├── menus.ts
│   │   │   │   └── parameters.ts
│   │   │   ├── responses/
│   │   │   │   ├── envelope.ts                # data/meta/error
│   │   │   │   ├── pagination.ts
│   │   │   │   └── errors.ts
│   │   │   ├── registry.ts                    # OpenAPI registry generator input
│   │   │   └── index.ts                      # Public exports
│   │   ├── generated/
│   │   │   └── openapi.json                  # Deterministic generated artifact
│   │   └── tests/
│   │       └── contracts.test.ts
│   │
│   ├── core/                                  # Business/domain/application layer
│   │   ├── package.json
│   │   └── src/
│   │       ├── users/                        # Use cases + repository ports
│   │       ├── countries/
│   │       ├── provinces/
│   │       ├── cities/
│   │       ├── menus/
│   │       ├── parameters/
│   │       └── shared/                       # Domain errors, permissions types
│   │
│   ├── db/                                    # PostgreSQL/Drizzle adapter
│   │   ├── package.json
│   │   ├── drizzle.config.ts
│   │   ├── drizzle/                           # SQL migration files
│   │   ├── src/
│   │   │   ├── client.ts                     # DB pool/connection
│   │   │   ├── schema/
│   │   │   │   ├── auth.ts                   # Better Auth required tables
│   │   │   │   ├── users.ts                  # User app metadata jika perlu
│   │   │   │   ├── countries.ts
│   │   │   │   ├── provinces.ts
│   │   │   │   ├── cities.ts
│   │   │   │   ├── menus.ts
│   │   │   │   └── parameters.ts
│   │   │   ├── repositories/                 # Implements core ports
│   │   │   └── seed/                         # Idempotent starter seed scripts
│   │   └── tests/
│   │       └── integration/
│   │
│   └── auth/                                  # Better Auth integration boundary
│       ├── package.json
│       └── src/
│           ├── server.ts                     # Better Auth config, server-only
│           ├── client.ts                     # Browser-safe exports ONLY
│           ├── session.ts                    # get/require session
│           └── permissions.ts                # Server auth permission adapter
│
└── tooling/
    └── scripts/
        ├── generate-openapi.ts                # Regenerate OpenAPI from Zod
        └── check-openapi.ts                   # Detect generated file drift
```

### 6.1 Fungsi direktori frontend

| Folder/berkas                | Tanggung jawab                                                     | Tidak boleh berisi                                  |
| ---------------------------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| `src/app/`                   | Pohon App Router; subfolder membentuk segmen rute dan route groups | Business rules dan query DB di komponen halaman     |
| `src/app/**/page.tsx`        | Entry point rute yang merender halaman dari `src/features/`        | Implementasi UI/logika fitur atau endpoint HTTP/API |
| `src/app/api/**/route.ts`    | File Route Handler untuk endpoint HTTP/API                         | Komponen halaman React                              |
| `src/features/*/components/` | UI halaman, form, columns, detail/view khusus fitur                | Duplikasi Data Grid/CRUD global                     |
| `src/features/*/hooks/`      | TanStack Query hooks khusus resource                               | SQL/Drizzle                                         |
| `src/features/*/schemas/`    | Schema form/UI (dapat extend schema contracts)                     | Duplikat schema request API sebagai source baru     |
| `src/features/*/types/`      | Type UI khusus resource                                            | Duplikat API DTO                                    |
| `src/features/*/utils/`      | Formatter/mapper murni khusus resource                             | General shared utilities                            |
| `src/components/ui/`         | shadcn primitives                                                  | Business logic                                      |
| `src/components/data-grid/`  | Generic tabel/filter/sort/pagination                               | Hardcoded users/menus endpoints                     |
| `src/components/crud/`       | Generic four CRUD patterns                                         | Request DB langsung                                 |
| `src/hooks/`                 | Hook lintas fitur                                                  | `useUsers` dan hook feature spesifik                |
| `src/types/`                 | Tipe UI lintas fitur                                               | Duplikat `contracts` response DTO                   |
| `src/utils/`                 | Pure shared formatting helpers                                     | Auth/session/network clients                        |
| `src/lib/`                   | HTTP clients dan integrasi library                                 | Feature UI components                               |
| `src/providers/`             | Providers React                                                    | Domain persistence                                  |
| `src/config/`                | Branding/konfigurasi UI                                            | Secrets atau config DB client-side                  |
| `src/mocks/`                 | Dummy data halaman **frontend-only**                               | Source of truth resource CRUD yang wajib DB         |

### 6.2 Fungsi package dan tingkat kemandirian

- **`contracts`**: API request/query/response schemas, errors, data types hasil `z.infer`, OpenAPI generation. Browser safe; menjaga API portable ke Dart/Go.
- **`core`**: entities/use cases/policies/repository interfaces dengan dependency injection. Tidak bergantung pada framework atau ORM. Unit tests dijalankan dengan fake repository.
- **`db`**: Drizzle schema, migrations, query adapters, seed. Domain mengakses melalui interface dari core.
- **`auth`**: Better Auth server, session, permissions. Jangan mengekspos Better Auth server internals lewat browser exports. Saat Tahap 3, migrasi auth direncanakan terpisah.
- **`tooling/scripts`**: proses CLI untuk generate/verify kontrak.

### 6.3 Hal yang **tidak** dibuat sebagai folder Tahap 1

- `features/*/api/` — semua HTTP endpoint klien terpusat di `lib/api/endpoints/`.
- `features/*/patterns/` — seluruh pattern CRUD reusable di `components/crud/`.
- `src/constants/`, `src/stores/`, `src/styles/`, `src/validations/`, `src/server/` — **tidak ditambahkan sebagai direktori kosong persiapan**. Bila kebutuhan nyata muncul, lakukan penambahan yang terjustifikasi dan catat alasan.
- `apps/mobile/` dan `apps/backend/` hanya menampung PRD roadmap; jangan tambahkan kode aplikasi Tahap 2/3 pada Tahap 1.
- `packages/api-client/` TypeScript terpisah — belum perlu; klien TS hanya dipakai frontend, sedangkan Flutter nantinya memanfaatkan OpenAPI.

---

## 7. API contract, endpoints, dan response envelope

### 7.1 Prefix dan operasi standar

Business REST API menggunakan `/api/v1`.

| Resource   | List / Create                  | Get / Update / Delete                       |
| ---------- | ------------------------------ | ------------------------------------------- |
| Users      | `GET, POST /api/v1/users`      | `GET, PATCH, DELETE /api/v1/users/:id`      |
| Countries  | `GET, POST /api/v1/countries`  | `GET, PATCH, DELETE /api/v1/countries/:id`  |
| Provinces  | `GET, POST /api/v1/provinces`  | `GET, PATCH, DELETE /api/v1/provinces/:id`  |
| Cities     | `GET, POST /api/v1/cities`     | `GET, PATCH, DELETE /api/v1/cities/:id`     |
| Menus      | `GET, POST /api/v1/menus`      | `GET, PATCH, DELETE /api/v1/menus/:id`      |
| Parameters | `GET, POST /api/v1/parameters` | `GET, PATCH, DELETE /api/v1/parameters/:id` |

`GET /api/v1/menus` untuk kebutuhan sidebar harus menjalankan filter permission; bila perlu kontrak khusus untuk menu navigasi efektif, tambahkan endpoint eksplisit dan dokumentasikan di OpenAPI (misalnya `/api/v1/menus/navigation`), tanpa membuat aturan security bergantung pada UI.

### 7.2 Query list yang distandardisasi

Contoh:

```http
GET /api/v1/users?page=1&pageSize=20&search=andi&sortBy=name&sortOrder=asc
```

- `page`: integer mulai 1; default 1.
- `pageSize`: default 20; batas maksimum, misalnya 100.
- `search`: string, normalized dan dibatasi panjangnya.
- `sortBy`: whitelist field spesifik resource.
- `sortOrder`: `asc` atau `desc`.
- Filters domain seperti `countryId` atau `provinceId` didefinisikan eksplisit di schema masing-masing.
- Hasil list ditata stabil dengan secondary sort saat perlu, agar pagination deterministik.
- Kontrak pagination/filters menjadi bagian dari Zod/OpenAPI dan test.

### 7.3 Envelope DIKUNCI

**Berhasil — detail/create/update:**

```json
{
  "data": { "id": "example-id", "name": "Example" },
  "meta": null,
  "error": null
}
```

**Berhasil — list:**

```json
{
  "data": [{ "id": "example-id", "name": "Example" }],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  },
  "error": null
}
```

**Error:**

```json
{
  "data": null,
  "meta": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input tidak valid",
    "details": {
      "name": ["Nama wajib diisi"]
    }
  }
}
```

**Konvensi:**

- `data`, `meta`, `error` selalu ada untuk response JSON bisnis; gunakan `null` saat tidak berlaku.
- HTTP `201` untuk create; HTTP `200` untuk read/update; HTTP `204` delete sukses **tanpa body** jika operasi benar-benar menghapus; bila operasi disable mengembalikan resource, gunakan `200` dan envelope.
- HTTP `400` query salah, `401` unauthenticated, `403` forbidden, `404` not found, `409` conflict, `422` semantic validation jika dipakai secara konsisten, `429` rate limit, `500` error server.
- Error internal/stacktrace/database detail tidak pernah bocor ke response produksi; log mengandung correlation/request id yang dapat ditelusuri tanpa data sensitif.
- Semua API endpoint bisnis menggunakan auth+permission check server-side, bukan hanya hide action button.
- `GET` dan mutation tidak menggunakan Server Actions sebagai transport utama.
- **Pengecualian:** `/api/auth/*` mengikuti request/response native Better Auth, termasuk mekanisme session dan cookie; tidak dipaksa envelope.

### 7.4 Zod → OpenAPI → Klien lintas platform

1. Definisikan schema `create`, `update`, `query`, `entity/read` dan envelope di `packages/contracts`.
2. Daftarkan path, method, params, request body, response status dan auth scheme pada OpenAPI registry.
3. Hasilkan `packages/contracts/generated/openapi.json` secara deterministik.
4. CI menjalankan generator lalu memeriksa file generated sinkron (tanpa drift); invalid schema/generation menggagalkan CI.
5. Response nyata diuji terhadap schema status yang berlaku; OpenAPI bukan sekadar dokumentasi palsu.
6. Saat Tahap 2, kontrak yang sama dapat menghasilkan typed Dart client; saat Tahap 3, backend Go diuji pada kontrak yang sama.

**Aturan compatibility:** perubahan menambah field optional boleh dievaluasi kompatibilitasnya; menghapus/rename field, mengubah makna status, atau mengubah envelope wajib review/versioning.

---

## 8. Authentication, authorization, dan security

### 8.1 Auth Tahap 1

- Better Auth dengan email/password dan session cookie yang aman.
- Login `/login`, logout, protected dashboard, change password.
- Registrasi publik **disabled**; provisioning user melalui admin.
- Minimal seed satu admin menggunakan env/bootstrap yang aman, jangan hardcode password produksi di repo.
- Cookie `httpOnly`, `secure` di production, `sameSite` disesuaikan origin/deployment; CSRF dan origin policy sesuai Better Auth.
- `proxy.ts` boleh digunakan untuk redirect awal/UX, tetapi **bukan security boundary utama**. Permission dan session wajib diverifikasi dalam server Route Handlers/use cases.

### 8.2 RBAC dan permissions

Minimal support: `admin`, `editor`, `viewer` atau model permission equivalent yang terdokumentasi. Detail akses final disimpan dalam satu sumber kebijakan yang dites.

| Resource/action           | Admin | Editor                   | Viewer |
| ------------------------- | ----- | ------------------------ | ------ |
| Read sesuai scope         | Ya    | Ya                       | Ya     |
| Create/update master data | Ya    | Jika diizinkan kebijakan | Tidak  |
| Delete master data        | Ya    | Jika diizinkan kebijakan | Tidak  |
| Manage users/roles/menus  | Ya    | Tidak secara default     | Tidak  |
| Manage parameters         | Ya    | Tidak secara default     | Tidak  |

Konvensi:

- Permissions diverifikasi untuk **setiap** endpoint dan action server.
- UI menyembunyikan/disables action yang tidak diizinkan untuk UX, tetapi server adalah otoritas.
- `menus` mengikuti role visibility **dan** permission nyata; menyembunyikan menu saja tidak memberikan keamanan.
- Audit minimal `createdAt`, `updatedAt`; audit trail lengkap bukan kewajiban kecuali dibutuhkan.

### 8.3 Security guardrails

- Secrets tidak boleh ada di `NEXT_PUBLIC_*`, log, test snapshots, atau repository.
- Validasi dan normalisasi request server-side; query Drizzle parameterized; sort/filter whitelisting.
- Pastikan session/cookie forwarding di server API client tidak mengirim token ke origin tidak tepercaya.
- Untuk operasi mutasi cookie-based, gunakan proteksi CSRF/origin yang relevan pada REST dan konfigurasi Better Auth.
- Rate limiting produksi menggunakan mekanisme **shared/distributed** yang konsisten dengan serverless deployment untuk login dan mutasi sensitif; rate limiting in-memory bukan solusi produksi.
- Terapkan pembatasan payload, sanitasi input tampilan, error handling terkontrol.
- Admin bootstrap dan reset password harus aman; tidak ada seeded credential baku di production.

---

## 9. Database dan migrations

### 9.1 Tabel minimum

- **Better Auth:** user, session, account, verification (sesuai adapter/versi Better Auth yang digunakan).
- **Application users metadata/permissions:** gunakan ekstensi ke model auth atau tabel linked jika diperlukan; jaga satu user identity canon.
- **countries**, **provinces**, **cities**, **menus**, **parameters**.
- Foreign key: `provinces.country_id → countries.id`, `cities.province_id → provinces.id`, `menus.parent_id → menus.id` nullable.
- Primary keys konsisten dan aman; UUID direkomendasikan. Pemilihan generator ID harus konsisten serta didukung runtime/DB target.
- Timestamp timezone-aware (`createdAt`, `updatedAt`) bila relevan.

### 9.2 Aturan database

- Drizzle schema terletak di `packages/db/src/schema/`, migration SQL di `packages/db/drizzle/`.
- Migrasi versioned/committed; `db:push` hanya boleh untuk eksperimen lokal, bukan deployment produksi.
- Constraint unique/FK/index harus nyata di DB, tidak hanya validasi form.
- Seed idempotent: admin awal yang aman, negara/provinsi/kota contoh, menu navigasi, parameter dasar. Jangan menimpa data pengguna pada re-run seed.
- Isolasi database integration test dari dev/prod, gunakan database disposable.
- Jangan mengandalkan cascade delete yang berpotensi menghilangkan data relasi tanpa konfirmasi kebijakan.

---

## 10. Pola komunikasi frontend–API

### 10.1 Browser client

`src/lib/api/client.ts` bertanggung jawab atas base URL, `fetch`, `credentials` same-origin, JSON parsing, typed response, timeout/abort, dan error normalization. Per-feature endpoint hanya ada di `src/lib/api/endpoints/<resource>.ts`.

`features/*/hooks/` memanfaatkan TanStack Query dan memanggil endpoint terpusat; hooks mengelola cache invalidation setelah mutation dan loading/error states. Komponen hanya mengonsumsi hooks dan props.

**Contoh alur:**

```text
src/app/(dashboard)/countries/page.tsx
   → features/countries/components/*
   → features/countries/hooks/use-countries.ts
   → lib/api/endpoints/countries.ts
   → lib/api/client.ts
   → GET /api/v1/countries
   → auth → validation → core use case → db repository
```

### 10.2 SSR/server client

`src/lib/api/server.ts` adalah server-only client jika Server Components memanggil REST API; ia meneruskan cookie/session **secara eksplisit dan aman** untuk permintaan yang relevan dan menggunakan URL internal terpercaya. Jangan menggunakan global authenticated fetch cache lintas user.

Untuk kebutuhan bootstrap SSR yang kompleks, pilih pendekatan konsisten yang tetap menjaga kontrak dan otorisasi. Jangan membuat bypass diam-diam yang mengakibatkan SSR menggunakan DB langsung dari UI.

### 10.3 UI forms vs API contracts

- API schemas di `packages/contracts`.
- UI-only schema boleh ada di `features/*/schemas/` untuk confirm password, display-only fields, atau conditional form validation.
- Untuk field yang sama, extend/pick dari schema contract alih-alih menggandakan sumber aturan.
- Transform form → payload diletakkan di `features/*/utils/`; field UI-only tidak dikirim.

---

## 11. Mocks untuk halaman frontend-only

`src/mocks/` **hanya** menyimpan data dummy dan helper mock sederhana bagi halaman frontend-only, prototipe visual, dan widget tanpa integrasi DB.

**Persyaratan:**

1. Data dummy tidak disebarkan langsung sebagai array di berbagai halaman/komponen.
2. Gunakan mock bertipe (`satisfies`, `z.infer`) bila merepresentasikan API entity.
3. Halaman referensi CRUD Tahap 1 **wajib menggunakan API+DB**; `mocks/` tidak boleh menjadi pengganti backend diam-diam.
4. Jika modul awalnya frontend-only kemudian integrasi API, komponen presentasional tetap dapat dipakai; sumber data dipindahkan ke query hook.
5. Jangan membuat MSW/mock server sebagai infrastruktur wajib hanya karena ada folder `mocks/`; implementasi sederhana cukup sampai kebutuhan testing berkembang.

---

## 12. Dashboard, layout, dan navigasi

- Preferences tampilan: font (Geist, Inter, Nunito, Roboto, DM Sans, Poppins, Raleway), page layout (Centered/Full Width), sidebar style (Sidebar/Inset/Floating), warna utama (Blue/Indigo/Violet/Emerald/Teal/Orange/Rose/Neutral, tingkat 600 untuk kontrol berisi pada kedua mode, dengan teks/link tingkat 700 pada mode terang dan 300 pada mode gelap), warna sidebar (delapan warna yang sama dengan warna utama ditambah White dan Gray, dipilih terpisah dengan tingkat 800 pada mode terang maupun gelap; White memakai teks gelap pada mode terang dan permukaan netral gelap pada mode gelap), warna app-body (delapan warna yang sama dengan tingkat 50 untuk mode terang dan tingkat 950 untuk mode gelap, default Neutral), border radius (None/Small/Medium/Large), scale (Small 87,5%/Medium 100%/Large 112,5%), dan Restore Defaults. Warna memakai pasangan light/dark; palet grafik tetap. Radius memakai token bersama; scale mengubah ukuran dasar font agar teks dan komponen berbasis rem mengikuti, dengan Medium sebagai default keduanya. Default dipusatkan dalam konfigurasi kode; `showPreferences` mengatur visibilitas tombol dan `persistToCookie` mengatur baca/tulis cookie font, page layout, sidebar style, radius, dan scale. Warna utama, sidebar, dan app-body tidak membaca atau menulis cookie terlepas dari flag; refresh selalu memakai default warna di kode. Jika persistence dimatikan, cookie lama diabaikan dan refresh memakai default terbaru. Theme mode terpisah dari panel Preferences, selalu disimpan ke cookie melalui toggle header, dan tidak diubah oleh Restore Defaults. Theme preset, navbar behavior, dan sidebar collapse mode tidak menjadi pilihan Preferences.
- Desain dashboard responsive desktop/mobile; sidebar dapat collapse, top header, breadcrumbs bila bermanfaat.
- Login terpisah dari authenticated layout.
- Sidebar berasal dari tabel menus untuk navigasi aktif; icon didaftarkan secara aman dalam mapping Lucide (jangan eval atau import dinamis tak tervalidasi dari DB).
- Menu aktif/bertingkat diurutkan dan difilter berdasarkan session/role; fallback navigation saat DB kosong/seed baru.
- UI state loading/error/empty pada dashboard dan grid konsisten; keyboard/accessibility tidak diabaikan.
- Halaman dashboard dapat menggunakan `mocks/dashboard.mock.ts` untuk metrik demonstrasi yang jelas dilabeli **data contoh**, bukan angka bisnis riil.

---

## 13. Konvensi coding dan reusable design

### 13.1 Naming

- File/folder: `kebab-case` (kecuali file khusus Next.js `[id]`, `(...)`, dsb).
- Komponen React: PascalCase; hooks `use*`; Zod schema dengan suffix `Schema`.
- Code modules export eksplisit; barrel/index secukupnya, hindari cyclic dependencies.
- Strict TS, hindari `any`, non-null assertion tanpa alasan, dan typed DTO duplication.

### 13.2 Dependency rules agent

1. `src/app/**/page.tsx` adalah entry point tipis yang merender komponen halaman dari `src/features/`; `src/app/api/**/route.ts` menangani HTTP/API.
2. `features/*` tidak melakukan raw `fetch` bila endpoint ada di `lib/api/endpoints/`.
3. `components/crud/` dan `components/data-grid/` **tidak** mengimpor kode khusus features.
4. Route Handler tipis: parse/auth/validate → use case → response mapper.
5. Use case Core melakukan logic dan permissions sesuai kontrak; repository interface mudah difake.
6. Repositories DB implementasi kontrak interface, bukan menaruh aturan bisnis tersebar di Drizzle query.
7. Public exports package jelas antara browser-safe/server-only agar bundling aman.
8. Tidak membuat empat versi CRUD copy-paste per feature; pola dapat diubah dengan konfigurasi/composition.
9. Jangan mengoptimalkan abstraksi berlebihan: komponen global generik dengan extension points yang jelas, tidak memaksakan seluruh form memiliki skema identik.

---

## 14. Non-functional requirements

### 14.1 Reliability & performance

- List data menggunakan pagination di database; hindari memuat semua rows untuk grid produksi.
- Mutations invalidasi query terkait secara tepat; stale cache dikontrol.
- Error states dan retry terlihat; timeout/abort menangani navigasi cepat.
- Query DB memakai index pada FK/search/sort yang relevan.
- Proses deploy mendukung stateless serverless runtime dengan connection management yang cocok.
- Hindari pengambilan data user lintas session melalui cache global.

### 14.2 Accessibility & usability

- Akses keyboard untuk dialog/sheet/menu, focus trap dan restore focus yang benar.
- Field wajib memiliki label dan error message; feedback submit tidak hilang.
- Responsive grid dan form; inline side panel berubah layout pada layar kecil.
- Delete memerlukan confirmation dan menyampaikan dampak.
- Loading/empty/error states konsisten lintas empat pola.

### 14.3 Observability & maintainability

- Structured logging dasar server (request id, status, duration bila memungkinkan) tanpa PII/secrets.
- Error mapping terpusat, pesan ramah bagi user dan error code stabil bagi client.
- README jelas untuk onboarding; PRD dan AGENTS.md menjaga konteks agent.
- Conventional code review: requirement → code → tests → docs.

---

## 15. Environment, local setup, dan deployment

### 15.1 Contoh environment variables

`/.env.example` mendokumentasikan setidaknya:

```dotenv
# Server-only; isi nilainya sendiri
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_monorepo
BETTER_AUTH_SECRET=replace-with-generated-long-random-secret
BETTER_AUTH_URL=http://localhost:3000

# Jangan menaruh DATABASE_URL / BETTER_AUTH_SECRET di NEXT_PUBLIC_*
# Nama env lain ditambahkan hanya jika implementasi membutuhkan.
```

Untuk Next.js, pastikan env yang dibutuhkan aplikasi tersedia di lokasi runtime yang benar pada monorepo; jangan mengasumsikan `.env` root otomatis terbaca aplikasi. Dokumentasikan cara memuat env untuk Drizzle CLI, seed, tests, dan Vercel.

### 15.2 Scripts root — kontrak developer experience

| Command                 | Fungsi                                          |
| ----------------------- | ----------------------------------------------- |
| `pnpm install`          | Instal workspace                                |
| `pnpm dev`              | Menjalankan Next.js development (via Turborepo) |
| `pnpm build`            | Build seluruh target yang perlu                 |
| `pnpm lint`             | Lint workspace                                  |
| `pnpm typecheck`        | TypeScript strict checks                        |
| `pnpm test`             | Unit tests                                      |
| `pnpm test:integration` | DB/API integration tests                        |
| `pnpm test:contracts`   | Test API schemas dan OpenAPI                    |
| `pnpm db:generate`      | Generate migration Drizzle                      |
| `pnpm db:migrate`       | Apply migration                                 |
| `pnpm db:seed`          | Seed awal yang aman/idempotent                  |
| `pnpm db:studio`        | Drizzle Studio                                  |
| `pnpm openapi:generate` | Generate JSON dari Zod                          |
| `pnpm openapi:check`    | Verifikasi drift artefak                        |

Agent harus mengimplementasikan root scripts di package.json yang meneruskan perintah ke package terkait; jangan hanya menuliskan tabel tanpa script nyata.

### 15.3 CI dan deploy

- GitHub Actions minimal: `pnpm install --frozen-lockfile`, lint, typecheck, unit, integration dengan service PostgreSQL, contract tests, OpenAPI check, build.
- Uji migrate dari database kosong; bila perlu uji seed idempotent (dua kali tanpa konflik).
- Vercel meng-deploy `apps/frontend` dengan root/build config yang tepat untuk pnpm monorepo.
- Prod migration dijalankan dalam langkah deployment yang terkontrol, **bukan setiap request**.
- Env production disimpan dalam Vercel secret store atau platform setara; database managed.
- Pastikan driver/database pool cocok dengan Vercel runtime.

---

## 16. Strategi testing & quality gates

### 16.1 Unit tests (wajib)

- Core use cases: create/update/delete, validation kebijakan bisnis, conflict handling, permission policies.
- Pure utilities/formatters dan mappers penting.
- State/behavior helpers Data Grid dan CRUD bila dapat diuji secara unit.
- Mock/fake repository, bukan DB sungguhan pada unit tests.

### 16.2 Integration tests (wajib)

- Drizzle repositories dengan PostgreSQL terisolasi.
- Migrasi schema dari kosong, relasi FK/unique, seed idempotent.
- Auth session handling dan protected REST handlers.
- REST list/pagination/filter/search/sort, CRUD success/error, konflik FK/unique.
- Negative tests: unauthenticated, forbidden, bad input, missing ID.

### 16.3 API contract tests (wajib)

- Seluruh endpoint `/api/v1` memiliki schema request, success response, dan error response.
- Runtime JSON cocok dengan schema Zod yang terdaftar.
- Generated OpenAPI reproducible, semua endpoint terdaftar, tidak terjadi drift.
- Pastikan `/api/auth/*` dikecualikan dari envelope bisnis dan HTTP 204 tidak memiliki body.
- Pantau breaking changes yang mengganggu kesiapan Flutter/Go.

### 16.4 UI/E2E regression (direkomendasikan)

Minimal smoke flow yang ideal: login; create/edit user via multi-page; create/edit country dialog; menu sheet; parameter inline panel; search/pagination server-side; permission denied; logout.

### 16.5 Definition of Done lintas fitur

Sebuah feature **belum selesai** apabila:

- Masih menggunakan mock data untuk fitur yang mensyaratkan persistence.
- UI berfungsi tetapi API contract belum diperbarui.
- Permission hanya dicek di frontend.
- Ada duplikasi generic Data Grid atau pattern lokal.
- Unit/integration/contract tests relevan tidak ada atau gagal.
- Migrasi tidak tersedia untuk perubahan database.
- Tidak ada dokumentasi penggunaan komponen reusable yang baru.

---

## 17. Milestone implementasi untuk agent AI (urutan kerja)

> Eksekusi secara berurutan; lakukan commit/PR kecil per milestone bila workflow mendukung. Jangan klaim checklist tercapai sampai pemeriksaan berjalan.

### M0 — Monorepo bootstrap

**Tugas:**

- [ ] Inisialisasi pnpm workspace, Turborepo, TypeScript strict, Next.js App Router.
- [ ] Tambahkan Tailwind, shadcn/ui, ESLint, konfigurasi build, `.gitignore`, `.env.example`, `README.md`, `AGENTS.md`.
- [ ] Tambahkan PostgreSQL Compose, root scripts, CI skeleton.
- [ ] Pastikan `pnpm dev`, `pnpm lint`, `pnpm typecheck`, `pnpm build` berjalan pada scaffold.

**Gate:** aplikasi kosong dapat dibuka, build hijau, config monorepo dapat diinstal ulang dari lockfile.

### M1 — Contracts, database, dan core foundation

- [ ] Buat `packages/contracts`, schema Zod/envelope/query, generator OpenAPI dan check drift.
- [ ] Buat `packages/core`: common ports/errors, use case pattern, permission abstractions.
- [ ] Buat `packages/db`: schema Drizzle, migration awal, client, repository adapters, seed.
- [ ] Tambahkan unit/integration/contract test setup dengan DB test isolated.

**Gate:** migration & seed dapat diulang, kontrak valid dan generated deterministik.

### M2 — Authentication, authorization, API infrastructure

- [ ] Integrasikan Better Auth dan session-aware dashboard.
- [ ] Login/logout/change password; disable public sign-up; bootstrap admin aman.
- [ ] Route handler helpers dan business API envelope + central error handling.
- [ ] RBAC server-side, CORS/CSRF/origin protections yang relevan.
- [ ] Basic API client browser/server dan TanStack Query provider.
- [ ] Test 401/403/valid session, never leak sensitive fields.

**Gate:** hanya authorized user dapat mengakses API; auth tests hijau.

### M3 — Global UI primitives

- [ ] Dashboard shell, sidebar DB-driven, app header, login layout.
- [ ] Komponen Data Grid generik dengan server/client modes.
- [ ] Empat komponen pola CRUD generik, form adapters dan confirm delete.
- [ ] Dokumentasikan API props/extension points dan contoh minimal.
- [ ] A11y dan responsive smoke checks.

**Gate:** semua pola dapat dirender dengan resource dummy/fixture untuk komponen, tanpa copy-paste implementasi per feature.

### M4 — Users (multi-page) + geografi (dialog)

- [ ] Users API/use cases/repository/schema; `/users`, `/users/new`, `/users/[id]`, `/users/[id]/edit`.
- [ ] Countries API + dialog CRUD.
- [ ] Provinces API + dialog CRUD dan parent country.
- [ ] Cities API + dialog CRUD dan parent province.
- [ ] Data Grid server-side, pagination/search/sort/filter; constraint dan error handling.
- [ ] Unit, integration, dan contract tests untuk tiap resource.

**Gate:** keempat modul benar-benar persist melalui REST/PostgreSQL; multi-page dan dialog terbukti reusable.

### M5 — Menus (sheet) + parameters (inline)

- [ ] Menus domain/API CRUD, tree ordering/visibility, sidebar dari DB, edit via sheet.
- [ ] Parameters domain/API CRUD, validasi type, edit via inline side panel.
- [ ] Role filters dan refresh navigation ketika menu berubah.
- [ ] Unit, integration, dan contract tests.

**Gate:** empat pola sudah digunakan pada enam halaman; sidebar persist dan menghormati permissions.

### M6 — Hardening, dokumentasi, deploy readiness

- [ ] Finalisasi README setup, deployment Vercel, contract generation, menambah feature baru.
- [ ] Audit accessibility, responsive, errors, security, caching, rate limiting production.
- [ ] Periksa CI penuh dan migration dari database kosong; jalankan seed dua kali.
- [ ] Tambahkan contoh `mocks/dashboard.mock.ts` dan label dummy yang jelas.
- [ ] Deploy staging/production hanya bila akses/env pengguna tersedia; catat bila belum dapat diverifikasi.

**Gate:** seluruh Definition of Done §18 dipenuhi.

---

## 18. Definition of Done — Tahap 1 FINAL

Tahap 1 **dianggap selesai secara implementasi hanya bila** seluruh poin berikut tervalidasi:

- [ ] Monorepo baru berjalan dari `pnpm install` dan documented setup.
- [ ] Web Next.js App Router tersedia dan dashboard responsive.
- [ ] Login/logout/change password dan proteksi session bekerja.
- [ ] RBAC diterapkan **di server** untuk API.
- [ ] PostgreSQL, Drizzle migrations, dan idempotent seed bekerja.
- [ ] Keenam modul CRUD tersedia dan menyimpan data di DB lewat `/api/v1`.
- [ ] **Users = multi-page** dengan route list/new/detail/edit.
- [ ] **Countries, Provinces, Cities = dialog**.
- [ ] **Menus = sheet**, menjadi sumber sidebar terotorisasi.
- [ ] **Parameters = inline side panel**.
- [ ] Empat pola berasal dari **global components**, bukan folder `features/*/patterns/`.
- [ ] Data Grid global berfungsi server-side untuk search/filter/sort/pagination dan mendukung client-side.
- [ ] Semua HTTP client resource berada di `src/lib/api/endpoints/`.
- [ ] Setiap kontrak API diturunkan dari Zod dan OpenAPI generated dapat diperiksa.
- [ ] Response `data/meta/error` konsisten; Better Auth/204 ditangani sebagai pengecualian.
- [ ] `src/mocks/` dipakai hanya untuk frontend-only/demo, bukan menyamarkan fitur CRUD belum selesai.
- [ ] Unit, integration, contract tests hijau di CI.
- [ ] No secret leaks, protected admin actions, dan error sanitization.
- [ ] README/AGENTS.md menjelaskan setup, scripts, struktur, testing, menambah fitur CRUD.
- [ ] Build siap untuk Vercel dan managed PostgreSQL; status deploy aktual didokumentasikan.

---

## 19. Panduan bila pengguna meminta melanjutkan development

| Pesan pengguna                 | Tindakan agent                                                                                  |
| ------------------------------ | ----------------------------------------------------------------------------------------------- |
| “Mulai development dari PRD”   | Mulai M0, lalu milestone Tahap 1 berurutan                                                      |
| “Lanjutkan Tahap 1”            | Baca status implementasi terakhir, lanjut milestone belum selesai                               |
| “Tambahkan fitur X ke Tahap 1” | Gunakan `features/X`, contracts/core/db/API, pilih pola global; perbarui PRD bila scope berubah |
| “Lanjut Tahap 2”               | Jalankan discovery dalam [PRD Tahap 2](../mobile/prd.md); **baru** tetapkan struktur Flutter    |
| “Lanjut Tahap 3”               | Jalankan discovery dalam [PRD Tahap 3](../backend/prd.md); **baru** tetapkan struktur Go        |
| “Ubah keputusan yang dikunci”  | Jelaskan konsekuensi dan usulkan revisi PRD/versioning                                          |

### 19.1 Template laporan progres agent

Pada akhir setiap sesi development, tampilkan:

```text
Milestone: Mx — [nama]
Status: belum mulai / sedang dikerjakan / selesai / terblokir
File utama yang dibuat/diubah:
- ...
Command verifikasi + hasil nyata:
- pnpm lint: PASS/FAIL/NOT RUN
- pnpm typecheck: PASS/FAIL/NOT RUN
- pnpm test: PASS/FAIL/NOT RUN
- pnpm build: PASS/FAIL/NOT RUN
Keputusan/asumsi penting:
- ...
Keterbatasan/blokir:
- ...
Langkah berikutnya:
- ...
```

### 19.2 Template menambahkan fitur CRUD baru

1. Definisikan entity, permission, relasi, create/update/query/read schemas di `packages/contracts`.
2. Tambahkan core use case + repository port di `packages/core`.
3. Tambahkan Drizzle schema/repository/migration/seed bila perlu di `packages/db`.
4. Tambahkan Route Handler `/api/v1/<resource>` dan `[id]`.
5. Tambahkan frontend centralized client `lib/api/endpoints/<resource>.ts`.
6. Tambahkan `features/<resource>/components`, `hooks`, `schemas`/`types`/`utils` **hanya yang diperlukan**.
7. Tambahkan entry point `page.tsx` pada segmen rute di `src/app/`, tempatkan UI/logika halaman di `src/features/<resource>/`, dan pilih salah satu dari empat komponen CRUD global.
8. Konfigurasikan Data Grid, permission, menu navigation.
9. Tambahkan unit, integration, API contract tests; regenerate OpenAPI; verifikasi CI.
10. Jangan membuat folder lokal `features/<resource>/api` atau `patterns`.

---

## 20. Checklist sebelum agent membuat pull request pertama

- [ ] Agent telah membaca §0–20 dalam PRD Tahap 1.
- [ ] Root repository memang baru, bukan fork repository referensi.
- [ ] `apps/frontend/prd.md` tersedia dan rujukannya dari root repositori benar.
- [ ] Scope Tahap 1 dijelaskan di README.
- [ ] `apps/mobile` dan `apps/backend` hanya berisi PRD roadmap, tanpa implementasi aplikasi.
- [ ] Workspaces dan import boundaries tidak saling melingkar.
- [ ] Semua rahasia hanya ada di environment lokal/secret store.
- [ ] Tooling/command tests dapat dijalankan dari root.
- [ ] Milestone dimulai dari M0 dan status dilaporkan jujur.

---

## 21. Lampiran: alur Tahap 1

```text
TAHAP 1 — implementasi sekarang
    Next.js Web UI
         |
         v
    Next.js REST /api/v1 ---- Better Auth web session
         |
         v
    Core use cases + Drizzle repositories
         |
         v
    PostgreSQL
```

**Keputusan final untuk saat ini:** Tahap 1 dikunci pada arsitektur, struktur, fitur, empat pola CRUD, Data Grid, dan quality gates di atas. [Tahap 2](../mobile/prd.md) dan [Tahap 3](../backend/prd.md) masih berupa roadmap, **bukan** rancangan direktori atau teknis final; keputusan implementasinya baru dibuat ketika pengguna meminta melanjutkan ke tahap tersebut.
