# Panduan repositori

## Kondisi saat ini dan sumber acuan

- `apps/frontend` adalah aplikasi Next.js dan satu-satunya aplikasi yang berisi kode; `apps/mobile` dan `apps/backend` baru berisi `prd.md`. `packages/eslint-config` dan `packages/typescript-config` berisi konfigurasi bersama. Paket contoh `packages/ui` telah dihapus karena tidak digunakan.
- Versi stack lebih baru dari data pelatihan umum: Next.js 16 (ikuti `apps/frontend/AGENTS.md`), React 19, Tailwind CSS v4, Zod 4, TanStack Table v9, TypeScript 7, dan ESLint 10.
- Belum ada API atau database. Setiap fitur memakai fixture di `apps/frontend/src/mocks/*.mock.ts`. Contoh CRUD menyimpan perubahan di localStorage melalui `use-crud-data.ts`/`use-crud-examples.ts`, dengan aturan Zod di `crud-model.ts`; hook mock inilah yang nanti diganti TanStack Query dan endpoint terpusat sesuai PRD. Ini hanya pratinjau, bukan otorisasi server.
- [PRD Tahap 1](apps/frontend/prd.md) adalah spesifikasi yang disetujui untuk `app-monorepo-starter` yang akan dibangun. Dokumen tersebut menjelaskan arsitektur target dan milestone, bukan fitur yang sudah tersedia di repositori ini. Baca seluruh isinya sebelum mengerjakan produk dan ikuti keputusan yang ditandai **DIKUNCI** serta urutan milestone Tahap 1. [PRD Tahap 2](apps/mobile/prd.md) dan [PRD Tahap 3](apps/backend/prd.md) masih berupa roadmap; jangan mulai implementasinya kecuali diminta pengguna.
- Starter saat ini berbeda dari PRD dalam nama aplikasi, paket, skrip, dan fungsionalitas. Periksa file yang benar-benar ada sebelum melaporkan progres; jangan menyatakan milestone selesai hanya berdasarkan PRD.
- Sesuai amendemen UI terbaru, navigasi Documentation berisi empat contoh pola CRUD di `/crud/*`. Halaman frontend User, Country, Menu, Parameter, Province, dan City telah dihapus; rujuk amendemen pada PRD sebelum memakai peta halaman baseline. Sesuai amendemen 29 Oktober 2026, halaman resource tersebut dibuat ulang pada milestone M4–M5 saat API dan database tersedia, sedangkan `/crud/*` tetap demo mock. Amendemen tanggal yang sama mengunci abstraksi auth server (`getPrincipal`), migrasi SQL bebas Drizzle, dan contract test HTTP black-box; baca sebelum mengerjakan M1–M2.

## Bekerja di repositori ini

