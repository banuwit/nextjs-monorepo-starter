# Panduan komponen Filter

Rules ini berlaku saat memakai atau mengubah komponen di [components/filter](../../../apps/frontend/src/components/filter/), memasang filter di toolbar Data Grid, atau membuat halaman dengan filter berbasis chip/builder. Ikuti juga [Panduan Data Grid](./data-grid.md), [Struktur folder](./structure-folder.md), dan [Panduan Preferences](./preferences.md). Contoh hidup ada di `/filter/base`, `/filter/advance`, dan `/filter/group`.

## Pilih komponen yang tepat

| Kebutuhan                                                               | Komponen                                              | Contoh            |
| ----------------------------------------------------------------------- | ----------------------------------------------------- | ----------------- |
| Pencarian teks bebas, di-debounce                                       | `SearchFilter`                                        | `/filter/base`    |
| Satu pilihan dari daftar pendek, tanpa pencarian (boleh dikelompokkan)  | `SelectFilter` (shadcn `Select`)                      | `/filter/base`    |
| Satu/multi pilihan dari daftar panjang dengan pencarian                 | `ComboboxFilter` (shadcn `Combobox`)                  | `/filter/base`    |
| Multi checkbox dengan tombol Apply/Reset (pilihan ditahan sampai Apply) | `FacetedFilter`                                       | `/filter/base`    |
| Bar chip field → kondisi → nilai, banyak tipe nilai, operator lengkap   | ReUI `Filters` + helper `components/filter/advanced/` | `/filter/advance` |
| Kondisi bertingkat dengan grup AND/OR yang bisa disusun ulang           | `FilterBuilder` + helper `components/filter/group/`   | `/filter/group`   |

Aturan praktis: halaman daftar REST sederhana memakai filter toolbar (empat komponen pertama) lewat `toolbar` Data Grid sehingga filter tersimpan di URL. Filter chip/builder dipakai saat pengguna perlu operator (`is not`, `between`, `is before`, …) atau kombinasi AND/OR; saat ini query-nya hidup di state halaman dan dikompilasi di client.

## Lokasi file

```text
src/components/filter/
├── types.ts                 # FilterOption, SelectOption, FilterSelectionVariant
├── search-filter.tsx        # SearchFilter
├── select-filter.tsx        # SelectFilter
├── combobox-filter.tsx      # ComboboxFilter (input/popup × single/multiple)
├── faceted-filter.tsx       # FacetedFilter
├── advanced/                # helper filter chip ReUI (/filter/advance)
│   ├── filter-query.ts      # matchesFilterNode, isFilterRuleIncomplete, FilterFieldReader
│   ├── date-editor.tsx      # createDateField
│   ├── slider-editor.tsx    # createSliderField
│   ├── choice-editors.tsx   # ToggleGroupEditor, RadioEditor, CheckboxListEditor, NativeSelectEditor, SwitchEditor, PickedLabels
│   ├── typed-editors.tsx    # createAmountEditor, TermListEditor, CodeEditor, DomainEditor
│   └── value-displays.tsx   # Tone, ToneDot, ToneBadge, BadgesOrStack, Face, NoFace, StackedFaces, initials
└── group/                   # builder bertingkat (/filter/group)
    ├── filter-builder.tsx   # FilterBuilder, COMPACT_OPERATOR_LABELS
    ├── filter-expression.tsx# FilterExpression, describeFilterQuery, collectFilterColumns
    └── term-reach.tsx       # withTermReach, createReachCounter, TermReach, PatternValue

src/components/reui/{filters,cascader}/   # vendor ReUI (lihat "Kode vendor ReUI")
src/components/data-grid/data-grid-toolbar-filters.tsx   # merender dropdowns/comboboxes di kedua mode grid
```

Komponen di `components/filter/` tidak boleh mengimpor `@/features/*`, `@/mocks/*`, atau endpoint. Skema field, palet warna, dan pembaca nilai baris milik fitur. Keputusan pengguna, 29 Oktober 2026: setiap halaman demo filter memiliki salinan kodenya sendiri di subfiturnya, bukan berbagi lewat induk `features/filter/`. `advance/` dan `group/` masing-masing berisi `components/{user-filter-fields,user-profile-grid}.tsx` dan `utils/{user-profile-filter,user-tones,join-month-options}.ts`; `base/` berisi `utils/{join-month-options,manager-options}.ts`. Perubahan pada salah satu salinan perlu diterapkan juga ke salinan lain bila perilakunya harus sama. Pengecualian ini hanya untuk contoh `/filter/*`.

