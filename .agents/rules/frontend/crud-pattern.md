# Pola halaman CRUD

Rules ini berlaku saat membuat atau mengubah halaman CRUD di frontend. Acuannya contoh [crud-examples](../../../apps/frontend/src/features/crud-examples/) yang memakai komponen global [components/crud](../../../apps/frontend/src/components/crud/), serta [PRD Tahap 1 §5.2](../../../apps/frontend/prd.md). Ikuti juga [Struktur folder](./structure-folder.md), [Panduan Data Grid](./data-grid.md), dan [Panduan Preferences](./preferences.md).

## Empat pilihan pola

Setiap resource memilih **satu** pola. Pola diatur lewat prop `pattern` pada `CrudResource`; jangan menyalin komponen pola ke fitur.

| Pola (`pattern`) | Route contoh         | Form create/edit/detail                                           | Cocok untuk                                                                          |
| ---------------- | -------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `page`           | `/crud/new-page`     | Halaman terpisah: `/new`, `/[id]`, `/[id]/edit`                   | Form panjang/bertahap, detail kaya, URL yang perlu dibagikan atau di-bookmark        |
| `dialog`         | `/crud/modal`        | Modal di atas daftar (`CrudDialog`, maks. `sm:max-w-lg`)          | Master data kecil (3–6 field), edit cepat tanpa pindah halaman                       |
| `sheet`          | `/crud/sheet`        | Panel overlay dari kanan (`CrudSheet`, maks. `sm:max-w-xl`)       | Form sedang/lebih tinggi dari modal, daftar tidak perlu tetap terlihat               |
| `inline`         | `/crud/panel-inline` | Panel tertanam di kanan daftar (`CrudInlinePanel`), tanpa overlay | Mengedit sambil membandingkan baris di daftar; pada mobile panel menggantikan daftar |

Pemetaan PRD: Users → `page`; Countries/Provinces/Cities → `dialog`; Menus → `sheet`; Parameters → `inline`. Halaman tersebut saat ini dihapus dari frontend (amendemen 21 Oktober 2026). Sesuai amendemen 29 Oktober 2026, halaman tersebut dibuat ulang pada milestone M4–M5 dengan data dari API dan database nyata, memakai `CrudResource` yang sama; sebelum milestone itu, jangan dibuat ulang. `/crud/*` tetap menjadi demo pola dengan data mock.

## Komponen global

| File                                                                                                                                                                                                                                                  | Tanggung jawab                                                                                                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [crud-resource.tsx](../../../apps/frontend/src/components/crud/crud-resource.tsx)                                                                                                                                                                     | Controller: daftar, tombol Tambah, view/edit/delete, konfirmasi hapus, konfirmasi buang perubahan, notice `role="status"`, fokus kembali, render pola.                                                                                                                    |
| [crud-list.tsx](../../../apps/frontend/src/components/crud/crud-list.tsx)                                                                                                                                                                             | Daftar di atas `DataGridClient` dengan konfigurasi seperti `/table/base`: kolom No, header sort, search kolom pertama, pagination `simple`, kolom Aksi terpin di kanan. Aksi baris lewat context agar kolom stabil. Dengan `basePath`, Detail/Edit menjadi link ke route. |
| [crud-form.tsx](../../../apps/frontend/src/components/crud/crud-form.tsx)                                                                                                                                                                             | Form generik dari `fields` + `schema` Zod: validasi `safeParse`, fokus ke field invalid, `id`/`createdAt`/`updatedAt` otomatis, status pending.                                                                                                                           |
| [crud-page.tsx](../../../apps/frontend/src/components/crud/crud-page.tsx)                                                                                                                                                                             | Kerangka halaman (`AppBody` + `PageHeading` + `actions`) dan slot `sidePanel` beranimasi untuk pola inline.                                                                                                                                                               |
| [crud-dialog.tsx](../../../apps/frontend/src/components/crud/crud-dialog.tsx), [crud-sheet.tsx](../../../apps/frontend/src/components/crud/crud-sheet.tsx), [crud-inline-panel.tsx](../../../apps/frontend/src/components/crud/crud-inline-panel.tsx) | Wadah form untuk masing-masing pola. Boleh dipakai terpisah oleh fitur non-CRUD (contoh: `calendar`, `project`, `ai-chat`).                                                                                                                                               |

