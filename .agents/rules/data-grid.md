# Panduan Data Grid

Panduan ini berlaku saat memakai atau mengubah komponen global di [data-grid](../../apps/frontend/src/components/data-grid/) dan kontrol filternya di [filters](../../apps/frontend/src/components/filters/). Ikuti juga [PRD Tahap 1](../../apps/frontend/prd.md) dan [Panduan Preferences](./preferences.md). Jangan menyalin implementasi grid ke setiap fitur.

## Pilih mode yang tepat

| Mode   | Komponen                                                                            | Sumber data dan operasi                                                                                               |
| ------ | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Client | [DataGridClient](../../apps/frontend/src/components/data-grid/data-grid-client.tsx) | Seluruh baris sudah tersedia di browser (data lokal/mock). Sort, filter, dan pagination berjalan pada data tersebut.  |
| Server | [DataGridServer](../../apps/frontend/src/components/data-grid/data-grid-server.tsx) | Halaman daftar REST. API melakukan search, sort, filter, dan pagination; grid hanya menampilkan halaman yang dikirim. |

Kedua komponen adalah Client Component. Untuk halaman App Router, ambil dan validasi data di Server Component/fitur, lalu teruskan data serializable ke komponen fitur `"use client"` yang mendefinisikan kolom dan merender grid. Jangan mengirim callback dari Server Component langsung sebagai prop Client Component. Letakkan UI halaman khusus fitur di `src/features/<fitur>/`; grid tetap global.

## Definisi kolom dan mode client

Definisikan kolom dengan TanStack Table v9 dan `DataGridFeatures`, lalu beri `getRowId` stabil. `accessorKey`/`id` harus sama dengan `toolbar.*.key` bila kontrol itu memfilter kolom. Untuk label biasa gunakan [DataGridHeader](../../apps/frontend/src/components/data-grid/data-grid-header.tsx); untuk judul yang dapat diurutkan gunakan [DataGridHeaderSort](../../apps/frontend/src/components/data-grid/data-grid-header-sort.tsx); untuk menu sort, visibility, pin, dan move gunakan [DataGridHeaderDropdown](../../apps/frontend/src/components/data-grid/data-grid-header-dropdown.tsx).

```tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataGridClient } from "@/components/data-grid/data-grid-client"
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features"
import { DataGridHeader } from "@/components/data-grid/data-grid-header"
import { DataGridHeaderSort } from "@/components/data-grid/data-grid-header-sort"

type Item = { id: string; name: string; status: string }

const columns: ColumnDef<DataGridFeatures, Item>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataGridHeaderSort column={column} title="Name" />,
  },
  { accessorKey: "status", header: () => <DataGridHeader title="Status" /> },
]

export function ItemsGrid({ items }: { items: Item[] }) {
  return (
    <DataGridClient
      columns={columns}
      data={items}
      getRowId={(row) => row.id}
      toolbar={{
        searches: [{ key: "name", placeholder: "Search name..." }],
        facets: [
          {
            key: "status",
            title: "Status",
            options: [{ label: "Active", value: "active" }],
          },
        ],
      }}
    />
  )
}
```

Mode client mendukung `pagination="advance" | "simple" | "none"` (bawaan `advance`), `defaultSorting`, `defaultColumnOrder`, `loading`, teks empty state, dan `actions`. `loading={true}` menampilkan skeleton serta menyembunyikan pagination selama pemuatan. `toolbar` opsional; visibility toggle tetap tersedia tanpa toolbar selama `showVisibilityToggle` tidak `false`. `facets` memakai pilihan multi/single dengan tombol Apply, sedangkan `selects` (komponen [SelectBox](../../apps/frontend/src/components/filters/select-box.tsx)) menerapkan satu pilihan segera. Pada mode client, grid mengaitkan facet/select ke filter `multiValue` untuk kolom yang id-nya cocok. Search client bersifat **per kolom**, bukan global lintas kolom.

Jika pemuatan data client gagal, teruskan pesan aman untuk pengguna melalui `error` bersama callback `onRetry`; `data` tetap boleh berupa array kosong. Saat `error` ada, grid menampilkan pesan dan tombol “Try again” sebagai pengganti baris serta menyembunyikan pagination. Callback dimiliki fitur, misalnya memanggil ulang fungsi pemuatan data:

```tsx
<DataGridClient
  columns={columns}
  data={[]}
  error="Data could not be loaded."
  onRetry={reloadItems}
/>
```

Gunakan pasangan `error`/`onRetry` hanya pada cabang gagal; pada cabang berhasil, jangan kirim keduanya. Jangan tampilkan detail exception, token, atau respons mentah API sebagai pesan error.

## Mode server dan kontrak REST

Teruskan `data` dan `meta` dari envelope daftar REST yang dikunci di PRD. `filters` berisi query aktif yang telah divalidasi di halaman/fitur. Komponen ini mengubah URL melalui Next Router; halaman bertanggung jawab membaca `searchParams`, memanggil API dengan query tersebut, dan mengirim hasil baru. Jangan memfilter hanya baris pada halaman saat ini.

