# Panduan Preferences

Panduan ini berlaku saat membuat atau mengubah halaman frontend, dashboard shell, tema, dan fitur Preferences. Ikuti juga [panduan repositori](../../AGENTS.md) dan keputusan yang dikunci dalam [PRD Tahap 1](../../apps/frontend/prd.md). Perilaku di bawah mengikuti implementasi saat ini.

## Cara pemakaian

1. Buka dashboard, lalu pilih **Preferences** dari menu akun untuk membuka modal. Tombol Preferences di dashboard Finance membuka modal yang sama.
2. Pilih font, warna, layout, gaya sidebar, radius, atau skala. Perubahan langsung diterapkan tanpa tombol simpan.
3. Gunakan tombol ikon tema di header, tepat di kiri menu akun, untuk mengganti mode terang/gelap.
4. Klik **Restore Defaults** untuk mengembalikan seluruh pilihan dalam panel ke nilai bawaan. Mode terang/gelap tetap mengikuti pilihan sebelumnya.

| Pengaturan     | Pilihan                                                    | Bawaan     | Efek                                                                                                                               |
| -------------- | ---------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Fonts          | Geist, Inter, Nunito, Roboto, DM Sans, Poppins, Raleway    | Geist      | Mengubah font sans aplikasi.                                                                                                       |
| Primary Color  | Blue, Indigo, Violet, Emerald, Teal, Orange, Rose, Neutral | Blue       | Mengubah warna utama, teks pendamping, dan focus ring.                                                                             |
| Sidebar Color  | Semua warna utama, White, Gray                             | Neutral    | Mengubah latar sidebar dan warna teks yang terkait. White mengikuti mode terang/gelap.                                             |
| Header Color   | Semua warna utama, White, Gray                             | White      | Mengubah latar header dan kontras teks/kontrolnya. White mengikuti mode terang/gelap.                                              |
| App Body Color | Semua warna utama                                          | Neutral    | Mengubah seluruh latar shell dashboard pada semua gaya navigasi.                                                                   |
| Page Layout    | Centered, Full Width                                       | Full Width | Centered membatasi lebar `AppBody` sampai `75rem`; Full Width memakai ruang tersedia.                                              |
| Sidebar Style  | Sidebar, Inset, Floating, Header                           | Sidebar    | Mengubah varian navigasi. Header memakai menubar di bawah header pada desktop; drawer sidebar dan trigger tetap dipakai di mobile. |
| Border Radius  | None, Small, Medium, Large                                 | Medium     | Mengubah token radius dasar menjadi `0`, `0.375rem`, `0.625rem`, atau `1rem`.                                                      |
| Scale          | Small, Medium, Large                                       | Medium     | Mengubah ukuran font root menjadi `87.5%`, `100%`, atau `112.5%`, sehingga ukuran berbasis `rem` ikut berubah.                     |

Warna utama, sidebar, header, dan app body dapat dipilih secara independen. Warna chart tidak ikut diubah. Latar shell dashboard pada mode terang memakai shade 50 dengan alpha 60%; mode gelap memakai shade 950. Transparansi hanya berlaku pada latar, bukan isi konten. `AppBody` transparan agar warna pada shell tidak tertumpuk. Pada gaya Inset, latar di belakang sidebar mengikuti Sidebar Color. Pada gaya Floating, latar di belakang sidebar dan header memakai warna visual app body yang sama; pembungkus sticky header menutup konten yang bergulir di celah atas. Permukaan header tetap memakai Header Color, dengan radius dan bayangan seperti sidebar.

Pada gaya Header, sidebar dan trigger tidak ditampilkan di desktop. Menubar navigasi yang ringkas berada pada baris kedua di bawah header: putih dengan teks gelap pada mode terang, memakai warna Card dan teks terang pada mode gelap, terlepas dari Header Color. Border header sidebar, header gaya Header, dan menubar mengikuti warna garis Card. Search menu berada di header di kiri tombol ikon tema dan menu akun. Di mobile, baris menubar disembunyikan; trigger di kiri logo dan nama aplikasi membuka drawer sidebar yang sama, dan Search menu tersedia sebagai ikon di header. Menu akun menyediakan aksi untuk membuka modal Preferences; tombol ikon tema berada tepat di kirinya.

Mode tema bawaan adalah `light`. Model data mendukung `system` dan mengikuti perubahan tema sistem operasi, tetapi tombol ikon tema saat ini hanya menawarkan perpindahan terang/gelap.

