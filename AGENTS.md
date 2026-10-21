# Panduan repositori

## Kondisi saat ini dan sumber acuan

- Kode aplikasi masih berupa starter Turborepo: `apps/frontend` adalah aplikasi contoh Next.js, `packages/ui` berisi komponen UI yang dapat dipakai ulang, sedangkan `packages/eslint-config` dan `packages/typescript-config` berisi konfigurasi bersama.
- [PRD Tahap 1](apps/frontend/prd.md) adalah spesifikasi yang disetujui untuk `app-monorepo-starter` yang akan dibangun. Dokumen tersebut menjelaskan arsitektur target dan milestone, bukan fitur yang sudah tersedia di repositori ini. Baca seluruh isinya sebelum mengerjakan produk dan ikuti keputusan yang ditandai **DIKUNCI** serta urutan milestone Tahap 1. [PRD Tahap 2](apps/mobile/prd.md) dan [PRD Tahap 3](apps/backend/prd.md) masih berupa roadmap; jangan mulai implementasinya kecuali diminta pengguna.
- Starter saat ini berbeda dari PRD dalam nama aplikasi, paket, skrip, dan fungsionalitas. Periksa file yang benar-benar ada sebelum melaporkan progres; jangan menyatakan milestone selesai hanya berdasarkan PRD.
- Sesuai amendemen UI terbaru, navigasi Documentation berisi empat contoh pola CRUD di `/crud/*`. Halaman frontend User, Country, Menu, Parameter, Province, dan City telah dihapus; rujuk amendemen pada PRD sebelum memakai peta halaman baseline.

## Bekerja di repositori ini

- Gunakan `pnpm` (paket root menetapkan `pnpm@11.25.0` dan Node.js 24 atau lebih baru). Workspace didefinisikan dalam `pnpm-workspace.yaml`.
- Skrip root yang tersedia saat ini adalah `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm check-types`, dan `pnpm format` (yang menulis ulang file). Aplikasi frontend berjalan pada port 3000. Pengujian, skrip database, dan `pnpm typecheck` masih merupakan target PRD dan belum dikonfigurasi.
- Di frontend, gunakan `src/app/` untuk entry point rute, layout, dan Route Handler; simpan UI/logika halaman khusus fitur di `src/features/<fitur>/`. Komponen shadcn dan komponen lintas fitur tetap di `src/components/`; gunakan `packages/ui` hanya untuk komponen yang benar-benar dibagikan antar-aplikasi. Jaga impor antar-paket dan konfigurasi TypeScript/ESLint sesuai workspace saat ini.
- Sebelum membuat atau mengubah halaman/komponen frontend, dashboard shell, tema, atau Preferences, baca dan ikuti [Panduan Preferences](.agents/rule/preferences.md). Gunakan provider, pembungkus konten, dan token tampilan yang sudah tersedia agar halaman mengikuti pengaturan global; ikuti aturan reset, persistensi, dan verifikasi dalam panduan tersebut.
- Untuk pekerjaan API, Postman CLI tersedia di `/Users/banurusman/.local/bin/postman` (tidak ada di `PATH`).
- Jalankan pemeriksaan yang relevan dengan file yang diubah, lalu laporkan perintah dan hasil sebenarnya. Pertahankan blok Turborepo yang dikelola di bawah ini; sebelum mengubah konfigurasi atau perintah Turborepo, ikuti petunjuk dokumentasi terpasangnya.

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