- Gunakan `pnpm` (paket root menetapkan `pnpm@11.25.0` dan Node.js 24 atau lebih baru). Workspace didefinisikan dalam `pnpm-workspace.yaml`.
- Skrip root yang tersedia saat ini adalah `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm check-types`, dan `pnpm format` (yang menulis ulang file). Aplikasi frontend berjalan pada port 3000. Pengujian, skrip database, dan `pnpm typecheck` masih merupakan target PRD dan belum dikonfigurasi.
- Untuk frontend saja, gunakan `pnpm --filter frontend <dev|check-types|lint|build>`. `check-types` menjalankan `next typegen && tsc --noEmit`; `lint` memakai `--max-warnings 0` sehingga warning juga menggagalkan pemeriksaan. Karena belum ada test runner, verifikasi dengan check-types, lint, build, dan pemeriksaan manual di dev server. Tambahkan primitive shadcn dengan `pnpm dlx shadcn@latest add <nama-komponen>` dari `apps/frontend` (hasilnya di `src/components/ui/`).
- Di frontend, gunakan `src/app/` untuk entry point rute, layout, dan Route Handler; simpan UI/logika halaman khusus fitur di `src/features/<fitur>/`. Komponen shadcn dan komponen lintas fitur tetap di `src/components/`; buat paket UI bersama hanya saat ada komponen yang benar-benar dibagikan antar-aplikasi. Jaga impor antar-paket dan konfigurasi TypeScript/ESLint sesuai workspace saat ini.
- Komponen global yang dipakai ulang, bukan disalin ke fitur: `src/components/crud/` (`CrudResource` memilih pola `page`/`dialog`/`sheet`/`inline`, daftarnya memakai `DataGridClient`; adapter data dipasok fitur, komponen global tidak mengimpor mock atau domain; ikuti [Pola halaman CRUD](.agents/rules/frontend/crud-pattern.md)), `src/components/data-grid/` (`DataGridClient` untuk data lokal, `DataGridServer` untuk halaman REST; ikuti [Panduan Data Grid](.agents/rules/frontend/data-grid.md)), `src/components/filter/` (`SearchFilter`, `SelectFilter`, `ComboboxFilter`, `FacetedFilter` untuk toolbar; helper filter chip ReUI di `advanced/` dan builder grup AND/OR di `group/`; ikuti [Panduan komponen Filter](.agents/rules/frontend/filter.md)), `src/components/chart/`, dan `src/components/gantt/`. Demo CRUD aktif ada di `/crud/{new-page,modal,sheet,panel-inline}`; demo filter ada di `/filter/{base,advance,group}`.
- `src/components/reui/` adalah kode vendor ReUI (`Filters` dan `cascader`) yang dipasang lewat registry `@reui` di `components.json`. Jangan timpa `src/components/ui/button.tsx` saat `shadcn add` karena berisi token Preferences; override ESLint untuk folder vendor ini hanya ada di `apps/frontend/eslint.config.js`.
- Shell backoffice disusun di `src/app/(backoffice)/layout.tsx` (sidebar, header, pembungkus multi-sidebar). Menu navigasi dan pencarian menu didefinisikan di `src/components/layout/app-navigation.tsx` dan `menu-search-tree.ts`. Setiap halaman memakai `PageHeading` untuk breadcrumb dan `<h1>` di dalam `AppBody`.
- Untuk pekerjaan API, Postman CLI tersedia di `/Users/banurusman/.local/bin/postman` (tidak ada di `PATH`).
- Jalankan pemeriksaan yang relevan dengan file yang diubah, lalu laporkan perintah dan hasil sebenarnya. Pertahankan blok Turborepo yang dikelola di bawah ini; sebelum mengubah konfigurasi atau perintah Turborepo, ikuti petunjuk dokumentasi terpasangnya.

## Rules dan skill di `.agents/`

`.agents/` adalah sumber tunggal rules dan skill untuk semua agen AI; `.claude` merupakan symlink ke folder ini dan `CLAUDE.md` merupakan symlink ke file ini. Sebelum mengerjakan tugas, tentukan area file yang disentuh, baca rules yang relevan sampai selesai, lalu gunakan skill yang cocok. Agen yang tidak memuat skill otomatis harus membaca `.agents/skills/<nama>/SKILL.md` secara langsung.

Urutan prioritas jika terjadi konflik: instruksi pengguna, keputusan **DIKUNCI** di PRD, file ini, `.agents/rules/`, lalu skill. Skill bersifat umum; jangan biarkan saran skill menggantikan komponen global, token Preferences, atau struktur folder repositori ini.

**Rules** (wajib dibaca saat area tersebut disentuh):

| Area tugas                                                                                                              | Rules                                                                     |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Membuat file, folder, fitur, atau subfitur di `apps/frontend/src/`                                                      | [structure-folder.md](.agents/rules/frontend/structure-folder.md)         |
| Halaman/komponen frontend, dashboard shell, tema, warna, layout, Preferences                                            | [preferences.md](.agents/rules/frontend/preferences.md)                   |
| Tabel, daftar, toolbar grid, `src/components/data-grid/`                                                                | [data-grid.md](.agents/rules/frontend/data-grid.md)                       |
| Filter (toolbar, chip, builder grup), `src/components/filter/`, `src/components/reui/filters/`, `src/features/filter/`   | [filter.md](.agents/rules/frontend/filter.md)                             |
| Membuat/mengubah halaman CRUD (pola page, dialog, sheet, inline), `src/components/crud/`, `src/features/crud/` | [crud-pattern.md](.agents/rules/frontend/crud-pattern.md)                 |
| `apps/mobile` (Tahap 2) dan `apps/backend` (Tahap 3)                                                                    | `.agents/rules/mobile/` dan `.agents/rules/backend/` (belum berisi rules) |