Komponen di `components/crud/` tidak boleh mengimpor `@/features/*`, `@/mocks/*`, atau endpoint tertentu. Data, kolom, form, dan aksi simpan/hapus dipasok fitur.

## Kontrak yang dipasok fitur

```tsx
<CrudResource<T extends { id; createdAt; updatedAt }>
  title="Parameter contoh"          // nama resource; dipakai di tombol, judul panel, notice
  heading="Modal"                   // opsional, <h1> halaman (default: title)
  description="..."                 // opsional, teks di bawah heading
  pattern="page" | "dialog" | "sheet" | "inline"
  basePath="/crud/new-page"         // wajib untuk pattern="page" saja
  rows={data} ready={ready} error={error} reload={reload}
  columns={columns}                 // CrudColumn<T>[]: key, label, value, render?, width?; kolom pertama = kolom search
  label={(row) => row.key}          // teks identitas baris untuk aria-label & konfirmasi
  form={(props) => <ResourceForm {...props} />}
  onSave={(record, isNew, expectedUpdatedAt) => boolean}
  onDelete={(record) => boolean}
/>
```

- `onSave`/`onDelete` mengembalikan `true` bila berhasil. Bila `false`, panel tetap terbuka dan pesan diambil dari `error`.
- `expectedUpdatedAt` dipakai untuk deteksi konflik (data berubah di tab lain).
- `form` menerima `CrudFormProps<T>` (`layout`, `heading`, `record`, `onSave`, `onCancel`, `onDirty`, `error`). Teruskan semuanya ke `CrudForm` agar perilaku dirty/discard dan layout panel tetap bekerja.
- `CrudForm` menerima `schema`, `fields` (`text`, `email`, `number`, `textarea`, `select`, `boolean`), dan `defaults` tanpa `id`/`createdAt`/`updatedAt`. Bila form butuh UI yang tidak tercakup `fields`, buat form fitur sendiri yang tetap memenuhi `CrudFormProps<T>`.

## Struktur file contoh

```text
src/app/(backoffice)/crud/
├── page.tsx                        # redirect ke /crud/new-page
├── modal/page.tsx                  # <ExamplePage variant="modal" />
├── sheet/page.tsx                  # <ExamplePage variant="sheet" />
├── panel-inline/page.tsx           # <ExamplePage variant="panel-inline" />
└── new-page/
    ├── page.tsx                    # <ExamplePage variant="new-page" />  (daftar)
    ├── new/page.tsx                # <ExampleRecordPage mode="create" />
    └── [id]/
        ├── page.tsx                # <ExampleRecordPage mode="view" id={id} />
        └── edit/page.tsx           # <ExampleRecordPage mode="edit" id={id} />

src/features/crud-examples/
├── components/
│   ├── example-page.tsx            # kolom + peta varian → CrudResource
│   ├── example-form.tsx            # fields + schema → CrudForm
│   └── example-record-page.tsx     # halaman create/view/edit untuk pola page
├── hooks/  schemas/  types/  utils/

src/mocks/
├── crud-model.ts                   # crudSchemas (Zod) + MockEntity<T>
├── crud-examples.mock.ts           # data awal (salinan Parameter)
├── crud-examples-change.ts         # aturan save/delete: ID, konflik, key unik
└── use-crud-examples.ts            # hook localStorage: data, ready, error, reload, commit
```

Keempat route memakai satu fitur `crud-examples` dan satu sumber data, sehingga perubahan di satu pola terlihat di pola lain.

## Langkah membuat halaman CRUD baru

