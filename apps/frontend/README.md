# Frontend

Aplikasi Next.js ini berada di workspace `frontend`. Gunakan Node.js 24 atau lebih baru dan `pnpm` sesuai versi pada `package.json` root.

Dari root repositori, jalankan `pnpm install` lalu `pnpm dev`. Buka [http://localhost:3000](http://localhost:3000).

Rute dan layout aplikasi berada di `src/app/`; file `page.tsx` menjadi entry point yang merender UI dari `src/features/<fitur>/components/`. Simpan komponen lintas fitur di `src/components/`. Tailwind CSS dan shadcn/ui sudah dikonfigurasi; primitive UI berada di `src/components/ui/` dan pengaturannya di `components.json`. Untuk menambah komponen, jalankan `pnpm dlx shadcn@latest add <nama-komponen>` dari folder ini.

Spesifikasi produk Tahap 1 ada di [prd.md](./prd.md).