## Penyimpanan dan konfigurasi

Sumber acuan adalah [preferences-config.ts](../../apps/frontend/src/lib/preferences-config.ts):

- `PREFERENCE_OPTIONS`: pilihan yang valid untuk setiap pengaturan.
- `DEFAULT_THEME_MODE`: tema awal.
- `PREFERENCES_CONFIG.defaults`: nilai bawaan panel, tanpa `themeMode`.
- `PREFERENCES_CONFIG.showPreferences`: saat ini `true`. Jika `false`, item/panel Preferences disembunyikan; provider, tampilan bawaan, dan toggle tema tetap bekerja.
- `PREFERENCES_CONFIG.persistToCookie`: saat ini `false`. Mengatur penyimpanan pilihan nonwarna selain tema seperti tabel berikut.

| Pengaturan                                                 | Penyimpanan                                                                                                                     | Perilaku saat reload                                                                             |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Tema                                                       | Selalu mencoba menyimpan cookie `app_theme`, terlepas dari `persistToCookie`.                                                   | Memakai cookie yang valid atau tema bawaan.                                                      |
| Font, layout, gaya sidebar, radius, scale                  | Hanya disimpan/dibaca jika `persistToCookie: true`, melalui `app_font`, `app_layout`, `app_sidebar`, `app_radius`, `app_scale`. | Saat flag `false`, kembali ke nilai bawaan. Saat `true`, memakai cookie valid atau nilai bawaan. |
| Primary Color, Sidebar Color, Header Color, App Body Color | Tidak pernah disimpan/dibaca dari cookie, termasuk saat flag `true`.                                                            | Selalu kembali ke nilai bawaan.                                                                  |

Perubahan tetap tersedia selama provider root masih terpasang, termasuk navigasi client biasa. Penyimpanan memakai browser pengguna, tanpa API, database, atau sinkronisasi akun. Cookie berlaku satu tahun, dengan `Path=/`, `SameSite=Lax`, dan `Secure` pada HTTPS. Jika penyimpanan browser diblokir, pilihan saat ini tetap diterapkan, tetapi tidak dapat diandalkan setelah reload.

Nilai yang tidak valid atau cookie rusak kembali ke nilai bawaan per pengaturan. Boot script memigrasikan nilai `localStorage.theme` lama (`light`/`dark`) ke cookie jika belum ada `app_theme`; jangan menambahkan penyimpanan baru di localStorage.

## Aturan integrasi untuk agent

### Halaman dan komponen

1. Gunakan [AppBody](../../apps/frontend/src/components/app-body.tsx) sebagai pembungkus konten halaman dashboard agar Page Layout dan App Body Color bekerja. Jangan menumpuk beberapa `AppBody` untuk halaman yang sama.
2. Gunakan token dari [globals.css](../../apps/frontend/src/app/globals.css): `bg-background text-foreground`, `bg-card text-card-foreground`, `bg-primary text-primary-foreground`, `border-border`, dan `ring-ring`. Untuk teks/link berwarna utama di atas permukaan biasa, gunakan `text-primary-text` agar mengikuti palet teks yang disesuaikan untuk mode terang/gelap.
3. Gunakan font global, kelas radius berbasis token seperti `rounded-lg`, serta ukuran berbasis `rem`/utility Tailwind agar Font, Border Radius, dan Scale bekerja. Hindari mengunci font, warna tema, atau radius secara lokal. Warna semantik khusus fitur tetap boleh digunakan sesuai kebutuhan.
4. Jangan memberi `opacity-60` pada pembungkus konten untuk meniru App Body Color karena teks dan anak komponen akan ikut transparan.
5. Pertahankan perilaku responsif dan kontras pada kedua mode tema, termasuk skala Large dan layout Centered.

Contoh pembungkus halaman:

```tsx
import { AppBody } from "@/components/app-body";

export function ExamplePage() {
  return (
    <AppBody>
      <section className="rounded-lg border border-border bg-card p-4 text-card-foreground">
        Konten halaman
      </section>
    </AppBody>
  );
}
```

### Membaca atau mengubah nilai

Gunakan [usePreferences](../../apps/frontend/src/providers/preferences-provider.tsx) di Client Component hanya ketika logika React membutuhkan nilai pengaturan. Styling biasa cukup mengikuti token CSS. Provider root sudah dipasang oleh [layout.tsx](../../apps/frontend/src/app/layout.tsx); jangan membuat provider atau state Preferences kedua di fitur.

