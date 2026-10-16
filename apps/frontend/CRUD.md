# CRUD frontend-only

Halaman mengikuti perilaku [referensi](https://github.com/banuwit/template-nextjs-drizzle/tree/main/src/app) dan pemetaan [PRD §5](./prd.md). Ini adalah pratinjau frontend, belum menyelesaikan milestone API/database M4–M5.

| Halaman                                                   | Pola                                       |
| --------------------------------------------------------- | ------------------------------------------ |
| `/users`, `/users/new`, `/users/[id]`, `/users/[id]/edit` | Multi-page                                 |
| `/countries`, `/provinces`, `/cities`                     | Dialog                                     |
| `/menus`                                                  | Sheet                                      |
| `/parameters`                                             | Panel inline; daftar tetap dapat digunakan |

`/user` lama mengarahkan ke `/users`. Semua halaman tersedia di grup **Master Data** dan pencarian menu.

Panel inline menempel di kanan tepat di bawah header aplikasi, menyerupai sheet tanpa backdrop. Panel menjadi saudara dari seluruh AppBody, sehingga breadcrumb, page heading, tombol, dan tabel menyempit bersama. Pada layar di bawah 768px, panel memenuhi area konten dan daftar disembunyikan sementara tanpa kehilangan filter/pagination. Header panel hanya menampilkan judul dan tombol Simpan/Batal sejajar di kanan, tanpa deskripsi atau tombol tutup/kembali. Pada mode detail tersedia Batal untuk menutup panel. Header selalu terlihat dan area field memiliki padding safe-area. Hanya field form yang bergulir. Kontrol sentuh diperbesar dan input memakai font 16px untuk mencegah zoom otomatis iOS. Penutupan form yang berubah memerlukan konfirmasi; fokus kembali ke pemicu setelah ditutup.

## Data dan aturan

- [Fixtures](./src/mocks/crud.mock.ts) dan [hook mock](./src/mocks/use-crud-data.ts) menyimpan perubahan pada localStorage `workspace-crud-v1`; perubahan tetap tersedia setelah reload dan navigasi antarhalaman. Tidak ada request API atau penyimpanan database.
- [Schema dan aturan mock](./src/mocks/crud-model.ts) menggunakan Zod. Kode country, email user, dan key parameter unik; kode province unik dalam satu country. Parent geografi wajib valid, penghapusan parent yang masih dipakai ditolak.
- Menu menolak path eksternal dan siklus parent. Menu aktif difilter memakai role demo `admin`, lalu diurutkan untuk sidebar dan pencarian. Hierarki ditampilkan sebagai `Parent / Child`. Ini hanya pratinjau visibilitas, bukan otorisasi server.
- Akun demo Banu dan admin aktif terakhir dilindungi dari penghapusan/perubahan role/status. Form user tidak membuat kredensial login.
- Nilai parameter divalidasi sesuai tipe string, number, boolean, atau JSON. Hanya konfigurasi umum yang boleh disimpan, bukan secret.
- Jika storage rusak/tidak tersedia, tampilkan error dan cegah penimpaan. Jika penulisan gagal, form tetap terbuka.

## Komponen bersama

[CrudResource](./src/components/crud/crud-resource.tsx) menerima `rows`, `columns`, `filters`, `label`, `form`, `onSave`, `onDelete`, status `ready/error`, serta `reload`. Adapter data dipasok oleh fitur; komponen global tidak mengimpor mock atau domain.

`pattern` memilih `page`, `dialog`, `sheet`, atau `inline`. Untuk multi-page, `basePath` membentuk tautan halaman UI dan route Next.js tetap didefinisikan secara nyata. [CrudPage](./src/components/crud/crud-page.tsx) juga dipakai oleh form/detail user. [CrudList](./src/components/crud/crud-list.tsx) memakai Data Grid global yang sudah ada untuk search, sort, filter, pagination, dan visibilitas kolom. [CrudForm](./src/components/crud/crud-form.tsx) menerima schema Zod, field, default, dan callback; form khusus fitur tetap dapat dipasok langsung.

Saat API tersedia, ganti hook mock pada fitur dengan TanStack Query dan endpoint terpusat sesuai PRD. Pindahkan kontrak bisnis ke package contracts; validasi dan izin final wajib dijalankan di server.

## Verifikasi

Gunakan Node 24+ dan pnpm workspace:

```sh
pnpm --filter frontend check-types
pnpm --filter frontend lint
pnpm --filter frontend test:ui
pnpm --filter frontend build
```

Tes UI lama membutuhkan dev server pada port 3000. Untuk aturan CRUD saja: `pnpm --filter frontend exec node --test tests/crud.test.mjs`.