## Tipe opsi

Ada dua tipe `FilterOption` yang berbeda; jangan tertukar.

| Tipe                                                             | Dipakai oleh                                                                           | `icon`                                      |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------- |
| `FilterOption` / `SelectOption` dari `@/components/filter/types` | `SearchFilter`, `SelectFilter`, `ComboboxFilter`, `FacetedFilter`, `toolbar` Data Grid | Komponen (`LucideIcon`), bukan elemen       |
| `FilterOption` dari `@/components/reui/filters/filters-types`    | Field ReUI `Filters`/`FilterBuilder`                                                   | `ReactNode` (`<Face … />`, `<ToneDot … />`) |

`SelectOption` memperluas `FilterOption` dengan banyak field opsional, tetapi tiap komponen hanya merender sebagian:

| Field `SelectOption`                | `SelectFilter`  | `ComboboxFilter` |
| ----------------------------------- | --------------- | ---------------- |
| `label`, `value`                    | ya              | ya               |
| `icon`                              | ya              | tidak            |
| `group`                             | ya (judul grup) | tidak            |
| `description`                       | tidak           | ya (baris kedua) |
| `keywords`                          | tidak           | ya (ikut dicari) |
| `disabled`                          | ya              | ya               |
| `color`, `emoji`, `avatar`, `badge` | tidak           | tidak            |

Jika butuh tampilan yang belum dirender, perluas komponennya di `components/filter/`, bukan membuat salinan di fitur.

## Filter toolbar Data Grid

Cara utama memakai empat komponen dasar adalah lewat prop `toolbar` milik `DataGridServer`/`DataGridClient`. Grid yang mengurus nilai terpasang, reset ke halaman 1, dan status "sedang difilter" untuk empty state.

```tsx
const toolbar: ToolbarConfig = {
  searches: [{ key: "search", placeholder: "Search ID, name, or email..." }],
  dropdowns: [
    {
      key: "role",
      placeholder: "Role",
      allLabel: "All roles",
      options: [{ label: "Admin", value: "admin" } /* … */],
    },
  ],
  comboboxes: [
    { key: "manager", placeholder: "Search manager...", options: managers },
    {
      key: "department",
      placeholder: "Department...",
      multiple: true,
      options: departments,
    },
    {
      key: "city",
      placeholder: "City",
      trigger: "popup",
      searchPlaceholder: "Search city...",
      options: cities,
    },
  ],
  facets: [{ key: "status", title: "Status", options: statuses }],
};
```

| Kunci        | Komponen                                                 | Nilai                                         | Kapan diterapkan                              |
| ------------ | -------------------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| `searches`   | `SearchFilter` (server) / `DataGridSearchInput` (client) | `string`                                      | Debounce 300 ms (server) / per ketik (client) |
| `dropdowns`  | `SelectFilter`                                           | satu nilai                                    | Langsung                                      |
| `comboboxes` | `ComboboxFilter`                                         | satu nilai, atau banyak bila `multiple`       | Langsung                                      |
| `facets`     | `FacetedFilter`                                          | banyak nilai (`variant: "single"` untuk satu) | Saat Apply                                    |

- **Mode server:** setiap `key` menjadi parameter URL. Banyak nilai ditulis sebagai parameter berulang (`?department=Engineering&department=Design`); satu nilai sebagai satu parameter. Halaman membaca `searchParams`, memvalidasi dengan Zod (whitelist nilai), lalu memfilter di API/mock. Lihat `getMockUsers` di `mocks/user.mock.ts`.
- **Mode client:** `key` harus sama dengan id kolom (`accessorKey`/`id`). Grid memasang filter `multiValue` untuk kunci `facets`, `dropdowns`, dan `comboboxes`.
- Urutan render di toolbar: `searches`, `facets`, lalu `dropdowns` dan `comboboxes`.

## Komponen dasar (dipakai lepas dari grid)

Semua komponen dasar adalah Client Component dan bisa dipakai di form, kartu, atau toolbar fitur sendiri.

### `SearchFilter`