```tsx
<DataGridServer
  columns={columns}
  data={result.data}
  meta={result.meta}
  filters={filters}
  getRowId={(row) => row.id}
  toolbar={{
    searches: [{ key: "search", placeholder: "Search..." }],
    selects: [
      {
        key: "status",
        placeholder: "Status",
        options: [{ label: "Active", value: "active" }],
        clearable: true,
      },
    ],
  }}
  defaults={{ pageSize: 20 }}
/>
```

Contoh query: `?page=2&pageSize=50&search=andi&sortBy=name&sortOrder=asc&status=active`. Facet multi-select menjadi parameter berulang, misalnya `status=active&status=pending`; schema API fitur harus menyepakati dan memvalidasi bentuk ini. Grid menghilangkan parameter yang sama dengan `defaults` dan `page=1`. `url` boleh diisi pathname internal lain; bila tidak, pathname saat ini dipakai. Navigasi filter/search/sort mengatur ulang halaman ke 1; input search di-debounce 300 ms. Perubahan URL masuk ke history sehingga Back/Forward mengembalikan filter yang dibaca ulang oleh halaman. Whitelist `sortBy` dan filter domain, batas `pageSize`, serta validasi Zod tetap tanggung jawab API—bukan komponen grid.

Untuk mode server, `pagination="none"` hanya menyembunyikan kontrol; gunakan jika endpoint memang mengirim semua baris yang ingin ditampilkan. Saat navigasi filter/sort/pagination sedang berlangsung, baris diganti skeleton dan pagination disembunyikan. Loading saat kunjungan awal sebelum grid terpasang tetap tanggung jawab halaman (`loading.tsx`/Suspense). `meta.totalPages` dan `meta.page` harus konsisten dengan hasil API. `defaults.pageSize` sebaiknya sama dengan default API (20). Pilihan ukuran bawaan di [constants.ts](../../apps/frontend/src/components/data-grid/constants.ts) adalah 20, 50, dan 100.

Jika permintaan server gagal, halaman/fitur mengirim `error` tanpa `data` dan `meta`; grid menampilkan tombol “Try again” yang memanggil `router.refresh()` dan menyembunyikan pagination. Contoh cabang setelah fetch tervalidasi:

```tsx
return result.ok ? (
  <DataGridServer
    columns={columns}
    data={result.data}
    meta={result.meta}
    filters={filters}
  />
) : (
  <DataGridServer
    columns={columns}
    error="Data could not be loaded."
    filters={filters}
  />
)
```

Komponen server ini tetap Client Component: bila `columns` berisi fungsi render, letakkan percabangan tersebut di komponen fitur client dan teruskan hasil serializable dari halaman Server Component. Error tidak boleh disamakan dengan empty state.

## Pin, tampilan, dan aksi

Pin statis tanpa kontrol unpin:

```tsx
<DataGridClient
  columns={columns}
  data={items}
  defaultColumnPinning={{ start: ["name"], end: [] }}
/>
```

Gunakan `enableColumnPinning` hanya bila pengguna boleh mengubah pin dari menu [DataGridHeaderDropdown](../../apps/frontend/src/components/data-grid/data-grid-header-dropdown.tsx). Dengan mode dinamis, menu pin/unpin dan ikon unpin pada header yang terpin memang muncul. `enableColumnOrdering` mengaktifkan move. `defaultColumnPinning` dan `defaultColumnOrder` hanya nilai awal, bukan state terkendali. Id pin harus sama dengan id kolom. Pinned column diukur dari lebar header yang dirender; pastikan header tetap ditampilkan. Posisi start/end memakai CSS logical inset untuk RTL.

`showVisibilityToggle` mengontrol tombol “View” di toolbar; `showHeaderVisibilityToggle` mengontrol submenu di header. `actions` menaruh tombol tambahan di sisi kanan toolbar. Komponen [FacetedFilter](../../apps/frontend/src/components/filters/faceted-filter.tsx) dan [SelectBox](../../apps/frontend/src/components/filters/select-box.tsx) boleh dipakai terpisah dari grid, tetapi folder `filters` bukan salinan komponen grid.

## Batasan saat ini dan verifikasi

- Search global lintas beberapa kolom belum tersedia di mode client; gunakan mode server dengan key `search` untuk pencarian global melalui API.
- Data Grid tidak menyediakan row selection, checkbox, atau bulk actions. `actions` adalah tombol aksi biasa di toolbar, bukan aksi berbasis baris terpilih.
- Grid mengikuti token tema dan pembungkus halaman [AppBody](../../apps/frontend/src/components/app-body.tsx); jangan mengunci warna/font tersendiri. Periksa light/dark, layout Centered, skala besar, serta scroll horizontal dan pinned column pada lebar kecil.
- Setelah perubahan, jalankan `pnpm --filter frontend check-types`, lint untuk file yang disentuh, dan tes relevan. Tes query server: `node --experimental-strip-types --test apps/frontend/tests/data-grid-query.test.mjs`. Proyek mensyaratkan Node.js 24+ untuk pemeriksaan resmi.