API hook menyediakan:

```tsx
const { values, setPreference, resetPreferences } = usePreferences();

// Jalankan perubahan dari event handler, bukan saat render.
setPreference("contentLayout", "centered");
setPreference("themeMode", "dark");
resetPreferences(); // Mengembalikan default panel; tema tetap.
```

Gunakan `values` untuk membaca pilihan aktif dan `setPreference` untuk mengubahnya. Untuk nilai dari sumber eksternal, validasi dengan `parsePreference`. Jangan menulis atribut HTML, CSS variable, cookie, atau tema langsung dari komponen fitur karena provider menyelaraskan semua bagian tersebut.

Saat menambah pilihan baru, perbarui opsi/tipe/default dan validasi di konfigurasi, kontrol panel, pemetaan provider atau CSS bila diperlukan, serta inisialisasi server/boot script. Tetapkan aturan penyimpanan secara eksplisit dan perbarui pengujian serta panduan ini. Jangan mengubah kebijakan reset atau persistensi tanpa kebutuhan yang diminta pengguna.

## Peta implementasi

| File                                                                                                                                                        | Tanggung jawab                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [preferences-config.ts](../../apps/frontend/src/lib/preferences-config.ts)                                                                                  | Opsi, default, palet, validasi, pembacaan/pembuatan cookie, dan boot script.                                                        |
| [preferences-provider.tsx](../../apps/frontend/src/providers/preferences-provider.tsx)                                                                      | State React, hook, perubahan atribut HTML/CSS variable, sinkronisasi tema, cookie, dan reset.                                       |
| [preferences.tsx](../../apps/frontend/src/components/preferences.tsx)                                                                                       | Kontrol Preferences bersama dan modal untuk menu akun serta dashboard Finance.                                                      |
| [nav-user.tsx](../../apps/frontend/src/components/nav-user.tsx)                                                                                             | Menu akun dengan aksi modal Preferences.                                                                                            |
| [app-sidebar-header.tsx](../../apps/frontend/src/components/app-sidebar-header.tsx)                                                                         | Header untuk gaya sidebar serta kontrol bersama Search, tombol ikon tema, dan menu akun.                                            |
| [app-header.tsx](../../apps/frontend/src/components/app-header.tsx) dan [app-header-menubar.tsx](../../apps/frontend/src/components/app-header-menubar.tsx) | Header untuk gaya Header dan menubar navigasi desktop.                                                                              |
| [layout.tsx](../../apps/frontend/src/app/layout.tsx)                                                                                                        | Membaca cookie di server, memuat font, menyiapkan atribut/style awal, menjalankan boot script sebelum paint, dan memasang provider. |
| [app-sidebar.tsx](../../apps/frontend/src/components/app-sidebar.tsx)                                                                                       | Memakai nilai `sidebarStyle` untuk varian sidebar.                                                                                  |
| [app-body.tsx](../../apps/frontend/src/components/app-body.tsx) dan [globals.css](../../apps/frontend/src/app/globals.css)                                  | Pembungkus konten dan penerapan token font, layout, warna, radius, serta skala.                                                     |

## Verifikasi saat mengubah implementasi

- Cek perubahan langsung, navigasi antarhalaman, dan reload sesuai aturan penyimpanan.
- Cek tema terang/gelap, font, keempat warna, Centered/Full Width, varian sidebar, radius None/Large, dan skala Small/Large pada desktop dan mobile. Saat Inset, cek latar belakang sidebar mengikuti Sidebar Color. Saat Floating, cek latar belakang sidebar/header mengikuti App Body Color dan sudut header mengikuti radius sidebar.
- Pastikan Restore Defaults mengembalikan default panel tanpa mengubah tema.
- Jika mengubah persistensi, cek kedua nilai `persistToCookie`, cookie tidak valid, serta penyimpanan browser yang diblokir. Keempat warna tetap tidak dipersistensikan.
- Saat perilaku terkait berubah, ulangi pemeriksaan Preferences dan kontras secara manual.

Jalankan pemeriksaan relevan dari root repositori dengan Node.js 24 atau lebih baru:

```sh
pnpm --filter frontend check-types
```

Untuk perubahan dokumentasi saja, cukup periksa format Markdown, tautan relatif, dan kesesuaian isi dengan kode yang dirujuk. Laporkan pemeriksaan yang benar-benar dijalankan.