| Prop            | Tipe                      | Bawaan        | Keterangan                                                                              |
| --------------- | ------------------------- | ------------- | --------------------------------------------------------------------------------------- |
| `onValueChange` | `(value: string) => void` | —             | Dipanggil setelah berhenti mengetik `debounceMs`, dan langsung saat tombol hapus diklik |
| `defaultValue`  | `string`                  | `""`          | Uncontrolled; untuk mereset dari luar, ganti `key`                                      |
| `debounceMs`    | `number`                  | `300`         |                                                                                         |
| `placeholder`   | `string`                  | `"Search..."` | Juga dipakai sebagai `aria-label`                                                       |
| `className`     | `string`                  | lebar `w-56`  |                                                                                         |

```tsx
<SearchFilter
  key={`search:${filters.search ?? ""}`}
  defaultValue={filters.search ?? ""}
  onValueChange={(value) => visit({ search: value, page: 1 })}
/>
```

### `SelectFilter`

Satu pilihan tanpa pencarian, di atas shadcn `Select`. Entri pertama ("All") menghapus filter.

| Prop                    | Tipe                              | Bawaan        | Keterangan                                                      |
| ----------------------- | --------------------------------- | ------------- | --------------------------------------------------------------- |
| `options`               | `SelectOption[]`                  | —             | Opsi dengan `group` sama tampil di bawah judul grup             |
| `value`                 | `string \| null`                  | —             | Controlled                                                      |
| `onValueChange`         | `(value: string \| null) => void` | —             | `null` saat memilih "All"                                       |
| `placeholder`           | `string`                          | `"Select..."` | Teks trigger saat kosong dan `aria-label`                       |
| `allLabel`              | `string`                          | `"All"`       |                                                                 |
| `contentClassName`      | `string`                          | —             | Popup di-scroll setelah melewati `18rem` atau sisa tinggi layar |
| `className`, `disabled` |                                   |               |                                                                 |

### `ComboboxFilter`

Pilihan dengan pencarian (label, value, `description`, `keywords`), di atas shadcn `Combobox`. Pilihan langsung diterapkan.

| Prop                    | Tipe                             | Bawaan                | Keterangan                                  |
| ----------------------- | -------------------------------- | --------------------- | ------------------------------------------- |
| `options`               | `SelectOption[]`                 | —                     |                                             |
| `multiple`              | `true \| false`                  | `false`               | Menentukan tipe `value`/`onValueChange`     |
| `value`                 | `string \| null` atau `string[]` | —                     | Controlled                                  |
| `onValueChange`         | sesuai `multiple`                | —                     |                                             |
| `trigger`               | `"input" \| "popup"`             | `"input"`             | Lihat tabel di bawah                        |
| `placeholder`           | `string`                         | `"Search..."`         | Teks input (input) atau teks tombol (popup) |
| `searchPlaceholder`     | `string`                         | `"Search..."`         | Hanya untuk `trigger="popup"`               |
| `emptyMessage`          | `string`                         | `"No results found."` |                                             |
| `className`, `disabled` |                                  |                       |                                             |

| `trigger` \ `multiple` | `false`                                                        | `true`                                                       |
| ---------------------- | -------------------------------------------------------------- | ------------------------------------------------------------ |
| `"input"`              | Kotak pencarian = trigger, tombol hapus                        | Chips yang bisa dihapus di dalam kotak pencarian             |
| `"popup"`              | Tombol berisi label terpilih; pencarian di popup, tombol Clear | Tombol berisi badge jumlah; pencarian di popup, tombol Clear |

### `FacetedFilter`

Popover multi/single pilihan dengan pencarian lokal, tombol Apply dan Reset. Dua mode kontrol:

- **Controlled:** `value` + `onValueChange` (ditulis saat Apply).
- **Apply mode:** `appliedValues` + `onApply` + `onClear`, untuk efek samping saat Apply (navigasi, request, reset halaman). Dipakai toolbar Data Grid.

Prop lain: `title`, `options: FilterOption[]`, `variant` (`"multi"` bawaan, `"single"` memakai indikator radio), `showHeader` (tombol All/Clear), `align`, `disabled`, `className`, `id`. Untuk opsi dari server tersedia `onOpenChange` (lazy load), `isLoading`, `isError`, `onLoadMore`/`hasMore`/`isFetchingMore` (infinite scroll), serta `searchValue`/`onSearchChange` (pencarian diserahkan ke pemanggil).