Tambahkan rules baru di subfolder area yang sesuai (`frontend/`, `mobile/`, `backend/`) dan daftarkan di tabel ini.

**Skill** (pakai sesuai tugas):

| Tugas                                                                       | Skill                                                           |
| --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Route, layout, Server/Client Component, Route Handler, metadata, font/image | `next-best-practices`                                           |
| Performa React/Next.js, data fetching, ukuran bundle                        | `vercel-react-best-practices`                                   |
| API komponen yang dapat dipakai ulang, compound component, props berlebihan | `vercel-composition-patterns`                                   |
| Menambah, menyesuaikan, atau men-debug primitive di `src/components/ui/`    | `shadcn`                                                        |
| Token desain dan pola Tailwind CSS v4                                       | `tailwind-design-system`                                        |
| Merancang UI atau halaman baru, arah visual, aksesibilitas, layout          | `frontend-design`, `ui-ux-pro-max`                              |
| Review UI, UX, dan aksesibilitas                                            | `web-design-guidelines`                                         |
| `turbo.json`, pipeline task, cache, filter workspace                        | `turborepo`                                                     |
| Autentikasi dengan Better Auth                                              | `create-auth` (hanya saat milestone autentikasi PRD dikerjakan) |
| Gaya kerja atau komunikasi                                                  | `ponytail`, `caveman`, `grill-me` (hanya jika diminta pengguna) |

Skill dipasang dari sumber eksternal dan dicatat di `skills-lock.json`; jangan mengubah isi skill secara manual kecuali diminta pengguna.

<!-- BEGIN:turborepo-agent-rules -->

# Ini bukan Turborepo yang Anda kenal

Konfigurasi, perilaku tugas, dan perintah CLI Turborepo dapat berbeda antarversi terpasang dan mungkin tidak sesuai dengan data pelatihan Anda. Temukan paket `turbo` dari direktori file ini atau workspace yang relevan; dalam monorepo, paket tersebut mungkin tidak terlihat dari root repositori. Misalnya, jalankan `node -p "require.resolve('turbo/package.json')"` dari workspace yang bergantung pada `turbo`.

Baca `docs/README.md` di dalam paket terpasang tersebut terlebih dahulu, lalu baca halaman yang relevan dari direktori `docs/` sebelum mengubah konfigurasi atau perintah Turborepo. Perhatikan pemberitahuan deprecasi. Dokumentasi bawaan tersebut sesuai dengan versi paket yang terpasang dan dapat dibaca tanpa akses jaringan.

Blok ini ditulis dan ditambahkan kembali oleh `turbo` sebelum perintah dalam cakupan repositori dijalankan ketika agen AI terdeteksi. Dalam repositori sumber Turborepo, templatnya berada di `crates/turborepo-cli/src/cli/agent_guidance.rs`. Jika blok yang dikelola ini dihapus saat pembaruan aktif, pemanggilan berikutnya yang memenuhi syarat akan menambahkannya kembali. Tetapkan `"agentGuidance": true` dalam `turbo.json` atau `turbo.jsonc` di root untuk mengaktifkannya; pengaturan ini tidak menghapus blok yang sudah ada. Sertakan blok ini dalam commit agar pemanggilan agen berikutnya tidak menghasilkan perubahan yang belum di-commit.

# Aturan pengembangan untuk agen AI

1. Baca [PRD Tahap 1](apps/frontend/prd.md) sebelum memulai pengembangan; baca PRD tahap berikutnya hanya saat tahap itu diminta pengguna.
2. Ikuti arsitektur Tahap 1 yang ditandai **DIKUNCI**.
3. Jangan implementasikan Tahap 2 atau Tahap 3 tanpa persetujuan pengguna.
4. Jangan menggandakan komponen CRUD atau Data Grid global.
5. Pusatkan endpoint HTTP frontend.
6. Gunakan kontrak Zod sebagai sumber acuan API.
7. Terapkan pemeriksaan izin di server.
8. Tulis pengujian untuk perilaku baru.
9. Jalankan pemeriksaan yang relevan sebelum menyelesaikan setiap tugas.
10. Laporkan file yang diubah, pengujian, dan masalah yang belum terselesaikan.

<!-- END:turborepo-agent-rules -->