1. **Pilih pola** dari tabel di atas. Untuk `page`, siapkan juga route `new/`, `[id]/`, dan `[id]/edit/`.
2. **Buat fitur** `src/features/<resource>/` dengan lima folder standar.
3. **Schema dan tipe.** Selama frontend-only, gunakan/ tambahkan schema di `mocks/crud-model.ts` (`crudSchemas.<resource>`) dan tipe `MockEntity<"<resource>">`. Setelah API ada, schema berasal dari `packages/contracts`; schema khusus UI di `features/<resource>/schemas/<resource>-form.schema.ts`, tipe UI di `types/`.
4. **Sumber data (hook).** Kontrak hook: `{ data, ready, error, reload, commit }`. Saat ini contoh memakai hook mock di `src/mocks/`; saat API tersedia, buat `features/<resource>/hooks/use-<resource>.ts` berbasis TanStack Query yang memanggil `lib/api/endpoints/<resource>.ts`, lalu ganti sumber data tanpa mengubah komponen.
5. **Form.** `components/<resource>-form.tsx`: definisikan `fields` dan bungkus `CrudForm` dengan `schema` dan `defaults`.
6. **Daftar.** `components/<resource>-page.tsx` (`"use client"`): definisikan `columns` dan render `CrudResource` dengan pola terpilih. Kolom dengan `render` JSX tetap di `components/`; helper murni (format, mapper) di `utils/`.
7. **Pola page saja.** Buat `components/<resource>-record-page.tsx` dengan `CrudPage` untuk mode `create`/`view`/`edit`, mengikuti `ExampleRecordPage`: guard `beforeunload` saat dirty, konfirmasi buang perubahan, state loading (`Skeleton`), data tidak ditemukan (`Empty`), error + tombol muat ulang, lalu `router.push` ke detail setelah simpan.
8. **Route.** `page.tsx` tipis dengan `metadata`; untuk `[id]`, `await params` lalu render dengan `key={id}`.
9. **Navigasi.** Daftarkan di `components/layout/app-navigation.tsx` dan `menu-search-tree.ts`.
10. **Verifikasi.** `pnpm --filter frontend check-types` dan `pnpm --filter frontend lint`, lalu cek manual: tambah, lihat, edit, hapus, validasi field, konfirmasi buang perubahan, konflik antar-tab, keyboard/fokus, mobile, light/dark.

## Perilaku yang tidak boleh hilang

- Validasi Zod di form dan lagi saat commit; pesan error per field dan fokus ke field invalid pertama.
- Konfirmasi sebelum hapus; konfirmasi sebelum menutup form yang dirty. Tombol Tambah dinonaktifkan saat data belum siap atau panel terbuka.
- Hapus tidak optimistis tanpa feedback; kegagalan ditampilkan lewat `error` dengan tombol "Coba muat ulang".
- Fokus dikembalikan ke pemicu setelah dialog/sheet/panel ditutup; aksi baris memiliki `aria-label` berisi `label(row)`.
- Pola inline: panel `md:w-[min(28rem,45cqw)]` di kanan, menggantikan daftar di mobile, dan animasi menghormati reduced motion.
- Teks UI CRUD berbahasa Indonesia, mengikuti contoh.

## Yang tidak boleh dilakukan

- Menyalin `CrudResource`, `CrudList`, atau wadah pola ke fitur, atau membuat `features/*/patterns/`.
- Membuat empat versi komponen per pola untuk satu resource; gunakan prop `pattern`.
- Membentuk URL endpoint otomatis dari nama resource di komponen global; adapter data diberikan fitur.
- Menyimpan data CRUD baru di localStorage di luar pola hook mock yang ada, atau menganggap hook mock sebagai otorisasi server.
- Memakai `basePath` untuk pola selain `page`.

## Batasan saat ini

- `CrudList` memakai `DataGridClient` (mode client) karena data contoh ada di browser. Search hanya pada kolom pertama `columns` (search client bersifat per kolom), jadi taruh kolom identitas (key/nama) di urutan pertama. Facet/filter tambahan dan mode `DataGridServer` belum tersedia lewat `CrudResource`; saat API tersedia, perluas `CrudList` alih-alih membuat tabel baru di fitur.
- Belum ada permissions (`create`/`update`/`delete`) pada `CrudResource`; PRD mensyaratkannya bersama auth server.
- Semua data adalah contoh di browser (localStorage); reload tidak menghapusnya, tetapi tidak ada sinkronisasi server.