## Filter chip ReUI (`/filter/advance`)

Bar chip memakai ReUI `Filters` dari `@/components/reui/filters/filters`. Setiap chip adalah aturan `{ path, operator, value, negated }` di pohon `FilterQuery`.

```tsx
const [query, setQuery] = useState<FilterQuery>(seedQuery);
const fields = useMemo(() => createUserFilterFields(users), [users]);
const rows = useMemo(
  () => users.filter((user) => matchesFilterNode(user, query, readUserProfileField)),
  [users, query],
);

<Filters fields={fields} query={query} onQueryChange={setQuery} showClear />
<UserProfileGrid users={users} rows={rows} />
```

### Skema field (`FilterField`)

| Properti                       | Fungsi                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| `id`, `label`, `icon`          | Identitas field; `icon` berupa elemen                                                      |
| `type`                         | `text`, `number`, `range`, `select`, `multiselect`, `boolean` (menentukan operator bawaan) |
| `defaultOperator`              | Operator awal, mis. `is_any_of` agar `select` diedit sebagai checklist                     |
| `options`                      | Opsi statis; `exclusive: true` untuk baris "None" yang menghapus pilihan lain              |
| `loadOptions`, `resolveValues` | Opsi async berhalaman dan pemulihan label dari id (saved view)                             |
| `searchable`, `placeholder`    | `searchable: false` menyembunyikan kotak cari untuk daftar pendek                          |
| `pinSelected`, `sortSelected`  | Pilihan di atas daftar; urutan `"label"` untuk daftar tanpa urutan alami                   |
| `fields`, `count`, `keywords`  | Grup bertingkat (path `["organization", "city"]`), jumlah anak, sinonim pencarian          |
| `operators`                    | Daftar operator kustom (mis. hanya `is`/`is_not`)                                          |
| `editor`                       | Editor nilai kustom (`FilterEditorProps`)                                                  |
| `renderValue`, `valueText`     | Tampilan nilai di chip dan teks aksesibelnya                                               |
| `column`                       | Nama kolom penyimpanan, dipakai `FilterExpression`                                         |
| `className`                    | Lebar menu, mis. `"w-64"`                                                                  |

### Helper di `components/filter/advanced/`

| Helper                                                             | Pakai untuk                                                                                                                                                   |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createDateField({ id, label, defaultOperator, … })`               | Tanggal: frasa ("next friday", "3 days ago") atau kalender; rentang dua bulan dengan preset 7/30 hari. Nilai berupa `FilterDateValue` (relatif atau absolut). |
| `createSliderField({ type, defaultOperator, scale, empty, … })`    | Slider dua titik (`range`/`between`) atau satu titik (`number`/`gte`), dengan rail mini di chip                                                               |
| `ToggleGroupEditor`, `CheckboxListEditor`                          | `multiselect` yang tetap terbuka per klik                                                                                                                     |
| `RadioEditor`, `NativeSelectEditor`                                | `select` yang menutup setelah memilih; `description` opsi menjadi petunjuk radio                                                                              |
| `SwitchEditor`                                                     | `boolean`                                                                                                                                                     |
| `createAmountEditor({ prefix, suffix })`                           | Nominal dengan awalan/akhiran (mis. `Rp`, `/bln`); dua kotak untuk `between`                                                                                  |
| `TermListEditor`                                                   | Daftar istilah satu per baris (⌘/Ctrl + Enter)                                                                                                                |
| `CodeEditor`, `DomainEditor`                                       | Kode 6 karakter (commit saat penuh) dan domain tervalidasi                                                                                                    |
| `BadgesOrStack`, `ToneBadge`, `ToneDot`, `toneOptions`, `findTone` | Opsi berwarna; palet `Tone[]` (kelas Tailwind ditulis utuh) dipasok fitur                                                                                     |
| `StackedFaces`, `Face`, `NoFace`, `PickedLabels`                   | Tampilan chip untuk orang dan pilihan multi                                                                                                                   |
| `matchesFilterNode(row, query, reader)`                            | Mengompilasi pohon query menjadi predikat baris                                                                                                               |

Editor pilihan membaca baris dari `field.options`, jadi satu editor dapat dipakai banyak field.

### Mengompilasi query

- Fitur menulis `reader: FilterFieldReader<T> = (row, path) => unknown` yang memetakan path aturan ke nilai baris; nilai `multiselect` dikembalikan sebagai array, tanggal sebagai `yyyy-MM-dd`, opsi sebagai `value` opsi (slug).
- `matchesFilterNode` menangani seluruh katalog operator ReUI (teks, angka, range, select, multiselect, boolean), operator tanggal, `negated`, dan grup AND/OR bersarang. Perbandingan teks/opsi tidak peka huruf besar-kecil.
- Aturan yang belum lengkap (tanpa operator, nilai kosong, atau `[]`) cocok dengan semua baris (`isFilterRuleIncomplete`), kecuali `empty`/`not_empty`. Nilai `false` pada boolean tetap sah.
- Saat API tersedia, kompilasi pindah ke server: kirim `FilterQuery` (JSON) dan validasi ulang di API. Jangan memercayai query yang dipulihkan dari storage.

## Builder grup (`/filter/group`)

```tsx
const fields = useMemo(
  () => withTermReach(createUserFilterFields(users), createReachCounter(users, readUserProfileField), users.length),
  [users],
);

