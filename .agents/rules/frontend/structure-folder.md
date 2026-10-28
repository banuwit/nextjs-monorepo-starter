# Struktur folder fitur frontend

Keputusan pengguna, 24 Oktober 2026: setiap fitur memiliki lima folder standar, meskipun masih kosong. Ketentuan ini menggantikan ketentuan PRD yang sebelumnya membuat folder fitur hanya ketika diperlukan. Lihat [panduan repositori](../../../AGENTS.md) dan [PRD Tahap 1](../../../apps/frontend/prd.md) untuk batas arsitektur lainnya.

## Struktur wajib

```text
apps/frontend/src/features/<fitur>/
├── components/
├── hooks/
├── schemas/
├── types/
└── utils/
```

- Kelima folder wajib ada di perangkat lokal, termasuk ketika belum memiliki file.
- Jangan membuat `.gitkeep`, file placeholder, atau ekspor kosong untuk mempertahankan folder. Penyimpanan folder kosong di Git belum menjadi kebutuhan.
- Aturan berlaku untuk fitur utama, subfitur/varian halaman, dan folder induk kelompok fitur. Contoh: `dashboard/`, `dashboard/sales/`, `authentication/auth-1/`, `table/editable/`, dan `table/editable/sheet/` masing-masing memiliki lima folder tersebut.
- Folder standar tidak perlu memiliki lima subfolder standar lagi. Buat subfolder di dalamnya hanya bila diperlukan untuk mengelompokkan file nyata.
- Kerangka fitur yang sudah ada, seperti `users/`, `menus/`, `parameters/`, dan varian `chart/`, tetap mengikuti struktur ini. Keberadaan folder tidak berarti halaman atau fungsinya telah diimplementasikan.

## Penempatan file

| Folder        | Isi                                                                                                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/` | Komponen halaman, form, tabel, widget, renderer, serta CSS dan pemetaan ikon yang khusus untuk komponen fitur.                                                                                |
| `hooks/`      | Custom React hooks khusus fitur; nama file menggunakan awalan `use-`.                                                                                                                         |
| `schemas/`    | Schema validasi dan konfigurasi schema dokumen/editor. Gunakan nama seperti `invoice.schema.ts`; pertahankan aturan validasi yang sudah ada.                                                  |
| `types/`      | Tipe dan interface fitur. Tipe hasil schema diturunkan dengan `z.infer`; gunakan `import type` untuk dependensi tipe. Props yang hanya dipakai satu komponen boleh tetap bersama komponennya. |
| `utils/`      | Fungsi bantu, formatter, mapper, reducer, filter, parser, serta konstanta/pilihan UI khusus fitur.                                                                                            |

Jangan menaruh modul kode langsung di root fitur atau root kelompok fitur. Dokumen seperti `README.md` dan `LICENSE` boleh tetap di root. Modul model yang berisi campuran schema, tipe, dan fungsi dipisahkan sesuai tanggung jawabnya tanpa mengubah perilaku.

## Subfitur dan kode bersama

- Setiap varian halaman memiliki struktur yang sama. Contohnya, masing-masing varian login dan tabel mempunyai lima folder standar sendiri.
- Kode yang dipakai beberapa varian dalam kelompok yang sama ditempatkan pada folder standar milik kelompok tersebut. Contoh: validator, tipe, dan reducer editing tabel bersama berada di `table/editable/schemas/`, `table/editable/types/`, dan `table/editable/utils/`.
- Empat pola CRUD contoh tetap memakai fitur bersama `crud-examples/`; jangan menggandakan komponen untuk setiap route.
- Komponen lintas fitur dan primitives shadcn berada di `src/components/`. Data Grid dan pola CRUD global tetap terpusat di sana.
- Entry point route, layout, dan Route Handler tetap di `src/app/`. Data contoh tetap di `src/mocks/`.
- Endpoint HTTP frontend tetap terpusat di `src/lib/api/endpoints/`. Jangan membuat folder `api/` atau `patterns/` di dalam fitur.
- Pertahankan provider dan token global sesuai [Panduan Preferences](./preferences.md).

## Saat merapikan atau menambahkan fitur

1. Pastikan kelima folder standar tersedia, termasuk pada subfitur yang ditambahkan.
2. Tempatkan file sesuai tanggung jawab; pertahankan nama ekspor, perilaku, validasi, dan batas Server/Client Component.
3. Perbarui seluruh import/export, termasuk pemakai dari route, mock, dan fitur lain. Gunakan impor modul langsung; jangan menambahkan barrel hanya untuk mempertahankan lokasi lama.
4. Jaga agar dependensi runtime tidak melingkar; referensi tipe memakai `import type`.
5. Periksa tidak ada modul kode yang tertinggal di root fitur, impor yang menunjuk lokasi lama, atau file `.gitkeep` baru.
6. Jalankan `pnpm --filter frontend check-types` dan `pnpm --filter frontend lint`, lalu laporkan hasil sebenarnya. Jalankan pengujian perilaku bila refaktor turut mengubah perilaku.

Folder kosong dibuat langsung pada filesystem lokal. Checkout Git baru tidak otomatis membentuknya; pembuatan ulang folder tersebut belum diotomatisasi.
