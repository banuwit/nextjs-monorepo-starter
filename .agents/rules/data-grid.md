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

## Drag & drop baris

Gunakan `DataGridClient` dengan `onRowReorder(activeId, overId)` dan `getRowId` yang stabil. Callback dimiliki fitur dan harus memperbarui array `data`; gunakan [reorderDataGridItems](../../apps/frontend/src/components/data-grid/data-grid-reordering.ts) untuk memindahkan record tanpa mengubah array asal. Sorting dinonaktifkan selama mode ini dan `defaultSorting` tidak boleh diberikan.

Tambahkan [DataGridRowDragHandle](../../apps/frontend/src/components/data-grid/data-grid-row-dnd.tsx) pada cell kolom khusus dengan label aksesibel, misalnya `Reorder ${row.original.name}`. Grid menyediakan konteks sortable dan mendukung pointer serta keyboard: Space untuk mengambil/melepas, panah atas/bawah untuk memindahkan, Escape untuk membatalkan. Gunakan header label biasa dan `pagination="none"` bila seluruh data perlu diurutkan; dengan pagination/filter, target drop hanya baris yang sedang terlihat.

Contoh lengkap ada di [RowUserTable](../../apps/frontend/src/features/table/drag-and-drop/row/components/row-user-table.tsx). Urutannya disimpan di state lokal, dengan tombol Reset order; persistensi backend belum disediakan. `DataGridServer` belum mendukung DnD.

## Drag & drop kolom

Gunakan `DataGridClient` dengan `columnDrag={{ order, onOrderChange }}`. Fitur menyimpan urutan ID seluruh leaf column (termasuk kolom tersembunyi) dan dapat mengembalikannya dengan tombol reset. Gunakan [DataGridHeaderDrag](../../apps/frontend/src/components/data-grid/data-grid-header-drag.tsx) sebagai header berikon grip. Grid menyediakan konteks drag melalui [DataGridSortableColumnHead](../../apps/frontend/src/components/data-grid/data-grid-column-dnd.tsx); header sort/dropdown tidak digabungkan dengan handle ini. Space mengambil/melepas kolom, panah kiri/kanan menggeser, dan Escape membatalkan. Header dan seluruh cell berbagi transform serta transisi 220 ms melalui CSS variables di tabel, sehingga kolom tetangga ikut bergeser saat drag. Preferensi reduced motion menonaktifkan transisi. Setelah drop, urutan kolom diperbarui; urutan record tidak berubah.

DnD kolom mendukung header satu tingkat dan kolom yang tidak dipin; grouped header dan pinned column tetap statis. Contoh [ColumnUserTable](../../apps/frontend/src/features/table/drag-and-drop/column/components/column-user-table.tsx) memakai mock user yang sama dengan state urutan lokal, tanpa persistensi backend. `DataGridServer` belum mendukung DnD kolom.

## Inline editing

Grid tidak perlu disalin atau diubah untuk inline editing. Render [DataGridEditableCell](../../apps/frontend/src/components/data-grid/data-grid-editable-cell.tsx) di definisi `cell` dan gunakan header label biasa. Editor menerima `value`, `onChange`, `label`, `type` (text/email/date), pilihan `options`, pesan `error`, dan penanda `dirty`. Klik/Enter membuka editor, Enter atau blur menyelesaikan edit sel, dan Escape mengembalikan nilai saat editor dibuka. Perubahan diteruskan ke draft fitur pada setiap input; ini belum berarti data disimpan.

Fitur memiliki draft, snapshot terakhir yang disimpan, schema validasi, serta aksi Save/Discard. Definisi kolom dan fungsi render cell harus stabil agar input tidak remount saat mengetik; gunakan context untuk state editor yang berubah. Gunakan key revisi pada editor untuk menutup sesi edit setelah Save/Discard. Contoh [InlineUserTable](../../apps/frontend/src/features/table/editable/inline/components/inline-user-table.tsx) memakai mock user yang sama, validasi Zod dan email unik, serta konfirmasi Discard. No dan User ID tetap read-only. Save hanya menyimpan snapshot dalam state lokal; reload memulihkan mock awal.

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

## Edit per baris

Contoh `/table/editable/row` memakai [RowUserTable](../../apps/frontend/src/features/table/editable/row/components/row-user-table.tsx), `DataGridClient`, header label, dan kolom Actions yang terpin di kanan. [DataGridRowEditActions](../../apps/frontend/src/components/data-grid/data-grid-row-editable-actions.tsx) hanya merender tombol Edit, Duplicate, Delete, Save, dan Cancel; state dan validasi tetap di fitur.

Satu baris aktif mengunci aksi baris lain. Duplicate menambahkan draft di sebelah sumber dengan ID baru dan email kosong; Cancel menghapus draft yang belum disimpan. Save memvalidasi data dan keunikan email, sedangkan Delete memerlukan konfirmasi. [Logika user editing](../../apps/frontend/src/features/table/editable/user-editing.ts) dipakai bersama contoh inline. Perubahan hanya disimpan di state lokal dan kembali ke mock saat reload.

## Edit per sel