<FilterBuilder mode="popover" fields={fields} query={query} onQueryChange={setQuery} />
<FilterExpression query={query} fields={fields} />
```

| API                                       | Keterangan                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FilterBuilder`                           | ReUI `Filters` dengan `variant="advanced"` dan `reorderable`. `mode="popover"` (trigger + popover, path bertingkat dipendekkan, lebar kolom ringkas) atau `"inline"` (terbuka di halaman). `align` bawaan `"end"`. `compactOperators` (bawaan `true`) memakai `COMPACT_OPERATOR_LABELS` ("over", "at least", "under", "at most"). Prop `Filters` lain diteruskan. |
| `FilterExpression`, `describeFilterQuery` | Membaca pohon query sebagai ekspresi, mis. `status in ('active') AND (performance_score >= 60 OR department in ('engineering'))`. Nama kolom dari `column` (`collectFilterColumns`). Hanya teks tampilan, tidak di-escape; jangan dikirim sebagai SQL.                                                                                                            |
| `withTermReach(fields, counter, total)`   | Menambahkan `hits/total` setelah nilai setiap field (merah bila 0), tetap memakai `renderValue` milik field                                                                                                                                                                                                                                                       |
| `createReachCounter(rows, reader)`        | Menghitung baris yang cocok per aturan secara terpisah (mengabaikan `negated`). Hanya untuk data client; hapus saat baris datang dari server.                                                                                                                                                                                                                     |
| `TermReach`, `PatternValue`               | Bagian tampilan yang dipakai `withTermReach`                                                                                                                                                                                                                                                                                                                      |

### Bentuk query (Show query)

Tombol **Show query** di `/filter/group` menampilkan dua bentuk dari query yang sama. Contoh di bawah adalah query awal halaman tersebut. **JSON `FilterQuery`** adalah bentuk yang disimpan atau dikirim ke API:

```json
{
  "id": "root",
  "type": "group",
  "combinator": "and",
  "rules": [
    {
      "id": "seed-status",
      "type": "rule",
      "path": ["status"],
      "operator": "is_any_of",
      "value": ["active", "pending"]
    },
    {
      "id": "seed-group",
      "type": "group",
      "combinator": "or",
      "rules": [
        {
          "id": "seed-score",
          "type": "rule",
          "path": ["score"],
          "operator": "between",
          "value": [60, 100]
        },
        {
          "id": "seed-department",
          "type": "rule",
          "path": ["organization", "department"],
          "operator": "is_any_of",
          "value": ["engineering", "product"]
        }
      ]
    },
    {
      "id": "seed-two-factor",
      "type": "rule",
      "path": ["account", "twoFactor"],
      "operator": "is",
      "value": true
    }
  ]
}
```

**Ekspresi `FilterExpression`** hanya untuk dibaca manusia:

```text
status in ('active', 'pending') AND (performance_score between 60 and 100 OR department in ('engineering', 'product')) AND two_factor_enabled = true
```

Yang perlu diperhatikan saat membaca atau mengirim JSON ini:

- **Struktur.** Akar selalu `type: "group"` dengan `id: "root"`. `rules` berisi `type: "rule"` atau grup lain dengan `combinator` sendiri (`and`/`or`), tanpa batas kedalaman.
- **`path`.** Berisi id field dari akar skema; field di dalam grup menjadi `["organization", "department"]`. Ekspresi memakai `column` milik field, JSON tetap memakai `path`.
- **`value`.** Bentuknya mengikuti operator:
  - Operator daftar (`is_any_of`, `has_*`) memakai array.
  - `between` memakai pasangan `[min, max]`.
  - `is` bisa string, boolean, atau array berisi satu nilai.
  - `empty`/`not_empty` tidak membawa `value`.
  - Nilai opsi adalah `value` opsi (slug), bukan label.
- **Tanggal.** Disimpan sebagai token, bukan `Date`. Contoh: `{"relative":{"unit":"day","offset":-29}}` untuk "29 hari lalu" (dihitung ulang setiap dibaca) atau `{"date":"2025-06-01"}` untuk hari tertentu.
- **Negasi.** Negate menukar operator ke kebalikannya bila ada; bila tidak ada, aturan diberi `"negated": true`. Penerima query wajib membaca `negated`.
- **Aturan belum selesai.** Aturan dengan `operator` kosong atau `value` kosong bisa ikut terkirim saat pengguna masih mengedit. Abaikan aturan seperti itu, seperti yang dilakukan `isFilterRuleIncomplete`.
- **Kontrak API.** Saat API tersedia, JSON ini menjadi body request. Schema Zod di `packages/contracts` harus memvalidasi struktur, whitelist `path`/`operator`, dan bentuk `value` sebelum query diterjemahkan ke database. Jangan memakai teks ekspresi sebagai SQL.

## Kode vendor ReUI

- `src/components/reui/{filters,cascader}` dipasang dengan `pnpm dlx shadcn@latest add @reui/filters` dari `apps/frontend`; registry `@reui` terdaftar di `components.json`.
- Jangan biarkan CLI menimpa `src/components/ui/button.tsx`: file itu berisi token Preferences (`--app-primary-hover`, `text-primary-text`). Pasang tanpa `--overwrite` dan periksa diff `ui/` setelahnya.
- Perubahan lokal pada vendor hanya perbaikan tipe untuk `noUncheckedIndexedAccess` dan penghapusan dua komentar `eslint-disable` yang merujuk aturan yang tidak terpasang. Menjalankan ulang `shadcn add` dengan overwrite akan menghapusnya; ulangi perbaikan sampai `check-types` lolos.
- Aturan React Compiler (`react-hooks/set-state-in-effect`, `react-hooks/refs`, `react-hooks/exhaustive-deps`) dimatikan khusus `src/components/reui/**` di `eslint.config.js`. Jangan memperluas override ini ke kode aplikasi.
- Jangan memasang Data Grid ReUI; gunakan `DataGridClient`/`DataGridServer` global.

## Yang tidak boleh dilakukan

- Menyalin komponen filter, editor, atau kompiler query ke `features/*`; perluas komponen global.
- Membuat filter toolbar baru di fitur di luar `toolbar` Data Grid bila konfigurasi yang ada sudah cukup.
- Mengimpor `@/features/*` atau `@/mocks/*` dari `components/filter/`.
- Menyusun kelas warna Tailwind secara dinamis (`bg-${hue}-500`); tulis kelas utuh di palet `Tone[]`.
- Menyimpan query filter di localStorage sebagai sumber data, atau menganggap filter client sebagai otorisasi.

## Verifikasi

Setelah perubahan, jalankan `pnpm --filter frontend check-types` dan `pnpm --filter frontend lint` (warning menggagalkan), lalu periksa manual di `/filter/base`, `/filter/advance`, dan `/filter/group`: pilih/hapus nilai, keyboard (Enter, Escape, panah), popover dan chips, URL ikut berubah pada mode server, jumlah hasil, light/dark, skala Large, dan lebar mobile. Test runner belum dikonfigurasi.

## Batasan saat ini

- Query chip/builder hanya hidup di state halaman (hilang saat reload) dan dikompilasi di client; belum ada serialisasi ke URL atau endpoint.
- `SelectFilter` dan `ComboboxFilter` belum merender `color`, `emoji`, `avatar`, atau `badge` dari `SelectOption`.
- Beberapa teks bantuan editor (`TermListEditor`, `DomainEditor`) masih berbahasa Indonesia tanpa prop untuk mengubahnya.