Contoh `/table/editable/cell` memakai [CellUserTable](../../apps/frontend/src/features/table/editable/cell/components/cell-user-table.tsx) dengan interaksi spreadsheet yang mengacu pada ReUI `data-grid-editing-6`, enam kolom editable, serta No dan User ID read-only. Kolom tetap mengikuti model user. DataGridVisibilityToggle berlabel View berada di kiri Settings; No dan User ID selalu terlihat. [DataGridCellEditing dan DataGridCellEditor](../../apps/frontend/src/components/data-grid/data-grid-cell-editing.tsx) menyediakan pemilihan rentang, keyboard, editor bertipe, clipboard TSV, dan drag-fill. `tableProps`, `getHeaderProps`, dan `getCellProps` pada `DataGridClient` menambahkan atribut/handler tanpa menggandakan rendering tabel; class dan style pinning tetap dipertahankan.

Saat pertama dimuat atau hasil filter berubah, tidak ada sel terpilih, jumlah seleksi nol, dan handle fill tersembunyi. Klik atau fokus keyboard memilih sel; double-click/Enter/F2/ketik membuka editor. Enter atau Tab menyimpan, blur memvalidasi, dan Escape membatalkan. Shift + panah atau drag memilih rentang. Ctrl/⌘ C/V menyalin/menempel rentang; satu nilai paste mengisi seluruh pilihan. Fill down atau Ctrl/⌘ D mengisi dari baris pertama pilihan. Drag handle mengulang pola rentang sumber. Paste yang melewati batas tabel ditolak. Validasi seluruh transaksi menolak perubahan parsial, email duplikat, dan nilai yang tidak valid.

Undo/Redo milik fitur (maksimal 100 transaksi), dengan Ctrl/⌘ Z, Ctrl/⌘ Shift Z, atau Ctrl Y; edit, paste, fill, create, duplicate, dan delete masuk ke riwayat yang sama. Input teks yang sedang diketik memakai undo native. Home/End, Ctrl/⌘ + panah, Page Up/Down, dan Shift mendukung navigasi/pemilihan. Clipboard menangani TSV bertanda kutip, tab/newline di dalam nilai, dan pengulangan pola pada rentang yang ukurannya cocok. Cut/Clear tetap melewati validasi field wajib; transaksi invalid tidak menghapus data.

Tombol Filters menampilkan input di bawah setiap header data: teks untuk User ID/Name/Email, pilihan untuk Gender/Role/Status, tanggal untuk Join Date; tombol di bawah No menghapus semua filter. Kondisi digabungkan dengan AND, ditambah pencarian global user. Header memakai DataGridHeaderDropdown dengan Asc/Desc, Pin to left/right, Unpin, dan Move to left/right (separator antara Pin dan Move), tanpa huruf A–G. Sorting diterapkan pada array tampilan fitur yang sama dengan koordinat editor/clipboard. State kolom terkontrol melalui `columnState` pada DataGridClient; `renderToolbar` memberi akses table instance untuk menempatkan visibility-toggle. Koordinat editor mengikuti urutan visible start/center/end, dengan urutan pin berdasarkan array pinning. Edit, paste, dan fill tetap menargetkan User ID dan field yang benar setelah hide/move/pin. Move di region pinned memperbarui array pinning. Settings mengatur Comfortable/Compact (default Compact), Column lines, dan Row stripes. Lebar kolom tetap; tidak ada handle resize, opsi Resizable, atau Reset Columns. Reset View mengembalikan sorting, filter, visibility, urutan/pin kolom, dan tampilan (termasuk Compact) tanpa membatalkan edit data.

Menu klik kanan berisi Edit Cell, Copy, Paste, Clear, Mark Active, Open Details, Duplicate, Copy Row, dan Delete User. New User/duplicate/detail memakai form tervalidasi; delete memakai konfirmasi. Export menghasilkan TSV dari hasil filter. Sel berubah memakai kuning lembut. Editor menyatu dengan sel: sudut persegi tanpa border/ring atau gap tambahan. Dropdown enum memakai chevron dan daftar pilihan; status menampilkan badge berwarna dan penanda pilihan. Contoh memakai 36 mock user di viewport scroll dengan header sticky, tanpa persistensi server, custom field, atau virtualisasi. Tes: `node --experimental-strip-types --test apps/frontend/tests/user-cell-editing.test.mjs`.

## Batasan saat ini dan verifikasi

- Search global lintas beberapa kolom belum tersedia di mode client; gunakan mode server dengan key `search` untuk pencarian global melalui API.
- Data Grid tidak menyediakan row selection, checkbox, atau bulk actions. `actions` adalah tombol aksi biasa di toolbar, bukan aksi berbasis baris terpilih.
- Grid mengikuti token tema dan pembungkus halaman [AppBody](../../apps/frontend/src/components/app-body.tsx); jangan mengunci warna/font tersendiri. Periksa light/dark, layout Centered, skala besar, serta scroll horizontal dan pinned column pada lebar kecil.
- Setelah perubahan, jalankan `pnpm --filter frontend check-types`, lint untuk file yang disentuh, dan tes relevan. Tes query server: `node --experimental-strip-types --test apps/frontend/tests/data-grid-query.test.mjs`. Proyek mensyaratkan Node.js 24+ untuk pemeriksaan resmi.
